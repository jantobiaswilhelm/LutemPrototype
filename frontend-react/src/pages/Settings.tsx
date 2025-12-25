import { Settings as SettingsIcon, Palette, Bell, Shield, Monitor } from 'lucide-react';

export function Settings() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-accent)]/10 mb-4">
            <SettingsIcon className="w-8 h-8 text-[var(--color-accent)]" />
          </div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
            Settings
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Coming soon
          </p>
        </div>

        {/* Preview cards */}
        <div className="space-y-4">
          <PlaceholderCard
            icon={<Palette className="w-5 h-5" />}
            title="Appearance"
            description="Choose your theme, colors, and display preferences"
          />
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
        <div className="mt-12 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            Make Lutem truly yours.
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
        <div>
          <h3 className="font-medium text-[var(--color-text-primary)] mb-1">{title}</h3>
          <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
