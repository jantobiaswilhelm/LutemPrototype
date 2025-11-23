#!/usr/bin/env python3
"""
Fix: Add missing commas after imageUrl lines
"""

def fix_commas():
    file_path = "src/main/java/com/lutem/mvp/GameController.java"
    
    print("Reading GameController.java...")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix pattern: imageUrl without comma followed by storeUrl
    # Replace: ".jpg"\n            "http with: ".jpg",\n            "http
    import re
    
    # Pattern: image URL line without comma, followed by store URL
    pattern = r'(\.(?:jpg|png)"\s*)\n(\s+"https?://)'
    replacement = r'\1,\n\2'
    
    new_content = re.sub(pattern, replacement, content)
    
    print("Writing fixed GameController.java...")
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("[SUCCESS] Fixed all missing commas!")

if __name__ == "__main__":
    fix_commas()
