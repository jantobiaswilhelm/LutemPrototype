import { Settings as SettingsIcon, Palette, Bell, Shield, Monitor, Sun, Moon, Check, ShieldAlert, Gamepad2, Clock, Users, Volume2 } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { useContentPreferences } from '@/hooks/useContentPreferences';
import { useGamingPreferences } from '@/hooks/useGamingPreferences';
import { CONTENT_RATING, SOCIAL_PREFERENCES, AUDIO_AVAILABILITY, type Theme, type ContentRating, type SocialPreference, type AudioAvailability } from '@/types';

const THEMES: { id: Theme; name: string; emoji: string; colors: { primary: string; secondary: string } }[] = [
  { id: 'cafe', name: 'Café', emoji: '☕', colors: { primary: '#8B7355', secondary: '#D4C4B5' } },
  { id: 'lavender', name: 'Lavender', emoji: '💜', colors: { primary: '#9D8EC7', secondary: '#E8E0F0' } },
  { id: 'earth', name: 'Earth', emoji: '🌿', colors: { primary: '#6B8E6B', secondary: '#D5E5D5' } },
  { id: 'ocean', name: 'Ocean', emoji: '🌊', colors: { primary: '#5B8A9A', secondary: '#D0E5EB' } },
];

const RATING_ORDER: ContentRating[] = ['EVERYONE', 'TEEN', 'MATURE', 'ADULT'];

const SOCIAL_ORDER: SocialPreference[] = ['SOLO', 'COOP', 'COMPETITIVE', 'BOTH'];
const AUDIO_ORDER: AudioAvailability[] = ['full', 'low', 'muted'];

const TIME_OPTIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3+ hours' },
];

