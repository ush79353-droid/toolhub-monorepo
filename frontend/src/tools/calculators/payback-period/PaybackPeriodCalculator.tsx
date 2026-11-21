'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  convertDraftMoneyFields,
  convertDraftMoneyList,
} from '@/tools/shared/convert-currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { type SupportedCurrency } from '@/tools/shared/currency';
import { PaybackPeriodForm } from './PaybackPeriodForm';
import { PaybackPeriodResults } from './PaybackPeriodResults';
import {
  createDefaultInput,
  type PaybackPeriodFieldErrors,
  type PaybackPeriodInput,
  type PaybackPeriodResult,
} from './types';
import { validatePaybackPeriodInput } from './validation';

const MONEY_FIELDS = ['initialInvestment', 'annualCashFlow'] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts the initial investment, steady annual cash flow, and every irregular year amount using stored exchange rates. Discount rate and payback durations are unchanged.';

export function PaybackPeriodCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<PaybackPeriodInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<PaybackPeriodFieldErrors>({});
  const [result, setResult] = React.useState<PaybackPeriodResult | null>(null);
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

  const run = (next: PaybackPeriodInput) => {
    const validation = validatePaybackPeriodInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleChange = (next: PaybackPeriodInput) => {
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
    const convertedFields = convertDraftMoneyFields(
      input,
      MONEY_FIELDS,
      input.currency,
      currency,
      rates.rates
    );
    if (!convertedFields.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const yearCashFlows = convertDraftMoneyList(
      input.yearCashFlows,
      input.currency,
      currency,
      rates.rates
    );
    if (!yearCashFlows.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    handleChange({
      ...input,
      ...convertedFields.values,
      yearCashFlows: yearCashFlows.values,
      currency,
    });
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

  const shareText = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Steady payback: ${result.steadyPaybackDisplay}`,
        `Steady discounted: ${result.steadyDiscountedDisplay}`,
        `Irregular payback: ${result.irregularPaybackDisplay}`,
        `Irregular discounted: ${result.irregularDiscountedDisplay}`,
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
        <PaybackPeriodForm
          input={input}
          errors={errors}
          result={result}
          onChange={handleChange}
          onCurrencyChange={handleCurrencyChange}
          onReset={handleReset}
        />
        <PaybackPeriodResults
          hasResult={Boolean(result)}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!shareText) return;
            void copyTextToClipboard(shareText).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (!shareText || typeof navigator.share !== 'function') return;
            void navigator
              .share({
                title: metadata.title,
                text: shareText,
                url: typeof window !== 'undefined' ? window.location.href : undefined,
              })
              .then(() => {
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              })
              .catch(() => {
                void copyTextToClipboard(
                  `${shareText}\n${typeof window !== 'undefined' ? window.location.href : ''}`
                ).then((ok) => {
                  if (!ok) return;
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                });
              });
          }}
        />
      </div>
    </section>
  );
}