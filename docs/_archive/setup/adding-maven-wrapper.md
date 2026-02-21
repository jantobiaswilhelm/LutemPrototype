# Adding Maven Wrapper - Step by Step

## Why Maven Wrapper?
- ✅ No Maven installation needed
- ✅ No PATH configuration required  
- ✅ Project works on ANY machine
- ✅ Consistent Maven version
- ✅ Industry standard for Spring Boot

---

## Method 1: Using IntelliJ Terminal (RECOMMENDED)

1. **Open IntelliJ** with your backend project
2. **Open Terminal** in IntelliJ (Alt+F12 or View → Tool Windows → Terminal)
3. **Run this command:**
   ```bash
   cd D:\Lutem\ProjectFiles\lutem-mvp\backend
   mvn -N wrapper:wrapper
   ```
4. **Wait** for Maven to download wrapper files (~30 seconds)

### What gets created:
```
backend/
├── mvnw           (Unix script)
├── mvnw.cmd       (Windows script) ✅ THIS IS WHAT WE NEED
├── .mvn/
│   └── wrapper/
│       ├── maven-wrapper.jar
│       └── maven-wrapper.properties
```

5. **Test it:**
   ```bash
   mvnw.cmd spring-boot:run
   ```

---

## Method 2: Manual Download (If IntelliJ Maven fails)

If IntelliJ says "mvn not found", download wrapper manually:

1. **Download Maven Wrapper Archive:**
   https://github.com/takari/maven-wrapper/releases/latest

2. **Extract these files to `backend/` folder:**
   - `mvnw` 
   - `mvnw.cmd`
   - `.mvn/wrapper/maven-wrapper.jar`
   - `.mvn/wrapper/maven-wrapper.properties`

3. **Test it:**
   ```cmd
   cd D:\Lutem\ProjectFiles\lutem-mvp\backend
   mvnw.cmd spring-boot:run
   ```

---

## After Adding Wrapper

### Your startup scripts will automatically work! 🎉

The `start-backend.bat` script already checks for `mvnw.cmd`:
```batch
if exist mvnw.cmd (
    echo Using Maven wrapper...
    mvnw.cmd spring-boot:run
)
```

### You can also run from command line:
```cmd
cd D:\Lutem\ProjectFiles\lutem-mvp\backend
mvnw.cmd spring-boot:run
```

---

## Commit to Git

Once wrapper is added, commit these files:
```bash
git add backend/mvnw backend/mvnw.cmd backend/.mvn/
git commit -m "Add Maven wrapper for portable builds"
```

**Anyone cloning your repo will now be able to run without installing Maven!**

---

## Troubleshooting

### "mvn not found" in IntelliJ Terminal
**Solution**: IntelliJ has Maven built-in, but might not expose it in terminal.

Try this instead:
1. Open Maven panel: View → Tool Windows → Maven
2. Find "Plugins" → "wrapper" → "wrapper:wrapper"
3. Double-click to run

### Manual wrapper still doesn't work
**Solution**: Just use IntelliJ to start backend (it has Maven internally).
The wrapper is mainly for automation/scripts.

---

## Next Steps

1. ✅ Add wrapper (this guide)
2. ✅ Test `mvnw.cmd spring-boot:run`
3. ✅ Test `start-lutem.bat` (should work now!)
4. ✅ Commit wrapper files to Git
