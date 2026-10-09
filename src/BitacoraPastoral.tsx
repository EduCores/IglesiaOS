import React, { useState } from "react";

interface PrayerPetition {
  id: number;
  text: string;
}

export default function BitacoraPastoralScreen({ onBack, onNavigateToBiblia }: { onBack?: () => void; onNavigateToBiblia?: () => void }) {
  const [encounterType, setEncounterType] = useState("Visita Domiciliaria");
  const [connectionPlace, setConnectionPlace] = useState("hogar");
  const [estimatedDuration, setEstimatedDuration] = useState("45 minutos");
  const [visitDate, setVisitDate] = useState("Hoy, 24 Octubre");
  const [moodAssessment, setMoodAssessment] = useState("En Paz");
  const [privacyLevel, setPrivacyLevel] = useState<"solo_pastor" | "equipo">("solo_pastor");
  const [noteContent, setConfidentialNote] = useState("");
  const [assignedLeader, setAssignedLeader] = useState("Pastor Andrés V.");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("En 2 semanas (7 Nov)");
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const notify = (message: string) => { setSuccessToast(message); setTimeout(() => setSuccessToast(null), 3000); };

  // Prayer Petitions Interactive state
  const [prayers, setPrayers] = useState<PrayerPetition[]>([
    { id: 1, text: "Salud del Hno. David (intervención médica pendiente)" },
    { id: 2, text: "Paz y dirección para su hija menor en la universidad" }
  ]);
  const [newPrayerText, setNewPrayerText] = useState("");

  const handleAddPrayer = () => {
    if (!newPrayerText.trim()) return;
    setPrayers(prev => [...prev, { id: Date.now(), text: newPrayerText.trim() }]);
    setNewPrayerText("");
  };

  const handleRemovePrayer = (id: number) => {
    setPrayers(prev => prev.filter(p => p.id !== id));
  };

  const handleSaveLog = () => {
    notify("¡Bitácora pastoral guardada y cifrada con AES-256 en la ficha del miembro!");
    if (onBack) onBack();
  };

  const handleSendWhatsApp = () => {
    window.open("https://wa.me/?text=" + encodeURIComponent("Querida Familia Morales, les enviamos este versículo de ánimo para hoy. Filipenses 4:6-7: Por nada estéis afanosos..."), "_blank");
  };

  return (
    <div className="flex-1 pb-24 relative overflow-hidden flex flex-col justify-between animate-[fadeIn_0.25s_ease-out] font-body-md text-body-md text-[#0e1d25]">
      {successToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded shadow-lg z-50 flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
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
        <span className="min-w-0 truncate text-xs text-slate-500">Bitácora de Visitas</span>
      </div>

      <div className="flex flex-col w-full px-5 space-y-5">
        
        {/* Privacy Assurance Banner */}
        <div className="w-full bg-transparent rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 border border-slate-100 min-w-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#bdeddd] flex items-center justify-center shrink-0 border border-white">
              <span className="material-symbols-outlined text-[#386458] text-[20px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-slate-900 uppercase truncate">Bitácora Pastoral Confidencial</h2>
              <div className="flex items-center space-x-1.5 mt-0.5 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#386458] animate-pulse shrink-0"></span>
                <p className="text-[10px] text-[#386458] font-bold tracking-wide uppercase leading-none truncate">Cifrado de Extremo a Extremo</p>
              </div>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-white text-slate-500 text-[10px] font-bold uppercase shadow-sm shrink-0">
            Privado
          </div>
        </div>

        {/* Member / Family Selection Card */}
        <div className="w-full bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-3 flex flex-col flex-wrap min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-slate-500 font-bold uppercase">Hermano o Familia Visitada</span>
            <button 
              onClick={() => notify("Directorio de familias disponible próximamente.")}
              className="text-[11px] text-[#386458] font-bold flex items-center space-x-1 hover:underline cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[16px] font-bold">sync_alt</span>
              <span>Cambiar</span>
            </button>
          </div>
          
          <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100 min-w-0">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 shadow-sm border border-white bg-slate-200">
                <img
                  className="w-full h-full object-cover"
                  alt="Familia Morales"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFQXkvtw-DTfQ7Csb2fgRzB05Q2xUxbYbt7NgI10Iax21A03k8wQ0dsjWNX7uwTuMpxeihWsY5ogvYeAj-uF9WVv2oDT-whfzrNJai-4DTuGVZERjU9cw1kIjCThiCTrkU0xSIcbFba6jT-nUAOb07OWosgxcFYEfc6m6cvASlZ8c2tS1YkXIr1OgY4S9qk_w4RLUPB5-qxFv5bNgU50gqFwYETYxk9vhe9qlpuMHZ4rwHx6yFOBMi"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-slate-900 truncate">Familia Morales Benítez</h3>
                <p className="text-[11px] text-slate-400 font-semibold leading-none mt-1">Hermano David & Hna. Esther</p>
              </div>
            </div>
            <div className="flex flex-col flex-wrap items-start gap-1 min-w-0 max-w-full">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-200/60 text-slate-700 border border-slate-300/30 max-w-full">
                Célula Betania #4
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider break-words">
                5 años en congregación
              </span>
            </div>
          </div>
        </div>

        {/* Type of Pastoral Encounter */}
        <div className="w-full bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-[11px] text-slate-500 font-bold uppercase">Tipo de Encuentro</label>
            <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Selección obligatoria</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              "Visita Domiciliaria",
              "Consejería Matrimonial",
              "Apoyo en Enfermedad / Duelo",
              "Llamada de Fortalecimiento",
              "Discipulado 1 a 1"
            ].map((type) => {
              const isSelected = encounterType === type;
              return (
                <button 
                  key={type}
                  type="button"
                  onClick={() => setEncounterType(type)}
                  className={`px-3.5 py-2 rounded-full text-[10px] font-bold transition-all duration-150 cursor-pointer max-w-full text-center break-words ${
                    isSelected 
                      ? "bg-[#386458] text-white shadow-sm" 
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                  style={{ borderRadius: "4px" }}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date, Place and Duration */}
        <div className="w-full bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4 flex flex-col flex-wrap min-w-0">
          <span className="text-[11px] text-slate-500 font-bold uppercase block mb-1">Momento y Entorno</span>
          
          <div className="flex flex-wrap gap-3">
            <div className="space-y-1 flex-1 min-w-[140px]">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Fecha de Visita</label>
              <div className="relative flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2.5">
                <span className="material-symbols-outlined text-[#386458] text-[18px] font-bold shrink-0">calendar_today</span>
                <input 
                  type="text" 
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 w-full min-w-0 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1 flex-1 min-w-[140px]">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Duración estimada</label>
              <div className="relative flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2.5">
                <span className="material-symbols-outlined text-[#386458] text-[18px] font-bold shrink-0">schedule</span>
                <input 
                  type="text" 
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 w-full min-w-0 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase">Lugar de Conexión</label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "hogar", label: "Hogar", icon: "home" },
                { key: "oficina", label: "Oficina", icon: "church" },
                { key: "hospital", label: "Hospital", icon: "local_hospital" },
                { key: "virtual", label: "Virtual", icon: "videocam" }
              ].map((loc) => {
                const isActive = connectionPlace === loc.key;
                return (
                  <button 
                    key={loc.key}
                    type="button"
                    onClick={() => setConnectionPlace(loc.key)}
                    className={`flex-1 min-w-[64px] py-2 px-1 rounded-lg flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer border ${
                      isActive 
                        ? "bg-[#386458] text-white border-[#386458] shadow-sm" 
                        : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] font-bold shrink-0">{loc.icon}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-center break-words leading-tight">{loc.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Spiritual Health & Emotional State Assessment */}
        <div className="w-full bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-[11px] text-slate-500 font-bold uppercase">Estado de Ánimo & Salud Espiritual</label>
            <span className="text-[10px] text-[#386458] font-bold uppercase bg-[#bdeddd] px-2.5 py-0.5 rounded-full shrink-0">{moodAssessment}</span>
          </div>

          <p className="text-[11px] text-slate-400 font-medium leading-normal">Selecciona el estado con que percibiste el espíritu del hermano/familia durante la sesión.</p>
          
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { text: "Quebranto", emoji: "🌧️" },
              { text: "Inquietud", emoji: "⛅" },
              { text: "En Paz", emoji: "🌿" },
              { text: "Fortaleza", emoji: "🌱" },
              { text: "En Gozo", emoji: "✨" }
            ].map((mood) => {
              const isActive = moodAssessment === mood.text;
              return (
                <button 
                  key={mood.text}
                  type="button"
                  onClick={() => setMoodAssessment(mood.text)}
                  className={`flex flex-1 min-w-[52px] flex-col items-center p-2 rounded-lg transition-all border cursor-pointer ${
                    isActive 
                      ? "bg-[#bddefe] border-[#9bc8f0] text-[#294964] shadow-sm scale-105" 
                      : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-xl mb-1">{mood.emoji}</span>
                  <span className="text-[9px] font-bold uppercase tracking-tight text-center">{mood.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Prayer Requests & Specific Petitions */}
        <div className="w-full bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-[11px] text-slate-500 font-bold uppercase">Motivos de Oración Familiares</label>
            <span className="text-[10px] text-[#386458] font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-[16px] font-bold">volunteer_activism</span>
              <span>Intercesión</span>
            </span>
          </div>

          {/* Preloaded prayer list */}
          <div className="space-y-2">
            {prayers.map((prayer) => (
              <div key={prayer.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-2.5 rounded-lg animate-[fadeIn_0.15s_ease-out]">
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="material-symbols-outlined text-[#386458] text-[18px] font-bold shrink-0">radio_button_checked</span>
                  <span className="text-xs font-semibold text-slate-700 truncate">{prayer.text}</span>
                </div>
                <button 
                  type="button"
                  onClick={() => handleRemovePrayer(prayer.id)}
                  className="text-slate-400 hover:text-[#7f4e57] transition-colors shrink-0 ml-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] font-bold">close</span>
                </button>
              </div>
            ))}
          </div>

          {/* Input to add item */}
          <div className="flex items-center gap-2 mt-2">
            <input 
              type="text"
              value={newPrayerText}
              onChange={(e) => setNewPrayerText(e.target.value)}
              placeholder="Escribir otra petición específica..."
              className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            <button 
              type="button"
              onClick={handleAddPrayer}
              className="w-10 h-10 rounded-xl bg-[#386458] text-white flex items-center justify-center shrink-0 shadow-sm hover:bg-[#2c4e45] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] font-bold">add</span>
            </button>
          </div>
        </div>

        {/* Confidential Pastoral Notes */}
        <div className="w-full bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#7f4e57] text-[20px] font-bold">verified_user</span>
              <label className="text-[11px] text-slate-500 font-bold uppercase">Notas Pastorales Privadas</label>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#ffd9de] text-[#663a42]">Sensible</span>
          </div>

          {/* Privacy Visibility Level Toggle */}
          <div className="bg-slate-100 p-1 rounded-full flex items-center justify-between text-center border border-slate-200">
            <button 
              type="button"
              onClick={() => setPrivacyLevel("solo_pastor")}
              className={`flex-1 py-1.5 px-3 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                privacyLevel === "solo_pastor" ? "bg-white text-[#386458] shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Solo Pastor Titular
            </button>
            <button 
              type="button"
              onClick={() => setPrivacyLevel("equipo")}
              className={`flex-1 py-1.5 px-3 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                privacyLevel === "equipo" ? "bg-white text-[#386458] shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Equipo Pastoral
            </button>
          </div>

          <div className="relative">
            <textarea 
              value={noteContent}
              onChange={(e) => setConfidentialNote(e.target.value)}
              placeholder="Escribe aquí las impresiones espirituales, consejos brindados, pasajes leídos (ej. Salmo 91) y detalles confidenciales que deban resguardarse..."
              className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none"
              rows={4}
            />
            <div className="absolute bottom-2.5 right-3 flex items-center space-x-1 text-slate-400">
              <span className="material-symbols-outlined text-[14px]">shield</span>
              <span className="text-[9px] font-bold uppercase tracking-wider">Cifrado local AES-256</span>
            </div>
          </div>
        </div>

        {/* Agreements & Next Follow-up */}
        <div className="w-full bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4 flex flex-col flex-wrap min-w-0">
          <span className="text-[11px] text-slate-500 font-bold uppercase block mb-1">Acuerdos y Próximo Acompañamiento</span>
          
          <div className="flex flex-wrap gap-3">
            <div className="space-y-1 flex-1 min-w-[140px]">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Próxima Fecha</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2.5">
                <span className="material-symbols-outlined text-[#386458] text-[18px] font-bold shrink-0">event_repeat</span>
                <input
                  type="text"
                  value={nextFollowUpDate}
                  onChange={(e) => setNextFollowUpDate(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 w-full min-w-0 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1 flex-1 min-w-[140px]">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Responsable Asignado</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2.5">
                <span className="material-symbols-outlined text-[#386458] text-[18px] font-bold shrink-0">person_pin</span>
                <select 
                  value={assignedLeader}
                  onChange={(e) => setAssignedLeader(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 w-full min-w-0 focus:outline-none bg-slate-50"
                >
                  <option>Pastor Andrés V.</option>
                  <option>Pastora Elena</option>
                  <option>Líder de Célula Betania</option>
                  <option>Ministerio de Consolación</option>
                </select>
              </div>
            </div>
          </div>

          {/* Suggested Verse for Quick Action */}
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-full bg-[#bdeddd] flex items-center justify-center shrink-0 border border-white">
                <span className="material-symbols-outlined text-[#214e43] text-[18px] font-bold">auto_stories</span>
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">Filipenses 4:6-7</p>
                <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5 leading-none">"Por nada estéis afanosos..."</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => (onNavigateToBiblia ? onNavigateToBiblia() : notify("Listado de versículos disponible próximamente."))}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[#386458] text-[9px] font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
              style={{ borderRadius: "4px" }}
            >
              Cambiar
            </button>
          </div>
        </div>

        {/* Primary and Secondary Action Buttons */}
        <div className="w-full space-y-2.5 pt-2">
          {/* Primary Pill Button */}
          <button 
            type="button"
            onClick={handleSaveLog}
            className="w-full py-4 px-6 rounded-full bg-[#386458] hover:bg-[#2c4e45] text-white text-xs font-bold shadow-md hover:shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            style={{ borderRadius: "4px" }}
          >
            <span className="material-symbols-outlined text-[20px] font-bold">save</span>
            <span>Guardar Visita en Ficha de Miembro</span>
          </button>
          
          {/* Secondary Soft Pastel Button */}
          <button 
            type="button"
            onClick={handleSendWhatsApp}
            className="w-full py-3.5 px-6 rounded-full bg-[#ffd9de] text-[#663a42] hover:bg-[#ffd9de]/80 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            style={{ borderRadius: "4px" }}
          >
            <span className="material-symbols-outlined text-[20px] font-bold">share</span>
            <span>Enviar Versículo de Ánimo por WhatsApp</span>
          </button>
        </div>

      </div>

    </div>
  );
}
