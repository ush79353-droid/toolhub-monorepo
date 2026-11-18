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
import { parseMoneyInput } from '@/tools/shared/money-value';
import { NopatForm } from './NopatForm';
import { NopatResults } from './NopatResults';
import { formatMoney } from './calculation';
import {
  createDefaultInput,
  type NopatFieldErrors,
  type NopatInput,
  type NopatResult,
} from './types';
import { validateNopat } from './validation';

const NOPAT_MONEY_KEYS = [
  'operatingProfit',
  'netIncome',
  'nonOperatingIncomeLoss',
  'nonOperatingIncomeGain',
  'interestExpense',
  'tax',
] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts operating profit and every precise-mode income statement amount using stored exchange rates. Tax rate % and NOPAT formula mode stay unchanged.';

function nopatMoneyDraft(input: NopatInput): Record<string, string> {
  const draft: Record<string, string> = {};
  for (const key of NOPAT_MONEY_KEYS) {
    const value = input[key];
    draft[key] = Number.isFinite(value) ? String(value) : '';
  }
  return draft;
}

export function NopatCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<NopatInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<NopatFieldErrors>({});
  const [result, setResult] = React.useState<NopatResult | null>(() => {
    const initial = validateNopat(createDefaultInput());
    return initial.result;
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

  const run = (next: NopatInput) => {
    const validation = validateNopat(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleChange = (next: NopatInput) => {
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
      nopatMoneyDraft(input),
      NOPAT_MONEY_KEYS,
      input.currency,
      currency,
      rates.rates
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    const moneyPatch: Partial<NopatInput> = { currency };
    for (const key of NOPAT_MONEY_KEYS) {
      moneyPatch[key] = parseMoneyInput(converted.values[key] ?? '');
    }
    handleChange({ ...input, ...moneyPatch });
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setResult(validateNopat(fresh).result);
    setConversionError(null);
  };

  const symbol = getCurrencySymbol(input.currency);
  const summary =
    result && result.nopat !== null
      ? input.mode === 'simple'
        ? [
            `${metadata.title} — Omega Calculators`,
            'Mode: Simple NOPAT formula',
            `Operating profit: ${symbol}${formatMoney(input.operatingProfit, input.currency)}`,
            `Tax rate: ${input.taxRatePercent}%`,
            `NOPAT: ${symbol}${result.nopatDisplay}`,
            currencyNote,
          ].join('\n')
        : [
            `${metadata.title} — Omega Calculators`,
            'Mode: Precise NOPAT formula',
            `Net income: ${symbol}${formatMoney(input.netIncome, input.currency)}`,
            `Non-operating income loss: ${symbol}${formatMoney(input.nonOperatingIncomeLoss, input.currency)}`,
            `Non-operating income gain: ${symbol}${formatMoney(input.nonOperatingIncomeGain, input.currency)}`,
            `Interest expense: ${symbol}${formatMoney(input.interestExpense, input.currency)}`,
            `Tax: ${symbol}${formatMoney(input.tax, input.currency)}`,
            `Tax rate: ${input.taxRatePercent}%`,
            `NOPAT: ${symbol}${result.nopatDisplay}`,
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
            NOPAT = operating profit after tax, excluding financing effects. {currencyNote}
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
        <NopatForm
          input={input}
          errors={errors}
          result={result}
          onChange={handleChange}
          onCurrencyChange={handleCurrencyChange}
          onReset={handleReset}
        />
        <NopatResults />
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