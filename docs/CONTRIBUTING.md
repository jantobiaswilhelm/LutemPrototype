# Contributing to Lutem

**Development workflow, troubleshooting, and code guidelines.**

---

## Quick Start

### Prerequisites
- **Java 17+** with JAVA_HOME set
- **IntelliJ IDEA** (recommended) or VS Code
- **Git**

No system Maven required - project includes Maven wrapper.

### Starting the Application

**⚠️ ALWAYS USE STARTUP SCRIPTS (PRIMARY METHOD)**

```cmd
# Windows - Start backend
start-backend.bat

# Windows - Start frontend  
start-frontend.bat

# Windows - Start everything
start-lutem.bat
```

**Why scripts?**
- Auto-detect JAVA_HOME
- Use Maven wrapper (no system Maven needed)
- Handle all environment setup
- Tested and reliable

### Alternative: IntelliJ (secondary)

1. Open `backend/pom.xml` in IntelliJ
2. Build → Rebuild Project
3. Run `LutemMvpApplication.java`
4. Wait for: `"Started LutemMvpApplication"`
5. Open `frontend/index.html` in browser

---

## Project Layout

```
lutem-mvp/
├── backend/          # Spring Boot (Java)
├── frontend/         # HTML/CSS/JS (single file)
├── docs/             # Documentation
└── *.bat             # Startup scripts
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed structure.

---

## Development Workflow

### Making Backend Changes

1. Edit Java files in `backend/src/main/java/`
2. Save changes (Ctrl+S)
3. Backend auto-reloads if DevTools enabled
4. Or restart via startup script

### Making Frontend Changes

1. Edit `frontend/index.html`
2. Save (Ctrl+S)
3. Refresh browser (F5)
4. Changes are instant (no build)

### Testing Recommendations

1. Start backend
2. Open frontend
3. Fill form: 30 min, UNWIND mood, LOW energy
4. Click "Get Recommendation"
5. Verify: Relaxing game appears (e.g., Unpacking)
6. Test feedback: Click emoji rating

---

## Troubleshooting

### Backend won't start

**Option 1: Use startup script**
```cmd
start-backend.bat
```

**Option 2: Deep clean**
```cmd
force-clean.bat
# Then rebuild in IntelliJ: Build → Rebuild Project
```

### Port 8080 in use

```cmd
# Find process
netstat -ano | findstr :8080

# Kill it (replace PID)
taskkill /PID <PID> /F
```

### Frontend can't connect

1. Check backend console shows: `"Started LutemMvpApplication"`
2. Open DevTools (F12) → Console for errors
3. Verify URL is `http://localhost:8080`
4. Check CORS configuration in GameController

### Theme not persisting

- Check localStorage in DevTools → Application tab
- Clear browser cache and reload
- Verify JavaScript is enabled

### Results not displaying

1. DevTools (F12) → Console for errors
2. Network tab → Check API response
3. Verify `topRecommendation` in response
4. Check all games have `imageUrl`

---

## Code Style

### Java
- Use standard Spring Boot conventions
- Place enums in `model/` package
- DTOs in `dto/` package
- Controllers handle HTTP only (no business logic)
- Services contain business logic

### JavaScript
- Use `const` by default, `let` when needed
- Async/await for API calls
- Comment complex logic
- Keep state in single object

### CSS
- Use CSS custom properties for theming
- BEM-like naming for components
- Mobile-first responsive design

---

## Adding a New Game

1. Edit `GameDataLoader.java` in `config/` package
2. Add game with all required fields:

```java
createGame("Game Name",
    15, 30,  // minMinutes, maxMinutes
    List.of(EmotionalGoal.UNWIND, EmotionalGoal.ACHIEVE),
    Interruptibility.HIGH,
    EnergyLevel.LOW,
    List.of(TimeOfDay.EVENING),
    List.of(SocialPreference.SOLO),
    "Genre",
    "Description",
    "https://cdn.cloudflare.steamstatic.com/steam/apps/APPID/header.jpg",
    "https://store.steampowered.com/app/APPID/"
);
```

3. Restart backend
4. Test in frontend

---

## Documentation Structure

| File | Purpose |
|------|---------|
| `README.md` | Quick start, overview |
| `docs/ARCHITECTURE.md` | Technical deep-dive |
| `docs/API.md` | Endpoint reference |
| `docs/PSYCHOLOGY.md` | Research basis |
| `docs/CONTRIBUTING.md` | This file |
| `docs/features/*.md` | Feature-specific guides |
| `docs/development/*.md` | Dev process docs |

---

## Git Workflow

```cmd
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/my-feature
```

### Commit Message Format

```
type: short description

- feat: New feature
- fix: Bug fix
- docs: Documentation
- refactor: Code restructuring
- style: Formatting
- test: Tests
```

---

## Useful Scripts

| Script | Purpose |
|--------|---------|
| `start-backend.bat` | Start backend server |
| `start-frontend.bat` | Open frontend in browser |
| `start-lutem.bat` | Start everything |
| `force-clean.bat` | Deep clean build cache |

---

## Getting Help

1. Check existing documentation in `docs/`
2. Review `SESSION_COMPLETE_SUMMARY.md` for technical details
3. Check `docs/development/STRUCTURAL_ISSUES.md` for known issues
4. Look at recent changelog in README.md

---

*See also: [ARCHITECTURE.md](ARCHITECTURE.md) | [API.md](API.md) | [PSYCHOLOGY.md](PSYCHOLOGY.md)*
