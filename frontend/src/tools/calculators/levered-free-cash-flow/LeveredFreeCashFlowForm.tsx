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
  LeveredFreeCashFlowFieldErrors,
  LeveredFreeCashFlowInput,
  LeveredFreeCashFlowResult,
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

interface LeveredFreeCashFlowFormProps {
  input: LeveredFreeCashFlowInput;
  errors: LeveredFreeCashFlowFieldErrors;
  result: LeveredFreeCashFlowResult | null;
  onChange: (input: LeveredFreeCashFlowInput) => void;
}

export function LeveredFreeCashFlowForm({
  input,
  errors,
  result,
  onChange,
}: LeveredFreeCashFlowFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(
    null
  );

  const ebitdaSymbol = getCurrencySymbol(input.ebitdaCurrency);
  const capexSymbol = getCurrencySymbol(input.capexCurrency);
  const wcSymbol = getCurrencySymbol(input.changeInWcCurrency);
  const debtSymbol = getCurrencySymbol(input.debtRepaymentsCurrency);
  const fcfSymbol = getCurrencySymbol(input.leveredFcfCurrency);

  const set = (patch: Partial<LeveredFreeCashFlowInput>) => {
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

  const handleEbitdaCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.ebitdaCurrency) return;
    const converted = convertFieldAmount(
      input.ebitda,
      input.ebitdaCurrency,
      next
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      ebitdaCurrency: next,
      ebitda: converted.text,
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

  const handleDebtCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.debtRepaymentsCurrency) return;
    const converted = convertFieldAmount(
      input.debtRepayments,
      input.debtRepaymentsCurrency,
      next
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      debtRepaymentsCurrency: next,
      debtRepayments: converted.text,
    });
  };

  const handleResultCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.leveredFcfCurrency) return;
    const pairs: Array<[string, SupportedCurrency]> = [
      [input.ebitda, input.ebitdaCurrency],
      [input.capex, input.capexCurrency],
      [input.changeInWc, input.changeInWcCurrency],
      [input.debtRepayments, input.debtRepaymentsCurrency],
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
    onChange({ ...input, leveredFcfCurrency: next });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="lfcf-ebitda">
          <span>EBITDA</span>
          <InfoTooltip
            label="EBITDA"
            text="Earnings before interest, taxes, depreciation, and amortization for the period. Changing currency converts this amount with stored FX rates."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.ebitda}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {ebitdaSymbol}
            </span>
            <input
              id="lfcf-ebitda"
              className={inputClass}
              inputMode="decimal"
              value={input.ebitda}
              aria-invalid={Boolean(errors.ebitda)}
              onChange={(e) => set({ ebitda: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="lfcf-ebitda-currency"
              value={input.ebitdaCurrency}
              onChange={handleEbitdaCurrencyChange}
              aria-label="EBITDA currency"
            />
          </div>
        </div>
        {errors.ebitda ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ebitda}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="lfcf-capex">
          <span>Capital expenditures</span>
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
              id="lfcf-capex"
              className={inputClass}
              inputMode="decimal"
              value={input.capex}
              aria-invalid={Boolean(errors.capex)}
              onChange={(e) => set({ capex: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="lfcf-capex-currency"
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
        <label className={labelClass} htmlFor="lfcf-wc">
          <span>Net change in working capital</span>
          <InfoTooltip
            label="Net change in working capital"
            text="Increase in net working capital is treated as a cash outflow. Negative values (WC release) are allowed. Changing currency converts this amount with stored FX rates."
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
              id="lfcf-wc"
              className={inputClass}
              inputMode="decimal"
              value={input.changeInWc}
              aria-invalid={Boolean(errors.changeInWc)}
              onChange={(e) => set({ changeInWc: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="lfcf-wc-currency"
              value={input.changeInWcCurrency}
              onChange={handleWcCurrencyChange}
              aria-label="Net change in working capital currency"
            />
          </div>
        </div>
        {errors.changeInWc ? (
          <p className="mt-1 text-xs text-rose-600">{errors.changeInWc}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="lfcf-debt">
          <span>Mandatory debt repayments</span>
          <InfoTooltip
            label="Mandatory debt repayments"
            text="Required debt principal repayments for the period. Enter a positive amount for cash outflow. Changing currency converts this amount with stored FX rates."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.debtRepayments}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {debtSymbol}
            </span>
            <input
              id="lfcf-debt"
              className={inputClass}
              inputMode="decimal"
              value={input.debtRepayments}
              aria-invalid={Boolean(errors.debtRepayments)}
              onChange={(e) => set({ debtRepayments: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="lfcf-debt-currency"
              value={input.debtRepaymentsCurrency}
              onChange={handleDebtCurrencyChange}
              aria-label="Mandatory debt repayments currency"
            />
          </div>
        </div>
        {errors.debtRepayments ? (
          <p className="mt-1 text-xs text-rose-600">{errors.debtRepayments}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="lfcf-result">
          <span>Levered free cash flow</span>
          <InfoTooltip
            label="Levered free cash flow"
            text="Simplified estimate: EBITDA − CapEx − ΔWC − debt repayments. Not a full FCFE calculation. Changing this currency re-expresses the result after normalizing inputs."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {fcfSymbol}
            </span>
            <input
              id="lfcf-result"
              className={`${inputClass} text-accent`}
              readOnly
              tabIndex={-1}
              value={result?.formattedLeveredFcf ?? ''}
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="lfcf-result-currency"
              value={input.leveredFcfCurrency}
              onChange={handleResultCurrencyChange}
              aria-label="Levered free cash flow currency"
            />
          </div>
        </div>
        {result?.isNegative ? (
          <p className="mt-1 text-xs text-amber-700">
            Negative levered free cash flow: CapEx, working-capital change, and
            debt repayments exceed EBITDA under this simplified model.
          </p>
        ) : null}
        <p className="mt-1 text-xs text-muted-foreground">
 Simplified cash-flow estimate; not a complete FCFE calculation.
          EBITDA excludes cash interest and taxes.
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
