# Quick Manual Guide - Add Store URLs (5-10 minutes)

## Method: IntelliJ Find & Replace

### Step 1: Open Find & Replace
1. Open `GameController.java` in IntelliJ
2. Press `Ctrl + R` (Find & Replace)
3. Make sure "Regex" is **UNCHECKED** (literal text search)

### Step 2: Replace Each URL One by One

Copy-paste these Find & Replace pairs. Do them in order:

---

**Game 3 - Tetris Effect**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/1003590/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/1003590/header.jpg",
            "https://store.steampowered.com/app/1003590/Tetris_Effect_Connected/",
```

---

**Game 4 - Dead Cells**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/588650/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/588650/header.jpg",
            "https://store.steampowered.com/app/588650/Dead_Cells/",
```

---

**Game 5 - Rocket League**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/252950/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/252950/header.jpg",
            "https://store.steampowered.com/app/252950/Rocket_League/",
```

---

**Game 6 - Baba Is You**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/736260/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/736260/header.jpg",
            "https://store.steampowered.com/app/736260/Baba_Is_You/",
```

---

**Game 7 - Hades**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg",
            "https://store.steampowered.com/app/1145360/Hades/",
```

---

**Game 8 - Stardew Valley**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg",
            "https://store.steampowered.com/app/413150/Stardew_Valley/",
```

---

**Game 9 - Slay the Spire**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/646570/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/646570/header.jpg",
            "https://store.steampowered.com/app/646570/Slay_the_Spire/",
```

---

**Game 10 - Apex Legends**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg",
            "https://store.steampowered.com/app/1172470/Apex_Legends/",
```

---

**Game 11 - PowerWash Simulator**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/1290000/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/1290000/header.jpg",
            "https://store.steampowered.com/app/1290000/PowerWash_Simulator/",
```

---

**Game 12 - Into the Breach**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/590380/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/590380/header.jpg",
            "https://store.steampowered.com/app/590380/Into_the_Breach/",
```

---

**Game 13 - The Witcher 3**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg",
            "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/",
```

---

**Game 14 - Minecraft**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/1366220/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/1366220/header.jpg",
            "https://www.minecraft.net/",
```

---

**Game 15 - Dark Souls III**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg",
            "https://store.steampowered.com/app/374320/DARK_SOULS_III/",
```

---

**Game 16 - Civilization VI**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/289070/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/289070/header.jpg",
            "https://store.steampowered.com/app/289070/Sid_Meiers_Civilization_VI/",
```

---

**Game 17 - A Short Hike**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/1055540/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/1055540/header.jpg",
            "https://store.steampowered.com/app/1055540/A_Short_Hike/",
```

---

**Game 18 - Loop Hero**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/1282730/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/1282730/header.jpg",
            "https://store.steampowered.com/app/1282730/Loop_Hero/",
```

---

**Game 19 - Valorant**
Find:
```
"https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/4150c5778e7c03bdb5825519d85e5e6e8ed3a849-1920x1080.jpg",
            "", // storeUrl
```

Replace:
```
"https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/4150c5778e7c03bdb5825519d85e5e6e8ed3a849-1920x1080.jpg",
            "https://playvalorant.com/",
```

---

**Game 20 - The Witness**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/210970/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/210970/header.jpg",
            "https://store.steampowered.com/app/210970/The_Witness/",
```

---

**Game 21 - Firewatch**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/383870/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/383870/header.jpg",
            "https://store.steampowered.com/app/383870/Firewatch/",
```

---

**Game 22 - It Takes Two**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/1426210/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/1426210/header.jpg",
            "https://store.steampowered.com/app/1426210/It_Takes_Two/",
```

---

**Game 23 - Overcooked 2**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/728880/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/728880/header.jpg",
            "https://store.steampowered.com/app/728880/Overcooked_2/",
```

---

**Game 24 - Portal 2**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/620/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/620/header.jpg",
            "https://store.steampowered.com/app/620/Portal_2/",
