'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatLab, formatRatio } from './calculation';
import type {
  AlbuminGlobulinRatioFieldErrors,
  AlbuminGlobulinRatioInput,
  AlbuminGlobulinRatioResult,
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
  input: AlbuminGlobulinRatioInput;
  errors: AlbuminGlobulinRatioFieldErrors;
  result: AlbuminGlobulinRatioResult | null;
  onChange: (input: AlbuminGlobulinRatioInput) => void;
}

export function AlbuminGlobulinRatioForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<AlbuminGlobulinRatioInput>) =>
    onChange({ ...input, ...patch });

  const globulinDisplay =
    result?.globulin != null ? formatLab(result.globulin) : '';
  const ratioDisplay =
    result?.agRatio != null ? formatRatio(result.agRatio) : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Albumin globulin inputs">
        <div>
          <label className={labelClass} htmlFor="ag-albumin">
            Albumin
          </label>
          <FieldShell error={errors.albuminText}>
            <input
              id="ag-albumin"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.albuminText}
              onChange={(e) => set({ albuminText: e.target.value })}
              aria-invalid={Boolean(errors.albuminText)}
            />
            <span className={unitFixed}>g/dL</span>
          </FieldShell>
          {errors.albuminText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.albuminText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ag-total">
            Total protein
          </label>
          <FieldShell error={errors.totalProteinText}>
            <input
              id="ag-total"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.totalProteinText}
              onChange={(e) => set({ totalProteinText: e.target.value })}
              aria-invalid={Boolean(errors.totalProteinText)}
            />
            <span className={unitFixed}>g/dL</span>
          </FieldShell>
          {errors.totalProteinText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.totalProteinText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ag-globulin">
            Globulin
            <InfoTooltip text="Derived as total protein minus albumin (g/dL)." />
          </label>
          <FieldShell muted>
            <input
              id="ag-globulin"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={globulinDisplay}
              aria-live="polite"
            />
            <span className={unitFixed}>g/dL</span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="ag-ratio">
            A/G ratio
            <InfoTooltip text="Albumin divided by globulin; dimensionless." />
          </label>
          <FieldShell muted>
            <input
              id="ag-ratio"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={ratioDisplay}
              aria-live="polite"
            />
          </FieldShell>
        </div>

        {result?.statusDetail && result.agRatio != null ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.statusDetail}
          </p>
        ) : null}
      </section>
    </form>
  );
}