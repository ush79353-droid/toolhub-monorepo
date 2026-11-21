'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { RuleOf72Result } from './types';

interface RuleOf72ResultsProps {
  result: RuleOf72Result | null;
}

export function RuleOf72Results({ result }: RuleOf72ResultsProps) {
  const [showSteps, setShowSteps] = useState(false);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Rule of 72 estimate</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedIncrease}% /period → {result.formattedDoublingTime}{' '}
        periods
      </p>
      {result.formattedExactDoublingTime ? (
        <p className="text-sm tabular-nums text-accent/90">
          Exact compound doubling ≈ {result.formattedExactDoublingTime} periods
        </p>
      ) : null}
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
        <pre className="whitespace-pre-wrap rounded-lg border border-border bg-white px-3 py-2 font-mono text-[11px] text-accent">
          {result.formulaBreakdown}
        </pre>
      ) : null}

      <p className="text-xs text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/2836-rule-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Rule 28/36 Calculator
        </Link>
      </p>
    </div>
  );
}
