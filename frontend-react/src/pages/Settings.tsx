import { useState, useCallback } from 'react';
import { useThemeStore } from '@/stores/themeStore';
import { useContentPreferences } from '@/hooks/useContentPreferences';
import { useGamingPreferences } from '@/hooks/useGamingPreferences';
import { getDiscoveryMode, saveDiscoveryMode, type DiscoveryMode } from '@/lib/recommendationDefaults';
import { GENRE_LIST, DISCOVERY_OPTIONS } from '@/lib/constants';
import { CONTENT_RATING, SOCIAL_PREFERENCES, AUDIO_AVAILABILITY, type Theme, type ContentRating, type SocialPreference, type AudioAvailability } from '@/types';

const THEMES: { id: Theme; name: string; emoji: string; description: string }[] = [
  { id: 'prussian',  name: 'Prussian',  emoji: '§', description: 'Deep navy, paper cream.' },
  { id: 'bindery',   name: 'Bindery',   emoji: '❋', description: 'Warm ochre, old linen.' },
  { id: 'fieldbook', name: 'Fieldbook', emoji: '¶', description: 'Fieldbook ochre on cream.' },
  { id: 'sumi',      name: 'Sumi',      emoji: '◉', description: 'Ink red, rice paper.' },
];

const RATING_ORDER: ContentRating[] = ['EVERYONE', 'TEEN', 'MATURE', 'ADULT'];
const RATING_NUMERALS = ['i', 'ii', 'iii', 'iv'];

const SOCIAL_ORDER: SocialPreference[] = ['SOLO', 'COOP', 'COMPETITIVE', 'BOTH'];
const AUDIO_ORDER: AudioAvailability[] = ['full', 'low', 'muted'];

const TIME_OPTIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1½ hours' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3+ hours' },
];


// ─── small editorial helpers ────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.28em] uppercase"
      style={{ color: 'var(--color-text-muted)' }}
    >
      <span className="inline-block w-6 h-px" style={{ background: 'var(--color-accent)' }} />
      {children}
    </div>
  );
}

function SectionHeader({ eyebrow, title, descriptor }: { eyebrow: string; title: string; descriptor: string }) {
  return (
    <header className="mb-8">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className="font-serif italic text-[clamp(1.45rem,2.6vw,2rem)] leading-[1.1] tracking-[-0.012em] mt-3 mb-2"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {title}
      </h2>
      <p
        className="font-serif italic text-[1rem] leading-snug max-w-[48ch]"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {descriptor}
      </p>
    </header>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-mono text-[0.64rem] tracking-[0.22em] uppercase mb-4"
      style={{ color: 'var(--color-text-muted)' }}
    >
      {children}
    </div>
  );
}

