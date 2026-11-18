'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { HISTORICAL_PROGRAM_NOTICE } from './types';
import type {
  FilingStatus,
  StudentLoanForgivenessFieldErrors,
  StudentLoanForgivenessInput,
  StudentLoanForgivenessResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

interface StudentLoanForgivenessFormProps {
  input: StudentLoanForgivenessInput;
  errors: StudentLoanForgivenessFieldErrors;
  result: StudentLoanForgivenessResult | null;
  onChange: (input: StudentLoanForgivenessInput) => void;
  onReset: () => void;
}

export function StudentLoanForgivenessForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: StudentLoanForgivenessFormProps) {
  const set = (patch: Partial<StudentLoanForgivenessInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Student loan forgiveness (historical)
        </legend>

        <div>
          <p className={labelClass}>
            <span>Your filing status</span>
            <InfoTooltip
              label="Filing status"
              text="Tax filing status for the historical form fields only. Not used to invent current eligibility."
            />
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-accent">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="slf-filing"
                checked={input.filingStatus === 'single'}
                onChange={() => set({ filingStatus: 'single' as FilingStatus })}
              />
              Single
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="slf-filing"
                checked={input.filingStatus === 'married'}
                onChange={() => set({ filingStatus: 'married' as FilingStatus })}
              />
              Married
            </label>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="slf-income">
            <span>Your annual income</span>
          </label>
          <FieldShell error={errors.annualIncome}>
            <input
              id="slf-income"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.annualIncome}
              aria-invalid={Boolean(errors.annualIncome)}
              onChange={(e) => set({ annualIncome: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              $
            </span>
          </FieldShell>
          {errors.annualIncome ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualIncome}</p>
          ) : null}
        </div>

        <div>
          <p className={labelClass}>
            <span>Did you receive Pell Grants?</span>
          </p>
          <label className="inline-flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border"
              checked={input.receivedPellGrants}
              onChange={(e) => set({ receivedPellGrants: e.target.checked })}
            />
            Yes
          </label>
        </div>

        <div>
          <label className={labelClass} htmlFor="slf-debt">
            <span>Your outstanding student debt</span>
          </label>
          <FieldShell error={errors.outstandingStudentDebt}>
            <input
              id="slf-debt"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.outstandingStudentDebt}
              aria-invalid={Boolean(errors.outstandingStudentDebt)}
              onChange={(e) => set({ outstandingStudentDebt: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              $
            </span>
          </FieldShell>
          {errors.outstandingStudentDebt ? (
            <p className="mt-1 text-xs text-rose-600">{errors.outstandingStudentDebt}</p>
          ) : null}
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      {result ? (
        <div
          className="rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-3 text-xs leading-relaxed text-amber-950 sm:text-sm"
          role="status"
        >
          {result.historicalNotice}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">{HISTORICAL_PROGRAM_NOTICE}</p>
      )}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Clear
        </Button>
      </div>
    </form>
  );
}
