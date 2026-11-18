'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
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
  const summary =
    result.mode === 'deposit'
      ? `Your final balance will be ${symbol}${result.formattedFinalBalance}.`
      : `To reach ${symbol}${result.formattedFinalBalance}, put aside ${symbol}${result.formattedStartingDeposit} each ${result.periodUnitSingular} (increasing by the amount shown).`;

  return (
    <div className="space-y-4 rounded-xl border border-border bg-muted/10 p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-accent">Results</h3>
      <p className="text-sm leading-relaxed text-foreground/90">
        {summary.split(symbol).map((part, index, parts) => {
          if (index === 0) return <span key={index}>{part}</span>;
          const match = part.match(/^([\d,.]+)/);
          if (!match) {
            return (
              <span key={index}>
                {symbol}
                {part}
              </span>
            );
          }
          const amount = match[1];
          const rest = part.slice(amount.length);
          return (
            <span key={index}>
              <strong className="font-semibold text-accent">
                {symbol}
                {amount}
              </strong>
              {rest}
              {index < parts.length - 1 ? null : null}
            </span>
          );
        })}
      </p>

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
        <p className="text-muted-foreground">Principal only — no interest applied.</p>
      </div>

      {/* Chart and period table are wired in the calculation/FX commit. */}
      <p className="text-xs italic text-muted-foreground">{result.balancesLabel}</p>
    </div>
  );
}
