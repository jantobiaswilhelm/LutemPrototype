// ============================================
// PROFILE PAGE FUNCTIONALITY
// ============================================

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
 * Save profile to localStorage
 */
function saveProfile() {
    // Collect all profile data
    const displayName = document.getElementById('displayName').value;
    const gamingSince = document.getElementById('gamingSince').value;
    const sessionLength = document.getElementById('sessionLength').value;
    const engagementLevel = document.getElementById('engagementLevel').value;
    
    // Get selected genres
    const selectedGenres = Array.from(document.querySelectorAll('.genre-tag.active'))
        .map(tag => tag.textContent);
    
    // Get gaming times
    const gamingTimes = Array.from(document.querySelectorAll('input[name="gaming-time"]:checked'))
        .map(input => input.value);
    
    // Get priority
    const priority = document.querySelector('input[name="priority"]:checked')?.value;
    
    // Get emotional goals
    const emotionalGoals = Array.from(document.querySelectorAll('input[name="emotional-goal"]:checked'))
        .map(input => input.value);
    
    // Create profile object
    const profile = {
        displayName,
        gamingSince,
        sessionLength,
        engagementLevel,
        genres: selectedGenres,
        gamingTimes,
        priority,
        emotionalGoals,
        savedAt: new Date().toISOString()
    };
    
    // Save to localStorage for MVP
    localStorage.setItem('lutemProfile', JSON.stringify(profile));
    
    // Show success message
    const saveBtn = event.target;
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '✅ Profile Saved!';
    saveBtn.style.background = '#10b981';
    
    setTimeout(() => {
        saveBtn.innerHTML = originalText;
        saveBtn.style.background = '';
    }, 2000);
    
    console.log('Profile saved:', profile);
}

/**
 * Load profile from localStorage
 */
function loadProfile() {
    const savedProfile = localStorage.getItem('lutemProfile');
    if (savedProfile) {
        try {
            const profile = JSON.parse(savedProfile);
            
            // Restore basic info
            if (profile.displayName) {
                document.getElementById('displayName').value = profile.displayName;
            }
            if (profile.gamingSince) {
                document.getElementById('gamingSince').value = profile.gamingSince;
            }
            if (profile.sessionLength) {
                document.getElementById('sessionLength').value = profile.sessionLength;
            }
            if (profile.engagementLevel) {
                document.getElementById('engagementLevel').value = profile.engagementLevel;
            }
            
            // Restore selected genres
            if (profile.genres) {
                document.querySelectorAll('.genre-tag').forEach(tag => {
                    if (profile.genres.includes(tag.textContent)) {
                        tag.classList.add('active');
                    }
                });
            }
            
            // Restore gaming times
            if (profile.gamingTimes) {
                profile.gamingTimes.forEach(time => {
                    const checkbox = document.querySelector(`input[name="gaming-time"][value="${time}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
            
            // Restore priority
            if (profile.priority) {
                const radio = document.querySelector(`input[name="priority"][value="${profile.priority}"]`);
                if (radio) radio.checked = true;
            }
            
            // Restore emotional goals
            if (profile.emotionalGoals) {
                profile.emotionalGoals.forEach(goal => {
                    const checkbox = document.querySelector(`input[name="emotional-goal"][value="${goal}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
            
            console.log('Profile loaded:', profile);
        } catch (e) {
            console.error('Error loading profile:', e);
        }
    }
}
