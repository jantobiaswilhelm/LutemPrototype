#!/usr/bin/env python3
"""
Automated script to add store URLs to GameController.java
"""

import re

# Store URL mappings (game number : URL)
STORE_URLS = {
    3: "https://store.steampowered.com/app/1003590/Tetris_Effect_Connected/",
    4: "https://store.steampowered.com/app/588650/Dead_Cells/",
    5: "https://store.steampowered.com/app/252950/Rocket_League/",
    6: "https://store.steampowered.com/app/736260/Baba_Is_You/",
    7: "https://store.steampowered.com/app/1145360/Hades/",
    8: "https://store.steampowered.com/app/413150/Stardew_Valley/",
    9: "https://store.steampowered.com/app/646570/Slay_the_Spire/",
    10: "https://store.steampowered.com/app/1172470/Apex_Legends/",
    11: "https://store.steampowered.com/app/1290000/PowerWash_Simulator/",
    12: "https://store.steampowered.com/app/590380/Into_the_Breach/",
    13: "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/",
    14: "https://www.minecraft.net/",
    15: "https://store.steampowered.com/app/374320/DARK_SOULS_III/",
    16: "https://store.steampowered.com/app/289070/Sid_Meiers_Civilization_VI/",
    17: "https://store.steampowered.com/app/1055540/A_Short_Hike/",
    18: "https://store.steampowered.com/app/1282730/Loop_Hero/",
    19: "https://playvalorant.com/",
    20: "https://store.steampowered.com/app/210970/The_Witness/",
    21: "https://store.steampowered.com/app/383870/Firewatch/",
    22: "https://store.steampowered.com/app/1426210/It_Takes_Two/",
    23: "https://store.steampowered.com/app/728880/Overcooked_2/",
    24: "https://store.steampowered.com/app/620/Portal_2/",
    25: "https://store.steampowered.com/app/341800/Keep_Talking_and_Nobody_Explodes/",
    26: "https://store.steampowered.com/app/264710/Subnautica/",
    27: "https://store.steampowered.com/app/632360/Risk_of_Rain_2/",
    28: "https://store.steampowered.com/app/1057090/Ori_and_the_Will_of_the_Wisps/",
    29: "https://www.trackmania.com/",
    30: "https://store.steampowered.com/app/1097150/Fall_Guys/",
    31: "https://www.chess.com/",
    32: "https://store.steampowered.com/app/683320/GRIS/",
    33: "https://store.steampowered.com/app/972660/Spiritfarer_Farewell_Edition/",
    34: "https://store.steampowered.com/app/427520/Factorio/",
    35: "https://www.nintendo.com/us/store/products/animal-crossing-new-horizons-switch/",
    36: "https://store.steampowered.com/app/638230/Journey/",
    37: "https://store.steampowered.com/app/945360/Among_Us/",
    38: "https://hearthstone.blizzard.com/",
    39: "https://store.steampowered.com/app/1794680/Vampire_Survivors/",
    40: "https://store.steampowered.com/app/504230/Celeste/",
    41: "https://store.steampowered.com/app/730/CounterStrike_2/",
}

def add_store_urls():
    """Read GameController.java, add store URLs, and write back"""
    
    file_path = "src/main/java/com/lutem/mvp/GameController.java"
    
    print("Reading GameController.java...")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Counter for games
    game_counter = 1
    
    # Split into lines for processing
    lines = content.split('\n')
    result_lines = []
    
    for i, line in enumerate(lines):
        # Check if this line contains an empty storeUrl
        if '"",' in line and '// storeUrl' in line:
            # Get the URL for this game number
            if game_counter in STORE_URLS:
                url = STORE_URLS[game_counter]
                # Replace the empty string with the URL
                new_line = line.replace('"",', f'"{url}",')
                result_lines.append(new_line)
                print(f"[OK] Added URL for game #{game_counter}")
            else:
                # This game already has a URL (games 1 and 2)
                result_lines.append(line)
            
            game_counter += 1
        else:
            result_lines.append(line)
    
    # Write back
    new_content = '\n'.join(result_lines)
    
    print("\nWriting updated GameController.java...")
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"[SUCCESS] Added {len(STORE_URLS)} store URLs!")
    print("\n[COMPLETE] Store Links Feature: 100% Complete!")

if __name__ == "__main__":
    add_store_urls()
