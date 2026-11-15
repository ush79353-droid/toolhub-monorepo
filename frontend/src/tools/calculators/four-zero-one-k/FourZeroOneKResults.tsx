'use client';

import { Button } from '@/components/ui/button';
import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import type { FourZeroOneKResult } from './types';

interface FourZeroOneKResultsProps {
  result: FourZeroOneKResult | null;
  currency: SupportedCurrency;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

function formatPercent(decimal: number): string {
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(decimal * 100)}%`;
}

export function FourZeroOneKResults({
  result,
  currency,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: FourZeroOneKResultsProps) {
  if (!result) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-5 text-center">
        <p className="text-sm font-medium text-accent">
          {invalid ? 'Review highlighted inputs' : 'Enter ages and amounts to project'}
        </p>
        <p className="mt-1 max-w-md text-xs font-normal leading-relaxed text-muted-foreground">
          {invalid
            ? 'Correct the messages above. Results stay blank until every number is usable.'
            : 'The projection uses your salary, deferrals, employer deposits, return, and fees. It is not a guaranteed balance.'}
        </p>
      </div>
    );
  }

  const money = (value: number) => formatCurrencyValue(value, currency);
  const progress =
    result.fundingProgress === null
      ? null
      : `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(result.fundingProgress * 100)}%`;

  return (
    <div className="space-y-3.5" aria-live="polite">
      {result.impossible ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-700" role="status">
          That target is out of reach under these limits and the highest employee contribution this mode allows. The balance below is that ceiling, not a solution.
        </p>
      ) : null}

      <div className="rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div>
            <p className="text-xs font-medium text-primary">Projected 401(k) balance at retirement</p>
            <p className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-accent tabular-nums sm:text-[32px]">
              {money(result.finalBalance)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onCopy} className="h-8 bg-white px-2.5 text-xs font-medium">
              {copied ? 'Copied' : 'Copy results'}
            </Button>
            {canShare ? (
              <Button type="button" variant="outline" size="sm" onClick={onShare} className="h-8 bg-white px-2.5 text-xs font-medium">
                {shared ? 'Shared' : 'Share'}
              </Button>
            ) : null}
          </div>
        </div>
        <p className="mt-2 text-xs font-normal leading-relaxed text-muted-foreground">
          Inflation-adjusted balance, in today&apos;s purchasing power: {money(result.inflationAdjustedBalance)}. {result.years}{' '}
          {result.years === 1 ? 'year' : 'years'} until retirement.{' '}
          {result.accountType === 'roth' ? 'Roth' : 'Traditional'} is a label only. The same deposited dollars grow the same way.
        </p>
        {result.solvedEmployeePercent !== null ? (
          <p className="mt-2 text-sm font-medium text-accent">
            Employee contribution needed: {formatPercent(result.solvedEmployeePercent)} of salary
            {result.impossible ? ' (still short of the target)' : ''}
          </p>
        ) : null}
        {result.solvedEmployeeFixedAnnual !== null ? (
          <p className="mt-2 text-sm font-medium text-accent">
            Employee contribution needed: {money(result.solvedEmployeeFixedAnnual)} per year to start
            {result.impossible ? ' (still short of the target)' : ''}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
        <Stat label="Employee contributions" value={money(result.employeeContributions)} />
        <Stat label="Employer contributions" value={money(result.employerContributions)} />
        <Stat label="Vested employer contributions" value={money(result.vestedEmployerContributions)} />
        <Stat label="Investment growth" value={money(result.investmentGrowth)} />
        <Stat label="Investment fees" value={money(result.fees)} />
        <Stat label="Total contributions" value={money(result.totalContributions)} />
        <Stat label="Employee per period" value={money(result.employeePerPeriod)} />
        <Stat label="Employer per period" value={money(result.employerPerPeriod)} />
        <Stat label="Years until retirement" value={String(result.years)} />
        <Stat label="Funding progress" value={progress ?? 'No target entered'} />
      </div>

      {result.estimatedAnnualWithdrawal !== null && result.estimatedMonthlyWithdrawal !== null ? (
        <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
          At the withdrawal rate you entered, {money(result.estimatedAnnualWithdrawal)} a year is{' '}
          {money(result.estimatedMonthlyWithdrawal)} a month of the projected nominal balance. A fixed percentage is a planning
          assumption, not a guaranteed sustainable income, and this page does not calculate income tax or early-withdrawal penalties.
        </p>
      ) : null}

      {result.limitsReducedAContribution ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          At least one year was cut back by the limit you entered. The match is calculated on the deferral after that cap.
        </p>
      ) : null}

      <BalanceChart result={result} />

      <div className="max-h-96 overflow-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-left text-xs">
          <caption className="sr-only">Yearly 401(k) projection</caption>
          <thead className="sticky top-0 bg-muted/80 text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Year</th>
              <th className="px-3 py-2 font-medium">Age</th>
              <th className="px-3 py-2 font-medium">Salary</th>
              <th className="px-3 py-2 font-medium">Employee</th>
              <th className="px-3 py-2 font-medium">Employer</th>
              <th className="px-3 py-2 font-medium">Growth</th>
              <th className="px-3 py-2 font-medium">Fees</th>
              <th className="px-3 py-2 font-medium">Balance</th>
            </tr>
          </thead>
          <tbody>
            {result.yearly.map((row) => (
              <tr key={row.year} className="border-t border-border tabular-nums text-accent">
                <td className="px-3 py-2">{row.year}</td>
                <td className="px-3 py-2">{row.age}</td>
                <td className="px-3 py-2">{money(row.salary)}</td>
                <td className="px-3 py-2">{money(row.employeeContribution)}</td>
                <td className="px-3 py-2">{money(row.employerContribution)}</td>
                <td className="px-3 py-2">{money(row.investmentGrowth)}</td>
                <td className="px-3 py-2">{money(row.fees)}</td>
                <td className="px-3 py-2">{money(row.endBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums text-accent">{value}</p>
    </div>
  );
}

function BalanceChart({ result }: { result: FourZeroOneKResult }) {
  const width = 320;
  const height = 112;
  const pad = 8;
  let employee = 0;
  let employer = 0;
  let growth = 0;
  const series = result.yearly.map((row) => {
    employee += row.employeeContribution;
    employer += row.vestedEmployerContribution;
    growth += row.investmentGrowth - row.fees;
    return { employee, employer, growth, balance: row.endBalance };
  });
  const peak = Math.max(1, ...series.map((row) => Math.max(row.balance, row.employee, row.employer, Math.abs(row.growth))));
  const xAt = (index: number) =>
    series.length === 1 ? width / 2 : pad + (index / (series.length - 1)) * (width - pad * 2);
  const yAt = (value: number) => height - pad - (Math.max(0, value) / peak) * (height - pad * 2);
  const path = (pick: (row: (typeof series)[number]) => number) =>
    series.map((row, index) => `${index === 0 ? 'M' : 'L'} ${xAt(index).toFixed(1)} ${yAt(pick(row)).toFixed(1)}`).join(' ');

  return (
    <figure>
      <figcaption className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        <span className="text-primary">Balance</span>
        <span>Employee deposits</span>
        <span>Vested employer deposits</span>
        <span>Growth after fees</span>
      </figcaption>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-2 h-28 w-full" role="img" aria-label="Chart of 401(k) balance, contributions, and growth by year">
        <path d={path((row) => row.employee)} fill="none" stroke="currentColor" className="text-muted-foreground" strokeWidth="1.5" />
        <path d={path((row) => row.employer)} fill="none" stroke="currentColor" className="text-accent" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d={path((row) => row.growth)} fill="none" stroke="currentColor" className="text-primary/50" strokeWidth="1.5" />
        <path d={path((row) => row.balance)} fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" />
      </svg>
    </figure>
  );
}
