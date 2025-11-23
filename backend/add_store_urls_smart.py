#!/usr/bin/env python3
"""
Smart script to add store URLs by matching image URLs
"""

# Map image URL patterns to store URLs
URL_MAPPINGS = {
    "1003590": "https://store.steampowered.com/app/1003590/Tetris_Effect_Connected/",
    "588650": "https://store.steampowered.com/app/588650/Dead_Cells/",
    "252950": "https://store.steampowered.com/app/252950/Rocket_League/",
    "736260": "https://store.steampowered.com/app/736260/Baba_Is_You/",
    "1145360": "https://store.steampowered.com/app/1145360/Hades/",
    "413150": "https://store.steampowered.com/app/413150/Stardew_Valley/",
    "646570": "https://store.steampowered.com/app/646570/Slay_the_Spire/",
    "1172470": "https://store.steampowered.com/app/1172470/Apex_Legends/",
    "1290000": "https://store.steampowered.com/app/1290000/PowerWash_Simulator/",
    "590380": "https://store.steampowered.com/app/590380/Into_the_Breach/",
    "292030": "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/",
    "1366220": "https://www.minecraft.net/",
    "374320": "https://store.steampowered.com/app/374320/DARK_SOULS_III/",
    "289070": "https://store.steampowered.com/app/289070/Sid_Meiers_Civilization_VI/",
    "1055540": "https://store.steampowered.com/app/1055540/A_Short_Hike/",
    "1282730": "https://store.steampowered.com/app/1282730/Loop_Hero/",
    "rgpub.io": "https://playvalorant.com/",
    "210970": "https://store.steampowered.com/app/210970/The_Witness/",
    "383870": "https://store.steampowered.com/app/383870/Firewatch/",
    "1426210": "https://store.steampowered.com/app/1426210/It_Takes_Two/",
    "728880": "https://store.steampowered.com/app/728880/Overcooked_2/",
    "/620/": "https://store.steampowered.com/app/620/Portal_2/",
    "341800": "https://store.steampowered.com/app/341800/Keep_Talking_and_Nobody_Explodes/",
    "264710": "https://store.steampowered.com/app/264710/Subnautica/",
    "632360": "https://store.steampowered.com/app/632360/Risk_of_Rain_2/",
    "1057090": "https://store.steampowered.com/app/1057090/Ori_and_the_Will_of_the_Wisps/",
    "2225070": "https://www.trackmania.com/",
    "1097150": "https://store.steampowered.com/app/1097150/Fall_Guys/",
    "chesscomfiles": "https://www.chess.com/",
    "683320": "https://store.steampowered.com/app/683320/GRIS/",
    "972660": "https://store.steampowered.com/app/972660/Spiritfarer_Farewell_Edition/",
    "427520": "https://store.steampowered.com/app/427520/Factorio/",
    "nintendo.com": "https://www.nintendo.com/us/store/products/animal-crossing-new-horizons-switch/",
    "638230": "https://store.steampowered.com/app/638230/Journey/",
    "945360": "https://store.steampowered.com/app/945360/Among_Us/",
    "bnetcmsus": "https://hearthstone.blizzard.com/",
    "1794680": "https://store.steampowered.com/app/1794680/Vampire_Survivors/",
    "504230": "https://store.steampowered.com/app/504230/Celeste/",
    "/730/": "https://store.steampowered.com/app/730/CounterStrike_2/",
}

def add_store_urls():
    """Read GameController.java, match by image URL, add store URLs"""
    
    file_path = "src/main/java/com/lutem/mvp/GameController.java"
    
    print("Reading GameController.java...")
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    result_lines = []
    last_image_url = None
    replacements = 0
    
    for line in lines:
        # Track the last image URL we saw
        if 'cloudflare.steamstatic.com' in line or 'chesscomfiles' in line or 'rgpub.io' in line or 'nintendo.com' in line or 'bnetcmsus' in line:
            last_image_url = line.strip()
        
        # If this is an empty storeUrl line and we know which game it belongs to
        if '"",' in line and '// storeUrl' in line and last_image_url:
            # Find matching store URL
            store_url = None
            for pattern, url in URL_MAPPINGS.items():
                if pattern in last_image_url:
                    store_url = url
                    break
            
            if store_url:
                # Calculate the indentation
                indent = ' ' * (len(line) - len(line.lstrip()))
                new_line = f'{indent}"{store_url}", // storeUrl\n'
                result_lines.append(new_line)
                replacements += 1
                print(f"[OK] Added URL: {store_url[:50]}...")
            else:
                result_lines.append(line)
        else:
            result_lines.append(line)
    
    # Write back
    print("\nWriting updated GameController.java...")
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(result_lines)
    
    print(f"\n[SUCCESS] Added {replacements} store URLs!")
    print("[COMPLETE] Store Links Feature: 100% Complete!")

if __name__ == "__main__":
    add_store_urls()
