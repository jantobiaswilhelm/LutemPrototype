# 🖥️ Desktop Layout Implementation Plan for Lutem

**Created:** 2024-12-XX
**Status:** Ready for Implementation
**Priority:** High - Improves desktop user experience

---

## Problem Statement

The current Lutem interface is optimized for mobile (phone app style with bottom navigation). When opened in a desktop browser, there is significant empty space and the single-column layout doesn't utilize the available screen real estate effectively.

---

## Solution Overview

Transform the current mobile-first single-column wizard into a responsive layout where:
- **Mobile (< 768px)**: Keep current stacked layout with bottom navigation
- **Tablet (768px - 1023px)**: 2-column grid for inputs, bottom navigation
- **Desktop (≥ 1024px)**: 2x2 grid for inputs, **sidebar navigation**, expanded header, advanced options shown by default

---

## Design Decisions

| Question | Decision |
|----------|----------|
| Navigation on desktop? | **Sidebar** - Move to left sidebar for more vertical content space |
| Header on desktop? | **Expanded** - Larger logo, more spacing, enhanced presence |
| Advanced options on desktop? | **Show expanded by default** - No need to click to reveal on larger screens |

---

## Current Structure (4 Input Blocks)

| Block | Content | Current Class |
|-------|---------|---------------|
| 1. Energy | 3 battery cards (Low/Medium/High) | `.wizard-section` with `.energy-grid` |
| 2. Time | Slider + time display | `.wizard-section` with `.time-section` |
| 3. Mood | 6 mood chips (multi-select) | `.wizard-section` with `.mood-grid` |
| 4. Interruptibility | 3 cards (Yes/Some/No) | `.wizard-section` with `.interrupt-grid` |

---

## Phase 1: CSS Desktop Grid Layout

**File:** `frontend/css/layout.css`

### New Desktop Breakpoint Section

