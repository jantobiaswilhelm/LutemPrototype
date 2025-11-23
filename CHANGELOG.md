# Changelog

All notable changes to the Lutem MVP project will be documented in this file.

## [Unreleased] - 2025-01-23

### Added
- **Major Game Library Expansion** - Added 21 new games to fill gaps across all emotional goals:
  - Firewatch - Relaxing exploration
  - It Takes Two - Co-op masterpiece
  - Overcooked 2 - Chaotic cooking
  - Portal 2 - Puzzle perfection
  - Keep Talking and Nobody Explodes - Communication puzzle
  - Subnautica - Underwater exploration
  - Risk of Rain 2 - Fast roguelike shooter
  - Ori and the Will of the Wisps - Beautiful platformer
  - Trackmania - Time trial racing
  - Fall Guys - Party game chaos
  - Chess Online - Classic competitive chess
  - Gris - Emotional art piece
  - Spiritfarer - Cozy management adventure
  - Factorio - Factory building optimization
  - Animal Crossing - Ultimate relaxation
  - Journey - Wordless exploration
  - Among Us - Social deduction
  - Hearthstone - Digital card game
  - Vampire Survivors - Progression heaven
  - Celeste - Precision platforming
  - Counter-Strike 2 - Competitive FPS

### Changed
- Updated Valorant game image URL for better quality
- Updated testing workflow in CLAUDE_INSTRUCTIONS.md - Claude now automatically prepares environment for testing
- Testing approach: Claude restarts backend and opens frontend, user manually tests

### Documentation
- Added EXPANSION_SUMMARY.md - Summary of game library expansion strategy
- Added GAME_LIBRARY_ANALYSIS.md - Detailed gap analysis and recommendations
- Added IMPLEMENTATION_GUIDE.md - Step-by-step implementation guide
- Added NEW_GAMES_TO_ADD.java - Code snippet for new games
- Added QUICK_REFERENCE.md - Quick reference for game additions
- Added SUCCESS_SUMMARY.md - Summary of expansion success
- Added commit-restore.bat - Utility script for git operations

## [2025-01-22] - QuickWin #1 Completion

### Added
- Loading spinner with smooth animations
- 10 rotating gaming tips during load time
- Button disabled state during API calls
- Fade-in transition for recommendation results
- Error handling for loading states

### Technical Details
- Pure CSS animations (GPU-accelerated)
- Vanilla JavaScript implementation
- No external dependencies
- 2.5-second tip rotation interval
- 0.3-0.5s transition durations

---

## Game Library Statistics

**Total Games**: 41
- Original: 20 games
- Added: 21 games

**Coverage by Emotional Goal**:
- UNWIND: 10 games
- CHALLENGE: 18 games
- PROGRESS_ORIENTED: 12 games
- LOCKING_IN: 11 games
- ADVENTURE_TIME: 13 games
- RECHARGE: 10 games

**Coverage by Social Preference**:
- SOLO: 28 games
- COOP: 14 games
- COMPETITIVE: 12 games

**Coverage by Energy Level**:
- LOW: 10 games
- MEDIUM: 20 games
- HIGH: 11 games

**Coverage by Interruptibility**:
- HIGH: 20 games
- MEDIUM: 12 games
- LOW: 9 games
