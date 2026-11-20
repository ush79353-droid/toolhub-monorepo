'use client';

import Link from 'next/link';
import type { MarketCapitalizationResult } from './types';

interface MarketCapResultsProps {
  result: MarketCapitalizationResult | null;
}

export function MarketCapResults({ result }: MarketCapResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Summary</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Market capitalization</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedMarketCap}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Compact</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.compactMarketCap}
          </dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        Market Cap = Share Price × Outstanding Shares
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
          href="/tools/enterprise-value-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Enterprise Value
        </Link>
        {' · '}
        <Link
          href="/tools/intrinsic-value-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Intrinsic Value
        </Link>
        {' · '}
        <Link
          href="/tools/graham-number-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Graham Number
        </Link>
        {' · '}
        <Link
          href="/tools/free-float-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Free Float
        </Link>
        {' · '}
        <Link
          href="/tools/earnings-per-share-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EPS
        </Link>
        {' · '}
        <Link
          href="/tools/stock-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Stock
        </Link>
        .
      </p>
    </div>
  );
}
