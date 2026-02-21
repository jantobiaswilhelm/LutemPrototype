import { Star } from 'lucide-react';
import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

const sizeMap = {
  sm: 'w-5 h-5',      // Slightly larger for better touch targets
  md: 'w-7 h-7',
  lg: 'w-9 h-9',
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
          aria-label={`${star} out of 5 stars`}
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
