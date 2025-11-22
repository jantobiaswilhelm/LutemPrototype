# 🚀 IntelliJ Run Configuration Guide for Lutem

## 🎯 Best Setup: Enhanced Spring Boot Config

This setup combines the best of both worlds:
- ✅ Use IntelliJ's Spring Boot runner (fast, with hot reload)
- ✅ Automatically open frontend when backend starts
- ✅ Single click to start everything

---

## Option 1: Spring Boot with Pre-Run Script (RECOMMENDED)

### Step 1: Modify Spring Boot Run Configuration

1. **Open Run Configurations:**
   - `Run` → `Edit Configurations...`
   - Find your `LutemMvpApplication` configuration
   - (If it doesn't exist, right-click `LutemMvpApplication.java` → `Modify Run Configuration`)

2. **Add Before Launch Task:**
   - Scroll down to **"Before launch"** section at the bottom
   - Click `+` button
   - Select **"Run External Tool"**
   
3. **Create External Tool (if not already created):**
   - Click `+` to add new external tool
   - Configure:
     ```
     Name: Open Lutem Frontend
     Program: cmd.exe
     Arguments: /c "D:\Lutem\ProjectFiles\lutem-mvp\backend\pre-run.bat"
     Working directory: D:\Lutem\ProjectFiles\lutem-mvp\backend
     ```
   - Click OK

4. **Select the Tool:**
   - Choose "Open Lutem Frontend" from the list
   - Click OK

5. **Apply & OK**

### Result:
Now when you click **Run** (Shift+F10):
1. ✅ Frontend opens in browser automatically
2. ✅ Backend starts in IntelliJ
3. ✅ Single click, everything ready!

---

## Option 2: Application Run Configuration (For .bat Files)

⚠️ **WINDOWS NOTE:** "Shell Script" config doesn't work for .bat files!  
Use "Application" config with cmd.exe instead.

### Step 1: Create Application Configuration

1. **Open Run Configurations:**
   - `Run` → `Edit Configurations...`
   - Click `+` → **`Application`** (NOT Shell Script!)

2. **Configure:**
   ```
   Name: Lutem Full Stack
   
   Path to executable: C:\Windows\System32\cmd.exe
   
   Program arguments: /c "start-lutem.bat"
   
   Working directory: D:\Lutem\ProjectFiles\lutem-mvp
   ```

3. **Remove Build Task:**
   - In "Before launch" section, click `-` to remove "Build"
   - (We don't need to build to run a batch file)

4. **Click Apply & OK**

5. **Set as Default:**
   - Click the dropdown next to Run button (top right)
   - Select "Lutem Full Stack"

### Result:
Click **Run** button → Everything starts via .bat script

**Note:** This works but has no debugging. Consider Option 1 instead!

---

## Option 3: External Tools (Quick Access)

For ad-hoc running without changing default config:

### Setup:

1. **Go to Settings:**
   - `File` → `Settings` (Ctrl+Alt+S)
   - `Tools` → `External Tools`
   - Click `+`

2. **Add Start Lutem Tool:**
   ```
   Name: Start Lutem
   Description: Start backend and frontend
   Program: cmd.exe
   Arguments: /c "start-lutem.bat"
   Working directory: D:\Lutem\ProjectFiles\lutem-mvp
   ```

3. **Add Keyboard Shortcut (Optional):**
   - `File` → `Settings` → `Keymap`
   - Search "External Tools" → "Start Lutem"
   - Right-click → `Add Keyboard Shortcut`
   - Assign: `Ctrl+Shift+L`

### Usage:
- `Tools` → `External Tools` → `Start Lutem`
- Or press `Ctrl+Shift+L`

---

## 🎯 Comparison

| Method | Pros | Cons | Recommended For |
|--------|------|------|-----------------|
| **Spring Boot + Pre-run** | ✅ IntelliJ debugging<br>✅ Hot reload<br>✅ Auto frontend | ⚠️ More setup | **Primary development** 🏆 |
| **Shell Script Config** | ✅ Simple<br>✅ Uses .bat files | ❌ No debugging<br>❌ No hot reload | **Quick testing** |
| **External Tools** | ✅ Quick access<br>✅ Keyboard shortcut | ❌ Not default run | **Ad-hoc tasks** |

---

## 🔧 Troubleshooting

### "Shell Script" option not available
**Solution:** 
- Install "Shell Script" plugin
- Or use External Tools instead

### Frontend doesn't open
**Solution:**
- Check `pre-run.bat` path is correct
- Verify the file exists in `backend/` folder
- Try running `pre-run.bat` manually first

### Backend doesn't start
**Solution:**
- Verify Spring Boot config still exists
- Check JDK is configured (17+)
- Look at IntelliJ console for errors

---

## 📝 My Recommendation

**For You:**

1. **Use Spring Boot config + Pre-run script** (Option 1)
   - Best for daily development
   - Keeps debugging capability
   - Auto-opens frontend

2. **Add External Tool with hotkey** (Option 3)
   - For quick restarts
   - Useful when debugging frontend separately

**Setup Time:** 5 minutes
**Benefit:** One-click full-stack startup forever!

---

## ✅ Quick Setup Checklist

- [ ] Create `pre-run.bat` (already done!)
- [ ] Open Run Configurations in IntelliJ
- [ ] Find Spring Boot config for LutemMvpApplication
- [ ] Add "Before launch" → "Run External Tool"
- [ ] Create/select "Open Lutem Frontend" tool
- [ ] Apply & OK
- [ ] Test: Click Run button
- [ ] Verify: Frontend opens, backend starts
- [ ] (Optional) Add keyboard shortcut for External Tool

---

## 🎓 Learn More

- IntelliJ Run Configurations: https://www.jetbrains.com/help/idea/run-debug-configuration.html
- Spring Boot in IntelliJ: https://www.jetbrains.com/help/idea/spring-boot.html
- External Tools: https://www.jetbrains.com/help/idea/configuring-third-party-tools.html
