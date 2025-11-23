# Tab Navigation Implementation

**Feature:** Multi-page navigation with tabs  
**Priority:** High  
**Complexity:** Low-Medium  
**Estimated Effort:** 1 session (3-4 hours)

---

## 🎯 Goal

Add a simple tab navigation system to organize Lutem into three sections:
1. **Home** - Current recommendation interface (unchanged)
2. **Games** - Browse all games with filters
3. **Profile** - User information and settings

**Design Philosophy:** Keep it primitive and simple - we can enhance later.

---

## 📐 Structure Overview

### Navigation Bar
```
┌─────────────────────────────────────────────┐
│  LUTEM                  🏠 Home │ 🎮 Games │ 👤 Profile │
└─────────────────────────────────────────────┘
```

### Three Content Sections
```html
<div id="home-page">
    <!-- Current recommendation interface -->
</div>

<div id="games-page" style="display: none;">
    <!-- Game library with filters -->
</div>

<div id="profile-page" style="display: none;">
    <!-- User profile and stats -->
</div>
```

---

## 🏠 Page 1: Home (Unchanged)

**What:** Current recommendation interface  
**Changes:** None - just wrap in a container div  

**Content:**
- Quick Start wizard
- Advanced options
- Recommendation display
- Everything that exists now

---

## 🎮 Page 2: Games Library

### Features

**1. Filter Bar (Top)**
```
┌─────────────────────────────────────────────────┐
│ Search: [___________]  🔍                       │
│                                                  │
│ Genre: [All ▼]  Time: [All ▼]  Platform: [All ▼]│
│                                                  │
│ Sort by: [Rating ▼]                [42 games]   │
└─────────────────────────────────────────────────┘
```

**Filters:**
- **Search:** Filter by game name (client-side for now)
- **Genre:** Dropdown with all unique genres
- **Time:** Quick filters (Casual <30min, Mid 30-90min, Long >90min, All)
- **Platform:** PC, Console, Mobile, All
- **Sort:** Rating, Name (A-Z), Playtime (Short-Long)

**2. Game Grid**
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│  [IMG]   │  │  [IMG]   │  │  [IMG]   │
│ Stardew  │  │  Portal  │  │ Celeste  │
│ Valley   │  │    2     │  │          │
│ ⭐⭐⭐⭐⭐ │  │ ⭐⭐⭐⭐⭐ │  │ ⭐⭐⭐⭐⭐ │
│ 20-60min │  │ 15-30min │  │ 30-90min │
└──────────┘  └──────────┘  └──────────┘
```

**Game Card Info:**
- Cover image
- Game name
- Rating (stars)
- Playtime range
- Primary mood tags (2-3 max)
- Click to see details modal

**3. Game Details Modal**
When clicking a game:
```
┌─────────────────────────────────────────┐
│            Portal 2                  ×  │
├─────────────────────────────────────────┤
│  [Cover Image]                          │
│                                         │
│  Description: [...]                     │
│                                         │
│  Time: 15-30 minutes                    │
│  Mood: Engage ●●●●●●●● (8/8)          │
│        Challenge ●●●●●●●○ (7/8)        │
│        Unwind ●●●○○○○○ (3/8)           │
│                                         │
│  Platforms: PC, Console                 │
│                                         │
│  [Play on Steam] [Play on Epic]         │
└─────────────────────────────────────────┘
```

---

## 👤 Page 3: User Profile

**Simple Info for Now - Can Expand Later**

### Section 1: User Stats
```
┌─────────────────────────────────────┐
│  Your Gaming Profile                │
├─────────────────────────────────────┤
│  📊 Total Recommendations: 0        │
│  ⭐ Average Satisfaction: N/A       │
│  🎮 Games Played: 0                 │
│  🕐 Total Gaming Time: 0 hours      │
└─────────────────────────────────────┘
```

### Section 2: Favorite Moods
```
┌─────────────────────────────────────┐
│  Your Most Requested Moods          │
├─────────────────────────────────────┤
│  🌅 Unwind          ██████░░░░ 60%  │
│  ⚡ Engage          ████░░░░░░ 40%  │
│  🏔️ Challenge       ███░░░░░░░ 30%  │
│  🗺️ Explore         ██░░░░░░░░ 20%  │
└─────────────────────────────────────┘
```

### Section 3: Recent Activity (Later)
```
┌─────────────────────────────────────┐
│  Recent Recommendations             │
├─────────────────────────────────────┤
│  🎮 Stardew Valley - ⭐⭐⭐⭐⭐      │
│  🎮 Portal 2 - Not yet rated        │
│  🎮 Celeste - ⭐⭐⭐⭐☆             │
└─────────────────────────────────────┘
```

### Section 4: Settings (Basic)
```
┌─────────────────────────────────────┐
│  Preferences                        │
├─────────────────────────────────────┤
│  Theme: [Warm Café ▼]               │
│  Default Time: [30 minutes]         │
│  Show Tutorial: [✓]                 │
│                                     │
│  [Reset Stats] [Export Data]        │
└─────────────────────────────────────┘
```

---

## 🎨 UI/UX Design

### Tab Bar Styling
- Fixed at top (or just below header)
- Clean, minimal design
- Active tab highlighted with underline or background
- Smooth transitions between pages

### Color Consistency
- Use existing color palette
- Maintain mood-based color coding
- Consistent with current design language

### Responsive Behavior
- Tabs stack on mobile (hamburger menu later)
- Game grid: 3 columns desktop, 2 tablet, 1 mobile
- Filters collapse into dropdown on mobile

---

## 🔧 Technical Implementation

### HTML Structure
```html
<body>
    <!-- Header with Logo and Tab Navigation -->
    <header>
        <div class="logo">LUTEM</div>
        <nav class="tabs">
            <button class="tab-button active" data-page="home">
                🏠 Home
            </button>
            <button class="tab-button" data-page="games">
                🎮 Games
            </button>
            <button class="tab-button" data-page="profile">
                👤 Profile
            </button>
        </nav>
    </header>

    <!-- Page Content -->
    <main>
        <div id="home-page" class="page-content active">
            <!-- Existing recommendation UI -->
        </div>

        <div id="games-page" class="page-content">
            <!-- Game library -->
        </div>

        <div id="profile-page" class="page-content">
            <!-- User profile -->
        </div>
    </main>
