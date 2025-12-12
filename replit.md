# SongVersus: City Arena

## Overview
A React-based music battle game application where users can stake cash, battle for territory, and win rewards. Features include a city map, battle system, leaderboard, timeline, shop, and user profiles.

## Tech Stack
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 6
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

## Environment Variables
- `GEMINI_API_KEY`: Google Generative AI API key (optional, for AI features)

## Deployment
Configured for static deployment. Build outputs to `dist/` directory.
