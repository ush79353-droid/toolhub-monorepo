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
  NetToGrossDriver,
  NetToGrossFieldErrors,
  NetToGrossInput,
  NetToGrossResult,
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

interface NetToGrossFormProps {
  input: NetToGrossInput;
  errors: NetToGrossFieldErrors;
  result: NetToGrossResult | null;
  onChange: (input: NetToGrossInput) => void;
}

export function NetToGrossForm({
  input,
  errors,
  result,
  onChange,
}: NetToGrossFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const netSymbol = getCurrencySymbol(input.netCurrency);
  const grossSymbol = getCurrencySymbol(input.grossCurrency);
  const taxSymbol = getCurrencySymbol(input.taxCurrency);

  const displayNet =
    result && input.driver !== 'net' && input.driver !== 'rateFromNet'
      ? result.formattedNetAmount
      : input.netAmount;
  const displayGross =
    result && input.driver !== 'gross' && input.driver !== 'rateFromGross'
      ? result.formattedGrossAmount
      : input.grossAmount;
  const displayTax =
    result && input.driver !== 'tax' ? result.formattedTaxAmount : input.taxAmount;
  const displayRn =
    result && input.driver !== 'rateFromNet' && input.driver !== 'net'
      ? result.formattedRateFromNet
      : input.rateFromNet;
  const displayRg =
    result && input.driver !== 'rateFromGross' && input.driver !== 'gross'
      ? result.formattedRateFromGross
      : input.rateFromGross;

  const set = (patch: Partial<NetToGrossInput>) => {
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
      driver: 'net' as NetToGrossDriver,
    });
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
      driver: 'gross' as NetToGrossDriver,
    });
  };

  const handleTaxCurrency = (next: SupportedCurrency) => {
    if (next === input.taxCurrency) return;
    const converted = convertField(input.taxAmount, input.taxCurrency, next);
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      taxCurrency: next,
      taxAmount: converted.value,
      driver: 'tax' as NetToGrossDriver,
    });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-3.5"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="ntg-net">
          <span>Net amount</span>
        </label>
        <div className="flex gap-2">
          <FieldShell
            error={errors.netAmount}
            muted={
              Boolean(result) &&
              input.driver !== 'net' &&
              input.driver !== 'rateFromNet' &&
              input.driver !== 'tax'
            }
          >
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {netSymbol}
            </span>
            <input
              id="ntg-net"
              className={inputClass}
              inputMode="decimal"
              value={displayNet}
              aria-invalid={Boolean(errors.netAmount)}
              onChange={(e) =>
                set({ netAmount: e.target.value, driver: 'net' as NetToGrossDriver })
              }
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="ntg-net-currency"
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
        <label className={labelClass} htmlFor="ntg-rn">
          <span>Percentage tax (from net)</span>
          <InfoTooltip
            label="Percentage tax (from net)"
            text="Tax as a percent of the net amount: rN = (Tax / Net) × 100. Equivalent to rG = 100 × rN / (100 + rN). Not FX-converted."
          />
        </label>
        <FieldShell
          error={errors.rateFromNet}
          muted={Boolean(result) && input.driver !== 'rateFromNet' && input.driver !== 'net'}
        >
          <input
            id="ntg-rn"
            className={`${inputClass} pr-8`}
            inputMode="decimal"
            value={displayRn}
            aria-invalid={Boolean(errors.rateFromNet)}
            onChange={(e) =>
              set({
                rateFromNet: e.target.value,
                driver: 'rateFromNet' as NetToGrossDriver,
              })
            }
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </FieldShell>
        {errors.rateFromNet ? (
          <p className="mt-1 text-xs text-rose-600">{errors.rateFromNet}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ntg-rg">
          <span>Percentage tax (from gross)</span>
          <InfoTooltip
            label="Percentage tax (from gross)"
            text="Tax as a percent of the gross amount: rG = (Tax / Gross) × 100. Must be ≥ 0 and &lt; 100%. Not a second separate tax."
          />
        </label>
        <FieldShell
          error={errors.rateFromGross}
          muted={
            Boolean(result) && input.driver !== 'rateFromGross' && input.driver !== 'gross'
          }
        >
          <input
            id="ntg-rg"
            className={`${inputClass} pr-8`}
            inputMode="decimal"
            value={displayRg}
            aria-invalid={Boolean(errors.rateFromGross)}
            onChange={(e) =>
              set({
                rateFromGross: e.target.value,
                driver: 'rateFromGross' as NetToGrossDriver,
              })
            }
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </FieldShell>
        {errors.rateFromGross ? (
          <p className="mt-1 text-xs text-rose-600">{errors.rateFromGross}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ntg-gross">
          <span>Gross amount</span>
        </label>
        <div className="flex gap-2">
          <FieldShell
            error={errors.grossAmount}
            muted={
              Boolean(result) &&
              input.driver !== 'gross' &&
              input.driver !== 'rateFromGross' &&
              input.driver !== 'tax'
            }
          >
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {grossSymbol}
            </span>
            <input
              id="ntg-gross"
              className={inputClass}
              inputMode="decimal"
              value={displayGross}
              aria-invalid={Boolean(errors.grossAmount)}
              onChange={(e) =>
                set({
                  grossAmount: e.target.value,
                  driver: 'gross' as NetToGrossDriver,
                })
              }
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="ntg-gross-currency"
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

      <div>
        <label className={labelClass} htmlFor="ntg-tax">
          <span>Tax amount</span>
        </label>
        <div className="flex gap-2">
          <FieldShell
            error={errors.taxAmount}
            muted={Boolean(result) && input.driver !== 'tax'}
          >
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {taxSymbol}
            </span>
            <input
              id="ntg-tax"
              className={`${inputClass} font-semibold`}
              inputMode="decimal"
              value={displayTax}
              aria-invalid={Boolean(errors.taxAmount)}
              onChange={(e) =>
                set({ taxAmount: e.target.value, driver: 'tax' as NetToGrossDriver })
              }
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="ntg-tax-currency"
              value={input.taxCurrency}
              onChange={handleTaxCurrency}
              aria-label="Tax amount currency"
            />
          </div>
        </div>
        {errors.taxAmount ? (
          <p className="mt-1 text-xs text-rose-600">{errors.taxAmount}</p>
        ) : null}
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
