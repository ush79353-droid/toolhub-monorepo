import type { InterestResult } from './types';

type Slice = {
  key: string;
  label: string;
  percent: number;
  fillClass: string;
  swatchClass: string;
};

export function InterestBreakdownChart({ result }: { result: InterestResult }) {
  const slices: Slice[] = [
    {
      key: 'initial',
      label: 'Initial investment',
      percent: result.initialSharePercent,
      fillClass: 'fill-sky-600/85',
      swatchClass: 'bg-sky-600/85',
    },
    {
      key: 'contrib',
      label: 'Contributions',
      percent: result.contributionsSharePercent,
      fillClass: 'fill-emerald-600/85',
      swatchClass: 'bg-emerald-600/85',
    },
    {
      key: 'interest',
      label: 'Interest',
      percent: result.interestSharePercent,
      fillClass: 'fill-rose-700/85',
      swatchClass: 'bg-rose-700/85',
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
        aria-label="Ending balance breakdown"
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