```css
/* ============================================
   TABLET BREAKPOINT (768px - 1023px)
   2-column layout for wizard inputs
   ============================================ */
@media (min-width: 768px) and (max-width: 1023px) {
    .home-wizard {
        max-width: 900px;
        padding: 0 32px 32px;
    }

    .wizard-inputs-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
    }

    .wizard-section {
        margin-bottom: 0;
    }

    .wizard-submit-row,
    .advanced-section,
    .advanced-content,
    .results-container {
        grid-column: 1 / -1;
    }
}

/* ============================================
   DESKTOP BREAKPOINT (1024px+)
   Full 2x2 grid, sidebar nav, expanded layout
   ============================================ */
@media (min-width: 1024px) {

    /* ==========================================
       SIDEBAR NAVIGATION
       ========================================== */
    .tab-navigation {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: auto;
        width: 90px;
        flex-direction: column;
        border-top: none;
        border-right: 2px solid var(--border-color);
        border-bottom: none;
        padding: 20px 8px;
        padding-bottom: 20px;
        box-shadow: 2px 0 10px var(--shadow);
    }

    .tab-container {
        flex-direction: column;
        height: 100%;
        justify-content: flex-start;
        padding-top: 20px;
    }

    .tabs {
        flex-direction: column;
        gap: 8px;
        width: 100%;
    }

    .tab-button {
        width: 100%;
        padding: 14px 8px;
        min-width: unset;
        flex-direction: column;
        gap: 6px;
    }

    .tab-icon {
        font-size: 1.5em;
    }

    .tab-button span:not(.tab-icon) {
        font-size: 0.7em;
    }

    /* Hide credits in sidebar or move to bottom */
    .nav-credits {
        position: absolute;
        bottom: 20px;
        left: 0;
        right: 0;
        flex-direction: column;
        gap: 8px;
        border-left: none;
        border-top: 1px solid var(--border-color);
        padding-top: 15px;
        padding-left: 0;
        margin-left: 0;
        justify-content: center;
        font-size: 0.7em;
    }

    /* ==========================================
       PAGE CONTENT - Offset for sidebar
       ========================================== */
    .page-content {
        margin-left: 90px;
        margin-bottom: 0;
        padding-bottom: 40px;
    }

    /* Auth header offset */
    .auth-header {
        margin-left: 90px;
    }

    /* ==========================================
       EXPANDED HEADER
       ========================================== */
    .page-header {
        padding: 48px 24px 40px;
    }

    .page-header-logo {
        font-size: 3.2em;
    }

    .page-header-tagline {
        font-size: 1.4em;
        margin-top: 8px;
    }

    /* ==========================================
       WIZARD GRID LAYOUT
       ========================================== */
    .home-wizard {
        max-width: 1200px;
        padding: 0 40px 40px;
    }

    .wizard-inputs-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
        gap: 24px;
        margin-bottom: 24px;
    }

    .wizard-section {
        margin-bottom: 0;
    }

    /* Full-width elements span both columns */
    .wizard-submit-row,
    .advanced-section,
    .advanced-content,
    .results-container {
        grid-column: 1 / -1;
    }

    /* Submit button - constrain width on desktop */
    .wizard-submit-row {
        display: flex;
        justify-content: center;
    }

    .wizard-submit {
        max-width: 500px;
    }

    /* ==========================================
       ADVANCED OPTIONS - EXPANDED BY DEFAULT
       ========================================== */
    .advanced-content {
        display: block !important; /* Override JS hidden state */
        max-height: none !important;
        opacity: 1 !important;
    }

    /* Hide the toggle buttons on desktop since content is always visible */
    .advanced-toggle {
        display: none;
    }

    /* Advanced sections side by side on desktop */
    .advanced-sections-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
    }

    /* ==========================================
       RESULTS & GAME CARDS
       ========================================== */
    .results-container {
        padding: 40px 32px;
    }

    .hero-game-layout {
        grid-template-columns: minmax(300px, 450px) 1fr;
    }

    .hero-game-image-container {
        min-height: 300px;
    }

    .alternatives-carousel {
        gap: 20px;
    }

    .alt-card {
        flex: 0 0 200px;
    }
}

/* ============================================
   LARGE DESKTOP (1400px+)
   Even more spacious layout
   ============================================ */
@media (min-width: 1400px) {
    .home-wizard {
        max-width: 1400px;
        padding: 0 60px 60px;
    }

    .wizard-inputs-grid {
        gap: 32px;
    }

    .wizard-section {
        padding: 32px;
    }

    .page-header {
        padding: 56px 24px 48px;
    }

    .page-header-logo {
        font-size: 3.6em;
    }
}
```

---

## Phase 2: HTML Structure Update

**File:** `frontend/index.html`

Wrap the 4 wizard sections in a grid container. This is a minimal, non-breaking change.

### Current Structure:
```html
<div class="home-wizard">
    <div class="wizard-section"><!-- Energy --></div>
    <div class="wizard-section"><!-- Time --></div>
    <div class="wizard-section"><!-- Mood --></div>
    <div class="wizard-section"><!-- Interruptibility --></div>
    <button class="wizard-submit">...</button>
    <div class="advanced-section">...</div>
    <div class="results-container">...</div>
</div>
```

