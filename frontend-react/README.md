# Lutem Frontend

React 19 + TypeScript + Vite + Tailwind CSS 4

## Quick Start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Production build
npm test         # Run tests (Vitest)
```

## Project Structure

```
src/
├── api/              # API client, Steam API, TanStack Query hooks
├── components/       # Reusable UI components
│   ├── calendar/     # CreateEventModal, EventCard
│   ├── feedback/     # FeedbackPrompt
│   ├── library/      # AllGamesContent, MyGamesContent, BenefitCard
│   └── wizard/       # InlineWizard, WizardSteps
├── hooks/            # Custom hooks (useGamingPreferences)
├── lib/              # Shared utilities (config.ts)
├── pages/            # Route pages (Home, Library, Calendar, Friends, etc.)
├── stores/           # Zustand stores
│   ├── authStore     # User session, JWT cookie auth
│   ├── themeStore    # Theme + dark/light mode
│   ├── wizardStore   # Recommendation wizard state
│   ├── recommendationStore  # Current recommendation + alternatives
│   ├── steamStore    # Steam library import
│   └── feedbackStore # Post-session feedback prompts
├── styles/themes/    # 4 color themes (cafe, lavender, earth, ocean)
├── test/             # Test setup + utilities
└── types/            # TypeScript type definitions
```

## Key Libraries

- **Zustand** — State management with persist middleware
- **TanStack Query v5** — Server state, caching, mutations
- **React Router v7** — Client-side routing
- **Lucide React** — Icons
- **Tailwind CSS 4** — Styling via CSS custom properties

## Theme System

4 palettes x 2 modes = 8 combinations, all driven by CSS custom properties (`--color-*`).

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `/api` | Backend API URL |
