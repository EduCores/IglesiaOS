import React, { useState } from "react";

interface Member {
  id: number;
  name: string;
  role: string;
  type: "familias" | "celulas" | "lideres" | "nuevos";
  tag: string;
  badgeColor: string;
  img: string;
  subtitle: string;
  metaIcon?: string;
  metaText?: string;
  metaRightText?: string;
  avatars?: string[];
  secondaryBadge?: string;
  secondaryBadgeIcon?: string;
  secondaryBadge2?: string;
  secondaryBadgeIcon2?: string;
  footerText?: string;
  footerIcon?: string;
  noteIcon?: string;
  noteText?: string;
  primaryBtnText: string;
  secondaryBtnIcon: string;
}

export default function DirectorioScreen({
  onNavigateToRoles,
  onNavigateToCenso
}: {
  onNavigateToRoles: () => void;
  onNavigateToCenso?: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"todos" | "familias" | "celulas" | "lideres" | "nuevos">("todos");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form states for new member
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  const [newMemberType, setNewMemberType] = useState<"familias" | "celulas" | "lideres" | "nuevos">("nuevos");

  // Initial Members List with exactly the provided information
  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      name: "Familia González Morales",
      role: "4 integrantes • Célula Betania",
      type: "familias",
      tag: "En Comunión",
      badgeColor: "bg-[#bdeddd] text-[#214e43]",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAbsyvYjq0BXX-LVFXD2VYrUV7ixEfMqktxYsNIhlgqsuBy636d67QNLgKdjJSy_56xPIW_SzKCzU41-x1TV09DoMuT6rLHkUf_h-2nlcY3RTBqz0gsv4ZV5RQTuvVuD784DWU5qxWyvh3XbBSWFOaDVvEa94s7ijBUMVBXWWN7umJTbeqpE0v120vMYyo_LDqzRByIGcF8a4lucRnw0JAdXatD4Iv7dUTo0AxPphVGfmw4n61w9d0",
      subtitle: "Hospedadores de grupo semanal",
      metaIcon: "cottage",
      metaText: "Hospedadores de grupo semanal",
      metaRightText: "Jueves 7:30 PM",
      avatars: ["J", "M", "2+"],
      primaryBtnText: "WhatsApp",
      secondaryBtnIcon: "call"
    },
    {
      id: 2,
      name: "Esteban Valenzuela",
      role: "Joven Profesional • Alabanza",
      type: "lideres",
      tag: "Líder Adoración",
      badgeColor: "bg-[#cde5ff] text-[#294964]",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrt9qRK2lccAdATsKzPxgucnb3H12k1MDPWQ0iAYP51UfaLeulM9g2JEVb5uRnp5hKFbo6sYUHTFS1s8vggs5k4Lrc5DKXqgSjiIC8WW1syUPTHvAgn4qaO1FEIQa5M6732qefwoAV_mlcYukrr7DKklk_sw-T886J21lYKiy_FtTGsj65BsDtf2J78Ete235XEzmFzz4H4rKVnWYTFCiciG-2zoOcnjkv0ccPPNEpcxrgLmbdzcjR",
      subtitle: "",
      secondaryBadge: "Bautizado",
      secondaryBadgeIcon: "verified",
      secondaryBadge2: "Madurez: Nivel 3",
      secondaryBadgeIcon2: "psychology_alt",
      footerText: "Servicio: Domingo Mañana",
      primaryBtnText: "Contactar",
      secondaryBtnIcon: "call"
    },
    {
      id: 3,
      name: "Claudia Soto",
      role: "Nueva Creyente (hace 2 sem.)",
      type: "nuevos",
      tag: "Discipulado N1",
      badgeColor: "bg-[#cde5ff] text-[#294964]",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-1XHuES1EK_E6mrVnrCzXtN0SjpXVsKMS7MstJ47Dmco1KH_3l84ft8OBZ3UU1KVA6VoNL4Z_75phS04fvhzZK4nxzFDU18cdopyDAjGz6KXmWHk8QbyNyu1u28c6g5lx1iZ5dgePYtmPvXo5dKuxh_UZ3xoNkg9kT4lWR5U2wyNKeYQ_PKlrOgG3V28awQMQnvA8GFczRykZZ3sj4m0eoAkslSBN7Gt3GmADiPGHSF097mGPPUWI",
      subtitle: "",
      noteIcon: "volunteer_activism",
      noteText: "Acompañamiento pastoral: Pastora Andrea M.",
      footerText: "Próx. sesión: Sábado 10:00 AM",
      primaryBtnText: "Saludar",
      secondaryBtnIcon: "mail" // For custom email tracing
    },
    {
      id: 4,
      name: "Mateo & Sofía Silva",
      role: "Matrimonio Joven • 2 años",
      type: "celulas",
      tag: "Voluntarios",
      badgeColor: "bg-[#ffd9de] text-[#663a42]",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyrYO_3dBlJmzbarUSJbuZPo-QcjPhnL4TtvJJ8bigfA9WAfUpnpW0LiMkmErlU4cFcuc7EWxxyCdqSwVkUV06ZWBIJm7Q71Feps0WUSCioAVPh00QQLSeHR4_fAf9dSfqQ7SJairIa67j3armH7u6oYAbuPfH3i8N9iZlGtt5PqJSlCYvd3iOM34lkqoCcfdAdqM_QYpyG2CWwWG6LvOo9WudTUKT4sHu56TgiShlSKNZpzU95oqg",
      subtitle: "",
      noteIcon: "child_care",
      noteText: "Ministerio Infantil: Escuela Dominical (4-6 años)",
      footerIcon: "event_available",
      footerText: "Activos este mes",
      primaryBtnText: "Mensaje",
      secondaryBtnIcon: "more_vert"
    }
  ]);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newMember: Member = {
      id: members.length + 1,
      name: newMemberName,
      role: newMemberRole || "Nuevo Miembro",
      type: newMemberType,
      tag: newMemberType === "familias" ? "En Comunión" : newMemberType === "lideres" ? "Líder" : newMemberType === "celulas" ? "Voluntario" : "Nuevo Creyente",
      badgeColor: newMemberType === "lideres" ? "bg-[#cde5ff] text-[#294964]" : "bg-[#bdeddd] text-[#214e43]",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
      subtitle: "",
      footerText: "Activo desde hoy",
      primaryBtnText: "WhatsApp",
      secondaryBtnIcon: "call"
    };

    setMembers([...members, newMember]);
    setShowAddMemberModal(false);
    setNewMemberName("");
    setNewMemberRole("");
    setSuccessToast(`¡"${newMemberName}" registrado con éxito en la comunidad!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.subtitle && m.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.noteText && m.noteText.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === "todos" || m.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 pb-24 relative overflow-hidden flex flex-col justify-between animate-[fadeIn_0.25s_ease-out] font-body-md text-body-md text-[#0e1d25]">
      
      {/* Toast de confirmación */}
      {successToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded shadow-lg z-50 flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
          <span>{successToast}</span>
        </div>
      )}

      <div className="flex flex-col w-full pb-10">
        
        {/* Top Banner / Search Header */}
        <section className="px-5 pt-3.5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#386458]">Comunidad & Vida</p>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Directorio de Miembros</h2>
            </div>
            
            {/* Botón para alternar a la pantalla de Roles Definidos */}
            <button 
              onClick={onNavigateToRoles}
              className="w-10 h-10 rounded-full bg-[#e0f0fb] text-[#386458] flex items-center justify-center shadow-sm cursor-pointer hover:bg-[#bdeddd] transition-colors"
              title="Ver Roles y Privilegios"
            >
              <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
            </button>
          </div>

          {/* Search Input & Filter Pill */}
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-full bg-[#e7f6ff] text-[#0e1d25] placeholder:text-slate-400/80 font-body-md text-body-md focus:outline-none focus:bg-[#e0f0fb] shadow-sm transition-all" 
                placeholder="Buscar por nombre, familia..." 
                type="text"
              />
            </div>
            <button 
              onClick={() => setSelectedFilter("todos")}
              className="h-11 px-4 rounded-full bg-[#e7f6ff] text-[#42617d] flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer font-bold text-xs"
              style={{ borderRadius: "4px" }}
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Filtros</span>
            </button>
          </div>

          {/* Chips Filter Bar (Mindora Pills) */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 -mx-5 px-5">
            <button 
              onClick={() => setSelectedFilter("todos")}
              className={`shrink-0 h-8 px-4 rounded-full text-[11px] font-bold shadow-sm transition-all cursor-pointer ${
                selectedFilter === "todos" ? "bg-[#386458] text-white" : "bg-[#e7f6ff] text-slate-600"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Todos ({members.length})
            </button>
            <button 
              onClick={() => setSelectedFilter("familias")}
              className={`shrink-0 h-8 px-4 rounded-full text-[11px] font-bold shadow-sm transition-all cursor-pointer ${
                selectedFilter === "familias" ? "bg-[#386458] text-white" : "bg-[#e7f6ff] text-slate-600"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Familias
            </button>
            <button 
              onClick={() => setSelectedFilter("celulas")}
              className={`shrink-0 h-8 px-4 rounded-full text-[11px] font-bold shadow-sm transition-all cursor-pointer ${
                selectedFilter === "celulas" ? "bg-[#386458] text-white" : "bg-[#e7f6ff] text-slate-600"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Células
            </button>
            <button 
              onClick={() => setSelectedFilter("lideres")}
              className={`shrink-0 h-8 px-4 rounded-full text-[11px] font-bold shadow-sm transition-all cursor-pointer ${
                selectedFilter === "lideres" ? "bg-[#386458] text-white" : "bg-[#e7f6ff] text-slate-600"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Líderes
            </button>
            <button 
              onClick={() => setSelectedFilter("nuevos")}
              className={`shrink-0 h-8 px-4 rounded-full text-[11px] font-bold shadow-sm transition-all cursor-pointer ${
                selectedFilter === "nuevos" ? "bg-[#386458] text-white" : "bg-[#e7f6ff] text-slate-600"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Nuevos Creyentes
            </button>
          </div>
        </section>

        {/* Community Health / Summary Cards */}
        <section className="px-5 mt-5">
          <div className="grid grid-cols-3 gap-2.5">
            {/* Metric 1 */}
            <div className="bg-white rounded-xl p-3 flex flex-col items-center text-center shadow-sm relative overflow-hidden border border-slate-100">
              <div className="w-7 h-7 rounded-full bg-[#bdeddd] flex items-center justify-center text-[#214e43] mb-1.5">
                <span className="material-symbols-outlined text-[16px]">groups</span>
              </div>
              <span className="text-sm font-bold text-slate-800">850</span>
              <span className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">Asistentes habituales</span>
            </div>
            {/* Metric 2 */}
            <div className="bg-white rounded-xl p-3 flex flex-col items-center text-center shadow-sm relative overflow-hidden border border-slate-100">
              <div className="w-7 h-7 rounded-full bg-[#bddefe] flex items-center justify-center text-[#43627e] mb-1.5">
                <span className="material-symbols-outlined text-[16px]">water_drop</span>
              </div>
              <span className="text-sm font-bold text-slate-800">142</span>
              <span className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">Bautizados este año</span>
            </div>
            {/* Metric 3 */}
            <div className="bg-white rounded-xl p-3 flex flex-col items-center text-center shadow-sm relative overflow-hidden border border-slate-100">
              <div className="w-7 h-7 rounded-full bg-[#ffd9de] flex items-center justify-center text-[#663a42] mb-1.5">
                <span className="material-symbols-outlined text-[16px]">favorite</span>
              </div>
              <span className="text-sm font-bold text-slate-800">98%</span>
              <span className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">Conectados activamente</span>
            </div>
          </div>
        </section>

        {/* Members Directory List */}
        <section className="px-5 mt-5 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#386458] text-[18px]">nature_people</span>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Miembros Activos y Familias</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{filteredMembers.length} recientes</span>
          </div>

          {/* Members loop */}
          {filteredMembers.map((m) => (
            <div 
              key={m.id}
              className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3.5 border border-slate-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 shadow-sm border border-slate-100">
                    <img className="w-full h-full object-cover" alt={m.name} src={m.img} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">{m.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{m.role}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full ${m.badgeColor} text-[9px] font-bold uppercase tracking-wider shrink-0 shadow-sm`}>
                  {m.tag}
                </span>
              </div>

              {/* Subtitle /cottage segment if present */}
              {m.metaIcon && (
                <div className="bg-[#e7f6ff]/80 rounded-lg p-2.5 flex items-center justify-between text-[#404845]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#386458] text-[18px]">{m.metaIcon}</span>
                    <span className="text-[10px] font-semibold">{m.metaText}</span>
                  </div>
                  {m.metaRightText && (
                    <span className="text-[10px] font-bold text-[#42617d]">{m.metaRightText}</span>
                  )}
                </div>
              )}

              {/* Badges section if present */}
              {(m.secondaryBadge || m.secondaryBadge2) && (
                <div className="flex items-center gap-2">
                  {m.secondaryBadge && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f4faff] border border-slate-100 text-slate-500 text-[10px] font-medium">
                      <span className="material-symbols-outlined text-[14px] text-[#386458]">{m.secondaryBadgeIcon}</span>
                      {m.secondaryBadge}
                    </span>
                  )}
                  {m.secondaryBadge2 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f4faff] border border-slate-100 text-slate-500 text-[10px] font-medium">
                      <span className="material-symbols-outlined text-[14px] text-[#42617d]">{m.secondaryBadgeIcon2}</span>
                      {m.secondaryBadge2}
                    </span>
                  )}
                </div>
              )}

              {/* Note section if present */}
              {m.noteText && (
                <div className="bg-[#e7f6ff]/80 rounded-lg p-2.5 flex items-center gap-2 text-[#404845]">
                  <span className="material-symbols-outlined text-[#7f4e57] text-[18px]">{m.noteIcon}</span>
                  <p className="text-[10px] leading-snug font-medium">
                    {m.noteText}
                  </p>
                </div>
              )}

              {/* Card Footer & Action buttons */}
              <div className="flex items-center justify-between pt-1">
                {m.avatars ? (
                  <div className="flex items-center -space-x-1.5">
                    {m.avatars.map((av, index) => (
                      <div 
                        key={index}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm border border-white ${
                          index === 2 ? "bg-[#cde5ff] text-[#294964]" : "bg-[#e0f0fb] text-[#404845]"
                        }`}
                      >
                        {av}
                      </div>
                    ))}
                  </div>
                ) : m.footerText ? (
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    {m.footerIcon && <span className="material-symbols-outlined text-[14px] text-[#386458]">{m.footerIcon}</span>}
                    {m.footerText}
                  </span>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => alert(`Enviando mensaje rápido de WhatsApp a "${m.name}"...`)}
                    className="h-9 px-3.5 rounded-full bg-[#bdeddd] hover:bg-[#a1d0c1] text-[#214e43] text-[11px] font-bold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-sm"
                    style={{ borderRadius: "4px" }}
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    <span>{m.primaryBtnText}</span>
                  </button>
                  
                  {m.secondaryBtnIcon === "more_vert" ? (
                    <button 
                      onClick={() => alert("Mostrando más opciones...")}
                      className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 active:scale-95 transition-all shadow-sm border border-slate-100"
                    >
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => alert(`Llamando o escribiendo a través de la vía secundaria...`)}
                      className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-[#42617d] active:scale-95 transition-all shadow-sm border border-slate-100"
                    >
                      <span className="material-symbols-outlined text-[18px]">{m.secondaryBtnIcon}</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}

          {filteredMembers.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-8 font-medium">No se encontraron miembros para la búsqueda.</p>
          )}
        </section>

        {/* Floating Add New Member Trigger with correct icon */}
        <div className="px-5 mt-6 flex justify-center">
          <button 
            onClick={() => onNavigateToCenso ? onNavigateToCenso() : setShowAddMemberModal(true)}
            className="w-full max-w-xs h-12 py-3 px-6 bg-[#386458] hover:bg-[#2c4e45] text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2.5 active:scale-95 transition-all cursor-pointer"
            style={{ borderRadius: "4px" }}
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">person_add</span>
            </div>
            <span className="tracking-wide">+ Registrar Nuevo Miembro</span>
          </button>
        </div>

      </div>

      {/* Modal interactivo de creación de miembro */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl animate-[scaleIn_0.2s_ease-out]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800">Registrar en la Comunidad</h3>
              <button onClick={() => setShowAddMemberModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 font-bold uppercase">Nombre Completo / Familia</label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="ej: Familia Pérez Silva o Juan Díaz"
                  className="w-full px-4 py-3 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:ring-1 focus:ring-[#386458] outline-none"
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 font-bold uppercase">Clasificación / Rol</label>
                <input
                  type="text"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="ej: Matrimonio, Líder, Joven..."
                  className="w-full px-4 py-3 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:ring-1 focus:ring-[#386458] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 font-bold uppercase">Categoría</label>
                <select
                  value={newMemberType}
                  onChange={(e) => setNewMemberType(e.target.value as any)}
                  className="w-full px-4 py-3 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:ring-1 focus:ring-[#386458] bg-white outline-none"
                >
                  <option value="familias">Familia</option>
                  <option value="celulas">Célula / Voluntario</option>
                  <option value="lideres">Líder</option>
                  <option value="nuevos">Nuevo Creyente</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
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
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
