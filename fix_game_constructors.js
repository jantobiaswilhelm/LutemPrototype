const fs = require('fs');

// Read the file
const content = fs.readFileSync('D:\\Lutem\\ProjectFiles\\lutem-mvp\\backend\\src\\main\\java\\com\\lutem\\mvp\\GameController.java', 'utf8');

// Pattern: image URL ending with .jpg" followed by closing parentheses
const pattern = /("https:\/\/[^"]+\.jpg")\s*\)\);/g;
const replacement = '$1,\n            "", // storeUrl\n            4.0 // userRating\n        ));';

// Replace all occurrences
const newContent = content.replace(pattern, replacement);

// Count replacements
const matches = content.match(pattern);
console.log(`Fixed ${matches ? matches.length : 0} Game constructors!`);

// Write back
fs.writeFileSync('D:\\Lutem\\ProjectFiles\\lutem-mvp\\backend\\src\\main\\java\\com\\lutem\\mvp\\GameController.java', newContent, 'utf8');

console.log('Done!');
