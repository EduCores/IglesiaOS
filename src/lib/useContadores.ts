// ==========================================================================
// useContadoresNube — contadores reales para Inicio y Directorio (Lote F).
// Usa `count` exacto con `head: true` (PostgREST cuenta en el servidor y no
// baja filas: perfecto para tarjetas de estadísticas).
// Sin sesión cloud devuelve { contadores: null } y las pantallas muestran
// sus números demo de siempre (reemplazo, igual que el resto de los hooks).
//
// Fuentes:
//   hermanos         → members (total)
//   nuevos30d        → members con created_at de los últimos 30 días
//   familias         → members is_family_head
//   nuevosCreyentes  → members spiritual_stage = 'Nuevo Creyente'
//   cultosHoy        → events kind='culto' entre 00:00 y 24:00 de hoy local
//   asistentes7d     → event_attendance con check-in de los últimos 7 días
//   enCelulas        → member_cells (filas total)
//   bautizadosAnio   → sacrament_records kind='bautismo' desde el 1 de enero
//
// Ojo con TZ: los rangos de fecha se calculan en el navegador con la hora
// local del usuario (Chile) y se envían como ISO UTC — PostgREST compara
// timestamptz contra esos límites, así que "hoy" es el hoy del usuario.
// ==========================================================================
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth";

export interface ContadoresUI {
  hermanos: number;
  nuevos30d: number;
  familias: number;
  nuevosCreyentes: number;
  cultosHoy: number;
  asistentes7d: number;
  enCelulas: number;
  bautizadosAnio: number;
}

export function useContadoresNube(): {
  sincronizado: boolean;
  contadores: ContadoresUI | null;
} {
  const nube = useAuth();
  const [contadores, setContadores] = useState<ContadoresUI | null>(null);

  useEffect(() => {
    if (!supabase || !nube.user) {
      setContadores(null);
      return;
    }
    let vivo = true;
    const db = supabase;

    // Cuenta con filtro (o sin él). `head: true` no trae filas.
    const contar = async (
      tabla: string,
      filtro?: (q: any) => any,
    ): Promise<number> => {
      let q = db.from(tabla).select("*", { count: "exact", head: true });
      if (filtro) q = filtro(q);
      const { count, error } = await q;
      if (error || typeof count !== "number") return 0;
      return count;
    };

    void (async () => {
      // Rangos de fecha en hora local del usuario.
      const hoy = new Date();
      const desdeHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      const hastaHoy = new Date(desdeHoy.getTime() + 24 * 3600 * 1000);
      const hace30d = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
      const hace7d = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
      const anioISO = `${hoy.getFullYear()}-01-01`;

      const [hermanos, nuevos30d, familias, nuevosCreyentes, cultosHoy, asistentes7d, enCelulas, bautizadosAnio] =
        await Promise.all([
          contar("members"),
          contar("members", (q) => q.gte("created_at", hace30d)),
          contar("members", (q) => q.eq("is_family_head", true)),
          contar("members", (q) => q.eq("spiritual_stage", "Nuevo Creyente")),
          contar("events", (q) =>
            q
              .eq("kind", "culto")
              .gte("starts_at", desdeHoy.toISOString())
              .lt("starts_at", hastaHoy.toISOString()),
          ),
          contar("event_attendance", (q) =>
            q.not("checked_in_at", "is", null).gte("checked_in_at", hace7d),
          ),
          contar("member_cells"),
          contar("sacrament_records", (q) =>
            q.eq("kind", "bautismo").gte("performed_at", anioISO),
          ),
        ]);

      if (!vivo) return;
      setContadores({
        hermanos,
        nuevos30d,
        familias,
        nuevosCreyentes,
        cultosHoy,
        asistentes7d,
        enCelulas,
        bautizadosAnio,
      });
    })();

    return () => {
      vivo = false;
    };
  }, [nube.user]);

  return { sincronizado: contadores !== null, contadores };
}
