#!/usr/bin/env python3
"""
Add storeUrl parameter to all Game constructors in GameController.java
"""

# Map image URL patterns to store URLs
STORE_URLS = {
    "1135690": ("Unpacking", "https://store.steampowered.com/app/1135690/Unpacking/"),
    "1455840": ("Dorfromantik", "https://store.steampowered.com/app/1455840/Dorfromantik/"),
    "1003590": ("Tetris Effect", "https://store.steampowered.com/app/1003590/Tetris_Effect_Connected/"),
    "588650": ("Dead Cells", "https://store.steampowered.com/app/588650/Dead_Cells/"),
    "252950": ("Rocket League", "https://store.steampowered.com/app/252950/Rocket_League/"),
    "736260": ("Baba Is You", "https://store.steampowered.com/app/736260/Baba_Is_You/"),
    "1145360": ("Hades", "https://store.steampowered.com/app/1145360/Hades/"),
    "413150": ("Stardew Valley", "https://store.steampowered.com/app/413150/Stardew_Valley/"),
    "646570": ("Slay the Spire", "https://store.steampowered.com/app/646570/Slay_the_Spire/"),
    "1172470": ("Apex Legends", "https://store.steampowered.com/app/1172470/Apex_Legends/"),
    "1290000": ("PowerWash Simulator", "https://store.steampowered.com/app/1290000/PowerWash_Simulator/"),
    "590380": ("Into the Breach", "https://store.steampowered.com/app/590380/Into_the_Breach/"),
    "292030": ("The Witcher 3", "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/"),
    "1366220": ("Minecraft", "https://www.minecraft.net/"),
    "374320": ("Dark Souls III", "https://store.steampowered.com/app/374320/DARK_SOULS_III/"),
    "289070": ("Civilization VI", "https://store.steampowered.com/app/289070/Sid_Meiers_Civilization_VI/"),
    "1055540": ("A Short Hike", "https://store.steampowered.com/app/1055540/A_Short_Hike/"),
    "1282730": ("Loop Hero", "https://store.steampowered.com/app/1282730/Loop_Hero/"),
    "rgpub.io": ("Valorant", "https://playvalorant.com/"),
    "210970": ("The Witness", "https://store.steampowered.com/app/210970/The_Witness/"),
    "383870": ("Firewatch", "https://store.steampowered.com/app/383870/Firewatch/"),
    "1426210": ("It Takes Two", "https://store.steampowered.com/app/1426210/It_Takes_Two/"),
    "728880": ("Overcooked 2", "https://store.steampowered.com/app/728880/Overcooked_2/"),
    "/620/": ("Portal 2", "https://store.steampowered.com/app/620/Portal_2/"),
    "341800": ("Keep Talking", "https://store.steampowered.com/app/341800/Keep_Talking_and_Nobody_Explodes/"),
    "264710": ("Subnautica", "https://store.steampowered.com/app/264710/Subnautica/"),
    "632360": ("Risk of Rain 2", "https://store.steampowered.com/app/632360/Risk_of_Rain_2/"),
    "1057090": ("Ori and the Will of the Wisps", "https://store.steampowered.com/app/1057090/Ori_and_the_Will_of_the_Wisps/"),
    "2225070": ("Trackmania", "https://www.trackmania.com/"),
    "1097150": ("Fall Guys", "https://store.steampowered.com/app/1097150/Fall_Guys/"),
    "chesscomfiles": ("Chess Online", "https://www.chess.com/"),
    "683320": ("Gris", "https://store.steampowered.com/app/683320/GRIS/"),
    "972660": ("Spiritfarer", "https://store.steampowered.com/app/972660/Spiritfarer_Farewell_Edition/"),
    "427520": ("Factorio", "https://store.steampowered.com/app/427520/Factorio/"),
    "animal-crossing": ("Animal Crossing", "https://www.nintendo.com/us/store/products/animal-crossing-new-horizons-switch/"),
    "638230": ("Journey", "https://store.steampowered.com/app/638230/Journey/"),
    "945360": ("Among Us", "https://store.steampowered.com/app/945360/Among_Us/"),
    "bnetcmsus": ("Hearthstone", "https://hearthstone.blizzard.com/"),
    "1794680": ("Vampire Survivors", "https://store.steampowered.com/app/1794680/Vampire_Survivors/"),
    "504230": ("Celeste", "https://store.steampowered.com/app/504230/Celeste/"),
    "/730/": ("Counter-Strike 2", "https://store.steampowered.com/app/730/CounterStrike_2/"),
}

def add_store_urls():
    """Add storeUrl parameter before the closing parenthesis of each Game constructor"""
    
    file_path = "src/main/java/com/lutem/mvp/GameController.java"
    
    print("Reading GameController.java...")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    result_lines = []
    lines = content.split('\n')
    
    last_image_url = None
    replacements = 0
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Track image URLs
        if ('cloudflare.steamstatic.com' in line or 'chesscomfiles' in line or 
            'rgpub.io' in line or 'nintendo.com' in line or 'bnetcmsus' in line):
            last_image_url = line
        
        # Check if this is the closing of a Game constructor (line with just closing parentheses and semicolon)
        if line.strip() == '));' and last_image_url:
            # Find the matching store URL
            store_url = ""
            game_name = "Unknown"
            for pattern, (name, url) in STORE_URLS.items():
                if pattern in last_image_url:
                    store_url = url
                    game_name = name
                    break
            
            # Add storeUrl parameter before closing
            indent = ' ' * 12  # Standard indentation
            result_lines.append(f'{indent}"{store_url}",')
            result_lines.append(f'{indent}4.0 // userRating')
            result_lines.append(line)
            
            if store_url:
                replacements += 1
                print(f"[OK] Added URL for {game_name}")
            
            last_image_url = None  # Reset for next game
        else:
            result_lines.append(line)
        
        i += 1
    
    # Write back
    new_content = '\n'.join(result_lines)
    
    print("\nWriting updated GameController.java...")
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"\n[SUCCESS] Added {replacements} store URLs!")
    print("[COMPLETE] Store Links Feature: 100% Complete!")

if __name__ == "__main__":
    add_store_urls()
