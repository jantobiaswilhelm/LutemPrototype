/**
 * Lutem - Authentication Module
 * Firebase Authentication for Google and Email/Password sign-in
 */

// Firebase SDK imports (loaded via CDN in index.html)
// We'll access firebase modules from the global scope after SDK loads

// Auth state (also defined in state.js, but managed here)
window.authState = {
    user: null,
    isAuthenticated: false,
    isLoading: true
};

// Firebase app instance
let firebaseApp = null;
let firebaseAuth = null;

/**
 * Initialize Firebase Authentication
 * Must be called after Firebase SDK is loaded
 */
async function initAuth() {
    try {
        // Firebase config - these are safe to expose (they're like a public API key)
        const firebaseConfig = {
            apiKey: "AIzaSyDPiWoSxr-e9OO76xY7CRxNNe3CeGLc0hc",
            authDomain: "lutem-68f3a.firebaseapp.com",
            projectId: "lutem-68f3a",
            storageBucket: "lutem-68f3a.firebasestorage.app",
            messagingSenderId: "980654641414",
            appId: "1:980654641414:web:5efe326e3d57c88294ce87",
            measurementId: "G-0TXFY5MV82"
        };

        // Initialize Firebase
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
        const { getAuth, onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, 
                createUserWithEmailAndPassword, signOut: firebaseSignOut, 
                GoogleAuthProvider, updateProfile } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
        
        firebaseApp = initializeApp(firebaseConfig);
        firebaseAuth = getAuth(firebaseApp);
        
        // Initialize Firestore
        if (window.LutemFirestore) {
            await window.LutemFirestore.init(firebaseApp);
        }
        
        // Store auth functions for later use
        window._firebaseAuthFunctions = {
            signInWithPopup,
            signInWithEmailAndPassword,
            createUserWithEmailAndPassword,
            signOut: firebaseSignOut,
            GoogleAuthProvider,
            updateProfile
        };
        
        // Set up auth state listener
        onAuthStateChanged(firebaseAuth, handleAuthStateChange);
        
        console.log('✅ Firebase Auth initialized');
        return true;
    } catch (error) {
        console.error('❌ Firebase Auth initialization failed:', error);
        window.authState.isLoading = false;
        return false;
    }
}

/**
 * Handle auth state changes
 */
async function handleAuthStateChange(user) {
    console.log('🔐 Auth state changed:', user ? user.email : 'signed out');
    
    window.authState.user = user;
    window.authState.isAuthenticated = !!user;
    window.authState.isLoading = false;
    
    // Update UI based on auth state
    updateAuthUI();
    
    // If user just signed in, load/create Firestore profile and sync with backend
    if (user) {
        await loadOrCreateFirestoreProfile(user);
        syncUserWithBackend();
        migratePendingSession();
        
        // Check for pending sessions that need feedback (Phase D)
        if (typeof checkPendingSessions === 'function') {
            setTimeout(() => checkPendingSessions(), 500);
        }
    } else {
        // Clear cached profile on sign out
        window.userProfile = null;
    }
}

/**
 * Load existing profile or create new one for user
 */
async function loadOrCreateFirestoreProfile(user) {
    if (!window.LutemFirestore || !window.LutemFirestore.isReady()) {
        console.warn('⚠️ Firestore not ready, skipping profile load');
        window.userProfile = {};
        return;
    }
    
    try {
        let profile = await window.LutemFirestore.getUserProfile(user.uid);
        
        if (!profile) {
            // First-time user - create profile
            console.log('📝 Creating new Firestore profile for user...');
            profile = await window.LutemFirestore.createUserProfile(user.uid, {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            });
        }
        
        // Cache profile in memory
        window.userProfile = profile;
        console.log('✅ User profile loaded:', profile);
        
    } catch (error) {
        console.error('❌ Error loading/creating profile:', error);
        window.userProfile = {};
    }
}

/**
 * Sync user with backend (creates user record on first login)
 */
