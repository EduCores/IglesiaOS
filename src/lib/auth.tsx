// ==========================================================================
// Auth en la nube (Supabase) — Fase 3. ADITIVA: no reemplaza la sesión
// local (App.tsx), que sigue funcionando offline y sin configurar nada.
//
// Reglas:
// - Sin VITE_SUPABASE_* (`isSupabaseReady === false`): todo es no-op,
//   `lista === false`, y la UI no muestra nada de nube.
// - Con sesión en la nube: la insignia y la ficha usan nombre/rol de la BD.
// - Sin sesión en la nube: se usa la sesión local como siempre.
// - Cuentas nuevas nacen con rol "Miembro" (fail-closed): un Pastor con
//   `gestionar_roles` les asigna el rol real desde la pantalla Roles
//   (cuando Roles lea la BD, Fase 4) o con este SQL en el dashboard:
//     update public.profiles set rol_id =
//       (select id from public.roles where title = 'Pastor Principal')
//     where email = 'correo@ejemplo.com';
// ==========================================================================
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase, isSupabaseReady } from "./supabase";
import type { Perfil } from "./tipos";

interface AuthNube {
  /** Hay cliente configurado (muestra la UI de nube si true). */
  lista: boolean;
  cargando: boolean;
  user: User | null;
  perfil: Perfil | null;
  /** Título del rol (roles.title) o null si no tiene / no cargó. */
  rolTitulo: string | null;
  error: string | null;
  entrar: (email: string, password: string) => Promise<string | null>;
  crearCuenta: (nombre: string, email: string, password: string) => Promise<string | null>;
  salir: () => Promise<void>;
  limpiarError: () => void;
}

const Vacia: AuthNube = {
  lista: false,
  cargando: false,
  user: null,
  perfil: null,
  rolTitulo: null,
  error: null,
  entrar: async () => "Nube no configurada.",
  crearCuenta: async () => "Nube no configurada.",
  salir: async () => {},
  limpiarError: () => {},
};

const Ctx = createContext<AuthNube>(Vacia);

export function useAuth(): AuthNube {
  return useContext(Ctx);
}

function mensajeError(codeOrMsg: string): string {
  const m = codeOrMsg.toLowerCase();
  if (m.includes("invalid login credentials")) return "Correo o clave incorrectos.";
  if (m.includes("user already registered")) return "Ese correo ya tiene cuenta: usa Entrar.";
  if (m.includes("password")) return "La clave debe tener al menos 6 caracteres.";
  if (m.includes("email")) return "Revisa el correo ingresado.";
  return "No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [rolTitulo, setRolTitulo] = useState<string | null>(null);
  const [cargando, setCargando] = useState(isSupabaseReady);
  const [error, setError] = useState<string | null>(null);

  const cargarPerfil = useCallback(async (uid: string) => {
    if (!supabase) return;
    // Perfil propio (profiles_select lo permite) + título del rol.
    const { data, error: e } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone, rol_id, congregation, is_active, created_at, updated_at, roles ( title )")
      .eq("id", uid)
      .maybeSingle();
    if (e || !data) {
      // Sin fila (cuenta recién creada sin confirmar, o RLS): se intenta
      // crear abajo; por ahora queda sin perfil.
      setPerfil(null);
      setRolTitulo(null);
      return;
    }
    const d = data as unknown as Perfil & { roles: { title: string } | { title: string }[] | null };
    setPerfil(d);
    const rol = d.roles;
    setRolTitulo(Array.isArray(rol) ? rol[0]?.title ?? null : rol?.title ?? null);
  }, []);

  const asegurarPerfil = useCallback(
    async (u: User, nombreSugerido: string) => {
      if (!supabase) return;
      await cargarPerfil(u.id);
      // Si no hay fila (signup sin sesión previa o login antiguo), crearla
      // como Miembro. Requiere la policy profiles_insert_own (schema.sql).
      const { data } = await supabase.from("profiles").select("id").eq("id", u.id).maybeSingle();
      if (!data) {
        const { data: rol } = await supabase.from("roles").select("id").eq("title", "Miembro").maybeSingle();
        const nombre =
          nombreSugerido.trim() ||
          (u.email ? u.email.split("@")[0] : "Miembro");
        await supabase.from("profiles").insert({
          id: u.id,
          full_name: nombre,
          email: u.email ?? "",
          rol_id: (rol as { id: string } | null)?.id ?? null,
        });
        await cargarPerfil(u.id);
      }
    },
    [cargarPerfil]
  );

  useEffect(() => {
    if (!supabase) {
      setCargando(false);
      return;
    }
    let vivo = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!vivo) return;
      const u = data.session?.user ?? null;
      setUser(u);
      setCargando(false);
      if (u) void asegurarPerfil(u, "");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_ev, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) void asegurarPerfil(u, "");
      else {
        setPerfil(null);
        setRolTitulo(null);
      }
    });
    return () => {
      vivo = false;
      sub.subscription.unsubscribe();
    };
  }, [asegurarPerfil]);

  const entrar = useCallback(async (email: string, password: string) => {
    if (!supabase) return "Nube no configurada.";
    setError(null);
    const { error: e } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (e) {
      const msg = mensajeError(e.message);
      setError(msg);
      return msg;
    }
    return null;
  }, []);

  const crearCuenta = useCallback(
    async (nombre: string, email: string, password: string) => {
      if (!supabase) return "Nube no configurada.";
      setError(null);
      const { data, error: e } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (e) {
        const msg = mensajeError(e.message);
        setError(msg);
        return msg;
      }
      // Con confirmación por correo activada no hay sesión todavía.
      if (!data.session) {
        return "Cuenta creada. Revisa tu correo para confirmarla y luego entra.";
      }
      if (data.user) await asegurarPerfil(data.user, nombre);
      return null;
    },
    [asegurarPerfil]
  );

  const salir = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setPerfil(null);
    setRolTitulo(null);
  }, []);

  const limpiarError = useCallback(() => setError(null), []);

  if (!isSupabaseReady) {
    return <Ctx.Provider value={Vacia}>{children}</Ctx.Provider>;
  }
  return (
    <Ctx.Provider
      value={{ lista: true, cargando, user, perfil, rolTitulo, error, entrar, crearCuenta, salir, limpiarError }}
    >
      {children}
    </Ctx.Provider>
  );
}
