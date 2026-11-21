'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { HelocForm } from './HelocForm';
import { HelocResults } from './HelocResults';
import {
  createDefaultInput,
  createEmptyInput,
  type HelocFieldErrors,
  type HelocInput,
  type HelocResult,
} from './types';
import { validateHelocInput } from './validation';

function inputsEqual(a: HelocInput, b: HelocInput): boolean {
  return (
    a.currentBalance === b.currentBalance &&
    a.drawPeriodYears === b.drawPeriodYears &&
    a.repaymentTermYears === b.repaymentTermYears &&
    a.initialInterestRate === b.initialInterestRate &&
    a.upfrontFeePercent === b.upfrontFeePercent &&
    a.upfrontFeeFixed === b.upfrontFeeFixed &&
    a.annualFee === b.annualFee &&
    a.adjustmentType === b.adjustmentType &&
    a.expectedRateAdjustment === b.expectedRateAdjustment &&
    a.firstAdjustmentAfterYears === b.firstAdjustmentAfterYears &&
    a.adjustmentIntervalMonths === b.adjustmentIntervalMonths &&
    a.maximumInterestRate === b.maximumInterestRate &&
    a.currency === b.currency
  );
}

export function HelocCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const initial = validateHelocInput(defaults);
  const [baseline, setBaseline] = React.useState<HelocInput>(() => defaults);
  const [input, setInput] = React.useState<HelocInput>(() => defaults);
  const [errors, setErrors] = React.useState<HelocFieldErrors>(
    () => initial.errors
  );
  const [result, setResult] = React.useState<HelocResult | null>(
    () => initial.result
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: HelocInput) => {
    const validation = validateHelocInput(next);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.currency) return;
    apply({ ...input, currency: next });
  };

  const handleReload = () => {
    const fresh = createDefaultInput();
    const validation = validateHelocInput(fresh);
    setInput(fresh);
    setBaseline(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    const empty = createEmptyInput(input.currency);
    setInput(empty);
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const symbol = getCurrencySymbol(input.currency);
  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `HELOC Balance: ${symbol}${result.formattedInitialPrincipal}`,
        `Draw Period: ${input.drawPeriodYears} years`,
        `Repayment Term: ${input.repaymentTermYears} years`,
        `Initial Interest Rate: ${input.initialInterestRate}%`,
        `Rate model: ${
          input.adjustmentType === 'none'
            ? 'fixed (no adjustment)'
            : 'adjustable projection (assumption, not a forecast)'
        }`,
        `Initial Draw Payment: ${symbol}${result.formattedInitialDrawPayment}/month`,
        `Initial Repayment Payment: ${symbol}${result.formattedInitialRepaymentPayment}/month`,
        `Upfront Fees: ${symbol}${result.formattedUpfrontFees}`,
        `Annual Fees (term): ${symbol}${result.formattedRecurringFees}`,
        `Total Interest: ${symbol}${result.formattedTotalInterest}`,
        `Total Cash Outflow: ${symbol}${result.formattedTotalCashOutflow}`,
        `View calculator: ${typeof window !== 'undefined' ? window.location.href : '/tools/heloc-calculator'}`,
      ].join('\n')
    : '';

  const handleShare = async () => {
    if (!summary) return;
    if (canShare) {
      try {
        await navigator.share({ title: metadata.title, text: summary });
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        // fall through
      }
    }
    if (await copyTextToClipboard(summary)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
 Interest-only draw period, then amortizing repayment, with optional
            rate-adjustment projections and fees.
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <HelocForm
          input={input}
          errors={errors}
          onChange={apply}
          onCurrencyChange={handleCurrencyChange}
        />

        <HelocResults
          result={result}
          drawPeriodYears={input.drawPeriodYears}
          repaymentTermYears={input.repaymentTermYears}
          initialInterestRate={input.initialInterestRate}
        />

        <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleShare()}
            disabled={!summary}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs">
              <Share2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-accent">
              {copied ? 'Copied!' : shared ? 'Shared' : 'Share result'}
            </span>
          </button>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              onClick={handleReload}
            >
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              disabled={!dirty && !result}
              onClick={handleClear}
            >
              Clear all changes
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
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
    </section>
  );
}
