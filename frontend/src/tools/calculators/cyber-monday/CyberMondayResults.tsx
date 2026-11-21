'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DEAL_TYPE_LABELS, type CyberMondayResult } from './types';

interface CyberMondayResultsProps {
  result: CyberMondayResult | null;
}

export function CyberMondayResults({ result }: CyberMondayResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Final Cyber Monday Price
      </h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedFinal}
      </p>
      <p className="text-xs text-muted-foreground">
        Merchandise savings{' '}
        <span className="font-medium text-accent">
          {result.formattedSavings}
        </span>
        {' · '}
        Effective discount{' '}
        <span className="font-medium text-accent">
          {result.formattedEffectivePct}
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Deal type</dt>
          <dd className="font-medium text-accent">
            {DEAL_TYPE_LABELS[result.dealType]}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Original order value</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedOriginal}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Discount amount</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedDiscount}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Discounted merchandise</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedDiscounted}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            {result.taxIncluded ? 'Tax (included)' : 'Sales tax'}
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTax}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            Shipping{result.shippingWaived ? ' (waived)' : ''}
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedShipping}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Final checkout</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedFinal}
          </dd>
        </div>
      </dl>

      {result.blackFridayComparison ? (
        <p className="rounded-lg border border-border bg-white px-3 py-2 text-xs text-foreground/90">
          {result.blackFridayComparison}
        </p>
      ) : null}

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
          href="/tools/black-friday-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Black Friday
        </Link>
        {' · '}
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
          href="/tools/cash-back-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Back
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
          href="/tools/savings-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Savings
        </Link>
      </p>
    </div>
  );
}
