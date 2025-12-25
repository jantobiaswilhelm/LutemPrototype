import { User, Gamepad2, Target, Award } from 'lucide-react';
import { SteamConnect } from '@/components/SteamConnect';

// TODO: Get from auth context
const MOCK_FIREBASE_UID = 'test-user-123';

export function Profile() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-accent)]/10 mb-4">
            <User className="w-8 h-8 text-[var(--color-accent)]" />
          </div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
            Your Profile
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Customize your gaming companion
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {/* Steam Connect - ACTIVE */}
          <SteamConnect firebaseUid={MOCK_FIREBASE_UID} />
          
          {/* Other cards - Coming Soon */}
          <PlaceholderCard
            icon={<Gamepad2 className="w-5 h-5" />}
            title="Gaming Preferences"
            description="Set your favorite genres, play styles, and mood preferences"
          />
          <PlaceholderCard
            icon={<Target className="w-5 h-5" />}
            title="Gaming Goals"
            description="Define what you want from your gaming sessions"
          />
          <PlaceholderCard
            icon={<Award className="w-5 h-5" />}
            title="Achievements"
            description="Track your Lutem milestones and streaks"
          />
        </div>

        {/* Footer message */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            Your gaming companion, personalized to you.
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

export default Profile;
