import { useState } from "react";

// ==========================================================================
// COMPONENTE: PANTALLA 4 - FINANZAS DASHBOARD (Nueva pantalla de Stitch)
// ==========================================================================
export default function FinanzasDashboardScreen({ 
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
