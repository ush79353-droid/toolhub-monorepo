'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
} from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { PartiallyAmortizedLoanForm } from './PartiallyAmortizedLoanForm';
import {
  createDefaultInput,
  type PartiallyAmortizedLoanFieldErrors,
  type PartiallyAmortizedLoanInput,
  type PartiallyAmortizedLoanResult,
} from './types';
import { validatePartiallyAmortizedLoanInput } from './validation';

const CURRENCY_NOTE =
  'Full loan and each result have their own currency. Changing the loan currency converts the principal; changing a result currency only re-expresses that amount. Rate and durations are never converted.';

export function PartiallyAmortizedLoanCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const initial = validatePartiallyAmortizedLoanInput(defaults, rates);
  const [input, setInput] = React.useState<PartiallyAmortizedLoanInput>(() => defaults);
  const [errors, setErrors] = React.useState<PartiallyAmortizedLoanFieldErrors>(
    () => initial.errors
  );
  const [result, setResult] = React.useState<PartiallyAmortizedLoanResult | null>(
    () => initial.result
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: PartiallyAmortizedLoanInput) => {
    setInput(next);
    const validation = validatePartiallyAmortizedLoanInput(next, rates);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validatePartiallyAmortizedLoanInput(fresh, rates);
    setInput(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
  };

  const currencyNote = ratesStatus.available
    ? CURRENCY_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Full loan: ${getCurrencySymbol(input.loanCurrency)}${input.fullLoan}`,
        `Annual interest rate: ${input.annualInterestRatePercent}%/yr`,
        `Amortization time: ${input.amortYears || '0'} yrs ${input.amortMonths || '0'} mos`,
        `Payment period: ${input.paymentYears || '0'} yrs ${input.paymentMonths || '0'} mos`,
        `Monthly payment: ${getCurrencySymbol(result.monthlyPaymentCurrency)}${result.formattedMonthlyPayment}`,
        `Total paid during payment period: ${getCurrencySymbol(result.totalPaidCurrency)}${result.formattedTotalPaid}`,
        `Balloon payment: ${getCurrencySymbol(result.balloonCurrency)}${result.formattedBalloon}`,
        `Total: ${getCurrencySymbol(result.totalCurrency)}${result.formattedTotal}`,
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
        <PartiallyAmortizedLoanForm
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
