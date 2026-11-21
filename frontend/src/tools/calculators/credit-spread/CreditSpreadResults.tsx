'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CreditSpreadResult } from './types';

interface CreditSpreadResultsProps {
  result: CreditSpreadResult | null;
}

export function CreditSpreadResults({ result }: CreditSpreadResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Credit Spread</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedSpreadBps}
      </p>
      <p className="text-sm tabular-nums text-muted-foreground">
        {result.formattedSpreadPp}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Corporate bond yield</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedCorporateYield}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Government bond yield</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedGovernmentYield}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Credit spread (pp)</dt>
          <dd className="tabular-nums font-medium text-accent text-right">
            {result.formattedSpreadPp}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Credit spread (bps)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedSpreadBps}
          </dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.interpretation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>

      <button
        type="button"
        onClick={() => setShowSteps((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSteps ? 'Hide calculation steps' : 'Show calculation steps'}
      </button>
      {showSteps ? (
        <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-2 text-xs leading-relaxed text-accent">
          <pre className="whitespace-pre-wrap font-mono text-[11px]">
            {result.formulaBreakdown}
          </pre>
          <ol className="list-decimal space-y-1 pl-4 text-muted-foreground">
            {result.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/bond-ytm-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bond YTM
        </Link>
        {' · '}
        <Link
          href="/tools/bond-current-yield-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bond Current Yield
        </Link>
        {' · '}
        <Link
          href="/tools/bond-price-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bond Price
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
          href="/tools/interest-coverage-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Interest Coverage
        </Link>
        {' · '}
        <Link
          href="/tools/debt-to-equity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Debt to Equity
        </Link>
        {' · '}
        <Link
          href="/tools/wacc-calculator-weighted-average-cost-of-capital"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          WACC
        </Link>
      </p>
    </div>
  );
}
