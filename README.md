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
| **Mood** | What emotional outcome do you want? (Unwind, Focus, Challenge, Explore) |
| **Energy** | How much mental energy do you have right now? |
| **Time** | How long can you actually play? |
| **Interruptibility** | Might you need to stop suddenly? |
| **Social** | Solo session or playing with others? |
| **Context** | Morning coffee break? Evening wind-down? |

The result: **One confident recommendation** that fits your life right now — not 500 options that paralyze you.

---

## 🚀 Current Progress

### What's Live

**Backend** (Spring Boot + PostgreSQL on Railway)
- ✅ 57 curated games with rich metadata
- ✅ Multi-dimensional recommendation engine
- ✅ Firebase authentication (Google sign-in)
- ✅ Firestore integration for user data
- ✅ Production deployment at `lutembeta.netlify.app`

**Frontend** (React Rebuild in Progress)
- ✅ Vite + React 18 + TypeScript foundation
- ✅ Tailwind CSS with custom theme system
- ✅ 4 themes: Café, Lavender, Earth, Ocean (light/dark each)
- ✅ Home page with smart recommendation display
- ✅ Inline wizard for adjusting preferences
- ✅ React Router navigation with 6 routes
- ✅ Zustand state management
- ✅ TanStack Query for API calls

### Pages Status

| Page | Status | Description |
|------|--------|-------------|
| `/` Home | 🟢 Active | Smart recommendation + inline wizard |
| `/stats` Stats | 🟡 Placeholder | Satisfaction trends, time insights, top games |
| `/sessions` Sessions | 🟡 Placeholder | Session history, feedback collection |
| `/library` Library | 🟡 Placeholder | Your games, favorites, custom tags |
| `/settings` Settings | 🟡 Placeholder | Appearance, notifications, privacy |
| `/profile` Profile | 🟡 Placeholder | Gaming preferences, connected platforms |

---

## 🛠 Tech Stack

### Backend
- **Framework:** Spring Boot 3.x (Java)
- **Database:** PostgreSQL (Railway) / H2 (local dev)
- **Auth:** Firebase Authentication
- **User Data:** Firestore
- **Hosting:** Railway

### Frontend (React Rebuild)
- **Build:** Vite
- **Framework:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS Variables
- **State:** Zustand
- **Data Fetching:** TanStack Query
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
# From project root
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
# Runs on http://localhost:8080
```

### Frontend (React)
```bash
cd frontend-react
npm install
npm run dev
# Runs on http://localhost:5173
```

### Old Vanilla Frontend (Reference Only)
```bash
cd frontend
python -m http.server 5500
# Runs on http://localhost:5500
```

---

## 🗺 Roadmap

### Phase: React Frontend Rebuild (Current)
- [x] Project setup (Vite, TypeScript, Tailwind)
- [x] Theme system with 4 themes × 2 modes
- [x] Home page with recommendation display
- [x] Inline wizard for preference adjustment
- [x] Navigation structure (Taskbar + Footer)
- [x] Placeholder pages for future features
- [ ] Mobile bottom navigation
- [ ] Full wizard modal experience
- [ ] Mood shortcuts integration
- [ ] Theme switcher in settings

### Phase: Session Tracking & Feedback (Core Value)
*This is the key differentiator from the research paper*
- [ ] Post-session feedback flow ("How did that feel?")
- [ ] Satisfaction ratings (not just thumbs up/down)
- [ ] Session history with emotional context
- [ ] Learning algorithm refinement based on feedback

### Phase: Stats & Insights
- [ ] Weekly satisfaction summaries
- [ ] Time-of-day patterns
- [ ] Mood correlation insights
- [ ] "Your gaming personality" analysis

### Phase: Library Management
- [ ] Manual game entry
- [ ] Steam API integration (stretch)
- [ ] Custom tags and favorites
- [ ] "Haven't played in a while" suggestions

### Phase: Advanced Features (Future)
- [ ] Calendar integration for smart scheduling
- [ ] Social recommendations ("Play with friends")
- [ ] Game discovery for new titles
- [ ] Subscription service integration (Game Pass, etc.)

---

## 📁 Project Structure

```
LutemPrototype/
├── backend/                    # Spring Boot API (DO NOT TOUCH)
│   ├── src/main/java/...
│   └── src/main/resources/
├── frontend/                   # Old vanilla HTML/CSS/JS (reference)
├── frontend-react/             # NEW React frontend
│   ├── src/
│   │   ├── api/               # API client & React Query hooks
│   │   ├── components/        # Reusable UI components
│   │   │   ├── wizard/        # Wizard step components
│   │   │   └── ui/            # Base UI components
│   │   ├── pages/             # Route pages
│   │   ├── stores/            # Zustand state stores
│   │   ├── styles/            # CSS (themes, components)
│   │   └── types/             # TypeScript definitions
│   └── index.html
└── docs/
    ├── DESIGN_VISION.md       # Complete design system
    └── sessions/              # Development session notes
```

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

## 🔗 Links

- **Live Beta:** [lutembeta.netlify.app](https://lutembeta.netlify.app)
- **GitHub:** [github.com/jantobiaswilhelm/LutemPrototype](https://github.com/jantobiaswilhelm/LutemPrototype)
- **Design System:** See `docs/DESIGN_VISION.md`

---

## 📄 License

This project is part of the Strategic Business Innovation 2025 coursework at the University of Applied Sciences Northwestern Switzerland, developed as a real startup prototype.

---

*Built with ☕ and intention.*
*Last updated: December 2024*
