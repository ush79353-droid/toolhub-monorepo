'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COMPOUNDING_OPTIONS,
  type CompoundingFrequency,
  type EstimationMode,
  type InterestTreatment,
  type MoratoriumFieldErrors,
  type MoratoriumInput,
  type RepaymentPlan,
  type TermUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

interface MoratoriumFormProps {
  input: MoratoriumInput;
  errors: MoratoriumFieldErrors;
  onChange: (next: MoratoriumInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function MoratoriumForm({
  input,
  errors,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: MoratoriumFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<MoratoriumInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational EMI moratorium model for monthly amortizing loans. Interest
        usually still accrues — deferment is not forgiveness. Currency is
        denomination only (not FX).
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="mora-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination"
        />
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (₹300,000 · 8% · 10y · 12-mo capitalized)
      </button>

      <details open className="rounded-lg border border-border bg-white">
        <summary className="cursor-pointer px-3 py-2.5 text-sm font-semibold text-accent">
          Loan Inputs
        </summary>
        <div className="space-y-4 border-t border-border px-3 py-3">
          <fieldset>
            <legend className={labelClass}>Estimation Based On</legend>
            <div className="flex flex-col gap-2 text-sm text-accent">
              {(
                [
                  ['loan-term', 'Loan term (tenure)'],
                  ['monthly-payment', 'Monthly payment (EMI)'],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="estimation-mode"
                    checked={input.estimationMode === value}
                    onChange={() =>
                      set({ estimationMode: value as EstimationMode })
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="mora-amount" className={labelClass}>
              Loan Amount
            </label>
            <FieldShell error={errors.loanAmount}>
              <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
              <input
                id="mora-amount"
                className={inputClass}
                inputMode="decimal"
                value={input.loanAmount}
                onChange={(e) => set({ loanAmount: e.target.value })}
                placeholder="300000"
              />
            </FieldShell>
            {errors.loanAmount ? (
              <p className="mt-1 text-xs text-rose-600">{errors.loanAmount}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="mora-balance-date" className={labelClass}>
              Date of Balance
            </label>
            <FieldShell error={errors.dateOfBalance}>
              <input
                id="mora-balance-date"
                type="date"
                className={inputClass}
                value={input.dateOfBalance}
                onChange={(e) => set({ dateOfBalance: e.target.value })}
              />
            </FieldShell>
            {errors.dateOfBalance ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.dateOfBalance}
              </p>
            ) : null}
          </div>

          {input.estimationMode === 'loan-term' ? (
            <div>
              <label htmlFor="mora-term" className={labelClass}>
                Loan Term
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.loanTermValue}>
                  <input
                    id="mora-term"
                    className={inputClass}
                    inputMode="numeric"
                    value={input.loanTermValue}
                    onChange={(e) => set({ loanTermValue: e.target.value })}
                    placeholder="10"
                  />
                </FieldShell>
                <select
                  className={`${selectClass} w-32 shrink-0`}
                  value={input.loanTermUnit}
                  onChange={(e) =>
                    set({ loanTermUnit: e.target.value as TermUnit })
                  }
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
              {errors.loanTermValue ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.loanTermValue}
                </p>
              ) : null}
            </div>
          ) : (
            <div>
              <label htmlFor="mora-emi" className={labelClass}>
                Expected Monthly Installment (EMI)
              </label>
              <FieldShell error={errors.monthlyPayment}>
                <span className="pl-3 text-sm text-muted-foreground">
                  {symbol}
                </span>
                <input
                  id="mora-emi"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.monthlyPayment}
                  onChange={(e) => set({ monthlyPayment: e.target.value })}
                  placeholder="3640"
                />
              </FieldShell>
              {errors.monthlyPayment ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.monthlyPayment}
                </p>
              ) : null}
            </div>
          )}

          <div>
            <label htmlFor="mora-rate" className={labelClass}>
              Interest Rate
              <InfoTooltip
                label="Rate"
                text="Nominal annual rate. Monthly accrual by default; optional compounding converts to an equivalent monthly rate."
              />
            </label>
            <FieldShell error={errors.annualInterestRate}>
              <input
                id="mora-rate"
                className={inputClass}
                inputMode="decimal"
                value={input.annualInterestRate}
                onChange={(e) => set({ annualInterestRate: e.target.value })}
                placeholder="8"
              />
              <span className="pr-3 text-xs text-muted-foreground">%/yr</span>
            </FieldShell>
            {errors.annualInterestRate ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.annualInterestRate}
              </p>
            ) : null}
          </div>

          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border"
              checked={input.enableCustomCompounding}
              onChange={(e) =>
                set({ enableCustomCompounding: e.target.checked })
              }
            />
            Change compounding frequency
          </label>
          {input.enableCustomCompounding ? (
            <select
              className={selectClass}
              value={input.compoundingFrequency}
              onChange={(e) =>
                set({
                  compoundingFrequency: e.target.value as CompoundingFrequency,
                })
              }
            >
              {COMPOUNDING_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : null}
        </div>
      </details>

      <details open className="rounded-lg border border-border bg-white">
        <summary className="cursor-pointer px-3 py-2.5 text-sm font-semibold text-accent">
          Loan Restructuring
        </summary>
        <div className="space-y-4 border-t border-border px-3 py-3">
          <fieldset>
            <legend className={labelClass}>Interest Treatment</legend>
            <div className="flex flex-col gap-2 text-sm text-accent">
              {(
                [
                  ['capitalized', 'Capitalized (added to principal)'],
                  ['paid-monthly', 'Paid monthly during moratorium'],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="interest-treatment"
                    checked={input.interestTreatment === value}
                    onChange={() =>
                      set({ interestTreatment: value as InterestTreatment })
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className={labelClass}>Repayment Plan</legend>
            <div className="flex flex-col gap-2 text-sm text-accent">
              {(
                [
                  [
                    'increased-payment-same-term',
                    'Increased payment – same term',
                  ],
                  [
                    'increased-payment-extended-term',
                    'Increased payment – extended term',
                  ],
                  ['same-payment-extended-term', 'Same payment – extended term'],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="repayment-plan"
                    checked={input.repaymentPlan === value}
                    onChange={() =>
                      set({ repaymentPlan: value as RepaymentPlan })
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="mora-from" className={labelClass}>
              Moratorium From
            </label>
            <FieldShell error={errors.moratoriumStartDate}>
              <input
                id="mora-from"
                type="date"
                className={inputClass}
                value={input.moratoriumStartDate}
                onChange={(e) => set({ moratoriumStartDate: e.target.value })}
              />
            </FieldShell>
            {errors.moratoriumStartDate ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.moratoriumStartDate}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="mora-period" className={labelClass}>
              Moratorium Period
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.moratoriumDurationValue}>
                <input
                  id="mora-period"
                  className={inputClass}
                  inputMode="numeric"
                  value={input.moratoriumDurationValue}
                  onChange={(e) =>
                    set({ moratoriumDurationValue: e.target.value })
                  }
                  placeholder="12"
                />
              </FieldShell>
              <select
                className={`${selectClass} w-32 shrink-0`}
                value={input.moratoriumDurationUnit}
                onChange={(e) =>
                  set({
                    moratoriumDurationUnit: e.target.value as TermUnit,
                  })
                }
              >
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
            {errors.moratoriumDurationValue ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.moratoriumDurationValue}
              </p>
            ) : null}
          </div>
        </div>
      </details>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
