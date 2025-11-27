// ============================================
// GAMES LIBRARY FUNCTIONALITY
// ============================================

let allGames = [];
let filteredGames = [];

/**
 * Load games from backend or demo mode
 */
async function loadGamesLibrary() {
    const gamesGrid = document.getElementById('gamesGrid');
    const gamesLoading = document.getElementById('gamesLoading');
    const gamesEmpty = document.getElementById('gamesEmpty');
    
    // Don't reload if already loaded
    if (allGames.length > 0) {
        return;
    }
    
    // Show loading
    gamesGrid.style.display = 'none';
    gamesEmpty.style.display = 'none';
    gamesLoading.style.display = 'block';
    
    try {
        // Try backend first
        try {
            const response = await fetch(`${API_URL}/games`);
            if (!response.ok) throw new Error('Failed to fetch games');
            allGames = await response.json();
            console.log('✅ Games loaded from backend:', allGames.length);
        } catch (backendError) {
            // Use demo mode
            console.log('⚠️ Backend unavailable, using demo games');
            if (typeof getDemoGames === 'function') {
                allGames = getDemoGames();
                console.log('🎮 Demo games loaded:', allGames.length);
            } else {
                throw new Error('Demo mode not available');
            }
        }
        
        filteredGames = [...allGames];
        
        // Populate genre filter
        populateGenreFilter();
        
        // Render games
        renderGames();
        
        // Setup filter event listeners
        setupFilterListeners();
        
    } catch (error) {
        console.error('Error loading games:', error);
        gamesLoading.style.display = 'none';
        gamesEmpty.style.display = 'block';
        document.querySelector('#gamesEmpty h3').textContent = 'Failed to load games';
        document.querySelector('#gamesEmpty p').textContent = 'Please try again later';
    }
}

/**
 * Populate genre filter dropdown with unique genres from games
 */
function populateGenreFilter() {
    const genreFilter = document.getElementById('genreFilter');
    const genres = new Set();
    
    allGames.forEach(game => {
        if (game.genres && Array.isArray(game.genres)) {
            game.genres.forEach(genre => genres.add(genre));
        }
    });
    
    // Sort genres alphabetically
    Array.from(genres).sort().forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });
}

/**
 * Setup event listeners for filter controls
 */
function setupFilterListeners() {
    const searchInput = document.getElementById('gameSearch');
    const genreFilter = document.getElementById('genreFilter');
    const moodFilter = document.getElementById('moodFilter');
    const timeFilter = document.getElementById('timeFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    searchInput.addEventListener('input', applyFilters);
    genreFilter.addEventListener('change', applyFilters);
    moodFilter.addEventListener('change', applyFilters);
    timeFilter.addEventListener('change', applyFilters);
    
    clearFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        genreFilter.value = '';
        moodFilter.value = '';
        timeFilter.value = '';
        applyFilters();
    });
}

/**
 * Apply all filters and update the games display
 */
function applyFilters() {
    const searchTerm = document.getElementById('gameSearch').value.toLowerCase();
    const selectedGenre = document.getElementById('genreFilter').value;
    const selectedMood = document.getElementById('moodFilter').value;
    const selectedTime = document.getElementById('timeFilter').value;
    
    filteredGames = allGames.filter(game => {
        // Search filter
        const matchesSearch = !searchTerm || 
            game.name.toLowerCase().includes(searchTerm) ||
            (game.description && game.description.toLowerCase().includes(searchTerm));
        
        // Genre filter
        const matchesGenre = !selectedGenre || 
            (game.genres && game.genres.includes(selectedGenre));
        
        // Mood filter - handles both string arrays and object arrays
        const matchesMood = !selectedMood || 
            (game.emotionalGoals && game.emotionalGoals.some(goal => {
                // Handle both formats: strings like "UNWIND" or objects like {name: "UNWIND"}
                const goalName = typeof goal === 'string' ? goal : goal.name;
                return goalName === selectedMood;
            }));
        
        // Time filter
        let matchesTime = true;
        if (selectedTime) {
            const [min, max] = selectedTime.split('-').map(Number);
            const avgTime = (game.minMinutes + game.maxMinutes) / 2;
            matchesTime = avgTime >= min && avgTime <= max;
        }
        
        return matchesSearch && matchesGenre && matchesMood && matchesTime;
    });
    
    renderGames();
}