### New Structure:
```html
<div class="home-wizard">
    
    <!-- NEW: Grid wrapper for desktop 2x2 layout -->
    <div class="wizard-inputs-grid">
        
        <!-- Section 1: Energy Level (Top-Left on desktop) -->
        <div class="wizard-section" data-section="energy">
            <div class="wizard-question">
                ⚡ How's your energy right now?
            </div>
            <div class="energy-grid" id="energyLevel">
                <!-- ...existing energy cards... -->
            </div>
        </div>

        <!-- Section 2: Time Available (Top-Right on desktop) -->
        <div class="wizard-section" data-section="time">
            <div class="wizard-question">
                ⏱️ How much time do you have?
            </div>
            <div class="time-section">
                <!-- ...existing time slider... -->
            </div>
        </div>

        <!-- Section 3: Mood/Emotional Goals (Bottom-Left on desktop) -->
        <div class="wizard-section" data-section="mood">
            <div class="wizard-question">
                😊 What do you want to feel?
                <div class="wizard-question-sub">(select all that apply)</div>
            </div>
            <div class="mood-grid" id="emotionalGoals">
                <!-- ...existing mood chips... -->
            </div>
        </div>

        <!-- Section 4: Interruptibility (Bottom-Right on desktop) -->
        <div class="wizard-section" data-section="interrupt">
            <div class="wizard-question">
                ⏸️ Can you pause anytime?
            </div>
            <div class="interrupt-grid" id="interruptibility">
                <!-- ...existing interrupt cards... -->
            </div>
        </div>

    </div> <!-- End wizard-inputs-grid -->

    <!-- Submit Button Row (full width, centered) -->
    <div class="wizard-submit-row">
        <button class="wizard-submit" id="recommendBtn">
            🎮 Get Recommendation
        </button>
    </div>

    <!-- Advanced Options Toggle (hidden on desktop via CSS) -->
    <div class="advanced-section">
        <!-- ...existing toggles... -->
    </div>

    <!-- Advanced Content - Wrapped for desktop grid -->
    <div class="advanced-sections-grid">
        <div class="advanced-content" id="genreContent">
            <!-- ...existing genre preferences... -->
        </div>
        <div class="advanced-content" id="advancedContent">
            <!-- ...existing advanced options... -->
        </div>
    </div>

    <!-- Results Container (full width at bottom) -->
    <div class="results-container" id="resultsPanel">
        <!-- ...existing results content... -->
    </div>

</div> <!-- End home-wizard -->
```

---

## Phase 3: Visual Layout Reference

```
MOBILE (< 768px):           TABLET (768-1023px):        DESKTOP (≥ 1024px):

┌─────────────────┐         ┌─────────┬─────────┐       ┌────┬─────────┬─────────┐
│     Energy      │         │ Energy  │  Time   │       │    │ Energy  │  Time   │
├─────────────────┤         ├─────────┼─────────┤       │ S  ├─────────┼─────────┤
│      Time       │         │  Mood   │Interrupt│       │ I  │  Mood   │Interrupt│
├─────────────────┤         ├─────────┴─────────┤       │ D  ├─────────┴─────────┤
│      Mood       │         │   [Get Recommend] │       │ E  │   [Get Recommend] │
├─────────────────┤         ├───────────────────┤       │ B  ├─────────┬─────────┤
│  Interruptibility│        │  [Adv Toggle]     │       │ A  │ Genres  │  More   │
├─────────────────┤         ├───────────────────┤       │ R  │  Prefs  │ Options │
│ [Get Recommend] │         │      Results      │       │    ├─────────┴─────────┤
├─────────────────┤         └───────────────────┘       │    │      Results      │
│  [Adv Toggle]   │              ┌─────┐                └────┴───────────────────┘
├─────────────────┤              │ Nav │
│     Results     │              └─────┘
└─────────────────┘
     ┌─────┐
     │ Nav │
     └─────┘
```

---

## Phase 4: Implementation Steps

### Step 1: HTML Changes (Non-Breaking)
1. Open `frontend/index.html`
2. Find the `<div class="home-wizard">` section
3. Add `<div class="wizard-inputs-grid">` wrapper around the 4 wizard-sections
4. Add `<div class="wizard-submit-row">` wrapper around the submit button
5. Add `<div class="advanced-sections-grid">` wrapper around both advanced-content divs
6. Test: Mobile should look identical (grid not active yet)

### Step 2: Add Tablet CSS
1. Open `frontend/css/layout.css`
2. Add the tablet media query section (768px - 1023px)
3. Test on tablet-width browser

### Step 3: Add Desktop CSS with Sidebar
1. Add the desktop media query section (1024px+)
2. Implement sidebar navigation styles
3. Add page content offset for sidebar
4. Add expanded header styles
5. Add advanced options always-visible styles
6. Test on full desktop browser

