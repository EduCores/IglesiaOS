// ==========================================================================
// BIBLIA RV1909 vía Midvash (https://api.midvash.com) — sin key, CORS abierto.
// Reina-Valera 1909: dominio público (ver meta.copyright de cada respuesta).
// RVR1960 queda fuera a propósito: tiene copyright de Sociedades Bíblicas Unidas.
// ==========================================================================

export interface LibroBiblia {
  nombre: string;
  slug: string; // slug inglés (garantizado por la API)
  capitulos: number;
}

export const LIBROS_BIBLIA: LibroBiblia[] = [
  { nombre: "Génesis", slug: "genesis", capitulos: 50 },
  { nombre: "Éxodo", slug: "exodus", capitulos: 40 },
  { nombre: "Levítico", slug: "leviticus", capitulos: 27 },
  { nombre: "Números", slug: "numbers", capitulos: 36 },
  { nombre: "Deuteronomio", slug: "deuteronomy", capitulos: 34 },
  { nombre: "Josué", slug: "joshua", capitulos: 24 },
  { nombre: "Jueces", slug: "judges", capitulos: 21 },
  { nombre: "Rut", slug: "ruth", capitulos: 4 },
  { nombre: "1 Samuel", slug: "1-samuel", capitulos: 31 },
  { nombre: "2 Samuel", slug: "2-samuel", capitulos: 24 },
  { nombre: "1 Reyes", slug: "1-kings", capitulos: 22 },
  { nombre: "2 Reyes", slug: "2-kings", capitulos: 25 },
  { nombre: "1 Crónicas", slug: "1-chronicles", capitulos: 29 },
  { nombre: "2 Crónicas", slug: "2-chronicles", capitulos: 36 },
  { nombre: "Esdras", slug: "ezra", capitulos: 10 },
  { nombre: "Nehemías", slug: "nehemiah", capitulos: 13 },
  { nombre: "Ester", slug: "esther", capitulos: 10 },
  { nombre: "Job", slug: "job", capitulos: 42 },
  { nombre: "Salmos", slug: "psalms", capitulos: 150 },
  { nombre: "Proverbios", slug: "proverbs", capitulos: 31 },
  { nombre: "Eclesiastés", slug: "ecclesiastes", capitulos: 12 },
  { nombre: "Cantares", slug: "song-of-songs", capitulos: 8 },
  { nombre: "Isaías", slug: "isaiah", capitulos: 66 },
  { nombre: "Jeremías", slug: "jeremiah", capitulos: 52 },
  { nombre: "Lamentaciones", slug: "lamentations", capitulos: 5 },
  { nombre: "Ezequiel", slug: "ezekiel", capitulos: 48 },
  { nombre: "Daniel", slug: "daniel", capitulos: 12 },
  { nombre: "Oseas", slug: "hosea", capitulos: 14 },
  { nombre: "Joel", slug: "joel", capitulos: 3 },
  { nombre: "Amós", slug: "amos", capitulos: 9 },
  { nombre: "Abdías", slug: "obadiah", capitulos: 1 },
  { nombre: "Jonás", slug: "jonah", capitulos: 4 },
  { nombre: "Miqueas", slug: "micah", capitulos: 7 },
  { nombre: "Nahúm", slug: "nahum", capitulos: 3 },
  { nombre: "Habacuc", slug: "habakkuk", capitulos: 3 },
  { nombre: "Sofonías", slug: "zephaniah", capitulos: 3 },
  { nombre: "Hageo", slug: "haggai", capitulos: 2 },
  { nombre: "Zacarías", slug: "zechariah", capitulos: 14 },
  { nombre: "Malaquías", slug: "malachi", capitulos: 4 },
  { nombre: "Mateo", slug: "matthew", capitulos: 28 },
  { nombre: "Marcos", slug: "mark", capitulos: 16 },
  { nombre: "Lucas", slug: "luke", capitulos: 24 },
  { nombre: "Juan", slug: "john", capitulos: 21 },
  { nombre: "Hechos", slug: "acts", capitulos: 28 },
  { nombre: "Romanos", slug: "romans", capitulos: 16 },
  { nombre: "1 Corintios", slug: "1-corinthians", capitulos: 16 },
  { nombre: "2 Corintios", slug: "2-corinthians", capitulos: 13 },
  { nombre: "Gálatas", slug: "galatians", capitulos: 6 },
  { nombre: "Efesios", slug: "ephesians", capitulos: 6 },
  { nombre: "Filipenses", slug: "philippians", capitulos: 4 },
  { nombre: "Colosenses", slug: "colossians", capitulos: 4 },
  { nombre: "1 Tesalonicenses", slug: "1-thessalonians", capitulos: 5 },
  { nombre: "2 Tesalonicenses", slug: "2-thessalonians", capitulos: 3 },
  { nombre: "1 Timoteo", slug: "1-timothy", capitulos: 6 },
  { nombre: "2 Timoteo", slug: "2-timothy", capitulos: 4 },
  { nombre: "Tito", slug: "titus", capitulos: 3 },
  { nombre: "Filemón", slug: "philemon", capitulos: 1 },
  { nombre: "Hebreos", slug: "hebrews", capitulos: 13 },
  { nombre: "Santiago", slug: "james", capitulos: 5 },
  { nombre: "1 Pedro", slug: "1-peter", capitulos: 5 },
  { nombre: "2 Pedro", slug: "2-peter", capitulos: 3 },
  { nombre: "1 Juan", slug: "1-john", capitulos: 5 },
  { nombre: "2 Juan", slug: "2-john", capitulos: 1 },
  { nombre: "3 Juan", slug: "3-john", capitulos: 1 },
  { nombre: "Judas", slug: "jude", capitulos: 1 },
  { nombre: "Apocalipsis", slug: "revelation", capitulos: 22 },
];

