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
import { formatCurrencyLabel, formatTermLabel } from './calculation';
import { DeferredPaymentLoanForm } from './DeferredPaymentLoanForm';
import {
  createDefaultInput,
  type DeferredPaymentLoanFieldErrors,
  type DeferredPaymentLoanInput,
  type DeferredPaymentLoanResult,
} from './types';
import { validateDeferredPaymentLoanInput } from './validation';

const FX_NOTE =
  'Loan amount and original monthly payment each have their own currency. Changing loan currency converts the principal; changing payment currency converts an entered payment or re-expresses the calculated payment. Rates, dates, and durations are never converted.';

function inputsEqual(a: DeferredPaymentLoanInput, b: DeferredPaymentLoanInput): boolean {
  return (
    a.estimationMode === b.estimationMode &&
    a.loanAmount === b.loanAmount &&
    a.loanCurrency === b.loanCurrency &&
    a.balanceDate === b.balanceDate &&
    a.termYears === b.termYears &&
    a.termMonths === b.termMonths &&
    a.interestRatePercent === b.interestRatePercent &&
    a.compoundingFrequency === b.compoundingFrequency &&
    a.originalMonthlyPayment === b.originalMonthlyPayment &&
    a.paymentCurrency === b.paymentCurrency &&
    a.interestTreatment === b.interestTreatment &&
    a.repaymentType === b.repaymentType &&
    a.defermentFrom === b.defermentFrom &&
    a.deferredMonths === b.deferredMonths
  );
}

export function DeferredPaymentLoanCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<DeferredPaymentLoanInput>(() => defaults);
  const [input, setInput] = React.useState<DeferredPaymentLoanInput>(() => defaults);
  const [errors, setErrors] = React.useState<DeferredPaymentLoanFieldErrors>({});
  const [result, setResult] = React.useState<DeferredPaymentLoanResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  React.useEffect(() => {
    const validation = validateDeferredPaymentLoanInput(defaults, rates);
    if (validation.isValid && validation.result) {
      setResult(validation.result);
      setErrors({});
    }
    // Initial sample only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const apply = (next: DeferredPaymentLoanInput) => {
    const validation = validateDeferredPaymentLoanInput(next, rates);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateDeferredPaymentLoanInput(fresh, rates);
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
  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Loan amount: ${loanSymbol}${input.loanAmount}`,
        `Interest rate: ${input.interestRatePercent}% (${input.compoundingFrequency})`,
        `Deferred: ${input.deferredMonths} months (${input.interestTreatment}, ${input.repaymentType})`,
        `Balance after deferment: ${formatCurrencyLabel(result.balanceAfterDeferment, result.loanCurrency)}`,
        `Monthly w/o def.: ${formatCurrencyLabel(result.without.monthlyPayment, result.loanCurrency)}`,
        `Monthly with deferment: ${formatCurrencyLabel(result.withDefer.monthlyPayment, result.loanCurrency)}`,
        `Term w/o def.: ${formatTermLabel(result.without.termMonths)}`,
        `Post-deferment term: ${formatTermLabel(result.withDefer.termMonths)}`,
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
          <p className="text-xs font-normal text-muted-foreground">{currencyNote}</p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <DeferredPaymentLoanForm
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

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
          <span>Did we solve your problem today?</span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className={`h-8 gap-1 px-2.5 text-xs ${
                feedback === 'yes' ? 'border-primary text-primary' : ''
              }`}
              onClick={() => setFeedback('yes')}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Yes
            </Button>
            <Button
              type="button"
              variant="outline"
              className={`h-8 gap-1 px-2.5 text-xs ${
                feedback === 'no' ? 'border-primary text-primary' : ''
              }`}
              onClick={() => setFeedback('no')}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              No
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