/**
 * Render filtered games to the grid
 */
function renderGames() {
    const gamesGrid = document.getElementById('gamesGrid');
    const gamesLoading = document.getElementById('gamesLoading');
    const gamesEmpty = document.getElementById('gamesEmpty');
    const gamesCount = document.getElementById('gamesCount');
    
    // Hide loading
    gamesLoading.style.display = 'none';
    
    // Update count
    gamesCount.textContent = filteredGames.length;
    
    // Show empty state if no games
    if (filteredGames.length === 0) {
        gamesGrid.style.display = 'none';
        gamesEmpty.style.display = 'block';
        return;
    }
    
    // Show grid and render games
    gamesEmpty.style.display = 'none';
    gamesGrid.style.display = 'grid';
    gamesGrid.innerHTML = '';
    
    filteredGames.forEach(game => {
        const gameCard = createGameCard(game);
        gamesGrid.appendChild(gameCard);
    });
}

// ============================================
// HELPER FUNCTIONS FOR GAME CARDS
// ============================================

/**
 * Get emoji for emotional goal
 */
function getEmotionalGoalEmoji(goalName) {
    const emojiMap = {
        'UNWIND': '😌',
        'RECHARGE': '⚡',
        'ENGAGE': '🎯',
        'CHALLENGE': '💪',
        'EXPLORE': '🗺️',
        'ACHIEVE': '🏆',
        'ADVENTURE_TIME': '🗺️',
        'PROGRESS_ORIENTED': '📈',
        'LOCKING_IN': '🔒'
    };
    return emojiMap[goalName] || '🎮';
}

/**
 * Get color for emotional goal
 */
function getEmotionalGoalColor(goalName) {
    const colorMap = {
        'UNWIND': '#9b59b6',
        'RECHARGE': '#e74c3c',
        'ENGAGE': '#3498db',
        'CHALLENGE': '#f39c12',
        'EXPLORE': '#1abc9c',
        'ACHIEVE': '#2ecc71',
        'ADVENTURE_TIME': '#16a085',
        'PROGRESS_ORIENTED': '#27ae60',
        'LOCKING_IN': '#8e44ad'
    };
    return colorMap[goalName] || '#667eea';
}

/**
 * Get gradient colors for game card based on emotional goal
 */
function getGameGradient(game) {
    if (game.emotionalGoals && game.emotionalGoals.length > 0) {
        const firstGoal = game.emotionalGoals[0];
        // Handle both formats: strings like "UNWIND" or objects like {name: "UNWIND"}
        const mood = typeof firstGoal === 'string' ? firstGoal : firstGoal.name;
        const colors = {
            'UNWIND': '#667eea, #764ba2',
            'RECHARGE': '#f093fb, #f5576c',
            'ENGAGE': '#4facfe, #00f2fe',
            'CHALLENGE': '#fa709a, #fee140',
            'EXPLORE': '#30cfd0, #330867',
            'ACHIEVE': '#a8edea, #fed6e3',
            'ADVENTURE_TIME': '#30cfd0, #330867',
            'PROGRESS_ORIENTED': '#a8edea, #fed6e3',
            'LOCKING_IN': '#667eea, #764ba2'
        };
        return colors[mood] || '#667eea, #764ba2';
    }
    return '#667eea, #764ba2';
}

