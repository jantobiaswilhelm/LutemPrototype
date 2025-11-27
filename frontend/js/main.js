// ============================================
// MAIN INITIALIZATION
// ============================================

/**
 * Initialize all application components when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Lutem initializing...');
    
    // Initialize tab navigation
    if (typeof initTabNavigation === 'function') {
        initTabNavigation();
        console.log('✅ Tab navigation initialized');
    }
    
    // Initialize theme system
    if (typeof initTheme === 'function') {
        initTheme();
        console.log('✅ Theme system initialized');
    }
    
    // Initialize form interactions
    if (typeof initFormInteractions === 'function') {
        initFormInteractions();
        console.log('✅ Form interactions initialized');
    }
    
    // Initialize profile page
    if (typeof initProfilePage === 'function') {
        initProfilePage();
        console.log('✅ Profile page initialized');
    }
    
    // Setup calendar-recommendation integration
    if (typeof setupCalendarRecommendationIntegration === 'function') {
        setupCalendarRecommendationIntegration();
        console.log('✅ Calendar integration setup');
    }
    
    // Check if user has seen the guided modal
    const hasSeenModal = localStorage.getItem('hasSeenGuidedModal');
    if (!hasSeenModal && typeof showGuidedModal === 'function') {
        showGuidedModal();
        document.body.classList.add('modal-open');
        const mainContainer = document.getElementById('mainContainer');
        if (mainContainer) {
            mainContainer.classList.add('blurred');
        }
        localStorage.setItem('hasSeenGuidedModal', 'true');
    }
    
    console.log('🎮 Lutem initialized successfully!');
});
