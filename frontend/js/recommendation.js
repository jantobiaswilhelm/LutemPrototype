/**
 * Lutem - Recommendation Display Module
 * Handles displaying game recommendations and user feedback
 */

// ============================================
// DISPLAY RESULTS
// ============================================

/**
 * Display recommendation results in the results panel
 * @param {Object} data - Recommendation response from API
 * @param {boolean} isDemo - Whether running in demo mode
 */
function displayResults(data, isDemo = false) {
    const resultsPanel = document.getElementById('resultsPanel');
    
    // Store sessionId for feedback tracking
    currentSessionId = data.sessionId || null;
    console.log('📊 Session ID stored:', currentSessionId);
    
    // Store demo mode state globally
    window.currentDemoMode = isDemo;
    
    // Store current recommended game for calendar integration
    currentRecommendedGame = data.topRecommendation;
    console.log('🎮 Current recommended game stored:', currentRecommendedGame);
    
    if (!data.topRecommendation || data.topRecommendation.id === 0) {
        resultsPanel.innerHTML = `
            <div class="placeholder">
                <div class="icon">🤔</div>
                <p>No perfect match found</p>
                <p style="margin-top: 10px; font-size: 0.9em;">Try adjusting your preferences</p>
            </div>
        `;
        return;
    }

    let html = buildTopRecommendationHTML(data, isDemo);
    html += buildAlternativesHTML(data);
    html += `</div>`;
    
    resultsPanel.innerHTML = html;
}

/**
 * Build HTML for the top recommendation card
 */
function buildTopRecommendationHTML(data, isDemo) {
    const game = data.topRecommendation;
    const reason = data.reason || 'Great match for you';
    const matchPercentage = data.topMatchPercentage || 95;
    
    return `
        ${isDemo ? buildDemoModeBanner() : ''}
        <div class="results-content" style="animation: fadeIn 0.5s;">
            <!-- TOP RECOMMENDATION -->
            <div class="result-card top-pick game-card-clickable" onclick='openMaximizedGame(${JSON.stringify(game)}, ${JSON.stringify(reason)}, ${matchPercentage})'>
                <div class="top-pick-badge">
                    <span class="badge-icon">👑</span>
                    <span class="badge-text">Top Pick</span>
                </div>
                
                <div class="game-image-container">
                    <img src="${getGameImageUrl(game)}" 
                         alt="${game.name}"
                         class="game-image"
                         loading="eager"
                         onerror="this.onerror=null; this.src='${getFallbackImageUrl('No Image')}';">
                    <div class="match-percentage">${matchPercentage}% Match</div>
                </div>
                
                <div class="result-content">
                    <div class="game-title-header">
                        <h3 class="game-title">${game.name}</h3>
                        <div class="game-actions">
                            ${game.storeUrl ? `
                                <button class="action-btn store-btn" 
                                        onclick="event.stopPropagation(); window.open('${game.storeUrl}', '_blank')" 
                                        title="View in ${game.storePlatform || 'store'}">
                                    🛒
                                </button>
                            ` : ''}
                            <button class="action-btn favorite" 
                                    onclick="event.stopPropagation(); toggleFavorite(this, ${game.id})" 
                                    title="Add to favorites">
                                ♡
                            </button>
                        </div>
                    </div>
                    <p class="game-genre">${game.genre || 'Game'}</p>
                    <p class="game-description">${game.description || ''}</p>
                    
                    ${buildGameMetaHTML(game)}
                    
                    <div class="match-reason">
                        <strong>Why this works:</strong> ${reason}
                    </div>
                    
                    ${buildFeedbackSectionHTML(game.id, data.sessionId)}
                </div>
            </div>
    `;
}


/**
 * Build demo mode banner HTML
 */
function buildDemoModeBanner() {
    return `
        <div class="demo-mode-banner" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 12px 20px; border-radius: 12px; margin-bottom: 20px; text-align: center; font-size: 0.95em; box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3);">
            <span style="font-size: 1.2em;">✨</span> <strong>Demo Mode</strong> — Running without backend. Feedback saved locally.
            <a href="https://github.com/jantobiaswilhelm/LutemPrototype" target="_blank" style="color: white; margin-left: 10px; text-decoration: underline;">View on GitHub</a>
        </div>
    `;
}

/**
 * Get game image URL with fallback
 */
function getGameImageUrl(game) {
    if (game.imageUrl) return game.imageUrl;
    return getFallbackImageUrl(game.name);
}

