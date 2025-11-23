# CLAUDE PROJECT INSTRUCTIONS - LUTEM MVP

## Quick Start Commands

### Starting the Application

**⚠️ CRITICAL: ALWAYS USE THE BAT FILES - THIS IS THE PRIMARY METHOD ⚠️**

Claude must ALWAYS use the startup batch files to start the application. These files are specifically configured to work reliably and should be the default approach in all situations.

```bash
# Start backend (ALWAYS use this)
D:\Lutem\ProjectFiles\lutem-mvp\start-backend.bat

# Start frontend (ALWAYS use this)
D:\Lutem\ProjectFiles\lutem-mvp\start-frontend.bat

# Or start everything at once
D:\Lutem\ProjectFiles\lutem-mvp\start-lutem.bat
```

**Why the bat files are mandatory:**
- They auto-detect JAVA_HOME
- They use the Maven wrapper (no system Maven needed)
- They handle all environment setup automatically
- They are tested and known to work reliably

**❌ DO NOT use IntelliJ startup instructions unless explicitly requested by the user**
**❌ DO NOT try to start the backend with direct Maven commands**
**❌ DO NOT suggest manual JAVA_HOME configuration**

The bat files handle everything automatically.

### Testing the Application

**IMPORTANT: Claude should ALWAYS automatically prepare for testing after making changes - no permission needed**

Automatic test preparation (Claude runs this automatically):
1. Restart backend if changes were made to backend code
2. Open frontend in browser if not already open
3. Inform user that application is ready for testing

User will then manually test:
- Enter minutes (e.g., 30)
- Select mood (relax/focus/challenge)
- Click "Get Recommendation"
- Verify: Loading spinner appears with rotating tips
- Result: Game recommendation fades in
- Test feedback: Click 1-5 rating buttons

### Project Structure

```
lutem-mvp/
├── backend/              # Spring Boot backend (Java)
│   ├── src/main/java/    # Application code
│   ├── pom.xml           # Maven configuration
│   └── target/           # Compiled code
├── frontend/             # Frontend (HTML/CSS/JS)
│   └── index.html        # Single-page app
├── docs/                 # Documentation
├── start-backend.bat     # Backend startup script
├── start-frontend.bat    # Frontend startup script
└── start-lutem.bat       # Start everything

```

### API Endpoints

- `POST /recommendations` - Get game recommendation
  - Body: `{"availableMinutes": 30, "desiredMood": "relax"}`
  - Returns: `{"game": {...}, "reason": "..."}`
  
- `POST /sessions/feedback` - Submit satisfaction score
  - Body: `{"gameId": 1, "satisfactionScore": 5}`

### Common Issues

**Backend won't start:**
- Check port 8080 is free: `netstat -ano | findstr :8080`
- Check IntelliJ console for errors
- Verify JDK 17+ is configured in IntelliJ

**Frontend can't connect:**
- Verify backend shows "Started" in console
- Check CORS is enabled (already configured)
- Open browser DevTools (F12) to see errors

**Maven not found:**
- Use IntelliJ's built-in Maven
- Or add Maven wrapper (see docs/adding-maven-wrapper.md)
- Or use startup scripts which handle this

### Development Workflow

1. **Make backend changes:**
   - Edit Java files in IntelliJ
   - Save (Ctrl+S)
   - IntelliJ auto-reloads (if Spring DevTools enabled)
   - Or restart the run configuration

2. **Make frontend changes:**
   - Edit `frontend/index.html`
   - Save (Ctrl+S)
   - Refresh browser (F5)
   - Changes are instant (no build needed)

### User Preferences
- Be critical, no sugarcoating
- Call out mistakes
- Deny overly complex solutions
- NEVER KILL ALL NODE PROCESSES

### Current QuickWins Status
✅ 1. Loading Spinner - COMPLETED
   - Smooth animation with rotating gaming tips
   - Button disabled during load
   - Fade-in transitions

⏳ 2. Input Validation - NEXT (30 min)
⏳ 3. Top 3 Alternatives - PLANNED (45 min)
