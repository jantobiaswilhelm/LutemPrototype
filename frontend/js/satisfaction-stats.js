/**
 * Lutem - Satisfaction Stats Module
 * Fetches and displays user gaming satisfaction statistics from backend
 * 
 * Backend queries Firestore for session data and returns aggregated stats.
 */

// ============================================
// FETCH SATISFACTION STATS
// ============================================

/**
 * Fetch satisfaction statistics from backend
 * @param {string} uid - Firebase user ID
 * @returns {Promise<Object>} Satisfaction stats object
 */
async function fetchSatisfactionStats(uid) {
    if (!uid) {
        console.warn('⚠️ No user ID provided for satisfaction stats');
        return null;
    }
    
    try {
        const response = await fetch(`${Config.API_URL}/api/users/${uid}/satisfaction-stats`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const stats = await response.json();
        console.log('📊 Satisfaction stats loaded:', stats);
        return stats;
    } catch (error) {
        console.warn('⚠️ Could not fetch satisfaction stats:', error.message);
        return null;
    }
}

// ============================================
// DISPLAY STATS ON PROFILE PAGE
// ============================================

/**
 * Render satisfaction stats section on Profile page
 * @param {Object} stats - Satisfaction stats from backend
 */
function renderSatisfactionStats(stats) {
    const container = document.getElementById('satisfactionStatsSection');
    if (!container) {
        console.warn('⚠️ satisfactionStatsSection not found in DOM');
        return;
    }
    
    if (!stats || stats.completedSessions === 0) {
        container.innerHTML = `
            <div class="stats-empty-state">
                <div class="stats-empty-icon">📊</div>
                <h3>No Gaming Stats Yet</h3>
                <p>Complete a few gaming sessions to see your satisfaction insights!</p>
            </div>
        `;
        return;
    }
    
    const avgRating = stats.averageRating ? stats.averageRating.toFixed(1) : '0.0';
    const totalHours = Math.round(stats.totalPlaytimeMinutes / 60);
    const completionRate = stats.totalSessions > 0 
        ? Math.round((stats.completedSessions / stats.totalSessions) * 100) 
        : 0;
    
    container.innerHTML = `
        <div class="stats-section">
            <h2 class="stats-title">🎮 Your Gaming Stats</h2>
            
            <!-- Summary Cards -->
            <div class="stats-cards">
                <div class="stats-card">
                    <div class="stats-card-value">${stats.completedSessions}</div>
                    <div class="stats-card-label">Sessions Completed</div>
                </div>
                <div class="stats-card">
                    <div class="stats-card-value">${totalHours}h</div>
                    <div class="stats-card-label">Total Playtime</div>
                </div>
                <div class="stats-card highlight">
                    <div class="stats-card-value">${avgRating} ⭐</div>
                    <div class="stats-card-label">Avg Satisfaction</div>
                </div>
                <div class="stats-card">
                    <div class="stats-card-value">${completionRate}%</div>
                    <div class="stats-card-label">Completion Rate</div>
                </div>
            </div>
            
            <!-- Emotional Tags -->
            ${renderEmotionalTagsSection(stats)}
            
            <!-- Top Rated Games -->
            ${renderTopRatedGames(stats)}
            
            <!-- Insights -->
            ${renderInsights(stats)}
        </div>
    `;
}

/**
 * Render emotional tags distribution
 */
function renderEmotionalTagsSection(stats) {
    if (!stats.emotionalTagCounts || Object.keys(stats.emotionalTagCounts).length === 0) {
        return '';
    }
    
    const tagEmojis = {
        'RELAXING': '😌',
        'ENERGIZING': '⚡',
        'SATISFYING': '😊',
        'FRUSTRATING': '😤',
        'CHALLENGING': '🏆',
        'FUN': '🎉'
    };
    
    const sortedTags = Object.entries(stats.emotionalTagCounts)
        .sort((a, b) => b[1] - a[1]);
    
    const totalTags = sortedTags.reduce((sum, [_, count]) => sum + count, 0);
    
    const tagsHtml = sortedTags.map(([tag, count]) => {
        const percentage = Math.round((count / totalTags) * 100);
        const emoji = tagEmojis[tag] || '🎮';
        const displayName = tag.charAt(0) + tag.slice(1).toLowerCase();
        
        return `
            <div class="tag-stat">
                <div class="tag-stat-header">
                    <span class="tag-emoji">${emoji}</span>
                    <span class="tag-name">${displayName}</span>
                    <span class="tag-count">${count}</span>
                </div>
                <div class="tag-bar">
                    <div class="tag-bar-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');
    
    return `
        <div class="stats-subsection">
            <h3>How You Feel Gaming</h3>
            <div class="tags-distribution">
                ${tagsHtml}
            </div>
        </div>
    `;
}

/**
 * Render top rated games
 */
function renderTopRatedGames(stats) {
    if (!stats.topRatedGames || stats.topRatedGames.length === 0) {
        return '';
    }
    
    const gamesHtml = stats.topRatedGames.slice(0, 5).map((game, index) => `
        <div class="top-game-item">
            <span class="top-game-rank">#${index + 1}</span>
            <span class="top-game-name">${game.gameName}</span>
            <span class="top-game-rating">${game.averageRating.toFixed(1)} ⭐</span>
            <span class="top-game-sessions">(${game.sessionCount} sessions)</span>
        </div>
    `).join('');
    
    return `
        <div class="stats-subsection">
            <h3>Your Top Rated Games</h3>
            <div class="top-games-list">
                ${gamesHtml}
            </div>
        </div>
    `;
}

/**
 * Render personalized insights
 */
function renderInsights(stats) {
    const insights = [];
    
    // Best time of day
    if (stats.bestTimeOfDay) {
        const timeLabel = stats.bestTimeOfDay.charAt(0) + stats.bestTimeOfDay.slice(1).toLowerCase();
        const rating = stats.ratingsByTimeOfDay?.[stats.bestTimeOfDay];
        if (rating && rating >= 3.5) {
            insights.push(`🌟 You're happiest gaming in the <strong>${timeLabel}</strong> (${rating.toFixed(1)} avg rating)`);
        }
    }
    
    // Preferred session length
    if (stats.preferredSessionLength) {
        const lengthLabels = {
            'short': 'quick sessions (under 30 min)',
            'medium': 'medium sessions (30-60 min)',
            'long': 'long sessions (60+ min)'
        };
        const label = lengthLabels[stats.preferredSessionLength] || stats.preferredSessionLength;
        insights.push(`⏱️ You tend to enjoy <strong>${label}</strong>`);
    }
    
    // Top emotional tags
    if (stats.topEmotionalTags && stats.topEmotionalTags.length > 0) {
        const topTag = stats.topEmotionalTags[0].charAt(0) + stats.topEmotionalTags[0].slice(1).toLowerCase();
        insights.push(`😊 Most of your sessions feel <strong>${topTag}</strong>`);
    }
    
    // High-rated genres
    if (stats.ratingsByGenre) {
        const topGenre = Object.entries(stats.ratingsByGenre)
            .filter(([_, rating]) => rating >= 4.0)
            .sort((a, b) => b[1] - a[1])[0];
        
        if (topGenre) {
            insights.push(`🎮 You love <strong>${topGenre[0]}</strong> games (${topGenre[1].toFixed(1)} avg)`);
        }
    }
    
    if (insights.length === 0) {
        return '';
    }
    
    return `
        <div class="stats-subsection insights-section">
            <h3>✨ Personalized Insights</h3>
            <ul class="insights-list">
                ${insights.map(insight => `<li>${insight}</li>`).join('')}
            </ul>
        </div>
    `;
}


// ============================================
// INITIALIZATION
// ============================================

/**
 * Load and display satisfaction stats for current user
 * Called when Profile tab is shown
 */
async function loadSatisfactionStats() {
    const user = window.authState?.user;
    if (!user) {
        console.log('⚠️ No user logged in, skipping satisfaction stats');
        return;
    }
    
    const stats = await fetchSatisfactionStats(user.uid);
    if (stats) {
        renderSatisfactionStats(stats);
    }
}

// Make functions globally available
window.loadSatisfactionStats = loadSatisfactionStats;
window.fetchSatisfactionStats = fetchSatisfactionStats;
window.renderSatisfactionStats = renderSatisfactionStats;

console.log('✅ Satisfaction Stats module loaded');
