export function SessionCardSkeleton() {
  return (
    <div
      className="p-4 space-y-3"
      style={{ borderBottom: '1px solid var(--color-border)' }}
    >
      <div className="flex items-center justify-between">
        <div className="h-5 w-1/3 skeleton" />
        <div className="h-3 w-16 skeleton" />
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
    <div>
      {Array.from({ length: count }, (_, i) => (
        <SessionCardSkeleton key={i} />
      ))}
    </div>
  );
}
