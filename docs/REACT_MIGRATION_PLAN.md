# Lutem React Migration Plan

## Overview

This document outlines the planned gradual migration from vanilla HTML/CSS/JS to React components. The approach uses "islands architecture" - mounting React components into specific DOM containers within the existing static HTML, allowing incremental adoption without a full rewrite.

## Current State

- **Frontend:** Vanilla HTML/CSS/JavaScript
- **Deployment:** GitHub Pages (zero build step)
- **Why it works:** Simple, fast, no tooling required

## Migration Approach

### Strategy: Islands Architecture

```javascript
// Mount React components into existing DOM
import { createRoot } from 'react-dom/client';
import GameCard from './components/GameCard';

const container = document.getElementById('react-game-card');
const root = createRoot(container);
root.render(<GameCard game={gameData} />);
```

### Build Tooling Required

Before starting migration:
- [ ] Add Vite or similar bundler
- [ ] Configure JSX/TSX support
- [ ] Set up build pipeline for GitHub Pages
- [ ] Consider TypeScript adoption

---

## Component Migration Tiers

### Tier 1 - Start Here (High value, self-contained)

| Component | Why React? | Complexity |
|-----------|-----------|------------|
| **GameCard** | Reusable everywhere (results, history, favorites). Has hover states, expand/collapse, rating interactions. One component, many instances. | Medium |
| **Rating/Feedback Widget** | Star ratings, emoji pickers, satisfaction sliders - lots of micro-interactions. Self-contained with clear props. | Low |
| **Toast/Notification System** | Portal-based, state-driven, easy first win. | Low |

### Tier 2 - Next Phase (More complex, bigger payoff)

| Component | Why React? | Complexity |
|-----------|-----------|------------|
| **Wizard Input Groups** | Energy slider, mood toggles, time picker - each becomes a controlled component. Easier validation, state sync. | Medium |
| **Results Panel** | Renders multiple GameCards, handles loading states, filtering, "load more". Benefits from React's list rendering. | Medium |
| **Summary Bar** | Reactive to wizard state. Perfect use case for shared state (Context or Zustand). | Medium |

### Tier 3 - Full Sections (When ready for bigger changes)

| Component | Why React? | Complexity |
|-----------|-----------|------------|
| **Weekly Recap Dashboard** | Charts, stats, date pickers - React + Recharts. | High |
| **User Profile/Settings** | Forms, toggles, validation - React Hook Form. | Medium |
| **Entire Wizard** | Once inputs are React, wrap the whole thing. | High |
| **Calendar Integration View** | Complex date/time interactions, drag-drop scheduling. | High |

---

## Recommended Libraries

| Purpose | Library | Notes |
|---------|---------|-------|
| State Management | Zustand | Lightweight, works well with islands |
| Forms | React Hook Form | Validation, error handling |
| Charts | Recharts | For weekly recap/analytics |
| Animations | Framer Motion | Smooth transitions |
| UI Components | Radix UI | Headless, accessible primitives |
| Styling | Tailwind CSS | Or keep existing CSS variables |

---

## Migration Steps

### Phase 0: Setup
1. Add Vite to project
2. Configure build for mixed vanilla + React
3. Set up component folder structure
4. Create shared state store (Zustand)

### Phase 1: First Components
1. Build `<GameCard />` component
2. Build `<RatingWidget />` component
3. Build `<Toast />` notification system
4. Test mounting into existing HTML

### Phase 2: Wizard Inputs
1. Convert energy slider to `<EnergySlider />`
2. Convert mood toggles to `<MoodSelector />`
3. Convert time picker to `<TimePicker />`
4. Wire up to shared state

### Phase 3: Full Sections
1. Wrap results panel in React
2. Build analytics dashboard
3. Convert remaining pages

### Phase 4: Cleanup
1. Remove vanilla JS equivalents
2. Consolidate CSS
3. Full React SPA (optional)

---

## File Structure (Proposed)

```
frontend/
├── index.html              # Keep as shell
├── css/                    # Keep existing styles
├── js/                     # Legacy vanilla JS (gradually remove)
├── src/                    # NEW: React source
│   ├── components/
│   │   ├── GameCard/
│   │   │   ├── GameCard.tsx
│   │   │   ├── GameCard.css
│   │   │   └── index.ts
│   │   ├── RatingWidget/
│   │   ├── Wizard/
│   │   └── ...
│   ├── hooks/
│   ├── stores/             # Zustand stores
│   ├── utils/
│   └── main.tsx            # React entry point
├── vite.config.ts
└── package.json
```

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2024-12-06 | Document React migration plan | Prepare for future visual overhaul while keeping current vanilla JS functional |
| TBD | Start Tier 1 migration | When ready for build tooling complexity |

---

## Notes

- **Don't rush this.** Current vanilla setup works and deploys easily.
- **Start small.** GameCard + RatingWidget prove the pattern before bigger changes.
- **Keep options open.** Islands architecture means you can stop at any tier.
