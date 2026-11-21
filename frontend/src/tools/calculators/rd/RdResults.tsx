'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getCurrencySymbol } from '@/tools/shared/currency';
import type { RdResult } from './types';

interface RdResultsProps {
  result: RdResult | null;
}

export function RdResults({ result }: RdResultsProps) {
  const [showSteps, setShowSteps] = useState(false);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Maturity amount</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {getCurrencySymbol(result.maturityCurrency)}
        {result.formattedMaturity}
      </p>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total deposits</dt>
          <dd className="tabular-nums font-medium text-accent">
            {getCurrencySymbol(result.totalDepositsCurrency)}
            {result.formattedTotalDeposits}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total interest</dt>
          <dd className="tabular-nums font-medium text-accent">
            {getCurrencySymbol(result.totalInterestCurrency)}
            {result.formattedTotalInterest}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Term</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.months} months ({result.quarters} quarters)
          </dd>
        </div>
      </dl>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.compoundingNote}
      </p>
      <button
        type="button"
        onClick={() => setShowSteps((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSteps ? 'Hide calculation steps' : 'Show calculation steps'}
      </button>
      {showSteps ? (
        <pre className="whitespace-pre-wrap rounded-lg border border-border bg-white px-3 py-2 font-mono text-[11px] text-accent">
          {result.formulaBreakdown}
        </pre>
      ) : null}
      <p className="text-xs text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/sip-calculator-systematic-investment-plan"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          SIP Calculator
        </Link>
      </p>
    </div>
  );
}
