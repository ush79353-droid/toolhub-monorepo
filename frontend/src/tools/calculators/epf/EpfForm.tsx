'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  ILLUSTRATIVE_INTEREST_RATE,
  type EpfFieldErrors,
  type EpfInput,
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
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface EpfFormProps {
  input: EpfInput;
  errors: EpfFieldErrors;
  onChange: (next: EpfInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function EpfForm({
  input,
  errors,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: EpfFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<EpfInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Indian EPF/EPS educational projection. EPS is tracked separately and is
        not added to the EPF corpus. Interest rate{' '}
        {ILLUSTRATIVE_INTEREST_RATE}% is an illustrative assumption, not an
        official EPFO announcement. Currency is denomination only (not FX).
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="epf-currency"
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
        Load example (age 25 · ₹15,000 · 12% · retire 58)
      </button>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="epf-age" className={labelClass}>
            Age
            <InfoTooltip
              label="Age"
              text="Current age in whole years. Must be below retirement age."
            />
          </label>
          <FieldShell error={errors.currentAge}>
            <input
              id="epf-age"
              className={inputClass}
              inputMode="numeric"
              value={input.currentAge}
              onChange={(e) => set({ currentAge: e.target.value })}
              aria-invalid={Boolean(errors.currentAge)}
              placeholder="25"
            />
            <span className="pr-3 text-xs text-muted-foreground">years</span>
          </FieldShell>
          {errors.currentAge ? (
            <p className="mt-1 text-xs text-rose-600">{errors.currentAge}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="epf-retire" className={labelClass}>
            Retirement Age
            <InfoTooltip
              label="Retirement age"
              text="Projection end age. Not a guarantee of withdrawal eligibility."
            />
          </label>
          <FieldShell error={errors.retirementAge}>
            <input
              id="epf-retire"
              className={inputClass}
              inputMode="numeric"
              value={input.retirementAge}
              onChange={(e) => set({ retirementAge: e.target.value })}
              aria-invalid={Boolean(errors.retirementAge)}
              placeholder="58"
            />
            <span className="pr-3 text-xs text-muted-foreground">years</span>
          </FieldShell>
          {errors.retirementAge ? (
            <p className="mt-1 text-xs text-rose-600">{errors.retirementAge}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="epf-basic" className={labelClass}>
          Monthly Basic Salary
          <InfoTooltip
            label="Basic salary"
            text="Monthly basic pay used for EPF. Not gross or take-home pay."
          />
        </label>
        <FieldShell error={errors.monthlyBasicSalary}>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="epf-basic"
            className={inputClass}
            inputMode="decimal"
            value={input.monthlyBasicSalary}
            onChange={(e) => set({ monthlyBasicSalary: e.target.value })}
            aria-invalid={Boolean(errors.monthlyBasicSalary)}
            placeholder="15000"
          />
        </FieldShell>
        {errors.monthlyBasicSalary ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.monthlyBasicSalary}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="epf-da" className={labelClass}>
          Dearness Allowance (DA)
          <InfoTooltip
            label="DA"
            text="Dearness allowance included in EPF salary = Basic + DA."
          />
        </label>
        <FieldShell error={errors.dearnessAllowance}>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="epf-da"
            className={inputClass}
            inputMode="decimal"
            value={input.dearnessAllowance}
            onChange={(e) => set({ dearnessAllowance: e.target.value })}
            aria-invalid={Boolean(errors.dearnessAllowance)}
            placeholder="0"
          />
        </FieldShell>
        {errors.dearnessAllowance ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.dearnessAllowance}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="epf-growth" className={labelClass}>
            Expected Annual Salary Increase
          </label>
          <FieldShell error={errors.annualSalaryGrowthRate}>
            <input
              id="epf-growth"
              className={inputClass}
              inputMode="decimal"
              value={input.annualSalaryGrowthRate}
              onChange={(e) => set({ annualSalaryGrowthRate: e.target.value })}
              aria-invalid={Boolean(errors.annualSalaryGrowthRate)}
              placeholder="5"
            />
            <span className="pr-3 text-xs text-muted-foreground">%/yr</span>
          </FieldShell>
          {errors.annualSalaryGrowthRate ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.annualSalaryGrowthRate}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="epf-interest" className={labelClass}>
            Annual EPF Interest Rate
            <InfoTooltip
              label="Interest"
              text="Assumed constant future rate. EPFO announces rates periodically — edit this field."
            />
          </label>
          <FieldShell error={errors.annualInterestRate}>
            <input
              id="epf-interest"
              className={inputClass}
              inputMode="decimal"
              value={input.annualInterestRate}
              onChange={(e) => set({ annualInterestRate: e.target.value })}
              aria-invalid={Boolean(errors.annualInterestRate)}
              placeholder={String(ILLUSTRATIVE_INTEREST_RATE)}
            />
            <span className="pr-3 text-xs text-muted-foreground">%/yr</span>
          </FieldShell>
          {errors.annualInterestRate ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.annualInterestRate}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="epf-emp-rate" className={labelClass}>
            Employee EPF Contribution Rate
          </label>
          <FieldShell error={errors.employeeContributionRate}>
            <input
              id="epf-emp-rate"
              className={inputClass}
              inputMode="decimal"
              value={input.employeeContributionRate}
              onChange={(e) =>
                set({ employeeContributionRate: e.target.value })
              }
              aria-invalid={Boolean(errors.employeeContributionRate)}
              placeholder="12"
            />
            <span className="pr-3 text-xs text-muted-foreground">%</span>
          </FieldShell>
          {errors.employeeContributionRate ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.employeeContributionRate}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="epf-er-rate" className={labelClass}>
            Employer Contribution Rate
            <InfoTooltip
              label="Employer"
              text="Total employer statutory rate. Part may go to EPS when eligible."
            />
          </label>
          <FieldShell error={errors.employerContributionRate}>
            <input
              id="epf-er-rate"
              className={inputClass}
              inputMode="decimal"
              value={input.employerContributionRate}
              onChange={(e) =>
                set({ employerContributionRate: e.target.value })
              }
              aria-invalid={Boolean(errors.employerContributionRate)}
              placeholder="12"
            />
            <span className="pr-3 text-xs text-muted-foreground">%</span>
          </FieldShell>
          {errors.employerContributionRate ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.employerContributionRate}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="epf-balance" className={labelClass}>
          Current EPF Balance
        </label>
        <FieldShell error={errors.existingEPFBalance}>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="epf-balance"
            className={inputClass}
            inputMode="decimal"
            value={input.existingEPFBalance}
            onChange={(e) => set({ existingEPFBalance: e.target.value })}
            aria-invalid={Boolean(errors.existingEPFBalance)}
            placeholder="0"
          />
        </FieldShell>
        {errors.existingEPFBalance ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.existingEPFBalance}
          </p>
        ) : null}
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-muted/10 p-3">
        <label className="flex items-center gap-2 text-sm text-accent">
          <input
            type="checkbox"
            checked={input.eligibleForEPS}
            onChange={(e) => set({ eligibleForEPS: e.target.checked })}
            className="h-4 w-4 rounded border-border"
          />
          Eligible for EPS (pension scheme)
        </label>
        {input.eligibleForEPS ? (
          <div>
            <label htmlFor="epf-ceiling" className={labelClass}>
              EPS Wage Ceiling
              <InfoTooltip
                label="Ceiling"
                text="Pensionable wage cap used for 8.33% EPS (commonly ₹15,000 — verify current EPFO rules)."
              />
            </label>
            <FieldShell error={errors.epsWageCeiling}>
              <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
              <input
                id="epf-ceiling"
                className={inputClass}
                inputMode="decimal"
                value={input.epsWageCeiling}
                onChange={(e) => set({ epsWageCeiling: e.target.value })}
                aria-invalid={Boolean(errors.epsWageCeiling)}
              />
            </FieldShell>
            {errors.epsWageCeiling ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.epsWageCeiling}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <details className="rounded-lg border border-border bg-white">
        <summary className="cursor-pointer px-3 py-2.5 text-sm font-medium text-accent">
          Optional: Voluntary Provident Fund (VPF)
        </summary>
        <div className="space-y-3 border-t border-border px-3 py-3">
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              checked={input.enableVPF}
              onChange={(e) => set({ enableVPF: e.target.checked })}
              className="h-4 w-4 rounded border-border"
            />
            Add VPF on top of mandatory employee EPF
          </label>
          {input.enableVPF ? (
            <div>
              <label htmlFor="epf-vpf" className={labelClass}>
                Additional VPF Rate
              </label>
              <FieldShell error={errors.additionalVPFRate}>
                <input
                  id="epf-vpf"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.additionalVPFRate}
                  onChange={(e) => set({ additionalVPFRate: e.target.value })}
                  aria-invalid={Boolean(errors.additionalVPFRate)}
                  placeholder="5"
                />
                <span className="pr-3 text-xs text-muted-foreground">%</span>
              </FieldShell>
              {errors.additionalVPFRate ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.additionalVPFRate}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </details>

      <details className="rounded-lg border border-border bg-white">
        <summary className="cursor-pointer px-3 py-2.5 text-sm font-medium text-accent">
          Optional: Scenario comparison
        </summary>
        <div className="space-y-3 border-t border-border px-3 py-3">
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              checked={input.enableComparison}
              onChange={(e) => set({ enableComparison: e.target.checked })}
              className="h-4 w-4 rounded border-border"
            />
            Compare an alternate growth / rate / retirement age
          </label>
          {input.enableComparison ? (
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label htmlFor="epf-cmp-g" className={labelClass}>
                  Alt. growth %
                </label>
                <FieldShell error={errors.compareGrowthRate}>
                  <input
                    id="epf-cmp-g"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.compareGrowthRate}
                    onChange={(e) =>
                      set({ compareGrowthRate: e.target.value })
                    }
                  />
                </FieldShell>
              </div>
              <div>
                <label htmlFor="epf-cmp-i" className={labelClass}>
                  Alt. interest %
                </label>
                <FieldShell error={errors.compareInterestRate}>
                  <input
                    id="epf-cmp-i"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.compareInterestRate}
                    onChange={(e) =>
                      set({ compareInterestRate: e.target.value })
                    }
                  />
                </FieldShell>
              </div>
              <div>
                <label htmlFor="epf-cmp-r" className={labelClass}>
                  Alt. retire age
                </label>
                <FieldShell error={errors.compareRetirementAge}>
                  <input
                    id="epf-cmp-r"
                    className={inputClass}
                    inputMode="numeric"
                    value={input.compareRetirementAge}
                    onChange={(e) =>
                      set({ compareRetirementAge: e.target.value })
                    }
                  />
                </FieldShell>
              </div>
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