const POPULAR_GENRES = [
  'Action', 'Adventure', 'RPG', 'Strategy', 'Simulation',
  'Puzzle', 'Platformer', 'Shooter', 'Horror', 'Indie',
  'Roguelike', 'Survival', 'Racing', 'Sports', 'Fighting',
];

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

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-accent)]/10 mb-4">
            <SettingsIcon className="w-8 h-8 text-[var(--color-accent)]" />
          </div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
            Settings
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Customize your experience
          </p>
        </div>

        {/* Appearance Section */}
        <div className="mb-6">
          <div className="p-5 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-2 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-[var(--color-text-primary)] mb-1">Appearance</h3>
                <p className="text-sm text-[var(--color-text-muted)]">Choose your theme and display mode</p>
              </div>
            </div>

            {/* Mode toggle */}
            <div className="mb-6">
              <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-3 block">
                Display Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode('light')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    mode === 'light' 
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10' 
                      : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                  }`}
                >
                  <Sun className={`w-5 h-5 ${mode === 'light' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}`} />
                  <span className={`font-medium ${mode === 'light' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}>
                    Light
                  </span>
                </button>
                <button
                  onClick={() => setMode('dark')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    mode === 'dark' 
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10' 
                      : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                  }`}
                >
                  <Moon className={`w-5 h-5 ${mode === 'dark' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}`} />
                  <span className={`font-medium ${mode === 'dark' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}>
                    Dark
                  </span>
                </button>
              </div>
            </div>

            {/* Theme selection */}
            <div>
              <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-3 block">
                Color Theme
              </label>
              <div className="grid grid-cols-2 gap-3">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      theme === t.id 
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10' 
                        : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                    }`}
                  >
                    <div className="flex-shrink-0 flex gap-1">
                      <div className="w-4 h-8 rounded-l-md" style={{ backgroundColor: t.colors.primary }} />
                      <div className="w-4 h-8 rounded-r-md" style={{ backgroundColor: t.colors.secondary }} />
                    </div>
                    <div>
                      <span className="text-sm">{t.emoji}</span>
                      <span className={`ml-1 font-medium ${theme === t.id ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}>
                        {t.name}
                      </span>
                    </div>
                    {theme === t.id && <Check className="absolute top-2 right-2 w-4 h-4 text-[var(--color-accent)]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Preferences Section */}
        <div className="mb-6">
          <div className="p-5 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-2 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-[var(--color-text-primary)] mb-1">Content Preferences</h3>
                <p className="text-sm text-[var(--color-text-muted)]">Filter recommendations by content maturity</p>
              </div>
            </div>

            {/* Content Rating */}
            <div className="mb-6">
              <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-3 block">
                Maximum Content Rating
              </label>
              <div className="grid grid-cols-2 gap-2">
                {RATING_ORDER.map((rating) => {
                  const data = CONTENT_RATING[rating];
                  const isSelected = maxContentRating === rating;
                  return (
                    <button
                      key={rating}
                      onClick={() => setMaxContentRating(rating)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                          : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                      }`}
                    >
                      <span className="text-lg">{data.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <span className={`block text-sm font-medium ${isSelected ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}>
                          {data.displayName}
                        </span>
                        <span className="block text-xs text-[var(--color-text-muted)] truncate">
                          {data.description}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* NSFW Toggle */}
            <div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-tertiary)]">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🔥</span>
                  <div>
                    <span className="block text-sm font-medium text-[var(--color-text-primary)]">
                      Allow NSFW Content
                    </span>
                    <span className="block text-xs text-[var(--color-text-muted)]">
                      Include games with sexual/suggestive content
                    </span>
                  </div>
                </div>
                <button
                  onClick={toggleNsfw}
                  role="switch"
                  aria-checked={allowNsfw}
                  aria-label="Allow NSFW content"
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    allowNsfw ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border-strong)]'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      allowNsfw ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Gaming Preferences Section */}
        <div className="mb-6">
          <div className="p-5 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-2 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-[var(--color-text-primary)] mb-1">Gaming Defaults</h3>
                <p className="text-sm text-[var(--color-text-muted)]">Set your typical gaming preferences</p>
              </div>
            </div>

            {/* Default Time Available */}
            <div className="mb-6">
              <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Default Time Available
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TIME_OPTIONS.map((option) => {
                  const isSelected = defaultTimeAvailable === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setDefaultTimeAvailable(option.value)}
                      className={`p-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                        isSelected
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                          : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/50'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Social Preference */}
            <div className="mb-6">
              <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Default Play Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SOCIAL_ORDER.map((social) => {
                  const data = SOCIAL_PREFERENCES[social];
                  const isSelected = defaultSocialPreference === social;
                  return (
                    <button
                      key={social}
                      onClick={() => setDefaultSocialPreference(social)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                          : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                      }`}
                    >
                      <span className="text-lg">{data.emoji}</span>
                      <span className={`text-sm font-medium ${isSelected ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}>
                        {data.displayName}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[var(--color-accent)] ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Audio Availability */}
            <div className="mb-6">
              <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-3 flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Default Audio Situation
              </label>
              <div className="grid grid-cols-3 gap-2">
                {AUDIO_ORDER.map((audio) => {
                  const data = AUDIO_AVAILABILITY[audio];
                  const isSelected = defaultAudioAvailability === audio;
                  return (
                    <button
                      key={audio}
                      onClick={() => setDefaultAudioAvailability(audio)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                          : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                      }`}
                    >
                      <span className="text-xl">{data.emoji}</span>
                      <span className={`text-xs font-medium text-center ${isSelected ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}>
                        {data.displayName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred Genres */}
            <div>
              <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-3 block">
                Preferred Genres
              </label>
              <p className="text-xs text-[var(--color-text-muted)] mb-3">
                Select genres you enjoy - these will boost recommendations
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_GENRES.map((genre) => {
                  const isSelected = preferredGenres.includes(genre.toLowerCase());
                  return (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-[var(--color-accent)] text-white'
                          : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-accent)]/20'
                      }`}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Coming soon sections */}
        <div className="space-y-4">
          <PlaceholderCard
            icon={<Bell className="w-5 h-5" />}
            title="Notifications"
            description="Control when and how Lutem reaches out to you"
          />
          <PlaceholderCard
            icon={<Monitor className="w-5 h-5" />}
            title="Display"
            description="Customize card layouts, animations, and more"
          />
          <PlaceholderCard
            icon={<Shield className="w-5 h-5" />}
            title="Privacy"
            description="Manage your data and privacy preferences"
          />
        </div>

        {/* Coming soon message */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            More settings coming soon
          </p>
        </div>
      </div>
    </main>
  );
}

function PlaceholderCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="p-5 rounded-2xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)]/50 opacity-60">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-xl bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-[var(--color-text-primary)]">{title}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
              Soon
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
