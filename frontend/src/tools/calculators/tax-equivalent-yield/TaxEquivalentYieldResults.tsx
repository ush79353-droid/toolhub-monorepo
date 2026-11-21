'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { TaxEquivalentYieldResult } from './types';

interface TaxEquivalentYieldResultsProps {
  result: TaxEquivalentYieldResult | null;
}

export function TaxEquivalentYieldResults({
  result,
}: TaxEquivalentYieldResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  const taxFree = result.bondYieldPercent;
  const tey = result.taxableEquivalentYieldPercent;
  const max = Math.max(taxFree, tey, 0.01);
  const taxFreePct = (taxFree / max) * 100;
  const teyPct = (tey / max) * 100;

  const headline =
    result.solveTarget === 'taxExemptYield'
      ? result.formattedBondYield
      : result.solveTarget === 'impliedTaxRate'
        ? result.formattedTaxRate
        : result.formattedTey;

  const headlineLabel =
    result.solveTarget === 'taxExemptYield'
      ? 'Tax-Exempt Bond Yield'
      : result.solveTarget === 'impliedTaxRate'
        ? 'Implied Marginal Tax Rate'
        : 'Taxable Equivalent Yield';

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">{headlineLabel}</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {headline}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Tax-exempt bond yield</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedBondYield}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Marginal tax rate</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTaxRate}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">After-tax retention factor</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedRetention}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Taxable equivalent yield</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTey}
          </dd>
        </div>
      </dl>

      <div
        className="space-y-2 rounded-lg border border-border bg-white px-3 py-2"
        role="img"
        aria-label="Tax-exempt yield versus taxable equivalent yield"
      >
        <div className="text-[11px] text-muted-foreground">
          Tax-exempt yield (after-tax by assumption)
        </div>
        <div className="h-2.5 overflow-hidden rounded bg-muted">
          <div
            className="h-full rounded bg-primary"
            style={{ width: `${taxFreePct}%` }}
          />
        </div>
        <div className="text-[11px] text-muted-foreground">
          Taxable equivalent yield (pre-tax)
        </div>
        <div className="h-2.5 overflow-hidden rounded bg-muted">
          <div
            className="h-full rounded bg-accent"
            style={{ width: `${teyPct}%` }}
          />
        </div>
      </div>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.interpretation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>

      {result.comparison ? (
        <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-2 text-xs">
          <p className="font-semibold text-accent">Optional comparison</p>
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Taxable investment yield</span>
            <span className="tabular-nums font-medium text-accent">
              {result.comparison.formattedTaxableYield}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">After-tax taxable yield</span>
            <span className="tabular-nums font-medium text-accent">
              {result.comparison.formattedAfterTax}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">
              Tax-exempt vs after-tax taxable
            </span>
            <span className="tabular-nums font-medium text-accent">
              {result.comparison.formattedDifference}
            </span>
          </div>
          <p className="leading-relaxed text-muted-foreground">
            {result.comparison.note}
          </p>
        </div>
      ) : null}

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
          href="/tools/coupon-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Coupon Rate
        </Link>
        {' · '}
        <Link
          href="/tools/effective-interest-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Effective Interest Rate
        </Link>
        {' · '}
        <Link
          href="/tools/inflation-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Inflation
        </Link>
        {' · '}
        <Link
          href="/tools/after-tax-cost-of-debt-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          After-Tax Cost of Debt
        </Link>
      </p>
    </div>
  );
}
