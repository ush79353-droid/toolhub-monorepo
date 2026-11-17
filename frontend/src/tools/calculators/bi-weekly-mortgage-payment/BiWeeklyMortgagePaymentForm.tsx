'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
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
import { BiWeeklyMortgagePaymentResults } from './BiWeeklyMortgagePaymentResults';
import {
  COMPARISON_WITH_OPTIONS,
  COMPOUNDING_FREQUENCY_OPTIONS,
  type BiWeeklyMortgagePaymentFieldErrors,
  type BiWeeklyMortgagePaymentInput,
  type BiWeeklyMortgagePaymentResult,
  type ComparisonWith,
  type CompoundingFrequency,
  type TermUnit,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface BiWeeklyMortgagePaymentFormProps {
  input: BiWeeklyMortgagePaymentInput;
  errors: BiWeeklyMortgagePaymentFieldErrors;
  result: BiWeeklyMortgagePaymentResult | null;
  onChange: (input: BiWeeklyMortgagePaymentInput) => void;
  onReset: () => void;
}

export function BiWeeklyMortgagePaymentForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: BiWeeklyMortgagePaymentFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const mortgageSymbol = getCurrencySymbol(input.mortgageCurrency);
  const extraSymbol = getCurrencySymbol(input.extraPaymentCurrency);
  const feeSymbol = getCurrencySymbol(input.upfrontFeeCurrency);

  const set = (patch: Partial<BiWeeklyMortgagePaymentInput>) => {
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
    amountRaw: string,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): string | null => {
    const amount = parseMoneyInput(amountRaw);
    if (!Number.isFinite(amount)) return amountRaw;
    if (!canConvertPair(from, to)) return null;
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    if (!converted.ok) return null;
    return moneyAmountToInputString(converted.amount);
  };

  const handleMortgageCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.mortgageCurrency) return;
    const converted = convertFieldAmount(
      input.mortgageAmount,
      input.mortgageCurrency,
      next
    );
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, mortgageCurrency: next, mortgageAmount: converted });
  };

  const handleExtraCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.extraPaymentCurrency) return;
    const converted = convertFieldAmount(
      input.extraPayment,
      input.extraPaymentCurrency,
      next
    );
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, extraPaymentCurrency: next, extraPayment: converted });
  };

  const handleFeeCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.upfrontFeeCurrency) return;
    const converted = convertFieldAmount(
      input.upfrontFee,
      input.upfrontFeeCurrency,
      next
    );
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, upfrontFeeCurrency: next, upfrontFee: converted });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Bi-weekly mortgage inputs
        </legend>

        <div>
          <label className={labelClass} htmlFor="bwmp-amount">
            <span>Mortgage amount</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.mortgageAmount}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {mortgageSymbol}
              </span>
              <input
                id="bwmp-amount"
                className={inputClass}
                inputMode="decimal"
                value={input.mortgageAmount}
                aria-invalid={Boolean(errors.mortgageAmount)}
                onChange={(e) => set({ mortgageAmount: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="bwmp-mortgage-currency"
                value={input.mortgageCurrency}
                onChange={handleMortgageCurrencyChange}
                aria-label="Mortgage amount currency"
              />
            </div>
          </div>
          {errors.mortgageAmount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.mortgageAmount}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bwmp-term">
            <span>Mortgage term</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.mortgageTerm}>
              <input
                id="bwmp-term"
                className={inputClass}
                inputMode="decimal"
                value={input.mortgageTerm}
                aria-invalid={Boolean(errors.mortgageTerm)}
                onChange={(e) => set({ mortgageTerm: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <select
                id="bwmp-term-unit"
                className={selectClass}
                value={input.termUnit}
                aria-label="Term unit"
                onChange={(e) => set({ termUnit: e.target.value as TermUnit })}
              >
                <option value="yrs">yrs</option>
                <option value="mos">mos</option>
              </select>
            </div>
          </div>
          {errors.mortgageTerm ? (
            <p className="mt-1 text-xs text-rose-600">{errors.mortgageTerm}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bwmp-rate">
            <span>Interest rate</span>
          </label>
          <FieldShell error={errors.interestRatePercent}>
            <input
              id="bwmp-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.interestRatePercent}
              aria-invalid={Boolean(errors.interestRatePercent)}
              onChange={(e) => set({ interestRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.interestRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.interestRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bwmp-extra">
            <span>Extra payment</span>
            <InfoTooltip
              label="Extra payment"
              text="Additional principal with each scheduled payment on both the monthly and accelerated bi-weekly schedules. Independent currency; normalized into the mortgage currency before amortization."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.extraPayment}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {extraSymbol}
              </span>
              <input
                id="bwmp-extra"
                className={inputClass}
                inputMode="decimal"
                value={input.extraPayment}
                aria-invalid={Boolean(errors.extraPayment)}
                onChange={(e) => set({ extraPayment: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="bwmp-extra-currency"
                value={input.extraPaymentCurrency}
                onChange={handleExtraCurrencyChange}
                aria-label="Extra payment currency"
              />
            </div>
          </div>
          {errors.extraPayment ? (
            <p className="mt-1 text-xs text-rose-600">{errors.extraPayment}</p>
          ) : null}
        </div>

        <div className="rounded-lg border border-border/80 bg-muted/20 p-3">
          <label className="flex cursor-pointer items-center gap-2.5 text-xs font-medium text-accent">
            <input
              type="checkbox"
              checked={input.changePointsFeesCompounding}
              onChange={(e) => {
                const checked = e.target.checked;
                if (!checked) {
                  set({
                    changePointsFeesCompounding: false,
                    compounding: 'monthly_uk_us',
                    mortgagePointsPercent: '0',
                    upfrontFee: '0',
                  });
                } else {
                  set({ changePointsFeesCompounding: true });
                }
              }}
              className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
            />
            <span>Change points, fee or compounding</span>
          </label>

          {input.changePointsFeesCompounding ? (
            <div className="mt-3 grid grid-cols-1 gap-3 border-t border-border/60 pt-3 min-[420px]:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="bwmp-compounding">
                  Compounding interest frequency
                </label>
                <select
                  id="bwmp-compounding"
                  className={selectClass}
                  value={input.compounding}
                  onChange={(e) =>
                    set({ compounding: e.target.value as CompoundingFrequency })
                  }
                >
                  {COMPOUNDING_FREQUENCY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="bwmp-points">
                  Mortgage points
                </label>
                <FieldShell error={errors.mortgagePointsPercent}>
                  <input
                    id="bwmp-points"
                    className={`${inputClass} pr-8`}
                    inputMode="decimal"
                    value={input.mortgagePointsPercent}
                    aria-invalid={Boolean(errors.mortgagePointsPercent)}
                    onChange={(e) => set({ mortgagePointsPercent: e.target.value })}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </FieldShell>
                {errors.mortgagePointsPercent ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.mortgagePointsPercent}</p>
                ) : null}
              </div>
              <div className="min-[420px]:col-span-2">
                <label className={labelClass} htmlFor="bwmp-fee">
                  Upfront fee
                </label>
                <div className="flex gap-2">
                  <FieldShell error={errors.upfrontFee}>
                    <span
                      className="shrink-0 pl-3 text-sm text-muted-foreground"
                      aria-hidden="true"
                    >
                      {feeSymbol}
                    </span>
                    <input
                      id="bwmp-fee"
                      className={inputClass}
                      inputMode="decimal"
                      value={input.upfrontFee}
                      aria-invalid={Boolean(errors.upfrontFee)}
                      onChange={(e) => set({ upfrontFee: e.target.value })}
                    />
                  </FieldShell>
                  <div className="w-[110px] shrink-0 sm:w-[120px]">
                    <CurrencySelect
                      id="bwmp-fee-currency"
                      value={input.upfrontFeeCurrency}
                      onChange={handleFeeCurrencyChange}
                      aria-label="Upfront fee currency"
                    />
                  </div>
                </div>
                {errors.upfrontFee ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.upfrontFee}</p>
                ) : null}
              </div>
            </div>
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
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Payment summary</legend>
        <div>
          <label className={labelClass} htmlFor="bwmp-comparison">
            <span>Comparison with</span>
          </label>
          <select
            id="bwmp-comparison"
            className={selectClass}
            value={input.comparisonWith}
            onChange={(e) =>
              set({ comparisonWith: e.target.value as ComparisonWith })
            }
          >
            {COMPARISON_WITH_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <BiWeeklyMortgagePaymentResults result={result} />
      </fieldset>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button
          type="button"
          variant="outline"
          className="h-11 font-medium"
          onClick={() => {
            setConversionError(null);
            onReset();
          }}
        >
          Reload calculator
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 font-medium"
          onClick={() => {
            setConversionError(null);
            onReset();
          }}
        >
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
