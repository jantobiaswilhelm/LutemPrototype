export function GameCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
      <div className="aspect-[460/215] skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 skeleton" />
        <div className="h-3 w-1/2 skeleton" />
      </div>
    </div>
  );
}

export function GameRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
      <div className="w-20 h-10 rounded-lg skeleton flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 skeleton" />
        <div className="h-3 w-1/3 skeleton" />
      </div>
    </div>
  );
}

export function GameGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <GameCardSkeleton key={i} />
      ))}
    </div>
  );
}
