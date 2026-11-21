'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { MortgageRefinanceResults } from './MortgageRefinanceResults';
import {
  COMPOUNDING_OPTIONS,
  type CompoundingFrequency,
  type MortgageRefinanceFieldErrors,
  type MortgageRefinanceInput,
  type MortgageRefinanceResult,
  type TermUnit,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

interface MortgageRefinanceFormProps {
  input: MortgageRefinanceInput;
  errors: MortgageRefinanceFieldErrors;
  result: MortgageRefinanceResult | null;
  onChange: (input: MortgageRefinanceInput) => void;
  onOriginalCurrencyChange: (next: SupportedCurrency) => void;
  onCostsCurrencyChange: (next: SupportedCurrency) => void;
  onCashCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function MortgageRefinanceForm({
  input,
  errors,
  result,
  onChange,
  onOriginalCurrencyChange,
  onCostsCurrencyChange,
  onCashCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: MortgageRefinanceFormProps) {
  const originalSymbol = getCurrencySymbol(input.originalAmountCurrency);
  const costsSymbol = getCurrencySymbol(input.closingCostsCurrency);
  const cashSymbol = getCurrencySymbol(input.cashInOutCurrency);

  const set = (patch: Partial<MortgageRefinanceInput>) => {
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
        <h3 className="text-[13px] font-semibold text-accent">Current mortgage</h3>

        <div>
          <label className={labelClass} htmlFor="mrefi-amount">
            Original mortgage amount
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.originalAmount}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {originalSymbol}
              </span>
              <input
                id="mrefi-amount"
                className={inputClass}
                inputMode="decimal"
                value={input.originalAmount}
                aria-invalid={Boolean(errors.originalAmount)}
                onChange={(event) => set({ originalAmount: event.target.value })}
              />
            </FieldShell>
            <CurrencySelect
              id="mrefi-amount-currency"
              value={input.originalAmountCurrency}
              onChange={onOriginalCurrencyChange}
              aria-label="Original mortgage currency"
            />
          </div>
          {errors.originalAmount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.originalAmount}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mrefi-due">
            Due date
          </label>
          <FieldShell error={errors.currentDueDate}>
            <input
              id="mrefi-due"
              type="date"
              className={inputClass}
              value={input.currentDueDate}
              aria-invalid={Boolean(errors.currentDueDate)}
              onChange={(event) => set({ currentDueDate: event.target.value })}
            />
          </FieldShell>
          {errors.currentDueDate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.currentDueDate}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mrefi-term">
            Mortgage term
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.currentTerm}>
              <input
                id="mrefi-term"
                className={inputClass}
                inputMode="decimal"
                value={input.currentTerm}
                aria-invalid={Boolean(errors.currentTerm)}
                onChange={(event) => set({ currentTerm: event.target.value })}
              />
            </FieldShell>
            <select
              id="mrefi-term-unit"
              className={`${selectClass} w-[5.25rem]`}
              value={input.currentTermUnit}
              aria-label="Current mortgage term unit"
              onChange={(event) => set({ currentTermUnit: event.target.value as TermUnit })}
            >
              <option value="yrs">yrs</option>
              <option value="mos">mos</option>
            </select>
          </div>
          {errors.currentTerm ? (
            <p className="mt-1 text-xs text-rose-600">{errors.currentTerm}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mrefi-rate">
            Interest rate
            <InfoTooltip
              label="Current interest rate"
              text="Nominal annual rate. It is converted to an effective monthly rate using the compounding frequency. Monthly compounding uses rate ÷ 12."
            />
          </label>
          <FieldShell error={errors.currentInterestRatePercent}>
            <input
              id="mrefi-rate"
              className={inputClass}
              inputMode="decimal"
              value={input.currentInterestRatePercent}
              aria-invalid={Boolean(errors.currentInterestRatePercent)}
              onChange={(event) => set({ currentInterestRatePercent: event.target.value })}
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground" aria-hidden="true">
              %
            </span>
          </FieldShell>
          {errors.currentInterestRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.currentInterestRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mrefi-compound">
            Compounding frequency
            <InfoTooltip
              label="Current compounding frequency"
              text="How often the nominal annual rate compounds. The calculator turns that into the effective monthly rate used for amortization."
            />
          </label>
          <select
            id="mrefi-compound"
            className={`${selectClass} w-full`}
            value={input.currentCompounding}
            onChange={(event) =>
              set({ currentCompounding: event.target.value as CompoundingFrequency })
            }
          >
            {COMPOUNDING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-[13px] font-semibold text-accent">Mortgage refinancing</h3>

        <div>
          <label className={labelClass} htmlFor="mrefi-new-due">
            New mortgage&apos;s due date
          </label>
          <FieldShell error={errors.newDueDate}>
            <input
              id="mrefi-new-due"
              type="date"
              className={inputClass}
              value={input.newDueDate}
              aria-invalid={Boolean(errors.newDueDate)}
              onChange={(event) => set({ newDueDate: event.target.value })}
            />
          </FieldShell>
          {errors.newDueDate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.newDueDate}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mrefi-new-term">
            New loan&apos;s term
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.newTerm}>
              <input
                id="mrefi-new-term"
                className={inputClass}
                inputMode="decimal"
                value={input.newTerm}
                aria-invalid={Boolean(errors.newTerm)}
                onChange={(event) => set({ newTerm: event.target.value })}
              />
            </FieldShell>
            <select
              id="mrefi-new-term-unit"
              className={`${selectClass} w-[5.25rem]`}
              value={input.newTermUnit}
              aria-label="New loan term unit"
              onChange={(event) => set({ newTermUnit: event.target.value as TermUnit })}
            >
              <option value="yrs">yrs</option>
              <option value="mos">mos</option>
            </select>
          </div>
          {errors.newTerm ? <p className="mt-1 text-xs text-rose-600">{errors.newTerm}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mrefi-new-rate">
            Interest rate
            <InfoTooltip
              label="New interest rate"
              text="Nominal annual rate on the refinance. Compounding is converted to an effective monthly rate before the payment is calculated."
            />
          </label>
          <FieldShell error={errors.newInterestRatePercent}>
            <input
              id="mrefi-new-rate"
              className={inputClass}
              inputMode="decimal"
              value={input.newInterestRatePercent}
              aria-invalid={Boolean(errors.newInterestRatePercent)}
              onChange={(event) => set({ newInterestRatePercent: event.target.value })}
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground" aria-hidden="true">
              %
            </span>
          </FieldShell>
          {errors.newInterestRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.newInterestRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mrefi-new-compound">
            Compounding frequency
            <InfoTooltip
              label="New compounding frequency"
              text="Compounding on the new loan. Monthly (US & UK) divides the nominal rate by 12. Other frequencies use an effective monthly rate."
            />
          </label>
          <select
            id="mrefi-new-compound"
            className={`${selectClass} w-full`}
            value={input.newCompounding}
            onChange={(event) =>
              set({ newCompounding: event.target.value as CompoundingFrequency })
            }
          >
            {COMPOUNDING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="mrefi-points">
            Mortgage points
            <InfoTooltip
              label="Mortgage points"
              text="Upfront fee as a percent of the new principal after cash in/out. One point is 1%. Points are not rolled into the loan balance."
            />
          </label>
          <FieldShell error={errors.mortgagePoints}>
            <input
              id="mrefi-points"
              className={inputClass}
              inputMode="decimal"
              value={input.mortgagePoints}
              aria-invalid={Boolean(errors.mortgagePoints)}
              onChange={(event) => set({ mortgagePoints: event.target.value })}
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground" aria-hidden="true">
              %
            </span>
          </FieldShell>
          {errors.mortgagePoints ? (
            <p className="mt-1 text-xs text-rose-600">{errors.mortgagePoints}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mrefi-costs">
            Costs of refinancing
            <InfoTooltip
              label="Costs of refinancing"
              text="Closing costs paid upfront with mortgage points. They are not financed into the new principal. They are included in refinancing cost, break-even, and new total payments."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.closingCosts}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {costsSymbol}
              </span>
              <input
                id="mrefi-costs"
                className={inputClass}
                inputMode="decimal"
                value={input.closingCosts}
                aria-invalid={Boolean(errors.closingCosts)}
                onChange={(event) => set({ closingCosts: event.target.value })}
              />
            </FieldShell>
            <CurrencySelect
              id="mrefi-costs-currency"
              value={input.closingCostsCurrency}
              onChange={onCostsCurrencyChange}
              aria-label="Refinancing costs currency"
            />
          </div>
          {errors.closingCosts ? (
            <p className="mt-1 text-xs text-rose-600">{errors.closingCosts}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mrefi-cash">
            Cash in / out
            <InfoTooltip
              label="Cash in or out"
              text="Positive cash out is extra borrowing added to the new principal. Negative cash in pays the balance down. This is separate from upfront points and closing costs."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.cashInOut}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {cashSymbol}
              </span>
              <input
                id="mrefi-cash"
                className={inputClass}
                inputMode="decimal"
                value={input.cashInOut}
                aria-invalid={Boolean(errors.cashInOut)}
                onChange={(event) => set({ cashInOut: event.target.value })}
              />
            </FieldShell>
            <CurrencySelect
              id="mrefi-cash-currency"
              value={input.cashInOutCurrency}
              onChange={onCashCurrencyChange}
              aria-label="Cash in or out currency"
            />
          </div>
          {errors.cashInOut ? (
            <p className="mt-1 text-xs text-rose-600">{errors.cashInOut}</p>
          ) : null}
        </div>
      </div>

      {conversionError ? <p className="text-xs text-amber-700">{conversionError}</p> : null}
      {ratesWarning ? <p className="text-xs text-amber-700">{ratesWarning}</p> : null}
      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      {result ? (
        <div className={sectionClass}>
          <MortgageRefinanceResults result={result} />
        </div>
      ) : null}
    </form>
  );
}
