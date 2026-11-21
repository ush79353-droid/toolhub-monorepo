'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MpcChart } from './MpcChart';
import type { MpcResult } from './types';

interface MpcResultsProps {
  result: MpcResult | null;
  showIncomeEqualsSpendingLine: boolean;
}

export function MpcResults({
  result,
  showIncomeEqualsSpendingLine,
}: MpcResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Marginal Propensity to Consume
      </h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedMpc}{' '}
        <span className="text-base font-medium text-muted-foreground">
          ({result.formattedMpcPercent})
        </span>
      </p>

      {result.mpcWarning ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950">
          {result.mpcWarning}
        </p>
      ) : null}

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Consumer spending</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedConsumerSpending}
          </dd>
        </div>
      </dl>

      <div className="rounded-lg border border-border bg-white px-3 py-2">
        <p className="text-xs font-semibold text-accent">
          Additional Economic Indicators
        </p>
        <dl className="mt-2 space-y-2 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">MPS</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedMps}
              {result.mpsPercent != null
                ? ` (${result.mpsPercent.toFixed(0)}%)`
                : ''}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">
              Theoretical spending multiplier
            </dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedMultiplier}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">
              Break-even disposable income
            </dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedBreakEven}
            </dd>
          </div>
        </dl>
        {result.multiplierUndefinedReason ? (
          <p className="mt-2 text-xs text-muted-foreground">
            {result.multiplierUndefinedReason}
          </p>
        ) : null}
        {result.breakEvenUndefinedReason ? (
          <p className="mt-1 text-xs text-muted-foreground">
            {result.breakEvenUndefinedReason}
          </p>
        ) : null}
        <p className="mt-2 text-xs text-muted-foreground">
          MPS uses the simplified split of income changes between consumption and
          saving. The multiplier ignores taxes, imports, and other leakages.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-white px-3 py-2">
        <p className="text-xs leading-relaxed text-foreground/90">
          {result.interpretation}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {result.explanation}
        </p>
      </div>

      <MpcChart
        result={result}
        showIncomeEqualsSpendingLine={showIncomeEqualsSpendingLine}
      />

      <button
        type="button"
        onClick={() => setShowSteps((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSteps
          ? 'Hide how your MPC is calculated'
          : 'How your MPC is calculated'}
      </button>
      {showSteps ? (
        <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-2 text-xs leading-relaxed text-accent">
          <p className="font-mono">{result.formulaBreakdown}</p>
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
          href="/tools/money-multiplier-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Money Multiplier
        </Link>
        {' · '}
        <Link
          href="/tools/money-supply-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Money Supply
        </Link>
        {' · '}
        <Link
          href="/tools/discretionary-income-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Discretionary Income
        </Link>
        {' · '}
        <Link
          href="/tools/gdp-growth-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP Growth
        </Link>
        {' · '}
        <Link
          href="/tools/inflation-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Inflation
        </Link>
        .
      </p>
    </div>
  );
}
