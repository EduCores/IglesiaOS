import React, { useState, useEffect, lazy, Suspense } from "react";

interface SyncChannel {
  id: number;
  name: string;
  description: string;
  icon: string;
  bgColor: string;
  iconColor: string;
  active: boolean;
}

// react-player v3 con carga diferida: el chunk se descarga solo al abrir un clip o iniciar el preview.
const ReactPlayer = lazy(() => import("react-player"));

// Feed de demostración del preview de cámara — reemplazar por la señal real (RTMP/HLS) del canal.
const DEMO_CAMERA_FEED = "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4";

const PlayerLoader = () => (
  <div className="w-full h-full flex items-center justify-center bg-slate-950">
    <span className="material-symbols-outlined text-[#a1d0c1] text-[28px] animate-spin">progress_activity</span>
  </div>
);

export default function MultimediaScreen() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerIntervalId, setTimerIntervalId] = useState<any>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Synchronized Channels State
  const [channels, setChannels] = useState<SyncChannel[]>([
    {
      id: 1,
      name: "YouTube Live Oficial",
      description: "RTMP Principal · Canal Comunidad de Fe",
      icon: "smart_display",
      bgColor: "bg-[#ffd9de]",
      iconColor: "text-[#7f4e57]",
      active: true
    },
    {
      id: 2,
      name: "Facebook Watch Iglesia",
      description: "Página Oficial Verificada · Evento en Vivo",
      icon: "public",
      bgColor: "bg-[#cde5ff]",
      iconColor: "text-[#294964]",
      active: true
    },
    {
      id: 3,
      name: "Grabación Local en 4K",
      description: "Google Drive Backup · ProRes HQ",
      icon: "cloud_upload",
      bgColor: "bg-[#bdeddd]",
      iconColor: "text-[#214e43]",
      active: true
    }
  ]);

  // Slides State
  const slides = [
    { text: `"¡Cuán grande es Él! ¡Cuán grande es Él! Canta mi ser, mi Salvador, a Ti..."`, details: "Cuan Grande es Dios · Coro 1", index: 14 },
    { text: `"Mi corazón entona la canción: ¡Cuán grande es Él! ¡Cuán grande es Él!..."`, details: "Cuan Grande es Dios · Coro 2", index: 15 },
    { text: `"Y cuando en Sion con gozo le veré, y la victoria en Él celebraré..."`, details: "Cuan Grande es Dios · Verso 3", index: 16 },
    { text: `"Señor mi Dios, al contemplar los cielos, el firmamento y las estrellas mil..."`, details: "Cuan Grande es Dios · Verso 1", index: 1 }
  ];
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Biblioteca de clips recientes (react-player) — DEMO: reemplazar cada `src` por las grabaciones reales del canal.
  const [activeClipId, setActiveClipId] = useState<number | null>(null);
  const clips = [
    {
      id: 1,
      title: "Culto Dominical · Prédica Completa",
      meta: "Dom 27 Sep · 412 reproducciones",
      badge: "HD",
      thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFidNdOOMK-Gc1IlEvVisENzHoO1-ixW45S5GfWQkW_zxYISoGnZIFSjLRpUncMXBHxm39TE7O7BLGp31I3AYuJ4pOmPeEKKz2Kb9snNgg4eyDhI864cehrbiTv5KYXpS5bmooWSPVIVzk7VxUbe4oOzvcj1z-GPoNEfUvZir-Bl4VbQPzNWtTwtWde95Pj2QnUeoaocAuY-bMyMMnBiKM5hKaS3uTljA6Md-suUsf7Xvm6x6myS-3",
      src: "https://www.youtube.com/watch?v=LXb3EKWsInQ"
    },
    {
      id: 2,
      title: "Set de Adoración · Cuán Grande es Dios",
      meta: "Dom 27 Sep · 268 reproducciones",
      badge: "4K",
      thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXZQ04S41pr2PWBNCWCCtjbco4gMgLaRNTIT55jYfXjLfA-s8KATpoFYyhTwqpYs5UdkYFjVw7OYLn6TQpDlulgjVJ8vpqWhDcv37unHoA_gE7cUmiFPHMwPZLUMmkYunqQzlH0QPDwNX0jIfgQq8UoqbH4XsvcI7Ezmku9lZvUE5G8-vPtiMcPHkG1VrpPsfH-1jMTuoxFTfQ2i0-h1bGvlz79Hj1VRddlOdSAA1jXHSUoplKoXOm",
      src: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4"
    },
    {
      id: 3,
      title: "Bautismos & Testimonios · Servicio Especial",
      meta: "Vie 18 Sep · 305 reproducciones",
      badge: "CLIP",
      thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKuDV7C_6aZYyhi5tu2z1OQld66W9ew608SiUHa3NqIfobUM8rA2zg1aUrTDQ8M1I0dlr7KwtsSlxHrDjlju_ElTynZ8KOI6XMzwgagPKu21q__Hyhgimph3gdWwy7ykxaa_B1XRtaI6xn_h-zm-LSu1Il38Ym74SPPIv8MkZMA-Z-_XHdlsB-6RUvpcXOBDE93EFLAM8dpVEzrxAv27BVEgdxdWq6REqUpyoAUXzDlsc7ONsTYFtF",
      src: "https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4"
    }
  ];

  // Fondo de video — cualquier video de la pantalla (feed de cámara o clips) puede activarse como fondo del contenido.
  const [backgroundVideo, setBackgroundVideo] = useState<{ label: string; src: string } | null>(null);
  const hasBackground = backgroundVideo !== null;
  const isCameraBackground = backgroundVideo?.src === DEMO_CAMERA_FEED;

  const toggleBackground = (label: string, src: string) => {
    setBackgroundVideo(prev => (prev && prev.src === src ? null : { label, src }));
  };

  // Stopwatch effect
  useEffect(() => {
    let interval: any = null;
    if (isStreaming) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
      setTimerIntervalId(interval);
    } else {
      if (timerIntervalId) {
        clearInterval(timerIntervalId);
      }
      setSecondsElapsed(0);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  const toggleChannel = (id: number) => {
    setChannels(prev => 
      prev.map(c => c.id === id ? { ...c, active: !c.active } : c)
    );
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex(prev => (prev + 1) % slides.length);
    setSuccessToast("¡Siguiente diapositiva proyectada con éxito!");
    setTimeout(() => setSuccessToast(null), 2000);
  };

  const handleShowVerse = () => {
    setSuccessToast("¡Versículo de Gracia & Redención proyectado en pantalla!");
    setTimeout(() => setSuccessToast(null), 2500);
  };

  const handleAlert = () => {
    setSuccessToast("¡Alerta pastoral proyectada: 'Comienza en 5 minutos'!");
    setTimeout(() => setSuccessToast(null), 2500);
  };

  const formatTimer = (seconds: number) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const handleToggleStream = () => {
    setIsStreaming(!isStreaming);
    if (!isStreaming) {
      setSuccessToast("¡Transmisión iniciada con éxito en todos los canales!");
    } else {
      setSuccessToast("¡Transmisión finalizada y guardada localmente!");
    }
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handlePinMessage = () => {
    setSuccessToast("¡Mensaje de ofrenda y bienvenida fijado en YT y FB!");
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="flex-1 pb-24 relative overflow-hidden flex flex-col justify-between animate-[fadeIn_0.25s_ease-out] font-body-md text-body-md text-[#0e1d25]">
      
      {/* Toast Notificador */}
      {successToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded shadow-lg z-50 flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
          <span>{successToast}</span>
        </div>
      )}

      {/* Fondo de Video — capa ambiente detrás del contenido, activable desde el feed de cámara o los clips */}
      {backgroundVideo && (
        <div className="absolute inset-0 z-0 pointer-events-none [&_video]:w-full [&_video]:h-full [&_video]:object-cover">
          <Suspense fallback={null}>
            <ReactPlayer
              src={backgroundVideo.src}
              playing
              muted
              loop
              playsInline
              width="100%"
              height="100%"
              style={{ position: "absolute", inset: 0 }}
            />
          </Suspense>
          <div className="absolute inset-0 bg-slate-950/45"></div>
        </div>
      )}

      <div className="relative z-10 flex flex-col w-full px-5 space-y-5">
        
        {/* Chip de control del fondo activo */}
        {backgroundVideo && (
          <div className="flex items-center justify-between bg-slate-900/75 backdrop-blur-md text-white rounded-full pl-3.5 pr-1.5 py-1.5 shadow-lg border border-white/15">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[#a1d0c1] text-[16px]">wallpaper</span>
              <span className="text-[10px] font-bold truncate">Fondo activo · {backgroundVideo.label}</span>
            </div>
            <button
              onClick={() => setBackgroundVideo(null)}
              title="Quitar fondo"
              className="p-1.5 rounded-full hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* Status & Network Monitor Strip */}
        <div className={`rounded-2xl p-4 border flex flex-col gap-1.5 mt-2 transition-colors duration-300 ${hasBackground ? "bg-white/75 backdrop-blur-xl shadow-lg shadow-slate-950/5 border-white/60" : "bg-white shadow-sm border-slate-100"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isStreaming ? "bg-red-500" : "bg-[#386458]"}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isStreaming ? "bg-red-500" : "bg-[#386458]"}`}></span>
              </span>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Transmisión en Vivo</span>
            </div>

            {isStreaming ? (
              <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-inner animate-pulse">
                <span className="material-symbols-outlined text-[14px]">sensors</span>
                <span>EN VIVO / TRANSMITIENDO</span>
              </div>
            ) : (
              <div className="bg-[#bdeddd] text-[#214e43] px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-[14px]">sensors</span>
                <span>EN ESPERA / LISTO</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-50 mt-1">
            <div className="flex items-center gap-1 text-slate-400 text-[10px] font-semibold">
              <span className="material-symbols-outlined text-[15px] text-[#386458]">wifi_tethering</span>
              <span>1080p 60fps · 6,200 kbps · Conexión Óptima</span>
            </div>
            <div className="flex items-center gap-1 text-[#386458] text-[10px] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[15px]">signal_cellular_alt</span>
              <span>Estable</span>
            </div>
          </div>
        </div>

        {/* Live Camera Preview Frame */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 aspect-video flex flex-col justify-between p-4 shadow-md">
          {isStreaming ? (
            <div className="absolute inset-0 [&_video]:w-full [&_video]:h-full [&_video]:object-cover">
              <Suspense fallback={<PlayerLoader />}>
                <ReactPlayer
                  src={DEMO_CAMERA_FEED}
                  playing
                  muted
                  loop
                  playsInline
                  width="100%"
                  height="100%"
                  style={{ position: "absolute", inset: 0 }}
                />
              </Suspense>
            </div>
          ) : (
            <img
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              alt="Stage Camera Preview"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHOEAJgRfUPkFRioj0USwiDMehNcLbIHe-BlD1n0vDsJJe-a9PAog6OSK1Lg9QjnATyKolQj5tIEtbC7sm19NApD35RsTD8UHfuMJNTBhmFF4TuM3-YPWmgKlXidbXt7LO0aFhawu51ddXxNMowWXAQxkwqzp8WV_Hcjx_pGd_UyYLBPsbT6QqM-JieiBRuRmT3Cv_Dse7a7D8v6YX8Tba0jVWqV2rK4Mg3DRo26fY9yuRV0qh3MFP"
            />
          )}
          <div className={`absolute inset-0 bg-gradient-to-t pointer-events-none ${isStreaming ? "from-slate-950/40 via-transparent to-slate-950/15" : "from-slate-950/80 via-transparent to-slate-950/30"}`}></div>
          
          {/* Top floating tags inside preview */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              {isStreaming && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>}
              <span className="material-symbols-outlined text-[#a1d0c1] text-[15px]">videocam</span>
              <span>CAM 1 · Púlpito Principal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-[#f4b6bf] text-[14px]">graphic_eq</span>
                <span>Mixer L/R -12dB</span>
              </div>
              <button
                onClick={() => toggleBackground("Feed de cámara · Púlpito", DEMO_CAMERA_FEED)}
                title={isCameraBackground ? "Quitar feed de cámara como fondo" : "Usar feed de cámara como fondo"}
                className={`backdrop-blur-md p-1.5 rounded-full shadow-sm transition-all active:scale-95 cursor-pointer ${isCameraBackground ? "bg-[#386458] text-white" : "bg-slate-900/60 text-white hover:text-[#a1d0c1]"}`}
              >
                <span className="material-symbols-outlined text-[15px]">wallpaper</span>
              </button>
            </div>
          </div>

          {/* Center Play/Preview Trigger Overlay (en vivo se oculta para no tapar el video) */}
          {!isStreaming && (
            <div className="relative z-10 flex flex-col items-center justify-center my-auto">
              <button
                onClick={handleToggleStream}
                className="bg-[#386458] hover:bg-[#2c4e45] text-white font-bold text-[11px] px-5 py-3 rounded-full flex items-center gap-2 active:scale-95 transition-all shadow-md shadow-[#386458]/35 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">play_circle</span>
                <span>Iniciar Transmisión (YT & FB)</span>
              </button>
            </div>
          )}

          {/* Bottom Audio & Quality Metrics */}
          <div className="relative z-10 flex items-center justify-between text-white text-[10px] font-medium">
            {isStreaming ? (
              <button
                onClick={handleToggleStream}
                className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-3.5 py-2 rounded-full flex items-center gap-1.5 active:scale-95 transition-all shadow-md cursor-pointer"
                style={{ borderRadius: "4px" }}
              >
                <span className="material-symbols-outlined text-[15px]">stop_circle</span>
                <span>Detener Transmisión</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#bdeddd]"></span>
                <span>Sensor Sony FX3 · Rec. 709</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span className={`material-symbols-outlined text-[15px] ${isStreaming ? "text-red-400" : "text-[#bdeddd]"}`}>timelapse</span>
              <span className="font-mono">{formatTimer(secondsElapsed)}</span>
            </div>
          </div>
        </div>

        {/* Synchronized Output Channels */}
        <div className={`rounded-2xl p-5 border space-y-4 transition-colors duration-300 ${hasBackground ? "bg-white/75 backdrop-blur-xl shadow-lg shadow-slate-950/5 border-white/60" : "bg-white shadow-sm border-slate-100"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#386458] text-[22px] font-bold">cast_connected</span>
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Canales Sincronizados</h2>
            </div>
            <span className="bg-slate-100 text-slate-500 font-bold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              {channels.filter(c => c.active).length} Destinos Activos
            </span>
          </div>

          <div className="space-y-3">
            {channels.map((chan) => (
              <div 
                key={chan.id}
                className="bg-slate-50/80 rounded-xl p-3 flex items-center justify-between border border-slate-100/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${chan.bgColor} flex items-center justify-center ${chan.iconColor} shadow-sm shrink-0`}>
                    <span className="material-symbols-outlined text-[18px]">{chan.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">{chan.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium leading-none">{chan.description}</p>
                  </div>
                </div>

                {/* Switch button */}
                <button 
                  onClick={() => toggleChannel(chan.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300 ${
                    chan.active ? "bg-[#386458]" : "bg-slate-200"
                  }`} 
                  role="switch"
                  aria-checked={chan.active}
                >
                  <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                    chan.active ? "translate-x-5" : "translate-x-0"
                  }`}></span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Grabaciones Recientes — clips reproducibles (react-player con carga diferida) */}
        <div className={`rounded-2xl p-5 border space-y-4 transition-colors duration-300 ${hasBackground ? "bg-white/75 backdrop-blur-xl shadow-lg shadow-slate-950/5 border-white/60" : "bg-white shadow-sm border-slate-100"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#386458] text-[22px] font-bold">video_library</span>
              <div>
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Grabaciones Recientes</h2>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Cultos y eventos · Toca un clip para reproducirlo</p>
              </div>
            </div>
            <span className="bg-slate-100 text-slate-500 font-bold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              {clips.length} Clips
            </span>
          </div>

          <div className="space-y-3">
            {clips.map((clip) => {
              const isActive = activeClipId === clip.id;
              const isBackgroundClip = backgroundVideo?.src === clip.src;
              return (
                <div key={clip.id} className="rounded-xl border border-slate-100 bg-slate-50/60 overflow-hidden">
                  <div className="flex items-center">
                    <button
                      onClick={() => setActiveClipId(isActive ? null : clip.id)}
                      className="flex-1 flex items-center gap-3 p-3 text-left cursor-pointer hover:bg-white transition-all min-w-0"
                    >
                      <div className="relative w-24 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                        <img src={clip.thumbnail} alt={clip.title} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/35 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-[26px] drop-shadow-sm">
                            {isActive ? "pause_circle" : "play_circle"}
                          </span>
                        </div>
                        <span className="absolute bottom-1 right-1 bg-slate-950/70 text-white text-[8px] font-bold px-1.5 py-0.5 rounded font-mono tracking-wider">
                          {clip.badge}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 leading-tight line-clamp-1">{clip.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium leading-none">{clip.meta}</p>
                      </div>
                    </button>
                    <div className="flex items-center gap-1.5 pr-3 shrink-0">
                      <button
                        onClick={() => toggleBackground(clip.title, clip.src)}
                        title={isBackgroundClip ? "Quitar como fondo" : "Usar como fondo"}
                        className={`p-2 rounded-full transition-all active:scale-95 cursor-pointer ${isBackgroundClip ? "bg-[#386458] text-white shadow-sm" : "text-slate-400 hover:bg-slate-100 hover:text-[#386458]"}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">wallpaper</span>
                      </button>
                      <span className="material-symbols-outlined text-slate-300 text-[20px]">
                        {isActive ? "expand_less" : "expand_more"}
                      </span>
                    </div>
                  </div>

                  {isActive && (
                    <div className="px-3 pb-3 animate-[fadeIn_0.2s_ease-out]">
                      <div className="relative rounded-lg overflow-hidden bg-slate-950 aspect-video [&_video]:w-full [&_video]:h-full [&_video]:object-cover">
                        <Suspense fallback={<PlayerLoader />}>
                          <ReactPlayer
                            src={clip.src}
                            playing
                            controls
                            playsInline
                            width="100%"
                            height="100%"
                            style={{ position: "absolute", inset: 0 }}
                          />
                        </Suspense>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Projection & Slides Controller */}
        <div className={`rounded-2xl p-5 border space-y-4 transition-colors duration-300 ${hasBackground ? "bg-white/75 backdrop-blur-xl shadow-lg shadow-slate-950/5 border-white/60" : "bg-white shadow-sm border-slate-100"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#386458] text-[22px] font-bold">slideshow</span>
              <div>
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">ProPresenter Sync</h2>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Servidor NDI Conectado · Latencia 8ms</p>
              </div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#386458] animate-pulse"></div>
          </div>

          {/* Current Slide Visual Card */}
          <div className="bg-slate-50/80 rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-[#386458] uppercase tracking-wider">Diapositiva Activa</span>
              <span className="bg-white px-2 py-0.5 rounded-full text-[9px] font-bold text-slate-400 border border-slate-100">
                #{slides[currentSlideIndex].index} de 32
              </span>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-slate-50">
              <p className="text-xs font-bold text-slate-800 italic leading-relaxed">
                {slides[currentSlideIndex].text}
              </p>
              <p className="text-[10px] font-bold text-[#386458] mt-1.5 uppercase tracking-wider">
                {slides[currentSlideIndex].details}
              </p>
            </div>
          </div>

          {/* Quick Projection Actions */}
          <div className="grid grid-cols-1 gap-2 pt-1">
            <button 
              onClick={handleNextSlide}
              className="w-full bg-[#386458] hover:bg-[#2c4e45] text-white py-3 rounded-full text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
              style={{ borderRadius: "4px" }}
            >
              <span className="material-symbols-outlined text-[18px]">skip_next</span>
              <span>Avanzar Diapositiva (Siguiente Lírica)</span>
            </button>
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={handleShowVerse}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-3 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                style={{ borderRadius: "4px" }}
              >
                <span className="material-symbols-outlined text-[#386458] text-[16px] font-bold">menu_book</span>
                <span className="truncate">Mostrar Versículo</span>
              </button>
              
              <button 
                onClick={handleAlert}
                className="bg-[#ffd9de] hover:bg-[#f4b6bf] text-[#663a42] py-2.5 px-3 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                style={{ borderRadius: "4px" }}
              >
                <span className="material-symbols-outlined text-[16px]">campaign</span>
                <span className="truncate">Avisos / Alerta</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Attendance & Chat Hub */}
        <div className={`rounded-2xl p-5 border space-y-4 transition-colors duration-300 ${hasBackground ? "bg-white/75 backdrop-blur-xl shadow-lg shadow-slate-950/5 border-white/60" : "bg-white shadow-sm border-slate-100"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#42617d] text-[22px] font-bold">group</span>
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Audiencia & Interacción</h2>
            </div>
            <div className="flex items-center gap-1.5 bg-[#cde5ff] text-[#294964] px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#42617d]"></span>
              <span>412 En Línea</span>
            </div>
          </div>

          {/* Active Community Message Interaction Card */}
          <div className="bg-slate-50/60 rounded-xl p-3 flex flex-col gap-2.5 border border-slate-100">
            <div className="flex items-center justify-between text-slate-400 text-[9px] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#386458]">push_pin</span>
                Mensaje Fijado en Sala
              </span>
              <span className="text-[#386458]">Activo en YT & FB</span>
            </div>

            <div className="bg-white rounded-lg p-3 flex items-start gap-2.5 shadow-sm border border-slate-50">
              <div className="w-8 h-8 rounded-full bg-[#bdeddd] flex items-center justify-center text-[#214e43] shrink-0">
                <span className="material-symbols-outlined text-[15px]">volunteer_activism</span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-800 leading-none">Comunidad de Fe - Moderador</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-normal font-medium line-clamp-2">
                  "¡Bienvenidos a casa! Nos alegra adorar juntos. Puedes presentar tus peticiones y ofrenda digital en bit.ly/iglesia-ofrenda"
                </p>
              </div>
            </div>

            <button 
              onClick={handlePinMessage}
              className="w-full bg-[#cde5ff] hover:bg-[#bddefe] text-[#294964] font-bold text-[10px] py-2.5 px-4 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all"
              style={{ borderRadius: "4px" }}
            >
              <span className="material-symbols-outlined text-[16px]">add_link</span>
              <span>Fijar Mensaje de Bienvenida</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
