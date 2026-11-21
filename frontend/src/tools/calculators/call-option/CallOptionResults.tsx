'use client';

import Link from 'next/link';
import type { CallOptionResult } from './types';

interface CallOptionResultsProps {
  result: CallOptionResult | null;
}

export function CallOptionResults({ result }: CallOptionResultsProps) {
  if (!result) return null;

  const modeLabel = result.mode === 'call' ? 'Call' : 'Put';
  const moneyness =
    result.moneyness === 'atm'
      ? 'At the money'
      : result.moneyness === 'itm'
        ? 'In the money'
        : 'Out of the money';

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Summary</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total {modeLabel.toLowerCase()} premium</dt>
          <dd className="tabular-nums font-semibold text-accent">
            {result.formattedTotalPremiumCost}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Break-even (per share)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedBreakEvenPrice}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Intrinsic (per share)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedIntrinsicPerShare}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Time value (per share)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTimeValuePerShare}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">P/L at asset/target</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedProfitLossAtAsset}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Moneyness</dt>
          <dd className="font-medium text-accent">{moneyness}</dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        Total = Premium × {result.contractMultiplier} × Contracts
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/yield-to-maturity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Yield to Maturity
        </Link>
        {' · '}
        <Link
          href="/tools/coupon-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Coupon Rate
        </Link>
        {' · '}
        <Link
          href="/tools/effective-duration-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Effective Duration
        </Link>
        .
      </p>
    </div>
  );
}
