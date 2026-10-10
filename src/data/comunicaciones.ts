// Historial inicial (fallback local): lo usa ComunicacionesScreen cuando
// no hay sesión en la nube. Con nube, el historial viene de `broadcasts`.
export interface ComunicacionUI {
  id?: number | string;
  title: string;
  channel: string;
  date: string;
  status: string;
  badgeColor: string;
  dotColor: string;
  bgIconColor: string;
  textColor: string;
  icon: string;
}

export const HISTORIAL_INICIAL: ComunicacionUI[] = [
    { title: "Vigilia de Oración de Primavera", channel: "WhatsApp • 1,420 contactos", date: "Ayer, 19:40", status: "Enviado", badgeColor: "bg-[#bdeddd] text-[#214e43]", dotColor: "bg-[#386458]", bgIconColor: "bg-[#bdeddd]/45", textColor: "text-[#386458]", icon: "mark_chat_read" },
    { title: "Devocional Semanal - Guía de Oración", channel: "Email • Segmento Devocional", date: "Mañana, 07:00", status: "Programado", badgeColor: "bg-[#cde5ff] text-[#294964]", dotColor: "bg-[#42617d]", bgIconColor: "bg-[#cde5ff]/60", textColor: "text-[#42617d]", icon: "upcoming" },
    { title: "Volumen 19: Devocional Semanal", channel: "Boletín • Edición imprimible", date: "Editado hace 2h", status: "Borrador", badgeColor: "bg-[#ffd9de] text-[#663a42]", dotColor: "bg-[#7f4e57]", bgIconColor: "bg-[#ffd9de]/80", textColor: "text-[#7f4e57]", icon: "draft" },
    { title: "Recordatorio: Campanas Matutinas", channel: "WhatsApp • Grupo General", date: "Lun 14, 06:15", status: "Enviado", badgeColor: "bg-[#bdeddd] text-[#214e43]", dotColor: "bg-[#386458]", bgIconColor: "bg-[#bdeddd]/45", textColor: "text-[#386458]", icon: "notifications_active" }
];
