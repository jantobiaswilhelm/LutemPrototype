/**
 * Lutem - Firestore Database Module
 * User profiles, sessions, and preferences stored in Firestore
 */

// Firestore instance (initialized in initFirestore)
let firestoreDb = null;
let firestoreModules = null;

// ==========================================
// SESSION STATUS CONSTANTS
// ==========================================
const SESSION_STATUS = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    SKIPPED: 'SKIPPED',
    EXPIRED: 'EXPIRED'
};

const SESSION_SOURCE = {
    RECOMMENDATION: 'RECOMMENDATION',
    CALENDAR: 'CALENDAR',
    MANUAL: 'MANUAL'
};

const EMOTIONAL_TAGS = {
    RELAXING: 'RELAXING',
    ENERGIZING: 'ENERGIZING',
    SATISFYING: 'SATISFYING',
    FRUSTRATING: 'FRUSTRATING',
    CHALLENGING: 'CHALLENGING',
    FUN: 'FUN'
};


// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get day of week from a Date object
 * @param {Date} date - Date object
 * @returns {string} Day name (MONDAY, TUESDAY, etc.)
 */
function getDayOfWeek(date) {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[date.getDay()];
}

/**
 * Get time of day category from a Date object
 * @param {Date} date - Date object
 * @returns {string} Time category (MORNING, AFTERNOON, EVENING, NIGHT)
 */
function getTimeOfDay(date) {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'MORNING';
    if (hour >= 12 && hour < 17) return 'AFTERNOON';
    if (hour >= 17 && hour < 21) return 'EVENING';
    return 'NIGHT';
}

/**
 * Convert Firestore timestamp to JS Date
 * @param {*} timestamp - Firestore timestamp or JS Date
 * @returns {Date|null}
 */
function toJSDate(timestamp) {
    if (!timestamp) return null;
    if (timestamp.toDate) return timestamp.toDate();
    if (timestamp instanceof Date) return timestamp;
    return new Date(timestamp);
}


// ==========================================
// INITIALIZATION
// ==========================================

/**
 * Initialize Firestore
 * Must be called after Firebase app is initialized
 */
async function initFirestore(firebaseApp) {
    try {
        const { getFirestore, doc, getDoc, setDoc, updateDoc, collection, 
                addDoc, query, orderBy, limit, getDocs, deleteDoc, serverTimestamp,
                where, Timestamp } 
            = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
        
        firestoreDb = getFirestore(firebaseApp);
        
        // Store modules for later use
        firestoreModules = {
            doc, getDoc, setDoc, updateDoc, collection,
            addDoc, query, orderBy, limit, getDocs, deleteDoc, serverTimestamp,
            where, Timestamp
        };
        
        console.log('✅ Firestore initialized');
        return true;
    } catch (error) {
        console.error('❌ Firestore initialization failed:', error);
        return false;
    }
}


// ==========================================
// USER PROFILE OPERATIONS
// ==========================================

/**
 * Get user profile from Firestore
 * @param {string} uid - Firebase user ID
 * @returns {Object|null} User profile or null
 */
