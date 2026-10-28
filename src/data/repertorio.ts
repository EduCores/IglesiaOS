// ==========================================================================
// Repertorio + ensayos — datos iniciales y tipos de UI de la pantalla
// Eventos (mismo formato que data/celulas.ts, data/miembros.ts).
// Con nube la lista se REEMPLAZA (mismo patrón piloto); sin nube, estos
// arrays son la pantalla tal cual era.
// ==========================================================================

/** Canción como la dibuja la pantalla (id string: soporta UUID de la BD). */
export interface CancionUI {
  id: string;
  numberTag: string;
  title: string;
  artist: string;
  key: string;
  bpm: number;
  timeSignature: string;
  comment: string;
  atmosphere: "calma" | "intima" | "contemporaneo" | "agradecimiento";
}

/** Ensayo como lo dibuja la pantalla (fecha desglosada). */
export interface EnsayoUI {
  id: string;
  dayName: string;
  dayNumber: number;
  title: string;
  time: string;
  location: string;
  locationIcon: string;
  confirmed: boolean;
}

export const CANCIONES_INICIALES: CancionUI[] = [
  {
    id: "1",
    numberTag: "01",
    title: "Worthy of It All",
    artist: "David Brymer • Versión Acústica",
    key: "Bb",
    bpm: 72,
    timeSignature: "4/4",
    comment: "Intro: Piano pad suave (4 compases)",
    atmosphere: "intima"
  },
  {
    id: "2",
    numberTag: "02",
    title: "King of Kings",
    artist: "Hillsong Worship • Arreglo Cuerdas",
    key: "D",
    bpm: 68,
    timeSignature: "4/4",
    comment: "Entrada de voces femeninas en Coro",
    atmosphere: "calma"
  },
  {
    id: "3",
    numberTag: "03",
    title: "Build My Life",
    artist: "Housefires • Comunión y Adoración",
    key: "G",
    bpm: 70,
    timeSignature: "4/4",
    comment: "Momento de oración reflexiva",
    atmosphere: "contemporaneo"
  },
  {
    id: "4",
    numberTag: "04",
    title: "Agnus Dei",
    artist: "Michael W. Smith • Oración Final",
    key: "A",
    bpm: 64,
    timeSignature: "4/4",
    comment: "Cierre congregacional a capella",
    atmosphere: "agradecimiento"
  }
];

// Ensayos demo: la etiqueta de día es estática (solo se ve sin nube);
// con nube sale de starts_at (día real del calendario).
export const ENSAYOS_INICIALES: EnsayoUI[] = [
  {
    id: "1",
    dayName: "Jue",
    dayNumber: 16,
    title: "Ensayo General",
    time: "19:00",
    location: "Santuario Principal",
    locationIcon: "church",
    confirmed: false
  },
  {
    id: "2",
    dayName: "Sáb",
    dayNumber: 18,
    title: "Ensayo Banda & Voces",
    time: "10:00",
    location: "Sala de Ensayos A",
    locationIcon: "mic",
    confirmed: false
  }
];
