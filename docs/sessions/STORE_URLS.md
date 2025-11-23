# Game Store URLs for Lutem MVP

## Instructions
Replace each `""` (empty string) in the storeUrl field with the corresponding URL below.

## Game Store URL Mappings

1. Unpacking: https://store.steampowered.com/app/1135690/Unpacking/
2. Dorfromantik: https://store.steampowered.com/app/1455840/Dorfromantik/
3. Tetris Effect: https://store.steampowered.com/app/1003590/Tetris_Effect_Connected/
4. Dead Cells: https://store.steampowered.com/app/588650/Dead_Cells/
5. Rocket League: https://store.steampowered.com/app/252950/Rocket_League/
6. Baba Is You: https://store.steampowered.com/app/736260/Baba_Is_You/
7. Hades: https://store.steampowered.com/app/1145360/Hades/
8. Stardew Valley: https://store.steampowered.com/app/413150/Stardew_Valley/
9. Slay the Spire: https://store.steampowered.com/app/646570/Slay_the_Spire/
10. Apex Legends: https://store.steampowered.com/app/1172470/Apex_Legends/
11. PowerWash Simulator: https://store.steampowered.com/app/1290000/PowerWash_Simulator/
12. Into the Breach: https://store.steampowered.com/app/590380/Into_the_Breach/
13. The Witcher 3: https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/
14. Minecraft: https://www.minecraft.net/
15. Dark Souls III: https://store.steampowered.com/app/374320/DARK_SOULS_III/
16. Civilization VI: https://store.steampowered.com/app/289070/Sid_Meiers_Civilization_VI/
17. A Short Hike: https://store.steampowered.com/app/1055540/A_Short_Hike/
18. Loop Hero: https://store.steampowered.com/app/1282730/Loop_Hero/
19. Valorant: https://playvalorant.com/
20. The Witness: https://store.steampowered.com/app/210970/The_Witness/
21. Firewatch: https://store.steampowered.com/app/383870/Firewatch/
22. It Takes Two: https://store.steampowered.com/app/1426210/It_Takes_Two/
23. Overcooked 2: https://store.steampowered.com/app/728880/Overcooked_2/
24. Portal 2: https://store.steampowered.com/app/620/Portal_2/
25. Keep Talking and Nobody Explodes: https://store.steampowered.com/app/341800/Keep_Talking_and_Nobody_Explodes/
26. Subnautica: https://store.steampowered.com/app/264710/Subnautica/
27. Risk of Rain 2: https://store.steampowered.com/app/632360/Risk_of_Rain_2/
28. Ori and the Will of the Wisps: https://store.steampowered.com/app/1057090/Ori_and_the_Will_of_the_Wisps/
29. Trackmania: https://www.trackmania.com/
30. Fall Guys: https://store.steampowered.com/app/1097150/Fall_Guys/
31. Chess Online: https://www.chess.com/
32. Gris: https://store.steampowered.com/app/683320/GRIS/
33. Spiritfarer: https://store.steampowered.com/app/972660/Spiritfarer_Farewell_Edition/
34. Factorio: https://store.steampowered.com/app/427520/Factorio/
35. Animal Crossing: https://www.nintendo.com/us/store/products/animal-crossing-new-horizons-switch/
36. Journey: https://store.steampowered.com/app/638230/Journey/
37. Among Us: https://store.steampowered.com/app/945360/Among_Us/
38. Hearthstone: https://hearthstone.blizzard.com/
39. Vampire Survivors: https://store.steampowered.com/app/1794680/Vampire_Survivors/
40. Celeste: https://store.steampowered.com/app/504230/Celeste/
41. Counter-Strike 2: https://store.steampowered.com/app/730/CounterStrike_2/

## Quick Find & Replace Patterns

For faster implementation, use these patterns in your IDE:

### Pattern for Unpacking (line 36):
Find: "https://cdn.cloudflare.steamstatic.com/steam/apps/1135690/header.jpg",
            "", // storeUrl

Replace with: "https://cdn.cloudflare.steamstatic.com/steam/apps/1135690/header.jpg",
            "https://store.steampowered.com/app/1135690/Unpacking/",

### Or do a global replace:
Find: "", // storeUrl
Replace: "PLACEHOLDER", // storeUrl

Then manually replace each PLACEHOLDER with the correct URL from the list above.
