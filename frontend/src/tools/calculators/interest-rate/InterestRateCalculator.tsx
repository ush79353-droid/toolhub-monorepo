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
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InterestRateForm } from './InterestRateForm';
import {
  createDefaultInput,
  type InterestRateFieldErrors,
  type InterestRateInput,
  type InterestRateResult,
} from './types';
import { validateInterestRateInput } from './validation';

const MONEY_FIELDS = [
  'loanAmount',
  'periodicPayment',
  'prepaidFees',
  'loanedFees',
  'initialDeposit',
  'currentBalance',
] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts all loan or deposit amounts together using stored exchange rates. Term, frequencies, and solved interest rates stay the same when only currency changes.';

export function InterestRateCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<InterestRateInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<InterestRateFieldErrors>(() =>
    validateInterestRateInput(createDefaultInput()).errors
  );
  const [result, setResult] = React.useState<InterestRateResult | null>(() =>
    validateInterestRateInput(createDefaultInput()).result
  );
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

  const apply = (next: InterestRateInput) => {
    setInput(next);
    const validation = validateInterestRateInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleChange = (next: InterestRateInput) => {
    setConversionError(null);
    apply(next);
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
    apply({
      ...input,
      ...converted.values,
      currency,
    });
  };

  const handleReset = () => {
    const defaults = createDefaultInput();
    setInput(defaults);
    const validation = validateInterestRateInput(defaults);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
    setConversionError(null);
  };

  const symbol = getCurrencySymbol(input.currency);
  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Mode: ${result.mode === 'loan' ? 'Interest rate on loan' : 'Interest rate on deposit'}`,
        `Annual nominal interest rate: ${result.formattedAnnualNominal}%`,
        result.formattedPeriodicRate
          ? `Periodic rate: ${result.formattedPeriodicRate}%`
          : null,
        `EAR: ${result.formattedEar}%`,
        result.formattedApr ? `APR: ${result.formattedApr}%` : null,
        result.formattedTotalPayments
          ? `Total payments: ${symbol}${result.formattedTotalPayments}`
          : null,
        result.formattedTotalInterest
          ? `Total interest: ${symbol}${result.formattedTotalInterest}`
          : null,
        result.formattedAdditionalFees
          ? `Additional fees: ${symbol}${result.formattedAdditionalFees}`
          : null,
        result.formattedAdjustedPayment
          ? `Adjusted periodic payment: ${symbol}${result.formattedAdjustedPayment}`
          : null,
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
          <p className="text-xs font-normal text-muted-foreground">
            Solve implied interest rates · {currencyNote}
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
          <p className="mt-1 text-xs text-amber-700">{ratesStatus.warning}</p>
        ) : null}
        <InterestRateForm
          input={input}
          errors={errors}
          result={result}
          onChange={handleChange}
          onCurrencyChange={handleCurrencyChange}
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