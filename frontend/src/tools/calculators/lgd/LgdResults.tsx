'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { LgdResult } from './types';

interface LgdResultsProps {
  result: LgdResult | null;
}

export function LgdResults({ result }: LgdResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  const recoveredPct = result.recoveryRate * 100;
  const lostPct = result.lossSeverity * 100;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Loss Given Default</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedLgdAmount}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Exposure at Default</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedExposure}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Recovery Rate</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedRecoveryRate}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Loss Severity</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedLossSeverity}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Estimated Recovery</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedRecoveryAmount}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Loss Given Default</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedLgdAmount}
          </dd>
        </div>
        {result.formattedExpectedLoss ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">
              Expected Loss ({result.pdHorizonLabel})
            </dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedExpectedLoss}
            </dd>
          </div>
        ) : null}
      </dl>

      <div
        className="overflow-hidden rounded-lg border border-border bg-white"
        role="img"
        aria-label={`Exposure allocation: recovered ${recoveredPct}%, lost ${lostPct}%`}
      >
        <div className="flex h-3 w-full">
          <div
            className="bg-emerald-500/80"
            style={{ width: `${Math.min(100, Math.max(0, recoveredPct))}%` }}
          />
          <div
            className="bg-rose-500/80"
            style={{ width: `${Math.min(100, Math.max(0, lostPct))}%` }}
          />
        </div>
        <div className="flex justify-between px-2 py-1.5 text-[11px] text-muted-foreground">
          <span>Recovered {result.formattedRecoveryRate}</span>
          <span>Lost {result.formattedLossSeverity}</span>
        </div>
      </div>

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
          href="/tools/credit-spread-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Credit Spread
        </Link>
        {' · '}
        <Link
          href="/tools/debt-to-asset-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Debt to Asset
        </Link>
        {' · '}
        <Link
          href="/tools/debt-to-equity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Debt to Equity
        </Link>
        {' · '}
        <Link
          href="/tools/interest-coverage-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Interest Coverage
        </Link>
        {' · '}
        <Link
          href="/tools/debt-service-coverage-ratio-calculator-dscr"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DSCR
        </Link>
        {' · '}
        <Link
          href="/tools/ltv-calculator-loan-to-value"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          LTV
        </Link>
        {' · '}
        <Link
          href="/tools/loan-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Loan Calculator
        </Link>
      </p>
    </div>
  );
}
