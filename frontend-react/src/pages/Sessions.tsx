import { Calendar, History, MessageSquare, Zap } from 'lucide-react';

export function Sessions() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-accent)]/10 mb-4">
            <Calendar className="w-8 h-8 text-[var(--color-accent)]" />
          </div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
            Session History
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Coming soon
          </p>
        </div>

        {/* Preview cards */}
        <div className="space-y-4">
          <PlaceholderCard
            icon={<History className="w-5 h-5" />}
            title="Session Log"
            description="Review your past gaming sessions and satisfaction ratings"
          />
          <PlaceholderCard
            icon={<MessageSquare className="w-5 h-5" />}
            title="Session Feedback"
            description="Rate how you felt after each session to improve recommendations"
          />
          <PlaceholderCard
            icon={<Zap className="w-5 h-5" />}
            title="Quick Reflections"
            description="Simple post-session check-ins to track your well-being"
          />
        </div>

        {/* Coming soon message */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            Session tracking is the heart of Lutem's satisfaction-driven approach.
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

export default Sessions;
