'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertDraftMoneyFields } from '@/tools/shared/convert-currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { SimpleInterestForm } from './SimpleInterestForm';
import {
  createDefaultInput,
  type SimpleInterestFieldErrors,
  type SimpleInterestInput,
  type SimpleInterestResult,
} from './types';
import { validateSimpleInterestInput } from './validation';

const MONEY_FIELDS = ['principal'] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts the principal using stored exchange rates. Interest rate % and term stay the same.';

export function SimpleInterestCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<SimpleInterestInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<SimpleInterestFieldErrors>({});
  const [result, setResult] = React.useState<SimpleInterestResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const currencyNote = ratesStatus.available
    ? CURRENCY_CONVERSION_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const handleChange = (next: SimpleInterestInput) => {
    setConversionError(null);
    setInput(next);
    const validation = validateSimpleInterestInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleCurrencyChange = (currency: SupportedCurrency) => {
    if (currency === input.currency) return;
    if (!rates.available) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertDraftMoneyFields(
      input,
      MONEY_FIELDS,
      input.currency,
      currency,
      rates.rates
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    handleChange({ ...input, ...converted.values, currency });
  };

  const handleReset = () => {
    setInput(createDefaultInput());
    setErrors({});
    setResult(null);
    setConversionError(null);
  };

  const symbol = getCurrencySymbol(input.currency);
  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Principal: ${symbol}${input.principal}`,
        `Interest rate: ${input.interestRate}%/yr`,
        `Term: ${input.termYears || '0'} yrs, ${input.termMonths || '0'} mos`,
        `Total interest: ${symbol}${result.formattedTotalInterest}`,
        `Final balance: ${symbol}${result.formattedFinalBalance}`,
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
          <p className="text-xs font-normal text-muted-foreground">
            I = P × (r ÷ 100) × t. {currencyNote}
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {conversionError ? (
          <p className="text-xs text-rose-600" role="alert">
            {conversionError}
          </p>
        ) : null}
        {ratesStatus.warning && !conversionError ? (
          <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
        ) : null}
        <SimpleInterestForm
          input={input}
          errors={errors}
          result={result}
          onChange={handleChange}
          onCurrencyChange={handleCurrencyChange}
        />

        <details className="rounded-xl border border-border bg-muted/15">
          <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4">
            Total interest payment calculations
          </summary>
          <div className="flex flex-wrap gap-2 border-t border-border px-3.5 py-3 sm:px-4">
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
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3 text-xs font-medium"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </details>
      </div>
    </section>
  );
}