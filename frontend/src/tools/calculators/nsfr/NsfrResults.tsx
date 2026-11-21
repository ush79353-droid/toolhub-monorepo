'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NsfrChart } from './NsfrChart';
import type { NsfrResult } from './types';

interface NsfrResultsProps {
  result: NsfrResult | null;
}

export function NsfrResults({ result }: NsfrResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Net Stable Funding Ratio
      </h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedNsfr}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Available Stable Funding</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedAsf}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Required Stable Funding</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedRsf}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Coverage multiple</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedMultiple}
          </dd>
        </div>
      </dl>

      <div className="rounded-lg border border-border bg-white px-3 py-2">
        <p className="text-xs leading-relaxed text-foreground/90">
          {result.interpretation}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {result.explanation}
        </p>
      </div>

      <NsfrChart result={result} />

      <button
        type="button"
        onClick={() => setShowAnalysis((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showAnalysis ? 'Hide funding analysis' : 'Funding analysis'}
      </button>
      {showAnalysis ? (
        <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-2 text-xs">
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Funding gap (ASF − RSF)</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedGap}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">
                Funding to reach 100% (if short)
              </dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedShortfall}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Surplus above minimum</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedSurplus}
              </dd>
            </div>
          </dl>
          <p className="font-medium text-accent">±5% sensitivity (illustrative)</p>
          <ul className="space-y-1 text-muted-foreground">
            {result.sensitivity.map((row) => (
              <li key={row.label} className="flex justify-between gap-2">
                <span>{row.label}</span>
                <span className="tabular-nums text-accent">
                  {row.formattedNsfr}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground">
 Scenarios are mathematical only; not forecasts.
          </p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setShowSteps((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSteps
          ? 'Hide how your NSFR is calculated'
          : 'How your NSFR is calculated'}
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
          href="/tools/lcr-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          LCR
        </Link>
        {' · '}
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
