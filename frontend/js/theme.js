/**
 * Lutem - Theme Module
 * Handles theme/palette switching functionality
 */

/**
 * Apply theme palette and mode
 * @param {string} palette - Palette name: 'cafe', 'lavender', 'earth', 'ocean'
 * @param {string} mode - Theme mode: 'light' or 'dark'
 */
function applyTheme(palette, mode) {
    const root = document.documentElement;
    const paletteIcon = document.getElementById('paletteIcon');
    const paletteToggle = document.getElementById('paletteToggle');
    const navPaletteIcon = document.getElementById('navPaletteIcon');
    
    // Apply palette
    if (palette === 'cafe') {
        root.removeAttribute('data-palette');
    } else {
        root.setAttribute('data-palette', palette);
    }
    
    // Apply theme mode
    root.setAttribute('data-theme', mode);
    
    // Update button icons (old floating button if exists)
    const info = PALETTE_INFO[palette];
    if (paletteIcon) {
        if (mode === 'dark') {
            paletteIcon.textContent = '🌙';
        } else {
            paletteIcon.textContent = info.icon;
        }
    }
    if (paletteToggle) {
        paletteToggle.title = info.label + (mode === 'dark' ? ' (Dark)' : ' (Light)');
    }
    
    // Update nav icon
    if (navPaletteIcon) {
        if (mode === 'dark') {
            navPaletteIcon.textContent = '🌙';
        } else {
            navPaletteIcon.textContent = info.icon;
        }
    }
    
    // Save to localStorage
    localStorage.setItem('palette', palette);
    localStorage.setItem('theme', mode);
    
    // Save to localStorage
    localStorage.setItem('palette', palette);
    localStorage.setItem('theme', mode);
    
    // Update state
    currentPalette = palette;
    currentMode = mode;
    
    // Update UI active states
    updateSelectorUI();
}

/**
 * Update palette selector UI to reflect current selection
 */
function updateSelectorUI() {
    // Update mode toggle buttons (both old floating selector and nav menu)
    document.querySelectorAll('.mode-toggle-btn').forEach(btn => {
        const btnMode = btn.getAttribute('data-mode');
        if (btnMode === currentMode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update color options (both old floating selector and nav menu)
    document.querySelectorAll('.palette-color-option').forEach(option => {
        const optionPalette = option.getAttribute('data-palette');
        if (optionPalette === currentPalette) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

/**
 * Initialize theme functionality
 * Sets up event listeners and applies saved theme
 */
function initTheme() {
    const paletteToggle = document.getElementById('paletteToggle');
    const paletteSelector = document.getElementById('paletteSelector');
    
    // Apply saved theme on load
    applyTheme(currentPalette, currentMode);
    
    // Toggle palette selector on button click (old floating button)
    if (paletteToggle && paletteSelector) {
        paletteToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            paletteSelector.classList.toggle('active');
            paletteToggle.classList.toggle('active');
        });
        
        // Close palette selector when clicking outside
        document.addEventListener('click', (e) => {
            if (!paletteToggle.contains(e.target) && !paletteSelector.contains(e.target)) {
                paletteSelector.classList.remove('active');
                paletteToggle.classList.remove('active');
            }
        });
    }

    // Handle mode toggle clicks (Light/Dark) - old selector
    document.querySelectorAll('.mode-toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const mode = btn.getAttribute('data-mode');
            applyTheme(currentPalette, mode);
        });
    });

    // Handle color palette clicks - old selector
    document.querySelectorAll('.palette-color-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const palette = option.getAttribute('data-palette');
            applyTheme(palette, currentMode);
        });
    });
}


/**
 * Toggle nav palette menu visibility
 */
function toggleNavPaletteMenu() {
    const menu = document.getElementById('navPaletteMenu');
    if (menu) {
        menu.classList.toggle('show');
    }
}

/**
 * Set theme mode from nav controls
 * @param {string} mode - 'light' or 'dark'
 */
function setNavMode(mode) {
    applyTheme(currentPalette, mode);
}

/**
 * Set theme palette from nav controls
 * @param {string} palette - 'cafe', 'lavender', 'earth', 'ocean'
 */
function setNavPalette(palette) {
    applyTheme(palette, currentMode);
}

// Close nav palette menu when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.getElementById('navPaletteMenu');
    const themeBtn = document.getElementById('navThemeBtn');
    if (menu && themeBtn) {
        if (!themeBtn.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('show');
        }
    }
});
