import type { Application } from '../types';
import { PROGRESS_STAGES, progressRank } from '../types';

const LABELS: Record<string, string> = {
  Applied: 'Applied',
  Screen: 'Screens',
  Interview: 'Interviews',
  Offer: 'Offers',
};

const BAR_HEIGHT = 28;
const ROW_GAP = 14;
const LABEL_HEIGHT = 18;
const WIDTH = 600;
const MIN_BAR = 4;

export function Funnel({ applications }: { applications: Application[] }) {
  if (applications.length === 0) {
    return (
      <p style={{ color: 'currentColor', opacity: 0.7 }}>
        No applications yet. Add your first one to see the funnel take shape.
      </p>
    );
  }

  // counts[i] = applications whose furthestStage reached stage i or beyond
  const counts = PROGRESS_STAGES.map(
    (_, i) => applications.filter((a) => progressRank(a.furthestStage) >= i).length,
  );
  const total = counts[0];

  const rowHeight = LABEL_HEIGHT + BAR_HEIGHT + ROW_GAP;
  const height = PROGRESS_STAGES.length * rowHeight - ROW_GAP;

  const rows = PROGRESS_STAGES.map((stage, i) => {
    const count = counts[i];
    const prev = counts[i - 1];
    const pct =
      i === 0 || prev === 0 ? null : Math.round((count / prev) * 100);
    const label =
      i === 0
        ? `${LABELS[stage]} ${count}`
        : `${LABELS[stage]} ${count} (${pct ?? 0}% of ${LABELS[PROGRESS_STAGES[i - 1]].toLowerCase()})`;
    const barWidth =
      count === 0 ? 0 : Math.max(MIN_BAR, (count / total) * WIDTH);
    return { stage, count, label, barWidth, y: i * rowHeight };
  });

  const ariaLabel =
    'Job search funnel: ' + rows.map((r) => r.label).join(', ') + '.';

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${height}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
      role="img"
      aria-label={ariaLabel}
    >
      {rows.map((r, i) => (
        <g key={r.stage}>
          <text
            x={0}
            y={r.y + LABEL_HEIGHT - 5}
            fill="currentColor"
            fontSize={13}
            fontFamily="inherit"
          >
            {r.label}
          </text>
          {r.barWidth > 0 && (
            <rect
              x={0}
              y={r.y + LABEL_HEIGHT}
              width={r.barWidth}
              height={BAR_HEIGHT}
              rx={4}
              fill="var(--accent, #2563eb)"
              opacity={1 - i * 0.15}
            />
          )}
        </g>
      ))}
    </svg>
  );
}
