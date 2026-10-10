// Transacciones iniciales (fallback local): las usa FinanzasDashboardScreen
// cuando no hay sesión en la nube. Mismo contenido que antes, solo movido
// aquí para que la pantalla lea de una sola fuente (nube o local).
export interface TransaccionLocal {
  id: number;
  title: string;
  category: "ministerios" | "misiones" | "operaciones";
  amount: number;
  type: "plus" | "minus";
  date: string;
  badgeText: string;
  badgeColor: string;
  textColor: string;
  bgIconColor: string;
  icon: string;
}

export const TRANSACCIONES_INICIALES: TransaccionLocal[] = [
  { id: 1, title: "Diezmo Mensual Familia Silva", category: "ministerios", amount: 120000, type: "plus", date: "Ayer, 18:30", badgeText: "Diezmo", badgeColor: "bg-[#bdeddd] text-[#214e43]", textColor: "text-[#386458]", bgIconColor: "bg-[#bdeddd]/60", icon: "volunteer_activism" },
  { id: 2, title: "Ofrenda Misión Patagonia", category: "misiones", amount: 65000, type: "plus", date: "14 May, 10:15", badgeText: "Ofrenda", badgeColor: "bg-[#cde5ff] text-[#294964]", textColor: "text-[#42617d]", bgIconColor: "bg-[#cde5ff]/50", icon: "public" },
  { id: 3, title: "Servicios Básicos & Suministros", category: "operaciones", amount: 48500, type: "minus", date: "12 May, 09:40", badgeText: "Gasto", badgeColor: "bg-[#ffd9de] text-[#663a42]", textColor: "text-[#7f4e57]", bgIconColor: "bg-[#ffd9de]", icon: "water_drop" },
  { id: 4, title: "Retiro Espiritual de Jóvenes", category: "ministerios", amount: 85000, type: "plus", date: "10 May, 17:00", badgeText: "Ofrenda", badgeColor: "bg-[#bdeddd] text-[#214e43]", textColor: "text-[#386458]", bgIconColor: "bg-[#bdeddd]/60", icon: "diversity_1" },
  { id: 5, title: "Insumos de Aseo Mensual", category: "operaciones", amount: 45000, type: "minus", date: "Hoy, 10:20", badgeText: "Gasto", badgeColor: "bg-[#ffd9de] text-[#663a42]", textColor: "text-[#7f4e57]", bgIconColor: "bg-[#ffd9de]", icon: "cleaning_services" },
  { id: 6, title: "Víveres Cocina · Convivio", category: "operaciones", amount: 60000, type: "minus", date: "Ayer, 12:05", badgeText: "Gasto", badgeColor: "bg-[#ffd9de] text-[#663a42]", textColor: "text-[#7f4e57]", bgIconColor: "bg-[#ffd9de]", icon: "soup_kitchen" },
  { id: 7, title: "Mantención Puerta y Accesos", category: "operaciones", amount: 25000, type: "minus", date: "13 May, 16:40", badgeText: "Gasto", badgeColor: "bg-[#ffd9de] text-[#663a42]", textColor: "text-[#7f4e57]", bgIconColor: "bg-[#ffd9de]", icon: "door_open" }
];
