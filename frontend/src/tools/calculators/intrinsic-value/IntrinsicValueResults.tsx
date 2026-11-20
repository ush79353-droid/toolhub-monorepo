'use client';

import Link from 'next/link';
import type { IntrinsicValueResult } from './types';

interface IntrinsicValueResultsProps {
  result: IntrinsicValueResult | null;
}

export function IntrinsicValueResults({ result }: IntrinsicValueResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Summary</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Intrinsic value</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedIntrinsicValue}
          </dd>
        </div>
        {result.formattedMarginOfSafety ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Margin of safety</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedMarginOfSafety}
            </dd>
          </div>
        ) : null}
        {result.valuationLabel ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Comparison</dt>
            <dd className="text-right font-medium text-accent">
              {result.valuationLabel}
            </dd>
          </div>
        ) : null}
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        V = EPS × (8.5 + 2g) × 4.4 ÷ Y · MS = (V − CMP) ÷ V × 100
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
          href="/tools/graham-number-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Graham Number
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
        .
      </p>
    </div>
  );
}
