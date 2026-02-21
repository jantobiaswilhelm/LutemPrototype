import { useMemo } from 'react';
import type { SessionHistory } from '@/types';

interface WeeklyBarChartProps {
  sessions: SessionHistory[];
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function WeeklyBarChart({ sessions }: WeeklyBarChartProps) {
  const dayCounts = useMemo(() => {
    const now = new Date();
    const counts = new Array(7).fill(0);

    // Build map of day-of-week -> count for the past 7 days
    for (const s of sessions) {
      const date = new Date(s.startedAt || s.recommendedAt);
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 7) {
        // Get the JS day (0=Sun) and convert to index (0=Mon)
        const jsDay = date.getDay();
        const idx = jsDay === 0 ? 6 : jsDay - 1;
        counts[idx]++;
      }
    }
    return counts;
  }, [sessions]);

  const maxCount = Math.max(...dayCounts, 1);

  // Chart dimensions
  const width = 280;
  const height = 120;
  const barWidth = 24;
  const gap = (width - 7 * barWidth) / 8;
  const chartTop = 8;
  const chartBottom = height - 20;
  const chartHeight = chartBottom - chartTop;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full max-w-[280px] mx-auto"
      role="img"
      aria-label="Sessions per day this week"
    >
      {dayCounts.map((count, i) => {
        const barH = maxCount > 0 ? (count / maxCount) * chartHeight : 0;
        const x = gap + i * (barWidth + gap);
        const y = chartBottom - barH;

        return (
          <g key={i}>
            {/* Bar */}
            <rect
              x={x}
              y={barH > 0 ? y : chartBottom - 2}
              width={barWidth}
              height={barH > 0 ? barH : 2}
              rx={4}
              fill={count > 0 ? 'var(--color-accent)' : 'var(--color-bg-tertiary)'}
              opacity={count > 0 ? 0.8 : 0.4}
            />
            {/* Count label above bar */}
            {count > 0 && (
              <text
                x={x + barWidth / 2}
                y={y - 4}
                textAnchor="middle"
                className="text-[9px] font-medium"
                fill="var(--color-text-secondary)"
              >
                {count}
              </text>
            )}
            {/* Day label */}
            <text
              x={x + barWidth / 2}
              y={height - 4}
              textAnchor="middle"
              className="text-[9px]"
              fill="var(--color-text-muted)"
            >
              {DAY_LABELS[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
