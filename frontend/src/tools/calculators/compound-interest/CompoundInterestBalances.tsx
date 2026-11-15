'use client';

import { formatCurrencyValue, getCurrencySymbol } from '@/tools/shared/currency';
import type { BalanceView, CompoundInterestDraft, CompoundInterestResult } from './types';

interface CompoundInterestBalancesProps {
  draft: CompoundInterestDraft;
  result: CompoundInterestResult;
  onViewChange: (view: BalanceView) => void;
}

const VIEWS: readonly { value: BalanceView; label: string }[] = [
  { value: 'bar', label: 'Bar graph' },
  { value: 'pie', label: 'Pie chart' },
  { value: 'table', label: 'Table' },
  { value: 'charts-table', label: 'Cash graph details' },
];

function BarGraph({ result }: { result: CompoundInterestResult }) {
  const max = Math.max(
    ...result.yearlyRows.map((r) => r.selectedCompBalance),
    1
  );
  const w = 560;
  const h = 220;
  const pad = { t: 16, r: 12, b: 36, l: 44 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const n = result.yearlyRows.length;
  const gap = 2;
  const barW = Math.max(2, (innerW - gap * (n - 1)) / n);

  return (
    <div className="space-y-2">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label="Yearly balances bar graph">
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = pad.t + innerH * (1 - t);
          const label = Math.round(max * t);
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
              <text x={pad.l - 6} y={y + 3} textAnchor="end" className="fill-muted-foreground text-[10px]">
                {label}
              </text>
            </g>
          );
        })}
        {result.yearlyRows.map((row, i) => {
          const x = pad.l + i * (barW + gap);
          const yearlyH = (row.yearlyCompBalance / max) * innerH;
          const addH = (row.additionalInterest / max) * innerH;
          const yBase = pad.t + innerH - yearlyH;
          const yAdd = yBase - addH;
          return (
            <g key={row.year}>
              <rect
                x={x}
                y={yBase}
                width={barW}
                height={Math.max(0, yearlyH)}
                className="fill-primary/80"
              />
              <rect
                x={x}
                y={yAdd}
                width={barW}
                height={Math.max(0, addH)}
                className="fill-rose-500/80"
              />
              {(n <= 12 || row.year % Math.ceil(n / 10) === 0 || row.year === n) && (
                <text
                  x={x + barW / 2}
                  y={h - 12}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[9px]"
                >
                  {row.year}
                </text>
              )}
            </g>
          );
        })}
        <text x={w / 2} y={h - 2} textAnchor="middle" className="fill-muted-foreground text-[10px]">
          Year
        </text>
      </svg>
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary/80" /> Interest with yearly comp.
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-rose-500/80" /> Add. interest with selected
          comp.
        </span>
      </div>
      <p className="text-xs text-muted-foreground">Yearly balances</p>
    </div>
  );
}

function PieChart({
  result,
  currency,
}: {
  result: CompoundInterestResult;
  currency: CompoundInterestDraft['currency'];
}) {
  const principal = Math.max(0, result.totalPrincipalContributed);
  const interest = Math.max(0, result.totalCompoundInterest);
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
      <svg viewBox="0 0 180 180" className="h-40 w-40" role="img" aria-label="Principal vs interest">
        {principalPath ? <path d={principalPath} className="fill-primary/80" /> : null}
        {interestPath ? <path d={interestPath} className="fill-rose-500/80" /> : null}
        {interest <= 0 && principal > 0 ? (
          <circle cx={cx} cy={cy} r={r} className="fill-primary/80" />
        ) : null}
      </svg>
      <div className="space-y-2 text-sm">
        <p className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary/80" />
          Principal contributed:{' '}
          <span className="font-medium tabular-nums text-accent">
            {formatCurrencyValue(principal, currency)}
          </span>
        </p>
        <p className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-rose-500/80" />
          Compound interest:{' '}
          <span className="font-medium tabular-nums text-accent">
            {formatCurrencyValue(interest, currency)}
          </span>
        </p>
      </div>
    </div>
  );
}

function BalanceTable({
  result,
  currency,
}: {
  result: CompoundInterestResult;
  currency: CompoundInterestDraft['currency'];
}) {
  return (
    <div className="max-h-72 overflow-auto rounded-lg border border-border">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead className="sticky top-0 bg-muted/80 text-xs text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">Year</th>
            <th className="px-3 py-2 font-medium">Yearly compounding</th>
            <th className="px-3 py-2 font-medium">Selected compounding</th>
            <th className="px-3 py-2 font-medium">Additional interest</th>
          </tr>
        </thead>
        <tbody>
          {result.yearlyRows.map((row) => (
            <tr key={row.year} className="border-t border-border">
              <td className="px-3 py-1.5 tabular-nums">{row.year}</td>
              <td className="px-3 py-1.5 tabular-nums">
                {formatCurrencyValue(row.yearlyCompBalance, currency)}
              </td>
              <td className="px-3 py-1.5 tabular-nums">
                {formatCurrencyValue(row.selectedCompBalance, currency)}
              </td>
              <td className="px-3 py-1.5 tabular-nums">
                {formatCurrencyValue(row.additionalInterest, currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CompoundInterestBalances({
  draft,
  result,
  onViewChange,
}: CompoundInterestBalancesProps) {
  const symbol = getCurrencySymbol(draft.currency);

  return (
    <section className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
      <h3 className="text-sm font-semibold text-accent">Balances</h3>
      <fieldset>
        <legend className="mb-2 text-[13px] font-medium text-accent">Represent</legend>
        <div className="flex flex-wrap gap-3">
          {VIEWS.map((view) => (
            <label key={view.value} className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="ci-balance-view"
                className="h-4 w-4 border-border"
                checked={draft.balanceView === view.value}
                onChange={() => onViewChange(view.value)}
              />
              {view.label}
            </label>
          ))}
        </div>
      </fieldset>

      {draft.balanceView === 'bar' ? <BarGraph result={result} /> : null}
      {draft.balanceView === 'pie' ? (
        <PieChart result={result} currency={draft.currency} />
      ) : null}
      {draft.balanceView === 'table' ? (
        <BalanceTable result={result} currency={draft.currency} />
      ) : null}
      {draft.balanceView === 'charts-table' ? (
        <div className="space-y-4">
          <BarGraph result={result} />
          <BalanceTable result={result} currency={draft.currency} />
          <p className="text-xs text-muted-foreground">
            Cash growth from {symbol}
            {result.formattedPrincipal.replace(/[^\d.,-]/g, '') || '0'} contributed to{' '}
            {result.formattedFinalBalance}.
          </p>
        </div>
      ) : null}
    </section>
  );
}
