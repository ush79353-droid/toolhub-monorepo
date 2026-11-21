'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ReserveRatioChart } from './ReserveRatioChart';
import type { ReserveRatioResult } from './types';

interface ReserveRatioResultsProps {
  result: ReserveRatioResult | null;
}

function primaryTitle(result: ReserveRatioResult): string {
  switch (result.mode) {
    case 'required':
      return 'Required Reserves';
    case 'excess':
      return result.excessStatus === 'shortfall'
        ? 'Reserve Shortfall'
        : result.excessStatus === 'exact'
          ? 'Reserves Meet Requirement'
          : 'Excess Reserves';
    case 'deposits':
      return 'Total Deposits';
    case 'reserves':
      return 'Total Reserves';
    default:
      return 'Reserve Ratio';
  }
}

function primaryValue(result: ReserveRatioResult): string {
  switch (result.mode) {
    case 'required':
      return result.formattedRequiredReserves;
    case 'excess':
      return result.formattedExcess;
    case 'deposits':
      return result.formattedDeposits;
    case 'reserves':
      return result.formattedReserves;
    default:
      return result.formattedRatio;
  }
}

export function ReserveRatioResults({ result }: ReserveRatioResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        {primaryTitle(result)}
      </h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {primaryValue(result)}
      </p>

      <dl className="space-y-2 text-sm">
        {result.mode !== 'excess' ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Total Deposits</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedDeposits}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            {result.mode === 'excess' ? 'Actual Reserves' : 'Total Reserves'}
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedReserves}
          </dd>
        </div>
        {result.reserveRatioPercent != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Reserve Ratio</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedRatio}
            </dd>
          </div>
        ) : null}
        {result.unreservedApplicable || result.mode === 'ratio' ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">
              Funds Not Held as Reserves
            </dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedUnreserved}
            </dd>
          </div>
        ) : null}
        {result.requiredReservesBase != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Required Reserves</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedRequiredReserves}
            </dd>
          </div>
        ) : null}
        {result.excessOrShortfallBase != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">
              {result.excessStatus === 'shortfall'
                ? 'Reserve Shortfall'
                : 'Excess Reserves'}
            </dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedExcess}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Simple Money Multiplier</dt>
          <dd className="tabular-nums font-medium text-accent text-right">
            {result.formattedMultiplier}
          </dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-foreground/90">
        <span className="font-semibold text-accent">Interpretation: </span>
        {result.interpretation}
      </p>

      <ReserveRatioChart result={result} />

      <button
        type="button"
        onClick={() => setShowSteps((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSteps ? 'Hide calculation steps' : 'Show calculation steps'}
      </button>
      {showSteps ? (
        <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-2 text-xs leading-relaxed text-accent">
          <p className="font-mono">{result.formulaBreakdown}</p>
          <ol className="list-decimal space-y-1 pl-4 text-muted-foreground">
            {result.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="text-muted-foreground">{result.explanation}</p>
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
          href="/tools/lcr-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          LCR
        </Link>
        {' · '}
        <Link
          href="/tools/nsfr-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          NSFR
        </Link>
        {' · '}
        <Link
          href="/tools/mpc-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          MPC
        </Link>
        .
      </p>
    </div>
  );
}
