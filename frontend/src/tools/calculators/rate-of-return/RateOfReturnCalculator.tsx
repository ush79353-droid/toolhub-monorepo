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
import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import { RateOfReturnForm } from './RateOfReturnForm';
import { RateOfReturnResults } from './RateOfReturnResults';
import {
  COMPOUNDING_OPTIONS,
  CASH_FLOW_FREQUENCY_OPTIONS,
  createDefaultInput,
  type RateOfReturnFieldErrors,
  type RateOfReturnInput,
  type RateOfReturnResult,
} from './types';
import { validateRateOfReturnInput } from './validation';

const MONEY_FIELDS = ['initialInvestment', 'finalAmount', 'periodicCashFlow'] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts initial, final, and periodic cash flow amounts using stored exchange rates. The solved rate of return % stays the same.';

export function RateOfReturnCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<RateOfReturnInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<RateOfReturnFieldErrors>(() => {
    const seed = validateRateOfReturnInput(createDefaultInput());
    return seed.errors;
  });
  const [result, setResult] = React.useState<RateOfReturnResult | null>(() => {
    const seed = validateRateOfReturnInput(createDefaultInput());
    return seed.isValid ? seed.result : null;
  });
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

  const apply = (next: RateOfReturnInput) => {
    setInput(next);
    const validation = validateRateOfReturnInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleChange = (next: RateOfReturnInput) => {
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
    const validation = validateRateOfReturnInput(fresh);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
    setCopied(false);
    setShared(false);
    setConversionError(null);
  };

  const compoundingLabel =
    COMPOUNDING_OPTIONS.find((o) => o.value === input.compounding)?.label ?? input.compounding;
  const cashFlowLabel =
    CASH_FLOW_FREQUENCY_OPTIONS.find((o) => o.value === input.cashFlowFrequency)?.label ??
    input.cashFlowFrequency;

  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Initial investment: ${formatCurrencyValue(result.initialInvestment, result.currency)}`,
        `Final amount received: ${formatCurrencyValue(result.finalAmount, result.currency)}`,
        `Investment length: ${input.term} ${input.termUnit}`,
        `Compounding method: ${compoundingLabel}`,
        `Deposit or withdrawal: ${formatCurrencyValue(result.periodicCashFlow, result.currency)}`,
        `Cash flow frequency: ${cashFlowLabel}`,
        `Timing: ${result.paymentTiming === 'end' ? 'End of period' : 'Beginning of period'}`,
        `The rate of return is ${result.formattedRate}%.`,
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
            Annual nominal rate of return · {currencyNote}
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
        <RateOfReturnForm
          input={input}
          errors={errors}
          result={result}
          onChange={handleChange}
          onCurrencyChange={handleCurrencyChange}
          onReset={handleReset}
        />
        <RateOfReturnResults />
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