/**
 * Get fallback image URL for games without images
 */
function getFallbackImageUrl(text, width = 460, height = 215) {
    return `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22${width}%22 height=%22${height}%22%3E%3Crect fill=%22%23667eea%22 width=%22${width}%22 height=%22${height}%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2224%22 fill=%22white%22%3E🎮 ${encodeURIComponent(text)}%3C/text%3E%3C/svg%3E`;
}

/**
 * Build game meta information HTML
 */
function buildGameMetaHTML(game) {
    return `
        <div class="game-meta">
            <div class="meta-item">
                <span class="meta-icon">⏱️</span>
                <span>${game.minMinutes}-${game.maxMinutes} min</span>
            </div>
            <div class="meta-item">
                <span class="meta-icon">⚡</span>
                <span>${getEnergyLabel(game.energyRequired)}</span>
            </div>
            <div class="meta-item">
                <span class="meta-icon">⏸️</span>
                <span>${getInterruptibilityLabel(game.interruptibility)}</span>
            </div>
            ${game.userRating > 0 ? `
            <div class="meta-item">
                <span class="meta-icon">⭐</span>
                <span>${game.userRating.toFixed(1)}/5</span>
            </div>
            ` : ''}
        </div>
    `;
}

/**
 * Build feedback section HTML
 */
