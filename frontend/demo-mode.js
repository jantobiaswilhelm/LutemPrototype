// ============================================
// LUTEM - Demo Mode Engine
// Provides offline recommendation algorithm when backend unavailable
// ============================================

// Demo mode state
let isDemoMode = false;
let demoFeedback = {}; // localStorage key: 'lutem_demo_feedback'

// Initialize demo mode
function initDemoMode() {
    // Load feedback from localStorage
    try {
        const stored = localStorage.getItem('lutem_demo_feedback');
        if (stored) {
            demoFeedback = JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Could not load demo feedback from localStorage');
    }
    console.log('🎮 Demo mode initialized with', Object.keys(demoFeedback).length, 'feedback entries');
}

// Save feedback to localStorage
function saveDemoFeedback() {
    try {
        localStorage.setItem('lutem_demo_feedback', JSON.stringify(demoFeedback));
    } catch (e) {
        console.warn('Could not save demo feedback to localStorage');
    }
}

// Get average satisfaction for a game from demo feedback
function getDemoAverageSatisfaction(gameId) {
    const scores = demoFeedback[gameId];
    if (!scores || scores.length === 0) return 0;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
}

// Score a single game based on request parameters
function scoreGameDemo(game, request) {
    let score = 0;
    const matchReasons = [];

    // 1. TIME MATCH (30%)
    if (game.minMinutes > request.availableMinutes) {
        return { score: 0, reason: "Too long for available time" };
    }
    
    if (game.maxMinutes <= request.availableMinutes) {
        score += 30;
        matchReasons.push(`Fits your ${request.availableMinutes}-minute window`);
    } else if (game.minMinutes <= request.availableMinutes) {
        score += 20;
        matchReasons.push(`Can start in ${request.availableMinutes} minutes`);
    }

    // 2. EMOTIONAL GOAL MATCH (25%)
    if (request.desiredEmotionalGoals && request.desiredEmotionalGoals.length > 0) {
        for (const goal of request.desiredEmotionalGoals) {
            if (game.emotionalGoals.includes(goal)) {
                score += 25 / request.desiredEmotionalGoals.length;
                const goalNames = {
                    'UNWIND': 'unwinding',
                    'RECHARGE': 'recharging',
                    'LOCKING_IN': 'locking in',
                    'CHALLENGE': 'a challenge',
                    'ADVENTURE_TIME': 'adventure',
                    'PROGRESS_ORIENTED': 'progress'
                };
                matchReasons.push(`Great for ${goalNames[goal] || goal.toLowerCase()}`);
            }
        }
    }

    // 3. INTERRUPTIBILITY MATCH (20%)
    if (request.requiredInterruptibility) {
        const interruptOrder = ['LOW', 'MEDIUM', 'HIGH'];
        const gameLevel = interruptOrder.indexOf(game.interruptibility);
        const reqLevel = interruptOrder.indexOf(request.requiredInterruptibility);
        
        if (game.interruptibility === request.requiredInterruptibility) {
            score += 20;
            const descriptions = {
                'HIGH': 'Pause anytime',
                'MEDIUM': 'Can pause between rounds',
                'LOW': 'Complete sessions preferred'
            };
            matchReasons.push(descriptions[game.interruptibility]);
        } else if (gameLevel >= reqLevel) {
            score += 15;
            matchReasons.push('Easy to pause when needed');
        } else {
            score -= 10;
        }
    }

    // 4. ENERGY LEVEL MATCH (15%)
    if (request.currentEnergyLevel) {
        const energyOrder = ['LOW', 'MEDIUM', 'HIGH'];
        const gameEnergy = energyOrder.indexOf(game.energyRequired);
        const reqEnergy = energyOrder.indexOf(request.currentEnergyLevel);
        
        if (game.energyRequired === request.currentEnergyLevel) {
            score += 15;
            matchReasons.push(`Perfect for your ${game.energyRequired.toLowerCase()} energy level`);
        } else if (gameEnergy < reqEnergy) {
            score += 12;
            matchReasons.push("Won't drain your energy");
        } else {
            score -= 5;
        }
    }

    // 5. TIME OF DAY MATCH (5%)
    if (request.timeOfDay) {
        if (game.bestTimeOfDay.includes(request.timeOfDay) || game.bestTimeOfDay.includes('ANY')) {
            score += 5;
            const timeNames = {
                'MORNING': 'morning',
                'MIDDAY': 'midday',
                'AFTERNOON': 'afternoon',
                'EVENING': 'evening',
                'LATE_NIGHT': 'late night'
            };
            matchReasons.push(`Ideal for ${timeNames[request.timeOfDay] || 'now'}`);
        }
    }

    // 6. SOCIAL PREFERENCE MATCH (5%)
    if (request.socialPreference) {
        const socialMatches = game.socialPreferences.includes(request.socialPreference) ||
                            game.socialPreferences.includes('BOTH');
        if (socialMatches) {
            score += 5;
            const socialNames = {
                'SOLO': 'solo',
                'COOP': 'co-op',
                'COMPETITIVE': 'competitive'
            };
            matchReasons.push(`Perfect for ${socialNames[request.socialPreference] || ''} play`);
        } else {
            score -= 5;
        }
    }

    // 7. SATISFACTION BONUS (max 10%)
    const avg = getDemoAverageSatisfaction(game.id);
    if (avg > 0) {
        score += (avg / 5) * 10;
        if (avg >= 4) {
            matchReasons.push(`You've loved this before (${avg.toFixed(1)}/5 ⭐)`);
        } else if (avg >= 3.5) {
            matchReasons.push('Previously enjoyed by you');
        }
    }

    // 8. GENRE PREFERENCE BOOST (max 15%)
    if (request.preferredGenres && request.preferredGenres.length > 0) {
        const matchedGenres = game.genres.filter(genre =>
            request.preferredGenres.some(pref => pref.toLowerCase() === genre.toLowerCase())
        );
        if (matchedGenres.length > 0) {
            const genreBonus = (matchedGenres.length / request.preferredGenres.length) * 15;
            score += genreBonus;
            matchReasons.push(`Matches your taste: ${matchedGenres.join(', ')}`);
        }
    }

    // Build reason summary
    let reason;
    if (matchReasons.length === 0) {
        reason = 'Available game for your time slot';
    } else if (matchReasons.length <= 3) {
        reason = matchReasons.join(' • ');
    } else {
        reason = matchReasons.slice(0, 3).join(' • ');
    }

    return { score, reason };
}

// Main demo recommendation function
function getDemoRecommendation(request) {
    console.log('🎮 Demo Mode: Processing recommendation request', request);
    
    if (!window.DEMO_GAMES || window.DEMO_GAMES.length === 0) {
        console.error('Demo games not loaded!');
        return {
            game: { id: 0, name: 'Error', description: 'Demo data not loaded' },
            alternatives: [],
            reason: 'Please refresh the page',
            alternativeReasons: []
        };
    }

    // Score all games
    const scoredGames = [];
    for (const game of window.DEMO_GAMES) {
        const result = scoreGameDemo(game, request);
        if (result.score > 0) {
            scoredGames.push({ game, ...result });
        }
    }

    // Sort by score (descending)
    scoredGames.sort((a, b) => b.score - a.score);

    if (scoredGames.length === 0) {
        return {
            game: { id: 0, name: 'No Match Found', description: 'Try adjusting your preferences' },
            alternatives: [],
            reason: 'No games fit your current criteria - try adjusting your preferences',
            alternativeReasons: [],
            matchPercentage: 0
        };
    }

    // Get top recommendation and alternatives
    const top = scoredGames[0];
    const alternatives = scoredGames.slice(1, 5).map(s => s.game);
    const alternativeReasons = scoredGames.slice(1, 5).map(s => s.reason);
    
    // Calculate match percentages
    const maxScore = top.score;
    const matchPercentage = Math.min(100, Math.max(50, Math.round((top.score / maxScore) * 100)));
    const alternativeMatchPercentages = scoredGames.slice(1, 5).map(s => 
        Math.min(100, Math.max(50, Math.round((s.score / maxScore) * 100)))
    );

    // Generate a fake session ID for demo mode
    const sessionId = `demo_${Date.now()}`;

    console.log(`🎮 Demo Mode: Recommending "${top.game.name}" with score ${top.score.toFixed(1)}`);

    return {
        game: top.game,
        alternatives,
        reason: top.reason,
        alternativeReasons,
        matchPercentage,
        alternativeMatchPercentages,
        sessionId
    };
}

// Submit demo feedback
function submitDemoFeedback(gameId, satisfactionScore) {
    if (!demoFeedback[gameId]) {
        demoFeedback[gameId] = [];
    }
    demoFeedback[gameId].push(satisfactionScore);
    saveDemoFeedback();
    console.log(`🎮 Demo Mode: Recorded feedback for game ${gameId}: ${satisfactionScore}/5`);
    return { status: 'success', message: 'Feedback recorded (demo mode)' };
}

// Get all games for demo mode
function getDemoGames() {
    return window.DEMO_GAMES || [];
}

// Check if backend is available
async function checkBackendAvailable() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        const response = await fetch('http://localhost:8080/games', {
            method: 'GET',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return response.ok;
    } catch (e) {
        return false;
    }
}

// Initialize on load
if (typeof window !== 'undefined') {
    window.getDemoRecommendation = getDemoRecommendation;
    window.submitDemoFeedback = submitDemoFeedback;
    window.getDemoGames = getDemoGames;
    window.checkBackendAvailable = checkBackendAvailable;
    window.isDemoMode = false;
    
    // Auto-init
    initDemoMode();
}
