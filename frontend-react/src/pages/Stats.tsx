import { BarChart2, TrendingUp, Clock, Star } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { LoginPrompt } from '@/components/LoginPrompt';

export function Stats() {
  const { isAuthenticated } = useAuthStore();

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-accent)]/10 mb-4">
            <BarChart2 className="w-8 h-8 text-[var(--color-accent)]" />
          </div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
            Your Gaming Stats
          </h1>
          <p className="text-[var(--color-text-muted)]">
            {isAuthenticated ? 'Coming soon' : 'Track your gaming satisfaction over time'}
          </p>
        </div>

        {/* Preview cards */}
        <div className="space-y-4">
          <PlaceholderCard
            icon={<TrendingUp className="w-5 h-5" />}
            title="Satisfaction Trends"
            description="Track how your gaming satisfaction changes over time"
          />
          <PlaceholderCard
            icon={<Clock className="w-5 h-5" />}
            title="Time Insights"
            description="See when you game best and for how long"
          />
          <PlaceholderCard
            icon={<Star className="w-5 h-5" />}
            title="Top Games"
            description="Your most satisfying games at a glance"
          />
        </div>

        {/* Login prompt or coming soon message */}
        {!isAuthenticated ? (
          <LoginPrompt feature="your personal gaming statistics" />
        ) : (
          <div className="mt-12 text-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              We're building something special to help you understand your gaming habits better.
            </p>
          </div>
        )}
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

export default Stats;
