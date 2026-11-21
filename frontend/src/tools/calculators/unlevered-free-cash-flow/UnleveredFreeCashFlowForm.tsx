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
  UnleveredFreeCashFlowFieldErrors,
  UnleveredFreeCashFlowInput,
  UnleveredFreeCashFlowResult,
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

interface UnleveredFreeCashFlowFormProps {
  input: UnleveredFreeCashFlowInput;
  errors: UnleveredFreeCashFlowFieldErrors;
  result: UnleveredFreeCashFlowResult | null;
  onChange: (input: UnleveredFreeCashFlowInput) => void;
}

export function UnleveredFreeCashFlowForm({
  input,
  errors,
  result,
  onChange,
}: UnleveredFreeCashFlowFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(
    null
  );

  const ebitSymbol = getCurrencySymbol(input.ebitCurrency);
  const daSymbol = getCurrencySymbol(input.daCurrency);
  const capexSymbol = getCurrencySymbol(input.capexCurrency);
  const wcSymbol = getCurrencySymbol(input.changeInWcCurrency);
  const ufcfSymbol = getCurrencySymbol(input.ufcfCurrency);

  const set = (patch: Partial<UnleveredFreeCashFlowInput>) => {
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

  const convertFieldAmount = (
    raw: string,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): { ok: true; text: string } | { ok: false } => {
    if (from === to) return { ok: true, text: raw };
    const amount = parseMoneyInput(raw);
    if (!Number.isFinite(amount)) return { ok: true, text: raw };
    if (!canConvertPair(from, to)) return { ok: false };
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    if (!converted.ok) return { ok: false };
    return { ok: true, text: moneyAmountToInputString(converted.amount) };
  };

  const handleEbitCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.ebitCurrency) return;
    const converted = convertFieldAmount(input.ebit, input.ebitCurrency, next);
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      ebitCurrency: next,
      ebit: converted.text,
    });
  };

  const handleDaCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.daCurrency) return;
    const converted = convertFieldAmount(input.da, input.daCurrency, next);
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      daCurrency: next,
      da: converted.text,
    });
  };

  const handleCapexCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.capexCurrency) return;
    const converted = convertFieldAmount(input.capex, input.capexCurrency, next);
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      capexCurrency: next,
      capex: converted.text,
    });
  };

  const handleWcCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.changeInWcCurrency) return;
    const converted = convertFieldAmount(
      input.changeInWc,
      input.changeInWcCurrency,
      next
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      changeInWcCurrency: next,
      changeInWc: converted.text,
    });
  };

  const handleResultCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.ufcfCurrency) return;
    const pairs: Array<[string, SupportedCurrency]> = [
      [input.ebit, input.ebitCurrency],
      [input.da, input.daCurrency],
      [input.capex, input.capexCurrency],
      [input.changeInWc, input.changeInWcCurrency],
    ];
    for (const [raw, from] of pairs) {
      const amount = parseMoneyInput(raw);
      if (!Number.isFinite(amount)) continue;
      if (!canConvertPair(from, next)) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
    }
    setConversionError(null);
    onChange({ ...input, ufcfCurrency: next });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="ufcf-ebit">
          <span>EBIT</span>
          <InfoTooltip
            label="EBIT"
            text="Earnings before interest and taxes for the period. Financing costs are not deducted. Changing currency converts this amount with stored FX rates."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.ebit}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {ebitSymbol}
            </span>
            <input
              id="ufcf-ebit"
              className={inputClass}
              inputMode="decimal"
              value={input.ebit}
              aria-invalid={Boolean(errors.ebit)}
              onChange={(e) => set({ ebit: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="ufcf-ebit-currency"
              value={input.ebitCurrency}
              onChange={handleEbitCurrencyChange}
              aria-label="EBIT currency"
            />
          </div>
        </div>
        {errors.ebit ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ebit}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ufcf-etr">
          <span>Effective tax rate (ETR)</span>
          <InfoTooltip
            label="Effective tax rate"
            text="Effective tax rate as a percent from 0 to 100. Used only in NOPAT = EBIT × (1 − ETR/100). Never currency-converted."
          />
        </label>
        <FieldShell error={errors.etr}>
          <input
            id="ufcf-etr"
            className={inputClass}
            inputMode="decimal"
            value={input.etr}
            aria-invalid={Boolean(errors.etr)}
            onChange={(e) => set({ etr: e.target.value })}
          />
          <span
            className="shrink-0 pr-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            %
          </span>
        </FieldShell>
        {errors.etr ? (
          <p className="mt-1 text-xs text-rose-600">{errors.etr}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ufcf-da">
          <span>Depreciation and amortization (DA)</span>
          <InfoTooltip
            label="Depreciation and amortization"
            text="Non-cash depreciation and amortization added back when forming UFCF. Changing currency converts this amount with stored FX rates."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.da}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {daSymbol}
            </span>
            <input
              id="ufcf-da"
              className={inputClass}
              inputMode="decimal"
              value={input.da}
              aria-invalid={Boolean(errors.da)}
              onChange={(e) => set({ da: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="ufcf-da-currency"
              value={input.daCurrency}
              onChange={handleDaCurrencyChange}
              aria-label="Depreciation and amortization currency"
            />
          </div>
        </div>
        {errors.da ? (
          <p className="mt-1 text-xs text-rose-600">{errors.da}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ufcf-capex">
          <span>Capital expenditures (CapEx)</span>
          <InfoTooltip
            label="Capital expenditures"
            text="CapEx spending for the period. Enter a positive amount for cash outflow. Changing currency converts this amount with stored FX rates."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.capex}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {capexSymbol}
            </span>
            <input
              id="ufcf-capex"
              className={inputClass}
              inputMode="decimal"
              value={input.capex}
              aria-invalid={Boolean(errors.capex)}
              onChange={(e) => set({ capex: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="ufcf-capex-currency"
              value={input.capexCurrency}
              onChange={handleCapexCurrencyChange}
              aria-label="Capital expenditures currency"
            />
          </div>
        </div>
        {errors.capex ? (
          <p className="mt-1 text-xs text-rose-600">{errors.capex}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ufcf-wc">
          <span>Change in working capital (ΔWC)</span>
          <InfoTooltip
            label="Change in working capital"
            text="Increase in operating working capital is treated as a cash outflow. Negative values (WC release) increase UFCF. Changing currency converts this amount with stored FX rates."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.changeInWc}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {wcSymbol}
            </span>
            <input
              id="ufcf-wc"
              className={inputClass}
              inputMode="decimal"
              value={input.changeInWc}
              aria-invalid={Boolean(errors.changeInWc)}
              onChange={(e) => set({ changeInWc: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="ufcf-wc-currency"
              value={input.changeInWcCurrency}
              onChange={handleWcCurrencyChange}
              aria-label="Change in working capital currency"
            />
          </div>
        </div>
        {errors.changeInWc ? (
          <p className="mt-1 text-xs text-rose-600">{errors.changeInWc}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ufcf-result">
          <span>Unlevered free cash flow (UFCF)</span>
          <InfoTooltip
            label="Unlevered free cash flow"
            text="UFCF = NOPAT + DA − CapEx − ΔWC, where NOPAT = EBIT × (1 − ETR/100). No interest or debt repayments. Changing this currency re-expresses the result after normalizing inputs."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {ufcfSymbol}
            </span>
            <input
              id="ufcf-result"
              className={`${inputClass} text-accent`}
              readOnly
              tabIndex={-1}
              value={result?.formattedUfcf ?? ''}
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="ufcf-result-currency"
              value={input.ufcfCurrency}
              onChange={handleResultCurrencyChange}
              aria-label="Unlevered free cash flow currency"
            />
          </div>
        </div>
        {result?.isNegative ? (
          <p className="mt-1 text-xs text-amber-700">
            Negative unlevered free cash flow: CapEx and working-capital
            investment exceed NOPAT plus D&amp;A for the period.
          </p>
        ) : null}
        <p className="mt-1 text-xs text-muted-foreground">
          Before financing: interest and mandatory debt repayments are not
          deducted.
        </p>
      </div>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {ratesStatus.warning && !conversionError ? (
        <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
      ) : null}
    </form>
  );
}
