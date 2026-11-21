'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertCurrency } from '@/tools/shared/convert-currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { type SupportedCurrency } from '@/tools/shared/currency';
import { DirectMaterialPriceVarianceForm } from './DirectMaterialPriceVarianceForm';
import { DirectMaterialPriceVarianceResults } from './DirectMaterialPriceVarianceResults';
import { formatMoney, statusLabel } from './calculation';
import {
  createDefaultInput,
  type DirectMaterialPriceVarianceFieldErrors,
  type DirectMaterialPriceVarianceInput,
  type DirectMaterialPriceVarianceResult,
} from './types';
import { validateDirectMaterialPriceVariance } from './validation';

const MONEY_KEYS = ['standardRate', 'actualRate'] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts standard and actual material rates and price variance using stored exchange rates. Quantity stays the same.';

function convertDmpvMoney(
  input: DirectMaterialPriceVarianceInput,
  from: string,
  to: string,
  rates: Record<string, number>
): Partial<DirectMaterialPriceVarianceInput> | null {
  const patch: Partial<DirectMaterialPriceVarianceInput> = {};
  for (const key of MONEY_KEYS) {
    const amount = input[key];
    if (!Number.isFinite(amount)) {
      patch[key] = amount;
      continue;
    }
    const converted = convertCurrency({ amount, from, to, rates });
    if (!converted.ok) return null;
    patch[key] = converted.amount;
  }
  return patch;
}

export function DirectMaterialPriceVarianceCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<DirectMaterialPriceVarianceInput>(() =>
    createDefaultInput()
  );
  const [errors, setErrors] = React.useState<DirectMaterialPriceVarianceFieldErrors>({});
  const [result, setResult] = React.useState<DirectMaterialPriceVarianceResult | null>(null);
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

  const run = (next: DirectMaterialPriceVarianceInput) => {
    const validation = validateDirectMaterialPriceVariance(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleChange = (next: DirectMaterialPriceVarianceInput) => {
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
    const moneyPatch = convertDmpvMoney(input, input.currency, currency, rates.rates);
    if (!moneyPatch) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    handleChange({ ...input, ...moneyPatch, currency });
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setResult(null);
    setConversionError(null);
  };

  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Standard rate: ${formatMoney(result.standardRate, result.currency)}`,
        `Actual rate: ${formatMoney(result.actualRate, result.currency)}`,
        `Quantity: ${result.quantity}`,
        `Price variance: ${formatMoney(result.variance, result.currency)} (${statusLabel(result.status)})`,
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
        {conversionError ? (
          <p className="text-xs text-rose-600" role="alert">
            {conversionError}
          </p>
        ) : null}
        {ratesStatus.warning && !conversionError ? (
          <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
        ) : null}
        <DirectMaterialPriceVarianceForm
          input={input}
          errors={errors}
          result={result}
          onChange={handleChange}
          onCurrencyChange={handleCurrencyChange}
          onReset={handleReset}
        />
        <DirectMaterialPriceVarianceResults />
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