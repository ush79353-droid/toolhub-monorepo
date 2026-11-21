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
import { MvaForm } from './MvaForm';
import { MvaResults } from './MvaResults';
import { formatMoney } from './calculation';
import {
  createDefaultInput,
  type MvaFieldErrors,
  type MvaInput,
  type MvaResult,
} from './types';
import { validateMva } from './validation';

const MONEY_FIELDS = ['currentSharePrice', 'capitalInvested'] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts share price and capital invested using stored exchange rates. Shares outstanding, market value, and MVA sign stay consistent.';

function moneyDraftFromInput(input: MvaInput): Record<string, string> {
  return {
    currentSharePrice: Number.isFinite(input.currentSharePrice)
      ? String(input.currentSharePrice)
      : '',
    capitalInvested: Number.isFinite(input.capitalInvested) ? String(input.capitalInvested) : '',
  };
}

export function MvaCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<MvaInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<MvaFieldErrors>({});
  const [result, setResult] = React.useState<MvaResult | null>(null);
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

  const run = (next: MvaInput) => {
    const validation = validateMva(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleChange = (next: MvaInput) => {
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
      moneyDraftFromInput(input),
      MONEY_FIELDS,
      input.currency,
      currency,
      rates.rates,
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    const price = parseMoneyInput(converted.values.currentSharePrice ?? '');
    const capital = parseMoneyInput(converted.values.capitalInvested ?? '');
    handleChange({
      ...input,
      currency,
      currentSharePrice: Number.isFinite(price) ? price : Number.NaN,
      capitalInvested: Number.isFinite(capital) ? capital : Number.NaN,
    });
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setResult(null);
    setConversionError(null);
  };

  const symbol = getCurrencySymbol(input.currency);
  const summary =
    result && result.mva !== null
      ? [
          `${metadata.title} | Omega Calculators`,
          `Current share price: ${symbol}${formatMoney(input.currentSharePrice, input.currency)}`,
          `Shares outstanding: ${input.sharesOutstanding}`,
          `Current market value: ${symbol}${result.currentMarketValueDisplay}`,
          `Capital invested: ${symbol}${formatMoney(input.capitalInvested, input.currency)}`,
          `Market value added (MVA): ${symbol}${result.mvaDisplay}`,
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
            MVA = market value − capital invested. {currencyNote}
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
        <MvaForm
          input={input}
          errors={errors}
          result={result}
          onChange={handleChange}
          onCurrencyChange={handleCurrencyChange}
          onReset={handleReset}
        />
        <MvaResults />
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