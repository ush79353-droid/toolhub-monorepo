'use client';

import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import type { SavingsResult } from './types';

const COLORS = {
  initial: '#3B82F6',
  deposits: '#EF4444',
  interest: '#EAB308',
} as const;

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
  const sweep = endAngle - startAngle;
  if (!(sweep > 0)) return '';
  if (sweep >= 359.999) {
    return [
      `M ${cx} ${cy - r}`,
      `A ${r} ${r} 0 1 1 ${cx} ${cy + r}`,
      `A ${r} ${r} 0 1 1 ${cx} ${cy - r}`,
      'Z',
    ].join(' ');
  }
  const large = sweep > 180 ? 1 : 0;
  const start = polar(cx, cy, r, startAngle);
  const end = polar(cx, cy, r, endAngle);
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
}

export function SavingsBreakdownChart({
  result,
  currency,
}: {
  result: SavingsResult;
  currency: SupportedCurrency;
}) {
  const initial = Math.max(0, result.finalBalance - result.totalAdditionalDeposits - result.totalInterest);
  // Prefer explicit identity pieces from the result for legend amounts.
  const initialAmt = Math.max(0, result.totalPrincipal - result.totalAdditionalDeposits);
  const depositsAmt = Math.max(0, result.totalAdditionalDeposits);
  const interestAmt = Math.max(0, result.totalInterest);
  void initial;

  const parts = [
    { key: 'initial', label: 'Initial deposit', value: initialAmt, color: COLORS.initial },
    { key: 'deposits', label: 'Total deposits', value: depositsAmt, color: COLORS.deposits },
    { key: 'interest', label: 'Total interest', value: interestAmt, color: COLORS.interest },
  ] as const;

  const total = parts.reduce((sum, p) => sum + p.value, 0) || 1;
  let angle = 0;
  const slices = parts.map((part) => {
    const sweep = (part.value / total) * 360;
    const path = slicePath(90, 90, 70, angle, angle + sweep);
    const start = angle;
    angle += sweep;
    return { ...part, path, start, sweep };
  });

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:justify-center">
      <svg
        viewBox="0 0 180 180"
        className="h-40 w-40 shrink-0 sm:h-44 sm:w-44"
        role="img"
        aria-label={`Final balance breakdown: initial ${result.initialShare.toFixed(1)} percent, deposits ${result.depositsShare.toFixed(1)} percent, interest ${result.interestShare.toFixed(1)} percent`}
      >
        {slices.map((slice) =>
          slice.path ? <path key={slice.key} d={slice.path} fill={slice.color} /> : null
        )}
      </svg>
      <ul className="space-y-1.5 text-xs text-accent sm:text-sm">
        {parts.map((part) => (
          <li key={part.key} className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: part.color }}
              aria-hidden
            />
            <span>
              {part.label} ({((part.value / total) * 100).toFixed(1)}%) —{' '}
              {formatCurrencyValue(part.value, currency)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
