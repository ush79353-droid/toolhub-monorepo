'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { PercentOffResult } from './types';

interface PercentOffResultsProps {
  result: PercentOffResult | null;
}

export function PercentOffResults({ result }: PercentOffResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Your Discount Results</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedDiscounted}
      </p>
      <p className="text-xs text-muted-foreground">
        You save{' '}
        <span className="font-medium text-accent">{result.formattedSavings}</span>
        {' · '}
        effective{' '}
        <span className="font-medium text-accent">
          {result.formattedEffectivePct}
        </span>
      </p>

      <div
        className="h-3 w-full overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={`${result.formattedEffectivePct} saved, remainder paid`}
      >
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${result.savingsBarPct}%` }}
        />
      </div>
      <p className="text-[11px] text-muted-foreground">
        Savings {result.formattedEffectivePct} · Remaining{' '}
        {result.remainingBarPct.toFixed(0)}% of original
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Original price</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedOriginal}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            First discount ({result.discountPercent.toFixed(2)}%)
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedFirstDiscount}
          </dd>
        </div>
        {result.additionalDiscountPercent != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">
              Additional discount ({result.additionalDiscountPercent.toFixed(2)}
              %)
            </dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedSecondDiscount}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total savings</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedSavings}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Final price (before tax)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedDiscounted}
          </dd>
        </div>
        {result.applySalesTax ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">
                Sales tax ({result.salesTaxRate.toFixed(2)}%)
              </dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedTax}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Total including tax</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedTotalWithTax}
              </dd>
            </div>
          </>
        ) : null}
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
          href="/tools/black-friday-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Black Friday
        </Link>
        {' · '}
        <Link
          href="/tools/cyber-monday-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cyber Monday
        </Link>
        {' · '}
        <Link
          href="/tools/markdown-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Markdown
        </Link>
        {' · '}
        <Link
          href="/tools/sales-tax-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Sales Tax
        </Link>
        {' · '}
        <Link
          href="/tools/markup-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Markup
        </Link>
        {' · '}
        <Link
          href="/tools/cash-back-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Back
        </Link>
      </p>
    </div>
  );
}