### Step 4: Add Large Desktop CSS
1. Add the large desktop section (1400px+)
2. Test on wide monitors

### Step 5: Test & Refine
1. Test all breakpoints
2. Check that mobile still works perfectly
3. Verify sidebar navigation works correctly
4. Verify advanced options are expanded on desktop
5. Adjust spacing/sizing as needed

---

## Phase 5: File Changes Summary

| File | Changes |
|------|---------|
| `frontend/index.html` | Add `.wizard-inputs-grid` wrapper, `.wizard-submit-row` wrapper, `.advanced-sections-grid` wrapper |
| `frontend/css/layout.css` | Add tablet (768px), desktop (1024px), large desktop (1400px) breakpoints with sidebar nav |
| `frontend/js/wizard.js` | (Optional) Check viewport width before toggling advanced sections |

---

## Phase 6: JavaScript Considerations

The advanced options toggle logic in JS may need adjustment:

```javascript
// In wizard.js or wherever toggles are handled
function shouldShowAdvancedByDefault() {
    return window.innerWidth >= 1024;
}

// On page load
if (shouldShowAdvancedByDefault()) {
    document.querySelectorAll('.advanced-content').forEach(el => {
        el.style.display = 'block';
    });
}
```

However, the CSS `!important` override should handle this without JS changes.

---

## Design Decisions Summary

| Decision | Rationale |
|----------|-----------|
| **Sidebar navigation** | Frees up vertical space, more app-like feel on desktop |
| **Expanded header** | Better visual hierarchy, brand presence on larger screens |
| **Advanced options always visible** | Desktop users have space, reduces clicks |
| **2x2 grid for inputs** | Efficient use of horizontal space |
| **Advanced options side-by-side** | Two columns: Genre Prefs + More Options |

---

## Testing Checklist

- [x] **Step 1 Complete**: HTML structure updated with wrapper divs
  - Added `.wizard-inputs-grid` wrapper around 4 wizard sections
  - Added `.wizard-submit-row` wrapper around submit button
  - Added `.advanced-sections-grid` wrapper around both advanced-content divs
  - Added `data-section` attributes for semantic clarity
- [x] **Step 2 Complete**: Tablet CSS breakpoint added (768px - 1023px)
  - 2-column grid for wizard inputs
  - Full-width elements span both columns
  - Centered submit button
- [x] **Step 3 Complete**: Desktop CSS with Sidebar Navigation (1024px+)
  - Sidebar navigation (fixed left, vertical layout)
  - Page content offset for sidebar (margin-left: 110px)
  - Expanded header (larger logo, more spacing)
  - 2x2 grid for wizard inputs
  - Advanced options visible by default (toggle hidden)
  - Advanced sections side-by-side
- [x] **Step 4 Complete**: Large Desktop CSS (1400px+)
  - Even more spacious layout
  - Larger max-width and padding
  - Bigger section padding and gaps
- [x] **Step 5 Complete**: UX Refinements
  - Added "Optional Preferences" header above advanced sections (desktop only)
  - Sidebar wider (110px) with accent border and card background
  - Better visual distinction between sidebar and content (8% accent color mix)
  - Removed top auth header on desktop
  - Added auth/login section to sidebar (with dropdown menu)
  - Fixed sidebar layout stacking (flexbox layout for proper ordering)
- [x] **Step 6 Complete**: Final Testing
  - [x] Mobile (< 768px): Single column, bottom nav, all features work
  - [x] Tablet (768-1023px): 2-column grid, bottom nav, proper spacing
  - [x] Desktop (1024px+): 2x2 grid, sidebar nav, expanded header
  - [x] Desktop: Advanced options visible by default (no toggle needed)
  - [x] Desktop: Sidebar navigation works, all tabs accessible
  - [x] Large Desktop (1400px+): Extra spacing, comfortable viewing
  - [x] Sidebar auth section properly positioned
  - [x] All interactive elements remain functional
  - [x] Page content doesn't overlap with sidebar
