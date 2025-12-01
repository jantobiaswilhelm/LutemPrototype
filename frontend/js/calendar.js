// ============================================
// CALENDAR FUNCTIONALITY
// ============================================

// Use window.calendarInstance for global access (needed by tabs.js check)
// Note: can't use window.calendar because browsers auto-create it for <div id="calendar">
let currentEventId = null;
let selectedTimeSlot = null;

/**
 * Initialize FullCalendar
 */
function initCalendar() {
    const calendarEl = document.getElementById('calendar');
    
    if (!calendarEl) {
        console.log('Calendar element not found');
        return;
    }
    
    window.calendarInstance = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        slotMinTime: '06:00:00',
        slotMaxTime: '24:00:00',
        allDaySlot: false,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        
        // Event click handler - show details
        eventClick: function(info) {
            showEventDetails(info.event);
        },
        
        // Time slot selection handler - open enhanced event modal
        select: function(info) {
            selectedTimeSlot = { start: info.start, end: info.end };
            openAddEventModal(info.start, info.end);
        },
        
        // Event drag/resize handlers
        eventDrop: function(info) {
            updateEventTimes(info.event);
        },
        eventResize: function(info) {
            updateEventTimes(info.event);
        },
        
        // Custom event rendering with game images
        eventContent: function(arg) {
            const isGame = arg.event.extendedProps.type === 'GAME';
            const imageUrl = arg.event.extendedProps.imageUrl;
            
            // Calculate duration
            const start = arg.event.start;
            const end = arg.event.end;
            let durationText = '';
            if (start && end) {
                const mins = Math.round((end - start) / (1000 * 60));
                if (mins >= 60) {
                    const hours = Math.floor(mins / 60);
                    const remainMins = mins % 60;
                    durationText = remainMins > 0 ? `${hours}h ${remainMins}m` : `${hours}h`;
                } else {
                    durationText = `${mins}m`;
                }
            }
            
            if (isGame && imageUrl) {
                return {
                    html: `<div class="fc-event-game" style="background-image: url('${imageUrl}')">
                        <div class="fc-event-game-overlay"></div>
                        <div class="fc-event-game-content">
                            <span class="fc-event-game-title">${arg.event.title}</span>
                            <span class="fc-event-game-duration">(${durationText})</span>
                        </div>
                    </div>`
                };
            }
            
            return {
                html: `<div class="fc-event-main-frame">
                    <div class="fc-event-title-container">
                        <div class="fc-event-title fc-sticky">${arg.event.title}</div>
                        ${durationText ? `<div class="fc-event-duration">(${durationText})</div>` : ''}
                    </div>
                </div>`
            };
        }
    });
    
    window.calendarInstance.render();
    loadCalendarEvents();
    console.log('Calendar initialized');
}

// ============================================
// CALENDAR-WIZARD INTEGRATION
// ============================================

/**
 * Show game wizard with calendar time slot pre-filled
 */
function showGameWizardForCalendar(startTime, endTime, duration) {
    selectedTimeSlot = { start: startTime, end: endTime };
    
    // Pre-fill wizard with time slot data
    document.getElementById('minutes').value = Math.round(duration);
    
    // Open the wizard
    const wizardPage = document.getElementById('wizard-page');
    wizardPage.style.display = 'block';
    wizardPage.scrollIntoView({ behavior: 'smooth' });
    
    console.log('Game wizard opened for time slot:', {
        start: startTime,
        end: endTime,
        duration: duration
    });
}

/**
 * Handle calendar integration after getting recommendation
 * This wraps the original getRecommendation function
 */
function setupCalendarRecommendationIntegration() {
    if (typeof getRecommendation === 'function') {
        const originalGetRecommendation = getRecommendation;
        window.getRecommendation = async function() {
            await originalGetRecommendation.apply(this, arguments);
            
            // If called from calendar, create calendar event after game selection
            if (selectedTimeSlot && typeof currentRecommendedGame !== 'undefined' && currentRecommendedGame) {
                const gameEvent = {
                    title: `Gaming: ${currentRecommendedGame.name}`,
                    startTime: selectedTimeSlot.start.toISOString(),
                    endTime: selectedTimeSlot.end.toISOString(),
                    type: 'GAME',
                    gameId: currentRecommendedGame.id,
                    gameName: currentRecommendedGame.name
                };
                
                try {
                    const response = await fetch(`${API_BASE_URL}/calendar/events`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(gameEvent)
                    });
                    
                    if (response.ok) {
                        showToast('Game session scheduled!', 'success');
                        loadCalendarEvents(); // Refresh calendar
                        selectedTimeSlot = null; // Reset
                    }
                } catch (error) {
                    console.error('Error creating calendar event:', error);
                    showToast('Failed to schedule game session', 'error');
                }
            }
        };
    }
}

// ============================================
// EVENT MANAGEMENT FUNCTIONS
// ============================================

/**
 * Load calendar events from backend
 */
