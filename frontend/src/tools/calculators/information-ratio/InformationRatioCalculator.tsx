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
import { InformationRatioForm } from './InformationRatioForm';
import {
  createDefaultInput,
  type InformationRatioFieldErrors,
  type InformationRatioInput,
  type InformationRatioResult,
} from './types';
import { validateInformationRatioInput } from './validation';

const MONEY_FIELDS = ['beginningValue', 'endingValue'] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts beginning and ending portfolio values using stored exchange rates. Portfolio return %, benchmark %, tracking error, and information ratio stay the same.';

export function InformationRatioCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<InformationRatioInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<InformationRatioFieldErrors>({});
  const [result, setResult] = React.useState<InformationRatioResult | null>(null);
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

  const handleChange = (next: InformationRatioInput) => {
    setConversionError(null);
    setInput(next);
    const validation = validateInformationRatioInput(next);
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
      {
        beginningValue: input.beginningValue,
        endingValue: input.endingValue,
      },
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
    const next: InformationRatioInput = {
      ...input,
      ...converted.values,
      currency,
    };
    setInput(next);
    const validation = validateInformationRatioInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
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
        `Beginning: ${symbol}${input.beginningValue}`,
        `Ending: ${symbol}${input.endingValue}`,
        `Portfolio return: ${result.formattedPortfolioReturn}%`,
        `Benchmark return: ${input.benchmarkReturn}%`,
        `Tracking error: ${input.trackingError}%`,
        `Information ratio: ${result.formattedInformationRatio}`,
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
            IR = (portfolio return − benchmark) ÷ tracking error. {currencyNote}
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
        <InformationRatioForm
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