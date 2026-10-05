import React, { useState } from "react";

export default function ConfirmacionRegistroScreen({
  onBack,
  onRegisterAnother,
  onGoHome
}: {
  onBack?: () => void;
  onRegisterAnother?: () => void;
  onGoHome?: () => void;
}) {
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const triggerSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleDownloadComprobante = () => {
    const content = `Comprobante IglesiaOS
Folio Oficial: #IOS-2024-8942
Hermano / Titular: Mateo Alejandro Morales Benítez
Destino Litúrgico: Bautismos • Dom 24 Nov (11:30 AM)
Tipo de Registro: Solicitud Sacramental y Ficha Fraternal
Responsable Ministerial: Pastor Andrés Valdivia`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "comprobante-iglesiaos.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    triggerSuccess("Comprobante descargado.");
  };

  return (
    <div className="flex-1 pb-24 relative overflow-hidden flex flex-col justify-between animate-[fadeIn_0.25s_ease-out] font-body-md text-body-md text-[#0e1d25]">

      {successToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#23323a] text-white px-4 py-3 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 border border-slate-700/30">
          <span className="material-symbols-outlined text-emerald-400 text-[18px] font-bold">check_circle</span>
          <span>{successToast}</span>
        </div>
      )}

      {/* Barra de herramientas: una sola fila (← + rótulo) con una única
          salida; sin borde ni botón de cierre duplicado a la derecha. */}
      <div className="flex items-center gap-2 mb-3 px-5">
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Volver"
            title="Volver"
            className="w-9 h-9 shrink-0 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] font-bold">arrow_back</span>
          </button>
        )}
        <span className="min-w-0 truncate text-xs text-slate-500">Confirmación de registro</span>
      </div>

      <div className="flex flex-col w-full px-5 space-y-6">

        <div className="flex flex-col items-center text-center pt-2">
          <div className="relative flex items-center justify-center mb-4">
            <div className="absolute w-28 h-28 rounded-full bg-[#bddefe]/40 blur-xl animate-pulse"></div>
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-[#bdeddd]/50 to-[#bddefe]/50 flex items-center justify-center p-1 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#386458] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md border border-slate-50">
              <span className="material-symbols-outlined text-[#386458] text-[20px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#bdeddd] text-[#214e43] mb-3 shadow-sm">
            <span className="material-symbols-outlined text-[15px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span className="text-[10px] uppercase tracking-wider font-bold">Proceso Culminado</span>
          </div>

          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 leading-snug">¡Registro completado!</h2>
          <p className="text-[11px] text-slate-400 font-semibold max-w-xs leading-relaxed">
            La información se ha integrado de forma segura y confidencial en el Directorio General de IglesiaOS.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-white border border-slate-100 shadow-md p-5">
          <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#bddefe]/30 pointer-events-none blur-2xl"></div>

          <div className="flex items-center justify-between pb-3 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Folio Oficial</span>
              <span className="text-xs font-mono font-bold text-slate-800 leading-none mt-1">#IOS-2024-8942</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#bdeddd]/50 text-[#214e43]">
              <span className="w-2 h-2 rounded-full bg-[#386458] animate-ping shrink-0"></span>
              <span className="text-[9px] font-bold uppercase tracking-wider">Sincronizado</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase">Tipo de Registro</span>
              <div className="flex items-center gap-1.5 mt-1 leading-none">
                <span className="material-symbols-outlined text-[#386458] text-[18px] font-bold">auto_stories</span>
                <span className="text-xs font-bold text-slate-800">Solicitud Sacramental y Ficha Fraternal</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase">Hermano / Titular</span>
              <div className="flex items-center gap-1.5 mt-1 leading-none">
                <span className="material-symbols-outlined text-[#42617d] text-[18px] font-bold">person_outline</span>
                <span className="text-xs font-bold text-slate-900">Mateo Alejandro Morales Benítez</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Responsable Ministerial</span>
                <div className="flex items-center gap-1.5 mt-1 leading-none">
                  <span className="material-symbols-outlined text-[#386458] text-[18px] font-bold">workspace_premium</span>
                  <span className="text-[11px] text-slate-800 font-semibold">Pastor Andrés Valdivia</span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Destino Litúrgico</span>
                <div className="flex items-center gap-1.5 mt-1 leading-none">
                  <span className="material-symbols-outlined text-[#7f4e57] text-[18px] font-bold">event</span>
                  <span className="text-[11px] text-slate-800 font-bold">Bautismos • Dom 24 Nov (11:30 AM)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 flex items-center justify-between bg-slate-50 border-t border-slate-100 px-3 py-2.5 rounded-lg">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#386458] text-[18px] font-bold">shield</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">Cifrado Eclesiástico SHA-256</span>
            </div>
            <span className="text-[9px] text-[#386458] font-bold uppercase tracking-wider">Validado</span>
          </div>
        </div>

        <div className="rounded-xl bg-[#e7f6ff] border border-slate-100 p-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#42617d] text-[22px] font-bold shrink-0">format_quote</span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-[#294964] uppercase tracking-wider leading-none">Palabra de Bendición</p>
              <p className="text-[11px] text-slate-600 font-semibold italic mt-2 leading-relaxed">
                «Todo lo puedo en Cristo que me fortalece.» — Filipenses 4:13
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleDownloadComprobante}
            className="w-full py-4 px-6 rounded-full bg-[#386458] text-white font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98] transition-all"
            style={{ borderRadius: "4px" }}
          >
            <span className="material-symbols-outlined text-[20px] font-bold">download</span>
            <span>Descargar comprobante</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={onRegisterAnother}
              className="w-full py-3.5 px-4 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-all"
              style={{ borderRadius: "4px" }}
            >
              <span className="material-symbols-outlined text-[18px] font-bold">add_circle</span>
              <span>Registrar Otro Hermano</span>
            </button>

            <button
              onClick={onGoHome}
              className="w-full py-3.5 px-4 rounded-full bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-200 transition-all"
              style={{ borderRadius: "4px" }}
            >
              <span className="material-symbols-outlined text-[18px] font-bold">home</span>
              <span>Volver al Inicio</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}