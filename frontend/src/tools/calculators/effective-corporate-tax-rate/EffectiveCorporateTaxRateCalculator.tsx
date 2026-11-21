'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertDraftMoneyFields } from '@/tools/shared/convert-currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { type SupportedCurrency } from '@/tools/shared/currency';
import { Button } from '@/components/ui/button';
import { EffectiveCorporateTaxRateForm } from './EffectiveCorporateTaxRateForm';
import { EffectiveCorporateTaxRateResults } from './EffectiveCorporateTaxRateResults';
import { buildEffectiveCorporateTaxRateResult, describeResult } from './calculation';
import {
  createDefaultInput,
  type EffectiveCorporateTaxRateFieldErrors,
  type EffectiveCorporateTaxRateInput,
  type EffectiveCorporateTaxRateResult,
} from './types';
import { validateEffectiveCorporateTaxRateInput } from './validation';

const MONEY_FIELDS = ['earningsBeforeTax', 'incomeTaxPaid'] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts earnings and tax paid using stored exchange rates. Effective tax rate % unchanged.';

export function EffectiveCorporateTaxRateCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<EffectiveCorporateTaxRateInput>(() =>
    createDefaultInput()
  );
  const [errors, setErrors] = React.useState<EffectiveCorporateTaxRateFieldErrors>({});
  const [result, setResult] = React.useState<EffectiveCorporateTaxRateResult | null>(null);
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

  const run = (next: EffectiveCorporateTaxRateInput) => {
    const validation = validateEffectiveCorporateTaxRateInput(next);
    setErrors(validation.errors);
    if (validation.isValid && validation.parsed) {
      setResult(
        buildEffectiveCorporateTaxRateResult(
          validation.parsed.earningsBeforeTax,
          validation.parsed.incomeTaxPaid,
          validation.parsed.currency
        )
      );
    } else {
      setResult(null);
    }
  };

  const handleChange = (next: EffectiveCorporateTaxRateInput) => {
    setConversionError(null);
    setInput(next);
    run(next);
  };

  const handleCurrencyChange = (currency: SupportedCurrency) => {
    if (currency === input.currency) return;
    if (!rates.available) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertDraftMoneyFields(
      {
        earningsBeforeTax: input.earningsBeforeTax,
        incomeTaxPaid: input.incomeTaxPaid,
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
    handleChange({ ...input, ...converted.values, currency });
  };

  const summary = result
    ? [`${metadata.title} | Omega Calculators`, describeResult(result), currencyNote].join('\n')
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
        <div className="flex flex-wrap items-center justify-end gap-2">{headerActions}</div>
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
        <EffectiveCorporateTaxRateForm
          input={input}
          errors={errors}
          result={result}
          onChange={handleChange}
          onCurrencyChange={handleCurrencyChange}
          onReset={() => {
            const fresh = createDefaultInput();
            setInput(fresh);
            setErrors({});
            setResult(null);
            setConversionError(null);
          }}
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
                  // User dismissed the share sheet.
                }
              }}
            >
              {shared ? 'Shared' : 'Share'}
            </Button>
          ) : null}
        </div>
        <EffectiveCorporateTaxRateResults />
      </div>
    </section>
  );
}