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
import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import { ProfitabilityIndexForm } from './ProfitabilityIndexForm';
import { ProfitabilityIndexResults } from './ProfitabilityIndexResults';
import {
  createDefaultInput,
  type ProfitabilityIndexFieldErrors,
  type ProfitabilityIndexInput,
  type ProfitabilityIndexResult,
} from './types';
import { validateProfitabilityIndex } from './validation';

const MONEY_FIELDS = ['initialInvestment', 'pvFutureCashFlow'] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts the initial investment and PV of future cash flow using stored exchange rates. Profitability index ratio is unchanged when only currency changes.';

function buildShareText(
  metadataTitle: string,
  result: ProfitabilityIndexResult,
  note: string
): string {
  return [
    `${metadataTitle} | Omega Calculators`,
    `Initial investment: ${formatCurrencyValue(result.initialInvestment, result.currency)}`,
    `PV of future cash flow: ${formatCurrencyValue(result.pvFutureCashFlow, result.currency)}`,
    `Profitability index (PI): ${result.piDisplay}`,
    result.interpretation,
    note,
  ].join('\n');
}

export function ProfitabilityIndexCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<ProfitabilityIndexInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<ProfitabilityIndexFieldErrors>({});
  const [result, setResult] = React.useState<ProfitabilityIndexResult | null>(null);
  const [incomplete, setIncomplete] = React.useState(true);
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

  const run = (next: ProfitabilityIndexInput) => {
    const validation = validateProfitabilityIndex(next);
    setInput(next);
    setErrors(validation.errors);
    setIncomplete(validation.incomplete);
    setResult(validation.result);
  };

  const handleChange = (next: ProfitabilityIndexInput) => {
    setConversionError(null);
    run(next);
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
    setIncomplete(true);
    setCopied(false);
    setShared(false);
    setConversionError(null);
  };

  const sharePayload = result ? buildShareText(metadata.title, result, currencyNote) : '';
  const hasBlockingErrors = Object.keys(errors).length > 0;

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
            PI = PV of future cash flow ÷ initial investment. {currencyNote}
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
        <ProfitabilityIndexForm
          input={input}
          errors={errors}
          result={result}
          onChange={handleChange}
          onCurrencyChange={handleCurrencyChange}
          onReset={handleReset}
        />
        <ProfitabilityIndexResults
          hasResult={Boolean(result)}
          incomplete={incomplete}
          invalid={hasBlockingErrors && !incomplete}
          copied={copied}
          shared={shared}
          canShare={canShare}
          onCopy={() => {
            if (!result) return;
            void copyTextToClipboard(buildShareText(metadata.title, result, currencyNote)).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
          onShare={() => {
            if (!result || typeof navigator.share !== 'function') return;
            void navigator
              .share({
                title: metadata.title,
                text: sharePayload,
                url: typeof window !== 'undefined' ? window.location.href : undefined,
              })
              .then(() => {
                setShared(true);
                window.setTimeout(() => setShared(false), 2000);
              })
              .catch(() => {
                void copyTextToClipboard(
                  `${sharePayload}\n${typeof window !== 'undefined' ? window.location.href : ''}`
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