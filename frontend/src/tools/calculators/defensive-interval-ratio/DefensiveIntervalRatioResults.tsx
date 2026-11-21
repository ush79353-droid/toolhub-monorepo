'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { DefensiveIntervalRatioResult } from './types';

interface DefensiveIntervalRatioResultsProps {
  result: DefensiveIntervalRatioResult | null;
}

export function DefensiveIntervalRatioResults({
  result,
}: DefensiveIntervalRatioResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  const primaryLabel =
    result.solveTarget === 'requiredAssets'
      ? 'Required Defensive Assets'
      : result.solveTarget === 'maxDailyExpenditure'
        ? 'Maximum Daily Cash Expenditure'
        : 'Defensive Interval Ratio';

  const primaryValue =
    result.solveTarget === 'requiredAssets'
      ? result.formattedDefensiveAssets
      : result.solveTarget === 'maxDailyExpenditure'
        ? `${result.formattedDailyExpenditure}/day`
        : result.formattedDirDays;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">{primaryLabel}</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {primaryValue}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Defensive assets</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedDefensiveAssets}
          </dd>
        </div>
        {result.solveTarget === 'dir' ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">
                Annual cash operating expenditure
              </dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedAnnualCashExpenditure}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Daily cash expenditure</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedDailyExpenditure}
              </dd>
            </div>
          </>
        ) : (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Daily cash expenditure</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedDailyExpenditure}
            </dd>
          </div>
        )}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Defensive interval</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedDirDays}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Day-count year</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.daysPerYear} days
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
          href="/tools/current-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Current Ratio
        </Link>
        {' · '}
        <Link
          href="/tools/cash-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Ratio
        </Link>
        {' · '}
        <Link
          href="/tools/working-capital-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Working Capital
        </Link>
        {' · '}
        <Link
          href="/tools/burn-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Burn Rate
        </Link>
        {' · '}
        <Link
          href="/tools/operating-cash-flow-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Operating Cash Flow
        </Link>
        {' · '}
        <Link
          href="/tools/cash-conversion-cycle-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Conversion Cycle
        </Link>
        {' · '}
        <Link
          href="/tools/interest-coverage-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Interest Coverage
        </Link>
      </p>
    </div>
  );
}