async function loadCalendarEvents() {
    if (!window.calendarInstance) return;
    
    try {
        // Fetch events and games in parallel
        const [eventsResponse, gamesResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/calendar/events`),
            fetch(`${API_BASE_URL}/games`)
        ]);
        
        if (eventsResponse.ok) {
            const events = await eventsResponse.json();
            const games = gamesResponse.ok ? await gamesResponse.json() : [];
            
            // Create a map of gameId -> imageUrl for quick lookup
            const gameImageMap = {};
            games.forEach(game => {
                gameImageMap[game.id] = game.imageUrl;
            });
            
            // Clear existing events
            window.calendarInstance.removeAllEvents();
            
            // Add events with proper colors and images
            events.forEach(event => {
                const imageUrl = event.gameId ? gameImageMap[event.gameId] : null;
                const isGame = event.type === 'GAME';
                
                window.calendarInstance.addEvent({
                    id: event.id,
                    title: event.title,
                    start: event.startTime,
                    end: event.endTime,
                    backgroundColor: isGame ? 'transparent' : '',
                    borderColor: isGame ? 'var(--accent-primary)' : '',
                    classNames: isGame ? ['fc-event-gaming'] : ['fc-event-task'],
                    extendedProps: {
                        type: event.type,
                        gameId: event.gameId,
                        gameName: event.gameName,
                        description: event.description,
                        imageUrl: imageUrl
                    }
                });
            });
            
            console.log('Calendar events loaded:', events.length);
        }
    } catch (error) {
        console.error('Error loading calendar events:', error);
    }
}

/**
 * Show event details modal
 */
function showEventDetails(event) {
    currentEventId = event.id;
    
    const modal = document.getElementById('eventDetailsModal');
    const title = document.getElementById('eventDetailsTitle');
    const description = document.getElementById('eventDetailsDescription');
    const time = document.getElementById('eventDetailsTime');
    
    title.textContent = event.title;
    description.textContent = event.extendedProps.description || 'No description';
    time.textContent = `${formatDateTime(event.start)} - ${formatDateTime(event.end)}`;
    
    modal.style.display = 'flex';
}

/**
 * Close event details modal
 */
function closeEventDetailsModal() {
    document.getElementById('eventDetailsModal').style.display = 'none';
    currentEventId = null;
}

/**
 * Delete current event
 */
async function deleteCurrentEvent() {
    if (!currentEventId) return;
    
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/calendar/events/${currentEventId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Event deleted successfully', 'success');
            closeEventDetailsModal();
            loadCalendarEvents();
        } else {
            showToast('Failed to delete event', 'error');
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        showToast('Failed to delete event', 'error');
    }
}

/**
 * Update event times after drag/resize
 */
async function updateEventTimes(event) {
    try {
        const updatedEvent = {
            title: event.title,
            startTime: event.start.toISOString(),
            endTime: event.end.toISOString(),
            type: event.extendedProps.type,
            gameId: event.extendedProps.gameId,
            gameName: event.extendedProps.gameName,
            description: event.extendedProps.description
        };
        
        const response = await fetch(`${API_BASE_URL}/calendar/events/${event.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEvent)
        });
        
        if (response.ok) {
            showToast('Event updated', 'success');
        } else {
            showToast('Failed to update event', 'error');
            loadCalendarEvents(); // Reload to revert
        }
    } catch (error) {
        console.error('Error updating event:', error);
        showToast('Failed to update event', 'error');
        loadCalendarEvents(); // Reload to revert
    }
}

/**
 * Open add task modal
 */
function addTaskEvent() {
    document.getElementById('addTaskModal').style.display = 'flex';
    
    // Set default times
    const now = new Date();
    now.setMinutes(0, 0, 0);
    document.getElementById('taskStart').value = formatDateTimeLocal(now);
    
    const end = new Date(now);
    end.setHours(end.getHours() + 1);
    document.getElementById('taskEnd').value = formatDateTimeLocal(end);
}

/**
 * Close add task modal
 */
function closeAddTaskModal() {
    document.getElementById('addTaskModal').style.display = 'none';
    document.getElementById('addTaskForm').reset();
}

/**
 * Save task to backend
 */
async function saveTask(event) {
    event.preventDefault();
    
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const start = document.getElementById('taskStart').value;
    const end = document.getElementById('taskEnd').value;
    
    const taskEvent = {
        title: title,
        description: description,
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
        type: 'TASK'
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/calendar/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskEvent)
        });
        
        if (response.ok) {
            showToast('Task added successfully', 'success');
            closeAddTaskModal();
            loadCalendarEvents();
        } else {
            showToast('Failed to add task', 'error');
        }
    } catch (error) {
        console.error('Error saving task:', error);
        showToast('Failed to add task', 'error');
    }
}

// ============================================
// UTILITY FUNCTIONS FOR CALENDAR
// ============================================

/**
 * Format date for datetime-local input
 */
function formatDateTimeLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Format date for display
 */
