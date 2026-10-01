import React, { useState, useRef } from "react";
import DirectorioScreen from "./Directorio";
import CelulasScreen from "./Celulas";
import MultimediaScreen from "./Multimedia";
import PastoralScreen from "./Pastoral";
import EventosScreen from "./Eventos";
import CultoVivoScreen from "./CultoVivo";
import CensoMiembroScreen from "./CensoMiembro";
import SacramentosScreen from "./Sacramentos";
import BitacoraPastoralScreen from "./BitacoraPastoral";
import DifusionWhatsappScreen from "./DifusionWhatsapp";

// ==========================================================================
// COMPONENTE: PANTALLA 5 - ROLES DEFINIDOS (Nueva pantalla de Stitch)
// ==========================================================================
function RolesScreen() {
  const [selectedFilter, setSelectedFilter] = useState<"todos" | "liderazgo" | "ministerios" | "apoyo">("todos");
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleCategory, setNewRoleCategory] = useState<"liderazgo" | "ministerios" | "apoyo">("liderazgo");
  const [newRoleDesc, setNewRoleNameDesc] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Lista dinámica de roles iniciales
  const [roles, setRoles] = useState([
    { id: 1, title: "Pastor Principal", tag: "Total", type: "liderazgo", desc: "Acceso completo", badgeColor: "bg-[#386458]/10 text-[#386458]", checked: true, icon: "church", bgIconColor: "bg-[#bdeddd]", iconColor: "text-[#386458]", detailText: "Todas las funciones activas", members: 2 },
    { id: 2, title: "Dir. Alabanza", tag: "Multimedia", type: "ministerios", desc: "Editor en Multimedia, Solo Lectura en Pastoral", badgeColor: "bg-[#cde5ff] text-[#294964]", checked: true, icon: "graphic_eq", bgIconColor: "bg-[#cde5ff]", iconColor: "text-[#42617d]", detailText: "Audio & Video • Eventos", members: 4 },
    { id: 3, title: "Tesorero", tag: "Finanzas", type: "liderazgo", desc: "Editor en Finanzas, Solo Lectura", badgeColor: "bg-[#ffd9de] text-[#663a42]", checked: true, icon: "payments", bgIconColor: "bg-[#ffd9de]", iconColor: "text-[#7f4e57]", detailText: "Ofrendas • Balances", members: 1 },
    { id: 4, title: "Líder de Célula", tag: "Grupos", type: "apoyo", desc: "Solo Lectura", badgeColor: "bg-slate-200 text-slate-700", checked: true, icon: "groups_3", bgIconColor: "bg-[#a1d0c1]/40", iconColor: "text-[#386458]", detailText: "Asistencia • Contacto", members: 12 },
    { id: 5, title: "Voluntario", tag: "Básico", type: "apoyo", desc: "Acceso limitado", badgeColor: "bg-[#daebf5] text-[#294964]", checked: false, icon: "volunteer_activism", bgIconColor: "bg-[#aacaea]/30", iconColor: "text-[#42617d]", detailText: "Turnos • Avisos", members: 28 },
  ]);

  const handleToggleSwitch = (id: number) => {
    setRoles(prev => 
      prev.map(r => r.id === id ? { ...r, checked: !r.checked } : r)
    );
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const newRole = {
      id: roles.length + 1,
      title: newRoleName,
      tag: newRoleCategory.charAt(0).toUpperCase() + newRoleCategory.slice(1),
      type: newRoleCategory,
      desc: newRoleDesc || "Acceso personalizado",
      badgeColor: newRoleCategory === "liderazgo" ? "bg-[#386458]/10 text-[#386458]" : newRoleCategory === "ministerios" ? "bg-[#cde5ff] text-[#294964]" : "bg-slate-200 text-slate-700",
      checked: true,
      icon: newRoleCategory === "liderazgo" ? "admin_panel_settings" : newRoleCategory === "ministerios" ? "palette" : "support_agent",
      bgIconColor: newRoleCategory === "liderazgo" ? "bg-[#bdeddd]" : newRoleCategory === "ministerios" ? "bg-[#cde5ff]" : "bg-slate-100",
      iconColor: newRoleCategory === "liderazgo" ? "text-[#386458]" : newRoleCategory === "ministerios" ? "text-[#42617d]" : "text-slate-600",
      detailText: "Permisos personalizados asignados",
      members: 0
    };

    setRoles([...roles, newRole]);
    setShowAddRoleModal(false);
    setNewRoleName("");
    setNewRoleNameDesc("");
    setSuccessToast(`¡Rol "${newRoleName}" creado con armonía y éxito!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const filteredRoles = roles.filter(r => 
    selectedFilter === "todos" || r.type === selectedFilter
  );

  return (
    <div className="flex-1 pb-24 relative overflow-hidden flex flex-col justify-between animate-[fadeIn_0.25s_ease-out]">
      <div className="flex flex-col w-full px-5 space-y-5 relative">
        
        {/* Success Toast */}
        {successToast && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded shadow-lg z-50 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
            <span>{successToast}</span>
          </div>
        )}

        {/* Ambient Misty Header Banner */}
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[#e7f6ff] via-[#e0f0fb] to-[#bddefe]/40 p-5 shadow-sm border border-slate-100 backdrop-blur-md">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#386458]/10 blur-2xl pointer-events-none"></div>
          <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-blue-100/30 blur-xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col space-y-3">
            <div className="inline-flex items-center space-x-1.5 self-start px-3 py-1 rounded-full bg-white/80 text-[#386458] shadow-sm backdrop-blur-sm">
              <span className="material-symbols-outlined text-[16px] font-bold">verified_user</span>
              <span className="text-[9px] font-bold uppercase tracking-wider">Gestión Consciente</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Roles Definidos</h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[280px]">
              Armonía, privilegios y accesos para el cuidado responsable de tu comunidad.
            </p>
          </div>

          {/* Live Filter Pills */}
          <div className="relative z-10 flex items-center space-x-2 pt-4 overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => setSelectedFilter("todos")}
              className={`px-4 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                selectedFilter === "todos" ? "bg-[#386458] text-white shadow-sm" : "bg-white/70 text-slate-600 hover:bg-white"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Todos ({roles.length})
            </button>
            <button 
              onClick={() => setSelectedFilter("liderazgo")}
              className={`px-4 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                selectedFilter === "liderazgo" ? "bg-[#386458] text-white shadow-sm" : "bg-white/70 text-slate-600 hover:bg-white"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Liderazgo
            </button>
            <button 
              onClick={() => setSelectedFilter("ministerios")}
              className={`px-4 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                selectedFilter === "ministerios" ? "bg-[#386458] text-white shadow-sm" : "bg-white/70 text-slate-600 hover:bg-white"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Ministerios
            </button>
            <button 
              onClick={() => setSelectedFilter("apoyo")}
              className={`px-4 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                selectedFilter === "apoyo" ? "bg-[#386458] text-white shadow-sm" : "bg-white/70 text-slate-600 hover:bg-white"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Apoyo
            </button>
          </div>
        </div>

        {/* Role List Section */}
        <div className="flex flex-col space-y-4">
          {filteredRoles.map((role) => (
            <div 
              key={role.id}
              className="group relative rounded-[10px] bg-white border border-slate-100 p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3.5">
                  <div className={`w-11 h-11 rounded-full ${role.bgIconColor} flex items-center justify-center ${role.iconColor} shadow-inner shrink-0 mt-0.5`}>
                    <span className="material-symbols-outlined text-[22px]">{role.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 leading-tight">{role.title}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${role.badgeColor}`}>
                        {role.tag}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal font-medium">{role.desc}</p>
                    
                    {role.checked ? (
                      <div className="flex items-center space-x-1 mt-2 text-[#386458]">
                        <span className="material-symbols-outlined text-[15px] font-bold">check_circle</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">{role.detailText}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 mt-2 text-slate-400">
                        <span className="material-symbols-outlined text-[15px] font-bold">pause_circle</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Rol Suspendido</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Organic Mindora Switch Toggle */}
                <button 
                  onClick={() => handleToggleSwitch(role.id)}
                  aria-checked={role.checked} 
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300 ${
                    role.checked ? "bg-[#386458]" : "bg-slate-200"
                  }`} 
                  role="switch"
                >
                  <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                    role.checked ? "translate-x-5" : "translate-x-0"
                  }`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3.5 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{role.members} Miembros asignados</span>
                <button 
                  onClick={() => alert(`Editando privilegios para el rol "${role.title}"...`)}
                  className="px-4 py-1.5 rounded-full bg-[#f4faff] text-[#386458] hover:bg-[#bdeddd]/60 transition-colors flex items-center space-x-1 text-[11px] font-bold cursor-pointer"
                  style={{ borderRadius: "4px" }}
                >
                  <span>Editar</span>
                  <span className="material-symbols-outlined text-[15px]">tune</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mindora Peaceful Insight & Action Panel */}
        <div className="relative overflow-hidden rounded-lg bg-[#ffd9de]/30 p-4 flex items-center justify-between backdrop-blur-sm border border-[#ffd9de]/50 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#ffd9de] flex items-center justify-center text-[#7f4e57] shrink-0">
              <span className="material-symbols-outlined text-[18px]">lock_reset</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800">Auditoría de Permisos</span>
              <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Última revisión: Hoy, 09:30</span>
            </div>
          </div>
          <button 
            onClick={() => alert("Iniciando auditoría de seguridad y privilegios...")}
            className="px-4 py-2 bg-[#7f4e57] hover:bg-[#663a42] text-white text-[11px] font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
            style={{ borderRadius: "4px" }}
          >
            Revisar
          </button>
        </div>

        {/* Floating Add New Role Trigger */}
        <div className="pt-2">
          <button 
            onClick={() => setShowAddRoleModal(true)}
            className="w-full py-4 px-5 bg-[#386458] hover:bg-[#2c4e45] text-white text-xs font-bold shadow-[0_8px_24px_rgba(56,100,88,0.25)] flex items-center justify-center space-x-2 active:scale-[0.99] transition-all cursor-pointer"
            style={{ borderRadius: "4px" }}
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Crear Nuevo Rol Personalizado</span>
          </button>
        </div>

      </div>

      {/* Modal interactivo de creación de rol */}
      {showAddRoleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl animate-[scaleIn_0.2s_ease-out]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800">Nuevo Rol de Cuidado</h3>
              <button onClick={() => setShowAddRoleModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateRole} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 font-bold uppercase">Nombre del Rol</label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="ej: Diácono Auxiliar"
                  className="w-full px-4 py-3 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:ring-1 focus:ring-[#386458] outline-none"
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 font-bold uppercase">Clasificación</label>
                <select
                  value={newRoleCategory}
                  onChange={(e) => setNewRoleCategory(e.target.value as any)}
                  className="w-full px-4 py-3 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:ring-1 focus:ring-[#386458] bg-white outline-none"
                >
                  <option value="liderazgo">Liderazgo (Eucalipto)</option>
                  <option value="ministerios">Ministerio (Sky Blue)</option>
                  <option value="apoyo">Apoyo / Servicio (Gris)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 font-bold uppercase">Descripción de Accesos</label>
                <input
                  type="text"
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleNameDesc(e.target.value)}
                  placeholder="ej: Escritura en Eventos, Lectura en Finanzas"
                  className="w-full px-4 py-3 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:ring-1 focus:ring-[#386458] outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(false)}
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
                  Crear Rol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================================================
// COMPONENTE: PANTALLA 4 - FINANZAS DASHBOARD (Nueva pantalla de Stitch)
// ==========================================================================
function FinanzasDashboardScreen({ 
  onNavigateToForm 
}: { 
  onNavigateToForm: () => void 
}) {
  const [selectedCategory, setSelectedCategory] = useState<"todos" | "ministerios" | "misiones" | "operaciones">("todos");

  const transactions = [
    { id: 1, title: "Diezmo Mensual Familia Silva", category: "ministerios", amount: 120000, type: "plus", date: "Ayer, 18:30", badgeText: "Diezmo", badgeColor: "bg-[#bdeddd] text-[#214e43]", textColor: "text-[#386458]", bgIconColor: "bg-[#bdeddd]/60", icon: "spa" },
    { id: 2, title: "Ofrenda Misión Patagonia", category: "misiones", amount: 65000, type: "plus", date: "14 May, 10:15", badgeText: "Ofrenda", badgeColor: "bg-[#cde5ff] text-[#294964]", textColor: "text-[#42617d]", bgIconColor: "bg-[#cde5ff]/50", icon: "public" },
    { id: 3, title: "Servicios Básicos & Suministros", category: "operaciones", amount: 48500, type: "minus", date: "12 May, 09:40", badgeText: "Gasto", badgeColor: "bg-[#ffd9de] text-[#663a42]", textColor: "text-[#7f4e57]", bgIconColor: "bg-[#ffd9de]", icon: "water_drop" },
    { id: 4, title: "Retiro de Meditación & Jóvenes", category: "ministerios", amount: 85000, type: "plus", date: "10 May, 17:00", badgeText: "Ofrenda", badgeColor: "bg-[#bdeddd] text-[#214e43]", textColor: "text-[#386458]", bgIconColor: "bg-[#bdeddd]/60", icon: "diversity_1" }
  ];

  const filteredTransactions = transactions.filter(t => 
    selectedCategory === "todos" || t.category === selectedCategory
  );

  return (
    <div className="flex-1 pb-24 relative overflow-hidden flex flex-col justify-between animate-[fadeIn_0.25s_ease-out]">
      <div className="flex flex-col w-full px-5 space-y-5 relative">
        
        {/* Balance Consolidado Card */}
        <div className="relative w-full overflow-hidden rounded-[10px] bg-gradient-to-b from-[#e7f6ff] via-[#e0f0fb] to-[#daebf5]/80 p-5 shadow-[0_12px_32px_-8px_rgba(47,62,70,0.08)] backdrop-blur-xl border border-slate-200/40">
          <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-[#386458]/10 blur-2xl pointer-events-none"></div>
          <div className="absolute -left-10 -bottom-10 w-36 h-36 rounded-full bg-blue-100/40 blur-xl pointer-events-none"></div>
          
          <div className="relative flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#386458]/10 text-[#386458]">
                  <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                </span>
                <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">Balance Consolidado</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white text-[#386458] text-[9px] font-bold shadow-sm border border-slate-100">
                <span className="w-1.5 h-1.5 rounded-full bg-[#386458] mr-1.5 animate-pulse"></span>
                Actualizado Hoy
              </span>
            </div>

            <div className="flex flex-col pt-1">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Fondo Total Disponible</div>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-2xl font-bold text-slate-900 tracking-tight">CLP $1.500.000</span>
              </div>
              <div className="flex items-center space-x-1 text-[#386458] mt-1.5 font-bold text-xs">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span>+8.4% vs. mes anterior</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button 
                onClick={onNavigateToForm}
                className="group flex items-center justify-center space-x-2 py-3 px-3.5 bg-[#386458] hover:bg-[#2c4e45] text-white text-[11px] font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer"
                style={{ borderRadius: "4px" }}
              >
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:rotate-12">volunteer_activism</span>
                <span className="truncate">Registrar Diezmo</span>
              </button>
              <button 
                onClick={() => alert("Mostrando reportes financieros...")}
                className="group flex items-center justify-center space-x-2 py-3 px-3.5 bg-[#cde5ff] hover:bg-[#aecdf5] text-[#294964] text-[11px] font-bold shadow-sm hover:shadow active:scale-[0.98] transition-all cursor-pointer"
                style={{ borderRadius: "4px" }}
              >
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:scale-110">donut_large</span>
                <span className="truncate">Ver Reportes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Category Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-hide -mx-5 px-5">
          <button 
            onClick={() => setSelectedCategory("todos")}
            className={`px-4 py-2 text-[11px] font-bold shrink-0 transition-all cursor-pointer active:scale-95 ${
              selectedCategory === "todos" 
                ? "bg-[#386458] text-white shadow-sm" 
                : "bg-[#e0f0fb] text-[#294964] hover:bg-[#ccdce7]"
            }`}
            style={{ borderRadius: "4px" }}
          >
            Todos
          </button>
          <button 
            onClick={() => setSelectedCategory("ministerios")}
            className={`px-4 py-2 text-[11px] font-bold shrink-0 transition-all cursor-pointer active:scale-95 ${
              selectedCategory === "ministerios" 
                ? "bg-[#386458] text-white shadow-sm" 
                : "bg-[#e0f0fb] text-[#294964] hover:bg-[#ccdce7]"
            }`}
            style={{ borderRadius: "4px" }}
          >
            Ministerios
          </button>
          <button 
            onClick={() => setSelectedCategory("misiones")}
            className={`px-4 py-2 text-[11px] font-bold shrink-0 transition-all cursor-pointer active:scale-95 ${
              selectedCategory === "misiones" 
                ? "bg-[#386458] text-white shadow-sm" 
                : "bg-[#e0f0fb] text-[#294964] hover:bg-[#ccdce7]"
            }`}
            style={{ borderRadius: "4px" }}
          >
            Misiones
          </button>
          <button 
            onClick={() => setSelectedCategory("operaciones")}
            className={`px-4 py-2 text-[11px] font-bold shrink-0 transition-all cursor-pointer active:scale-95 ${
              selectedCategory === "operaciones" 
                ? "bg-[#386458] text-white shadow-sm" 
                : "bg-[#e0f0fb] text-[#294964] hover:bg-[#ccdce7]"
            }`}
            style={{ borderRadius: "4px" }}
          >
            Operaciones
          </button>
        </div>

        {/* Budget Distribution Card */}
        <div className="flex flex-col rounded-[10px] bg-white border border-slate-100 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Distribución del Presupuesto</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Metas y asignación armónica mensual</p>
            </div>
            <span className="material-symbols-outlined text-[#386458] text-[20px]">pie_chart</span>
          </div>

          <div className="flex items-center justify-between pt-1 gap-2">
            {/* SVG Circular progress */}
            <div className="relative flex items-center justify-center w-28 h-28 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle className="text-slate-100" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="12"></circle>
                <circle className="text-[#386458]" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="138.16" strokeWidth="12"></circle>
                <circle className="text-[#42617d]" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="175.84" strokeWidth="12" transform="rotate(162 50 50)"></circle>
                <circle className="text-[#7f4e57]" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="188.4" strokeWidth="12" transform="rotate(270 50 50)"></circle>
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-800 leading-none">100%</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none mt-1">Asignado</span>
              </div>
            </div>

            {/* Segment breakdown legends */}
            <div className="flex flex-col space-y-2 flex-1 pl-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#386458]"></span>
                  <span className="text-[11px] font-bold text-slate-700">Ministerios</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-800">45%</span>
                  <span className="block text-[10px] text-slate-400 font-medium">$675.000</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#42617d]"></span>
                  <span className="text-[11px] font-bold text-slate-700">Misiones</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-800">30%</span>
                  <span className="block text-[10px] text-slate-400 font-medium">$450.000</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7f4e57]"></span>
                  <span className="text-[11px] font-bold text-slate-700">Operaciones</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-800">25%</span>
                  <span className="block text-[10px] text-slate-400 font-medium">$375.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reflection Banner */}
        <div className="relative overflow-hidden rounded-lg bg-[#e7f6ff] p-4 flex items-center space-x-4 border border-slate-100/50 shadow-sm">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-[#bdeddd] flex items-center justify-center">
            <img 
              className="w-full h-full object-cover" 
              alt="Eucalyptus" 
              src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=150"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">Mayordomía en Paz</p>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">"Cada contribución fluye como una semilla de bendición y propósito."</p>
          </div>
          <span className="material-symbols-outlined text-[#386458] text-[20px] shrink-0">spa</span>
        </div>

        {/* Recent Transactions List */}
        <div className="flex flex-col space-y-3 pb-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-slate-900">Transacciones Recientes</h2>
            <button className="text-[11px] text-[#386458] font-bold flex items-center space-x-0.5 hover:underline">
              <span>Historial</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          <div className="flex flex-col space-y-2.5">
            {filteredTransactions.map((tx) => (
              <div 
                key={tx.id}
                className="flex items-center justify-between p-4 rounded-[10px] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`w-11 h-11 rounded-full ${tx.bgIconColor} flex items-center justify-center shrink-0`}>
                    <span className={`material-symbols-outlined text-[20px] ${tx.textColor}`}>{tx.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate leading-tight">{tx.title}</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${tx.badgeColor}`}>
                        {tx.badgeText}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">{tx.date}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right shrink-0 pl-2">
                  <span className={`text-xs font-bold ${tx.type === "plus" ? "text-[#386458]" : "text-[#7f4e57]"}`}>
                    {tx.type === "plus" ? "+" : "-"} ${new Intl.NumberFormat("es-CL").format(tx.amount)}
                  </span>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{tx.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================================================
// COMPONENTE: PANTALLA 3 - COMUNICACIONES (Stitch)
// ==========================================================================
function ComunicacionesScreen({ 
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
    { title: "Meditación Lunar de Primavera", channel: "WhatsApp • 1,420 contactos", date: "Ayer, 19:40", status: "Enviado", badgeColor: "bg-[#bdeddd] text-[#214e43]", dotColor: "bg-[#386458]", bgIconColor: "bg-[#bdeddd]/45", textColor: "text-[#386458]", icon: "mark_chat_read" },
    { title: "Respirar en Calma - Guía Semanal", channel: "Email • Segmento Serenidad", date: "Mañana, 07:00", status: "Programado", badgeColor: "bg-[#cde5ff] text-[#294964]", dotColor: "bg-[#42617d]", bgIconColor: "bg-[#cde5ff]/60", textColor: "text-[#42617d]", icon: "upcoming" },
    { title: "Volumen 19: Silencio Interior", channel: "Boletín • Edición imprimible", date: "Editado hace 2h", status: "Borrador", badgeColor: "bg-[#ffd9de] text-[#663a42]", dotColor: "bg-[#7f4e57]", bgIconColor: "bg-[#ffd9de]/80", textColor: "text-[#7f4e57]", icon: "draft" },
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

        <div className="relative w-full rounded-2xl p-5 bg-white/80 backdrop-blur-md shadow-sm border border-slate-100 flex flex-col space-y-3 overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#386458]/10 blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#386458]/10 text-[#386458]">
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
              <span className="text-[10px] font-bold">Canal Consciente</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Conexión y comunidad</span>
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Comunicaciones del Templo</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Transmite serenidad y guía a tu comunidad a través de canales diseñados para la paz mental.
            </p>
          </div>

          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => setSelectedFilter("todos")}
              className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                selectedFilter === "todos" ? "bg-[#386458] text-white shadow-sm" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Todos los Canales
            </button>
            <button 
              onClick={() => setSelectedFilter("campañas")}
              className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                selectedFilter === "campañas" ? "bg-[#386458] text-white shadow-sm" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Campañas Activas
            </button>
            <button 
              onClick={() => setSelectedFilter("lecturas")}
              className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                selectedFilter === "lecturas" ? "bg-[#386458] text-white shadow-sm" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
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
                <span className="text-sm font-bold text-slate-800">3,890 mentes</span>
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
          <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm space-y-3">
            {historyItems.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-3 border border-slate-100/50">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-full ${item.bgIconColor} flex items-center justify-center shrink-0`}>
                    <span className={`material-symbols-outlined text-[20px] ${item.textColor}`}>{item.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate leading-tight">{item.title}</span>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium">{item.channel}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`px-2.5 py-1 rounded-full ${item.badgeColor} text-[9px] font-bold uppercase inline-flex items-center gap-1 shadow-sm`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor}`}></span>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================================================
// COMPONENTE: PANTALLA 2 - INICIO (Samuel Pastoral)
// ==========================================================================
function InicioScreen({ 
  onNavigateToForm, 
  onNavigateToHistory,
  onNavigateToModule
}: { 
  onNavigateToForm: () => void; 
  onNavigateToHistory: () => void; 
  onNavigateToModule?: (screen: "celulas" | "personas" | "roles" | "multimedia") => void;
}) {
  const [isCultoActive, setIsCultoActive] = useState(false);
  const [activeDayInfo, setActiveDayInfo] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const progressIntervalRef = useRef<any>(null);

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
    <div className="flex-1 pb-24 relative overflow-hidden flex flex-col justify-between animate-[fadeIn_0.25s_ease-out]">
      <div className="flex flex-col w-full px-5 pb-10 space-y-5 relative">
        <div className="absolute -top-16 -left-20 w-80 h-80 rounded-full bg-[#386458]/10 blur-3xl pointer-events-none"></div>
        
        {/* Warm Welcome Hero Card */}
        <div className="relative w-full rounded-[10px] overflow-hidden bg-white/80 backdrop-blur-md p-5 shadow-sm border border-slate-100">
          <div 
            className="absolute inset-0 z-0 opacity-25 pointer-events-none bg-cover bg-center" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA_RHG1CHPqdPv6UwBtKhAOVuoJE_n4QZESNqBBh3_qpYgNebQNWPoCHyzR1ltb5A6iaV7NSem_8S431GE3_MjDlTMGJo-TGOZ0YCtSQVquwFrQiboiXjcu-OqDC8H5l6MuI_GWePvFFszpl8KQdRywTDiueEUs2vDAxq2ckQyVaCDz2sXu-f2s4dz8btyvlDx1F2t3-fZNvamOQTClZjf204_g8dMEIw5TZQ3F2A93NlwOK52TzAOo')" }}
          ></div>
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
          
          <div className="relative z-10 flex flex-col space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#386458]/10 text-[#386458]">
                <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                <span className="text-[11px] font-bold tracking-wide">Paz y Gracia</span>
              </div>
              <span className="text-[11px] text-slate-500/80 font-medium">Domingo, 27 de Oct</span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Buenos días, Pastor Samuel</h2>
              <p className="text-[12px] text-slate-500 italic mt-1 leading-relaxed">"La paz os dejo, mi paz os doy; que sus corazones descansen hoy con alegría."</p>
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
            <button className="text-[11px] text-[#386458] font-bold hover:underline">Ver Todos</button>
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

            <div onClick={onNavigateToHistory} className="col-span-2 flex items-center justify-between p-4 rounded-[10px] bg-white border border-slate-100 shadow-sm hover:bg-slate-50 transition-all cursor-pointer" role="button">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#bdeddd]/45 text-[#386458] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Comunicaciones</h4>
                  <p className="text-[10px] text-slate-400">Boletín dominical & SMS</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#386458] text-white text-[9px] font-bold uppercase">98% enviado</span>
            </div>
          </div>
        </div>

        {/* Devocional */}
        <div className="relative w-full rounded-[10px] bg-white/95 backdrop-blur-md p-4 shadow-sm overflow-hidden flex items-center space-x-4 border border-slate-100">
          <img src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=150" alt="Devocional" className="w-14 h-14 rounded-full object-cover shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center space-x-1 text-[#386458]">
              <span className="material-symbols-outlined text-[15px]">self_improvement</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Pausa Espiritual</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 truncate">Momento de Oración & Calma</h4>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{isPlayingAudio ? `Reproduciendo... ${audioProgress}%` : "Guía de 5 minutos antes del servicio"}</p>
            {isPlayingAudio && (
              <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#386458] h-full transition-all duration-300" style={{ width: `${audioProgress}%` }} />
              </div>
            )}
          </div>
          <button onClick={handlePlayAudio} className="w-9 h-9 rounded-full bg-[#386458] text-white flex items-center justify-center shrink-0 shadow-md cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">{isPlayingAudio ? "pause" : "play_arrow"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

// ==========================================================================
// NAVEGACIÓN PRINCIPAL (MENÚ HAMBURGUESA)
// ==========================================================================
type ScreenId =
  | "inicio"
  | "formulario"
  | "comunicaciones"
  | "finanzas"
  | "roles"
  | "personas"
  | "celulas"
  | "multimedia"
  | "pastoral"
  | "eventos"
  | "culto_vivo"
  | "censo_miembro"
  | "sacramentos"
  | "bitacora_pastoral"
  | "difusion_whatsapp";

const NAV_LINKS: { screen: ScreenId; label: string; icon: string }[] = [
  { screen: "inicio", label: "Inicio", icon: "spa" },
  { screen: "personas", label: "Personas", icon: "diversity_1" },
  { screen: "censo_miembro", label: "Ficha Censo", icon: "how_to_reg" },
  { screen: "roles", label: "Roles", icon: "admin_panel_settings" },
  { screen: "celulas", label: "Células", icon: "groups_3" },
  { screen: "pastoral", label: "Pastoral", icon: "volunteer_activism" },
  { screen: "bitacora_pastoral", label: "Bitácora", icon: "menu_book" },
  { screen: "sacramentos", label: "Sacramentos", icon: "water_drop" },
  { screen: "eventos", label: "Eventos", icon: "calendar_month" },
  { screen: "culto_vivo", label: "Culto en Vivo", icon: "live_tv" },
  { screen: "multimedia", label: "Multimedia", icon: "podcasts" },
  { screen: "finanzas", label: "Finanzas", icon: "account_balance_wallet" },
  { screen: "formulario", label: "Form. Diezmo", icon: "payments" },
  { screen: "comunicaciones", label: "Comunicaciones", icon: "grid_view" },
  { screen: "difusion_whatsapp", label: "Difusión WA", icon: "send" },
];

// ==========================================================================
// COMPONENTE PRINCIPAL (MAIN WRAPPER & STATE MANAGER)
// ==========================================================================
export default function App() {
  // Detección automática de vista (acordada en PENDIENTES.md): <768px → móvil, ≥768px → escritorio.
  const [viewMode] = useState<"mobile" | "desktop">(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop"
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState<ScreenId>("inicio");
  
  // Form states (Formulario)
  const [amount, setAmount] = useState<number>(120000);
  const [selectedPurpose, setSelectedPurpose] = useState<string>("diezmo");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("transferencia");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isEditingAmount, setIsEditingAmount] = useState<boolean>(false);
  const [customAmountText, setCustomAmountText] = useState<string>("120000");

  // Email and validation states
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [prayerRequest, setPrayerRequest] = useState<string>("");
  const [prayerError, setPrayerError] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const purposes = [
    { id: "diezmo", label: "Diezmo Regular" },
    { id: "misionera", label: "Ofrenda Misionera" },
    { id: "templo", label: "Fondo Pro-Templo" },
    { id: "social", label: "Acción Social" },
  ];

  const paymentMethods = [
    { id: "transferencia", title: "Transferencia", subtitle: "Bancaria Directa", icon: "account_balance", bgColor: "bg-[#bdeddd]/30 text-[#386458]" },
    { id: "efectivo", title: "Efectivo", subtitle: "En Sobre Físico", icon: "mail", bgColor: "bg-[#cde5ff]/40 text-[#42617d]" },
    { id: "webpay", title: "Mercado Pago", subtitle: "WebPay Online", icon: "qr_code_scanner", bgColor: "bg-[#ffd9de]/50 text-[#7f4e57]" },
    { id: "pos", title: "Terminal POS", subtitle: "Tarjeta Débito/C...", icon: "credit_card", bgColor: "bg-[#cde5ff]/60 text-[#294964]" },
  ];

  const formatCLP = (num: number) => {
    return new Intl.NumberFormat("es-CL").format(num);
  };

  const handleAddAmount = (val: number) => {
    setAmount((prev) => prev + val);
    setCustomAmountText((amount + val).toString());
  };

  const handleCustomAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customAmountText.replace(/\D/g, ""), 10);
    if (!isNaN(parsed) && parsed >= 500) {
      setAmount(parsed);
    } else {
      alert("El monto mínimo para consagrar es de $500 CLP.");
      setCustomAmountText(amount.toString());
    }
    setIsEditingAmount(false);
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (!val) {
      setEmailError("El correo electrónico es requerido para el comprobante digital.");
    } else if (!/\S+@\S+\.\S+/.test(val)) {
      setEmailError("Ingresa un correo válido (ej: usuario@correo.com).");
    } else {
      setEmailError("");
    }
  };

  const handlePrayerChange = (val: string) => {
    setPrayerRequest(val);
    if (val.length > 150) {
      setPrayerError("La petición de oración no puede superar los 150 caracteres.");
    } else {
      setPrayerError("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const triggerSubmit = () => {
    let hasError = false;

    if (!email) {
      setEmailError("El correo electrónico es obligatorio para emitir el recibo.");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Por favor ingresa un correo electrónico válido.");
      hasError = true;
    }

    if (prayerRequest.length > 150) {
      setPrayerError("Has superado el límite de 150 caracteres.");
      hasError = true;
    }

    if (amount < 500) {
      alert("Por favor ingresa un monto válido igual o superior a $500 CLP.");
      hasError = true;
    }

    if (hasError) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const resetForm = () => {
    setAmount(120000);
    setSelectedPurpose("diezmo");
    setIsAnonymous(false);
    setSelectedMethod("transferencia");
    setFileName(null);
    setIsSuccess(false);
    setCustomAmountText("120000");
    setEmail("");
    setEmailError("");
    setPrayerRequest("");
    setPrayerError("");
    setActiveScreen("inicio");
  };

  return (
    <div className="min-h-screen bg-[#f4faff] text-[#0e1d25] font-sans antialiased selection:bg-[#386458]/10 selection:text-[#386458]">
      

      {/* Main View Container */}
      <div className="py-0 md:py-8 px-0 md:px-4 flex justify-center items-start">
        
        {/* VIEW 1: MOBILE DEVICE VIEW */}
        {viewMode === "mobile" && (
          <div className="w-full bg-white overflow-hidden relative transition-all duration-500">
            {/* Mobile App Screen Content */}
            <div className="bg-[#f4faff] min-h-[820px] pt-8 pb-20 flex flex-col relative">
              
              {/* Header inside phone screen */}
              <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200/20 bg-white/60 backdrop-blur-md">
                <button 
                  onClick={() => setIsMenuOpen((open) => !open)}
                  className="w-11 h-11 flex items-center justify-center -ml-2 text-slate-900 hover:bg-slate-200/50 rounded-full transition-all duration-150 active:scale-90"
                  aria-label="Menú"
                  aria-expanded={isMenuOpen}
                >
                  <span className="material-symbols-outlined text-[22px]">{isMenuOpen ? "close" : "menu"}</span>
                </button>
                <h1 className="font-display font-bold text-base text-slate-900 tracking-tight capitalize">
                  {activeScreen === "inicio" ? "Inicio" : activeScreen === "formulario" ? "Consagración" : activeScreen === "finanzas" ? "Finanzas" : activeScreen === "roles" ? "Roles" : activeScreen === "personas" ? "Personas" : activeScreen === "celulas" ? "Células" : activeScreen === "multimedia" ? "Multimedia" : activeScreen === "pastoral" ? "Pastoral" : activeScreen === "eventos" ? "Eventos" : activeScreen === "culto_vivo" ? "Culto en Vivo" : activeScreen === "censo_miembro" ? "Ficha Censo" : activeScreen === "sacramentos" ? "Sacramentos" : activeScreen === "bitacora_pastoral" ? "Bitácora" : "Más"}
                </h1>
                <button 
                  className="w-8 h-8 rounded-full bg-[#386458] flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm hover:shadow"
                >
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </button>
              </header>

              {/* MENÚ DESPLEGABLE: LINKS DEL SITIO (HAMBURGUESA) */}
              {isMenuOpen && (
                <>
                  {/* Overlay para cerrar al tocar fuera */}
                  <div
                    className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] z-40 animate-[fadeIn_0.2s_ease-out]"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  {/* Panel de navegación */}
                  <nav className="absolute top-[104px] left-3 right-3 z-50 bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] border border-slate-100 overflow-hidden animate-[scaleIn_0.15s_ease-out]">
                    <div className="flex items-center justify-between px-4 py-3 bg-[#386458] text-white">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">apps</span>
                      </div>
                      <button
                        onClick={() => setIsMenuOpen(false)}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/15 transition-all active:scale-90 cursor-pointer"
                        aria-label="Cerrar menú"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-1 p-2 max-h-[420px] overflow-y-auto">
                      {NAV_LINKS.map((link) => (
                        <button
                          key={link.screen}
                          onClick={() => {
                            setActiveScreen(link.screen);
                            setIsMenuOpen(false);
                          }}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                            activeScreen === link.screen
                              ? "bg-[#386458] text-white shadow-sm"
                              : "text-slate-700 hover:bg-[#386458]/5 hover:text-[#386458]"
                          }`}
                        >
                          <span
                            className="material-symbols-outlined text-[20px] shrink-0"
                            style={{ fontVariationSettings: activeScreen === link.screen ? "'FILL' 1" : "" }}
                          >
                            {link.icon}
                          </span>
                          <span className="text-xs font-bold truncate">{link.label}</span>
                        </button>
                      ))}
                    </div>
                  </nav>
                </>
              )}

              {/* RENDERIZADO DE PANTALLA ACTIVA MÓVIL */}
              {activeScreen === "inicio" ? (
                <InicioScreen 
                  onNavigateToForm={() => setActiveScreen("formulario")} 
                  onNavigateToHistory={() => setActiveScreen("comunicaciones")}
                  onNavigateToModule={(screen) => setActiveScreen(screen)}
                />
              ) : activeScreen === "comunicaciones" ? (
                <ComunicacionesScreen 
                  onNavigateToForm={() => setActiveScreen("formulario")}
                  onNavigateToInicio={() => setActiveScreen("inicio")}
                  onNavigateToWA={() => setActiveScreen("difusion_whatsapp")}
                />
              ) : activeScreen === "finanzas" ? (
                <FinanzasDashboardScreen 
                  onNavigateToForm={() => setActiveScreen("formulario")}
                />
              ) : activeScreen === "roles" ? (
                <RolesScreen />
              ) : activeScreen === "personas" ? (
                <DirectorioScreen 
                  onNavigateToRoles={() => setActiveScreen("roles")} 
                  onNavigateToCenso={() => setActiveScreen("censo_miembro")}
                />
              ) : activeScreen === "celulas" ? (
                <CelulasScreen />
              ) : activeScreen === "multimedia" ? (
                <MultimediaScreen />
              ) : activeScreen === "pastoral" ? (
                <PastoralScreen 
                  onNavigateToSacramentos={() => setActiveScreen("sacramentos")} 
                  onNavigateToBitacora={() => setActiveScreen("bitacora_pastoral")}
                />
              ) : activeScreen === "eventos" ? (
                <EventosScreen onNavigateToLive={() => setActiveScreen("culto_vivo")} />
              ) : activeScreen === "culto_vivo" ? (
                <CultoVivoScreen />
              ) : activeScreen === "censo_miembro" ? (
                <CensoMiembroScreen 
                  onBack={() => setActiveScreen("personas")}
                  onSuccess={() => setActiveScreen("personas")}
                />
              ) : activeScreen === "sacramentos" ? (
                <SacramentosScreen 
                  onBack={() => setActiveScreen("pastoral")}
                />
              ) : activeScreen === "bitacora_pastoral" ? (
                <BitacoraPastoralScreen 
                  onBack={() => setActiveScreen("pastoral")}
                />
              ) : activeScreen === "difusion_whatsapp" ? (
                <DifusionWhatsappScreen 
                  onBack={() => setActiveScreen("comunicaciones")}
                />
              ) : isSuccess ? (
                /* SUCCESS / RECEIPT SCREEN */
                <div className="flex-1 px-5 flex flex-col justify-center items-center py-10 animate-[fadeIn_0.3s_ease-out]">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-[#386458] mb-6 shadow-sm border border-emerald-100">
                    <span className="material-symbols-outlined text-[44px] font-bold">check_circle</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl text-[#386458] mb-2 text-center text-wrap-balance">¡Consagración Exitosa!</h3>
                  <p className="text-sm text-slate-500 text-center mb-6 max-w-xs">
                    Tu recibo digital ha sido enviado exitosamente al correo <span className="font-semibold text-slate-800">{email}</span>.
                  </p>

                  <div className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm w-full mb-8">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
                      <span className="text-xs text-slate-400 uppercase font-bold">Monto</span>
                      <span className="font-mono font-bold text-lg text-slate-900">CLP ${formatCLP(amount)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
                      <span className="text-xs text-slate-400 uppercase font-bold">Propósito</span>
                      <span className="text-sm font-medium text-slate-700">
                        {purposes.find((p) => p.id === selectedPurpose)?.label}
                      </span>
                    </div>
                    {prayerRequest && (
                      <div className="flex flex-col border-b border-slate-100 pb-3 mb-3">
                        <span className="text-xs text-slate-400 uppercase font-bold mb-1">Petición de Oración</span>
                        <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          "{prayerRequest}"
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 uppercase font-bold">Método</span>
                      <span className="text-sm font-medium text-slate-700">
                        {paymentMethods.find((m) => m.id === selectedMethod)?.title}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={resetForm}
                    className="w-full bg-[#386458] hover:bg-[#2c4e45] active:scale-[0.98] text-white py-3.5 px-6 font-display font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    style={{ borderRadius: "4px" }}
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Registrar Otra Contribución
                  </button>
                </div>
              ) : (
                /* MAIN FORM FLOW SCREEN (FORMULARIO DIEZMO) */
                <div className="flex-1 px-5 space-y-5">
                  
                  {/* Status card */}
                  <div className="bg-[#eaf1f6] rounded-[28px] p-4.5 flex items-center justify-between border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-[#386458] shadow-sm">
                        <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#386458] tracking-widest uppercase leading-none mb-1">Registro Rápido</p>
                        <h2 className="font-display font-bold text-lg text-slate-900 leading-tight">Transacción de Mayordomía</h2>
                      </div>
                    </div>
                    <div className="bg-white/85 text-slate-700 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider shadow-sm">
                      Activo
                    </div>
                  </div>

                  {/* Purpose Selector */}
                  <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-medium px-1">Propósito de la contribución</label>
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                      {purposes.map((p) => {
                        const isActive = selectedPurpose === p.id;
                        return (
                          <button
                            key={p.id}
                            onClick={() => setSelectedPurpose(p.id)}
                            className={`px-5 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 ${
                              isActive ? "bg-[#386458] text-white shadow-sm" : "bg-[#e6f0f6] text-slate-600 hover:bg-[#d8e7f0]"
                            }`}
                            style={{ borderRadius: "4px" }}
                          >
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Consagrar Amount Board */}
                  <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100 space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-medium">Monto a consagrar</span>
                      <div className="flex items-center gap-1 text-[#386458] text-xs font-bold bg-[#386458]/5 px-2.5 py-1 rounded-full">
                        <span className="material-symbols-outlined text-[14px]">monetization_on</span>
                        Divisa CLP
                      </div>
                    </div>

                    <div className="py-2 flex justify-center items-center">
                      {isEditingAmount ? (
                        <form onSubmit={handleCustomAmountSubmit} className="flex items-center gap-2 w-full max-w-[240px]">
                          <span className="text-lg text-slate-400 font-bold">CLP $</span>
                          <input
                            type="text"
                            value={customAmountText}
                            onChange={(e) => setCustomAmountText(e.target.value.replace(/\D/g, ""))}
                            className="w-full text-center font-display text-2xl font-bold border-b-2 border-[#386458] focus:outline-none py-1"
                            autoFocus
                            onBlur={handleCustomAmountSubmit}
                          />
                        </form>
                      ) : (
                        <div 
                          onClick={() => setIsEditingAmount(true)}
                          className="group flex items-baseline gap-2 cursor-pointer hover:bg-slate-50 px-4 py-1.5 rounded-xl transition-all"
                        >
                          <span className="text-lg text-slate-400 font-bold">CLP $</span>
                          <span className="font-display text-3xl font-bold text-slate-900 tracking-tight">
                            {formatCLP(amount)}
                          </span>
                          <span className="material-symbols-outlined text-slate-300 group-hover:text-[#386458] text-[16px] ml-1">edit</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[10000, 50000, 100000].map((val) => (
                        <button
                          key={val}
                          onClick={() => handleAddAmount(val)}
                          className="bg-[#e6f0f6] text-[#386458] hover:bg-[#386458] hover:text-white active:scale-95 text-xs font-bold py-2.5 rounded-full transition-all duration-200 cursor-pointer shadow-sm text-center"
                          style={{ borderRadius: "4px" }}
                        >
                          +${formatCLP(val)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form fields: Email & Prayer request */}
                  <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100 space-y-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Información de Envío</h3>
                    
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-500 font-medium px-1 flex justify-between">
                        <span>Correo Electrónico *</span>
                        {email && !emailError && <span className="text-emerald-600 text-[10px] font-bold">✓ Formato Válido</span>}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        placeholder="ejemplo@correo.com"
                        className={`w-full px-4 py-3 rounded-xl text-xs border transition-all outline-none ${
                          emailError 
                            ? "border-rose-400 bg-rose-50/20" 
                            : "border-slate-200 focus:border-[#386458]"
                        }`}
                      />
                      {emailError && (
                        <p className="text-[10px] text-rose-500 px-1 font-medium leading-normal animate-[fadeIn_0.2s_ease-out]">
                          {emailError}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[11px] text-slate-500 font-medium">Petición de Oración (Opcional)</label>
                        <span className={`text-[10px] ${prayerRequest.length > 150 ? "text-rose-500 font-bold" : "text-slate-400"}`}>
                          {prayerRequest.length}/150
                        </span>
                      </div>
                      <textarea
                        value={prayerRequest}
                        onChange={(e) => handlePrayerChange(e.target.value)}
                        placeholder="Escribe aquí tu petición o intención de oración..."
                        className={`w-full px-4 py-3 rounded-xl text-xs border min-h-[64px] resize-none transition-all outline-none ${
                          prayerError 
                            ? "border-rose-400 focus:border-rose-500" 
                            : "border-slate-200"
                        }`}
                      />
                      {prayerError && <p className="text-[10px] text-rose-500 px-1 font-medium">{prayerError}</p>}
                    </div>
                  </div>

                  {/* Donor Info with Anon Toggle */}
                  <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-medium">Miembro o Donante</span>
                      <button
                        onClick={() => setIsAnonymous(!isAnonymous)}
                        className={`w-11 h-6 rounded-full transition-all duration-300 relative focus:outline-none cursor-pointer ${
                          isAnonymous ? "bg-[#386458]" : "bg-slate-200"
                        }`}
                      >
                        <div
                          className={`w-4.5 h-4.5 bg-white rounded-full absolute top-[3px] shadow-sm transition-all duration-300 ${
                            isAnonymous ? "left-[22px]" : "left-[3px]"
                          }`}
                        />
                      </button>
                    </div>

                    <div className={`transition-all duration-300 ${isAnonymous ? "opacity-40" : "opacity-100"}`}>
                      <div className="bg-slate-50 rounded-[20px] p-3 flex items-center justify-between border border-slate-100">
                        <div className="flex items-center gap-3">
                          <img
                            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120"
                            alt="Avatar"
                            className="w-11 h-11 rounded-full object-cover shadow-inner"
                          />
                          <div>
                            <p className="text-[14px] font-bold text-slate-900 leading-tight">
                              {isAnonymous ? "Donante Anónimo" : "Juan Pérez Morales"}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                              {isAnonymous ? "Identificación Omitida" : "Célula Betania • Miembro Activo"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery method section */}
                  <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-medium px-1">Método de entrega</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {paymentMethods.map((m) => {
                        const isSelected = selectedMethod === m.id;
                        return (
                          <button
                            key={m.id}
                            onClick={() => setSelectedMethod(m.id)}
                            className={`p-3.5 rounded-2xl text-left transition-all duration-200 flex items-center gap-3 shadow-sm cursor-pointer border-2 active:scale-98 ${
                              isSelected
                                ? "bg-white border-[#386458] ring-1 ring-[#386458]"
                                : "bg-white border-transparent hover:border-slate-300 hover:shadow"
                            }`}
                            style={{ borderRadius: "4px" }}
                          >
                            <div className={`w-9 h-9 rounded-full ${m.bgColor} flex items-center justify-center shrink-0`}>
                              <span className="material-symbols-outlined text-[18px]">{m.icon}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 leading-none truncate">{m.title}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5 truncate leading-none font-medium">{m.subtitle}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Respaldo digital */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`bg-white rounded-[28px] p-6 flex flex-col items-center justify-center text-center shadow-sm border-2 border-dashed transition-all duration-200 cursor-pointer ${
                      isDragging
                        ? "border-[#386458] bg-[#386458]/5"
                        : "border-slate-200 hover:border-[#386458]/50 hover:bg-slate-50"
                    }`}
                  >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <div className="w-10 h-10 rounded-full bg-[#386458]/5 flex items-center justify-center text-[#386458] mb-3">
                      <span className="material-symbols-outlined text-lg">receipt_long</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 mb-0.5 truncate max-w-[240px]">
                      {fileName ? fileName : "Adjuntar comprobante de transferencia"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">Formatos PNG, JPG o PDF hasta 10MB</p>
                  </div>

                  {/* Devotional Quote */}
                  <div className="bg-rose-50/70 rounded-[28px] p-4.5 flex gap-3 border border-rose-100/50">
                    <span className="material-symbols-outlined text-[#7f4e57] text-lg shrink-0 mt-0.5">eco</span>
                    <div>
                      <p className="italic text-xs text-[#7f4e57] leading-relaxed font-sans mb-1.5">
                        "Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, porque Dios ama al dador alegre."
                      </p>
                      <p className="text-[10px] font-bold text-[#7f4e57] uppercase tracking-wider">2 Corintios 9:7</p>
                    </div>
                  </div>

                  {/* Bottom Action Button with Hover Effect and border-radius 3px */}
                  <div className="pt-2">
                    <button
                      onClick={triggerSubmit}
                      disabled={isSubmitting}
                      className="group w-full bg-[#386458] hover:bg-[#2c4e45] hover:shadow-lg text-white rounded-full py-4 px-6 flex items-center justify-center gap-2.5 font-display font-semibold text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-md shadow-[#386458]/10"
                      style={{ borderRadius: "4px" }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Procesando...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-lg transition-transform group-hover:scale-110">check_circle</span>
                          <span>Confirmar & Emitir Recibo Digital</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              )}

              {/* Bottom App-styled Navigation Bar */}
              <nav className="border-t border-slate-100 bg-white/95 backdrop-blur-md py-2 px-1 flex items-center justify-around text-slate-400 text-[10px] font-medium absolute bottom-0 inset-x-0 z-30">
                <button 
                  onClick={() => setActiveScreen("inicio")}
                  className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                    activeScreen === "inicio" ? "text-[#386458] font-bold" : "hover:text-[#386458]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeScreen === "inicio" ? "'FILL' 1" : "" }}>spa</span>
                  <span>Inicio</span>
                </button>
                <button 
                  onClick={() => setActiveScreen("personas")}
                  className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                    activeScreen === "personas" || activeScreen === "roles" ? "text-[#386458] font-bold" : "hover:text-[#386458]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeScreen === "personas" || activeScreen === "roles" ? "'FILL' 1" : "" }}>diversity_1</span>
                  <span>Personas</span>
                </button>
                <button 
                  onClick={() => setActiveScreen("finanzas")}
                  className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                    activeScreen === "finanzas" ? "text-[#386458] font-bold" : "hover:text-[#386458]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeScreen === "finanzas" ? "'FILL' 1" : "" }}>account_balance_wallet</span>
                  <span>Finanzas</span>
                </button>
                <button 
                  onClick={() => setActiveScreen("eventos")}
                  className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                    activeScreen === "eventos" ? "text-[#386458] font-bold" : "hover:text-[#386458]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeScreen === "eventos" ? "'FILL' 1" : "" }}>calendar_month</span>
                  <span>Eventos</span>
                </button>
                <button 
                  onClick={() => setActiveScreen("comunicaciones")}
                  className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                    activeScreen === "comunicaciones" ? "text-[#386458] font-bold" : "hover:text-[#386458]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeScreen === "comunicaciones" ? "'FILL' 1" : "" }}>grid_view</span>
                  <span>Más</span>
                </button>
              </nav>

            </div>
          </div>
        )}

        {/* VIEW 2: ADAPTIVE DESKTOP FULL VIEW */}
        {viewMode === "desktop" && (
          <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-200/60 overflow-hidden transition-all duration-500">
            <div className="bg-[#f4faff] min-h-[750px] p-8 flex flex-col relative">
              
              {/* Header block for Desktop Layout */}
              <header className="flex items-center justify-between border-b border-slate-200/50 pb-5 mb-8">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={resetForm}
                    className="w-10 h-10 flex items-center justify-center text-slate-800 hover:bg-slate-200/50 rounded-full transition-all duration-150 active:scale-90"
                    aria-label="Volver"
                  >
                    <span className="material-symbols-outlined font-bold text-xl">arrow_back_ios_new</span>
                  </button>
                  <div>
                    <h1 className="font-display font-bold text-2xl text-[#0e1d25] tracking-tight">
                      {activeScreen === "inicio" ? "Inicio de Gestión Pastoral" : activeScreen === "formulario" ? "Consagración de Mayordomía" : activeScreen === "finanzas" ? "Consolidación Financiera" : activeScreen === "roles" ? "Definición de Roles" : "Canales de Comunicaciones"}
                    </h1>
                    <p className="text-xs text-slate-400 font-medium">Plataforma Integrada para Iglesias y Congregaciones</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-800">Célula Betania</p>
                    <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider">Modo Integrado</p>
                  </div>
                  <div className="w-11 h-11 rounded-full bg-[#386458] flex items-center justify-center text-white shadow-md">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </div>
                </div>
              </header>

              {/* RENDERIZADO DE PANTALLA ACTIVA ESCRITORIO */}
              {activeScreen === "inicio" ? (
                <div className="w-full">
                  <InicioScreen 
                    onNavigateToForm={() => setActiveScreen("formulario")}
                    onNavigateToHistory={() => setActiveScreen("comunicaciones")}
                    onNavigateToModule={(screen) => setActiveScreen(screen)}
                  />
                </div>
              ) : activeScreen === "comunicaciones" ? (
                <div className="w-full">
                  <ComunicacionesScreen 
                    onNavigateToForm={() => setActiveScreen("formulario")}
                    onNavigateToInicio={() => setActiveScreen("inicio")}
                  />
                </div>
              ) : activeScreen === "finanzas" ? (
                <div className="w-full">
                  <FinanzasDashboardScreen 
                    onNavigateToForm={() => setActiveScreen("formulario")}
                  />
                </div>
              ) : activeScreen === "roles" ? (
                <div className="w-full">
                  <RolesScreen />
                </div>
              ) : activeScreen === "personas" ? (
                <div className="w-full">
                  <DirectorioScreen 
                    onNavigateToRoles={() => setActiveScreen("roles")} 
                    onNavigateToCenso={() => setActiveScreen("censo_miembro")}
                  />
                </div>
              ) : activeScreen === "celulas" ? (
                <div className="w-full">
                  <CelulasScreen />
                </div>
              ) : activeScreen === "pastoral" ? (
                <div className="w-full">
                  <PastoralScreen 
                    onNavigateToSacramentos={() => setActiveScreen("sacramentos")} 
                    onNavigateToBitacora={() => setActiveScreen("bitacora_pastoral")}
                  />
                </div>
              ) : activeScreen === "eventos" ? (
                <div className="w-full">
                  <EventosScreen onNavigateToLive={() => setActiveScreen("culto_vivo")} />
                </div>
              ) : activeScreen === "culto_vivo" ? (
                <div className="w-full">
                  <CultoVivoScreen />
                </div>
              ) : activeScreen === "censo_miembro" ? (
                <div className="w-full">
                  <CensoMiembroScreen 
                    onBack={() => setActiveScreen("personas")}
                    onSuccess={() => setActiveScreen("personas")}
                  />
                </div>
              ) : activeScreen === "sacramentos" ? (
                <div className="w-full">
                  <SacramentosScreen 
                    onBack={() => setActiveScreen("pastoral")}
                  />
                </div>
              ) : activeScreen === "difusion_whatsapp" ? (
                <div className="w-full">
                  <DifusionWhatsappScreen 
                    onBack={() => setActiveScreen("comunicaciones")}
                  />
                </div>
              ) : isSuccess ? (
                /* SUCCESS SCREEN */
                <div className="flex-1 max-w-lg mx-auto w-full flex flex-col justify-center items-center py-12 animate-[fadeIn_0.3s_ease-out]">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-[#386458] mb-6 shadow-sm border border-emerald-100">
                    <span className="material-symbols-outlined text-[44px] font-bold">check_circle</span>
                  </div>
                  <h3 className="font-display font-bold text-3xl text-[#386458] mb-3 text-center">¡Consagración Exitosa!</h3>
                  <p className="text-sm text-slate-500 text-center mb-8 max-w-sm leading-relaxed">
                    Tu recibo digital ha sido enviado a <span className="font-bold text-slate-700">{email}</span>.
                  </p>

                  <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-md w-full mb-8">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border-b border-slate-100 pb-3">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Monto Total</span>
                        <p className="font-mono font-bold text-xl text-slate-900 mt-1">CLP ${formatCLP(amount)}</p>
                      </div>
                      <div className="border-b border-slate-100 pb-3">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Propósito</span>
                        <p className="text-sm font-semibold text-slate-700 mt-1">
                          {purposes.find((p) => p.id === selectedPurpose)?.label}
                        </p>
                      </div>
                      <div className="border-b border-slate-100 pb-3">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Donante</span>
                        <p className="text-sm font-semibold text-slate-700 mt-1">
                          {isAnonymous ? "Anónimo" : "Juan Pérez Morales"}
                        </p>
                      </div>
                      <div className="border-b border-slate-100 pb-3">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Método</span>
                        <p className="text-sm font-semibold text-slate-700 mt-1">
                          {paymentMethods.find((m) => m.id === selectedMethod)?.title}
                        </p>
                      </div>
                      {prayerRequest && (
                        <div className="col-span-2 pt-1">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Petición de Oración</span>
                          <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-150 mt-1">
                            "{prayerRequest}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 w-full">
                    <button
                      onClick={() => alert("Descargando recibo digital...")}
                      className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold py-3.5 px-6 rounded-full transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:shadow-sm"
                      style={{ borderRadius: "4px" }}
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      Descargar PDF
                    </button>
                    <button
                      onClick={resetForm}
                      className="flex-1 bg-[#386458] hover:bg-[#2c4e45] text-white font-semibold py-3.5 px-6 rounded-full transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                      style={{ borderRadius: "4px" }}
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      Nueva Transacción
                    </button>
                  </div>
                </div>
              ) : (
                /* TWO-COLUMN ADAPTIVE GRID FOR DESKTOP */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left panel (6 columns) */}
                  <div className="lg:col-span-6 space-y-6">
                    
                    {/* Status card */}
                    <div className="bg-[#eaf1f6] rounded-[28px] p-6 flex items-center justify-between border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#386458] shadow-sm">
                          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-[#386458] tracking-widest uppercase mb-1">Registro Rápido</p>
                          <h2 className="font-display font-bold text-xl text-[#0e1d25] leading-tight">Transacción de Mayordomía</h2>
                        </div>
                      </div>
                    </div>

                    {/* Purpose Selector */}
                    <div className="space-y-3">
                      <label className="text-sm text-slate-500 font-medium px-1">Propósito de la contribución</label>
                      <div className="flex flex-wrap gap-2.5">
                        {purposes.map((p) => {
                          const isActive = selectedPurpose === p.id;
                          return (
                            <button
                              key={p.id}
                              onClick={() => setSelectedPurpose(p.id)}
                              className={`px-5 py-3 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 ${
                                isActive ? "bg-[#386458] text-white shadow-sm" : "bg-[#e6f0f6] text-slate-600 hover:bg-[#d8e7f0]"
                              }`}
                              style={{ borderRadius: "4px" }}
                            >
                              {p.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Amount card */}
                    <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100/80 space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500 font-medium">Monto a consagrar</span>
                        <div className="flex items-center gap-1.5 text-[#386458] text-xs font-bold bg-[#386458]/5 px-3 py-1.5 rounded-full">
                          <span className="material-symbols-outlined text-[14px]">monetization_on</span>
                          Divisa CLP
                        </div>
                      </div>

                      <div className="py-2 flex justify-center items-center">
                        {isEditingAmount ? (
                          <form onSubmit={handleCustomAmountSubmit} className="flex items-center gap-3 w-full max-w-[280px]">
                            <span className="text-xl text-slate-400 font-bold">CLP $</span>
                            <input
                              type="text"
                              value={customAmountText}
                              onChange={(e) => setCustomAmountText(e.target.value.replace(/\D/g, ""))}
                              className="w-full text-center font-display text-3xl font-bold border-b-2 border-[#386458] focus:outline-none py-1"
                              autoFocus
                              onBlur={handleCustomAmountSubmit}
                            />
                          </form>
                        ) : (
                          <div 
                            onClick={() => setIsEditingAmount(true)}
                            className="group flex items-baseline gap-2 cursor-pointer hover:bg-slate-50 px-6 py-2 rounded-2xl transition-all"
                          >
                            <span className="text-xl text-slate-400 font-bold">CLP $</span>
                            <span className="font-display text-4xl font-bold text-[#0e1d25] tracking-tight">
                              {formatCLP(amount)}
                            </span>
                            <span className="material-symbols-outlined text-slate-300 group-hover:text-[#386458] text-[18px] ml-2">edit</span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {[10000, 50000, 100000].map((val) => (
                          <button
                            key={val}
                            onClick={() => handleAddAmount(val)}
                            className="bg-[#e6f0f6] text-[#386458] hover:bg-[#386458] hover:text-white active:scale-95 text-xs font-bold py-3 rounded-full transition-all duration-200 cursor-pointer shadow-sm text-center"
                            style={{ borderRadius: "4px" }}
                          >
                            +${formatCLP(val)}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right panel (6 columns) */}
                  <div className="lg:col-span-6 space-y-6">
                    
                    {/* Donor Details card */}
                    <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100/80 space-y-5">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500 font-medium">Miembro o Donante</span>
                        <button
                          onClick={() => setIsAnonymous(!isAnonymous)}
                          className={`w-11 h-6 rounded-full transition-all duration-300 relative focus:outline-none cursor-pointer ${
                            isAnonymous ? "bg-[#386458]" : "bg-slate-200"
                          }`}
                        >
                          <div
                            className={`w-4.5 h-4.5 bg-white rounded-full absolute top-[3px] shadow-sm transition-all duration-300 ${
                              isAnonymous ? "left-[22px]" : "left-[3px]"
                            }`}
                          />
                        </button>
                      </div>

                      <div className={`transition-all duration-300 ${isAnonymous ? "opacity-40" : "opacity-100"}`}>
                        <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                          <div className="flex items-center gap-4">
                            <img
                              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120"
                              alt="Avatar"
                              className="w-14 h-14 rounded-full object-cover shadow-inner"
                            />
                            <div>
                              <p className="text-base font-bold text-slate-900">
                                {isAnonymous ? "Donante Anónimo" : "Juan Pérez Morales"}
                              </p>
                              <p className="text-xs text-slate-400 mt-1 font-medium">
                                {isAnonymous ? "Identificación Omitida" : "Célula Betania • Miembro Activo"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Method List selector */}
                    <div className="space-y-3">
                      <label className="text-sm text-slate-500 font-medium px-1">Método de entrega</label>
                      <div className="grid grid-cols-2 gap-3">
                        {paymentMethods.map((m) => {
                          const isSelected = selectedMethod === m.id;
                          return (
                            <button
                              key={m.id}
                              onClick={() => setSelectedMethod(m.id)}
                              className={`p-4 rounded-2xl text-left transition-all duration-200 flex items-center gap-4 shadow-sm cursor-pointer border-2 active:scale-98 ${
                                isSelected
                                  ? "bg-white border-[#386458] ring-1 ring-[#386458]"
                                  : "bg-white border-transparent hover:border-slate-300 hover:shadow"
                              }`}
                              style={{ borderRadius: "4px" }}
                            >
                              <div className={`w-10 h-10 rounded-full ${m.bgColor} flex items-center justify-center shrink-0`}>
                                <span className="material-symbols-outlined text-[20px]">{m.icon}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-800 leading-none truncate">{m.title}</p>
                                <p className="text-xs text-slate-400 mt-1 truncate leading-none font-medium">{m.subtitle}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
