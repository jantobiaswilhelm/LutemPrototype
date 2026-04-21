import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { useWizardStore } from '@/stores/wizardStore';
import { useRecommendationStore } from '@/stores/recommendationStore';
import { useAuthStore } from '@/stores/authStore';
import { useFeedbackStore } from '@/stores/feedbackStore';
import { GameCard, AlternativeCard } from '@/components/GameCard';
import { MoodShortcuts } from '@/components/MoodShortcuts';
import { InlineWizard } from '@/components/wizard';
import { FeedbackPrompt } from '@/components/feedback';
import { CreateEventForm } from '@/components/calendar/CreateEventForm';
import { RecommendationFilters } from '@/components/RecommendationFilters';
import { sessionsApi } from '@/api/client';
import type { Game } from '@/types';

function getGreeting(name?: string): { time: string; salutation: string } {
  const hour = new Date().getHours();
  let time: string;
  if (hour < 12) time = 'morning';
  else if (hour < 17) time = 'afternoon';
  else if (hour < 21) time = 'evening';
  else time = 'late hours';

  const firstName = name?.split(' ')[0];
  const salutation = firstName
    ? `Good ${time}, ${firstName}.`
    : `Good ${time}.`;
  return { time, salutation };
}

function formatDate(): string {
  const d = new Date();
  const day = d.toLocaleDateString(undefined, { weekday: 'long' }).toLowerCase();
  const date = d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase();
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${day} · ${date} · ${time}`;
}

async function launchGame(
  game: Game,
  sessionId?: number,
  setPendingFeedback?: (feedback: { sessionId: number; gameName: string; gameImageUrl?: string; startedAt: number }) => void
): Promise<void> {
  if (sessionId) {
    sessionsApi.recordStart(sessionId).catch(() => {});
    if (setPendingFeedback) {
      setPendingFeedback({
        sessionId,
        gameName: game.name,
        gameImageUrl: game.imageUrl,
        startedAt: Date.now(),
      });
    }
  }
  if (game.steamAppId) window.open(`steam://run/${game.steamAppId}`, '_self');
  else if (game.storeUrl) window.open(game.storeUrl, '_blank');
}

