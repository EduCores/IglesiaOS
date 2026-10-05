import React, { useState } from "react";

export default function OfflineSyncScreen({ onBack }: { onBack?: () => void }) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [retryStatus, setRetryStatus] = useState<string | null>(null);

  const handleRetryConnection = () => {
    setIsVerifying(true);
    setRetryStatus(null);
    setTimeout(() => {
      setIsVerifying(false);
      setRetryStatus("Aún sin señal. Reintentar");
    }, 2500);
  };

  const handleOfflineAction = (actionName: string) => {
    alert(`Acción Offline: ${actionName}\nTus datos locales están seguros.`);
  };

  return (
    <div className="flex-1 pb-24 relative overflow-hidden flex flex-col justify-between animate-[fadeIn_0.25s_ease-out] font-body-md text-body-md text-[#0e1d25]">

      <div className="flex items-center justify-between py-2 px-5 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f4b6bf] animate-pulse"></span>
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Modo seguro activado</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#bddefe]/50 text-[#294964]">
          <span className="material-symbols-outlined text-[14px] font-bold">cloud_off</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Desconectado</span>
        </div>
      </div>

      <div className="flex flex-col w-full px-5 space-y-5">

        <div className="relative overflow-hidden rounded-xl bg-white border border-slate-100 p-2 shadow-md">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#bdeddd]/40 blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-[#f4b6bf]/30 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center text-center">

            <div className="relative mb-5 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-slate-100 via-[#bdeddd] to-[#f4b6bf] flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center border border-slate-50 shadow-inner">
                  <span className={`material-symbols-outlined text-[38px] text-[#386458] ${isVerifying ? "animate-spin" : ""}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isVerifying ? "sync" : "cloud_sync"}
                  </span>
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#ffd9de] text-[#331018] shadow-sm flex items-center justify-center border border-white">
                <span className="material-symbols-outlined text-[16px] font-bold">pause</span>
              </span>
            </div>

            <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-100 font-bold text-[10px] text-[#386458] mb-2 uppercase tracking-wider">Santuario Digital en Reposo</span>

            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Pausa en la conexión</h2>

            <p className="text-[11px] text-slate-400 font-semibold max-w-xs leading-relaxed mb-6">
              No pudimos sincronizar los datos del ministerio en este momento. Tus apuntes litúrgicos locales están totalmente a salvo.
            </p>

            <div className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2 flex flex-col gap-2.5 mb-6 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-slate-400 font-bold">dns</span>
                  <span className="text-[11px] text-slate-700 font-bold">Servidor IglesiaOS</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 font-bold text-[9px] uppercase tracking-wider">En espera</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#386458] font-bold">database</span>
                  <span className="text-[11px] text-slate-700 font-bold">Base de Datos Local</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#bdeddd] text-[#214e43] font-bold text-[9px] uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#386458]"></span>
                  Protegida
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#7f4e57] font-bold">wifi_off</span>
                  <span className="text-[11px] text-slate-700 font-bold">Señal de Red</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ffd9de] text-[#663a42] font-bold text-[9px] uppercase tracking-wider">Sin respuesta</span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3">
              <button
                onClick={handleRetryConnection}
                disabled={isVerifying}
                className="w-full py-4 px-6 rounded-full bg-[#386458] text-white font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-85"
                style={{ borderRadius: "4px" }}
              >
                <span className={`material-symbols-outlined text-[20px] font-bold ${isVerifying ? "animate-spin" : ""}`}>sync</span>
                <span>{isVerifying ? "Verificando santuario..." : retryStatus ? retryStatus : "Reintentar Conexión"}</span>
              </button>

              <button
                onClick={() => handleOfflineAction("Continuar en Modo Offline")}
                className="w-full py-4 px-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer"
                style={{ borderRadius: "4px" }}
              >
                <span className="material-symbols-outlined text-[20px] text-slate-500 font-bold">offline_pin</span>
                <span>Continuar en Modo Offline</span>
              </button>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-white border border-slate-100 p-2 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[18px] text-[#386458] font-bold">library_books</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Borradores Locales</span>
            </div>
            <p className="text-xs font-bold text-slate-900">3 registros guardados</p>
            <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-relaxed">Se enviarán automáticamente al recuperar la señal.</p>
          </div>

          <div className="rounded-xl bg-white border border-slate-100 p-2 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[18px] text-[#42617d] font-bold">sync_saved_locally</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Última Sincronización</span>
            </div>
            <p className="text-xs font-bold text-slate-900">Hoy • 09:48 AM</p>
            <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-relaxed">Culto Dominical y lista fraternal completos.</p>
          </div>
        </div>

        <div className="rounded-xl bg-white border border-slate-100 p-2 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#bdeddd]/40 text-[#386458] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px] font-bold">support_agent</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 leading-none">Soporte Pastoral 24/7</p>
            <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-relaxed">Si la conexión se extiende, escríbenos y te ayudamos a resguardar tus datos.</p>
          </div>
          <button
            onClick={() => handleOfflineAction("Contactar Soporte")}
            className="ml-auto shrink-0 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] font-bold">chat</span>
          </button>
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-100 p-2 text-center">
          <span className="material-symbols-outlined text-[#386458] text-[20px] mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
          <p className="text-[10px] text-slate-500 font-semibold italic leading-relaxed mt-1">
            «En paz me acostaré y asimismo dormiré, porque solo tú, Jehová, me haces vivir confiado.» — Salmo 4:8
          </p>
        </div>

      </div>

    </div>
  );
}