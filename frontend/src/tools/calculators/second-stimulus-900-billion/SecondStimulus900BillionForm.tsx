'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  FilingStatus,
  SecondStimulus900BillionFieldErrors,
  SecondStimulus900BillionInput,
  SecondStimulus900BillionResult,
  YesNo,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

interface SecondStimulus900BillionFormProps {
  input: SecondStimulus900BillionInput;
  errors: SecondStimulus900BillionFieldErrors;
  result: SecondStimulus900BillionResult | null;
  onChange: (input: SecondStimulus900BillionInput) => void;
}

export function SecondStimulus900BillionForm({
  input,
  errors,
  result,
  onChange,
}: SecondStimulus900BillionFormProps) {
  const set = (patch: Partial<SecondStimulus900BillionInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-accent sm:text-sm">
        <p className="font-semibold text-amber-950">
          Historical estimate only — not a current benefit
        </p>
        <p className="mt-1.5 text-foreground/85">
          This calculator reconstructs the second Economic Impact Payment (EIP2) from the
          December 2020 $900 billion COVID relief package in the Consolidated Appropriations Act,
          2021. Those payments were issued in late 2020 / early 2021. Estimates here are historical
          only — you cannot claim a new EIP2 payment today.
        </p>
        <p className="mt-2 text-foreground/85">
          To qualify for a payout, you have to be a U.S. resident with a social security number.
          You don&apos;t need to have paid any taxes recently, but you must have at least filed your
          paperwork or fall under one of the special eligibility categories (see the text), such as
          receiving SSI.
        </p>
      </div>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Historical EIP2 inputs
        </legend>

        <div>
          <div className={labelClass}>
            <span>Have you filed 2019 taxes?</span>
            <InfoTooltip
              label="Have you filed 2019 taxes?"
              text="Most EIP2 advances used 2019 return data. SSI, SSDI, RRB, and certain VA beneficiaries could receive automatic payments without a 2019 return — those paths are not modeled when you select No."
            />
          </div>
          <div
            className="flex flex-wrap gap-4"
            role="radiogroup"
            aria-label="Have you filed 2019 taxes?"
          >
            {(
              [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="eip2-filed-2019"
                  className="h-4 w-4 accent-primary"
                  checked={input.filed2019Taxes === opt.value}
                  onChange={() => set({ filed2019Taxes: opt.value as YesNo })}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className={labelClass}>
            <span>Filing status</span>
            <InfoTooltip
              label="Filing status"
              text="Single and head of household used a $600 base payment; married filing jointly used $1,200. Phase-out thresholds differ by status."
            />
          </div>
          <div
            className="flex flex-col gap-2.5"
            role="radiogroup"
            aria-label="Filing status"
          >
            {(
              [
                { value: 'single', label: 'Single' },
                { value: 'married', label: 'Married' },
                { value: 'head_of_household', label: 'Head of household' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="eip2-filing-status"
                  className="h-4 w-4 accent-primary"
                  checked={input.filingStatus === opt.value}
                  onChange={() => set({ filingStatus: opt.value as FilingStatus })}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="eip2-kids">
            <span>How many kids?</span>
            <InfoTooltip
              label="How many kids?"
              text="Enter qualifying children under age 17 (IRC §24(c) child tax credit definition). EIP2 added $600 per such child. Adult dependents did not receive an EIP2 add-on."
            />
          </label>
          <FieldShell error={errors.kids}>
            <input
              id="eip2-kids"
              className={inputClass}
              inputMode="numeric"
              value={input.kids}
              aria-invalid={Boolean(errors.kids)}
              onChange={(e) => set({ kids: e.target.value })}
            />
          </FieldShell>
          {errors.kids ? <p className="mt-1 text-xs text-rose-600">{errors.kids}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="eip2-agi">
            <span>Income in 2019 (AGI)</span>
            <InfoTooltip
              label="Income in 2019 (AGI)"
              text="Adjusted gross income from the 2019 tax return (USD). Full payment below the status threshold; reduced by 5% of income above the threshold."
            />
          </label>
          <FieldShell error={errors.agi}>
            <span className="shrink-0 pl-3 font-mono text-sm text-muted-foreground" aria-hidden>
              $
            </span>
            <input
              id="eip2-agi"
              className={`${inputClass} pl-1`}
              inputMode="decimal"
              placeholder=""
              value={input.agi}
              aria-invalid={Boolean(errors.agi)}
              onChange={(e) => set({ agi: e.target.value })}
            />
          </FieldShell>
          {errors.agi ? <p className="mt-1 text-xs text-rose-600">{errors.agi}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="eip2-receive">
            <span>You will receive</span>
            <InfoTooltip
              label="You will receive"
              text="Historical EIP2 estimate in USD based on 2019 filing status, kids under 17, and AGI. Not a promise of payment and not a current IRS program."
            />
          </label>
          <FieldShell muted>
            <span className="shrink-0 pl-3 font-mono text-sm text-muted-foreground" aria-hidden>
              $
            </span>
            <input
              id="eip2-receive"
              className={`${inputClass} pl-1 text-muted-foreground`}
              readOnly
              tabIndex={-1}
              value={result ? result.formattedPayment : ''}
              aria-live="polite"
            />
          </FieldShell>
          {result?.ineligibleNoFiling ? (
            <p className="mt-1.5 text-xs text-amber-800">
              This estimate shows $0 because “No” was selected for 2019 filing. Historically, SSI,
              SSDI, RRB, and certain VA beneficiaries could still receive EIP2 automatically — those
              paths are not modeled here.
            </p>
          ) : result ? (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Historical EIP2 estimate only — not a currently available benefit.
            </p>
          ) : null}
        </div>
      </fieldset>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
