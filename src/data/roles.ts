// Roles iniciales compartidos: los usa RolesScreen como estado inicial y
// el modal de Acceso/Perfil (App.tsx) como opciones del selector de rol.
// Lista inicial compartida: la usa RolesScreen como estado inicial y el
// modal de Acceso/Perfil como opciones del selector de rol. Los roles
// creados con "Crear Nuevo Rol" viven solo en el estado de la pantalla.
export interface RolLocal {
  id: number;
  title: string;
  tag: string;
  type: "liderazgo" | "ministerios" | "apoyo";
  desc: string;
  badgeColor: string;
  checked: boolean;
  icon: string;
  bgIconColor: string;
  iconColor: string;
  detailText: string;
  members: number;
}
export const ROLES_INICIALES: RolLocal[] = [
  { id: 1, title: "Pastor Principal", tag: "Total", type: "liderazgo", desc: "Acceso completo", badgeColor: "bg-[#386458]/10 text-[#386458]", checked: true, icon: "church", bgIconColor: "bg-[#bdeddd]", iconColor: "text-[#386458]", detailText: "Todas las funciones activas", members: 2 },
  { id: 2, title: "Director Alabanza", tag: "Multimedia", type: "ministerios", desc: "Editor en Multimedia, Solo Lectura en Pastoral", badgeColor: "bg-[#cde5ff] text-[#294964]", checked: true, icon: "graphic_eq", bgIconColor: "bg-[#cde5ff]", iconColor: "text-[#42617d]", detailText: "Audio & Video • Eventos", members: 4 },
  { id: 3, title: "Tesorero", tag: "Finanzas", type: "liderazgo", desc: "Editor en Finanzas, Solo Lectura", badgeColor: "bg-[#ffd9de] text-[#663a42]", checked: true, icon: "payments", bgIconColor: "bg-[#ffd9de]", iconColor: "text-[#7f4e57]", detailText: "Ofrendas • Balances", members: 1 },
  { id: 4, title: "Líder de Célula", tag: "Grupos", type: "apoyo", desc: "Solo Lectura", badgeColor: "bg-slate-200 text-slate-700", checked: true, icon: "groups_3", bgIconColor: "bg-[#a1d0c1]/40", iconColor: "text-[#386458]", detailText: "Asistencia • Contacto", members: 12 },
  { id: 5, title: "Voluntario", tag: "Básico", type: "apoyo", desc: "Acceso limitado", badgeColor: "bg-[#daebf5] text-[#294964]", checked: false, icon: "volunteer_activism", bgIconColor: "bg-[#aacaea]/30", iconColor: "text-[#42617d]", detailText: "Turnos • Avisos", members: 28 },
  { id: 6, title: "Portero", tag: "Servicio", type: "apoyo", desc: "Control de acceso", badgeColor: "bg-slate-200 text-slate-700", checked: true, icon: "door_open", bgIconColor: "bg-[#e7f6ff]", iconColor: "text-[#42617d]", detailText: "Acceso • Puerta", members: 0 },
  { id: 7, title: "Ujieres", tag: "Servicio", type: "apoyo", desc: "Registra ofrendas · Orden y acomodo", badgeColor: "bg-[#386458]/10 text-[#386458]", checked: true, icon: "hail", bgIconColor: "bg-[#cde5ff]", iconColor: "text-[#42617d]", detailText: "Orden • Ofrendas", members: 0 },
  { id: 8, title: "Servicio de Aseo", tag: "Servicio", type: "apoyo", desc: "Solicita gastos · Limpieza del templo", badgeColor: "bg-slate-200 text-slate-700", checked: true, icon: "cleaning_services", bgIconColor: "bg-[#e7f6ff]", iconColor: "text-[#42617d]", detailText: "Limpieza • Insumos", members: 0 },
  { id: 9, title: "Cocina + Ayudantes", tag: "Servicio", type: "apoyo", desc: "Solicita gastos · Alimentación y convivios", badgeColor: "bg-slate-200 text-slate-700", checked: true, icon: "soup_kitchen", bgIconColor: "bg-[#ffd9de]", iconColor: "text-[#7f4e57]", detailText: "Cocina • Víveres", members: 0 },
  { id: 10, title: "Miembro", tag: "General", type: "apoyo", desc: "Navega con su cuenta · Sin cargo asignado", badgeColor: "bg-slate-200 text-slate-700", checked: true, icon: "person", bgIconColor: "bg-slate-100", iconColor: "text-slate-600", detailText: "Cuenta • Sin cargo", members: 0 },
  { id: 11, title: "Pastor 1", tag: "Pastoral", type: "liderazgo", desc: "Acceso pastoral · Sin gestión de roles", badgeColor: "bg-[#386458]/10 text-[#386458]", checked: true, icon: "supervisor_account", bgIconColor: "bg-[#bdeddd]", iconColor: "text-[#386458]", detailText: "Pastoral • Visitas", members: 0 },
  { id: 12, title: "Pastor 2", tag: "Pastoral", type: "liderazgo", desc: "Acceso pastoral · Sin gestión de roles", badgeColor: "bg-[#386458]/10 text-[#386458]", checked: true, icon: "diversity_1", bgIconColor: "bg-[#bdeddd]", iconColor: "text-[#386458]", detailText: "Pastoral • Visitas", members: 0 },
  { id: 13, title: "Sonido", tag: "Multimedia", type: "ministerios", desc: "Opera el sonido · Cultos y eventos", badgeColor: "bg-[#cde5ff] text-[#294964]", checked: true, icon: "speaker", bgIconColor: "bg-[#bddefe]", iconColor: "text-[#294964]", detailText: "Audio • En vivo", members: 0 },
  { id: 14, title: "Técnico Sonido", tag: "Multimedia", type: "ministerios", desc: "Mezcla y equipos · Apoyo técnico", badgeColor: "bg-[#cde5ff] text-[#294964]", checked: true, icon: "tune", bgIconColor: "bg-[#e7f6ff]", iconColor: "text-[#42617d]", detailText: "Técnica • Equipos", members: 0 },
  { id: 15, title: "Multimedia", tag: "Multimedia", type: "ministerios", desc: "Proyección y transmisión · Pantallas y streaming", badgeColor: "bg-[#cde5ff] text-[#294964]", checked: true, icon: "videocam", bgIconColor: "bg-[#cde5ff]", iconColor: "text-[#42617d]", detailText: "Video • Streaming", members: 0 },
  { id: 16, title: "Músicos", tag: "Alabanza", type: "ministerios", desc: "Banda tradicional de iglesia · Instrumentos", badgeColor: "bg-[#cde5ff] text-[#294964]", checked: true, icon: "music_note", bgIconColor: "bg-[#bdeddd]", iconColor: "text-[#386458]", detailText: "Banda • Instrumentos", members: 0 },
  { id: 17, title: "Voces", tag: "Alabanza", type: "ministerios", desc: "Voces y coro · Alabanza congregacional", badgeColor: "bg-[#cde5ff] text-[#294964]", checked: true, icon: "mic", bgIconColor: "bg-[#ffd9de]", iconColor: "text-[#7f4e57]", detailText: "Coro • Voces", members: 0 },
];
