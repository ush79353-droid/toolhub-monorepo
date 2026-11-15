'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  WeekOverWeekFieldErrors,
  WeekOverWeekInput,
  WeekOverWeekResult,
} from './types';

interface WeekOverWeekFormProps {
  input: WeekOverWeekInput;
  errors: WeekOverWeekFieldErrors;
  result: WeekOverWeekResult | null;
  onChange: (input: WeekOverWeekInput) => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor: string;
  label: string;
  tip: string;
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
        {label}
      </label>
      <InfoTooltip label={label} text={tip} align="left" />
    </div>
  );
}

export function WeekOverWeekForm({
  input,
  errors,
  result,
  onChange,
}: WeekOverWeekFormProps) {
  const set = (patch: Partial<WeekOverWeekInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-3"
      noValidate
      autoComplete="off"
    >
      <details
        open
        className="rounded-xl border border-border bg-muted/15"
      >
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4">
          Week over week growth
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          <div>
            <FieldLabel
              htmlFor="wow-initial"
              label="Value in initial week"
              tip="Starting metric for the first week. Must be nonzero so % change is defined."
            />
            <input
              id="wow-initial"
              className={inputClass}
              inputMode="decimal"
              value={input.initialWeek}
              aria-invalid={Boolean(errors.initialWeek)}
              onChange={(e) => set({ initialWeek: e.target.value })}
            />
            {errors.initialWeek ? (
              <p className="mt-1 text-xs text-rose-600">{errors.initialWeek}</p>
            ) : null}
          </div>

          <div>
            <FieldLabel
              htmlFor="wow-following"
              label="Value in following week"
              tip="Metric for the next week. Zero is allowed; negatives are allowed."
            />
            <input
              id="wow-following"
              className={inputClass}
              inputMode="decimal"
              value={input.followingWeek}
              aria-invalid={Boolean(errors.followingWeek)}
              onChange={(e) => set({ followingWeek: e.target.value })}
            />
            {errors.followingWeek ? (
              <p className="mt-1 text-xs text-rose-600">{errors.followingWeek}</p>
            ) : null}
          </div>

          <div>
            <FieldLabel
              htmlFor="wow-change"
              label="Week over week % change"
              tip="((Following − Initial) ÷ Initial) × 100. Positive, zero, and negative results are shown."
            />
            <div className="relative">
              <input
                id="wow-change"
                type="text"
                readOnly
                className={`${inputClass} bg-muted/20 pr-10 font-semibold text-accent`}
                value={result ? result.formattedWowGrowth : ''}
                aria-live="polite"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                %
              </span>
            </div>
          </div>
        </div>
      </details>

      {/* Expanded Weekly CAGR fields require a verified expanded screenshot (ADR-023). */}
      <details className="rounded-xl border border-border bg-muted/15">
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4">
          Weekly CAGR (compounded growth)
        </summary>
        <div className="border-t border-border px-3.5 py-3 text-xs text-muted-foreground sm:px-4">
          Expanded Weekly CAGR inputs are not available from the reference screenshot.
        </div>
      </details>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
