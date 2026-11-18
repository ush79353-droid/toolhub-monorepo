import type { CanadianMortgageResult } from './types';

const SLICES: readonly {
  key: keyof Pick<
    CanadianMortgageResult,
    | 'mortgageSharePercent'
    | 'propertyTaxSharePercent'
    | 'homeInsuranceSharePercent'
    | 'mortgageInsuranceSharePercent'
    | 'condoHoaSharePercent'
    | 'otherCostsSharePercent'
  >;
  label: string;
  color: string;
}[] = [
  { key: 'mortgageSharePercent', label: 'Mortgage Payment', color: '#3B82F6' },
  { key: 'otherCostsSharePercent', label: 'Other Cost', color: '#B91C1C' },
  { key: 'propertyTaxSharePercent', label: 'Property Taxes', color: '#16A34A' },
  { key: 'homeInsuranceSharePercent', label: 'Home Insurance', color: '#38BDF8' },
  {
    key: 'mortgageInsuranceSharePercent',
    label: 'Mortgage Insurance',
    color: '#A855F7',
  },
  { key: 'condoHoaSharePercent', label: 'Condo/HOA Fee', color: '#F59E0B' },
];

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

function formatPct(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function CanadianMortgageChart({ result }: { result: CanadianMortgageResult }) {
  const cx = 90;
  const cy = 90;
  const outerR = 70;
  const innerR = 38;
  let angle = 0;
  const paths: { d: string; color: string; label: string; pct: number }[] = [];
  const visible = SLICES.filter((slice) => result[slice.key] > 0.05);

  for (const slice of visible) {
    const pct = Math.max(0, result[slice.key]);
    const sweep = (pct / 100) * 360;
    const next = Math.min(360, angle + sweep);
    const d = donutSlice(cx, cy, outerR, innerR, angle, next);
    if (d) {
      paths.push({ d, color: slice.color, label: slice.label, pct });
    }
    angle = next;
  }

  return (
    <div className="mt-4 rounded-xl border border-border bg-white p-3.5 sm:p-4">
      <p className="text-[13px] font-semibold text-accent">Monthly cost breakdown</p>
      <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <svg
          viewBox="0 0 180 180"
          className="h-40 w-40 shrink-0"
          role="img"
          aria-label="Monthly mortgage cost doughnut chart"
        >
          {paths.length === 0 ? (
            <>
              <circle cx={cx} cy={cy} r={outerR} fill="#E2E8F0" />
              <circle cx={cx} cy={cy} r={innerR} fill="#FFFFFF" />
            </>
          ) : paths.length === 1 && paths[0].pct >= 99.5 ? (
            <>
              <circle cx={cx} cy={cy} r={outerR} fill={paths[0].color} />
              <circle cx={cx} cy={cy} r={innerR} fill="#FFFFFF" />
            </>
          ) : (
            paths.map((path) => <path key={path.label} d={path.d} fill={path.color} />)
          )}
        </svg>
        <ul className="space-y-1.5 text-xs text-accent sm:text-sm">
          {visible.map((slice) => (
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
