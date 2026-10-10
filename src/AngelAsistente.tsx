// ==========================================================================
// ASISTENTE ÁNGEL — agente IA flotante de IglesiaOS.
// Botón flotante con icono de ángel + chat de ayuda y navegación.
// - El ángel es SVG propio: Material Symbols NO tiene glifo "angel"
//   (verificado 404 en el CDN); así se evita un hueco vacío.
// - Cerebro local (sin red, funciona offline): entiende saludos, dudas
//   frecuentes y lleva a cada sección con botones "Ir a …".
// - Claro y oscuro con tokens ya remapeados (bg-[#386458], bg-[#bdeddd],
//   bg-slate-50, bg-white, text-[#386458], border-slate-100, menu-vidrio):
//   no se introduce ningún hex ni tinte nuevo.
// ==========================================================================
import { useEffect, useRef, useState } from "react";

// Icono de ángel dibujado (halo, cabeza, alas, túnica y manos juntas):
// usa currentColor para heredar el color del contexto en ambos temas.
export function AngelIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="24" cy="7.5" rx="6.5" ry="2.5" />
      <circle cx="24" cy="15.5" r="4.5" />
      <path d="M17.5 24C12 19.5 7.5 19 5 21c1.5 4 4 7.5 9 9" />
      <path d="M30.5 24c5.5-4.5 10-5 12.5-3-1.5 4-4 7.5-9 9" />
      <path d="M24 20.5c-4.5 3.5-6.5 9-6.5 15.5v4h13v-4c0-6.5-2-12-6.5-15.5Z" />
      <path d="M21 30.5c1 1.5 2 2.3 3 2.3s2-.8 3-2.3" />
    </svg>
  );
}

export interface AccionAngel {
  label: string;
  screen: string;
}

export interface MensajeAngel {
  id: number;
  de: "angel" | "user";
  texto: string;
  accion?: AccionAngel;
}

// --------------------------------------------------------------------------
// Cerebro local del ángel: guía sin red, siempre disponible.
// Cada respuesta puede incluir un botón "Ir a …" que navega a la pantalla.
// --------------------------------------------------------------------------
type DestinoAngel = { screen: string; label: string };
interface IntencionAngel {
  claves: string[];
  texto: string;
  accion?: DestinoAngel;
}
const DESTINOS: Record<string, DestinoAngel> = {
  ofrenda: { screen: "formulario", label: "Ir a Ofrenda" },
  finanzas: { screen: "finanzas", label: "Ir a Finanzas" },
  personas: { screen: "personas", label: "Ir a Personas" },
  celulas: { screen: "celulas", label: "Ir a Células" },
  pastoral: { screen: "pastoral", label: "Ir a Pastoral" },
  eventos: { screen: "eventos", label: "Ir a Eventos" },
  culto: { screen: "culto_vivo", label: "Ir a Culto en Vivo" },
  censo: { screen: "censo_miembro", label: "Ir a Censo de Miembro" },
  sacramentos: { screen: "sacramentos", label: "Ir a Sacramentos" },
  whatsapp: { screen: "difusion_whatsapp", label: "Ir a Difusión WhatsApp" },
  multimedia: { screen: "multimedia", label: "Ir a Multimedia" },
  bitacora: { screen: "bitacora_pastoral", label: "Ir a Bitácora Pastoral" },
  checkin: { screen: "checkin_ninos", label: "Ir a Check-In Niños" },
  offline: { screen: "offline_sync", label: "Ir a Sincronización" },
  confirmacion: { screen: "confirmacion_registro", label: "Ir a Confirmación" },
  biblia: { screen: "biblia", label: "Ir a Biblia" },
  comunicaciones: { screen: "comunicaciones", label: "Ir a Comunicaciones" },
  roles: { screen: "roles", label: "Ir a Roles" },
};
const INTENCIONES_A: IntencionAngel[] = [
  {
    claves: ["hola", "buenos dias", "buenas tardes", "buenas noches", "shalom", "bendiciones", "hey"],
    texto:
      "¡Hola! Soy tu ángel guardián de IglesiaOS. Puedo guiarte por la app, explicar cada sección o llevarte directo. ¿Qué necesitas hoy?",
  },
  {
    claves: ["donde estoy", "que es esto", "como funciona", "ayuda", "que puedes hacer", "perdido"],
    texto:
      "Estoy aquí para acompañarte: dime qué quieres hacer (por ejemplo “registrar ofrenda”, “ver finanzas” o “buscar un miembro”) y te llevo directo o te lo explico paso a paso.",
  },
  {
    claves: ["ofrenda", "diezmo", "donar", "consagrar", "aporte"],
    texto:
      "Para registrar una ofrenda: elige el propósito, escribe el monto, marca si es anónima y confirma. Queda guardada con tu nombre y célula.",
    accion: DESTINOS.ofrenda,
  },
  {
    claves: ["finanza", "balance", "ingreso", "egreso", "gasto", "transaccion", "mayordomia", "dinero"],
    texto:
      "Finanzas muestra el balance del período, ingresos, egresos y cada movimiento. Con el filtro ves solo ofrendas, diezmos o gastos.",
    accion: DESTINOS.finanzas,
  },
  {
    claves: ["miembro", "directorio", "buscar gente", "contacto"],
    texto:
      "En Personas está el directorio con foto, rol, célula y contacto. Si es alguien nuevo, usa “Nuevo Miembro” para censarlo.",
    accion: DESTINOS.personas,
  },
  {
    claves: ["censo", "nuevo miembro", "registrar miembro", "inscribir", "ficha"],
    texto:
      "El Censo de Miembro registra la ficha completa: datos, foto, etapa espiritual y célula. Al guardar, la persona aparece en el directorio.",
    accion: DESTINOS.censo,
  },
  {
    claves: ["celula", "grupo pequeño", "hogar"],
    texto:
      "Células reúne los grupos semanales con su líder, horario y lugar. Desde cada tarjeta puedes ver el reporte o contactar al líder.",
    accion: DESTINOS.celulas,
  },
  {
    claves: ["pastoral", "pastor", "consejeria", "visita pastoral", "oracion"],
    texto:
      "Pastoral acompaña a la congregación: visitas, consejería y motivos de oración. También abre Sacramentos y la Bitácora.",
    accion: DESTINOS.pastoral,
  },
  {
    claves: ["sacramento", "bautismo", "bautizo", "matrimonio", "boda", "comunion"],
    texto:
      "Sacramentos gestiona bautismos, confirmaciones, matrimonios y comuniones con su guía de preparación.",
    accion: DESTINOS.sacramentos,
  },
  {
    claves: ["confirmar registro", "ficha de registro"],
    texto: "La Confirmación de Registro muestra el resumen del trámite recién guardado para revisarlo en detalle.",
    accion: DESTINOS.confirmacion,
  },
];

