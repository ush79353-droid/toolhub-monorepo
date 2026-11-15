'use client';

import { Button } from '@/components/ui/button';
import { formatCurrencyValue } from '@/tools/shared/currency';
import type { FiveTwentyNineResult, FiveTwentyNineYearRow } from './types';

interface FiveTwentyNineResultsProps {
  result: FiveTwentyNineResult | null;
  copied: boolean;
  onCopy: () => void;
}

function formatPercent(value: number): string {
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)}%`;
}

export function FiveTwentyNineResults({ result, copied, onCopy }: FiveTwentyNineResultsProps) {
  if (!result) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-5 text-center">
        <p className="text-sm font-medium text-accent">Review highlighted inputs</p>
        <p className="mt-1 text-xs font-normal leading-relaxed text-muted-foreground">
          Correct the messages above to refresh the projection.
        </p>
      </div>
    );
  }

  const money = (value: number) => formatCurrencyValue(value, result.currency);
  const gapLabel = result.fundingGap > 0 ? 'Funding gap' : result.surplusBalance > 0 ? 'Surplus left in the plan' : 'Gap or surplus';
  const gapValue = result.fundingGap > 0 ? result.fundingGap : result.surplusBalance;
  const required =
    result.requiredContributionImpossible || result.requiredMonthlyContribution === null
      ? 'Cannot reach the target with monthly deposits in this saving period'
      : money(result.requiredMonthlyContribution);
  const collegeRows = result.rows.filter((row) => row.phase === 'college');

  return (
    <div className="space-y-3.5" aria-live="polite">
      <div className="rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div>
            <p className="text-xs font-medium text-primary">Projected 529 balance at college start</p>
            <p className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-accent tabular-nums sm:text-[32px]">
              {money(result.balanceAtCollegeStart)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {result.percentFunded === null
                ? 'No education cost entered, so the funded share is not defined'
                : `${formatPercent(result.percentFunded)} of education expenses funded, including scholarships`}
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onCopy} className="h-8 bg-white px-2.5 text-xs font-medium">
            {copied ? 'Copied' : 'Copy results'}
          </Button>
        </div>
        <p className="mt-2 text-xs font-normal leading-relaxed text-muted-foreground">
          An estimate from the rates you entered, not a guaranteed investment outcome or tax result. The balance at
          college start is not the same as the total later withdrawn while the leftover balance keeps growing.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <Metric label="First-year college cost" value={money(result.firstYearCost)} />
        <Metric label="Total education cost" value={money(result.totalEducationCost)} />
        <Metric label="Total contributions" value={money(result.totalContributions)} />
        <Metric label="Estimated investment growth" value={money(result.investmentGrowth)} />
        <Metric label="Estimated investment fees" value={money(result.investmentFees)} />
        <Metric label="Covered by the 529" value={money(result.coveredByPlan)} />
        <Metric label={gapLabel} value={money(gapValue)} />
        <Metric label="Required monthly contribution" value={required} />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Withdrawals from the plan cover {money(result.coveredByPlan)} of the {money(result.netEducationCost)} left
        after {money(result.totalScholarships)} in scholarships. The funding gap is the unpaid remainder,{' '}
        {money(result.fundingGap)}. Any balance still in the account after college is the surplus,{' '}
        {money(result.surplusBalance)}.
      </p>

      {result.contributionExceedsAlert ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950">
          The first year of deposits is above the reminder you entered. That reminder is not an IRS contribution limit
          or a gift-tax rule.
        </p>
      ) : null}

      <CostChart rows={collegeRows} currency={result.currency} startBalance={result.balanceAtCollegeStart} covered={result.coveredByPlan} />
      <YearTable rows={result.rows} currency={result.currency} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold tabular-nums text-accent">{value}</p>
    </div>
  );
}

function CostChart({
  rows,
  currency,
  startBalance,
  covered,
}: {
  rows: readonly FiveTwentyNineYearRow[];
  currency: FiveTwentyNineResult['currency'];
  startBalance: number;
  covered: number;
}) {
  const money = (value: number) => formatCurrencyValue(value, currency);
  const max = Math.max(1, ...rows.map((row) => Math.max(row.educationCost, row.withdrawal)));
  return (
    <figure className="rounded-xl border border-border bg-white p-3.5">
      <figcaption className="text-[13px] font-semibold text-accent">Education cost and plan withdrawals</figcaption>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        Balance when college starts: {money(startBalance)}. Amount the plan pays across the college years:{' '}
        {money(covered)}. Those two figures differ because the leftover balance can still grow, and a later year can
        cost more than the opening balance.
      </p>
      <ul className="mt-3 space-y-3">
        {rows.map((row) => (
          <li key={`chart-${row.year}`}>
            <p className="text-xs font-medium text-accent">Projection year {row.year}</p>
            <Bar label="Education cost" value={row.educationCost} max={max} tone="cost" display={money(row.educationCost)} />
            <Bar label="Paid by the 529" value={row.withdrawal} max={max} tone="plan" display={money(row.withdrawal)} />
          </li>
        ))}
      </ul>
    </figure>
  );
}

function Bar({
  label,
  value,
  max,
  tone,
  display,
}: {
  label: string;
  value: number;
  max: number;
  tone: 'cost' | 'plan';
  display: string;
}) {
  const width = `${Math.max(0, Math.min(100, (value / max) * 100))}%`;
  return (
    <div className="mt-1.5">
      <div className="mb-0.5 flex justify-between gap-2 text-[11px] text-muted-foreground">
        <span>{label}</span>
        <span className="tabular-nums text-accent">{display}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${tone === 'cost' ? 'bg-accent' : 'bg-primary'}`}
          style={{ width }}
        />
      </div>
    </div>
  );
}

function YearTable({ rows, currency }: { rows: readonly FiveTwentyNineYearRow[]; currency: FiveTwentyNineResult['currency'] }) {
  const money = (value: number) => formatCurrencyValue(value, currency);
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="min-w-[720px] w-full text-left text-xs">
        <caption className="sr-only">Yearly 529 savings and college withdrawal projection</caption>
        <thead className="bg-muted/50 text-[11px] uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-2.5 py-2 font-medium">Year</th>
            <th className="px-2.5 py-2 font-medium">Phase</th>
            <th className="px-2.5 py-2 font-medium">Contributions</th>
            <th className="px-2.5 py-2 font-medium">Growth</th>
            <th className="px-2.5 py-2 font-medium">Fees</th>
            <th className="px-2.5 py-2 font-medium">Education cost</th>
            <th className="px-2.5 py-2 font-medium">Scholarship</th>
            <th className="px-2.5 py-2 font-medium">Withdrawal</th>
            <th className="px-2.5 py-2 font-medium">Ending balance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.phase}-${row.year}`} className="border-t border-border">
              <td className="px-2.5 py-2 tabular-nums text-accent">{row.year}</td>
              <td className="px-2.5 py-2 capitalize text-accent">{row.phase}</td>
              <td className="px-2.5 py-2 tabular-nums">{money(row.contributions)}</td>
              <td className="px-2.5 py-2 tabular-nums">{money(row.growth)}</td>
              <td className="px-2.5 py-2 tabular-nums">{money(row.fees)}</td>
              <td className="px-2.5 py-2 tabular-nums">{money(row.educationCost)}</td>
              <td className="px-2.5 py-2 tabular-nums">{money(row.scholarship)}</td>
              <td className="px-2.5 py-2 tabular-nums">{money(row.withdrawal)}</td>
              <td className="px-2.5 py-2 tabular-nums">{money(row.endingBalance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
