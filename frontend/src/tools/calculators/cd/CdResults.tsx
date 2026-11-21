'use client';

import { formatCurrencyValue } from '@/tools/shared/currency';
import type { CdInput, CdResult, CdScheduleEntry, CdScheduleView } from './types';
import { formatPercent } from './calculation';

interface CdResultsProps {
  input: CdInput;
  result: CdResult;
  onScheduleViewChange: (view: CdScheduleView) => void;
}

function DonutChart({ result }: { result: CdResult }) {
  const principal = Math.max(0, result.initialDeposit);
  const interest = Math.max(0, result.grossInterest);
  const total = principal + interest || 1;
  const interestAngle = (interest / total) * 360;
  const r = 70;
  const cx = 90;
  const cy = 90;

  const polar = (angleDeg: number) => {
    const a = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  const start = polar(0);
  const mid = polar(interestAngle);
  const large = interestAngle > 180 ? 1 : 0;
  const interestPath =
    interest <= 0
      ? ''
      : `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${mid.x} ${mid.y} Z`;
  const principalPath =
    principal <= 0
      ? ''
      : `M ${cx} ${cy} L ${mid.x} ${mid.y} A ${r} ${r} 0 ${interestAngle > 180 ? 0 : 1} 1 ${start.x} ${start.y} Z`;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <svg
        viewBox="0 0 180 180"
        className="h-40 w-40"
        role="img"
        aria-label={`Initial deposit ${formatPercent(result.principalSharePercent)} percent, interest ${formatPercent(result.interestSharePercent)} percent of end balance`}
      >
        {principalPath ? <path d={principalPath} className="fill-primary/80" /> : null}
        {interestPath ? <path d={interestPath} className="fill-rose-500/80" /> : null}
        {interest <= 0 && principal > 0 ? (
          <circle cx={cx} cy={cy} r={r} className="fill-primary/80" />
        ) : null}
        <circle cx={cx} cy={cy} r={36} className="fill-white" />
      </svg>
      <div className="space-y-2 text-sm">
        <p className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary/80" aria-hidden />
          Initial deposit:{' '}
          <span className="font-medium tabular-nums text-accent">
            {formatCurrencyValue(principal, result.currency)}
          </span>
          <span className="text-xs text-muted-foreground">
            ({formatPercent(result.principalSharePercent)}%)
          </span>
        </p>
        <p className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-rose-500/80" aria-hidden />
          Interest earned:{' '}
          <span className="font-medium tabular-nums text-accent">
            {formatCurrencyValue(interest, result.currency)}
          </span>
          <span className="text-xs text-muted-foreground">
            ({formatPercent(result.interestSharePercent)}%)
          </span>
        </p>
      </div>
    </div>
  );
}

function AccumulationBarChart({
  rows,
  view,
}: {
  rows: CdScheduleEntry[];
  view: CdScheduleView;
}) {
  const max = Math.max(...rows.map((r) => r.endingBalance), 1);
  const w = 560;
  const h = 220;
  const pad = { t: 16, r: 12, b: 36, l: 44 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const n = rows.length;
  const gap = n > 48 ? 1 : 2;
  const barW = Math.max(1.5, (innerW - gap * Math.max(n - 1, 0)) / Math.max(n, 1));
  const labelEvery = Math.max(1, Math.ceil(n / 10));

  return (
    <div className="space-y-2">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full"
        role="img"
        aria-label={`${view === 'annual' ? 'Annual' : 'Monthly'} accumulation of principal and interest`}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = pad.t + innerH * (1 - t);
          return (
            <g key={t}>
              <line
                x1={pad.l}
                x2={w - pad.r}
                y1={y}
                y2={y}
                stroke="currentColor"
                className="text-border"
                strokeWidth={1}
              />
              <text
                x={pad.l - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-muted-foreground text-[10px]"
              >
                {Math.round(max * t)}
              </text>
            </g>
          );
        })}
        {rows.map((row, i) => {
          const x = pad.l + i * (barW + gap);
          const principalH = (row.principal / max) * innerH;
          const interestH = (Math.max(0, row.accumulatedInterest) / max) * innerH;
          const yInterest = pad.t + innerH - principalH - interestH;
          const yPrincipal = pad.t + innerH - principalH;
          return (
            <g key={row.period}>
              <rect
                x={x}
                y={yPrincipal}
                width={barW}
                height={Math.max(0, principalH)}
                className="fill-primary/80"
              >
                <title>
                  {row.label}: principal {row.principal}, interest {row.accumulatedInterest},
                  ending {row.endingBalance}
                </title>
              </rect>
              <rect
                x={x}
                y={yInterest}
                width={barW}
                height={Math.max(0, interestH)}
                className="fill-rose-500/80"
              />
              {(n <= 12 || row.period % labelEvery === 0 || row.period === n) && (
                <text
                  x={x + barW / 2}
                  y={h - 12}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[9px]"
                >
                  {row.period}
                </text>
              )}
            </g>
          );
        })}
        <text x={w / 2} y={h - 2} textAnchor="middle" className="fill-muted-foreground text-[10px]">
          {view === 'annual' ? 'Year' : 'Month'}
        </text>
      </svg>
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary/80" /> Initial deposit
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-rose-500/80" /> Accumulated interest
        </span>
      </div>
    </div>
  );
}

