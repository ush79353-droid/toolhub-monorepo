'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AmericanRescuePlanStimulusFieldErrors,
  AmericanRescuePlanStimulusInput,
  AmericanRescuePlanStimulusResult,
  FilingStatus,
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

interface AmericanRescuePlanStimulusFormProps {
  input: AmericanRescuePlanStimulusInput;
  errors: AmericanRescuePlanStimulusFieldErrors;
  result: AmericanRescuePlanStimulusResult | null;
  onChange: (input: AmericanRescuePlanStimulusInput) => void;
}

export function AmericanRescuePlanStimulusForm({
  input,
  errors,
  result,
  onChange,
}: AmericanRescuePlanStimulusFormProps) {
  const set = (patch: Partial<AmericanRescuePlanStimulusInput>) =>
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
 Historical estimate only; not a current benefit
        </p>
        <p className="mt-1.5 text-foreground/85">
          This calculator estimates the payment you are likely to have received according to the
          American Rescue Plan, which was passed into law on March 11, 2021. Those third Economic
 Impact Payments (EIP3) were issued in 2021. Estimates here are historical only; you
          cannot claim a new EIP3 payment today.
        </p>
        <p className="mt-2 text-foreground/85">
          To qualify for a relief check, you must be a U.S. resident with a social security number.
          However, certain people who didn&apos;t file taxes recently may still have received a
          payment. The 2019/2020 AGI field represents historical tax-return information used for
          advance payments, not a current eligibility determination.
        </p>
      </div>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Historical EIP3 inputs
        </legend>

        <div>
          <div className={labelClass}>
            <span>Have you filed 2019 or 2020 taxes?</span>
            <InfoTooltip
              label="Have you filed 2019 or 2020 taxes?"
              text="Most EIP3 advances used 2020 return data when available, otherwise 2019. SSI, SSDI, RRB, and certain VA beneficiaries could receive automatic payments without filing; those paths are not modeled when you select No."
            />
          </div>
          <div
            className="flex flex-wrap gap-4"
            role="radiogroup"
            aria-label="Have you filed 2019 or 2020 taxes?"
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
                  name="eip3-filed-taxes"
                  className="h-4 w-4 accent-primary"
                  checked={input.filed2019Or2020Taxes === opt.value}
                  onChange={() => set({ filed2019Or2020Taxes: opt.value as YesNo })}
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
              text="Single and head of household used a $1,400 base; married filing jointly used $2,800. Phase-out ranges differ by status under I.R.C. §6428B."
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
                  name="eip3-filing-status"
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
          <label className={labelClass} htmlFor="eip3-dependents">
            <span>How many dependents?</span>
            <InfoTooltip
              label="How many dependents?"
              text="Enter qualifying dependents under IRC §152. Unlike EIP1/EIP2, EIP3 added $1,400 for each qualifying dependent, including qualifying adult dependents."
            />
          </label>
          <FieldShell error={errors.dependents}>
            <input
              id="eip3-dependents"
              className={inputClass}
              inputMode="numeric"
              value={input.dependents}
              aria-invalid={Boolean(errors.dependents)}
              onChange={(e) => set({ dependents: e.target.value })}
            />
          </FieldShell>
          {errors.dependents ? (
            <p className="mt-1 text-xs text-rose-600">{errors.dependents}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="eip3-agi">
            <span>Income in 2019 or 2020 (AGI)</span>
            <InfoTooltip
              label="Income in 2019 or 2020 (AGI)"
              text="Adjusted gross income from the 2019 or 2020 tax return (USD) used historically for the advance. Full payment at or below the status threshold; linear reduction to zero by the upper threshold."
            />
          </label>
          <FieldShell error={errors.agi}>
            <span className="shrink-0 pl-3 font-mono text-sm text-muted-foreground" aria-hidden>
              $
            </span>
            <input
              id="eip3-agi"
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
          <label className={labelClass} htmlFor="eip3-receive">
            <span>According to the bill, you could receive</span>
            <InfoTooltip
              label="According to the bill, you could receive"
              text="Historical EIP3 estimate in USD based on filing status, qualifying dependents, and 2019/2020 AGI. Not a promise of payment and not a current IRS program."
            />
          </label>
          <FieldShell muted>
            <span className="shrink-0 pl-3 font-mono text-sm text-muted-foreground" aria-hidden>
              $
            </span>
            <input
              id="eip3-receive"
              className={`${inputClass} pl-1 text-muted-foreground`}
              readOnly
              tabIndex={-1}
              value={result ? result.formattedPayment : ''}
              aria-live="polite"
            />
          </FieldShell>
          {result?.ineligibleNoFiling ? (
            <p className="mt-1.5 text-xs text-amber-800">
              This estimate shows $0 because “No” was selected for 2019/2020 filing. Historically,
 SSI, SSDI, RRB, and certain VA beneficiaries could still receive EIP3 automatically; 
              those paths are not modeled here.
            </p>
          ) : result ? (
            <p className="mt-1.5 text-xs text-muted-foreground">
 Historical EIP3 estimate only; not a currently available government payment.
            </p>
          ) : null}
        </div>
      </fieldset>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
