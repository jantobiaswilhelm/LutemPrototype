/**
 * Lutem - Form Module
 * Handles main form interactions: sliders, chips, toggles
 * Updated for new wizard-style layout
 */

/**
 * Update time display text based on slider index
 * @param {number} index - Slider position index
 */
function updateTimeDisplay(index) {
    const timeDisplay = document.getElementById('timeDisplay');
    // Display shorter format for the wizard layout
    const shortLabels = ['5 min', '15 min', '30 min', '45 min', '1 hr', '2 hr', '3 hr', '3+ hr'];
    timeDisplay.textContent = shortLabels[index] || TIME_LABELS[index];
}

/**
 * Setup radio button group behavior (legacy, for advanced options)
 * @param {string} groupId - ID of the radio group container
 * @param {string} stateKey - State property to update
 */
function setupRadioGroup(groupId, stateKey) {
    document.querySelectorAll(`#${groupId} .radio-option`).forEach(option => {
        option.addEventListener('click', () => {
            // Deselect all
            document.querySelectorAll(`#${groupId} .radio-option`).forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Select this one
            option.classList.add('selected');
            state[stateKey] = option.getAttribute('data-value');
            
            // Trigger validation if enabled
            triggerValidationIfEnabled();
        });
    });
}

/**
 * Setup card-style selection (single select)
 * Used for energy cards, interrupt cards
 * @param {string} groupId - ID of the card group container
 * @param {string} cardClass - Class name of the card elements
 * @param {string} stateKey - State property to update
 */
function setupCardGroup(groupId, cardClass, stateKey) {
    document.querySelectorAll(`#${groupId} .${cardClass}`).forEach(card => {
        card.addEventListener('click', () => {
            // Deselect all
            document.querySelectorAll(`#${groupId} .${cardClass}`).forEach(c => {
                c.classList.remove('selected');
            });
            
            // Select this one
            card.classList.add('selected');
            state[stateKey] = card.getAttribute('data-value');
            
            // Trigger validation if enabled
            triggerValidationIfEnabled();
        });
    });
}

/**
 * Setup chip-style selection (multi-select)
 * @param {string} groupId - ID of the chip group container
 * @param {string} chipClass - Class name of the chip elements
 * @param {string} stateKey - State array property to update
 * @param {string} dataAttr - Data attribute name (default: 'value')
 */
function setupChipGroup(groupId, chipClass, stateKey, dataAttr = 'value') {
    document.querySelectorAll(`#${groupId} .${chipClass}`).forEach(chip => {
        chip.addEventListener('click', () => {
            const value = chip.getAttribute(`data-${dataAttr}`);
            
            if (chip.classList.contains('selected')) {
                chip.classList.remove('selected');
                state[stateKey] = state[stateKey].filter(v => v !== value);
            } else {
                chip.classList.add('selected');
                state[stateKey].push(value);
            }
            
            // Trigger validation if enabled
            triggerValidationIfEnabled();
        });
    });
}

/**
 * Initialize main form functionality
 */
function initForm() {
    // Energy Level Cards (single select)
    setupCardGroup('energyLevel', 'energy-card', 'energyLevel');
    
    // Interruptibility Cards (single select)
    setupCardGroup('interruptibility', 'interrupt-card', 'interruptibility');
    
    // Mood Chips - Emotional Goals (multi-select)
    setupChipGroup('emotionalGoals', 'mood-chip', 'selectedGoals', 'value');

    // Time Slider
    const timeSlider = document.getElementById('timeSlider');
    
    timeSlider.addEventListener('input', (e) => {
        const index = parseInt(e.target.value);
        state.availableMinutes = TIME_VALUES[index];
        updateTimeDisplay(index);
        
        // Show Touch Grass modal for 3+ hours
        if (index === 7) {
            document.getElementById('touchGrassModal').style.display = 'flex';
        }
    });

    // Legacy radio groups for advanced options
    setupRadioGroup('timeOfDay', 'timeOfDay');
    setupRadioGroup('socialPreference', 'socialPreference');

    // Genre Preferences (multi-select chips)
    const genreChips = document.querySelectorAll('#genrePreferences .chip');
    console.log(`Attaching click handlers to ${genreChips.length} genre chips`);
    
    genreChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const genre = chip.getAttribute('data-genre');
            console.log(`Genre chip clicked: ${genre}`);
            
            if (chip.classList.contains('selected')) {
                chip.classList.remove('selected');
                state.selectedGenres = state.selectedGenres.filter(g => g !== genre);
                console.log(`Deselected ${genre}`);
            } else {
                chip.classList.add('selected');
                state.selectedGenres.push(genre);
                console.log(`Selected ${genre}`);
            }
            console.log('All selected genres:', state.selectedGenres);
        });
    });

    // Genre Preferences Toggle
    document.getElementById('genreToggle').addEventListener('click', () => {
        const content = document.getElementById('genreContent');
        const icon = document.querySelector('#genreToggle .advanced-toggle-icon');
        
        if (content.classList.contains('open')) {
            content.classList.remove('open');
            icon.textContent = '▼';
        } else {
            content.classList.add('open');
            icon.textContent = '▲';
        }
    });

    // Advanced Options Toggle
    document.getElementById('advancedToggle').addEventListener('click', () => {
        const content = document.getElementById('advancedContent');
        const icon = document.querySelector('#advancedToggle .advanced-toggle-icon');
        
        if (content.classList.contains('open')) {
            content.classList.remove('open');
            icon.textContent = '▼';
        } else {
            content.classList.add('open');
            icon.textContent = '▲';
        }
    });
}
