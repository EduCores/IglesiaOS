import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useTheme, useTemaColor, TEMAS_COLOR, type TemaColor } from "./useTheme";
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
import OnboardingSetupScreen from "./OnboardingSetup";
import CheckinNinosScreen from "./CheckinNinos";
import OfflineSyncScreen from "./OfflineSync";
import ConfirmacionRegistroScreen from "./ConfirmacionRegistro";
import BibliaScreen from "./Biblia";
import AngelAsistente from "./AngelAsistente";

// ==========================================================================
// COMPONENTE: PANTALLA 5 - ROLES DEFINIDOS (Nueva pantalla de Stitch)
// ==========================================================================
// Lista inicial compartida: la usa RolesScreen como estado inicial y el
// modal de Acceso/Perfil como opciones del selector de rol. Los roles
// creados con "Crear Nuevo Rol" viven solo en el estado de la pantalla.
const ROLES_INICIALES = [
  { id: 1, title: "Pastor Principal", tag: "Total", type: "liderazgo", desc: "Acceso completo", badgeColor: "bg-[#386458]/10 text-[#386458]", checked: true, icon: "church", bgIconColor: "bg-[#bdeddd]", iconColor: "text-[#386458]", detailText: "Todas las funciones activas", members: 2 },
  { id: 2, title: "Dir. Alabanza", tag: "Multimedia", type: "ministerios", desc: "Editor en Multimedia, Solo Lectura en Pastoral", badgeColor: "bg-[#cde5ff] text-[#294964]", checked: true, icon: "graphic_eq", bgIconColor: "bg-[#cde5ff]", iconColor: "text-[#42617d]", detailText: "Audio & Video • Eventos", members: 4 },
  { id: 3, title: "Tesorero", tag: "Finanzas", type: "liderazgo", desc: "Editor en Finanzas, Solo Lectura", badgeColor: "bg-[#ffd9de] text-[#663a42]", checked: true, icon: "payments", bgIconColor: "bg-[#ffd9de]", iconColor: "text-[#7f4e57]", detailText: "Ofrendas • Balances", members: 1 },
  { id: 4, title: "Líder de Célula", tag: "Grupos", type: "apoyo", desc: "Solo Lectura", badgeColor: "bg-slate-200 text-slate-700", checked: true, icon: "groups_3", bgIconColor: "bg-[#a1d0c1]/40", iconColor: "text-[#386458]", detailText: "Asistencia • Contacto", members: 12 },
  { id: 5, title: "Voluntario", tag: "Básico", type: "apoyo", desc: "Acceso limitado", badgeColor: "bg-[#daebf5] text-[#294964]", checked: false, icon: "volunteer_activism", bgIconColor: "bg-[#aacaea]/30", iconColor: "text-[#42617d]", detailText: "Turnos • Avisos", members: 28 },
  { id: 6, title: "Portero", tag: "Servicio", type: "apoyo", desc: "Registra ofrendas · Control de acceso", badgeColor: "bg-[#386458]/10 text-[#386458]", checked: true, icon: "door_open", bgIconColor: "bg-[#bdeddd]", iconColor: "text-[#386458]", detailText: "Acceso • Ofrendas", members: 0 },
  { id: 7, title: "Ujieres", tag: "Servicio", type: "apoyo", desc: "Registra ofrendas · Orden y acomodo", badgeColor: "bg-[#386458]/10 text-[#386458]", checked: true, icon: "hail", bgIconColor: "bg-[#cde5ff]", iconColor: "text-[#42617d]", detailText: "Orden • Ofrendas", members: 0 },
  { id: 8, title: "Servicio de Aseo", tag: "Servicio", type: "apoyo", desc: "Solicita gastos · Limpieza del templo", badgeColor: "bg-slate-200 text-slate-700", checked: true, icon: "cleaning_services", bgIconColor: "bg-[#e7f6ff]", iconColor: "text-[#42617d]", detailText: "Limpieza • Insumos", members: 0 },
  { id: 9, title: "Cocina + Ayudantes", tag: "Servicio", type: "apoyo", desc: "Solicita gastos · Alimentación y convivios", badgeColor: "bg-slate-200 text-slate-700", checked: true, icon: "soup_kitchen", bgIconColor: "bg-[#ffd9de]", iconColor: "text-[#7f4e57]", detailText: "Cocina • Víveres", members: 0 },
];

