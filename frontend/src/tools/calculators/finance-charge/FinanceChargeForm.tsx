'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CalculationMethod,
  FinanceChargeFieldErrors,
  FinanceChargeInput,
  TimeUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

function MethodRadios({
  value,
  onChange,
}: {
  value: CalculationMethod;
  onChange: (next: CalculationMethod) => void;
}) {
  const options: { value: CalculationMethod; label: string }[] = [
    { value: 'billing-cycle', label: 'Billing cycle' },
    { value: 'given-term', label: 'Given term' },
  ];
  return (
    <fieldset>
      <legend className={labelClass}>
        Calculate for…
        <InfoTooltip
          label="Calculate for"
          text="Billing cycle uses a whole number of days. Given term converts weeks, months (365/12 days), or years to a day count on a 365-day year."
        />
      </legend>
      <div
        className="mt-1.5 flex flex-wrap gap-2"
        role="radiogroup"
        aria-label="Calculation method"
      >
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`h-11 min-w-[7rem] rounded-lg border px-3 text-sm font-medium transition-colors ${
                selected
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-accent hover:bg-muted/30'
              }`}
              onClick={() => onChange(opt.value)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

interface FinanceChargeFormProps {
  input: FinanceChargeInput;
  errors: FinanceChargeFieldErrors;
  onChange: (input: FinanceChargeInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function FinanceChargeForm({
  input,
  errors,
  onChange,
  onCurrencyChange,
}: FinanceChargeFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Enter the outstanding balance, APR, and either a billing-cycle length
        or a given term. The estimate uses simple interest on a constant
        balance and a 365-day year — not an issuer-specific statement method.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="fc-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for finance charge amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts share one currency label (denomination only — no FX).
      </p>
      <p className="text-xs">
        <a
          href="#how-to-calculate"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to calculate a finance charge
        </a>
      </p>

      <div>
        <label htmlFor="fc-balance" className={labelClass}>
          Current balance owed
          <InfoTooltip
            label="Current balance owed"
            text="Principal balance assumed constant over the period."
          />
        </label>
        <FieldShell error={errors.balance}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="fc-balance"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.balance}
            onChange={(e) => onChange({ ...input, balance: e.target.value })}
            placeholder="1,000.00"
            aria-invalid={Boolean(errors.balance)}
          />
        </FieldShell>
        {errors.balance ? (
          <p className="mt-1 text-xs text-rose-600">{errors.balance}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="fc-apr" className={labelClass}>
          Annual percentage rate (APR)
          <InfoTooltip
            label="APR"
            text="Nominal annual rate used to derive a daily periodic rate (APR ÷ 365)."
          />
        </label>
        <FieldShell error={errors.apr}>
          <input
            id="fc-apr"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.apr}
            onChange={(e) => onChange({ ...input, apr: e.target.value })}
            placeholder="18"
            aria-invalid={Boolean(errors.apr)}
          />
          <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
            %
          </span>
        </FieldShell>
        {errors.apr ? (
          <p className="mt-1 text-xs text-rose-600">{errors.apr}</p>
        ) : null}
      </div>

      <MethodRadios
        value={input.method}
        onChange={(method) => onChange({ ...input, method })}
      />

      {input.method === 'billing-cycle' ? (
        <div>
          <label htmlFor="fc-days" className={labelClass}>
            Billing cycle length
            <InfoTooltip
              label="Billing cycle length"
              text="Whole number of days in the billing cycle (1–366)."
            />
          </label>
          <FieldShell error={errors.billingCycleDays}>
            <input
              id="fc-days"
              type="text"
              inputMode="numeric"
              className={inputClass}
              value={input.billingCycleDays}
              onChange={(e) =>
                onChange({ ...input, billingCycleDays: e.target.value })
              }
              placeholder="30"
              aria-invalid={Boolean(errors.billingCycleDays)}
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              days
            </span>
          </FieldShell>
          {errors.billingCycleDays ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.billingCycleDays}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label htmlFor="fc-term" className={labelClass}>
              Term length
              <InfoTooltip
                label="Term length"
                text="Duration of the estimate. Months use 365/12 days each (approximate)."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.termLength}>
                <input
                  id="fc-term"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.termLength}
                  onChange={(e) =>
                    onChange({ ...input, termLength: e.target.value })
                  }
                  placeholder="6"
                  aria-invalid={Boolean(errors.termLength)}
                />
              </FieldShell>
              <select
                id="fc-term-unit"
                className="h-11 shrink-0 rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
                value={input.termUnit}
                aria-label="Term time unit"
                onChange={(e) =>
                  onChange({
                    ...input,
                    termUnit: e.target.value as TimeUnit,
                  })
                }
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
            {errors.termLength ? (
              <p className="mt-1 text-xs text-rose-600">{errors.termLength}</p>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            Month conversion uses 365 ÷ 12 days (not calendar months). Weeks =
            7 days; years = 365 days.
          </p>
        </div>
      )}

      <label className="flex cursor-pointer items-start gap-2.5 text-sm text-accent">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-border"
          checked={input.showDailyBreakdown}
          onChange={(e) =>
            onChange({ ...input, showDailyBreakdown: e.target.checked })
          }
        />
        <span>
          Show daily interest and finance charge
          <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
            Simple (non-compounding) daily accrual on a constant balance.
          </span>
        </span>
      </label>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
