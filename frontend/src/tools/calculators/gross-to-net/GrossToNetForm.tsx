'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  isCurrencyRateUsable,
} from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import {
  moneyAmountToInputString,
  parseMoneyInput,
} from '@/tools/shared/money-value';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  GrossToNetFieldErrors,
  GrossToNetInput,
  GrossToNetMode,
  GrossToNetResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  muted,
  children,
}: {
  error?: string;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

interface GrossToNetFormProps {
  input: GrossToNetInput;
  errors: GrossToNetFieldErrors;
  result: GrossToNetResult | null;
  onChange: (input: GrossToNetInput) => void;
}

export function GrossToNetForm({
  input,
  errors,
  result,
  onChange,
}: GrossToNetFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const grossSymbol = getCurrencySymbol(input.grossCurrency);
  const netSymbol = getCurrencySymbol(input.netCurrency);
  const taxSymbol = getCurrencySymbol(input.taxAmountCurrency);

  const displayGross =
    result && input.mode !== 'gross-to-net'
      ? result.formattedGrossAmount
      : input.grossAmount;
  const displayNet =
    result && input.mode !== 'net-to-gross'
      ? result.formattedNetAmount
      : input.netAmount;
  const displayTax = result ? result.formattedTaxAmount : '';

  const set = (patch: Partial<GrossToNetInput>) => {
    setConversionError(null);
    onChange({ ...input, ...patch });
  };

  const canConvertPair = (from: SupportedCurrency, to: SupportedCurrency) => {
    if (from === to) return true;
    return (
      rates.available &&
      isCurrencyRateUsable(rates.rates, from) &&
      isCurrencyRateUsable(rates.rates, to)
    );
  };

  const convertField = (
    raw: string,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): { ok: true; value: string } | { ok: false } => {
    const amount = parseMoneyInput(raw);
    if (!Number.isFinite(amount)) return { ok: true, value: raw };
    if (!canConvertPair(from, to)) return { ok: false };
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    if (!converted.ok) return { ok: false };
    return { ok: true, value: moneyAmountToInputString(converted.amount) };
  };

  const handleGrossCurrency = (next: SupportedCurrency) => {
    if (next === input.grossCurrency) return;
    const converted = convertField(input.grossAmount, input.grossCurrency, next);
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      grossCurrency: next,
      grossAmount: converted.value,
      mode: 'gross-to-net',
    });
  };

  const handleNetCurrency = (next: SupportedCurrency) => {
    if (next === input.netCurrency) return;
    const converted = convertField(input.netAmount, input.netCurrency, next);
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      netCurrency: next,
      netAmount: converted.value,
      mode: 'net-to-gross',
    });
  };

  const handleTaxCurrency = (next: SupportedCurrency) => {
    if (next === input.taxAmountCurrency) return;
    const driverCurrency =
      input.mode === 'gross-to-net' ? input.grossCurrency : input.netCurrency;
    if (!canConvertPair(driverCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, taxAmountCurrency: next });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-3.5"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="gtn-gross">
          <span>Gross amount</span>
        </label>
        <div className="flex gap-2">
          <FieldShell
            error={errors.grossAmount}
            muted={input.mode === 'net-to-gross' && Boolean(result)}
          >
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              {grossSymbol}
            </span>
            <input
              id="gtn-gross"
              className={inputClass}
              inputMode="decimal"
              value={displayGross}
              aria-invalid={Boolean(errors.grossAmount)}
              onChange={(e) =>
                set({
                  grossAmount: e.target.value,
                  mode: 'gross-to-net' as GrossToNetMode,
                })
              }
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="gtn-gross-currency"
              value={input.grossCurrency}
              onChange={handleGrossCurrency}
              aria-label="Gross amount currency"
            />
          </div>
        </div>
        {errors.grossAmount ? (
          <p className="mt-1 text-xs text-rose-600">{errors.grossAmount}</p>
        ) : null}
      </div>

      <fieldset>
        <legend className={labelClass}>
          <span>Tax rate type</span>
          <InfoTooltip
            label="Tax rate type"
            text="Gross to net deducts tax as a percent of gross. Net to gross reverses that relationship. This is not VAT-style tax-on-net."
          />
        </legend>
        <div className="mt-1.5 flex flex-wrap gap-4">
          {(
            [
              { value: 'gross-to-net', label: 'gross to net' },
              { value: 'net-to-gross', label: 'net to gross' },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="gtn-mode"
                className="h-4 w-4 accent-primary"
                checked={input.mode === option.value}
                onChange={() => set({ mode: option.value })}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="gtn-rate">
          <span>Insert the tax rate (%)</span>
          <InfoTooltip
            label="Tax rate"
            text="Percent of gross deducted as tax. Never FX-converted. Must be under 100% when converting net to gross."
          />
        </label>
        <FieldShell error={errors.taxRatePercent}>
          <input
            id="gtn-rate"
            className={`${inputClass} pr-8`}
            inputMode="decimal"
            value={input.taxRatePercent}
            aria-invalid={Boolean(errors.taxRatePercent)}
            onChange={(e) => set({ taxRatePercent: e.target.value })}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </FieldShell>
        {errors.taxRatePercent ? (
          <p className="mt-1 text-xs text-rose-600">{errors.taxRatePercent}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="gtn-net">
          <span>Net amount</span>
        </label>
        <div className="flex gap-2">
          <FieldShell
            error={errors.netAmount}
            muted={input.mode === 'gross-to-net' && Boolean(result)}
          >
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              {netSymbol}
            </span>
            <input
              id="gtn-net"
              className={inputClass}
              inputMode="decimal"
              value={displayNet}
              aria-invalid={Boolean(errors.netAmount)}
              onChange={(e) =>
                set({
                  netAmount: e.target.value,
                  mode: 'net-to-gross' as GrossToNetMode,
                })
              }
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="gtn-net-currency"
              value={input.netCurrency}
              onChange={handleNetCurrency}
              aria-label="Net amount currency"
            />
          </div>
        </div>
        {errors.netAmount ? (
          <p className="mt-1 text-xs text-rose-600">{errors.netAmount}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="gtn-tax">
          <span>Tax amount</span>
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              {taxSymbol}
            </span>
            <input
              id="gtn-tax"
              className={`${inputClass} font-semibold`}
              readOnly
              value={displayTax}
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="gtn-tax-currency"
              value={input.taxAmountCurrency}
              onChange={handleTaxCurrency}
              aria-label="Tax amount currency"
            />
          </div>
        </div>
      </div>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {ratesStatus.warning && !conversionError ? (
        <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
      ) : null}
      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
