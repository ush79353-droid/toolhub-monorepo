'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PppChart } from './PppChart';
import { formatPppFactor } from './calculation';
import type { PppResult } from './types';

interface Props {
  result: PppResult | null;
}

export function PppResults({ result }: Props) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Purchasing power comparison
        {result.year != null ? ` · ${result.year}` : ' · manual'}
      </h3>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Source salary</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedSalary}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Intl $ equivalent</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedIntl}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">PPP factors (A → B)</dt>
          <dd className="tabular-nums text-accent">
            {formatPppFactor(result.sourcePpp)} →{' '}
            {formatPppFactor(result.targetPpp)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">PPP exchange rate</dt>
          <dd className="text-right text-xs font-medium text-accent">
            {result.formattedPppRate}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">PPP-adjusted salary</dt>
          <dd className="text-2xl font-semibold tabular-nums text-accent">
            {result.formattedPppSalary}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Market-converted salary</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedMarketSalary}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            Relative price level (E_PPP / E_M)
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedRelative}
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
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          {result.dataAttribution}
        </p>
      </div>

      <PppChart result={result} />

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
          href="/tools/buying-power-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Buying Power
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
          href="/tools/gdp-per-capita-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP per Capita
        </Link>
        {' · '}
        <Link
          href="/tools/currency-forward-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Currency Forward
        </Link>
        .
      </p>
    </div>
  );
}
