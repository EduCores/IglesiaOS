import React, { useEffect, useState } from "react";
import {
  LIBROS_BIBLIA,
  buscarLibro,
  fetchCapitulo,
  fetchVersiculoDia,
  guardarUltimaLectura,
  leerUltimaLectura,
  resolverLibroPorReferencia,
  type VersiculoDia,
} from "./lib/biblia";

// ==========================================================================
// PANTALLA: BIBLIA RV1909 (Midvash, dominio público)
// Lector por libro/capítulo + versículo del día. Requiere internet para el
// texto fresco; sin red muestra lo último leído o avisa con toast (sin alert).
// ==========================================================================
export default function BibliaScreen({ onBack }: { onBack?: () => void }) {
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const notify = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const [libroSlug, setLibroSlug] = useState<string>(() => leerUltimaLectura()?.slug ?? "john");
  const [capitulo, setCapitulo] = useState<number>(() => leerUltimaLectura()?.capitulo ?? 3);
  const [versiculos, setVersiculos] = useState<string[]>([]);
  const [cargando, setCargando] = useState(false);
  const [votd, setVotd] = useState<VersiculoDia | null>(null);

  const libro = buscarLibro(libroSlug) ?? LIBROS_BIBLIA[43];
  const indiceLibro = LIBROS_BIBLIA.findIndex((l) => l.slug === libro.slug);

  const cargarCapitulo = async (slug: string, cap: number) => {
    setCargando(true);
    try {
      const data = await fetchCapitulo(slug, cap);
      setVersiculos(data.versiculos);
      guardarUltimaLectura(slug, cap);
    } catch {
      notify("La lectura requiere internet. Revisa tu conexión.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCapitulo(libroSlug, capitulo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [libroSlug, capitulo]);

  useEffect(() => {
    fetchVersiculoDia()
      .then(setVotd)
      .catch(() => {
        /* sin red: la tarjeta del día queda oculta */
      });
  }, []);

  const irAtras = () => {
    if (capitulo > 1) {
      setCapitulo(capitulo - 1);
    } else if (indiceLibro > 0) {
      const anterior = LIBROS_BIBLIA[indiceLibro - 1];
      setLibroSlug(anterior.slug);
      setCapitulo(anterior.capitulos);
    }
  };

  const irAdelante = () => {
    if (capitulo < libro.capitulos) {
      setCapitulo(capitulo + 1);
    } else if (indiceLibro < LIBROS_BIBLIA.length - 1) {
      const siguiente = LIBROS_BIBLIA[indiceLibro + 1];
      setLibroSlug(siguiente.slug);
      setCapitulo(1);
    }
  };

  const leerVotd = () => {
    if (!votd) return;
    const destino = resolverLibroPorReferencia(votd.referencia);
    if (!destino) {
      notify("No se pudo ubicar la referencia del día.");
      return;
    }
    setLibroSlug(destino.libro.slug);
    setCapitulo(destino.capitulo);
  };

  const alInicio = capitulo <= 1 && indiceLibro <= 0;
  const alFinal = capitulo >= libro.capitulos && indiceLibro >= LIBROS_BIBLIA.length - 1;

  return (
    <div className="flex-1 pb-24 relative overflow-hidden flex flex-col justify-between animate-[fadeIn_0.25s_ease-out] font-body-md text-body-md text-[#0e1d25]">
      {successToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded shadow-lg z-50 flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
          <span>{successToast}</span>
        </div>
      )}

      {/* Barra de herramientas: una sola salida (←) + rótulo */}
      <div className="flex items-center gap-2 mb-3 px-5">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver"
            title="Volver"
            className="w-9 h-9 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-90 transition-all cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back_ios_new</span>
          </button>
        )}
        <span className="text-xs text-slate-500 truncate min-w-0">Lectura bíblica</span>
        <span className="ml-auto px-2.5 py-0.5 rounded-full bg-[#386458]/10 text-[#386458] text-[9px] font-bold uppercase tracking-wider shrink-0">
          RV1909
        </span>
      </div>

      <div className="flex flex-col w-full px-5 space-y-5">
        {/* Versículo del día */}
        {votd && (
          <div className="relative overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm p-5">
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#386458]/10 blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="material-symbols-outlined text-[#386458] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
              <span className="text-[10px] font-bold text-[#386458] uppercase tracking-widest">Versículo del día</span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">“{votd.texto}”</p>
            <div className="flex items-center justify-between gap-2 mt-3">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider truncate min-w-0">{votd.referencia}</span>
              <button
                type="button"
                onClick={leerVotd}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#386458] hover:text-[#214e43] transition-colors cursor-pointer shrink-0"
              >
                <span>Leer capítulo</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* Selectores de libro y capítulo */}
        <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500 font-bold uppercase">Libro</label>
              <select
                value={libro.slug}
                onChange={(e) => {
                  const next = buscarLibro(e.target.value);
                  if (!next) return;
                  setLibroSlug(next.slug);
                  setCapitulo(1);
                }}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:ring-1 focus:ring-[#386458] bg-white outline-none font-semibold text-slate-800"
              >
                {LIBROS_BIBLIA.map((l) => (
                  <option key={l.slug} value={l.slug}>
                    {l.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500 font-bold uppercase">Capítulo</label>
              <select
                value={capitulo}
                onChange={(e) => setCapitulo(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:ring-1 focus:ring-[#386458] bg-white outline-none font-semibold text-slate-800"
              >
                {Array.from({ length: libro.capitulos }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={irAtras}
              disabled={alInicio || cargando}
              className="flex-1 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-700 text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer disabled:cursor-default"
              style={{ borderRadius: "4px" }}
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Anterior
            </button>
            <button
              type="button"
              onClick={irAdelante}
              disabled={alFinal || cargando}
              className="flex-1 py-2.5 px-3 bg-[#386458] hover:bg-[#2c4e45] disabled:opacity-40 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer disabled:cursor-default"
              style={{ borderRadius: "4px" }}
            >
              Siguiente
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Texto del capítulo */}
        <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-1">
            {libro.nombre} {capitulo}
          </h2>
          <p className="text-[10px] text-slate-400 font-semibold mb-3">Capítulo {capitulo} de {libro.capitulos} · Reina-Valera 1909</p>
          {cargando ? (
            <div className="flex items-center justify-center gap-2 py-8 text-slate-400">
              <div className="w-5 h-5 border-2 border-slate-200 border-t-[#386458] rounded-full animate-spin"></div>
              <span className="text-xs font-medium">Cargando capítulo...</span>
            </div>
          ) : versiculos.length > 0 ? (
            <div className="space-y-2.5">
              {versiculos.map((texto, i) => (
                <p key={i} className="text-[13px] text-slate-700 leading-relaxed">
                  <sup className="text-[10px] font-bold text-[#386458] mr-1.5">{i + 1}</sup>
                  {texto}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-medium py-4 text-center">
              Sin conexión: el texto bíblico requiere internet. Lo último leído se conserva al volver.
            </p>
          )}
          <p className="text-[10px] text-slate-400 font-medium mt-4 pt-3 border-t border-slate-100">
            Reina-Valera 1909 · Dominio público
          </p>
        </div>
      </div>
    </div>
  );
}
