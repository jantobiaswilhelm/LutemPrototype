/**
 * Lutem - API Module
 * Handles backend API communication and recommendation display
 * 
 * REQUIRES: config.js must be loaded BEFORE this module
 */

// API Configuration - now uses Config module for environment detection
const API_URL = Config.API_URL;
const API_BASE_URL = Config.API_BASE_URL;

// State for API interactions
let currentRecommendedGame = null; // Track currently recommended game for calendar integration
let usingDemoMode = false; // Track if we're in demo mode

/**
 * Get game recommendation from backend or demo mode
 */
async function getRecommendation() {
    const btn = document.getElementById('recommendBtn');
    const resultsPanel = document.getElementById('resultsPanel');
    
    // Run validation
    if (!validateForm()) {
        return; // Stop if validation fails
    }

    // Get random gaming quote
    const quote = getRandomQuote();

    // Show loading with quote
    btn.disabled = true;
    btn.textContent = '🎮 Finding your game...';
    resultsPanel.innerHTML = `
        <div class="loading-overlay">
            <div class="loading-spinner"></div>
            <div class="loading-quote">
                <div class="loading-quote-text">"${quote.text}"</div>
                <div class="loading-quote-game">— ${quote.game}</div>
            </div>
        </div>
    `;

    // Start timer for minimum 2 seconds display
    const startTime = Date.now();

    try {
        const requestBody = {
            availableMinutes: state.availableMinutes,
            desiredEmotionalGoals: state.selectedGoals,
            currentEnergyLevel: state.energyLevel,
            requiredInterruptibility: state.interruptibility,
            timeOfDay: state.timeOfDay,
            socialPreference: state.socialPreference,
            preferredGenres: state.selectedGenres.length > 0 ? state.selectedGenres : null
        };

        console.log('Request:', requestBody);

        let data;
        
        // Try backend first
        try {
            const response = await fetch(`${API_URL}/recommendations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            data = await response.json();
            usingDemoMode = false;
            console.log('✅ Backend Response:', data);
        } catch (backendError) {
            // Backend unavailable - use demo mode
            console.log('⚠️ Backend unavailable, using demo mode:', backendError.message);
            usingDemoMode = true;
            
            if (typeof getDemoRecommendation === 'function') {
                data = getDemoRecommendation(requestBody);
                // Map demo response to match backend format
                data = {
                    topRecommendation: data.game,
                    alternatives: data.alternatives || [],
                    reason: data.reason,
                    alternativeReasons: data.alternativeReasons || [],
                    matchPercentage: data.matchPercentage,
                    alternativeMatchPercentages: data.alternativeMatchPercentages || [],
                    sessionId: data.sessionId
                };
                console.log('🎮 Demo Mode Response:', data);
            } else {
                throw new Error('Demo mode not available');
            }
        }

        // Calculate remaining time to show spinner (minimum 2 seconds)
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 2000 - elapsedTime);

        // Wait for remaining time before showing results
        await new Promise(resolve => setTimeout(resolve, remainingTime));
        
        displayResults(data, usingDemoMode);
        
    } catch (error) {
        console.error('Error:', error);
        
        // Still respect minimum display time even on error
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 2000 - elapsedTime);
        await new Promise(resolve => setTimeout(resolve, remainingTime));
        
        resultsPanel.innerHTML = `
            <div class="placeholder">
                <div class="icon">❌</div>
                <p>Error getting recommendations</p>
                <p style="margin-top: 10px; font-size: 0.9em;">Please refresh the page and try again</p>
            </div>
        `;
    } finally {
        btn.disabled = false;
        btn.textContent = '🎮 Get Recommendation';
    }
}

/**
 * Get energy level display label
 * @param {string} level - Energy level code
 * @returns {string} Human-readable label
 */
function getEnergyLabel(level) {
    const labels = { 'HIGH': 'High Energy', 'MEDIUM': 'Medium', 'LOW': 'Low Energy' };
    return labels[level] || level;
}

/**
 * Get interruptibility display label
 * @param {string} level - Interruptibility level code
 * @returns {string} Human-readable label
 */
function getInterruptibilityLabel(level) {
    const labels = { 'HIGH': 'Very Flexible', 'MEDIUM': 'Moderate', 'LOW': 'Needs Completion' };
    return labels[level] || level;
}
