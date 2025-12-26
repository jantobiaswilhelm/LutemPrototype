import { useState } from 'react';
import { Library, Globe, ExternalLink } from 'lucide-react';
import { useWizardStore, type RecommendationSource } from '@/stores/wizardStore';
import { useSteamStore } from '@/stores/steamStore';
import { useAuthStore } from '@/stores/authStore';

interface SourceOption {
  id: RecommendationSource;
  title: string;
  description: string;
  icon: React.ReactNode;
  disabled?: boolean;
  badge?: string;
}

export default function SourceStep() {
  const { 
    recommendationSource, 
    setRecommendationSource, 
    setSteamProfileUrl,
    nextStep 
  } = useWizardStore();
  const { isConnected: steamConnected } = useSteamStore();
  const { user } = useAuthStore();
  
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');
  
  // Check if user has Steam linked
  const hasSteamLinked = steamConnected || !!user?.steamId;

  const options: SourceOption[] = [
    {
      id: 'all',
      title: 'Discover New Games',
      description: 'Explore recommendations from our full database',
      icon: <Globe className="w-6 h-6" />,
    },
    {
      id: 'library',
      title: 'My Steam Library',
      description: hasSteamLinked 
        ? 'Get recommendations from games you own'
        : 'Connect Steam to enable this option',
      icon: <Library className="w-6 h-6" />,
      disabled: !hasSteamLinked,
      badge: !hasSteamLinked ? 'Not linked' : undefined,
    },
    {
      id: 'steamLink',
      title: 'Steam Profile Link',
      description: 'Paste any Steam profile URL',
      icon: <ExternalLink className="w-6 h-6" />,
    },
  ];

  const validateSteamUrl = (url: string): boolean => {
    if (!url.trim()) return false;
    const steamUrlPattern = /^https?:\/\/(www\.)?steamcommunity\.com\/(id|profiles)\/[a-zA-Z0-9_-]+\/?$/;
    return steamUrlPattern.test(url.trim());
  };

  const handleSelect = (source: RecommendationSource) => {
    if (source === 'library' && !hasSteamLinked) return;
    
    setRecommendationSource(source);
    setUrlError('');
    
    // Auto-advance for non-URL options
    if (source !== 'steamLink') {
      nextStep();
    }
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
    if (e.key === 'Enter') {
      handleUrlSubmit();
    }
  };

  const isLinkSelected = recommendationSource === 'steamLink';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
          Where should we look?
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Choose the source for your game recommendations
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const isSelected = recommendationSource === option.id;
          const isDisabled = option.disabled;
          const isLinkOption = option.id === 'steamLink';
          
          return (
            <div
              key={option.id}
              className={`
                relative rounded-xl border-2 transition-all
                ${isSelected 
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10' 
                  : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                }
                ${isDisabled ? 'opacity-50' : ''}
              `}
            >
              <button
                onClick={() => handleSelect(option.id)}
                disabled={isDisabled}
                className={`
                  w-full p-4 text-left
                  ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                  ${isLinkOption && isLinkSelected ? 'pb-2' : ''}
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Icon - hide when link option is expanded */}
                  {!(isLinkOption && isLinkSelected) && (
                    <div className={`
                      p-2.5 rounded-lg shrink-0
                      ${isSelected 
                        ? 'bg-[var(--color-accent)] text-white' 
                        : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]'
                      }
                    `}>
                      {option.icon}
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-[var(--color-text-primary)]">
                        {option.title}
                      </h3>
                      {option.badge && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]">
                          {option.badge}
                        </span>
                      )}
                    </div>
                    {/* Hide description when link option is expanded */}
                    {!(isLinkOption && isLinkSelected) && (
                      <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                        {option.description}
                      </p>
                    )}
                  </div>

                  {/* Selection indicator */}
                  {isSelected && !isDisabled && !isLinkOption && (
                    <div className="shrink-0">
                      <div className="w-5 h-5 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </button>

              {/* URL input - inline when steamLink is selected */}
              {isLinkOption && isLinkSelected && (
                <div className="px-4 pb-4">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      setUrlError('');
                    }}
                    onKeyDown={handleKeyDown}
                    onBlur={() => {
                      if (urlInput.trim() && validateSteamUrl(urlInput)) {
                        handleUrlSubmit();
                      }
                    }}
                    placeholder="https://steamcommunity.com/id/username"
                    autoFocus
                    className={`
                      w-full px-3 py-2.5 rounded-lg bg-[var(--color-bg-secondary)] 
                      border ${urlError ? 'border-red-500' : 'border-[var(--color-border)]'}
                      text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]
                      focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent
                      text-sm
                    `}
                  />
                  {urlError && (
                    <p className="mt-1.5 text-xs text-red-500">{urlError}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
