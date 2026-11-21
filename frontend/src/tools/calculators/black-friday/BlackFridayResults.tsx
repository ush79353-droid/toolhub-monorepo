'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { BlackFridayResult } from './types';

interface BlackFridayResultsProps {
  result: BlackFridayResult | null;
}

export function BlackFridayResults({ result }: BlackFridayResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  const orig = result.originalPrice;
  const disc = result.discountedPrice;
  const max = Math.max(orig, 0.01);
  const discPct = (disc / max) * 100;
  const savePct = (result.savingsBeforeTax / max) * 100;

  const headline =
    result.solveTarget === 'originalPrice'
      ? result.formattedOriginal
      : result.solveTarget === 'discountPercent'
        ? result.formattedSavingsPct
        : result.solveTarget === 'savings'
          ? result.formattedSavings
          : result.formattedFinal;

  const headlineLabel =
    result.solveTarget === 'originalPrice'
      ? 'Original Price'
      : result.solveTarget === 'discountPercent'
        ? 'Discount Percentage'
        : result.solveTarget === 'savings'
          ? 'You Save'
          : 'Black Friday Final Price';

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">{headlineLabel}</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {headline}
      </p>
      {result.solveTarget === 'finalPrice' ? (
        <p className="text-xs text-muted-foreground">
          You save{' '}
          <span className="font-medium text-accent">
            {result.formattedSavings}
          </span>{' '}
          before tax ({result.formattedSavingsPct})
        </p>
      ) : null}

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Original price</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedOriginal}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Discount amount</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedDiscountAmount}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Discounted price</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedDiscounted}
          </dd>
        </div>
        {result.applySalesTax ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Sales tax</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedTax}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Final price</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedFinal}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Savings before tax</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedSavings}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Effective discount</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedEffectivePct}
          </dd>
        </div>
      </dl>

      <div
        className="space-y-2 rounded-lg border border-border bg-white px-3 py-2"
        role="img"
        aria-label="Original price, discounted price, and savings"
      >
        <div className="text-[11px] text-muted-foreground">
          Discounted price vs original
        </div>
        <div className="h-2.5 overflow-hidden rounded bg-muted">
          <div
            className="h-full rounded bg-primary"
            style={{ width: `${discPct}%` }}
          />
        </div>
        <div className="text-[11px] text-muted-foreground">
          Savings share of original
        </div>
        <div className="h-2.5 overflow-hidden rounded bg-muted">
          <div
            className="h-full rounded bg-accent"
            style={{ width: `${Math.min(100, savePct)}%` }}
          />
        </div>
      </div>

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
          href="/tools/discount-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Discount
        </Link>
        {' · '}
        <Link
          href="/tools/percentage-discount-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Percentage Discount
        </Link>
        {' · '}
        <Link
          href="/tools/double-discount-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Double Discount
        </Link>
        {' · '}
        <Link
          href="/tools/triple-discount-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Triple Discount
        </Link>
        {' · '}
        <Link
          href="/tools/vat-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          VAT
        </Link>
        {' · '}
        <Link
          href="/tools/budget-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Budget
        </Link>
        {' · '}
        <Link
          href="/tools/savings-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Savings
        </Link>
      </p>
    </div>
  );
}
