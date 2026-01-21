# Deployment Guide - Suritargets Branding Tool v2.0

## 📋 Overzicht

Deze app is uitgebreid met een admin dashboard en user tracking functionaliteit. Het gebruikt Vercel Serverless Functions en Vercel Blob Storage voor data opslag.

## 🚀 Deployment Stappen

### 1. Vercel Project Setup

1. Push je code naar een Git repository (GitHub, GitLab, etc.)
2. Ga naar [vercel.com](https://vercel.com)
3. Klik op "New Project"
4. Importeer je repository
5. Vercel detecteert automatisch de configuratie

### 2. Environment Variabelen Configureren

In je Vercel project dashboard:

1. Ga naar **Settings** > **Environment Variables**
2. Voeg de volgende variabele toe:

```
BLOB_READ_WRITE_TOKEN
```

**Hoe krijg je deze token:**
1. Ga naar je Vercel project
2. Navigeer naar **Storage** tab
3. Maak een nieuwe Blob Store aan (of gebruik bestaande)
4. Kopieer de token
5. Plak deze als waarde voor `BLOB_READ_WRITE_TOKEN`

### 3. Deploy

1. Klik op **Deploy**
2. Vercel zal automatisch:
   - Dependencies installeren
   - Het project bouwen
   - Serverless functions deployen
   - De app live zetten

## 🔐 Admin Dashboard Toegang

**URL:** `https://jouw-domain.vercel.app/STADMIN`

**Credentials:**
- Username: `Ken`
- Code: `OG4712345`

### Admin Functies:
- ✅ Bekijk alle gebruikers en hun signatures
- ✅ Filter op bedrijf/naam/email
- ✅ Export data naar CSV
- ✅ Zie statistieken (totaal users, copies, unieke bedrijven)
- ✅ Beveiligd tegen inspect/screenshot/rechts-klik

## 📊 Hoe het Werkt

### User Tracking
Wanneer een gebruiker de app bezoekt:
1. IP adres wordt automatisch gelogd
2. Alle ingevulde signature data wordt opgeslagen
3. Copy actie wordt getracked

### Consent Systeem
- Gebruiker moet checkbox accepteren: "Ik ga akkoord dat de gegevens correct zijn"
- Kopieer button is disabled totdat consent is gegeven
- Bij copy wordt data naar API gestuurd

### Data Opslag
- Alle data wordt opgeslagen in Vercel Blob Storage als JSON
- Filename: `signature-logs.json`
- Format:
```json
[
  {
    "id": "1234567890",
    "timestamp": "2026-01-21T...",
    "ipAddress": "123.45.67.89",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "companyName": "Example Corp",
    "signatureData": { ... },
    "hasCopied": true
  }
]
```

## 🔧 Lokale Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build voor productie
npm run build

# Preview productie build
npm run preview
```

**Note:** API endpoints werken alleen op Vercel. Voor lokale testing heb je Vercel CLI nodig:

```bash
npm i -g vercel
vercel dev
```

## 📁 Project Structuur

```
signature-app/
├── api/
│   ├── track.ts          # User data logging endpoint
│   └── analytics.ts      # Admin dashboard data endpoint
├── components/
│   ├── Editor.tsx
│   ├── SignaturePreview.tsx
│   ├── AdminLogin.tsx    # Login scherm
│   └── AdminDashboard.tsx # Admin dashboard UI
├── App.tsx               # Hoofdcomponent met routing
├── types.ts
├── vercel.json          # Vercel configuratie
└── package.json
```

## 🛡️ Security Features

### Admin Dashboard:
- ✅ Right-click disabled
- ✅ Developer tools (F12, Inspect) disabled
- ✅ Screenshot detection (PrintScreen)
- ✅ Text selection disabled
- ✅ Username/password authentication

### API Endpoints:
- ✅ Hardcoded credentials check
- ✅ Only GET/POST methods allowed
- ✅ IP address logging

## ⚠️ Belangrijke Notities

1. **BLOB_READ_WRITE_TOKEN** is verplicht voor de API's om te werken
2. Admin credentials zijn hardcoded in de code - wijzig deze in productie als je andere credentials wilt
3. De app gebruikt client-side routing - alle routes redirecten naar index.html
4. Data wordt nooit verwijderd - graag periodiek opschonen als nodig

## 🐛 Troubleshooting

### API geeft 500 errors
- Check of `BLOB_READ_WRITE_TOKEN` correct is ingesteld
- Verifieer dat Blob Storage is aangemaakt in Vercel

### Admin login werkt niet
- Credentials zijn: Username=`Ken`, Code=`OG4712345`
- Check of je op `/STADMIN` bent (niet `/stadmin`)

### Data wordt niet getracked
- Verifieer dat `/api/track` bereikbaar is
- Check Vercel function logs voor errors

## 📞 Support

Voor vragen of problemen:
- Email: support@suritargets.com
- Check Vercel function logs in dashboard

---

**Suritargets Branding Tool v2.0** © 2026
