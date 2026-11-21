'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ForwardPremiumResult } from './types';

interface ForwardPremiumResultsProps {
  result: ForwardPremiumResult | null;
}

export function ForwardPremiumResults({ result }: ForwardPremiumResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  const headlineLabel = result.isDiscount
    ? 'Annualized Forward Discount'
    : 'Annualized Forward Premium';

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">{headlineLabel}</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedAnnualized}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Spot rate</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedSpot}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Forward rate</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedForward}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            {result.isDiscount ? 'Forward discount' : 'Forward premium'}
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPremium}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Contract duration</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedDuration}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Day-count basis</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.dayCountBasis}
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
          href="/tools/currency-forward-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Currency Forward
        </Link>
        {' · '}
        <Link
          href="/tools/carry-trade-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Carry Trade
        </Link>
        {' · '}
        <Link
          href="/tools/ppp-calculator-purchasing-power-parity"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          PPP
        </Link>
        {' · '}
        <Link
          href="/tools/fisher-effect-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Fisher Effect
        </Link>
      </p>
    </div>
  );
}
