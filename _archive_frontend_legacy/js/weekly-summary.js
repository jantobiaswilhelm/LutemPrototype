/**
 * Lutem - Weekly Summary Module
 * Fetches and displays weekly gaming summary on home page
 * 
 * Backend endpoint: GET /api/users/{uid}/summary/weekly
 */

// ============================================
// FETCH WEEKLY SUMMARY
// ============================================

/**
 * Fetch weekly summary from backend
 * @param {string} uid - Firebase user ID
 * @returns {Promise<Object>} Weekly summary object
 */
async function fetchWeeklySummary(uid) {
    if (!uid) {
        console.warn('⚠️ No user ID provided for weekly summary');
        return null;
    }
    
    try {
        const response = await fetch(`${Config.API_URL}/api/users/${uid}/summary/weekly`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const summary = await response.json();
        console.log('📅 Weekly summary loaded:', summary);
        return summary;
    } catch (error) {
        console.warn('⚠️ Could not fetch weekly summary:', error.message);
        return null;
    }
}

// ============================================
// RENDER WEEKLY SUMMARY CARD
// ============================================

/**
 * Render weekly summary card on home page
 * @param {Object} summary - Weekly summary from backend
 */
function renderWeeklySummary(summary) {
    const container = document.getElementById('weeklySummarySection');
    if (!container) {
        console.warn('⚠️ weeklySummarySection not found in DOM');
        return;
    }
    
    // Empty state: no sessions this week
    if (!summary || summary.sessionsThisWeek === 0) {
        container.innerHTML = `
            <div class="weekly-summary-card empty">
                <div class="weekly-summary-header">
                    <span class="weekly-icon">📊</span>
                    <span class="weekly-title">Your Week</span>
                </div>
                <div class="weekly-empty-state">
                    <p>No gaming sessions yet this week.</p>
                    <p class="weekly-empty-hint">Get a recommendation below to start tracking!</p>
                </div>
            </div>
        `;
        container.style.display = 'block';
        return;
    }
    
    // Format data
    const avgRating = summary.averageSatisfaction 
        ? summary.averageSatisfaction.toFixed(1) 
        : '--';
    const totalHours = summary.totalPlaytimeMinutes 
        ? Math.round(summary.totalPlaytimeMinutes / 60 * 10) / 10 
        : 0;
    const playtimeDisplay = totalHours >= 1 
        ? `${totalHours}h` 
        : `${summary.totalPlaytimeMinutes || 0}m`;
    
    // Build mood badges
    const moodBadges = buildMoodBadges(summary.moodDistribution);
    
    // Build top game section
    const topGameHtml = summary.mostPlayedGame 
        ? `<div class="weekly-top-game">
               <span class="top-game-label">Most Played:</span>
               <span class="top-game-name">${summary.mostPlayedGame}</span>
               <span class="top-game-count">(${summary.mostPlayedCount}x)</span>
           </div>`
        : '';
    
    container.innerHTML = `
        <div class="weekly-summary-card">
            <div class="weekly-summary-header">
                <span class="weekly-icon">📊</span>
                <span class="weekly-title">Your Week</span>
                <span class="weekly-date-range">${formatDateRange(summary.weekStart, summary.weekEnd)}</span>
            </div>
            
            <div class="weekly-stats-row">
                <div class="weekly-stat">
                    <div class="weekly-stat-value">${summary.sessionsThisWeek}</div>
                    <div class="weekly-stat-label">Sessions</div>
                </div>
                <div class="weekly-stat">
                    <div class="weekly-stat-value">${playtimeDisplay}</div>
                    <div class="weekly-stat-label">Played</div>
                </div>
                <div class="weekly-stat highlight">
                    <div class="weekly-stat-value">${avgRating} ⭐</div>
                    <div class="weekly-stat-label">Avg Rating</div>
                </div>
            </div>
            
            ${moodBadges ? `<div class="weekly-moods">${moodBadges}</div>` : ''}
            ${topGameHtml}
        </div>
    `;
    container.style.display = 'block';
}

/**
 * Build mood distribution badges
 * @param {Object} moodDistribution - e.g., {"relax": 2, "focus": 1}
 */
function buildMoodBadges(moodDistribution) {
    if (!moodDistribution || Object.keys(moodDistribution).length === 0) {
        return '';
    }
    
    const moodEmojis = {
        'UNWIND': '😌',
        'RECHARGE': '🔋',
        'CHALLENGE': '⚡',
        'PROGRESS_ORIENTED': '🏆',
        'LOCKING_IN': '🎯',
        'ADVENTURE_TIME': '🗺️',
        'relax': '😌',
        'focus': '🎯',
        'energize': '⚡',
        'chill': '😴'
    };
    
    return Object.entries(moodDistribution)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([mood, count]) => {
            const emoji = moodEmojis[mood] || moodEmojis[mood.toUpperCase()] || '🎮';
            const displayName = mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase().replace('_', ' ');
            return `<span class="weekly-mood-badge">${emoji} ${displayName} (${count})</span>`;
        })
        .join('');
}

/**
 * Format date range for display
 */
function formatDateRange(weekStart, weekEnd) {
    if (!weekStart || !weekEnd) return '';
    
    try {
        const start = new Date(weekStart);
        const end = new Date(weekEnd);
        const options = { month: 'short', day: 'numeric' };
        return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
    } catch (e) {
        return '';
    }
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Load and display weekly summary for current user
 * Called when home page is shown
 */
async function loadWeeklySummary() {
    // Use window.authState which is set by auth.js
    const user = window.authState?.user;
    if (!user) {
        console.log('⏭️ No user logged in, hiding weekly summary');
        hideWeeklySummary();
        return;
    }
    
    const summary = await fetchWeeklySummary(user.uid);
    renderWeeklySummary(summary);
}

/**
 * Hide the weekly summary section
 */
function hideWeeklySummary() {
    const container = document.getElementById('weeklySummarySection');
    if (container) {
        container.style.display = 'none';
    }
}

// Make functions globally available
window.loadWeeklySummary = loadWeeklySummary;
window.fetchWeeklySummary = fetchWeeklySummary;
window.renderWeeklySummary = renderWeeklySummary;
window.hideWeeklySummary = hideWeeklySummary;

console.log('✅ Weekly Summary module loaded');
