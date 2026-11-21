'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CashBackResult } from './types';

interface CashBackResultsProps {
  result: CashBackResult | null;
}

export function CashBackResults({ result }: CashBackResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  const isBreakEven = result.solveTarget === 'breakEvenSpend';
  const headline = isBreakEven
    ? result.formattedBreakEven
    : result.formattedActual;
  const headlineLabel = isBreakEven
    ? 'Eligible Spend to Reach Cap'
    : 'Cash Back Earned';

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">{headlineLabel}</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {headline}
      </p>
      {!isBreakEven ? (
        <p className="text-xs text-muted-foreground">
          Effective purchase cost{' '}
          <span className="font-medium text-accent">
            {result.formattedEffectiveCost}
          </span>
        </p>
      ) : null}

      {result.cashbackLimitApplied ? (
        <p className="rounded-lg border border-border bg-white px-3 py-2 text-xs text-foreground/90">
          Cashback limit applied. Your calculated cashback exceeds the reward
          limit, so the final amount is capped at {result.formattedActual}.
        </p>
      ) : null}

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Purchase amount</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPurchase}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Cashback percentage</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.cashbackPercentage.toLocaleString('en-US', {
              maximumFractionDigits: 4,
            })}
            %
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Cashback before limit</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedCalculated}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Cashback limit</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedLimit}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Actual cashback</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedActual}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Effective cashback rate</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedEffectiveRate}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Effective purchase cost</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedEffectiveCost}
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
          href="/tools/credit-card-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Credit Card
        </Link>
        {' · '}
        <Link
          href="/tools/savings-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Savings
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
          href="/tools/profit-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Profit
        </Link>
      </p>
    </div>
  );
}
