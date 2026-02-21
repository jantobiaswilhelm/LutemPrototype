# 🔧 Long-Term Maven Solution

## Problem
Maven is not in system PATH, making command-line startup difficult.

## ✅ BEST Solution: Maven Wrapper

Maven Wrapper makes your project **self-contained** - no system configuration needed!

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Run Environment Check
```cmd
check-environment.bat
```

This shows what's available on your system.

### Step 2: Setup Maven Wrapper
```cmd
setup-maven-wrapper.bat
```

Follow the on-screen instructions (uses IntelliJ's Maven).

### Step 3: Test It
```cmd
cd backend
mvnw.cmd spring-boot:run
```

**Done!** Your project now works on ANY machine without Maven installed.

---

## 📖 Detailed Instructions

See: `docs/adding-maven-wrapper.md`

Three methods to add wrapper:
1. **IntelliJ Terminal** (recommended)
2. **IntelliJ Maven Panel** (if terminal fails)
3. **Manual Download** (if IntelliJ Maven unavailable)

---

## 🎯 What This Solves

### Before (Current State):
❌ Maven not in PATH  
❌ Scripts can't start backend  
❌ Manual IntelliJ startup required  
❌ Doesn't work on other machines  

### After (With Maven Wrapper):
✅ Maven included with project  
✅ Scripts work automatically  
✅ Command-line startup works  
✅ Works on ANY machine (Windows/Mac/Linux)  
✅ Consistent Maven version  

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `check-environment.bat` | Diagnose current setup |
| `setup-maven-wrapper.bat` | Guide to add wrapper |
| `docs/adding-maven-wrapper.md` | Detailed instructions |
| `start-lutem.bat` | Auto-detects wrapper or Maven |

---

## 🔄 Workflow After Wrapper

### Development:
```cmd
# Start backend
cd backend
mvnw.cmd spring-boot:run

# Or use the all-in-one script:
start-lutem.bat
```

### Sharing Project:
```bash
# Commit wrapper files
git add backend/mvnw backend/mvnw.cmd backend/.mvn/
git commit -m "Add Maven wrapper"
git push

# Anyone can now clone and run immediately!
```

---

## 🆘 If Setup Fails

**IntelliJ Maven not working?**
- No problem! Keep using IntelliJ to start backend
- Wrapper is optional for local development
- Main benefit is for automation and sharing

**Still want automated startup?**
- Consider adding Maven to system PATH (see Alternative below)
- Or use wrapper for scripts, IntelliJ for development

---

## 🔀 Alternative: Add Maven to System PATH

If you prefer modifying system PATH instead:

1. **Download Maven:**
   https://maven.apache.org/download.cgi

2. **Extract to:**
   `C:\Program Files\Apache Maven\`

3. **Add to PATH:**
   - Windows Search → "Environment Variables"
   - Edit "Path" under System Variables
   - Add: `C:\Program Files\Apache Maven\bin`
   - Click OK, restart terminal

4. **Verify:**
   ```cmd
   mvn --version
   ```

**Note:** Maven Wrapper is still better because it works for everyone!

---

## 📊 Comparison

| Method | Pros | Cons |
|--------|------|------|
| **Maven Wrapper** | ✅ No installation<br>✅ Works everywhere<br>✅ Version consistency | ⚠️ Requires initial setup |
| **System PATH** | ✅ Works immediately<br>✅ System-wide availability | ❌ Manual installation<br>❌ Version conflicts<br>❌ Doesn't travel with project |
| **IntelliJ Only** | ✅ No setup needed | ❌ No automation<br>❌ Manual startup only |

**Recommendation: Maven Wrapper** 🏆

---

## ✅ Checklist

- [ ] Run `check-environment.bat`
- [ ] Run `setup-maven-wrapper.bat`
- [ ] Follow IntelliJ instructions
- [ ] Verify: `mvnw.cmd --version`
- [ ] Test: `start-lutem.bat`
- [ ] Commit wrapper files to Git

---

## 🎓 Learn More

- Maven Wrapper: https://github.com/takari/maven-wrapper
- Maven Download: https://maven.apache.org/download.cgi
- Spring Boot Guide: https://spring.io/guides/gs/maven/
