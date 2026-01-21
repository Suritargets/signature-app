
import React from 'react';
import { SignatureData, SocialLinks, IconStyle } from '../types';

interface SignaturePreviewProps {
  data: SignatureData;
}

const SignaturePreview: React.FC<SignaturePreviewProps> = ({ data }) => {
  const brandPrimary = data.primaryColor || "#002060"; 
  const brandSecondary = data.secondaryColor || "#c62828"; 
  const brandAccent = data.accentColor || "#fbc02d"; 
  const textColor = "#2c3e50";
  const mutedText = "#546e7a"; 

  const formatPhoneLink = (phone: string) => `tel:${phone.replace(/[^0-9+]/g, '')}`;
  const websiteUrl = data.website.startsWith('http') ? data.website : `https://${data.website}`;
  
  const qrSize = 135;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(websiteUrl)}`;
  const hasQr = data.showQrCode && !!data.website;

  const fontStack = '"Helvetica Neue", Helvetica, Arial, sans-serif';
  
  // Dynamic Typography Styles
  const headerStyles: React.CSSProperties = {
    fontFamily: data.headerFontFamily || fontStack,
    fontSize: `${data.headerFontSize || 22}px`,
    fontWeight: data.headerFontWeight || '900',
    color: brandPrimary,
    lineHeight: '1.2',
    textDecoration: 'none',
    textAlign: data.signatureAlign as any
  };

  const contactTextStyles: React.CSSProperties = {
    fontFamily: data.contactFontFamily || fontStack,
    fontSize: `${data.contactFontSize || 13}px`,
    fontWeight: data.contactFontWeight || 'bold',
    color: brandPrimary,
    lineHeight: '1.4',
    textDecoration: 'none'
  };

  const generalTextStyles: React.CSSProperties = {
    fontFamily: data.generalFontFamily || fontStack,
    fontSize: `${data.generalFontSize || 12}px`,
    fontWeight: data.generalFontWeight || 'normal',
    color: textColor,
    lineHeight: '1.4',
    textDecoration: 'none'
  };

  const contactIconSets = [
    { id: 1, phone: '📱', email: '✉', hours: '🕒', web: '🌐' },
    { id: 2, phone: '📞', email: '📧', hours: '🕙', web: '💻' },
    { id: 3, phone: '✆', email: '✉', hours: '⌚', web: '⌨' },
    { id: 4, phone: '☎', email: '✉', hours: '🕔', web: '🏢' },
    { id: 5, phone: 'M', email: 'E', hours: 'H', web: 'W' },
    { id: 6, phone: 'P', email: '@', hours: 'T', web: 'W' },
    { id: 7, phone: '◆', email: '●', hours: '■', web: '▲' },
    { id: 8, phone: '•', email: '•', hours: '•', web: '•' }
  ];

  const currentIconSet = contactIconSets.find(s => s.id === (data.contactIconSet || 1)) || contactIconSets[0];

  const getIconBoxStyles = (style: IconStyle, color: string, size: number): React.CSSProperties => {
    switch(style) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          border: `1px solid ${color}`,
          color: color,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '4px'
        };
      case 'soft':
        return {
          backgroundColor: hexToRgba(color, 15),
          color: color,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '4px'
        };
      case 'transparent':
        return {
          backgroundColor: 'transparent',
          color: color,
          width: 'auto',
          height: 'auto'
        };
      default: // filled & solid
        return {
          backgroundColor: color,
          color: '#ffffff',
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '4px'
        };
    }
  };

  const IconBox = ({ type, margin = '8px' }: { type: 'phone' | 'email' | 'hours' | 'web', margin?: string }) => {
    const style = data.contactIconStyle;
    const color = style === 'filled' ? brandPrimary : data.contactIconColor;
    const size = data.contactIconSize || 18;
    const char = currentIconSet[type];
    const boxStyles = getIconBoxStyles(style, color, size);
    
    return (
      <td style={{ paddingBottom: margin, verticalAlign: 'middle' }}>
        <div style={{ 
          ...boxStyles,
          textAlign: 'center', 
          fontSize: `${Math.round(size * 0.6)}px`, 
          fontWeight: 'bold', 
          lineHeight: style === 'transparent' ? '1' : `${size}px`,
          fontFamily: fontStack,
          display: 'inline-block'
        }}>
          {char}
        </div>
      </td>
    );
  };

  const SocialIconsRow = () => {
    if (!data.showSocialLinks || !data.socialLinks) return null;
    const activeSocials = (Object.entries(data.socialLinks) as [string, string][]).filter(([_, link]) => link && link.length > 0);
    if (activeSocials.length === 0) return null;

    const align = data.signatureAlign;
    const tableMargin = align === 'center' ? '15px auto 0' : align === 'right' ? '15px 0 0 auto' : '15px auto 0 0';
    const style = data.socialIconStyle;
    const color = style === 'filled' ? brandPrimary : data.socialIconColor;
    const size = data.socialIconSize || 24;

    return (
      <table border={0} cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse', margin: tableMargin }}>
        <tr>
          {activeSocials.map(([platform, link], idx) => {
            const platformSlug = platform === 'x' ? 'x' : platform;
            const isDarkBackground = ['filled', 'solid'].includes(style);
            const iconHex = isDarkBackground ? 'ffffff' : color.replace('#', '');
            const iconUrl = `https://cdn.simpleicons.org/${platformSlug}/${iconHex}`;
            const boxStyle = getIconBoxStyles(style, color, size);

            return (
              <td key={platform} style={{ paddingRight: idx === activeSocials.length - 1 ? '0' : '6px', verticalAlign: 'middle' }}>
                <a href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ ...boxStyle, textAlign: 'center', display: 'block' }}>
                    <img src={iconUrl} alt={platform} width={Math.round(size * 0.6)} height={Math.round(size * 0.6)} style={{ display: 'inline-block', verticalAlign: 'middle', marginTop: style === 'transparent' ? '0' : `${Math.round(size * 0.2)}px` }} />
                  </div>
                </a>
              </td>
            );
          })}
        </tr>
      </table>
    );
  };

  const alignTable = (width: string) => ({
    width,
    marginLeft: data.signatureAlign === 'center' ? 'auto' : data.signatureAlign === 'right' ? 'auto' : '0',
    marginRight: data.signatureAlign === 'center' ? 'auto' : data.signatureAlign === 'left' ? 'auto' : '0',
    borderCollapse: 'collapse' as const,
    textAlign: data.signatureAlign as any
  });

  // --- LAYOUTS ---

  const ModernLayout = () => {
    const isRight = data.signatureAlign === 'right';
    const isCenter = data.signatureAlign === 'center';

    return (
      <table border={0} cellPadding={0} cellSpacing={0} style={{ ...generalTextStyles, ...alignTable('100%') }}>
        <tr>
          <td style={{ paddingBottom: '20px' }}>
             <table border={0} cellPadding={0} cellSpacing={0} style={{ margin: isCenter ? '0 auto' : isRight ? '0 0 0 auto' : '0' }}>
               <tr>
                 {data.showPhoto && data.photoUrl && !isRight && <td style={{ paddingRight: '15px' }}><img src={data.photoUrl} width="65" height="65" style={{ borderRadius: '50%', border: `2px solid ${brandAccent}` }} /></td>}
                 <td style={{ textAlign: data.signatureAlign as any }}>
                   {data.showName && <span style={{ ...headerStyles, textTransform: 'uppercase', display: 'block' }}>{data.name}</span>}
                   {data.showTitle && <span style={{ ...headerStyles, fontSize: `${(data.headerFontSize || 22) * 0.6}px`, color: brandSecondary, textTransform: 'uppercase', display: 'block' }}>{data.title}</span>}
                 </td>
                 {data.showPhoto && data.photoUrl && isRight && <td style={{ paddingLeft: '15px' }}><img src={data.photoUrl} width="65" height="65" style={{ borderRadius: '50%', border: `2px solid ${brandAccent}` }} /></td>}
               </tr>
             </table>
          </td>
        </tr>
        {data.showLogo && (
          <tr>
            <td style={{ paddingBottom: '20px', textAlign: data.signatureAlign as any }}><img src={data.logoUrl} width="220" style={{ display: 'inline-block' }} /></td>
          </tr>
        )}
        <tr>
          <td>
            <table border={0} cellPadding={0} cellSpacing={0} width="100%">
              <tr>
                {isRight && hasQr && <td width="150" style={{ paddingRight: '20px' }}><img src={qrUrl} width="120" style={{ border: '1px solid #eee', padding: '5px' }} /></td>}
                <td style={{ verticalAlign: 'top', textAlign: data.signatureAlign as any }}>
                   {data.showCompanyName && <strong style={{ ...contactTextStyles, fontSize: `${(data.contactFontSize || 13) * 1.2}px`, display: 'block', marginBottom: '10px' }}>{data.companyName}</strong>}
                   <table border={0} cellPadding={0} cellSpacing={0} style={{ margin: isCenter ? '0 auto' : isRight ? '0 0 0 auto' : '0' }}>
                     {data.showOfficePhone && <tr><IconBox type="phone" /><td style={{ paddingLeft: '10px', paddingBottom: '8px' }}><a href={formatPhoneLink(data.officePhone)} style={contactTextStyles}>{data.officePhone}</a></td></tr>}
                     {data.showEmail && <tr><IconBox type="email" /><td style={{ paddingLeft: '10px', paddingBottom: '8px' }}><a href={`mailto:${data.email}`} style={contactTextStyles}>{data.email}</a></td></tr>}
                     {data.showWebsite && <tr><IconBox type="web" /><td style={{ paddingLeft: '10px', paddingBottom: '8px' }}><a href={websiteUrl} style={contactTextStyles}>{data.website}</a></td></tr>}
                   </table>
                   <SocialIconsRow />
                </td>
                {!isRight && hasQr && <td width="150" style={{ paddingLeft: '20px' }}><img src={qrUrl} width="120" style={{ border: '1px solid #eee', padding: '5px' }} /></td>}
              </tr>
            </table>
          </td>
        </tr>
      </table>
    );
  };

  const ProfessionalLayout = () => {
    return (
      <table border={0} cellPadding={0} cellSpacing={0} style={{ ...generalTextStyles, ...alignTable('100%') }}>
        <tr>
          <td style={{ verticalAlign: 'top', width: '180px', paddingRight: '20px', borderRight: `2px solid ${brandAccent}` }}>
            {data.showLogo && <img src={data.logoUrl} width="160" style={{ display: 'block', marginBottom: '15px' }} />}
            {data.showPhoto && data.photoUrl && <img src={data.photoUrl} width="100" style={{ borderRadius: '12px', border: `1px solid ${brandPrimary}` }} />}
            {hasQr && <img src={qrUrl} width="100" style={{ marginTop: '15px', border: '1px solid #eee' }} />}
          </td>
          <td style={{ verticalAlign: 'top', paddingLeft: '25px' }}>
            {data.showName && <div style={headerStyles}>{data.name}</div>}
            {data.showTitle && <div style={{ ...headerStyles, fontSize: `${(data.headerFontSize || 22) * 0.6}px`, color: brandSecondary, marginBottom: '15px' }}>{data.title}</div>}
            {data.showCompanyName && <div style={{ ...contactTextStyles, fontSize: `${(data.contactFontSize || 13) * 1.1}px`, marginBottom: '10px' }}>{data.companyName}</div>}
            <table border={0} cellPadding={0} cellSpacing={0}>
              {data.showOfficePhone && <tr><IconBox type="phone" margin="5px" /><td style={{ paddingLeft: '8px', paddingBottom: '5px', ...contactTextStyles }}>{data.officePhone}</td></tr>}
              {data.showEmail && <tr><IconBox type="email" margin="5px" /><td style={{ paddingLeft: '8px', paddingBottom: '5px', ...contactTextStyles }}>{data.email}</td></tr>}
              {data.showWebsite && <tr><IconBox type="web" margin="5px" /><td style={{ paddingLeft: '8px', paddingBottom: '5px', ...contactTextStyles }}>{data.website}</td></tr>}
            </table>
            <SocialIconsRow />
          </td>
        </tr>
      </table>
    );
  };

  const MinimalLayout = () => {
    const divider = <span style={{ color: brandAccent, margin: '0 10px' }}>|</span>;
    return (
      <div style={{ textAlign: 'center' }}>
        {data.showName && <div style={headerStyles}>{data.name}</div>}
        {data.showTitle && <div style={{ ...headerStyles, fontSize: '12px', color: brandSecondary, textTransform: 'uppercase', letterSpacing: '2px' }}>{data.title}</div>}
        <div style={{ margin: '15px 0', height: '1px', backgroundColor: '#eee' }}></div>
        <div style={generalTextStyles}>
          {data.showOfficePhone && <span><a href={formatPhoneLink(data.officePhone)} style={contactTextStyles}>{data.officePhone}</a>{divider}</span>}
          {data.showEmail && <span><a href={`mailto:${data.email}`} style={contactTextStyles}>{data.email}</a>{divider}</span>}
          {data.showWebsite && <span><a href={websiteUrl} style={contactTextStyles}>{data.website}</a></span>}
        </div>
        <SocialIconsRow />
      </div>
    );
  };

  const MobileStackLayout = (align: 'left' | 'center' = 'center') => {
    return (
      <div style={{ textAlign: align }}>
        {data.showLogo && <img src={data.logoUrl} width="180" style={{ display: 'inline-block', marginBottom: '15px' }} />}
        {data.showName && <div style={{ ...headerStyles, fontSize: `${(data.headerFontSize || 22) * 0.9}px` }}>{data.name}</div>}
        {data.showTitle && <div style={{ ...headerStyles, fontSize: '13px', color: brandSecondary, marginBottom: '15px' }}>{data.title}</div>}
        <table border={0} cellPadding={0} cellSpacing={0} style={{ margin: align === 'center' ? '0 auto' : '0' }}>
          {data.showOfficePhone && <tr><IconBox type="phone" /><td style={{ paddingLeft: '10px', paddingBottom: '8px', textAlign: 'left' }}><a href={formatPhoneLink(data.officePhone)} style={contactTextStyles}>{data.officePhone}</a></td></tr>}
          {data.showEmail && <tr><IconBox type="email" /><td style={{ paddingLeft: '10px', paddingBottom: '8px', textAlign: 'left' }}><a href={`mailto:${data.email}`} style={contactTextStyles}>{data.email}</a></td></tr>}
          {data.showWebsite && <tr><IconBox type="web" /><td style={{ paddingLeft: '10px', paddingBottom: '8px', textAlign: 'left' }}><a href={websiteUrl} style={contactTextStyles}>{data.website}</a></td></tr>}
        </table>
        <SocialIconsRow />
        {hasQr && <img src={qrUrl} width="110" style={{ marginTop: '20px', border: '1px solid #eee', padding: '4px', borderRadius: '8px' }} />}
      </div>
    );
  };

  const renderLayout = () => {
    switch (data.layout) {
      case 'professional': return <ProfessionalLayout />;
      case 'minimal': return <MinimalLayout />;
      case 'compact': return <MinimalLayout />; 
      case 'mobile-stack': return MobileStackLayout('center');
      case 'mobile-left': return MobileStackLayout('left');
      case 'mobile-card': 
        return (
          <div style={{ border: `1px solid #eee`, padding: '25px', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,32,96,0.08)', backgroundColor: '#fff' }}>
            {MobileStackLayout('center')}
          </div>
        );
      case 'mobile-minimal':
        return (
          <div style={{ borderLeft: `4px solid ${brandAccent}`, paddingLeft: '15px' }}>
            {data.showName && <strong style={{ ...headerStyles, fontSize: '16px' }}>{data.name}</strong>}
            <br />
            {data.showTitle && <span style={{ ...headerStyles, fontSize: '11px', color: brandSecondary }}>{data.title}</span>}
            <div style={{ marginTop: '10px', ...generalTextStyles, fontSize: '11px' }}>
              {data.showOfficePhone && <div>{currentIconSet.phone} {data.officePhone}</div>}
              {data.showEmail && <div>{currentIconSet.email} {data.email}</div>}
            </div>
          </div>
        );
      default: return <ModernLayout />;
    }
  };

  const wrapperStyles: React.CSSProperties = {
    position: 'relative',
    display: 'block',
    boxSizing: 'border-box',
    backgroundColor: hexToRgba(data.signatureBgColor, data.signatureBgOpacity),
    padding: '30px',
    borderRadius: `${data.signatureBorderRadius}px`,
    border: data.signatureBorderType !== 'none' ? `${data.signatureBorderSize}px ${data.signatureBorderType} ${data.signatureBorderColor}` : 'none',
    width: `${data.signatureWidth}px`,
    overflow: 'hidden'
  };

  return (
    <div style={wrapperStyles}>
      {data.signatureBgImageUrl && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${data.signatureBgImageUrl})`, backgroundRepeat: data.signatureBgImagePos === 'repeat' ? 'repeat' : 'no-repeat', backgroundPosition: data.signatureBgImagePos, opacity: data.signatureBgImageOpacity / 100, transform: `scaleX(${data.signatureBgImageMirrorX ? -1 : 1}) scaleY(${data.signatureBgImageMirrorY ? -1 : 1})`, zIndex: 0 }} />}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {renderLayout()}
        
        {data.showLocations && !['minimal', 'mobile-minimal', 'compact'].includes(data.layout) && (
          <div style={{ marginTop: '25px', borderTop: '1px solid #eee', paddingTop: '15px', textAlign: data.signatureAlign as any }}>
            <div style={{ ...generalTextStyles, fontSize: '11px', fontWeight: '900', color: brandPrimary, marginBottom: '8px', textTransform: 'uppercase' }}>{data.addressLabel || 'LOCATIES:'}</div>
            {data.locations.map((loc, i) => <div key={i} style={{ ...generalTextStyles, fontSize: '11px', marginBottom: '3px' }}><strong>{loc.name}:</strong> {loc.address}</div>)}
          </div>
        )}

        {data.showBusinessDetails && (
          <div style={{ marginTop: '10px', opacity: 0.6, textAlign: data.signatureAlign as any, fontSize: '10px', ...generalTextStyles, color: mutedText }}>
            {data.registrationType}: {data.kvk} | {data.taxType}: {data.btw}
          </div>
        )}

        {data.showFooterLine && (
          <div style={{ marginTop: '20px', height: '5px', display: 'flex' }}>
            {data.footerLineStyle === 'tricolor' ? (
              <>
                <div style={{ flex: 1, backgroundColor: brandPrimary }}></div>
                <div style={{ flex: 1, backgroundColor: brandSecondary }}></div>
                <div style={{ flex: 1, backgroundColor: brandAccent }}></div>
              </>
            ) : <div style={{ flex: 1, backgroundColor: brandPrimary }}></div>}
          </div>
        )}
      </div>
    </div>
  );
};

const hexToRgba = (hex: string, opacity: number) => {
  let r = 0, g = 0, b = 0;
  try {
    const c = hex.replace('#', '');
    r = parseInt(c.substring(0, 2), 16);
    g = parseInt(c.substring(2, 4), 16);
    b = parseInt(c.substring(4, 6), 16);
  } catch(e) { return 'transparent'; }
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
};

export default SignaturePreview;
