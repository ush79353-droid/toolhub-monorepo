'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { NI_TAX_YEAR_OPTIONS } from './ni-parameters';
import type {
  NationalInsuranceFieldErrors,
  NationalInsuranceInput,
  NationalInsuranceResult,
  NiTaxYearId,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

interface NationalInsuranceFormProps {
  input: NationalInsuranceInput;
  errors: NationalInsuranceFieldErrors;
  result: NationalInsuranceResult | null;
  incomeOpen: boolean;
  onToggleIncome: () => void;
  onChange: (input: NationalInsuranceInput) => void;
  onLoadExample: () => void;
}

export function NationalInsuranceForm({
  input,
  errors,
  result,
  incomeOpen,
  onToggleIncome,
  onChange,
  onLoadExample,
}: NationalInsuranceFormProps) {
  const set = (patch: Partial<NationalInsuranceInput>) =>
    onChange({ ...input, ...patch });

  const totalDisplay = result
    ? result.totalAnnualIncome.toLocaleString('en-GB', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '';

  const niDisplay = result
    ? result.totalNationalInsurance.toLocaleString('en-GB', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        UK National Insurance estimate in pounds sterling (£). Employee Class 1
        (category A) applies to employment income; Class 4 applies to
        self-employment profits. Bases are not combined before banding. Fixed
        GBP — no currency conversion.
      </p>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example
      </button>

      <div className="rounded-xl border border-border bg-muted/10">
        <button
          type="button"
          onClick={onToggleIncome}
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent"
          aria-expanded={incomeOpen}
        >
          Annual income
          <span className="text-primary" aria-hidden>
            {incomeOpen ? '▴' : '▾'}
          </span>
        </button>

        {incomeOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3">
            <div>
              <label htmlFor="ni-employment" className={labelClass}>
                Employment income
                <InfoTooltip text="Annual employment earnings subject to employee Class 1 National Insurance (category A). Enter 0 if you have no employment income." />
              </label>
              <FieldShell error={errors.employmentIncome}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  £
                </span>
                <input
                  id="ni-employment"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.employmentIncome}
                  onChange={(e) => set({ employmentIncome: e.target.value })}
                  aria-invalid={Boolean(errors.employmentIncome)}
                />
              </FieldShell>
              {errors.employmentIncome ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.employmentIncome}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="ni-self" className={labelClass}>
                Self employment net income
                <InfoTooltip text="Annual self-employment profits (income minus allowable expenses) for Class 4. Enter 0 if none." />
              </label>
              <FieldShell error={errors.selfEmploymentIncome}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  £
                </span>
                <input
                  id="ni-self"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.selfEmploymentIncome}
                  onChange={(e) =>
                    set({ selfEmploymentIncome: e.target.value })
                  }
                  aria-invalid={Boolean(errors.selfEmploymentIncome)}
                />
              </FieldShell>
              {errors.selfEmploymentIncome ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {errors.selfEmploymentIncome}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="ni-total-income" className={labelClass}>
                Total annual income
              </label>
              <FieldShell muted>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  £
                </span>
                <input
                  id="ni-total-income"
                  readOnly
                  className={`${inputClass} cursor-default`}
                  value={totalDisplay}
                  aria-live="polite"
                />
              </FieldShell>
              <p className="mt-1 text-xs text-muted-foreground">
                Employment + self-employment (display only; NI bands are applied
                separately).
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <fieldset className="space-y-3 rounded-xl border border-border bg-muted/10 p-3.5">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Results
        </legend>

        <div>
          <p className={labelClass}>Tax year</p>
          <div className="flex flex-col gap-2">
            {NI_TAX_YEAR_OPTIONS.map((opt) => (
              <label
                key={opt.id}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="ni-tax-year"
                  value={opt.id}
                  checked={input.taxYear === opt.id}
                  onChange={() => set({ taxYear: opt.id as NiTaxYearId })}
                  className="h-4 w-4 accent-primary"
                />
                {opt.label}
              </label>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Current HMRC-supported years (not obsolete screenshot years).
          </p>
        </div>

        <div>
          <label htmlFor="ni-total" className={labelClass}>
            National insurance
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              £
            </span>
            <input
              id="ni-total"
              readOnly
              className={`${inputClass} cursor-default`}
              value={niDisplay}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        {result ? (
          <dl className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex justify-between gap-2">
              <dt>Class 1 (employee)</dt>
              <dd className="tabular-nums text-accent">
                {result.formattedClass1Employee}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>Class 4</dt>
              <dd className="tabular-nums text-accent">
                {result.formattedClass4}
              </dd>
            </div>
          </dl>
        ) : null}
      </fieldset>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
