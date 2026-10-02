import React, { useState } from "react";

export default function CultoVivoScreen() {
  const [activeTab, setActiveTab] = useState<"cronograma" | "voluntarios" | "checklist">("cronograma");
  
  // Checklist State to make it interactively functional!
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Elementos de Santa Cena preparados en mesa", checked: true },
    { id: 2, text: "Test de baterías en micrófonos inalámbricos", checked: true },
    { id: 3, text: "Aromatización y climatización a 21°C", checked: true },
    { id: 4, text: "Sobres de diezmos reposicionados en bancos", checked: false }
  ]);

  const toggleChecklistItem = (id: number) => {
    setChecklist(prev =>
      prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  };

  return (
    <div className="flex-1 pb-24 relative overflow-hidden flex flex-col justify-between animate-[fadeIn_0.25s_ease-out] font-body-md text-body-md text-[#0e1d25]">
      
      {/* Ambient Decorative Blurs */}
      <div className="fixed top-20 right-4 w-56 h-56 rounded-full bg-[#cde5ff]/40 blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed top-96 -left-12 w-64 h-64 rounded-full bg-[#bdeddd]/30 blur-3xl pointer-events-none -z-10"></div>

      <div className="flex flex-col w-full px-5 space-y-5">
        
        {/* Cabecera de Evento Principal */}
        <section className="relative rounded-2xl overflow-hidden shadow-md bg-white border border-slate-100">
          <div 
            className="w-full h-80 bg-cover bg-center relative flex flex-col justify-between p-5" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCFidNdOOMK-Gc1IlEvVisENzHoO1-ixW45S5GfWQkW_zxYISoGnZIFSjLRpUncMXBHxm39TE7O7BLGp31I3AYuJ4pOmPeEKKz2Kb9snNgg4eyDhI864cehrbiTv5KYXpS5bmooWSPVIVzk7VxUbe4oOzvcj1z-GPoNEfUvZir-Bl4VbQPzNWtTwtWde95Pj2QnUeoaocAuY-bMyMMnBiKM5hKaS3uTljA6Md-suUsf7Xvm6x6myS-3')" }}
          >
            {/* Atmospheric Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/20"></div>
            
            {/* Top Badges Row */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-slate-800 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#386458] animate-pulse"></span>
                En 2 días • Dom 10:30 AM
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#bddefe]/95 backdrop-blur-md text-[#294964] text-[10px] font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[15px] font-bold">event_seat</span>
                85% Confirmados
              </span>
            </div>

            {/* Bottom Card Content */}
            <div className="relative z-10 space-y-4">
              <div>
                <span className="text-[9px] text-[#bdeddd] font-bold uppercase tracking-widest leading-none">Servicio Dominical Principal</span>
                <h2 className="text-base font-bold text-white tracking-tight mt-0.5">Culto de Adoración & Santa Cena</h2>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-medium leading-none">Comunidad central, pan compartido y renovación espiritual matutina</p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/10">
                <button 
                  onClick={() => alert("Mostrando la pauta litúrgica y versos de hoy...")}
                  className="px-4 py-2.5 rounded-full bg-[#386458] hover:bg-[#2c4e45] text-white text-[10px] font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                  style={{ borderRadius: "4px" }}
                >
                  <span>Ver Detalles del Servicio</span>
                  <span className="material-symbols-outlined text-[15px] font-bold">arrow_forward</span>
                </button>
                <div className="flex -space-x-1.5">
                  <div className="w-7 h-7 rounded-full bg-[#bddefe] flex items-center justify-center text-[#294964] text-[8px] font-bold shadow-sm">MR</div>
                  <div className="w-7 h-7 rounded-full bg-[#ffd9de] flex items-center justify-center text-[#663a42] text-[8px] font-bold shadow-sm">PS</div>
                  <div className="w-7 h-7 rounded-full bg-[#bdeddd] flex items-center justify-center text-[#214e43] text-[8px] font-bold shadow-sm">+18</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pestañas Tipo Pastilla (Chips) Interactivas */}
        <section className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
          <button 
            onClick={() => setActiveTab("cronograma")}
            className={`px-4 py-2 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              activeTab === "cronograma" ? "bg-[#386458] text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
            style={{ borderRadius: "4px" }}
          >
            <span className="material-symbols-outlined text-[18px]">schedule</span>
            <span>Cronograma en Vivo</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("voluntarios")}
            className={`px-4 py-2 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              activeTab === "voluntarios" ? "bg-[#386458] text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
            style={{ borderRadius: "4px" }}
          >
            <span className="material-symbols-outlined text-[18px]">group</span>
            <span>Voluntarios (24)</span>
          </button>

          <button 
            onClick={() => setActiveTab("checklist")}
            className={`px-4 py-2 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              activeTab === "checklist" ? "bg-[#386458] text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
            style={{ borderRadius: "4px" }}
          >
            <span className="material-symbols-outlined text-[18px]">task_alt</span>
            <span>Checklist Pre-Culto</span>
          </button>
        </section>

        {/* Contenedor Pestaña 1: Cronograma Timeline */}
        {activeTab === "cronograma" && (
          <div className="flex flex-col space-y-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Paso a Paso del Culto</h3>
              <span className="text-[10px] text-[#386458] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#386458] animate-pulse"></span>
                Sincronizado en Tiempo Real
              </span>
            </div>

            {/* Timeline Wrapper */}
            <div className="relative pl-6 space-y-4">
              {/* Continuous Soft Vertical Guide Line */}
              <div className="absolute left-2 top-3 bottom-4 w-0.5 bg-slate-200 rounded-full"></div>

              {/* Hito 1: 09:30 AM */}
              <div className="relative flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="absolute -left-6 top-4 w-5 h-5 rounded-full bg-[#386458] flex items-center justify-center text-white shadow-sm z-10">
                  <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-[#386458] uppercase">09:30 AM</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#bdeddd] text-[#214e43] text-[9px] font-bold uppercase tracking-wider">Completado ✓</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1 leading-snug">Llegada del Equipo de Intercesión & Sonido</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Revisión de frecuencias, microfonía y consagración en sala de oración.</p>
                </div>
              </div>

              {/* Hito 2: 10:15 AM */}
              <div className="relative flex items-start gap-4 bg-[#e7f6ff] p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="absolute -left-6 top-4 w-5 h-5 rounded-full bg-[#42617d] flex items-center justify-center text-white shadow-sm z-10 animate-pulse">
                  <span className="material-symbols-outlined text-[13px] animate-spin font-bold">sync</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-[#42617d] uppercase">10:15 AM</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#bddefe] text-[#294964] text-[9px] font-bold uppercase tracking-wider">En Curso</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1 leading-snug">Apertura de Puertas & Bienvenida de Ujieres</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Música ambiental suave, entrega de folletos y guía de asientos principales.</p>
                </div>
              </div>

              {/* Hito 3: 10:30 AM */}
              <div className="relative flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="absolute -left-6 top-4 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#386458]"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">10:30 AM</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">10 min</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1 leading-snug">Apertura y Oración Inicial</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Pastor Samuel • Bienvenida fraterna y lectura del Salmo 84.</p>
                </div>
              </div>

              {/* Hito 4: 10:40 AM */}
              <div className="relative flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="absolute -left-6 top-4 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#42617d]"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">10:40 AM</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-wider">4 Canciones</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1 leading-snug">Bloque de Alabanza & Adoración</h4>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[#386458]">
                    <span className="material-symbols-outlined text-[16px] font-bold">library_music</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Setlist sincronizado con ProPresenter</span>
                  </div>
                </div>
              </div>

              {/* Hito 5: 11:15 AM */}
              <div className="relative flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="absolute -left-6 top-4 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#386458]"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">11:15 AM</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">8 min</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1 leading-snug">Momento de Ofrenda & Gratitud</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Instrucciones en pantalla • Código QR y sobres en pasillos laterales.</p>
                </div>
              </div>

              {/* Hito 6: 11:25 AM */}
              <div className="relative flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="absolute -left-6 top-4 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#42617d]"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">11:25 AM</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-wider">40 min</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1 leading-snug">Prédica: "Gracia Inagotable"</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Enseñanza bíblica expositiva en Efesios 2 • Pastor Invitado.</p>
                </div>
              </div>

              {/* Hito 7: 12:05 PM */}
              <div className="relative flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="absolute -left-6 top-4 w-5 h-5 rounded-full bg-[#ffd9de] flex items-center justify-center text-[#663a42] border border-rose-100 z-10">
                  <span className="material-symbols-outlined text-[13px] font-bold">church</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-[#7f4e57] uppercase">12:05 PM</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#ffd9de] text-[#663a42] text-[9px] font-bold uppercase tracking-wider">Comunión</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1 leading-snug">Santa Cena Comunitaria & Ministración</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Distribución reverente de elementos y bendición pastoral de cierre.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenedor Pestaña 2: Voluntarios */}
        {activeTab === "voluntarios" && (
          <div className="flex flex-col space-y-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Equipo de Servidores</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">24 asignados • 4 áreas activas</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#bdeddd] text-[#214e43] text-[9px] font-bold uppercase tracking-wider">100% Confirmado</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#386458] font-bold">waving_hand</span>
                    <span className="text-xs font-bold text-slate-700">Ujieres y Bienvenida (8)</span>
                  </div>
                  <span className="text-[10px] text-[#386458] font-bold uppercase tracking-wider bg-[#bdeddd]/60 px-2 py-0.5 rounded-full">Listo</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#42617d] font-bold">graphic_eq</span>
                    <span className="text-xs font-bold text-slate-700">Multimedia y Streaming (6)</span>
                  </div>
                  <span className="text-[10px] text-[#42617d] font-bold uppercase tracking-wider bg-[#cde5ff]/60 px-2 py-0.5 rounded-full">En Posición</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#7f4e57] font-bold">escalator_warning</span>
                    <span className="text-xs font-bold text-slate-700">Cuidado Infantil / Cuna (6)</span>
                  </div>
                  <span className="text-[10px] text-[#7f4e57] font-bold uppercase tracking-wider bg-[#ffd9de]/60 px-2 py-0.5 rounded-full">Listo</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenedor Pestaña 3: Checklist */}
        {activeTab === "checklist" && (
          <div className="flex flex-col space-y-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Checklist Pre-Culto</h3>
              
              {checklist.map((item) => (
                <label 
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer select-none transition-all active:scale-[0.99]"
                >
                  <input 
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleChecklistItem(item.id)}
                    className="w-4 h-4 rounded text-[#386458] focus:ring-[#386458] border-slate-300"
                  />
                  <span className={`text-xs font-medium ${item.checked ? "line-through text-slate-400" : "text-slate-700"}`}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Próximos Eventos Calendario */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Próximos Encuentros</h3>
              <p className="text-[10px] text-slate-500 font-medium">Fechas destacadas en la agenda comunitaria</p>
            </div>
            <button 
              onClick={() => alert("Mostrando calendario anual de eventos...")}
              className="text-[11px] text-[#386458] font-bold hover:underline cursor-pointer"
            >
              Ver Todo
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {/* Tarjeta 1: Retiro de Matrimonios */}
            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-slate-100">
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCKuDV7C_6aZYyhi5tu2z1OQld66W9ew608SiUHa3NqIfobUM8rA2zg1aUrTDQ8M1I0dlr7KwtsSlxHrDjlju_ElTynZ8KOI6XMzwgagPKu21q__Hyhgimph3gdWwy7ykxaa_B1XRtaI6xn_h-zm-LSu1Il38Ym74SPPIv8MkZMA-Z-_XHdlsB-6RUvpcXOBDE93EFLAM8dpVEzrxAv27BVEgdxdWq6REqUpyoAUXzDlsc7ONsTYFtF')" }}
                ></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[#7f4e57]">
                  <span className="material-symbols-outlined text-[15px] font-bold">favorite</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider">15 - 17 Noviembre</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mt-1 leading-snug">Retiro Espiritual de Matrimonios</h4>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 leading-none">Hotel Campestre Los Olivos • 32 parejas registradas</p>
              </div>
              <button 
                onClick={() => alert("Mostrando ficha de registro del Retiro de Matrimonios...")}
                className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#386458] transition-colors shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>

            {/* Tarjeta 2: Vigilia de Jóvenes */}
            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-slate-100">
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBXZQ04S41pr2PWBNCWCCtjbco4gMgLaRNTIT55jYfXjLfA-s8KATpoFYyhTwqpYs5UdkYFjVw7OYLn6TQpDlulgjVJ8vpqWhDcv37unHoA_gE7cUmiFPHMwPZLUMmkYunqQzlH0QPDwNX0jIfgQq8UoqbH4XsvcI7Ezmku9lZvUE5G8-vPtiMcPHkG1VrpPsfH-1jMTuoxFTfQ2i0-h1bGvlz79Hj1VRddlOdSAA1jXHSUoplKoXOm')" }}
                ></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[#42617d]">
                  <span className="material-symbols-outlined text-[15px] font-bold">nights_stay</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider">Próximo Viernes • 21:00</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mt-1 leading-snug">Vigilia de Jóvenes: Fuego & Quietud</h4>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 leading-none">Auditorio Menor • Noche de clamor y comunión</p>
              </div>
              <button 
                onClick={() => alert("Mostrando detalles de la Vigilia de Jóvenes...")}
                className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#386458] transition-colors shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </section>

        {/* Botón Pill Principal de Acción Inferior */}
        <div className="pt-2">
          <button 
            onClick={() => alert("Cargando formulario de creación de eventos, reserva de salas y recursos...")}
            className="w-full py-3.5 rounded-full bg-[#386458] hover:bg-[#2c4e45] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer"
            style={{ borderRadius: "4px" }}
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>Crear Nuevo Evento o Culto</span>
          </button>
        </div>

      </div>

    </div>
  );
}