function RolesScreen() {
  const [selectedFilter, setSelectedFilter] = useState<"todos" | "liderazgo" | "ministerios" | "apoyo">("todos");
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleCategory, setNewRoleCategory] = useState<"liderazgo" | "ministerios" | "apoyo">("liderazgo");
  const [newRoleDesc, setNewRoleNameDesc] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Lista dinámica de roles iniciales
  const [roles, setRoles] = useState(ROLES_INICIALES);

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
    setSuccessToast(`¡Rol "${newRoleName}" creado en unidad y con éxito!`);
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

        {/* Cabecera de la pantalla: panel estándar (antes degradado) */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#386458]/10 blur-2xl pointer-events-none"></div>
          <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-blue-100/30 blur-xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col space-y-3">
            <div className="inline-flex items-center space-x-1.5 self-start px-3 py-1 rounded-full bg-[#386458]/10 text-[#386458] shadow-sm">
              <span className="material-symbols-outlined text-[16px] font-bold">verified_user</span>
              <span className="text-[9px] font-bold uppercase tracking-wider">Gestión Pastoral</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Roles Definidos</h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[280px]">
              Orden, privilegios y accesos para el cuidado responsable de tu comunidad.
            </p>
          </div>

          {/* Live Filter Pills */}
          <div className="relative z-10 flex items-center space-x-2 pt-4 overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => setSelectedFilter("todos")}
              className={`px-4 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                selectedFilter === "todos" ? "bg-[#386458] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Todos ({roles.length})
            </button>
            <button 
              onClick={() => setSelectedFilter("liderazgo")}
              className={`px-4 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                selectedFilter === "liderazgo" ? "bg-[#386458] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Liderazgo
            </button>
            <button 
              onClick={() => setSelectedFilter("ministerios")}
              className={`px-4 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                selectedFilter === "ministerios" ? "bg-[#386458] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Ministerios
            </button>
            <button 
              onClick={() => setSelectedFilter("apoyo")}
              className={`px-4 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                selectedFilter === "apoyo" ? "bg-[#386458] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
              className="group relative rounded-[10px] bg-white border border-slate-100 p-2 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
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
                  </div>
                </div>

                {/* Fila estado + switch: check_circle + texto a la izquierda, switch a la derecha */}
                <div className="flex w-full flex-wrap items-center justify-between gap-2">
                  {role.checked ? (
                    <div className="flex min-w-0 flex-1 items-center space-x-1 text-[#386458]">
                      <span className="material-symbols-outlined text-[15px] font-bold shrink-0">check_circle</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider truncate">{role.detailText}</span>
                    </div>
                  ) : (
                    <div className="flex min-w-0 flex-1 items-center space-x-1 text-slate-400">
                      <span className="material-symbols-outlined text-[15px] font-bold shrink-0">pause_circle</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider truncate">Rol Suspendido</span>
                    </div>
                  )}
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
              </div>

              <div className="flex items-center justify-between pt-3 mt-3.5 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{role.members} Miembros asignados</span>
                <button 
                  onClick={() => { setSuccessToast(`Edición de "${role.title}" disponible próximamente.`); setTimeout(() => setSuccessToast(null), 3000); }}
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

        {/* IOS Peaceful Insight & Action Panel */}
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
            onClick={() => setShowAuditModal(true)}
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
            className="w-full py-4 px-5 bg-[#386458] hover:bg-[#2c4e45] text-white text-xs font-bold shadow-[#386458]/35 flex items-center justify-center space-x-2 active:scale-[0.99] transition-all cursor-pointer"
            style={{ borderRadius: "4px" }}
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Crear Nuevo Rol Personalizado</span>
          </button>
        </div>

      </div>

      {/* Modal de auditoría: resumen real calculado del estado de roles */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl animate-[scaleIn_0.2s_ease-out]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800">Auditoría de Permisos</h3>
              <button onClick={() => setShowAuditModal(false)} aria-label="Cerrar" className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">
                <p className="font-display text-2xl font-bold text-slate-900">{roles.length}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Roles</p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">
                <p className="font-display text-2xl font-bold text-[#386458]">{roles.reduce((s, r) => s + r.members, 0)}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Miembros</p>
              </div>
              <div className="rounded-xl bg-[#bdeddd]/40 border border-slate-100 p-3 text-center">
                <p className="font-display text-2xl font-bold text-[#386458]">{roles.filter((r) => r.checked).length}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Activos</p>
              </div>
              <div className="rounded-xl bg-[#ffd9de]/40 border border-slate-100 p-3 text-center">
                <p className="font-display text-2xl font-bold text-[#7f4e57]">{roles.filter((r) => !r.checked).length}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Suspendidos</p>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex items-center justify-between text-[11px] font-bold text-slate-600">
              <span>Liderazgo {roles.filter((r) => r.type === "liderazgo").length}</span>
              <span>Ministerios {roles.filter((r) => r.type === "ministerios").length}</span>
              <span>Apoyo {roles.filter((r) => r.type === "apoyo").length}</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-[#386458]">check_circle</span>
              Última revisión: Hoy, 09:30 · Sin hallazgos críticos.
            </p>
          </div>
        </div>
      )}

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
  const [showReportsModal, setShowReportsModal] = useState(false);

  const transactions = [
    { id: 1, title: "Diezmo Mensual Familia Silva", category: "ministerios", amount: 120000, type: "plus", date: "Ayer, 18:30", badgeText: "Diezmo", badgeColor: "bg-[#bdeddd] text-[#214e43]", textColor: "text-[#386458]", bgIconColor: "bg-[#bdeddd]/60", icon: "volunteer_activism" },
    { id: 2, title: "Ofrenda Misión Patagonia", category: "misiones", amount: 65000, type: "plus", date: "14 May, 10:15", badgeText: "Ofrenda", badgeColor: "bg-[#cde5ff] text-[#294964]", textColor: "text-[#42617d]", bgIconColor: "bg-[#cde5ff]/50", icon: "public" },
    { id: 3, title: "Servicios Básicos & Suministros", category: "operaciones", amount: 48500, type: "minus", date: "12 May, 09:40", badgeText: "Gasto", badgeColor: "bg-[#ffd9de] text-[#663a42]", textColor: "text-[#7f4e57]", bgIconColor: "bg-[#ffd9de]", icon: "water_drop" },
    { id: 4, title: "Retiro Espiritual de Jóvenes", category: "ministerios", amount: 85000, type: "plus", date: "10 May, 17:00", badgeText: "Ofrenda", badgeColor: "bg-[#bdeddd] text-[#214e43]", textColor: "text-[#386458]", bgIconColor: "bg-[#bdeddd]/60", icon: "diversity_1" },
    { id: 5, title: "Insumos de Aseo Mensual", category: "operaciones", amount: 45000, type: "minus", date: "Hoy, 10:20", badgeText: "Gasto", badgeColor: "bg-[#ffd9de] text-[#663a42]", textColor: "text-[#7f4e57]", bgIconColor: "bg-[#ffd9de]", icon: "cleaning_services" },
    { id: 6, title: "Víveres Cocina · Convivio", category: "operaciones", amount: 60000, type: "minus", date: "Ayer, 12:05", badgeText: "Gasto", badgeColor: "bg-[#ffd9de] text-[#663a42]", textColor: "text-[#7f4e57]", bgIconColor: "bg-[#ffd9de]", icon: "soup_kitchen" },
    { id: 7, title: "Mantención Puerta y Accesos", category: "operaciones", amount: 25000, type: "minus", date: "13 May, 16:40", badgeText: "Gasto", badgeColor: "bg-[#ffd9de] text-[#663a42]", textColor: "text-[#7f4e57]", bgIconColor: "bg-[#ffd9de]", icon: "door_open" }
  ];

  const filteredTransactions = transactions.filter(t => 
    selectedCategory === "todos" || t.category === selectedCategory
  );

  return (
    <div className="flex-1 pb-24 relative overflow-hidden flex flex-col justify-between animate-[fadeIn_0.25s_ease-out]">
      <div className="flex flex-col w-full px-5 space-y-5 relative">
        
        {/* Balance Consolidado Card */}
        <div className="w-full bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden">
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
                onClick={() => setShowReportsModal(true)}
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
              <p className="text-[10px] text-slate-400 mt-0.5">Metas y asignación fiel mensual</p>
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
            <p className="text-[10px] text-slate-400 truncate mt-0.5">"Cada contribución siembra bendición y propósito."</p>
          </div>
          <span className="material-symbols-outlined text-[#386458] text-[20px] shrink-0">volunteer_activism</span>
        </div>

        {/* Recent Transactions List */}
        <div className="flex flex-col space-y-3 pb-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-slate-900">Transacciones Recientes</h2>
            <button onClick={() => setShowReportsModal(true)} className="text-[11px] text-[#386458] font-bold flex items-center space-x-0.5 hover:underline cursor-pointer">
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

      {/* Modal de reportes: resumen real calculado de las transacciones */}
      {showReportsModal && (() => {
        const income = transactions.filter((t) => t.type === "plus").reduce((s, t) => s + t.amount, 0);
        const expenses = transactions.filter((t) => t.type === "minus").reduce((s, t) => s + t.amount, 0);
        const fmt = (n: number) => new Intl.NumberFormat("es-CL").format(n);
        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl animate-[scaleIn_0.2s_ease-out]">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800">Reporte Financiero</h3>
                <button onClick={() => setShowReportsModal(false)} aria-label="Cerrar" className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-xl bg-[#bdeddd]/40 border border-slate-100 p-3 text-center">
                  <p className="font-display text-lg font-bold text-[#386458]">+${fmt(income)}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Ingresos</p>
                </div>
                <div className="rounded-xl bg-[#ffd9de]/40 border border-slate-100 p-3 text-center">
                  <p className="font-display text-lg font-bold text-[#7f4e57]">-${fmt(expenses)}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Egresos</p>
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Balance del período</span>
                <span className="font-display text-lg font-bold text-slate-900">${fmt(income - expenses)}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium text-center">{transactions.length} movimientos registrados · {filteredTransactions.length} visibles con el filtro actual</p>
            </div>
          </div>
        );
      })()}
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

// ==========================================================================
// COMPONENTE: PANTALLA 2 - INICIO (Panel Pastoral)
// ==========================================================================
function InicioScreen({ 
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
  | "difusion_whatsapp"
  | "onboarding_setup"
  | "checkin_ninos"
  | "offline_sync"
  | "confirmacion_registro"
  | "biblia";

// Fondo de video superior (nubes) — archivo local en public/videos para que funcione en dev y en GitHub Pages
const SKY_VIDEO_SRC = `${import.meta.env.BASE_URL}videos/nubes1.mp4`;

// Videos del footer (fondo inferior) — H.264 + faststart en public/videos
// (convertidos desde videos/Footer1..5.mp4 con ffmpeg: libx264, yuv420p,
// 854x480, crf 26, +faststart). Se alternan al azar al terminar cada uno.
const FOOTER_VIDEO_SRCS = [1, 2, 3, 4, 5].map(
  (n) => `${import.meta.env.BASE_URL}videos/footer${n}.mp4`
);

function pickRandomFooterSrc(except?: string): string {
  const pool = FOOTER_VIDEO_SRCS.filter((s) => s !== except);
  const list = pool.length > 0 ? pool : FOOTER_VIDEO_SRCS;
  return list[Math.floor(Math.random() * list.length)];
}

// Video del footer: fondo inferior con fundidos de entrada/salida.
// El bottom del video coincide con el top del bottom-nav (el <nav> va
// ENCIMA con z-30, el video DEBAJO con z-0): nunca lo tapa.
function FooterVideo() {
  const [src, setSrc] = useState<string>(() => pickRandomFooterSrc());
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleEnded = () => {
    setFading(true);
    window.setTimeout(() => {
      setSrc((prev) => pickRandomFooterSrc(prev));
      setFading(false);
    }, 800);
  };

  return (
    <div className="footer-video-wrap pointer-events-none fixed inset-x-0 bottom-0 z-0 h-[280px] overflow-hidden" aria-hidden="true">
      <video
        key={src}
        className={`footer-video h-full w-full object-cover${fading ? " is-fading" : ""}`}
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        onEnded={handleEnded}
        ref={(v) => {
          videoRef.current = v;
          if (v) {
            v.muted = true;
            v.play().catch(() => {});
          }
          return undefined;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-white/25 to-[#f4faff]" />
    </div>
  );
}

const NAV_GROUPS: { title: string; links: { screen: ScreenId; label: string; icon: string }[] }[] = [
  {
    title: "Principal",
    links: [{ screen: "inicio", label: "Inicio", icon: "church" }],
  },
  {
    title: "Comunidad",
    links: [
      { screen: "personas", label: "Hermanos", icon: "diversity_1" },
      { screen: "censo_miembro", label: "Ficha Censo", icon: "how_to_reg" },
      { screen: "celulas", label: "Células", icon: "groups_3" },
      { screen: "checkin_ninos", label: "Check-In Niños", icon: "child_care" },
    ],
  },
  {
    title: "Pastoral",
    links: [
      { screen: "pastoral", label: "Pastoral", icon: "volunteer_activism" },
      { screen: "biblia", label: "Biblia", icon: "auto_stories" },
      { screen: "bitacora_pastoral", label: "Bitácora", icon: "menu_book" },
      { screen: "sacramentos", label: "Sacramentos", icon: "water_drop" },
    ],
  },
  {
    title: "Culto y Eventos",
    links: [
      { screen: "culto_vivo", label: "Culto en Vivo", icon: "live_tv" },
      { screen: "eventos", label: "Eventos", icon: "calendar_month" },
      { screen: "multimedia", label: "Multimedia", icon: "podcasts" },
    ],
  },
  {
    title: "Comunicación",
    links: [
      { screen: "comunicaciones", label: "Comunicaciones", icon: "grid_view" },
      { screen: "difusion_whatsapp", label: "Difusión WA", icon: "send" },
    ],
  },
  {
    title: "Administración",
    links: [
      { screen: "finanzas", label: "Finanzas", icon: "account_balance_wallet" },
      { screen: "formulario", label: "Form. Diezmo", icon: "payments" },
      { screen: "roles", label: "Roles", icon: "admin_panel_settings" },
      { screen: "onboarding_setup", label: "Configuración", icon: "rocket_launch" },
    ],
  },
  {
    // Abajo del panel a propósito: pendientes de borrar (Confirmación es
    // pantalla de éxito y Sin Conexión es estado, no módulos).
    title: "Sistema",
    links: [
      { screen: "confirmacion_registro", label: "Confirmación", icon: "task_alt" },
      { screen: "offline_sync", label: "Sin Conexión", icon: "cloud_off" },
    ],
  },
];

// ==========================================================================
// MENÚ DE MÓDULOS (lo comparten la hamburguesa móvil y el header de escritorio)
// ==========================================================================
function NavMenuPanel({
  activeScreen,
  onSelect,
  onClose,
  positionClass,
}: {
  activeScreen: ScreenId;
  onSelect: (screen: ScreenId) => void;
  onClose: () => void;
  positionClass: string;
}) {
  return (
    <>
      {/* Overlay para cerrar al tocar fuera */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] z-40 animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />
      {/* Panel de navegación */}
      {/* Menú flotante en vidrio neutro: 30% de transparencia (blanco al 70%)
          + blur(5px) en claro; el mismo 30% sobre #152834 en oscuro — clase
          .menu-vidrio documentada en src/index.css. Sin cabecera verde (se
          cierra tocando fuera o al elegir una sección). Agrupado por
          secciones en el mismo panel, con scroll interno solo si el alto
          supera la ventana (móviles pequeños); "Sistema" queda abajo para
          borrar después. */}
      <nav className={`menu-vidrio absolute z-50 rounded-[8px] shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] border border-slate-100 overflow-hidden animate-[scaleIn_0.15s_ease-out] ${positionClass}`}>
        <div className="max-h-[calc(100dvh-140px)] overflow-y-auto p-2 space-y-3">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="px-3 pb-1 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                {group.title}
              </p>
              <div className="grid grid-cols-2 gap-1">
                {group.links.map((link) => (
                  <button
                    key={link.screen}
                    onClick={() => {
                      onSelect(link.screen);
                      onClose();
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
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}

// ==========================================================================
// TOGGLE CLARO / OSCURO (se usa en el header móvil y en el de escritorio)
// ==========================================================================
function ThemeToggle({ theme, onToggle }: { theme: "light" | "dark"; onToggle: () => void }) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-pressed={isDark}
      className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-slate-900/5 text-slate-800 hover:bg-slate-900/10 active:scale-90 transition-all cursor-pointer dark:bg-white/10 dark:text-amber-200 dark:hover:bg-white/15"
    >
      <span className="material-symbols-outlined text-[20px]">
        {isDark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}

// ==========================================================================
// SELECTOR DE COLOR DE MARCA (Eucalipto / Zafiro / Terracota)
// Icono palette junto al toggle claro/oscuro (móvil y escritorio).
// El overlay + panel van por PORTAL a document.body: el botón vive dentro
// del header (`relative z-10`) y el contenido de la pantalla —hermano
// posterior con su propio `relative z-10`— pintaba ENCIMA de todo el
// contexto del header (incluido un `fixed z-[70]`, que solo compite dentro
// de su propio stacking context). En el body no hay ancestro que lo atrape.
// ==========================================================================
function TemaColorBoton({ tema, onCambiar }: { tema: TemaColor; onCambiar: (t: TemaColor) => void }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-label="Cambiar color de marca"
        title="Cambiar color de marca"
        aria-expanded={abierto}
        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-slate-900/5 text-slate-800 hover:bg-slate-900/10 active:scale-90 transition-all cursor-pointer dark:bg-white/10 dark:text-amber-200 dark:hover:bg-white/15"
      >
        <span className="material-symbols-outlined text-[20px]">palette</span>
      </button>
      {abierto && typeof document !== "undefined" && createPortal(
        <>
          <div className="fixed inset-0 z-[60] backdrop-blur-[2px]" onClick={() => setAbierto(false)} />
          <div className="menu-vidrio fixed top-[68px] right-3 md:right-8 z-[70] w-44 rounded-[8px] border border-slate-100 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] p-1.5 animate-[scaleIn_0.15s_ease-out]">
            <p className="px-3 pt-1.5 pb-1 text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Color
            </p>
            {TEMAS_COLOR.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onCambiar(t.id);
                  setAbierto(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                  tema === t.id ? "bg-[#386458]/10 text-slate-900 dark:text-white" : "text-slate-700 hover:bg-slate-900/5"
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full shrink-0 border border-black/10"
                  style={{ backgroundColor: t.punto }}
                />
                <span className="text-xs font-bold flex-1">{t.nombre}</span>
                {tema === t.id && (
                  <span className="material-symbols-outlined text-[16px] text-[#386458]">check</span>
                )}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

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
  const { theme, toggleTheme } = useTheme();
  const { temaColor, cambiarTemaColor } = useTemaColor();

  // Sesión local (perfil / acceso sin backend: se guarda en este dispositivo).
  // Incluye el rol elegido al ingresar (de ROLES_INICIALES); las sesiones
  // guardadas antes de esta versión no traen rol y quedan como "Miembro".
  type Sesion = { nombre: string; email: string; rol: string };
  const leerSesion = (): Sesion | null => {
    try {
      const raw = localStorage.getItem("iglesiaos-sesion");
      if (!raw) return null;
      const s = JSON.parse(raw) as Partial<Sesion>;
      if (!s || typeof s.nombre !== "string") return null;
      return {
        nombre: s.nombre,
        email: typeof s.email === "string" ? s.email : "",
        rol: typeof s.rol === "string" && s.rol ? s.rol : "Miembro",
      };
    } catch {
      return null;
    }
  };
  const [sesion, setSesion] = useState<Sesion | null>(leerSesion);
  const ROL_POR_DEFECTO = ROLES_INICIALES.find((r) => r.checked)?.title ?? "Miembro";
  // Opciones del selector de rol: solo roles activos (los suspendidos no se ofrecen).
  const ROLES_ACTIVOS = ROLES_INICIALES.filter((r) => r.checked);
  const [showPerfilModal, setShowPerfilModal] = useState(false);
  const [nombreInput, setNombreInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [rolInput, setRolInput] = useState(ROL_POR_DEFECTO);
  const [loginError, setLoginError] = useState("");
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [sesionToast, setSesionToast] = useState<string | null>(null);
  // Si el rol guardado ya no está activo (p. ej. sesión migrada "Miembro"),
  // se ofrece igual para no perderlo al editar.
  const opcionesRol = ROLES_ACTIVOS.some((r) => r.title === rolInput)
    ? ROLES_ACTIVOS.map((r) => r.title)
    : [rolInput, ...ROLES_ACTIVOS.map((r) => r.title)];

  const avisarSesion = (msg: string) => {
    setSesionToast(msg);
    setTimeout(() => setSesionToast(null), 3000);
  };

  const ingresar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreInput.trim()) {
      setLoginError("Ingresa tu nombre para identificarte.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(emailInput.trim())) {
      setLoginError("Ingresa un correo válido (ej: usuario@correo.com).");
      return;
    }
    const s = { nombre: nombreInput.trim(), email: emailInput.trim(), rol: rolInput };
    try {
      localStorage.setItem("iglesiaos-sesion", JSON.stringify(s));
    } catch {
      /* sin almacenamiento: la sesión dura esta visita */
    }
    setSesion(s);
    setLoginError("");
    setShowPerfilModal(false);
    avisarSesion(`¡Bienvenido/a, ${s.nombre}!`);
  };

  const actualizarPerfil = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreInput.trim()) {
      setLoginError("Ingresa tu nombre para identificarte.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(emailInput.trim())) {
      setLoginError("Ingresa un correo válido (ej: usuario@correo.com).");
      return;
    }
    const s = { nombre: nombreInput.trim(), email: emailInput.trim(), rol: rolInput };
    try {
      localStorage.setItem("iglesiaos-sesion", JSON.stringify(s));
    } catch {
      /* sin almacenamiento: la sesión dura esta visita */
    }
    setSesion(s);
    setLoginError("");
    setEditandoPerfil(false);
    avisarSesion("Perfil actualizado.");
  };

  const cerrarSesion = () => {
    try {
      localStorage.removeItem("iglesiaos-sesion");
    } catch {
      /* nada que limpiar */
    }
    setSesion(null);
    setNombreInput("");
    setEmailInput("");
    setRolInput(ROL_POR_DEFECTO);
    setShowPerfilModal(false);
    avisarSesion("Sesión cerrada en paz.");
  };
  
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
  const [amountError, setAmountError] = useState<string>("");

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
    setAmountError("");
  };

  const handleCustomAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customAmountText.replace(/\D/g, ""), 10);
    if (!isNaN(parsed) && parsed >= 500) {
      setAmount(parsed);
      setAmountError("");
    } else {
      setAmountError("El monto mínimo para consagrar es de $500 CLP.");
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
      setAmountError("Por favor ingresa un monto válido igual o superior a $500 CLP.");
      hasError = true;
    } else {
      setAmountError("");
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
    setAmountError("");
    setActiveScreen("inicio");
  };

  const handleDownloadReceipt = () => {
    const purpose = purposes.find((p) => p.id === selectedPurpose)?.label ?? selectedPurpose;
    const method = paymentMethods.find((m) => m.id === selectedMethod)?.title ?? selectedMethod;
    const lines = [
      "IGLESIAOS · COMPROBANTE DE CONTRIBUCIÓN",
      `Fecha: ${new Date().toLocaleString("es-CL")}`,
      `Monto: CLP $${formatCLP(amount)}`,
      `Propósito: ${purpose}`,
      `Método: ${method}`,
      `Donante: ${isAnonymous ? "Anónimo" : "Juan Pérez Morales"}`,
      email ? `Correo: ${email}` : null,
      prayerRequest ? `Petición de oración: ${prayerRequest}` : null,
    ].filter(Boolean).join("\n");
    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "comprobante-iglesiaos.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f4faff] text-[#0e1d25] font-sans antialiased selection:bg-[#386458]/10 selection:text-[#386458] dark:bg-[#0b151c] dark:text-slate-100 transition-colors">
      

      {/* Main View Container */}
      <div className="py-0 md:py-8 px-0 md:px-4 flex justify-center items-start">
        
        {/* VIEW 1: MOBILE DEVICE VIEW */}
        {viewMode === "mobile" && (
          <div className="w-full bg-[#f4faff] overflow-hidden relative transition-all duration-500 dark:bg-[#0b151c]">
            {/* Fondo de video superior (nubes) — del top hacia abajo */}
            <div className="sky-video-wrap pointer-events-none absolute inset-x-0 top-0 z-0 h-[420px] overflow-hidden" aria-hidden="true">
              <video
                className="sky-video h-full w-full object-cover"
                src={SKY_VIDEO_SRC}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                disablePictureInPicture
                ref={(v) => {
                  if (v) {
                    v.muted = true;
                    v.play().catch(() => {});
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/25 to-[#f4faff]" />
            </div>
            {/* Fondo de video inferior (footer) — fondo de la app completa,
               igual que el video del header: va ANTES del contenido para
               quedar DETRÁS de él (z-0), fixed al viewport, y el bottom-nav
               va ENCIMA (fixed z-30). Nunca tapa el contenido ni el nav. */}
            <FooterVideo />
            {/* Mobile App Screen Content */}
            <div className="bg-transparent min-h-[820px] pt-8 pb-20 flex flex-col relative">
              
              {/* Header inside phone screen */}
              <header className="relative z-10 flex items-center justify-between py-4 bg-transparent [padding-inline:calc(var(--spacing)*2)]">
                <button 
                  onClick={() => setIsMenuOpen((open) => !open)}
                  className="w-11 h-11 flex items-center justify-center -ml-2 text-slate-900 hover:bg-slate-200/50 rounded-full transition-all duration-150 active:scale-90"
                  aria-label="Menú"
                  aria-expanded={isMenuOpen}
                >
                  <span className="material-symbols-outlined text-[22px]">{isMenuOpen ? "close" : "menu"}</span>
                </button>
                <h1 className="font-display font-bold text-base text-slate-900 tracking-tight capitalize">
                  {activeScreen === "inicio" ? "Inicio" : activeScreen === "formulario" ? "Consagración" : activeScreen === "finanzas" ? "Finanzas" : activeScreen === "roles" ? "Roles" : activeScreen === "personas" ? "Hermanos" : activeScreen === "biblia" ? "Biblia" : activeScreen === "celulas" ? "Células" : activeScreen === "multimedia" ? "Multimedia" : activeScreen === "pastoral" ? "Pastoral" : activeScreen === "eventos" ? "Eventos" : activeScreen === "culto_vivo" ? "Culto en Vivo" : activeScreen === "censo_miembro" ? "Ficha Censo" : activeScreen === "sacramentos" ? "Sacramentos" : activeScreen === "bitacora_pastoral" ? "Bitácora" : activeScreen === "difusion_whatsapp" ? "Whatsapp" : activeScreen === "onboarding_setup" ? "Configuración" : activeScreen === "checkin_ninos" ? "Check-In Niños" : activeScreen === "offline_sync" ? "Sin Conexión" : activeScreen === "confirmacion_registro" ? "Confirmación" : "Más"}
                </h1>
                <div className="flex items-center gap-1.5">
                  <ThemeToggle theme={theme} onToggle={toggleTheme} />
                  <TemaColorBoton tema={temaColor} onCambiar={cambiarTemaColor} />
                  <button
                    onClick={() => setShowPerfilModal(true)}
                    className="w-8 h-8 rounded-full bg-[#386458] flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm hover:shadow"
                    aria-label="Perfil"
                    title="Mi perfil y configuración"
                  >
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  </button>
                </div>
              </header>

              {/* MENÚ DESPLEGABLE: LINKS DEL SITIO (HAMBURGUESA) */}
              {isMenuOpen && (
                <NavMenuPanel
                  activeScreen={activeScreen}
                  onSelect={setActiveScreen}
                  onClose={() => setIsMenuOpen(false)}
                  positionClass="top-[72px] left-3 right-3"
                />
              )}

              {/* RENDERIZADO DE PANTALLA ACTIVA MÓVIL */}
              {activeScreen === "inicio" ? (
                <InicioScreen 
                  onNavigateToForm={() => setActiveScreen("formulario")} 
                  onNavigateToHistory={() => setActiveScreen("comunicaciones")}
                  onNavigateToModule={(screen) => setActiveScreen(screen)}
                  onOpenMenu={() => setIsMenuOpen(true)}
                  nombreUsuario={sesion?.nombre}
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
                <EventosScreen
                  onNavigateToLive={() => setActiveScreen("culto_vivo")}
                  onNavigateToCheckin={() => setActiveScreen("checkin_ninos")}
                />
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
                  onNavigateToBiblia={() => setActiveScreen("biblia")}
                />
              ) : activeScreen === "difusion_whatsapp" ? (
                <DifusionWhatsappScreen 
                  onBack={() => setActiveScreen("comunicaciones")}
                />
              ) : activeScreen === "onboarding_setup" ? (
                <OnboardingSetupScreen onBack={() => setActiveScreen("inicio")} />
              ) : activeScreen === "checkin_ninos" ? (
                <CheckinNinosScreen onBack={() => setActiveScreen("eventos")} />
              ) : activeScreen === "offline_sync" ? (
                <OfflineSyncScreen onBack={() => setActiveScreen("inicio")} />
              ) : activeScreen === "confirmacion_registro" ? (
                <ConfirmacionRegistroScreen
                  onBack={() => setActiveScreen("inicio")}
                  onRegisterAnother={() => setActiveScreen("censo_miembro")}
                  onGoHome={() => setActiveScreen("inicio")}
                />
              ) : isSuccess ? (
                /* SUCCESS / RECEIPT SCREEN */
                <div className="flex-1 px-5 flex flex-col justify-center items-center py-10 animate-[fadeIn_0.3s_ease-out]">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-[#386458] mb-6 shadow-sm border border-emerald-100">
                    <span className="material-symbols-outlined text-[44px] font-bold">check_circle</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl text-[#386458] mb-2 text-center text-balance">¡Consagración Exitosa!</h3>
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
              ) : activeScreen === "biblia" ? (
                <BibliaScreen onBack={() => setActiveScreen("pastoral")} />
              ) : activeScreen === "formulario" ? (
                /* MAIN FORM FLOW SCREEN (FORMULARIO DIEZMO) */
                <div className="flex-1 px-5 space-y-5">
                  
                  {/* Status card */}
                  <div className="bg-transparent rounded-[28px] p-4.5 flex items-center justify-between border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-[#bdeddd] rounded-full flex items-center justify-center text-[#386458] shadow-sm">
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

                    {amountError && (
                      <p className="text-center text-[10px] text-rose-500 font-medium animate-[fadeIn_0.2s_ease-out]">{amountError}</p>
                    )}
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
                        role="switch"
                        aria-checked={isAnonymous}
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
              ) : (
                <InicioScreen
                  onNavigateToForm={() => setActiveScreen("formulario")}
                  onNavigateToHistory={() => setActiveScreen("comunicaciones")}
                  onNavigateToModule={(screen) => setActiveScreen(screen)}
                  onOpenMenu={() => setIsMenuOpen(true)}
                  nombreUsuario={sesion?.nombre}
                />
              )}

              {/* Bottom App-styled Navigation Bar */}
              <nav className="bottom-nav border-t border-slate-100 bg-white/70 backdrop-blur-md pt-2 px-3 flex items-center justify-around text-slate-400 text-[10px] font-medium fixed bottom-0 inset-x-0 z-30" style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))" }}>
                <button 
                  onClick={() => setActiveScreen("inicio")}
                  className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                    activeScreen === "inicio" ? "text-[#386458] font-bold" : "hover:text-[#386458]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeScreen === "inicio" ? "'FILL' 1" : "" }}>church</span>
                  <span>Inicio</span>
                </button>
                <button 
                  onClick={() => setActiveScreen("personas")}
                  className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                    activeScreen === "personas" || activeScreen === "roles" ? "text-[#386458] font-bold" : "hover:text-[#386458]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeScreen === "personas" || activeScreen === "roles" ? "'FILL' 1" : "" }}>diversity_1</span>
                  <span>Hermanos</span>
                </button>
                <button 
                  onClick={() => setActiveScreen("biblia")}
                  className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                    activeScreen === "biblia" ? "text-[#386458] font-bold" : "hover:text-[#386458]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeScreen === "biblia" ? "'FILL' 1" : "" }}>auto_stories</span>
                  <span>Biblia</span>
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
              </nav>

            </div>
          </div>
        )}

        {/* VIEW 2: ADAPTIVE DESKTOP FULL VIEW */}
        {viewMode === "desktop" && (
          <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-200/60 overflow-hidden transition-all duration-500 dark:bg-[#101f29] dark:border-slate-700/50">
            <div className="bg-[#f4faff] min-h-[750px] p-8 flex flex-col relative dark:bg-[#0b151c]">
              
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
                      {activeScreen === "inicio" ? "Inicio de Gestión Pastoral" : activeScreen === "formulario" ? "Consagración de Mayordomía" : activeScreen === "finanzas" ? "Consolidación Financiera" : activeScreen === "roles" ? "Definición de Roles" : activeScreen === "onboarding_setup" ? "Configuración Inicial" : activeScreen === "checkin_ninos" ? "Check-In Niños & Familias" : activeScreen === "offline_sync" ? "Sincronización Offline" : activeScreen === "confirmacion_registro" ? "Confirmación de Registro" : activeScreen === "biblia" ? "Lectura Bíblica" : "Canales de Comunicaciones"}
                    </h1>
                    <p className="text-xs text-slate-400 font-medium">Plataforma Integrada para Iglesias y Congregaciones</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{sesion ? sesion.nombre : "Pastor Samuel"}</p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-300 font-bold uppercase tracking-wider">{sesion ? sesion.rol : "Pastor"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen((open) => !open)}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-200/50 transition-all duration-150 active:scale-90 cursor-pointer"
                    aria-label="Menú de módulos"
                    aria-expanded={isMenuOpen}
                  >
                    <span className="material-symbols-outlined text-[22px]">{isMenuOpen ? "close" : "apps"}</span>
                  </button>
                  <ThemeToggle theme={theme} onToggle={toggleTheme} />
                  <TemaColorBoton tema={temaColor} onCambiar={cambiarTemaColor} />
                  <button
                    type="button"
                    onClick={() => setShowPerfilModal(true)}
                    aria-label="Perfil"
                    title="Mi perfil y configuración"
                    className="w-11 h-11 rounded-full bg-[#386458] flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </button>
                </div>
              </header>

              {/* MENÚ DESPLEGABLE: MISMOS LINKS QUE EN MÓVIL (ESCRITORIO) */}
              {isMenuOpen && (
                <NavMenuPanel
                  activeScreen={activeScreen}
                  onSelect={setActiveScreen}
                  onClose={() => setIsMenuOpen(false)}
                  positionClass="top-[100px] right-8 w-[440px]"
                />
              )}

              {/* RENDERIZADO DE PANTALLA ACTIVA ESCRITORIO */}
              {activeScreen === "inicio" ? (
                <div className="w-full">
                  <InicioScreen 
                    onNavigateToForm={() => setActiveScreen("formulario")}
                    onNavigateToHistory={() => setActiveScreen("comunicaciones")}
                    onNavigateToModule={(screen) => setActiveScreen(screen)}
                    onOpenMenu={() => setIsMenuOpen(true)}
                    nombreUsuario={sesion?.nombre}
                  />
                </div>
              ) : activeScreen === "comunicaciones" ? (
                <div className="w-full">
                  <ComunicacionesScreen 
                    onNavigateToForm={() => setActiveScreen("formulario")}
                    onNavigateToInicio={() => setActiveScreen("inicio")}
                    onNavigateToWA={() => setActiveScreen("difusion_whatsapp")}
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
                  <EventosScreen 
                    onNavigateToLive={() => setActiveScreen("culto_vivo")}
                    onNavigateToCheckin={() => setActiveScreen("checkin_ninos")}
                  />
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
              ) : activeScreen === "multimedia" ? (
                <div className="w-full">
                  <MultimediaScreen />
                </div>
              ) : activeScreen === "bitacora_pastoral" ? (
                <div className="w-full">
                  <BitacoraPastoralScreen
                    onBack={() => setActiveScreen("pastoral")}
                    onNavigateToBiblia={() => setActiveScreen("biblia")}
                  />
                </div>
              ) : activeScreen === "onboarding_setup" ? (
                <div className="w-full">
                  <OnboardingSetupScreen onBack={() => setActiveScreen("inicio")} />
                </div>
              ) : activeScreen === "checkin_ninos" ? (
                <div className="w-full">
                  <CheckinNinosScreen onBack={() => setActiveScreen("eventos")} />
                </div>
              ) : activeScreen === "offline_sync" ? (
                <div className="w-full">
                  <OfflineSyncScreen onBack={() => setActiveScreen("inicio")} />
                </div>
              ) : activeScreen === "confirmacion_registro" ? (
                <div className="w-full">
                  <ConfirmacionRegistroScreen
                    onBack={() => setActiveScreen("inicio")}
                    onRegisterAnother={() => setActiveScreen("censo_miembro")}
                    onGoHome={() => setActiveScreen("inicio")}
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
                          <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-200 mt-1">
                            "{prayerRequest}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 w-full">
                    <button
                      onClick={handleDownloadReceipt}
                      className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold py-3.5 px-6 rounded-full transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:shadow-sm"
                      style={{ borderRadius: "4px" }}
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      Descargar comprobante
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
              ) : activeScreen === "biblia" ? (
                <div className="w-full">
                  <BibliaScreen onBack={() => setActiveScreen("pastoral")} />
                </div>
              ) : activeScreen === "formulario" ? (
                /* TWO-COLUMN ADAPTIVE GRID FOR DESKTOP */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left panel (6 columns) */}
                  <div className="lg:col-span-6 space-y-6">
                    
                    {/* Status card */}
                    <div className="bg-transparent rounded-[28px] p-6 flex items-center justify-between border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#bdeddd] rounded-full flex items-center justify-center text-[#386458] shadow-sm">
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

                      {amountError && (
                        <p className="text-center text-[10px] text-rose-500 font-medium animate-[fadeIn_0.2s_ease-out]">{amountError}</p>
                      )}
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
                          role="switch"
                          aria-checked={isAnonymous}
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
              ) : (
                <div className="w-full">
                  <InicioScreen
                    onNavigateToForm={() => setActiveScreen("formulario")}
                    onNavigateToHistory={() => setActiveScreen("comunicaciones")}
                    onNavigateToModule={(screen) => setActiveScreen(screen)}
                    onOpenMenu={() => setIsMenuOpen(true)}
                    nombreUsuario={sesion?.nombre}
                  />
                </div>
              )}

            </div>
          </div>
        )}

        {/* Toast de sesión */}
        {sesionToast && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded shadow-lg z-[60] flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
            <span>{sesionToast}</span>
          </div>
        )}

        {/* Modal Perfil / Acceso (centrado; el overlay conserva su transparencia) */}
        {showPerfilModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-900/40 animate-[fadeIn_0.2s_ease-out]"
              onClick={() => {
                setShowPerfilModal(false);
                setLoginError("");
                setEditandoPerfil(false);
              }}
            />
            <div className="relative w-full max-w-sm menu-vidrio rounded-2xl p-6 shadow-xl border border-slate-100 animate-[scaleIn_0.15s_ease-out]">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-slate-900">{sesion ? "Mi perfil" : "Acceso"}</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowPerfilModal(false);
                    setLoginError("");
                  }}
                  aria-label="Cerrar"
                  className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 active:scale-90 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
              {sesion ? (
                editandoPerfil ? (
                  <form onSubmit={actualizarPerfil} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-500 font-bold uppercase">Nombre</label>
                      <input
                        type="text"
                        value={nombreInput}
                        onChange={(e) => setNombreInput(e.target.value)}
                        placeholder="ej: Pastor Samuel"
                        className="w-full px-4 py-3 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-500 font-bold uppercase">Correo</label>
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="ejemplo@correo.com"
                        className="w-full px-4 py-3 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-500 font-bold uppercase">Rol</label>
                      <select
                        value={rolInput}
                        onChange={(e) => setRolInput(e.target.value)}
                        className="w-full px-4 py-3 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:outline-none bg-white text-slate-800 font-semibold"
                      >
                        {opcionesRol.map((titulo) => (
                          <option key={titulo} value={titulo}>{titulo}</option>
                        ))}
                      </select>
                    </div>
                    {loginError && (
                      <p className="text-[10px] text-rose-500 font-medium animate-[fadeIn_0.2s_ease-out]">{loginError}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditandoPerfil(false);
                          setLoginError("");
                        }}
                        className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                        style={{ borderRadius: "4px" }}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 px-4 bg-[#386458] hover:bg-[#2c4e45] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                        style={{ borderRadius: "4px" }}
                      >
                        Guardar
                      </button>
                    </div>
                  </form>
                ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#386458] text-white flex items-center justify-center text-lg font-bold shrink-0">
                      {sesion.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{sesion.nombre}</p>
                      <p className="text-[11px] text-slate-400 font-medium truncate">{sesion.email}</p>
                      <p className="text-[10px] text-[#386458] font-bold uppercase tracking-wider truncate mt-0.5">{sesion.rol}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Sesión guardada en este dispositivo.</p>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPerfilModal(false);
                        setIsMenuOpen(false);
                        setActiveScreen("onboarding_setup");
                      }}
                      className="w-full py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                      style={{ borderRadius: "4px" }}
                    >
                      <span className="material-symbols-outlined text-[18px]">settings</span>
                      Configuración
                    </button>
                    <button
                      type="button"
                      onClick={cerrarSesion}
                      className="w-full py-3 px-6 bg-white hover:bg-slate-50 text-[#7f4e57] border border-[#f4b6bf] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                      style={{ borderRadius: "4px" }}
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Cerrar sesión
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNombreInput(sesion.nombre);
                        setEmailInput(sesion.email);
                        setRolInput(sesion.rol);
                        setLoginError("");
                        setEditandoPerfil(true);
                      }}
                      className="w-full py-3 px-6 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                      style={{ borderRadius: "4px" }}
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                      Editar perfil
                    </button>
                  </div>
                </div>
                )
              ) : (
                <form onSubmit={ingresar} className="space-y-3">
                  <p className="text-[11px] text-slate-400 font-medium">
                    Identifícate para guardar tu sesión en este dispositivo.
                  </p>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 font-bold uppercase">Nombre</label>
                    <input
                      type="text"
                      value={nombreInput}
                      onChange={(e) => setNombreInput(e.target.value)}
                      placeholder="ej: Pastor Samuel"
                      className="w-full px-4 py-3 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 font-bold uppercase">Correo</label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      className="w-full px-4 py-3 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 font-bold uppercase">Rol</label>
                    <select
                      value={rolInput}
                      onChange={(e) => setRolInput(e.target.value)}
                      className="w-full px-4 py-3 text-xs border border-slate-200 rounded-xl focus:border-[#386458] focus:outline-none bg-white text-slate-800 font-semibold"
                    >
                      {opcionesRol.map((titulo) => (
                        <option key={titulo} value={titulo}>{titulo}</option>
                      ))}
                    </select>
                  </div>
                  {loginError && (
                    <p className="text-[10px] text-rose-500 font-medium animate-[fadeIn_0.2s_ease-out]">{loginError}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-[#386458] hover:bg-[#2c4e45] active:scale-[0.98] text-white py-3 px-6 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    style={{ borderRadius: "4px" }}
                  >
                    <span className="material-symbols-outlined text-[18px]">login</span>
                    Ingresar
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Asistente Ángel flotante: botón + chat de ayuda y navegación.
            Fixed en z-40 (sobre el bottom-nav z-30, bajo modales z-50);
            visible en todas las pantallas de la app. */}
        <AngelAsistente onNavigate={(screen) => setActiveScreen(screen as ScreenId)} />

      </div>

    </div>
  );
}