const INTENCIONES_B: IntencionAngel[] = [
  {
    claves: ["bitacora", "nota pastoral", "seguimiento"],
    texto:
      "La Bitácora Pastoral guarda cada visita: fecha, duración, lugar y motivos de oración de la familia, con aviso de confidencialidad.",
    accion: DESTINOS.bitacora,
  },
  {
    claves: ["biblia", "versiculo", "escritura", "palabra", "salmo"],
    texto:
      "La Biblia (Reina-Valera 1909) deja leer por libro y capítulo, con buscador de versículos para el devocional o la prédica.",
    accion: DESTINOS.biblia,
  },
  {
    claves: ["evento", "actividad", "reunion", "servicio", "vigilia", "calendario"],
    texto:
      "Eventos anuncia el próximo culto y las actividades. Desde ahí entras al Culto en Vivo o al Check-In de Niños.",
    accion: DESTINOS.eventos,
  },
  {
    claves: ["culto en vivo", "transmision", "en vivo", "streaming"],
    texto: "Culto en Vivo transmite el servicio con chat para saludar y pedir oración mientras adoras.",
    accion: DESTINOS.culto,
  },
  {
    claves: ["nino", "check-in", "checkin", "guarderia", "infantil", "hijo"],
    texto:
      "El Check-In de Niños registra la llegada segura de cada pequeño y genera su etiqueta para recogerlo al final.",
    accion: DESTINOS.checkin,
  },
  {
    claves: ["whatsapp", "difusion", "mensaje masivo", "enviar mensaje", "campana"],
    texto:
      "La Difusión por WhatsApp envía avisos a toda la comunidad y muestra cuántos lo leyeron. Escríbelo con paz y revísalo antes de confirmar.",
    accion: DESTINOS.whatsapp,
  },
  {
    claves: ["comunicacion", "boletin", "aviso", "anuncio", "noticia", "historial"],
    texto:
      "Comunicaciones reúne el historial de mensajes, campañas y boletines: lo enviado, lo programado y los borradores.",
    accion: DESTINOS.comunicaciones,
  },
  {
    claves: ["multimedia", "video", "musica", "alabanza", "grabacion", "camara"],
    texto:
      "Multimedia guarda canciones, videos y grabaciones recientes. Puedes reproducirlos o poner uno como fondo de la app.",
    accion: DESTINOS.multimedia,
  },
  {
    claves: ["rol", "permiso", "acceso", "voluntario", "portero", "ujier", "tesorero", "lider", "miembro", "pastor 1", "pastor 2", "sonido", "tecnico sonido", "musico", "banda", "voces", "coro", "aseo", "cocina"],
    texto:
      "Roles define quién puede hacer qué: liderazgo, ministerios y servicio. Cada rol dice su acceso y cuántos miembros lo tienen.",
    accion: DESTINOS.roles,
  },
  {
    claves: ["offline", "sin internet", "sincronizar", "pendiente", "subir datos"],
    texto:
      "Si te quedas sin internet, la app guarda todo en el equipo y lo sincroniza cuando vuelve la conexión.",
    accion: DESTINOS.offline,
  },
  {
    claves: ["tema", "oscuro", "claro", "color", "zafiro", "terracota", "eucalipto", "modo noche"],
    texto:
      "Puedes cambiar entre modo claro y oscuro con el sol/luna del encabezado, y el color de marca con la paleta de al lado.",
  },
  {
    claves: ["sesion", "perfil", "cuenta", "contrasena", "cerrar sesion", "mi nombre"],
    texto:
      "Tu sesión vive en el botón “Perfil” del encabezado: ahí entras, editas tu nombre, correo y rol, o cierras sesión.",
  },
  {
    claves: ["gracias", "amen", "dios te bendiga", "genial", "perfecto"],
    texto: "¡Amén! Me alegra ayudarte. Aquí estaré flotando cerquita por si me necesitas de nuevo.",
  },
  {
    claves: ["adios", "chao", "nos vemos", "hasta luego"],
    texto: "Que el Señor te acompañe. Tócame cuando quieras y seguimos conversando.",
  },
];
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¡!¿?.,;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buscarRespuesta(pregunta: string): { texto: string; accion?: DestinoAngel } {
  const q = ` ${normalizar(pregunta)} `;
  let mejor: IntencionAngel | null = null;
  let puntos = 0;
  const todas = [...INTENCIONES_A, ...INTENCIONES_B];
  for (const inten of todas) {
    let p = 0;
    for (const clave of inten.claves) {
      const c = normalizar(clave);
      if (c && q.includes(c)) p += c.length;
    }
    if (p > puntos) {
      puntos = p;
      mejor = inten;
    }
  }
  if (mejor) return { texto: mejor.texto, accion: mejor.accion };
  return {
    texto:
      "Mmm, eso aún está más allá de mis alitas. Puedo guiarte a Ofrenda, Finanzas, Personas, Células, Pastoral, Eventos, Biblia o WhatsApp. ¿Por cuál empezamos?",
  };
}
let proximoId = 1;
const SALUDO_INICIAL: MensajeAngel = {
  id: 0,
  de: "angel",
  texto:
    "¡Hola! Soy tu ángel de IglesiaOS. Te ayudo a moverte por la app y respondo tus dudas. Prueba con “¿dónde registro una ofrenda?” o toca una sugerencia.",
};
const SUGERENCIAS = [
  "Registrar ofrenda",
  "Ver finanzas",
  "Buscar miembro",
  "Leer la Biblia",
  "Enviar WhatsApp",
];