function ScheduleTable({
  rows,
  currency,
  view,
}: {
  rows: CdScheduleEntry[];
  currency: CdResult['currency'];
  view: CdScheduleView;
}) {
  return (
    <div className="max-h-80 overflow-auto rounded-lg border border-border">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead className="sticky top-0 bg-muted/80 text-xs text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">{view === 'annual' ? 'Year' : 'Month'}</th>
            <th className="px-3 py-2 font-medium">Deposit</th>
            <th className="px-3 py-2 font-medium">Interest</th>
            <th className="px-3 py-2 font-medium">Ending balance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const isLast = index === rows.length - 1;
            return (
              <tr
                key={row.period}
                className={`border-t border-border ${isLast ? 'bg-brand-softTeal/30 font-medium' : ''}`}
              >
                <td className="px-3 py-1.5 tabular-nums">{row.period}</td>
                <td className="px-3 py-1.5 tabular-nums">
                  {formatCurrencyValue(row.deposit, currency)}
                </td>
                <td className="px-3 py-1.5 tabular-nums">
                  {formatCurrencyValue(row.interest, currency)}
                </td>
                <td className="px-3 py-1.5 tabular-nums">
                  {formatCurrencyValue(row.endingBalance, currency)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function CdResults({ input, result, onScheduleViewChange }: CdResultsProps) {
  const rows =
    input.scheduleView === 'annual' ? result.annualSchedule : result.monthlySchedule;

  return (
    <div className="space-y-5">
      <section
        aria-labelledby="cd-results-heading"
        className="space-y-4 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
      >
        <h3 id="cd-results-heading" className="text-sm font-semibold text-accent">
          Results
        </h3>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="space-y-3">
            <div>
              <p className="text-[13px] font-medium text-accent">End balance</p>
              <p className="text-2xl font-semibold tabular-nums text-accent">
                {formatCurrencyValue(result.grossFinalBalance, result.currency)}
              </p>
            </div>
            <div>
              <p className="text-[13px] font-medium text-accent">Total interest</p>
              <p className="text-lg font-semibold tabular-nums text-accent">
                {formatCurrencyValue(result.grossInterest, result.currency)}
              </p>
            </div>
            <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Initial deposit</dt>
                <dd className="font-medium tabular-nums text-accent">
                  {formatCurrencyValue(result.initialDeposit, result.currency)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Effective APY</dt>
                <dd className="font-medium tabular-nums text-accent">
                  {formatPercent(result.effectiveApyPercent, 4)}%
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Estimated tax</dt>
                <dd className="font-medium tabular-nums text-accent">
                  {formatCurrencyValue(result.estimatedTax, result.currency)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Net interest</dt>
                <dd className="font-medium tabular-nums text-accent">
                  {formatCurrencyValue(result.netInterest, result.currency)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">After-tax balance</dt>
                <dd className="font-medium tabular-nums text-accent">
                  {formatCurrencyValue(result.afterTaxBalance, result.currency)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Deposit length</dt>
                <dd className="font-medium text-accent">{result.durationLabel}</dd>
              </div>
            </dl>
            <p className="text-xs text-muted-foreground">
              Tax estimate applies the marginal rate to gross interest at maturity only — not tax
              advice. Bank day-count and contractual compounding may differ from this mathematical
              model.
            </p>
          </div>
          <DonutChart result={result} />
        </div>
      </section>

      <section
        aria-labelledby="cd-schedule-heading"
        className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id="cd-schedule-heading" className="text-sm font-semibold text-accent">
            Accumulation schedule
          </h3>
          <div className="flex rounded-lg border border-border bg-white p-0.5">
            {(
              [
                { value: 'annual', label: 'Annual' },
                { value: 'monthly', label: 'Monthly' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`h-8 rounded-md px-3 text-xs font-medium ${
                  input.scheduleView === tab.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-accent hover:bg-muted/60'
                }`}
                onClick={() => onScheduleViewChange(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <AccumulationBarChart rows={rows} view={input.scheduleView} />
        <ScheduleTable rows={rows} currency={result.currency} view={input.scheduleView} />
      </section>
    </div>
  );
}