/**
 * Create a game card element
 */
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.style.cssText = `
        background: var(--surface);
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        transition: all 0.3s;
        cursor: pointer;
        height: 100%;
        display: flex;
        flex-direction: column;
    `;
    
    // Image
    const imageDiv = document.createElement('div');
    imageDiv.style.cssText = `
        width: 100%;
        height: 160px;
        background: linear-gradient(135deg, ${getGameGradient(game)});
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3em;
        position: relative;
        overflow: hidden;
    `;
    
    if (game.imageUrl || game.coverUrl) {
        imageDiv.style.background = `url('${game.imageUrl || game.coverUrl}') center/cover`;
    } else {
        imageDiv.textContent = game.emoji || '🎮';
    }
    
    // Time badge
    const timeBadge = document.createElement('div');
    timeBadge.textContent = `${game.minMinutes}-${game.maxMinutes} min`;
    timeBadge.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.75em;
        font-weight: 600;
        backdrop-filter: blur(10px);
    `;
    imageDiv.appendChild(timeBadge);
    
    // Content
    const content = document.createElement('div');
    content.style.cssText = `
        padding: 20px;
        flex: 1;
        display: flex;
        flex-direction: column;
    `;
    
    // Title
    const title = document.createElement('h3');
    title.textContent = game.name;
    title.style.cssText = `
        color: var(--text-primary);
        font-size: 1.2em;
        margin-bottom: 8px;
        font-weight: 600;
    `;
    
    // Description
    const desc = document.createElement('p');
    desc.textContent = game.description || 'No description available';
    desc.style.cssText = `
        color: var(--text-secondary);
        font-size: 0.9em;
        line-height: 1.5;
        margin-bottom: 12px;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    `;
    
    // Genres
    if (game.genres && game.genres.length > 0) {
        const genresDiv = document.createElement('div');
        genresDiv.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 12px;
        `;
        
        game.genres.slice(0, 3).forEach(genre => {
            const genreTag = document.createElement('span');
            genreTag.textContent = genre;
            genreTag.style.cssText = `
                background: var(--background);
                color: var(--text-secondary);
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 0.75em;
                font-weight: 500;
            `;
            genresDiv.appendChild(genreTag);
        });
        
        content.appendChild(genresDiv);
    }
    
    // Moods
    if (game.emotionalGoals && game.emotionalGoals.length > 0) {
        const moodsDiv = document.createElement('div');
        moodsDiv.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 12px;
        `;
        
        game.emotionalGoals.slice(0, 3).forEach(goal => {
            // Handle both formats: strings like "UNWIND" or objects like {name: "UNWIND"}
            const goalName = typeof goal === 'string' ? goal : goal.name;
            const moodTag = document.createElement('span');
            moodTag.textContent = `${getEmotionalGoalEmoji(goalName)} ${goalName}`;
            moodTag.style.cssText = `
                background: ${getEmotionalGoalColor(goalName)};
                color: white;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 0.75em;
                font-weight: 500;
            `;
            moodsDiv.appendChild(moodTag);
        });
        
        content.appendChild(moodsDiv);
    }
    
    // Stats row
    const statsRow = document.createElement('div');
    statsRow.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 12px;
        border-top: 1px solid var(--border);
    `;
    
    const interruptText = game.interruptibility === 'EASY' ? '✅ Easy to pause' : 
                         game.interruptibility === 'MODERATE' ? '⚠️ Moderate' : 
                         '❌ Hard to pause';
    
    const interruptDiv = document.createElement('div');
    interruptDiv.textContent = interruptText;
    interruptDiv.style.cssText = `
        font-size: 0.8em;
        color: var(--text-secondary);
    `;
    
    statsRow.appendChild(interruptDiv);
    content.appendChild(statsRow);
    
    content.insertBefore(title, content.firstChild);
    content.insertBefore(desc, title.nextSibling);
    
    card.appendChild(imageDiv);
    card.appendChild(content);
    
    // Hover effect
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
    });
    
    // Click to maximize
    card.addEventListener('click', () => {
        showGameDetails(game);
    });
    
    return card;
}

/**
 * Show game details in maximized view
 */
function showGameDetails(game) {
    // Reuse the existing maximized game overlay from recommendation.js
    if (typeof openMaximizedGame === 'function') {
        // Pass game with default reason and match percentage for library view
        openMaximizedGame(game, 'From your game library', 100);
    } else {
        console.error('openMaximizedGame function not found');
    }
}
