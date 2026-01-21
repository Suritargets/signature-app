
export interface LocationData {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  thread: string;
  x: string;
  youtube: string;
  linkedin: string;
  whatsapp: string;
  tiktok: string;
  telegram: string;
  pinterest: string;
}

export type IconStyle = 'filled' | 'solid' | 'transparent' | 'outline' | 'soft';

export type LayoutTheme = 'modern' | 'minimal' | 'compact' | 'professional' | 'mobile-stack' | 'mobile-left' | 'mobile-card' | 'mobile-minimal';

export interface SignatureData {
  name: string;
  showName: boolean;
  title: string;
  showTitle: boolean;
  companyName: string;
  showCompanyName: boolean;
  officePhone: string;
  showOfficePhone: boolean;
  planningPhone: string;
  email: string;
  showEmail: boolean;
  website: string;
  showWebsite: boolean;
  logoUrl: string;
  showLogo: boolean;
  photoUrl: string;
  showPhoto: boolean;
  locations: LocationData[];
  showLocations: boolean;
  kvk: string;
  btw: string;
  showBusinessDetails: boolean;
  registrationType: 'KVK' | 'KKF' | 'Chamber of Commerce';
  taxType: 'BTW' | 'TAX #';
  
  // Contact Icon Styling
  contactIconStyle: IconStyle;
  contactIconColor: string;
  contactIconSize: number;
  contactIconSet: number; 
  
  // Social Icon Styling
  socialIconStyle: IconStyle;
  socialIconColor: string;
  socialIconSize: number;

  // Typography Settings
  headerFontFamily: string;
  headerFontSize: number;
  headerFontWeight: string;
  contactFontFamily: string;
  contactFontSize: number;
  contactFontWeight: string;
  generalFontFamily: string;
  generalFontSize: number;
  generalFontWeight: string;

  showSlogan: boolean;
  layout: LayoutTheme;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  addressLabel: string;
  detailsLabel: string;
  slogan: string;
  openingHours: string;
  showOpeningHours: boolean;
  footerLineStyle: 'tricolor' | 'single';
  showFooterLine: boolean;
  signatureBgColor: string;
  signatureBgOpacity: number;
  signatureBgImageUrl: string;
  signatureBgImageOpacity: number;
  signatureBgImagePos: string;
  signatureBgImageMirrorX: boolean;
  signatureBgImageMirrorY: boolean;
  signatureBorderType: 'none' | 'solid' | 'dashed' | 'dotted';
  signatureBorderSize: number;
  signatureBorderColor: string;
  signatureAlign: 'left' | 'center' | 'right';
  showQrCode: boolean;
  signatureBorderRadius: number;
  signatureWidth: number;
  socialLinks: SocialLinks;
  showSocialLinks: boolean;
}

export const DEFAULT_SIGNATURE: SignatureData = {
  name: 'UW NAAM',
  showName: true,
  title: 'UW FUNCTIE',
  showTitle: true,
  companyName: 'SURITARGETS B.V.',
  showCompanyName: true,
  officePhone: '+31 6 1234 5678',
  showOfficePhone: true,
  planningPhone: '+31 6 8765 4321',
  email: 'info@suritargets.com',
  showEmail: true,
  website: 'www.suritargets.com',
  showWebsite: true,
  locations: [
    {
      name: 'Hoofdkantoor',
      address: 'Nijverheidsstraat 14E, 2984 AH Ridderkerk',
      phone: '',
      email: ''
    }
  ],
  showLocations: true,
  kvk: '12345678',
  btw: 'NL123456789B01',
  showBusinessDetails: true,
  registrationType: 'KVK',
  taxType: 'BTW',
  
  // Contact Icon Defaults
  contactIconStyle: 'soft',
  contactIconColor: '#c62828',
  contactIconSize: 18,
  contactIconSet: 1,
  
  // Social Icon Defaults
  socialIconStyle: 'filled',
  socialIconColor: '#002060',
  socialIconSize: 24,

  // Typography Defaults
  headerFontFamily: 'Arial, Helvetica, sans-serif',
  headerFontSize: 22,
  headerFontWeight: '900',
  contactFontFamily: 'Arial, Helvetica, sans-serif',
  contactFontSize: 13,
  contactFontWeight: 'bold',
  generalFontFamily: 'Arial, Helvetica, sans-serif',
  generalFontSize: 12,
  generalFontWeight: 'normal',

  showSlogan: true,
  layout: 'modern',
  logoUrl: 'https://placehold.co/600x160/002060/white?text=SURITARGETS', 
  showLogo: true,
  photoUrl: 'https://placehold.co/200x200/e0e0e0/888888?text=FOTO',
  showPhoto: false,
  primaryColor: '#002060', 
  secondaryColor: '#c62828', 
  accentColor: '#fbc02d', 
  addressLabel: 'LOCATIES:',
  detailsLabel: 'BEDRIJFSGEGEVENS:',
  slogan: 'Targeting Growth, Delivering Results',
  openingHours: 'Ma - Vr: 09:00 - 17:00',
  showOpeningHours: false,
  footerLineStyle: 'tricolor',
  showFooterLine: true,
  signatureBgColor: '#ffffff',
  signatureBgOpacity: 100,
  signatureBgImageUrl: '',
  signatureBgImageOpacity: 20,
  signatureBgImagePos: 'center',
  signatureBgImageMirrorX: false,
  signatureBgImageMirrorY: false,
  signatureBorderType: 'none',
  signatureBorderSize: 1,
  signatureBorderColor: '#e0e0e0',
  signatureAlign: 'left',
  showQrCode: true,
  signatureBorderRadius: 16,
  signatureWidth: 600,
  showSocialLinks: true,
  socialLinks: {
    facebook: 'https://facebook.com/suritargets',
    instagram: 'https://instagram.com/suritargets',
    thread: '',
    x: '',
    youtube: '',
    linkedin: 'https://linkedin.com/company/suritargets',
    whatsapp: 'https://wa.me/31612345678',
    tiktok: '',
    telegram: '',
    pinterest: ''
  }
};
