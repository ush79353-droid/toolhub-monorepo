'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  ClomidOvulationFieldErrors,
  ClomidOvulationInput,
  ClomidOvulationResult,
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
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

interface Props {
  input: ClomidOvulationInput;
  errors: ClomidOvulationFieldErrors;
  result: ClomidOvulationResult | null;
  onChange: (input: ClomidOvulationInput) => void;
  onLoadExample: () => void;
}

export function ClomidOvulationForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational calendar worksheet for a prescribed clomiphene course. Uses
        an approximate 5–10 day ovulation window after the last treatment day
        (DailyMed). Does not confirm ovulation or set dose.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (2026-01-01 · 5 days → window 01/10/2026 – 01/15/2026)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="clomid-start">
          <span>Treatment start</span>
          <InfoTooltip
            label="Treatment start"
            text="First day of the prescribed clomiphene course (as written by the clinician). Defaults to today; change it to match the prescription."
          />
        </label>
        <FieldShell error={errors.treatmentStart}>
          <input
            id="clomid-start"
            type="date"
            className={inputClass}
            value={input.treatmentStart}
            aria-invalid={Boolean(errors.treatmentStart)}
            onChange={(e) =>
              onChange({ ...input, treatmentStart: e.target.value })
            }
          />
        </FieldShell>
        {errors.treatmentStart ? (
          <p className="mt-1 text-xs text-rose-600">{errors.treatmentStart}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="clomid-duration">
          <span>Duration</span>
          <InfoTooltip
            label="Duration"
            text="Inclusive number of treatment days from the prescription (commonly 5). Leave blank until known — the ovulation field stays empty."
          />
        </label>
        <FieldShell error={errors.durationDays}>
          <input
            id="clomid-duration"
            className={inputClass}
            inputMode="numeric"
            placeholder=""
            aria-label="Treatment duration in days"
            value={input.durationDays}
            aria-invalid={Boolean(errors.durationDays)}
            onChange={(e) =>
              onChange({ ...input, durationDays: e.target.value })
            }
          />
          <span className="shrink-0 pr-3 text-sm text-muted-foreground">
            days
          </span>
        </FieldShell>
        {errors.durationDays ? (
          <p className="mt-1 text-xs text-rose-600">{errors.durationDays}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="clomid-ovulation-out">
          <span>Ovulation date</span>
          <InfoTooltip
            label="Ovulation date"
            text="Approximate window 5–10 days after the last treatment day — not a single confirmed ovulation date."
          />
        </label>
        <FieldShell muted>
          <output
            id="clomid-ovulation-out"
            className="w-full px-3 text-sm tabular-nums font-medium text-accent"
            aria-live="polite"
          >
            {result ? result.formattedOvulationField : ''}
          </output>
        </FieldShell>
        {!result ? (
          <p className="mt-1 text-xs text-muted-foreground">MM/DD/YYYY</p>
        ) : (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        )}
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {result?.disclaimer ??
            'Educational timing only — not ovulation confirmation.'}
        </p>
      </div>
    </form>
  );
}
