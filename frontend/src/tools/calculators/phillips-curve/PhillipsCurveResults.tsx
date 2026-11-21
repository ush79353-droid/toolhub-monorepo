'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PhillipsCurveChart } from './PhillipsCurveChart';
import type { PhillipsCurveResult } from './types';

interface Props {
  result: PhillipsCurveResult | null;
}

export function PhillipsCurveResults({ result }: Props) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        {result.versionLabel} · {result.targetLabel}
      </h3>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">{result.primaryLabel}</dt>
          <dd className="text-2xl font-semibold tabular-nums text-accent">
            {result.formattedPrimary}
          </dd>
        </div>
        {result.unemploymentGap != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Unemployment gap</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedUnemploymentGap}
            </dd>
          </div>
        ) : null}
        {result.inflationSurprise != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Inflation vs expectations</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedInflationSurprise}
            </dd>
          </div>
        ) : null}
        {result.wageVsTrend != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Wage growth vs trend</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedWageVsTrend}
            </dd>
          </div>
        ) : null}
        {result.expectedContribution != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Expected-inflation term</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedExpectedContribution}
            </dd>
          </div>
        ) : null}
        {result.gapContribution != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Output-gap term</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedGapContribution}
            </dd>
          </div>
        ) : null}
        {result.shockContribution != null &&
        result.version !== 'traditional' ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Shock term</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedShockContribution}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="rounded-lg border border-border bg-white px-3 py-2">
        <p className="text-xs leading-relaxed text-foreground/90">
          {result.interpretation}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {result.explanation}
        </p>
      </div>

      <PhillipsCurveChart result={result} />

      <button
        type="button"
        onClick={() => setShowSteps((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSteps
          ? 'Hide how your result is calculated'
          : 'How your result is calculated'}
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
          href="/tools/okuns-law-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Okun&apos;s Law
        </Link>
        {' · '}
        <Link
          href="/tools/inflation-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Inflation
        </Link>
        {' · '}
        <Link
          href="/tools/gdp-gap-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP Gap
        </Link>
        {' · '}
        <Link
          href="/tools/fisher-effect-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Fisher Effect
        </Link>
        .
      </p>
    </div>
  );
}
