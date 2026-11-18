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
import { type SupportedCurrency } from '@/tools/shared/currency';
import { InvestmentForm } from './InvestmentForm';
import { InvestmentResults } from './InvestmentResults';
import {
  createDefaultInput,
  type InvestmentFieldErrors,
  type InvestmentInput,
  type InvestmentResult,
} from './types';
import { validateInvestmentInput } from './validation';

const MONEY_FIELDS = ['initialInvestment', 'contributionAmount'] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts initial investment and contribution amounts using stored exchange rates. Return rate, term, compounding, and schedule stay the same.';

export function InvestmentCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<InvestmentInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<InvestmentFieldErrors>({});
  const [result, setResult] = React.useState<InvestmentResult | null>(() => {
    const validation = validateInvestmentInput(createDefaultInput());
    return validation.result;
  });
  const [incomplete, setIncomplete] = React.useState(false);
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

  const apply = (next: InvestmentInput) => {
    setInput(next);
    const validation = validateInvestmentInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
    setIncomplete(!validation.isValid && Object.keys(validation.errors).length === 0);
  };

  const handleChange = (next: InvestmentInput) => {
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
    const fresh = createDefaultInput();
    setInput(fresh);
    const validation = validateInvestmentInput(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setIncomplete(false);
    setCopied(false);
    setShared(false);
    setConversionError(null);
  };

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Final balance: ${result.formattedFinalBalance}`,
        `Investment return: ${result.formattedReturn}`,
        result.formattedInflationAdjusted
          ? `Inflation-adjusted: ${result.formattedInflationAdjusted}`
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
            Project final balance with compounding and optional contributions. {currencyNote}
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
        <InvestmentForm
          input={input}
          errors={errors}
          onChange={handleChange}
          onCurrencyChange={handleCurrencyChange}
          onReset={handleReset}
        />
        <InvestmentResults
          result={result}
          incomplete={incomplete}
          hasErrors={Object.keys(errors).length > 0}
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