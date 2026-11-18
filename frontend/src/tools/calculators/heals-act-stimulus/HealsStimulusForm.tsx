'use client';

import type { ReactNode } from 'react';
import { Lightbulb } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  FilingStatus,
  HealsStimulusFieldErrors,
  HealsStimulusInput,
  HealsStimulusResult,
  YesNo,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

const HEROES_ACT_STIMULUS_URL =
  'https://www.omnicalculator.com/finance/stimulus-heroes';
const UNEMPLOYMENT_HEALS_VS_HEROES_URL =
  'https://www.omnicalculator.com/finance/unemployment-benefit-heals';

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

interface HealsStimulusFormProps {
  input: HealsStimulusInput;
  errors: HealsStimulusFieldErrors;
  result: HealsStimulusResult | null;
  onChange: (input: HealsStimulusInput) => void;
}

export function HealsStimulusForm({
  input,
  errors,
  result,
  onChange,
}: HealsStimulusFormProps) {
  const set = (patch: Partial<HealsStimulusInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-accent sm:text-sm">
        <p className="font-semibold text-amber-950">
          Historical proposal only — not a current benefit
        </p>
        <p className="mt-1.5 text-foreground/85">
          This calculator is based on the GOP Coronavirus Bill, which is a second round of
          stimulus checks proposed by congressional Republicans on Monday, July 27th 2020. The
          HEALS Act was never enacted as proposed. Estimates below are historical and
          hypothetical — you cannot claim these proposed payments today.
        </p>
        <p className="mt-2 text-foreground/85">
          To qualify for a payout under the proposal, you had to be a U.S. resident with a Social
          Security number. You did not need to have paid any taxes recently, but you must have at
          least filed your paperwork.
        </p>
      </div>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Proposed HEALS Act inputs
        </legend>

        <div>
          <div className={labelClass}>
            <span>Have you filed 2019 taxes?</span>
            <InfoTooltip
              label="Have you filed 2019 taxes?"
              text="Under the proposal, eligibility generally required filing 2019 (or 2018) tax paperwork, even if no tax was owed. Social Security, SSI, RRB, or VA benefit recipients could also qualify without a return — those paths are not modeled here."
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
                  name="heals-filed-2019"
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
              text="Single and head of household used a $1,200 base rebate; married filing jointly used $2,400. Phase-out thresholds differ by status."
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
                  name="heals-filing-status"
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
          <label className={labelClass} htmlFor="heals-dependents">
            <span>How many dependents?</span>
            <InfoTooltip
              label="How many dependents?"
              text="The HEALS proposal added $500 per dependent of any age (no under-17 limit and no household dependent cap). Enter whole numbers only."
            />
          </label>
          <FieldShell error={errors.dependents}>
            <input
              id="heals-dependents"
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
          <label className={labelClass} htmlFor="heals-agi">
            <span>Income in 2019 (AGI)</span>
            <InfoTooltip
              label="Income in 2019 (AGI)"
              text="Adjusted gross income from the 2019 tax return (USD). Full payment below the status threshold; reduced by 5% of income above the threshold."
            />
          </label>
          <FieldShell error={errors.agi}>
            <input
              id="heals-agi"
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
          <label className={labelClass} htmlFor="heals-receive">
            <span>You will receive</span>
            <InfoTooltip
              label="You will receive"
              text="Hypothetical 2020 HEALS Act rebate estimate in USD. Not a promise of payment and not a current IRS program."
            />
          </label>
          <FieldShell muted>
            <input
              id="heals-receive"
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
              Historical / hypothetical HEALS Act estimate only.
            </p>
          ) : null}
        </div>
      </fieldset>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}

      <div className="space-y-2.5 text-[13px] leading-relaxed text-foreground/85 sm:text-sm">
        <p className="flex gap-2">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
          <span>
            Make sure to{' '}
            <a
              href={HEROES_ACT_STIMULUS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            >
              check how much you&apos;d get from the HEROES Act
            </a>{' '}
            as proposed by the Democrats!
          </span>
        </p>
        <p className="flex gap-2">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
          <span>
            If you&apos;re researching historical unemployment proposals, check the{' '}
            <a
              href={UNEMPLOYMENT_HEALS_VS_HEROES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            >
              differences in unemployment benefits
            </a>{' '}
            as proposed by the Republicans (the HEALS Act) and the Democrats (the HEROES Act)!
          </span>
        </p>
      </div>
    </form>
  );
}
