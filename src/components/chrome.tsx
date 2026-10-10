import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { TEMAS_COLOR, type TemaColor } from "../useTheme";
import { NAV_GROUPS, type ScreenId } from "../navigation";
// Fondo de video superior (nubes) — archivo local en public/videos para que funcione en dev y en GitHub Pages
export const SKY_VIDEO_SRC = `${import.meta.env.BASE_URL}videos/nubes1.mp4`;

// Videos del footer (fondo inferior) — H.264 + faststart en public/videos
// (convertidos desde videos/Footer1..5.mp4 con ffmpeg: libx264, yuv420p,
// 854x480, crf 26, +faststart). Se alternan al azar al terminar cada uno.
const FOOTER_VIDEO_SRCS = [1, 2, 3, 4, 5].map(
  (n) => `${import.meta.env.BASE_URL}videos/footer${n}.mp4`
);

function pickRandomFooterSrc(except?: string): string {
  const pool = FOOTER_VIDEO_SRCS.filter((s) => s !== except);
  const list = pool.length > 0 ? pool : FOOTER_VIDEO_SRCS;
  return list[Math.floor(Math.random() * list.length)];
}

// Video del footer: fondo inferior con fundidos de entrada/salida.
// El bottom del video coincide con el top del bottom-nav (el <nav> va
// ENCIMA con z-30, el video DEBAJO con z-0): nunca lo tapa.
export function FooterVideo() {
  const [src, setSrc] = useState<string>(() => pickRandomFooterSrc());
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleEnded = () => {
    setFading(true);
    window.setTimeout(() => {
      setSrc((prev) => pickRandomFooterSrc(prev));
      setFading(false);
    }, 800);
  };

  return (
    <div className="footer-video-wrap pointer-events-none fixed inset-x-0 bottom-0 z-0 h-[280px] overflow-hidden" aria-hidden="true">
      <video
        key={src}
        className={`footer-video h-full w-full object-cover${fading ? " is-fading" : ""}`}
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        onEnded={handleEnded}
        ref={(v) => {
          videoRef.current = v;
          if (v) {
            v.muted = true;
            v.play().catch(() => {});
          }
          return undefined;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-white/25 to-[#f4faff]" />
    </div>
  );
}

// ==========================================================================
// MENÚ DE MÓDULOS (lo comparten la hamburguesa móvil y el header de escritorio)
// ==========================================================================
export function NavMenuPanel({
  activeScreen,
  onSelect,
  onClose,
  positionClass,
}: {
  activeScreen: ScreenId;
  onSelect: (screen: ScreenId) => void;
  onClose: () => void;
  positionClass: string;
}) {
  return (
    <>
      {/* Overlay para cerrar al tocar fuera */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] z-40 animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />
      {/* Panel de navegación */}
      {/* Menú flotante en vidrio neutro: 30% de transparencia (blanco al 70%)
          + blur(5px) en claro; el mismo 30% sobre #152834 en oscuro — clase
          .menu-vidrio documentada en src/index.css. Sin cabecera verde (se
          cierra tocando fuera o al elegir una sección). Agrupado por
          secciones en el mismo panel, con scroll interno solo si el alto
          supera la ventana (móviles pequeños); "Sistema" queda abajo para
          borrar después. */}
      <nav className={`menu-vidrio absolute z-50 rounded-[8px] shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] border border-slate-100 overflow-hidden animate-[scaleIn_0.15s_ease-out] ${positionClass}`}>
        <div className="max-h-[calc(100dvh-140px)] overflow-y-auto p-2 space-y-3">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="px-3 pb-1 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                {group.title}
              </p>
              <div className="grid grid-cols-2 gap-1">
                {group.links.map((link) => (
                  <button
                    key={link.screen}
                    onClick={() => {
                      onSelect(link.screen);
                      onClose();
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                      activeScreen === link.screen
                        ? "bg-[#386458] text-white shadow-sm"
                        : "text-slate-700 hover:bg-[#386458]/5 hover:text-[#386458]"
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[20px] shrink-0"
                      style={{ fontVariationSettings: activeScreen === link.screen ? "'FILL' 1" : "" }}
                    >
                      {link.icon}
                    </span>
                    <span className="text-xs font-bold truncate">{link.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}

// ==========================================================================
// TOGGLE CLARO / OSCURO (se usa en el header móvil y en el de escritorio)
// ==========================================================================
export function ThemeToggle({ theme, onToggle }: { theme: "light" | "dark"; onToggle: () => void }) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-pressed={isDark}
      className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-slate-900/5 text-slate-800 hover:bg-slate-900/10 active:scale-90 transition-all cursor-pointer dark:bg-white/10 dark:text-amber-200 dark:hover:bg-white/15"
    >
      <span className="material-symbols-outlined text-[20px]">
        {isDark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}

// ==========================================================================
// SELECTOR DE COLOR DE MARCA (Eucalipto / Zafiro / Terracota)
// Icono palette junto al toggle claro/oscuro (móvil y escritorio).
// El overlay + panel van por PORTAL a document.body: el botón vive dentro
// del header (`relative z-10`) y el contenido de la pantalla —hermano
// posterior con su propio `relative z-10`— pintaba ENCIMA de todo el
// contexto del header (incluido un `fixed z-[70]`, que solo compite dentro
// de su propio stacking context). En el body no hay ancestro que lo atrape.
// ==========================================================================
export function TemaColorBoton({ tema, onCambiar }: { tema: TemaColor; onCambiar: (t: TemaColor) => void }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-label="Cambiar color de marca"
        title="Cambiar color de marca"
        aria-expanded={abierto}
        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-slate-900/5 text-slate-800 hover:bg-slate-900/10 active:scale-90 transition-all cursor-pointer dark:bg-white/10 dark:text-amber-200 dark:hover:bg-white/15"
      >
        <span className="material-symbols-outlined text-[20px]">palette</span>
      </button>
      {abierto && typeof document !== "undefined" && createPortal(
        <>
          <div className="fixed inset-0 z-[60] backdrop-blur-[2px]" onClick={() => setAbierto(false)} />
          <div className="menu-vidrio fixed top-[68px] right-3 md:right-8 z-[70] w-44 rounded-[8px] border border-slate-100 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] p-1.5 animate-[scaleIn_0.15s_ease-out]">
            <p className="px-3 pt-1.5 pb-1 text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Color
            </p>
            {TEMAS_COLOR.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onCambiar(t.id);
                  setAbierto(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                  tema === t.id ? "bg-[#386458]/10 text-slate-900 dark:text-white" : "text-slate-700 hover:bg-slate-900/5"
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full shrink-0 border border-black/10"
                  style={{ backgroundColor: t.punto }}
                />
                <span className="text-xs font-bold flex-1">{t.nombre}</span>
                {tema === t.id && (
                  <span className="material-symbols-outlined text-[16px] text-[#386458]">check</span>
                )}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
