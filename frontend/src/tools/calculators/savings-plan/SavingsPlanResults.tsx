'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import { SavingsPlanChart } from './SavingsPlanChart';
import { formatSavingsPlanMoney } from './calculation';
import type { SavingsPlanResult } from './types';

interface SavingsPlanResultsProps {
  result: SavingsPlanResult | null;
  hasErrors: boolean;
}

export function SavingsPlanResults({ result, hasErrors }: SavingsPlanResultsProps) {
  if (hasErrors || !result) {
    return (
      <div className="rounded-xl border border-border bg-muted/10 p-4">
        <h3 className="text-sm font-semibold text-accent">Results</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter a valid savings plan to see your balance projection.
        </p>
      </div>
    );
  }

  const symbol = getCurrencySymbol(result.currency);
  const axisLabel =
    result.periodUnitPlural.charAt(0).toUpperCase() + result.periodUnitPlural.slice(1);

  return (
    <div className="space-y-4 rounded-xl border border-border bg-muted/10 p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-accent">Results</h3>

      {result.mode === 'deposit' ? (
        <p className="text-sm leading-relaxed text-foreground/90">
          Your final balance will be{' '}
          <strong className="font-semibold text-accent">
            {symbol}
            {result.formattedFinalBalance}.
          </strong>
        </p>
      ) : (
        <p className="text-sm leading-relaxed text-foreground/90">
          To reach{' '}
          <strong className="font-semibold text-accent">
            {symbol}
            {result.formattedFinalBalance}
          </strong>
          , start with{' '}
          <strong className="font-semibold text-accent">
            {symbol}
            {result.formattedStartingDeposit}
          </strong>{' '}
          each {result.periodUnitSingular}.
        </p>
      )}

      <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
        <p>
          Starting deposit:{' '}
          <span className="font-medium text-accent">
            {symbol}
            {result.formattedStartingDeposit} {result.currency}
          </span>
        </p>
        <p>
          Total deposited:{' '}
          <span className="font-medium text-accent">
            {symbol}
            {result.formattedTotalDeposited} {result.currency}
          </span>
        </p>
        <p>
          Periods:{' '}
          <span className="font-medium text-accent">
            {result.periods} {result.periodUnitPlural}
          </span>
        </p>
        <p>Principal only; no interest applied.</p>
      </div>

      <SavingsPlanChart balances={result.balances} periodAxisLabel={axisLabel} />

      <p className="text-xs italic text-muted-foreground">{result.balancesLabel}</p>

      <div className="max-h-56 overflow-auto rounded-lg border border-border">
        <table className="w-full min-w-[280px] border-collapse text-left text-xs">
          <thead className="sticky top-0 bg-muted/80 text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 font-medium">Deposit</th>
              <th className="px-3 py-2 font-medium">Balance</th>
            </tr>
          </thead>
          <tbody>
            {result.balances.map((row) => (
              <tr key={row.period} className="border-t border-border/70">
                <td className="px-3 py-1.5 tabular-nums text-accent">{row.period}</td>
                <td className="px-3 py-1.5 tabular-nums text-accent">
                  {symbol}
                  {formatSavingsPlanMoney(row.deposit, result.currency)}
                </td>
                <td className="px-3 py-1.5 tabular-nums text-accent">
                  {symbol}
                  {formatSavingsPlanMoney(row.balance, result.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
