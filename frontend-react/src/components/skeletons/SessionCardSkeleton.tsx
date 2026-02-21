export function SessionCardSkeleton() {
  return (
    <div className="p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-5 w-1/3 skeleton" />
        <div className="h-4 w-16 skeleton rounded-full" />
      </div>
      <div className="h-4 w-2/3 skeleton" />
      <div className="flex items-center gap-3">
        <div className="h-3 w-20 skeleton" />
        <div className="h-3 w-16 skeleton" />
      </div>
    </div>
  );
}

export function SessionListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <SessionCardSkeleton key={i} />
      ))}
    </div>
  );
}
