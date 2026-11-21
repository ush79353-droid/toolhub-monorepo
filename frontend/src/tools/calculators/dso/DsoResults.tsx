'use client';

import Link from 'next/link';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { DsoResult } from './types';

interface DsoResultsProps {
  result: DsoResult | null;
}

export function DsoResults({ result }: DsoResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);
  const salesLabel =
    result.salesBasis === 'netCreditSales' ? 'Net credit sales' : 'Total sales';

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Days sales outstanding summary
      </h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Average receivables</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedAverageAccountsReceivable}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">{salesLabel}</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {result.formattedActiveSales}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Accounting period</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedAccountingPeriodDays} days
          </dd>
        </div>
        {result.formattedAccountsReceivableTurnover !== null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">AR turnover</dt>
            <dd className="tabular-nums text-accent">
              {result.formattedAccountsReceivableTurnover}× / period
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">DSO</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {result.formattedDaysSalesOutstanding} days
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        DSO = (Average AR / Sales) × T
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
        DSO is one component of the cash conversion cycle: CCC = DIO + DSO − DPO.
        See{' '}
        <Link
          href="/tools/cash-conversion-cycle-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          CCC
        </Link>
        ,{' '}
        <Link
          href="/tools/dio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DIO
        </Link>
        , and{' '}
        <Link
          href="/tools/dpo-calculator-days-payable-outstanding"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DPO
        </Link>
        .
      </p>
    </div>
  );
}
