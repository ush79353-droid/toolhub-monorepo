'use client';

import { Button } from '@/components/ui/button';
import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import type { FourZeroThreeBResult } from './types';

interface FourZeroThreeBResultsProps {
  result: FourZeroThreeBResult | null;
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

export function FourZeroThreeBResults({
  result,
  currency,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: FourZeroThreeBResultsProps) {
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
  const convention =
    result.rateConvention === 'nominal'
      ? 'Nominal compounding: each period earns the annual rate divided by the number of periods.'
      : 'Effective annual compounding: the period rate is the rate that compounds to the annual return.';

  return (
    <div className="space-y-3.5" aria-live="polite">
      {result.impossible ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-700" role="status">
          The target is out of reach under these limits and the highest contribution this mode allows. The balance below is that ceiling.
        </p>
      ) : null}

      <div className="rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div>
            <p className="text-xs font-medium text-primary">Projected nominal balance at retirement</p>
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
          {result.years === 1 ? 'year' : 'years'} from now. {result.accountType === 'roth' ? 'Roth' : 'Traditional'} is a label only — taxes are not subtracted.
        </p>
        <SolvedLine result={result} money={money} />
      </div>

      <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
        <Stat label="Employee contributions" value={money(result.employeeContributions)} />
        <Stat label="Employer contributions" value={money(result.employerContributions)} />
        <Stat label="Vested employer contributions" value={money(result.vestedEmployerContributions)} />
        <Stat label="Investment growth" value={money(result.investmentGrowth)} />
        <Stat label="Fees" value={money(result.fees)} />
        <Stat label="First-year employee deferral" value={`${money(result.firstYearEmployeeContribution)} (${formatPercent(result.firstYearEmployeePercent)} of salary)`} />
        <Stat label="First-year employer deposit" value={money(result.firstYearEmployerContribution)} />
        <Stat label="Years until retirement" value={String(result.years)} />
      </div>

      <BalanceChart result={result} />

      <div className="max-h-96 overflow-auto rounded-xl border border-border">
        <table className="w-full min-w-[760px] text-left text-sm">
          <caption className="sr-only">Yearly nominal 403(b) projection and inflation-adjusted balance</caption>
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th scope="col" className="px-3 py-2 font-medium">Year</th>
              <th scope="col" className="px-3 py-2 font-medium">Age</th>
              <th scope="col" className="px-3 py-2 font-medium">Salary</th>
              <th scope="col" className="px-3 py-2 font-medium">Employee</th>
              <th scope="col" className="px-3 py-2 font-medium">Employer</th>
              <th scope="col" className="px-3 py-2 font-medium">Growth</th>
              <th scope="col" className="px-3 py-2 font-medium">Fees</th>
              <th scope="col" className="px-3 py-2 font-medium">Nominal balance</th>
              <th scope="col" className="px-3 py-2 font-medium">Inflation-adjusted</th>
            </tr>
          </thead>
          <tbody>
            {result.yearly.map((row) => (
              <tr key={row.year} className="border-t border-border">
                <td className="px-3 py-2 tabular-nums text-accent">{row.year}</td>
                <td className="px-3 py-2 tabular-nums text-accent">{row.age}</td>
                <td className="px-3 py-2 tabular-nums text-accent">{money(row.salary)}</td>
                <td className="px-3 py-2 tabular-nums text-accent">{money(row.employeeContribution)}</td>
                <td className="px-3 py-2 tabular-nums text-accent">{money(row.employerContribution)}</td>
                <td className="px-3 py-2 tabular-nums text-accent">{money(row.investmentGrowth)}</td>
                <td className="px-3 py-2 tabular-nums text-accent">{money(row.fees)}</td>
                <td className="px-3 py-2 tabular-nums text-accent">{money(row.endBalance)}</td>
                <td className="px-3 py-2 tabular-nums text-accent">{money(row.inflationAdjustedBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs font-normal leading-relaxed text-muted-foreground">
        {convention} Fees are taken from the same invested balance, separately from growth, so the breakdown adds up to the nominal balance. {result.limitsReducedAContribution ? 'A limit you entered reduced at least one contribution. ' : ''}
        These figures are projections from the assumptions on this page, not a guaranteed return.
      </p>
    </div>
  );
}

function SolvedLine({
  result,
  money,
}: {
  result: FourZeroThreeBResult;
  money: (value: number) => string;
}) {
  if (result.solvedEmployeePercent !== null) {
    return (
      <p className="mt-2 text-sm font-medium text-accent">
        Employee deferral needed: {formatPercent(result.solvedEmployeePercent)} of salary
        {result.impossible ? ' at the highest allowed percent' : ''}.
      </p>
    );
  }
  if (result.solvedEmployeeFixedAnnual !== null) {
    return (
      <p className="mt-2 text-sm font-medium text-accent">
        Employee deferral needed: {money(result.solvedEmployeeFixedAnnual)} per year at the start
        {result.impossible ? ', the highest amount searched' : ''}.
      </p>
    );
  }
  if (result.solvedSalary !== null) {
    return (
      <p className="mt-2 text-sm font-medium text-accent">
        Starting salary needed: {money(result.solvedSalary)}
        {result.impossible ? ', the highest salary searched' : ''}.
      </p>
    );
  }
  if (result.solvedEmployerRate !== null) {
    return (
      <p className="mt-2 text-sm font-medium text-accent">
        Employer rate needed: {formatPercent(result.solvedEmployerRate)}
        {result.impossible ? ' at the highest allowed rate' : ''}.
      </p>
    );
  }
  return null;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums text-accent">{value}</p>
    </div>
  );
}

function BalanceChart({ result }: { result: FourZeroThreeBResult }) {
  const values = [result.startingBalance, ...result.yearly.map((row) => row.endBalance)];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const width = 320;
  const height = 112;
  const points = values
    .map((value, index) => {
      const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
      const y = height - 8 - ((value - min) / span) * (height - 16);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  return (
    <figure className="rounded-xl border border-border bg-white px-3 py-3">
      <figcaption className="text-xs font-medium text-accent">Nominal balance by year</figcaption>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-2 h-28 w-full text-primary" role="img" aria-label="Line chart of the nominal 403(b) balance by year">
        <polyline fill="none" stroke="currentColor" strokeWidth="2" points={points} />
      </svg>
      <p className="text-xs text-muted-foreground">
        Nominal dollars only. The table lists the inflation-adjusted balance for each year.
      </p>
    </figure>
  );
}
