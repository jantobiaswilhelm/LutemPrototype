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
        
        // Custom event rendering
        eventContent: function(arg) {
            return {
                html: `<div class="fc-event-main-frame">
                    <div class="fc-event-title-container">
                        <div class="fc-event-title fc-sticky">${arg.event.title}</div>
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
                    title: `🎮 ${currentRecommendedGame.name}`,
                    start: selectedTimeSlot.start.toISOString(),
                    end: selectedTimeSlot.end.toISOString(),
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
        const response = await fetch(`${API_BASE_URL}/calendar/events`);
        if (response.ok) {
            const events = await response.json();
            
            // Clear existing events
            window.calendarInstance.removeAllEvents();
            
            // Add events with proper colors
            events.forEach(event => {
                window.calendarInstance.addEvent({
                    id: event.id,
                    title: event.title,
                    start: event.start,
                    end: event.end,
                    backgroundColor: event.type === 'GAME' ? '#7db5d4' : '#6c757d',
                    borderColor: event.type === 'GAME' ? '#7db5d4' : '#6c757d',
                    extendedProps: {
                        type: event.type,
                        gameId: event.gameId,
                        gameName: event.gameName,
                        description: event.description
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
            start: event.start.toISOString(),
            end: event.end.toISOString(),
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
 */
function openAddEventModal(startTime = null, endTime = null) {
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
    
    // Reset to task tab
    switchEventTab('task');
    
    // Clear any previous selections
    clearGameSelection();
    document.getElementById('eventTaskTitle').value = '';
    document.getElementById('eventTaskDescription').value = '';
    
    // Load games for the modal
    loadGamesForModal();
    
    // Show modal
    modal.style.display = 'flex';
    
    // Focus on title field
    setTimeout(() => {
        document.getElementById('eventTaskTitle').focus();
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
    const btnText = document.getElementById('saveEventBtnText');
    btnText.textContent = type === 'task' ? '✓ Add Task' : '✓ Schedule Gaming';
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
            <img src="${game.coverImageUrl || 'https://via.placeholder.com/40x40?text=?'}" 
                 alt="${game.name}"
                 onerror="this.src='https://via.placeholder.com/40x40?text=?'">
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
        document.getElementById('selectedGameCover').src = selectedGame.coverImageUrl || 'https://via.placeholder.com/36x36?text=?';
        document.getElementById('selectedGameName').textContent = selectedGame.name;
    }
}

/**
 * Clear game selection
 */
function clearGameSelection() {
    selectedGame = null;
    document.getElementById('selectedGameDisplay').style.display = 'none';
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
            start: start.toISOString(),
            end: end.toISOString(),
            type: 'TASK'
        };
    } else {
        // Gaming session
        if (!selectedGame) {
            showToast('Please select a game', 'error');
            return;
        }
        
        eventData = {
            title: `🎮 ${selectedGame.name}`,
            start: start.toISOString(),
            end: end.toISOString(),
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
