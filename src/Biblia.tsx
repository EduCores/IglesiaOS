import React, { useEffect, useState } from "react";
import {
  LIBROS_BIBLIA,
  VERSIONES_BIBLIA,
  atribucionDe,
  buscarLibro,
  fetchCapitulo,
  fetchVersiculoDia,
  guardarCorchetes,
  guardarUltimaLectura,
  guardarVersion,
  leerCorchetes,
  leerUltimaLectura,
  leerVersion,
  resolverLibroPorReferencia,
  type VersiculoDia,
} from "./lib/biblia";

// Palabras agregadas por los traductores: en papel van en cursiva; aquí se
// renderizan en <em> sin corchetes (toggle "Corchetes" muestra el crudo [..]).
function renderVersiculo(texto: string, mostrarCorchetes: boolean): React.ReactNode {
  if (mostrarCorchetes) return texto;
  const partes: { texto: string; agregado: boolean }[] = [];
  const re = /\[([^\]]*)\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(texto)) !== null) {
    if (m.index > last) partes.push({ texto: texto.slice(last, m.index), agregado: false });
    partes.push({ texto: m[1], agregado: true });
    last = m.index + m[0].length;
  }
  if (last < texto.length) partes.push({ texto: texto.slice(last), agregado: false });
  return partes.map((p, i) =>
    p.agregado ? (
      <em key={i} className="italic">
        {p.texto}
      </em>
    ) : (
      <span key={i}>{p.texto}</span>
    )
  );
}

