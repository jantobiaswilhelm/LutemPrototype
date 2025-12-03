// ============================================
// PROFILE PAGE FUNCTIONALITY
// Connected to Firebase Firestore
// ============================================

// Track if profile has been loaded this session
let profileLoadedFromFirestore = false;

/**
 * Initialize profile page event listeners
 */
function initProfilePage() {
    // Genre tag toggle
    const genreTags = document.querySelectorAll('.genre-tag');
    genreTags.forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('active');
        });
    });
    
    // Load saved profile
    loadProfile();
}

/**
 * Load profile - from Firestore if authenticated, localStorage as fallback
 */
async function loadProfile() {
    const saveBtn = document.querySelector('#profile-page .btn-primary');
    
    // Check if user is authenticated
    if (window.authState?.isAuthenticated && window.authState?.user?.uid) {
        await loadProfileFromFirestore(saveBtn);
    } else {
        // Fallback to localStorage for non-authenticated users
        loadProfileFromLocalStorage();
    }
}


/**
 * Load profile from Firestore
 */
async function loadProfileFromFirestore(saveBtn) {
    const uid = window.authState.user.uid;
    
    // Show loading state
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '⏳ Loading...';
    }
    
    try {
        // First check if we have cached profile in memory
        let profile = window.userProfile;
        
        // If not cached, fetch from Firestore
        if (!profile && window.LutemFirestore?.isReady()) {
            console.log('📥 Loading profile from Firestore...');
            profile = await window.LutemFirestore.getUserProfile(uid);
            
            if (profile) {
                window.userProfile = profile;
            }
        }
        
        if (profile) {
            populateFormFromProfile(profile);
            profileLoadedFromFirestore = true;
            console.log('✅ Profile loaded from Firestore:', profile);
        } else {
            console.log('ℹ️ No profile found, using defaults');
        }
        
    } catch (error) {
        console.error('❌ Error loading profile from Firestore:', error);
        showProfileToast('Failed to load profile', 'error');
        // Try localStorage as fallback
        loadProfileFromLocalStorage();
    } finally {
        // Restore button state
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = '💾 Save Profile';
        }
    }
}

/**
 * Load profile from localStorage (fallback)
 */
function loadProfileFromLocalStorage() {
    const savedProfile = localStorage.getItem('lutemProfile');
    if (savedProfile) {
        try {
            const profile = JSON.parse(savedProfile);
            populateFormFromProfile(profile);
            console.log('📦 Profile loaded from localStorage:', profile);
        } catch (e) {
            console.error('Error parsing localStorage profile:', e);
        }
    }
}


/**
 * Populate form fields from profile data
 */
