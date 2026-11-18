import type { MortgageAmortizationResult } from './types';

type Slice = {
  key: string;
  label: string;
  percent: number;
  fillClass: string;
  swatchClass: string;
};

/** Doughnut of monthly out-of-pocket components (screenshot legend). */
export function PaymentBreakdownChart({ result }: { result: MortgageAmortizationResult }) {
  const slices: Slice[] = [
    {
      key: 'mortgage',
      label: 'Mortgage Payment',
      percent: result.mortgageSharePercent,
      fillClass: 'fill-sky-600/85',
      swatchClass: 'bg-sky-600/85',
    },
    {
      key: 'tax',
      label: 'Property Taxes',
      percent: result.taxSharePercent,
      fillClass: 'fill-emerald-600/85',
      swatchClass: 'bg-emerald-600/85',
    },
    {
      key: 'insurance',
      label: 'Home Insurance',
      percent: result.insuranceSharePercent,
      fillClass: 'fill-teal-600/85',
      swatchClass: 'bg-teal-600/85',
    },
    {
      key: 'pmi',
      label: 'PMI Insurance',
      percent: result.pmiSharePercent,
      fillClass: 'fill-amber-500/85',
      swatchClass: 'bg-amber-500/85',
    },
    {
      key: 'hoa',
      label: 'HOA Fee',
      percent: result.hoaSharePercent,
      fillClass: 'fill-violet-500/85',
      swatchClass: 'bg-violet-500/85',
    },
    {
      key: 'other',
      label: 'Other Cost',
      percent: result.otherSharePercent,
      fillClass: 'fill-rose-500/85',
      swatchClass: 'bg-rose-500/85',
    },
  ].filter((s) => s.percent > 0.05);

  const outerR = 70;
  const innerR = 38;
  const cx = 90;
  const cy = 90;

  const polar = (angleDeg: number, radius: number) => {
    const a = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
  };

  const donutSlice = (startAngle: number, endAngle: number) => {
    const sweep = endAngle - startAngle;
    if (!(sweep > 0)) return '';
    const large = sweep > 180 ? 1 : 0;
    const o0 = polar(startAngle, outerR);
    const o1 = polar(endAngle, outerR);
    const i1 = polar(endAngle, innerR);
    const i0 = polar(startAngle, innerR);
    return [
      `M ${o0.x} ${o0.y}`,
      `A ${outerR} ${outerR} 0 ${large} 1 ${o1.x} ${o1.y}`,
      `L ${i1.x} ${i1.y}`,
      `A ${innerR} ${innerR} 0 ${large} 0 ${i0.x} ${i0.y}`,
      'Z',
    ].join(' ');
  };

  let angle = 0;
  const paths = slices.map((slice) => {
    const sweep = (slice.percent / 100) * 360;
    const start = angle;
    const end = angle + sweep;
    angle = end;
    return { ...slice, d: donutSlice(start, end), rounded: Math.round(slice.percent) };
  });

  return (
    <div className="flex flex-wrap items-center gap-4">
      <svg
        viewBox="0 0 180 180"
        className="h-40 w-40"
        role="img"
        aria-label="Monthly payment breakdown"
      >
        {paths.length === 0 ? (
          <circle cx={cx} cy={cy} r={outerR} className="fill-muted" />
        ) : (
          paths.map((p) => <path key={p.key} d={p.d} className={p.fillClass} />)
        )}
        <circle cx={cx} cy={cy} r={innerR} className="fill-white" />
      </svg>
      <div className="space-y-2 text-sm text-accent">
        {paths.map((p) => (
          <p key={p.key} className="inline-flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-sm ${p.swatchClass}`} />
            {p.label} ({p.rounded}%)
          </p>
        ))}
      </div>
    </div>
  );
}
