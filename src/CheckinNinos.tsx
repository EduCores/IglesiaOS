import React, { useState } from "react";

interface KidInRoom {
  id: number;
  name: string;
  avatar: string;
  time: string;
  room: string;
  status: "aula" | "entregado";
}

export default function CheckinNinosScreen({ onBack }: { onBack?: () => void }) {
  const [selectedRoom, setSelectedRoom] = useState("parvulos");
  const [searchQuery, setSearchQuery] = useState("");
  const [printSuccess, setPrintSuccess] = useState(false);
  const [kidsInRoom] = useState<KidInRoom[]>([
    {
      id: 1,
      name: "Emilia Morales Vera",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCbiVx6_gaitnH5IuVFdG3LUeQbFvTEpKaleMaKeGhTm0cgHm_3-LfRWI6fR9ed45_tYa04LSjAJiLZ2dPonz1IeYYWzdJLIDLzpExJoela3NWW9--K437uuD1CZglleN3NkkEW8sxhRLsNHytsvEi8SRK7nLtyVF1NdDyrUinitVVXKXobz6KfCP3Rmc6STgWdVRYhsXdsZBOTKJB7ECOIhl0poQW9iTSqV0BEm5S5CwvXl3MtQus",
      time: "10:14",
      room: "Párvulos",
      status: "aula"
    },
    {
      id: 2,
      name: "Lucas Benítez",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEyg2Cvug1ERN-lYlbT5J6yQtYnwZwMuxKAMO8mePRJ7Chl8R0ryiTVTEGRhfJpkK9qPihLh7yRfxoktDA8C1oSFhgn-3lHG4zzeudFobGk9vLcybv99lVnk5Z84r3e7OOMuy381fLVAIpd9cup0g6Omm6d7gJ1tj38ZqPY3UWjfCrnzu9ahR1mxAZdXQFNMuwvLmpIaKMt7o2EE-5-XCbWuJjdIW6WeRbPQ-k0YsZaVgyIrI5QcZ_",
      time: "10:48",
      room: "Sala Cuna",
      status: "entregado"
    }
  ]);

  const rooms = [
    { key: "cuna", label: "Cuna 0-2a", icon: "baby_changing_station" },
    { key: "parvulos", label: "Párvulos 3-5a", icon: "child_care" },
    { key: "primarios", label: "Primarios 6-9a", icon: "school" },
    { key: "preadol", label: "Pre-Adol 10-12a", icon: "sports_esports" }
  ];

  const handlePrintLabel = () => {
    setPrintSuccess(true);
    setTimeout(() => setPrintSuccess(false), 4500);
  };

  const filteredKids = kidsInRoom.filter(kid =>
    kid.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 pb-24 relative overflow-hidden flex flex-col justify-between animate-[fadeIn_0.25s_ease-out] font-body-md text-body-md text-[#0e1d25]">

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
        <span className="min-w-0 truncate text-xs text-slate-500">Sesión en curso</span>
      </div>

      <div className="flex flex-col w-full px-5 space-y-5">

        <div className="relative overflow-hidden rounded-xl bg-white border border-slate-100 p-5 shadow-sm">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#bdeddd]/20 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#386458] animate-pulse"></span>
                <span className="text-[10px] text-[#386458] font-bold uppercase tracking-wider">Culto Dominical Activo</span>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#cde5ff] text-[#294964] font-bold uppercase">38 Niños en Aula</span>
            </div>

            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Check-In Niños & Familias</h2>
              <p className="text-[11px] text-slate-400 font-semibold">Registro sereno y entrega protegida para el ministerio infantil</p>
            </div>

            <div className="relative w-full pt-1">
              <div className="flex items-center rounded-full bg-white px-3.5 py-2.5 shadow-sm border border-slate-100">
                <span className="material-symbols-outlined text-slate-400 text-[20px] mr-2">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por apellido familiar, RUT o niño..."
                  className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  onClick={() => alert("Abriendo escáner de códigos QR...")}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-[#386458] transition-all ml-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] font-bold">qr_code_scanner</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Seleccionar Aula & Edad</span>
            <button
              onClick={() => alert("Aforos de Aula:\n- Cuna: 12/15\n- Párvulos: 15/20\n- Primarios: 11/25")}
              className="text-[10px] text-[#386458] font-bold uppercase tracking-wider cursor-pointer hover:underline"
            >
              Ver aforos
            </button>
          </div>

          <div className="flex space-x-2 overflow-x-auto py-1 scrollbar-hide -mx-5 px-5">
            {rooms.map((room) => {
              const isActive = selectedRoom === room.key;
              return (
                <button
                  key={room.key}
                  onClick={() => setSelectedRoom(room.key)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-[10px] font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isActive ? "bg-[#386458] text-white shadow-sm" : "bg-[#e7f6ff] text-slate-600 hover:bg-[#e0f0fb]"
                  }`}
                  style={{ borderRadius: "4px" }}
                >
                  {isActive && <span className="material-symbols-outlined text-[15px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>{room.icon}</span>}
                  <span>{room.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-white border border-slate-100 p-5 shadow-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#bdeddd]/20 rounded-bl-full pointer-events-none"></div>

          <div className="flex flex-col gap-2 relative z-10 pb-4 border-b border-slate-100">
            <div className="flex items-start gap-4 min-w-0">
              <div className="relative shrink-0">
                <img
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                  alt="Mateo Silva Contreras"
                  src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=150"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#386458] text-white rounded-full flex items-center justify-center border-2 border-white">
                  <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                </span>
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-900 leading-tight truncate">Mateo Silva Contreras</h3>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5">4 años • Sala Párvulos</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#bdeddd]/50 text-[#214e43] text-[9px] font-bold uppercase tracking-wider">Ingresado 10:22</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#e7f6ff] text-[#294964] text-[9px] font-bold uppercase tracking-wider">RUT 24.118.903-6</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 mt-4 bg-[#ffd9de]/60 border border-[#f4b6bf]/60 rounded-lg p-3">
            <span className="material-symbols-outlined text-[#663a42] text-[18px] font-bold shrink-0">warning</span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-[#663a42] uppercase tracking-wider leading-none">Alerta de salud</p>
              <p className="text-[10px] text-[#7f4e57] font-semibold mt-1 leading-relaxed">
                Alergia a frutos secos. No administrar colaciones sin autorización del tutor.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Tutor Autorizado</span>
              <p className="text-[11px] font-bold text-slate-800 mt-1 leading-none">Camila Silva Contreras</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="material-symbols-outlined text-[#42617d] text-[15px] font-bold">verified_user</span>
                <span className="text-[9px] text-slate-400 font-semibold">Identidad validada</span>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">PIN de Entrega</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-base font-mono font-bold text-[#386458] tracking-[0.35em] leading-none">4821</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#386458] animate-pulse"></span>
              </div>
              <p className="text-[9px] text-slate-400 font-semibold mt-1.5">Se solicita al momento del retiro.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
            <div className="w-20 h-20 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-slate-800 text-[46px]">qr_code_scanner</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider leading-none">Código de Retiro</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-1.5 leading-relaxed">
                Muestra este código al tutor para habilitar la entrega segura del niño.
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="material-symbols-outlined text-[#386458] text-[15px] font-bold">person_check</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Verificación de identidad obligatoria</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePrintLabel}
            className="w-full mt-4 py-3.5 px-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all"
            style={{ borderRadius: "4px" }}
          >
            <span className="material-symbols-outlined text-[18px] font-bold">{printSuccess ? "check_circle" : "print"}</span>
            <span>{printSuccess ? "Etiqueta enviada a impresión" : "Imprimir Etiqueta de Retiro"}</span>
          </button>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Niños en Aula ({filteredKids.length})</span>
            <button
              onClick={() => alert("Generando reporte de asistencia infantil...")}
              className="text-[10px] text-[#386458] font-bold uppercase tracking-wider cursor-pointer hover:underline"
            >
              Ver reporte
            </button>
          </div>

          {filteredKids.length === 0 ? (
            <div className="rounded-xl bg-white border border-slate-100 p-6 shadow-sm text-center">
              <span className="material-symbols-outlined text-slate-300 text-[32px]">search_off</span>
              <p className="text-[11px] text-slate-400 font-semibold mt-2">Sin coincidencias en el registro de hoy.</p>
            </div>
          ) : (
            filteredKids.map((kid) => (
              <div key={kid.id} className="rounded-xl bg-white border border-slate-100 p-3.5 shadow-sm flex items-center gap-3">
                <img className="w-10 h-10 rounded-full object-cover border border-slate-100 shrink-0" alt={kid.name} src={kid.avatar} />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate leading-none">{kid.name}</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">{kid.room} • Ingreso {kid.time}</p>
                </div>
                <span className={`ml-auto shrink-0 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  kid.status === "aula" ? "bg-[#bdeddd]/60 text-[#214e43]" : "bg-[#e7f6ff] text-[#294964]"
                }`}>
                  {kid.status === "aula" ? "En aula" : "Entregado"}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Maestras a cargo</span>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex -space-x-2">
              <span className="w-8 h-8 rounded-full bg-[#bdeddd] text-[#214e43] flex items-center justify-center text-[10px] font-bold border-2 border-white">RS</span>
              <span className="w-8 h-8 rounded-full bg-[#cde5ff] text-[#294964] flex items-center justify-center text-[10px] font-bold border-2 border-white">PD</span>
              <span className="w-8 h-8 rounded-full bg-[#ffd9de] text-[#663a42] flex items-center justify-center text-[10px] font-bold border-2 border-white">MC</span>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
              R. Sepúlveda, P. Díaz y M. Cárdenas • Ministerio Infantil
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}