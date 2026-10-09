import React, { useState } from "react";

interface OnboardingPillar {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  status: "prioritario" | "pendiente" | "completado";
  actionText: string;
}

export default function OnboardingSetupScreen({ onBack }: { onBack?: () => void }) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pillars, setPillars] = useState<OnboardingPillar[]>([
    {
      id: 1,
      title: "Directorio de Familias",
      subtitle: "Sube tu listado en XLSX para activar el censo fraternal dominical.",
      icon: "group_add",
      status: "prioritario",
      actionText: "Subir Lista"
    },
    {
      id: 2,
      title: "Células y Zonas Territoriales",
      subtitle: "Mapea tus grupos pequeños y sectores geográficos de comunión.",
      icon: "share_location",
      status: "pendiente",
      actionText: "Configurar Zonas"
    },
    {
      id: 3,
      title: "Cuentas y Fondos Financieros",
      subtitle: "Establece tus cuentas de diezmos, misiones y acción comunitaria.",
      icon: "account_balance_wallet",
      status: "pendiente",
      actionText: "Crear Cuentas"
    },
    {
      id: 4,
      title: "Primer Culto o Evento",
      subtitle: "Planifica el orden litúrgico de tu próximo culto de Alabanza.",
      icon: "calendar_month",
      status: "pendiente",
      actionText: "Crear Culto"
    }
  ]);

  const completedCount = pillars.filter(p => p.status === "completado").length;
  const progressPercent = Math.round((completedCount / pillars.length) * 100);

  const togglePillarStatus = (pillarId: number) => {
    const target = pillars.find(p => p.id === pillarId);
    if (!target) return;

    const nextStatus = target.status === "completado" ? "pendiente" : "completado";

    // El updater se mantiene puro (sin efectos secundarios) y el toast
    // se programa fuera de él, para que StrictMode no lo duplique.
    setPillars(prev => prev.map(pillar =>
      pillar.id === pillarId ? { ...pillar, status: nextStatus } : pillar
    ));

    setToastMessage(`Pilar "${target.title}" marcado como ${nextStatus.toUpperCase()}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getActiveStepName = () => {
    const nextPending = pillars.find(p => p.status !== "completado");
    return nextPending ? nextPending.title : "¡Todos los pilares configurados!";
  };

  const notify = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex-1 pb-24 relative overflow-hidden flex flex-col justify-between animate-[fadeIn_0.25s_ease-out] font-body-md text-body-md text-[#0e1d25]">

      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#23323a] text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 border border-slate-700/30 animate-[scaleIn_0.15s_ease-out]">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
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
        <span className="min-w-0 truncate text-xs text-slate-500">IglesiaOS • Configuración Inicial</span>
      </div>

      <div className="flex flex-col w-full px-5 space-y-5">

        <div className="relative overflow-hidden rounded-xl bg-white border border-slate-100 p-5 shadow-sm">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#bdeddd]/25 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col space-y-3.5">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#bdeddd] flex items-center justify-center text-[#386458] shadow-sm border border-white">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
              </div>
              <span className="text-[10px] text-[#386458] font-bold uppercase tracking-wider bg-[#bdeddd]/40 px-2.5 py-0.5 rounded-full">Espacio de Paz & Orden</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Comienza a edificar tu congregación</h2>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                Aún no hay datos registrados en este módulo. Configura los primeros pilares para gestionar tu iglesia con orden, paz y gracia.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Progreso del Santuario</span>
                <span className="text-[10px] text-[#386458] font-bold uppercase">{completedCount} de {pillars.length} pasos ({progressPercent}%)</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden shadow-inner">
                <div className="bg-[#386458] h-full transition-all duration-500 shadow-sm" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <p className="text-[9px] text-slate-400 font-semibold mt-2">
                Paso activo recomendado: <span className="text-[#386458] font-bold">{getActiveStepName()}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3.5">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider px-1">Pilares de Configuración</h3>

          <div className="flex flex-wrap gap-2.5">
            {pillars.map((pillar) => (
              <div key={pillar.id} className="flex-1 min-w-[260px] rounded-xl bg-white border border-slate-100 p-2 shadow-sm flex flex-wrap items-start gap-3.5 justify-between">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-white ${
                    pillar.status === "completado" ? "bg-[#bdeddd] text-[#214e43]" : "bg-slate-50 text-slate-500"
                  }`}>
                    <span className="material-symbols-outlined text-[18px] font-bold">
                      {pillar.status === "completado" ? "check_circle" : pillar.icon}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900 truncate leading-none">{pillar.title}</p>
                      {pillar.status === "prioritario" && (
                        <span className="text-[8px] font-bold bg-[#ffd9de] text-[#663a42] uppercase tracking-wider px-1.5 py-0.5 rounded leading-none">Prioritario</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1.5 leading-relaxed">{pillar.subtitle}</p>
                  </div>
                </div>

                <button
                  onClick={() => togglePillarStatus(pillar.id)}
                  className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer border ${
                    pillar.status === "completado"
                      ? "bg-slate-50 text-slate-400 border-slate-200"
                      : "bg-white text-[#386458] border-slate-200 hover:bg-slate-50 shadow-sm"
                  }`}
                  style={{ borderRadius: "4px" }}
                >
                  {pillar.status === "completado" ? "Completado" : pillar.actionText}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => notify("Asistente de configuración disponible próximamente.")}
            className="w-full py-4 px-6 rounded-full bg-[#386458] hover:bg-[#2c4e45] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-[0.98] transition-all"
            style={{ borderRadius: "4px" }}
          >
            <span className="material-symbols-outlined text-[20px] font-bold">auto_awesome</span>
            <span>Configuración Rápida Guiada (5 min)</span>
          </button>
        </div>

        <div className="rounded-xl bg-[#e7f6ff] border border-slate-100 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white text-[#42617d] flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[18px] font-bold">help_outline</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 leading-none">¿Necesitas acompañamiento?</p>
            <button
              onClick={() => notify("Asesor de IglesiaOS disponible próximamente.")}
              className="text-[10px] text-[#42617d] hover:underline font-bold uppercase mt-1 leading-none cursor-pointer"
            >
              Chatear con un asesor
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}