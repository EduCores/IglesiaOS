import React, { useState } from "react";

interface Song {
  id: number;
  numberTag: string;
  title: string;
  artist: string;
  key: string;
  bpm: number;
  timeSignature: string;
  comment: string;
  atmosphere: "calma" | "intima" | "contemporaneo" | "agradecimiento";
}

interface Rehearsal {
  id: number;
  dayName: string;
  dayNumber: number;
  title: string;
  time: string;
  location: string;
  locationIcon: string;
  confirmed: boolean;
}

export default function EventosScreen({ onNavigateToLive, onNavigateToCheckin }: { onNavigateToLive?: () => void; onNavigateToCheckin?: () => void }) {
  const [selectedTab, setSelectedTab] = useState<"domingo" | "repertorio">("domingo");
  const [selectedAtmosphere, setSelectedAtmosphere] = useState<"todos" | "calma" | "intima" | "contemporaneo" | "agradecimiento">("todos");
  const [playingSongId, setPlayingSongId] = useState<number | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const notify = (message: string) => { setSuccessToast(message); setTimeout(() => setSuccessToast(null), 3000); };

  // Rehearsals state to allow live confirmation!
  const [rehearsals, setRehearsals] = useState<Rehearsal[]>([
    {
      id: 1,
      dayName: "Jue",
      dayNumber: 16,
      title: "Ensayo General",
      time: "7:00 PM",
      location: "Santuario Principal",
      locationIcon: "church",
      confirmed: false
    },
    {
      id: 2,
      dayName: "Sáb",
      dayNumber: 18,
      title: "Ensayo Banda & Voces",
      time: "10:00 AM",
      location: "Sala de Ensayos A",
      locationIcon: "mic",
      confirmed: false
    }
  ]);

  // Songs Setlist
  const songs: Song[] = [
    {
      id: 1,
      numberTag: "01",
      title: "Worthy of It All",
      artist: "David Brymer • Versión Acústica",
      key: "Bb",
      bpm: 72,
      timeSignature: "4/4",
      comment: "Intro: Piano pad suave (4 compases)",
      atmosphere: "intima"
    },
    {
      id: 2,
      numberTag: "02",
      title: "King of Kings",
      artist: "Hillsong Worship • Arreglo Cuerdas",
      key: "D",
      bpm: 68,
      timeSignature: "4/4",
      comment: "Entrada de voces femeninas en Coro",
      atmosphere: "calma"
    },
    {
      id: 3,
      numberTag: "03",
      title: "Build My Life",
      artist: "Housefires • Comunión y Adoración",
      key: "G",
      bpm: 70,
      timeSignature: "4/4",
      comment: "Momento de oración reflexiva",
      atmosphere: "contemporaneo"
    },
    {
      id: 4,
      numberTag: "04",
      title: "Agnus Dei",
      artist: "Michael W. Smith • Oración Final",
      key: "A",
      bpm: 64,
      timeSignature: "4/4",
      comment: "Cierre congregacional a capella",
      atmosphere: "agradecimiento"
    }
  ];

  const handleTogglePlay = (id: number) => {
    if (playingSongId === id) {
      setPlayingSongId(null);
      setSuccessToast("Reproducción pausada.");
    } else {
      setPlayingSongId(id);
      const songTitle = songs.find(s => s.id === id)?.title;
      setSuccessToast(`Reproduciendo demo acústica de "${songTitle}"...`);
    }
    setTimeout(() => setSuccessToast(null), 2500);
  };

  const handleConfirmRehearsal = (id: number) => {
    setRehearsals(prev => 
      prev.map(r => r.id === id ? { ...r, confirmed: !r.confirmed } : r)
    );
    const item = rehearsals.find(r => r.id === id);
    if (item) {
      setSuccessToast(item.confirmed ? "Confirmación cancelada." : "¡Asistencia al ensayo confirmada con éxito!");
    }
    setTimeout(() => setSuccessToast(null), 2500);
  };

  const handleProposeSong = () => {
    setSuccessToast("Formulario enviado al Director de Alabanza.");
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const filteredSongs = songs.filter(song => {
    if (selectedAtmosphere === "todos") return true;
    return song.atmosphere === selectedAtmosphere;
  });

  return (
    <div className="flex-1 pb-24 relative overflow-hidden flex flex-col justify-between animate-[fadeIn_0.25s_ease-out] font-body-md text-body-md text-[#0e1d25]">
      
      {/* Toast Notificador */}
      {successToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded shadow-lg z-50 flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
          <span>{successToast}</span>
        </div>
      )}

      {/* Decorative blurs */}
      <div className="fixed top-20 right-4 w-56 h-56 rounded-full bg-[#cde5ff]/40 blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed top-96 -left-12 w-64 h-64 rounded-full bg-[#bdeddd]/30 blur-3xl pointer-events-none -z-10"></div>

      <div className="flex flex-col w-full px-5 space-y-5">
        
        {/* Top Announcement Banner: Próximo Culto */}
        <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#507d70]/20 via-[#386458]/20 to-[#214e43]/20 text-slate-900 dark:text-white p-5 shadow-md">
          <div className="absolute -right-8 -bottom-10 w-36 h-36 rounded-full bg-[#386458]/10 dark:bg-white/10 blur-xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#386458]/10 dark:bg-white/15 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                Domingo • 10:30 AM
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ffd9de] text-[#663a42] text-[9px] font-bold uppercase tracking-wider">
                En 3 días
              </span>
            </div>

            <div className="mt-1">
              <span className="text-[9px] text-[#386458] dark:text-white/80 font-bold uppercase tracking-widest leading-none">Próximo Culto de Alabanza</span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">Paz & Esperanza</h2>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-white/90 leading-relaxed line-clamp-2">
              Una atmósfera serena para renovar el espíritu a través de acordes contemplativos y gratitud comunitaria.
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-slate-900/10 dark:border-white/10 mt-1">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-[#386458] text-[9px] font-bold shadow-sm">LR</span>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#cde5ff] text-[#294964] text-[9px] font-bold shadow-sm">MA</span>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#ffd9de] text-[#663a42] text-[9px] font-bold shadow-sm">SD</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-white/80 font-semibold">8 músicos listos</span>
              </div>
              <button 
                onClick={() => onNavigateToLive ? onNavigateToLive() : alert("Mostrando la pauta del servicio...")}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-[#386458] dark:text-[#bdeddd] hover:text-[#214e43] dark:hover:text-white transition-colors cursor-pointer"
              >
                <span>Ver orden</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* Acción Rápida: Check-In Ministerio Infantil — patrón Bitácora:
            fila 1 avatar + título (+ Abrir), fila 2 detalle debajo fuera de la fila */}
        <section className="flex flex-col gap-2 rounded-xl bg-white border border-slate-100 p-4 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#bdeddd]/40 text-[#386458] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px] font-bold">child_care</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 leading-none truncate">Check-In Niños & Familias</p>
            </div>
            <button
              onClick={() => onNavigateToCheckin ? onNavigateToCheckin() : alert("Abriendo Check-In del Ministerio Infantil...")}
              className="ml-auto shrink-0 px-3.5 py-2 rounded-full bg-[#386458] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:bg-[#2c4e45] transition-colors"
              style={{ borderRadius: "4px" }}
            >
              <span className="material-symbols-outlined text-[15px] font-bold">how_to_reg</span>
              <span>Abrir</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">Registra el ingreso seguro del ministerio infantil.</p>
        </section>

        {/* Segmented Controls / Pill Tabs */}
        <div className="flex items-center p-1 rounded-full bg-slate-100 backdrop-blur-md shadow-sm">
          <button 
            onClick={() => setSelectedTab("domingo")}
            className={`flex-1 py-2 rounded-full text-xs font-bold text-center transition-all cursor-pointer ${
              selectedTab === "domingo" ? "bg-[#386458] text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
            style={{ borderRadius: "4px" }}
          >
            Canciones Domingo
          </button>
          <button 
            onClick={() => {
              setSelectedTab("repertorio");
            }}
            className={`flex-1 py-2 rounded-full text-xs font-bold text-center transition-all cursor-pointer ${
              selectedTab === "repertorio" ? "bg-[#386458] text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
            style={{ borderRadius: "4px" }}
          >
            Repertorio Completo
          </button>
        </div>

        {/* Category Filter Pills */}
        <section className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Filtrar atmósfera</span>
            <span className="text-[11px] text-[#386458] font-bold uppercase tracking-wider">{filteredSongs.length} temas</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 -mx-5 px-5">
            <button 
              onClick={() => setSelectedAtmosphere("todos")}
              className={`shrink-0 px-4 py-2 rounded-full text-[10px] font-bold transition-all shadow-sm cursor-pointer ${
                selectedAtmosphere === "todos" ? "bg-[#386458] text-white" : "bg-slate-100 text-slate-500"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Todos
            </button>
            <button 
              onClick={() => setSelectedAtmosphere("calma")}
              className={`shrink-0 px-4 py-2 rounded-full text-[10px] font-bold transition-all shadow-sm cursor-pointer ${
                selectedAtmosphere === "calma" ? "bg-[#386458] text-white" : "bg-slate-100 text-slate-500"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Himnos de Adoración
            </button>
            <button 
              onClick={() => setSelectedAtmosphere("intima")}
              className={`shrink-0 px-4 py-2 rounded-full text-[10px] font-bold transition-all shadow-sm cursor-pointer ${
                selectedAtmosphere === "intima" ? "bg-[#386458] text-white" : "bg-slate-100 text-slate-500"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Adoración Íntima
            </button>
            <button 
              onClick={() => setSelectedAtmosphere("contemporaneo")}
              className={`shrink-0 px-4 py-2 rounded-full text-[10px] font-bold transition-all shadow-sm cursor-pointer ${
                selectedAtmosphere === "contemporaneo" ? "bg-[#386458] text-white" : "bg-slate-100 text-slate-500"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Contemporáneo
            </button>
            <button 
              onClick={() => setSelectedAtmosphere("agradecimiento")}
              className={`shrink-0 px-4 py-2 rounded-full text-[10px] font-bold transition-all shadow-sm cursor-pointer ${
                selectedAtmosphere === "agradecimiento" ? "bg-[#386458] text-white" : "bg-slate-100 text-slate-500"
              }`}
              style={{ borderRadius: "4px" }}
            >
              Agradecimiento
            </button>
          </div>
        </section>

        {/* Setlist Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#386458] text-[20px] font-bold">queue_music</span>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Setlist del Culto</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
              {filteredSongs.length} pistas • {filteredSongs.length * 5} min
            </span>
          </div>

          {/* Songs loop */}
          {filteredSongs.map((song) => {
            const isPlaying = playingSongId === song.id;
            return (
              <article 
                key={song.id}
                className="rounded-xl bg-white p-4 flex flex-col gap-3.5 shadow-sm border border-slate-100 hover:shadow-md transition-all"
              >
                {/* Criterio del bloque canción — patrón Bitácora adaptado:
                    fila 1 avatar(play) + nombres (título + artista),
                    fila 2 metadata (tono/BPM/compás) debajo fuera de la fila
                    para no apretar en 360px */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <button 
                    onClick={() => handleTogglePlay(song.id)}
                    className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer ${
                      isPlaying 
                        ? "bg-[#386458] text-white" 
                        : "bg-slate-50 hover:bg-[#386458]/10 text-[#386458]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {isPlaying ? "pause" : "play_arrow"}
                    </span>
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate leading-none min-w-0">{song.title}</h4>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full shrink-0">
                        {song.numberTag}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold truncate leading-none">{song.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#386458] bg-[#bdeddd]/60 px-2 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-[13px] font-bold">music_note</span>
                    Tono: {song.key}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#42617d] bg-[#cde5ff]/60 px-2 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-[13px] font-bold">file_map_stack</span>
                    {song.bpm} BPM
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">{song.timeSignature}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-50 px-2 py-1.5 bg-slate-50/50 rounded-lg">
                  <span className="text-[10px] text-slate-500 font-medium leading-none">{song.comment}</span>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                    <button 
                      onClick={() => notify("Cifrado disponible próximamente.")}
                      className="inline-flex items-center gap-1 text-[#386458] hover:text-[#2c4e45] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px] font-bold">picture_as_pdf</span>
                      <span>Acordes</span>
                    </button>
                    <span className="text-slate-300">•</span>
                    <button 
                      onClick={() => notify("Letra completa disponible próximamente.")}
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-800 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px] font-bold">lyrics</span>
                      <span>Letra</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Ensayos Programados */}
        <section className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#42617d] text-[20px] font-bold">event_repeat</span>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Ensayos Programados</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Esta semana</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {rehearsals.map((reh) => (
              <div
                key={reh.id}
                className="flex flex-col gap-2 p-4 rounded-xl bg-white shadow-sm border border-slate-100"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center shrink-0 border shadow-inner ${
                    reh.id === 1 ? "bg-[#cde5ff]/60 border-blue-100/50 text-[#294964]" : "bg-[#ffd9de]/60 border-rose-100/50 text-[#7f4e57]"
                  }`}>
                    <span className="text-[9px] font-bold uppercase tracking-wider leading-none">{reh.dayName}</span>
                    <span className="text-base font-bold leading-none mt-1">{reh.dayNumber}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate leading-none">{reh.title}</h4>
                  </div>

                  <button
                    onClick={() => handleConfirmRehearsal(reh.id)}
                    className={`shrink-0 ml-2 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      reh.confirmed
                        ? "bg-[#bdeddd] text-[#214e43] border border-transparent shadow-inner"
                        : "bg-slate-100 text-slate-500 hover:bg-[#386458] hover:text-white border border-slate-200 shadow-sm"
                    }`}
                  >
                    {reh.confirmed ? "Confirmado!" : "Confirmar"}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider flex-wrap min-w-0">
                  <span className="flex items-center gap-1 leading-none">
                    <span className="material-symbols-outlined text-[14px] text-[#386458] font-bold">schedule</span>
                    {reh.time}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 leading-none min-w-0">
                    <span className="material-symbols-outlined text-[14px] text-[#386458] font-bold shrink-0">{reh.locationIcon}</span>
                    <span className="truncate">{reh.location}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Atmospheric Visual Card / Devotional Prompt */}
        <div className="relative overflow-hidden rounded-xl p-4 flex items-center justify-between bg-slate-50 shadow-inner border border-slate-100">
          <div className="flex flex-col gap-1 pr-3">
            <div className="flex items-center gap-1.5 text-[#386458] text-[9px] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px] font-bold">menu_book</span>
              <span>Preparación Espiritual</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal font-medium">
              “Canten con entendimiento y reposo en el corazón.”
            </p>
          </div>

          <div 
            className="w-14 h-14 rounded-full shrink-0 bg-cover bg-center shadow-inner border border-white" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAqzJjqXSaGLBtjVdP-eVPdtU3u-O0yJKS6SYbdPBQVuaZHXPyxNiGBWXF4j-XfuoxcaaGfqA_JZgYfS_Kf8iPGof3u4jDTQ44GnHjv9CTrQIMKZiceSRL5BE2fwsysN5V_3LdQ1rIV3uNepjdRUzXzymn3McsFUTPIG8z_U_ZWR6koEdE2aciG2jBSKu2AOm_bNDgPtQJWy7La_rFfQtglayrY9b81WJrHA6r1Nb-db-w76QFg_x-m')" }}
          ></div>
        </div>

        {/* Primary Action Buttons */}
        <section className="flex flex-col gap-2.5 pt-1">
          <button 
            onClick={handleProposeSong}
            className="w-full py-3.5 px-6 bg-[#386458] hover:bg-[#2c4e45] text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
            style={{ borderRadius: "4px" }}
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>Proponer Canción para el Culto</span>
          </button>
          
          <button 
            onClick={() => notify("Partituras disponibles próximamente.")}
            className="w-full py-3.5 px-6 bg-[#e7f6ff] hover:bg-[#e0f0fb] text-[#42617d] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
            style={{ borderRadius: "4px" }}
          >
            <span className="material-symbols-outlined text-[20px]">menu_book</span>
            <span>Ver Carpeta de Partituras</span>
          </button>
        </section>

      </div>

    </div>
  );
}
