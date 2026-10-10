import React, { useState, useRef } from "react";

// ==========================================================================
// COMPONENTE: PANTALLA 2 - INICIO (Panel Pastoral)
// ==========================================================================
export default function InicioScreen({ 
  onNavigateToForm, 
  onNavigateToHistory,
  onNavigateToModule,
  onOpenMenu,
  nombreUsuario
}: { 
  onNavigateToForm: () => void; 
  onNavigateToHistory: () => void; 
  onNavigateToModule?: (screen: "celulas" | "personas" | "roles" | "multimedia") => void;
  onOpenMenu?: () => void;
  nombreUsuario?: string;
}) {
  const [isCultoActive, setIsCultoActive] = useState(false);
  const [activeDayInfo, setActiveDayInfo] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const progressIntervalRef = useRef<any>(null);

  const capitalizeEs = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const todayLabel = (() => {
    const now = new Date();
    const weekday = new Intl.DateTimeFormat("es-ES", { weekday: "long" }).format(now);
    const monthShort = new Intl.DateTimeFormat("es-ES", { month: "short" }).format(now).replace(".", "");
    return `${capitalizeEs(weekday)}, ${now.getDate()} de ${capitalizeEs(monthShort)}`;
  })();

  const daysData = [
    { day: "L", height: "h-14", count: "120 asistencias", barColor: "bg-[#d5e9e1]" },
    { day: "M", height: "h-20", count: "210 asistencias", barColor: "bg-[#a8d2c4]" },
    { day: "M", height: "h-[72px]", count: "190 asistencias", barColor: "bg-[#c0ded3]" },
    { day: "J", height: "h-24", count: "340 asistencias", barColor: "bg-[#507d70]" },
    { day: "V", height: "h-28", count: "480 asistencias", barColor: "bg-[#386458]" },
    { day: "S", height: "h-[88px]", count: "290 asistencias", barColor: "bg-[#7fb3a1]" },
    { day: "D", height: "h-32", count: "850+ asistencias", barColor: "bg-[#214e43]", active: true },
  ];

  const toggleCulto = () => {
    setIsCultoActive((prev) => !prev);
  };

  const handlePlayAudio = () => {
    if (isPlayingAudio) {
      clearInterval(progressIntervalRef.current);
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      progressIntervalRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressIntervalRef.current);
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 5;
        });
      }, 300);
    }
  };

  return (
    <div className="flex-1 pb-5 relative overflow-hidden flex flex-col justify-between animate-[fadeIn_0.25s_ease-out] font-body-md text-body-md text-[#0e1d25]">
      <div className="flex flex-col w-full px-5 pb-10 space-y-5 relative">
        {/* Halo del hero en vidrio blanco (solo claro); en oscuro conserva el verde tenue. */}
        <div className="absolute -top-16 -left-20 w-80 h-80 rounded-full border blur-3xl pointer-events-none [background-color:color-mix(in_oklab,#ffffff6e_40%,#00000000)] [border-color:oklch(0.97_0.01_0_/_0.31)] dark:bg-[#386458]/10 dark:border-transparent"></div>
        
        {/* Warm Welcome Hero Card */}
        <div className="relative w-full rounded-[10px] overflow-hidden bg-white/40 p-5 shadow-sm border border-slate-100">
          
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-white/50 via-transparent to-transparent"></div>
          
          <div className="relative z-10 flex flex-col space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#386458]/10 text-[#386458]">
                <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>folded_hands</span>
                <span className="text-[11px] font-bold tracking-wide">Paz y Gracia</span>
              </div>
              <span className="text-[11px] text-slate-500/80 font-medium">{todayLabel}</span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{nombreUsuario ? `Buenos días, ${nombreUsuario}` : "Buenos días, Pastor Samuel"}</h2>
              <p className="text-[12px] text-slate-500 italic mt-1 leading-relaxed">"La paz os dejo, mi paz os doy; que sus corazones descansen hoy con alegría." <span className="not-italic font-bold text-[11px] text-[#386458]">— Juan 14:27</span></p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1.5">
              <div className="flex flex-col items-center justify-center p-2 rounded-[10px] bg-[#bdeddd]/30 border border-slate-100">
                <span className="material-symbols-outlined text-[#386458] text-[20px] mb-0.5">church</span>
                <span className="text-sm font-bold text-slate-900">3</span>
                <span className="text-[10px] text-slate-400 text-center leading-none">Servicios Hoy</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-[10px] bg-[#cde5ff]/40 border border-blue-100/30">
                <span className="material-symbols-outlined text-[#42617d] text-[20px] mb-0.5">groups</span>
                <span className="text-sm font-bold text-[#001d32]">850+</span>
                <span className="text-[10px] text-[#294964]/80 text-center leading-none">Asistencia</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-[10px] bg-[#ffd9de]/60 border border-emerald-100/30">
                <span className="material-symbols-outlined text-[#7f4e57] text-[20px] mb-0.5">favorite</span>
                <span className="text-sm font-bold text-[#002019]">12</span>
                <span className="text-[10px] text-[#214e43]/80 text-center leading-none">Nuevos Hnos.</span>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={toggleCulto}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-5 text-xs font-bold transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                  isCultoActive 
                    ? "bg-[#ba1a1a] text-white" 
                    : "bg-[#386458] hover:bg-[#2c4e45] text-white"
                }`}
                style={{ borderRadius: "4px" }}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isCultoActive ? "pause_circle" : "play_circle"}
                </span>
                <span>{isCultoActive ? "Finalizar Culto Central" : "Iniciar Culto Central"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Ritmo Comunitario */}
        <div className="w-full rounded-[10px] bg-white/85 p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${isCultoActive ? "bg-rose-500" : "bg-[#386458]"}`}></span>
              <h3 className="text-xs font-bold text-slate-900">Ritmo Comunitario</h3>
            </div>
            <span className="text-[10px] text-[#386458] font-bold px-2 py-0.5 rounded-full bg-[#bdeddd]/60">Semana Activa</span>
          </div>

          <div className="flex items-end justify-between pt-4 pb-1 px-1 min-h-44 relative">
            {daysData.map((d, idx) => (
              <div 
                key={idx}
                onMouseEnter={() => setActiveDayInfo(`${d.day}: ${d.count}`)}
                onMouseLeave={() => setActiveDayInfo(null)}
                className="flex flex-col items-center space-y-2 cursor-pointer group"
              >
                <div className={`w-5 rounded-full transition-all duration-300 group-hover:opacity-80 ${d.height} ${d.barColor} ${
                  d.active ? "shadow-[0_2px_8px_rgba(56,100,88,0.35)]" : ""
                }`}></div>
                <span className={`text-[10px] ${d.active ? "text-[#386458] font-bold" : "text-slate-400"}`}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Módulos de Gestión */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Módulos de Gestión</h3>
            <button onClick={() => onOpenMenu?.()} className="text-[11px] text-[#386458] font-bold hover:underline cursor-pointer">Ver Todos</button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div onClick={() => onNavigateToModule?.("celulas")} className="flex flex-col p-4 rounded-[10px] bg-white border border-slate-100 shadow-sm hover:bg-[#386458]/5 hover:border-[#386458]/20 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-[#bdeddd]/45 text-[#386458] flex items-center justify-center mb-2.5">
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">Eventos / Células</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Grupos Pequeños</p>
            </div>

            <div onClick={onNavigateToForm} className="flex flex-col p-4 rounded-[10px] bg-white border border-slate-100 shadow-sm hover:bg-[#386458]/5 hover:border-[#386458]/20 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-[#cde5ff]/60 text-[#42617d] flex items-center justify-center mb-2.5">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">Finanzas</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Ofrendas y diezmos</p>
            </div>

            <div onClick={() => onNavigateToModule?.("personas")} className="flex flex-col p-4 rounded-[10px] bg-white border border-slate-100 shadow-sm hover:bg-[#386458]/5 hover:border-[#386458]/20 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-[#bdeddd]/45 text-[#386458] flex items-center justify-center mb-2.5">
                <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">Asistencia</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Check-in de miembros</p>
            </div>

            <div onClick={() => onNavigateToModule?.("roles")} className="flex flex-col p-4 rounded-[10px] bg-white border border-slate-100 shadow-sm hover:bg-[#386458]/5 hover:border-[#386458]/20 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-[#ffd9de]/80 text-[#7f4e57] flex items-center justify-center mb-2.5">
                <span className="material-symbols-outlined text-[20px]">menu_book</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">Gestión Pastoral</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Roles y Privilegios</p>
            </div>

            <div onClick={() => onNavigateToModule?.("personas")} className="flex flex-col p-4 rounded-[10px] bg-white border border-slate-100 shadow-sm hover:bg-[#386458]/5 hover:border-[#386458]/20 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-[#cde5ff]/50 text-[#42617d] flex items-center justify-center mb-2.5">
                <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">Voluntarios</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Servicio & Ujieres</p>
            </div>

            <div onClick={() => onNavigateToModule?.("multimedia")} className="flex flex-col p-4 rounded-[10px] bg-white border border-slate-100 shadow-sm hover:bg-[#386458]/5 hover:border-[#386458]/20 transition-all cursor-pointer font-sans">
              <div className="w-10 h-10 rounded-full bg-[#507d70]/20 text-[#386458] flex items-center justify-center mb-2.5">
                <span className="material-symbols-outlined text-[20px]">podcasts</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">Multimedia</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Audio & Streaming</p>
            </div>

            <div onClick={onNavigateToHistory} className="col-span-2 flex flex-col gap-1.5 p-4 rounded-[10px] bg-white border border-slate-100 shadow-sm hover:bg-slate-50 transition-all cursor-pointer" role="button">
              {/* Criterio del bloque: fila 1 avatar + título + badge, fila 2 detalle fuera de la fila */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#bdeddd]/45 text-[#386458] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate leading-none">Comunicaciones</h4>
                </div>
                <span className="ml-auto shrink-0 px-2.5 py-1 rounded-full bg-[#386458] text-white text-[9px] font-bold uppercase">98% enviado</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate leading-relaxed">Boletín dominical & SMS</p>
            </div>
          </div>
        </div>

        {/* Devocional — criterio del bloque: fila 1 avatar + nombres (eyebrow + título) + play, fila 2 detalle fuera de la fila */}
        <div className="relative w-full rounded-[10px] bg-white/95 backdrop-blur-md p-4 shadow-sm overflow-hidden flex flex-col gap-2 border border-slate-100">
          <div className="flex items-center gap-4 min-w-0">
            <img src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=150" alt="Devocional" className="w-14 h-14 rounded-full object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1 text-[#386458]">
                <span className="material-symbols-outlined text-[15px]">volunteer_activism</span>
                <span className="text-[10px] font-bold uppercase tracking-wider truncate">Devocional</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">Momento de Oración y Alabanza</h4>
            </div>
            <button onClick={handlePlayAudio} className="ml-auto w-9 h-9 rounded-full bg-[#386458] text-white flex items-center justify-center shrink-0 shadow-md cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">{isPlayingAudio ? "pause" : "play_arrow"}</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 font-medium truncate leading-relaxed">{isPlayingAudio ? `Reproduciendo... ${audioProgress}%` : "Guía de 5 minutos antes del servicio"}</p>
          {isPlayingAudio && (
            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
              <div className="bg-[#386458] h-full transition-all duration-300" style={{ width: `${audioProgress}%` }} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
