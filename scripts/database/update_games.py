import re

# Read the GameController.java file
with open('src/main/java/com/lutem/mvp/GameController.java', 'r', encoding='utf-8') as file:
    content = file.read()

# Pattern to find game initializations without storeUrl
pattern = r'(games\.add\(new Game\(id\+\+,.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\s+")(https://[^"]+)(header\.jpg",\s*\n\s*)(\d+\.\d+)'

def replace_func(match):
    prefix = match.group(1)
    image_url = match.group(2) + "header.jpg"
    middle = match.group(3)
    rating = match.group(4)
    
    # Extract app ID from image URL
    app_id_match = re.search(r'/apps/(\d+)/', image_url)
    if app_id_match:
        app_id = app_id_match.group(1)
        store_url = f"https://store.steampowered.com/app/{app_id}"
        return f'{prefix}{image_url}",\n            "{store_url}",\n            {rating}'
    else:
        # If no app ID found, use a generic placeholder
        return f'{prefix}{image_url}",\n            "https://store.steampowered.com",\n            {rating}'

# Replace all matches
updated_content = re.sub(pattern, replace_func, content)

# Write back
with open('src/main/java/com/lutem/mvp/GameController.java', 'w', encoding='utf-8') as file:
    file.write(updated_content)

print("Updated all game initializations with store URLs!")
