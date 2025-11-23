# Color Palette & Theme System

## Overview
Lutem features a comprehensive color palette and theme system with 4 distinct visual styles, each available in both light and dark modes - **8 total theme combinations**.

## Latest Update: Combined Theme Toggle (Nov 23, 2025)
**Previous System:** Separate buttons for color palette (☕💜🌿🌊) and light/dark mode (🌙☀️)  
**Current System:** Single unified palette selector with integrated mode toggle

## Available Palettes

### 1. ☕ Warm Café (Default)
**Light Mode:**
- Warm browns and creams
- Cozy coffee shop aesthetic
- Optimized for daytime use
- Primary: `#c89f7e` (warm tan)
- Background: Gradient `#f5e6d3` → `#d4a574`

**Dark Mode:**
- Deep browns and muted tans
- Rich coffee tones
- Easy on eyes in low light
- Primary: `#d4af8e` (light tan)
- Background: Gradient `#2a1f1a` → `#1f1610`

### 2. 💜 Soft Lavender
**Light Mode:**
- Gentle purples and pastels
- Calming and elegant
- Suitable for focus sessions
- Primary: `#9d8db5` (soft purple)
- Background: Gradient `#f0e8f5` → `#d4c5e0`

**Dark Mode:**
- Deep purples with soft accents
- Mysterious and sophisticated
- Reduced visual strain
- Primary: `#b89dcc` (lavender)
- Background: Gradient `#2a1f35` → `#1f1828`

### 3. 🌿 Natural Earth
**Light Mode:**
- Green earth tones
- Organic and grounded
- Nature-inspired design
- Primary: `#88a882` (sage green)
- Background: Gradient `#e8f0e8` → `#b8d4b8`

**Dark Mode:**
- Deep forest greens
- Earthy and calming
- Nature at night aesthetic
- Primary: `#a0c898` (mint green)
- Background: Gradient `#1f2a1f` → `#14##1f14`

### 4. 🌊 Ocean Breeze
**Light Mode:**
- Cool blues and teals
- Fresh and serene
- Clear sky aesthetic
- Primary: `#64b5f6` (sky blue)
- Background: Gradient `#e3f2fd` → `#b3d9f2`

**Dark Mode:**
- Deep ocean blues
- Tranquil night waters
- Calming midnight aesthetic
- Primary: `#7ac5ff` (bright blue)
- Background: Gradient `#1a2533` → `#0f1b28`

## User Interface

### Palette Selector Button
- **Location:** Fixed position - bottom-right corner (30px from edges)
- **Size:** 60x60px circular button
- **Icon Display:**
  - Light mode: Shows palette icon (☕💜🌿🌊)
  - Dark mode: Shows moon icon (🌙)
- **Visual States:**
  - Default: Subtle shadow
  - Hover: Elevates with transform
  - Active: Indicator when menu is open
- **Tooltip:** Shows palette name + mode (e.g., "Warm Café (Dark)")

### Palette Selector Menu
Opens above the button with smooth animation:

**Mode Toggle (Top Section):**
- Two buttons: "☀️ Light" and "🌙 Dark"
- Active button highlighted with accent color
- Instant mode switching
- Clear visual feedback

**Color Palette Options (Bottom Section):**
- Grid layout with 4 color options
- Each option shows:
  - Palette icon (☕💜🌿🌊)
  - Primary and secondary color swatches
  - Palette name label
- Active palette highlighted with border
- Hover effects with scale transform

**Interaction:**
- Click selector button to open/close menu
- Click anywhere outside to close
- Independent mode and palette selection
- Changes apply instantly
- Smooth transitions between all states

## Technical Implementation

### CSS Variables
Each theme defines comprehensive color variables:

**Core Colors:**
```css
--bg-primary        /* Main background gradient */
--bg-secondary      /* Secondary surfaces */
--bg-card           /* Card backgrounds */
--text-primary      /* Main text color */
--text-secondary    /* Secondary text */
--text-light        /* Disabled/hint text */
--text-header       /* Header text */
--border-color      /* UI borders */
--shadow            /* Box shadow colors */
--shadow-hover      /* Hover state shadows */
--accent-primary    /* Primary accent */
--accent-secondary  /* Secondary accent */
```

**Mood Colors (adapt per theme):**
```css
--mood-unwind       /* Relaxation mood */
--mood-achieve      /* Achievement mood */
--mood-engage       /* Engagement mood */
--mood-explore      /* Exploration mood */
--mood-challenge    /* Challenge mood */
--mood-recharge     /* Recharge mood */
```

**UI Elements:**
```css
--input-bg          /* Form input backgrounds */
--input-border      /* Input borders */
--placeholder-bg    /* Placeholder backgrounds */
```

**Aliases (for consistency):**
```css
--surface           /* Maps to bg-card */
--background        /* Maps to bg-secondary */
--border            /* Maps to border-color */
--primary           /* Maps to accent-primary */
```

### Data Attributes
Themes are applied via HTML data attributes:

**Palette Selection:**
```html
<!-- Café (default) -->
<html>

<!-- Other palettes -->
<html data-palette="lavender">
<html data-palette="earth">
<html data-palette="ocean">
```

**Mode Selection:**
```html
<!-- Light mode (default) -->
<html>

<!-- Dark mode -->
<html data-theme="dark">
```

**Combined Example:**
```html
<!-- Ocean Breeze Dark Mode -->
<html data-palette="ocean" data-theme="dark">
```

