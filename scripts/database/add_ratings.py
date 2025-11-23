import re

# Read the file
file_path = r"D:\Lutem\ProjectFiles\lutem-mvp\backend\src\main\java\com\lutem\mvp\GameController.java"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Define ratings for each game (based on typical store ratings)
# Games 1-6 already have ratings, so we start from game 7 onwards
ratings = {
    # Games 10-41 (we already did 1-9)
    "Apex Legends": 4.2,
    "PowerWash Simulator": 4.7,
    "Into the Breach": 4.6,
    "The Witcher 3": 4.9,
    "Minecraft": 4.8,
    "Dark Souls III": 4.7,
    "Civilization VI": 4.5,
    "A Short Hike": 4.8,
    "Loop Hero": 4.4,
    "Valorant": 4.1,
    "The Witness": 4.3,
    "Firewatch": 4.5,
    "It Takes Two": 4.9,
    "Overcooked 2": 4.6,
    "Portal 2": 4.9,
    "Keep Talking and Nobody Explodes": 4.5,
    "Subnautica": 4.7,
    "Risk of Rain 2": 4.6,
    "Ori and the Will of the Wisps": 4.8,
    "Trackmania": 4.4,
    "Fall Guys": 3.9,
    "Chess Online": 4.2,
    "Gris": 4.7,
    "Spiritfarer": 4.8,
    "Factorio": 4.9,
    "Animal Crossing": 4.7,
    "Journey": 4.8,
    "Among Us": 4.0,
    "Hearthstone": 4.1,
    "Vampire Survivors": 4.5,
    "Celeste": 4.8,
    "Counter-Strike 2": 4.3
}

# Pattern to match: game name followed by its constructor call ending with imageUrl and "))"
# We need to find cases where there's NO rating (ending with .jpg") and add one

for game_name, rating in ratings.items():
    # Escape special characters in game name for regex
    escaped_name = re.escape(game_name)
    
    # Pattern: find the game constructor that ends with a URL but no rating
    # Looking for: "URL"\n        ));
    pattern = rf'(new Game\(id\+\+, "{escaped_name}".*?"https?://[^"]+\.(?:jpg|png)")\s*\)\);'
    
    # Replacement: add the rating before the closing parentheses
    replacement = rf'\1,\n            {rating}\n        ));'
    
    # Apply the replacement
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Write the updated content back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully added ratings to all games!")
