import { useState } from 'react';
import { useWizardStore, type RecommendationSource } from '@/stores/wizardStore';
import { useSteamStore } from '@/stores/steamStore';
import { useAuthStore } from '@/stores/authStore';

interface SourceOption {
  id: RecommendationSource;
  title: string;
  description: string;
  disabled?: boolean;
  note?: string;
  numeral: string;
}

export default function SourceStep() {
  const {
    recommendationSource,
    setRecommendationSource,
    setSteamProfileUrl,
    nextStep,
  } = useWizardStore();
  const { isConnected: steamConnected } = useSteamStore();
  const { user } = useAuthStore();

  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');

  const hasSteamLinked = steamConnected || !!user?.steamId;

  const options: SourceOption[] = [
    {
      id: 'all',
      title: 'Discover new games',
      description: 'Anything in the full catalog — familiar or not.',
      numeral: 'i',
    },
    {
      id: 'library',
      title: 'From your Steam library',
      description: hasSteamLinked
        ? 'Only games you already own.'
        : 'Connect Steam to enable this option.',
      disabled: !hasSteamLinked,
      note: !hasSteamLinked ? 'Not linked' : undefined,
      numeral: 'ii',
    },
    {
      id: 'steamLink',
      title: 'From another Steam profile',
      description: 'Paste any public Steam profile URL.',
      numeral: 'iii',
    },
  ];

  const validateSteamUrl = (url: string) =>
    /^https?:\/\/(www\.)?steamcommunity\.com\/(id|profiles)\/[a-zA-Z0-9_-]+\/?$/.test(url.trim());

  const handleSelect = (source: RecommendationSource) => {
    if (source === 'library' && !hasSteamLinked) return;
    setRecommendationSource(source);
    setUrlError('');
    if (source !== 'steamLink') nextStep();
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      setUrlError('Please enter a Steam profile URL');
      return;
    }
    if (!validateSteamUrl(urlInput)) {
      setUrlError('Invalid URL format');
      return;
    }
    setSteamProfileUrl(urlInput.trim());
    nextStep();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleUrlSubmit();
  };

  const isLinkSelected = recommendationSource === 'steamLink';

  return (
    <div>
      <h2
        className="font-serif text-[clamp(1.6rem,3.2vw,2.4rem)] leading-[1.04] tracking-[-0.015em] mb-3"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Where should Lutem look?
      </h2>
      <p
        className="font-serif italic text-[1rem] leading-snug mb-8 max-w-[40ch]"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        The source of tonight&rsquo;s recommendation.
      </p>

      <div style={{ borderTop: '1px solid var(--color-border-strong)' }}>
        {options.map((option) => {
          const isSelected = recommendationSource === option.id;
          const isDisabled = option.disabled;
          const isLinkOption = option.id === 'steamLink';
          const expand = isLinkOption && isLinkSelected;

          return (
            <div
              key={option.id}
              style={{ borderBottom: '1px solid var(--color-border)' }}
            >
              <button
                onClick={() => handleSelect(option.id)}
                disabled={isDisabled}
                className="source-row w-full grid grid-cols-[2rem_1fr_2fr_auto] gap-5 items-baseline text-left py-5 px-0 bg-transparent transition-[padding,background] duration-500"
                style={{
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.5 : 1,
                }}
              >
                <span
                  className="font-mono text-[0.7rem] tracking-[0.15em] uppercase"
                  style={{ color: isSelected ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                >
                  {option.numeral}.
                </span>
                <span
                  className="font-serif text-[1.2rem] leading-tight tracking-[-0.005em]"
                  style={{
                    color: isSelected ? 'var(--color-accent)' : 'var(--color-text-primary)',
                    fontStyle: isSelected ? 'italic' : 'normal',
                    fontWeight: isSelected ? 500 : 400,
                  }}
                >
                  {option.title}
                </span>
                <span
                  className="font-serif italic text-[0.9rem] leading-snug"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {option.description}
                </span>
                {option.note && (
                  <span
                    className="font-mono text-[0.62rem] tracking-[0.18em] uppercase"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {option.note}
                  </span>
                )}
              </button>

              {expand && (
                <div className="px-0 pb-5 pt-1">
                  <label
                    className="font-mono text-[0.62rem] tracking-[0.22em] uppercase block mb-2"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Steam profile URL
                  </label>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      setUrlError('');
                    }}
                    onKeyDown={handleKeyDown}
                    onBlur={() => {
                      if (urlInput.trim() && validateSteamUrl(urlInput)) handleUrlSubmit();
                    }}
                    placeholder="https://steamcommunity.com/id/username"
                    autoFocus
                    className="w-full py-2 px-0 font-mono text-[0.9rem] bg-transparent"
                    style={{
                      border: 'none',
                      borderBottom: urlError ? '1px solid var(--color-error)' : '1px solid var(--color-border-strong)',
                      color: 'var(--color-text-primary)',
                      outline: 'none',
                      borderRadius: 0,
                    }}
                  />
                  {urlError && (
                    <p
                      className="mt-2 font-serif italic text-[0.82rem]"
                      style={{ color: 'var(--color-error)' }}
                    >
                      {urlError}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .source-row:hover:not(:disabled) {
          padding-left: 0.85rem;
          background: var(--color-bg-secondary);
        }
      `}</style>
    </div>
  );
}
