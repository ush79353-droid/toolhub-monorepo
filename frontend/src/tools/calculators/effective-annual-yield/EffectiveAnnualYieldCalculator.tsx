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
import { EffectiveAnnualYieldForm } from './EffectiveAnnualYieldForm';
import { EffectiveAnnualYieldResults } from './EffectiveAnnualYieldResults';
import {
  createDefaultInput,
  type EffectiveAnnualYieldFieldErrors,
  type EffectiveAnnualYieldInput,
  type EffectiveAnnualYieldResult,
} from './types';
import { validateEffectiveAnnualYieldInput } from './validation';

const MONEY_FIELDS = ['faceValue', 'annualCouponPayment'] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts face value and coupon payment using stored exchange rates. Coupon rate % and effective annual yield % stay the same.';

const FREQUENCY_LABEL = {
  annually: 'Annually',
  semiannually: 'Semiannually',
  quarterly: 'Quarterly',
  monthly: 'Monthly',
} as const;

export function EffectiveAnnualYieldCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<EffectiveAnnualYieldInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<EffectiveAnnualYieldFieldErrors>({});
  const [result, setResult] = React.useState<EffectiveAnnualYieldResult | null>(null);
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

  const apply = (next: EffectiveAnnualYieldInput) => {
    setInput(next);
    const validation = validateEffectiveAnnualYieldInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleChange = (next: EffectiveAnnualYieldInput) => {
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
      {
        faceValue: input.faceValue,
        annualCouponPayment: input.annualCouponPayment,
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
    const next: EffectiveAnnualYieldInput = {
      ...input,
      ...converted.values,
      currency,
    };
    apply(next);
  };

  const handleReset = () => {
    setInput(createDefaultInput());
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
    setConversionError(null);
  };

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Face value: ${formatCurrencyValue(result.faceValue, result.currency)}`,
        `Annual coupon payment: ${formatCurrencyValue(result.annualCouponPayment, result.currency)}`,
        `Coupon rate: ${result.formattedCouponRatePercent}%`,
        `Coupon frequency: ${FREQUENCY_LABEL[result.couponFrequency]}`,
        `Effective annual yield: ${result.formattedEffectiveAnnualYieldPercent}%`,
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
            Coupon-rate EAY = (1 + r/n)^n − 1 · {currencyNote}
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
        <EffectiveAnnualYieldForm
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
        <EffectiveAnnualYieldResults />
      </div>
    </section>
  );
}