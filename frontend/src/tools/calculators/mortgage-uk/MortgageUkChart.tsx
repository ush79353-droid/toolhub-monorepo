'use client';

import type { MortgageUkChartSlice, MortgageUkResult } from './types';

const COLORS: Record<MortgageUkChartSlice['key'], string> = {
  mortgage: '#3B82F6',
  taxes: '#22C55E',
  homeInsurance: '#38BDF8',
  mortgageInsurance: '#EAB308',
  other: '#B45309',
};

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutSlice(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number
): string {
  const sweep = endAngle - startAngle;
  if (!(sweep > 0)) return '';
  const large = sweep > 180 ? 1 : 0;
  const o0 = polar(cx, cy, outerR, startAngle);
  const o1 = polar(cx, cy, outerR, endAngle);
  const i1 = polar(cx, cy, innerR, endAngle);
  const i0 = polar(cx, cy, innerR, startAngle);
  return [
    `M ${o0.x} ${o0.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${o1.x} ${o1.y}`,
    `L ${i1.x} ${i1.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${i0.x} ${i0.y}`,
    'Z',
  ].join(' ');
}

export function MortgageUkChart({ result }: { result: MortgageUkResult }) {
  const cx = 90;
  const cy = 90;
  const outerR = 70;
  const innerR = 38;
  let angle = 0;
  const paths: { d: string; color: string; label: string; pct: number }[] = [];

  for (const slice of result.chartSlices) {
    const pct = Math.max(0, slice.percent);
    if (pct < 0.05) continue;
    const sweep = (pct / 100) * 360;
    const next = angle + sweep;
    const d = donutSlice(
      cx,
      cy,
      outerR,
      innerR,
      angle,
      next >= 359.999 ? angle + 360 : next
    );
    if (d) {
      paths.push({
        d,
        color: COLORS[slice.key],
        label: slice.label,
        pct,
      });
    }
    angle = next;
  }

  return (
    <div className="mt-4 rounded-xl border border-border bg-white p-3.5 sm:p-4">
      <p className="text-[13px] font-semibold text-accent">Payment breakdown</p>
      <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <svg
          viewBox="0 0 180 180"
          className="h-40 w-40 shrink-0"
          role="img"
          aria-label="Out-of-pocket cost doughnut chart"
        >
          {paths.length === 0 ? (
            <circle cx={cx} cy={cy} r={outerR} fill="#E2E8F0" />
          ) : (
            paths.map((path) => (
              <path key={path.label} d={path.d} fill={path.color} />
            ))
          )}
          <circle cx={cx} cy={cy} r={innerR} fill="white" />
        </svg>
        <ul className="space-y-1.5 text-xs text-accent sm:text-sm">
          {result.chartSlices.map((slice) => (
            <li key={slice.key} className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: COLORS[slice.key] }}
                aria-hidden
              />
              <span>
                {slice.label} ({Math.round(slice.percent)}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