function formatDateTime(date) {
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

/**
 * Calculate duration between two dates
 */
function calculateDuration(start, end) {
    const minutes = (end - start) / (1000 * 60);
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    
    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
}

/**
 * Show toast notification (may already exist in utils.js)
 */
function showToast(message, type = 'info') {
    // Check if showToast already exists from utils.js
    if (window._showToastOriginal) {
        window._showToastOriginal(message, type);
        return;
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.backgroundColor = type === 'success' ? '#4caf50' : 
                                 type === 'error' ? '#f44336' : '#2196f3';
    toast.style.color = 'white';
    toast.style.fontWeight = '500';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    toast.style.zIndex = '10000';
    toast.style.animation = 'slideIn 0.3s ease-out';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}


// ============================================
// ENHANCED ADD EVENT MODAL
// ============================================

// State for the new event modal
let currentEventType = 'task'; // 'task' or 'gaming'
let currentGameMode = 'browse'; // 'browse', 'wizard', 'random'
let selectedGame = null;
let allGamesForModal = [];

/**
 * Open the enhanced Add Event Modal
 * @param {Date} startTime - Optional start time
 * @param {Date} endTime - Optional end time
 * @param {string} defaultTab - Optional default tab ('task' or 'gaming')
 */
function openAddEventModal(startTime = null, endTime = null, defaultTab = 'gaming') {
    const modal = document.getElementById('addEventModal');
    
    // Set default times if not provided
    if (!startTime) {
        startTime = new Date();
        startTime.setMinutes(0, 0, 0);
    }
    if (!endTime) {
        endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 1);
    }
    
    // Populate time fields
    document.getElementById('eventStartTime').value = formatDateTimeLocal(startTime);
    document.getElementById('eventEndTime').value = formatDateTimeLocal(endTime);
    
    // Update duration display
    updateDurationDisplay();
    
    // Switch to the specified tab (default: gaming for Bug #4)
    switchEventTab(defaultTab);
    
    // Clear any previous selections
    clearGameSelection();
    document.getElementById('eventTaskTitle').value = '';
    document.getElementById('eventTaskDescription').value = '';
    
    // Load games for the modal
    loadGamesForModal();
    
    // Show modal
    modal.style.display = 'flex';
    
    // Focus on appropriate field based on tab
    setTimeout(() => {
        if (defaultTab === 'task') {
            document.getElementById('eventTaskTitle').focus();
        } else {
            const searchInput = document.getElementById('eventGameSearch');
            if (searchInput) searchInput.focus();
        }
    }, 100);
}

/**
 * Close the Add Event Modal
 */
function closeAddEventModal() {
    document.getElementById('addEventModal').style.display = 'none';
    selectedGame = null;
    selectedTimeSlot = null;
}


/**
 * Switch between Task and Gaming Session tabs
 */
function switchEventTab(type) {
    currentEventType = type;
    
    // Update tab buttons
    document.querySelectorAll('.event-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.type === type);
    });
    
    // Update tab content
    document.getElementById('taskTabContent').classList.toggle('active', type === 'task');
    document.getElementById('taskTabContent').style.display = type === 'task' ? 'block' : 'none';
    document.getElementById('gamingTabContent').classList.toggle('active', type === 'gaming');
    document.getElementById('gamingTabContent').style.display = type === 'gaming' ? 'block' : 'none';
    
    // Update save button text
    const btnText = document.querySelector('#addEventModal .btn-save span');
    if (btnText) {
        btnText.textContent = type === 'task' ? 'Add Task' : 'Schedule Gaming';
    }
}

/**
 * Switch between game selection modes
 */
function switchGameMode(mode) {
    currentGameMode = mode;
    
    // Update mode buttons
    document.querySelectorAll('.game-mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    // Update mode content
    document.getElementById('gameBrowseMode').classList.toggle('active', mode === 'browse');
    document.getElementById('gameBrowseMode').style.display = mode === 'browse' ? 'block' : 'none';
    document.getElementById('gameWizardMode').classList.toggle('active', mode === 'wizard');
    document.getElementById('gameWizardMode').style.display = mode === 'wizard' ? 'block' : 'none';
    document.getElementById('gameRandomMode').classList.toggle('active', mode === 'random');
    document.getElementById('gameRandomMode').style.display = mode === 'random' ? 'block' : 'none';
    
    // Reset wizard when switching to it
    if (mode === 'wizard') {
        resetCalendarWizard();
    }
    
    // Reset random mode when switching to it
    if (mode === 'random') {
        resetRandomMode();
    }
}

/**
 * Load games for the modal game list
 */
async function loadGamesForModal() {
    const gameList = document.getElementById('eventGameList');
    gameList.innerHTML = '<div class="loading-games">Loading games...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/games`);
        if (response.ok) {
            allGamesForModal = await response.json();
            renderGameList(allGamesForModal);
        } else {
            gameList.innerHTML = '<div class="loading-games">Failed to load games</div>';
        }
    } catch (error) {
        console.error('Error loading games:', error);
        gameList.innerHTML = '<div class="loading-games">Failed to load games</div>';
    }
}


/**
 * Render the game list in the modal
 * Bug #3 fix: Use imageUrl instead of coverImageUrl
 */
function renderGameList(games) {
    const gameList = document.getElementById('eventGameList');
    
    if (!games || games.length === 0) {
        gameList.innerHTML = '<div class="loading-games">No games found</div>';
        return;
    }
    
    gameList.innerHTML = games.map(game => `
        <div class="game-list-item ${selectedGame && selectedGame.id === game.id ? 'selected' : ''}" 
             onclick="selectGameForEvent(${game.id})"
             data-game-id="${game.id}">
            ${game.imageUrl 
                ? `<img src="${game.imageUrl}" alt="${game.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"><div class="game-list-item-placeholder" style="display:none">🎮</div>`
                : `<div class="game-list-item-placeholder">🎮</div>`
            }
            <div class="game-list-item-info">
                <div class="game-list-item-name">${game.name}</div>
                <div class="game-list-item-duration">${game.minMinutes || '?'}-${game.maxMinutes || '?'} min</div>
            </div>
        </div>
    `).join('');
}

/**
 * Filter games based on search input
 */
