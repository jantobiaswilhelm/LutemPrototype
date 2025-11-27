/**
 * Lutem - Wizard Module
 * Handles the guided setup wizard/modal functionality
 */

/**
 * Start the quick setup wizard from welcome screen
 */
function startQuickSetup() {
    document.getElementById('welcomeScreen').classList.remove('active');
    document.getElementById('question1').classList.add('active');
    document.getElementById('modalHeaderText').textContent = 'Quick Setup - Step 1 of 4';
}

/**
 * Close wizard and use full form instead
 */
function useFullForm() {
    document.getElementById('guidedModalOverlay').style.display = 'none';
    document.body.classList.remove('modal-open');
    document.getElementById('mainContainer').classList.remove('blurred');
}

/**
 * Navigate back to welcome screen from question 1
 */
function goToWelcome() {
    document.getElementById('question1').classList.remove('active');
    document.getElementById('welcomeScreen').classList.add('active');
    document.getElementById('modalHeaderText').textContent = "Let's find your perfect game!";
}

/**
 * Navigate back to question 1 from question 2
 */
function goToQuestion1() {
    document.getElementById('question2').classList.remove('active');
    document.getElementById('question1').classList.add('active');
    document.getElementById('modalHeaderText').textContent = 'Quick Setup - Step 1 of 4';
}

/**
 * Navigate to question 2 from question 1
 */
function goToQuestion2() {
    document.getElementById('question1').classList.remove('active');
    document.getElementById('question2').classList.add('active');
    document.getElementById('modalHeaderText').textContent = 'Quick Setup - Step 2 of 4';
}

/**
 * Navigate to question 3 from question 2
 */
function goToQuestion3() {
    document.getElementById('question2').classList.remove('active');
    document.getElementById('question3').classList.add('active');
    document.getElementById('modalHeaderText').textContent = 'Quick Setup - Step 3 of 4';
}

/**
 * Navigate to question 4 from question 3
 */
function goToQuestion4() {
    document.getElementById('question3').classList.remove('active');
    document.getElementById('question4').classList.add('active');
    document.getElementById('modalHeaderText').textContent = 'Quick Setup - Step 4 of 4';
}

/**
 * Select a big option in wizard (energy/interruptibility)
 * @param {HTMLElement} element - The clicked option element
 * @param {string} stateKey - The state property to update
 */
function selectBigOption(element, stateKey) {
    // Deselect all siblings
    element.parentElement.querySelectorAll('.big-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Select this one
    element.classList.add('selected');
    state[stateKey] = element.getAttribute('data-value');
    
    // Enable next button based on which question we're on
    if (stateKey === 'guidedEnergy') {
        document.getElementById('q1NextBtn').disabled = false;
    } else if (stateKey === 'guidedInterruptibility') {
        document.getElementById('q4NextBtn').disabled = false;
    }
}

/**
 * Toggle mood chip selection in wizard
 * @param {HTMLElement} element - The clicked chip element
 */
function toggleMoodChip(element) {
    const value = element.getAttribute('data-value');
    
    if (element.classList.contains('selected')) {
        element.classList.remove('selected');
        state.guidedGoals = state.guidedGoals.filter(g => g !== value);
    } else {
        element.classList.add('selected');
        state.guidedGoals.push(value);
    }
    
    // Enable/disable submit button
    document.getElementById('q3NextBtn').disabled = state.guidedGoals.length === 0;
}

/**
 * Submit guided wizard and get recommendation
 */
function submitGuidedSetup() {
    // Map guided state to main form state
    state.energyLevel = state.guidedEnergy;
    state.availableMinutes = state.guidedTime;
    state.selectedGoals = [...state.guidedGoals];
    state.interruptibility = state.guidedInterruptibility;
    
    // Sync UI
    syncFormFromState();
    
    // Close modal
    document.getElementById('guidedModalOverlay').style.display = 'none';
    document.body.classList.remove('modal-open');
    document.getElementById('mainContainer').classList.remove('blurred');
    
    // Auto-submit
    getRecommendation();
}

/**
 * Sync main form UI from state (after wizard completion)
 */
function syncFormFromState() {
    // Sync emotional goals
    document.querySelectorAll('#emotionalGoals .chip').forEach(chip => {
        chip.classList.remove('selected');
        if (state.selectedGoals.includes(chip.getAttribute('data-value'))) {
            chip.classList.add('selected');
        }
    });
    
    // Sync genre preferences
    document.querySelectorAll('#genrePreferences .chip').forEach(chip => {
        chip.classList.remove('selected');
        if (state.selectedGenres.includes(chip.getAttribute('data-genre'))) {
            chip.classList.add('selected');
        }
    });
    
    // Sync time slider
    const timeIndex = TIME_VALUES.indexOf(state.availableMinutes);
    if (timeIndex !== -1) {
        document.getElementById('timeSlider').value = timeIndex;
        updateTimeDisplay(timeIndex);
    }
    
    // Sync energy level
    document.querySelectorAll('#energyLevel .radio-option').forEach(opt => {
        opt.classList.remove('selected');
        if (opt.getAttribute('data-value') === state.energyLevel) {
            opt.classList.add('selected');
        }
    });
    
    // Sync interruptibility
    document.querySelectorAll('#interruptibility .radio-option').forEach(opt => {
        opt.classList.remove('selected');
        if (opt.getAttribute('data-value') === state.interruptibility) {
            opt.classList.add('selected');
        }
    });
}

/**
 * Close Touch Grass modal
 * @param {boolean} keepSelection - Whether to keep the 3+ hours selection
 */
function closeTouchGrassModal(keepSelection) {
    const modal = document.getElementById('touchGrassModal');
    modal.style.display = 'none';
    
    if (!keepSelection) {
        // Reset to 3 hours (index 6)
        const timeSlider = document.getElementById('timeSlider');
        const guidedTimeSlider = document.getElementById('guidedTimeSlider');
        
        timeSlider.value = 6;
        guidedTimeSlider.value = 6;
        
        state.availableMinutes = 180;
        state.guidedTime = 180;
        
        updateTimeDisplay(6);
        document.getElementById('guidedTimeDisplay').textContent = TIME_LABELS[6];
    }
}

/**
 * Initialize wizard functionality
 */
function initWizard() {
    const wizardToggle = document.getElementById('wizardToggle');
    
    wizardToggle.addEventListener('click', () => {
        // Reset wizard to welcome screen
        document.querySelectorAll('.guided-question').forEach(q => q.classList.remove('active'));
        document.getElementById('welcomeScreen').classList.add('active');
        document.getElementById('modalHeaderText').textContent = "Let's find your perfect game!";
        
        // Show the modal
        document.getElementById('guidedModalOverlay').style.display = 'flex';
        document.body.classList.add('modal-open');
        document.getElementById('mainContainer').classList.add('blurred');
    });
    
    // Guided Time Slider
    document.getElementById('guidedTimeSlider').addEventListener('input', (e) => {
        const index = parseInt(e.target.value);
        state.guidedTime = TIME_VALUES[index];
        document.getElementById('guidedTimeDisplay').textContent = TIME_LABELS[index];
        
        // Show Touch Grass modal for 3+ hours
        if (index === 7) {
            document.getElementById('touchGrassModal').style.display = 'flex';
        }
    });
}
