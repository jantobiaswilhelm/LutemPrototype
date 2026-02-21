export function EmptyFriendsSvg({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className={className} aria-hidden="true">
      {/* Person 1 */}
      <circle cx="75" cy="55" r="14" stroke="var(--color-text-muted)" strokeWidth="2" opacity="0.5" />
      <path d="M55 95 C55 80, 95 80, 95 95" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      {/* Person 2 */}
      <circle cx="125" cy="55" r="14" stroke="var(--color-accent)" strokeWidth="2" opacity="0.5" />
      <path d="M105 95 C105 80, 145 80, 145 95" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      {/* Connection line */}
      <line x1="89" y1="55" x2="111" y2="55" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" />
      {/* Plus hint */}
      <circle cx="100" cy="115" r="10" stroke="var(--color-text-muted)" strokeWidth="1.5" opacity="0.3" />
      <line x1="96" y1="115" x2="104" y2="115" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <line x1="100" y1="111" x2="100" y2="119" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      {/* Decorative */}
      <circle cx="40" cy="70" r="3" fill="var(--color-accent)" opacity="0.15" />
      <circle cx="160" cy="45" r="2" fill="var(--color-text-muted)" opacity="0.2" />
    </svg>
  );
}
