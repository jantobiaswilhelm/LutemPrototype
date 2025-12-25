import { Settings as SettingsIcon, Palette, Bell, Shield, Monitor, Sun, Moon, Check } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import type { Theme } from '@/types';

const THEMES: { id: Theme; name: string; emoji: string; colors: { primary: string; secondary: string } }[] = [
  { id: 'cafe', name: 'Café', emoji: '☕', colors: { primary: '#8B7355', secondary: '#D4C4B5' } },
  { id: 'lavender', name: 'Lavender', emoji: '💜', colors: { primary: '#9D8EC7', secondary: '#E8E0F0' } },
  { id: 'earth', name: 'Earth', emoji: '🌿', colors: { primary: '#6B8E6B', secondary: '#D5E5D5' } },
  { id: 'ocean', name: 'Ocean', emoji: '🌊', colors: { primary: '#5B8A9A', secondary: '#D0E5EB' } },
];

export function Settings() {
  const { theme, mode, setTheme, setMode } = useThemeStore();

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

        {/* Appearance - Active */}
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
                  className={`
                    flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all
                    ${mode === 'light' 
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10' 
                      : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                    }
                  `}
                >
                  <Sun className={`w-5 h-5 ${mode === 'light' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}`} />
                  <span className={`font-medium ${mode === 'light' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}>
                    Light
                  </span>
                </button>
                <button
                  onClick={() => setMode('dark')}
                  className={`
                    flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all
                    ${mode === 'dark' 
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10' 
                      : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                    }
                  `}
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
                    className={`
                      relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
                      ${theme === t.id 
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10' 
                        : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                      }
                    `}
                  >
                    {/* Color preview */}
                    <div className="flex-shrink-0 flex gap-1">
                      <div 
                        className="w-4 h-8 rounded-l-md" 
                        style={{ backgroundColor: t.colors.primary }}
                      />
                      <div 
                        className="w-4 h-8 rounded-r-md" 
                        style={{ backgroundColor: t.colors.secondary }}
                      />
                    </div>
                    <div>
                      <span className="text-sm">{t.emoji}</span>
                      <span className={`ml-1 font-medium ${theme === t.id ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}>
                        {t.name}
                      </span>
                    </div>
                    {theme === t.id && (
                      <Check className="absolute top-2 right-2 w-4 h-4 text-[var(--color-accent)]" />
                    )}
                  </button>
                ))}
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
    <div className="
      p-5 rounded-2xl
      bg-[var(--color-bg-secondary)]/50
      border border-[var(--color-border)]/50
      opacity-60
    ">
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
