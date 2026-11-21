'use client';

import Link from 'next/link';
import type { SustainableGrowthRateResult } from './types';

interface SustainableGrowthRateResultsProps {
  result: SustainableGrowthRateResult | null;
}

export function SustainableGrowthRateResults({
  result,
}: SustainableGrowthRateResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Summary</h3>
      <dl className="space-y-2 text-sm">
        {result.formattedRetainedEarnings ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Retained earnings</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedRetainedEarnings}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Retention ratio</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedRetention}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Return on equity</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedRoe}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Sustainable growth rate</dt>
          <dd className="tabular-nums font-semibold text-accent">
            {result.formattedSgr}
          </dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        SGR = ROE × Retention Ratio
      </p>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.explanation}
      </p>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.interpretation}
      </p>

      {result.warningMessage ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.warningMessage}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/retention-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Retention Ratio
        </Link>
        {' · '}
        <Link
          href="/tools/return-on-equity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          ROE
        </Link>
        {' · '}
        <Link
          href="/tools/return-on-assets-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          ROA
        </Link>
        {' · '}
        <Link
          href="/tools/roic-calculator-return-on-invested-capital"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          ROIC
        </Link>
        {' · '}
        <Link
          href="/tools/dividend-payout-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Dividend Payout
        </Link>
        .
      </p>
    </div>
  );
}
