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
  IMMEDIATE_MODE_OPTIONS,
  PAYMENT_FREQUENCY_OPTIONS,
  TERM_UNIT_OPTIONS,
  TIMING_OPTIONS,
  type AnnuityType,
  type Frequency,
  type ImmediateAnnuityFieldErrors,
  type ImmediateAnnuityInput,
  type ImmediateAnnuityResult,
  type ImmediateMode,
  type TermUnit,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface ImmediateAnnuityFormProps {
  input: ImmediateAnnuityInput;
  errors: ImmediateAnnuityFieldErrors;
  result: ImmediateAnnuityResult | null;
  onChange: (input: ImmediateAnnuityInput) => void;
  onReset: () => void;
}

export function ImmediateAnnuityForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: ImmediateAnnuityFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const investSymbol = getCurrencySymbol(input.amountToInvestCurrency);
  const withdrawSymbol = getCurrencySymbol(input.withdrawalAmountCurrency);
  const remainSymbol = getCurrencySymbol(input.remainingBalanceCurrency);
  const resultSymbol = getCurrencySymbol(result?.currency ?? input.amountToInvestCurrency);

  const needsInvest = input.mode !== 'invest';
  const needsWithdrawal = input.mode !== 'withdraw';
  const needsLength = input.mode !== 'duration';
  const needsRate = input.mode !== 'rate';

  const set = (patch: Partial<ImmediateAnnuityInput>) => {
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

  const handleInvestCurrency = (next: SupportedCurrency) => {
    if (next === input.amountToInvestCurrency) return;
    // Invest mode solves for the amount; currency is denomination only.
    if (input.mode === 'invest') {
      if (
        next !== input.withdrawalAmountCurrency &&
        !canConvertPair(input.withdrawalAmountCurrency, next)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      if (
        input.displayMore &&
        next !== input.remainingBalanceCurrency &&
        !canConvertPair(input.remainingBalanceCurrency, next)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, amountToInvestCurrency: next });
      return;
    }
    const nextAmount = convertFieldAmount(
      input.amountToInvest,
      input.amountToInvestCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      amountToInvestCurrency: next,
      amountToInvest: nextAmount,
    });
  };

  const handleWithdrawCurrency = (next: SupportedCurrency) => {
    if (next === input.withdrawalAmountCurrency) return;
    const nextAmount = convertFieldAmount(
      input.withdrawalAmount,
      input.withdrawalAmountCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      withdrawalAmountCurrency: next,
      withdrawalAmount: nextAmount,
    });
  };

  const handleRemainCurrency = (next: SupportedCurrency) => {
    if (next === input.remainingBalanceCurrency) return;
    const nextAmount = convertFieldAmount(
      input.remainingBalance,
      input.remainingBalanceCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      remainingBalanceCurrency: next,
      remainingBalance: nextAmount,
    });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-2 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          I&apos;d like to know...
        </legend>
        <div className="space-y-2">
          {IMMEDIATE_MODE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="immediate-mode"
                className="h-4 w-4 border-border"
                checked={input.mode === opt.value}
                onChange={() => set({ mode: opt.value as ImmediateMode })}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Annuity specifications
        </legend>

        <div>
          <label className={labelClass} htmlFor="ia-payment-frequency">
            <span>Payment frequency</span>
          </label>
          <select
            id="ia-payment-frequency"
            className={selectClass}
            value={input.paymentFrequency}
            onChange={(e) => {
              const paymentFrequency = e.target.value as Frequency;
              const patch: Partial<ImmediateAnnuityInput> = { paymentFrequency };
              if (!input.changeCompounding) {
                patch.compoundingFrequency = paymentFrequency;
              }
              set(patch);
            }}
          >
            {PAYMENT_FREQUENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="ia-timing">
            <span>Timing of withdrawals</span>
          </label>
          <select
            id="ia-timing"
            className={selectClass}
            value={input.annuityType}
            onChange={(e) => set({ annuityType: e.target.value as AnnuityType })}
          >
            {TIMING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="ia-start-date">
            <span>Annuity starts from...</span>
          </label>
          <FieldShell error={errors.startDate}>
            <input
              id="ia-start-date"
              type="date"
              className={inputClass}
              value={input.startDate}
              aria-invalid={Boolean(errors.startDate)}
              onChange={(e) => set({ startDate: e.target.value })}
            />
          </FieldShell>
          {errors.startDate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.startDate}</p>
          ) : null}
        </div>

        <label className="flex items-start gap-2 text-sm text-accent">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-border"
            checked={input.changeCompounding}
            onChange={(e) => {
              const changeCompounding = e.target.checked;
              set({
                changeCompounding,
                compoundingFrequency: changeCompounding
                  ? input.compoundingFrequency
                  : input.paymentFrequency,
              });
            }}
          />
          <span>Change compounding frequency</span>
        </label>

        {input.changeCompounding ? (
          <div>
            <label className={labelClass} htmlFor="ia-compounding">
              <span>Compounding frequency</span>
              <InfoTooltip
                label="Compounding frequency"
                text="How often interest is compounded. Converted to an equivalent rate per payment period."
              />
            </label>
            <select
              id="ia-compounding"
              className={selectClass}
              value={input.compoundingFrequency}
              onChange={(e) =>
                set({ compoundingFrequency: e.target.value as Frequency })
              }
            >
              {PAYMENT_FREQUENCY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Annuity inputs
        </legend>

        {needsInvest ? (
          <div>
            <label className={labelClass} htmlFor="ia-invest">
              <span>Amount to invest</span>
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.amountToInvest}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {investSymbol}
                </span>
                <input
                  id="ia-invest"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.amountToInvest}
                  aria-invalid={Boolean(errors.amountToInvest)}
                  onChange={(e) => set({ amountToInvest: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="ia-invest-currency"
                  value={input.amountToInvestCurrency}
                  onChange={handleInvestCurrency}
                  aria-label="Amount to invest currency"
                />
              </div>
            </div>
            {errors.amountToInvest ? (
              <p className="mt-1 text-xs text-rose-600">{errors.amountToInvest}</p>
            ) : null}
          </div>
        ) : (
          <div>
            <label className={labelClass} htmlFor="ia-invest-currency-only">
              <span>Result currency</span>
            </label>
            <div className="w-[110px] sm:w-[120px]">
              <CurrencySelect
                id="ia-invest-currency-only"
                value={input.amountToInvestCurrency}
                onChange={handleInvestCurrency}
                aria-label="Result currency"
              />
            </div>
          </div>
        )}

        {needsWithdrawal ? (
          <div>
            <label className={labelClass} htmlFor="ia-withdrawal">
              <span>Withdrawal amount</span>
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.withdrawalAmount}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {withdrawSymbol}
                </span>
                <input
                  id="ia-withdrawal"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.withdrawalAmount}
                  aria-invalid={Boolean(errors.withdrawalAmount)}
                  onChange={(e) => set({ withdrawalAmount: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="ia-withdrawal-currency"
                  value={input.withdrawalAmountCurrency}
                  onChange={handleWithdrawCurrency}
                  aria-label="Withdrawal amount currency"
                />
              </div>
            </div>
            {errors.withdrawalAmount ? (
              <p className="mt-1 text-xs text-rose-600">{errors.withdrawalAmount}</p>
            ) : null}
          </div>
        ) : null}

        {needsLength ? (
          <div>
            <label className={labelClass} htmlFor="ia-length">
              <span>Length of withdrawal</span>
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.length}>
                <input
                  id="ia-length"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.length}
                  aria-invalid={Boolean(errors.length)}
                  onChange={(e) => set({ length: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <select
                  id="ia-length-unit"
                  className={selectClass}
                  value={input.lengthUnit}
                  onChange={(e) =>
                    set({ lengthUnit: e.target.value as TermUnit })
                  }
                  aria-label="Length unit"
                >
                  {TERM_UNIT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {errors.length ? (
              <p className="mt-1 text-xs text-rose-600">{errors.length}</p>
            ) : null}
          </div>
        ) : null}

        {needsRate ? (
          <div>
            <label className={labelClass} htmlFor="ia-rate">
              <span>Expected rate of return</span>
            </label>
            <FieldShell error={errors.rateOfReturnPercent}>
              <input
                id="ia-rate"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.rateOfReturnPercent}
                aria-invalid={Boolean(errors.rateOfReturnPercent)}
                onChange={(e) => set({ rateOfReturnPercent: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.rateOfReturnPercent ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.rateOfReturnPercent}
              </p>
            ) : null}
          </div>
        ) : null}

        <label className="flex items-start gap-2 text-sm text-accent">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-border"
            checked={input.displayMore}
            onChange={(e) => set({ displayMore: e.target.checked })}
          />
          <span>Display more annuity parameters</span>
        </label>

        {input.displayMore ? (
          <div className="space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="ia-remaining">
                <span>Remaining balance</span>
                <InfoTooltip
                  label="Remaining balance"
                  text="Target future value after the withdrawal plan. Zero means the annuity is fully depleted."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.remainingBalance}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {remainSymbol}
                  </span>
                  <input
                    id="ia-remaining"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.remainingBalance}
                    aria-invalid={Boolean(errors.remainingBalance)}
                    onChange={(e) => set({ remainingBalance: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="ia-remaining-currency"
                    value={input.remainingBalanceCurrency}
                    onChange={handleRemainCurrency}
                    aria-label="Remaining balance currency"
                  />
                </div>
              </div>
              {errors.remainingBalance ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.remainingBalance}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="ia-growth">
                <span>Annual growth rate of withdrawals</span>
              </label>
              <FieldShell error={errors.annualGrowthPercent}>
                <input
                  id="ia-growth"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.annualGrowthPercent}
                  aria-invalid={Boolean(errors.annualGrowthPercent)}
                  onChange={(e) => set({ annualGrowthPercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.annualGrowthPercent ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.annualGrowthPercent}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </fieldset>

      {conversionError || errors.form || ratesStatus.warning ? (
        <div className="space-y-1">
          {conversionError ? (
            <p className="text-xs text-rose-600">{conversionError}</p>
          ) : null}
          {errors.form ? (
            <p className="text-xs text-rose-600">{errors.form}</p>
          ) : null}
          {ratesStatus.warning && !conversionError && !errors.form ? (
            <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
          ) : null}
        </div>
      ) : null}

      {result ? (
        <div className="space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4">
          <h3 className="text-sm font-semibold text-accent">Results</h3>
          <p className="text-sm leading-relaxed text-accent">{result.summaryText}</p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[280px] border-collapse text-sm">
              <tbody className="tabular-nums text-accent">
                {(
                  [
                    ['Opening balance', result.formattedOpeningBalance],
                    ['Final balance', result.formattedFinalBalance],
                    [
                      `${result.paymentFrequencyLabel} withdrawal`,
                      result.formattedPeriodicWithdrawal,
                    ],
                    ['Total withdrawals', result.formattedTotalWithdrawals],
                    ['Total return', result.formattedTotalReturn],
                    ['Number of withdrawals', String(result.numberOfWithdrawals)],
                    ['Last withdrawal on', result.lastWithdrawalDateLabel],
                  ] as const
                ).map(([label, value]) => (
                  <tr key={label} className="border-b border-border/70">
                    <td className="py-2 pr-3 text-xs text-muted-foreground">{label}</td>
                    <td className="py-2 text-right font-medium">
                      {label === 'Number of withdrawals' ||
                      label === 'Last withdrawal on'
                        ? value
                        : `${resultSymbol}${value}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-accent">Yearly payment schedule</h4>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[320px] border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
                    <th className="px-2 py-2 font-medium">Year</th>
                    <th className="px-2 py-2 font-medium">
                      Opening balance ({resultSymbol})
                    </th>
                    <th className="px-2 py-2 font-medium">Yearly withdraw</th>
                  </tr>
                </thead>
                <tbody className="tabular-nums text-accent">
                  {result.yearlySchedule.map((row) => (
                    <tr key={row.year} className="border-b border-border/60">
                      <td className="px-2 py-1.5">{row.year}</td>
                      <td className="px-2 py-1.5">{row.formattedOpeningBalance}</td>
                      <td className="px-2 py-1.5">{row.formattedYearlyWithdraw}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-9 px-3 text-xs font-medium"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
