'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { YieldToMaturityResult } from './types';

interface YieldToMaturityResultsProps {
  result: YieldToMaturityResult | null;
}

export function YieldToMaturityResults({
  result,
}: YieldToMaturityResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  const headline =
    result.solveTarget === 'bondPrice'
      ? result.formattedPrice
      : result.solveTarget === 'faceValue'
        ? result.formattedFace
        : result.solveTarget === 'couponRate'
          ? result.formattedCouponRate
          : result.formattedYtm;

  const headlineLabel =
    result.solveTarget === 'bondPrice'
      ? 'Bond Price'
      : result.solveTarget === 'faceValue'
        ? 'Face Value'
        : result.solveTarget === 'couponRate'
          ? 'Annual Coupon Rate'
          : 'Yield to Maturity';

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">{headlineLabel}</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {headline}
      </p>
      {result.solveTarget === 'ytm' ? (
        <p className="text-xs text-muted-foreground">
          Nominal annual YTM · Effective annual{' '}
          <span className="tabular-nums font-medium text-accent">
            {result.formattedEay}
          </span>
        </p>
      ) : null}

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Face value</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedFace}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Bond price</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPrice}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Coupon rate</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedCouponRate}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Current yield</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedCurrentYield}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Yield to maturity</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedYtm}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Periodic yield</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPeriodicYield}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Effective annual yield</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedEay}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Coupon per period</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedCouponPayment}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Annual coupon income</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedAnnualCoupon}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Remaining payments</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.numberOfPeriods}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total coupon income</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTotalCoupons}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total contractual cash</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTotalCash}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Face − price</dt>
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
          href="/tools/bond-ytm-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bond YTM
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
          href="/tools/bond-current-yield-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Current Yield
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
          href="/tools/tax-equivalent-yield-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Tax Equivalent Yield
        </Link>
        {' · '}
        <Link
          href="/tools/effective-duration-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Effective Duration
        </Link>
        {' · '}
        <Link
          href="/tools/bond-convexity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Bond Convexity
        </Link>
      </p>
    </div>
  );
}
