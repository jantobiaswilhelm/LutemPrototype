import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

// Typographic dot sizes — map legacy size prop onto a serif dot scale.
const sizeMap = {
  sm: 'text-[0.9rem] tracking-[0.32em]',
  md: 'text-[1.15rem] tracking-[0.36em]',
  lg: 'text-[1.5rem] tracking-[0.4em]',
};

export function StarRating({
  value,
  onChange,
  size = 'md',
  readonly = false
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue ?? value;
  const sizeClass = sizeMap[size];

  return (
    <div
      role="group"
      aria-label={readonly ? `Rating: ${value} out of 5 stars` : 'Rate this session'}
      className={`star-rating inline-flex items-baseline font-serif leading-none ${sizeClass}`}
      onMouseLeave={() => !readonly && setHoverValue(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= displayValue;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHoverValue(star)}
            onFocus={() => !readonly && setHoverValue(star)}
            onBlur={() => !readonly && setHoverValue(null)}
            className={`star-rating-dot bg-transparent border-0 p-0 leading-none transition-[color,opacity] duration-200 ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
            style={{
              color: filled ? 'var(--color-accent)' : 'var(--color-text-muted)',
              opacity: filled ? 1 : 0.45,
            }}
            aria-label={`${star} out of 5 stars`}
          >
            <span aria-hidden="true">{filled ? '●' : '○'}</span>
          </button>
        );
      })}
    </div>
  );
}