async function getUserProfile(uid) {
    if (!firestoreDb || !firestoreModules) {
        console.warn('Firestore not initialized');
        return null;
    }
    
    try {
        const { doc, getDoc } = firestoreModules;
        const docRef = doc(firestoreDb, 'users', uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
}


/**
 * Save/update user profile in Firestore
 * @param {string} uid - Firebase user ID
 * @param {Object} profileData - Profile data to save
 */
async function saveUserProfile(uid, profileData) {
    if (!firestoreDb || !firestoreModules) {
        console.warn('Firestore not initialized');
        return;
    }
    
    try {
        const { doc, setDoc, serverTimestamp } = firestoreModules;
        const docRef = doc(firestoreDb, 'users', uid);
        
        await setDoc(docRef, {
            ...profileData,
            updatedAt: serverTimestamp()
        }, { merge: true });
        
        console.log('✅ Profile saved to Firestore');
    } catch (error) {
        console.error('Error saving user profile:', error);
        throw error;
    }
}

/**
 * Create initial profile for new user
 * @param {string} uid - Firebase user ID
 * @param {Object} authData - Data from Firebase Auth
 * @returns {Object} Created profile
 */
async function createUserProfile(uid, authData) {
    if (!firestoreDb || !firestoreModules) {
        console.warn('Firestore not initialized');
        return null;
    }
    
    const { doc, setDoc, serverTimestamp } = firestoreModules;
    
    const initialProfile = {
        email: authData.email || '',
        displayName: authData.displayName || '',
        photoURL: authData.photoURL || '',
        preferredGenres: [],
        typicalSessionLength: '30-60',
        engagementLevel: 'moderate',
        preferredGamingTimes: ['evening'],
        primaryGoal: 'relaxation',
        emotionalGoals: ['unwind', 'recharge'],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        profileComplete: false
    };
    
    try {
        const docRef = doc(firestoreDb, 'users', uid);
        await setDoc(docRef, initialProfile);
        console.log('✅ New user profile created in Firestore');
        return initialProfile;
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
    }
}


// ==========================================
// SESSION OPERATIONS (Phase A: Feedback Flow)
// ==========================================

/**
 * Create a pending session when user schedules a game
 * @param {string} uid - Firebase user ID
 * @param {Object} sessionData - Session data from recommendation
 * @returns {string} Session document ID
 */
async function createPendingSession(uid, sessionData) {
    if (!firestoreDb || !firestoreModules) {
        console.warn('Firestore not initialized');
        return null;
    }
    
    const { collection, addDoc, serverTimestamp, Timestamp } = firestoreModules;
    
    // Calculate derived fields
    const scheduledDate = sessionData.scheduledStart instanceof Date 
        ? sessionData.scheduledStart 
        : new Date(sessionData.scheduledStart);
    
    const session = {
        // Game context
        gameId: sessionData.gameId,
        gameName: sessionData.gameName,
        gameGenre: sessionData.gameGenre || '',
        gameImageUrl: sessionData.gameImageUrl || '',
        
        // Recommendation context
        moodSelected: sessionData.moodSelected || '',
        energyLevel: sessionData.energyLevel || '',
        timeAvailable: sessionData.timeAvailable || 0,
        matchPercentage: sessionData.matchPercentage || 0,
        recommendationReason: sessionData.recommendationReason || '',
        
        // Scheduling
        scheduledStart: Timestamp.fromDate(scheduledDate),
        scheduledEnd: Timestamp.fromDate(
            new Date(scheduledDate.getTime() + (sessionData.duration || 30) * 60000)
        ),
        status: SESSION_STATUS.PENDING,
        source: sessionData.source || SESSION_SOURCE.RECOMMENDATION,
        
        // Feedback (null until completed)
        didPlay: null,
        actualDuration: null,
        rating: null,
        emotionalTags: [],
        notes: '',
        feedbackAt: null,
        
        // Metadata
        createdAt: serverTimestamp(),
        dayOfWeek: getDayOfWeek(scheduledDate),
        timeOfDay: getTimeOfDay(scheduledDate)
    };
    
    try {
        const sessionsRef = collection(firestoreDb, 'users', uid, 'sessions');
        const docRef = await addDoc(sessionsRef, session);
        console.log('✅ Pending session created:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error creating pending session:', error);
        throw error;
    }
}


/**
 * Get pending sessions that are ready for feedback (scheduledEnd has passed)
 * @param {string} uid - Firebase user ID
 * @returns {Array} Array of pending session objects
 */
async function getPendingSessions(uid) {
    if (!firestoreDb || !firestoreModules) {
        console.warn('Firestore not initialized');
        return [];
    }
    
    const { collection, query, where, orderBy, getDocs, Timestamp } = firestoreModules;
    
    try {
        const sessionsRef = collection(firestoreDb, 'users', uid, 'sessions');
        const now = Timestamp.now();
        
        // Query for PENDING sessions where scheduledEnd has passed
        const q = query(
            sessionsRef,
            where('status', '==', SESSION_STATUS.PENDING),
            where('scheduledEnd', '<=', now),
            orderBy('scheduledEnd', 'desc')
        );
        
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            scheduledStart: toJSDate(doc.data().scheduledStart),
            scheduledEnd: toJSDate(doc.data().scheduledEnd),
            createdAt: toJSDate(doc.data().createdAt)
        }));
    } catch (error) {
        console.error('Error getting pending sessions:', error);
        throw error;
    }
}


