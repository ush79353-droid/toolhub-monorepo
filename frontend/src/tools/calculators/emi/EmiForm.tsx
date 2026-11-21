'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { EmiFieldErrors, EmiInput, EmiTermUnit } from './types';

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

interface EmiFormProps {
  input: EmiInput;
  errors: EmiFieldErrors;
  onChange: (next: EmiInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function EmiForm({
  input,
  errors,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: EmiFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<EmiInput>) => onChange({ ...input, ...patch });

  const changeTermUnit = (next: EmiTermUnit) => {
    const n = Number(input.termValue);
    if (
      Number.isFinite(n) &&
      Number.isInteger(n) &&
      n > 0 &&
      input.termUnit !== next
    ) {
      if (input.termUnit === 'years' && next === 'months') {
        set({ termUnit: next, termValue: String(n * 12) });
        return;
      }
      if (input.termUnit === 'months' && next === 'years' && n % 12 === 0) {
        set({ termUnit: next, termValue: String(n / 12) });
        return;
      }
    }
    set({ termUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Fixed-rate reducing-balance EMI with monthly accrual (nominal annual
        rate ÷ 12). Excludes fees and insurance. Currency is denomination only
        (not FX).
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="emi-currency"
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
        Load example (PKR 500,000 · 10% · 5 years)
      </button>

      <div>
        <label htmlFor="emi-principal" className={labelClass}>
          Principal Loan Amount
          <InfoTooltip
            label="Principal"
            text="The original amount borrowed from a lender."
          />
        </label>
        <FieldShell error={errors.principal}>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="emi-principal"
            className={inputClass}
            inputMode="decimal"
            value={input.principal}
            onChange={(e) => set({ principal: e.target.value })}
            placeholder="500000"
            aria-invalid={Boolean(errors.principal)}
          />
        </FieldShell>
        {errors.principal ? (
          <p className="mt-1 text-xs text-rose-600">{errors.principal}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="emi-term" className={labelClass}>
          Loan Term
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.termValue}>
            <input
              id="emi-term"
              className={inputClass}
              inputMode="numeric"
              value={input.termValue}
              onChange={(e) => set({ termValue: e.target.value })}
              placeholder="5"
              aria-invalid={Boolean(errors.termValue)}
            />
          </FieldShell>
          <select
            className={`${selectClass} w-[8.5rem] shrink-0`}
            value={input.termUnit}
            onChange={(e) => changeTermUnit(e.target.value as EmiTermUnit)}
            aria-label="Loan term unit"
          >
            <option value="years">Years</option>
            <option value="months">Months</option>
          </select>
        </div>
        {errors.termValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.termValue}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="emi-rate" className={labelClass}>
          Interest Rate
          <InfoTooltip
            label="Interest rate"
            text="Nominal annual interest rate with monthly accrual (not effective annual yield)."
          />
        </label>
        <FieldShell error={errors.annualInterestRate}>
          <input
            id="emi-rate"
            className={inputClass}
            inputMode="decimal"
            value={input.annualInterestRate}
            onChange={(e) => set({ annualInterestRate: e.target.value })}
            placeholder="10"
            aria-invalid={Boolean(errors.annualInterestRate)}
          />
          <span className="pr-3 text-sm text-muted-foreground">% / year</span>
        </FieldShell>
        {errors.annualInterestRate ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.annualInterestRate}
          </p>
        ) : null}
      </div>

      <div className="rounded-lg border border-border">
        <label className="flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm text-accent">
          <input
            type="checkbox"
            checked={input.enableBalanceLookup}
            onChange={(e) => set({ enableBalanceLookup: e.target.checked })}
          />
          Outstanding balance after payments made
        </label>
        {input.enableBalanceLookup ? (
          <div className="border-t border-border px-3 py-3">
            <label htmlFor="emi-paid" className={labelClass}>
              Payments Already Made
            </label>
            <FieldShell error={errors.paymentsMade}>
              <input
                id="emi-paid"
                className={inputClass}
                inputMode="numeric"
                value={input.paymentsMade}
                onChange={(e) => set({ paymentsMade: e.target.value })}
                placeholder="24"
              />
            </FieldShell>
            {errors.paymentsMade ? (
              <p className="mt-1 text-xs text-rose-600">{errors.paymentsMade}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="rounded-lg border border-border">
        <label className="flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm text-accent">
          <input
            type="checkbox"
            checked={input.enableExtraPayment}
            onChange={(e) => set({ enableExtraPayment: e.target.checked })}
          />
          Extra monthly payment
        </label>
        {input.enableExtraPayment ? (
          <div className="space-y-2 border-t border-border px-3 py-3">
            <p className="text-xs text-muted-foreground">
              Applied to principal after each month’s interest. Not all lenders
              allow penalty-free prepayment.
            </p>
            <label htmlFor="emi-extra" className={labelClass}>
              Extra Monthly Payment
            </label>
            <FieldShell error={errors.extraMonthlyPayment}>
              <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
              <input
                id="emi-extra"
                className={inputClass}
                inputMode="decimal"
                value={input.extraMonthlyPayment}
                onChange={(e) => set({ extraMonthlyPayment: e.target.value })}
                placeholder="2000"
              />
            </FieldShell>
            {errors.extraMonthlyPayment ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.extraMonthlyPayment}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="rounded-lg border border-border">
        <label className="flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm text-accent">
          <input
            type="checkbox"
            checked={input.enableComparison}
            onChange={(e) => set({ enableComparison: e.target.checked })}
          />
          Compare with Loan B
        </label>
        {input.enableComparison ? (
          <div className="space-y-3 border-t border-border px-3 py-3">
            <p className="text-xs text-muted-foreground">
              Loan A uses the main inputs above. Enter Loan B below. Lower EMI
              alone does not mean a better loan.
            </p>
            <div>
              <label htmlFor="emi-b-p" className={labelClass}>
                Loan B Principal
              </label>
              <FieldShell error={errors.comparePrincipal}>
                <span className="pl-3 text-sm text-muted-foreground">
                  {symbol}
                </span>
                <input
                  id="emi-b-p"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.comparePrincipal}
                  onChange={(e) => set({ comparePrincipal: e.target.value })}
                  placeholder="500000"
                />
              </FieldShell>
            </div>
            <div>
              <label htmlFor="emi-b-r" className={labelClass}>
                Loan B Interest Rate
              </label>
              <FieldShell error={errors.compareRate}>
                <input
                  id="emi-b-r"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.compareRate}
                  onChange={(e) => set({ compareRate: e.target.value })}
                  placeholder="9"
                />
                <span className="pr-3 text-sm text-muted-foreground">%</span>
              </FieldShell>
            </div>
            <div>
              <label htmlFor="emi-b-t" className={labelClass}>
                Loan B Term
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.compareTermValue}>
                  <input
                    id="emi-b-t"
                    className={inputClass}
                    inputMode="numeric"
                    value={input.compareTermValue}
                    onChange={(e) => set({ compareTermValue: e.target.value })}
                    placeholder="5"
                  />
                </FieldShell>
                <select
                  className={`${selectClass} w-[8.5rem] shrink-0`}
                  value={input.compareTermUnit}
                  onChange={(e) =>
                    set({
                      compareTermUnit: e.target.value as EmiTermUnit,
                    })
                  }
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
