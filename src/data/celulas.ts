// Células iniciales (fallback local): las usa CelulasScreen cuando no
// hay sesión en la nube. Con nube, la lista viene de `cells` (reemplazo).
export interface CelulaUI {
  id: number | string;
  name: string;
  zone: string;
  type: string;
  category: "norte" | "centro" | "sur" | "jovenes" | "matrimonios";
  leaders: string;
  timeAndPlace: string;
  icon: string;
  badgeBg: string;
  badgeText: string;
  capacity?: number;
  averageAttendance?: number;
  subDetail?: string;
  connectedCountText: string;
}

export const CELULAS_INICIALES: CelulaUI[] = [
    {
      id: 1,
      name: "Célula Gracia & Verdad",
      zone: "Zona Norte",
      type: "Familiar",
      category: "norte",
      leaders: "Carlos & Patricia Méndez",
      timeAndPlace: "Miércoles 20:00 hrs · Casa Flia. Rojas",
      icon: "church",
      badgeBg: "bg-[#bdeddd] text-[#214e43]",
      badgeText: "Zona Norte",
      capacity: 88,
      averageAttendance: 14,
      connectedCountText: "14 hermanos"
    },
    {
      id: 2,
      name: "Célula Semillas de Fe",
      zone: "Zona Campus",
      type: "Jóvenes Univ.",
      category: "jovenes",
      leaders: "Andrea Morales",
      timeAndPlace: "Jueves 19:30 hrs",
      subDetail: "Evangelio de Juan",
      icon: "school",
      badgeBg: "bg-[#bddefe] text-[#43627e]",
      badgeText: "Jóvenes Univ.",
      connectedCountText: "18 jóvenes conectados"
    },
    {
      id: 3,
      name: "Célula Matrimonios en Roca",
      zone: "Zona Oriente",
      type: "Matrimonios",
      category: "matrimonios",
      leaders: "Marcos & Elena Silva",
      timeAndPlace: "Viernes 20:30 hrs · Hogar Silva",
      icon: "favorite",
      badgeBg: "bg-[#ffd9de] text-[#663a42]",
      badgeText: "Matrimonios",
      connectedCountText: "8 parejas inscritas"
    }
];
