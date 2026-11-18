'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
} from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import { Button } from '@/components/ui/button';
import { calculateSeventyTwentyTen, describeResult } from './calculation';
import { SeventyTwentyTenForm } from './SeventyTwentyTenForm';
import { SeventyTwentyTenResults } from './SeventyTwentyTenResults';
import {
  createDefaultSeventyTwentyTenInput,
  periodNoun,
  type SeventyTwentyTenFieldErrors,
  type SeventyTwentyTenInput,
  type SeventyTwentyTenResult,
} from './types';
import { validateSeventyTwentyTen } from './validation';

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts income and spending using stored exchange rates. Allocation percentages stay the same.';

const MONEY_KEYS = [
  'income',
  'needsSpending',
  'savingsSpending',
  'lifestyleSpending',
] as const;

function convertMoneyAmount(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: Record<string, number>
): { ok: true; amount: number } | { ok: false } {
  if (!Number.isFinite(amount)) return { ok: true, amount };
  const converted = convertCurrency({ amount, from, to, rates });
  if (!converted.ok) return { ok: false };
  return { ok: true, amount: converted.amount };
}

function summaryText(metadataTitle: string, result: SeventyTwentyTenResult, note: string): string {
  if (!result.defined) return '';
  const money = (value: number) => formatCurrencyValue(value, result.currency);
  const period = periodNoun(result.frequency);
  const lines = [
    `${metadataTitle} — Omega Calculators`,
    `After-tax income /${period}: ${money(result.income)}`,
    ...result.categories.map(
      (category) =>
        `${category.label} (${category.percent}%): ${money(category.budget)}; actual ${money(category.spending)}; ${category.status}`
    ),
    `Total actual: ${money(result.totalSpending)}`,
    result.overspending > 0
      ? `Overspending: ${money(result.overspending)}`
      : `Unallocated: ${money(result.unallocated)}`,
    `Monthly income: ${money(result.monthlyIncome)}`,
    `Annual income: ${money(result.annualIncome)}`,
    describeResult(result),
    note,
  ];
  return lines.join('\n');
}

export function SeventyTwentyTenCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [input, setInput] = React.useState<SeventyTwentyTenInput>(() => createDefaultSeventyTwentyTenInput());
  const [errors, setErrors] = React.useState<SeventyTwentyTenFieldErrors>({});
  const [result, setResult] = React.useState<SeventyTwentyTenResult | null>(() =>
    calculateSeventyTwentyTen(createDefaultSeventyTwentyTenInput())
  );
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

  const run = (next: SeventyTwentyTenInput) => {
    const validation = validateSeventyTwentyTen(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? calculateSeventyTwentyTen(next) : null);
  };

  const handleCurrencyChange = (currency: SupportedCurrency) => {
    if (currency === input.currency) return;
    if (!rates.available) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const next: SeventyTwentyTenInput = { ...input, currency };
    for (const key of MONEY_KEYS) {
      const converted = convertMoneyAmount(input[key], input.currency, currency, rates.rates);
      if (!converted.ok) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      next[key] = converted.amount;
    }
    setConversionError(null);
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
        <div className="flex flex-wrap items-center justify-end gap-2">
          {headerActions}
          <div className="w-[148px] shrink-0 sm:w-[160px]">
            <label htmlFor="budget-currency" className="sr-only">
              Display currency
            </label>
            <CurrencySelect
              id="budget-currency"
              value={input.currency}
              onChange={handleCurrencyChange}
            />
          </div>
        </div>
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
        <SeventyTwentyTenForm
          input={input}
          errors={errors}
          onChange={(next) => {
            setConversionError(null);
            setInput(next);
            run(next);
          }}
          onSubmit={(event) => {
            event.preventDefault();
            run(input);
          }}
          onReset={() => {
            const fresh = createDefaultSeventyTwentyTenInput();
            setInput(fresh);
            setErrors({});
            setResult(calculateSeventyTwentyTen(fresh));
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
        <SeventyTwentyTenResults result={result} />
      </div>
    </section>
  );
}
