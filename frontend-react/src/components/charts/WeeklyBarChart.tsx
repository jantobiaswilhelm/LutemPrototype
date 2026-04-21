import { useMemo } from 'react';
import type { SessionHistory } from '@/types';

interface WeeklyBarChartProps {
  sessions: SessionHistory[];
}

const DAY_LABELS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

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
  const width = 320;
  const height = 140;
  const barWidth = 18;
  const gap = (width - 7 * barWidth) / 8;
  const chartTop = 16;
  const chartBottom = height - 28;
  const chartHeight = chartBottom - chartTop;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full max-w-[320px]"
      role="img"
      aria-label="Sessions per day this week"
    >
      {/* baseline rule */}
      <line
        x1={0}
        x2={width}
        y1={chartBottom + 0.5}
        y2={chartBottom + 0.5}
        stroke="var(--color-border)"
        strokeWidth={1}
      />

      {dayCounts.map((count, i) => {
        const barH = maxCount > 0 ? (count / maxCount) * chartHeight : 0;
        const x = gap + i * (barWidth + gap);
        const y = chartBottom - barH;
        const isActive = count > 0;

        return (
          <g key={i}>
            {/* Bar — thin ink rectangle, no rounding, no gradient */}
            <rect
              x={x}
              y={isActive ? y : chartBottom - 2}
              width={barWidth}
              height={isActive ? barH : 2}
              fill={isActive ? 'var(--color-accent)' : 'var(--color-border-strong)'}
              opacity={isActive ? 1 : 0.55}
            />
            {/* Count label above bar — serif numeral */}
            {isActive && (
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-serif, "Shippori Mincho", serif)',
                  fontSize: '10px',
                  fill: 'var(--color-text-primary)',
                }}
              >
                {count}
              </text>
            )}
            {/* Day label — mono, uppercase */}
            <text
              x={x + barWidth / 2}
              y={height - 8}
              textAnchor="middle"
              style={{
                fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                fontSize: '8px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fill: 'var(--color-text-muted)',
              }}
            >
              {DAY_LABELS[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
