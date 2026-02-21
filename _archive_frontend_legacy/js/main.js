// ============================================
// MAIN INITIALIZATION
// ============================================

/**
 * Initialize all application components when DOM is ready
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎮 Lutem initializing...');
    
    // Initialize Firebase Authentication (async - don't block other init)
    if (typeof initAuth === 'function') {
        initAuth().then(() => {
            console.log('✅ Firebase Auth initialized');
            // Update tab gating after auth state is determined
            if (typeof updateTabGating === 'function') {
                updateTabGating();
            }
        }).catch(err => {
            console.error('❌ Firebase Auth failed:', err);
            // Still update tab gating to show locked state
            if (typeof updateTabGating === 'function') {
                window.authState.isLoading = false;
                updateTabGating();
            }
        });
    } else {
        console.warn('⚠️ initAuth not found - auth disabled');
        // Show locked state if auth is disabled
        if (typeof updateTabGating === 'function') {
            window.authState = window.authState || { isAuthenticated: false, isLoading: false };
            window.authState.isLoading = false;
            updateTabGating();
        }
    }
    
    // Initialize tab navigation
    if (typeof initTabNavigation === 'function') {
        initTabNavigation();
        console.log('✅ Tab navigation initialized');
    } else {
        console.error('❌ initTabNavigation not found');
    }
    
    // Initialize theme system
    if (typeof initTheme === 'function') {
        initTheme();
        console.log('✅ Theme system initialized');
    } else {
        console.error('❌ initTheme not found');
    }
    
    // Initialize form interactions (FIXED: was calling wrong function name)
    if (typeof initForm === 'function') {
        initForm();
        console.log('✅ Form interactions initialized');
    } else {
        console.error('❌ initForm not found');
    }
    
    // Initialize wizard
    if (typeof initWizard === 'function') {
        initWizard();
        console.log('✅ Wizard initialized');
    } else {
        console.error('❌ initWizard not found');
    }
    
    // Initialize profile page
    if (typeof initProfilePage === 'function') {
        initProfilePage();
        console.log('✅ Profile page initialized');
    } else {
        console.error('❌ initProfilePage not found');
    }
    
    // Initialize recommendation system (maximized view listeners)
    if (typeof initMaximizedGameView === 'function') {
        initMaximizedGameView();
        console.log('✅ Maximized game view initialized');
    }
    
    // Setup recommendation button
    const recommendBtn = document.getElementById('recommendBtn');
    if (recommendBtn && typeof getRecommendation === 'function') {
        recommendBtn.addEventListener('click', getRecommendation);
        console.log('✅ Recommend button initialized');
    } else {
        console.error('❌ Recommend button or getRecommendation not found');
    }
    
    // Setup calendar-recommendation integration
    if (typeof setupCalendarRecommendationIntegration === 'function') {
        setupCalendarRecommendationIntegration();
        console.log('✅ Calendar integration setup');
    }
    
    // Note: Games library is loaded lazily when the Games tab is clicked
    // See tabs.js - loadGamesLibrary() is called when switching to games tab
    
    // Check if user has seen the guided modal
    const hasSeenModal = localStorage.getItem('hasSeenGuidedModal');
    if (!hasSeenModal) {
        // Show guided modal
        const overlay = document.getElementById('guidedModalOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
            document.body.classList.add('modal-open');
            const mainContainer = document.getElementById('mainContainer');
            if (mainContainer) {
                mainContainer.classList.add('blurred');
            }
            localStorage.setItem('hasSeenGuidedModal', 'true');
        }
    }
    
    console.log('🎮 Lutem initialized successfully!');
});
