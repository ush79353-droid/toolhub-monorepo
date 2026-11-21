'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { formatPercent } from './calculation';
import { LumpsumChart } from './LumpsumChart';
import type { LumpsumResult } from './types';

interface LumpsumResultsProps {
  result: LumpsumResult | null;
}

export function LumpsumResults({ result }: LumpsumResultsProps) {
  const [showSteps, setShowSteps] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  if (!result) return null;

  const fmt = (n: number) => formatCurrencyValue(n, result.currency);

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">{result.primaryLabel}</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedPrimary}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Opening balance</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedInitial}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Final balance</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedFinalBalance}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total investment returns</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedReturns}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Nominal annual return</dt>
          <dd className="tabular-nums font-medium text-accent">
            {formatPercent(result.nominalAnnualReturn)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Effective annual return (EAR)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {formatPercent(result.effectiveAnnualReturn)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Inflation-adjusted final balance</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedRealBalance}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Real gain (purchasing power)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.realGain)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Inflation impact</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.inflationImpact)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Term</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.investmentTermYears.toLocaleString('en-US', {
              maximumFractionDigits: 4,
            })}{' '}
            years
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">End of term</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.endDate}
          </dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>

      <LumpsumChart
        schedule={result.schedule}
        principal={result.initialInvestment}
        currency={result.currency}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowSteps((v) => !v)}
          className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-accent hover:bg-muted/30"
        >
          {showSteps ? 'Hide' : 'Show'} step-by-step
        </button>
        <button
          type="button"
          onClick={() => setShowSchedule((v) => !v)}
          className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-accent hover:bg-muted/30"
        >
          {showSchedule ? 'Hide' : 'Show'} growth schedule
        </button>
      </div>

      {showSteps ? (
        <div className="rounded-lg border border-border bg-white px-3 py-2">
          <ol className="list-decimal space-y-1 pl-4 text-xs text-muted-foreground">
            {result.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-md bg-muted/30 p-2 font-mono text-[11px] text-accent">
            {result.formulaBreakdown}
          </pre>
        </div>
      ) : null}

      {showSchedule ? (
        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full min-w-[560px] text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-muted-foreground">
                <th className="px-2 py-2 font-medium">Year</th>
                <th className="px-2 py-2 font-medium">Opening</th>
                <th className="px-2 py-2 font-medium">Returns</th>
                <th className="px-2 py-2 font-medium">Closing</th>
                <th className="px-2 py-2 font-medium">Real (infl.-adj.)</th>
              </tr>
            </thead>
            <tbody>
              {result.schedule.map((row) => (
                <tr key={row.year} className="border-b border-border/50">
                  <td className="px-2 py-1.5 tabular-nums">{row.year}</td>
                  <td className="px-2 py-1.5 tabular-nums">
                    {fmt(row.openingBalance)}
                  </td>
                  <td className="px-2 py-1.5 tabular-nums">
                    {fmt(row.returns)}
                  </td>
                  <td className="px-2 py-1.5 tabular-nums font-medium">
                    {fmt(row.closingBalance)}
                  </td>
                  <td className="px-2 py-1.5 tabular-nums">
                    {fmt(row.inflationAdjustedBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <p className="text-xs text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/sip-calculator-systematic-investment-plan"
          className="text-primary underline-offset-2 hover:underline"
        >
          SIP Calculator
        </Link>
        {' · '}
        <Link
          href="/tools/compound-interest-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Compound Interest
        </Link>
        {' · '}
        <Link
          href="/tools/future-value-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Future Value
        </Link>
        {' · '}
        <Link
          href="/tools/inflation-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Inflation Calculator
        </Link>
      </p>
    </div>
  );
}
