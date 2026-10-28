// ==========================================================================
// onboarding.ts — tipos de pantalla + datos demo iniciales.
// Con sesión cloud los pilares salen de `onboarding_pillars` (reemplazo).
// ==========================================================================

export interface PilarUI {
  id: number | string;
  title: string;
  subtitle: string;
  icon: string;
  status: "prioritario" | "pendiente" | "completado";
  actionText: string;
}

export const PILARES_INICIALES: PilarUI[] = [
  { id: 1, title: "Directorio de Familias", subtitle: "Sube tu listado en XLSX para activar el censo fraternal dominical.", icon: "group_add", status: "prioritario", actionText: "Subir Lista" },
  { id: 2, title: "Células y Zonas Territoriales", subtitle: "Mapea tus grupos pequeños y sectores geográficos de comunión.", icon: "share_location", status: "pendiente", actionText: "Configurar Zonas" },
  { id: 3, title: "Cuentas y Fondos Financieros", subtitle: "Establece tus cuentas de diezmos, misiones y acción comunitaria.", icon: "account_balance_wallet", status: "pendiente", actionText: "Crear Cuentas" },
  { id: 4, title: "Primer Culto o Evento", subtitle: "Planifica el orden litúrgico de tu próximo culto de Alabanza.", icon: "calendar_month", status: "pendiente", actionText: "Crear Culto" },
];
