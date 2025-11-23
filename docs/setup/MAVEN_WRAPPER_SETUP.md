# Maven Wrapper Installation

## Overview
Added Maven Wrapper to enable standalone backend execution without requiring Maven installation in system PATH.

## What Was Added

### Maven Wrapper Files
- `.mvn/wrapper/maven-wrapper.jar` - Maven wrapper executable
- `.mvn/wrapper/maven-wrapper.properties` - Wrapper configuration
- `mvnw.cmd` - Windows wrapper script

### Updated Scripts
- `start-backend.bat` - Now automatically uses Maven wrapper and detects JAVA_HOME

## How It Works

The Maven wrapper allows the project to run Maven commands without requiring a global Maven installation:

1. **First Run**: Downloads Maven distribution (3.9.6) to user's `.m2` folder
2. **Subsequent Runs**: Uses cached Maven distribution
3. **JAVA_HOME Detection**: Automatically finds JDK installation

## Usage

Simply run:
```bash
start-backend.bat
```

The script will:
1. Check for JAVA_HOME or auto-detect JDK in `C:\Program Files\Java\`
2. Use Maven wrapper (`mvnw.cmd`) to start Spring Boot
3. Start backend on port 8080

## Benefits

✅ **No Maven installation required** - Works out of the box
✅ **Version consistency** - Everyone uses same Maven version (3.9.6)
✅ **Portable** - Project can run on any machine with JDK
✅ **Team collaboration** - No "works on my machine" issues

## Manual Maven Wrapper Generation

If you need to regenerate the wrapper:

```bash
mvn wrapper:wrapper -Dmaven=3.9.6
```

## Requirements

- **Java JDK 17+** (Auto-detected in `C:\Program Files\Java\jdk-25`)
- **Internet connection** (first run only, to download Maven)

## Troubleshooting

**Issue**: "JAVA_HOME not found"
**Solution**: Set JAVA_HOME environment variable:
```bash
set JAVA_HOME=C:\Program Files\Java\jdk-25
```

**Issue**: Maven download fails
**Solution**: Check internet connection and firewall settings

**Issue**: Port 8080 already in use
**Solution**: Kill existing process:
```bash
netstat -ano | findstr :8080
taskkill /PID <pid> /F
```
