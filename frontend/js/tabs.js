// ============================================
// TAB NAVIGATION
// ============================================

/**
 * Initialize tab navigation functionality
 * Handles switching between Home, Calendar, Games, and Profile pages
 */
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const pages = document.querySelectorAll('.page-content');
    const wizardBtn = document.getElementById('navWizardBtn');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Check if this is a locked tab (requires auth)
            const page = button.dataset.page;
            if ((page === 'calendar' || page === 'profile') && 
                window.authState && !window.authState.isAuthenticated) {
                // Show auth modal instead of switching tab
                if (typeof openAuthModal === 'function') {
                    openAuthModal('signin');
                }
                return;
            }
            
            // Remove active class from all tabs and pages
            tabButtons.forEach(btn => btn.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding page
            button.classList.add('active');
            const pageId = button.dataset.page + '-page';
            document.getElementById(pageId).classList.add('active');
            
            // Enable/disable wizard button based on active page (only active on home)
            if (wizardBtn) {
                if (button.dataset.page === 'home') {
                    wizardBtn.classList.remove('disabled');
                    wizardBtn.disabled = false;
                    wizardBtn.title = 'Quick Start Wizard';
                } else {
                    wizardBtn.classList.add('disabled');
                    wizardBtn.disabled = true;
                    wizardBtn.title = 'Wizard only available on Home';
                }
            }
            
            // Load weekly summary when home tab is clicked (Phase E)
            if (button.dataset.page === 'home' && typeof loadWeeklySummary === 'function') {
                loadWeeklySummary();
            }
            
            // Load games when games tab is clicked
            if (button.dataset.page === 'games' && typeof loadGamesLibrary === 'function') {
                loadGamesLibrary();
            }
            
            // Initialize calendar when calendar tab is clicked
            if (button.dataset.page === 'calendar' && typeof initCalendar === 'function' && !window.calendarInstance) {
                setTimeout(() => {
                    initCalendar();
                }, 100);
            }
            
            // Load profile from Firestore when profile tab is clicked
            if (button.dataset.page === 'profile' && typeof window.onProfileTabOpen === 'function') {
                window.onProfileTabOpen();
            }
        });
    });
}

/**
 * Switch to a specific tab programmatically
 * @param {string} pageName - The page to switch to (home, calendar, games, profile)
 */
function switchToTab(pageName) {
    const tabButton = document.querySelector(`.tab-button[data-page="${pageName}"]`);
    if (tabButton) {
        tabButton.click();
    }
}
