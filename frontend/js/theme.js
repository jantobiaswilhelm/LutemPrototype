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
    
    // Apply palette
    if (palette === 'cafe') {
        root.removeAttribute('data-palette');
    } else {
        root.setAttribute('data-palette', palette);
    }
    
    // Apply theme mode
    root.setAttribute('data-theme', mode);
    
    // Update button icon
    const info = PALETTE_INFO[palette];
    if (mode === 'dark') {
        paletteIcon.textContent = '🌙';
    } else {
        paletteIcon.textContent = info.icon;
    }
    paletteToggle.title = info.label + (mode === 'dark' ? ' (Dark)' : ' (Light)');
    
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
    // Update mode toggle buttons
    document.querySelectorAll('.mode-toggle-btn').forEach(btn => {
        const btnMode = btn.getAttribute('data-mode');
        if (btnMode === currentMode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update color options
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
    
    // Toggle palette selector on button click
    paletteToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        paletteSelector.classList.toggle('active');
        paletteToggle.classList.toggle('active');
    });

    // Handle mode toggle clicks (Light/Dark)
    document.querySelectorAll('.mode-toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const mode = btn.getAttribute('data-mode');
            applyTheme(currentPalette, mode);
        });
    });

    // Handle color palette clicks
    document.querySelectorAll('.palette-color-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const palette = option.getAttribute('data-palette');
            applyTheme(palette, currentMode);
        });
    });

    // Close palette selector when clicking outside
    document.addEventListener('click', (e) => {
        if (!paletteToggle.contains(e.target) && !paletteSelector.contains(e.target)) {
            paletteSelector.classList.remove('active');
            paletteToggle.classList.remove('active');
        }
    });
}
