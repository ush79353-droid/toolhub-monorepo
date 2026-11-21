'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  CITY_OPTIONS,
  HRA_TAX_YEAR_RULES,
  type InputFrequency,
  type TaxRegime,
} from './tax-rules';
import type { HraFieldErrors, HraInput } from './types';

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

interface HraFormProps {
  input: HraInput;
  errors: HraFieldErrors;
  onChange: (next: HraInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function HraForm({
  input,
  errors,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: HraFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<HraInput>) => onChange({ ...input, ...patch });
  const periodLabel = input.frequency === 'annual' ? '/ year' : '/ month';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Indian HRA exemption estimate (old regime). New regime sets exemption to
        zero. City 40%/50% limits follow the selected tax year. Currency is
        denomination only (not FX). Not tax advice.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="hra-currency"
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
        Load example (₹50k · DA ₹5k · HRA ₹20k · rent ₹18k · Delhi)
      </button>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="hra-year" className={labelClass}>
            Tax Year
          </label>
          <select
            id="hra-year"
            className={selectClass}
            value={input.taxYear}
            onChange={(e) => set({ taxYear: e.target.value })}
          >
            {HRA_TAX_YEAR_RULES.map((y) => (
              <option key={y.id} value={y.id}>
                {y.label}
              </option>
            ))}
          </select>
          {errors.taxYear ? (
            <p className="mt-1 text-xs text-rose-600">{errors.taxYear}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="hra-freq" className={labelClass}>
            Input Frequency
          </label>
          <select
            id="hra-freq"
            className={selectClass}
            value={input.frequency}
            onChange={(e) =>
              set({ frequency: e.target.value as InputFrequency })
            }
          >
            <option value="monthly">Monthly</option>
            <option value="annual">Annual</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="hra-regime" className={labelClass}>
          Income Tax Regime
          <InfoTooltip
            label="Regime"
            text="HRA exemption is generally claimable only under the old tax regime."
          />
        </label>
        <select
          id="hra-regime"
          className={selectClass}
          value={input.taxRegime}
          onChange={(e) => set({ taxRegime: e.target.value as TaxRegime })}
        >
          <option value="old">Old Tax Regime</option>
          <option value="new">New Tax Regime</option>
        </select>
      </div>

      <div>
        <label htmlFor="hra-basic" className={labelClass}>
          Basic Salary
        </label>
        <FieldShell error={errors.basicSalary}>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="hra-basic"
            className={inputClass}
            inputMode="decimal"
            value={input.basicSalary}
            onChange={(e) => set({ basicSalary: e.target.value })}
            aria-invalid={Boolean(errors.basicSalary)}
            placeholder="50000"
          />
          <span className="pr-3 text-xs text-muted-foreground">{periodLabel}</span>
        </FieldShell>
        {errors.basicSalary ? (
          <p className="mt-1 text-xs text-rose-600">{errors.basicSalary}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="hra-da" className={labelClass}>
          Dearness Allowance (DA)
        </label>
        <FieldShell error={errors.dearnessAllowance}>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="hra-da"
            className={inputClass}
            inputMode="decimal"
            value={input.dearnessAllowance}
            onChange={(e) => set({ dearnessAllowance: e.target.value })}
            aria-invalid={Boolean(errors.dearnessAllowance)}
            placeholder="5000"
          />
          <span className="pr-3 text-xs text-muted-foreground">{periodLabel}</span>
        </FieldShell>
        {errors.dearnessAllowance ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.dearnessAllowance}
          </p>
        ) : null}
        <label className="mt-2 flex items-start gap-2 text-xs text-accent">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-border"
            checked={input.daEligibleForRetirementBenefits}
            onChange={(e) =>
              set({ daEligibleForRetirementBenefits: e.target.checked })
            }
          />
          <span>
            DA forms part of salary for retirement benefits (include in
            qualifying HRA salary). Default: included when checked.
          </span>
        </label>
      </div>

      <div>
        <label htmlFor="hra-received" className={labelClass}>
          House Rent Allowance Received
        </label>
        <FieldShell error={errors.hraReceived}>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="hra-received"
            className={inputClass}
            inputMode="decimal"
            value={input.hraReceived}
            onChange={(e) => set({ hraReceived: e.target.value })}
            aria-invalid={Boolean(errors.hraReceived)}
            placeholder="20000"
          />
          <span className="pr-3 text-xs text-muted-foreground">{periodLabel}</span>
        </FieldShell>
        {errors.hraReceived ? (
          <p className="mt-1 text-xs text-rose-600">{errors.hraReceived}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="hra-rent" className={labelClass}>
          Actual Rent Paid
        </label>
        <FieldShell error={errors.rentPaid}>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="hra-rent"
            className={inputClass}
            inputMode="decimal"
            value={input.rentPaid}
            onChange={(e) => set({ rentPaid: e.target.value })}
            aria-invalid={Boolean(errors.rentPaid)}
            placeholder="18000"
          />
          <span className="pr-3 text-xs text-muted-foreground">{periodLabel}</span>
        </FieldShell>
        {errors.rentPaid ? (
          <p className="mt-1 text-xs text-rose-600">{errors.rentPaid}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="hra-city" className={labelClass}>
          City of Residence
          <InfoTooltip
            label="City"
            text="Determines 40% or 50% of qualifying salary using tax-year rules."
          />
        </label>
        <select
          id="hra-city"
          className={selectClass}
          value={input.city}
          onChange={(e) => set({ city: e.target.value })}
        >
          {CITY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.city ? (
          <p className="mt-1 text-xs text-rose-600">{errors.city}</p>
        ) : null}
      </div>

      <details className="rounded-lg border border-border bg-white">
        <summary className="cursor-pointer px-3 py-2.5 text-sm font-medium text-accent">
          Optional: Partial-year eligibility
        </summary>
        <div className="space-y-3 border-t border-border px-3 py-3">
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border"
              checked={input.enablePartialYear}
              onChange={(e) => set({ enablePartialYear: e.target.checked })}
            />
            Limit annual results to eligible rented months
          </label>
          {input.enablePartialYear ? (
            <div>
              <label htmlFor="hra-months" className={labelClass}>
                Eligible months (1–12)
              </label>
              <FieldShell error={errors.eligibleMonths}>
                <input
                  id="hra-months"
                  className={inputClass}
                  inputMode="numeric"
                  value={input.eligibleMonths}
                  onChange={(e) => set({ eligibleMonths: e.target.value })}
                  placeholder="12"
                />
              </FieldShell>
              {errors.eligibleMonths ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.eligibleMonths}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </details>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
