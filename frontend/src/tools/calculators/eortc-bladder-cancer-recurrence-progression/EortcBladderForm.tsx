'use client';

import type {
  ConcomitantCis,
  DiseaseStage,
  EortcBladderFieldErrors,
  EortcBladderInput,
  EortcBladderResult,
  PriorRecurrenceRate,
  TumorCount,
  TumorDiameter,
  TumorGrade,
} from './types';
import {
  CIS_OPTIONS,
  GRADE_OPTIONS,
  PRIOR_RECURRENCE_OPTIONS,
  STAGE_OPTIONS,
  TUMOR_COUNT_OPTIONS,
  TUMOR_DIAMETER_OPTIONS,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';

interface Props {
  input: EortcBladderInput;
  errors: EortcBladderFieldErrors;
  result: EortcBladderResult | null;
  onChange: (input: EortcBladderInput) => void;
  onLoadExample: () => void;
}

function RadioRow<T extends string>({
  name,
  value,
  options,
  onPick,
}: {
  name: string;
  value: T | null;
  options: readonly { value: T; label: string }[];
  onPick: (v: T) => void;
}) {
  return (
    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex cursor-pointer items-center gap-2 text-sm text-accent"
        >
          <input
            type="radio"
            name={name}
            className="h-4 w-4 accent-primary"
            checked={value === opt.value}
            onChange={() => onPick(opt.value)}
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

function ResultField({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div>
      <div className={labelClass}>{label}</div>
      <div
        className={`flex h-11 items-center rounded-lg border border-border px-3 text-sm font-semibold tabular-nums ${
          emphasize
            ? 'bg-sky-50 text-primary'
            : 'bg-muted/25 text-accent'
        }`}
        aria-live="polite"
      >
        {value}
      </div>
    </div>
  );
}

export function EortcBladderForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<EortcBladderInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational EORTC risk tables for non–muscle-invasive bladder cancer
        (Sylvester 2006; WHO 1973 G1–G3). Separate recurrence and progression
        scores with 1- and 5-year probabilities. Not a treatment plan. Entries
        stay in your browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (2–7 · &lt;3 cm · ≤1/yr · Ta · no CIS · G1)
        </button>
      </p>

      <fieldset className="space-y-1 rounded-lg border border-border px-3 py-2.5">
        <legend className={`${labelClass} px-1`}>Number of tumors</legend>
        <RadioRow<TumorCount>
          name="eortc-tumor-count"
          value={input.tumorCount}
          options={TUMOR_COUNT_OPTIONS}
          onPick={(v) => set({ tumorCount: v })}
        />
        {errors.tumorCount ? (
          <p className="mt-1 text-xs text-destructive">{errors.tumorCount}</p>
        ) : null}
      </fieldset>

      <fieldset className="space-y-1 rounded-lg border border-border px-3 py-2.5">
        <legend className={`${labelClass} px-1`}>Tumor diameter</legend>
        <RadioRow<TumorDiameter>
          name="eortc-tumor-diameter"
          value={input.tumorDiameter}
          options={TUMOR_DIAMETER_OPTIONS}
          onPick={(v) => set({ tumorDiameter: v })}
        />
        {errors.tumorDiameter ? (
          <p className="mt-1 text-xs text-destructive">{errors.tumorDiameter}</p>
        ) : null}
      </fieldset>

      <fieldset className="space-y-1 rounded-lg border border-border px-3 py-2.5">
        <legend className={`${labelClass} px-1`}>Prior recurrence rate</legend>
        <RadioRow<PriorRecurrenceRate>
          name="eortc-prior-recurrence"
          value={input.priorRecurrenceRate}
          options={PRIOR_RECURRENCE_OPTIONS}
          onPick={(v) => set({ priorRecurrenceRate: v })}
        />
        {errors.priorRecurrenceRate ? (
          <p className="mt-1 text-xs text-destructive">
            {errors.priorRecurrenceRate}
          </p>
        ) : null}
      </fieldset>

      <fieldset className="space-y-1 rounded-lg border border-border px-3 py-2.5">
        <legend className={`${labelClass} px-1`}>Stage of the disease</legend>
        <RadioRow<DiseaseStage>
          name="eortc-stage"
          value={input.stage}
          options={STAGE_OPTIONS}
          onPick={(v) => set({ stage: v })}
        />
        {errors.stage ? (
          <p className="mt-1 text-xs text-destructive">{errors.stage}</p>
        ) : null}
      </fieldset>

      <fieldset className="space-y-1 rounded-lg border border-border px-3 py-2.5">
        <legend className={`${labelClass} px-1`}>
          Concomitant CIS (Carcinoma in situ)
        </legend>
        <RadioRow<ConcomitantCis>
          name="eortc-cis"
          value={input.concomitantCis}
          options={CIS_OPTIONS}
          onPick={(v) => set({ concomitantCis: v })}
        />
        {errors.concomitantCis ? (
          <p className="mt-1 text-xs text-destructive">{errors.concomitantCis}</p>
        ) : null}
      </fieldset>

      <fieldset className="space-y-1 rounded-lg border border-border px-3 py-2.5">
        <legend className={`${labelClass} px-1`}>Tumor grade</legend>
        <RadioRow<TumorGrade>
          name="eortc-grade"
          value={input.grade}
          options={GRADE_OPTIONS}
          onPick={(v) => set({ grade: v })}
        />
        {errors.grade ? (
          <p className="mt-1 text-xs text-destructive">{errors.grade}</p>
        ) : null}
      </fieldset>

      {errors.form ? (
        <p className="text-xs text-destructive" role="status">
          {errors.form}
        </p>
      ) : null}

      <div className="space-y-3 rounded-xl border border-border bg-muted/10 p-3">
        <h3 className="text-sm font-semibold text-accent">Recurrence</h3>
        <ResultField
          label="Recurrence points"
          value={result ? result.formattedRecurrencePoints : '—'}
        />
        <ResultField
          label="Probability of recurrence at 1 year"
          value={result ? result.formattedRecurrence1Year : '—'}
          emphasize
        />
        <ResultField
          label="Probability of recurrence at 5 years"
          value={result ? result.formattedRecurrence5Year : '—'}
          emphasize
        />
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-muted/10 p-3">
        <h3 className="text-sm font-semibold text-accent">Progression</h3>
        <ResultField
          label="Progression points"
          value={result ? result.formattedProgressionPoints : '—'}
        />
        <ResultField
          label="Probability of progression at 1 year"
          value={result ? result.formattedProgression1Year : '—'}
          emphasize
        />
        <ResultField
          label="Probability of progression at 5 years"
          value={result ? result.formattedProgression5Year : '—'}
          emphasize
        />
      </div>

      {result ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.explanation}
        </p>
      ) : null}
    </form>
  );
}
