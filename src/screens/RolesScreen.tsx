import React, { useState, useEffect } from "react";
import { ROLES_INICIALES } from "../data/roles";
import { supabase } from "../lib/supabase";
import { mapRowToUI, useRolesNube, type RolUI } from "../lib/useRoles";
// Pantalla Roles Definidos (extraída de App.tsx, Fase 1: sin cambios).
export default function RolesScreen() {
  const [selectedFilter, setSelectedFilter] = useState<"todos" | "liderazgo" | "ministerios" | "apoyo">("todos");
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleCategory, setNewRoleCategory] = useState<"liderazgo" | "ministerios" | "apoyo">("liderazgo");
  const [newRoleDesc, setNewRoleNameDesc] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Lista dinámica de roles iniciales
  const [roles, setRoles] = useState<RolUI[]>(ROLES_INICIALES);

  // Fase 4 (piloto): si hay sesión en la nube, los roles vienen de la BD
  // (merge por título, `checked` desde la nube). Sin nube, todo local.
  const nubeRoles = useRolesNube();
  useEffect(() => {
    if (!nubeRoles.filas) return;
    setRoles(nubeRoles.filas.map((row) => mapRowToUI(row)));
  }, [nubeRoles.filas]);

  const avisarNube = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleToggleSwitch = (id: number | string) => {
    const actual = roles.find((r) => r.id === id);
    setRoles(prev =>
      prev.map(r => r.id === id ? { ...r, checked: !r.checked } : r)
    );
    // Escritura optimista en la nube (solo filas con uuid). Si RLS lo
    // niega, el cambio queda local y se avisa con honestidad.
    if (nubeRoles.sincronizado && supabase && typeof id === "string" && actual) {
      void supabase
        .from("roles")
        .update({ is_active: !actual.checked })
        .eq("id", id)
        .then(({ error }) => {
          if (error) avisarNube("Sin permiso en la nube: cambio solo local.");
        });
    }
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    // Con nube: uuid propio (evita leer el id de vuelta); sin nube: entero.
    const idNuevo: number | string =
      nubeRoles.sincronizado && supabase ? crypto.randomUUID() : roles.length + 1;
    const newRole: RolUI = {
      id: idNuevo,
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
    if (nubeRoles.sincronizado && supabase && typeof idNuevo === "string") {
      void supabase
        .from("roles")
        .insert({
          id: idNuevo,
          title: newRole.title,
          tag: newRole.tag,
          type: newRole.type,
          description: newRole.desc,
          icon: newRole.icon,
        })
        .then(({ error }) => {
          if (error) avisarNube("Sin permiso en la nube: rol solo local.");
        });
    }
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