/**
 * Get session history with pagination
 * @param {string} uid - Firebase user ID
 * @param {number} maxResults - Max sessions to return
 * @returns {Array} Array of session objects
 */
async function getSessionHistory(uid, maxResults = 20) {
    if (!firestoreDb || !firestoreModules) {
        console.warn('Firestore not initialized');
        return [];
    }
    
    const { collection, query, orderBy, limit, getDocs } = firestoreModules;
    
    try {
        const sessionsRef = collection(firestoreDb, 'users', uid, 'sessions');
        const q = query(
            sessionsRef, 
            orderBy('createdAt', 'desc'), 
            limit(maxResults)
        );
        
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            scheduledStart: toJSDate(doc.data().scheduledStart),
            scheduledEnd: toJSDate(doc.data().scheduledEnd),
            createdAt: toJSDate(doc.data().createdAt),
            feedbackAt: toJSDate(doc.data().feedbackAt)
        }));
    } catch (error) {
        console.error('Error getting session history:', error);
        throw error;
    }
}


/**
 * Update session with feedback after playing
 * @param {string} uid - Firebase user ID
 * @param {string} sessionId - Session document ID
 * @param {Object} feedbackData - Feedback data
 */
async function updateSessionFeedback(uid, sessionId, feedbackData) {
    if (!firestoreDb || !firestoreModules) {
        console.warn('Firestore not initialized');
        return;
    }
    
    const { doc, updateDoc, serverTimestamp } = firestoreModules;
    
    try {
        const sessionRef = doc(firestoreDb, 'users', uid, 'sessions', sessionId);
        
        await updateDoc(sessionRef, {
            didPlay: feedbackData.didPlay || 'YES',
            actualDuration: feedbackData.actualDuration || null,
            rating: feedbackData.rating || null,
            emotionalTags: feedbackData.emotionalTags || [],
            notes: feedbackData.notes || '',
            status: SESSION_STATUS.COMPLETED,
            feedbackAt: serverTimestamp()
        });
        
        console.log('✅ Session feedback updated:', sessionId);
    } catch (error) {
        console.error('Error updating session feedback:', error);
        throw error;
    }
}


/**
 * Mark a session as skipped (user dismissed without feedback)
 * @param {string} uid - Firebase user ID
 * @param {string} sessionId - Session document ID
 */
async function markSessionSkipped(uid, sessionId) {
    if (!firestoreDb || !firestoreModules) {
        console.warn('Firestore not initialized');
        return;
    }
    
    const { doc, updateDoc, serverTimestamp } = firestoreModules;
    
    try {
        const sessionRef = doc(firestoreDb, 'users', uid, 'sessions', sessionId);
        
        await updateDoc(sessionRef, {
            status: SESSION_STATUS.SKIPPED,
            feedbackAt: serverTimestamp()
        });
        
        console.log('✅ Session marked as skipped:', sessionId);
    } catch (error) {
        console.error('Error marking session as skipped:', error);
        throw error;
    }
}


/**
 * Create a manual session entry (for logging past sessions)
 * @param {string} uid - Firebase user ID
 * @param {Object} sessionData - Manual session data
 * @returns {string} Session document ID
 */
