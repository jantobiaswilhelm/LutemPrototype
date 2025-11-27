// ============================================
// CALENDAR FUNCTIONALITY
// ============================================

let calendar;
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
    
    calendar = new FullCalendar.Calendar(calendarEl, {
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
        
        // Time slot selection handler - open game wizard
        select: function(info) {
            const duration = (info.end - info.start) / (1000 * 60); // minutes
            showGameWizardForCalendar(info.start, info.end, duration);
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
    
    calendar.render();
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
    if (!calendar) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/calendar/events`);
        if (response.ok) {
            const events = await response.json();
            
            // Clear existing events
            calendar.removeAllEvents();
            
            // Add events with proper colors
            events.forEach(event => {
                calendar.addEvent({
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
