# ⚡ CORRECTED: Running .bat Files in IntelliJ (Windows)

## 🚨 Important Note for Windows

**Option 2 from the previous guide does NOT work on Windows!**

The "Shell Script" configuration expects Unix shells (bash/sh), which Windows doesn't have.

**Use Application Configuration instead** (see below)

---

## ✅ WORKING Option: Application Run Configuration

This is the correct way to run `.bat` files on Windows in IntelliJ:

### Step-by-Step:

1. **Open Run Configurations:**
   - `Run` → `Edit Configurations...`
   - Click `+` → Select **"Application"** (not Shell Script!)

2. **Configure:**
   ```
   Name: Lutem Full Stack
   
   Main class: (leave empty)
   
   VM options: (leave empty)
   
   Program arguments: /c "start-lutem.bat"
   
   Working directory: D:\Lutem\ProjectFiles\lutem-mvp
   
   Environment variables: (leave empty)
   
   Use classpath of module: (select your backend module)
   
   JRE: (your project JDK)
   ```

   **CRITICAL:** In the "Before launch" section:
   - Remove "Build" if present
   - We don't need to build for running a .bat file

3. **Actually, BETTER approach:**

Instead of using "Application", use **"Batch" from the Shell Script plugin**:

Wait, let me give you the **SIMPLEST working solution**:

---

## 🎯 SIMPLEST Solution: Use CMD Application Config

### Step 1: Create Application Configuration

1. `Run` → `Edit Configurations...`
2. Click `+` → **"Application"**
3. Configure:

```
Name: Lutem Full Stack

Path to executable: C:\Windows\System32\cmd.exe

Program arguments: /c "D:\Lutem\ProjectFiles\lutem-mvp\start-lutem.bat"

Working directory: D:\Lutem\ProjectFiles\lutem-mvp
```

4. **Important:** In "Before launch" section
   - Click `-` to remove "Build" task
   - (We don't need to build to run a batch file)

5. Click **Apply** → **OK**

### Step 2: Set as Default

- Click dropdown next to Run button
- Select "Lutem Full Stack"

### Step 3: Test

Click **Run** button (or `Shift+F10`)

---

## 🏆 BETTER: Just Use Option 1 or 3

Honestly, **Option 2 is the worst choice for Windows**. I recommend:

### **Option 1: Spring Boot + Pre-run (BEST)** 🥇
- ✅ Uses IntelliJ's Spring Boot runner
- ✅ Automatically opens frontend
- ✅ Debugging works
- ✅ Hot reload works
- **Setup time:** 3 minutes

### **Option 3: External Tools (EASY)** 🥈  
- ✅ Quick to set up
- ✅ Keyboard shortcut
- ✅ Always available in Tools menu
- **Setup time:** 2 minutes

### **Option 2: Application Config (MEH)** 🥉
- ⚠️ Works but clunky
- ⚠️ No debugging
- ⚠️ Not as clean
- **Setup time:** 3 minutes

---

## 📋 Which Should You Choose?

| Situation | Best Option |
|-----------|-------------|
| **Daily development** | Option 1 (Spring Boot + Pre-run) 🏆 |
| **Quick access from menu** | Option 3 (External Tools) |
| **Must have .bat as default run** | Option 2 (Application config) |

---

## ✅ Recommended Next Steps

**Try Option 1 instead:**

1. Open: `docs/QUICK_INTELLIJ_SETUP.md`
2. Follow the 3-minute guide
3. Result: One-click startup with debugging support!

**Or use Option 3:**

1. `File` → `Settings` → `Tools` → `External Tools`
2. Add tool with cmd.exe and your .bat file
3. Assign keyboard shortcut
4. Access from Tools menu anytime

---

## 🆘 Still Want to Use Option 2?

If you REALLY want the .bat file as a Run Configuration:

**Use this corrected config:**

```
Type: Application (not Shell Script!)
Path to executable: C:\Windows\System32\cmd.exe  
Program arguments: /c start-lutem.bat
Working directory: D:\Lutem\ProjectFiles\lutem-mvp
Remove "Build" from Before Launch tasks
```

But I strongly recommend **Option 1** instead! 🎯
