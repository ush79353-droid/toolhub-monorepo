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
import { InterestOnlyMortgageForm } from './InterestOnlyMortgageForm';
import { InterestOnlyMortgageResults } from './InterestOnlyMortgageResults';
import {
  createDefaultInput,
  type InterestOnlyMortgageFieldErrors,
  type InterestOnlyMortgageInput,
  type InterestOnlyMortgageResult,
} from './types';
import { validateInterestOnlyMortgageInput } from './validation';

const INTEREST_ONLY_CURRENCY_NOTE =
  'Loan amount, periodic payment, and total interest each have their own currency. Changing the loan currency converts that amount; changing a result currency only re-expresses that money result.';

export function InterestOnlyMortgageCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const initial = validateInterestOnlyMortgageInput(defaults, rates);
  const [input, setInput] = React.useState<InterestOnlyMortgageInput>(() => defaults);
  const [errors, setErrors] = React.useState<InterestOnlyMortgageFieldErrors>(
    () => initial.errors
  );
  const [result, setResult] = React.useState<InterestOnlyMortgageResult | null>(
    () => initial.result
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: InterestOnlyMortgageInput) => {
    setInput(next);
    const validation = validateInterestOnlyMortgageInput(next, rates);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateInterestOnlyMortgageInput(fresh, rates);
    setInput(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
  };

  const currencyNote = ratesStatus.available
    ? INTEREST_ONLY_CURRENCY_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const loanSymbol = getCurrencySymbol(input.currency);
  const resultSymbol = getCurrencySymbol(result?.currency ?? input.resultCurrency);
  const totalSymbol = getCurrencySymbol(result?.totalCurrency ?? input.totalCurrency);
  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Loan amount: ${loanSymbol}${input.loanAmount}`,
        `Annual interest rate: ${input.annualInterestRatePercent}%`,
        `Payment frequency: ${input.paymentFrequency}`,
        `${result.paymentLabel}: ${resultSymbol}${result.formattedPeriodicPayment}`,
        result.formattedTotalInterest
          ? `Total interest in IO period: ${totalSymbol}${result.formattedTotalInterest}`
          : null,
        `Remaining principal: ${loanSymbol}${input.loanAmount}`,
        currencyNote,
      ]
        .filter(Boolean)
        .join('\n')
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
        <InterestOnlyMortgageForm
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
        <InterestOnlyMortgageResults />
      </div>
    </section>
  );
}
