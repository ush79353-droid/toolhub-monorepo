'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CobbDouglasResult } from './types';

interface CobbDouglasResultsProps {
  result: CobbDouglasResult | null;
}

export function CobbDouglasResults({ result }: CobbDouglasResultsProps) {
  const [showDetails, setShowDetails] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Total Production</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedTotalProduction}{' '}
        <span className="text-base font-medium text-muted-foreground">
          units
        </span>
      </p>

      <div>
        <p className="text-xs font-medium text-muted-foreground">
          Returns to Scale Classification
        </p>
        <p className="text-sm font-semibold text-accent">
          {result.formattedReturnsToScaleType}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-foreground/90">
          {result.interpretation}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setShowDetails((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showDetails ? 'Hide calculation breakdown' : 'Show calculation breakdown'}
      </button>
      {showDetails ? (
        <p className="rounded-lg border border-border bg-white px-3 py-2 font-mono text-xs leading-relaxed text-accent">
          {result.formulaBreakdown}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => setShowAdvanced((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showAdvanced
          ? 'Hide productivity metrics'
          : 'Show marginal & average productivity'}
      </button>
      {showAdvanced ? (
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Elasticity sum (α + β)</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedReturnsToScaleSum}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Marginal product of labor</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedMPL ?? '—'}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Marginal product of capital</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedMPK ?? '—'}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Average product of labor</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedAPL ?? '—'}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Average product of capital</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedAPK ?? '—'}
            </dd>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            MPL = α×Y/L and MPK = β×Y/K are marginal derivatives for small
            changes, not the exact gain from a large discrete input jump.
          </p>
        </dl>
      ) : null}

      <p className="font-mono text-xs text-muted-foreground">
        Y = A L<sup>α</sup> K<sup>β</sup>
      </p>
      <p className="text-xs leading-relaxed text-foreground/90">
        {result.explanation}
      </p>
      {result.warningMessage ? (
        <p className="text-xs leading-relaxed text-amber-800">
          {result.warningMessage}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/economic-profit-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Economic Profit
        </Link>
        {' · '}
        <Link
          href="/tools/marginal-revenue-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Marginal Revenue
        </Link>
        {' · '}
        <Link
          href="/tools/marginal-cost-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Marginal Cost
        </Link>
        {' · '}
        <Link
          href="/tools/productivity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Productivity
        </Link>
        .
      </p>
    </div>
  );
}
