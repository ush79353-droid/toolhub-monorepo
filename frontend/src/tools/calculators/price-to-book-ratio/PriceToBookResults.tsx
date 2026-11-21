'use client';

import Link from 'next/link';
import type { PriceToBookResult } from './types';

interface PriceToBookResultsProps {
  result: PriceToBookResult | null;
}

export function PriceToBookResults({ result }: PriceToBookResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Summary</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Common book equity</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedCommonBookEquity}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Book value per share</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedBvps}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Price to book</dt>
          <dd className="tabular-nums font-semibold text-accent">
            {result.formattedPb ?? '—'}
          </dd>
        </div>
        {result.formattedTangibleEquity ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Tangible common equity</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedTangibleEquity}
            </dd>
          </div>
        ) : null}
        {result.formattedTbvps ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Tangible BVPS</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedTbvps}
            </dd>
          </div>
        ) : null}
        {result.formattedPtb || result.ptbUnavailableReason ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Price to tangible book</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedPtb ?? '—'}
            </dd>
          </div>
        ) : null}
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        P/B = Price ÷ BVPS · BVPS = (Equity − Preferred) ÷ Shares
      </p>

      {result.interpretation ? (
        <p className="text-xs leading-relaxed text-foreground/90">
          {result.interpretation}
        </p>
      ) : null}

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
          href="/tools/peg-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          PEG Ratio
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
          href="/tools/intrinsic-value-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Intrinsic Value
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
