/**
 * Lutem - Form Module
 * Handles main form interactions: sliders, chips, toggles
 */

/**
 * Update time display text based on slider index
 * @param {number} index - Slider position index
 */
function updateTimeDisplay(index) {
    const timeDisplay = document.getElementById('timeDisplay');
    timeDisplay.textContent = TIME_LABELS[index];
}

/**
 * Setup radio button group behavior
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
 * Initialize main form functionality
 */
function initForm() {
    // Emotional Goals (multi-select chips)
    document.querySelectorAll('#emotionalGoals .chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const value = chip.getAttribute('data-value');
            
            if (chip.classList.contains('selected')) {
                chip.classList.remove('selected');
                state.selectedGoals = state.selectedGoals.filter(g => g !== value);
            } else {
                chip.classList.add('selected');
                state.selectedGoals.push(value);
            }
            
            // Trigger validation if enabled
            triggerValidationIfEnabled();
        });
    });

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

    // Setup radio groups
    setupRadioGroup('energyLevel', 'energyLevel');
    setupRadioGroup('interruptibility', 'interruptibility');
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
