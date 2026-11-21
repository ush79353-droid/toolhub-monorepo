'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COMPOUND_OPTIONS,
  PAYMENT_OPTIONS,
  type CompoundFrequency,
  type PaymentFrequency,
  type RepaymentFieldErrors,
  type RepaymentInput,
  type RepaymentMode,
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
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring border-border bg-white ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface RepaymentFormProps {
  input: RepaymentInput;
  errors: RepaymentFieldErrors;
  onChange: (input: RepaymentInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function RepaymentForm({
  input,
  errors,
  onChange,
  onCurrencyChange,
}: RepaymentFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  const setMode = (mode: RepaymentMode) => onChange({ ...input, mode });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Choose a fixed payoff term to find the installment, or enter a fixed
        installment to estimate payoff time. Compounding and payment
        frequencies are converted to an effective rate per payment period.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="rep-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for repayment amounts"
        />
      </div>

      <div>
        <label htmlFor="rep-balance" className={labelClass}>
          Loan balance
          <InfoTooltip
            label="Loan balance"
            text="Outstanding principal to repay before future interest."
          />
        </label>
        <FieldShell error={errors.loanBalance}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="rep-balance"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.loanBalance}
            onChange={(e) =>
              onChange({ ...input, loanBalance: e.target.value })
            }
            placeholder="10,000"
            aria-invalid={Boolean(errors.loanBalance)}
          />
        </FieldShell>
        {errors.loanBalance ? (
          <p className="mt-1 text-xs text-rose-600">{errors.loanBalance}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="rep-rate" className={labelClass}>
          Interest rate
          <InfoTooltip
            label="Interest rate"
            text="Annual nominal rate. Converted using compounding and payment frequencies."
          />
        </label>
        <FieldShell error={errors.annualInterestRate}>
          <input
            id="rep-rate"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.annualInterestRate}
            onChange={(e) =>
              onChange({ ...input, annualInterestRate: e.target.value })
            }
            placeholder="10"
            aria-invalid={Boolean(errors.annualInterestRate)}
          />
          <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
            %
          </span>
        </FieldShell>
        {errors.annualInterestRate ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.annualInterestRate}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="rep-compound" className={labelClass}>
          Compound
        </label>
        <select
          id="rep-compound"
          className={selectClass}
          value={input.compounding}
          onChange={(e) =>
            onChange({
              ...input,
              compounding: e.target.value as CompoundFrequency,
            })
          }
        >
          {COMPOUND_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="rep-payfreq" className={labelClass}>
          Pay back
        </label>
        <select
          id="rep-payfreq"
          className={selectClass}
          value={input.paymentFrequency}
          onChange={(e) =>
            onChange({
              ...input,
              paymentFrequency: e.target.value as PaymentFrequency,
            })
          }
        >
          {PAYMENT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className={labelClass}>Repayment method</legend>
        <div
          className="mt-1.5 flex flex-col gap-2 sm:flex-row"
          role="radiogroup"
          aria-label="Repayment method"
        >
          {(
            [
              { value: 'fixed-term' as const, label: 'Repay within a fixed time' },
              {
                value: 'fixed-installment' as const,
                label: 'Repay with a fixed installment',
              },
            ] as const
          ).map((opt) => {
            const selected = input.mode === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`h-11 flex-1 rounded-lg border px-3 text-left text-sm font-medium transition-colors ${
                  selected
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-white text-accent hover:bg-muted/30'
                }`}
                onClick={() => setMode(opt.value)}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {input.mode === 'fixed-term' ? (
        <fieldset>
          <legend className={labelClass}>
            Loan term
            <InfoTooltip
              label="Loan term"
              text="Years plus months. Converted to payment count using the selected payment frequency."
            />
          </legend>
          <div className="mt-1.5 flex gap-2">
            <div className="min-w-0 flex-1">
              <label htmlFor="rep-years" className="sr-only">
                Years
              </label>
              <FieldShell error={errors.years}>
                <input
                  id="rep-years"
                  type="text"
                  inputMode="numeric"
                  className={inputClass}
                  value={input.years}
                  onChange={(e) =>
                    onChange({ ...input, years: e.target.value })
                  }
                  placeholder="5"
                  aria-invalid={Boolean(errors.years)}
                />
                <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                  years
                </span>
              </FieldShell>
            </div>
            <div className="min-w-0 flex-1">
              <label htmlFor="rep-months" className="sr-only">
                Months
              </label>
              <FieldShell error={errors.months}>
                <input
                  id="rep-months"
                  type="text"
                  inputMode="numeric"
                  className={inputClass}
                  value={input.months}
                  onChange={(e) =>
                    onChange({ ...input, months: e.target.value })
                  }
                  placeholder="0"
                  aria-invalid={Boolean(errors.months)}
                />
                <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                  months
                </span>
              </FieldShell>
            </div>
          </div>
          {errors.years ? (
            <p className="mt-1 text-xs text-rose-600">{errors.years}</p>
          ) : null}
          {errors.months ? (
            <p className="mt-1 text-xs text-rose-600">{errors.months}</p>
          ) : null}
        </fieldset>
      ) : (
        <div>
          <label htmlFor="rep-installment" className={labelClass}>
            Fixed installment
            <InfoTooltip
              label="Fixed installment"
              text="Amount paid each payment period. Must exceed periodic interest to amortize."
            />
          </label>
          <FieldShell error={errors.fixedInstallment}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="rep-installment"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.fixedInstallment}
              onChange={(e) =>
                onChange({ ...input, fixedInstallment: e.target.value })
              }
              placeholder="300"
              aria-invalid={Boolean(errors.fixedInstallment)}
            />
          </FieldShell>
          {errors.fixedInstallment ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.fixedInstallment}
            </p>
          ) : null}
        </div>
      )}

      {errors.form && !errors.fixedInstallment ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
