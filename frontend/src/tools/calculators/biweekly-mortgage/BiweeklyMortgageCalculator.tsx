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
import { BiweeklyMortgageForm } from './BiweeklyMortgageForm';
import {
  createDefaultInput,
  type BiweeklyMortgageFieldErrors,
  type BiweeklyMortgageInput,
  type BiweeklyMortgageResult,
} from './types';
import { validateBiweeklyMortgageInput } from './validation';

const CURRENCY_NOTE =
  'Loan amount, upfront fee, and extra payment each have their own currency. Amounts are converted with stored rates and normalized into the loan currency before amortization. Interest rate, term, points, and compounding are never converted.';

export function BiweeklyMortgageCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const defaults = createDefaultInput();
  const initial = validateBiweeklyMortgageInput(defaults, rates);
  const [input, setInput] = React.useState<BiweeklyMortgageInput>(() => defaults);
  const [errors, setErrors] = React.useState<BiweeklyMortgageFieldErrors>(
    () => initial.errors
  );
  const [result, setResult] = React.useState<BiweeklyMortgageResult | null>(
    () => initial.result
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: BiweeklyMortgageInput) => {
    setInput(next);
    const validation = validateBiweeklyMortgageInput(next, rates);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateBiweeklyMortgageInput(fresh, rates);
    setInput(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
  };

  const currencyNote = ratesStatus.available
    ? CURRENCY_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
  const symbol = getCurrencySymbol(result?.currency ?? input.loanCurrency);
  const termLabel = input.termUnit === 'yrs' ? 'yrs' : 'mos';

  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Loan amount: ${getCurrencySymbol(input.loanCurrency)}${input.loanAmount}`,
        `Mortgage term: ${input.mortgageTerm} ${termLabel}`,
        `Interest rate: ${input.interestRatePercent}%`,
        `Without acceleration; monthly: ${symbol}${result.withoutAcceleration.formattedPeriodicPayment}; term ${result.withoutAcceleration.formattedTerm}; interest ${symbol}${result.withoutAcceleration.formattedTotalInterest}`,
        `Bi-weekly; payment: ${symbol}${result.biweekly.formattedPeriodicPayment}; term ${result.biweekly.formattedTerm}; interest ${symbol}${result.biweekly.formattedTotalInterest}`,
        `Difference; payment ${symbol}${result.formattedPaymentDifference}; term saved ${result.formattedTermSaved}; interest ${symbol}${result.formattedInterestSaved}`,
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
        <BiweeklyMortgageForm
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
