'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { IraResult } from './types';

interface IraResultsProps {
  result: IraResult | null;
}

export function IraResults({ result }: IraResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Comparison snapshot</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Traditional path balance</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTraditionalBalance}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Traditional take-home / yr</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTraditionalTakeHome}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Roth path balance</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedRothBalance}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Roth take-home / yr</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedRothTakeHome}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">IRS rule year</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.ruleYear}
          </dd>
        </div>
      </dl>

      {result.limitNote ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
          {result.limitNote}
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
          href="/tools/rmd-calculator-required-minimum-distributions-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          RMD
        </Link>
        {' · '}
        <Link
          href="/tools/401k-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          401(k)
        </Link>
        {' · '}
        <Link
          href="/tools/early-retirement-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Early Retirement
        </Link>
      </p>
    </div>
  );
}
