export function EmptySessionsSvg({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className={className} aria-hidden="true">
      {/* Gamepad */}
      <rect x="50" y="55" width="60" height="40" rx="10" stroke="var(--color-text-muted)" strokeWidth="2" opacity="0.5" />
      <circle cx="68" cy="75" r="6" stroke="var(--color-text-muted)" strokeWidth="2" opacity="0.5" />
      <circle cx="92" cy="75" r="3" fill="var(--color-accent)" opacity="0.6" />
      <circle cx="100" cy="67" r="3" fill="var(--color-accent)" opacity="0.6" />
      {/* D-pad */}
      <rect x="63" y="72" width="10" height="2" rx="1" fill="var(--color-text-muted)" opacity="0.4" />
      <rect x="67" y="68" width="2" height="10" rx="1" fill="var(--color-text-muted)" opacity="0.4" />
      {/* Clock */}
      <circle cx="135" cy="60" r="20" stroke="var(--color-accent)" strokeWidth="2" opacity="0.4" />
      <line x1="135" y1="60" x2="135" y2="48" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="135" y1="60" x2="143" y2="60" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      {/* Decorative dots */}
      <circle cx="40" cy="40" r="3" fill="var(--color-accent)" opacity="0.15" />
      <circle cx="165" cy="100" r="4" fill="var(--color-accent)" opacity="0.15" />
      <circle cx="55" cy="120" r="2" fill="var(--color-text-muted)" opacity="0.2" />
    </svg>
  );
}
