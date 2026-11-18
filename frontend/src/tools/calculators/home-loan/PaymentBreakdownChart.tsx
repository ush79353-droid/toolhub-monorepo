'use client';

import type { HomeLoanResult } from './types';

const SLICES: readonly {
  key: keyof Pick<
    HomeLoanResult,
    | 'principalSharePercent'
    | 'interestSharePercent'
    | 'pmiSharePercent'
    | 'otherSharePercent'
  >;
  label: string;
  color: string;
}[] = [
  { key: 'principalSharePercent', label: 'Principal', color: '#3B82F6' },
  { key: 'interestSharePercent', label: 'Interest', color: '#EF4444' },
  {
    key: 'pmiSharePercent',
    label: 'Private Mortgage Insurance',
    color: '#EAB308',
  },
  { key: 'otherSharePercent', label: 'Other costs', color: '#94A3B8' },
];

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function slicePath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polar(cx, cy, r, endAngle);
  const end = polar(cx, cy, r, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y} Z`;
}

interface PaymentBreakdownChartProps {
  result: HomeLoanResult;
}

export function PaymentBreakdownChart({ result }: PaymentBreakdownChartProps) {
  const cx = 80;
  const cy = 80;
  const r = 70;
  let angle = 0;
  const paths: { d: string; color: string; label: string; pct: number }[] = [];

  for (const slice of SLICES) {
    const pct = Math.max(0, result[slice.key]);
    if (pct < 0.05) continue;
    const sweep = (pct / 100) * 360;
    const next = angle + sweep;
    paths.push({
      d: slicePath(cx, cy, r, angle, next >= 359.999 ? angle + 360 : next),
      color: slice.color,
      label: slice.label,
      pct,
    });
    angle = next;
  }

  return (
    <div className="mt-4 rounded-xl border border-border bg-white p-3.5 sm:p-4">
      <p className="text-[13px] font-semibold text-accent">
        Total Payment Breakdown in Percentage
      </p>
      <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <svg
          viewBox="0 0 160 160"
          className="h-40 w-40 shrink-0"
          role="img"
          aria-label="Payment breakdown pie chart"
        >
          {paths.length === 0 ? (
            <circle cx={cx} cy={cy} r={r} fill="#E2E8F0" />
          ) : (
            paths.map((path) => (
              <path key={path.label} d={path.d} fill={path.color} />
            ))
          )}
        </svg>
        <ul className="space-y-1.5 text-xs text-accent sm:text-sm">
          {SLICES.map((slice) => (
            <li key={slice.key} className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: slice.color }}
                aria-hidden
              />
              <span>
                {slice.label} ({formatPct(result[slice.key])}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function formatPct(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}
