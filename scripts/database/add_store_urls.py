#!/usr/bin/env python3
"""
Script to add Steam store URLs to all games in GameController.java
"""

import re

# Game Store URL Mappings
STORE_URLS = {
    "Unpacking": "https://store.steampowered.com/app/1135690/Unpacking/",
    "Dorfromantik": "https://store.steampowered.com/app/1455840/Dorfromantik/",
    "Tetris Effect": "https://store.steampowered.com/app/1003590/Tetris_Effect_Connected/",
    "Dead Cells": "https://store.steampowered.com/app/588650/Dead_Cells/",
    "Rocket League": "https://store.steampowered.com/app/252950/Rocket_League/",
    "Baba Is You": "https://store.steampowered.com/app/736260/Baba_Is_You/",
    "Hades": "https://store.steampowered.com/app/1145360/Hades/",
    "Stardew Valley": "https://store.steampowered.com/app/413150/Stardew_Valley/",
    "Slay the Spire": "https://store.steampowered.com/app/646570/Slay_the_Spire/",
    "Apex Legends": "https://store.steampowered.com/app/1172470/Apex_Legends/",
    "PowerWash Simulator": "https://store.steampowered.com/app/1290000/PowerWash_Simulator/",
    "Into the Breach": "https://store.steampowered.com/app/590380/Into_the_Breach/",
    "The Witcher 3": "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/",
    "Minecraft": "https://www.minecraft.net/",
    "Dark Souls III": "https://store.steampowered.com/app/374320/DARK_SOULS_III/",
    "Civilization VI": "https://store.steampowered.com/app/289070/Sid_Meiers_Civilization_VI/",
    "A Short Hike": "https://store.steampowered.com/app/1055540/A_Short_Hike/",
    "Loop Hero": "https://store.steampowered.com/app/1282730/Loop_Hero/",
    "Valorant": "https://playvalorant.com/",
    "The Witness": "https://store.steampowered.com/app/210970/The_Witness/",
    "Firewatch": "https://store.steampowered.com/app/383870/Firewatch/",
    "It Takes Two": "https://store.steampowered.com/app/1426210/It_Takes_Two/",
    "Overcooked 2": "https://store.steampowered.com/app/728880/Overcooked_2/",
    "Portal 2": "https://store.steampowered.com/app/620/Portal_2/",
    "Keep Talking and Nobody Explodes": "https://store.steampowered.com/app/341800/Keep_Talking_and_Nobody_Explodes/",
    "Subnautica": "https://store.steampowered.com/app/264710/Subnautica/",
    "Risk of Rain 2": "https://store.steampowered.com/app/632360/Risk_of_Rain_2/",
    "Ori and the Will of the Wisps": "https://store.steampowered.com/app/1057090/Ori_and_the_Will_of_the_Wisps/",
    "Trackmania": "https://www.trackmania.com/",
    "Fall Guys": "https://store.steampowered.com/app/1097150/Fall_Guys/",
    "Chess Online": "https://www.chess.com/",
    "Gris": "https://store.steampowered.com/app/683320/GRIS/",
    "Spiritfarer": "https://store.steampowered.com/app/972660/Spiritfarer_Farewell_Edition/",
    "Factorio": "https://store.steampowered.com/app/427520/Factorio/",
    "Animal Crossing": "https://www.nintendo.com/us/store/products/animal-crossing-new-horizons-switch/",
    "Journey": "https://store.steampowered.com/app/638230/Journey/",
    "Among Us": "https://store.steampowered.com/app/945360/Among_Us/",
    "Hearthstone": "https://hearthstone.blizzard.com/",
    "Vampire Survivors": "https://store.steampowered.com/app/1794680/Vampire_Survivors/",
    "Celeste": "https://store.steampowered.com/app/504230/Celeste/",
    "Counter-Strike 2": "https://store.steampowered.com/app/730/CounterStrike_2/",
}

def update_game_controller():
    """Read GameController.java and update all store URLs"""
    file_path = r"D:\Lutem\ProjectFiles\lutem-mvp\backend\src\main\java\com\lutem\mvp\GameController.java"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to find game entries with empty store URLs
    # Look for: "game name", followed by description, imageUrl, and empty storeUrl
    pattern = r'games\.add\(new Game\(id\+\+, "([^"]+)",.+?"\s*,\s*//\s*storeUrl'
    
    # Replace each empty store URL with the correct one
    for game_name, store_url in STORE_URLS.items():
        # Create pattern for this specific game
        game_pattern = (
            r'(games\.add\(new Game\(id\+\+, "' + re.escape(game_name) + 
            r'",.+?"https://[^"]+",\s*)"", // storeUrl'
        )
        replacement = r'\1"' + store_url + '", // storeUrl'
        
        content = re.sub(game_pattern, replacement, content, flags=re.DOTALL)
    
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Updated store URLs for {len(STORE_URLS)} games!")
    
    # Verify
    remaining_empty = content.count('"", // storeUrl')
    print(f"📊 Remaining empty store URLs: {remaining_empty}")

if __name__ == "__main__":
    update_game_controller()
    print("\n🎮 All done! Restart your backend to see the changes.")
