'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import { MortgagePrepaymentChart } from './MortgagePrepaymentChart';
import type { MortgagePrepaymentResult, ScheduleSummary } from './types';

interface MortgagePrepaymentResultsProps {
  result: MortgagePrepaymentResult | null;
}

function SummaryColumn({
  title,
  summary,
  symbol,
}: {
  title: string;
  summary: ScheduleSummary;
  symbol: string;
}) {
  return (
    <div className="min-w-0 flex-1 space-y-2">
      <h4 className="text-[13px] font-semibold text-accent">{title}</h4>
      <dl className="space-y-1.5 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Payoff date</dt>
          <dd className="tabular-nums text-accent">{summary.formattedPayoffDate}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Payment</dt>
          <dd className="text-right tabular-nums text-accent">
            {symbol}
            {summary.formattedPeriodicPayment} {summary.paymentAdverb}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground"># payments</dt>
          <dd className="tabular-nums text-accent">{summary.paymentCount}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Repayment term</dt>
          <dd className="tabular-nums text-accent">{summary.formattedTerm}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Total interest</dt>
          <dd className="tabular-nums text-accent">
            {symbol}
            {summary.formattedTotalInterest}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Total payment</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {symbol}
            {summary.formattedTotalPayment}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function MortgagePrepaymentResults({
  result,
}: MortgagePrepaymentResultsProps) {
  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);

  return (
    <div className="space-y-4">
      <fieldset className="space-y-3 rounded-xl border border-border p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Prepayment summary
        </legend>

        {!result.hasPrepayments ? (
          <p className="text-xs text-muted-foreground">
            You need to set additional periodic or lump-sum prepayment to induce
            changes in your original repayment schedule.
          </p>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <SummaryColumn
            title="With current schedule"
            summary={result.baseline}
            symbol={symbol}
          />
          {result.hasPrepayments && result.prepaid ? (
            <SummaryColumn
              title="With prepayments"
              summary={result.prepaid}
              symbol={symbol}
            />
          ) : null}
        </div>
      </fieldset>

      <MortgagePrepaymentChart points={result.chart} currency={result.currency} />
    </div>
  );
}
