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
import { moneyAmountToInputString } from '@/tools/shared/money-value';
import { formatDisplayDate } from './calculation';
import { JumboLoanForm } from './JumboLoanForm';
import {
  createDefaultInput,
  type JumboLoanFieldErrors,
  type JumboLoanInput,
  type JumboLoanResult,
} from './types';
import { validateJumboLoanInput } from './validation';

const FX_NOTE =
  'Property price, down payment, jumbo loan amount, and monthly payment each have their own currency. Amounts normalize into the property-price currency before loan math. Percentages, term, and dates are never converted.';

function syncDerivedFields(
  input: JumboLoanInput,
  result: JumboLoanResult
): JumboLoanInput {
  const next = { ...input };
  if (input.downPaymentSource === 'percent') {
    next.downPayment = moneyAmountToInputString(result.downPaymentDisplay);
  } else {
    const pct =
      result.jumboLoanAmountCalc + result.downPaymentCalc > 0
        ? (result.downPaymentCalc /
            (result.jumboLoanAmountCalc + result.downPaymentCalc)) *
          100
        : 0;
    next.downPaymentPercent = moneyAmountToInputString(pct);
  }
  return next;
}

function inputsEqual(a: JumboLoanInput, b: JumboLoanInput): boolean {
  return (
    a.propertyPrice === b.propertyPrice &&
    a.propertyPriceCurrency === b.propertyPriceCurrency &&
    a.downPayment === b.downPayment &&
    a.downPaymentCurrency === b.downPaymentCurrency &&
    a.downPaymentPercent === b.downPaymentPercent &&
    a.downPaymentSource === b.downPaymentSource &&
    a.jumboLoanAmountCurrency === b.jumboLoanAmountCurrency &&
    a.termYears === b.termYears &&
    a.termMonths === b.termMonths &&
    a.interestRatePercent === b.interestRatePercent &&
    a.firstDay === b.firstDay &&
    a.monthlyPaymentCurrency === b.monthlyPaymentCurrency
  );
}

export function JumboLoanCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<JumboLoanInput>(() => defaults);
  const [input, setInput] = React.useState<JumboLoanInput>(() => defaults);
  const [errors, setErrors] = React.useState<JumboLoanFieldErrors>({});
  const [result, setResult] = React.useState<JumboLoanResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  React.useEffect(() => {
    const validation = validateJumboLoanInput(defaults, rates);
    if (validation.isValid && validation.result) {
      const synced = syncDerivedFields(defaults, validation.result);
      setInput(synced);
      setBaseline(synced);
      setResult(validation.result);
      setErrors({});
    }
    // Initial sample only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const apply = (next: JumboLoanInput) => {
    const validation = validateJumboLoanInput(next, rates);
    setErrors(validation.errors);
    if (validation.isValid && validation.result) {
      setInput(syncDerivedFields(next, validation.result));
      setResult(validation.result);
    } else {
      setInput(next);
      setResult(null);
    }
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateJumboLoanInput(fresh, rates);
    setErrors(validation.errors);
    if (validation.isValid && validation.result) {
      const synced = syncDerivedFields(fresh, validation.result);
      setInput(synced);
      setBaseline(synced);
      setResult(validation.result);
    } else {
      setInput(fresh);
      setBaseline(fresh);
      setResult(null);
    }
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const currencyNote = ratesStatus.available ? FX_NOTE : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Property price: ${getCurrencySymbol(input.propertyPriceCurrency)}${input.propertyPrice}`,
        `Down payment: ${input.downPaymentPercent}% → ${getCurrencySymbol(input.downPaymentCurrency)}${result.formattedDownPayment}`,
        `Jumbo loan amount: ${getCurrencySymbol(input.jumboLoanAmountCurrency)}${result.formattedJumboLoanAmount}`,
        `Loan term: ${input.termYears || '0'} yrs ${input.termMonths || '0'} mos (${result.paymentCount} payments)`,
        `Interest rate: ${input.interestRatePercent}%`,
        `First day: ${formatDisplayDate(input.firstDay)}`,
        `Monthly payment: ${getCurrencySymbol(input.monthlyPaymentCurrency)}${result.formattedMonthlyPayment}`,
        `Payoff: ${result.formattedPayoffDate}`,
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
        <JumboLoanForm
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
