# CLAUDE PROJECT INSTRUCTIONS - LUTEM MVP

## Quick Start Commands

### Starting the Application

**EASIEST: Use the startup scripts**
```bash
# Start everything at once
D:\Lutem\ProjectFiles\lutem-mvp\start-lutem.bat

# Or start individually:
D:\Lutem\ProjectFiles\lutem-mvp\start-backend.bat
D:\Lutem\ProjectFiles\lutem-mvp\start-frontend.bat
```

**IF SCRIPTS FAIL: Use IntelliJ**
Maven is not in system PATH, so use IntelliJ to run the backend:
1. Open: `D:\Lutem\ProjectFiles\lutem-mvp\backend\pom.xml` in IntelliJ
2. Locate: `src/main/java/.../LutemMvpApplication.java`
3. Right-click → "Run 'LutemMvpApplication'"
4. Wait for: "Started LutemMvpApplication in X seconds"
5. Then open: `D:\Lutem\ProjectFiles\lutem-mvp\frontend\index.html`

### Testing the Application

After starting backend (port 8080) and opening frontend:
1. Enter minutes (e.g., 30)
2. Select mood (relax/focus/challenge)
3. Click "Get Recommendation"
4. Verify: Loading spinner appears with rotating tips
5. Result: Game recommendation fades in
6. Test feedback: Click 1-5 rating buttons

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
