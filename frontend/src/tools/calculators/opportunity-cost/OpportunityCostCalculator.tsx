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
  formatCurrencyValue,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { OpportunityCostForm } from './OpportunityCostForm';
import { OpportunityCostResults } from './OpportunityCostResults';
import {
  createDefaultInput,
  type OpportunityCostFieldErrors,
  type OpportunityCostInput,
  type OpportunityCostResult,
} from './types';
import { validateOpportunityCostInput } from './validation';

const MONEY_FIELDS = ['moneyToSpend'] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts money to spend and savings results using stored exchange rates. Return, tax, and inflation rates stay unchanged.';

export function OpportunityCostCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<OpportunityCostInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<OpportunityCostFieldErrors>({});
  const [result, setResult] = React.useState<OpportunityCostResult | null>(null);
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

  const apply = (next: OpportunityCostInput) => {
    setInput(next);
    const validation = validateOpportunityCostInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleChange = (next: OpportunityCostInput) => {
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
    handleChange({ ...input, ...converted.values, currency });
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
    setConversionError(null);
  };

  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Money to spend: ${formatCurrencyValue(result.moneyToSpend, result.currency)}`,
        `Annual return: ${result.annualReturnPercent}%`,
        `Period: ${result.years || '0'} yrs, ${result.months || '0'} mos`,
        `Income tax: ${result.incomeTaxPercent}%`,
        `Inflation: ${result.inflationPercent}%`,
        `Total savings (after tax): ${formatCurrencyValue(result.totalSavingsAfterTax, result.currency)}`,
        `Opportunity cost (inflation adjusted): ${formatCurrencyValue(result.opportunityCost, result.currency)}`,
        ...(input.showSupplementary
          ? [
              `Inflation-adjusted savings: ${formatCurrencyValue(result.realSavings, result.currency)}`,
              `Nominal investment gain: ${formatCurrencyValue(result.nominalGain, result.currency)}`,
            ]
          : []),
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
            Real forgone gain of spending vs investing · {currencyNote}
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
        <OpportunityCostForm
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
        <OpportunityCostResults />
      </div>
    </section>
  );
}