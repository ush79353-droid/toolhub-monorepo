'use client';

import Link from 'next/link';
import type { RetentionRatioResult } from './types';

interface RetentionRatioResultsProps {
  result: RetentionRatioResult | null;
}

export function RetentionRatioResults({ result }: RetentionRatioResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Summary</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Retained earnings (period)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedRetainedEarnings ?? '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Retention ratio</dt>
          <dd className="tabular-nums font-semibold text-accent">
            {result.formattedRetentionRatio ??
              (result.status === 'undefined' ? 'Undefined' : '—')}
          </dd>
        </div>
        {result.formattedPayoutRatio ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Dividend payout ratio</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedPayoutRatio}
            </dd>
          </div>
        ) : null}
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        Retention % = (1 − payout) × 100 · RE = NI − Dividends
      </p>

      {result.interpretation ? (
        <p className="text-xs leading-relaxed text-foreground/90">
          {result.interpretation}
        </p>
      ) : null}

      {result.unavailableReason ? (
        <p className="text-xs leading-relaxed text-amber-800" role="status">
          {result.unavailableReason}
        </p>
      ) : null}

      {result.warningMessage ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.warningMessage}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/dividend-payout-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Dividend Payout
        </Link>
        {' · '}
        <Link
          href="/tools/retained-earnings-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Retained Earnings
        </Link>
        {' · '}
        <Link
          href="/tools/peg-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          PEG
        </Link>
        {' · '}
        <Link
          href="/tools/residual-income-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Residual Income
        </Link>
        {' · '}
        <Link
          href="/tools/net-income-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Net Income
        </Link>
        .
      </p>
    </div>
  );
}
