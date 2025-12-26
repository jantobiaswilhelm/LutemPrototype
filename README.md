# 🎮 Lutem

**Optimizing Gaming Satisfaction: An AI-Powered Discovery Interface**

> *"Headspace meets Steam"* — A calm gaming companion that prioritizes emotional wellbeing over engagement metrics.

---

## 🌟 Philosophy

Lutem isn't just another game recommendation engine. While platforms like Steam and Xbox optimize for **engagement time**, Lutem optimizes for **satisfaction**.

### What We Believe

- **Gaming should recharge you, not drain you.** The right game at the right time can be genuinely restorative.
- **Less choice, more clarity.** A curated recommendation beats an endless library scroll.
- **Satisfaction > Engagement.** We measure success by how you *feel* after playing, not how long you played.
- **Calm, not chaotic.** Gaming platforms scream at you with sales and notifications. We whisper.

### What We're Building

An emotionally intelligent companion that learns your patterns and suggests games based on:

| Dimension | What We Ask |
|-----------|-------------|
| **Source** | Where do you want to play from? (Your library, all games) |
| **Mood** | What emotional outcome do you want? (Unwind, Focus, Challenge, Explore) |
| **Energy** | How much mental energy do you have right now? |
| **Time** | How long can you actually play? |
| **Interruptibility** | Might you need to stop suddenly? |
| **Social** | Solo session or playing with others? |

The result: **One confident recommendation** that fits your life right now — not 500 options that paralyze you.

---

## 🚀 Current Progress

### What's Live & Working

**Backend** (Spring Boot + PostgreSQL on Railway)
- ✅ 57 curated games with rich metadata (mood tags, energy levels, time ranges, interruptibility)
- ✅ Multi-dimensional recommendation engine (6 input parameters)
- ✅ Firebase authentication (Google + Steam sign-in)
- ✅ Firestore integration for user data
- ✅ Steam library import API
- ✅ JWT-based auth with token validation
- ✅ Production deployment

**Frontend** (React + Vite + TypeScript)
- ✅ Complete theme system with 4 themes × 2 modes (8 total combinations)
  - Café, Lavender, Earth, Ocean themes
  - Light and dark mode for each
- ✅ **Home page** with smart recommendation display
- ✅ **Inline wizard** with 6 steps for customized recommendations
- ✅ **Mood shortcuts** for quick one-tap recommendations (Relax, Challenge, Quick Break, Explore)
- ✅ **Game cards** showing cover art (Steam CDN), time range, and match reasoning
- ✅ **Alternative games** expandable section
- ✅ **Library page** with dual tabs:
  - "My Games" - Steam library integration with search, sort, filter, grid/list views
  - "All Games" - Browse all 57 games in the database
- ✅ **Authentication system**:
  - Steam login (auto-imports library)
  - Google login (manual Steam ID connection)
  - Persistent JWT sessions
- ✅ **Profile page** with user info and Steam connection status
- ✅ **Swipeable taskbar navigation** (edge gesture support)
- ✅ **Login prompt components** for protected features
- ✅ API integration with TanStack Query
- ✅ Zustand state management (auth, theme, wizard, recommendations, steam)

### Live URLs