async function createManualSession(uid, sessionData) {
    if (!firestoreDb || !firestoreModules) {
        console.warn('Firestore not initialized');
        return null;
    }
    
    const { collection, addDoc, serverTimestamp, Timestamp } = firestoreModules;
    
    // Use provided date or now
    const playedDate = sessionData.playedDate instanceof Date 
        ? sessionData.playedDate 
        : new Date(sessionData.playedDate || Date.now());
    
    const session = {
        // Game context
        gameId: sessionData.gameId,
        gameName: sessionData.gameName,
        gameGenre: sessionData.gameGenre || '',
        gameImageUrl: sessionData.gameImageUrl || '',
        
        // No recommendation context for manual entries
        moodSelected: sessionData.moodSelected || '',
        energyLevel: '',
        timeAvailable: 0,
        matchPercentage: 0,
        recommendationReason: '',
        
        // Scheduling (manual = immediate)
        scheduledStart: Timestamp.fromDate(playedDate),
        scheduledEnd: Timestamp.fromDate(
            new Date(playedDate.getTime() + (sessionData.duration || 30) * 60000)
        ),
        status: SESSION_STATUS.COMPLETED,
        source: SESSION_SOURCE.MANUAL,
        
        // Feedback (included in manual entry)
        didPlay: 'YES',
        actualDuration: sessionData.duration || null,
        rating: sessionData.rating || null,
        emotionalTags: sessionData.emotionalTags || [],
        notes: sessionData.notes || '',
        feedbackAt: serverTimestamp(),
        
        // Metadata
        createdAt: serverTimestamp(),
        dayOfWeek: getDayOfWeek(playedDate),
        timeOfDay: getTimeOfDay(playedDate)
    };
    
    try {
        const sessionsRef = collection(firestoreDb, 'users', uid, 'sessions');
        const docRef = await addDoc(sessionsRef, session);
        console.log('✅ Manual session created:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error creating manual session:', error);
        throw error;
    }
}


/**
 * Get all sessions for calendar display (any status)
 * @param {string} uid - Firebase user ID
 * @param {Date} startDate - Start of date range
 * @param {Date} endDate - End of date range
 * @returns {Array} Array of session objects
 */
async function getSessionsForDateRange(uid, startDate, endDate) {
    if (!firestoreDb || !firestoreModules) {
        console.warn('Firestore not initialized');
        return [];
    }
    
    const { collection, query, where, orderBy, getDocs, Timestamp } = firestoreModules;
    
    try {
        const sessionsRef = collection(firestoreDb, 'users', uid, 'sessions');
        const q = query(
            sessionsRef,
            where('scheduledStart', '>=', Timestamp.fromDate(startDate)),
            where('scheduledStart', '<=', Timestamp.fromDate(endDate)),
            orderBy('scheduledStart', 'asc')
        );
        
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            scheduledStart: toJSDate(doc.data().scheduledStart),
            scheduledEnd: toJSDate(doc.data().scheduledEnd),
            createdAt: toJSDate(doc.data().createdAt),
            feedbackAt: toJSDate(doc.data().feedbackAt)
        }));
    } catch (error) {
        console.error('Error getting sessions for date range:', error);
        throw error;
    }
}


/**
 * Delete a session
 * @param {string} uid - Firebase user ID
 * @param {string} sessionId - Session document ID
 */
async function deleteSession(uid, sessionId) {
    if (!firestoreDb || !firestoreModules) {
        console.warn('Firestore not initialized');
        return;
    }
    
    const { doc, deleteDoc } = firestoreModules;
    
    try {
        const sessionRef = doc(firestoreDb, 'users', uid, 'sessions', sessionId);
        await deleteDoc(sessionRef);
        console.log('✅ Session deleted:', sessionId);
    } catch (error) {
        console.error('Error deleting session:', error);
        throw error;
    }
}

// ==========================================
// HELPER: Check if Firestore is ready
// ==========================================

function isFirestoreReady() {
    return firestoreDb !== null && firestoreModules !== null;
}


// ==========================================
// EXPORTS
// ==========================================

// Export constants
window.LutemSessionStatus = SESSION_STATUS;
window.LutemSessionSource = SESSION_SOURCE;
window.LutemEmotionalTags = EMOTIONAL_TAGS;

// Export for global access
window.LutemFirestore = {
    // Initialization
    init: initFirestore,
    isReady: isFirestoreReady,
    
    // User Profile
    getUserProfile,
    saveUserProfile,
    createUserProfile,
    
    // Session Operations (Phase A: Feedback Flow)
    createPendingSession,
    getPendingSessions,
    getSessionHistory,
    updateSessionFeedback,
    markSessionSkipped,
    createManualSession,
    getSessionsForDateRange,
    deleteSession,
    
    // Helper functions exposed for testing
    helpers: {
        getDayOfWeek,
        getTimeOfDay,
        toJSDate
    }
};
