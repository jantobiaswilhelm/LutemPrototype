export function BenefitCard({ icon, title, description, numeral }: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  numeral?: string;
}) {
  return (
    <div
      className="py-5 px-0 grid grid-cols-[auto_1fr] gap-x-5 items-baseline"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      <span
        className="font-mono text-[0.72rem] tracking-[0.2em] uppercase"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {numeral ?? '—'}
      </span>
      <div>
        <h3
          className="font-serif text-[1.05rem] leading-snug m-0"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {title}
        </h3>
        <p
          className="font-serif italic text-[0.92rem] leading-snug mt-1 max-w-[44ch]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {description}
        </p>
      </div>
      {icon && (
        <span
          aria-hidden="true"
          className="col-start-1 row-start-1 opacity-0 pointer-events-none"
        >
          {icon}
        </span>
      )}
    </div>
  );
}
