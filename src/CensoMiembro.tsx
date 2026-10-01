import React, { useState, useRef } from "react";

interface CensoMiembroProps {
  onBack?: () => void;
  onSuccess?: (newMember: { name: string; cell: string; status: string }) => void;
}

export default function CensoMiembroScreen({ onBack, onSuccess }: CensoMiembroProps) {
  const [avatarSrc, setAvatarSrc] = useState<string>("https://lh3.googleusercontent.com/aida-public/AB6AXuDXH3aIuaxXQNR_nfMvj8DHBsTnzRinJ942CK54Ti8ltX0hQtiN4XN1QjtKHb5RIDitkL6Wc0vFJtMjspntdCis_4uDV-_LwvuPcSRu6ghI1XnpX5Ujn0YO4-hvF3E5M1K0IwHDxIwK4NIG4Ia2bA_UN98WWHfrppHMWaxwGQf2uz7uwmznZ9ZKbNGWYwcr9F8mHoS24vKFkt1058cJaqikJckQHnQ_V4mmYc2qMWG8v2sW-rZFOQJ4");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [docId, setDocId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  
  const [spiritualStage, setSpiritualStage] = useState("Nuevo Creyente");
  const [sacramentDate, setSacramentDate] = useState("");
  const [cellGroup, setCellGroup] = useState("");
  const [isFamilyHead, setIsFamilyHead] = useState(false);
  const [familyMembers, setFamilyMembers] = useState("");

  // Dones / Ministry badges multiselect
  const [selectedDones, setSelectedDones] = useState<string[]>(["Música & Alabanza"]);

  const [toastMsg, setToastMsg] = useState<{ text: string; icon: string } | null>(null);

  const handleToggleDone = (done: string) => {
    setSelectedDones(prev =>
      prev.includes(done) ? prev.filter(d => d !== done) : [...prev, done]
    );
  };

  const handleUploadPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setAvatarSrc(evt.target.result as string);
          showToast("Fotografía fraternal actualizada.", "photo_camera");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const showToast = (text: string, icon = "check_circle") => {
    setToastMsg({ text, icon });
    setTimeout(() => {
      setToastMsg(null);
    }, 3200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    showToast("¡Registro completado e integrado con éxito al CRM ministerial!");
    
    if (onSuccess) {
      setTimeout(() => {
        onSuccess({
          name: fullName,
          cell: cellGroup || "Por asignar",
          status: spiritualStage
        });
      }, 1500);
    }
  };

  const handleSaveDraft = () => {
    showToast("Borrador ministerial guardado localmente.", "bookmark");
  };

  return (
    <div className="flex-1 pb-24 relative overflow-hidden flex flex-col justify-between animate-[fadeIn_0.25s_ease-out] font-body-md text-body-md text-[#0e1d25]">
      
      {/* Banner flotante de feedback (Toast) */}
      {toastMsg && (
        <div className="fixed bottom-6 left-5 right-5 bg-slate-900 text-white p-4 rounded-xl shadow-lg z-50 flex items-center gap-3 border-none animate-[scaleIn_0.15s_ease-out]">
          <span className="material-symbols-outlined text-emerald-400 text-[22px] font-bold">
            {toastMsg.icon}
          </span>
          <span className="text-xs font-semibold">{toastMsg.text}</span>
        </div>
      )}

      {/* Header Form Toolbar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 px-1">
        <div className="flex items-center gap-2">
          {onBack && (
            <button 
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] font-bold">arrow_back</span>
            </button>
          )}
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Formulario de Ingreso</span>
        </div>
        <button 
          onClick={onBack}
          className="text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
          <span>Descartar</span>
        </button>
      </div>

      <div className="flex flex-col w-full px-4 space-y-5">
        
        {/* Header Sereno */}
        <div className="relative w-full rounded-2xl bg-[#e0f0fb] p-5 overflow-hidden shadow-sm border border-slate-100/50">
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#bdeddd] flex items-center justify-center mb-3 text-[#386458] shadow-sm">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>church</span>
            </div>
            <h2 className="text-sm font-bold text-slate-900 mb-1 uppercase tracking-wider">Censo y Nuevo Miembro</h2>
            <p className="text-[11px] text-slate-500 max-w-xs leading-normal font-medium">Ingreso fraternal a la comunidad de fe y vida compartida</p>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-[#bddefe]/40 pointer-events-none"></div>
          <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full bg-[#bdeddd]/30 pointer-events-none"></div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Selector de Fotografía / Avatar */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shadow-inner">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Fotografía cálida y natural de retrato" 
                  src={avatarSrc}
                />
              </div>
              <button 
                type="button"
                onClick={handleUploadPhoto}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#386458] text-white flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] font-bold">photo_camera</span>
              </button>
            </div>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
            <button 
              type="button"
              onClick={handleUploadPhoto}
              className="text-[11px] font-bold uppercase tracking-wider text-[#386458] bg-[#bdeddd]/50 px-4 py-1.5 rounded-full hover:bg-[#bdeddd] transition-colors cursor-pointer"
              style={{ borderRadius: "4px" }}
            >
              Subir foto fraternal
            </button>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">Formato JPG o PNG (Max 5MB)</span>
          </div>

          {/* Sección 1: Datos Personales */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[#386458] text-[20px] font-bold">badge</span>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">1. Datos Personales</h3>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-slate-500 font-bold uppercase" htmlFor="full-name">Nombres y Apellidos *</label>
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 flex items-center gap-2 focus-within:border-[#386458] transition-all">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">person</span>
                <input 
                  id="full-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej: Mateo Alejandro Morales"
                  className="bg-transparent text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5 min-w-0">
                <label className="text-[11px] text-slate-500 font-bold uppercase" htmlFor="doc-id">RUT / DNI *</label>
                <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 flex items-center gap-1.5 focus-within:border-[#386458] transition-all">
                  <span className="material-symbols-outlined text-slate-400 text-[18px] shrink-0">featured_video</span>
                  <input 
                    id="doc-id"
                    type="text"
                    required
                    value={docId}
                    onChange={(e) => setDocId(e.target.value)}
                    placeholder="12.345.678-K"
                    className="bg-transparent text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none w-full truncate"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-1.5 min-w-0">
                <label className="text-[11px] text-slate-500 font-bold uppercase" htmlFor="birth-date">Nacimiento *</label>
                <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 flex items-center gap-1.5 focus-within:border-[#386458] transition-all">
                  <span className="material-symbols-outlined text-slate-400 text-[18px] shrink-0">cake</span>
                  <input 
                    id="birth-date"
                    type="text"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    placeholder="dd/mm/yyyy"
                    className="bg-transparent text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none w-full truncate"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-slate-500 font-bold uppercase" htmlFor="phone">Teléfono / WhatsApp *</label>
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 flex items-center gap-2 focus-within:border-[#386458] transition-all">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">phone</span>
                <span className="text-xs font-bold text-slate-500 shrink-0">+56 9</span>
                <input 
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="8765 4321"
                  className="bg-transparent text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none w-full"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-slate-500 font-bold uppercase" htmlFor="email">Correo Electrónico</label>
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 flex items-center gap-2 focus-within:border-[#386458] transition-all">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">alternate_email</span>
                <input 
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hermano.fe@comunidad.org"
                  className="bg-transparent text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none w-full"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-slate-500 font-bold uppercase" htmlFor="address">Dirección y Comuna / Sector</label>
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 flex items-center gap-2 focus-within:border-[#386458] transition-all">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">location_on</span>
                <input 
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Av. Los Olivos 1420, Sector Centro"
                  className="bg-transparent text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none w-full"
                />
              </div>
            </div>
          </div>

          {/* Sección 2: Estado Espiritual & Sacramental */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[#386458] text-[20px] font-bold">church</span>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">2. Estado Espiritual</h3>
            </div>
            
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Seleccione la etapa actual de su caminar de fe:</p>
            
            <div className="flex flex-wrap gap-2">
              {["Nuevo Creyente", "Bautizado en Aguas", "Miembro Pleno", "En Traslado"].map((stage) => (
                <button 
                  key={stage}
                  type="button"
                  onClick={() => setSpiritualStage(stage)}
                  className={`px-3.5 py-2 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                    spiritualStage === stage 
                      ? "bg-[#386458] text-white shadow-sm" 
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                  style={{ borderRadius: "4px" }}
                >
                  {stage}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-[11px] text-slate-500 font-bold uppercase" htmlFor="sacrament-date">Fecha de Conversión o Bautismo</label>
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 flex items-center gap-2 focus-within:border-[#386458] transition-all">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">calendar_today</span>
                <input 
                  id="sacrament-date"
                  type="text"
                  placeholder="mm/dd/yyyy"
                  value={sacramentDate}
                  onChange={(e) => setSacramentDate(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none w-full"
                />
              </div>
            </div>
          </div>

          {/* Sección 3: Asignación Ministerial & Célula */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[#386458] text-[20px] font-bold">groups</span>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">3. Célula & Dones</h3>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-slate-500 font-bold uppercase" htmlFor="cell-group">Célula / Grupo de Hogar</label>
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 flex items-center gap-2 focus-within:border-[#386458] transition-all">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">cottage</span>
                <select 
                  id="cell-group"
                  value={cellGroup}
                  onChange={(e) => setCellGroup(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none w-full bg-slate-50"
                >
                  <option value="">Seleccionar grupo cercano...</option>
                  <option value="monte-sión">Célula Monte Sión (Sector Norte)</option>
                  <option value="olivo-paz">Célula El Olivo (Centro)</option>
                  <option value="maranatha">Célula Maranatha (Sector Poniente)</option>
                  <option value="jovenes-gracia">Comunidad Juvenil Gracia</option>
                  <option value="por-asignar">Sin grupo aún (Solicita orientación)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-1">
              <label className="text-[11px] text-slate-500 font-bold uppercase">Dones Espirituales & Vocación de Servicio</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { text: "Música & Alabanza", icon: "music_note" },
                  { text: "Enseñanza Bíblica", icon: "menu_book" },
                  { text: "Intercesión & Oración", icon: "favorite" },
                  { text: "Hospitalidad & Bienvenida", icon: "front_hand" },
                  { text: "Logística & Soporte", icon: "settings" }
                ].map((done) => {
                  const isSelected = selectedDones.includes(done.text);
                  return (
                    <button 
                      key={done.text}
                      type="button"
                      onClick={() => handleToggleDone(done.text)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-[#bdeddd] text-[#214e43]" 
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                      style={{ borderRadius: "4px" }}
                    >
                      <span className="material-symbols-outlined text-[15px] font-bold">{done.icon}</span>
                      <span>{done.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sección 4: Vínculo Familiar */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[#386458] text-[20px] font-bold">diversity_1</span>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">4. Vínculo Familiar</h3>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center justify-between py-1">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800">Es jefe de hogar o familia</span>
                <span className="text-[10px] text-slate-400 font-medium leading-none mt-1">Agrupará a su núcleo en el censo</span>
              </div>
              <button 
                type="button"
                onClick={() => setIsFamilyHead(!isFamilyHead)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300 ${
                  isFamilyHead ? "bg-[#386458]" : "bg-slate-200"
                }`}
              >
                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                  isFamilyHead ? "translate-x-5" : "translate-x-0"
                }`}></span>
              </button>
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-[11px] text-slate-500 font-bold uppercase" htmlFor="family-members">Asociar cónyuge e hijos (Nombres y Parentesco)</label>
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 flex items-start gap-2 focus-within:border-[#386458] transition-all">
                <span className="material-symbols-outlined text-slate-400 text-[18px] mt-0.5">family_restroom</span>
                <textarea 
                  id="family-members"
                  value={familyMembers}
                  onChange={(e) => setFamilyMembers(e.target.value)}
                  placeholder="Ej: Marcela Vega (Cónyuge), Samuel Morales (Hijo, 6 años)"
                  className="bg-transparent text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none w-full resize-none"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col gap-3 pt-2">
            <button 
              type="submit"
              className="w-full bg-[#386458] hover:bg-[#2c4e45] text-white py-4 px-6 rounded-full text-xs font-bold shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{ borderRadius: "4px" }}
            >
              <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
              <span>Completar Registro e Integrar al CRM</span>
            </button>
            
            <button 
              type="button"
              onClick={handleSaveDraft}
              className="w-full bg-[#ffd9de] text-[#663a42] hover:bg-[#ffd9de]/80 py-3.5 px-6 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{ borderRadius: "4px" }}
            >
              <span className="material-symbols-outlined text-[18px]">bookmark_border</span>
              <span>Guardar como Borrador</span>
            </button>
          </div>

          {/* Nota al pie de Privacidad */}
          <div className="flex items-center gap-2 justify-center text-center px-4 pt-1 pb-4">
            <span className="material-symbols-outlined text-slate-400 text-[16px] shrink-0">verified_user</span>
            <p className="text-[10px] text-slate-400 font-bold leading-normal text-center">
              Datos resguardados con fines pastorales y de comunión bajo las directrices eclesiásticas y normativas de confidencialidad.
            </p>
          </div>

        </form>

      </div>

    </div>
  );
}
