# SongVersus: City Arena

## Overview
A React-based music battle game application where users can stake cash, battle for territory, and win rewards. Features include a city map, battle system, leaderboard, timeline, shop, and user profiles.

## Tech Stack
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Database**: Firebase Firestore
- **Styling**: TailwindCSS (via CDN)
- **Routing**: React Router DOM 7
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI Integration**: Google Generative AI (@google/genai)

## Project Structure
```
/
├── components/       # Reusable UI components
│   ├── AudioVisualizer.tsx
│   ├── CityMap.tsx
│   ├── Countdown.tsx
│   └── Layout.tsx
├── pages/           # Page components
│   ├── BattleDetail.tsx
│   ├── BattleList.tsx
│   ├── Landing.tsx
│   ├── Leaderboard.tsx
│   ├── Profile.tsx
│   ├── Shop.tsx
│   ├── Timeline.tsx
│   └── Upload.tsx
├── services/        # API services
│   ├── firebase.ts  # Firebase Firestore integration
│   └── gemini.ts    # Google AI integration
├── App.tsx          # Main app with routing
├── index.tsx        # Entry point
├── types.ts         # TypeScript types
├── index.html       # HTML template
├── vite.config.ts   # Vite configuration
└── tsconfig.json    # TypeScript configuration
```

## Development
- **Run**: `npm run dev` (port 5000)
- **Build**: `npm run build` (outputs to `dist/`)

## Environment Variables (Secrets)
- `VITE_FIREBASE_API_KEY`: Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID`: Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID`: Firebase app ID
- `GEMINI_API_KEY`: Google Generative AI API key (optional)

## Firebase Setup
1. Create a Firebase project at console.firebase.google.com
2. Enable Firestore Database
3. Configure security rules (allow read/write for development)
4. Add web app and copy config values to secrets

### Firestore Collections
- `users`: User profiles (id, username, avatarUrl, coins, reputation, rank, role, etc.)
- `battles`: Battle data (title, genre, challenger, defender, votes, status, etc.)
- `territories`: Territory control data (name, genre, control, color, battleCount)

## Deployment
Configured for static deployment. Build outputs to `dist/` directory.
