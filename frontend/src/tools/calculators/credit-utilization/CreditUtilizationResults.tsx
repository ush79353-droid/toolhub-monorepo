'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { formatCuMoney, formatCuPercent } from './calculation';
import type { CreditUtilizationResult } from './types';

interface CreditUtilizationResultsProps {
  result: CreditUtilizationResult | null;
}

export function CreditUtilizationResults({
  result,
}: CreditUtilizationResultsProps) {
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);
  const barWidth = Math.min(100, Math.max(0, result.overallUtilization));

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Final result</h3>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Overall credit utilization is total revolving balances divided by total
        revolving credit limits. Larger limits weigh more in the aggregate
        ratio than small cards with high individual percentages.
      </p>

      <dl className="space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="font-medium text-accent">Overall credit utilization</dt>
          <dd className="text-lg font-semibold tabular-nums text-accent">
            {result.formattedUtilization}%
          </dd>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
          role="presentation"
          aria-hidden
        >
          <div
            className={`h-full rounded-full ${
              result.overallUtilization > 100
                ? 'bg-rose-500'
                : result.overallUtilization >= 75
                  ? 'bg-amber-500'
                  : 'bg-primary'
            }`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {result.interpretationBand}
        </p>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="text-muted-foreground">Total credit used</dt>
          <dd className="tabular-nums font-medium text-accent">
            {symbol}
            {result.formattedTotalUsed}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total credit limit</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedTotalLimit}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            {result.remainingAvailableCredit < 0
              ? 'Over-limit amount'
              : 'Available credit'}
          </dt>
          <dd
            className={`tabular-nums text-accent ${
              result.remainingAvailableCredit < 0 ? 'text-rose-700' : ''
            }`}
          >
            {symbol}
            {result.remainingAvailableCredit < 0
              ? formatCuMoney(result.overLimitAmount, result.currency)
              : result.formattedAvailable}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Credit lines</dt>
          <dd className="tabular-nums text-accent">{result.creditLineCount}</dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="text-muted-foreground">Target utilization</dt>
          <dd className="tabular-nums text-accent">
            {formatCuPercent(result.targetUtilization)}%
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Target used balance</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedTargetBalance}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Balance reduction needed</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedReduction}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Additional limit needed</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedAdditionalLimit === null
              ? 'N/A'
              : `${symbol}${result.formattedAdditionalLimit}`}
          </dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        CU = ΣUᵢ / ΣLᵢ × 100 · TargetUsed = L × T/100
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
          <span>Per-card utilization</span>
          <span className="text-xs font-normal text-muted-foreground">
            {breakdownOpen ? 'Hide' : 'Show'}
          </span>
        </button>
        {breakdownOpen ? (
          <div className="max-h-64 overflow-auto border-t border-border">
            <table className="w-full min-w-[22rem] text-left text-xs">
              <thead className="sticky top-0 bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-2 py-1.5 font-medium">Line</th>
                  <th className="px-2 py-1.5 font-medium">Used</th>
                  <th className="px-2 py-1.5 font-medium">Limit</th>
                  <th className="px-2 py-1.5 font-medium">Util.</th>
                </tr>
              </thead>
              <tbody>
                {result.creditLineResults.map((c) => (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-2 py-1">#{c.index}</td>
                    <td className="px-2 py-1 tabular-nums">
                      {symbol}
                      {formatCuMoney(c.moneyUsed, result.currency)}
                    </td>
                    <td className="px-2 py-1 tabular-nums">
                      {symbol}
                      {formatCuMoney(c.creditLimit, result.currency)}
                    </td>
                    <td className="px-2 py-1 tabular-nums">
                      {formatCuPercent(c.utilizationPercentage)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/apr-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          APR
        </Link>
        {' · '}
        <Link
          href="/tools/credit-card-payoff-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Credit Card Payoff
        </Link>
        {' · '}
        <Link
          href="/tools/balance-transfer-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Balance Transfer
        </Link>
        {' · '}
        <Link
          href="/tools/credit-card-interest-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Credit Card Interest
        </Link>
        {' · '}
        <Link
          href="/tools/interest-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Interest
        </Link>
        .
      </p>
    </div>
  );
}