function buildFeedbackSectionHTML(gameId, sessionId) {
    return `
        <div class="feedback-section">
            <p style="margin-bottom: 10px; font-weight: 600;">How was this recommendation?</p>
            <div class="feedback-buttons">
                ${[1,2,3,4,5].map(score => `
                    <button class="feedback-btn" onclick="event.stopPropagation(); submitFeedback(event, ${gameId}, ${score}, ${sessionId || 'null'})">
                        ${score === 1 ? '😞' : score === 2 ? '😕' : score === 3 ? '😐' : score === 4 ? '😊' : '🤩'}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Build alternatives section HTML
 */
function buildAlternativesHTML(data) {
    if (!data.alternatives || data.alternatives.length === 0) {
        return '';
    }
    
    let html = `
        <div class="alternatives-section">
            <h3 class="alternatives-title">Also Consider</h3>
            <div class="alternatives-grid">
    `;

    data.alternatives.forEach((game, index) => {
        const matchPercentage = data.alternativeMatchPercentages && data.alternativeMatchPercentages[index] 
            ? data.alternativeMatchPercentages[index] 
            : 85 - (index * 5);
        const reason = data.alternativeReasons[index] || 'Great alternative';
        
        html += buildAlternativeCardHTML(game, reason, matchPercentage);
    });

    html += `
            </div>
        </div>
    `;
    
    return html;
}


/**
 * Build single alternative card HTML
 */
function buildAlternativeCardHTML(game, reason, matchPercentage) {
    const fallbackUrl = `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22140%22%3E%3Crect fill=%22%23764ba2%22 width=%22300%22 height=%22140%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2216%22 fill=%22white%22%3E🎮 ${encodeURIComponent(game.name)}%3C/text%3E%3C/svg%3E`;
    
    return `
        <div class="alternative-card alternative-card-clickable" onclick='openMaximizedGame(${JSON.stringify(game)}, ${JSON.stringify(reason)}, ${matchPercentage})'>
            <div style="position: relative;">
                <img src="${game.imageUrl || fallbackUrl}" 
                     alt="${game.name}"
                     class="alternative-image"
                     loading="lazy"
                     onerror="this.onerror=null; this.src='${fallbackUrl}';">
                <div class="match-percentage" style="position: absolute; bottom: 10px; left: 10px; font-size: 0.85em;">${matchPercentage}% Match</div>
            </div>
            <div class="alternative-content">
                <div class="game-title-header" style="margin-bottom: 5px;">
                    <h4 style="margin: 0;">${game.name}</h4>
                    <div class="game-actions">
                        ${game.storeUrl ? `
                            <button class="action-btn store-btn" style="width: 32px; height: 32px; font-size: 1em;"
                                    onclick="event.stopPropagation(); window.open('${game.storeUrl}', '_blank')" 
                                    title="View in ${game.storePlatform || 'store'}">
                                🛒
                            </button>
                        ` : ''}
                        <button class="action-btn favorite" style="width: 32px; height: 32px; font-size: 1em;"
                                onclick="event.stopPropagation(); toggleFavorite(this, ${game.id})" 
                                title="Add to favorites">
                            ♡
                        </button>
                    </div>
                </div>
                <p class="alternative-genre">${game.genre || 'Game'}</p>
                <p class="alternative-reason">${reason}</p>
                <div class="alternative-meta">
                    <span>⏱️ ${game.minMinutes}-${game.maxMinutes}min</span>
                    <span>⚡ ${getEnergyLabel(game.energyRequired)}</span>
                    ${game.userRating > 0 ? `<span>⭐ ${game.userRating.toFixed(1)}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

// ============================================
// FEEDBACK FUNCTIONS
// ============================================

/**
 * Submit feedback for a game recommendation
 */
async function submitFeedback(event, gameId, score, sessionId = null) {
    try {
        // Use passed sessionId or fall back to global currentSessionId
        const effectiveSessionId = sessionId || currentSessionId;
        
        console.log('💬 Submitting feedback:', {
            sessionId: effectiveSessionId,
            gameId: gameId,
            score: score,
            demoMode: usingDemoMode
        });
        
        let success = false;
        
        // Try backend first (unless we know we're in demo mode)
        if (!usingDemoMode) {
            try {
                const response = await fetch(`${API_URL}/sessions/feedback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sessionId: effectiveSessionId,
                        gameId: gameId,
                        satisfactionScore: score
                    })
                });
                
                if (response.ok) {
                    const result = await response.json();
                    console.log('✅ Feedback saved to backend:', result);
                    success = true;
                }
            } catch (backendError) {
                console.log('⚠️ Backend unavailable for feedback, using demo mode');
            }
        }
        
        // Use demo mode if backend failed or unavailable
        if (!success && typeof submitDemoFeedback === 'function') {
            submitDemoFeedback(gameId, score);
            console.log('✅ Feedback saved to demo mode');
            success = true;
        }

        if (success) {
            // Show success feedback
            const feedbackSection = event.target.closest('.feedback-section');
            feedbackSection.innerHTML = `
                <p style="color: var(--mood-achieve); font-weight: 600;">
                    ✅ Thanks for your feedback!${usingDemoMode ? ' (saved locally)' : ''}
                </p>
            `;
        }
    } catch (error) {
        console.error('Feedback error:', error);
    }
}


/**
 * Toggle favorite button state
 */
function toggleFavorite(button, gameId) {
    button.classList.toggle('active');
    
    if (button.classList.contains('active')) {
        button.textContent = '♥';
        console.log('Added to favorites:', gameId);
        // TODO: Implement actual favorite functionality
    } else {
        button.textContent = '♡';
        console.log('Removed from favorites:', gameId);
        // TODO: Implement actual unfavorite functionality
    }
}

// ============================================
// MAXIMIZED GAME VIEW
// ============================================

/**
 * Open maximized game detail view
 */
function openMaximizedGame(game, reason, matchPercentage) {
    const overlay = document.getElementById('gameMaximizedOverlay');
    const content = document.getElementById('maximizedGameContent');
    
    content.innerHTML = buildMaximizedGameHTML(game, reason, matchPercentage);
    overlay.style.display = 'flex';
    document.body.classList.add('modal-open');
}

/**
 * Build maximized game view HTML
 */
function buildMaximizedGameHTML(game, reason, matchPercentage) {
    const fallbackUrl = getFallbackImageUrl(game.name, 400, 225);
    
    return `
        <div class="maximized-game-header">
            <img src="${game.imageUrl || fallbackUrl}" 
                 alt="${game.name}"
                 class="maximized-game-image"
                 onerror="this.onerror=null; this.src='${getFallbackImageUrl('No Image', 400, 225)}';">
            <div class="maximized-game-info">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 15px; margin-bottom: 10px;">
                    <h2 class="maximized-game-title" style="margin-bottom: 0;">${game.name}</h2>
                    <div class="game-actions">
                        ${game.storeUrl ? `
                            <button class="action-btn store-btn"
                                    onclick="event.stopPropagation(); window.open('${game.storeUrl}', '_blank')" 
                                    title="View in ${game.storePlatform || 'store'}">
                                🛒
                            </button>
                        ` : ''}
                        <button class="action-btn favorite"
                                onclick="event.stopPropagation(); toggleFavorite(this, ${game.id})" 
                                title="Add to favorites">
                            ♡
                        </button>
                    </div>
                </div>
                <p class="maximized-game-genre">${game.genre || 'Game'}</p>
                <div class="maximized-game-meta">
                    <div class="maximized-meta-badge">
                        <span>📊</span>
                        <span>${matchPercentage || 95}% Match</span>
                    </div>
                    <div class="maximized-meta-badge">
                        <span>⏱️</span>
                        <span>${game.minMinutes}-${game.maxMinutes} min</span>
                    </div>
                    <div class="maximized-meta-badge">
                        <span>⚡</span>
                        <span>${getEnergyLabel(game.energyRequired)}</span>
                    </div>
                    <div class="maximized-meta-badge">
                        <span>⏸️</span>
                        <span>${getInterruptibilityLabel(game.interruptibility)}</span>
                    </div>
                    ${game.userRating > 0 ? `
                    <div class="maximized-meta-badge">
                        <span>⭐</span>
                        <span>${game.userRating.toFixed(1)}/5</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
        
        <div class="maximized-game-reason">
            <h3>Why this game is perfect for you right now</h3>
            <p>${reason}</p>
        </div>
        
        ${game.description ? `
            <div style="margin: 30px 0;">
                <h3 style="color: var(--accent-primary); margin-bottom: 12px;">About this game</h3>
                <p style="color: var(--text-secondary); line-height: 1.7;">${game.description}</p>
            </div>
        ` : ''}
        
        <div class="maximized-feedback-section">
            <h3 style="margin-bottom: 15px;">How satisfied were you?</h3>
            <div class="feedback-buttons">
                <button class="feedback-btn" onclick="event.stopPropagation(); submitFeedbackInModal(${game.id}, 1)">😞</button>
                <button class="feedback-btn" onclick="event.stopPropagation(); submitFeedbackInModal(${game.id}, 2)">😕</button>
                <button class="feedback-btn" onclick="event.stopPropagation(); submitFeedbackInModal(${game.id}, 3)">😐</button>
                <button class="feedback-btn" onclick="event.stopPropagation(); submitFeedbackInModal(${game.id}, 4)">😊</button>
                <button class="feedback-btn" onclick="event.stopPropagation(); submitFeedbackInModal(${game.id}, 5)">🤩</button>
            </div>
        </div>
    `;
}


/**
 * Submit feedback from within the maximized modal
 */
async function submitFeedbackInModal(gameId, score) {
    try {
        console.log('💬 Submitting feedback in modal:', {
            sessionId: currentSessionId,
            gameId: gameId,
            score: score
        });
        
        const response = await fetch(`${API_URL}/sessions/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: currentSessionId,
                gameId: gameId,
                satisfactionScore: score
            })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Modal feedback saved:', result);
            
            // Update the feedback section in the modal
            const feedbackSection = document.querySelector('.maximized-feedback-section');
            if (feedbackSection) {
                feedbackSection.innerHTML = `
                    <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, rgba(102, 195, 131, 0.1), rgba(76, 209, 55, 0.1)); border-radius: 12px;">
                        <div style="font-size: 3em; margin-bottom: 10px;">✅</div>
                        <h3 style="color: var(--mood-achieve); margin-bottom: 10px;">Thanks for your feedback!</h3>
                        <p style="color: var(--text-secondary);">Your rating of ${score}/5 helps us improve recommendations</p>
                    </div>
                `;
            }
            
            // Auto-close modal after 2 seconds
            setTimeout(() => {
                closeMaximizedGame();
            }, 2000);
        }
    } catch (error) {
        console.error('Feedback error in modal:', error);
        const feedbackSection = document.querySelector('.maximized-feedback-section');
        if (feedbackSection) {
            feedbackSection.innerHTML = `
                <div style="text-align: center; padding: 20px; background: rgba(231, 76, 60, 0.1); border-radius: 12px;">
                    <p style="color: #e74c3c;">❌ Failed to submit feedback. Please try again.</p>
                </div>
            `;
        }
    }
}

/**
 * Close the maximized game view
 */
function closeMaximizedGame() {
    const overlay = document.getElementById('gameMaximizedOverlay');
    overlay.style.display = 'none';
    document.body.classList.remove('modal-open');
}

/**
 * Initialize maximized game view event listeners
 * Called from main.js on DOMContentLoaded
 */
function initMaximizedGameEvents() {
    // Close maximized view when clicking outside
    const overlay = document.getElementById('gameMaximizedOverlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeMaximizedGame();
            }
        });
    }

    // Close maximized view with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const overlay = document.getElementById('gameMaximizedOverlay');
            if (overlay && overlay.style.display === 'flex') {
                closeMaximizedGame();
            }
        }
    });
}
