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
import type { GstDriver, GstFieldErrors, GstInput, GstResult } from './types';

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

interface GstFormProps {
  input: GstInput;
  errors: GstFieldErrors;
  result: GstResult | null;
  onChange: (input: GstInput) => void;
}

export function GstForm({ input, errors, result, onChange }: GstFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const netSymbol = getCurrencySymbol(input.netCurrency);
  const grossSymbol = getCurrencySymbol(input.grossCurrency);
  const taxSymbol = getCurrencySymbol(input.taxAmountCurrency);

  const displayNet =
    result && input.driver !== 'net' ? result.formattedNetPrice : input.netPrice;
  const displayGross =
    result && input.driver !== 'gross' ? result.formattedGrossPrice : input.grossPrice;
  const displayTax = result ? result.formattedTaxAmount : '';

  const set = (patch: Partial<GstInput>) => {
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
    const converted = convertField(input.netPrice, input.netCurrency, next);
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      netCurrency: next,
      netPrice: converted.value,
      driver: 'net' as GstDriver,
    });
  };

  const handleGrossCurrency = (next: SupportedCurrency) => {
    if (next === input.grossCurrency) return;
    const converted = convertField(input.grossPrice, input.grossCurrency, next);
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      grossCurrency: next,
      grossPrice: converted.value,
      driver: 'gross' as GstDriver,
    });
  };

  const handleTaxCurrency = (next: SupportedCurrency) => {
    if (next === input.taxAmountCurrency) return;
    const driverCurrency =
      input.driver === 'gross' ? input.grossCurrency : input.netCurrency;
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
        <label className={labelClass} htmlFor="gst-gross">
          <span>Gross price</span>
          <InfoTooltip
            label="Gross price"
            text="GST-inclusive price. Editing this recalculates net and tax amount."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.grossPrice} muted={input.driver === 'net' && Boolean(result)}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {grossSymbol}
            </span>
            <input
              id="gst-gross"
              className={inputClass}
              inputMode="decimal"
              value={displayGross}
              aria-invalid={Boolean(errors.grossPrice)}
              onChange={(e) =>
                set({ grossPrice: e.target.value, driver: 'gross' as GstDriver })
              }
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="gst-gross-currency"
              value={input.grossCurrency}
              onChange={handleGrossCurrency}
              aria-label="Gross price currency"
            />
          </div>
        </div>
        {errors.grossPrice ? (
          <p className="mt-1 text-xs text-rose-600">{errors.grossPrice}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="gst-rate">
          <span>GST</span>
          <InfoTooltip
            label="GST"
            text="GST rate as a percent. Not FX-converted. Enter the rate yourself — no jurisdiction default is applied. Zero is allowed."
          />
        </label>
        <FieldShell error={errors.gstPercent}>
          <input
            id="gst-rate"
            className={`${inputClass} pr-8`}
            inputMode="decimal"
            value={input.gstPercent}
            aria-invalid={Boolean(errors.gstPercent)}
            onChange={(e) => set({ gstPercent: e.target.value })}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </FieldShell>
        {errors.gstPercent ? (
          <p className="mt-1 text-xs text-rose-600">{errors.gstPercent}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="gst-net">
          <span>Net price</span>
          <InfoTooltip
            label="Net price"
            text="GST-exclusive price. Editing this recalculates gross and tax amount."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.netPrice} muted={input.driver === 'gross' && Boolean(result)}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {netSymbol}
            </span>
            <input
              id="gst-net"
              className={inputClass}
              inputMode="decimal"
              value={displayNet}
              aria-invalid={Boolean(errors.netPrice)}
              onChange={(e) =>
                set({ netPrice: e.target.value, driver: 'net' as GstDriver })
              }
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="gst-net-currency"
              value={input.netCurrency}
              onChange={handleNetCurrency}
              aria-label="Net price currency"
            />
          </div>
        </div>
        {errors.netPrice ? (
          <p className="mt-1 text-xs text-rose-600">{errors.netPrice}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="gst-amount">
          <span>Tax amount</span>
          <InfoTooltip
            label="Tax amount"
            text="Difference between gross and net. Display currency only re-expresses the amount."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {taxSymbol}
            </span>
            <input
              id="gst-amount"
              className={`${inputClass} font-semibold`}
              readOnly
              value={displayTax}
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="gst-amount-currency"
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