function filterEventGames() {
    const searchTerm = document.getElementById('eventGameSearch').value.toLowerCase();
    const filteredGames = allGamesForModal.filter(game => 
        game.name.toLowerCase().includes(searchTerm)
    );
    renderGameList(filteredGames);
}

/**
 * Select a game for the gaming session
 * Bug #3 fix: Use imageUrl instead of coverImageUrl
 */
function selectGameForEvent(gameId) {
    selectedGame = allGamesForModal.find(g => g.id === gameId);
    
    if (selectedGame) {
        // Update visual selection in list
        document.querySelectorAll('.game-list-item').forEach(item => {
            item.classList.toggle('selected', parseInt(item.dataset.gameId) === gameId);
        });
        
        // Show selected game display
        const display = document.getElementById('selectedGameDisplay');
        display.style.display = 'block';
        const coverImg = document.getElementById('selectedGameCover');
        if (selectedGame.imageUrl) {
            coverImg.src = selectedGame.imageUrl;
            coverImg.style.display = 'block';
        } else {
            coverImg.style.display = 'none';
        }
        document.getElementById('selectedGameName').textContent = selectedGame.name;
    }
}

/**
 * Clear game selection
 */
function clearGameSelection() {
    selectedGame = null;
    const display = document.getElementById('selectedGameDisplay');
    if (display) {
        display.style.display = 'none';
    }
    document.querySelectorAll('.game-list-item').forEach(item => {
        item.classList.remove('selected');
    });
}


/**
 * Update the duration display based on selected times
 */
function updateDurationDisplay() {
    const startInput = document.getElementById('eventStartTime');
    const endInput = document.getElementById('eventEndTime');
    const display = document.getElementById('eventDurationDisplay');
    
    if (startInput.value && endInput.value) {
        const start = new Date(startInput.value);
        const end = new Date(endInput.value);
        const minutes = (end - start) / (1000 * 60);
        
        if (minutes > 0) {
            display.textContent = `Duration: ${calculateDuration(start, end)}`;
        } else {
            display.textContent = 'Duration: Invalid (end must be after start)';
        }
    } else {
        display.textContent = 'Duration: --';
    }
}

/**
 * Save the calendar event (Task or Gaming Session)
 */
async function saveCalendarEvent() {
    const startTime = document.getElementById('eventStartTime').value;
    const endTime = document.getElementById('eventEndTime').value;
    
    if (!startTime || !endTime) {
        showToast('Please set start and end times', 'error');
        return;
    }
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (end <= start) {
        showToast('End time must be after start time', 'error');
        return;
    }
    
    let eventData;
    
    if (currentEventType === 'task') {
        const title = document.getElementById('eventTaskTitle').value.trim();
        if (!title) {
            showToast('Please enter a task title', 'error');
            return;
        }
        
        eventData = {
            title: title,
            description: document.getElementById('eventTaskDescription').value.trim(),
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            type: 'TASK'
        };
    } else {
        // Gaming session
        if (!selectedGame) {
            showToast('Please select a game', 'error');
            return;
        }
        
        eventData = {
            title: selectedGame.name,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            type: 'GAME',
            gameId: selectedGame.id,
            gameName: selectedGame.name
        };
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/calendar/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        });
        
        if (response.ok) {
            showToast(currentEventType === 'task' ? 'Task added!' : 'Gaming session scheduled!', 'success');
            closeAddEventModal();
            loadCalendarEvents();
        } else {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            showToast('Failed to create event', 'error');
        }
    } catch (error) {
        console.error('Error saving event:', error);
        showToast('Failed to create event', 'error');
    }
}

// Add event listeners for time field changes
document.addEventListener('DOMContentLoaded', function() {
    const startInput = document.getElementById('eventStartTime');
    const endInput = document.getElementById('eventEndTime');
    
    if (startInput) {
        startInput.addEventListener('change', updateDurationDisplay);
    }
    if (endInput) {
        endInput.addEventListener('change', updateDurationDisplay);
    }
});


// ============================================
// ICS IMPORT FUNCTIONALITY
// ============================================

let parsedIcsEvents = [];

/**
 * Open the import modal
 */
function openImportModal() {
    const modal = document.getElementById('importModal');
    modal.style.display = 'flex';
    
    // Reset state
    parsedIcsEvents = [];
    document.getElementById('importPreview').style.display = 'none';
    document.getElementById('importStatus').style.display = 'none';
    document.getElementById('importConfirmBtn').disabled = true;
    document.getElementById('importConfirmBtn').innerHTML = '<span>📥</span><span>Import Events</span>';
    
    // Reset drop zone appearance
    const dropZone = document.getElementById('importDropZone');
    dropZone.innerHTML = `
        <input type="file" id="icsFileInput" accept=".ics" style="display: none;">
        <span style="font-size: 3em;">📁</span>
        <p style="color: var(--text-primary); font-weight: 600; margin: 10px 0 5px;">Drop .ics file here</p>
        <p style="color: var(--text-secondary); font-size: 0.9em; margin: 0;">or click to browse</p>
    `;
    
    // Re-attach the file input change handler (since we rebuilt the DOM)
    const fileInput = document.getElementById('icsFileInput');
    fileInput.value = ''; // Clear any previous selection
    fileInput.onchange = handleFileSelect;
}

/**
 * Close the import modal
 */
function closeImportModal() {
    document.getElementById('importModal').style.display = 'none';
    parsedIcsEvents = [];
}

