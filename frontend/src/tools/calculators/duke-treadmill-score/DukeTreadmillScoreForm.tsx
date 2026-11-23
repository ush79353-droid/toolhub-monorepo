'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatDukeScore } from './calculation';
import type {
  AnginaIndex,
  DukeTreadmillScoreFieldErrors,
  DukeTreadmillScoreInput,
  DukeTreadmillScoreResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

const ANGINA_OPTIONS: readonly { value: AnginaIndex; label: string }[] = [
  { value: 'none', label: 'No angina during exercise' },
  { value: 'nonLimiting', label: 'Non-limiting angina' },
  {
    value: 'limiting',
    label: 'Exercises stopped because of angina',
  },
];

interface FormProps {
  input: DukeTreadmillScoreInput;
  errors: DukeTreadmillScoreFieldErrors;
  result: DukeTreadmillScoreResult | null;
  onChange: (input: DukeTreadmillScoreInput) => void;
}

export function DukeTreadmillScoreForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<DukeTreadmillScoreInput>) =>
    onChange({ ...input, ...patch });

  const scoreDisplay = formatDukeScore(result?.score ?? null);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-accent">
        <p className="font-semibold text-amber-950">
          Educational Duke treadmill score — not clinical advice
        </p>
        <p className="mt-1.5 text-foreground/85">
          Assumes Bruce-protocol exercise minutes and maximal net ST-segment
          deviation in millimeters. Values stay in your browser; share uses the
          page URL only.
        </p>
      </div>

      <section className={sectionClass} aria-label="Duke treadmill inputs">
        <div>
          <label className={labelClass} htmlFor="dts-duration">
            Exercise duration
          </label>
          <FieldShell error={errors.durationMinutesText}>
            <input
              id="dts-duration"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.durationMinutesText}
              onChange={(e) => set({ durationMinutesText: e.target.value })}
              aria-invalid={Boolean(errors.durationMinutesText)}
            />
            <span className={unitFixed}>min</span>
          </FieldShell>
          {errors.durationMinutesText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.durationMinutesText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="dts-st">
            Max ST-segment deviation
            <InfoTooltip text="Enter the maximal net ST-segment deviation during exercise in millimeters (magnitude)." />
          </label>
          <FieldShell error={errors.stDeviationMmText}>
            <input
              id="dts-st"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.stDeviationMmText}
              onChange={(e) => set({ stDeviationMmText: e.target.value })}
              aria-invalid={Boolean(errors.stDeviationMmText)}
            />
            <span className={unitFixed}>mm</span>
          </FieldShell>
          {errors.stDeviationMmText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.stDeviationMmText}
            </p>
          ) : null}
        </div>

        <div>
          <p className={labelClass}>Angina index</p>
          <div
            role="radiogroup"
            aria-label="Angina index"
            className="flex flex-col gap-2.5"
          >
            {ANGINA_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="inline-flex cursor-pointer items-start gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="dts-angina"
                  className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                  checked={input.angina === opt.value}
                  onChange={() => set({ angina: opt.value })}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="dts-results-heading">
        <h3
          id="dts-results-heading"
          className="text-[15px] font-semibold text-accent"
        >
          Results
        </h3>
        <div>
          <label className={labelClass} htmlFor="dts-score">
            Duke treadmill score
          </label>
          <div className="relative flex h-11 items-center rounded-lg border border-border bg-muted/15 px-3">
            <input
              id="dts-score"
              type="text"
              readOnly
              aria-label="Duke treadmill score"
              className="h-11 w-full min-w-0 bg-transparent text-sm tabular-nums text-accent outline-none"
              value={scoreDisplay}
            />
          </div>
        </div>
        {result?.statusDetail ? (
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {result.statusDetail}
          </p>
        ) : null}
      </section>
    </form>
  );
}
