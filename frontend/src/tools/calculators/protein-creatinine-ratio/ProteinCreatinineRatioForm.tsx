'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CreatinineUnit,
  ProteinCreatinineRatioFieldErrors,
  ProteinCreatinineRatioInput,
  ProteinCreatinineRatioResult,
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
  { value: 'g_l', label: 'g/L' },
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
  input: ProteinCreatinineRatioInput;
  errors: ProteinCreatinineRatioFieldErrors;
  result: ProteinCreatinineRatioResult | null;
  onChange: (input: ProteinCreatinineRatioInput) => void;
}

export function ProteinCreatinineRatioForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<ProteinCreatinineRatioInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Protein creatinine inputs">
        <div>
          <label className={labelClass} htmlFor="pcr-protein">
            Urine protein
            <InfoTooltip text="Total urine protein concentration from the same spot sample, in mg/dL (not albumin-only)." />
          </label>
          <FieldShell error={errors.proteinText}>
            <input
              id="pcr-protein"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.proteinText}
              onChange={(e) => set({ proteinText: e.target.value })}
              aria-invalid={Boolean(errors.proteinText)}
            />
            <span className={unitFixed}>mg/dL</span>
          </FieldShell>
          {errors.proteinText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.proteinText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="pcr-creatinine">
            Urine creatinine
            <InfoTooltip text="Urine creatinine from the same sample. g/L × 100 and mmol/L × 11.3 convert to mg/dL before the ratio." />
          </label>
          <FieldShell error={errors.creatinineText}>
            <input
              id="pcr-creatinine"
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
              {CREATININE_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.creatinineText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.creatinineText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="pcr-ratio">
            Protein creatinine ratio
            <InfoTooltip text="UPCR in g/g, shown with the common g/day teaching label. Spot sample approximation — not a timed 24-hour urine." />
          </label>
          <FieldShell muted>
            <input
              id="pcr-ratio"
              type="text"
              readOnly
              className={inputClass}
              value={result?.formattedGg ?? ''}
              aria-readonly="true"
            />
            <span className={unitFixed}>g/day</span>
          </FieldShell>
          {result?.upcrGg != null ? (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Equals {result.formattedGg} g/g creatinine (
              {result.upcrMgG != null
                ? `${Math.round(result.upcrMgG * 10) / 10} mg/g`
                : '—'}
              ). Approximate daily excretion label only.
            </p>
          ) : null}
        </div>
      </section>
    </form>
  );
}