/**
 * Handle drag over event
 */
function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('importDropZone').classList.add('drag-over');
}

/**
 * Handle drag leave event
 */
function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('importDropZone').classList.remove('drag-over');
}

/**
 * Handle file drop
 */
function handleFileDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('importDropZone').classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        processIcsFile(files[0]);
    }
}

/**
 * Handle file select from input
 */
function handleFileSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
        processIcsFile(files[0]);
    }
}

/**
 * Process the ICS file
 */
function processIcsFile(file) {
    if (!file.name.toLowerCase().endsWith('.ics')) {
        showImportStatus('Please select a valid .ics file', 'error');
        return;
    }
    
    // Update drop zone to show file name
    const dropZone = document.getElementById('importDropZone');
    dropZone.innerHTML = `
        <span style="font-size: 3em;">📄</span>
        <p style="color: var(--text-primary); font-weight: 600; margin: 10px 0 5px;">${file.name}</p>
        <p style="color: var(--text-secondary); font-size: 0.9em; margin: 0;">Parsing...</p>
    `;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const icsContent = e.target.result;
            parsedIcsEvents = parseIcsContent(icsContent);
            
            if (parsedIcsEvents.length === 0) {
                showImportStatus('No events found in this file', 'error');
                dropZone.innerHTML = `
                    <input type="file" id="icsFileInput" accept=".ics" style="display: none;" onchange="handleFileSelect(event)">
                    <span style="font-size: 3em;">📁</span>
                    <p style="color: var(--text-primary); font-weight: 600; margin: 10px 0 5px;">Drop .ics file here</p>
                    <p style="color: var(--text-secondary); font-size: 0.9em; margin: 0;">or click to browse</p>
                `;
                return;
            }
            
            // Update drop zone with success
            dropZone.innerHTML = `
                <span style="font-size: 3em;">✅</span>
                <p style="color: var(--text-primary); font-weight: 600; margin: 10px 0 5px;">${file.name}</p>
                <p style="color: var(--accent-primary); font-size: 0.9em; margin: 0;">${parsedIcsEvents.length} events ready to import</p>
            `;
            
            // Show preview
            showImportPreview(parsedIcsEvents);
            document.getElementById('importConfirmBtn').disabled = false;
            
        } catch (error) {
            console.error('Error parsing ICS:', error);
            showImportStatus('Failed to parse ICS file: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
}

/**
 * Parse ICS file content - simple parser without external library
 */
function parseIcsContent(icsText) {
    const events = [];
    const lines = icsText.split(/\r?\n/);
    
    let currentEvent = null;
    let currentKey = null;
    let currentValue = '';
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Handle line folding (lines starting with space/tab are continuations)
        if (line.startsWith(' ') || line.startsWith('\t')) {
            currentValue += line.substring(1);
            continue;
        }
        
        // Process the previous key-value pair
        if (currentKey && currentEvent) {
            processIcsProperty(currentEvent, currentKey, currentValue);
        }
        
        // Parse new line
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) continue;
        
        currentKey = line.substring(0, colonIndex);
        currentValue = line.substring(colonIndex + 1);
        
        // Handle BEGIN/END
        if (currentKey === 'BEGIN' && currentValue === 'VEVENT') {
            currentEvent = { title: '', startTime: null, endTime: null, description: '', uid: '' };
        } else if (currentKey === 'END' && currentValue === 'VEVENT') {
            if (currentEvent && currentEvent.title && currentEvent.startTime) {
                // If no end time, default to 1 hour after start
                if (!currentEvent.endTime) {
                    const start = new Date(currentEvent.startTime);
                    start.setHours(start.getHours() + 1);
                    currentEvent.endTime = start.toISOString();
                }
                events.push(currentEvent);
            }
            currentEvent = null;
            currentKey = null;
            currentValue = '';
        }
    }
    
    // Process last property if any
    if (currentKey && currentEvent) {
        processIcsProperty(currentEvent, currentKey, currentValue);
    }
    
    return events;
}

/**
 * Process a single ICS property
 */
function processIcsProperty(event, key, value) {
    // Remove parameters from key (e.g., DTSTART;TZID=... becomes DTSTART)
    const baseKey = key.split(';')[0];
    
    switch (baseKey) {
        case 'SUMMARY':
            event.title = unescapeIcsText(value);
            break;
        case 'DESCRIPTION':
            event.description = unescapeIcsText(value);
            break;
        case 'DTSTART':
            event.startTime = parseIcsDateTime(value, key);
            break;
        case 'DTEND':
            event.endTime = parseIcsDateTime(value, key);
            break;
        case 'UID':
            event.uid = value;
            break;
    }
}

/**
 * Parse ICS datetime format
 */
