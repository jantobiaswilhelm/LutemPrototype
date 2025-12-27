import { Coffee, Moon, Sun, RefreshCw, ChevronDown, ChevronUp, AlertCircle, Sparkles } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { useWizardStore } from '@/stores/wizardStore';
import { useRecommendationStore } from '@/stores/recommendationStore';
import { useAuthStore } from '@/stores/authStore';
import { GameCard, AlternativeCard } from '@/components/GameCard';
import { MoodShortcuts } from '@/components/MoodShortcuts';
import { InlineWizard } from '@/components/wizard';
import type { Game } from '@/types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Get greeting based on time of day
function getGreeting(name?: string): string {
  const hour = new Date().getHours();
  let timeGreeting: string;
  
  if (hour < 12) timeGreeting = 'Good morning';
  else if (hour < 17) timeGreeting = 'Good afternoon';
  else if (hour < 21) timeGreeting = 'Good evening';
  else timeGreeting = 'Late night gaming?';
  
  // Add name if available (use first name only for friendliness)
  if (name) {
    const firstName = name.split(' ')[0];
    return `${timeGreeting}, ${firstName}`;
  }
  
  return timeGreeting;
}

// Record session start in backend
async function recordSessionStart(sessionId: number): Promise<void> {
  try {
    await fetch(`${API_BASE}/sessions/${sessionId}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(`📊 Session start recorded (ID: ${sessionId})`);
  } catch (err) {
    console.error('Failed to record session start:', err);
  }
}

// Create session for alternative game selection
async function createAlternativeSession(gameId: number): Promise<number | null> {
  try {
    const res = await fetch(`${API_BASE}/sessions/alternative/${gameId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (data.status === 'success') {
      console.log(`🔀 Alternative session created (ID: ${data.sessionId})`);
      return data.sessionId;
    }
    return null;
  } catch (err) {
    console.error('Failed to create alternative session:', err);
    return null;
  }
}

// Launch a game via Steam protocol or store URL
async function launchGame(game: Game, sessionId?: number): Promise<void> {
  // Record the session start (fire and forget)
  if (sessionId) {
    recordSessionStart(sessionId);
  }
  
  if (game.steamAppId) {
    // Steam protocol - opens Steam and launches the game
    window.open(`steam://run/${game.steamAppId}`, '_self');
    console.log(`🎮 Launching ${game.name} via Steam (appId: ${game.steamAppId})`);
  } else if (game.storeUrl) {
    // Fallback to store page
    window.open(game.storeUrl, '_blank');
    console.log(`🔗 Opening store page for ${game.name}`);
  } else {
    // No launch option available
    console.log(`⚠️ No launch method available for ${game.name}`);
  }
}

// Launch alternative game (creates new session first)
async function launchAlternative(game: Game): Promise<void> {
  // Create a new session for this alternative
  await createAlternativeSession(game.id);
  
  // Then launch the game
  if (game.steamAppId) {
    window.open(`steam://run/${game.steamAppId}`, '_self');
    console.log(`🎮 Launching alternative ${game.name} via Steam`);
  } else if (game.storeUrl) {
    window.open(game.storeUrl, '_blank');
    console.log(`🔗 Opening store page for ${game.name}`);
  }
}

export default function Home() {
  const { mode, toggleMode, theme, setTheme } = useThemeStore();
  const { isOpen, openWizard } = useWizardStore();
  const { user } = useAuthStore();
  const { 
    currentRecommendation, 
    showAlternatives, 
    toggleAlternatives,
    error,
  } = useRecommendationStore();

  const greeting = getGreeting(user?.displayName);
  const primaryGame = currentRecommendation?.topRecommendation;
  const alternatives = currentRecommendation?.alternatives || [];
  const hasRecommendation = !!primaryGame;
  const isWizardActive = isOpen;

  const cardStyles = "bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border)] shadow-md";

  return (
    <div className="min-h-screen transition-colors">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <Coffee className="w-6 h-6 text-[var(--color-accent)]" />
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Lutem</h1>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'cafe' | 'lavender' | 'earth' | 'ocean')}
            className="bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="cafe">☕ Café</option>
            <option value="lavender">💜 Lavender</option>
            <option value="earth">🌿 Earth</option>
            <option value="ocean">🌊 Ocean</option>
          </select>

          <button
            onClick={toggleMode}
            className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-all"
          >
            {mode === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto p-6">
        {/* Greeting */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
            {greeting} 👋
          </h2>
          <p className="text-[var(--color-text-muted)] mt-1">
            What are you in the mood for?
          </p>
        </div>

        {/* Quick mood shortcuts - always visible */}
        <MoodShortcuts />

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                Make sure the backend is running at localhost:8080
              </p>
            </div>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <div className="mb-6">
          {isWizardActive ? (
            /* Wizard steps - inline */
            <InlineWizard />
          ) : hasRecommendation ? (
            /* Game recommendation display */
            <>
              <GameCard 
                game={primaryGame} 
                reason={currentRecommendation?.reason}
                onStart={() => launchGame(primaryGame, currentRecommendation?.sessionId)}
              />

              {/* Action buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={openWizard}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm font-medium">New Recommendation</span>
                </button>
                
                {alternatives.length > 0 && (
                  <button
                    onClick={toggleAlternatives}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] transition-all"
                  >
                    {showAlternatives ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {showAlternatives ? 'Hide' : 'Show'} Alternatives ({alternatives.length})
                    </span>
                  </button>
                )}
              </div>

              {/* Alternatives list */}
              {showAlternatives && alternatives.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide px-1">
                    Other options
                  </h4>
                  {alternatives.map((game) => (
                    <AlternativeCard 
                      key={game.id} 
                      game={game}
                      onSelect={() => launchAlternative(game)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Empty state */
            <div className={`${cardStyles} p-8 text-center`}>
              <div className="mb-6">
                <Sparkles className="w-12 h-12 mx-auto text-[var(--color-accent)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                Find your perfect game
              </h3>
              <p className="text-[var(--color-text-muted)] mb-6">
                Tell us your mood and available time, and we'll recommend the ideal game for right now.
              </p>
              <button
                onClick={openWizard}
                className="bg-[var(--color-accent)] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[var(--color-accent-hover)] transition-all active:scale-[0.98]"
              >
                Get a Recommendation
              </button>
            </div>
          )}
        </div>

        {/* Weekly stats - Placeholder */}
        <div className={`${cardStyles} p-4 opacity-60`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-[var(--color-text-muted)]">
              This Week
            </h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
              Coming Soon
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[var(--color-text-primary)]">—</div>
              <div className="text-xs text-[var(--color-text-muted)]">Sessions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--color-text-primary)]">—</div>
              <div className="text-xs text-[var(--color-text-muted)]">Avg Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--color-text-primary)]">—</div>
              <div className="text-xs text-[var(--color-text-muted)]">Hours</div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-muted)] text-center">
              Session tracking will help Lutem learn what satisfies you
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
