'use client';

import Link from 'next/link';
import type { EpsGrowthResult } from './types';

interface EpsGrowthResultsProps {
  result: EpsGrowthResult | null;
}

export function EpsGrowthResults({ result }: EpsGrowthResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">EPS growth results</h3>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Total percentage change versus compound (annualized) growth rate.
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Absolute EPS change</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedAbsoluteChange}/share
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total growth in EPS</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTotalGrowth ?? 'Unavailable'}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-2">
          <dt className="font-medium text-accent">EPS growth rate (CAGR)</dt>
          <dd className="text-lg font-semibold tabular-nums text-accent">
            {result.formattedCagr != null
              ? `${result.formattedCagr}/period`
              : 'Unavailable'}
          </dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        Total = (Final − Initial) ÷ Initial × 100 · CAGR = (Final ÷ Initial)^(1/n)
        − 1
      </p>

      {result.warningMessage ? (
        <p className="text-xs leading-relaxed text-amber-800" role="status">
          {result.warningMessage}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/earnings-per-share-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Earnings per Share
        </Link>
        {' · '}
        <Link
          href="/tools/dupont-analysis-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DuPont Analysis
        </Link>
        {' · '}
        <Link
          href="/tools/net-income-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Net Income
        </Link>
        {' · '}
        <Link
          href="/tools/dividend-payout-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Dividend Payout Ratio
        </Link>
        {' · '}
        <Link
          href="/tools/ebitda-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBITDA
        </Link>
        {' · '}
        <Link
          href="/tools/roi-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          ROI
        </Link>
        .
      </p>
    </div>
  );
}
