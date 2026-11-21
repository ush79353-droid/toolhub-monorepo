'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  BidensTaxPlanFieldErrors,
  BidensTaxPlanInput,
  BidensTaxPlanResult,
  FilingStatus,
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

interface BidensTaxPlanFormProps {
  input: BidensTaxPlanInput;
  errors: BidensTaxPlanFieldErrors;
  result: BidensTaxPlanResult | null;
  onChange: (input: BidensTaxPlanInput) => void;
}

export function BidensTaxPlanForm({
  input,
  errors,
  result,
  onChange,
}: BidensTaxPlanFormProps) {
  const set = (patch: Partial<BidensTaxPlanInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-accent sm:text-sm">
        <p className="font-semibold text-amber-950">
          Historical Biden Tax Plan Comparison — not current-year filing advice
        </p>
        <p className="mt-1.5 text-foreground/85">
          President Biden proposed a tax plan to help fund the American Families Plan. This
          calculator compares a simplified tax-year 2022 baseline estimate with the May 2021 AFP
          ordinary-rate and Child Tax Credit proposals. A proposal is not automatically enacted
          law.
        </p>
      </div>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Tax Information</legend>

        <div>
          <label className={labelClass} htmlFor="biden-age">
            <span>Your age</span>
            <InfoTooltip
              label="Your age"
              text="Optional. If age is 65 or older, the tax-year 2022 additional aged standard deduction is applied (IRS Rev. Proc. 2021-45). Age does not change Child Tax Credit eligibility here."
            />
          </label>
          <FieldShell error={errors.age}>
            <input
              id="biden-age"
              className={inputClass}
              inputMode="numeric"
              value={input.age}
              aria-invalid={Boolean(errors.age)}
              onChange={(e) => set({ age: e.target.value })}
            />
          </FieldShell>
          {errors.age ? <p className="mt-1 text-xs text-rose-600">{errors.age}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="biden-agi">
            <span>Annual income (AGI)</span>
            <InfoTooltip
              label="Annual income (AGI)"
              text="Adjusted gross income in fixed USD. Taxable income = AGI − applicable standard deduction (itemized deductions are not modeled)."
            />
          </label>
          <FieldShell error={errors.agi}>
            <span className="shrink-0 pl-3 font-mono text-sm text-muted-foreground" aria-hidden>
              $
            </span>
            <input
              id="biden-agi"
              className={`${inputClass} pl-1`}
              inputMode="decimal"
              value={input.agi}
              aria-invalid={Boolean(errors.agi)}
              onChange={(e) => set({ agi: e.target.value })}
            />
          </FieldShell>
          {errors.agi ? <p className="mt-1 text-xs text-rose-600">{errors.agi}</p> : null}
        </div>

        <div>
          <div className={labelClass}>
            <span>Filing status</span>
            <InfoTooltip
              label="Filing status"
              text="Single (default), Married (modeled as married filing jointly), or Head of household. Bracket thresholds and credit phaseouts follow that status."
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
                  name="biden-filing-status"
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
          <label className={labelClass} htmlFor="biden-under6">
            <span>Children below 6 years of age</span>
            <InfoTooltip
              label="Children below 6 years of age"
              text="Count qualifying children under age 6 at year-end. Baseline CTC $2,000; AFP proposal $3,600 (ARP amounts the AFP would extend)."
            />
          </label>
          <FieldShell error={errors.childrenUnder6}>
            <input
              id="biden-under6"
              className={inputClass}
              inputMode="numeric"
              value={input.childrenUnder6}
              aria-invalid={Boolean(errors.childrenUnder6)}
              onChange={(e) => set({ childrenUnder6: e.target.value })}
            />
          </FieldShell>
          {errors.childrenUnder6 ? (
            <p className="mt-1 text-xs text-rose-600">{errors.childrenUnder6}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="biden-6to17">
            <span>Children between 6 and 17</span>
            <InfoTooltip
              label="Children between 6 and 17"
              text="AFP/ARP treated ages 6–17 as CTC-eligible ($3,000). Baseline TCJA used under age 17 ($2,000). This estimate applies the TCJA $2,000 floor to the full 6–17 count; true age-17-only differences within the band are not separately modeled."
            />
          </label>
          <FieldShell error={errors.children6to17}>
            <input
              id="biden-6to17"
              className={inputClass}
              inputMode="numeric"
              value={input.children6to17}
              aria-invalid={Boolean(errors.children6to17)}
              onChange={(e) => set({ children6to17: e.target.value })}
            />
          </FieldShell>
          {errors.children6to17 ? (
            <p className="mt-1 text-xs text-rose-600">{errors.children6to17}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="biden-dependents">
            <span>Number of dependents</span>
            <InfoTooltip
              label="Number of dependents"
              text="Additional dependents eligible for the $500 Credit for Other Dependents only. Do not re-enter children already counted in the age buckets above — that would double-count."
            />
          </label>
          <FieldShell error={errors.dependents}>
            <input
              id="biden-dependents"
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
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Income tax</legend>

        <div>
          <label className={labelClass} htmlFor="biden-baseline-tax">
            <span>Your income tax under the current tax plan</span>
            <InfoTooltip
              label="Your income tax under the current tax plan"
              text="Simplified TY2022 TCJA estimate: progressive ordinary tax on AGI minus standard deduction, reduced by nonrefundable CTC/ODC. Not today’s 2026 law."
            />
          </label>
          <FieldShell muted>
            <span className="shrink-0 pl-3 font-mono text-sm text-muted-foreground" aria-hidden>
              $
            </span>
            <input
              id="biden-baseline-tax"
              className={`${inputClass} pl-1 text-muted-foreground`}
              readOnly
              tabIndex={-1}
              value={result ? result.formattedBaselineTax : ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="biden-plan-tax">
            <span>Your income tax paid under Biden&apos;s tax plan</span>
            <InfoTooltip
              label="Your income tax paid under Biden's tax plan"
              text="AFP estimate with 39.6% top rate thresholds and ARP-style CTC. Negative values mean refundable CTC exceeds liability (historical refund illustration)."
            />
          </label>
          <FieldShell muted>
            <span className="shrink-0 pl-3 font-mono text-sm text-muted-foreground" aria-hidden>
              $
            </span>
            <input
              id="biden-plan-tax"
              className={`${inputClass} pl-1 text-muted-foreground`}
              readOnly
              tabIndex={-1}
              value={result ? result.formattedBidenTax : ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Effective tax rate
        </legend>

        <div>
          <label className={labelClass} htmlFor="biden-baseline-rate">
            <span>Effective tax rate under the current tax plan</span>
            <InfoTooltip
              label="Effective tax rate under the current tax plan"
              text="Estimated baseline federal income tax ÷ annual AGI × 100. Not the marginal bracket rate. Shows an em dash when AGI is $0."
            />
          </label>
          <FieldShell muted>
            <input
              id="biden-baseline-rate"
              className={`${inputClass} text-muted-foreground`}
              readOnly
              tabIndex={-1}
              value={result ? result.formattedBaselineRate : ''}
              aria-live="polite"
            />
            <span className="shrink-0 pr-3 font-mono text-sm text-muted-foreground" aria-hidden>
              %
            </span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="biden-plan-rate">
            <span>Effective tax rate under Biden&apos;s tax plan</span>
            <InfoTooltip
              label="Effective tax rate under Biden's tax plan"
              text="Estimated AFP federal income tax ÷ annual AGI × 100. May be negative when refundable credits exceed tax. Shows an em dash when AGI is $0."
            />
          </label>
          <FieldShell muted>
            <input
              id="biden-plan-rate"
              className={`${inputClass} text-muted-foreground`}
              readOnly
              tabIndex={-1}
              value={result ? result.formattedBidenRate : ''}
              aria-live="polite"
            />
            <span className="shrink-0 pr-3 font-mono text-sm text-muted-foreground" aria-hidden>
              %
            </span>
          </FieldShell>
        </div>
      </fieldset>

      {result ? (
        <p className="text-xs text-muted-foreground">
          Simplified historical estimate only. Excludes capital gains, NIIT, QBI, AMT, EITC,
          itemized deductions, and state taxes. Baseline does not model the refundable ACTC
          without earned income.
        </p>
      ) : null}

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
