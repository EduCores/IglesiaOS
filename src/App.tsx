import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter, useLocation, useNavigate } from "react-router";
import { useTheme, useTemaColor, type TemaColor } from "./useTheme";
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
import InicioScreen from "./screens/InicioScreen";
import ComunicacionesScreen from "./screens/ComunicacionesScreen";
import FinanzasDashboardScreen from "./screens/FinanzasDashboardScreen";
import RolesScreen from "./screens/RolesScreen";
import { ROLES_INICIALES } from "./data/roles";
import type { ScreenId } from "./navigation";
import { SCREEN_PATHS, screenFromPath, ROUTER_BASENAME } from "./navigation";import { FooterVideo, NavMenuPanel, ThemeToggle, TemaColorBoton, SKY_VIDEO_SRC } from "./components/chrome";

// ==========================================================================
// COMPONENTE PRINCIPAL (MAIN WRAPPER & STATE MANAGER)
// ==========================================================================
// Shell vive DENTRO del BrowserRouter (usa useLocation/useNavigate para
// sincronizar pantalla<->URL: recargar no pierde la pantalla, el botón
// atrás funciona y los enlaces se comparten). Todo lo que antes llamaba a
// setActiveScreen sigue igual: el wrapper también navega a la ruta.
// ==========================================================================
function Shell() {
  // Detección automática de vista (acordada en PENDIENTES.md): <768px → móvil, ≥768px → escritorio.
  const [viewMode] = useState<"mobile" | "desktop">(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop"
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Pantalla sincronizada con la URL (Fase 2): la URL manda al cargar y con
  // el botón atrás/adelante; navegar por la app actualiza la URL.
  const location = useLocation();
  const navigate = useNavigate();
  const [activeScreen, setActiveScreenState] = useState<ScreenId>(
    () => screenFromPath(location.pathname) ?? "inicio"
  );
  const setActiveScreen = (s: ScreenId) => {
    setActiveScreenState(s);
    // Sin push duplicado: si la URL ya es la de s, no se navega.
    if (screenFromPath(location.pathname) !== s) navigate(SCREEN_PATHS[s]);
  };
  useEffect(() => {
    const fromUrl = screenFromPath(location.pathname);
    if (fromUrl && fromUrl !== activeScreen) setActiveScreenState(fromUrl);
    else if (!fromUrl && location.pathname !== "/") navigate("/", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
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

// Raíz exportada: el Router envuelve al Shell para que useLocation y
// useNavigate funcionen. basename sale de Vite (dev "/" / Pages "/IglesiaOS").
export default function App() {
  return (
    <BrowserRouter basename={ROUTER_BASENAME}>
      <Shell />
    </BrowserRouter>
  );
}
