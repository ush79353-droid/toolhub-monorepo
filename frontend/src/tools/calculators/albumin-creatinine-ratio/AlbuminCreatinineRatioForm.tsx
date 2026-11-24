'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatAcr } from './calculation';
import type {
  AlbuminCreatinineRatioFieldErrors,
  AlbuminCreatinineRatioInput,
  AlbuminCreatinineRatioResult,
  CreatinineUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-primary';

const CREATININE_UNITS: { value: CreatinineUnit; label: string }[] = [
  { value: 'mg_dl', label: 'mg/dL' },
  { value: 'mmol_l', label: 'mmol/L' },
];

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
  input: AlbuminCreatinineRatioInput;
  errors: AlbuminCreatinineRatioFieldErrors;
  result: AlbuminCreatinineRatioResult | null;
  onChange: (input: AlbuminCreatinineRatioInput) => void;
}

export function AlbuminCreatinineRatioForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<AlbuminCreatinineRatioInput>) =>
    onChange({ ...input, ...patch });

  const acrDisplay =
    result?.acrMgPerG != null ? formatAcr(result.acrMgPerG) : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Albumin creatinine inputs">
        <div>
          <label className={labelClass} htmlFor="acr-albumin">
            Albumin
            <InfoTooltip text="Urine albumin (microalbumin) concentration from the same spot sample, in mg/dL." />
          </label>
          <FieldShell error={errors.albuminText}>
            <input
              id="acr-albumin"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.albuminText}
              onChange={(e) => set({ albuminText: e.target.value })}
              aria-invalid={Boolean(errors.albuminText)}
            />
            <span className={unitFixed}>mg/dL</span>
          </FieldShell>
          {errors.albuminText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.albuminText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="acr-creatinine">
            Creatinine
            <InfoTooltip text="Urine creatinine from the same sample. mmol/L is converted × 11.3 to mg/dL before the ratio." />
          </label>
          <FieldShell error={errors.creatinineText}>
            <input
              id="acr-creatinine"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.creatinineText}
              onChange={(e) => set({ creatinineText: e.target.value })}
              aria-invalid={Boolean(errors.creatinineText)}
            />
            <select
              className={unitSelectClass}
              value={input.creatinineUnit}
              onChange={(e) =>
                set({ creatinineUnit: e.target.value as CreatinineUnit })
              }
              aria-label="Creatinine unit"
            >
              {CREATININE_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.creatinineText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.creatinineText}
            </p>
          ) : null}
        </div>
      </section>

      <section
        className={sectionClass}
        aria-label="Albumin creatinine ratio result"
      >
        <div>
          <label className={labelClass} htmlFor="acr-result">
            Albumin : creatinine ratio
            <InfoTooltip text="ACR in mg albumin per gram creatinine. Educational KDIGO band shown below when available." />
          </label>
          <FieldShell muted>
            <input
              id="acr-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={acrDisplay}
              aria-live="polite"
              aria-readonly="true"
            />
            <span className={unitFixed}>mg/g</span>
          </FieldShell>
        </div>

        {result?.acrMgPerG != null && result.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.statusDetail} {result.disclaimer}
          </p>
        ) : result?.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.statusDetail}
          </p>
        ) : null}
      </section>
    </form>
  );
}
