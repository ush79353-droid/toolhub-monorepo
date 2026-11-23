'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  BloodPressureFieldErrors,
  BloodPressureInput,
  BloodPressureResult,
  BpGuideline,
} from './types';
import { GUIDELINE_OPTIONS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface Props {
  input: BloodPressureInput;
  errors: BloodPressureFieldErrors;
  result: BloodPressureResult | null;
  onChange: (input: BloodPressureInput) => void;
  onLoadExample: () => void;
}

export function BloodPressureForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<BloodPressureInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Blood pressure readings are expressed in the following form:
      </p>
      <p className="text-sm font-medium text-accent">
        [Systolic]/[Diastolic]: XXX/YY mmHg.
      </p>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational office-reading category lookup (ACC/AHA or 2018 joint
        ESC/ESH tables). A single reading is not a diagnosis. Values stay in
        your browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (118/76 → ACC/AHA Normal)
        </button>
      </p>

      <fieldset>
        <legend className={labelClass}>Guideline</legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
          {GUIDELINE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="bp-guideline"
                className="h-4 w-4 accent-primary"
                checked={input.guideline === opt.value}
                onChange={() => set({ guideline: opt.value as BpGuideline })}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="bp-systolic">
          <span>Systolic blood pressure</span>
          <InfoTooltip
            label="Systolic blood pressure"
            text="Top number in XXX/YY mmHg — peak arterial pressure during heart contraction, entered in millimeters of mercury."
          />
        </label>
        <FieldShell error={errors.systolic}>
          <input
            id="bp-systolic"
            className={inputClass}
            inputMode="decimal"
            placeholder=""
            aria-label="Systolic blood pressure in mmHg"
            value={input.systolic}
            aria-invalid={Boolean(errors.systolic)}
            onChange={(e) => set({ systolic: e.target.value })}
          />
          <span className="shrink-0 pr-3 text-sm font-medium text-muted-foreground">
            mmHg
          </span>
        </FieldShell>
        {errors.systolic ? (
          <p className="mt-1 text-xs text-rose-600">{errors.systolic}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="bp-diastolic">
          <span>Diastolic blood pressure</span>
          <InfoTooltip
            label="Diastolic blood pressure"
            text="Bottom number in XXX/YY mmHg — arterial pressure between beats, entered in millimeters of mercury."
          />
        </label>
        <FieldShell error={errors.diastolic}>
          <input
            id="bp-diastolic"
            className={inputClass}
            inputMode="decimal"
            placeholder=""
            aria-label="Diastolic blood pressure in mmHg"
            value={input.diastolic}
            aria-invalid={Boolean(errors.diastolic)}
            onChange={(e) => set({ diastolic: e.target.value })}
          />
          <span className="shrink-0 pr-3 text-sm font-medium text-muted-foreground">
            mmHg
          </span>
        </FieldShell>
        {errors.diastolic ? (
          <p className="mt-1 text-xs text-rose-600">{errors.diastolic}</p>
        ) : null}
      </div>

      {errors.form ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {errors.form}
        </p>
      ) : null}

      {result ? (
        <div
          className="rounded-xl border border-border bg-muted/15 px-4 py-3"
          aria-live="polite"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Reading category · {result.guidelineLabel}
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-accent">
            {result.categoryLabel}
          </p>
          <p className="mt-1 text-sm text-accent">{result.readingLabel}</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            {result.explanation}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.contextNote}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.disclaimer}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-3 text-sm text-muted-foreground">
          Enter both systolic and diastolic values to see the guideline
          category for this reading.
        </div>
      )}
    </form>
  );
}
