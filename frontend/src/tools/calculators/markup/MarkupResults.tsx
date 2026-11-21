'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { MarkupResult } from './types';

interface MarkupResultsProps {
  result: MarkupResult | null;
}

export function MarkupResults({ result }: MarkupResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Markup Calculation Result
      </h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedMarkup}
      </p>
      <p className="text-xs text-muted-foreground">
        Unit profit{' '}
        <span className="font-medium text-accent">{result.formattedProfit}</span>
        {result.marginPercentage != null ? (
          <>
            {' '}
            · margin{' '}
            <span className="font-medium text-accent">
              {result.formattedMargin}
            </span>
          </>
        ) : null}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Cost</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedCost}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Markup</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedMarkup}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Revenue</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedRevenue}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Profit</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedProfit}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Profit margin</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedMargin}
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
          href="/tools/margin-and-markup-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Margin &amp; Markup
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
          href="/tools/discount-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Discount
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
          href="/tools/vat-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          VAT
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
      </p>
    </div>
  );
}
