'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { YieldToCallResult } from './types';

interface YieldToCallResultsProps {
  result: YieldToCallResult | null;
}

export function YieldToCallResults({ result }: YieldToCallResultsProps) {
  const [showSteps, setShowSteps] = useState(false);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Yield to Call</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedYtc}
      </p>
      <p className="text-xs text-muted-foreground">
        Nominal annual YTC · Current yield{' '}
        <span className="tabular-nums font-medium text-accent">
          {result.formattedCurrentYield}
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Annual interest</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedAnnualInterest}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Call price</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedCallPrice}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Market price</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedMarketPrice}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Years until call</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.yearsUntilCall}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total coupon income</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTotalCoupons}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total cash if called</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTotalCash}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Call − market</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedCapitalGainLoss}
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
          href="/tools/tax-equivalent-yield-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Tax Equivalent Yield
        </Link>
      </p>
    </div>
  );
}
