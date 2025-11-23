import re

# Read the file
with open(r'D:\Lutem\ProjectFiles\lutem-mvp\backend\src\main\java\com\lutem\mvp\GameController.java', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern: image URL ending with .jpg" followed by closing parentheses
# We need to add storeUrl and userRating before the closing
pattern = r'("https://[^"]+\.jpg")\s*\)\);'
replacement = r'\1,\n            "", // storeUrl\n            4.0 // userRating\n        ));'

# Replace all occurrences
new_content = re.sub(pattern, replacement, content)

# Count replacements
count = len(re.findall(pattern, content))
print(f'Fixed {count} Game constructors!')

# Write back
with open(r'D:\Lutem\ProjectFiles\lutem-mvp\backend\src\main\java\com\lutem\mvp\GameController.java', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Done!')
