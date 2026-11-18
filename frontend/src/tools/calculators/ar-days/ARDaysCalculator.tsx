'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertCurrency } from '@/tools/shared/convert-currency';
import { CURRENCY_CONVERSION_UNAVAILABLE_NOTE } from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import { Button } from '@/components/ui/button';
import { ARDaysForm } from './ARDaysForm';
import { ARDaysResults } from './ARDaysResults';
import { calculateARDays, describeResult } from './calculation';
import {
  createDefaultARDaysInput,
  type ARDaysFieldErrors,
  type ARDaysInput,
  type ARDaysResult,
} from './types';
import { validateARDays } from './validation';

const MONEY_KEYS = [
  'accountsReceivable',
  'netCreditSales',
  'beginningReceivable',
  'endingReceivable',
] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts receivables and credit sales using stored exchange rates. Period days and A/R days stay the same.';

function daysText(value: number): string {
  const rounded = Math.round(value * 10000) / 10000;
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(rounded);
}

function summaryText(metadataTitle: string, result: ARDaysResult, note: string): string {
  if (
    !result.defined ||
    result.arDays === null ||
    result.accountsReceivableUsed === null ||
    result.netCreditSales === null ||
    result.periodDays === null
  ) {
    return '';
  }
  const money = (value: number) => formatCurrencyValue(value, result.currency);
  const lines = [
    `${metadataTitle} — Omega Calculators`,
    `A/R days: ${daysText(result.arDays)}`,
    `Receivables used: ${money(result.accountsReceivableUsed)}`,
    `Net credit sales: ${money(result.netCreditSales)}`,
    `Days in the period: ${daysText(result.periodDays)}`,
  ];
  if (result.averageReceivable !== null) lines.push(`Average A/R: ${money(result.averageReceivable)}`);
  lines.push(describeResult(result));
  lines.push(note);
  return lines.join('\n');
}

function convertArMoney(
  input: ARDaysInput,
  from: string,
  to: string,
  rates: Record<string, number>
): Partial<ARDaysInput> | null {
  const patch: Partial<ARDaysInput> = {};
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

export function ARDaysCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<ARDaysInput>(() => createDefaultARDaysInput());
  const [errors, setErrors] = React.useState<ARDaysFieldErrors>({});
  const [result, setResult] = React.useState<ARDaysResult | null>(null);
  const [averageSectionOpen, setAverageSectionOpen] = React.useState(false);
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

  const run = (next: ARDaysInput) => {
    const validation = validateARDays(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? calculateARDays(next) : null);
  };

  const handleChange = (next: ARDaysInput) => {
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
    const moneyPatch = convertArMoney(input, input.currency, currency, rates.rates);
    if (!moneyPatch) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    const next: ARDaysInput = { ...input, ...moneyPatch, currency };
    setInput(next);
    run(next);
  };

  const summary = result ? summaryText(metadata.title, result, currencyNote) : '';

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
        <ARDaysForm
          input={input}
          errors={errors}
          result={result}
          averageSectionOpen={averageSectionOpen}
          onAverageSectionOpenChange={setAverageSectionOpen}
          onChange={handleChange}
          onCurrencyChange={handleCurrencyChange}
          onReset={() => {
            const fresh = createDefaultARDaysInput();
            setInput(fresh);
            setErrors({});
            setResult(null);
            setAverageSectionOpen(false);
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
                  // The user dismissed the share sheet.
                }
              }}
            >
              {shared ? 'Shared' : 'Share'}
            </Button>
          ) : null}
        </div>
        <ARDaysResults />
      </div>
    </section>
  );
}