### JavaScript API

**State Variables:**
```javascript
let currentPalette = 'cafe';  // or 'lavender', 'earth', 'ocean'
let currentMode = 'light';     // or 'dark'
```

**Main Function:**
```javascript
function applyTheme(palette, mode) {
    // Set palette attribute
    if (palette === 'cafe') {
        root.removeAttribute('data-palette');
    } else {
        root.setAttribute('data-palette', palette);
    }
    
    // Set mode attribute
    root.setAttribute('data-theme', mode);
    
    // Update button icon
    const info = paletteInfo[palette];
    if (mode === 'dark') {
        paletteIcon.textContent = '🌙';
    } else {
        paletteIcon.textContent = info.icon;
    }
    
    // Save to localStorage
    localStorage.setItem('palette', palette);
    localStorage.setItem('theme', mode);
    
    // Update UI state
    updateSelectorUI();
}
```

**Event Handlers:**
```javascript
// Mode toggle
document.querySelectorAll('.mode-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const mode = btn.getAttribute('data-mode');
        applyTheme(currentPalette, mode);
    });
});

// Palette selection
document.querySelectorAll('.palette-color-option').forEach(option => {
    option.addEventListener('click', (e) => {
        const palette = option.getAttribute('data-palette');
        applyTheme(palette, currentMode);
    });
});
```

### Persistence Strategy
```javascript
// Save on change
localStorage.setItem('palette', 'ocean');
localStorage.setItem('theme', 'dark');

// Load on page load
const savedPalette = localStorage.getItem('palette') || 'cafe';
const savedMode = localStorage.getItem('theme') || 'light';
applyTheme(savedPalette, savedMode);
```

## User Experience Benefits

### 1. Personalization
- 8 distinct visual experiences
- Choose based on mood, time of day, or preference
- Persistent across sessions
- No repeated setup

### 2. Accessibility
- Dark modes reduce eye strain in low light
- High contrast options in all themes
- Light modes optimize for bright environments
- Smooth transitions prevent jarring changes

### 3. Visual Hierarchy
- Each palette maintains consistent design language
- Color coding for emotional moods adapts per theme
- Clear distinction between UI states
- Consistent component styling

### 4. Performance
- CSS-only theme switching (no JavaScript for rendering)
- Instant transitions
- No page reload required
- Minimal memory footprint

## Design Principles

### Color Psychology
Each palette targets specific emotional responses:

- **Café:** Comfort, warmth, familiarity (like your favorite coffee shop)
- **Lavender:** Calm, elegance, focus (zen-like concentration)
- **Earth:** Natural, grounding, balance (outdoor tranquility)
- **Ocean:** Fresh, clear, serene (open sky clarity)

### Mood-Adaptive Colors
Emotional goal colors adjust per theme:
- Maintain psychological associations
- Adapt to light/dark context
- Preserve visual hierarchy
- Ensure readability

**Example - "Unwind" mood:**
- Café Light: Soft blue `#7db5d4`
- Café Dark: Deeper blue `#6a9fc0`
- Lavender Light: Purple-blue `#8db8d4`
- Ocean Dark: Rich blue `#4a95d6`

### Accessibility Standards
All themes meet WCAG 2.1 guidelines:
- **AA contrast minimum:** 4.5:1 for normal text
- **AAA target:** 7:1 for key UI elements
- **Focus indicators:** Clear and visible in all themes
- **Color independence:** Information not conveyed by color alone

## Future Enhancements

### Potential Features
- **Custom palette creator:** User-defined color schemes
- **Time-based switching:** Auto-switch to dark at sunset
- **System theme sync:** Match OS dark mode settings
- **Seasonal palettes:** Special themes for holidays
- **High contrast mode:** Enhanced accessibility option
- **Export/Import:** Share palette configurations

### Community Palettes
- User-submitted themes
- Community voting
- Curated collections
- Designer showcase

## Testing Checklist

### Visual Testing
- [ ] All UI components visible in each theme
- [ ] Text remains readable in all contexts
- [ ] Interactive states (hover, active) work correctly
- [ ] Mood colors display appropriately
- [ ] Game cards and images look good
- [ ] Modal overlays have proper contrast

### Functional Testing
- [ ] Palette selector opens/closes smoothly
- [ ] Mode toggle switches instantly
- [ ] Palette changes apply correctly
- [ ] localStorage saves preferences
- [ ] Page reload preserves theme
- [ ] No console errors on theme change

### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

### Accessibility Testing
- [ ] Screen reader compatibility
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Focus indicators visible
- [ ] Contrast ratios meet standards
- [ ] No color-only information

## Migration Notes

**Breaking Changes from Previous System:**
- ❌ Removed: Separate light/dark toggle button
- ❌ Removed: Individual palette cycle button
- ✅ Added: Unified palette selector menu
- ✅ Added: Dark mode variants for all 4 palettes
- ✅ Improved: More intuitive UI with visual palette preview

**Backwards Compatibility:**
- LocalStorage keys remain the same
- Existing preferences automatically migrate
- No user action required
- Smooth transition for existing users

## Conclusion

The combined color palette and theme system provides a flexible, accessible, and delightful personalization experience. With 8 total theme combinations, users can find the perfect visual environment for their gaming discovery sessions at any time of day.

The unified palette selector improves discoverability and reduces UI clutter while maintaining the powerful customization that makes Lutem feel truly personal.
