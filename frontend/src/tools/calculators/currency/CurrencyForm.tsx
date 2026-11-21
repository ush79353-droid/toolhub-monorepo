'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  CURRENCY_CONVERSION_STALE_NOTE,
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
} from '@/tools/shared/currency-rates';
import { useCurrencyRatesStatus } from '@/tools/shared/CurrencyRatesProvider';
import {
  getCurrency,
  SUPPORTED_CURRENCY_CODES,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  CurrencyCalculatorFieldErrors,
  CurrencyCalculatorInput,
  CurrencyCalculatorResult,
} from './types';
import { POPULAR_CURRENCY_CODES } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

function formatFetchedAt(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZoneName: 'short',
  }).format(date);
}

interface CurrencyFormProps {
  input: CurrencyCalculatorInput;
  errors: CurrencyCalculatorFieldErrors;
  result: CurrencyCalculatorResult | null;
  onChange: (input: CurrencyCalculatorInput) => void;
  onCalculate: () => void;
  onClear: () => void;
}

export function CurrencyForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
}: CurrencyFormProps) {
  const ratesStatus = useCurrencyRatesStatus();
  const allowedCodes = input.popularOnly
    ? POPULAR_CURRENCY_CODES
    : SUPPORTED_CURRENCY_CODES;

  const set = (patch: Partial<CurrencyCalculatorInput>) => {
    onChange({ ...input, ...patch });
  };

  const handlePopularToggle = (checked: boolean) => {
    if (!checked) {
      set({ popularOnly: false });
      return;
    }
    set({
      popularOnly: true,
      fromCurrency: ensureAllowedInPopular(input.fromCurrency),
      toCurrency: ensureAllowedInPopular(input.toCurrency),
    });
  };

  const fetchedLabel = formatFetchedAt(result?.fetchedAt ?? ratesStatus.fetchedAt);
  const fromName = getCurrency(input.fromCurrency).name;
  const toName = getCurrency(input.toCurrency).name;

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-accent">With live exchange rate</p>

      <div>
        <label htmlFor="currency-amount" className={labelClass}>
          Amount
        </label>
        <FieldShell error={errors.amount}>
          <input
            id="currency-amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={input.amount}
            onChange={(event) => set({ amount: event.target.value })}
            className={inputClass}
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? 'currency-amount-error' : undefined}
          />
        </FieldShell>
        {errors.amount ? (
          <p id="currency-amount-error" className="mt-1 text-xs text-rose-600">
            {errors.amount}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="currency-from" className={labelClass}>
          From
        </label>
        <CurrencySelect
          id="currency-from"
          value={input.fromCurrency}
          onChange={(code) => set({ fromCurrency: code })}
          aria-label={`From currency (${fromName})`}
          allowedCodes={allowedCodes}
          showDenominationNote={false}
          className="h-11 [&_button]:h-11 [&_button]:text-sm"
        />
      </div>

      <div>
        <label htmlFor="currency-to" className={labelClass}>
          To
        </label>
        <CurrencySelect
          id="currency-to"
          value={input.toCurrency}
          onChange={(code) => set({ toCurrency: code })}
          aria-label={`To currency (${toName})`}
          allowedCodes={allowedCodes}
          showDenominationNote={false}
          className="h-11 [&_button]:h-11 [&_button]:text-sm"
        />
      </div>

      <label className="flex cursor-pointer items-start gap-2.5 text-sm text-accent">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-ring"
          checked={input.popularOnly}
          onChange={(event) => handlePopularToggle(event.target.checked)}
        />
        <span>Show most popular currencies only</span>
      </label>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button
          type="button"
          className="h-11 min-w-[8.5rem] rounded-xl px-5 text-sm font-semibold"
          onClick={onCalculate}
        >
          Calculate
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 min-w-[6rem] rounded-xl border-border px-5 text-sm font-semibold text-accent"
          onClick={onClear}
        >
          Clear
        </Button>
      </div>

      {errors.form ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {errors.form}
        </p>
      ) : null}

      {!ratesStatus.available ? (
        <p className="text-xs text-muted-foreground">
          {CURRENCY_CONVERSION_UNAVAILABLE_NOTE} Same-currency conversion still works.
        </p>
      ) : ratesStatus.isStale ? (
        <p className="text-xs text-amber-700">{CURRENCY_CONVERSION_STALE_NOTE}</p>
      ) : null}

      {result ? (
        <div
          className="space-y-2 rounded-xl border border-border bg-brand-softTeal/35 p-4"
          aria-live="polite"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Converted result
          </p>
          <p className="text-lg font-semibold tabular-nums text-accent sm:text-xl">
            {result.formattedAmount} {result.fromCurrency} ={' '}
            {result.formattedConvertedAmount} {result.toCurrency}
          </p>
          <p className="text-sm tabular-nums text-foreground/90">
            1 {result.fromCurrency} = {result.formattedRateFromTo} {result.toCurrency}
          </p>
          <p className="text-sm tabular-nums text-foreground/90">
            1 {result.toCurrency} = {result.formattedRateToFrom} {result.fromCurrency}
          </p>
          <p className="text-xs text-muted-foreground">
            {fetchedLabel
              ? `Rates as of ${fetchedLabel}`
              : 'Rate timestamp unavailable'}
            {result.isStale ? ' (stale snapshot still applied).' : '.'} Source: stored Omega
            FX map (ExchangeRate-API upstream via server sync). Base/quote uses{' '}
            {result.fromCurrency}→{result.toCurrency}.
          </p>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Enter an amount, choose currencies, then press Calculate.
        </p>
      )}
    </div>
  );
}

function ensureAllowedInPopular(code: SupportedCurrency): SupportedCurrency {
  if ((POPULAR_CURRENCY_CODES as readonly string[]).includes(code)) return code;
  return 'USD';
}
