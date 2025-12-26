import { User, Gamepad2, Target, Award, LogOut } from 'lucide-react';
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

  // Not logged in - show preview
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[var(--color-bg-primary)] px-4 py-8 pb-24">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-accent)]/10 mb-4">
              <User className="w-8 h-8 text-[var(--color-accent)]" />
            </div>
            <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
              Your Profile
            </h1>
            <p className="text-[var(--color-text-muted)]">
              Personalize your gaming experience
            </p>
          </div>

          {/* Preview cards */}
          <div className="space-y-4">
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

          {/* Login prompt */}
          <LoginPrompt feature="your personalized profile" />
        </div>
      </main>
    );
  }

  // Logged in - show full profile
  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header with user info */}
        <div className="text-center mb-8">
          {user?.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt={user.displayName} 
              className="w-20 h-20 rounded-2xl mx-auto mb-4 border-2 border-[var(--color-accent)]"
            />
          ) : (
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[var(--color-accent)]/10 mb-4">
              <User className="w-10 h-10 text-[var(--color-accent)]" />
            </div>
          )}
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-1">
            {user?.displayName || 'Your Profile'}
          </h1>
          {user?.email && (
            <p className="text-[var(--color-text-muted)] text-sm mb-2">
              {user.email}
            </p>
          )}
          <p className="text-xs text-[var(--color-text-muted)]">
            Signed in with {user?.authProvider === 'steam' ? '🎮 Steam' : '🔵 Google'}
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {/* Steam Connect - only show for Google users who haven't connected Steam */}
          {user?.authProvider === 'google' && !user.steamId && (
            <SteamConnect />
          )}
          
          {/* Steam connected info for Steam users */}
          {user?.authProvider === 'steam' && (
            <div className="p-5 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-green-500/10">
                  <Gamepad2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium text-[var(--color-text-primary)]">Steam Connected</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Steam ID: {user.steamId}
                  </p>
                </div>
              </div>
            </div>
          )}
          
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

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full p-4 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-red-500/50 transition-colors flex items-center justify-center gap-3 text-[var(--color-text-muted)] hover:text-red-500"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
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
