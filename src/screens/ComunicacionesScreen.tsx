import React, { useState } from "react";

// ==========================================================================
// COMPONENTE: PANTALLA 3 - COMUNICACIONES (Stitch)
// ==========================================================================
export default function ComunicacionesScreen({ 
  onNavigateToForm,
  onNavigateToInicio,
  onNavigateToWA
}: { 
  onNavigateToForm: () => void;
  onNavigateToInicio: () => void;
  onNavigateToWA?: () => void;
}) {
  const [selectedFilter, setSelectedFilter] = useState<"todos" | "campañas" | "lecturas">("todos");
  const [isModalOpen, setIsDraftModalOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const historyItems = [
    { title: "Vigilia de Oración de Primavera", channel: "WhatsApp • 1,420 contactos", date: "Ayer, 19:40", status: "Enviado", badgeColor: "bg-[#bdeddd] text-[#214e43]", dotColor: "bg-[#386458]", bgIconColor: "bg-[#bdeddd]/45", textColor: "text-[#386458]", icon: "mark_chat_read" },
    { title: "Devocional Semanal - Guía de Oración", channel: "Email • Segmento Devocional", date: "Mañana, 07:00", status: "Programado", badgeColor: "bg-[#cde5ff] text-[#294964]", dotColor: "bg-[#42617d]", bgIconColor: "bg-[#cde5ff]/60", textColor: "text-[#42617d]", icon: "upcoming" },
    { title: "Volumen 19: Devocional Semanal", channel: "Boletín • Edición imprimible", date: "Editado hace 2h", status: "Borrador", badgeColor: "bg-[#ffd9de] text-[#663a42]", dotColor: "bg-[#7f4e57]", bgIconColor: "bg-[#ffd9de]/80", textColor: "text-[#7f4e57]", icon: "draft" },
    { title: "Recordatorio: Campanas Matutinas", channel: "WhatsApp • Grupo General", date: "Lun 14, 06:15", status: "Enviado", badgeColor: "bg-[#bdeddd] text-[#214e43]", dotColor: "bg-[#386458]", bgIconColor: "bg-[#bdeddd]/45", textColor: "text-[#386458]", icon: "notifications_active" }
  ];

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    setIsDraftModalOpen(false);
    setSuccessToast("¡Mensaje enviado con intención y paz a toda la comunidad!");
    setBroadcastMessage("");
    setTimeout(() => setSuccessToast(null), 3500);
  };

  return (
    <div className="flex-1 pb-24 relative overflow-hidden flex flex-col justify-between animate-[fadeIn_0.25s_ease-out]">
      <div className="flex flex-col w-full px-5 space-y-5 relative">
        
        {successToast && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded shadow-lg z-50 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
            <span>{successToast}</span>
          </div>
        )}

        <div className="relative w-full rounded-2xl p-5 shadow-sm flex flex-col space-y-3 overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#386458]/10 blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#386458]/10 text-[#386458]">
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>church</span>
              <span className="text-[10px] font-bold">Canal Pastoral</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Conexión y comunidad</span>
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Comunicaciones del Templo</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Comparte la Palabra y guía a tu comunidad con canales dedicados a la fe.
            </p>
          </div>

          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => setSelectedFilter("todos")}
              className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                selectedFilter === "todos" ? "bg-[#386458] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Todos los Canales
            </button>
            <button 
              onClick={() => setSelectedFilter("campañas")}
              className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                selectedFilter === "campañas" ? "bg-[#386458] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Campañas Activas
            </button>
            <button 
              onClick={() => setSelectedFilter("lecturas")}
              className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                selectedFilter === "lecturas" ? "bg-[#386458] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Lecturas Abiertas
            </button>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-900">Vías Principales</h3>
            <span className="text-[11px] text-[#386458] font-bold">3 activos</span>
          </div>

          {/* WhatsApp */}
          <div className="relative rounded-[10px] bg-white border border-slate-100 p-5 shadow-[0_8px_24px_-6px_rgba(47,62,70,0.08)] flex flex-col justify-between overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#bdeddd]/45 flex items-center justify-center text-[#386458] shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">chat</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">WhatsApp</h4>
                    <span className="px-2 py-0.5 rounded-full bg-[#bdeddd] text-[#214e43] text-[9px] font-bold">98.2% entrega</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Anuncios masivos e inmediatos</p>
                </div>
              </div>
            </div>
            
            <div className="my-3.5 p-3 rounded-xl bg-slate-50/80 flex items-center justify-between border border-slate-100">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Alcance potencial</span>
                <span className="text-sm font-bold text-slate-800">1,420 practicantes</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#386458]">schedule</span>
                Último: Hoy, 08:30
              </span>
              <button 
                onClick={() => onNavigateToWA ? onNavigateToWA() : setIsDraftModalOpen(true)}
                className="px-4 py-2.5 rounded-full bg-[#386458] hover:bg-[#2c4e45] text-white text-[11px] font-bold shadow-md active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                style={{ borderRadius: "4px" }}
              >
                <span className="material-symbols-outlined text-[15px]">send</span>
                Nuevo Mensaje
              </button>
            </div>
          </div>

          {/* Email */}
          <div className="relative rounded-[10px] bg-white border border-slate-100 p-5 shadow-[0_8px_24px_-6px_rgba(47,62,70,0.08)] flex flex-col justify-between overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#cde5ff]/60 flex items-center justify-center text-[#42617d] shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">mail</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">Email</h4>
                    <span className="px-2 py-0.5 rounded-full bg-[#cde5ff] text-[#294964] text-[9px] font-bold">Apertura 46%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Newsletters oficiales y retiros</p>
                </div>
              </div>
            </div>

            <div className="my-3.5 p-3 rounded-xl bg-slate-50/80 flex items-center justify-between border border-slate-100">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Suscriptores activos</span>
                <span className="text-sm font-bold text-slate-800">3.890 Hermanos</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#42617d]">mark_email_read</span>
                Edición #42 enviada
              </span>
              <button 
                onClick={() => setIsDraftModalOpen(true)}
                className="px-4 py-2.5 rounded-full bg-[#386458] hover:bg-[#2c4e45] text-white text-[11px] font-bold shadow-md active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                style={{ borderRadius: "4px" }}
              >
                <span className="material-symbols-outlined text-[15px]">edit_note</span>
                Nuevo Mensaje
              </button>
            </div>
          </div>
        </div>

        {/* Historial */}
        <div className="flex flex-col space-y-3 pb-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-900">Historial de Envíos</h3>
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 p-2 shadow-sm space-y-3">
            {historyItems.map((item, idx) => (
              <div key={idx} className="p-2 rounded-xl bg-slate-50/50 hover:bg-slate-50 flex flex-col gap-1.5 border border-slate-100/50">
                {/* Criterio del bloque: fila 1 avatar + título + badge, fila 2 canal fuera de la fila */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-full ${item.bgIconColor} flex items-center justify-center shrink-0`}>
                    <span className={`material-symbols-outlined text-[20px] ${item.textColor}`}>{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs font-bold text-slate-800 truncate leading-tight">{item.title}</span>
                  </div>
                  <span className={`ml-auto shrink-0 px-2.5 py-1 rounded-full ${item.badgeColor} text-[9px] font-bold uppercase inline-flex items-center gap-1 shadow-sm`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor}`}></span>
                    {item.status}
                  </span>
                </div>
                <span className="block text-[10px] text-slate-400 font-medium truncate leading-relaxed">{item.channel}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal borrador / nuevo mensaje (antes estado fantasma: se activaba sin render) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-900/40 animate-[fadeIn_0.2s_ease-out]"
              onClick={() => setIsDraftModalOpen(false)}
            />
            <div className="relative w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl animate-[scaleIn_0.15s_ease-out]">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-slate-900">Nuevo mensaje</h3>
                <button
                  type="button"
                  onClick={() => setIsDraftModalOpen(false)}
                  aria-label="Cerrar"
                  className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 active:scale-90 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mb-3">Borrador del canal pastoral.</p>
              <form onSubmit={handleSendBroadcast} className="space-y-3">
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Escribe el mensaje a la comunidad..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl text-xs border border-slate-200 focus:border-[#386458] focus:outline-none resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-[#386458] hover:bg-[#2c4e45] active:scale-[0.98] text-white py-3 px-6 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  style={{ borderRadius: "4px" }}
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  Enviar mensaje
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
