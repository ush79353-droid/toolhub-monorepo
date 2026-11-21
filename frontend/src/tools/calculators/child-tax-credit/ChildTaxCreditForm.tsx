'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  ChildTaxCreditFieldErrors,
  ChildTaxCreditInput,
  ChildTaxCreditResult,
  FilingStatus,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';
const unitClass =
  'shrink-0 pr-3 text-xs font-medium text-muted-foreground whitespace-nowrap';

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

interface ChildTaxCreditFormProps {
  input: ChildTaxCreditInput;
  errors: ChildTaxCreditFieldErrors;
  result: ChildTaxCreditResult | null;
  onChange: (input: ChildTaxCreditInput) => void;
}

export function ChildTaxCreditForm({
  input,
  errors,
  result,
  onChange,
}: ChildTaxCreditFormProps) {
  const set = (patch: Partial<ChildTaxCreditInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-accent sm:text-sm">
        <p className="text-foreground/90">
          The <strong>Child Tax Credit</strong> helps families with qualifying dependent children
          under age 17. This estimate uses tax year 2025 rules ($2,200 per qualifying child) and
 income phaseouts. It is educational; not a guaranteed IRS refund.
        </p>
      </div>

      <div className={sectionClass}>
        <div>
          <div className={labelClass}>
            <span>Your filing status</span>
            <InfoTooltip
              label="Your filing status"
              text="Phaseout starts at $200,000 AGI for Single and Head of household, and $400,000 for Joint (married filing jointly)."
            />
          </div>
          <div
            className="flex flex-wrap gap-4"
            role="radiogroup"
            aria-label="Your filing status"
          >
            {(
              [
                { value: 'single', label: 'Single' },
                { value: 'joint', label: 'Joint' },
                { value: 'head_of_household', label: 'Head of household' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="ctc-filing-status"
                  className="h-4 w-4 accent-primary"
                  checked={input.filingStatus === opt.value}
                  onChange={() =>
                    set({ filingStatus: opt.value as FilingStatus })
                  }
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="ctc-agi">
            <span>Income (AGI)</span>
            <InfoTooltip
              label="Income (AGI)"
              text="Adjusted gross income in USD. Used as a MAGI proxy for the CTC phaseout. Nonnegative only."
            />
          </label>
          <FieldShell error={errors.agi}>
            <span
              className="shrink-0 pl-3 font-mono text-sm text-muted-foreground"
              aria-hidden
            >
              $
            </span>
            <input
              id="ctc-agi"
              className={`${inputClass} pl-1`}
              inputMode="decimal"
              value={input.agi}
              aria-invalid={Boolean(errors.agi)}
              onChange={(e) => set({ agi: e.target.value })}
            />
          </FieldShell>
          {errors.agi ? (
            <p className="mt-1 text-xs text-rose-600">{errors.agi}</p>
          ) : null}
        </div>
      </div>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.childrenOpen}
        onToggle={(event) => set({ childrenOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4">
          <span>Children&apos;s ages</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform [[open]_&]:rotate-180" />
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:pb-4">
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Your children must be listed as dependents on your federal tax return. Input only the
            full years the child has finished. Qualifying children for the CTC are under age 17 at
            year-end (ages 0–16 here).
          </p>
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="ctc-child1">
                <span>1st child</span>
              </label>
              <FieldShell error={errors.child1Age}>
                <input
                  id="ctc-child1"
                  className={inputClass}
                  inputMode="numeric"
                  value={input.child1Age}
                  aria-invalid={Boolean(errors.child1Age)}
                  onChange={(e) => set({ child1Age: e.target.value })}
                />
                <span className={unitClass}>years</span>
              </FieldShell>
              {errors.child1Age ? (
                <p className="mt-1 text-xs text-rose-600">{errors.child1Age}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="ctc-child2">
                <span>2nd child</span>
              </label>
              <FieldShell error={errors.child2Age}>
                <input
                  id="ctc-child2"
                  className={inputClass}
                  inputMode="numeric"
                  value={input.child2Age}
                  aria-invalid={Boolean(errors.child2Age)}
                  onChange={(e) => set({ child2Age: e.target.value })}
                />
                <span className={unitClass}>years</span>
              </FieldShell>
              {errors.child2Age ? (
                <p className="mt-1 text-xs text-rose-600">{errors.child2Age}</p>
              ) : null}
            </div>
          </div>
        </div>
      </details>

      <div className={sectionClass}>
        <div>
          <label className={labelClass} htmlFor="ctc-estimated">
            <span>Estimated Child Tax Credit</span>
            <InfoTooltip
              label="Estimated Child Tax Credit"
              text="Potential TY 2025 CTC after income phaseout under simplified eligibility assumptions. Not a guaranteed refund."
            />
          </label>
          <FieldShell muted>
            <span
              className="shrink-0 pl-3 font-mono text-sm text-muted-foreground"
              aria-hidden
            >
              $
            </span>
            <input
              id="ctc-estimated"
              className={`${inputClass} pl-1 text-accent`}
              readOnly
              tabIndex={-1}
              value={result?.formattedEstimatedCredit ?? ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        {result ? (
          <dl className="grid gap-2 text-[13px] text-foreground/90 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-white px-3 py-2">
              <dt className="text-xs text-muted-foreground">Eligible children</dt>
              <dd className="mt-0.5 font-semibold tabular-nums text-accent">
                {result.eligibleChildren}
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-white px-3 py-2">
              <dt className="text-xs text-muted-foreground">
                Income-related credit reduction
              </dt>
              <dd className="mt-0.5 font-semibold tabular-nums text-accent">
                ${result.formattedPhaseoutReduction}
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-white px-3 py-2 sm:col-span-2">
              <dt className="text-xs text-muted-foreground">
                Refundable Additional Child Tax Credit
              </dt>
              <dd className="mt-0.5 text-sm text-muted-foreground">
                {result.refundableNote}
              </dd>
            </div>
          </dl>
        ) : null}

        {result ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.assumptionsNote}
          </p>
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