// Chat flotante del ángel: fixed sobre el bottom-nav (z-30) y bajo los
// modales (z-50). Botón y panel en z-40, overlay de cierre en z-[35].
// onNavigate recibe el id de pantalla (ScreenId vive en App.tsx).
export default function AngelAsistente({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<MensajeAngel[]>([SALUDO_INICIAL]);
  const [texto, setTexto] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const listaRef = useRef<HTMLDivElement>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    listaRef.current?.scrollTo({ top: listaRef.current.scrollHeight, behavior: "smooth" });
  }, [mensajes, escribiendo, abierto]);
  useEffect(() => {
    return () => {
      if (temporizador.current) clearTimeout(temporizador.current);
    };
  }, []);
  const enviar = (crudo: string) => {
    const limpio = crudo.trim();
    if (!limpio || escribiendo) return;
    const deUsuario: MensajeAngel = { id: proximoId++, de: "user", texto: limpio };
    setMensajes((prev) => [...prev, deUsuario]);
    setTexto("");
    setEscribiendo(true);
    temporizador.current = setTimeout(() => {
      const r = buscarRespuesta(limpio);
      const delAngel: MensajeAngel = {
        id: proximoId++,
        de: "angel",
        texto: r.texto,
        accion: r.accion ? { label: r.accion.label, screen: r.accion.screen } : undefined,
      };
      setMensajes((prev) => [...prev, delAngel]);
      setEscribiendo(false);
    }, 550);
  };
  return (
    <>
      {abierto && (
        <div className="fixed inset-0 z-[35]" onClick={() => setAbierto(false)} aria-hidden="true" />
      )}
      {/* Botón flotante: círculo de acento sólido con halo menta y
          angelito blanco. Encima del bottom-nav, debajo de modales. */}
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-label={abierto ? "Cerrar asistente ángel" : "Abrir asistente ángel"}
        aria-expanded={abierto}
        className="fixed z-40 bottom-24 right-4 md:right-8 w-14 h-14 rounded-full bg-[#386458] text-white flex items-center justify-center shadow-lg shadow-[#386458]/35 ring-4 ring-[#bdeddd]/60 hover:bg-[#2c4e45] active:scale-95 transition-all cursor-pointer"
      >
        {abierto ? (
          <span className="material-symbols-outlined text-[26px]">close</span>
        ) : (
          <>
            <AngelIcon className="w-8 h-8" />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#bdeddd] border-2 border-white" />
          </>
        )}
      </button>
      {/* Panel de chat en vidrio (menu-vidrio cubre claro y oscuro).
          Ancho auto hasta 360px para no desbordar en 360px. */}
      {abierto && (
        <section
          aria-label="Asistente ángel"
          className="menu-vidrio fixed z-40 bottom-40 right-4 md:right-8 w-[calc(100vw-2rem)] max-w-[360px] rounded-2xl border border-slate-100 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] overflow-hidden animate-[scaleIn_0.15s_ease-out] flex flex-col"
        >
          <header className="flex items-center gap-3 px-4 pt-4 pb-3 bg-transparent border-b border-slate-100">
            <span className="w-10 h-10 rounded-full bg-[#bdeddd] text-[#386458] flex items-center justify-center shrink-0">
              <AngelIcon className="w-6 h-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 leading-tight">Ángel · Guía de IglesiaOS</p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#386458] inline-block" />
                {escribiendo ? "Escribiendo…" : "En línea · responde al instante"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar chat"
              className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 active:scale-90 transition-all cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </header>
          <div ref={listaRef} className="px-4 py-3 space-y-2.5 max-h-[46dvh] overflow-y-auto">
            {mensajes.map((m) =>
              m.de === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <p className="max-w-[80%] px-3.5 py-2.5 rounded-2xl rounded-br-md bg-[#386458] text-white text-sm leading-snug">
                    {m.texto}
                  </p>
                </div>
              ) : (
                <div key={m.id} className="flex justify-start gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#bdeddd] text-[#386458] flex items-center justify-center shrink-0 mt-0.5">
                    <AngelIcon className="w-5 h-5" />
                  </span>
                  <div className="max-w-[80%] space-y-1.5 min-w-0">
                    <p className="px-3.5 py-2.5 rounded-2xl rounded-bl-md bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-snug">
                      {m.texto}
                    </p>
                    {m.accion && (
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate(m.accion!.screen);
                          setAbierto(false);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#386458]/10 text-[#386458] text-xs font-bold hover:bg-[#386458] hover:text-white active:scale-95 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                        {m.accion.label}
                      </button>
                    )}
                  </div>
                </div>
              )
            )}
            {escribiendo && (
              <div className="flex justify-start gap-2">
                <span className="w-7 h-7 rounded-full bg-[#bdeddd] text-[#386458] flex items-center justify-center shrink-0">
                  <AngelIcon className="w-5 h-5" />
                </span>
                <p className="px-3.5 py-2.5 rounded-2xl rounded-bl-md bg-slate-50 border border-slate-100 text-sm text-slate-500">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
                  </span>
                </p>
              </div>
            )}
          </div>
          <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto scrollbar-hide">
            {SUGERENCIAS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => enviar(s)}
                className="shrink-0 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              enviar(texto);
            }}
            className="flex items-center gap-2 px-3 pb-3 pt-1"
          >
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Pregúntale a tu ángel…"
              aria-label="Escribe tu pregunta al ángel"
              className="flex-1 min-w-0 px-4 py-2.5 text-sm bg-slate-50 border border-slate-100 rounded-full focus:border-[#386458] focus:outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              aria-label="Enviar mensaje"
              disabled={!texto.trim()}
              className="w-10 h-10 rounded-full bg-[#386458] text-white flex items-center justify-center shrink-0 shadow-sm hover:bg-[#2c4e45] active:scale-90 transition-all cursor-pointer disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
          </form>
        </section>
      )}
    </>
  );
}

// __CHAT_DEL_ANGEL__