</body>
```

### JavaScript Tab Switching
```javascript
// Simple tab switching
const tabButtons = document.querySelectorAll('.tab-button');
const pages = document.querySelectorAll('.page-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all
        tabButtons.forEach(btn => btn.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active'));
        
        // Add active to clicked
        button.classList.add('active');
        const pageId = button.dataset.page + '-page';
        document.getElementById(pageId).classList.add('active');
    });
});
```

### CSS for Pages
```css
.page-content {
    display: none;
}

.page-content.active {
    display: block;
}

.tabs {
    display: flex;
    gap: 1rem;
    border-bottom: 2px solid var(--border-color);
}

.tab-button {
    padding: 1rem 2rem;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    transition: all 0.3s ease;
}

.tab-button.active {
    color: var(--text-primary);
    border-bottom: 3px solid var(--accent-primary);
}
```

---

## 📋 Implementation Checklist

### Phase 1: Navigation Structure
- [ ] Add tab navigation bar to header
- [ ] Wrap existing content in `#home-page`
- [ ] Create empty `#games-page` and `#profile-page`
- [ ] Implement tab switching JavaScript
- [ ] Style tabs with CSS
- [ ] Test tab switching works

### Phase 2: Games Library Page
- [ ] Create filter bar (search, genre, time, platform)
- [ ] Fetch all games from API (`GET /games`)
- [ ] Display games in grid layout
- [ ] Implement client-side filtering
- [ ] Add sorting functionality
- [ ] Create game detail modal
- [ ] Display mood tags visually
- [ ] Test all filters work

### Phase 3: Profile Page
- [ ] Create stats section (hardcoded 0s for now)
- [ ] Add favorite moods section (empty for now)
- [ ] Add settings section (theme, time, tutorial)
- [ ] Style profile page
- [ ] Make it responsive

### Phase 4: Polish & Testing
- [ ] Ensure responsive on mobile
- [ ] Smooth transitions between tabs
- [ ] Consistent styling across all pages
- [ ] Test on different screen sizes
- [ ] Fix any layout issues

---

## 🎯 Success Criteria

### Minimum Viable Navigation
- ✅ Three tabs work (Home, Games, Profile)
- ✅ Home page unchanged and functional
- ✅ Games page shows all games with basic filters
- ✅ Profile page shows placeholder content
- ✅ Navigation is intuitive and responsive

### Later Enhancements (Not Now)
- ⏸️ User authentication
- ⏸️ Real stats from database
- ⏸️ Session history on profile
- ⏸️ Advanced filters (mood-based)
- ⏸️ Save favorite games
- ⏸️ Hamburger menu on mobile

---

## 📝 Notes

### Design Decisions
- **Keep it simple:** No fancy animations for now
- **Client-side filtering:** Good enough for 41 games
- **Primitive profile:** Just placeholders, expand later
- **No routing:** Simple show/hide, no URL changes

### Why This Approach?
- Minimal changes to existing code
- Easy to expand later
- Keeps complexity low
- Fast to implement

### What NOT to Build Now
- ❌ User accounts/authentication
- ❌ Real session history tracking
- ❌ Advanced filtering (mood-based search)
- ❌ Game favorites/bookmarks
- ❌ Shareable profiles

---

## 🚀 Next Steps

1. **Start with Phase 1** - Get basic navigation working
2. **Then Phase 2** - Build games library view
3. **Finally Phase 3** - Add basic profile page
4. **Test everything** - Make sure it works on all devices

**Estimated Time:** 3-4 hours total

---

**Ready to start?** Let's begin with Phase 1 - adding the tab navigation structure.
