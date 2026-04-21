import { useAuthStore } from '@/stores/authStore';
import { LoginPrompt } from '@/components/LoginPrompt';

export function Stats() {
  const { isAuthenticated } = useAuthStore();

  return (
    <main className="min-h-screen">
      <div className="max-w-[1080px] mx-auto px-5 md:px-10 pt-8 pb-20">
        {/* ─── masthead ─────────────────────────────────── */}
        <header
          className="pb-5 mb-10 md:mb-14"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div
            className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.28em] uppercase mb-5"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span
              className="inline-block w-6 h-px"
              style={{ background: 'var(--color-accent)' }}
              aria-hidden="true"
            />
            § Statistics
          </div>
          <h1
            className="font-serif text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] tracking-[-0.016em] mb-3"
            style={{ color: 'var(--color-text-primary)' }}
          >
            A record of play.
          </h1>
          <p
            className="font-serif italic text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.48] max-w-[44ch]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {isAuthenticated
              ? 'Once sessions accrue, insights will appear here in quiet detail.'
              : 'Track your gaming satisfaction over time.'}
          </p>
        </header>

        {/* ─── placeholder columns ──────────────────────── */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-6">
            <div
              className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.28em] uppercase"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <span
                className="inline-block w-6 h-px"
                style={{ background: 'var(--color-accent)' }}
                aria-hidden="true"
              />
              This week
            </div>
            <span
              className="font-serif italic text-[0.78rem] tracking-wide"
              style={{ color: 'var(--color-text-muted)' }}
            >
              forthcoming
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {[
              { k: 'Satisfaction', v: '—' },
              { k: 'Hours logged', v: '—' },
              { k: 'Top game', v: '—' },
            ].map((s) => (
              <div
                key={s.k}
                className="py-3"
                style={{ borderTop: '1px solid var(--color-border)' }}
              >
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
            className="font-serif italic text-[0.9rem] mt-6 max-w-[52ch]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Session tracking will inform future statistics.
          </p>
        </section>

        {/* ─── login prompt when not authed ─────────────── */}
        {!isAuthenticated && (
          <div
            className="pt-8"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            <LoginPrompt feature="your personal gaming statistics" />
          </div>
        )}
      </div>
    </main>
  );
}

export default Stats;
