// ==========================================================================
// multimedia.ts — tipos de pantalla (CanalUI/ClipUI) + datos demo iniciales.
// Con sesión cloud los canales/clips salen de `media_channels`/`media_clips`
// (reemplazo); sin nube se usan estos datos demo de siempre.
// ==========================================================================

export interface CanalUI {
  id: number | string;
  name: string;
  description: string;
  icon: string;
  bgColor: string;
  iconColor: string;
  active: boolean;
}

export interface ClipUI {
  id: number | string;
  title: string;
  meta: string;
  badge: string;
  thumbnail: string;
  src: string;
}

export const CANALES_INICIALES: CanalUI[] = [
  {
    id: 1,
    name: "YouTube Live Oficial",
    description: "RTMP Principal · Canal Comunidad de Fe",
    icon: "smart_display",
    bgColor: "bg-[#ffd9de]",
    iconColor: "text-[#7f4e57]",
    active: true
  },
  {
    id: 2,
    name: "Facebook Watch Iglesia",
    description: "Página Oficial Verificada · Evento en Vivo",
    icon: "public",
    bgColor: "bg-[#cde5ff]",
    iconColor: "text-[#294964]",
    active: true
  },
  {
    id: 3,
    name: "Grabación Local en 4K",
    description: "Google Drive Backup · ProRes HQ",
    icon: "cloud_upload",
    bgColor: "bg-[#bdeddd]",
    iconColor: "text-[#214e43]",
    active: true
  }
];

export const CLIPS_INICIALES: ClipUI[] = [
  {
    id: 1,
    title: "Culto Dominical · Prédica Completa",
    meta: "Dom 27 Sep · 412 reproducciones",
    badge: "HD",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFidNdOOMK-Gc1IlEvVisENzHoO1-ixW45S5GfWQkW_zxYISoGnZIFSjLRpUncMXBHxm39TE7O7BLGp31I3AYuJ4pOmPeEKKz2Kb9snNgg4eyDhI864cehrbiTv5KYXpS5bmooWSPVIVzk7VxUbe4oOzvcj1z-GPoNEfUvZir-Bl4VbQPzNWtTwtWde95Pj2QnUeoaocAuY-bMyMMnBiKM5hKaS3uTljA6Md-suUsf7Xvm6x6myS-3",
    src: "https://www.youtube.com/watch?v=y5JOJx8l-gA"
  },
  {
    id: 2,
    title: "Set de Adoración · Cuán Grande es Dios",
    meta: "Dom 27 Sep · 268 reproducciones",
    badge: "4K",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXZQ04S41pr2PWBNCWCCtjbco4gMgLaRNTIT55jYfXjLfA-s8KATpoFYyhTwqpYs5UdkYFjVw7OYLn6TQpDlulgjVJ8vpqWhDcv37unHoA_gE7cUmiFPHMwPZLUMmkYunqQzlH0QPDwNX0jIfgQq8UoqbH4XsvcI7Ezmku9lZvUE5G8-vPtiMcPHkG1VrpPsfH-1jMTuoxFTfQ2i0-h1bGvlz79Hj1VRddlOdSAA1jXHSUoplKoXOm",
    src: "https://www.youtube.com/watch?v=6sRKYpgfS4I"
  },
  {
    id: 3,
    title: "Bautismos & Testimonios · Servicio Especial",
    meta: "Vie 18 Sep · 305 reproducciones",
    badge: "CLIP",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKuDV7C_6aZYyhi5tu2z1OQld66W9ew608SiUHa3NqIfobUM8rA2zg1aUrTDQ8M1I0dlr7KwtsSlxHrDjlju_ElTynZ8KOI6XMzwgagPKu21q__Hyhgimph3gdWwy7ykxaa_B1XRtaI6xn_h-zm-LSu1Il38Ym74SPPIv8MkZMA-Z-_XHdlsB-6RUvpcXOBDE93EFLAM8dpVEzrxAv27BVEgdxdWq6REqUpyoAUXzDlsc7ONsTYFtF",
    src: "https://www.youtube.com/watch?v=k6sY6-PLxko"
  }
];
