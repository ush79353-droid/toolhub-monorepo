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
import { PAYDAY_LOAN_DAY_BASIS } from './calculation';
import type {
  PaydayLoanFieldErrors,
  PaydayLoanInput,
  PaydayLoanResult,
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

interface PaydayLoanFormProps {
  input: PaydayLoanInput;
  errors: PaydayLoanFieldErrors;
  result: PaydayLoanResult | null;
  onChange: (input: PaydayLoanInput) => void;
  onReset: () => void;
}

export function PaydayLoanForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: PaydayLoanFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const loanSymbol = getCurrencySymbol(input.loanAmountCurrency);
  const chargeSymbol = getCurrencySymbol(input.financeChargeCurrency);
  const aprAmountSymbol = getCurrencySymbol(input.aprAmountCurrency);
  const monthlyFeeSymbol = getCurrencySymbol(input.monthlyFeeCurrency);
  const totalDebtSymbol = getCurrencySymbol(input.totalDebtCurrency);

  const set = (patch: Partial<PaydayLoanInput>) => {
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
    if (next === input.loanAmountCurrency) return;
    const nextAmount = convertFieldAmount(
      input.loanAmount,
      input.loanAmountCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    // Currency-only change: keep editSource (not an economic F/APR edit).
    setConversionError(null);
    onChange({
      ...input,
      loanAmountCurrency: next,
      loanAmount: nextAmount,
    });
  };

  const handleFinanceChargeCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.financeChargeCurrency) return;
    const nextAmount = convertFieldAmount(
      input.financeCharge,
      input.financeChargeCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      financeChargeCurrency: next,
      financeCharge: nextAmount,
    });
  };

  const handleDisplayCurrencyChange = (
    key:
      | 'aprAmountCurrency'
      | 'monthlyFeeCurrency'
      | 'totalDebtCurrency',
    next: SupportedCurrency
  ) => {
    if (next === input[key]) return;
    if (!canConvertPair(input.loanAmountCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, [key]: next });
  };

  const aprDisplay =
    result && input.editSource === 'financeCharge'
      ? result.formattedAprPercent
      : input.aprPercent;

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Loan details</legend>

        <div>
          <label className={labelClass} htmlFor="payday-loan-amount">
            <span>Loan Amount</span>
            <InfoTooltip
              label="Loan Amount"
              text="Original payday loan principal. Changing currency converts this amount using stored rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.loanAmount}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {loanSymbol}
              </span>
              <input
                id="payday-loan-amount"
                className={inputClass}
                inputMode="decimal"
                value={input.loanAmount}
                aria-invalid={Boolean(errors.loanAmount)}
                onChange={(e) => set({ loanAmount: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="payday-loan-currency"
                value={input.loanAmountCurrency}
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
          <label className={labelClass} htmlFor="payday-finance-charge">
            <span>Finance charge</span>
            <InfoTooltip
              label="Finance charge"
              text="Fee charged for the loan term. Editing this recalculates APR; editing APR recalculates this charge."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.financeCharge}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {chargeSymbol}
              </span>
              <input
                id="payday-finance-charge"
                className={inputClass}
                inputMode="decimal"
                value={
                  result?.syncedFinanceCharge && input.editSource === 'apr'
                    ? result.syncedFinanceCharge
                    : input.financeCharge
                }
                aria-invalid={Boolean(errors.financeCharge)}
                onChange={(e) =>
                  set({ financeCharge: e.target.value, editSource: 'financeCharge' })
                }
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="payday-finance-currency"
                value={input.financeChargeCurrency}
                onChange={handleFinanceChargeCurrencyChange}
                aria-label="Finance charge currency"
              />
            </div>
          </div>
          {errors.financeCharge ? (
            <p className="mt-1 text-xs text-rose-600">{errors.financeCharge}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="payday-term">
            <span>Loan term</span>
            <InfoTooltip
              label="Loan term"
              text={`Loan duration in days. APR annualizes with a ${PAYDAY_LOAN_DAY_BASIS}-day year.`}
            />
          </label>
          <FieldShell error={errors.loanTermDays}>
            <input
              id="payday-term"
              className={`${inputClass} pr-12`}
              inputMode="decimal"
              value={input.loanTermDays}
              aria-invalid={Boolean(errors.loanTermDays)}
              onChange={(e) => set({ loanTermDays: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              days
            </span>
          </FieldShell>
          {errors.loanTermDays ? (
            <p className="mt-1 text-xs text-rose-600">{errors.loanTermDays}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="payday-apr">
            <span>APR</span>
            <InfoTooltip
              label="APR"
              text={`Simple annualized rate: (finance charge ÷ loan) × (${PAYDAY_LOAN_DAY_BASIS} ÷ days) × 100. Not APY.`}
            />
          </label>
          <FieldShell error={errors.aprPercent}>
            <input
              id="payday-apr"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={aprDisplay}
              aria-invalid={Boolean(errors.aprPercent)}
              onChange={(e) => set({ aprPercent: e.target.value, editSource: 'apr' })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.aprPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.aprPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="payday-apr-amount">
            <span>APR amount</span>
            <InfoTooltip
              label="APR amount"
              text="Annualized monetary finance charge: finance charge × (365 ÷ days). Display-only; not added again into total debt."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {aprAmountSymbol}
              </span>
              <input
                id="payday-apr-amount"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedAprAmount : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="payday-apr-amount-currency"
                value={input.aprAmountCurrency}
                onChange={(c) => handleDisplayCurrencyChange('aprAmountCurrency', c)}
                aria-label="APR amount currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="payday-monthly-fee-pct">
            <span>Monthly fee percent</span>
            <InfoTooltip
              label="Monthly fee percent"
              text="Percent of loan amount for one monthly-fee assessment. Not currency-converted. Default 0."
            />
          </label>
          <FieldShell error={errors.monthlyFeePercent}>
            <input
              id="payday-monthly-fee-pct"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.monthlyFeePercent}
              aria-invalid={Boolean(errors.monthlyFeePercent)}
              onChange={(e) => set({ monthlyFeePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.monthlyFeePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.monthlyFeePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="payday-monthly-fee">
            <span>Monthly fee</span>
            <InfoTooltip
              label="Monthly fee"
              text="Loan amount × (monthly fee percent ÷ 100). One assessment added to total debt (not prorated by term)."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {monthlyFeeSymbol}
              </span>
              <input
                id="payday-monthly-fee"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedMonthlyFee : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="payday-monthly-fee-currency"
                value={input.monthlyFeeCurrency}
                onChange={(c) => handleDisplayCurrencyChange('monthlyFeeCurrency', c)}
                aria-label="Monthly fee currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="payday-total-debt">
            <span>Total debt</span>
            <InfoTooltip
              label="Total debt"
              text="Loan amount + finance charge + one monthly-fee assessment. APR amount is not added again."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {totalDebtSymbol}
              </span>
              <input
                id="payday-total-debt"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotalDebt : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="payday-total-debt-currency"
                value={input.totalDebtCurrency}
                onChange={(c) => handleDisplayCurrencyChange('totalDebtCurrency', c)}
                aria-label="Total debt currency"
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
          Reset
        </Button>
      </div>
    </form>
  );
}
