import { Star } from 'lucide-react';
import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
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
      className="flex gap-1"
      onMouseLeave={() => !readonly && setHoverValue(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          className={`
            transition-colors
            ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
            disabled:opacity-100
          `}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            className={`
              ${sizeClass}
              transition-colors
              ${star <= displayValue
                ? 'fill-[var(--color-accent)] text-[var(--color-accent)]'
                : 'fill-transparent text-[var(--color-text-muted)]'
              }
            `}
          />
        </button>
      ))}
    </div>
  );
}
