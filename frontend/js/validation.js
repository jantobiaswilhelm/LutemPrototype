/**
 * Lutem - Validation Module
 * Form validation logic
 */

// Enable live validation after first submit attempt
let validationEnabled = false;

/**
 * Validate the main recommendation form
 * @returns {boolean} Whether the form is valid
 */
function validateForm() {
    let isValid = true;
    const errors = [];

    // Clear previous validation states
    document.querySelectorAll('.input-group').forEach(group => {
        group.classList.remove('error', 'valid', 'shake');
        const existingMessage = group.querySelector('.validation-message');
        if (existingMessage) existingMessage.remove();
    });

    // 1. Validate Emotional Goals
    const goalsElement = document.querySelector('#emotionalGoals');
    const goalsGroup = goalsElement ? goalsElement.closest('.input-group') : null;
    
    if (goalsGroup) {
        if (state.selectedGoals.length === 0) {
            isValid = false;
            errors.push('Please select at least one emotional goal');
            markFieldAsError(goalsGroup, '⚠️ Pick what you want to feel');
        } else if (validationEnabled) {
            markFieldAsValid(goalsGroup, '✓ Got it!');
        }
    } else {
        console.warn('Validation: #emotionalGoals element or parent .input-group not found');
    }

    // 2. Validate Energy Level
    const energyElement = document.querySelector('#energyLevel');
    const energyGroup = energyElement ? energyElement.closest('.input-group') : null;
    
    if (energyGroup) {
        if (!state.energyLevel) {
            isValid = false;
            errors.push('Please select your energy level');
            markFieldAsError(energyGroup, '⚠️ How are you feeling?');
        } else if (validationEnabled) {
            markFieldAsValid(energyGroup, '✓ Perfect!');
        }
    } else {
        console.warn('Validation: #energyLevel element or parent .input-group not found');
    }

    // 3. Validate Interruptibility
    const interruptElement = document.querySelector('#interruptibility');
    const interruptibilityGroup = interruptElement ? interruptElement.closest('.input-group') : null;
    
    if (interruptibilityGroup) {
        if (!state.interruptibility) {
            isValid = false;
            errors.push('Please select if you can pause anytime');
            markFieldAsError(interruptibilityGroup, '⚠️ Can you pause anytime?');
        } else if (validationEnabled) {
            markFieldAsValid(interruptibilityGroup, '✓ Good to know!');
        }
    } else {
        console.warn('Validation: #interruptibility element or parent .input-group not found');
    }

    // If validation fails on first submit, enable live validation
    if (!isValid && !validationEnabled) {
        validationEnabled = true;
        
        // Scroll to first error
        const firstError = document.querySelector('.input-group.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    return isValid;
}

/**
 * Mark a form field as having an error
 * @param {HTMLElement} groupElement - The input group element
 * @param {string} message - Error message to display
 */
function markFieldAsError(groupElement, message) {
    if (!groupElement) {
        console.warn('markFieldAsError: groupElement is null');
        return;
    }
    
    groupElement.classList.add('error', 'shake');
    groupElement.classList.remove('valid');
    
    const messageEl = document.createElement('div');
    messageEl.className = 'validation-message error';
    messageEl.innerHTML = `<span class="validation-icon">⚠️</span><span>${message}</span>`;
    groupElement.appendChild(messageEl);
}

/**
 * Mark a form field as valid
 * @param {HTMLElement} groupElement - The input group element
 * @param {string} message - Success message to display
 */
function markFieldAsValid(groupElement, message) {
    if (!groupElement) {
        console.warn('markFieldAsValid: groupElement is null');
        return;
    }
    
    groupElement.classList.add('valid');
    groupElement.classList.remove('error');
    
    const messageEl = document.createElement('div');
    messageEl.className = 'validation-message success';
    messageEl.innerHTML = `<span class="validation-icon">✓</span><span>${message}</span>`;
    groupElement.appendChild(messageEl);
}

/**
 * Trigger validation if live validation is enabled
 */
function triggerValidationIfEnabled() {
    if (validationEnabled) {
        validateForm();
    }
}
