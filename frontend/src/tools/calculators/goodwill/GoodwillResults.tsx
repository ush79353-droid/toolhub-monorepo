'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { GoodwillResult } from './types';

interface GoodwillResultsProps {
  result: GoodwillResult | null;
}

export function GoodwillResults({ result }: GoodwillResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);
  const isBargain = result.status === 'potentialBargainPurchase';

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Acquisition summary</h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Purchase price</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedPurchasePrice}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Net identifiable assets</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedNetIdentifiableAssets}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">Goodwill</dt>
          <dd
            className={`font-semibold tabular-nums ${
              isBargain ? 'text-rose-700' : 'text-accent'
            }`}
          >
            {symbol}
            {result.formattedGoodwill}
          </dd>
        </div>
        {isBargain && result.formattedBargainPurchaseDifference ? (
          <div className="flex justify-between gap-2">
            <dt className="font-medium text-rose-700">
              Potential bargain purchase
            </dt>
            <dd className="font-semibold tabular-nums text-rose-700">
              {symbol}
              {result.formattedBargainPurchaseDifference}
            </dd>
          </div>
        ) : null}
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        Goodwill = P − (A − L)
      </p>
      {result.warningMessage ? (
        <p
          className={`mt-2 text-xs leading-relaxed ${
            isBargain ? 'text-rose-700' : 'text-amber-800'
          }`}
          role="status"
        >
          {result.warningMessage}
        </p>
      ) : null}
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <a
          href="/tools/financial-leverage-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Financial Leverage Ratio
        </a>
        .
      </p>
    </div>
  );
}
