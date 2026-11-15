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
import { AverageCollectionPeriodForm } from './AverageCollectionPeriodForm';
import { AverageCollectionPeriodResults } from './AverageCollectionPeriodResults';
import { calculateAverageCollectionPeriod, describeResult } from './calculation';
import {
  createDefaultInput,
  type AverageCollectionPeriodFieldErrors,
  type AverageCollectionPeriodInput,
  type AverageCollectionPeriodResult,
} from './types';
import { validateAverageCollectionPeriod } from './validation';

const MONEY_KEYS = [
  'beginningReceivable',
  'endingReceivable',
  'averageReceivable',
  'totalCreditSales',
] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts receivables and credit sales using stored exchange rates. Duration days, turnover ratio, and collection period days stay the same.';

function daysText(value: number): string {
  const rounded = Math.round(value * 10000) / 10000;
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(rounded);
}

function summaryText(
  metadataTitle: string,
  result: AverageCollectionPeriodResult,
  note: string
): string {
  if (!result.defined || result.collectionPeriodDays === null || result.durationDays === null) {
    return '';
  }
  const lines = [
    `${metadataTitle} — Omega Calculators`,
    `Average collection period: ${daysText(result.collectionPeriodDays)} days`,
    `Duration: ${daysText(result.durationDays)} days`,
  ];
  if (result.method === 'average-ar') {
    if (result.averageReceivable !== null) {
      lines.push(
        `Average accounts receivable: ${formatCurrencyValue(result.averageReceivable, result.currency)}`
      );
    }
    if (result.totalCreditSales !== null) {
      lines.push(
        `Total credit sales: ${formatCurrencyValue(result.totalCreditSales, result.currency)}`
      );
    }
  } else if (result.receivablesTurnoverRatio !== null) {
    lines.push(`Receivables turnover ratio: ${daysText(result.receivablesTurnoverRatio)}`);
  }
  if (result.termsOfCreditDays !== null) {
    lines.push(`Terms of credit: ${daysText(result.termsOfCreditDays)} days`);
  }
  lines.push(describeResult(result));
  lines.push(note);
  return lines.join('\n');
}

function convertAcpMoney(
  input: AverageCollectionPeriodInput,
  from: string,
  to: string,
  rates: Record<string, number>
): Partial<AverageCollectionPeriodInput> | null {
  const patch: Partial<AverageCollectionPeriodInput> = {};
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

export function AverageCollectionPeriodCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<AverageCollectionPeriodInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<AverageCollectionPeriodFieldErrors>({});
  const [result, setResult] = React.useState<AverageCollectionPeriodResult | null>(null);
  const [averageSectionOpen, setAverageSectionOpen] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const currencyNote = ratesStatus.available
    ? CURRENCY_CONVERSION_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const run = (next: AverageCollectionPeriodInput) => {
    const validation = validateAverageCollectionPeriod(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? calculateAverageCollectionPeriod(next) : null);
  };

  const handleChange = (next: AverageCollectionPeriodInput) => {
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
    const moneyPatch = convertAcpMoney(input, input.currency, currency, rates.rates);
    if (!moneyPatch) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    const next: AverageCollectionPeriodInput = { ...input, ...moneyPatch, currency };
    setInput(next);
    run(next);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setResult(null);
    setAverageSectionOpen(true);
    setConversionError(null);
  };

  const summary = result ? summaryText(metadata.title, result, currencyNote) : '';

  const handleShare = async () => {
    const text =
      summary ||
      `${metadata.title} — Calculate average collection period at Omega Calculators`;
    if (await copyTextToClipboard(text)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

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
        <AverageCollectionPeriodForm
          input={input}
          errors={errors}
          result={result}
          averageSectionOpen={averageSectionOpen}
          copied={copied}
          onAverageSectionOpenChange={setAverageSectionOpen}
          onChange={handleChange}
          onCurrencyChange={handleCurrencyChange}
          onReset={handleReset}
          onShare={handleShare}
        />
        <AverageCollectionPeriodResults />
      </div>
    </section>
  );
}