export function Settings() {
  const { theme, mode, setTheme, setMode } = useThemeStore();
  const { maxContentRating, allowNsfw, setMaxContentRating, toggleNsfw } = useContentPreferences();
  const {
    defaultTimeAvailable,
    defaultSocialPreference,
    defaultAudioAvailability,
    preferredGenres,
    setDefaultTimeAvailable,
    setDefaultSocialPreference,
    setDefaultAudioAvailability,
    toggleGenre,
  } = useGamingPreferences();

  const [discoveryMode, setDiscoveryModeState] = useState<DiscoveryMode>(getDiscoveryMode);

  const setDiscoveryMode = useCallback((m: DiscoveryMode) => {
    setDiscoveryModeState(m);
    saveDiscoveryMode(m);
  }, []);

  return (
    <main
      id="main-content"
      className="min-h-screen px-5 md:px-10 pt-8 pb-24"
      style={{ background: 'var(--color-bg-primary)' }}
    >
      <div className="max-w-[1040px] mx-auto">
        {/* ─── masthead ─── */}
        <header
          className="pb-6 mb-12 md:mb-16"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <Eyebrow>§ The apparatus</Eyebrow>
          <h1
            className="font-serif text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] tracking-[-0.016em] mt-4 mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Settings.
          </h1>
          <p
            className="font-serif italic text-[clamp(1.05rem,1.4vw,1.2rem)] leading-[1.48] max-w-[46ch]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Lutem reads a few of your preferences before offering anything. Adjust them here &mdash; they are remembered.
          </p>
        </header>

        {/* ─── appearance ─── */}
        <section
          className="mb-16 pb-10"
          style={{ borderBottom: '1px solid var(--color-border)' }}
          aria-labelledby="appearance-heading"
        >
          <SectionHeader
            eyebrow="i. Appearance"
            title="The cast of the page."
            descriptor="Light or dark, and the imprint that colours the whole."
          />

          {/* Display mode — editorial text toggle */}
          <div className="mb-10">
            <FieldLabel>Display mode</FieldLabel>
            <div className="flex items-baseline gap-6 font-serif text-[1.15rem]">
              {(['light', 'dark'] as const).map((m) => {
                const active = mode === m;
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    aria-pressed={active}
                    className="theme-option relative bg-transparent border-0 p-0 pb-1 cursor-pointer transition-[letter-spacing,color] duration-400"
                    style={{
                      color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                      fontStyle: active ? 'italic' : 'normal',
                      fontWeight: active ? 500 : 400,
                      borderBottom: active ? '1px solid var(--color-accent)' : '1px solid transparent',
                    }}
                  >
                    {m === 'light' ? 'Light' : 'Dark'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme selection */}
          <div>
            <FieldLabel>Colour theme</FieldLabel>
            <ul
              className="list-none p-0 m-0"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              {THEMES.map((t, i) => {
                const active = theme === t.id;
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => setTheme(t.id)}
                      aria-pressed={active}
                      className="theme-row w-full grid grid-cols-[2.25rem_1fr_auto] gap-5 items-baseline text-left py-4 px-1 bg-transparent border-0 cursor-pointer transition-[padding,background] duration-400"
                      style={{ borderBottom: '1px solid var(--color-border)' }}
                    >
                      <span
                        className="font-serif text-[1.15rem]"
                        style={{ color: active ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                        aria-hidden="true"
                      >
                        {t.emoji}
                      </span>
                      <span className="flex flex-col">
                        <span
                          className="font-serif text-[1.2rem] leading-tight"
                          style={{
                            color: active ? 'var(--color-accent)' : 'var(--color-text-primary)',
                            fontStyle: active ? 'italic' : 'normal',
                            fontWeight: active ? 500 : 400,
                          }}
                        >
                          {t.name}
                        </span>
                        <span
                          className="font-serif italic text-[0.88rem] mt-1"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {t.description}
                        </span>
                      </span>
                      <span
                        className="font-mono text-[0.64rem] tracking-[0.22em] uppercase"
                        style={{ color: active ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                      >
                        {active ? 'current' : `no. ${String(i + 1).padStart(2, '0')}`}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ─── content preferences ─── */}
        <section
          className="mb-16 pb-10"
          style={{ borderBottom: '1px solid var(--color-border)' }}
          aria-labelledby="content-heading"
        >
          <SectionHeader
            eyebrow="ii. Content"
            title="What you are willing to see."
            descriptor="The ceiling of maturity Lutem may suggest, and whether adult imagery is welcome."
          />

          {/* Maximum content rating */}
          <div className="mb-10">
            <FieldLabel>Maximum content rating</FieldLabel>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              {RATING_ORDER.map((rating, i) => {
                const data = CONTENT_RATING[rating];
                const active = maxContentRating === rating;
                return (
                  <button
                    key={rating}
                    onClick={() => setMaxContentRating(rating)}
                    aria-pressed={active}
                    className="rating-cell text-left py-4 px-4 bg-transparent cursor-pointer transition-colors duration-400"
                    style={{
                      borderRight: i < RATING_ORDER.length - 1 ? '1px solid var(--color-border)' : 'none',
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    <span
                      className="font-mono text-[0.6rem] tracking-[0.15em] uppercase block mb-2"
                      style={{ color: active ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                    >
                      {RATING_NUMERALS[i]}.
                    </span>
                    <span
                      className="font-serif text-[1.1rem] leading-tight block"
                      style={{
                        color: active ? 'var(--color-accent)' : 'var(--color-text-primary)',
                        fontStyle: active ? 'italic' : 'normal',
                        fontWeight: active ? 500 : 400,
                      }}
                    >
                      {data.displayName}
                    </span>
                    <span
                      className="font-serif italic text-[0.82rem] leading-snug block mt-1"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {data.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* NSFW toggle — editorial text */}
          <div>
            <FieldLabel>Adult imagery</FieldLabel>
            <div className="flex items-baseline gap-5 flex-wrap">
              <span
                className="font-serif text-[1rem] max-w-[36ch]"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Include titles with sexual or suggestive content.
              </span>
              <button
                onClick={toggleNsfw}
                role="switch"
                aria-checked={allowNsfw}
                aria-label="Allow NSFW content"
                className="font-serif text-[1.05rem] bg-transparent border-0 p-0 cursor-pointer"
              >
                <span
                  style={{
                    color: allowNsfw ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    fontStyle: allowNsfw ? 'italic' : 'normal',
                    fontWeight: allowNsfw ? 500 : 400,
                    borderBottom: allowNsfw ? '1px solid var(--color-accent)' : '1px solid transparent',
                    paddingBottom: '2px',
                  }}
                >
                  on
                </span>
                <span className="mx-2 font-sans" style={{ color: 'var(--color-text-muted)' }}>&middot;</span>
                <span
                  style={{
                    color: !allowNsfw ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    fontStyle: !allowNsfw ? 'italic' : 'normal',
                    fontWeight: !allowNsfw ? 500 : 400,
                    borderBottom: !allowNsfw ? '1px solid var(--color-accent)' : '1px solid transparent',
                    paddingBottom: '2px',
                  }}
                >
                  off
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ─── gaming defaults ─── */}
        <section
          className="mb-16 pb-10"
          style={{ borderBottom: '1px solid var(--color-border)' }}
          aria-labelledby="gaming-heading"
        >
          <SectionHeader
            eyebrow="iii. Defaults"
            title="The shape of a usual evening."
            descriptor="Lutem will assume these when you do not say otherwise."
          />

          {/* Default time */}
          <div className="mb-10">
            <FieldLabel>Time available</FieldLabel>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-0"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              {TIME_OPTIONS.map((option, i) => {
                const active = defaultTimeAvailable === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setDefaultTimeAvailable(option.value)}
                    aria-pressed={active}
                    className="time-cell text-left py-4 px-3 bg-transparent cursor-pointer transition-colors duration-400"
                    style={{
                      borderRight: i < TIME_OPTIONS.length - 1 ? '1px solid var(--color-border)' : 'none',
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    <span
                      className="font-mono text-[0.58rem] tracking-[0.18em] uppercase block mb-1.5"
                      style={{ color: active ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="font-serif text-[1.05rem] leading-tight block"
                      style={{
                        color: active ? 'var(--color-accent)' : 'var(--color-text-primary)',
                        fontStyle: active ? 'italic' : 'normal',
                        fontWeight: active ? 500 : 400,
                      }}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Social preference */}
          <div className="mb-10">
            <FieldLabel>Play style</FieldLabel>
            <ul
              className="list-none p-0 m-0"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              {SOCIAL_ORDER.map((social, i) => {
                const data = SOCIAL_PREFERENCES[social];
                const active = defaultSocialPreference === social;
                return (
                  <li key={social}>
                    <button
                      onClick={() => setDefaultSocialPreference(social)}
                      aria-pressed={active}
                      className="social-row w-full grid grid-cols-[2rem_1fr_2fr] gap-5 items-baseline text-left py-4 px-1 bg-transparent border-0 cursor-pointer transition-[padding,background] duration-400"
                      style={{ borderBottom: '1px solid var(--color-border)' }}
                    >
                      <span
                        className="font-mono text-[0.65rem] tracking-[0.15em] uppercase"
                        style={{ color: active ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className="font-serif text-[1.15rem] leading-tight"
                        style={{
                          color: active ? 'var(--color-accent)' : 'var(--color-text-primary)',
                          fontStyle: active ? 'italic' : 'normal',
                          fontWeight: active ? 500 : 400,
                        }}
                      >
                        {data.displayName}
                      </span>
                      <span
                        className="font-serif italic text-[0.9rem] leading-snug"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {data.description}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Audio availability */}
          <div className="mb-10">
            <FieldLabel>Audio</FieldLabel>
            <div
              className="grid grid-cols-3 gap-0"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              {AUDIO_ORDER.map((audio, i) => {
                const data = AUDIO_AVAILABILITY[audio];
                const active = defaultAudioAvailability === audio;
                return (
                  <button
                    key={audio}
                    onClick={() => setDefaultAudioAvailability(audio)}
                    aria-pressed={active}
                    className="audio-cell text-left py-4 px-3 bg-transparent cursor-pointer transition-colors duration-400"
                    style={{
                      borderRight: i < AUDIO_ORDER.length - 1 ? '1px solid var(--color-border)' : 'none',
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    <span
                      className="font-mono text-[0.58rem] tracking-[0.18em] uppercase block mb-1.5"
                      style={{ color: active ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                    >
                      {['i', 'ii', 'iii'][i]}.
                    </span>
                    <span
                      className="font-serif text-[1.05rem] leading-tight block"
                      style={{
                        color: active ? 'var(--color-accent)' : 'var(--color-text-primary)',
                        fontStyle: active ? 'italic' : 'normal',
                        fontWeight: active ? 500 : 400,
                      }}
                    >
                      {data.displayName}
                    </span>
                    <span
                      className="font-serif italic text-[0.8rem] leading-snug block mt-1"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {data.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred genres — typographic list */}
          <div className="mb-10">
            <FieldLabel>Preferred genres</FieldLabel>
            <p
              className="font-serif italic text-[0.92rem] mb-4 max-w-[48ch]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Genres marked here are given more weight when Lutem chooses.
            </p>
            <div
              className="genre-list font-serif text-[1rem] leading-[1.9]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {GENRE_LIST.map((genre, i) => {
                const isSelected = preferredGenres.includes(genre.toLowerCase());
                return (
                  <span key={genre}>
                    <button
                      onClick={() => toggleGenre(genre)}
                      aria-pressed={isSelected}
                      className="genre-term bg-transparent border-0 p-0 cursor-pointer transition-colors duration-300"
                      style={{
                        color: isSelected ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                        fontStyle: isSelected ? 'italic' : 'normal',
                        fontWeight: isSelected ? 500 : 400,
                        borderBottom: isSelected ? '1px solid var(--color-accent)' : '1px solid transparent',
                        paddingBottom: '2px',
                      }}
                    >
                      {genre.toLowerCase()}
                    </button>
                    {i < GENRE_LIST.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="mx-3 font-sans"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        &middot;
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Discovery mode */}
          <div>
            <FieldLabel>Discovery</FieldLabel>
            <p
              className="font-serif italic text-[0.92rem] mb-4 max-w-[48ch]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Whether Lutem favours familiar titles or quietly unearths the lesser known.
            </p>
            <div className="flex items-baseline gap-6 flex-wrap font-serif text-[1.15rem]">
              {DISCOVERY_OPTIONS.map((option) => {
                const active = discoveryMode === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setDiscoveryMode(option.value)}
                    aria-pressed={active}
                    className="discovery-option bg-transparent border-0 p-0 pb-1 cursor-pointer transition-colors duration-400"
                    style={{
                      color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                      fontStyle: active ? 'italic' : 'normal',
                      fontWeight: active ? 500 : 400,
                      borderBottom: active ? '1px solid var(--color-accent)' : '1px solid transparent',
                    }}
                  >
                    {option.label.toLowerCase()}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── forthcoming — editorial footnote ─── */}
        <section aria-labelledby="forthcoming-heading" className="pt-2">
          <Eyebrow>iv. Forthcoming</Eyebrow>
          <p
            id="forthcoming-heading"
            className="font-serif italic text-[clamp(1.05rem,1.4vw,1.2rem)] leading-[1.5] mt-3 max-w-[52ch]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Notifications, display nuances, and privacy controls are in preparation. They will appear here, quietly, when ready.
          </p>
        </section>
      </div>

      <style>{`
        .theme-row:hover, .social-row:hover {
          background: var(--color-bg-secondary);
          padding-left: 0.85rem;
        }
        .rating-cell:hover, .time-cell:hover, .audio-cell:hover {
          background: var(--color-bg-secondary);
        }
        .theme-option:hover, .discovery-option:hover {
          letter-spacing: 0.02em;
          color: var(--color-text-primary);
        }
        .genre-term:hover {
          color: var(--color-text-primary);
          border-bottom-color: var(--color-border-strong) !important;
        }
      `}</style>
    </main>
  );
}

export default Settings;
