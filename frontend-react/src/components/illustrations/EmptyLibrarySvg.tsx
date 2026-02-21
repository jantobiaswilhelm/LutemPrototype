export function EmptyLibrarySvg({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className={className} aria-hidden="true">
      {/* Bookshelf base */}
      <line x1="40" y1="110" x2="160" y2="110" stroke="var(--color-text-muted)" strokeWidth="2" opacity="0.4" />
      {/* Books */}
      <rect x="52" y="65" width="14" height="45" rx="2" stroke="var(--color-text-muted)" strokeWidth="1.5" opacity="0.4" />
      <rect x="70" y="55" width="12" height="55" rx="2" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.5" />
      <rect x="86" y="70" width="14" height="40" rx="2" stroke="var(--color-text-muted)" strokeWidth="1.5" opacity="0.4" />
      <rect x="104" y="60" width="11" height="50" rx="2" stroke="var(--color-text-muted)" strokeWidth="1.5" opacity="0.4" />
      <rect x="119" y="72" width="13" height="38" rx="2" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.4" />
      {/* Book spines (lines) */}
      <line x1="59" y1="72" x2="59" y2="104" stroke="var(--color-text-muted)" strokeWidth="0.5" opacity="0.3" />
      <line x1="76" y1="62" x2="76" y2="104" stroke="var(--color-accent)" strokeWidth="0.5" opacity="0.3" />
      {/* Empty slot (dashed) */}
      <rect x="136" y="65" width="14" height="45" rx="2" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" />
      {/* Decorative */}
      <circle cx="45" cy="45" r="3" fill="var(--color-accent)" opacity="0.15" />
      <circle cx="155" cy="40" r="2" fill="var(--color-text-muted)" opacity="0.2" />
    </svg>
  );
}
