// Navegación principal: ids de pantalla + grupos del menú hamburguesa.

// ==========================================================================
// NAVEGACIÓN PRINCIPAL (MENÚ HAMBURGUESA)
// ==========================================================================
export type ScreenId =
  | "inicio"
  | "formulario"
  | "comunicaciones"
  | "finanzas"
  | "roles"
  | "personas"
  | "celulas"
  | "multimedia"
  | "pastoral"
  | "eventos"
  | "culto_vivo"
  | "censo_miembro"
  | "sacramentos"
  | "bitacora_pastoral"
  | "difusion_whatsapp"
  | "onboarding_setup"
  | "checkin_ninos"
  | "offline_sync"
  | "confirmacion_registro"
  | "biblia";
export const NAV_GROUPS: { title: string; links: { screen: ScreenId; label: string; icon: string }[] }[] = [  {
    title: "Principal",
    links: [{ screen: "inicio", label: "Inicio", icon: "church" }],
  },
  {
    title: "Comunidad",
    links: [
      { screen: "personas", label: "Hermanos", icon: "diversity_1" },
      { screen: "censo_miembro", label: "Ficha Censo", icon: "how_to_reg" },
      { screen: "celulas", label: "Células", icon: "groups_3" },
      { screen: "checkin_ninos", label: "Check-In Niños", icon: "child_care" },
    ],
  },
  {
    title: "Pastoral",
    links: [
      { screen: "pastoral", label: "Pastoral", icon: "volunteer_activism" },
      { screen: "biblia", label: "Biblia", icon: "auto_stories" },
      { screen: "bitacora_pastoral", label: "Bitácora", icon: "menu_book" },
      { screen: "sacramentos", label: "Sacramentos", icon: "water_drop" },
    ],
  },
  {
    title: "Culto y Eventos",
    links: [
      { screen: "culto_vivo", label: "Culto en Vivo", icon: "live_tv" },
      { screen: "eventos", label: "Eventos", icon: "calendar_month" },
      { screen: "multimedia", label: "Multimedia", icon: "podcasts" },
    ],
  },
  {
    title: "Comunicación",
    links: [
      { screen: "comunicaciones", label: "Comunicaciones", icon: "grid_view" },
      { screen: "difusion_whatsapp", label: "Difusión WA", icon: "send" },
    ],
  },
  {
    title: "Administración",
    links: [
      { screen: "finanzas", label: "Finanzas", icon: "account_balance_wallet" },
      { screen: "formulario", label: "Form. Diezmo", icon: "payments" },
      { screen: "roles", label: "Roles", icon: "admin_panel_settings" },
      { screen: "onboarding_setup", label: "Configuración", icon: "rocket_launch" },
    ],
  },
  {
    // Abajo del panel a propósito: pendientes de borrar (Confirmación es
    // pantalla de éxito y Sin Conexión es estado, no módulos).
    title: "Sistema",
    links: [
      { screen: "confirmacion_registro", label: "Confirmación", icon: "task_alt" },
      { screen: "offline_sync", label: "Sin Conexión", icon: "cloud_off" },
    ],
  },
];

// ==========================================================================
// RUTAS URL (react-router, Fase 2). Cada pantalla tiene URL propia en
// español: recargar no pierde la pantalla, el botón atrás funciona y los
// enlaces se pueden compartir. `basename` sale de Vite ("/" en dev,
// "/IglesiaOS/" en build de GitHub Pages); `public/404.html` + el script
// de `index.html` rescatan recargas y enlaces profundos en Pages.
// ==========================================================================
export const SCREEN_PATHS: Record<ScreenId, string> = {
  inicio: "/",
  formulario: "/consagracion",
  comunicaciones: "/comunicaciones",
  finanzas: "/finanzas",
  roles: "/roles",
  personas: "/hermanos",
  celulas: "/celulas",
  multimedia: "/multimedia",
  pastoral: "/pastoral",
  eventos: "/eventos",
  culto_vivo: "/culto-en-vivo",
  censo_miembro: "/censo",
  sacramentos: "/sacramentos",
  bitacora_pastoral: "/bitacora",
  difusion_whatsapp: "/difusion",
  onboarding_setup: "/configuracion",
  checkin_ninos: "/checkin-ninos",
  offline_sync: "/sin-conexion",
  confirmacion_registro: "/confirmacion",
  biblia: "/biblia",
};

const PATH_SCREENS: Record<string, ScreenId> = Object.fromEntries(
  Object.entries(SCREEN_PATHS).map(([screen, path]) => [path, screen as ScreenId])
);

/** basename del router desde Vite (sin slash final; "/" en dev). */
export const ROUTER_BASENAME =
  (import.meta.env.BASE_URL as string).replace(/\/$/, "") || "/";

/** Quita basename y slash final: "/IglesiaOS/finanzas/" -> "/finanzas". */
export function normalizePath(rawPathname: string): string {
  const base = ROUTER_BASENAME === "/" ? "" : ROUTER_BASENAME;
  const sinBase = base && rawPathname.startsWith(base)
    ? rawPathname.slice(base.length) || "/"
    : rawPathname;
  return sinBase.length > 1 ? sinBase.replace(/\/$/, "") : sinBase;
}

/** Pantalla para una URL, o null si no existe (App redirige a inicio). */
export function screenFromPath(rawPathname: string): ScreenId | null {
  return PATH_SCREENS[normalizePath(rawPathname)] ?? null;
}
