'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { HEROES_ACT_BILL_URL } from './content';
import type {
  FilingStatus,
  StimulusCheck40kFieldErrors,
  StimulusCheck40kInput,
  StimulusCheck40kResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

const FILING_OPTIONS: readonly { value: FilingStatus; label: string }[] = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'head-of-household', label: 'Head of household' },
];

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

interface StimulusCheck40kFormProps {
  input: StimulusCheck40kInput;
  errors: StimulusCheck40kFieldErrors;
  result: StimulusCheck40kResult | null;
  onChange: (input: StimulusCheck40kInput) => void;
}

export function StimulusCheck40kForm({
  input,
  errors,
  result,
  onChange,
}: StimulusCheck40kFormProps) {
  const set = (patch: Partial<StimulusCheck40kInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-3.5 text-[13px] leading-relaxed text-foreground/90 sm:text-sm">
        <p>
          This calculator is based on the HEROES Act, which is a proposed second round of
          stimulus checks.
        </p>
        <p className="mt-2.5">
          On July 6, Senate Majority Leader Mitch McConnell stated that the new stimulus check
          will most likely only go to the low-income group, with a yearly income of{' '}
          <strong className="font-semibold text-accent">$40,000</strong> as the cut-off point.
        </p>
        <p className="mt-2.5 font-medium text-amber-950/90">
          Historical / hypothetical only — this proposal was not enacted as a $40k program, and
          you cannot claim these payments today.
        </p>
      </div>

      <div>
        <div className={labelClass}>
          <span>Filing status</span>
          <InfoTooltip
            label="Filing status"
            text="Use the status that matched your federal return. Married uses a doubled $80,000 AGI cap; single and head of household use $40,000."
          />
        </div>
        <div
          className="flex flex-col gap-2.5"
          role="radiogroup"
          aria-label="Filing status"
        >
          {FILING_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="sc40k-filing-status"
                className="h-4 w-4 accent-primary"
                checked={input.filingStatus === opt.value}
                onChange={() => set({ filingStatus: opt.value })}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="sc40k-dependents">
          <span>How many dependents?</span>
          <InfoTooltip
            label="How many dependents?"
            text="HEROES Act structure counted up to three dependents at $1,200 each. Extra dependents beyond three do not increase this estimate."
          />
        </label>
        <FieldShell error={errors.dependents}>
          <input
            id="sc40k-dependents"
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
        <label className={labelClass} htmlFor="sc40k-income">
          <span>Your income (AGI)</span>
          <InfoTooltip
            label="Your income (AGI)"
            text="Adjusted gross income in USD. Amounts are denomination-only dollars — this tool does not convert currencies."
          />
        </label>
        <FieldShell error={errors.incomeAgi}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            $
          </span>
          <input
            id="sc40k-income"
            className={inputClass}
            inputMode="decimal"
            value={input.incomeAgi}
            aria-invalid={Boolean(errors.incomeAgi)}
            onChange={(e) => set({ incomeAgi: e.target.value })}
          />
        </FieldShell>
        {errors.incomeAgi ? (
          <p className="mt-1 text-xs text-rose-600">{errors.incomeAgi}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="sc40k-result">
          <span>You could receive</span>
          <InfoTooltip
            label="You could receive"
            text="Read-only estimate under the historical HEROES payment amounts with the documented $40k / $80k hard income cut-off."
          />
        </label>
        <FieldShell muted>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            $
          </span>
          <input
            id="sc40k-result"
            className={inputClass}
            readOnly
            tabIndex={0}
            value={result ? result.formattedPayment : ''}
            aria-live="polite"
          />
        </FieldShell>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <p className="text-[13px] leading-relaxed text-muted-foreground">
        <span aria-hidden="true">💡 </span>
        Check how much you would be eligible for under the{' '}
        <a
          href={HEROES_ACT_BILL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
        >
          original HEROES Act proposal
        </a>
        .
      </p>
    </form>
  );
}
