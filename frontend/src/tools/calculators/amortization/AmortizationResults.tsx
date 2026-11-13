'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy, Calendar, Sparkles } from 'lucide-react';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { AmortizationChart } from './AmortizationChart';
import { AmortizationScheduleTable } from './AmortizationScheduleTable';
import {
  buildAmortizationSummaryText,
  formatCurrencyValue,
  formatDisplayDate,
} from './calculation';
import type { AmortizationInput, AmortizationResult } from './types';

interface AmortizationResultsProps {
  input: AmortizationInput;
  result: AmortizationResult;
}

export function AmortizationResults({ input, result }: AmortizationResultsProps) {
  const [copied, setCopied] = React.useState(false);
  const fmt = (val: number) => formatCurrencyValue(val, result.currency);
  const hasExtra = result.totalExtraPaymentAmount > 0;

  const handleCopy = async () => {
    const text = buildAmortizationSummaryText(input, result);
    const ok = await copyTextToClipboard(text);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const paymentFrequencyLabel =
    result.paymentFrequency === 'biweekly'
      ? 'Biweekly'
      : result.paymentFrequency === 'weekly'
      ? 'Weekly'
      : result.paymentFrequency === 'quarterly'
      ? 'Quarterly'
      : result.paymentFrequency === 'semiannually'
      ? 'Semi-Annual'
      : result.paymentFrequency === 'annually'
      ? 'Annual'
      : 'Monthly';

  return (
    <div className="space-y-6">
      {/* Top Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Regular Payment */}
        <div className="rounded-xl border border-border bg-white p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Regular Payment</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold bg-muted px-1.5 py-0.5 rounded">
              {paymentFrequencyLabel}
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-accent tabular-nums">
            {fmt(result.regularPayment)}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {result.scheduledPaymentsCount} scheduled payments
          </p>
          <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-bl-full pointer-events-none" />
        </div>

        {/* Total Interest Paid */}
        <div className="rounded-xl border border-border bg-white p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Interest</span>
            <span className="text-[10px] font-semibold text-accent tabular-nums">
              {result.interestRatioPercent}% of cost
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-accent tabular-nums">
            {fmt(result.totalInterestPaid)}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Cost of borrowing over term
          </p>
        </div>

        {/* Total Amount Paid */}
        <div className="rounded-xl border border-border bg-white p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Paid</span>
            <span className="text-[10px] text-muted-foreground">Principal + Interest</span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground tabular-nums">
            {fmt(result.totalAmountPaid)}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Principal: {fmt(result.loanAmount)}
          </p>
        </div>

        {/* Payoff Date */}
        <div className="rounded-xl border border-border bg-white p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Payoff Date</span>
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="mt-2 text-xl font-bold tracking-tight text-primary tabular-nums">
            {formatDisplayDate(result.payoffDate)}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {hasExtra && result.paymentsSaved > 0
              ? `${result.paymentsSaved} payments saved`
              : 'On regular schedule'}
          </p>
        </div>
      </div>

      {/* Extra Payments Highlight Card (if active) */}
      {hasExtra && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-emerald-600 p-2 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-emerald-950">
                  Extra Payment Acceleration & Savings
                </h4>
                <p className="text-xs text-emerald-800">
                  You are contributing a total of{' '}
                  <strong>{fmt(result.totalExtraPaymentAmount)}</strong> in extra principal payments.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t sm:border-t-0 border-emerald-200/60 pt-2 sm:pt-0">
              <div>
                <span className="block text-[11px] text-emerald-800 font-medium">Interest Saved</span>
                <span className="text-base font-bold text-emerald-700 tabular-nums">
                  {fmt(result.interestSavings)}
                </span>
              </div>
              {result.timeSavedDescription && (
                <div className="border-l border-emerald-200 pl-4">
                  <span className="block text-[11px] text-emerald-800 font-medium">Time Saved</span>
                  <span className="text-base font-bold text-emerald-700">
                    {result.timeSavedDescription}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Balance & Breakdown Chart */}
      <AmortizationChart
        principal={result.loanAmount}
        totalInterest={result.totalInterestPaid}
        principalRatioPercent={result.principalRatioPercent}
        interestRatioPercent={result.interestRatioPercent}
        currency={result.currency}
        chartPoints={result.chartPoints}
        hasExtraPayments={hasExtra}
      />

      {/* Key Metrics Summary Grid */}
      <div className="rounded-xl border border-border bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <h3 className="text-sm font-semibold text-accent">Amortization Details & Rates</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-8 gap-1.5 text-xs border-border hover:bg-muted"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Summary
              </>
            )}
          </Button>
        </div>

        <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-3 text-xs">
          <div className="rounded-lg border border-border/70 bg-muted/20 p-2.5">
            <dt className="text-muted-foreground font-normal">Original Principal</dt>
            <dd className="mt-0.5 font-semibold text-foreground tabular-nums">
              {fmt(result.loanAmount)}
            </dd>
          </div>

          <div className="rounded-lg border border-border/70 bg-muted/20 p-2.5">
            <dt className="text-muted-foreground font-normal">Nominal Rate (APR)</dt>
            <dd className="mt-0.5 font-semibold text-foreground tabular-nums">
              {result.annualInterestRate.toFixed(2)}%
            </dd>
          </div>

          <div className="rounded-lg border border-border/70 bg-muted/20 p-2.5">
            <dt className="text-muted-foreground font-normal">Effective Rate (EAR / APY)</dt>
            <dd className="mt-0.5 font-semibold text-foreground tabular-nums">
              {(result.effectiveAnnualRate * 100).toFixed(3)}%
            </dd>
          </div>

          <div className="rounded-lg border border-border/70 bg-muted/20 p-2.5">
            <dt className="text-muted-foreground font-normal">Periodic Interest Rate</dt>
            <dd className="mt-0.5 font-semibold text-foreground tabular-nums">
              {(result.periodicRate * 100).toFixed(4)}% / period
            </dd>
          </div>

          <div className="rounded-lg border border-border/70 bg-muted/20 p-2.5">
            <dt className="text-muted-foreground font-normal">Compounding</dt>
            <dd className="mt-0.5 font-semibold text-foreground capitalize">
              {result.compoundingFrequency} ({result.compoundingPeriodsPerYear}/yr)
            </dd>
          </div>

          <div className="rounded-lg border border-border/70 bg-muted/20 p-2.5">
            <dt className="text-muted-foreground font-normal">Payment Frequency</dt>
            <dd className="mt-0.5 font-semibold text-foreground capitalize">
              {result.paymentFrequency} ({result.paymentPeriodsPerYear}/yr)
            </dd>
          </div>

          <div className="rounded-lg border border-border/70 bg-muted/20 p-2.5">
            <dt className="text-muted-foreground font-normal">Total Payments Count</dt>
            <dd className="mt-0.5 font-semibold text-foreground tabular-nums">
              {result.actualPaymentsCount} of {result.scheduledPaymentsCount}
            </dd>
          </div>

          <div className="rounded-lg border border-border/70 bg-muted/20 p-2.5">
            <dt className="text-muted-foreground font-normal">Extra Principal Paid</dt>
            <dd className="mt-0.5 font-semibold text-foreground tabular-nums">
              {fmt(result.totalExtraPaymentAmount)}
            </dd>
          </div>
        </dl>
      </div>

      {/* Complete Amortization Schedule Table */}
      <AmortizationScheduleTable result={result} />
    </div>
  );
}