function populateFormFromProfile(profile) {
    // Restore basic info
    if (profile.displayName) {
        const el = document.getElementById('displayName');
        if (el) el.value = profile.displayName;
    }
    if (profile.gamingSince) {
        const el = document.getElementById('gamingSince');
        if (el) el.value = profile.gamingSince;
    }
    
    // Session length (handle both old and new field names)
    const sessionLength = profile.sessionLength || profile.typicalSessionLength;
    if (sessionLength) {
        const el = document.getElementById('sessionLength');
        if (el) el.value = sessionLength;
    }
    
    // Engagement level
    if (profile.engagementLevel) {
        const el = document.getElementById('engagementLevel');
        if (el) el.value = profile.engagementLevel;
    }
    
    // Restore selected genres (handle both field names)
    const genres = profile.genres || profile.preferredGenres;
    if (genres && genres.length > 0) {
        // First, clear all active states
        document.querySelectorAll('.genre-tag').forEach(tag => {
            tag.classList.remove('active');
        });
        // Then activate matching genres
        document.querySelectorAll('.genre-tag').forEach(tag => {
            if (genres.includes(tag.textContent)) {
                tag.classList.add('active');
            }
        });
    }

    
    // Restore gaming times (handle both field names)
    const gamingTimes = profile.gamingTimes || profile.preferredGamingTimes;
    if (gamingTimes && gamingTimes.length > 0) {
        // Clear all checkboxes first
        document.querySelectorAll('input[name="gaming-time"]').forEach(cb => {
            cb.checked = false;
        });
        // Check matching times
        gamingTimes.forEach(time => {
            const checkbox = document.querySelector(`input[name="gaming-time"][value="${time}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    
    // Restore priority (handle both field names)
    const priority = profile.priority || profile.primaryGoal;
    if (priority) {
        const radio = document.querySelector(`input[name="priority"][value="${priority}"]`);
        if (radio) radio.checked = true;
    }
    
    // Restore emotional goals
    if (profile.emotionalGoals && profile.emotionalGoals.length > 0) {
        // Clear all checkboxes first
        document.querySelectorAll('input[name="emotional-goal"]').forEach(cb => {
            cb.checked = false;
        });
        // Check matching goals
        profile.emotionalGoals.forEach(goal => {
            const checkbox = document.querySelector(`input[name="emotional-goal"][value="${goal}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
}


/**
 * Save profile - to Firestore if authenticated, localStorage as fallback
 */
async function saveProfile() {
    // Collect all profile data from form
    const profileData = collectFormData();
    
    // Get the save button from the event
    const saveBtn = event?.target || document.querySelector('#profile-page .btn-primary');
    
    // Check if user is authenticated
    if (window.authState?.isAuthenticated && window.authState?.user?.uid) {
        await saveProfileToFirestore(profileData, saveBtn);
    } else {
        // Fallback to localStorage for non-authenticated users
        saveProfileToLocalStorage(profileData, saveBtn);
    }
}

/**
 * Collect form data into profile object
 */
function collectFormData() {
    const displayName = document.getElementById('displayName')?.value || '';
    const gamingSince = document.getElementById('gamingSince')?.value || '';
    const sessionLength = document.getElementById('sessionLength')?.value || '30-60';
    const engagementLevel = document.getElementById('engagementLevel')?.value || 'moderate';
    
    // Get selected genres
    const selectedGenres = Array.from(document.querySelectorAll('.genre-tag.active'))
        .map(tag => tag.textContent);
    
    // Get gaming times
    const gamingTimes = Array.from(document.querySelectorAll('input[name="gaming-time"]:checked'))
        .map(input => input.value);

    
    // Get priority
    const priority = document.querySelector('input[name="priority"]:checked')?.value || 'relaxation';
    
    // Get emotional goals
    const emotionalGoals = Array.from(document.querySelectorAll('input[name="emotional-goal"]:checked'))
        .map(input => input.value);
    
    return {
        displayName,
        gamingSince,
        // Use both field names for compatibility
        sessionLength,
        typicalSessionLength: sessionLength,
        engagementLevel,
        genres: selectedGenres,
        preferredGenres: selectedGenres,
        gamingTimes,
        preferredGamingTimes: gamingTimes,
        priority,
        primaryGoal: priority,
        emotionalGoals,
        profileComplete: true
    };
}

/**
 * Save profile to Firestore
 */
async function saveProfileToFirestore(profileData, saveBtn) {
    const uid = window.authState.user.uid;
    const originalText = saveBtn?.innerHTML || '💾 Save Profile';

    
    // Show saving state
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '⏳ Saving...';
        saveBtn.style.background = '';
    }
    
    try {
        if (!window.LutemFirestore?.isReady()) {
            throw new Error('Firestore not ready');
        }
        
        await window.LutemFirestore.saveUserProfile(uid, profileData);
        
        // Update local cache
        window.userProfile = { ...window.userProfile, ...profileData };
        
        // Also save to localStorage as backup
        localStorage.setItem('lutemProfile', JSON.stringify(profileData));
        
        // Show success
        if (saveBtn) {
            saveBtn.innerHTML = '✅ Profile Saved!';
            saveBtn.style.background = '#10b981';
            
            setTimeout(() => {
                saveBtn.innerHTML = originalText;
                saveBtn.style.background = '';
                saveBtn.disabled = false;
            }, 2000);
        }
        
        showProfileToast('Profile saved!', 'success');
        console.log('✅ Profile saved to Firestore:', profileData);

        
    } catch (error) {
        console.error('❌ Error saving profile to Firestore:', error);
        
        // Show error but restore button
        if (saveBtn) {
            saveBtn.innerHTML = '❌ Save Failed';
            saveBtn.style.background = '#ef4444';
            
            setTimeout(() => {
                saveBtn.innerHTML = originalText;
                saveBtn.style.background = '';
                saveBtn.disabled = false;
            }, 2000);
        }
        
        showProfileToast('Failed to save profile. Please try again.', 'error');
        
        // Still save to localStorage as fallback
        localStorage.setItem('lutemProfile', JSON.stringify(profileData));
    }
}

/**
 * Save profile to localStorage (fallback)
 */
function saveProfileToLocalStorage(profileData, saveBtn) {
    const originalText = saveBtn?.innerHTML || '💾 Save Profile';
    
    // Add timestamp
    profileData.savedAt = new Date().toISOString();
    
    // Save to localStorage
    localStorage.setItem('lutemProfile', JSON.stringify(profileData));

    
    // Show success message
    if (saveBtn) {
        saveBtn.innerHTML = '✅ Profile Saved!';
        saveBtn.style.background = '#10b981';
        
        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.style.background = '';
        }, 2000);
    }
    
    console.log('📦 Profile saved to localStorage:', profileData);
}

/**
 * Show toast notification for profile actions
 */
function showProfileToast(message, type = 'info') {
    // Reuse the auth toast if available, otherwise create simple one
    if (typeof showAuthToast === 'function') {
        showAuthToast(message, type);
        return;
    }
    
    // Simple fallback toast
    const toast = document.createElement('div');
    toast.className = `profile-toast profile-toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        z-index: 10001;
        opacity: 0;
        transition: opacity 0.3s;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '1'; }, 10);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}


/**
 * Reload profile when tab becomes visible
 * Called from navigation when Profile tab is opened
 */
async function onProfileTabOpen() {
    // If user is now authenticated but profile wasn't loaded from Firestore yet
    if (window.authState?.isAuthenticated && !profileLoadedFromFirestore) {
        console.log('📱 Profile tab opened, loading from Firestore...');
        await loadProfile();
    }
}

// Export for tab navigation
window.onProfileTabOpen = onProfileTabOpen;