const API_BASE = "https://api.midvash.com/v1";

// Versiones disponibles. RV1909: dominio público. RVG2010: uso libre sin
// fines de lucro, sin alterar palabras y con atribución (ver copyright).
export interface VersionBiblia {
  id: string;
  nombre: string;
  atribucion: string;
}

export const VERSIONES_BIBLIA: VersionBiblia[] = [
  { id: "rvg", nombre: "Gómez 2010", atribucion: "Reina-Valera Gómez 2010 · Uso libre sin fines de lucro" },
  { id: "rvr1909", nombre: "Reina-Valera 1909", atribucion: "Reina-Valera 1909 · Dominio público" },
];

const VERSION_KEY = "iglesiaos-biblia-version";

export function leerVersion(): string {
  try {
    const v = localStorage.getItem(VERSION_KEY);
    if (v && VERSIONES_BIBLIA.some((x) => x.id === v)) return v;
  } catch {
    /* almacenamiento no disponible */
  }
  return "rvg";
}

export function guardarVersion(id: string): void {
  try {
    localStorage.setItem(VERSION_KEY, id);
  } catch {
    /* almacenamiento no disponible: se sigue sin persistir */
  }
}

export function atribucionDe(version: string): string {
  return VERSIONES_BIBLIA.find((v) => v.id === version)?.atribucion ?? version;
}

// Corchetes: los [ ] marcan palabras agregadas por los traductores (no están
// en los manuscritos). Solo se ocultan los signos al mostrar; las palabras
// quedan intactas (la licencia RVG exige no cambiar palabras).
const CORCH_KEY = "iglesiaos-biblia-corchetes";

export function leerCorchetes(): boolean {
  try {
    return localStorage.getItem(CORCH_KEY) === "1";
  } catch {
    return false;
  }
}

export function guardarCorchetes(mostrar: boolean): void {
  try {
    localStorage.setItem(CORCH_KEY, mostrar ? "1" : "0");
  } catch {
    /* almacenamiento no disponible: se sigue sin persistir */
  }
}

export function sinCorchetes(texto: string): string {
  return texto.replace(/[\[\]]/g, "");
}

export interface CapituloBiblia {
  versiculos: string[];
  referencia: string;
}

export async function fetchCapitulo(slug: string, capitulo: number, version = "rvg"): Promise<CapituloBiblia> {
  const res = await fetch(`${API_BASE}/${version}/${slug}/${capitulo}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const versiculos: string[] = json?.data?.verses ?? [];
  if (!versiculos.length) throw new Error("empty");
  const data = json.data;
  const referencia = data?.meta?.reference ?? data?.reference ?? `${slug} ${capitulo}`;
  return { versiculos, referencia };
}

export interface VersiculoDia {
  referencia: string;
  texto: string;
}

const VOTD_KEY = "iglesiaos-biblia-votd";
const ULTIMO_KEY = "iglesiaos-biblia-ultimo";

function hoyISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function claveVotd(version: string): string {
  return `${VOTD_KEY}-${version}`;
}

function claveUltimo(version: string): string {
  return `${ULTIMO_KEY}-${version}`;
}

export function leerVotdCache(version = "rvg"): VersiculoDia | null {
  try {
    const raw = localStorage.getItem(claveVotd(version));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.fecha !== hoyISO() || !parsed?.texto) return null;
    return { referencia: parsed.referencia, texto: parsed.texto };
  } catch {
    return null;
  }
}

export async function fetchVersiculoDia(version = "rvg"): Promise<VersiculoDia> {
  const cached = leerVotdCache(version);
  if (cached) return cached;
  const res = await fetch(`https://api.midvash.com/v1/votd?language=es&version=${version}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (!json?.text) throw new Error("empty");
  const votd = { referencia: json.reference ?? "Versículo del día", texto: json.text };
  try {
    localStorage.setItem(claveVotd(version), JSON.stringify({ fecha: hoyISO(), ...votd }));
  } catch {
    /* almacenamiento no disponible: se sigue sin caché */
  }
  return votd;
}

export interface UltimaLectura {
  slug: string;
  capitulo: number;
}

export function leerUltimaLectura(version = "rvg"): UltimaLectura | null {
  try {
    const raw = localStorage.getItem(claveUltimo(version));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.slug || !parsed?.capitulo) return null;
    return { slug: parsed.slug, capitulo: parsed.capitulo };
  } catch {
    return null;
  }
}

export function guardarUltimaLectura(slug: string, capitulo: number, version = "rvg"): void {
  try {
    localStorage.setItem(claveUltimo(version), JSON.stringify({ slug, capitulo }));
  } catch {
    /* almacenamiento no disponible: se sigue sin caché */
  }
}

export function buscarLibro(slug: string): LibroBiblia | undefined {
  return LIBROS_BIBLIA.find((l) => l.slug === slug);
}

function normalizarNombre(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Resuelve "2 Timoteo 3:16-17" → { libro, capitulo }. Null si no matchea.
export function resolverLibroPorReferencia(
  referencia: string
): { libro: LibroBiblia; capitulo: number } | null {
  const m = referencia.match(/^(.+?)\s+(\d+)(?::\d+)?(?:\s*[-–].*)?$/) ?? referencia.match(/^(.+?)\s+(\d+)$/);
  if (!m) return null;
  const nombre = normalizarNombre(m[1].trim());
  const libro = LIBROS_BIBLIA.find((l) => normalizarNombre(l.nombre) === nombre);
  if (!libro) return null;
  const capitulo = Math.min(Math.max(parseInt(m[2], 10) || 1, 1), libro.capitulos);
  return { libro, capitulo };
}
