'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CouponRateResult } from './types';

interface CouponRateResultsProps {
  result: CouponRateResult | null;
}

export function CouponRateResults({ result }: CouponRateResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Annual Coupon Rate</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedCouponRate}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Face value</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedFaceValue}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Coupon frequency</dt>
          <dd className="font-medium text-accent text-right">
            {result.frequencyLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Payments per year</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.paymentsPerYear}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Coupon per period</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedCouponPerPeriod}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Annual coupon</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedAnnualCoupon}
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
          href="/tools/bond-current-yield-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bond Current Yield
        </Link>
        {' · '}
        <Link
          href="/tools/bond-ytm-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bond YTM
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
          href="/tools/bond-yield-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bond Yield
        </Link>
        {' · '}
        <Link
          href="/tools/present-value-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Present Value
        </Link>
        {' · '}
        <Link
          href="/tools/compound-interest-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Compound Interest
        </Link>
        .
      </p>
    </div>
  );
}
