/**
 * Lutem - Post-Session Feedback Module (Phase D)
 * Prompts users for feedback on scheduled gaming sessions that have ended
 */

// ============================================
// STATE
// ============================================

// Queue of pending sessions awaiting feedback
let pendingSessionsQueue = [];
// Currently displayed session
let currentFeedbackSession = null;

// ============================================
// CHECK FOR PENDING SESSIONS
// ============================================

/**
 * Check for pending sessions on login/page load
 * Called from auth.js after successful authentication
 */
async function checkPendingSessions() {
    const user = window.authState?.user;
    if (!user) {
        console.log('📋 No user logged in, skipping pending sessions check');
        return;
    }
    
    if (!window.LutemFirestore?.isReady()) {
        console.warn('⚠️ Firestore not ready, skipping pending sessions check');
        return;
    }
    
    try {
        console.log('📋 Checking for pending sessions...');
        const pendingSessions = await window.LutemFirestore.getPendingSessions(user.uid);
        
        if (pendingSessions.length === 0) {
            console.log('✅ No pending sessions requiring feedback');
            updatePendingBadge(0);
            return;
        }
        
        console.log(`📋 Found ${pendingSessions.length} pending session(s) awaiting feedback`);
        pendingSessionsQueue = pendingSessions;
        updatePendingBadge(pendingSessions.length);
        
        // Show feedback modal for the first session
        showFeedbackModal(pendingSessions[0]);
        
    } catch (error) {
        console.error('❌ Error checking pending sessions:', error);
    }
}


// ============================================
// FEEDBACK MODAL DISPLAY
// ============================================

/**
 * Show the feedback modal for a session
 * @param {Object} session - Session object from Firestore
 */
function showFeedbackModal(session) {
    if (!session) {
        console.warn('⚠️ No session provided to showFeedbackModal');
        return;
    }
    
    currentFeedbackSession = session;
    
    // Populate modal with session data
    const modal = document.getElementById('feedbackSessionModal');
    if (!modal) {
        console.error('❌ Feedback modal not found in DOM');
        return;
    }
    
    // Game info
    document.getElementById('feedbackGameName').textContent = session.gameName || 'Unknown Game';
    document.getElementById('feedbackGameGenre').textContent = session.gameGenre || 'Game';
    
    // Set game image
    const imgElement = document.getElementById('feedbackGameImage');
    if (imgElement) {
        imgElement.src = session.gameImageUrl || getFallbackImageUrl(session.gameName, 200, 110);
        imgElement.onerror = function() {
            this.src = getFallbackImageUrl(session.gameName || 'Game', 200, 110);
        };
    }
    
    // Format scheduled time
    const scheduledTime = session.scheduledStart instanceof Date 
        ? session.scheduledStart 
        : new Date(session.scheduledStart);
    document.getElementById('feedbackScheduledTime').textContent = formatFeedbackTime(scheduledTime);
    
    // Reset form to defaults
    resetFeedbackForm();
    
    // Show modal
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
    
    console.log('📋 Showing feedback modal for:', session.gameName);
}

/**
 * Close the feedback modal
 */
