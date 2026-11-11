'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Check, Copy, Info } from 'lucide-react';
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
  if (!result || hasErrors) {
    return (
      <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-5 text-center">
        <p className="text-sm font-bold text-accent">Review Highlighted Inputs</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Correct the validation message(s) above and click Calculate to refresh your payment
          results.
        </p>
      </div>
    );
  }

  const fmt = (value: number) => formatCurrencyValue(value, result.currency);
  const finalDiffers =
    result.monthlySchedule.length > 0 &&
    Math.abs(result.finalMonthlyPayment - result.estimatedMonthlyPayment) >= 0.01;

  return (
    <div className="space-y-4" aria-live="polite">
      {/* Primary Monthly Payment Card */}
      <div className="rounded-xl border border-primary/25 bg-brand-softTeal p-4">
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Monthly Payment
            </p>
            <p className="mt-1 text-2xl font-black tracking-tight text-accent tabular-nums sm:text-3xl">
              {fmt(result.estimatedMonthlyPayment)}
              <span className="ml-1 text-xs font-semibold text-muted-foreground">/ mo</span>
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void onCopy()}
            className="h-8 bg-white px-2.5 text-xs"
          >
            {copied ? (
              <>
                <Check className="mr-1 h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                <span className="font-semibold text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                <span>Copy Results</span>
              </>
            )}
          </Button>
        </div>

        <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
          {result.amountFinanced === 0
            ? 'No loan balance required (upfront cash and trade-in equity cover total cost).'
            : `${result.totalMonths} monthly payments at ${result.annualInterestRate}% APR.`}
          {finalDiffers
            ? ` Final month adjusts to ${fmt(result.finalMonthlyPayment)} for cent rounding.`
            : ''}
        </p>

        <div className="mt-3 flex items-center gap-1.5 border-t border-border/80 pt-2.5 text-xs text-accent">
          <Calendar className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span>Estimated Payoff Date:</span>
          <strong className="font-bold">{formatDisplayDate(result.payoffDate)}</strong>
        </div>
      </div>

      {/* Key Financial Totals Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-xl border border-border bg-white p-3">
          <p className="text-[11px] font-medium text-muted-foreground">Amount Financed</p>
          <p className="mt-0.5 text-base font-extrabold text-accent tabular-nums">
            {fmt(result.amountFinanced)}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-3">
          <p className="text-[11px] font-medium text-muted-foreground">Total Interest</p>
          <p className="mt-0.5 text-base font-extrabold text-accent tabular-nums">
            {fmt(result.totalInterest)}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-3">
          <p className="text-[11px] font-medium text-muted-foreground">Total Loan Payments</p>
          <p className="mt-0.5 text-base font-extrabold text-accent tabular-nums">
            {fmt(result.totalLoanPayments)}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-3">
          <p className="text-[11px] font-medium text-muted-foreground">Upfront Costs</p>
          <p className="mt-0.5 text-base font-extrabold text-accent tabular-nums">
            {fmt(result.upfrontCosts)}
          </p>
        </div>

        <div className="col-span-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-white p-3">
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">Total Estimated Cost</p>
            <p className="text-[11px] text-muted-foreground">
              Upfront cash + applied positive equity + loan payments
            </p>
          </div>
          <p className="text-lg font-extrabold text-primary tabular-nums">
            {fmt(result.totalEstimatedCost)}
          </p>
        </div>
      </div>

      {/* Payment Breakdown Visual Chart */}
      <AutoLoanChart
        principal={result.amountFinanced}
        totalInterest={result.totalInterest}
        principalRatioPercent={result.principalRatioPercent}
        interestRatioPercent={result.interestRatioPercent}
        currency={result.currency}
      />

      {/* Cost & Financing Accounting Breakdown */}
      <div className="rounded-xl border border-border bg-white p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
          Payment &amp; Cost Breakdown
        </h4>
        <dl className="mt-2.5 divide-y divide-border text-xs">
          <div className="flex items-center justify-between gap-2 py-1.5">
            <dt className="text-muted-foreground">Vehicle Price</dt>
            <dd className="font-semibold text-foreground tabular-nums">{fmt(result.autoPrice)}</dd>
          </div>
          <div className="flex items-center justify-between gap-2 py-1.5">
            <dt className="text-muted-foreground">
              Down Payment ({result.downPaymentPercentOfPrice}%)
            </dt>
            <dd className="font-semibold text-foreground tabular-nums">
              −{fmt(result.downPaymentAmount)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2 py-1.5">
            <dt className="text-muted-foreground">Net Trade-in Equity</dt>
            <dd
              className={`font-semibold tabular-nums ${
                result.tradeInEquityStatus === 'negative' ? 'text-amber-700' : 'text-foreground'
              }`}
            >
              {result.netTradeInEquity >= 0
                ? `−${fmt(result.netTradeInEquity)}`
                : `+${fmt(Math.abs(result.netTradeInEquity))} rolled in`}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2 py-1.5">
            <dt className="text-muted-foreground">
              Sales Tax ({result.financedSalesTax > 0 ? 'financed' : 'upfront'})
            </dt>
            <dd className="font-semibold text-foreground tabular-nums">{fmt(result.salesTax)}</dd>
          </div>
          <div className="flex items-center justify-between gap-2 py-1.5">
            <dt className="text-muted-foreground">
              Additional Fees ({result.financedFees > 0 ? 'financed' : 'upfront'})
            </dt>
            <dd className="font-semibold text-foreground tabular-nums">
              {fmt(result.additionalFees)}
            </dd>
          </div>
        </dl>
      </div>

      {/* Estimate Note */}
      <div className="flex items-start gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
        <p>
          Estimates only. Actual lender APR, fees, and local sales tax rules vary by dealership and
          jurisdiction.
        </p>
      </div>
    </div>
  );
}
