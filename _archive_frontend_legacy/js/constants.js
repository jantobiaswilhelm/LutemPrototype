/**
 * Lutem - Constants Module
 * Contains gaming quotes, time values, and other constant data
 */

// Gaming quotes for loading screen
const GAMING_QUOTES = [
    { text: "It's dangerous to go alone!", game: "The Legend of Zelda" },
    { text: "The cake is a lie", game: "Portal" },
    { text: "Would you kindly?", game: "BioShock" },
    { text: "War. War never changes.", game: "Fallout" },
    { text: "Had to be me. Someone else might have gotten it wrong.", game: "Mass Effect 3" },
    { text: "Stay awhile and listen!", game: "Diablo II" },
    { text: "All your base are belong to us", game: "Zero Wing" },
    { text: "A man chooses, a slave obeys", game: "BioShock" },
    { text: "Do a barrel roll!", game: "Star Fox" },
    { text: "The right man in the wrong place can make all the difference", game: "Half-Life 2" },
    { text: "Nothing is true, everything is permitted", game: "Assassin's Creed" },
    { text: "I need a weapon", game: "Halo 2" },
    { text: "Thank you Mario! But our princess is in another castle!", game: "Super Mario Bros." },
    { text: "You have died of dysentery", game: "Oregon Trail" },
    { text: "Finish him!", game: "Mortal Kombat" },
    { text: "Snake? SNAKE?! SNAAAAKE!", game: "Metal Gear Solid" },
    { text: "Hey! Listen!", game: "The Legend of Zelda: Ocarina of Time" },
    { text: "I used to be an adventurer like you, then I took an arrow to the knee", game: "Skyrim" },
    { text: "Your health is low. Do you have any potions? Or food?", game: "Fable" },
    { text: "Rise and shine, Mr. Freeman", game: "Half-Life 2" },
    { text: "Praise the Sun!", game: "Dark Souls" },
    { text: "Get over here!", game: "Mortal Kombat" },
    { text: "We all make choices, but in the end our choices make us", game: "BioShock" },
    { text: "It's time to kick ass and chew bubblegum... and I'm all outta gum", game: "Duke Nukem 3D" }
];

// Time slider values and labels
const TIME_VALUES = [5, 15, 30, 45, 60, 120, 180, 200];
const TIME_LABELS = ['5 minutes', '15 minutes', '30 minutes', '45 minutes', 
                     '1 hour', '2 hours', '3 hours', '3+ hours'];

// Palette info for theme switching
const PALETTE_INFO = {
    'cafe': { icon: '☕', label: 'Warm Café' },
    'lavender': { icon: '💜', label: 'Soft Lavender' },
    'earth': { icon: '🌿', label: 'Natural Earth' },
    'ocean': { icon: '🌊', label: 'Ocean Breeze' }
};

/**
 * Get a random gaming quote
 * @returns {Object} Quote object with text and game properties
 */
function getRandomQuote() {
    return GAMING_QUOTES[Math.floor(Math.random() * GAMING_QUOTES.length)];
}
