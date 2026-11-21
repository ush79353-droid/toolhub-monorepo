'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { CarRefinanceResults } from './CarRefinanceResults';
import type {
  CarRefinanceFieldErrors,
  CarRefinanceInput,
  CarRefinanceResult,
  EstimationMode,
  FeeTreatment,
  TermUnit,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

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

interface CarRefinanceFormProps {
  input: CarRefinanceInput;
  errors: CarRefinanceFieldErrors;
  result: CarRefinanceResult | null;
  onChange: (input: CarRefinanceInput) => void;
  onBalanceCurrencyChange: (next: SupportedCurrency) => void;
  onCurrentPaymentCurrencyChange: (next: SupportedCurrency) => void;
  onCashCurrencyChange: (next: SupportedCurrency) => void;
  onFeesCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function CarRefinanceForm({
  input,
  errors,
  result,
  onChange,
  onBalanceCurrencyChange,
  onCurrentPaymentCurrencyChange,
  onCashCurrencyChange,
  onFeesCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: CarRefinanceFormProps) {
  const balanceSymbol = getCurrencySymbol(input.balanceCurrency);
  const paymentSymbol = getCurrencySymbol(input.currentMonthlyPaymentCurrency);
  const cashSymbol = getCurrencySymbol(input.cashInOutCurrency);
  const feesSymbol = getCurrencySymbol(input.feesAndCostsCurrency);

  const set = (patch: Partial<CarRefinanceInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <h3 className="text-[13px] font-semibold text-accent">Current loan</h3>

        <fieldset className="space-y-2">
          <legend className={labelClass}>Estimation by…</legend>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            {(
              [
                { value: 'remaining_term', label: 'remaining loan term' },
                { value: 'monthly_payment', label: 'monthly payment' },
              ] as const
            ).map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="car-refi-estimation"
                  className="h-4 w-4 accent-[var(--primary)]"
                  checked={input.estimationMode === option.value}
                  onChange={() =>
                    set({ estimationMode: option.value as EstimationMode })
                  }
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="car-refi-balance">
            <span>Balance left on loan</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.balance}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {balanceSymbol}
              </span>
              <input
                id="car-refi-balance"
                className={inputClass}
                inputMode="decimal"
                value={input.balance}
                aria-invalid={Boolean(errors.balance)}
                onChange={(e) => set({ balance: e.target.value })}
              />
            </FieldShell>
            <CurrencySelect
              id="car-refi-balance-currency"
              value={input.balanceCurrency}
              onChange={onBalanceCurrencyChange}
              aria-label="Balance currency"
            />
          </div>
          {errors.balance ? (
            <p className="mt-1 text-xs text-rose-600">{errors.balance}</p>
          ) : null}
        </div>

        {input.estimationMode === 'remaining_term' ? (
          <div>
            <label className={labelClass} htmlFor="car-refi-remaining-term">
              <span>Remaining loan term</span>
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.remainingTerm}>
                <input
                  id="car-refi-remaining-term"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.remainingTerm}
                  aria-invalid={Boolean(errors.remainingTerm)}
                  onChange={(e) => set({ remainingTerm: e.target.value })}
                />
              </FieldShell>
              <select
                className={`${selectClass} w-[5.5rem] shrink-0`}
                aria-label="Remaining term unit"
                value={input.remainingTermUnit}
                onChange={(e) =>
                  set({ remainingTermUnit: e.target.value as TermUnit })
                }
              >
                <option value="yrs">yrs</option>
                <option value="mos">mos</option>
              </select>
            </div>
            {errors.remainingTerm ? (
              <p className="mt-1 text-xs text-rose-600">{errors.remainingTerm}</p>
            ) : null}
          </div>
        ) : (
          <div>
            <label className={labelClass} htmlFor="car-refi-current-payment">
              <span>Monthly payment</span>
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.currentMonthlyPayment}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {paymentSymbol}
                </span>
                <input
                  id="car-refi-current-payment"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.currentMonthlyPayment}
                  aria-invalid={Boolean(errors.currentMonthlyPayment)}
                  onChange={(e) =>
                    set({ currentMonthlyPayment: e.target.value })
                  }
                />
              </FieldShell>
              <CurrencySelect
                id="car-refi-current-payment-currency"
                value={input.currentMonthlyPaymentCurrency}
                onChange={onCurrentPaymentCurrencyChange}
                aria-label="Current monthly payment currency"
              />
            </div>
            {errors.currentMonthlyPayment ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.currentMonthlyPayment}
              </p>
            ) : null}
          </div>
        )}

        <div>
          <label className={labelClass} htmlFor="car-refi-current-rate">
            <span>Interest rate</span>
            <InfoTooltip
              label="Current interest rate"
              text="Nominal annual percentage rate on the remaining loan. Used as monthly rate = APR / 1200. Never FX-converted."
            />
          </label>
          <FieldShell error={errors.currentInterestRatePercent}>
            <input
              id="car-refi-current-rate"
              className={inputClass}
              inputMode="decimal"
              value={input.currentInterestRatePercent}
              aria-invalid={Boolean(errors.currentInterestRatePercent)}
              onChange={(e) =>
                set({ currentInterestRatePercent: e.target.value })
              }
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.currentInterestRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.currentInterestRatePercent}
            </p>
          ) : null}
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[var(--primary)]"
            checked={input.setDueDateAndCompounding}
            onChange={(e) =>
              set({ setDueDateAndCompounding: e.target.checked })
            }
          />
          <span>Set due date and compounding</span>
        </label>

        {input.setDueDateAndCompounding ? (
          <div className="space-y-3 rounded-lg border border-border bg-white/70 p-3">
            <div>
              <label className={labelClass} htmlFor="car-refi-due-date">
                <span>Next due date</span>
              </label>
              <FieldShell error={errors.dueDate}>
                <input
                  id="car-refi-due-date"
                  type="date"
                  className={inputClass}
                  value={input.dueDate}
                  aria-invalid={Boolean(errors.dueDate)}
                  onChange={(e) => set({ dueDate: e.target.value })}
                />
              </FieldShell>
              {errors.dueDate ? (
                <p className="mt-1 text-xs text-rose-600">{errors.dueDate}</p>
              ) : null}
              <p className="mt-1 text-[11px] text-muted-foreground">
                Optional reference date. Payment math uses fixed monthly
                amortization of the remaining balance.
              </p>
            </div>
            <div>
              <label className={labelClass} htmlFor="car-refi-compounding">
                <span>Compounding</span>
              </label>
              <select
                id="car-refi-compounding"
                className={selectClass}
                value={input.compounding}
                onChange={() => set({ compounding: 'monthly' })}
              >
                <option value="monthly">Monthly</option>
              </select>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Verified mode uses monthly amortization (APR / 1200).
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className={sectionClass}>
        <h3 className="text-[13px] font-semibold text-accent">Loan refinancing</h3>

        <div>
          <label className={labelClass} htmlFor="car-refi-new-term">
            <span>New loan term</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.newLoanTerm}>
              <input
                id="car-refi-new-term"
                className={inputClass}
                inputMode="decimal"
                value={input.newLoanTerm}
                aria-invalid={Boolean(errors.newLoanTerm)}
                onChange={(e) => set({ newLoanTerm: e.target.value })}
              />
            </FieldShell>
            <select
              className={`${selectClass} w-[5.5rem] shrink-0`}
              aria-label="New loan term unit"
              value={input.newLoanTermUnit}
              onChange={(e) =>
                set({ newLoanTermUnit: e.target.value as TermUnit })
              }
            >
              <option value="yrs">yrs</option>
              <option value="mos">mos</option>
            </select>
          </div>
          {errors.newLoanTerm ? (
            <p className="mt-1 text-xs text-rose-600">{errors.newLoanTerm}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="car-refi-new-rate">
            <span>New interest rate</span>
          </label>
          <FieldShell error={errors.newInterestRatePercent}>
            <input
              id="car-refi-new-rate"
              className={inputClass}
              inputMode="decimal"
              value={input.newInterestRatePercent}
              aria-invalid={Boolean(errors.newInterestRatePercent)}
              onChange={(e) =>
                set({ newInterestRatePercent: e.target.value })
              }
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.newInterestRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.newInterestRatePercent}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="car-refi-cash">
            <span>Cash in / out</span>
            <InfoTooltip
              label="Cash in / out"
              text="Positive amounts are cash out (added to new principal). Negative amounts are cash in (reduce new principal)."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.cashInOut}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {cashSymbol}
              </span>
              <input
                id="car-refi-cash"
                className={inputClass}
                inputMode="decimal"
                value={input.cashInOut}
                aria-invalid={Boolean(errors.cashInOut)}
                onChange={(e) => set({ cashInOut: e.target.value })}
              />
            </FieldShell>
            <CurrencySelect
              id="car-refi-cash-currency"
              value={input.cashInOutCurrency}
              onChange={onCashCurrencyChange}
              aria-label="Cash in/out currency"
            />
          </div>
          {errors.cashInOut ? (
            <p className="mt-1 text-xs text-rose-600">{errors.cashInOut}</p>
          ) : null}
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[var(--primary)]"
            checked={input.setFeesAndCosts}
            onChange={(e) => set({ setFeesAndCosts: e.target.checked })}
          />
          <span>Set fees and costs</span>
        </label>

        {input.setFeesAndCosts ? (
          <div className="space-y-3 rounded-lg border border-border bg-white/70 p-3">
            <div>
              <label className={labelClass} htmlFor="car-refi-fees">
                <span>Fees and costs</span>
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.feesAndCosts}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {feesSymbol}
                  </span>
                  <input
                    id="car-refi-fees"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.feesAndCosts}
                    aria-invalid={Boolean(errors.feesAndCosts)}
                    onChange={(e) => set({ feesAndCosts: e.target.value })}
                  />
                </FieldShell>
                <CurrencySelect
                  id="car-refi-fees-currency"
                  value={input.feesAndCostsCurrency}
                  onChange={onFeesCurrencyChange}
                  aria-label="Fees currency"
                />
              </div>
              {errors.feesAndCosts ? (
                <p className="mt-1 text-xs text-rose-600">{errors.feesAndCosts}</p>
              ) : null}
            </div>
            <fieldset className="space-y-2">
              <legend className={labelClass}>Fee treatment</legend>
              {(
                [
                  { value: 'upfront', label: 'Pay upfront (not financed)' },
                  { value: 'financed', label: 'Finance into new loan' },
                ] as const
              ).map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2 text-sm text-accent"
                >
                  <input
                    type="radio"
                    name="car-refi-fee-treatment"
                    className="h-4 w-4 accent-[var(--primary)]"
                    checked={input.feeTreatment === option.value}
                    onChange={() =>
                      set({ feeTreatment: option.value as FeeTreatment })
                    }
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </fieldset>
          </div>
        ) : null}
      </div>

      {result ? <CarRefinanceResults result={result} /> : null}

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {ratesWarning ? (
        <p className="text-xs text-amber-700" role="status">
          {ratesWarning}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