async function launchAlternative(game: Game): Promise<void> {
  try { await sessionsApi.createAlternative(game.id); } catch { /* best-effort */ }
  if (game.steamAppId) window.open(`steam://run/${game.steamAppId}`, '_self');
  else if (game.storeUrl) window.open(game.storeUrl, '_blank');
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
  const { setPendingFeedback, shouldShowPrompt } = useFeedbackStore();
  const [schedulingGame, setSchedulingGame] = useState<Game | null>(null);

  const { salutation } = getGreeting(user?.displayName);
  const primaryGame = currentRecommendation?.topRecommendation;
  const alternatives = currentRecommendation?.alternatives || [];
  const hasRecommendation = !!primaryGame;
  const isWizardActive = isOpen;
  const showFeedbackPrompt = shouldShowPrompt();

  return (
    <div className="min-h-screen">
      <main id="main-content" className="max-w-[1240px] mx-auto px-5 md:px-10 pt-8 pb-20">

        {/* ─── masthead ─────────────────────────────────── */}
        <header
          className="flex flex-wrap gap-4 justify-between items-baseline pb-4 mb-10 md:mb-14"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div className="flex items-baseline gap-4">
            <h1
              className="font-serif font-semibold text-[1.4rem] tracking-tight m-0"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Lutem<span style={{ color: 'var(--color-accent)', fontStyle: 'normal' }}>.</span>
            </h1>
            <span
              className="hidden sm:inline font-mono text-[0.72rem] tracking-[0.08em]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {formatDate()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <RecommendationFilters />

            <label htmlFor="theme-select" className="sr-only">Theme</label>
            <select
              id="theme-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'prussian' | 'bindery' | 'fieldbook' | 'sumi')}
              className="font-mono text-[0.72rem] tracking-[0.1em] uppercase px-3 py-1.5 bg-transparent cursor-pointer"
              style={{
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border-strong)',
                borderRadius: 0,
              }}
            >
              <option value="prussian">Prussian</option>
              <option value="bindery">Bindery</option>
              <option value="fieldbook">Fieldbook</option>
              <option value="sumi">Sumi</option>
            </select>

            <button
              onClick={toggleMode}
              className="p-2 transition-colors"
              style={{
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border-strong)',
                borderRadius: 0,
              }}
              aria-label={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {mode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* ─── greeting ─────────────────────────────────── */}
        <div className="mb-10 md:mb-14">
          <p
            className="font-serif italic text-[clamp(1.1rem,1.8vw,1.5rem)] leading-snug"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {salutation}
          </p>
          <p
            className="font-sans text-[0.95rem] mt-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {hasRecommendation
              ? 'Tonight&rsquo;s recommendation is below, with alternatives in a different key.'
              : 'What shape would the evening take?'}
          </p>
        </div>

        {/* ─── error banner ─────────────────────────────── */}
        {error && (
          <div
            role="alert"
            className="mb-10 p-4 flex items-start gap-3"
            style={{
              borderTop: '1px solid var(--color-error)',
              borderBottom: '1px solid var(--color-error)',
              color: 'var(--color-error)',
            }}
          >
            <span className="font-serif italic text-[0.8rem] tracking-[0.18em] uppercase shrink-0 mt-0.5">
              Notice
            </span>
            <div className="flex-1">
              <p className="font-serif text-[1rem]" style={{ color: 'var(--color-text-primary)' }}>
                {error}
              </p>
              <p className="font-sans text-[0.82rem] mt-1" style={{ color: 'var(--color-text-muted)' }}>
                Please try again. If it persists, check your connection.
              </p>
            </div>
          </div>
        )}

        {/* ─── main content area ────────────────────────── */}
        <section aria-live="polite" className="mb-14">
          {isWizardActive ? (
            <InlineWizard />
          ) : hasRecommendation ? (
            <>
              {showFeedbackPrompt && (
                <div className="mb-10">
                  <FeedbackPrompt />
                </div>
              )}

              <GameCard
                game={primaryGame}
                reason={currentRecommendation?.reason}
                onStart={() => launchGame(primaryGame, currentRecommendation?.sessionId, setPendingFeedback)}
                onSchedule={user ? () => setSchedulingGame(primaryGame) : undefined}
              />

              {schedulingGame && (
                <div className="mt-6">
                  <CreateEventForm
                    compact
                    defaultGameId={schedulingGame.id}
                    defaultGameName={schedulingGame.name}
                    onSuccess={() => setSchedulingGame(null)}
                    onCancel={() => setSchedulingGame(null)}
                  />
                </div>
              )}

              {/* follow-up actions */}
              <div
                className="mt-10 pt-6 flex flex-wrap gap-6 items-baseline"
                style={{ borderTop: '1px solid var(--color-border)' }}
              >
                <button
                  onClick={openWizard}
                  className="font-sans text-[0.82rem] tracking-[0.12em] uppercase bg-transparent border-0 p-0 pb-1.5 cursor-pointer transition-colors duration-300"
                  style={{
                    color: 'var(--color-text-secondary)',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  Offer another
                </button>

                {alternatives.length > 0 && (
                  <button
                    onClick={toggleAlternatives}
                    className="font-sans text-[0.82rem] tracking-[0.12em] uppercase bg-transparent border-0 p-0 pb-1.5 cursor-pointer transition-colors duration-300"
                    style={{
                      color: 'var(--color-text-secondary)',
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    {showAlternatives ? 'Hide' : 'See'} {alternatives.length} alternative{alternatives.length === 1 ? '' : 's'}
                  </button>
                )}
              </div>

              {/* alternatives list */}
              {showAlternatives && alternatives.length > 0 && (
                <div className="mt-10">
                  <div
                    className="flex justify-between items-baseline mb-4"
                  >
                    <div
                      className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.28em] uppercase"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      <span className="inline-block w-6 h-px" style={{ background: 'var(--color-accent)' }} />
                      In a different key
                    </div>
                  </div>
                  <div>
                    {alternatives.map((game, i) => (
                      <AlternativeCard
                        key={game.id}
                        game={game}
                        index={i}
                        onSelect={() => launchAlternative(game)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* editorial empty state */}
              <div className="py-6 md:py-10">
                <div
                  className="flex items-center gap-3 mb-6 font-mono text-[0.7rem] tracking-[0.28em] uppercase"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <span className="inline-block w-7 h-px" style={{ background: 'var(--color-accent)' }} />
                  An idle moment
                </div>

                <h2
                  className="font-serif text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] tracking-[-0.016em] mb-5 max-w-[22ch]"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Tell Lutem how the evening feels.
                </h2>
                <p
                  className="font-serif italic text-[clamp(1.05rem,1.4vw,1.2rem)] leading-[1.48] mb-10 max-w-[38ch]"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  A short exchange — your mood, your time, your energy —
                  and a considered recommendation in return.
                </p>

                <button
                  onClick={openWizard}
                  className="home-start-btn relative font-serif italic font-medium text-[1.55rem] leading-none inline-flex items-baseline gap-2 bg-transparent border-0 p-0 pb-1.5 cursor-pointer transition-[letter-spacing] duration-500"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Begin the questionnaire
                  <span aria-hidden="true" className="home-start-arrow font-sans not-italic transition-transform duration-500">→</span>
                  <span
                    aria-hidden="true"
                    className="home-start-underline absolute left-0 bottom-0 h-px transition-[right] duration-[600ms]"
                    style={{ background: 'var(--color-accent)', right: '30%' }}
                  />
                </button>
              </div>
            </>
          )}
        </section>

        {/* ─── deliberate pause ─────────────────────────── */}
        {!isWizardActive && (
          <div
            className="py-10 md:py-16 grid grid-cols-[1fr_auto_1fr] gap-6 items-center"
            aria-hidden="true"
          >
            <span className="h-px w-full" style={{ background: 'var(--color-border)' }} />
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: 'var(--color-accent)' }}
            />
            <span className="h-px w-full" style={{ background: 'var(--color-border)' }} />
          </div>
        )}

        {/* ─── mood shortcuts ───────────────────────────── */}
        {!isWizardActive && <MoodShortcuts />}

        {/* ─── weekly stats placeholder ─────────────────── */}
        {!isWizardActive && (
          <section
            className="mt-16 pt-6"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            <div className="flex items-baseline justify-between mb-6">
              <div
                className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.28em] uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <span className="inline-block w-6 h-px" style={{ background: 'var(--color-accent)' }} />
                This week
              </div>
              <span
                className="font-serif italic text-[0.78rem] tracking-wide"
                style={{ color: 'var(--color-text-muted)' }}
              >
                forthcoming
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-left">
              {[
                { k: 'Sessions', v: '—' },
                { k: 'Avg. rating', v: '—' },
                { k: 'Hours', v: '—' },
              ].map((s) => (
                <div key={s.k} className="py-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                  <div
                    className="font-mono text-[0.64rem] tracking-[0.22em] uppercase mb-2"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {s.k}
                  </div>
                  <div
                    className="font-serif text-[2rem] leading-none"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {s.v}
                  </div>
                </div>
              ))}
            </div>

            <p
              className="font-serif italic text-[0.9rem] mt-6 max-w-[48ch]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Session tracking will help Lutem learn what satisfies you.
            </p>
          </section>
        )}
      </main>

      <style>{`
        .home-start-btn:hover {
          letter-spacing: 0.04em;
        }
        .home-start-btn:hover .home-start-underline {
          right: 0 !important;
        }
        .home-start-btn:hover .home-start-arrow {
          transform: translateX(0.4rem);
        }
      `}</style>
    </div>
  );
}
