export function EmptyCalendarSvg({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className={className} aria-hidden="true">
      {/* Calendar */}
      <rect x="50" y="35" width="70" height="65" rx="8" stroke="var(--color-text-muted)" strokeWidth="2" opacity="0.5" />
      <line x1="50" y1="52" x2="120" y2="52" stroke="var(--color-text-muted)" strokeWidth="2" opacity="0.4" />
      {/* Calendar hooks */}
      <line x1="68" y1="30" x2="68" y2="40" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="102" y1="30" x2="102" y2="40" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      {/* Grid cells */}
      <rect x="58" y="60" width="10" height="8" rx="2" fill="var(--color-text-muted)" opacity="0.15" />
      <rect x="72" y="60" width="10" height="8" rx="2" fill="var(--color-text-muted)" opacity="0.15" />
      <rect x="86" y="60" width="10" height="8" rx="2" fill="var(--color-accent)" opacity="0.3" />
      <rect x="100" y="60" width="10" height="8" rx="2" fill="var(--color-text-muted)" opacity="0.15" />
      <rect x="58" y="74" width="10" height="8" rx="2" fill="var(--color-text-muted)" opacity="0.15" />
      <rect x="72" y="74" width="10" height="8" rx="2" fill="var(--color-text-muted)" opacity="0.15" />
      <rect x="86" y="74" width="10" height="8" rx="2" fill="var(--color-text-muted)" opacity="0.15" />
      {/* Small controller */}
      <rect x="130" y="70" width="30" height="20" rx="6" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.4" />
      <circle cx="140" cy="80" r="2" fill="var(--color-accent)" opacity="0.4" />
      <circle cx="150" cy="80" r="2" fill="var(--color-accent)" opacity="0.4" />
      {/* Decorative */}
      <circle cx="38" cy="55" r="3" fill="var(--color-accent)" opacity="0.15" />
      <circle cx="170" cy="45" r="2" fill="var(--color-text-muted)" opacity="0.2" />
    </svg>
  );
}
