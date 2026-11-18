'use client';

import type { ReactNode } from 'react';
import { Lightbulb } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  HEROES_ADDITIONAL_PAYMENTS_URL,
  UNEMPLOYMENT_HEALS_VS_HEROES_URL,
} from './content';
import type {
  FilingStatus,
  HeroesStimulusFieldErrors,
  HeroesStimulusInput,
  HeroesStimulusResult,
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

interface HeroesStimulusFormProps {
  input: HeroesStimulusInput;
  errors: HeroesStimulusFieldErrors;
  result: HeroesStimulusResult | null;
  onChange: (input: HeroesStimulusInput) => void;
}

export function HeroesStimulusForm({
  input,
  errors,
  result,
  onChange,
}: HeroesStimulusFormProps) {
  const set = (patch: Partial<HeroesStimulusInput>) => onChange({ ...input, ...patch });

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
          This calculator is based on the HEROES Act, which is a proposed second round of
          stimulus checks. It was passed by The House of Representatives on May 16, 2020.
        </p>
        <p className="mt-2 text-foreground/85">
          On May 29, the Senate Majority Leader Mitch McConnell informed that the Senate needs
          &quot;about a month&quot; to reach the final decision. The bill was not enacted as
          proposed — estimates below are historical and hypothetical, and you cannot claim these
          payments today.
        </p>
      </div>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Proposed HEROES Act inputs
        </legend>

        <div>
          <div className={labelClass}>
            <span>Filing status</span>
            <InfoTooltip
              label="Filing status"
              text="Single and head of household used a $1,200 base rebate; married filing jointly used $2,400. Phase-out thresholds differ by status ($75,000 / $112,500 / $150,000)."
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
                  name="heroes-filing-status"
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
          <label className={labelClass} htmlFor="heroes-dependents">
            <span>How many dependents?</span>
            <InfoTooltip
              label="How many dependents?"
              text="The HEROES Act added $1,200 per dependent of any age under IRC §152, capped at three dependents. Extra dependents beyond three do not increase this estimate."
            />
          </label>
          <FieldShell error={errors.dependents}>
            <input
              id="heroes-dependents"
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
          <label className={labelClass} htmlFor="heroes-agi">
            <span>Your income (AGI)</span>
            <InfoTooltip
              label="Your income (AGI)"
              text="Adjusted gross income in USD. Full payment below the status threshold; reduced by 5% of income above the threshold. Fixed USD — no currency conversion."
            />
          </label>
          <FieldShell error={errors.agi}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              $
            </span>
            <input
              id="heroes-agi"
              className={inputClass}
              inputMode="decimal"
              placeholder=""
              value={input.agi}
              aria-invalid={Boolean(errors.agi)}
              onChange={(e) => set({ agi: e.target.value })}
            />
          </FieldShell>
          {errors.agi ? (
            <p className="mt-1 text-xs text-rose-600">{errors.agi}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="heroes-receive">
            <span>You could receive</span>
            <InfoTooltip
              label="You could receive"
              text="Hypothetical 2020 HEROES Act rebate estimate in USD. Not a promise of payment and not a current IRS program."
            />
          </label>
          <FieldShell muted>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              $
            </span>
            <input
              id="heroes-receive"
              className={`${inputClass} text-muted-foreground`}
              readOnly
              tabIndex={-1}
              value={result ? result.formattedPayment : ''}
              aria-live="polite"
            />
          </FieldShell>
          {result ? (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Historical / hypothetical HEROES Act estimate only
              {result.eligibleDependents < Number.parseInt(input.dependents, 10)
                ? ` · dependents counted: ${result.eligibleDependents} of ${input.dependents} (cap 3)`
                : ''}
              .
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
            Are you unemployed, a frontline worker, or a student? If this bill passes, you will be{' '}
            <a
              href={HEROES_ADDITIONAL_PAYMENTS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            >
              eligible for additional payments
            </a>
            !
          </span>
        </p>
        <p className="flex gap-2">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
          <span>
            Make sure to check the{' '}
            <a
              href={UNEMPLOYMENT_HEALS_VS_HEROES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            >
              differences in unemployment benefits
            </a>{' '}
            proposed by the Republicans (the HEALS Act) and the Democrats (the HEROES Act)!
          </span>
        </p>
      </div>
    </form>
  );
}
