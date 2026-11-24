'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  GraceFieldErrors,
  GraceInput,
  GraceResult,
  KillipClass,
  YesNoUnset,
} from './types';
import {
  CREATININE_UNIT_LABELS,
  KILLIP_OPTIONS,
  YES_NO_OPTIONS,
  type CreatinineUnit,
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

function YesNoUnsetFieldset({
  legend,
  tip,
  name,
  value,
  onChange,
}: {
  legend: string;
  tip?: string;
  name: string;
  value: YesNoUnset;
  onChange: (v: 'yes' | 'no') => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className={labelClass}>
        <span>{legend}</span>
        {tip ? <InfoTooltip label={legend} text={tip} /> : null}
      </legend>
      <div className="flex flex-wrap gap-4" role="radiogroup" aria-label={legend}>
        {YES_NO_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-2 text-sm text-accent"
          >
            <input
              type="radio"
              name={name}
              className="h-4 w-4 accent-primary"
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
      {value === null ? (
        <p className="text-[11px] text-muted-foreground">
          Select Yes or No — unset is not scored as negative.
        </p>
      ) : null}
    </fieldset>
  );
}

interface Props {
  input: GraceInput;
  errors: GraceFieldErrors;
  result: GraceResult | null;
  onChange: (input: GraceInput) => void;
  onLoadExample: () => void;
}

export function GraceForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<GraceInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational GRACE 1.0 point score (Granger 2003) with in-hospital
        mortality risk categories. Not treatment advice. Clinical values stay in
        your browser only — share uses the page URL only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (age 68 · Killip II · score 188 · high risk)
        </button>
      </p>

      <section className={sectionClass} aria-label="GRACE numeric inputs">
        <div>
          <label className={labelClass} htmlFor="grace-age">
            <span>Age</span>
            <InfoTooltip
              label="Age"
              text="GRACE age points use published 10-year bands from 0–29 (0 points) through ≥90 (100 points)."
            />
          </label>
          <FieldShell error={errors.ageYears}>
            <input
              id="grace-age"
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

        <div>
          <label className={labelClass} htmlFor="grace-hr">
            <span>Heart rate</span>
            <InfoTooltip
              label="Heart rate"
              text="Admission heart rate in beats per minute; GRACE uses published bpm bands up to ≥200 (46 points)."
            />
          </label>
          <FieldShell error={errors.heartRateBpm}>
            <input
              id="grace-hr"
              className={inputClass}
              inputMode="decimal"
              value={input.heartRateBpm}
              aria-label="Heart rate in bpm"
              aria-invalid={Boolean(errors.heartRateBpm)}
              onChange={(e) => set({ heartRateBpm: e.target.value })}
            />
            <span className="shrink-0 border-l border-border px-3 text-sm font-medium text-muted-foreground">
              bpm
            </span>
          </FieldShell>
          {errors.heartRateBpm ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heartRateBpm}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="grace-sbp">
            <span>Systolic blood pressure</span>
            <InfoTooltip
              label="Systolic blood pressure"
              text="Systolic BP on admission (mmHg). Lower pressures carry more GRACE points in the published table."
            />
          </label>
          <FieldShell error={errors.systolicBpMmHg}>
            <input
              id="grace-sbp"
              className={inputClass}
              inputMode="decimal"
              value={input.systolicBpMmHg}
              aria-label="Systolic blood pressure mmHg"
              aria-invalid={Boolean(errors.systolicBpMmHg)}
              onChange={(e) => set({ systolicBpMmHg: e.target.value })}
            />
            <span className="shrink-0 border-l border-border px-3 text-sm font-medium text-muted-foreground">
              mmHg
            </span>
          </FieldShell>
          {errors.systolicBpMmHg ? (
            <p className="mt-1 text-xs text-rose-600">{errors.systolicBpMmHg}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="grace-cr">
            <span>Creatinine</span>
            <InfoTooltip
              label="Creatinine"
              text="Serum creatinine on admission. µmol/L is converted to mg/dL (÷ 88.4) before GRACE tier scoring."
            />
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
            <FieldShell error={errors.creatinineValue}>
              <input
                id="grace-cr"
                className={inputClass}
                inputMode="decimal"
                value={input.creatinineValue}
                aria-label="Creatinine value"
                aria-invalid={Boolean(errors.creatinineValue)}
                onChange={(e) => set({ creatinineValue: e.target.value })}
              />
            </FieldShell>
            <FieldShell>
              <select
                className="h-11 w-full min-w-[7.5rem] bg-transparent px-3 text-sm text-accent outline-none"
                aria-label="Creatinine unit"
                value={input.creatinineUnit}
                onChange={(e) =>
                  set({ creatinineUnit: e.target.value as CreatinineUnit })
                }
              >
                {(
                  Object.keys(CREATININE_UNIT_LABELS) as CreatinineUnit[]
                ).map((u) => (
                  <option key={u} value={u}>
                    {CREATININE_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </FieldShell>
          </div>
          {errors.creatinineValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.creatinineValue}</p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-label="GRACE clinical factors">
        <fieldset className="space-y-2">
          <legend className={labelClass}>
            <span>Killip class</span>
            <InfoTooltip
              label="Killip class"
              text="Heart failure class on admission: I (0), II (20), III (39), IV (59) points."
            />
          </legend>
          <div className="flex flex-col gap-2" role="radiogroup" aria-label="Killip class">
            {KILLIP_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="inline-flex cursor-pointer items-start gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="grace-killip"
                  className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                  checked={input.killipClass === opt.value}
                  onChange={() => set({ killipClass: opt.value as KillipClass })}
                />
                <span>
                  <span className="text-muted-foreground">({opt.points} pt)</span>{' '}
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
          {input.killipClass === null ? (
            <p className="text-[11px] text-muted-foreground">
              Select Killip class to score.
            </p>
          ) : null}
        </fieldset>

        <YesNoUnsetFieldset
          legend="Cardiac arrest at admission"
          tip="Cardiac arrest at hospital admission adds 39 points when present."
          name="grace-arrest"
          value={input.cardiacArrestAtAdmission}
          onChange={(v) => set({ cardiacArrestAtAdmission: v })}
        />

        <YesNoUnsetFieldset
          legend="ST-segment deviation"
          tip="ST-segment deviation on the admission ECG adds 28 points when present."
          name="grace-st"
          value={input.stSegmentDeviation}
          onChange={(v) => set({ stSegmentDeviation: v })}
        />

        <YesNoUnsetFieldset
          legend="Elevated cardiac enzymes / biomarkers"
          tip="Elevated cardiac enzymes or biomarkers on admission add 14 points when present."
          name="grace-enzymes"
          value={input.elevatedCardiacEnzymes}
          onChange={(v) => set({ elevatedCardiacEnzymes: v })}
        />
      </section>

      <section className={sectionClass} aria-labelledby="grace-results-heading">
        <h3
          id="grace-results-heading"
          className="text-[15px] font-semibold text-accent"
        >
          Results
        </h3>
        <div>
          <label className={labelClass} htmlFor="grace-score-out">
            GRACE score
          </label>
          <div className="relative flex h-14 items-center rounded-lg border border-primary/20 bg-primary/10 px-3">
            <input
              id="grace-score-out"
              type="text"
              readOnly
              aria-label="GRACE score"
              className="h-11 w-full min-w-0 bg-transparent text-lg font-semibold tabular-nums text-accent outline-none"
              value={result?.formattedScore ?? ''}
            />
          </div>
        </div>
        {result ? (
          <>
            <p className="text-sm font-medium text-accent">
              {result.riskCategoryLabel}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result.riskMortalityRange}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result.explanation}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result.disclaimer}
            </p>
          </>
        ) : (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Enter all vitals, select Killip class, and answer each yes/no item
            to calculate GRACE 1.0.
          </p>
        )}
        {errors.form ? (
          <p className="text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </section>
    </form>
  );
}