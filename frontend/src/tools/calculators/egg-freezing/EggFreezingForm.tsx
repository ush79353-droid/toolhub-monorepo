'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  EggFreezingFieldErrors,
  EggFreezingInput,
  EggFreezingResult,
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
        muted ? 'border-sky-200 bg-sky-50/60' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

interface Props {
  input: EggFreezingInput;
  errors: EggFreezingFieldErrors;
  result: EggFreezingResult | null;
  onChange: (input: EggFreezingInput) => void;
  onLoadExample: () => void;
}

export function EggFreezingForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<EggFreezingInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Enter age at freezing and the number of frozen mature eggs to see a
        Goldman 2017 modeled chance of at least one live birth.
      </p>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational counseling estimate for ages 25–44. It does not guarantee a
        birth or recommend a target egg count. Entries stay in your browser
        only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (age 35 · 10 mature eggs → ≈ 69%)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="egg-freeze-age">
          <span>Age</span>
          <InfoTooltip
            label="Age"
            text="Age in whole years at oocyte freezing / retrieval used by the Goldman 2017 model (ages ≤35 share one blastocyst regression group)."
          />
        </label>
        <FieldShell error={errors.ageYears}>
          <input
            id="egg-freeze-age"
            className={inputClass}
            inputMode="numeric"
            aria-label="Age at freezing in years"
            value={input.ageYears}
            aria-invalid={Boolean(errors.ageYears)}
            onChange={(e) => set({ ageYears: e.target.value })}
          />
          <span className="shrink-0 pr-3 text-xs text-muted-foreground">
            years
          </span>
        </FieldShell>
        {errors.ageYears ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ageYears}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="egg-freeze-count">
          <span>Number of frozen mature eggs</span>
          <InfoTooltip
            label="Number of frozen mature eggs"
            text="Count of mature (metaphase II) oocytes frozen — not total eggs retrieved. Used as n in P = 1 − (1 − p)^n."
          />
        </label>
        <FieldShell error={errors.matureEggs}>
          <input
            id="egg-freeze-count"
            className={inputClass}
            inputMode="numeric"
            aria-label="Number of frozen mature eggs"
            value={input.matureEggs}
            aria-invalid={Boolean(errors.matureEggs)}
            onChange={(e) => set({ matureEggs: e.target.value })}
          />
        </FieldShell>
        {errors.matureEggs ? (
          <p className="mt-1 text-xs text-rose-600">{errors.matureEggs}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="egg-freeze-result">
          <span>Chance of at least one live birth</span>
          <InfoTooltip
            label="Chance of at least one live birth"
            text="Goldman et al. 2017 Equation 2 modeled probability. Blank until age and mature-egg count are valid. Not a guarantee."
          />
        </label>
        <FieldShell muted>
          <output
            id="egg-freeze-result"
            className="w-full px-3 text-sm tabular-nums font-semibold text-accent"
            aria-live="polite"
          >
            {result ? `${result.percentDisplay}%` : ''}
          </output>
        </FieldShell>
        {result ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result?.disclaimer ??
          'Educational estimate only — not medical advice and not a birth guarantee.'}
      </p>
    </form>
  );
}