function parseIcsDateTime(value, fullKey) {
    // Handle different formats:
    // 20231215T140000Z (UTC)
    // 20231215T140000 (local)
    // 20231215 (all-day)
    
    try {
        // Remove any VALUE= prefix
        value = value.replace(/^VALUE=[^:]+:/, '');
        
        // All-day event (YYYYMMDD)
        if (value.length === 8) {
            const year = parseInt(value.substring(0, 4));
            const month = parseInt(value.substring(4, 6)) - 1;
            const day = parseInt(value.substring(6, 8));
            return new Date(year, month, day).toISOString();
        }
        
        // DateTime format (YYYYMMDDTHHmmss or YYYYMMDDTHHmmssZ)
        const isUtc = value.endsWith('Z');
        const cleanValue = value.replace('Z', '').replace('T', '');
        
        const year = parseInt(cleanValue.substring(0, 4));
        const month = parseInt(cleanValue.substring(4, 6)) - 1;
        const day = parseInt(cleanValue.substring(6, 8));
        const hour = parseInt(cleanValue.substring(8, 10)) || 0;
        const minute = parseInt(cleanValue.substring(10, 12)) || 0;
        const second = parseInt(cleanValue.substring(12, 14)) || 0;
        
        if (isUtc) {
            return new Date(Date.UTC(year, month, day, hour, minute, second)).toISOString();
        } else {
            return new Date(year, month, day, hour, minute, second).toISOString();
        }
    } catch (e) {
        console.warn('Failed to parse date:', value, e);
        return null;
    }
}

/**
 * Unescape ICS text (handle escaped chars)
 */
function unescapeIcsText(text) {
    return text
        .replace(/\\n/g, '\n')
        .replace(/\\,/g, ',')
        .replace(/\\;/g, ';')
        .replace(/\\\\/g, '\\');
}

/**
 * Show import preview
 */
function showImportPreview(events) {
    const preview = document.getElementById('importPreview');
    const count = document.getElementById('importCount');
    const list = document.getElementById('importEventsList');
    
    count.textContent = events.length;
    
    // Show first 10 events
    const displayEvents = events.slice(0, 10);
    list.innerHTML = displayEvents.map(event => {
        const start = new Date(event.startTime);
        const dateStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const timeStr = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        
        return `
            <div class="import-event-item">
                <span class="event-icon">📅</span>
                <div class="event-info">
                    <div class="event-title">${event.title}</div>
                    <div class="event-time">${dateStr} at ${timeStr}</div>
                </div>
            </div>
        `;
    }).join('');
    
    if (events.length > 10) {
        list.innerHTML += `<div style="text-align: center; padding: 10px; color: var(--text-secondary);">
            ... and ${events.length - 10} more events
        </div>`;
    }
    
    preview.style.display = 'block';
}

/**
 * Show import status message
 */
function showImportStatus(message, type) {
    const status = document.getElementById('importStatus');
    status.textContent = message;
    status.className = `import-status-${type}`;
    status.style.display = 'block';
}

/**
 * Confirm and execute the import
 */
async function confirmImport() {
    if (parsedIcsEvents.length === 0) return;
    
    const confirmBtn = document.getElementById('importConfirmBtn');
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<span>⏳</span><span>Importing...</span>';
    
    showImportStatus('Importing events...', 'loading');
    
    // Convert parsed events to backend format
    const eventsToImport = parsedIcsEvents.map(event => ({
        title: event.title,
        startTime: event.startTime,
        endTime: event.endTime,
        description: event.description || '',
        type: 'TASK',
        sourceType: 'ICS_IMPORT',
        externalId: event.uid || `ics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }));
    
    try {
        const response = await fetch(`${API_BASE_URL}/calendar/events/bulk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventsToImport)
        });
        
        if (response.ok) {
            const result = await response.json();
            showImportStatus(
                `✅ Successfully imported ${result.imported} events` + 
                (result.skipped > 0 ? ` (${result.skipped} duplicates skipped)` : ''),
                'success'
            );
            
            // Refresh calendar
            loadCalendarEvents();
            
            // Close modal after short delay
            setTimeout(() => {
                closeImportModal();
                showToast(`Imported ${result.imported} events!`, 'success');
            }, 1500);
            
        } else {
            const errorText = await response.text();
            throw new Error(errorText || 'Server error');
        }
    } catch (error) {
        console.error('Import error:', error);
        showImportStatus('❌ Import failed: ' + error.message, 'error');
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<span>📥</span><span>Import Events</span>';
    }
}



// ============================================
// CALENDAR WIZARD MODE (Phase 2.2)
// ============================================

// State for calendar wizard
let calendarWizardState = {
    selectedMoods: [],
    energyLevel: 'MEDIUM',
    recommendations: []
};

/**
 * Toggle mood chip selection in calendar wizard
 */
function toggleCalendarMood(element) {
    const mood = element.dataset.mood;
    
    if (element.classList.contains('selected')) {
        element.classList.remove('selected');
        calendarWizardState.selectedMoods = calendarWizardState.selectedMoods.filter(m => m !== mood);
    } else {
        element.classList.add('selected');
        calendarWizardState.selectedMoods.push(mood);
    }
    
    console.log('Selected moods:', calendarWizardState.selectedMoods);
}

/**
 * Select energy level in calendar wizard
 */