- **Production:** [lutembeta.netlify.app](https://lutembeta.netlify.app)
- **GitHub:** [github.com/jantobiaswilhelm/LutemPrototype](https://github.com/jantobiaswilhelm/LutemPrototype)

### Pages Status

| Page | Status | Features |
|------|--------|----------|
| `/` Home | 🟢 **Complete** | Greeting, mood shortcuts, inline wizard, game card display, alternatives |
| `/login` Login | 🟢 **Complete** | Steam + Google auth, loading states, error handling |
| `/library` Library | 🟢 **Complete** | My Games (Steam import) + All Games tabs, search/sort/filter, grid/list views |
| `/profile` Profile | 🟢 **Complete** | User info, Steam connection, placeholder sections |
| `/stats` Stats | 🟡 Placeholder | Preview cards for satisfaction trends, time insights, top games |
| `/sessions` Sessions | 🟡 Placeholder | Coming: session history, feedback collection |
| `/settings` Settings | 🟡 Placeholder | Coming: appearance, notifications, privacy |

---

## 🛠 Tech Stack

### Backend
- **Framework:** Spring Boot 3.x (Java 17)
- **Database:** PostgreSQL (Railway) / H2 (local dev)
- **Auth:** Firebase Admin SDK + JWT
- **User Data:** Firestore
- **Hosting:** Railway

### Frontend
- **Build:** Vite 5.x
- **Framework:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS Variables (custom tokens)
- **State:** Zustand (with persist middleware)
- **Data Fetching:** TanStack Query v5
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Hosting:** Netlify

---

## 🏃‍♂️ Running Locally

### Prerequisites
- Node.js 18+
- Java 17+
- Git

### Backend
```bash
cd backend

# Local development (H2 in-memory database)
set SPRING_PROFILES_ACTIVE=local
./mvnw spring-boot:run

# Or use the batch file
../start-backend-local.bat

# Runs on http://localhost:8080
```

### Frontend (React)
```bash
cd frontend-react
npm install
npm run dev
# Runs on http://localhost:5173
```

### Quick Start
```bash
# Terminal 1: Backend
start-backend-local.bat

# Terminal 2: Frontend
cd frontend-react && npm run dev
```

---

## 📁 Project Structure

```
LutemPrototype/
├── backend/                    # Spring Boot API
│   ├── src/main/java/
│   │   └── com/lutem/
│   │       ├── auth/          # JWT + Firebase auth
│   │       ├── games/         # Game CRUD + metadata
│   │       ├── recommendations/ # Recommendation engine
│   │       ├── steam/         # Steam library integration
│   │       └── user/          # User profiles
│   └── src/main/resources/
│       └── application.yml
│
├── frontend-react/             # React frontend (active)
│   ├── src/
│   │   ├── api/               # API client, hooks
│   │   │   ├── auth.ts        # Auth API calls
│   │   │   ├── client.ts      # Base API client
│   │   │   ├── hooks.ts       # TanStack Query hooks
│   │   │   └── steam.ts       # Steam API calls
│   │   │
│   │   ├── components/
│   │   │   ├── wizard/        # Wizard steps (6 steps)
│   │   │   │   ├── SourceStep.tsx
│   │   │   │   ├── TimeStep.tsx
│   │   │   │   ├── MoodStep.tsx
│   │   │   │   ├── EnergyStep.tsx
│   │   │   │   ├── InterruptionStep.tsx
│   │   │   │   ├── SocialStep.tsx
│   │   │   │   ├── ResultStep.tsx
│   │   │   │   └── InlineWizard.tsx
│   │   │   ├── GameCard.tsx   # Primary + alternative cards
│   │   │   ├── MoodShortcuts.tsx # Quick mood buttons
│   │   │   ├── Taskbar.tsx    # Swipeable side navigation
│   │   │   ├── Footer.tsx
│   │   │   ├── LoginPrompt.tsx
│   │   │   └── SteamConnect.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.tsx       # Main recommendation UI
│   │   │   ├── Login.tsx      # Steam + Google auth
│   │   │   ├── Library.tsx    # My Games + All Games
│   │   │   ├── Profile.tsx    # User profile
│   │   │   ├── Stats.tsx      # Placeholder
│   │   │   ├── Sessions.tsx   # Placeholder
│   │   │   └── Settings.tsx   # Placeholder
│   │   │
│   │   ├── stores/            # Zustand stores
│   │   │   ├── authStore.ts   # Auth state + JWT
│   │   │   ├── themeStore.ts  # Theme + dark mode
│   │   │   ├── wizardStore.ts # Wizard state
│   │   │   ├── recommendationStore.ts
│   │   │   └── steamStore.ts  # Steam library
│   │   │
│   │   ├── styles/
│   │   │   ├── themes/        # 4 color themes
│   │   │   ├── components/    # Component styles
│   │   │   ├── tokens.css     # Design tokens
│   │   │   └── base.css       # Global styles
│   │   │
│   │   └── types/             # TypeScript definitions
│   │
│   └── index.html
│
├── frontend/                   # Legacy vanilla JS (reference only)
│
└── docs/
    ├── DESIGN_VISION.md       # Complete design system
    ├── FRONTEND_FUNCTIONALITY_SPEC.md
    └── sessions/              # Development session notes
```

---

## 🗺 Roadmap

### ✅ Phase: React Frontend (Complete)
- [x] Project setup (Vite, TypeScript, Tailwind)
- [x] Theme system with 4 themes × 2 modes
- [x] Home page with recommendation display
- [x] Inline wizard with 6 steps
- [x] Mood shortcuts for quick recommendations
- [x] Game cards with Steam cover images
- [x] Alternative games section
- [x] Library page with Steam import
- [x] All Games browser
- [x] Authentication (Steam + Google)
- [x] Profile page
- [x] Swipeable taskbar navigation

### 🔜 Phase: Session Tracking & Feedback (Next Priority)
*This is the core value proposition from the research paper*
- [ ] Post-session feedback flow ("How did that feel?")
- [ ] Satisfaction ratings (1-5 scale with emotional labels)
- [ ] Session history with emotional context
- [ ] Learning algorithm refinement based on feedback
- [ ] "Start Session" button that tracks play time

### 📅 Phase: Stats & Insights
- [ ] Weekly satisfaction summaries
- [ ] Time-of-day patterns
- [ ] Mood correlation insights
- [ ] "Your gaming personality" analysis
- [ ] Satisfaction trends over time

### 🎮 Phase: Enhanced Library
- [ ] Manual game entry
- [ ] Custom tags and favorites
- [ ] "Haven't played in a while" suggestions
- [ ] Game metadata editing

### 🚀 Phase: Advanced Features (Future)
- [ ] Calendar integration for smart scheduling
- [ ] Social recommendations ("Play with friends")
- [ ] Game discovery for new titles
- [ ] Subscription service integration (Game Pass, etc.)

---

## 💡 Why This Matters

### The Problem
Modern gamers face **decision paralysis**. The average Steam library has 100+ games. Game Pass offers 400+. Every platform pushes engagement metrics: hours played, daily logins, completion rates.

But none of them ask: *"Did that actually make you feel good?"*

### The Insight
Gaming satisfaction isn't about more time played — it's about **the right game at the right moment**. A 20-minute session of the perfect game beats 3 hours of "meh, I guess I'll play this."

### The Solution
Lutem learns what makes YOU feel satisfied. Not what's popular. Not what's new. Not what's promoted. **What works for you, right now, in this moment.**

---

## 🎨 Design Principles

| Principle | What It Means |
|-----------|---------------|
| **Result-First** | Show the recommendation immediately. Hide the wizard until needed. |
| **Progressive Disclosure** | Don't overwhelm. Reveal options as they become relevant. |
| **Calm Confidence** | The app knows you. Smart defaults, easy overrides. |
| **Emotional Feedback** | "You felt relaxed" matters more than "You played 47 minutes." |
| **Breathing Room** | Generous whitespace. Let elements breathe. Nothing cramped. |
| **Soft Power** | Rounded corners, gentle shadows, muted colors. Nothing aggressive. |

---

## ☕ Support the Project

If you like what we're building, consider supporting Lutem's development!

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/lutem)

Your support helps keep the coffee flowing and the code shipping. Every contribution goes directly toward making Lutem the best gaming companion it can be.

---

## 📄 Academic Context

This project is part of the **Strategic Business Innovation 2025** coursework at the University of Applied Sciences Northwestern Switzerland (FHNW), developed as a real startup prototype with genuine commercial ambitions.

The research paper explores Lutem's positioning in the Gaming Recommendation & Discovery Ecosystem, analyzing:
- Persona-driven human driver analysis (Satisfaction as the dominant driver)
- Customer control through emotional feedback loops
- Digital ecosystem positioning strategy
- Economic assessment and business model

---

*Built with ☕ and intention.*
*Last updated: December 2025*
