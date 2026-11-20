'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { FfoResult } from './types';

interface FfoResultsProps {
  result: FfoResult | null;
}

export function FfoResults({ result }: FfoResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);
  const adjusted = result.convention === 'excludeInterestIncome';

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">FFO summary</h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Standard REIT FFO</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedStandardFfo}
          </dd>
        </div>
        {result.formattedAdjustedFfo !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">
              FFO excluding interest income
            </dt>
            <dd className="tabular-nums text-accent">
              {symbol}
              {result.formattedAdjustedFfo}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">{result.resultLabel}</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {result.formattedDisplayedFfo}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        {adjusted
          ? 'Adjusted = NI + D&A − Gains + Losses − Interest income'
          : 'FFO = NI + D&A − Gains + Losses'}
      </p>
      {result.warningMessage ? (
        <p className="mt-2 text-xs leading-relaxed text-amber-800" role="status">
          {result.warningMessage}
        </p>
      ) : null}
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <a
          href="/tools/fcfe-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          FCFE
        </a>
        ,{' '}
        <a
          href="/tools/ebitda-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBITDA
        </a>
        .
      </p>
    </div>
  );
}
