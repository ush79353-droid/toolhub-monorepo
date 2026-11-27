'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  RbcIndicesFieldErrors,
  RbcIndicesInput,
  RbcIndicesResult,
  Sex,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitStaticClass =
  'flex h-11 shrink-0 items-center border-l border-border px-3 text-sm text-muted-foreground';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

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
        error
          ? 'border-rose-400'
          : muted
            ? 'border-sky-200 bg-sky-50/60'
            : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

interface FormProps {
  input: RbcIndicesInput;
  errors: RbcIndicesFieldErrors;
  result: RbcIndicesResult | null;
  onChange: (input: RbcIndicesInput) => void;
}

export function RbcIndicesForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<RbcIndicesInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Sex">
        <fieldset>
          <legend className={labelClass}>I am a…</legend>
          <div className="flex flex-wrap gap-4">
            {([
              ['female', 'female'],
              ['male', 'male'],
            ] as const).map(([value, label]) => (
              <label
                key={value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="rbc-sex"
                  value={value}
                  checked={input.sex === value}
                  onChange={() => set({ sex: value as Sex })}
                  className="h-4 w-4 accent-primary"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className={sectionClass} aria-label="Blood test results">
        <h3 className="text-sm font-semibold text-accent">
          My blood test results
        </h3>

        <div>
          <label className={labelClass} htmlFor="rbc-hb">
            Hemoglobin (Hgb)
            <InfoTooltip text="Hemoglobin concentration in g/dL." />
          </label>
          <FieldShell error={errors.hemoglobinText}>
            <input
              id="rbc-hb"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.hemoglobinText}
              onChange={(e) => set({ hemoglobinText: e.target.value })}
              aria-invalid={Boolean(errors.hemoglobinText)}
            />
            <span className={unitStaticClass} aria-hidden="true">
              g/dL
            </span>
          </FieldShell>
          {errors.hemoglobinText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.hemoglobinText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="rbc-hct">
            Hematocrit (Hct)
            <InfoTooltip text="Hematocrit as a percentage of blood volume." />
          </label>
          <FieldShell error={errors.hematocritText}>
            <input
              id="rbc-hct"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.hematocritText}
              onChange={(e) => set({ hematocritText: e.target.value })}
              aria-invalid={Boolean(errors.hematocritText)}
            />
            <span className={unitStaticClass} aria-hidden="true">
              %
            </span>
          </FieldShell>
          {errors.hematocritText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.hematocritText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="rbc-count">
            RBC count
            <InfoTooltip text="Red blood cell count in million cells per microliter (×10⁶/µL)." />
          </label>
          <FieldShell error={errors.rbcText}>
            <input
              id="rbc-count"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.rbcText}
              onChange={(e) => set({ rbcText: e.target.value })}
              aria-invalid={Boolean(errors.rbcText)}
            />
            <span className={unitStaticClass} aria-hidden="true">
              million cells/µL
            </span>
          </FieldShell>
          {errors.rbcText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.rbcText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="rbc-mch">
            Mean corpuscular hemoglobin (MCH)
            <InfoTooltip text="MCH = 10 × Hb / RBC (pg/cell)." />
          </label>
          <FieldShell muted>
            <input
              id="rbc-mch"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedMch ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <span className={unitStaticClass} aria-hidden="true">
              pg/cell
            </span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="rbc-mchc">
            Mean corpuscular hemoglobin concentration (MCHC)
            <InfoTooltip text="MCHC = 100 × Hb / Hct (g/dL)." />
          </label>
          <FieldShell muted>
            <input
              id="rbc-mchc"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedMchc ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <span className={unitStaticClass} aria-hidden="true">
              g/dL
            </span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="rbc-mcv">
            Mean corpuscular volume (MCV)
            <InfoTooltip text="MCV = 10 × Hct / RBC (fL)." />
          </label>
          <FieldShell muted>
            <input
              id="rbc-mcv"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedMcv ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <span className={unitStaticClass} aria-hidden="true">
              fL
            </span>
          </FieldShell>
        </div>

        {result?.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.statusDetail} {result.disclaimer}
          </p>
        ) : null}
      </section>
    </form>
  );
}
