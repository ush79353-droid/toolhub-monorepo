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
import {
  COMPOUNDING_FREQUENCY_OPTIONS,
  type BiweeklyMortgageFieldErrors,
  type BiweeklyMortgageInput,
  type BiweeklyMortgageResult,
  type CompoundingFrequency,
  type TermUnit,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-semibold tabular-nums text-accent">{value}</span>
    </div>
  );
}

interface BiweeklyMortgageFormProps {
  input: BiweeklyMortgageInput;
  errors: BiweeklyMortgageFieldErrors;
  result: BiweeklyMortgageResult | null;
  onChange: (input: BiweeklyMortgageInput) => void;
  onReset: () => void;
}

export function BiweeklyMortgageForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: BiweeklyMortgageFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const loanSymbol = getCurrencySymbol(input.loanCurrency);
  const feeSymbol = getCurrencySymbol(input.upfrontFeeCurrency);
  const extraSymbol = getCurrencySymbol(input.extraPaymentCurrency);
  const resultSymbol = getCurrencySymbol(result?.currency ?? input.loanCurrency);

  const set = (patch: Partial<BiweeklyMortgageInput>) => {
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
  ): string | null => {
    const amount = parseMoneyInput(raw);
    if (!Number.isFinite(amount)) return raw;
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

  const handleLoanCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.loanCurrency) return;

    const nextAmount = convertFieldAmount(input.loanAmount, input.loanCurrency, next);
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    // Ensure fee/extra can still normalize into the new loan currency.
    if (
      (input.upfrontFeeCurrency !== next &&
        !canConvertPair(input.upfrontFeeCurrency, next)) ||
      (input.extraPaymentCurrency !== next &&
        !canConvertPair(input.extraPaymentCurrency, next))
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({
      ...input,
      loanCurrency: next,
      loanAmount: nextAmount,
    });
  };

  const handleFeeCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.upfrontFeeCurrency) return;
    const nextAmount = convertFieldAmount(
      input.upfrontFee,
      input.upfrontFeeCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      upfrontFeeCurrency: next,
      upfrontFee: nextAmount,
    });
  };

  const handleExtraCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.extraPaymentCurrency) return;
    const nextAmount = convertFieldAmount(
      input.extraPayment,
      input.extraPaymentCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      extraPaymentCurrency: next,
      extraPayment: nextAmount,
    });
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
          Mortgage details
        </legend>

        <div>
          <label className={labelClass} htmlFor="biweekly-loan-amount">
            <span>Loan amount</span>
            <InfoTooltip
              label="Loan amount"
              text="Mortgage principal. Changing currency converts this amount with stored rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.loanAmount}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {loanSymbol}
              </span>
              <input
                id="biweekly-loan-amount"
                className={inputClass}
                inputMode="decimal"
                value={input.loanAmount}
                aria-invalid={Boolean(errors.loanAmount)}
                onChange={(e) => set({ loanAmount: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="biweekly-loan-currency"
                value={input.loanCurrency}
                onChange={handleLoanCurrencyChange}
                aria-label="Loan amount currency"
              />
            </div>
          </div>
          {errors.loanAmount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.loanAmount}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="biweekly-mortgage-term">
            <span>Mortgage term</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.mortgageTerm}>
              <input
                id="biweekly-mortgage-term"
                className={inputClass}
                inputMode="decimal"
                value={input.mortgageTerm}
                aria-invalid={Boolean(errors.mortgageTerm)}
                onChange={(e) => set({ mortgageTerm: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <select
                id="biweekly-term-unit"
                className={selectClass}
                value={input.termUnit}
                onChange={(e) => set({ termUnit: e.target.value as TermUnit })}
                aria-label="Mortgage term unit"
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
          <label className={labelClass} htmlFor="biweekly-interest-rate">
            <span>Interest rate</span>
          </label>
          <FieldShell error={errors.interestRatePercent}>
            <input
              id="biweekly-interest-rate"
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
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Compound frequency, fees and extra payment
        </legend>

        <div>
          <label className={labelClass} htmlFor="biweekly-compounding">
            <span>Compounding frequency</span>
            <InfoTooltip
              label="Compounding frequency"
              text="Monthly (UK & US) uses APR÷12. Semi-annually (Canada) compounds twice a year. Biweekly rates are converted from that convention — not ordinary twice-monthly payments."
            />
          </label>
          <select
            id="biweekly-compounding"
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
          <label className={labelClass} htmlFor="biweekly-points">
            <span>Mortgage points</span>
            <InfoTooltip
              label="Mortgage points"
              text="Prepaid closing cost as a percent of the loan amount. Added once to total payment; does not change the amortizing principal."
            />
          </label>
          <FieldShell error={errors.mortgagePointsPercent}>
            <input
              id="biweekly-points"
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

        <div>
          <label className={labelClass} htmlFor="biweekly-upfront-fee">
            <span>Upfront fee</span>
            <InfoTooltip
              label="Upfront fee"
              text="Closing fee paid once. Independent currency; normalized into the loan currency before totals. Not added to principal."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.upfrontFee}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {feeSymbol}
              </span>
              <input
                id="biweekly-upfront-fee"
                className={inputClass}
                inputMode="decimal"
                value={input.upfrontFee}
                aria-invalid={Boolean(errors.upfrontFee)}
                onChange={(e) => set({ upfrontFee: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="biweekly-upfront-fee-currency"
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

        <div>
          <label className={labelClass} htmlFor="biweekly-extra-payment">
            <span>Extra payment</span>
            <InfoTooltip
              label="Extra payment"
              text="Additional principal with each scheduled payment (monthly or biweekly). Independent currency; normalized into the loan currency."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.extraPayment}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {extraSymbol}
              </span>
              <input
                id="biweekly-extra-payment"
                className={inputClass}
                inputMode="decimal"
                value={input.extraPayment}
                aria-invalid={Boolean(errors.extraPayment)}
                onChange={(e) => set({ extraPayment: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="biweekly-extra-payment-currency"
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
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Payment summary
        </legend>

        {result ? (
          <>
            <div className="space-y-2">
              <h3 className="text-[13px] font-semibold text-accent">Without acceleration</h3>
              <SummaryRow
                label="Monthly payment"
                value={`${resultSymbol}${result.withoutAcceleration.formattedPeriodicPayment}`}
              />
              <SummaryRow label="Term" value={result.withoutAcceleration.formattedTerm} />
              <SummaryRow
                label="Total interest"
                value={`${resultSymbol}${result.withoutAcceleration.formattedTotalInterest}`}
              />
              <SummaryRow
                label="Total payment"
                value={`${resultSymbol}${result.withoutAcceleration.formattedTotalPayment}`}
              />
            </div>

            <div className="space-y-2 border-t border-border pt-3">
              <h3 className="text-[13px] font-semibold text-accent">Bi-weekly payments</h3>
              <SummaryRow
                label="Bi-weekly payment"
                value={`${resultSymbol}${result.biweekly.formattedPeriodicPayment}`}
              />
              <SummaryRow label="Term" value={result.biweekly.formattedTerm} />
              <SummaryRow
                label="Total interest"
                value={`${resultSymbol}${result.biweekly.formattedTotalInterest}`}
              />
              <SummaryRow
                label="Total payment"
                value={`${resultSymbol}${result.biweekly.formattedTotalPayment}`}
              />
            </div>

            <div className="space-y-2 border-t border-border pt-3">
              <h3 className="text-[13px] font-semibold text-accent">Difference</h3>
              <SummaryRow
                label="Payment"
                value={`${resultSymbol}${result.formattedPaymentDifference}`}
              />
              <SummaryRow label="Term" value={result.formattedTermSaved} />
              <SummaryRow
                label="Total interest"
                value={`${resultSymbol}${result.formattedInterestSaved}`}
              />
              <SummaryRow
                label="Total payment"
                value={`${resultSymbol}${result.formattedTotalPaymentSaved}`}
              />
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter valid mortgage details to compare monthly and accelerated biweekly schedules.
          </p>
        )}
      </fieldset>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {ratesStatus.warning && !conversionError ? (
        <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
      ) : null}
      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

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
          Reset
        </Button>
      </div>
    </form>
  );
}
