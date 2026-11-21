'use client';

import Link from 'next/link';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { DpoResult } from './types';

interface DpoResultsProps {
  result: DpoResult | null;
}

export function DpoResults({ result }: DpoResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Days payable outstanding summary
      </h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Average accounts payable</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedAverageAccountsPayable}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Purchases</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedPurchases}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Accounting period</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedAccountingPeriodDays} days
          </dd>
        </div>
        {result.formattedAccountsPayableTurnover !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">AP turnover</dt>
            <dd className="tabular-nums text-accent">
              {result.formattedAccountsPayableTurnover}× / period
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">DPO</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {result.formattedDaysPayableOutstanding} days
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        DPO = (Average AP / Purchases) × T
      </p>
      {result.warningMessage ? (
        <p className="mt-2 text-xs leading-relaxed text-amber-800" role="status">
          {result.warningMessage}
        </p>
      ) : null}
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        DPO is one component of the cash conversion cycle: CCC = DIO + DSO − DPO.
        See the{' '}
        <Link
          href="/tools/cash-conversion-cycle-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Conversion Cycle Calculator
        </Link>{' '}
        and{' '}
        <Link
          href="/tools/dio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DIO Calculator
        </Link>
        .
      </p>
    </div>
  );
}
