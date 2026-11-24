'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AuditFreq,
  AuditLifetime,
  AuditQ1,
  AuditQ2,
  AuditScoreFieldErrors,
  AuditScoreInput,
  AuditScoreResult,
  Sex,
} from './types';
import {
  FREQ_OPTIONS,
  LIFETIME_OPTIONS,
  Q1_OPTIONS,
  Q2_OPTIONS,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const resultBox =
  'flex h-11 items-center rounded-lg border border-sky-200 bg-sky-50/60 px-3 text-sm tabular-nums text-accent';

interface FormProps {
  input: AuditScoreInput;
  errors: AuditScoreFieldErrors;
  result: AuditScoreResult | null;
  onChange: (input: AuditScoreInput) => void;
}

export function AuditScoreForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<AuditScoreInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        WHO Alcohol Use Disorders Identification Test (AUDIT) — educational
        screening only.
      </p>

      <section className={sectionClass} aria-label="Sex">
        <fieldset>
          <legend className={labelClass}>Sex</legend>
          <div className="flex flex-wrap gap-4" role="radiogroup" aria-label="Sex">
            {(['female', 'male'] as const).map((s) => (
              <label
                key={s}
                className="flex cursor-pointer items-center gap-2 text-sm capitalize text-accent"
              >
                <input
                  type="radio"
                  name="audit-sex"
                  className="h-4 w-4 accent-primary"
                  checked={input.sex === s}
                  onChange={() => set({ sex: s as Sex })}
                />
                {s}
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className={sectionClass} aria-label="Consumption">
        <h3 className="text-sm font-semibold text-accent">
          During the last year…
          <InfoTooltip text="Consumption domain (AUDIT items 1–3 / AUDIT-C)." />
        </h3>
        <FieldSelect
          id="audit-q1"
          label="How often have you drunk?"
          value={input.q1}
          options={Q1_OPTIONS}
          onChange={(v) => set({ q1: v as AuditQ1 })}
        />
        <FieldSelect
          id="audit-q2"
          label="How many drinks have you had on average?"
          value={input.q2}
          options={Q2_OPTIONS}
          onChange={(v) => set({ q2: v as AuditQ2 })}
        />
        <FieldSelect
          id="audit-q3"
          label="How many times have you had 6 or more drinks?"
          value={input.q3}
          options={FREQ_OPTIONS}
          onChange={(v) => set({ q3: v as AuditFreq })}
        />
      </section>

      <section className={sectionClass} aria-label="Dependence and past-year harm">
        <h3 className="text-sm font-semibold text-accent">
          During the last year, how often have you…
        </h3>
        <FieldSelect
          id="audit-q4"
          label="Not been able to stop drinking?"
          value={input.q4}
          options={FREQ_OPTIONS}
          onChange={(v) => set({ q4: v as AuditFreq })}
        />
        <FieldSelect
          id="audit-q5"
          label="Failed to do something expected of you the next day?"
          value={input.q5}
          options={FREQ_OPTIONS}
          onChange={(v) => set({ q5: v as AuditFreq })}
        />
        <FieldSelect
          id="audit-q6"
          label="Needed a drink first thing in the morning?"
          value={input.q6}
          options={FREQ_OPTIONS}
          onChange={(v) => set({ q6: v as AuditFreq })}
        />
        <FieldSelect
          id="audit-q7"
          label="Felt guilt or remorse after drinking?"
          value={input.q7}
          options={FREQ_OPTIONS}
          onChange={(v) => set({ q7: v as AuditFreq })}
        />
        <FieldSelect
          id="audit-q8"
          label="Not been able to remember things from the last night?"
          value={input.q8}
          options={FREQ_OPTIONS}
          onChange={(v) => set({ q8: v as AuditFreq })}
        />
      </section>

      <section className={sectionClass} aria-label="Alcohol-related problems">
        <h3 className="text-sm font-semibold text-accent">
          In general (not only the past year), has someone…
          <InfoTooltip text="Items 9–10 score 0, 2, or 4 (not 1 or 3)." />
        </h3>
        <LifetimeRadios
          legend="Or you been injured as a result of your drinking?"
          name="audit-q9"
          value={input.q9}
          onChange={(v) => set({ q9: v })}
        />
        <LifetimeRadios
          legend="Suggested that you drink less?"
          name="audit-q10"
          value={input.q10}
          onChange={(v) => set({ q10: v })}
        />
      </section>

      <section className={sectionClass} aria-label="Audit score results">
        <h3 className="text-sm font-semibold text-accent">Audit score</h3>
        <ResultRow label="Consumption score" value={result?.consumption} />
        <ResultRow label="Dependence score" value={result?.dependence} />
        <ResultRow
          label="Alcohol-related problems score"
          value={result?.harm}
        />
        <ResultRow label="Overall result" value={result?.total} />
        {result ? (
          <p className="text-sm leading-relaxed text-accent">
            {result.interpretation}{' '}
            <span className="text-xs text-muted-foreground">
              {result.disclaimer}
            </span>
          </p>
        ) : null}
        {errors.form ? (
          <p className="text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </section>
    </form>
  );
}

function FieldSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  options: readonly { value: number; label: string }[];
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className={selectClass}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function LifetimeRadios({
  legend,
  name,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  value: AuditLifetime;
  onChange: (v: AuditLifetime) => void;
}) {
  return (
    <fieldset>
      <legend className={labelClass}>{legend}</legend>
      <div className="space-y-2" role="radiogroup" aria-label={legend}>
        {LIFETIME_OPTIONS.map((opt) => (
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
            {opt.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function ResultRow({
  label,
  value,
}: {
  label: string;
  value: number | null | undefined;
}) {
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <div className={resultBox}>{value != null ? String(value) : ''}</div>
    </div>
  );
}
