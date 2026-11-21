'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { HraChart } from './HraChart';
import type { HraResult } from './types';

interface HraResultsProps {
  result: HraResult | null;
}

export function HraResults({ result }: HraResultsProps) {
  const [showSteps, setShowSteps] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(true);
  if (!result) return null;

  const fmt = (n: number) => formatCurrencyValue(n, result.currency);

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Your Estimated Annual HRA Exemption
      </h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedAnnualExempt}
      </p>
      <p className="text-sm text-muted-foreground">
        Annual Taxable HRA:{' '}
        <span className="font-medium tabular-nums text-accent">
          {result.formattedAnnualTaxable}
        </span>
      </p>

      {!result.claimable ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          HRA exemption is not available under the selected new tax regime.
        </p>
      ) : null}

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Tax-free HRA / month</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.monthlyExemptHRA)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Taxable HRA / month</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.monthlyTaxableHRA)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Qualifying salary / month</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.qualifyingSalaryMonthly)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Rent above 10% of salary</dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.rentAboveTenPercentMonthly)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            City limit ({result.applicableCityPercentage.toFixed(0)}%)
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {fmt(result.salaryPercentageLimitMonthly)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Eligible months</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.eligibleMonths}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Limiting condition</dt>
          <dd className="text-right text-xs font-medium text-accent">
            {result.limitingLabel}
          </dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.cityRuleNote}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>

      <HraChart
        actualHRA={result.actualHRAMonthly}
        exemptHRA={result.exemptHRAMonthly}
        taxableHRA={result.taxableHRAMonthly}
        currency={result.currency}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowBreakdown((v) => !v)}
          className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-accent hover:bg-muted/30"
        >
          {showBreakdown ? 'Hide' : 'Show'} breakdown
        </button>
        <button
          type="button"
          onClick={() => setShowSteps((v) => !v)}
          className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-accent hover:bg-muted/30"
        >
          {showSteps ? 'Hide' : 'Show'} step-by-step
        </button>
      </div>

      {showBreakdown ? (
        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full min-w-[280px] text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-muted-foreground">
                <th className="px-3 py-2 font-medium">Component</th>
                <th className="px-3 py-2 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {result.breakdown.map((row) => (
                <tr
                  key={row.label}
                  className={`border-b border-border/50 ${
                    row.isLimit ? 'bg-brand-softTeal/30' : ''
                  }`}
                >
                  <td className="px-3 py-1.5">
                    {row.label}
                    {row.isLimit ? (
                      <span className="ml-1 text-[10px] font-semibold text-primary">
                        (limit)
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-1.5 tabular-nums font-medium">
                    {fmt(row.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

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

      <p className="text-xs text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/epf-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          EPF Calculator
        </Link>
        {' · '}
        <Link
          href="/tools/gratuity-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Gratuity Calculator
        </Link>
        {' · '}
        <Link
          href="/tools/gross-to-net-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Gross to Net
        </Link>
        {' · '}
        <Link
          href="/tools/income-tax-calculator"
          className="text-primary underline-offset-2 hover:underline"
        >
          Income Tax Calculator
        </Link>
      </p>
    </div>
  );
}
