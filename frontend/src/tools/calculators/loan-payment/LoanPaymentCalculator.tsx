'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { LoanPaymentForm } from './LoanPaymentForm';
import {
  createDefaultInput,
  PAYMENT_FREQUENCY_OPTIONS,
  type LoanPaymentFieldErrors,
  type LoanPaymentInput,
  type LoanPaymentResult,
} from './types';
import { validateLoanPaymentInput } from './validation';

const FX_NOTE =
  'Loan amount, periodic payment, and loan payment total each have their own currency. Changing loan currency converts that amount; changing result currencies only re-expresses the money results. Rates, term, and installment counts are never converted.';

function inputsEqual(a: LoanPaymentInput, b: LoanPaymentInput): boolean {
  return (
    a.loanAmount === b.loanAmount &&
    a.loanCurrency === b.loanCurrency &&
    a.annualRatePercent === b.annualRatePercent &&
    a.termYears === b.termYears &&
    a.termMonths === b.termMonths &&
    a.paymentFrequency === b.paymentFrequency &&
    a.paymentCurrency === b.paymentCurrency &&
    a.totalCurrency === b.totalCurrency
  );
}

export function LoanPaymentCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<LoanPaymentInput>(() => defaults);
  const [input, setInput] = React.useState<LoanPaymentInput>(() => defaults);
  const [errors, setErrors] = React.useState<LoanPaymentFieldErrors>({});
  const [result, setResult] = React.useState<LoanPaymentResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  React.useEffect(() => {
    const validation = validateLoanPaymentInput(defaults, rates);
    if (validation.isValid && validation.result) {
      setResult(validation.result);
      setErrors({});
    }
    // Initial sample only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const apply = (next: LoanPaymentInput) => {
    const validation = validateLoanPaymentInput(next, rates);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateLoanPaymentInput(fresh, rates);
    setInput(fresh);
    setBaseline(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const currencyNote = ratesStatus.available ? FX_NOTE : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
  const loanSymbol = getCurrencySymbol(input.loanCurrency);
  const paymentSymbol = getCurrencySymbol(
    result?.paymentCurrency ?? input.paymentCurrency
  );
  const totalSymbol = getCurrencySymbol(result?.totalCurrency ?? input.totalCurrency);
  const frequencyLabel =
    PAYMENT_FREQUENCY_OPTIONS.find((o) => o.value === input.paymentFrequency)?.label ??
    input.paymentFrequency;

  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Loan amount: ${loanSymbol}${input.loanAmount}`,
        `Annual rate: ${input.annualRatePercent}%`,
        `Loan term: ${input.termYears} yrs ${input.termMonths} mos`,
        `Payment frequency: ${frequencyLabel}`,
        `Number of installments: ${result.formattedNumberOfInstallments}`,
        `Periodic interest rate: ${result.formattedPeriodicInterestRate}%`,
        `Periodic loan payment: ${paymentSymbol}${result.formattedPeriodicPayment}`,
        `Loan payment total: ${totalSymbol}${result.formattedLoanPaymentTotal}`,
        currencyNote,
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
        // fall through to clipboard
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
          <p className="text-xs font-normal text-muted-foreground">{currencyNote}</p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <LoanPaymentForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
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
              onClick={handleReset}
            >
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              disabled={!dirty}
              onClick={handleReset}
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
