import { Loader2 } from 'lucide-react';

export default function LoadingStep() {
  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border)] shadow-md p-8">
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="w-12 h-12 text-[var(--color-accent)] animate-spin mb-4" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
          Finding your perfect game...
        </h3>
        <p className="text-sm text-[var(--color-text-muted)] text-center">
          Analyzing your mood and preferences
        </p>
      </div>
    </div>
  );
}
