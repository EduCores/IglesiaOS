// Miembros iniciales (fallback local): los usa DirectorioScreen cuando no
// hay sesión en la nube. Con nube, la lista viene de `members` y estos
// datos de ejemplo NO se muestran (fuente única de verdad, igual que Roles).
export interface MiembroUI {
  id: number | string;
  name: string;
  role: string;
  type: "familias" | "celulas" | "lideres" | "nuevos";
  tag: string;
  badgeColor: string;
  img: string;
  subtitle: string;
  metaIcon?: string;
  metaText?: string;
  metaRightText?: string;
  avatars?: string[];
  secondaryBadge?: string;
  secondaryBadgeIcon?: string;
  secondaryBadge2?: string;
  secondaryBadgeIcon2?: string;
  footerText?: string;
  footerIcon?: string;
  noteIcon?: string;
  noteText?: string;
  primaryBtnText: string;
  secondaryBtnIcon: string;
}

/** Avatar por defecto (el mismo que asigna el registro rápido). */
export const AVATAR_POR_DEFECTO =
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150";

export const MIEMBROS_INICIALES: MiembroUI[] = [
    {
      id: 1,
      name: "Familia González Morales",
      role: "4 integrantes • Célula Betania",
      type: "familias",
      tag: "En Comunión",
      badgeColor: "bg-[#bdeddd] text-[#214e43]",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAbsyvYjq0BXX-LVFXD2VYrUV7ixEfMqktxYsNIhlgqsuBy636d67QNLgKdjJSy_56xPIW_SzKCzU41-x1TV09DoMuT6rLHkUf_h-2nlcY3RTBqz0gsv4ZV5RQTuvVuD784DWU5qxWyvh3XbBSWFOaDVvEa94s7ijBUMVBXWWN7umJTbeqpE0v120vMYyo_LDqzRByIGcF8a4lucRnw0JAdXatD4Iv7dUTo0AxPphVGfmw4n61w9d0",
      subtitle: "Hospedadores de grupo semanal",
      metaIcon: "cottage",
      metaText: "Hospedadores de grupo semanal",
      metaRightText: "Jueves 7:30 PM",
      avatars: ["J", "M", "2+"],
      primaryBtnText: "WhatsApp",
      secondaryBtnIcon: "call"
    },
    {
      id: 2,
      name: "Esteban Valenzuela",
      role: "Joven Profesional • Alabanza",
      type: "lideres",
      tag: "Líder Adoración",
      badgeColor: "bg-[#cde5ff] text-[#294964]",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrt9qRK2lccAdATsKzPxgucnb3H12k1MDPWQ0iAYP51UfaLeulM9g2JEVb5uRnp5hKFbo6sYUHTFS1s8vggs5k4Lrc5DKXqgSjiIC8WW1syUPTHvAgn4qaO1FEIQa5M6732qefwoAV_mlcYukrr7DKklk_sw-T886J21lYKiy_FtTGsj65BsDtf2J78Ete235XEzmFzz4H4rKVnWYTFCiciG-2zoOcnjkv0ccPPNEpcxrgLmbdzcjR",
      subtitle: "",
      secondaryBadge: "Bautizado",
      secondaryBadgeIcon: "verified",
      secondaryBadge2: "Madurez: Nivel 3",
      secondaryBadgeIcon2: "military_tech",
      footerText: "Servicio: Domingo Mañana",
      primaryBtnText: "Contactar",
      secondaryBtnIcon: "call"
    },
    {
      id: 3,
      name: "Claudia Soto",
      role: "Nueva Creyente (hace 2 sem.)",
      type: "nuevos",
      tag: "Discipulado N1",
      badgeColor: "bg-[#cde5ff] text-[#294964]",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-1XHuES1EK_E6mrVnrCzXtN0SjpXVsKMS7MstJ47Dmco1KH_3l84ft8OBZ3UU1KVA6VoNL4Z_75phS04fvhzZK4nxzFDU18cdopyDAjGz6KXmWHk8QbyNyu1u28c6g5lx1iZ5dgePYtmPvXo5dKuxh_UZ3xoNkg9kT4lWR5U2wyNKeYQ_PKlrOgG3V28awQMQnvA8GFczRykZZ3sj4m0eoAkslSBN7Gt3GmADiPGHSF097mGPPUWI",
      subtitle: "",
      noteIcon: "volunteer_activism",
      noteText: "Acompañamiento pastoral: Pastora Andrea M.",
      footerText: "Próx. sesión: Sábado 10:00 AM",
      primaryBtnText: "Saludar",
      secondaryBtnIcon: "mail" // For custom email tracing
    },
    {
      id: 4,
      name: "Mateo & Sofía Silva",
      role: "Matrimonio Joven • 2 años",
      type: "celulas",
      tag: "Voluntarios",
      badgeColor: "bg-[#ffd9de] text-[#663a42]",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyrYO_3dBlJmzbarUSJbuZPo-QcjPhnL4TtvJJ8bigfA9WAfUpnpW0LiMkmErlU4cFcuc7EWxxyCdqSwVkUV06ZWBIJm7Q71Feps0WUSCioAVPh00QQLSeHR4_fAf9dSfqQ7SJairIa67j3armH7u6oYAbuPfH3i8N9iZlGtt5PqJSlCYvd3iOM34lkqoCcfdAdqM_QYpyG2CWwWG6LvOo9WudTUKT4sHu56TgiShlSKNZpzU95oqg",
      subtitle: "",
      noteIcon: "child_care",
      noteText: "Ministerio Infantil: Escuela Dominical (4-6 años)",
      footerIcon: "event_available",
      footerText: "Activos este mes",
      primaryBtnText: "Mensaje",
      secondaryBtnIcon: "more_vert"
    }
];
