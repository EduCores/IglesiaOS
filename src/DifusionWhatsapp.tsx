import React, { useState, useRef } from "react";

interface AudienceOption {
  id: string;
  label: string;
  count: number;
}

interface TemplateOption {
  id: "culto" | "oracion" | "celula" | "boletin";
  title: string;
  tag: string;
  tagColor: string;
  tagBg: string;
  iconBg: string;
  iconColor: string;
  icon: string;
  desc: string;
  text: string;
}

export default function DifusionWhatsappScreen({ onBack }: { onBack?: () => void }) {
  const [selectedAudience, setSelectedAudience] = useState<AudienceOption>({
    id: "congregacion",
    label: "Toda la Congregación",
    count: 1420
  });

  const [messageText, setMessageText] = useState(
    `¡Paz y gracia de Dios, amado(a) {Nombre}! 🌿\n\nEsperamos que estés teniendo una semana llena de Su bendición. Te recordamos con gozo que este domingo nos congregamos en familia en nuestro templo central.\n\n🕊️ Serie actual: 'Caminando en Fe y Obediencia'\n⏰ Horario especial: {Horario}\n📍 Templo Principal & Transmisión en Vivo\n\nAcompáñanos a orar juntos, adorar y compartir la mesa. Si necesitas transporte o apoyo en oración para este fin de semana, haznos saber respondiendo este mensaje.\n\n¡Te esperamos con los brazos abiertos!`
  );

  const [showMedia, setShowMedia] = useState(true);
  const [antiSpamActive, setAntiSpamActive] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const audienceOptions: AudienceOption[] = [
    { id: "congregacion", label: "Toda la Congregación", count: 1420 },
    { id: "lideres", label: "Líderes de Célula", count: 28 },
    { id: "musicos", label: "Ministerio Musical", count: 14 },
    { id: "padres", label: "Padres Escuela Dominical", count: 85 }
  ];

  const templates: TemplateOption[] = [
    {
      id: "culto",
      title: "Aviso Culto Dominical",
      tag: "Oficial",
      tagColor: "text-[#386458]",
      tagBg: "bg-[#bdeddd]/60",
      iconBg: "bg-[#bdeddd]/40",
      iconColor: "text-[#386458]",
      icon: "church",
      desc: "Invitación, tema pastoral y horario central.",
      text: `¡Paz y gracia de Dios, amado(a) {Nombre}! 🌿\n\nEsperamos que estés teniendo una semana llena de Su bendición. Te recordamos con gozo que este domingo nos congregamos en familia en nuestro templo central.\n\n🕊️ Serie actual: 'Caminando en Fe y Obediencia'\n⏰ Horario especial: {Horario}\n📍 Templo Principal & Transmisión en Vivo\n\nAcompáñanos a orar juntos, adorar y compartir la mesa. Si necesitas transporte o apoyo en oración para este fin de semana, haznos saber respondiendo este mensaje.\n\n¡Te esperamos con los brazos abiertos!`
    },
    {
      id: "oracion",
      title: "Urgencia de Oración",
      tag: "Urgente",
      tagColor: "text-[#663a42]",
      tagBg: "bg-[#ffd9de]/85",
      iconBg: "bg-[#ffd9de]/60",
      iconColor: "text-[#7f4e57]",
      icon: "favorite",
      desc: "Cadena e intercesión por hermanos en prueba.",
      text: `Amado(a) {Nombre}, la paz del Señor sea contigo. 🙏\n\nTe pedimos levantar un clamor ministerial de intercesión en este momento. Nuestra hermana Ruth ha entrado a procedimiento quirúrgico y creemos firmemente en el Dios que sana y restaura.\n\n📖 'La oración eficaz del justo puede mucho.' - Santiago 5:16\n\nTe invitamos a tomar 5 minutos ahora mismo donde estás para unirte en espíritu y fe con el equipo pastoral. ¡Dios escucha a Su pueblo!`
    },
    {
      id: "celula",
      title: "Recordatorio Célula",
      tag: "Comunidad",
      tagColor: "text-[#294964]",
      tagBg: "bg-[#cde5ff]/60",
      iconBg: "bg-[#cde5ff]/50",
      iconColor: "text-[#42617d]",
      icon: "diversity_3",
      desc: "Punto de encuentro, anfitrión y merienda.",
      text: `¡Hola {Nombre}! Bendiciones en tu semana. ✨\n\nEste jueves tenemos nuestro encuentro de Célula {Ministerio}. Será una hermosa noche de estudio bíblico, reflexión comunitaria y refrigerio.\n\n⏰ Horario: {Horario}\n🏠 Casa anfitriona: Familia Morales (Pasaje Los Olivos #44)\n\n¿Contamos contigo para la cena? Por favor confirma tu lugar respondiendo este mensajito.`
    },
    {
      id: "boletin",
      title: "Boletín Semanal",
      tag: "Semanal",
      tagColor: "text-slate-600",
      tagBg: "bg-slate-100",
      iconBg: "bg-slate-200/70",
      iconColor: "text-slate-700",
      icon: "menu_book",
      desc: "Resumen de actividades y noticias del templo.",
      text: `Boletín Semanal de Nuestra Iglesia 📖\n\nQuerido(a) {Nombre}, compartimos las noticias, agradecimientos y fechas clave para los próximos días:\n\n1. Escuela Dominical Infantil lista con nuevos materiales.\n2. Vigilia de adoración para jóvenes: Viernes 20:00 hrs.\n3. Enlace devocional diario: {Enlace_Culto}\n\nQue la presencia del Señor guíe cada paso tuyo hoy.`
    }
  ];

  const handleSelectTemplate = (tpl: TemplateOption) => {
    setMessageText(tpl.text);
    triggerToast("Plantilla cargada en el editor.");
  };

  const handleInsertToken = (token: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;

    const updatedText = currentVal.substring(0, start) + token + currentVal.substring(end);
    setMessageText(updatedText);
    triggerToast(`Token ${token} insertado.`);

    // Focus back on text area and place cursor after token
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + token.length;
    }, 50);
  };

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  const getHydratedPreview = () => {
    return messageText
      .replaceAll("{Nombre}", "Juan Pérez")
      .replaceAll("{Ministerio}", "Alabanza & Adoración")
      .replaceAll("{Horario}", "10:30 AM")
      .replaceAll("{Enlace_Culto}", "https://culto.live/domingo");
  };

  const handleConfirmSend = () => {
    setShowConfirmationModal(false);
    triggerToast(`Transmitiendo difusión a ${selectedAudience.count.toLocaleString()} teléfonos WhatsApp...`);
  };

  return (
    <div className="flex-1 pb-24 relative overflow-hidden flex flex-col justify-between animate-[fadeIn_0.25s_ease-out] font-body-md text-body-md text-[#0e1d25]">
      
      {/* Toast Notifier */}
      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#23323a] text-white px-4 py-3 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 border border-slate-700/30 animate-[scaleIn_0.15s_ease-out]">
          <span className="material-symbols-outlined text-emerald-400 text-[18px] font-bold">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}

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
        <span className="min-w-0 truncate text-xs text-slate-500">Difusión en curso</span>
      </div>

      <div className="flex flex-col w-full px-5 space-y-5">
        
        {/* Status / API Connection Card */}
        <div className="w-full bg-transparent border border-slate-100 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-2.5 h-2.5 rounded-full bg-[#386458] animate-pulse shrink-0"></div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 truncate">API Oficial WhatsApp Business</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">Meta Cloud API · +56 9 8452 9100</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#bdeddd] text-[#214e43] text-[9px] font-bold uppercase tracking-wide shrink-0">
            <span className="material-symbols-outlined text-[14px] font-bold">check_circle</span>
            Servicio Conectado
          </span>
        </div>

        {/* Audience Selector Section */}
        <section className="flex flex-col w-full">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#386458] text-[18px] font-bold">groups</span>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Seleccionar Audiencia</span>
            </div>
            <span className="text-[10px] text-[#386458] font-bold uppercase tracking-wider">{selectedAudience.count.toLocaleString()} destinatarios</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide">
            {audienceOptions.map((opt) => {
              const isSelected = selectedAudience.id === opt.id;
              return (
                <button 
                  key={opt.id}
                  onClick={() => setSelectedAudience(opt)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[10px] font-bold transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? "bg-[#386458] text-white shadow-sm" 
                      : "bg-[#e7f6ff] text-slate-600 hover:bg-[#e0f0fb]"
                  }`}
                  style={{ borderRadius: "4px" }}
                  type="button"
                >
                  {isSelected && <span className="material-symbols-outlined text-[15px] font-bold">done</span>}
                  <span>{opt.label} ({opt.count})</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Pre-approved Quick Templates */}
        <section className="flex flex-col w-full">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#42617d] text-[18px] font-bold">auto_stories</span>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Plantillas Homologadas</span>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Meta Verified</span>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            {templates.map((tpl) => (
              <button 
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl)}
                className="text-left p-4 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-slate-100 transition-colors shadow-sm flex flex-col justify-between cursor-pointer"
                type="button"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`w-7 h-7 rounded-full ${tpl.iconBg} flex items-center justify-center ${tpl.iconColor}`}>
                    <span className="material-symbols-outlined text-[16px] font-bold">{tpl.icon}</span>
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tpl.tagBg} ${tpl.tagColor}`}>
                    {tpl.tag}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-0.5 truncate leading-tight">{tpl.title}</h4>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed line-clamp-2">{tpl.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Message Editor Section */}
        <section className="flex flex-col w-full bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#386458] text-[18px] font-bold">edit_note</span>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Cuerpo del Mensaje</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#386458]"></span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">HSM Compatible</span>
            </div>
          </div>

          {/* Insertable Variable Tokens */}
          <div className="mb-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-2">Insertar variables dinámicas:</span>
            <div className="flex flex-wrap gap-1.5">
              {["{Nombre}", "{Ministerio}", "{Horario}", "{Enlace_Culto}"].map((token) => (
                <button 
                  key={token}
                  onClick={() => handleInsertToken(token)}
                  className="px-2.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[#386458] text-[10px] font-bold flex items-center gap-1 hover:bg-slate-100 cursor-pointer"
                  style={{ borderRadius: "4px" }}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[13px] font-bold">add</span>
                  <span>{token}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div className="relative w-full mb-3">
            <textarea 
              ref={textareaRef}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Escribe el mensaje pastoral aquí..."
              rows={6}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-semibold text-slate-800 outline-none focus:bg-slate-100 transition-all resize-none shadow-inner leading-relaxed"
            />
          </div>

          {/* Word Count & Billing Metrics */}
          <div className="flex items-center justify-between pt-1 text-slate-400 font-bold text-[10px] uppercase">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] font-bold">receipt_long</span>
              <span>Costo estimado: <strong className="text-slate-700">CLP $0</strong> (Plan Ministerial)</span>
            </div>
            <div className="text-right">
              {messageText.length} / 1024 caracteres
            </div>
          </div>

          {/* Media Attachment Area */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#386458] font-bold">attachment</span>
                Adjunto Multimedia Opcional
              </span>
              <span className="text-[10px] text-[#386458] font-bold uppercase" id="media-status-text">
                {showMedia ? "Flyer cargado" : "Sin adjunto"}
              </span>
            </div>

            {showMedia && (
              <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-100 p-3 rounded-lg animate-[fadeIn_0.15s_ease-out]">
                {/* Attached Thumbnail Preview */}
                <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 shadow-sm border border-white">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Sunday Service Flyer" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZfhHOzauWgARGiNzaoy49uLKFPs0ZVNnqM0Ua2LFhyRBYNzFL1Qapm9lZ6tC-ICvUMlOtprPxefPXOT-rqySwHTzFLpwW2mg-prFWGFQ7fAnflStQhGkMrOC1YRyHU6KbcV4j_1V_TCoVCbx566OWenvyswcUm-aViRAHNotUZ9Wa0RgMn9WKY36FcxpxxndbUBjYB5ttuEA5SSGLD_k9-__PK79PuS4qT85vZrBd22aDvsVWXc7Y"
                  />
                  <button 
                    onClick={() => {
                      setShowMedia(false);
                      triggerToast("Multimedia removida.");
                    }}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-[#7f4e57] hover:bg-[#663a42] text-white rounded-full flex items-center justify-center cursor-pointer shadow-md"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[10px] font-bold">close</span>
                  </button>
                </div>
                
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-800 truncate">Flyer_Culto_Paz_Domingo.jpg</span>
                  <span className="text-[10px] text-slate-400 font-semibold leading-none mt-1">1.4 MB · Formato horizontal (16:9)</span>
                  <div className="flex items-center gap-2 mt-2 font-bold text-[9px] uppercase tracking-wider">
                    <button 
                      onClick={() => triggerToast("Explorador de archivos disponible próximamente.")}
                      className="text-[#386458] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px] font-bold">refresh</span> 
                      <span>Cambiar</span>
                    </button>
                    <span className="text-slate-300">·</span>
                    <button 
                      onClick={() => triggerToast("Audio del pastor disponible próximamente.")}
                      className="text-slate-500 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px] font-bold">mic</span> 
                      <span>Audio Pastor</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Live WhatsApp Smartphone Simulation */}
        <section className="flex flex-col w-full">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#386458] text-[18px] font-bold">smartphone</span>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Vista Previa en Vivo</span>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Receptor: Juan Pérez</span>
          </div>

          {/* Phone Shell Visual Wrapper */}
          <div className="w-full rounded-2xl bg-slate-100 p-3 shadow-md border border-slate-200">
            {/* WhatsApp Header simulation */}
            <div className="w-full bg-[#386458] text-white rounded-t-xl px-3 py-2.5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0 border border-white/10">
                  <span className="material-symbols-outlined text-[16px] text-white font-bold">church</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1 leading-none">
                    <span className="text-xs font-bold truncate">Comunidad de Fe</span>
                    <span className="material-symbols-outlined text-[13px] text-[#bdeddd] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                  <span className="text-[8px] text-white/70 font-semibold uppercase tracking-wider mt-0.5">Cuenta Oficial de Empresa</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white/80 shrink-0">
                <span className="material-symbols-outlined text-[18px] font-bold">videocam</span>
                <span className="material-symbols-outlined text-[18px] font-bold">call</span>
              </div>
            </div>

            {/* Chat Canvas */}
            <div className="w-full bg-[#f4faff] p-3 rounded-b-xl flex flex-col gap-2 border border-t-0 border-slate-100">
              <div className="text-center my-1">
                <span className="px-2.5 py-0.5 rounded-full bg-white text-slate-400 text-[9px] font-bold uppercase shadow-xs">HOY</span>
              </div>

              {/* WhatsApp Soft Green Message Bubble */}
              <div className="self-start max-w-[92%] bg-white rounded-2xl rounded-tl-none p-2.5 shadow-sm flex flex-col gap-2 border border-slate-100 animate-[fadeIn_0.2s_ease-out]">
                
                {/* Media attached inside preview bubble */}
                {showMedia && (
                  <div className="w-full rounded-xl overflow-hidden aspect-video relative border border-slate-100">
                    <img 
                      className="w-full h-full object-cover" 
                      alt="Sunday Service Announcement" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiudhgcu5KTeu2V3c3642fCuenDadQvsu_5gq46iWEBkED7WEkl9AUrn0YOYWIaO9DdOliHWdStduKRjKKirZ7smcV01c3TvGk9z0UKuPj7uFu_2TSVBfJb1RrUrpDkoWmDDZd0XeE01cKKdLcU2-R8aXsFJw0LGRHS1AVzrZz8t0TDkFkhrLUurgFF5dFOsOfyc4Mw8lLaHByGC3bgiEHTvf5jxLKtSky1d8P2W0mdxbhvNK8taxv"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-white text-[10px] font-bold uppercase tracking-wide">Culto Dominical Presencial & Online</span>
                    </div>
                  </div>
                )}

                {/* Preview Text Body with hydrated variables */}
                <p className="text-xs font-semibold text-slate-800 whitespace-pre-line leading-relaxed">
                  {getHydratedPreview()}
                </p>

                {/* Timestamp & Status Checkmarks */}
                <div className="flex items-center justify-end gap-1 self-end text-slate-400 text-[9px] font-bold uppercase mt-0.5">
                  <span>11:42</span>
                  <span className="material-symbols-outlined text-[13px] text-[#386458] font-bold">done_all</span>
                </div>

                {/* Interactive Template Buttons */}
                <div className="flex flex-col gap-1.5 pt-1.5 border-t border-slate-50">
                  <button 
                    onClick={() => triggerToast("Asistencia confirmada.")}
                    className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-[#386458] text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px] font-bold">how_to_reg</span>
                    <span>Confirmar Asistencia</span>
                  </button>
                  <button 
                    onClick={() => triggerToast("Reenviado a contactos personales.")}
                    className="w-full py-1.5 px-3 rounded-lg bg-slate-50/50 hover:bg-slate-100 text-slate-500 text-[9px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px] font-bold">share</span>
                    <span>Reenviar a un Familiar</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1 text-slate-400 text-[9px] font-bold uppercase mt-1">
                <span className="material-symbols-outlined text-[12px] text-[#386458] font-bold">lock</span>
                <span>Cifrado de extremo a extremo por WhatsApp</span>
              </div>
            </div>
          </div>
        </section>

        {/* Scheduling Options & Anti-spam safeguard */}
        <section className="flex flex-col w-full bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#386458] text-[20px] font-bold shrink-0">schedule</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 leading-tight">Envío Escalonado Anti-Spam</span>
                <span className="text-[10px] text-slate-400 font-semibold leading-normal mt-0.5">Lotes de 50 mensajes/minuto con pausas dinámicas</span>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setAntiSpamActive(!antiSpamActive)}
              role="switch"
              aria-checked={antiSpamActive}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300 ${
                antiSpamActive ? "bg-[#386458]" : "bg-slate-200"
              }`}
            >
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                antiSpamActive ? "translate-x-5" : "translate-x-0"
              }`}></span>
            </button>
          </div>
        </section>

        {/* Primary Floating Action Controls */}
        <div className="sticky bottom-4 z-20 flex flex-col gap-2 w-full pt-2 bg-[#f4faff]/80 backdrop-blur-md pb-4 rounded-xl px-1">
          {/* Main Launch Button */}
          <button 
            onClick={() => setShowConfirmationModal(true)}
            className="w-full py-4 px-6 rounded-full bg-[#386458] hover:bg-[#2c4e45] text-white text-xs font-bold shadow-md hover:shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            style={{ borderRadius: "4px" }}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">send</span>
            <span>Enviar a {selectedAudience.label}</span>
          </button>
          
          {/* Secondary Ghost Action */}
          <div className="flex items-center justify-center gap-4 py-1 text-[10px] font-bold uppercase tracking-wider text-[#386458]">
            <button 
              onClick={() => triggerToast("Programación lista para el domingo a las 08:30 AM.")}
              className="hover:underline flex items-center gap-1 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] font-bold">calendar_month</span>
              <span>Programar para otra fecha</span>
            </button>
            <span className="text-slate-300">•</span>
            <button 
              onClick={() => triggerToast("Mensaje de prueba enviado a tu WhatsApp personal.")}
              className="text-[#42617d] hover:underline flex items-center gap-1 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] font-bold">send_to_mobile</span>
              <span>Probar en mi WhatsApp</span>
            </button>
          </div>
        </div>

      </div>

      {/* Confirmation Modal Overlay */}
      {showConfirmationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center border border-slate-100 animate-[scaleIn_0.2s_ease-out]">
            <div className="w-14 h-14 rounded-full bg-[#bdeddd] text-[#214e43] flex items-center justify-center mb-4 border border-white shadow-sm">
              <span className="material-symbols-outlined text-[32px] font-bold">mark_chat_read</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-2">¿Confirmar Difusión?</h3>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-6">
              Estás a punto de enviar este comunicado oficial a <strong className="text-slate-700">{selectedAudience.count.toLocaleString()} contactos</strong> aprobados de <strong>{selectedAudience.label}</strong>.
            </p>
            <div className="w-full flex flex-col gap-2">
              <button 
                onClick={handleConfirmSend}
                className="w-full py-3.5 px-4 rounded-full bg-[#386458] hover:bg-[#2c4e45] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                style={{ borderRadius: "4px" }}
                type="button"
              >
                Sí, Iniciar Envío Seguro
              </button>
              <button 
                onClick={() => setShowConfirmationModal(false)}
                className="w-full py-3 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-bold transition-all cursor-pointer"
                style={{ borderRadius: "4px" }}
                type="button"
              >
                Revisar Redacción
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
