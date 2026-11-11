'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, ChevronUp, Copy, Info } from 'lucide-react';
import {
  formatCurrencyValue,
  formatDisplayDate,
  getFrequencyPeriodLabel,
  getFrequencyUnitSuffix,
} from './calculation';
import { LoanChart } from './LoanChart';
import type { LoanResult } from './types';

interface LoanResultsProps {
  result: LoanResult | null;
  hasErrors: boolean;
  onCopy: () => Promise<void>;
  copied: boolean;
}

export function LoanResults({ result, hasErrors, onCopy, copied }: LoanResultsProps) {
  const [showBreakdown, setShowBreakdown] = React.useState(false);
  const [showChart, setShowChart] = React.useState(false);

  if (!result || hasErrors) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-5 text-center">
        <p className="text-sm font-medium text-accent">Review highlighted inputs</p>
        <p className="mt-1 text-xs font-normal leading-relaxed text-muted-foreground">
          Correct the validation message(s) above to refresh your loan estimate.
        </p>
      </div>
    );
  }

  const fmt = (value: number) => formatCurrencyValue(value, result.currency);
  const unitSuffix = getFrequencyUnitSuffix(result.paymentFrequency);
  const freqLabel = getFrequencyPeriodLabel(result.paymentFrequency).toLowerCase();
  const isInterestOnly = result.loanMode === 'interest-only';
  const isFullTermIo = isInterestOnly && result.interestOnlyPeriods >= result.scheduledPaymentsCount;
  const finalDiffers =
    !isInterestOnly &&
    result.schedule.length > 0 &&
    Math.abs(result.finalPayment - result.regularPayment) >= 0.01;

  // Determine the 6th metric card so the 2x3 grid stays balanced and mode-accurate
  let sixthLabel = 'Remaining Balance';
  let sixthValue = fmt(result.remainingBalanceAtEnd);
  let sixthHighlightClass = 'text-accent';

  if (result.interestSavings > 0) {
    sixthLabel = 'Interest Savings';
    sixthValue = fmt(result.interestSavings);
    sixthHighlightClass = 'text-emerald-700';
  } else if (isInterestOnly) {
    if (result.postInterestOnlyPayment !== null) {
      sixthLabel = 'After I/O Period';
      sixthValue = `${fmt(result.postInterestOnlyPayment)} ${unitSuffix}`;
      sixthHighlightClass = 'text-primary';
    } else {
      sixthLabel = 'Principal Due at End';
      sixthValue = fmt(result.remainingBalanceAtEnd);
      sixthHighlightClass = 'text-amber-700';
    }
  } else if (result.originationFeeAmount > 0) {
    sixthLabel = `Origination Fee (${result.financedFeeAmount > 0 ? 'financed' : 'upfront'})`;
    sixthValue = fmt(result.originationFeeAmount);
    sixthHighlightClass = 'text-accent';
  }

  return (
    <div className="space-y-3.5" aria-live="polite">
      {/* Subtle Mint-Highlighted Primary Payment Card */}
      <div className="rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div>
            <p className="text-xs font-medium text-primary">
              {isInterestOnly ? 'Interest-Only Payment' : 'Estimated Regular Payment'}
            </p>
            <p className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-accent tabular-nums sm:text-[32px]">
              {fmt(result.regularPayment)}
              <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                {unitSuffix}
              </span>
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void onCopy()}
            className="h-8 bg-white px-2.5 text-xs font-medium"
          >
            {copied ? (
              <>
                <Check className="mr-1 h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                <span className="font-medium text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                <span>Copy Results</span>
              </>
            )}
          </Button>
        </div>

        <p className="mt-2 text-xs font-normal leading-relaxed text-muted-foreground">
          {isFullTermIo
            ? `${result.actualPaymentsCount} ${freqLabel} interest-only payments at ${result.annualInterestRate}% APR. ${fmt(result.remainingBalanceAtEnd)} principal remains due at maturity.`
            : isInterestOnly && result.postInterestOnlyPayment !== null
              ? `${result.interestOnlyPeriods} ${freqLabel} interest-only payments, then ${Math.max(0, result.actualPaymentsCount - result.interestOnlyPeriods)} amortized payments of ${fmt(result.postInterestOnlyPayment)} ${unitSuffix}.`
              : `${result.actualPaymentsCount} ${freqLabel} payments at ${result.annualInterestRate}% APR.`}
          {finalDiffers ? ` Final payment reconciles to ${fmt(result.finalPayment)}.` : ''}
          {result.paymentsSaved > 0
            ? ` Extra payments cut ${result.paymentsSaved} scheduled payment${result.paymentsSaved === 1 ? '' : 's'}.`
            : ''}
        </p>
      </div>

      {/* Symmetrical Secondary Results Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex min-h-[68px] flex-col justify-between rounded-xl border border-border bg-white p-3">
          <p className="text-xs font-normal text-muted-foreground">Original Loan Amount</p>
          <p className="mt-1 text-[15px] font-semibold text-accent tabular-nums sm:text-base">
            {fmt(result.originalLoanAmount)}
          </p>
        </div>

        <div className="flex min-h-[68px] flex-col justify-between rounded-xl border border-border bg-white p-3">
          <p className="text-xs font-normal text-muted-foreground">Total Interest</p>
          <p className="mt-1 text-[15px] font-semibold text-accent tabular-nums sm:text-base">
            {fmt(result.totalInterest)}
          </p>
        </div>

        <div className="flex min-h-[68px] flex-col justify-between rounded-xl border border-border bg-white p-3">
          <p className="text-xs font-normal text-muted-foreground">Total Paid</p>
          <p className="mt-1 text-[15px] font-semibold text-accent tabular-nums sm:text-base">
            {fmt(result.totalPaid)}
          </p>
        </div>

        <div className="flex min-h-[68px] flex-col justify-between rounded-xl border border-border bg-white p-3">
          <p className="text-xs font-normal text-muted-foreground">Number of Payments</p>
          <p className="mt-1 text-[15px] font-semibold text-accent tabular-nums sm:text-base">
            {result.paymentsSaved > 0
              ? `${result.actualPaymentsCount} of ${result.scheduledPaymentsCount}`
              : result.actualPaymentsCount}
          </p>
        </div>

        <div className="flex min-h-[68px] flex-col justify-between rounded-xl border border-border bg-white p-3">
          <p className="text-xs font-normal text-muted-foreground">
            {result.remainingBalanceAtEnd > 0 ? 'Maturity Date' : 'Estimated Payoff Date'}
          </p>
          <p className="mt-1 text-[15px] font-semibold text-accent tabular-nums sm:text-base">
            {formatDisplayDate(result.payoffDate)}
          </p>
        </div>

        <div className="flex min-h-[68px] flex-col justify-between rounded-xl border border-border bg-white p-3">
          <p className="text-xs font-normal text-muted-foreground">{sixthLabel}</p>
          <p
            className={`mt-1 text-[15px] font-semibold tabular-nums sm:text-base ${sixthHighlightClass}`}
          >
            {sixthValue}
          </p>
        </div>
      </div>

      {/* Principal vs. Interest Summary Bar + Expandable Chart & Breakdown */}
      <div className="rounded-xl border border-border bg-white">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-medium text-accent">
              Principal {result.principalRatioPercent.toFixed(1)}% · Interest{' '}
              {result.interestRatioPercent.toFixed(1)}%
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-expanded={showChart}
                onClick={() => setShowChart((prev) => !prev)}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>{showChart ? 'Hide Chart' : 'Chart'}</span>
                {showChart ? (
                  <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                aria-expanded={showBreakdown}
                onClick={() => setShowBreakdown((prev) => !prev)}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>{showBreakdown ? 'Hide Breakdown' : 'Breakdown'}</span>
                {showBreakdown ? (
                  <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <div
            className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-secondary"
            aria-hidden="true"
          >
            <div
              className="h-full bg-primary"
              style={{ width: `${Math.min(100, Math.max(0, result.principalRatioPercent))}%` }}
            />
            <div
              className="h-full bg-accent"
              style={{ width: `${Math.min(100, Math.max(0, result.interestRatioPercent))}%` }}
            />
          </div>
        </div>

        {showChart && (
          <div className="border-t border-border p-3.5">
            <LoanChart
              principal={result.scheduleTotals.totalPrincipal}
              totalInterest={result.totalInterest}
              principalRatioPercent={result.principalRatioPercent}
              interestRatioPercent={result.interestRatioPercent}
              currency={result.currency}
              balanceCurve={result.balanceCurve}
              hasExtraPayments={result.hasExtraPayments && result.interestSavings > 0}
            />
          </div>
        )}

        {showBreakdown && (
          <div className="border-t border-border px-4 pb-3 pt-2">
            <dl className="divide-y divide-border text-xs">
              <div className="flex items-center justify-between gap-2 py-2">
                <dt className="font-normal text-muted-foreground">Original Loan Amount</dt>
                <dd className="font-medium text-foreground tabular-nums">
                  {fmt(result.originalLoanAmount)}
                </dd>
              </div>
              {result.originationFeeAmount > 0 && (
                <div className="flex items-center justify-between gap-2 py-2">
                  <dt className="font-normal text-muted-foreground">
                    Origination Fee ({result.financedFeeAmount > 0 ? 'financed' : 'upfront'})
                  </dt>
                  <dd className="font-medium text-foreground tabular-nums">
                    {fmt(result.originationFeeAmount)}
                  </dd>
                </div>
              )}
              <div className="flex items-center justify-between gap-2 py-2">
                <dt className="font-normal text-muted-foreground">Amount Financed</dt>
                <dd className="font-medium text-foreground tabular-nums">
                  {fmt(result.amountFinanced)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2 py-2">
                <dt className="font-normal text-muted-foreground">Scheduled Regular Payments</dt>
                <dd className="font-medium text-foreground tabular-nums">
                  {fmt(result.totalRegularPayments)}
                </dd>
              </div>
              {result.totalExtraPayments > 0 && (
                <div className="flex items-center justify-between gap-2 py-2">
                  <dt className="font-normal text-muted-foreground">Extra Principal Applied</dt>
                  <dd className="font-medium text-primary tabular-nums">
                    {fmt(result.totalExtraPayments)}
                  </dd>
                </div>
              )}
              {result.interestSavings > 0 && (
                <div className="flex items-center justify-between gap-2 py-2">
                  <dt className="font-normal text-muted-foreground">
                    Interest Saved (vs. {fmt(result.baselineTotalInterest)})
                  </dt>
                  <dd className="font-medium text-emerald-700 tabular-nums">
                    −{fmt(result.interestSavings)}
                  </dd>
                </div>
              )}
              {result.upfrontFeeAmount > 0 && (
                <div className="flex items-center justify-between gap-2 py-2">
                  <dt className="font-normal text-muted-foreground">Total Paid + Upfront Fee</dt>
                  <dd className="font-medium text-accent tabular-nums">
                    {fmt(result.totalCostWithFees)}
                  </dd>
                </div>
              )}
              {isInterestOnly && result.remainingBalanceAfterIo !== null && (
                <div className="flex items-center justify-between gap-2 py-2">
                  <dt className="font-normal text-muted-foreground">
                    Remaining Principal After I/O Period
                  </dt>
                  <dd className="font-medium text-foreground tabular-nums">
                    {fmt(result.remainingBalanceAfterIo)}
                  </dd>
                </div>
              )}
              <div className="flex items-center justify-between gap-2 py-2">
                <dt className="font-normal text-muted-foreground">Remaining Balance at End</dt>
                <dd
                  className={`font-medium tabular-nums ${
                    result.remainingBalanceAtEnd > 0 ? 'text-amber-700' : 'text-foreground'
                  }`}
                >
                  {fmt(result.remainingBalanceAtEnd)}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      {/* Estimation Note */}
      <div className="flex items-start gap-2 rounded-xl border border-border bg-background/70 px-3.5 py-2.5 text-xs font-normal leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
        <p>
          Estimates only. Nominal APR is divided by {result.paymentsPerYear} periods per year. Actual
          lender interest accrual, fees, and rounding rules may vary.
        </p>
      </div>
    </div>
  );
}

