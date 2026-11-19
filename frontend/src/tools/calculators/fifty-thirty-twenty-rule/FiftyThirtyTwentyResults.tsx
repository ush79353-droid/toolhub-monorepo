'use client';

import { formatMoney } from './calculation';
import type { BudgetView, FiftyThirtyTwentyResult } from './types';

const SEGMENT_COLORS = ['bg-primary', 'bg-accent', 'bg-rose-500/80'] as const;
const FILL_COLORS = ['fill-primary/80', 'fill-accent/80', 'fill-rose-500/80'] as const;
const SWATCH_COLORS = ['bg-primary/80', 'bg-accent/80', 'bg-rose-500/80'] as const;

function DonutChart({ result }: { result: FiftyThirtyTwentyResult }) {
  const slices = result.categories.map((c) => ({
    key: c.key,
    label: c.label,
    percent: c.percentage,
    amount: c.monthlyAmount,
  }));
  const total = slices.reduce((sum, s) => sum + Math.max(s.amount, 0), 0) || 1;
  const r = 70;
  const cx = 90;
  const cy = 90;

  const polar = (angleDeg: number) => {
    const a = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  let angle = 0;
  const paths = slices.map((slice, index) => {
    const sweep = (Math.max(slice.amount, 0) / total) * 360;
    const start = polar(angle);
    const end = polar(angle + sweep);
    const large = sweep > 180 ? 1 : 0;
    const d =
      sweep <= 0.001
        ? ''
        : sweep >= 359.999
          ? ''
          : `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`;
    angle += sweep;
    return { ...slice, d, color: FILL_COLORS[index] ?? 'fill-primary/80', sweep };
  });

  const fullSlice = paths.find((p) => p.sweep >= 359.999);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <svg
        viewBox="0 0 180 180"
        className="h-40 w-40"
        role="img"
        aria-label={slices
          .map(
            (s) =>
              `${s.label} ${s.percent}% (${formatMoney(s.amount, result.currency)})`,
          )
          .join(', ')}
      >
        {fullSlice ? (
          <circle cx={cx} cy={cy} r={r} className={fullSlice.color} />
        ) : (
          paths.map((p) =>
            p.d ? <path key={p.key} d={p.d} className={p.color} /> : null,
          )
        )}
        <circle cx={cx} cy={cy} r={36} className="fill-white" />
      </svg>
      <ul className="space-y-2 text-sm">
        {slices.map((slice, index) => (
          <li key={slice.key} className="inline-flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-sm ${SWATCH_COLORS[index] ?? 'bg-primary/80'}`}
              aria-hidden
            />
            {slice.label} ({slice.percent}%):{' '}
            <span className="font-medium tabular-nums text-accent">
              {formatMoney(slice.amount, result.currency)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SegmentBar({ result }: { result: FiftyThirtyTwentyResult }) {
  const total =
    result.categories.reduce((sum, c) => sum + Math.max(c.monthlyAmount, 0), 0) || 1;
  return (
    <figure className="space-y-2">
      <div
        className="flex h-3 overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={result.categories
          .map((c) => `${c.label} ${c.percentage}%`)
          .join(', ')}
      >
        {result.categories.map((category, index) => (
          <div
            key={category.key}
            className={SEGMENT_COLORS[index] ?? 'bg-primary'}
            style={{ width: `${(category.monthlyAmount / total) * 100}%` }}
          />
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        {result.categories.map((category, index) => (
          <li key={category.key} className="inline-flex items-center gap-1">
            <span
              className={`inline-block h-2 w-2 rounded-full ${SEGMENT_COLORS[index] ?? 'bg-primary'}`}
              aria-hidden
            />
            {category.label} {category.percentage}%
          </li>
        ))}
      </ul>
    </figure>
  );
}

interface FiftyThirtyTwentyResultsProps {
  result: FiftyThirtyTwentyResult;
  budgetView: BudgetView;
  onBudgetViewChange: (view: BudgetView) => void;
}

export function FiftyThirtyTwentyResults({
  result,
  budgetView,
  onBudgetViewChange,
}: FiftyThirtyTwentyResultsProps) {
  const isAnnual = budgetView === 'annual';

  return (
    <div className="space-y-4">
      <section
        aria-labelledby="budget-results-heading"
        className="space-y-4 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id="budget-results-heading" className="text-sm font-semibold text-accent">
            Your monthly budget breakdown
          </h3>
          <div className="flex rounded-lg border border-border bg-white p-0.5">
            {(
              [
                { value: 'monthly', label: 'Monthly' },
                { value: 'annual', label: 'Annual' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`h-8 rounded-md px-3 text-xs font-medium ${
                  budgetView === tab.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-accent hover:bg-muted/60'
                }`}
                onClick={() => onBudgetViewChange(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[13px] font-medium text-accent">
            {isAnnual ? 'Annual after-tax income' : 'Monthly after-tax income'}
          </p>
          <p className="text-2xl font-semibold tabular-nums text-accent">
            {formatMoney(
              isAnnual ? result.annualIncome : result.monthlyIncome,
              result.currency,
            )}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
          <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            {result.categories.map((category) => (
              <div key={category.key}>
                <dt className="text-xs text-muted-foreground">
                  {category.label} ({category.percentage}%)
                </dt>
                <dd className="font-medium tabular-nums text-accent">
                  {formatMoney(
                    isAnnual ? category.annualAmount : category.monthlyAmount,
                    result.currency,
                  )}
                </dd>
              </div>
            ))}
            <div>
              <dt className="text-xs text-muted-foreground">Total allocated</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(
                  isAnnual ? result.totalAnnualAllocated : result.totalMonthlyAllocated,
                  result.currency,
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Remaining balance</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(
                  isAnnual
                    ? result.annualRemainingBalance
                    : result.monthlyRemainingBalance,
                  result.currency,
                )}
              </dd>
            </div>
          </dl>
          <DonutChart result={result} />
        </div>

        <SegmentBar result={result} />

        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full min-w-[320px] text-left text-sm">
            <caption className="sr-only">
              {isAnnual ? 'Annual' : 'Monthly'} 50/30/20 budget allocations
            </caption>
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Category</th>
                <th className="px-3 py-2 font-medium">Percentage</th>
                <th className="px-3 py-2 font-medium">
                  {isAnnual ? 'Annual amount' : 'Monthly amount'}
                </th>
              </tr>
            </thead>
            <tbody>
              {result.categories.map((category) => (
                <tr key={category.key} className="border-t border-border">
                  <td className="px-3 py-1.5">{category.label}</td>
                  <td className="px-3 py-1.5 tabular-nums">{category.percentage}%</td>
                  <td className="px-3 py-1.5 tabular-nums">
                    {formatMoney(
                      isAnnual ? category.annualAmount : category.monthlyAmount,
                      result.currency,
                    )}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-border bg-brand-softTeal/30 font-medium">
                <td className="px-3 py-1.5">Total</td>
                <td className="px-3 py-1.5 tabular-nums">100%</td>
                <td className="px-3 py-1.5 tabular-nums">
                  {formatMoney(
                    isAnnual ? result.totalAnnualAllocated : result.totalMonthlyAllocated,
                    result.currency,
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
