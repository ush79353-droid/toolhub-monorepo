'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  UK_LOCATION_OPTIONS,
  UK_TAX_YEAR_OPTIONS,
  type UkLocation,
  type UkTaxYearId,
} from './tax-parameters';
import type {
  TakeHomePayUkFieldErrors,
  TakeHomePayUkInput,
  TakeHomePayUkResult,
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
        muted ? 'border-border bg-primary/5' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

interface TakeHomePayUkFormProps {
  input: TakeHomePayUkInput;
  errors: TakeHomePayUkFieldErrors;
  result: TakeHomePayUkResult | null;
  incomeOpen: boolean;
  onIncomeOpenChange: (open: boolean) => void;
  onChange: (input: TakeHomePayUkInput) => void;
}

export function TakeHomePayUkForm({
  input,
  errors,
  result,
  incomeOpen,
  onIncomeOpenChange,
  onChange,
}: TakeHomePayUkFormProps) {
  const set = (patch: Partial<TakeHomePayUkInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-2 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Location
        </legend>
        <div className="flex flex-wrap gap-3">
          {UK_LOCATION_OPTIONS.map((o) => (
            <label
              key={o.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="thuk-loc"
                checked={input.location === o.value}
                onChange={() => set({ location: o.value as UkLocation })}
              />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Tax year
        </legend>
        <div className="flex flex-wrap gap-3">
          {UK_TAX_YEAR_OPTIONS.map((o) => (
            <label
              key={o.id}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="thuk-year"
                checked={input.taxYear === o.id}
                onChange={() => set({ taxYear: o.id as UkTaxYearId })}
              />
              {o.label}
            </label>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Screenshot years replaced with current HMRC-supported years (prompt).
        </p>
      </fieldset>

      <div className="rounded-xl border border-border bg-muted/15">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
          aria-expanded={incomeOpen}
          onClick={() => onIncomeOpenChange(!incomeOpen)}
        >
          Total annual income
          <span className="text-muted-foreground" aria-hidden>
            {incomeOpen ? '−' : '+'}
          </span>
        </button>
        {incomeOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 sm:px-4 sm:pb-4">
            {(
              [
                {
                  id: 'employmentIncome',
                  label: 'Employment income',
                  tip: 'Gross employment pay for the tax year (Class 1 NI base).',
                },
                {
                  id: 'selfEmploymentIncome',
                  label: 'Self-employment net income',
                  tip: 'Taxable trading profits (Class 4 NI base).',
                },
                {
                  id: 'rentalIncome',
                  label: 'Rental net income',
                  tip: 'Taxable property income after allowable expenses (no NI).',
                },
              ] as const
            ).map((field) => (
              <div key={field.id}>
                <label htmlFor={`thuk-${field.id}`} className={labelClass}>
                  {field.label}
                  <InfoTooltip label={field.label} text={field.tip} />
                </label>
                <FieldShell error={errors[field.id]}>
                  <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                    £
                  </span>
                  <input
                    id={`thuk-${field.id}`}
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input[field.id]}
                    onChange={(e) => set({ [field.id]: e.target.value })}
                  />
                </FieldShell>
                {errors[field.id] ? (
                  <p className="mt-1 text-xs text-rose-600">{errors[field.id]}</p>
                ) : null}
              </div>
            ))}

            <div>
              <label className={labelClass}>Total annual income</label>
              <FieldShell muted>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  £
                </span>
                <input
                  type="text"
                  readOnly
                  className={`${inputClass} text-primary`}
                  value={
                    result
                      ? result.totalIncome.toLocaleString('en-GB', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : '0.00'
                  }
                  aria-label="Total annual income"
                />
              </FieldShell>
            </div>
          </div>
        ) : null}
      </div>
      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
