import React, { useState } from "react";

interface CellGroup {
  id: number;
  name: string;
  zone: string;
  type: string;
  category: "norte" | "centro" | "sur" | "jovenes" | "matrimonios";
  leaders: string;
  timeAndPlace: string;
  icon: string;
  badgeBg: string;
  badgeText: string;
  capacity?: number;
  averageAttendance?: number;
  subDetail?: string;
  connectedCountText: string;
}

export default function CelulasScreen() {
  const [selectedZone, setSelectedFilterZone] = useState<"todas" | "norte" | "centro" | "sur" | "jovenes" | "matrimonios">("todas");
  const [showAddCellModal, setShowAddCellModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form states for new cell group
  const [newCellName, setNewCellName] = useState("");
  const [newCellLeaders, setNewCellLeaders] = useState("");
  const [newCellZone, setNewCellZone] = useState<"norte" | "centro" | "sur" | "jovenes" | "matrimonios">("norte");
  const [newCellSchedule, setNewCellSchedule] = useState("");

  const [cells, setCells] = useState<CellGroup[]>([
    {
      id: 1,
      name: "Célula Gracia & Verdad",
      zone: "Zona Norte",
      type: "Familiar",
      category: "norte",
      leaders: "Carlos & Patricia Méndez",
      timeAndPlace: "Miércoles 20:00 hrs · Casa Flia. Rojas",
      icon: "church",
      badgeBg: "bg-[#bdeddd] text-[#214e43]",
      badgeText: "Zona Norte",
      capacity: 88,
      averageAttendance: 14,
      connectedCountText: "14 hermanos"
    },
    {
      id: 2,
      name: "Célula Semillas de Fe",
      zone: "Zona Campus",
      type: "Jóvenes Univ.",
      category: "jovenes",
      leaders: "Andrea Morales",
      timeAndPlace: "Jueves 19:30 hrs",
      subDetail: "Evangelio de Juan",
      icon: "school",
      badgeBg: "bg-[#bddefe] text-[#43627e]",
      badgeText: "Jóvenes Univ.",
      connectedCountText: "18 jóvenes conectados"
    },
    {
      id: 3,
      name: "Célula Matrimonios en Roca",
      zone: "Zona Oriente",
      type: "Matrimonios",
      category: "matrimonios",
      leaders: "Marcos & Elena Silva",
      timeAndPlace: "Viernes 20:30 hrs · Hogar Silva",
      icon: "favorite",
      badgeBg: "bg-[#ffd9de] text-[#663a42]",
      badgeText: "Matrimonios",
      connectedCountText: "8 parejas inscritas"
    }
  ]);

  const handleAddCell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCellName.trim()) return;

    const newGroup: CellGroup = {
      id: cells.length + 1,
      name: newCellName,
      zone: newCellZone === "norte" ? "Zona Norte" : newCellZone === "centro" ? "Zona Centro" : newCellZone === "sur" ? "Zona Sur" : newCellZone === "jovenes" ? "Zona Campus" : "Zona Oriente",
      type: newCellZone === "jovenes" ? "Jóvenes Univ." : newCellZone === "matrimonios" ? "Matrimonios" : "Familiar",
      category: newCellZone,
      leaders: newCellLeaders || "Por asignar",
      timeAndPlace: newCellSchedule || "Horario por definir",
      icon: newCellZone === "jovenes" ? "school" : newCellZone === "matrimonios" ? "favorite" : "church",
      badgeBg: newCellZone === "jovenes" ? "bg-[#bddefe] text-[#43627e]" : newCellZone === "matrimonios" ? "bg-[#ffd9de] text-[#663a42]" : "bg-[#bdeddd] text-[#214e43]",
      badgeText: newCellZone === "norte" ? "Zona Norte" : newCellZone === "centro" ? "Zona Centro" : newCellZone === "sur" ? "Zona Sur" : newCellZone === "jovenes" ? "Jóvenes Univ." : "Matrimonios",
      connectedCountText: "0 inscritos"
    };

    setCells([...cells, newGroup]);
    setShowAddCellModal(false);
    setNewCellName("");
    setNewCellLeaders("");
    setNewCellSchedule("");
    setSuccessToast(`¡Célula "${newCellName}" aperturada con éxito!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const filteredCells = cells.filter(cell => 
    selectedZone === "todas" || cell.category === selectedZone
  );

  return (
    <div className="flex-1 pb-24 relative overflow-hidden flex flex-col justify-between animate-[fadeIn_0.25s_ease-out] font-body-md text-body-md text-[#0e1d25]">
      
      {/* Toast de Éxito */}
      {successToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded shadow-lg z-50 flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
          <span>{successToast}</span>
        </div>
      )}

      <div className="flex flex-col w-full px-5 space-y-5">
        
        {/* Encabezado de Sección */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#bddefe]/60 mb-2">
            <span className="material-symbols-outlined text-[16px] text-[#43627e] font-bold">diversity_1</span>
            <span className="text-[10px] font-bold text-[#43627e] uppercase tracking-wider">Vida en Comunidad</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Grupos Pequeños & Células</h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">Comunidad, discipulado en hogares y cuidado mutuo.</p>
        </div>

        {/* Métricas de Impacto del Mes */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-[#e7f6ff] rounded-lg p-3 flex flex-col justify-between shadow-sm relative overflow-hidden border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-[#386458]/10 flex items-center justify-center text-[#386458] mb-2 shrink-0">
              <span className="material-symbols-outlined text-[18px]">cottage</span>
            </div>
            <div>
              <span className="text-base font-bold text-[#386458] block leading-none">28</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-tight block mt-1">Células Activas</span>
            </div>
            <div className="absolute -right-2 -bottom-2 w-10 h-10 bg-[#386458]/5 rounded-full pointer-events-none"></div>
          </div>

          <div className="bg-[#e7f6ff] rounded-lg p-3 flex flex-col justify-between shadow-sm relative overflow-hidden border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-[#42617d]/10 flex items-center justify-center text-[#42617d] mb-2 shrink-0">
              <span className="material-symbols-outlined text-[18px]">group</span>
            </div>
            <div>
              <span className="text-base font-bold text-[#42617d] block leading-none">340</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-tight block mt-1">Hermanos Semanales</span>
            </div>
            <div className="absolute -right-2 -bottom-2 w-10 h-10 bg-[#42617d]/5 rounded-full pointer-events-none"></div>
          </div>

          <div className="bg-[#e7f6ff] rounded-lg p-3 flex flex-col justify-between shadow-sm relative overflow-hidden border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-[#7f4e57]/10 flex items-center justify-center text-[#7f4e57] mb-2 shrink-0">
              <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
            </div>
            <div>
              <span className="text-base font-bold text-[#7f4e57] block leading-none">+12</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-tight block mt-1">Nuevos Hogares</span>
            </div>
            <div className="absolute -right-2 -bottom-2 w-10 h-10 bg-[#7f4e57]/5 rounded-full pointer-events-none"></div>
          </div>
        </div>

        {/* Botón de Acción Rápida Principal */}
        <button 
          onClick={() => setShowAddCellModal(true)}
          className="w-full bg-[#386458] hover:bg-[#2c4e45] text-white py-3.5 px-6 flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer text-xs font-bold"
          style={{ borderRadius: "4px" }}
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Aperturar Nueva Célula / Hogar</span>
        </button>

        {/* Mapa Interactivo de Zonas y Geolocalización */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#386458] font-bold">pin_drop</span>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Red Territorial</span>
            </div>
            <span className="text-[9px] font-bold text-[#386458] bg-[#bdeddd] px-2.5 py-0.5 rounded-full">GPS Activo</span>
          </div>

          <div 
            className="w-full h-44 rounded-xl bg-cover bg-center relative overflow-hidden flex flex-col justify-between p-3 shadow-inner" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD0qprJoD7hVBodm1JWKrfnaPNMPlPq_3zxLgpUDEI1Bqact0XfxlcURFE6IlOaOnw2Qvq_qMO6zhzc9wLDHEJUf6bBOkJ_u-CbAVhWUcpWtGs9FfMPansyksjrlb4QSbaexNjZ6SqLPo8SwcktQbOAiSm_wttl8RMNH7gAqppgmxOryQxSYvbaz-dxNJmbw6rPIQUhVdvgkmK7l1qsyo78R22ZU2QaqKqfKUm1u_ohqjan1tsUPxbl')" }}
          >
            <div className="flex justify-between items-start z-10">
              <span className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-slate-800 text-[10px] font-bold shadow-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#386458] animate-pulse"></span> 
                6 Zonas Urbanas
              </span>
              <button className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-[#386458] flex items-center justify-center shadow-sm cursor-pointer active:scale-90">
                <span className="material-symbols-outlined text-[18px]">my_location</span>
              </button>
            </div>

            {/* Pines de representación pastoral */}
            <div className="flex items-center justify-between bg-white/90 backdrop-blur-md rounded-lg p-2 shadow-sm text-slate-700 z-10">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#386458]"></span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Norte (9)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#42617d]"></span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Centro (11)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7f4e57]"></span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Sur (8)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selector de Filtros por Sector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Explorar por Sector</span>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{filteredCells.length} grupos</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 -mx-5 px-5">
            <button 
              onClick={() => setSelectedFilterZone("todas")}
              className={`px-4 py-2 rounded-full text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                selectedZone === "todas" ? "bg-[#386458] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Todas las Zonas
            </button>
            <button 
              onClick={() => setSelectedFilterZone("norte")}
              className={`px-4 py-2 rounded-full text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                selectedZone === "norte" ? "bg-[#386458] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Norte
            </button>
            <button 
              onClick={() => setSelectedFilterZone("centro")}
              className={`px-4 py-2 rounded-full text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                selectedZone === "centro" ? "bg-[#386458] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Centro
            </button>
            <button 
              onClick={() => setSelectedFilterZone("sur")}
              className={`px-4 py-2 rounded-full text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                selectedZone === "sur" ? "bg-[#386458] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Sur
            </button>
            <button 
              onClick={() => setSelectedFilterZone("jovenes")}
              className={`px-4 py-2 rounded-full text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                selectedZone === "jovenes" ? "bg-[#386458] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Jóvenes
            </button>
            <button 
              onClick={() => setSelectedFilterZone("matrimonios")}
              className={`px-4 py-2 rounded-full text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                selectedZone === "matrimonios" ? "bg-[#386458] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Matrimonios
            </button>
          </div>
        </div>

        {/* Listado de Células */}
        <div className="space-y-4">
          {filteredCells.map((cell) => (
            <div 
              key={cell.id}
              className="bg-white rounded-lg p-2 shadow-sm space-y-3.5 border border-slate-100"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full ${cell.badgeBg} text-[9px] font-bold uppercase tracking-wider`}>
                      {cell.badgeText}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{cell.type}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 leading-tight">{cell.name}</h3>
                </div>
                <div className={`w-10 h-10 rounded-full ${cell.badgeBg}/20 flex items-center justify-center shrink-0`}>
                  <span className="material-symbols-outlined text-[20px]">{cell.icon}</span>
                </div>
              </div>

              <div className="bg-[#e7f6ff]/40 rounded-xl p-3 space-y-2 text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#386458] shrink-0 font-bold">supervisor_account</span>
                  <span className="text-[11px] font-medium leading-tight">
                    Líderes: <strong className="font-bold text-slate-800">{cell.leaders}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#42617d] shrink-0 font-bold">calendar_month</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-tight">
                    {cell.timeAndPlace} {cell.subDetail && `· ${cell.subDetail}`}
                  </span>
                </div>
              </div>

              {/* Progress bar and average attendance if present */}
              {cell.capacity && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-[#386458]">groups</span>
                      Asistencia Promedio: <strong className="text-slate-800">{cell.averageAttendance} hermanos</strong>
                    </span>
                    <span className="text-[#386458]">{cell.capacity}% Capacidad</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-[#386458] rounded-full" style={{ width: `${cell.capacity}%` }}></div>
                  </div>
                </div>
              )}

              {/* Connected count text for other cards */}
              {!cell.capacity && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#42617d]"></span>
                  <span>{cell.connectedCountText}</span>
                </div>
              )}

              {/* Acciones de Célula */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button 
                  onClick={() => alert(`Enviando reporte de asistencia para la célula "${cell.name}"...`)}
                  className="bg-[#386458] hover:bg-[#2c4e45] text-white py-2.5 px-3 rounded-full text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  style={{ borderRadius: "4px" }}
                >
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                  <span>Reportar</span>
                </button>
                <button 
                  onClick={() => alert(`Abriendo chat seguro con el líder "${cell.leaders}"...`)}
                  className="bg-[#bddefe]/60 hover:bg-[#bddefe] text-[#43627e] py-2.5 px-3 rounded-full text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{ borderRadius: "4px" }}
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>Contactar</span>
                </button>
              </div>
            </div>
          ))}

          {filteredCells.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-6 font-medium">No se encontraron células en esta zona.</p>
          )}
        </div>

        {/* Tarjeta Pastoral de Acompañamiento / Recursos */}
        <div className="rounded-xl p-4 bg-white shadow-sm flex items-center gap-3 border border-slate-100">
          <div className="w-11 h-11 rounded-full bg-[#386458] text-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[22px]">auto_stories</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-800 truncate">Guía de Estudio Semanal</h4>
            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">Serie actual: "Caminando en Amor Fraternal"</p>
          </div>
          <button 
            onClick={() => alert("Descargando guía de estudio semanal en PDF...")}
            className="w-8 h-8 rounded-full bg-white text-[#386458] flex items-center justify-center shrink-0 shadow-sm border border-slate-100 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
          </button>
        </div>

      </div>

      {/* Modal para aperturar nueva célula */}
      {showAddCellModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl animate-[scaleIn_0.2s_ease-out]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800">Aperturar Nueva Célula</h3>
              <button onClick={() => setShowAddCellModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddCell} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 font-bold uppercase">Nombre de la Célula</label>
                <input
                  type="text"
                  value={newCellName}
                  onChange={(e) => setNewCellName(e.target.value)}
                  placeholder="ej: Célula Semillas de Fe"
                  className="w-full px-4 py-3 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:ring-1 focus:ring-[#386458] outline-none"
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 font-bold uppercase">Nombre de Líderes</label>
                <input
                  type="text"
                  value={newCellLeaders}
                  onChange={(e) => setNewCellLeaders(e.target.value)}
                  placeholder="ej: Marcos & Elena"
                  className="w-full px-4 py-3 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:ring-1 focus:ring-[#386458] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 font-bold uppercase">Ubicación / Zona</label>
                <select
                  value={newCellZone}
                  onChange={(e) => setNewCellZone(e.target.value as any)}
                  className="w-full px-4 py-3 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:ring-1 focus:ring-[#386458] bg-white outline-none"
                >
                  <option value="norte">Zona Norte</option>
                  <option value="centro">Zona Centro</option>
                  <option value="sur">Zona Sur</option>
                  <option value="jovenes">Jóvenes Universitarios</option>
                  <option value="matrimonios">Matrimonios</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 font-bold uppercase">Horario & Casa</label>
                <input
                  type="text"
                  value={newCellSchedule}
                  onChange={(e) => setNewCellSchedule(e.target.value)}
                  placeholder="ej: Miércoles 20:00 hrs · Casa Flia Rojas"
                  className="w-full px-4 py-3 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:ring-1 focus:ring-[#386458] outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCellModal(false)}
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
                  Aperturar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
