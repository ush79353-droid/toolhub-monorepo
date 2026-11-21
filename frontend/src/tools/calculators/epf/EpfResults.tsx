'use client';

import { useState } from 'react';
import Link from 'next/link';
import { downloadTextFile } from '@/tools/shared/download';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { buildEpfScheduleCsv, formatPercent } from './calculation';
import { EpfChart } from './EpfChart';
import type { EpfResult } from './types';

interface EpfResultsProps {
  result: EpfResult | null;
}

export function EpfResults({ result }: EpfResultsProps) {
  const [showSteps, setShowSteps] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  if (!result) return null;

  const fmt = (n: number) => formatCurrencyValue(n, result.currency);
  const m = result.firstMonth;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Your EPF Results</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedMaturity}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          est. maturity
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Years to retirement</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.yearsToRetirement}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Employee EPF / month</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(m.employeeContribution)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Employer EPF / month</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(m.employerEPFContribution)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">EPS / month (separate)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(m.epsContribution)}
          </dd>
        </div>
        {m.vpfContribution > 0 ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">VPF / month</dt>
            <dd className="tabular-nums font-medium text-accent">
              {fmt(m.vpfContribution)}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total monthly EPF deposit</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedMonthlyEPF}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total interest earned</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedInterest}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Future employee deposits</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.totalEmployeeContributions)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Future employer EPF deposits</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.totalEmployerEPFContributions)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total projected EPS</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.totalEPSContributions)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Opening EPF balance</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.existingEPFBalance)}
          </dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>

      <EpfChart schedule={result.yearlySchedule} currency={result.currency} />

      {result.comparison ? (
        <div className="rounded-lg border border-border bg-white px-3 py-2 text-xs">
          <p className="font-medium text-accent">Scenario comparison</p>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[280px] text-left">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-1 pr-2 font-medium">Metric</th>
                  <th className="py-1 pr-2 font-medium">Base</th>
                  <th className="py-1 font-medium">Alternate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/60">
                  <td className="py-1 pr-2">Maturity</td>
                  <td className="tabular-nums">
                    {fmt(result.comparison.base.maturityValue)}
                  </td>
                  <td className="tabular-nums">
                    {fmt(result.comparison.alt.maturityValue)}
                  </td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-1 pr-2">Interest</td>
                  <td className="tabular-nums">
                    {fmt(result.comparison.base.totalInterestEarned)}
                  </td>
                  <td className="tabular-nums">
                    {fmt(result.comparison.alt.totalInterestEarned)}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2">Years</td>
                  <td className="tabular-nums">
                    {result.comparison.base.yearsToRetirement}
                  </td>
                  <td className="tabular-nums">
                    {result.comparison.alt.yearsToRetirement}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-muted-foreground">
            Maturity difference (alt − base):{' '}
            <span className="font-medium text-accent">
              {fmt(result.comparison.maturityDiff)}
            </span>
. Fees, eligibility, and affordability also matter; this is not a
            recommendation.
          </p>
        </div>
      ) : null}

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
          {showSchedule ? 'Hide' : 'Show'} yearly schedule
        </button>
        <button
          type="button"
          onClick={() =>
            downloadTextFile(
              buildEpfScheduleCsv(result.yearlySchedule, result.currency),
              'epf-projection.csv',
            )
          }
          className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Download CSV
        </button>
      </div>

      {showSteps ? (
        <div className="rounded-lg border border-border bg-white px-3 py-2">
          <p className="text-xs font-medium text-accent">
            Step-by-step ({formatPercent(result.annualInterestRate)} interest
            assumption)
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-muted-foreground">
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
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-muted-foreground">
                <th className="px-2 py-2 font-medium">Age</th>
                <th className="px-2 py-2 font-medium">Employee</th>
                <th className="px-2 py-2 font-medium">Employer EPF</th>
                <th className="px-2 py-2 font-medium">EPS</th>
                <th className="px-2 py-2 font-medium">Interest</th>
                <th className="px-2 py-2 font-medium">Closing EPF</th>
              </tr>
            </thead>
            <tbody>
              {result.yearlySchedule.map((row) => (
                <tr key={row.year} className="border-b border-border/50">
                  <td className="px-2 py-1.5 tabular-nums">{row.age}</td>
                  <td className="px-2 py-1.5 tabular-nums">
                    {fmt(row.employeeContributions)}
                  </td>
                  <td className="px-2 py-1.5 tabular-nums">
                    {fmt(row.employerEPFContributions)}
                  </td>
                  <td className="px-2 py-1.5 tabular-nums">
                    {fmt(row.epsContributions)}
                  </td>
                  <td className="px-2 py-1.5 tabular-nums">
                    {fmt(row.interestEarned)}
                  </td>
                  <td className="px-2 py-1.5 tabular-nums font-medium">
                    {fmt(row.closingBalance)}
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
          href="/tools/gratuity-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Gratuity Calculator
        </Link>
        {' · '}
        <Link
          href="/tools/sip-calculator"
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
      </p>
    </div>
  );
}