function closeFeedbackModal() {
    const modal = document.getElementById('feedbackSessionModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
    currentFeedbackSession = null;
}

/**
 * Reset the feedback form to default values
 */
function resetFeedbackForm() {
    // Reset "Did you play?" selection
    document.querySelectorAll('.did-play-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    document.getElementById('didPlayYes')?.classList.add('selected');
    
    // Reset duration slider
    const durationSlider = document.getElementById('feedbackDuration');
    if (durationSlider) {
        durationSlider.value = 30;
        updateDurationDisplay(30);
    }
    
    // Reset star rating
    document.querySelectorAll('.feedback-star').forEach(star => {
        star.classList.remove('selected');
    });
    
    // Reset emotional tags
    document.querySelectorAll('.emotional-tag').forEach(tag => {
        tag.classList.remove('selected');
    });
    
    // Reset notes
    const notesField = document.getElementById('feedbackNotes');
    if (notesField) notesField.value = '';
    
    // Show/hide conditional fields
    updateFeedbackFormVisibility('YES');
}


// ============================================
// FORM INTERACTION HANDLERS
// ============================================

/**
 * Handle "Did you play?" selection
 * @param {string} value - 'YES', 'NO', or 'DIFFERENT_GAME'
 */
function selectDidPlay(value) {
    // Update button states
    document.querySelectorAll('.did-play-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    document.querySelector(`[data-value="${value}"]`)?.classList.add('selected');
    
    // Show/hide conditional fields
    updateFeedbackFormVisibility(value);
}

/**
 * Update form field visibility based on "Did you play?" selection
 * @param {string} didPlayValue - 'YES', 'NO', or 'DIFFERENT_GAME'
 */
function updateFeedbackFormVisibility(didPlayValue) {
    const playedFields = document.getElementById('feedbackPlayedFields');
    const notPlayedMessage = document.getElementById('feedbackNotPlayedMessage');
    
    if (didPlayValue === 'YES' || didPlayValue === 'DIFFERENT_GAME') {
        if (playedFields) playedFields.style.display = 'block';
        if (notPlayedMessage) notPlayedMessage.style.display = 'none';
    } else {
        if (playedFields) playedFields.style.display = 'none';
        if (notPlayedMessage) notPlayedMessage.style.display = 'block';
    }
}

/**
 * Update duration display from slider
 * @param {number} value - Duration in minutes
 */
function updateDurationDisplay(value) {
    const display = document.getElementById('feedbackDurationDisplay');
    if (display) {
        if (value >= 60) {
            const hours = Math.floor(value / 60);
            const mins = value % 60;
            display.textContent = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
        } else {
            display.textContent = `${value} min`;
        }
    }
}

/**
 * Handle star rating selection
 * @param {number} rating - 1-5 star rating
 */
function selectStarRating(rating) {
    document.querySelectorAll('.feedback-star').forEach((star, index) => {
        if (index < rating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}

/**
 * Toggle emotional tag selection
 * @param {HTMLElement} element - The tag element clicked
 */
function toggleEmotionalTag(element) {
    element.classList.toggle('selected');
}


// ============================================
// FEEDBACK SUBMISSION
// ============================================

/**
 * Submit session feedback to Firestore
 */
async function submitSessionFeedback() {
    if (!currentFeedbackSession) {
        console.error('❌ No session to submit feedback for');
        return;
    }
    
    const user = window.authState?.user;
    if (!user) {
        showToast('Please sign in to submit feedback', 'error');
        return;
    }
    
    // Gather form data
    const didPlayElement = document.querySelector('.did-play-option.selected');
    const didPlay = didPlayElement?.dataset.value || 'YES';
    
    // Get rating
    const selectedStars = document.querySelectorAll('.feedback-star.selected');
    const rating = selectedStars.length > 0 ? selectedStars.length : null;
    
    // Get duration
    const durationSlider = document.getElementById('feedbackDuration');
    const actualDuration = didPlay === 'NO' ? null : parseInt(durationSlider?.value) || 30;
    
    // Get emotional tags
    const selectedTags = Array.from(document.querySelectorAll('.emotional-tag.selected'))
        .map(tag => tag.dataset.tag);
    
    // Get notes
    const notesField = document.getElementById('feedbackNotes');
    const notes = notesField?.value?.trim() || '';
    
    // Build feedback data
    const feedbackData = {
        didPlay: didPlay,
        actualDuration: actualDuration,
        rating: rating,
        emotionalTags: selectedTags,
        notes: notes
    };
    
    console.log('📋 Submitting feedback:', feedbackData);
    
    // Disable submit button
    const submitBtn = document.querySelector('.feedback-submit-btn');
    const originalText = submitBtn?.innerHTML;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>⏳</span> Saving...';
    }
    
    try {
        await window.LutemFirestore.updateSessionFeedback(
            user.uid, 
            currentFeedbackSession.id, 
            feedbackData
        );
        
        console.log('✅ Feedback submitted successfully');
        showToast('Thanks for your feedback!', 'success');
        
        // Remove from queue
        pendingSessionsQueue = pendingSessionsQueue.filter(
            s => s.id !== currentFeedbackSession.id
        );
        updatePendingBadge(pendingSessionsQueue.length);
        
        // Close modal
        closeFeedbackModal();
        
        // Show next pending session if any
        if (pendingSessionsQueue.length > 0) {
            setTimeout(() => {
                showFeedbackModal(pendingSessionsQueue[0]);
            }, 500);
        }
        
    } catch (error) {
        console.error('❌ Failed to submit feedback:', error);
        showToast('Failed to save feedback. Please try again.', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }
}

/**
 * Skip session feedback (mark as skipped)
 */
async function skipSessionFeedback() {
    if (!currentFeedbackSession) {
        closeFeedbackModal();
        return;
    }
    
    const user = window.authState?.user;
    if (!user) {
        closeFeedbackModal();
        return;
    }
    
    try {
        await window.LutemFirestore.markSessionSkipped(
            user.uid, 
            currentFeedbackSession.id
        );
        
        console.log('✅ Session marked as skipped');
        
        // Remove from queue
        pendingSessionsQueue = pendingSessionsQueue.filter(
            s => s.id !== currentFeedbackSession.id
        );
        updatePendingBadge(pendingSessionsQueue.length);
        
        // Close modal
        closeFeedbackModal();
        
        // Show next pending session if any
        if (pendingSessionsQueue.length > 0) {
            setTimeout(() => {
                showFeedbackModal(pendingSessionsQueue[0]);
            }, 500);
        }
        
    } catch (error) {
        console.error('❌ Failed to skip session:', error);
        closeFeedbackModal();
    }
}


// ============================================
// PENDING SESSIONS BADGE
// ============================================

/**
 * Update the pending sessions badge count
 * @param {number} count - Number of pending sessions
 */
function updatePendingBadge(count) {
    const badge = document.getElementById('pendingSessionsBadge');
    if (!badge) return;
    
    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

/**
 * Handle click on pending sessions badge - show first pending session
 */
function showPendingSessionsModal() {
    if (pendingSessionsQueue.length > 0) {
        showFeedbackModal(pendingSessionsQueue[0]);
    } else {
        // Refresh the check
        checkPendingSessions();
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Format time for display in feedback modal
 * @param {Date} date - The scheduled date
 * @returns {string} Formatted time string
 */
function formatFeedbackTime(date) {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (isToday) return `Today at ${timeStr}`;
    if (isYesterday) return `Yesterday at ${timeStr}`;
    
    return date.toLocaleDateString([], { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
    }) + ` at ${timeStr}`;
}

/**
 * Get fallback image URL for games without images
 * Reuse from recommendation.js if available, otherwise define locally
 */
function getFallbackImageUrl(text, width = 200, height = 110) {
    if (typeof window.getFallbackImageUrl === 'function') {
        return window.getFallbackImageUrl(text, width, height);
    }
    return `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22${width}%22 height=%22${height}%22%3E%3Crect fill=%22%23667eea%22 width=%22${width}%22 height=%22${height}%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2216%22 fill=%22white%22%3E🎮 ${encodeURIComponent(text || 'Game')}%3C/text%3E%3C/svg%3E`;
}

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Initialize feedback modal event listeners
 */
function initFeedbackModalEvents() {
    const modal = document.getElementById('feedbackSessionModal');
    if (!modal) return;
    
    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            skipSessionFeedback();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            skipSessionFeedback();
        }
    });
    
    console.log('✅ Feedback modal events initialized');
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFeedbackModalEvents);
} else {
    initFeedbackModalEvents();
}

// ============================================
// GLOBAL EXPORTS
// ============================================

window.checkPendingSessions = checkPendingSessions;
window.showFeedbackModal = showFeedbackModal;
window.closeFeedbackModal = closeFeedbackModal;
window.submitSessionFeedback = submitSessionFeedback;
window.skipSessionFeedback = skipSessionFeedback;
window.selectDidPlay = selectDidPlay;
window.updateDurationDisplay = updateDurationDisplay;
window.selectStarRating = selectStarRating;
window.toggleEmotionalTag = toggleEmotionalTag;
window.showPendingSessionsModal = showPendingSessionsModal;
