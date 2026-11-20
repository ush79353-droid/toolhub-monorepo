'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { formatBrMoney, formatBrPercent } from './calculation';
import type { BlendedRateResult } from './types';

interface BlendedRateResultsProps {
  result: BlendedRateResult | null;
}

export function BlendedRateResults({ result }: BlendedRateResultsProps) {
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Final result</h3>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Your blended interest rate is the weighted average of the rates
        associated with your entered balances. Larger balances have more
        influence on the result.
      </p>

      <dl className="space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="font-medium text-accent">Blended interest rate</dt>
          <dd className="text-lg font-semibold tabular-nums text-accent">
            {result.formattedBlendedRate}%
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="text-muted-foreground">Total balance</dt>
          <dd className="tabular-nums font-medium text-accent">
            {symbol}
            {result.formattedTotalBalance}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Number of loans</dt>
          <dd className="tabular-nums text-accent">{result.includedLoans}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Estimated annual interest</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedAnnualInterest}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Estimated monthly interest</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedMonthlyInterest}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Lowest / highest rate</dt>
          <dd className="tabular-nums text-accent">
            {formatBrPercent(result.minimumRate)}% /{' '}
            {formatBrPercent(result.maximumRate)}%
          </dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        R = Σ(Bᵢ × Rᵢ) / Σ(Bᵢ) · Annual ≈ Σ(Bᵢ × Rᵢ/100)
      </p>

      {result.warningMessage ? (
        <p className="text-xs leading-relaxed text-amber-800" role="status">
          {result.warningMessage}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>

      <div className="rounded-lg border border-border bg-white">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] font-semibold text-accent"
          aria-expanded={breakdownOpen}
          onClick={() => setBreakdownOpen((o) => !o)}
        >
          <span>Weighted contributions</span>
          <span className="text-xs font-normal text-muted-foreground">
            {breakdownOpen ? 'Hide' : 'Show'}
          </span>
        </button>
        {breakdownOpen ? (
          <div className="max-h-64 overflow-auto border-t border-border">
            <table className="w-full min-w-[22rem] text-left text-xs">
              <thead className="sticky top-0 bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-2 py-1.5 font-medium">Loan</th>
                  <th className="px-2 py-1.5 font-medium">Weight</th>
                  <th className="px-2 py-1.5 font-medium">Contribution</th>
                  <th className="px-2 py-1.5 font-medium">Annual int.</th>
                </tr>
              </thead>
              <tbody>
                {result.contributions.map((c) => (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-2 py-1">#{c.index}</td>
                    <td className="px-2 py-1 tabular-nums">
                      {formatBrPercent(c.weight * 100)}%
                    </td>
                    <td className="px-2 py-1 tabular-nums">
                      {formatBrPercent(c.rateContribution)} pp
                    </td>
                    <td className="px-2 py-1 tabular-nums">
                      {symbol}
                      {formatBrMoney(c.annualInterest, result.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
              Contribution is in percentage points (weight × rate).
            </p>
          </div>
        ) : null}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/interest-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Interest Rate
        </Link>
        {' · '}
        <Link
          href="/tools/apr-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          APR
        </Link>
        {' · '}
        <Link
          href="/tools/loan-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Loan
        </Link>
        {' · '}
        <Link
          href="/tools/amortization-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Amortization
        </Link>
        {' · '}
        <Link
          href="/tools/balance-transfer-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Balance Transfer
        </Link>
        .
      </p>
    </div>
  );
}
