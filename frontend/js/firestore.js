/**
 * Lutem - Firestore Database Module
 * User profiles, sessions, and preferences stored in Firestore
 */

// Firestore instance (initialized in initFirestore)
let firestoreDb = null;
let firestoreModules = null;

/**
 * Initialize Firestore
 * Must be called after Firebase app is initialized
 */
async function initFirestore(firebaseApp) {
    try {
        const { getFirestore, doc, getDoc, setDoc, updateDoc, collection, 
                addDoc, query, orderBy, limit, getDocs, deleteDoc, serverTimestamp } 
            = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
        
        firestoreDb = getFirestore(firebaseApp);
        
        // Store modules for later use
        firestoreModules = {
            doc, getDoc, setDoc, updateDoc, collection,
            addDoc, query, orderBy, limit, getDocs, deleteDoc, serverTimestamp
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
        // Auth data
        email: authData.email || '',
        displayName: authData.displayName || '',
        photoURL: authData.photoURL || '',
        
        // Default preferences
        preferredGenres: [],
        typicalSessionLength: '30-60',
        engagementLevel: 'moderate',
        preferredGamingTimes: ['evening'],
        primaryGoal: 'relaxation',
        emotionalGoals: ['unwind', 'recharge'],
        
        // Meta
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
// SESSION OPERATIONS
// ==========================================

/**
 * Log a gaming session
 * @param {string} uid - Firebase user ID
 * @param {Object} sessionData - Session data
 * @returns {string} Session document ID
 */
async function logSession(uid, sessionData) {
    if (!firestoreDb || !firestoreModules) {
        console.warn('Firestore not initialized');
        return null;
    }
    
    try {
        const { collection, addDoc, serverTimestamp } = firestoreModules;
        const sessionsRef = collection(firestoreDb, 'users', uid, 'sessions');
        
        const docRef = await addDoc(sessionsRef, {
            ...sessionData,
            createdAt: serverTimestamp()
        });
        
        console.log('✅ Session logged:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error logging session:', error);
        throw error;
    }
}

/**
 * Get user's recent sessions
 * @param {string} uid - Firebase user ID
 * @param {number} maxResults - Max sessions to return
 * @returns {Array} Array of session objects
 */
async function getRecentSessions(uid, maxResults = 10) {
    if (!firestoreDb || !firestoreModules) {
        console.warn('Firestore not initialized');
        return [];
    }
    
    try {
        const { collection, query, orderBy, limit, getDocs } = firestoreModules;
        const sessionsRef = collection(firestoreDb, 'users', uid, 'sessions');
        const q = query(sessionsRef, orderBy('createdAt', 'desc'), limit(maxResults));
        
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting sessions:', error);
        throw error;
    }
}

/**
 * Update session with feedback
 * @param {string} uid - Firebase user ID
 * @param {string} sessionId - Session document ID
 * @param {Object} feedback - Feedback data
 */
async function updateSessionFeedback(uid, sessionId, feedback) {
    if (!firestoreDb || !firestoreModules) {
        console.warn('Firestore not initialized');
        return;
    }
    
    try {
        const { doc, updateDoc, serverTimestamp } = firestoreModules;
        const sessionRef = doc(firestoreDb, 'users', uid, 'sessions', sessionId);
        
        await updateDoc(sessionRef, {
            satisfaction: feedback.satisfaction,
            moodTag: feedback.moodTag || null,
            feedbackAt: serverTimestamp()
        });
        
        console.log('✅ Session feedback updated');
    } catch (error) {
        console.error('Error updating session feedback:', error);
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
    
    try {
        const { doc, deleteDoc } = firestoreModules;
        const sessionRef = doc(firestoreDb, 'users', uid, 'sessions', sessionId);
        await deleteDoc(sessionRef);
        console.log('✅ Session deleted');
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

// Export for global access
window.LutemFirestore = {
    init: initFirestore,
    isReady: isFirestoreReady,
    getUserProfile,
    saveUserProfile,
    createUserProfile,
    logSession,
    getRecentSessions,
    updateSessionFeedback,
    deleteSession
};
