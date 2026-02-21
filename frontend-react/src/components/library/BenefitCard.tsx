export function BenefitCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)]/50">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-[var(--color-text-primary)] mb-0.5">{title}</h3>
          <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
        </div>
      </div>
    </div>
  );
}