function selectCalendarEnergy(element) {
    // Deselect all
    document.querySelectorAll('.wizard-energy-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Select this one
    element.classList.add('selected');
    calendarWizardState.energyLevel = element.dataset.energy;
    
    console.log('Selected energy:', calendarWizardState.energyLevel);
}


/**
 * Get recommendations for calendar wizard
 */
async function getCalendarRecommendations() {
    // Show step 2 with loading
    document.getElementById('wizardStep1').style.display = 'none';
    document.getElementById('wizardStep2').style.display = 'block';
    document.getElementById('wizardLoading').style.display = 'block';
    document.getElementById('wizardResults').innerHTML = '';
    
    // Calculate duration from time slot
    const startInput = document.getElementById('eventStartTime');
    const endInput = document.getElementById('eventEndTime');
    let availableMinutes = 60; // default
    
    if (startInput.value && endInput.value) {
        const start = new Date(startInput.value);
        const end = new Date(endInput.value);
        availableMinutes = Math.round((end - start) / (1000 * 60));
    }
    
    // Build request
    const requestBody = {
        availableMinutes: availableMinutes,
        desiredEmotionalGoals: calendarWizardState.selectedMoods.length > 0 
            ? calendarWizardState.selectedMoods 
            : ['UNWIND'], // default if none selected
        currentEnergyLevel: calendarWizardState.energyLevel,
        requiredInterruptibility: 'MEDIUM'
    };
    
    console.log('Calendar wizard request:', requestBody);
    
    try {
        const response = await fetch(`${API_BASE_URL}/recommendations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Calendar wizard response:', data);
        
        // Build list of top 5 recommendations
        const recommendations = [];
        
        if (data.topRecommendation && data.topRecommendation.id !== 0) {
            recommendations.push({
                game: data.topRecommendation,
                matchPercentage: data.topMatchPercentage || 95,
                reason: data.reason
            });
        }
        
        if (data.alternatives) {
            data.alternatives.slice(0, 4).forEach((game, index) => {
                recommendations.push({
                    game: game,
                    matchPercentage: data.alternativeMatchPercentages?.[index] || (85 - index * 5),
                    reason: data.alternativeReasons?.[index] || 'Great alternative'
                });
            });
        }
        
        calendarWizardState.recommendations = recommendations;
        renderWizardResults(recommendations);
        
    } catch (error) {
        console.error('Calendar wizard error:', error);
        document.getElementById('wizardResults').innerHTML = `
            <div class="wizard-no-results">
                <div class="no-results-icon">😕</div>
                <p>Couldn't get recommendations</p>
                <p style="font-size: 0.9em; margin-top: 8px;">${error.message}</p>
            </div>
        `;
    } finally {
        document.getElementById('wizardLoading').style.display = 'none';
    }
}


/**
 * Render wizard recommendation results
 */
function renderWizardResults(recommendations) {
    const container = document.getElementById('wizardResults');
    
    if (!recommendations || recommendations.length === 0) {
        container.innerHTML = `
            <div class="wizard-no-results">
                <div class="no-results-icon">🤔</div>
                <p>No games found for your criteria</p>
                <p style="font-size: 0.9em; margin-top: 8px;">Try adjusting your mood or time</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recommendations.map((rec, index) => {
        const game = rec.game;
        const imageUrl = game.imageUrl || getFallbackImageUrl(game.name, 70, 70);
        const isSelected = selectedGame && selectedGame.id === game.id;
        
        return `
            <div class="wizard-rec-card ${isSelected ? 'selected' : ''}" 
                 onclick="selectWizardGame(${index})"
                 data-index="${index}">
                <img class="wizard-rec-image" 
                     src="${imageUrl}" 
                     alt="${game.name}"
                     onerror="this.src='${getFallbackImageUrl(game.name, 70, 70)}'">
                <div class="wizard-rec-info">
                    <div class="wizard-rec-name">${game.name}</div>
                    <div class="wizard-rec-meta">
                        <span>⏱️ ${game.minMinutes}-${game.maxMinutes}m</span>
                        <span>⚡ ${getEnergyLabel(game.energyRequired)}</span>
                    </div>
                </div>
                <span class="wizard-rec-match">${rec.matchPercentage}%</span>
            </div>
        `;
    }).join('');
}

/**
 * Select a game from wizard results
 */
function selectWizardGame(index) {
    const rec = calendarWizardState.recommendations[index];
    if (!rec) return;
    
    selectedGame = rec.game;
    
    // Update visual selection in wizard
    document.querySelectorAll('.wizard-rec-card').forEach((card, i) => {
        card.classList.toggle('selected', i === index);
    });
    
    // Also update the selected game display (shared with browse mode)
    const display = document.getElementById('selectedGameDisplay');
    display.style.display = 'block';
    
    const coverImg = document.getElementById('selectedGameCover');
    if (selectedGame.imageUrl) {
        coverImg.src = selectedGame.imageUrl;
        coverImg.style.display = 'block';
    } else {
        coverImg.style.display = 'none';
    }
    document.getElementById('selectedGameName').textContent = selectedGame.name;
    
    console.log('Selected wizard game:', selectedGame);
}

/**
 * Go back to wizard step 1
 */
function showWizardStep1() {
    document.getElementById('wizardStep2').style.display = 'none';
    document.getElementById('wizardStep1').style.display = 'block';
}

/**
 * Reset wizard state when switching modes
 */
function resetCalendarWizard() {
    calendarWizardState.selectedMoods = [];
    calendarWizardState.energyLevel = 'MEDIUM';
    calendarWizardState.recommendations = [];
    
    // Reset UI
    document.querySelectorAll('.wizard-mood-chip').forEach(chip => {
        chip.classList.remove('selected');
    });
    document.querySelectorAll('.wizard-energy-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.energy === 'MEDIUM');
    });
    
    // Show step 1
    showWizardStep1();
}



// ============================================
// RANDOM GAME MODE (Phase 2.3)
// ============================================

// State for random game selection
let randomSelectedGame = null;
let filteredGamesForRandom = [];

/**
 * Roll a random game from the library
 * Filters by time slot duration if available
 */
function rollRandomGame() {
    // Get available minutes from time slot
    const startInput = document.getElementById('eventStartTime');
    const endInput = document.getElementById('eventEndTime');
    let availableMinutes = null;
    
    if (startInput && startInput.value && endInput && endInput.value) {
        const start = new Date(startInput.value);
        const end = new Date(endInput.value);
        availableMinutes = Math.round((end - start) / (1000 * 60));
    }
    
    // Filter games by time if we have a time constraint
    if (availableMinutes && availableMinutes > 0) {
        filteredGamesForRandom = allGamesForModal.filter(game => {
            // Game fits if minMinutes is less than or equal to available time
            return game.minMinutes <= availableMinutes;
        });
        
        // Update hint text
        const hintEl = document.getElementById('randomTimeHint');
        if (hintEl) {
            hintEl.textContent = `Filtering to games under ${availableMinutes} minutes`;
        }
    } else {
        filteredGamesForRandom = [...allGamesForModal];
        const hintEl = document.getElementById('randomTimeHint');
        if (hintEl) {
            hintEl.textContent = 'All games available';
        }
    }
    
    // Check if we have games to choose from
    if (filteredGamesForRandom.length === 0) {
        showToast('No games match the time slot duration', 'error');
        return;
    }
    
    // Add rolling animation
    const container = document.getElementById('randomInitialState');
    if (container) {
        container.classList.add('random-rolling');
    }
    
    // Pick a random game
    const randomIndex = Math.floor(Math.random() * filteredGamesForRandom.length);
    randomSelectedGame = filteredGamesForRandom[randomIndex];
    
    // Show result after brief animation delay
    setTimeout(() => {
        displayRandomResult(randomSelectedGame);
        if (container) {
            container.classList.remove('random-rolling');
        }
    }, 500);
}

/**
 * Display the random game result
 */
function displayRandomResult(game) {
    // Hide initial state, show result state
    document.getElementById('randomInitialState').style.display = 'none';
    document.getElementById('randomResultState').style.display = 'block';
    
    // Populate game details
    const imageEl = document.getElementById('randomGameImage');
    const nameEl = document.getElementById('randomGameName');
    const genreEl = document.getElementById('randomGameGenre');
    const timeEl = document.getElementById('randomGameTime');
    const energyEl = document.getElementById('randomGameEnergy');
    
    // Set image (with fallback)
    if (game.imageUrl) {
        imageEl.src = game.imageUrl;
        imageEl.style.display = 'block';
    } else {
        imageEl.src = getFallbackImageUrl(game.name, 100, 100);
        imageEl.style.display = 'block';
    }
    imageEl.onerror = function() {
        this.src = getFallbackImageUrl(game.name, 100, 100);
    };
    
    // Set text details
    nameEl.textContent = game.name;
    genreEl.textContent = game.genre || 'Game';
    timeEl.textContent = `⏱️ ${game.minMinutes}-${game.maxMinutes} min`;
    energyEl.textContent = `⚡ ${getEnergyLabel(game.energyRequired)}`;
    
    console.log('Random game selected:', game);
}

/**
 * Accept the random game and set it as selected
 */
function acceptRandomGame() {
    if (!randomSelectedGame) {
        showToast('No game selected', 'error');
        return;
    }
    
    // Set as the selected game (shared with other modes)
    selectedGame = randomSelectedGame;
    
    // Update the shared selected game display
    const display = document.getElementById('selectedGameDisplay');
    display.style.display = 'block';
    
    const coverImg = document.getElementById('selectedGameCover');
    if (selectedGame.imageUrl) {
        coverImg.src = selectedGame.imageUrl;
        coverImg.style.display = 'block';
    } else {
        coverImg.style.display = 'none';
    }
    document.getElementById('selectedGameName').textContent = selectedGame.name;
    
    showToast(`${selectedGame.name} selected!`, 'success');
    console.log('Accepted random game:', selectedGame);
}

/**
 * Reset random mode UI when switching to it
 */
function resetRandomMode() {
    randomSelectedGame = null;
    
    // Show initial state, hide result state
    const initialState = document.getElementById('randomInitialState');
    const resultState = document.getElementById('randomResultState');
    
    if (initialState) initialState.style.display = 'block';
    if (resultState) resultState.style.display = 'none';
    
    // Update hint based on current time slot
    updateRandomTimeHint();
}

/**
 * Update the random mode hint text based on current time slot
 */
function updateRandomTimeHint() {
    const startInput = document.getElementById('eventStartTime');
    const endInput = document.getElementById('eventEndTime');
    const hintEl = document.getElementById('randomTimeHint');
    
    if (!hintEl) return;
    
    if (startInput && startInput.value && endInput && endInput.value) {
        const start = new Date(startInput.value);
        const end = new Date(endInput.value);
        const availableMinutes = Math.round((end - start) / (1000 * 60));
        
        if (availableMinutes > 0) {
            // Count how many games fit
            const matchingCount = allGamesForModal.filter(g => g.minMinutes <= availableMinutes).length;
            hintEl.textContent = `${matchingCount} games fit in your ${availableMinutes}-minute slot`;
        } else {
            hintEl.textContent = '';
        }
    } else {
        hintEl.textContent = `${allGamesForModal.length} games available`;
    }
}
