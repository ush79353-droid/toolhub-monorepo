'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SpendingMultiplierChart } from './SpendingMultiplierChart';
import type { SpendingMultiplierResult } from './types';

interface SpendingMultiplierResultsProps {
  result: SpendingMultiplierResult | null;
}

export function SpendingMultiplierResults({
  result,
}: SpendingMultiplierResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  const [showRounds, setShowRounds] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Spending Multiplier</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedMultiplier}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">MPC</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedMpc}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">MPS</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedMps}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Initial spending change</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedAutonomous}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Theoretical output change</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedOutputChange}
          </dd>
        </div>
        {result.observedGdpBase != null ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Observed GDP change</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedObserved}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Difference (obs − theory)</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedObservedDiff}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">% difference</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedObservedPct}
              </dd>
            </div>
          </>
        ) : null}
      </dl>

      <p className="text-xs leading-relaxed text-foreground/90">
        <span className="font-semibold text-accent">Interpretation: </span>
        {result.interpretation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>

      {result.rounds.length > 0 ? (
        <>
          <button
            type="button"
            onClick={() => setShowRounds((v) => !v)}
            className="text-xs font-medium text-primary underline-offset-2 hover:underline"
          >
            {showRounds ? 'Hide spending rounds' : 'Show spending rounds'}
          </button>
          {showRounds ? (
            <div className="space-y-2">
              <SpendingMultiplierChart result={result} />
              <div className="overflow-x-auto rounded-lg border border-border bg-white">
                <table className="w-full min-w-[20rem] text-left text-xs">
                  <thead className="bg-muted/30 text-accent">
                    <tr>
                      <th className="px-2 py-1.5 font-semibold">Round</th>
                      <th className="px-2 py-1.5 font-semibold text-right">
                        Additional
                      </th>
                      <th className="px-2 py-1.5 font-semibold text-right">
                        Cumulative
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-foreground/90">
                    {result.rounds.map((r) => (
                      <tr key={r.label} className="border-t border-border">
                        <td className="px-2 py-1">{r.label}</td>
                        <td className="px-2 py-1 text-right tabular-nums">
                          {r.formattedAdditional}
                        </td>
                        <td className="px-2 py-1 text-right tabular-nums">
                          {r.formattedCumulative}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </>
      ) : null}

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
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/mpc-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          MPC
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
          href="/tools/gdp-growth-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          GDP Growth Rate
        </Link>
        {' · '}
        <Link
          href="/tools/real-gdp-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Real GDP
        </Link>
        .
      </p>
    </div>
  );
}
