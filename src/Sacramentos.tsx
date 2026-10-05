import React, { useState } from "react";

interface SacramentTab {
  id: "bautismo" | "presentacion" | "matrimonio";
  label: string;
  icon: string;
}

interface ChecklistItem {
  id: number;
  title: string;
  status: string;
  statusColor: string;
  desc: string;
  checked: boolean;
}

export default function SacramentosScreen({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<"bautismo" | "presentacion" | "matrimonio">("bautismo");
  const [candidateName, setCandidateSearch] = useState("Mateo Villalba Morales");
  const [selectedCeremony, setSelectedCeremony] = useState("slot_1");
  const [robeSize, setRobeSize] = useState("M");
  const [mentorName, setMentorName] = useState("Pastor Asoc. Gabriel Santillán");
  const [pastoralNotes, setPastoralNotes] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const notify = (message: string) => { setSuccessToast(message); setTimeout(() => setSuccessToast(null), 3000); };

  // Discipleship path checklist state
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: 1,
      title: "Clase Doctrinal 1: Salvación y Gracia",
      status: "Aprobado",
      statusColor: "text-[#386458]",
      desc: "Completada el 12 de Octubre con Pastor Andrés",
      checked: true
    },
    {
      id: 2,
      title: "Clase Doctrinal 2: El Significado del Bautismo",
      status: "Aprobado",
      statusColor: "text-[#386458]",
      desc: "Completada el 19 de Octubre con Diaconisa Elena",
      checked: true
    },
    {
      id: 3,
      title: "Testimonio Redactado o en Video",
      status: "Recibido",
      statusColor: "text-[#42617d]",
      desc: "Documento adjunto en CRM: “testimonio_mateo_v.pdf”",
      checked: true
    },
    {
      id: 4,
      title: "Entrevista Pastoral de Acompañamiento",
      status: "Pendiente",
      statusColor: "text-[#7f4e57]",
      desc: "Programada tentativa para este jueves 18:00 hrs",
      checked: false
    }
  ]);

  const handleToggleChecklist = (id: number) => {
    setChecklist(prev =>
      prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  };

  const approvedCount = checklist.filter(item => item.checked).length;

  const handleSendRequest = () => {
    setShowConfirmation(true);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
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
        <span className="min-w-0 truncate text-xs text-slate-500">Solicitud de Bautismo</span>
      </div>

      <div className="flex flex-col w-full px-5 space-y-5">
        
        {/* Subtle Page Header Context */}
        <div className="px-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cde5ff] text-[#294964] text-[10px] font-bold uppercase tracking-wide">
            <span className="material-symbols-outlined text-[14px]">church</span>
            Ministerio Pastoral y Vida Eclesial
          </span>
          <h2 className="mt-2 text-base font-bold text-slate-900 tracking-tight uppercase">
            Solicitudes Sacramentales
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">
            Paso de fe y consagración comunitaria
          </p>
        </div>

        {/* Segmented Control Tabs */}
        <div className="p-1 rounded-full bg-slate-100 flex items-center gap-1 shadow-sm">
          <button 
            onClick={() => setActiveTab("bautismo")}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "bautismo" ? "bg-[#386458] text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
            style={{ borderRadius: "4px" }}
          >
            <span className="material-symbols-outlined text-[16px]">water_drop</span>
            <span className="truncate">Bautismo en Aguas</span>
          </button>
          
          <button 
            onClick={() => {
              setActiveTab("presentacion");
              notify("Formulario en preparación.");
            }}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "presentacion" ? "bg-[#386458] text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
            style={{ borderRadius: "4px" }}
          >
            <span className="material-symbols-outlined text-[16px]">child_care</span>
            <span className="truncate">Presentación</span>
          </button>

          <button 
            onClick={() => {
              setActiveTab("matrimonio");
              notify("Formulario en preparación.");
            }}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "matrimonio" ? "bg-[#386458] text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
            style={{ borderRadius: "4px" }}
          >
            <span className="material-symbols-outlined text-[16px]">favorite</span>
            <span className="truncate">Matrimonio</span>
          </button>
        </div>

        {/* Pastoral Verse Card */}
        <div className="relative overflow-hidden rounded-xl bg-slate-50 p-5 shadow-sm border border-slate-100/50">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-[#bdeddd]/30 blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10 flex gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#bdeddd] flex items-center justify-center text-[#214e43] shrink-0 shadow-sm border border-white">
              <span className="material-symbols-outlined text-[20px] font-bold">auto_stories</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#386458] uppercase tracking-wider">Romanos 6:4</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fundamento Teológico</span>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-600 italic leading-relaxed font-medium">
                “Porque somos sepultados juntamente con él para muerte por el bautismo, a fin de que como Cristo resucitó de los muertos por la gloria del Padre, así también nosotros andemos en vida nueva.”
              </p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          
          {/* Candidate Selector Card */}
          <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[#386458] shadow-sm">
                  <span className="material-symbols-outlined text-[16px] font-bold">person_search</span>
                </div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Candidato al Bautismo</h3>
              </div>
              <span className="text-[9px] text-[#386458] bg-[#bdeddd]/60 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Paso 1 de 4</span>
            </div>

            {/* Live Search CRM / Candidate */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[18px]">search</span>
              </div>
              <input 
                type="text" 
                value={candidateName}
                onChange={(e) => setCandidateSearch(e.target.value)}
                placeholder="Buscar por nombre, cédula o membresía CRM..."
                className="w-full pl-10 pr-10 py-3 rounded-full bg-slate-50 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-slate-100 border border-slate-200 transition-colors shadow-inner"
              />
              <button className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700" type="button">
                <span className="material-symbols-outlined text-[18px]">badge</span>
              </button>
            </div>

            {/* Selected Profile Snippet */}
            <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-3 min-w-0">
                <img 
                  className="w-11 h-11 rounded-full object-cover shrink-0 shadow-sm border border-white" 
                  alt="Retrato de Mateo" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7Mz9X0lzRhcMwP__bqKp-LE_BTK-uJ5oC_VeQ-SRwmrzHySPab92CP1pzwcjeZF_JH78RKFm4RDixGzMHhE3yMxkhVNvlWgzwkNjymySpkwPj_qvt4ymlfTzsMowjWFWUZpwiH66F0T7Sw_r3oFkx8LphVea0CaXyhy-PR9RI5twXxzps9FZ_klwWw6KKQBBF4xeZnTR57xRh_Dy6fNLfp64sBpXY1gquqUISZqj_Hs3pa0m-GPdh"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{candidateName.split(" ")[0]} {candidateName.split(" ")[1] || "Villalba"}</h4>
                    <span className="material-symbols-outlined text-[#386458] text-[16px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold truncate leading-none mt-1">Miembro CRM #M-4829 • Grupo Casa de Paz 14</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => notify("Buscador de candidatos disponible próximamente.")}
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-[#386458] text-[9px] font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
                style={{ borderRadius: "4px" }}
              >
                Cambiar
              </button>
            </div>
          </div>

          {/* Requirements & Discipleship Interactive Checklist */}
          <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[#386458] shadow-sm">
                  <span className="material-symbols-outlined text-[16px] font-bold">task_alt</span>
                </div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Ruta de Discipulado</h3>
              </div>
              <span className="text-[9px] text-[#386458] font-bold uppercase tracking-wider bg-[#bdeddd]/60 px-2.5 py-0.5 rounded-full">
                {approvedCount} / {checklist.length} Completados
              </span>
            </div>

            <p className="text-[11px] text-slate-400 font-medium leading-normal">
              Verifica el cumplimiento de las etapas de formación antes de oficializar el rito.
            </p>

            {/* Checklist items */}
            <div className="space-y-2.5">
              {checklist.map((item) => (
                <label 
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer transition-colors hover:bg-slate-100"
                >
                  <input 
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleToggleChecklist(item.id)}
                    className="mt-0.5 w-4 h-4 rounded text-[#386458] focus:ring-[#386458] border-slate-300"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-bold leading-none ${item.checked ? "text-slate-800" : "text-slate-600"}`}>
                        {item.title}
                      </p>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${
                        item.checked ? "text-[#386458]" : "text-slate-400"
                      }`}>
                        {item.checked ? "Aprobado" : "Pendiente"}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium leading-none mt-1">{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Date & Service Ceremony Selection */}
          <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[#386458] shadow-sm">
                  <span className="material-symbols-outlined text-[16px] font-bold">calendar_month</span>
                </div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Fecha y Ceremonia</h3>
              </div>
              <span className="text-[9px] text-[#42617d] bg-[#cde5ff]/60 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Próximo Culto</span>
            </div>

            {/* Ceremony visual radio cards */}
            <div className="space-y-2.5">
              <label 
                className={`relative flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all border ${
                  selectedCeremony === "slot_1" 
                    ? "bg-[#e7f6ff] border-[#bddefe]" 
                    : "bg-slate-50 border-slate-100"
                }`}
              >
                <input 
                  type="radio" 
                  name="ceremony_slot" 
                  value="slot_1"
                  checked={selectedCeremony === "slot_1"}
                  onChange={() => setSelectedCeremony("slot_1")}
                  className="w-4 h-4 text-[#386458] focus:ring-[#386458]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 leading-none">Domingo, 24 de Noviembre</h4>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#386458] text-white">Principal</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1 leading-none">
                      <span className="material-symbols-outlined text-[14px] text-[#386458] font-bold">schedule</span>
                      11:30 AM
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 leading-none">
                      <span className="material-symbols-outlined text-[14px] text-[#386458] font-bold">pool</span>
                      Pila Bautismal Central
                    </span>
                  </div>
                </div>
              </label>

              <label 
                className={`relative flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all border ${
                  selectedCeremony === "slot_2" 
                    ? "bg-[#e7f6ff] border-[#bddefe]" 
                    : "bg-slate-50 border-slate-100"
                }`}
              >
                <input 
                  type="radio" 
                  name="ceremony_slot" 
                  value="slot_2"
                  checked={selectedCeremony === "slot_2"}
                  onChange={() => setSelectedCeremony("slot_2")}
                  className="w-4 h-4 text-[#386458] focus:ring-[#386458]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 leading-none">Domingo, 15 de Diciembre</h4>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">Disponible</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1 leading-none">
                      <span className="material-symbols-outlined text-[14px] text-[#386458] font-bold">schedule</span>
                      11:30 AM
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 leading-none">
                      <span className="material-symbols-outlined text-[14px] text-[#386458] font-bold">waves</span>
                      Servicio de Navidad
                    </span>
                  </div>
                </div>
              </label>
            </div>

            {/* Sanctuary Visual Anchor */}
            <div className="relative rounded-xl overflow-hidden h-28 w-full shadow-inner border border-slate-100">
              <img 
                className="w-full h-full object-cover" 
                alt="A serene modern minimalist church baptistry pool" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDriwHP77oAmFMhyUt5LBtpM0kbaDct7QVRvWuPVVPkSE47DnXh3TK79rWsjDNUacyb-3_ShP6bSV3FO5yQ_N9MW7jIuBOwfaJ-8FHMR2pP7vy8sTYRshJyn2-AAMBGaS-ebltRRXzjnraiP8-mYYvtqCi8DyvRXhPxbRUsi_aDTnIP2gQP03qJin8EBaPcJauhP_RGl2bq1aoKqoH2A9Dumz4qhOChWOyEXXvDcnMLahpqVMwzA9QZ"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent flex items-end p-3">
                <div className="text-white">
                  <p className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 leading-none">
                    <span className="material-symbols-outlined text-[14px] font-bold">nature_people</span>
                    Auditorio Principal • Capacidad Familiar Completa
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Complementary Logistics Card */}
          <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[#386458] shadow-sm">
                <span className="material-symbols-outlined text-[16px] font-bold">checkroom</span>
              </div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Detalles Complementarios</h3>
            </div>

            {/* Robe Size Selector */}
            <div>
              <label className="block text-[11px] text-slate-500 font-bold uppercase mb-2">
                Talla de Túnica Bautismal
              </label>
              
              <div className="grid grid-cols-4 gap-2">
                {["S", "M", "L", "XL"].map((size) => {
                  const isActive = robeSize === size;
                  return (
                    <button 
                      key={size}
                      type="button"
                      onClick={() => setRobeSize(size)}
                      className={`py-2 rounded-lg font-bold text-xs transition-all flex flex-col items-center justify-center cursor-pointer ${
                        isActive 
                          ? "bg-[#386458] text-white shadow-sm" 
                          : "bg-slate-50 border border-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      <span className="text-xs leading-none">{size}</span>
                      <span className={`text-[9px] font-bold mt-1 uppercase tracking-wider leading-none ${isActive ? "text-[#bdeddd]" : "text-slate-400"}`}>
                        {size === "S" ? "Chica" : size === "M" ? "Mediana" : size === "L" ? "Grande" : "Extra"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Spiritual Mentor / Companion */}
            <div>
              <label className="block text-[11px] text-slate-500 font-bold uppercase mb-1.5" htmlFor="mentor-name">
                Acompañante Espiritual / Discipulador Asignado
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-3 text-[18px] text-slate-400">diversity_1</span>
                <input 
                  id="mentor-name"
                  type="text" 
                  value={mentorName}
                  onChange={(e) => setMentorName(e.target.value)}
                  placeholder="Nombre del líder o mentor espiritual"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-full bg-slate-50 text-xs font-semibold text-slate-800 placeholder:text-slate-400 border border-slate-100 focus:outline-none focus:bg-slate-100 transition-colors shadow-inner"
                />
              </div>
            </div>

            {/* Additional Pastoral Notes */}
            <div>
              <label className="block text-[11px] text-slate-500 font-bold uppercase mb-1.5" htmlFor="pastoral-notes">
                Observaciones de Fe o Movilidad Especial
              </label>
              <textarea 
                id="pastoral-notes"
                value={pastoralNotes}
                onChange={(e) => setPastoralNotes(e.target.value)}
                placeholder="Indicar si requiere asistencia para descender a la pileta bautismal o peticiones de oración familiares..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-slate-100 transition-colors shadow-inner resize-none"
                rows={2}
              />
            </div>
          </div>

          {/* Action Center */}
          <div className="space-y-3 pt-2">
            {/* Primary Pill Action Button */}
            <button 
              type="button"
              onClick={handleSendRequest}
              className="w-full py-4 px-6 rounded-full bg-[#386458] hover:bg-[#2c4e45] text-white text-xs font-bold shadow-md hover:shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              style={{ borderRadius: "4px" }}
            >
              <span className="material-symbols-outlined text-[20px] font-bold">send</span>
              <span>{showConfirmation ? "Solicitud en Trámite Pastoral" : "Enviar Solicitud a Secretaría Pastoral"}</span>
            </button>

            {/* Peaceful Micro Confirmation Note */}
            {showConfirmation && (
              <div className="p-4 rounded-xl bg-[#bdeddd] text-[#214e43] border border-emerald-100 flex items-start gap-3 shadow-inner animate-[scaleIn_0.15s_ease-out]">
                <span className="material-symbols-outlined text-[22px] shrink-0 font-bold">check_circle</span>
                <p className="text-xs font-semibold leading-relaxed">
                  Solicitud registrada con éxito. La Secretaría Pastoral ha notificado al equipo ministerial para formalizar la bendición.
                </p>
              </div>
            )}

            {/* Download Direct Guide Pill Link */}
            <div className="flex items-center justify-center pt-1">
              <button 
                onClick={() => notify("Guía de preparación disponible próximamente.")}
                className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-slate-50 border border-slate-100 text-[#386458] hover:bg-slate-100 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] font-bold">download_for_offline</span>
                <span>Descargar Guía de Preparación Bautismal (PDF)</span>
              </button>
            </div>
          </div>

        </form>

        {/* Community Pastoral Care Contact Card */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-9 h-9 rounded-full bg-[#42617d] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">support_agent</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 leading-none truncate">¿Preguntas sobre este paso sagrado?</p>
            <p className="text-[10px] text-slate-400 font-semibold truncate leading-none mt-1">Escríbenos a secretaria@comunidadmindora.org</p>
          </div>
        </div>

      </div>

    </div>
  );
}
