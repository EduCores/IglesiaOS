import React, { useState } from "react";

interface Appointment {
  id: number;
  initials: string;
  name: string;
  type: string;
  status: string;
  date: string;
  time: string;
  location: string;
  icon: string;
  isCustom?: boolean;
}

interface ConfidentialNote {
  id: number;
  title: string;
  tag: string;
  timeAgo: string;
  content: string;
  icon: string;
  badgeBg: string;
  badgeText: string;
  btnText: string;
}

export default function PastoralScreen({ onNavigateToSacramentos, onNavigateToBitacora }: { onNavigateToSacramentos?: () => void; onNavigateToBitacora?: () => void }) {
  const [showAddApptModal, setShowAddApptModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form states for new appointment
  const [newApptName, setNewApptName] = useState("");
  const [newApptType, setNewApptType] = useState("");
  const [newApptDate, setNewApptDate] = useState("Mañana");
  const [newApptTime, setNewApptTime] = useState("10:00 AM");
  const [newApptLocation, setNewApptLocation] = useState("Hogar");

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      initials: "JP",
      name: "Hermano Juan Pérez",
      type: "Acompañamiento familiar",
      status: "Programado",
      date: "Mañana",
      time: "10:00 AM",
      location: "Hogar",
      icon: "calendar_month"
    },
    {
      id: 2,
      initials: "FG",
      name: "Familia García",
      type: "Oración en hogar y gratitud",
      status: "Confirmado",
      date: "Jueves",
      time: "4:30 PM",
      location: "Presencial",
      icon: "home"
    }
  ]);

  const [confidentialNotes, setConfidentialNotes] = useState<ConfidentialNote[]>([
    {
      id: 1,
      title: "Discipulado: Hna. María",
      tag: "Privado",
      timeAgo: "Ayer",
      content: "Sesión de consejería pastoral. Enfoque en la lectura de Efesios y la oración para confiar en Dios ante la incertidumbre.",
      icon: "lock",
      badgeBg: "bg-[#ffd9de] text-[#663a42]",
      badgeText: "tertiary",
      btnText: "Notas Privadas"
    },
    {
      id: 2,
      title: "Fortalecimiento Familiar",
      tag: "Privado",
      timeAgo: "Hace 3 días",
      content: "Acuerdos de escucha activa en pareja. Próximo seguimiento pactado para revisión de compromisos y momento devocional conjunto.",
      icon: "shield",
      badgeBg: "bg-[#cde5ff] text-[#294964]",
      badgeText: "secondary",
      btnText: "Ver Ficha"
    }
  ]);

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApptName.trim()) return;

    const initials = newApptName
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    const newAppt: Appointment = {
      id: appointments.length + 1,
      initials: initials || "AP",
      name: newApptName,
      type: newApptType || "Consejería espiritual",
      status: "Programado",
      date: newApptDate,
      time: newApptTime,
      location: newApptLocation,
      icon: newApptLocation === "Hogar" ? "home" : "calendar_month",
      isCustom: true
    };

    setAppointments([...appointments, newAppt]);
    setShowAddApptModal(false);
    setNewApptName("");
    setNewApptType("");
    setSuccessToast(`¡Cita con "${newApptName}" programada con éxito!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="flex-1 pb-24 relative overflow-hidden flex flex-col justify-between animate-[fadeIn_0.25s_ease-out] font-body-md text-body-md text-[#0e1d25]">
      
      {/* Toast Notificador */}
      {successToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded shadow-lg z-50 flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
          <span>{successToast}</span>
        </div>
      )}

      <div className="flex flex-col w-full px-5 space-y-5">
        
        {/* Cabecera Contextual */}
        <section className="flex flex-col items-start pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e0f0fb] text-[#386458] mb-2 backdrop-blur-md">
            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
            <span className="text-[10px] font-bold tracking-wide uppercase">Cuidado & Acompañamiento</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Gestión Pastoral</h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Acompañamiento espiritual y pastoral para tu comunidad.
          </p>
        </section>

        {/* Resumen de Actividad Diaria */}
        <section className="grid grid-cols-2 gap-3.5">
          {/* Stat 1: Visitas Realizadas */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[#bdeddd] flex items-center justify-center text-[#386458] shrink-0">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <span className="text-[9px] text-[#386458] font-bold px-2 py-0.5 rounded-full bg-[#e7f6ff]">Este mes</span>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 leading-none mb-1">18</p>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Visitas Realizadas</p>
            </div>
            <div className="mt-3.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#386458] h-full rounded-full" style={{ width: "82%" }}></div>
            </div>
          </div>

          {/* Stat 2: Consejerías Pendientes */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[#cde5ff] flex items-center justify-center text-[#42617d] shrink-0">
                <span className="material-symbols-outlined text-[20px]">schedule</span>
              </div>
              <span className="text-[9px] text-[#42617d] font-bold px-2 py-0.5 rounded-full bg-[#e7f6ff]">Atención</span>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 leading-none mb-1">4</p>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Consejerías Pendientes</p>
            </div>
            <div className="mt-3.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#42617d] h-full rounded-full" style={{ width: "45%" }}></div>
            </div>
          </div>
        </section>

        {/* Botón de Acción Rápida */}
        <section className="w-full flex flex-col gap-2">
          <button 
            onClick={() => setShowAddApptModal(true)}
            className="w-full h-12 bg-[#386458] hover:bg-[#2c4e45] text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer"
            style={{ borderRadius: "4px" }}
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Programar Nueva Cita</span>
          </button>
          
          <button 
            onClick={() => onNavigateToSacramentos ? onNavigateToSacramentos() : alert("Cargando solicitudes sacramentales...")}
            className="w-full h-12 bg-[#e7f6ff] hover:bg-[#e0f0fb] text-[#42617d] rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all cursor-pointer border border-[#bddefe]/40"
            style={{ borderRadius: "4px" }}
          >
            <span className="material-symbols-outlined text-[20px]">water_drop</span>
            <span>Gestionar Solicitudes Sacramentales</span>
          </button>
        </section>

        {/* Próximas Visitas & Encuentros */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#386458] text-[20px] font-bold">calendar_today</span>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Próximas Visitas & Encuentros</h3>
            </div>
            <button 
              onClick={() => alert("Mostrando agenda completa...")}
              className="text-[11px] text-[#386458] font-bold hover:underline cursor-pointer"
            >
              Ver agenda
            </button>
          </div>

          {/* Cards Loop */}
          {appointments.map((appt) => (
            <div 
              key={appt.id}
              onClick={() => onNavigateToBitacora ? onNavigateToBitacora() : alert("Cargando bitácora...")}
              className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3.5 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-inner ${
                    appt.id % 2 === 0 ? "bg-[#cde5ff] text-[#294964]" : "bg-slate-100 text-[#386458]"
                  }`}>
                    {appt.initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{appt.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium leading-none mt-1">{appt.type}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  appt.id % 2 === 0 ? "bg-[#bdeddd] text-[#214e43]" : "bg-slate-200 text-slate-500"
                }`}>
                  {appt.status}
                </span>
              </div>

              <div className="flex items-center gap-4 pt-1.5 border-t border-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[17px] text-[#386458] font-bold">calendar_month</span>
                  <span>{appt.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[17px] text-[#386458] font-bold">schedule</span>
                  <span>{appt.time}</span>
                </div>
                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="material-symbols-outlined text-[17px] text-[#386458] font-bold">
                    {appt.location === "Hogar" ? "home" : "location_on"}
                  </span>
                  <span>{appt.location}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Notas Confidenciales de Consejería */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7f4e57] text-[20px] font-bold">lock</span>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notas Confidenciales</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100">
              Privado
            </span>
          </div>

          {/* Notes Loop */}
          {confidentialNotes.map((note) => (
            <div 
              key={note.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full ${note.badgeBg} flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-[15px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {note.icon}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">{note.title}</h4>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{note.timeAgo}</span>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                {note.content}
              </p>

              <div className="pt-1.5 flex justify-end">
                <button 
                  onClick={() => alert(`Accediendo de forma segura y encriptada a la ficha confidencial...`)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                    note.id === 1 ? "bg-[#ffd9de] text-[#663a42] hover:bg-[#ffd9de]/80" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  style={{ borderRadius: "4px" }}
                >
                  {note.btnText}
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Tarjeta de Reflexión Pastoral */}
        <section className="relative rounded-xl overflow-hidden shadow-md border border-slate-100">
          <div 
            className="bg-cover bg-center w-full min-h-[170px] relative p-5 flex flex-col justify-between" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBESo_t8ywS3db0KuOOBc4xLozowA_u13ain0arC7rk-nQEl28YJ2xkAW-KP8UAM8JDrJ6zsM5_1UhQ6uc3_yMtS6fLM3UtqbHYwb-JxHL5DLy3vjdlt_Q8T4J6La3MEoCa-x1alG2VDTAb_8r_fz4udi8838RHy7O6EIpeo-8VVEEy_QylfTdj3F1Jtbx-sx_c8hWLhglnXciLhKbS0ZFBXcWfGPpclzhOfCBF8BwyRBO82g07-yes')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-[#386458]/40 backdrop-blur-[1px]"></div>
            
            <div className="relative z-10 flex items-center justify-between text-white">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
                <span className="material-symbols-outlined text-[15px]">menu_book</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Reflexión Pastoral</span>
              </div>
              <span className="material-symbols-outlined text-[20px] text-white/80">format_quote</span>
            </div>

            <div className="relative z-10 mt-6 space-y-1">
              <p className="text-xs font-bold text-white italic leading-relaxed">
                “El pastor que ora y acompaña restaura el corazón afligido.”
              </p>
              <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">
                Paz y paciencia para la jornada de hoy
              </p>
              {/* Versículo del día: formato «texto» — Libro x:y, igual que
                  OfflineSync (#155) y ConfirmacionRegistro (#135). */}
              <p className="text-[10px] text-white/85 font-semibold italic leading-relaxed pt-1">
                «La paz os dejo, mi paz os doy; no se turbe vuestro corazón, ni tenga miedo.» — Juan 14:27
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* Modal interactivo de programación de cita */}
      {showAddApptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl animate-[scaleIn_0.2s_ease-out]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800">Programar Nueva Cita</h3>
              <button onClick={() => setShowAddApptModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddAppointment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 font-bold uppercase">Nombre Completo</label>
                <input
                  type="text"
                  value={newApptName}
                  onChange={(e) => setNewApptName(e.target.value)}
                  placeholder="ej: Hermano Mateo Rojas"
                  className="w-full px-4 py-3 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:ring-1 focus:ring-[#386458] outline-none"
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 font-bold uppercase">Motivo / Tipo de Encuentro</label>
                <input
                  type="text"
                  value={newApptType}
                  onChange={(e) => setNewApptType(e.target.value)}
                  placeholder="ej: Oración familiar, consejería..."
                  className="w-full px-4 py-3 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:ring-1 focus:ring-[#386458] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-500 font-bold uppercase">Fecha</label>
                  <input
                    type="text"
                    value={newApptDate}
                    onChange={(e) => setNewApptDate(e.target.value)}
                    placeholder="ej: Mañana o Jueves"
                    className="w-full px-4 py-3 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:ring-1 focus:ring-[#386458] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-500 font-bold uppercase">Hora</label>
                  <input
                    type="text"
                    value={newApptTime}
                    onChange={(e) => setNewApptTime(e.target.value)}
                    placeholder="ej: 10:00 AM"
                    className="w-full px-4 py-3 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:ring-1 focus:ring-[#386458] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 font-bold uppercase">Ubicación / Modalidad</label>
                <select
                  value={newApptLocation}
                  onChange={(e) => setNewApptLocation(e.target.value)}
                  className="w-full px-4 py-3 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:ring-1 focus:ring-[#386458] bg-white outline-none"
                >
                  <option value="Hogar">Visita en Hogar</option>
                  <option value="Presencial">Oficina Iglesia</option>
                  <option value="Online">Videollamada Online</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddApptModal(false)}
                  className="flex-1 border border-slate-200 text-slate-600 py-2.5 text-xs font-bold hover:bg-slate-50"
                  style={{ borderRadius: "4px" }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#386458] hover:bg-[#2c4e45] text-white py-2.5 text-xs font-bold shadow-md"
                  style={{ borderRadius: "4px" }}
                >
                  Programar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
