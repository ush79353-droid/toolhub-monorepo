'use client';

import { useState } from 'react';
import type { UkCoinWeightResult } from './types';

interface UkCoinWeightResultsProps {
  result: UkCoinWeightResult | null;
}

export function UkCoinWeightResults({ result }: UkCoinWeightResultsProps) {
  const [showSteps, setShowSteps] = useState(false);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Total weight</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedDisplayWeight}
      </p>
      <p className="text-xs text-muted-foreground">
        {result.totalGrams.toLocaleString('en-GB', {
          maximumFractionDigits: 4,
        })}{' '}
        g ·{' '}
        {result.totalKilograms.toLocaleString('en-GB', {
          maximumFractionDigits: 6,
        })}{' '}
        kg
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total coins</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.totalCoins.toLocaleString('en-GB')}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Face value of counts</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedFaceValue}
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
    </div>
  );
}
