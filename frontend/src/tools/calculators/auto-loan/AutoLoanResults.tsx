'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, ChevronUp, Copy, Info } from 'lucide-react';
import { AutoLoanChart } from './AutoLoanChart';
import { formatCurrencyValue, formatDisplayDate } from './calculation';
import type { AutoLoanResult } from './types';

interface AutoLoanResultsProps {
  result: AutoLoanResult | null;
  hasErrors: boolean;
  onCopy: () => Promise<void>;
  copied: boolean;
}

export function AutoLoanResults({ result, hasErrors, onCopy, copied }: AutoLoanResultsProps) {
  const [showBreakdown, setShowBreakdown] = React.useState(false);
  const [showChart, setShowChart] = React.useState(false);

  if (!result || hasErrors) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-5 text-center">
        <p className="text-sm font-medium text-accent">Review highlighted inputs</p>
        <p className="mt-1 text-xs font-normal leading-relaxed text-muted-foreground">
          Correct the validation message(s) above to refresh your estimated payments.
        </p>
      </div>
    );
  }

  const fmt = (value: number) => formatCurrencyValue(value, result.currency);
  const finalDiffers =
    result.monthlySchedule.length > 0 &&
    Math.abs(result.finalMonthlyPayment - result.estimatedMonthlyPayment) >= 0.01;

  return (
    <div className="space-y-3.5" aria-live="polite">
      {/* Subtle Mint-Highlighted Monthly Payment Card */}
      <div className="rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div>
            <p className="text-xs font-medium text-primary">Estimated Monthly Payment</p>
            <p className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-accent tabular-nums sm:text-[32px]">
              {fmt(result.estimatedMonthlyPayment)}
              <span className="ml-1.5 text-sm font-normal text-muted-foreground">/ mo</span>
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
          {result.amountFinanced === 0
            ? 'No loan balance required (upfront cash and trade-in equity cover total cost).'
            : `${result.totalMonths} monthly payments at ${result.annualInterestRate}% APR.`}
          {finalDiffers
            ? ` Final installment reconciles to ${fmt(result.finalMonthlyPayment)}.`
            : ''}
        </p>
      </div>

      {/* Symmetrical Secondary Results Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex min-h-[68px] flex-col justify-between rounded-xl border border-border bg-white p-3">
          <p className="text-xs font-normal text-muted-foreground">Amount Financed</p>
          <p className="mt-1 text-[15px] font-semibold text-accent tabular-nums sm:text-base">
            {fmt(result.amountFinanced)}
          </p>
        </div>

        <div className="flex min-h-[68px] flex-col justify-between rounded-xl border border-border bg-white p-3">
          <p className="text-xs font-normal text-muted-foreground">Total Interest</p>
          <p className="mt-1 text-[15px] font-semibold text-accent tabular-nums sm:text-base">
            {fmt(result.totalInterest)}
          </p>
        </div>

        <div className="flex min-h-[68px] flex-col justify-between rounded-xl border border-border bg-white p-3">
          <p className="text-xs font-normal text-muted-foreground">Total Payments</p>
          <p className="mt-1 text-[15px] font-semibold text-accent tabular-nums sm:text-base">
            {fmt(result.totalLoanPayments)}
          </p>
        </div>

        <div className="flex min-h-[68px] flex-col justify-between rounded-xl border border-border bg-white p-3">
          <p className="text-xs font-normal text-muted-foreground">Upfront Costs</p>
          <p className="mt-1 text-[15px] font-semibold text-accent tabular-nums sm:text-base">
            {fmt(result.upfrontCosts)}
          </p>
        </div>

        <div className="flex min-h-[68px] flex-col justify-between rounded-xl border border-border bg-white p-3">
          <p className="text-xs font-normal text-muted-foreground">Total Estimated Cost</p>
          <p className="mt-1 text-[15px] font-semibold text-accent tabular-nums sm:text-base">
            {fmt(result.totalEstimatedCost)}
          </p>
        </div>

        <div className="flex min-h-[68px] flex-col justify-between rounded-xl border border-border bg-white p-3">
          <p className="text-xs font-normal text-muted-foreground">Payoff Date</p>
          <p className="mt-1 text-[15px] font-semibold text-accent tabular-nums sm:text-base">
            {formatDisplayDate(result.payoffDate)}
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
            <AutoLoanChart
              principal={result.amountFinanced}
              totalInterest={result.totalInterest}
              principalRatioPercent={result.principalRatioPercent}
              interestRatioPercent={result.interestRatioPercent}
              currency={result.currency}
            />
          </div>
        )}

        {showBreakdown && (
          <div className="border-t border-border px-4 pb-3 pt-2">
            <dl className="divide-y divide-border text-xs">
              <div className="flex items-center justify-between gap-2 py-2">
                <dt className="font-normal text-muted-foreground">Vehicle Price</dt>
                <dd className="font-medium text-foreground tabular-nums">
                  {fmt(result.autoPrice)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2 py-2">
                <dt className="font-normal text-muted-foreground">
                  Down Payment ({result.downPaymentPercentOfPrice}%)
                </dt>
                <dd className="font-medium text-foreground tabular-nums">
                  −{fmt(result.downPaymentAmount)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2 py-2">
                <dt className="font-normal text-muted-foreground">Net Trade-in Equity</dt>
                <dd
                  className={`font-medium tabular-nums ${
                    result.tradeInEquityStatus === 'negative' ? 'text-amber-700' : 'text-foreground'
                  }`}
                >
                  {result.netTradeInEquity >= 0
                    ? `−${fmt(result.netTradeInEquity)}`
                    : `+${fmt(Math.abs(result.netTradeInEquity))} rolled in`}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2 py-2">
                <dt className="font-normal text-muted-foreground">
                  Sales Tax ({result.financedSalesTax > 0 ? 'financed' : 'upfront'})
                </dt>
                <dd className="font-medium text-foreground tabular-nums">{fmt(result.salesTax)}</dd>
              </div>
              <div className="flex items-center justify-between gap-2 py-2">
                <dt className="font-normal text-muted-foreground">
                  Additional Fees ({result.financedFees > 0 ? 'financed' : 'upfront'})
                </dt>
                <dd className="font-medium text-foreground tabular-nums">
                  {fmt(result.additionalFees)}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      {/* Estimate Note */}
      <div className="flex items-start gap-2 rounded-xl border border-border bg-background/70 px-3.5 py-2.5 text-xs font-normal leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
        <p>
          Estimates only. Actual lender APR, fees, and local sales tax rules vary by dealership and
          jurisdiction.
        </p>
      </div>
    </div>
  );
}