async function syncUserWithBackend() {
    try {
        const token = await getIdToken();
        if (!token) {
            console.warn('⚠️ No ID token available for backend sync');
            return;
        }
        
        const response = await fetch(`${window.LutemConfig?.API_URL || 'http://localhost:8080'}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const backendUser = await response.json();
            console.log('✅ User synced with backend:', backendUser);
            window.authState.backendUser = backendUser;
        } else {
            console.warn('⚠️ Backend sync failed:', response.status);
        }
    } catch (error) {
        console.warn('⚠️ Backend sync error (server may be offline):', error.message);
    }
}

/**
 * Sign in with Google popup
 */
async function signInWithGoogle() {
    try {
        showAuthLoading(true);
        const { signInWithPopup, GoogleAuthProvider } = window._firebaseAuthFunctions;
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(firebaseAuth, provider);
        console.log('✅ Google sign-in successful:', result.user.email);
        closeAuthModal();
        showAuthToast('Welcome, ' + (result.user.displayName || result.user.email) + '!', 'success');
        return result.user;
    } catch (error) {
        console.error('❌ Google sign-in failed:', error);
        showAuthError(getAuthErrorMessage(error));
        return null;
    } finally {
        showAuthLoading(false);
    }
}

/**
 * Sign in with email and password
 */
async function signInWithEmail(email, password) {
    try {
        showAuthLoading(true);
        const { signInWithEmailAndPassword } = window._firebaseAuthFunctions;
        const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
        console.log('✅ Email sign-in successful:', result.user.email);
        closeAuthModal();
        showAuthToast('Welcome back!', 'success');
        return result.user;
    } catch (error) {
        console.error('❌ Email sign-in failed:', error);
        showAuthError(getAuthErrorMessage(error));
        return null;
    } finally {
        showAuthLoading(false);
    }
}

/**
 * Create new account with email and password
 */
async function signUpWithEmail(email, password, displayName) {
    try {
        showAuthLoading(true);
        const { createUserWithEmailAndPassword, updateProfile } = window._firebaseAuthFunctions;
        const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        
        // Update display name if provided
        if (displayName && result.user) {
            await updateProfile(result.user, { displayName });
        }
        
        console.log('✅ Account created:', result.user.email);
        closeAuthModal();
        showAuthToast('Account created! Welcome to Lutem!', 'success');
        return result.user;
    } catch (error) {
        console.error('❌ Sign-up failed:', error);
        showAuthError(getAuthErrorMessage(error));
        return null;
    } finally {
        showAuthLoading(false);
    }
}

/**
 * Sign out current user
 */
async function signOut() {
    try {
        const { signOut: firebaseSignOut } = window._firebaseAuthFunctions;
        await firebaseSignOut(firebaseAuth);
        console.log('✅ Signed out');
        showAuthToast('Signed out successfully', 'info');
    } catch (error) {
        console.error('❌ Sign-out failed:', error);
    }
}

/**
 * Get current Firebase ID token for API calls
 */
async function getIdToken() {
    if (!window.authState.isAuthenticated || !firebaseAuth.currentUser) {
        return null;
    }
    try {
        return await firebaseAuth.currentUser.getIdToken();
    } catch (error) {
        console.error('❌ Failed to get ID token:', error);
        return null;
    }
}

/**
 * Get current user
 */
function getCurrentUser() {
    return window.authState.user;
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return window.authState.isAuthenticated;
}

// ============================================
// UI HELPERS
// ============================================

/**
 * Update UI based on auth state
 */
function updateAuthUI() {
    const userHeader = document.getElementById('userHeaderSection');
    const signInBtn = document.getElementById('headerSignInBtn');
    const userAvatar = document.getElementById('userHeaderAvatar');
    const userName = document.getElementById('userHeaderName');
    
    if (window.authState.isAuthenticated && window.authState.user) {
        // User is signed in
        if (signInBtn) signInBtn.style.display = 'none';
        if (userHeader) userHeader.style.display = 'flex';
        if (userName) userName.textContent = window.authState.user.displayName || 'Player';
        if (userAvatar) {
            if (window.authState.user.photoURL) {
                userAvatar.innerHTML = `<img src="${window.authState.user.photoURL}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%;">`;
            } else {
                userAvatar.innerHTML = '👤';
            }
        }
    } else {
        // User is signed out
        if (signInBtn) signInBtn.style.display = 'flex';
        if (userHeader) userHeader.style.display = 'none';
    }
    
    // Update sidebar auth UI (desktop)
    updateSidebarAuthUI(
        window.authState.isAuthenticated, 
        window.authState.user?.displayName || 'Player'
    );
    
    // Update tab visibility (for Phase 3 gating)
    updateTabGating();
}

/**
 * Update tab gating based on auth state
 * Calendar and Profile tabs require authentication
 */
function updateTabGating() {
    const calendarTab = document.querySelector('[data-page="calendar"]');
    const profileTab = document.querySelector('[data-page="profile"]');
    const calendarOverlay = document.getElementById('calendarLockedOverlay');
    const profileOverlay = document.getElementById('profileLockedOverlay');
    
    // While loading, keep tabs locked but don't show overlay yet
    if (window.authState.isLoading) {
        if (calendarTab) calendarTab.classList.add('tab-locked');
        if (profileTab) profileTab.classList.add('tab-locked');
        if (calendarOverlay) calendarOverlay.style.display = 'none';
        if (profileOverlay) profileOverlay.style.display = 'none';
        return;
    }
    
    if (window.authState.isAuthenticated) {
        // Unlock tabs
        if (calendarTab) calendarTab.classList.remove('tab-locked');
        if (profileTab) profileTab.classList.remove('tab-locked');
        // Hide overlays
        if (calendarOverlay) calendarOverlay.style.display = 'none';
        if (profileOverlay) profileOverlay.style.display = 'none';
    } else {
        // Lock tabs
        if (calendarTab) calendarTab.classList.add('tab-locked');
        if (profileTab) profileTab.classList.add('tab-locked');
        // Show overlays
        if (calendarOverlay) calendarOverlay.style.display = 'flex';
        if (profileOverlay) profileOverlay.style.display = 'flex';
    }
}

/**
 * Open auth modal
 */
function openAuthModal(mode = 'signin') {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
        switchAuthMode(mode);
    }
}

/**
 * Close auth modal
 */
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        clearAuthForm();
    }
}

/**
 * Switch between sign-in and sign-up modes
 */
function switchAuthMode(mode) {
    const signInSection = document.getElementById('authSignInSection');
    const signUpSection = document.getElementById('authSignUpSection');
    const modalTitle = document.getElementById('authModalTitle');
    
    if (mode === 'signup') {
        if (signInSection) signInSection.style.display = 'none';
        if (signUpSection) signUpSection.style.display = 'block';
        if (modalTitle) modalTitle.textContent = 'Create Account';
    } else {
        if (signInSection) signInSection.style.display = 'block';
        if (signUpSection) signUpSection.style.display = 'none';
        if (modalTitle) modalTitle.textContent = 'Welcome to Lutem';
    }
}

/**
 * Clear auth form fields and errors
 */
function clearAuthForm() {
    const fields = ['authEmail', 'authPassword', 'authSignUpEmail', 'authSignUpPassword', 
                    'authSignUpConfirmPassword', 'authDisplayName'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    hideAuthError();
}

/**
 * Show auth error message
 */
function showAuthError(message) {
    const errorEl = document.getElementById('authError');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
}

/**
 * Hide auth error message
 */
function hideAuthError() {
    const errorEl = document.getElementById('authError');
    if (errorEl) {
        errorEl.style.display = 'none';
    }
}

/**
 * Show/hide loading state on auth buttons
 */
function showAuthLoading(show) {
    const buttons = document.querySelectorAll('.auth-submit-btn');
    buttons.forEach(btn => {
        if (show) {
            btn.disabled = true;
            btn.dataset.originalText = btn.textContent;
            btn.textContent = 'Loading...';
        } else {
            btn.disabled = false;
            if (btn.dataset.originalText) {
                btn.textContent = btn.dataset.originalText;
            }
        }
    });
}

/**
 * Show toast notification
 */
function showAuthToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `auth-toast auth-toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Get user-friendly error message from Firebase error
 */
function getAuthErrorMessage(error) {
    const errorMessages = {
        'auth/invalid-email': 'Invalid email address',
        'auth/user-disabled': 'This account has been disabled',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'An account already exists with this email',
        'auth/weak-password': 'Password should be at least 6 characters',
        'auth/popup-closed-by-user': 'Sign-in popup was closed',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/invalid-credential': 'Invalid email or password'
    };
    return errorMessages[error.code] || error.message || 'An error occurred';
}

// ============================================
// SESSION MIGRATION (Phase 4 placeholder)
// ============================================

/**
 * Migrate pending anonymous session on login
 * This will be fully implemented in Phase 4
 */
async function migratePendingSession() {
    const pending = localStorage.getItem('lutem_pending_session');
    if (!pending) return;
    
    try {
        const sessionData = JSON.parse(pending);
        console.log('📦 Found pending session to migrate:', sessionData);
        // Phase 4: POST to /sessions/migrate
        // For now, just log it
        localStorage.removeItem('lutem_pending_session');
    } catch (e) {
        console.error('Failed to migrate pending session:', e);
    }
}

// ============================================
// FORM HANDLERS
// ============================================

/**
 * Handle sign-in form submission
 */
async function handleSignIn(event) {
    event.preventDefault();
    hideAuthError();
    
    const email = document.getElementById('authEmail')?.value?.trim();
    const password = document.getElementById('authPassword')?.value;
    
    if (!email || !password) {
        showAuthError('Please enter both email and password');
        return;
    }
    
    await signInWithEmail(email, password);
}

/**
 * Handle sign-up form submission
 */
async function handleSignUp(event) {
    event.preventDefault();
    hideAuthError();
    
    const email = document.getElementById('authSignUpEmail')?.value?.trim();
    const password = document.getElementById('authSignUpPassword')?.value;
    const confirmPassword = document.getElementById('authSignUpConfirmPassword')?.value;
    const displayName = document.getElementById('authDisplayName')?.value?.trim();
    
    if (!email || !password) {
        showAuthError('Please fill in all required fields');
        return;
    }
    
    if (password !== confirmPassword) {
        showAuthError('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        showAuthError('Password must be at least 6 characters');
        return;
    }
    
    await signUpWithEmail(email, password, displayName);
}

// ============================================
// CLICK HANDLER FOR LOCKED TABS
// ============================================

/**
 * Handle click on locked tab - show auth modal
 */
function handleLockedTabClick(tabElement) {
    const page = tabElement.dataset.page;
    if (page === 'calendar' || page === 'profile') {
        if (!window.authState.isAuthenticated) {
            openAuthModal('signin');
            return true; // Prevent default tab navigation
        }
    }
    return false;
}


// ============================================
// USER DROPDOWN
// ============================================

/**
 * Toggle user dropdown menu
 */
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

/**
 * Close dropdown when clicking outside
 */
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('userDropdown');
    const avatar = document.getElementById('userHeaderAvatar');
    
    if (dropdown && avatar) {
        if (!avatar.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    }
});


/**
 * Toggle sidebar user dropdown menu (desktop)
 */
function toggleSidebarUserDropdown() {
    const dropdown = document.getElementById('sidebarUserDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

/**
 * Close sidebar dropdown when clicking outside
 */
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('sidebarUserDropdown');
    const avatar = document.querySelector('.sidebar-avatar');
    
    if (dropdown && avatar) {
        if (!avatar.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    }
});

/**
 * Sync sidebar auth UI with header auth UI
 */
function updateSidebarAuthUI(isLoggedIn, username = 'Player') {
    const sidebarSignInBtn = document.getElementById('sidebarSignInBtn');
    const sidebarUserSection = document.getElementById('sidebarUserSection');
    const sidebarUserName = document.getElementById('sidebarUserName');
    
    if (sidebarSignInBtn && sidebarUserSection) {
        if (isLoggedIn) {
            sidebarSignInBtn.style.display = 'none';
            sidebarUserSection.classList.add('show');
            if (sidebarUserName) {
                sidebarUserName.textContent = username;
            }
        } else {
            sidebarSignInBtn.style.display = 'flex';
            sidebarUserSection.classList.remove('show');
        }
    }
}
