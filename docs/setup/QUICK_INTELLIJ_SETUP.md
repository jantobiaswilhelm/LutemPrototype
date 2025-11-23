# ⚡ Quick Setup: One-Click Lutem Startup in IntelliJ

## 🎯 Goal
Click **Run** button → Frontend opens + Backend starts

## ⏱️ Setup Time: 3 minutes

---

## Step 1: Open Run Configurations

**In IntelliJ:**
1. Click dropdown next to **Run** button (top right, green play icon)
2. Select **"Edit Configurations..."**

OR:
- Menu: `Run` → `Edit Configurations...`
- Shortcut: `Alt+Shift+F10` → `0` → `Enter`

---

## Step 2: Find Your Spring Boot Config

Look for: **`LutemMvpApplication`**

**If you DON'T see it:**
1. Close the Run Configurations window
2. Open: `src/main/java/.../LutemMvpApplication.java`
3. Right-click on the file
4. Select: **"Modify Run Configuration..."**
5. Click **OK** (creates the config)
6. Go back to Step 1

---

## Step 3: Add Before Launch Task

1. **In the Run Configuration window:**
   - Scroll down to **"Before launch"** section (bottom of window)
   - You'll see: `Build` (already there)

2. **Click the `+` button** (next to "Before launch")

3. **Select: "Run External Tool"**

---

## Step 4: Create External Tool

**If this is your FIRST time:**

A new window opens to create external tool:

```
Name: Open Frontend
Group: Lutem
Description: Opens frontend in browser
Program: cmd.exe
Arguments: /c start-frontend-only.bat
Working directory: D:\Lutem\ProjectFiles\lutem-mvp
```

Click **OK**

**If you ALREADY created it:**
- Just select "Open Frontend" from the list
- Click **OK**

---

## Step 5: Verify Setup

Your "Before launch" section should now show:
```
✓ Build
✓ Run External Tool 'Open Frontend'
```

Click **Apply** → **OK**

---

## Step 6: Test It! 🧪

1. **Click the green Run button** (or press `Shift+F10`)

2. **Watch the magic:**
   - ✅ IntelliJ builds the project
   - ✅ Frontend opens in browser
   - ✅ Backend starts in IntelliJ console

3. **Wait for:** `Started LutemMvpApplication in X seconds`

4. **Test in browser:** Click "Get Recommendation"

---

## ✅ Success Indicators

| Indicator | What It Means |
|-----------|---------------|
| Browser window opens | ✅ Pre-run script worked |
| Console shows Spring Boot logs | ✅ Backend is starting |
| "Started LutemMvpApplication" | ✅ Backend ready |
| Frontend can get recommendations | ✅ Everything connected! |

---

## 🐛 Troubleshooting

### Frontend doesn't open

**Quick Fix:**
Run this manually first to test:
```cmd
D:\Lutem\ProjectFiles\lutem-mvp\start-frontend-only.bat
```

If that works, check your External Tool path:
- `File` → `Settings` → `Tools` → `External Tools`
- Find "Open Frontend"
- Verify paths are correct

### Backend doesn't start

**Check:**
- Port 8080 is free: `netstat -ano | findstr :8080`
- JDK 17+ is configured in IntelliJ
- Read IntelliJ console for errors

### External Tool option not there

**Solution:**
Use the alternative simpler setup:
- Don't add Before Launch task
- Just run backend normally
- Manually run: `start-frontend-only.bat`

---

## 🎨 Bonus: Add Keyboard Shortcut

Want to start Lutem with a hotkey?

1. `File` → `Settings` → `Keymap`
2. Search: "Run LutemMvpApplication"
3. Right-click → `Add Keyboard Shortcut`
4. Assign: `Ctrl+Shift+L` (for Lutem!)
5. Click **OK**

Now: `Ctrl+Shift+L` = Full-stack startup! 🚀

---

## 📊 What You Just Set Up

```
Press Run Button
    ↓
[Before Launch]
    ↓
1. Build Project (Maven compile)
    ↓
2. Open Frontend (start-frontend-only.bat)
    ↓
[Main Run]
    ↓
3. Start Spring Boot Backend
    ↓
✅ Everything Ready!
```

---

## ⏭️ Next Level

Once this works, you can:
- Add hot reload (Spring DevTools)
- Configure remote debugging
- Set up different profiles (dev/prod)

See: `docs/INTELLIJ_RUN_CONFIGURATION.md` for advanced options

---

## 🎯 Result

**Before this setup:**
1. Right-click `LutemMvpApplication.java` → Run
2. Wait for startup
3. Find and open `index.html`
4. Test

**After this setup:**
1. Click Run button (or `Shift+F10`)
2. ✅ Everything ready!

**Time saved per startup:** ~15 seconds  
**Over 100 startups:** 25 minutes saved! ⏰
