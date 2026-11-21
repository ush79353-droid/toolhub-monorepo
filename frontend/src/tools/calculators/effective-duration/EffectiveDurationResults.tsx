'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { EffectiveDurationResult } from './types';

interface EffectiveDurationResultsProps {
  result: EffectiveDurationResult | null;
}

export function EffectiveDurationResults({
  result,
}: EffectiveDurationResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <p className="text-xs font-medium text-muted-foreground">
        {result.modeLabel}
      </p>
      <h3 className="text-sm font-semibold text-accent">
        Effective Duration Estimate
      </h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedDuration}
      </p>

      <dl className="space-y-2 text-sm">
        {result.mode === 'standard' ? (
          <>
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
          </>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Base bond price (P₀)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedBasePrice}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Price with lower yield (P−)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPriceDown}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Price with higher yield (P+)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPriceUp}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">%ΔP yield decrease</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPctChangeDown}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">%ΔP yield increase</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPctChangeUp}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Approx. DV01</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedDv01}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Effective convexity (approx.)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedConvexity}
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
          href="/tools/bond-price-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bond Price
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
          href="/tools/bond-convexity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bond Convexity
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
          href="/tools/bond-current-yield-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Current Yield
        </Link>
        {' · '}
        <Link
          href="/tools/credit-spread-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Credit Spread
        </Link>
        {' · '}
        <Link
          href="/tools/present-value-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Present Value
        </Link>
      </p>
    </div>
  );
}
