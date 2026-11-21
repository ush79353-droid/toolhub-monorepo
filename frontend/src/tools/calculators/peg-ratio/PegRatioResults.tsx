'use client';

import Link from 'next/link';
import type { PegRatioResult } from './types';

interface PegRatioResultsProps {
  result: PegRatioResult | null;
}

export function PegRatioResults({ result }: PegRatioResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Summary</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Earnings per share</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedEps ?? '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">P/E ratio</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPeRatio ?? '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Earnings growth</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedGrowth ?? '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">PEG ratio</dt>
          <dd className="tabular-nums font-semibold text-accent">
            {result.formattedPeg ?? '—'}
          </dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        PEG = (P/E) ÷ g% · g% = (b% × ROE%) / 100
      </p>

      {result.warningMessage ? (
        <p className="text-xs leading-relaxed text-amber-800" role="status">
          {result.warningMessage}
        </p>
      ) : null}

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
          href="/tools/market-capitalization-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Market Cap
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
