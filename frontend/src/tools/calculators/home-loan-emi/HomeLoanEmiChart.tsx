import type { HomeLoanEmiResult } from './types';

/** Pie/donut: principal (blue) vs total interest due (red), matching reference legend. */
export function HomeLoanEmiChart({ result }: { result: HomeLoanEmiResult }) {
  const principal = Math.max(0, result.principal);
  const interest = Math.max(0, result.totalInterestInPrincipalCurrency);
  const total = principal + interest;
  const hasData = total > 0;
  const interestAngle = hasData ? (interest / total) * 360 : 0;
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

  const principalPath = principal <= 0 ? '' : donutSlice(interestAngle, 360);
  const interestPath = interest <= 0 ? '' : donutSlice(0, interestAngle);

  return (
    <div className="mt-3 space-y-3">
      <div className="flex flex-wrap items-center gap-4">
        <svg
          viewBox="0 0 180 180"
          className="h-40 w-40"
          role="img"
          aria-label={
            hasData
              ? `Principal ${principalPct}% versus total interest ${interestPct}% of total payment`
              : 'No data to display'
          }
        >
          {!hasData ? (
            <circle cx={cx} cy={cy} r={outerR} className="fill-slate-200" />
          ) : (
            <>
              {principalPath ? <path d={principalPath} fill="#3B82F6" /> : null}
              {interestPath ? <path d={interestPath} fill="#EF4444" /> : null}
              {interest <= 0 && principal > 0 ? (
                <>
                  <circle cx={cx} cy={cy} r={outerR} fill="#3B82F6" />
                  <circle cx={cx} cy={cy} r={innerR} className="fill-white" />
                </>
              ) : null}
              {principal > 0 && interest > 0 ? (
                <circle cx={cx} cy={cy} r={innerR} className="fill-white" />
              ) : null}
            </>
          )}
        </svg>
        <div className="space-y-2 text-sm text-accent">
          {!hasData ? (
            <p className="text-muted-foreground">no data to display</p>
          ) : (
            <>
              <p className="inline-flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: '#3B82F6' }}
                  aria-hidden
                />
                Principal loan amount ({principalPct}%)
              </p>
              <p className="inline-flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: '#EF4444' }}
                  aria-hidden
                />
                Total interest due ({interestPct}%)
              </p>
            </>
          )}
        </div>
      </div>
      <p className="text-xs font-medium text-muted-foreground">total payment</p>
    </div>
  );
}
