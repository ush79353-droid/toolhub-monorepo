'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  HeartScoreFieldErrors,
  HeartScoreInput,
  HeartScoreResult,
} from './types';
import {
  ECG_OPTIONS,
  HISTORY_OPTIONS,
  RISK_FACTOR_OPTIONS,
  TROPONIN_OPTIONS,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

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

function RadioFieldset<T extends string>({
  legend,
  tip,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  tip?: string;
  name: string;
  options: readonly { value: T; label: string; points: 0 | 1 | 2 }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className={labelClass}>
        <span>{legend}</span>
        {tip ? <InfoTooltip label={legend} text={tip} /> : null}
      </legend>
      <div className="flex flex-col gap-2" role="radiogroup" aria-label={legend}>
        {options.map((opt) => (
          <label
            key={opt.value}
            className="inline-flex cursor-pointer items-start gap-2 text-sm text-accent"
          >
            <input
              type="radio"
              name={name}
              className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />
            <span>
              <span className="text-muted-foreground">({opt.points} pt)</span>{' '}
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

interface Props {
  input: HeartScoreInput;
  errors: HeartScoreFieldErrors;
  result: HeartScoreResult | null;
  onChange: (input: HeartScoreInput) => void;
  onLoadExample: () => void;
}

export function HeartScoreForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<HeartScoreInput>) => onChange({ ...input, ...patch });

  const scoreDisplay = result?.formattedTotalScore ?? '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational HEART score (0–10) from History, ECG, Age, Risk factors, and
        initial Troponin. Not ED disposition or treatment advice. Values stay in
        your browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (age 58 · moderate profile → score 5)
        </button>
      </p>

      <section className={sectionClass} aria-label="HEART score inputs">
        <div>
          <label className={labelClass} htmlFor="heart-age">
            <span>Age</span>
            <InfoTooltip
              label="Age"
              text="HEART age points: under 45 years (0), 45–64 years (1), 65 years and older (2)."
            />
          </label>
          <FieldShell error={errors.ageYears}>
            <input
              id="heart-age"
              className={inputClass}
              inputMode="decimal"
              value={input.ageYears}
              aria-label="Age in years"
              aria-invalid={Boolean(errors.ageYears)}
              onChange={(e) => set({ ageYears: e.target.value })}
            />
            <span className="shrink-0 border-l border-border px-3 text-sm font-medium text-muted-foreground">
              years
            </span>
          </FieldShell>
          {errors.ageYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageYears}</p>
          ) : null}
        </div>

        <RadioFieldset
          legend="ECG"
          tip="Normal; abnormal without significant ST deviation; or significant ST deviation (repolarization/ST criteria per Six 2008)."
          name="heart-ecg"
          options={ECG_OPTIONS}
          value={input.ecg}
          onChange={(v) => set({ ecg: v })}
        />

        <RadioFieldset
          legend="History"
          tip="Chest pain history suspiciousness: slightly/non-suspicious, moderately suspicious, or highly suspicious."
          name="heart-history"
          options={HISTORY_OPTIONS}
          value={input.history}
          onChange={(v) => set({ history: v })}
        />

        <RadioFieldset
          legend="Initial troponin"
          tip="Compare the initial troponin to your assay upper reference limit: below cutoff, 1–3× cutoff, or greater than 3× cutoff."
          name="heart-troponin"
          options={TROPONIN_OPTIONS}
          value={input.troponin}
          onChange={(v) => set({ troponin: v })}
        />

        <RadioFieldset
          legend="Risk factors"
          tip="Traditional cardiovascular risk factors (hypertension, hypercholesterolemia, diabetes, smoking, obesity, family history). Known atherosclerotic disease scores 2."
          name="heart-risk"
          options={RISK_FACTOR_OPTIONS}
          value={input.riskFactors}
          onChange={(v) => set({ riskFactors: v })}
        />
      </section>

      <section className={sectionClass} aria-labelledby="heart-results-heading">
        <h3
          id="heart-results-heading"
          className="text-[15px] font-semibold text-accent"
        >
          Results
        </h3>
        <div>
          <label className={labelClass} htmlFor="heart-score-out">
            HEART score
          </label>
          <div className="relative flex h-14 items-center rounded-lg border border-primary/20 bg-primary/10 px-3">
            <input
              id="heart-score-out"
              type="text"
              readOnly
              aria-label="HEART score"
              className="h-11 w-full min-w-0 bg-transparent text-lg font-semibold tabular-nums text-accent outline-none"
              value={scoreDisplay}
            />
          </div>
        </div>
        {result?.componentSummary ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.componentSummary}
          </p>
        ) : (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Enter age in years to calculate the HEART score.
          </p>
        )}
        {result ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.disclaimer}
          </p>
        ) : null}
      </section>
    </form>
  );
}