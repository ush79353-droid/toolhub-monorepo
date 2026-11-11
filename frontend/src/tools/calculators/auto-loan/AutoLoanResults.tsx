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
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-8 text-center">
        <p className="text-sm font-bold text-accent">Review Highlighted Inputs</p>
        <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">
          Correct the validation message(s) on the left and click Calculate to view your updated
          monthly payment and amortization breakdown.
        </p>
      </div>
    );
  }

  const fmt = (value: number) => formatCurrencyValue(value, result.currency);
  const finalDiffers =
    result.monthlySchedule.length > 0 &&
    Math.abs(result.finalMonthlyPayment - result.estimatedMonthlyPayment) >= 0.01;

  return (
    <div className="space-y-5" aria-live="polite">
      {/* Primary Monthly Payment Hero Card */}
      <div className="rounded-xl border border-primary/25 bg-brand-softTeal p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Estimated Monthly Payment
            </p>
            <p className="mt-1.5 text-3xl font-black tracking-tight text-accent tabular-nums sm:text-4xl">
              {fmt(result.estimatedMonthlyPayment)}
              <span className="ml-1.5 text-sm font-semibold text-muted-foreground">/ mo</span>
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {result.amountFinanced === 0
                ? 'No loan balance required (upfront cash and trade-in equity cover total cost).'
                : `${result.totalMonths} monthly payments at ${result.annualInterestRate}% APR`}
              {finalDiffers
                ? ` · Final payment adjusted to ${fmt(result.finalMonthlyPayment)} to clear rounding remainder.`
                : ''}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void onCopy()}
            className="bg-white text-xs"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                <span className="font-semibold text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="mr-1.5 h-3.5 w-3.5" />
                <span>Copy Results</span>
              </>
            )}
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border/80 pt-3 text-xs text-accent">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>Estimated Payoff Date:</span>
            <strong className="font-bold">{formatDisplayDate(result.payoffDate)}</strong>
          </span>
        </div>
      </div>

      {/* Key Financial Totals Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-4">
          <p className="text-xs font-medium text-muted-foreground">Amount Financed</p>
          <p className="mt-1 text-lg font-extrabold text-accent tabular-nums">
            {fmt(result.amountFinanced)}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Starting loan principal</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-4">
          <p className="text-xs font-medium text-muted-foreground">Total Interest</p>
          <p className="mt-1 text-lg font-extrabold text-accent tabular-nums">
            {fmt(result.totalInterest)}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {result.interestRatioPercent.toFixed(1)}% of loan payments
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-4">
          <p className="text-xs font-medium text-muted-foreground">Total Loan Payments</p>
          <p className="mt-1 text-lg font-extrabold text-accent tabular-nums">
            {fmt(result.totalLoanPayments)}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Principal + interest</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-4">
          <p className="text-xs font-medium text-muted-foreground">Upfront Costs</p>
          <p className="mt-1 text-lg font-extrabold text-accent tabular-nums">
            {fmt(result.upfrontCosts)}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Cash due at signing (excl. trade-in)
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 sm:col-span-2">
          <p className="text-xs font-medium text-muted-foreground">Total Estimated Cost</p>
          <p className="mt-1 text-lg font-extrabold text-primary tabular-nums">
            {fmt(result.totalEstimatedCost)}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Upfront cash + applied positive trade-in equity + total loan payments
          </p>
        </div>
      </div>

      {/* Principal vs. Interest Visual Chart */}
      <AutoLoanChart
        principal={result.amountFinanced}
        totalInterest={result.totalInterest}
        principalRatioPercent={result.principalRatioPercent}
        interestRatioPercent={result.interestRatioPercent}
        currency={result.currency}
      />

      {/* Detailed Cost Accounting Breakdown */}
      <div className="rounded-xl border border-border bg-white p-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
          Cost & Financing Breakdown
        </h4>
        <dl className="mt-3 divide-y divide-border text-xs">
          <div className="flex items-center justify-between py-2">
            <dt className="text-muted-foreground">Vehicle Price</dt>
            <dd className="font-semibold text-foreground tabular-nums">{fmt(result.autoPrice)}</dd>
          </div>
          <div className="flex items-center justify-between py-2">
            <dt className="text-muted-foreground">
              Down Payment ({result.downPaymentPercentOfPrice}%)
            </dt>
            <dd className="font-semibold text-foreground tabular-nums">
              −{fmt(result.downPaymentAmount)}
            </dd>
          </div>
          <div className="flex items-center justify-between py-2">
            <dt className="text-muted-foreground">
              Net Trade-in Equity ({fmt(result.tradeInValue)} value − {fmt(result.tradeInOwed)} owed)
            </dt>
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
          <div className="flex items-center justify-between py-2">
            <dt className="text-muted-foreground">
              Sales Tax ({result.taxPolicy === 'after-trade-in' ? 'on net after trade-in' : 'on full price'},{' '}
              {result.financedSalesTax > 0 ? 'financed' : 'upfront'})
            </dt>
            <dd className="font-semibold text-foreground tabular-nums">{fmt(result.salesTax)}</dd>
          </div>
          <div className="flex items-center justify-between py-2">
            <dt className="text-muted-foreground">
              Additional Fees ({result.financedFees > 0 ? 'financed' : 'upfront'})
            </dt>
            <dd className="font-semibold text-foreground tabular-nums">
              {fmt(result.additionalFees)}
            </dd>
          </div>
        </dl>
      </div>

      {/* Estimate Disclaimer */}
      <div className="flex items-start gap-2.5 rounded-xl border border-border bg-background px-4 py-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="leading-relaxed">
          These figures are mathematical estimates for educational planning only and are not a
          lender offer, credit approval, or tax determination. Actual APR, dealer fees, and tax
          credits depend on your lender and jurisdiction.
        </p>
      </div>
    </div>
  );
}

