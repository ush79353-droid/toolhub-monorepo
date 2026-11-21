'use client';

import Link from 'next/link';
import type { GrahamNumberResult } from './types';

interface GrahamResultsProps {
  result: GrahamNumberResult | null;
}

export function GrahamResults({ result }: GrahamResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Summary</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Graham Number</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedGrahamNumber}
          </dd>
        </div>
        {result.valuationLabel ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Valuation</dt>
            <dd className="font-medium text-accent">{result.valuationLabel}</dd>
          </div>
        ) : null}
        {result.formattedPriceDifference ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Price difference vs GN</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedPriceDifference}
            </dd>
          </div>
        ) : null}
        {result.formattedUpside ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Upside vs price</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedUpside}
            </dd>
          </div>
        ) : null}
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        GN = √(22.5 × EPS × BVPS)
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
          EPS
        </Link>
        {' · '}
        <Link
          href="/tools/earnings-per-share-growth-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EPS Growth
        </Link>
        {' · '}
        <Link
          href="/tools/enterprise-value-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Enterprise Value
        </Link>
        {' · '}
        <Link
          href="/tools/ebitda-multiple-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBITDA Multiple
        </Link>
        {' · '}
        <Link
          href="/tools/stock-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Stock
        </Link>
        {' · '}
        <Link
          href="/tools/investment-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Investment
        </Link>
        .
      </p>
    </div>
  );
}