```

---

**Game 25 - Keep Talking and Nobody Explodes**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/341800/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/341800/header.jpg",
            "https://store.steampowered.com/app/341800/Keep_Talking_and_Nobody_Explodes/",
```

---

**Game 26 - Subnautica**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/264710/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/264710/header.jpg",
            "https://store.steampowered.com/app/264710/Subnautica/",
```

---

**Game 27 - Risk of Rain 2**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/632360/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/632360/header.jpg",
            "https://store.steampowered.com/app/632360/Risk_of_Rain_2/",
```

---

**Game 28 - Ori and the Will of the Wisps**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/1057090/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/1057090/header.jpg",
            "https://store.steampowered.com/app/1057090/Ori_and_the_Will_of_the_Wisps/",
```

---

**Game 29 - Trackmania**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/2225070/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/2225070/header.jpg",
            "https://www.trackmania.com/",
```

---

**Game 30 - Fall Guys**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/1097150/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/1097150/header.jpg",
            "https://store.steampowered.com/app/1097150/Fall_Guys/",
```

---

**Game 31 - Chess Online**
Find:
```
"https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/SamCopeland/phpmeXx6V.png",
            "", // storeUrl
```

Replace:
```
"https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/SamCopeland/phpmeXx6V.png",
            "https://www.chess.com/",
```

---

**Game 32 - Gris**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/683320/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/683320/header.jpg",
            "https://store.steampowered.com/app/683320/GRIS/",
```

---

**Game 33 - Spiritfarer**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/972660/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/972660/header.jpg",
            "https://store.steampowered.com/app/972660/Spiritfarer_Farewell_Edition/",
```

---

**Game 34 - Factorio**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/427520/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/427520/header.jpg",
            "https://store.steampowered.com/app/427520/Factorio/",
```

---

**Game 35 - Animal Crossing**
Find:
```
"https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/en_US/games/switch/a/animal-crossing-new-horizons-switch/hero",
            "", // storeUrl
```

Replace:
```
"https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/en_US/games/switch/a/animal-crossing-new-horizons-switch/hero",
            "https://www.nintendo.com/us/store/products/animal-crossing-new-horizons-switch/",
```

---

**Game 36 - Journey**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/638230/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/638230/header.jpg",
            "https://store.steampowered.com/app/638230/Journey/",
```

---

**Game 37 - Among Us**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/945360/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/945360/header.jpg",
            "https://store.steampowered.com/app/945360/Among_Us/",
```

---

**Game 38 - Hearthstone**
Find:
```
"https://bnetcmsus-a.akamaihd.net/cms/page_media/w4/W4NE08DTET8P1521577412158.jpg",
            "", // storeUrl
```

Replace:
```
"https://bnetcmsus-a.akamaihd.net/cms/page_media/w4/W4NE08DTET8P1521577412158.jpg",
            "https://hearthstone.blizzard.com/",
```

---

**Game 39 - Vampire Survivors**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/1794680/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/1794680/header.jpg",
            "https://store.steampowered.com/app/1794680/Vampire_Survivors/",
```

---

**Game 40 - Celeste**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/504230/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/504230/header.jpg",
            "https://store.steampowered.com/app/504230/Celeste/",
```

---

**Game 41 - Counter-Strike 2**
Find:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
            "", // storeUrl
```

Replace:
```
"https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
            "https://store.steampowered.com/app/730/CounterStrike_2/",
```

---

## After You're Done

1. Save the file
2. Restart your backend in IntelliJ
3. Test by opening frontend and clicking a 🛒 button
4. ✅ Store Links Feature Complete!

## Setting Up Python (For Future Automation)

Want to set up Python properly? Here's how:

1. Go to https://www.python.org/downloads/
2. Download Python 3.12 (latest stable)
3. During installation, **CHECK** "Add Python to PATH"
4. After install, restart your terminal
5. Test: `python --version`

This will save us tons of time on future features!
