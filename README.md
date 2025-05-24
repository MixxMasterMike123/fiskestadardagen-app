# Fiskeutrustning Återvinning App

En applikation för att rapportera och hantera återvunnen fiskeutrustning från svenska vatten. Byggd med Next.js, Firebase och Tailwind CSS.

## 🎯 Funktioner

- **Användarrapporter**: Användare kan enkelt rapportera återvunnen fiskeutrustning utan att logga in
- **Bilduppladdning**: Stöd för flera bilder per rapport
- **Administratörspanel**: Säker inloggning för att granska och godkänna rapporter
- **Publikt galleri**: Visar alla godkända rapporter
- **Svensk språkstöd**: Komplett svenska språkgränssnitt
- **Responsiv design**: Fungerar på alla enheter

## 🚀 Snabbstart

### 1. Installera beroenden

```bash
npm install
```

### 2. Konfigurera Firebase

1. Gå till [Firebase Console](https://console.firebase.google.com/)
2. Skapa ett nytt projekt eller använd ett befintligt
3. Aktivera följande tjänster:
   - **Firestore Database** (i Native mode)
   - **Storage**

4. Skapa en web-app i Firebase-projektet
5. Kopiera konfigurationen och ersätt innehållet i `lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "din-api-nyckel",
  authDomain: "ditt-projekt-id.firebaseapp.com",
  projectId: "ditt-projekt-id",
  storageBucket: "ditt-projekt-id.appspot.com",
  messagingSenderId: "ditt-sender-id",
  appId: "ditt-app-id"
};
```

### 3. Konfigurera Firestore-regler

I Firebase Console, gå till Firestore Database > Rules och lägg till:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tillåt läsning av godkända inlämningar
    match /submissions/{document} {
      allow read: if resource.data.status == 'approved';
      allow write: if request.auth == null; // Tillåt anonyma inlämningar
    }
  }
}
```

### 4. Konfigurera Storage-regler

I Firebase Console, gå till Storage > Rules och lägg till:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /submissions/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth == null;
    }
  }
}
```

### 5. Starta utvecklingsservern

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare.

## 🔐 Administratörsinloggning

- **Användarnamn**: `b8shieldadmin`
- **Lösenord**: `B8shieldIsDop3_99`

Logga in på `/admin` för att komma åt administratörspanelen.

## 📁 Projektstruktur

```
├── app/                    # Next.js app router
│   ├── admin/             # Administratörssidor
│   ├── galleri/           # Publikt galleri
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Startsida
├── components/            # React-komponenter
│   ├── Header.tsx         # Sidhuvud med navigation
│   └── SubmissionForm.tsx # Formulär för rapporter
├── lib/                   # Hjälpfunktioner
│   ├── auth.ts           # Autentisering
│   ├── firebase.ts       # Firebase-konfiguration
│   └── submissions.ts    # Databasoperationer
├── types/                 # TypeScript-typer
└── public/               # Statiska filer
```

## 🎨 Design

Applikationen använder:
- **Accent color**: `#ee7e30` (orange)
- **Font**: Inter
- **CSS Framework**: Tailwind CSS
- **Icons**: Lucide React

## 🛠️ Utveckling

### Byggkommandon

```bash
# Utveckling
npm run dev

# Bygga för produktion
npm run build

# Starta produktionsserver
npm start

# Linting
npm run lint
```

### Viktiga filer att känna till

- `lib/firebase.ts` - Firebase-konfiguration (uppdatera med dina uppgifter)
- `lib/auth.ts` - Administratörsinloggning
- `types/index.ts` - TypeScript-typdefinitioner
- `tailwind.config.js` - Tailwind-konfiguration

## 🚀 Deployment

### Vercel (Rekommenderas)

1. Pusha koden till GitHub
2. Importera projektet till [Vercel](https://vercel.com)
3. Lägg till miljövariabler om behövs
4. Deploy!

### Andra plattformar

Applikationen kan deployeras på:
- Netlify
- Railway
- Digital Ocean App Platform
- AWS Amplify

## 🔧 Konfiguration

### Anpassa administratörsinloggning

Redigera `lib/auth.ts` för att ändra användarnamn/lösenord:

```typescript
const ADMIN_USERNAME = 'ditt-användarnamn'
const ADMIN_PASSWORD = 'ditt-lösenord'
```

### Anpassa färger

Redigera `tailwind.config.js` för att ändra accent-färg:

```javascript
colors: {
  accent: '#din-färg',
  'accent-dark': '#mörkare-nyans',
  'accent-light': '#ljusare-nyans',
}
```

## 📝 Databasstruktur

### Submissions Collection

```javascript
{
  id: "auto-generated",
  name: "string",
  email: "string", 
  phone: "string",
  location: "string",
  message: "string",
  images: ["url1", "url2", ...],
  status: "pending" | "approved" | "rejected",
  createdAt: Date,
  approvedAt?: Date
}
```

## 🐛 Felsökning

### Firebase-anslutning
- Kontrollera att alla Firebase-tjänster är aktiverade
- Verifiera att konfigurationen i `lib/firebase.ts` är korrekt
- Kolla att domänen är godkänd i Firebase Authentication

### Bilduppladdning
- Kontrollera Storage-regler
- Verifiera att bucket-namnet är korrekt
- Se till att bilder är i supporterade format (JPEG, PNG, WebP)

### Administratörsinloggning
- Kontrollera att användarnamn/lösenord är korrekta
- Rensa webbläsarens localStorage om det uppstår problem

## 📞 Support

För teknisk support eller frågor, kontakta utvecklingsteamet.

## 📄 Licens

Detta projekt är byggd för Fiskestädardagen och är avsett för intern användning. 