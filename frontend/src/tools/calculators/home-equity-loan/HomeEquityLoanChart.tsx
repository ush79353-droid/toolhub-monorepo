import type { HomeEquityLoanResult } from './types';

/** Doughnut chart: loan principal vs total interest (compound-interest pie pattern with hole). */
export function HomeEquityLoanChart({ result }: { result: HomeEquityLoanResult }) {
  const principal = Math.max(0, result.principal);
  const interest = Math.max(0, result.totalInterest);
  const total = principal + interest || 1;
  const interestAngle = (interest / total) * 360;
  const principalPct = Math.round(result.principalSharePercent);
  const interestPct = Math.round(result.interestSharePercent);

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

  const principalPath =
    principal <= 0 ? '' : donutSlice(interestAngle, 360);
  const interestPath = interest <= 0 ? '' : donutSlice(0, interestAngle);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <svg
        viewBox="0 0 180 180"
        className="h-40 w-40"
        role="img"
        aria-label={`Loan amount ${principalPct}% versus interest ${interestPct}%`}
      >
        {principalPath ? <path d={principalPath} className="fill-sky-600/85" /> : null}
        {interestPath ? <path d={interestPath} className="fill-emerald-600/85" /> : null}
        {interest <= 0 && principal > 0 ? (
          <>
            <circle cx={cx} cy={cy} r={outerR} className="fill-sky-600/85" />
            <circle cx={cx} cy={cy} r={innerR} className="fill-white" />
          </>
        ) : null}
      </svg>
      <div className="space-y-2 text-sm text-accent">
        <p className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-sky-600/85" />
          Loan amount ({principalPct}%)
        </p>
        <p className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-600/85" />
          Interest ({interestPct}%)
        </p>
      </div>
    </div>
  );
}
