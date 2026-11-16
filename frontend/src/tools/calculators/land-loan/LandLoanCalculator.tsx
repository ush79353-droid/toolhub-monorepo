'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { LandLoanForm } from './LandLoanForm';
import {
  createDefaultInput,
  PAYMENT_FREQUENCY_OPTIONS,
  type LandLoanFieldErrors,
  type LandLoanInput,
  type LandLoanResult,
} from './types';
import { validateLandLoanInput } from './validation';

const LAND_LOAN_CURRENCY_NOTE =
  'Land value, down payment, loan value, periodic payment, total payment, and total interest each have their own currency. Changing land currency converts the land amount; result currencies only re-express calculated values. Percentages, term, and frequency never convert.';

export function LandLoanCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const initial = validateLandLoanInput(defaults, rates);
  const [input, setInput] = React.useState<LandLoanInput>(() => defaults);
  const [errors, setErrors] = React.useState<LandLoanFieldErrors>(() => initial.errors);
  const [result, setResult] = React.useState<LandLoanResult | null>(() => initial.result);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: LandLoanInput) => {
    setInput(next);
    const validation = validateLandLoanInput(next, rates);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateLandLoanInput(fresh, rates);
    setInput(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
  };

  const currencyNote = ratesStatus.available
    ? LAND_LOAN_CURRENCY_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const frequencyLabel =
    PAYMENT_FREQUENCY_OPTIONS.find((o) => o.value === input.paymentFrequency)?.label ??
    input.paymentFrequency;

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Land value: ${getCurrencySymbol(input.landValueCurrency)}${input.landValue}`,
        `Down payment: ${input.downPaymentPercent}% → ${getCurrencySymbol(input.downPaymentCurrency)}${result.formattedDownPayment}`,
        `Loan value: ${getCurrencySymbol(input.loanValueCurrency)}${result.formattedLoanValue}`,
        `Annual interest rate: ${input.annualInterestRatePercent}%`,
        `Loan term: ${input.termYears || '0'} yrs ${input.termMonths || '0'} mos`,
        `Payment frequency: ${frequencyLabel}`,
        `Number of payments: ${result.formattedNumberOfPayments}`,
        `Periodic loan payment: ${getCurrencySymbol(input.periodicPaymentCurrency)}${result.formattedPeriodicPayment}`,
        `Total loan payment: ${getCurrencySymbol(input.totalPaymentCurrency)}${result.formattedTotalPayment}`,
        `Total interest paid: ${getCurrencySymbol(input.totalInterestCurrency)}${result.formattedTotalInterest}`,
        `Periodic interest rate: ${result.formattedPeriodicRate}%`,
        currencyNote,
      ].join('\n')
    : '';

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
        <LandLoanForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onReset={handleReset}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 text-xs font-medium"
            disabled={!summary}
            onClick={async () => {
              if (!summary) return;
              if (await copyTextToClipboard(summary)) {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              }
            }}
          >
            {copied ? 'Copied' : 'Copy results'}
          </Button>
          {canShare ? (
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3 text-xs font-medium"
              disabled={!summary}
              onClick={async () => {
                if (!summary) return;
                try {
                  await navigator.share({ title: metadata.title, text: summary });
                  setShared(true);
                  window.setTimeout(() => setShared(false), 2000);
                } catch {
                  // dismissed
                }
              }}
            >
              {shared ? 'Shared' : 'Share'}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
