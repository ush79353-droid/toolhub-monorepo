'use client';

import { useState } from 'react';
import type { BbtResult } from './types';

interface BbtResultsProps {
  result: BbtResult | null;
}

export function BbtResults({ result }: BbtResultsProps) {
  const [showSteps, setShowSteps] = useState(false);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Timing summary</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Time difference</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTimeDifference}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Correction applied</dt>
          <dd className="font-medium text-accent">
            {result.correctionApplied ? 'Yes' : 'No — outside ±6 hour window'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Adjusted temperature</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedAdjusted}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Temperature difference</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTemperatureDifference}
          </dd>
        </div>
      </dl>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.disclaimer}
      </p>
      <button
        type="button"
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        onClick={() => setShowSteps((v) => !v)}
        aria-expanded={showSteps}
      >
        {showSteps ? 'Hide calculation steps' : 'Show calculation steps'}
      </button>
      {showSteps ? (
        <ol className="list-decimal space-y-1 pl-4 text-xs text-muted-foreground">
          {result.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
