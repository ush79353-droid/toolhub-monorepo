'use client';

import * as React from 'react';
import { RotateCcw, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { BusinessLoanResult } from './types';

interface BusinessLoanResultsProps {
  result: BusinessLoanResult | null;
  copied: boolean;
  onShare: () => void;
  onReset: () => void;
}

function ResultRow({
  label,
  value,
  tip,
  highlight = false,
}: {
  label: string;
  value: string;
  tip: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border border-border px-3.5 py-2.5 transition-colors ${
        highlight ? 'bg-brand-softTeal/20 font-semibold' : 'bg-white'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-accent">{label}</span>
        <InfoTooltip label={label} text={tip} align="left" />
      </div>
      <span
        className={`text-sm tabular-nums ${
          highlight ? 'font-bold text-primary' : 'font-semibold text-accent'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function BusinessLoanResults({
  result,
  copied,
  onShare,
  onReset,
}: BusinessLoanResultsProps) {
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  if (!result) return null;

  const currency = result.currency;
  const money = (val: number) => formatCurrencyValue(val, currency);

  return (
    <div className="mt-4 space-y-4">
      {/* Informational Callout matching reference */}
      <div className="rounded-xl border border-primary/20 bg-brand-softTeal/25 p-3.5 text-center text-xs font-medium text-accent">
        {result.calloutMessage}
      </div>

      {/* Results Header */}
      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <h3 className="mb-3 text-sm font-semibold text-accent">Results</h3>

        <div className="space-y-2">
          {/* 1. Net loan amount received */}
          <ResultRow
            label="Net loan amount received"
            value={money(result.netLoanReceived)}
            tip="The net cash proceeds disbursed to your business after upfront origination deductions."
          />

          {/* 2. Periodic payment */}
          <ResultRow
            label="Periodic payment"
            value={money(result.periodicPayment)}
            tip="Your scheduled amortized payment amount per period (principal plus interest)."
            highlight
          />

          {/* 3. Total interest payment */}
          <ResultRow
            label="Total interest payment"
            value={money(result.totalInterest)}
            tip="Cumulative interest paid over the entire life of the loan."
          />

          {/* 4. Total payment */}
          <ResultRow
            label="Total payment"
            value={money(result.totalPayment)}
            tip="Total out-of-pocket cash paid by your business across all scheduled payments and upfront prepaid fees."
          />

          {/* 5. Total finance charge */}
          <ResultRow
            label="Total finance charge"
            value={money(result.totalFinanceCharge)}
            tip="The total dollar cost of credit, including total loan interest, lender origination fees, and all prepaid and financed closing fees."
            highlight
          />

          {/* 6. APR */}
          <ResultRow
            label="APR"
            value={`${result.apr.toFixed(2)} %`}
            tip="The annualized percentage rate of the loan incorporating all fees, prepaid charges, and net cash flows under standard Truth-in-Lending principles."
          />

          {/* 7. Effective APR */}
          <ResultRow
            label="Effective APR"
            value={`${result.effectiveApr.toFixed(2)} %`}
            tip="The effective annual percentage rate taking into account compounding frequency on an annual basis."
          />
        </div>
      </div>

      {/* Action Controls matching OmegaCalculators style */}
      <div className="border-t border-border/80 pt-4">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {/* Share Result */}
          <button
            type="button"
            onClick={onShare}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 active:scale-[0.99]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs">
              <Share2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-accent">
              {copied ? 'Link Copied!' : 'Share result'}
            </span>
          </button>

          {/* Reload / Clear Controls */}
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center gap-1.5 rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              onClick={onReset}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-9 w-full justify-center text-xs font-normal text-muted-foreground hover:text-foreground"
              onClick={onReset}
            >
              Clear all changes
            </Button>
          </div>
        </div>

        {/* Feedback widget */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          <span>Did we solve your problem today?</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFeedback('yes')}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
                feedback === 'yes'
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-muted-foreground hover:text-foreground'
              }`}
            >
              <ThumbsUp className="h-3 w-3" />
              <span>Yes</span>
            </button>
            <button
              type="button"
              onClick={() => setFeedback('no')}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
                feedback === 'no'
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-muted-foreground hover:text-foreground'
              }`}
            >
              <ThumbsDown className="h-3 w-3" />
              <span>No</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
