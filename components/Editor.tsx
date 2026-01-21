
import React, { useRef, useState } from 'react';
import { SignatureData, LocationData, LayoutTheme, SocialLinks, IconStyle } from '../types';

interface EditorProps {
  data: SignatureData;
  onChange: (data: SignatureData) => void;
}

interface AccordionSectionProps {
  title: string;
  icon: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: string;
  id?: string;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, icon, isOpen, onToggle, children, badge }) => {
  return (
    <div className={`border border-gray-100 rounded-3xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-white shadow-xl ring-1 ring-black/5' : 'bg-gray-50/50 hover:bg-gray-50'}`}>
      <button 
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isOpen ? 'bg-[#002060] text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>
            <i className={`fas ${icon} text-sm`}></i>
          </div>
          <div>
            <span className={`text-[11px] font-black uppercase tracking-[0.15em] ${isOpen ? 'text-[#002060]' : 'text-gray-500'}`}>
              {title}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {badge && <span className="text-[9px] font-black px-2 py-0.5 bg-red-100 text-red-600 rounded-full">{badge}</span>}
          <i className={`fas fa-chevron-down text-[10px] text-gray-300 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#002060]' : ''}`}></i>
        </div>
      </button>
      
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[3000px] opacity-100 border-t border-gray-50' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const [openSection, setOpenSection] = useState<string | null>('branding');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      onChange({ ...data, [name]: (e.target as HTMLInputElement).checked });
    } else if (['contactIconSize', 'socialIconSize', 'signatureBgOpacity', 'signatureBgImageOpacity', 'signatureBorderSize', 'signatureBorderRadius', 'signatureWidth', 'contactIconSet', 'headerFontSize', 'contactFontSize', 'generalFontSize'].includes(name)) {
      onChange({ ...data, [name]: parseInt(value) || 0 });
    } else {
      onChange({ ...data, [name]: value });
    }
  };

  const handleSocialChange = (platform: keyof SocialLinks, value: string) => {
    onChange({
      ...data,
      socialLinks: {
        ...(data.socialLinks || {}),
        [platform]: value
      }
    });
  };

  const setType = (field: keyof SignatureData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'photoUrl' | 'signatureBgImageUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const setLayout = (layout: LayoutTheme) => {
    onChange({ ...data, layout });
  };

  const handleLocationChange = (index: number, field: keyof LocationData, value: string) => {
    const newLocations = [...data.locations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    onChange({ ...data, locations: newLocations });
  };

  const addLocation = () => {
    onChange({
      ...data,
      locations: [...data.locations, { name: '', address: '', phone: '', email: '' }]
    });
  };

  const removeLocation = (index: number) => {
    if (data.locations.length <= 1) return;
    const newLocations = data.locations.filter((_, i) => i !== index);
    onChange({ ...data, locations: newLocations });
  };

  const Toggle = ({ checked, onToggle, label = "SHOW", disabled = false }: { checked: boolean, onToggle: (val: boolean) => void, label?: string, disabled?: boolean }) => (
    <button
      type="button"
      onClick={() => !disabled && onToggle(!checked)}
      disabled={disabled}
      className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all group shrink-0 ${
        disabled ? 'bg-gray-100 border-gray-100 cursor-not-allowed opacity-50' : 'bg-white border-gray-100 shadow-sm hover:border-gray-200 active:scale-95'
      }`}
    >
      <div className={`w-3 h-3 rounded-sm transition-colors border ${checked && !disabled ? 'bg-[#334155] border-[#334155]' : 'bg-gray-50 border-gray-200'}`} />
      <span className={`text-[8px] font-black uppercase tracking-widest ${checked && !disabled ? 'text-[#002060]' : 'text-gray-300'}`}>{label}</span>
    </button>
  );

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#002060]/5 focus:border-[#002060] focus:bg-white outline-none transition-all duration-200 text-sm text-gray-800 font-medium";
  const labelClass = "block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1";
  const uploadBtnClass = "px-3 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-[#002060] flex items-center justify-center shrink-0 shadow-sm";
  
  const typeOptionClass = (active: boolean) => `px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
    active ? 'bg-[#002060] text-white border-[#002060] shadow-md' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
  }`;

  const hexInputClass = "w-full text-[10px] font-mono text-center border border-gray-100 rounded-lg bg-white py-1 outline-none focus:border-[#002060] focus:ring-2 focus:ring-[#002060]/5 transition-all";

  const themes = [
    { id: 'modern', name: 'Modern', icon: 'fas fa-columns' },
    { id: 'minimal', name: 'Minimal', icon: 'fas fa-align-center' },
    { id: 'compact', name: 'Compact', icon: 'fas fa-compress-alt' },
    { id: 'professional', name: 'Pro Profile', icon: 'fas fa-user-tie' },
    { id: 'mobile-stack', name: 'Mob. Stack', icon: 'fas fa-mobile-alt' },
    { id: 'mobile-left', name: 'Mob. Left', icon: 'fas fa-align-left' },
    { id: 'mobile-card', name: 'Mob. Card', icon: 'fas fa-id-card' },
    { id: 'mobile-minimal', name: 'Mob. Nano', icon: 'fas fa-minus' }
  ];

  const fonts = [
    { name: 'Arial', value: 'Arial, Helvetica, sans-serif' },
    { name: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
    { name: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
    { name: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
    { name: 'Trebuchet MS', value: '"Trebuchet MS", Helvetica, sans-serif' },
    { name: 'Times New Roman', value: '"Times New Roman", Times, serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Courier New', value: '"Courier New", Courier, monospace' },
    { name: 'Lucida Sans', value: '"Lucida Sans Unicode", "Lucida Grande", sans-serif' },
    { name: 'Impact', value: 'Impact, Charcoal, sans-serif' }
  ];

  const fontWeights = [
    { name: 'Licht', value: '300' },
    { name: 'Normaal', value: 'normal' },
    { name: 'Bold', value: 'bold' },
    { name: 'Black', value: '900' }
  ];

  const contactIconSets = [
    { id: 1, icons: ['📱', '✉', '🕒', '🌐'] },
    { id: 2, icons: ['📞', '📧', '🕙', '💻'] },
    { id: 3, icons: ['✆', '✉', '⌚', '⌨'] },
    { id: 4, icons: ['☎', '✉', '🕔', '🏢'] },
    { id: 5, icons: ['M', 'E', 'H', 'W'] },
    { id: 6, icons: ['P', '@', 'T', 'W'] },
    { id: 7, icons: ['◆', '●', '■', '▲'] },
    { id: 8, icons: ['•', '•', '•', '•'] }
  ];

  // Fix: Define socialPlatforms constant for the social media links section
  const socialPlatforms = [
    { id: 'facebook', name: 'Facebook', icon: 'fab fa-facebook-f', color: '#1877F2' },
    { id: 'instagram', name: 'Instagram', icon: 'fab fa-instagram', color: '#E4405F' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'fab fa-linkedin-in', color: '#0A66C2' },
    { id: 'whatsapp', name: 'WhatsApp', icon: 'fab fa-whatsapp', color: '#25D366' },
    { id: 'x', name: 'X', icon: 'fab fa-x-twitter', color: '#000000' },
    { id: 'youtube', name: 'YouTube', icon: 'fab fa-youtube', color: '#FF0000' },
    { id: 'thread', name: 'Threads', icon: 'fab fa-threads', color: '#000000' },
    { id: 'tiktok', name: 'TikTok', icon: 'fab fa-tiktok', color: '#000000' },
    { id: 'telegram', name: 'Telegram', icon: 'fab fa-telegram-plane', color: '#26A5E4' },
    { id: 'pinterest', name: 'Pinterest', icon: 'fab fa-pinterest-p', color: '#BD081C' }
  ];

  const activeSocialCount = data.socialLinks ? (Object.values(data.socialLinks) as string[]).filter(link => link && link.length > 0).length : 0;

  return (
    <div className="space-y-4 pb-20">
      
      <AccordionSection 
        id="branding" 
        title="Branding & Logo" 
        icon="fa-palette" 
        isOpen={openSection === 'branding'} 
        onToggle={() => toggleSection('branding')}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClass}>Logo URL of Upload</label>
              <Toggle checked={data.showLogo} onToggle={(v) => setType('showLogo', v)} />
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                name="logoUrl" 
                value={data.logoUrl.startsWith('data:') ? 'Lokaal geüpload bestand' : data.logoUrl} 
                onChange={handleChange} 
                className={inputClass} 
                placeholder="Plak hier je logo link..." 
                readOnly={data.logoUrl.startsWith('data:')}
                disabled={!data.showLogo}
              />
              <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logoUrl')} />
              <button onClick={() => logoInputRef.current?.click()} className={uploadBtnClass} title="Upload Logo" disabled={!data.showLogo}>
                <i className="fas fa-upload"></i>
              </button>
            </div>
            <div className="mt-2 flex justify-center p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 overflow-hidden min-h-[60px]">
               <img src={data.logoUrl} alt="Logo Preview" className={`max-h-16 object-contain transition-opacity ${data.showLogo ? 'opacity-100' : 'opacity-20'}`} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
             {['primaryColor', 'secondaryColor', 'accentColor'].map((key) => (
               <div key={key}>
                  <div className="h-10 w-full rounded-xl mb-1.5 border-2 border-white shadow-sm relative overflow-hidden" style={{backgroundColor: (data as any)[key]}}>
                    <input type="color" name={key} value={(data as any)[key]} onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  </div>
                  <input type="text" name={key} value={(data as any)[key]} onChange={handleChange} className={hexInputClass} placeholder="#000000" />
                  <label className="block text-[8px] font-black uppercase tracking-widest text-center text-gray-400 mt-1">{key.replace('Color', '')}</label>
               </div>
             ))}
          </div>
        </div>
      </AccordionSection>

      <AccordionSection 
        id="typography" 
        title="Typografie & Tekst" 
        icon="fa-font" 
        isOpen={openSection === 'typography'} 
        onToggle={() => toggleSection('typography')}
      >
        <div className="space-y-8">
          {/* Header Typography */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-[#002060] uppercase tracking-widest border-b border-gray-100 pb-2">Kop Tekst (Naam/Functie)</h4>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className={labelClass + " mb-1"}>Lettertype</label>
                <select name="headerFontFamily" value={data.headerFontFamily} onChange={handleChange} className={inputClass}>
                  {fonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass + " mb-1"}>Grootte ({data.headerFontSize}px)</label>
                  <input type="number" name="headerFontSize" value={data.headerFontSize} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass + " mb-1"}>Gewicht</label>
                  <select name="headerFontWeight" value={data.headerFontWeight} onChange={handleChange} className={inputClass}>
                    {fontWeights.map(w => <option key={w.value} value={w.value}>{w.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Typography */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-[#002060] uppercase tracking-widest border-b border-gray-100 pb-2">Contact Gegevens</h4>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className={labelClass + " mb-1"}>Lettertype</label>
                <select name="contactFontFamily" value={data.contactFontFamily} onChange={handleChange} className={inputClass}>
                  {fonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass + " mb-1"}>Grootte ({data.contactFontSize}px)</label>
                  <input type="number" name="contactFontSize" value={data.contactFontSize} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass + " mb-1"}>Gewicht</label>
                  <select name="contactFontWeight" value={data.contactFontWeight} onChange={handleChange} className={inputClass}>
                    {fontWeights.map(w => <option key={w.value} value={w.value}>{w.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* General Typography */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-[#002060] uppercase tracking-widest border-b border-gray-100 pb-2">Algemene Tekst</h4>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className={labelClass + " mb-1"}>Lettertype</label>
                <select name="generalFontFamily" value={data.generalFontFamily} onChange={handleChange} className={inputClass}>
                  {fonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass + " mb-1"}>Grootte ({data.generalFontSize}px)</label>
                  <input type="number" name="generalFontSize" value={data.generalFontSize} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass + " mb-1"}>Gewicht</label>
                  <select name="generalFontWeight" value={data.generalFontWeight} onChange={handleChange} className={inputClass}>
                    {fontWeights.map(w => <option key={w.value} value={w.value}>{w.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AccordionSection>

      <AccordionSection 
        id="theme" 
        title="Handtekening Thema" 
        icon="fa-layer-group" 
        isOpen={openSection === 'theme'} 
        onToggle={() => toggleSection('theme')}
      >
        <div className="grid grid-cols-2 gap-3">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setLayout(theme.id as LayoutTheme)}
              className={`relative group p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                data.layout === theme.id ? 'border-[#002060] bg-[#002060]/5 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`w-full h-10 rounded-lg flex items-center justify-center overflow-hidden ${data.layout === theme.id ? 'bg-[#002060]/10' : 'bg-gray-50'}`}>
                <i className={`${theme.icon} text-lg opacity-40`}></i>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${data.layout === theme.id ? 'text-[#002060]' : 'text-gray-400'}`}>
                {theme.name}
              </span>
            </button>
          ))}
        </div>
      </AccordionSection>

      <AccordionSection 
        id="styling" 
        title="Design & Styling" 
        icon="fa-wand-magic-sparkles" 
        isOpen={openSection === 'styling'} 
        onToggle={() => toggleSection('styling')}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
               <label className={labelClass}>Toon QR Code</label>
               {!data.website && <span className="text-[7px] text-red-400 font-bold uppercase tracking-tighter ml-1 italic">* Vereist website URL</span>}
            </div>
            <Toggle checked={data.showQrCode && !!data.website} onToggle={(v) => setType('showQrCode', v)} disabled={!data.website} />
          </div>

          <div>
            <label className={labelClass + " mb-2"}>Achtergrond Kleur & Opacity</label>
            <div className="flex gap-4 items-center">
              <div className="h-10 w-16 rounded-xl border-2 border-white shadow-sm relative overflow-hidden shrink-0" style={{backgroundColor: data.signatureBgColor}}>
                <input type="color" name="signatureBgColor" value={data.signatureBgColor} onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              </div>
              <div className="flex-1">
                <input type="range" name="signatureBgOpacity" min="0" max="100" value={data.signatureBgOpacity} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#002060]" />
                <div className="flex justify-between mt-1"><span className="text-[8px] font-bold text-gray-400">0%</span><span className="text-[8px] font-bold text-[#002060]">{data.signatureBgOpacity}%</span><span className="text-[8px] font-bold text-gray-400">100%</span></div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <label className={labelClass + " mb-3"}>Afmetingen</label>
            <div className="space-y-4">
              <div>
                <label className="text-[8px] font-bold text-gray-400 uppercase mb-1 block">
                  Breedte ({data.signatureWidth}px)
                </label>
                <input 
                  type="range" 
                  name="signatureWidth" 
                  min="300" 
                  max="1000" 
                  step="10" 
                  value={data.signatureWidth} 
                  onChange={handleChange} 
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#002060]" 
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass + " mb-2"}>Achtergrond Afbeelding (Pitch)</label>
            <div className="flex gap-2">
              <input type="text" name="signatureBgImageUrl" value={data.signatureBgImageUrl.startsWith('data:') ? 'Lokaal geüpload' : data.signatureBgImageUrl} onChange={handleChange} className={inputClass} placeholder="URL..." readOnly={data.signatureBgImageUrl.startsWith('data:')} />
              <input type="file" ref={bgInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'signatureBgImageUrl')} />
              <button onClick={() => bgInputRef.current?.click()} className={uploadBtnClass}><i className="fas fa-image"></i></button>
              {data.signatureBgImageUrl && <button onClick={() => onChange({...data, signatureBgImageUrl: ''})} className={`${uploadBtnClass} text-red-500`}><i className="fas fa-times"></i></button>}
            </div>
            {data.signatureBgImageUrl && (
              <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass + " mb-2"}>Positie</label>
                    <select name="signatureBgImagePos" value={data.signatureBgImagePos} onChange={handleChange} className={inputClass}>
                      <option value="center">Midden</option>
                      <option value="top left">Links Boven</option>
                      <option value="top right">Rechts Boven</option>
                      <option value="bottom left">Links Onder</option>
                      <option value="bottom right">Rechts Onder</option>
                      <option value="repeat">Herhalen</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2 justify-center">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase text-gray-400">Spiegel Hor.</span>
                      <Toggle checked={data.signatureBgImageMirrorX} onToggle={(v) => setType('signatureBgImageMirrorX', v)} label="SPIEGEL" />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[9px] font-black uppercase text-gray-400">Spiegel Ver.</span>
                      <Toggle checked={data.signatureBgImageMirrorY} onToggle={(v) => setType('signatureBgImageMirrorY', v)} label="SPIEGEL" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelClass + " mb-2"}>Afbeelding Opacity ({data.signatureBgImageOpacity}%)</label>
                  <input type="range" name="signatureBgImageOpacity" min="0" max="100" value={data.signatureBgImageOpacity} onChange={handleChange} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#002060]" />
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-gray-100">
            <label className={labelClass + " mb-3"}>Border Instellingen</label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-[8px] font-bold text-gray-400 uppercase mb-1 block">Type</label>
                <select name="signatureBorderType" value={data.signatureBorderType} onChange={handleChange} className={inputClass}>
                  <option value="none">Geen</option>
                  <option value="solid">Doorlopend</option>
                  <option value="dashed">Onderbroken</option>
                  <option value="dotted">Gestippeld</option>
                </select>
              </div>
              <div>
                <label className="text-[8px] font-bold text-gray-400 uppercase mb-1 block">Kleur</label>
                <div className="flex gap-2">
                  <div className="h-10 w-10 rounded-xl border border-gray-200 relative overflow-hidden shrink-0" style={{backgroundColor: data.signatureBorderColor}}>
                    <input type="color" name="signatureBorderColor" value={data.signatureBorderColor} onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  </div>
                  <input type="number" name="signatureBorderSize" value={data.signatureBorderSize} onChange={handleChange} className={inputClass} placeholder="px" min="1" max="10" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-[8px] font-bold text-gray-400 uppercase mb-1 block">Ronde Hoeken ({data.signatureBorderRadius}px)</label>
              <input type="range" name="signatureBorderRadius" min="0" max="50" value={data.signatureBorderRadius} onChange={handleChange} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#002060]" />
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass + " mb-2"}>Uitlijning</label>
                <div className="flex gap-2 bg-gray-50 p-1 rounded-xl">
                  {['left', 'center', 'right'].map((align) => (
                    <button key={align} onClick={() => setType('signatureAlign', align)} className={`flex-1 py-2 rounded-lg transition-all ${data.signatureAlign === align ? 'bg-white shadow-sm text-[#002060]' : 'text-gray-400 hover:text-gray-600'}`}>
                      <i className={`fas fa-align-${align}`}></i>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={labelClass}>Onderlijn</label>
                  <Toggle checked={data.showFooterLine} onToggle={(v) => setType('showFooterLine', v)} />
                </div>
                <div className="flex gap-2 bg-gray-50 p-1 rounded-xl">
                  <button onClick={() => setType('footerLineStyle', 'tricolor')} className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter ${data.footerLineStyle === 'tricolor' ? 'bg-white shadow-sm text-[#002060]' : 'text-gray-400'}`} disabled={!data.showFooterLine}>3 Kleur</button>
                  <button onClick={() => setType('footerLineStyle', 'single')} className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter ${data.footerLineStyle === 'single' ? 'bg-white shadow-sm text-[#002060]' : 'text-gray-400'}`} disabled={!data.showFooterLine}>1 Kleur</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AccordionSection>

      <AccordionSection 
        id="social" 
        title="Social Media Links" 
        icon="fa-share-nodes" 
        isOpen={openSection === 'social'} 
        onToggle={() => toggleSection('social')}
        badge={activeSocialCount > 0 ? activeSocialCount.toString() : undefined}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-gray-50">
            <span className={labelClass}>Toon Social Media</span>
            <Toggle checked={data.showSocialLinks} onToggle={(v) => setType('showSocialLinks', v)} />
          </div>

          <div className="space-y-5">
            {socialPlatforms.map((platform) => (
              <div key={platform.id} className="group">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 flex items-center justify-center rounded-md text-white shadow-sm" style={{ backgroundColor: platform.color }}>
                    <i className={`${platform.icon} text-[10px]`}></i>
                  </div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{platform.name}</label>
                </div>
                <input 
                  type="text" 
                  value={(data.socialLinks as any)?.[platform.id] || ''} 
                  onChange={(e) => handleSocialChange(platform.id as keyof SocialLinks, e.target.value)} 
                  className={inputClass} 
                  placeholder={`https://${platform.id === 'x' ? 'x.com' : platform.id + '.com'}/gebruikersnaam`}
                  disabled={!data.showSocialLinks}
                />
              </div>
            ))}
          </div>
        </div>
      </AccordionSection>

      <AccordionSection 
        id="personal" 
        title="Persoonlijke Gegevens" 
        icon="fa-user" 
        isOpen={openSection === 'personal'} 
        onToggle={() => toggleSection('personal')}
      >
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClass}>Naam</label>
              <Toggle checked={data.showName} onToggle={(v) => setType('showName', v)} />
            </div>
            <input type="text" name="name" value={data.name} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClass}>Functie</label>
              <Toggle checked={data.showTitle} onToggle={(v) => setType('showTitle', v)} />
            </div>
            <input type="text" name="title" value={data.title} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClass}>Profielfoto URL</label>
              <Toggle checked={data.showPhoto} onToggle={(v) => setType('showPhoto', v)} />
            </div>
            <div className="flex gap-2">
              <input type="text" name="photoUrl" value={data.photoUrl.startsWith('data:') ? 'Lokaal geüpload' : data.photoUrl} onChange={handleChange} className={inputClass} readOnly={data.photoUrl.startsWith('data:')} />
              <input type="file" ref={photoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'photoUrl')} />
              <button onClick={() => photoInputRef.current?.click()} className={uploadBtnClass}><i className="fas fa-camera"></i></button>
            </div>
          </div>
        </div>
      </AccordionSection>

      <AccordionSection 
        id="company" 
        title="Bedrijf & Openingstijden" 
        icon="fa-building" 
        isOpen={openSection === 'company'} 
        onToggle={() => toggleSection('company')}
      >
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClass}>Bedrijfsnaam</label>
              <Toggle checked={data.showCompanyName} onToggle={(v) => setType('showCompanyName', v)} />
            </div>
            <input type="text" name="companyName" value={data.companyName} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClass}>Slogan</label>
              <Toggle checked={data.showSlogan} onToggle={(v) => setType('showSlogan', v)} />
            </div>
            <input type="text" name="slogan" value={data.slogan} onChange={handleChange} className={inputClass} disabled={!data.showSlogan} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClass}>Openingstijden</label>
              <Toggle checked={data.showOpeningHours} onToggle={(v) => setType('showOpeningHours', v)} />
            </div>
            <input type="text" name="openingHours" value={data.openingHours} onChange={handleChange} className={inputClass} disabled={!data.showOpeningHours} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelClass}>Mobiel</label>
                <Toggle checked={data.showOfficePhone} onToggle={(v) => setType('showOfficePhone', v)} />
              </div>
              <input type="text" name="officePhone" value={data.officePhone} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelClass}>Website</label>
                <Toggle checked={data.showWebsite} onToggle={(v) => setType('showWebsite', v)} />
              </div>
              <input type="text" name="website" value={data.website} onChange={handleChange} className={inputClass} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClass}>E-mail</label>
              <Toggle checked={data.showEmail} onToggle={(v) => setType('showEmail', v)} />
            </div>
            <input type="email" name="email" value={data.email} onChange={handleChange} className={inputClass} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection 
        id="locations" 
        title="Locaties" 
        icon="fa-map-marker-alt" 
        isOpen={openSection === 'locations'} 
        onToggle={() => toggleSection('locations')}
        badge={data.locations.length.toString()}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-gray-50">
            <span className={labelClass}>Toon Locaties in Handtekening</span>
            <Toggle checked={data.showLocations} onToggle={(v) => setType('showLocations', v)} />
          </div>
          
          {data.locations.map((loc, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 relative group">
              <button onClick={() => removeLocation(index)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500"><i className="fas fa-trash-alt text-xs"></i></button>
              <div>
                <label className={labelClass}>Naam Locatie</label>
                <input type="text" value={loc.name} onChange={(e) => handleLocationChange(index, 'name', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Adres</label>
                <input type="text" value={loc.address} onChange={(e) => handleLocationChange(index, 'address', e.target.value)} className={inputClass} />
              </div>
            </div>
          ))}
          <button onClick={addLocation} className="w-full py-3 bg-[#002060] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#c62828] transition-colors">
            + Locatie Toevoegen
          </button>
        </div>
      </AccordionSection>

      <AccordionSection 
        id="icons" 
        title="Iconen Styling" 
        icon="fa-icons" 
        isOpen={openSection === 'icons'} 
        onToggle={() => toggleSection('icons')}
      >
        <div className="space-y-8">
          {/* Contact Icons Section */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-[#002060] uppercase tracking-[0.2em] border-b border-gray-100 pb-2">Contact Informatie</h4>
            
            <div>
              <label className={labelClass + " mb-3"}>Icoon Set Selectie (8)</label>
              <div className="grid grid-cols-4 gap-2">
                {contactIconSets.map((set) => (
                  <button
                    key={set.id}
                    onClick={() => setType('contactIconSet', set.id)}
                    className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                      data.contactIconSet === set.id ? 'border-[#002060] bg-[#002060]/5 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className="text-xs">{set.icons[0]}</div>
                    <span className="text-[7px] font-black text-gray-400 uppercase">SET {set.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={labelClass + " mb-2"}>Stijl</label>
                <select name="contactIconStyle" value={data.contactIconStyle} onChange={handleChange} className={inputClass}>
                  <option value="filled">Gevuld (Brand Primary)</option>
                  <option value="solid">Solid (Eigen kleur)</option>
                  <option value="transparent">Transparant</option>
                  <option value="outline">Omtrek (Outline)</option>
                  <option value="soft">Zachte Tint (Soft)</option>
                </select>
              </div>
              
              <div>
                <label className={labelClass + " mb-2"}>Contact Icon Kleur</label>
                <div className="flex gap-2">
                  <div className="h-10 w-16 rounded-xl border border-gray-200 relative overflow-hidden shrink-0 shadow-sm" style={{backgroundColor: data.contactIconColor}}>
                    <input type="color" name="contactIconColor" value={data.contactIconColor} onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  </div>
                  <input type="text" name="contactIconColor" value={data.contactIconColor} onChange={handleChange} className={inputClass} placeholder="#000000" />
                </div>
              </div>

              <div>
                <label className={labelClass + " mb-2"}>Grootte ({data.contactIconSize}px)</label>
                <input type="range" name="contactIconSize" min="12" max="32" value={data.contactIconSize} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#002060]" />
              </div>
            </div>
          </div>

          {/* Social Icons Section */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-[#002060] uppercase tracking-[0.2em] border-b border-gray-100 pb-2">Social Media</h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={labelClass + " mb-2"}>Stijl</label>
                <select name="socialIconStyle" value={data.socialIconStyle} onChange={handleChange} className={inputClass}>
                  <option value="filled">Gevuld (Brand Primary)</option>
                  <option value="solid">Solid (Eigen kleur)</option>
                  <option value="transparent">Transparant</option>
                  <option value="outline">Omtrek (Outline)</option>
                  <option value="soft">Zachte Tint (Soft)</option>
                </select>
              </div>
              
              <div>
                <label className={labelClass + " mb-2"}>Social Icon Kleur</label>
                <div className="flex gap-2">
                  <div className="h-10 w-16 rounded-xl border border-gray-200 relative overflow-hidden shrink-0 shadow-sm" style={{backgroundColor: data.socialIconColor}}>
                    <input type="color" name="socialIconColor" value={data.socialIconColor} onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  </div>
                  <input type="text" name="socialIconColor" value={data.socialIconColor} onChange={handleChange} className={inputClass} placeholder="#000000" />
                </div>
              </div>

              <div>
                <label className={labelClass + " mb-2"}>Grootte ({data.socialIconSize}px)</label>
                <input type="range" name="socialIconSize" min="12" max="48" value={data.socialIconSize} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#002060]" />
              </div>
            </div>
          </div>
        </div>
      </AccordionSection>

    </div>
  );
};

export default Editor;
