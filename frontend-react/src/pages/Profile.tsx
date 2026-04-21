import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SteamConnect } from '@/components/SteamConnect';
import { LoginPrompt } from '@/components/LoginPrompt';
import { useAuthStore } from '@/stores/authStore';

export function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // ─── not authenticated ─────────────────────────────
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen">
        <div className="max-w-[1080px] mx-auto px-5 md:px-10 pt-8 pb-20">
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
              § Profile
            </div>
            <h1
              className="font-serif text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] tracking-[-0.016em] mb-3"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Your profile.
            </h1>
            <p
              className="font-serif italic text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.48] max-w-[44ch]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Sign in to personalise Lutem to the shape of your play.
            </p>
          </header>

          <LoginPrompt feature="your personalized profile" />
        </div>
      </main>
    );
  }

  const providerLabel =
    user?.authProvider === 'steam' ? 'via steam'
      : user?.authProvider === 'google' ? 'via google'
      : '';

  // ─── authenticated ─────────────────────────────────
  return (
    <main className="min-h-screen">
      <div className="max-w-[1080px] mx-auto px-5 md:px-10 pt-8 pb-20">
        {/* ─── masthead ─────────────────────────────── */}
        <header
          className="pb-6 mb-10 md:mb-14"
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
            § Profile
          </div>

          <div className="flex items-start gap-5 flex-wrap">
            {/* Avatar */}
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="w-16 h-16 object-cover shrink-0"
                style={{
                  border: '1px solid var(--color-border-strong)',
                  borderRadius: 0,
                }}
              />
            ) : (
              <div
                className="w-16 h-16 flex items-center justify-center shrink-0"
                style={{
                  border: '1px solid var(--color-border-strong)',
                  color: 'var(--color-text-muted)',
                }}
                aria-hidden="true"
              >
                <User className="w-6 h-6" />
              </div>
            )}

            {/* Name + meta */}
            <div className="min-w-0 flex-1">
              <h1
                className="font-serif italic font-medium text-[clamp(1.8rem,3.6vw,2.6rem)] leading-[1.04] tracking-[-0.014em] mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {user?.displayName || 'Your Profile'}
              </h1>
              {user?.email && (
                <div
                  className="font-mono text-[0.78rem] tracking-[0.06em] mb-1.5"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {user.email}
                </div>
              )}
              {providerLabel && (
                <div
                  className="font-mono text-[0.62rem] tracking-[0.28em] uppercase"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {providerLabel}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ─── Steam section ───────────────────────────── */}
        {user?.authProvider === 'google' && !user.steamId && (
          <section
            className="pb-8 mb-8"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            <div
              className="flex items-center gap-3 font-mono text-[0.68rem] tracking-[0.28em] uppercase mb-4"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <span
                className="inline-block w-5 h-px"
                style={{ background: 'var(--color-accent)' }}
                aria-hidden="true"
              />
              § Steam
            </div>
            <p
              className="font-serif italic text-[1rem] leading-snug mb-5 max-w-[48ch]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Link your Steam library to inform what Lutem suggests.
            </p>
            <SteamConnect />
          </section>
        )}

        {user?.authProvider === 'steam' && (
          <section
            className="pb-8 mb-8"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            <div
              className="flex items-center gap-3 font-mono text-[0.68rem] tracking-[0.28em] uppercase mb-4"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <span
                className="inline-block w-5 h-px"
                style={{ background: 'var(--color-accent)' }}
                aria-hidden="true"
              />
              § Steam &mdash; connected
            </div>
            <p
              className="font-serif italic text-[1rem] leading-snug"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Your library is linked.
            </p>
            <div
              className="font-mono text-[0.72rem] tracking-[0.06em] mt-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              steamid &middot; {user.steamId}
            </div>
          </section>
        )}

        {/* ─── forthcoming footnotes ───────────────────── */}
        <section
          className="pb-8 mb-8"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div
            className="flex items-center gap-3 font-mono text-[0.68rem] tracking-[0.28em] uppercase mb-4"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span
              className="inline-block w-5 h-px"
              style={{ background: 'var(--color-accent)' }}
              aria-hidden="true"
            />
            § Forthcoming
          </div>
          <ul className="list-none p-0 m-0 space-y-2">
            {[
              { label: 'Preferences', note: 'genres, play styles, moods.' },
              { label: 'Goals',       note: 'what you want from a session.' },
              { label: 'Achievements', note: 'milestones and streaks.' },
            ].map((t) => (
              <li
                key={t.label}
                className="font-serif italic text-[0.95rem] leading-snug"
                style={{ color: 'var(--color-text-muted)' }}
              >
                — {t.label} — {t.note}
              </li>
            ))}
          </ul>
        </section>

        {/* ─── sign out ────────────────────────────────── */}
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <p
            className="font-serif italic text-[0.88rem] leading-snug"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Your gaming companion, personalised.
          </p>
          <button
            onClick={handleLogout}
            className="profile-signout font-mono text-[0.68rem] tracking-[0.22em] uppercase bg-transparent border-0 p-0 pb-0.5 cursor-pointer transition-colors duration-300"
            style={{
              color: 'var(--color-text-muted)',
              borderBottom: '1px solid var(--color-border)',
            }}
            aria-label="Sign out"
          >
            Sign out
          </button>
        </div>
      </div>

      <style>{`
        .profile-signout:hover {
          color: var(--color-error);
          border-bottom-color: var(--color-error);
        }
      `}</style>
    </main>
  );
}

export default Profile;
