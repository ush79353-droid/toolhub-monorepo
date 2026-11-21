'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CashActStimulusFieldErrors,
  CashActStimulusInput,
  CashActStimulusResult,
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

interface CashActStimulusFormProps {
  input: CashActStimulusInput;
  errors: CashActStimulusFieldErrors;
  result: CashActStimulusResult | null;
  onChange: (input: CashActStimulusInput) => void;
}

export function CashActStimulusForm({
  input,
  errors,
  result,
  onChange,
}: CashActStimulusFormProps) {
  const set = (patch: Partial<CashActStimulusInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-accent sm:text-sm">
        <p className="font-semibold text-amber-950">
 Historical proposal only; not a current benefit
        </p>
        <p className="mt-1.5 text-foreground/85">
          This calculator reconstructs the House-passed December 2020{' '}
          <strong>CASH Act</strong> (Caring for Americans with Supplemental Help Act / H.R.9051),
          which would have raised the second-round Economic Impact Payment from $600 to $2,000 per
          eligible adult and dependent. The Senate did not enact that amendment. Estimates below
 are historical and hypothetical; you cannot claim these proposed amounts today.
        </p>
        <p className="mt-2 text-foreground/85">
          To qualify for a payout under the proposal, you had to be a U.S. resident with a Social
          Security number. You did not need to have paid any taxes recently, but you must have at
          least filed your paperwork or fall under a special eligibility category (such as
          receiving SSI).
        </p>
      </div>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Proposed CASH Act inputs
        </legend>

        <div>
          <div className={labelClass}>
            <span>Have you filed 2019 taxes?</span>
            <InfoTooltip
              label="Have you filed 2019 taxes?"
              text="Under the proposal, eligibility generally required filing 2019 tax paperwork, even if no tax was owed. Social Security, SSI, RRB, or VA benefit recipients could also qualify without a return; those paths are not modeled here."
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
                  name="cash-filed-2019"
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
              text="Single and head of household used a $2,000 base rebate; married filing jointly used $4,000. Phase-out thresholds differ by status ($75,000 / $112,500 / $150,000)."
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
                  name="cash-filing-status"
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
          <label className={labelClass} htmlFor="cash-dependents">
            <span>How many dependents?</span>
            <InfoTooltip
              label="How many dependents?"
              text="The CASH Act proposed $2,000 per dependent of any age (IRC §152), expanding beyond the enacted under-17 qualifying-child limit. Enter whole numbers only."
            />
          </label>
          <FieldShell error={errors.dependents}>
            <input
              id="cash-dependents"
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
          <label className={labelClass} htmlFor="cash-agi">
            <span>Income in 2019 (AGI)</span>
            <InfoTooltip
              label="Income in 2019 (AGI)"
              text="Adjusted gross income from the 2019 tax return (USD). Full payment below the status threshold; reduced by 5% of income above the threshold."
            />
          </label>
          <FieldShell error={errors.agi}>
            <input
              id="cash-agi"
              className={inputClass}
              inputMode="decimal"
              placeholder=""
              value={input.agi}
              aria-invalid={Boolean(errors.agi)}
              onChange={(e) => set({ agi: e.target.value })}
            />
            <span className="shrink-0 pr-3 font-mono text-sm text-muted-foreground" aria-hidden>
              $
            </span>
          </FieldShell>
          {errors.agi ? (
            <p className="mt-1 text-xs text-rose-600">{errors.agi}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cash-receive">
            <span>You will receive</span>
            <InfoTooltip
              label="You will receive"
              text="Hypothetical CASH Act total rebate in USD (proposed $2,000 / $4,000 base plus $2,000 per dependent, after AGI phase-out). Not a promise of payment."
            />
          </label>
          <FieldShell muted>
            <input
              id="cash-receive"
              className={`${inputClass} text-muted-foreground`}
              readOnly
              tabIndex={-1}
              value={result ? result.formattedPayment : ''}
              aria-live="polite"
            />
            <span className="shrink-0 pr-3 font-mono text-sm text-muted-foreground" aria-hidden>
              $
            </span>
          </FieldShell>
          {result?.ineligibleNoFiling ? (
            <p className="mt-1.5 text-xs text-amber-800">
              Under the proposal, filing tax paperwork (or qualifying via certain federal benefits)
              was required. This estimate shows $0 because “No” was selected for 2019 filing.
            </p>
          ) : result ? (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Historical / hypothetical CASH Act total estimate only.
            </p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          How much more will you get?
        </legend>
        <p className="text-[12px] leading-relaxed text-muted-foreground sm:text-[13px]">
          Compare the proposed CASH Act total with the enacted December 2020 $600 Economic Impact
          Payment (which paid $600 per qualifying child under 17 only).
        </p>

        <div>
          <label className={labelClass} htmlFor="cash-under-17">
            <span>How many dependents under 17?</span>
            <InfoTooltip
              label="How many dependents under 17?"
              text="Enter qualifying children under 17 counted by the enacted $600 second EIP. Cannot exceed total dependents. Leave blank to hide the additional-amount comparison."
            />
          </label>
          <FieldShell error={errors.dependentsUnder17}>
            <input
              id="cash-under-17"
              className={inputClass}
              inputMode="numeric"
              value={input.dependentsUnder17}
              aria-invalid={Boolean(errors.dependentsUnder17)}
              onChange={(e) => set({ dependentsUnder17: e.target.value })}
            />
          </FieldShell>
          {errors.dependentsUnder17 ? (
            <p className="mt-1 text-xs text-rose-600">{errors.dependentsUnder17}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cash-additional">
            <span>You would receive</span>
            <InfoTooltip
              label="You would receive"
              text="Additional USD the CASH Act would have paid beyond the enacted $600 EIP (CASH total − enacted total, floored at $0). Historical / hypothetical only."
            />
          </label>
          <FieldShell muted>
            <input
              id="cash-additional"
              className={`${inputClass} text-muted-foreground`}
              readOnly
              tabIndex={-1}
              value={
                result?.hasAdditionalComparison ? result.formattedAdditional : ''
              }
              aria-live="polite"
            />
            <span className="shrink-0 pr-3 font-mono text-sm text-muted-foreground" aria-hidden>
              $
            </span>
          </FieldShell>
          {result?.hasAdditionalComparison ? (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Extra vs enacted $600 EIP (enacted estimate ${result.formattedEnactedPayment}).
              Historical / hypothetical only.
            </p>
          ) : null}
        </div>
      </fieldset>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