// Combo propio (no <select> nativo): el desplegable nativo lo pinta cada
// navegador a su manera y no respeta el tema en todos; este sí, en claro y oscuro.
function ComboBox({
  id,
  abierto,
  onToggle,
  value,
  placeholder,
  options,
  onChange,
  disabled,
}: {
  id: string;
  abierto: string | null;
  onToggle: (id: string | null) => void;
  value: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const open = abierto === id;
  const actual = options.find((o) => o.value === value);
  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-label={placeholder ?? "Seleccionar"}
        onClick={() => onToggle(open ? null : id)}
        className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-[#386458] bg-white outline-none font-semibold text-slate-800 flex items-center justify-between gap-2 disabled:opacity-40 cursor-pointer disabled:cursor-default"
      >
        <span className="truncate">{actual?.label ?? placeholder ?? "Seleccionar"}</span>
        <span className={`material-symbols-outlined text-[18px] text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => onToggle(null)} />
          <ul className="menu-vidrio absolute left-0 right-0 top-full mt-1 z-50 max-h-60 overflow-y-auto rounded-xl border border-slate-200 shadow-lg py-1 animate-[scaleIn_0.15s_ease-out]">
            {options.map((o) => (
              <li key={o.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    onToggle(null);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                    o.value === value ? "bg-[#386458]/10 text-[#386458]" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate">{o.label}</span>
                  {o.value === value && (
                    <span className="material-symbols-outlined text-[16px] shrink-0">check</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

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

  const [version, setVersion] = useState<string>(() => leerVersion());
  const [libroSlug, setLibroSlug] = useState<string>(() => leerUltimaLectura(leerVersion())?.slug ?? "john");
  const [capitulo, setCapitulo] = useState<number>(() => leerUltimaLectura(leerVersion())?.capitulo ?? 3);
  const [versiculos, setVersiculos] = useState<string[]>([]);
  const [versiculoSel, setVersiculoSel] = useState<number | null>(null);
  const [mostrarCorchetes, setMostrarCorchetes] = useState<boolean>(() => leerCorchetes());
  const [comboAbierto, setComboAbierto] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [votd, setVotd] = useState<VersiculoDia | null>(null);

  const libro = buscarLibro(libroSlug) ?? LIBROS_BIBLIA[43];
  const indiceLibro = LIBROS_BIBLIA.findIndex((l) => l.slug === libro.slug);

  const cargarCapitulo = async (slug: string, cap: number, ver: string) => {
    setCargando(true);
    try {
      const data = await fetchCapitulo(slug, cap, ver);
      setVersiculos(data.versiculos);
      setVersiculoSel(null);
      guardarUltimaLectura(slug, cap, ver);
    } catch {
      notify("La lectura requiere internet. Revisa tu conexión.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCapitulo(libroSlug, capitulo, version);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [libroSlug, capitulo, version]);

  useEffect(() => {
    fetchVersiculoDia(version)
      .then(setVotd)
      .catch(() => {
        /* sin red: la tarjeta del día queda oculta */
      });
  }, [version]);

  const cambiarVersion = (id: string) => {
    if (id === version) return;
    setVersion(id);
    guardarVersion(id);
  };

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

  const alternarCorchetes = () => {
    setMostrarCorchetes((prev) => {
      guardarCorchetes(!prev);
      return !prev;
    });
  };

  const irAVersiculo = (v: number) => {
    setVersiculoSel(v);
    requestAnimationFrame(() => {
      document.getElementById(`versiculo-${v}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
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
          {version === "rvg" ? "RVG" : "RV1909"}
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
            <p className="text-sm text-slate-800 leading-relaxed font-medium">“{renderVersiculo(votd.texto, mostrarCorchetes)}”</p>
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

        {/* Versión: Gómez 2010 (moderna) o Reina-Valera 1909 (original) */}
        <div className="grid grid-cols-2 gap-2.5">
          {VERSIONES_BIBLIA.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => cambiarVersion(v.id)}
              className={`px-2 py-2.5 text-[10px] font-bold transition-all cursor-pointer active:scale-95 whitespace-nowrap ${
                version === v.id ? "bg-[#386458] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              style={{ borderRadius: "4px" }}
            >
              {v.nombre}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-bold uppercase">Corchetes [ ]</span>
          <button
            type="button"
            role="switch"
            aria-checked={mostrarCorchetes}
            aria-label="Mostrar corchetes"
            onClick={alternarCorchetes}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300 ${
              mostrarCorchetes ? "bg-[#386458]" : "bg-slate-200"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                mostrarCorchetes ? "translate-x-5" : "translate-x-0"
              }`}
            ></span>
          </button>
        </div>

        {/* Selectores de libro, capítulo y versículo */}
        <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-4 space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-500 font-bold uppercase">Libro</label>
            <ComboBox
              id="libro"
              abierto={comboAbierto}
              onToggle={setComboAbierto}
              value={libro.slug}
              placeholder="Libro"
              options={LIBROS_BIBLIA.map((l) => ({ value: l.slug, label: l.nombre }))}
              onChange={(v) => {
                const next = buscarLibro(v);
                if (!next) return;
                setLibroSlug(next.slug);
                setCapitulo(1);
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500 font-bold uppercase">Capítulo</label>
            <ComboBox
              id="capitulo"
              abierto={comboAbierto}
              onToggle={setComboAbierto}
              value={String(capitulo)}
              placeholder="Capítulo"
              options={Array.from({ length: libro.capitulos }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))}
              onChange={(v) => setCapitulo(parseInt(v, 10) || 1)}
            />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500 font-bold uppercase">Versículo</label>
            <ComboBox
              id="versiculo"
              abierto={comboAbierto}
              onToggle={setComboAbierto}
              value={versiculoSel ? String(versiculoSel) : ""}
              placeholder="Ir a…"
              options={versiculos.map((_, i) => ({ value: String(i + 1), label: String(i + 1) }))}
              onChange={(v) => {
                const n = parseInt(v, 10);
                if (!isNaN(n)) irAVersiculo(n);
              }}
              disabled={versiculos.length === 0}
            />
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
                <p
                  key={i}
                  id={`versiculo-${i + 1}`}
                  className={`text-[13px] text-slate-700 leading-relaxed rounded-lg px-2 py-1 -mx-2 transition-colors ${
                    versiculoSel === i + 1 ? "bg-[#386458]/10" : ""
                  }`}
                >
                  <sup className="text-[10px] font-bold text-[#386458] mr-1.5">{i + 1}</sup>
                  {renderVersiculo(texto, mostrarCorchetes)}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-medium py-4 text-center">
              Sin conexión: el texto bíblico requiere internet. Lo último leído se conserva al volver.
            </p>
          )}
          <p className="text-[10px] text-slate-400 font-medium mt-4 pt-3 border-t border-slate-100">
            {atribucionDe(version)}
          </p>
        </div>
      </div>
    </div>
  );
}
