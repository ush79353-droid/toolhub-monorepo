'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatFeurea } from './calculation';
import type {
  CreatinineUnit,
  FeureaFieldErrors,
  FeureaInput,
  FeureaResult,
  UreaUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';

const CREATININE_UNITS: { value: CreatinineUnit; label: string }[] = [
  { value: 'mg_dl', label: 'mg/dL' },
  { value: 'umol_l', label: 'µmol/L' },
];

const UREA_UNITS: { value: UreaUnit; label: string }[] = [
  { value: 'mg_dl_urea', label: 'mg/dL' },
  { value: 'mg_dl_bun', label: 'mg/dL (BUN)' },
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
  input: FeureaInput;
  errors: FeureaFieldErrors;
  result: FeureaResult | null;
  onChange: (input: FeureaInput) => void;
}

export function FeureaForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<FeureaInput>) => onChange({ ...input, ...patch });
  const feureaDisplay =
    result?.feureaPercent != null ? formatFeurea(result.feureaPercent) : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="FEUrea lab inputs">
        <div>
          <label className={labelClass} htmlFor="feurea-scr">
            Serum creatinine
            <InfoTooltip text="Serum creatinine. Match the urine creatinine unit (mg/dL or µmol/L)." />
          </label>
          <FieldShell error={errors.serumCreatinineText}>
            <input
              id="feurea-scr"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.serumCreatinineText}
              onChange={(e) => set({ serumCreatinineText: e.target.value })}
              aria-invalid={Boolean(errors.serumCreatinineText)}
            />
            <select
              className={unitSelectClass}
              value={input.serumCreatinineUnit}
              onChange={(e) =>
                set({
                  serumCreatinineUnit: e.target.value as CreatinineUnit,
                })
              }
              aria-label="Serum creatinine unit"
            >
              {CREATININE_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.serumCreatinineText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.serumCreatinineText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="feurea-surea">
            Serum urea / blood urea nitrogen
            <InfoTooltip text="Serum urea or BUN. If one specimen is BUN (nitrogen) and the other is whole urea, values are normalized to urea mg/dL before the ratio." />
          </label>
          <FieldShell error={errors.serumUreaText}>
            <input
              id="feurea-surea"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.serumUreaText}
              onChange={(e) => set({ serumUreaText: e.target.value })}
              aria-invalid={Boolean(errors.serumUreaText)}
            />
            <select
              className={unitSelectClass}
              value={input.serumUreaUnit}
              onChange={(e) =>
                set({ serumUreaUnit: e.target.value as UreaUnit })
              }
              aria-label="Serum urea unit"
            >
              {UREA_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.serumUreaText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.serumUreaText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="feurea-ucr">
            Urine creatinine
            <InfoTooltip text="Urine creatinine. Must be &gt; 0. Match the serum creatinine unit." />
          </label>
          <FieldShell error={errors.urineCreatinineText}>
            <input
              id="feurea-ucr"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.urineCreatinineText}
              onChange={(e) => set({ urineCreatinineText: e.target.value })}
              aria-invalid={Boolean(errors.urineCreatinineText)}
            />
            <select
              className={unitSelectClass}
              value={input.urineCreatinineUnit}
              onChange={(e) =>
                set({
                  urineCreatinineUnit: e.target.value as CreatinineUnit,
                })
              }
              aria-label="Urine creatinine unit"
            >
              {CREATININE_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.urineCreatinineText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.urineCreatinineText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="feurea-uurea">
            Urine urea
            <InfoTooltip text="Urine urea (or urine urea nitrogen if BUN unit selected). Keep analyte basis consistent with serum, or rely on automatic nitrogen↔urea normalization." />
          </label>
          <FieldShell error={errors.urineUreaText}>
            <input
              id="feurea-uurea"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.urineUreaText}
              onChange={(e) => set({ urineUreaText: e.target.value })}
              aria-invalid={Boolean(errors.urineUreaText)}
            />
            <select
              className={unitSelectClass}
              value={input.urineUreaUnit}
              onChange={(e) =>
                set({ urineUreaUnit: e.target.value as UreaUnit })
              }
              aria-label="Urine urea unit"
            >
              {UREA_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.urineUreaText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.urineUreaText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="feurea-result">
            Fractional excretion of urea (FEUrea)
            <InfoTooltip text="Fractional excretion of urea as a percentage." />
          </label>
          <FieldShell muted>
            <input
              id="feurea-result"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={feureaDisplay}
              aria-live="polite"
            />
            <span className={unitFixed}>%</span>
          </FieldShell>
        </div>

        {result?.feureaPercent != null && result.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.bandLabel ? (
              <span className="font-semibold text-accent">
                Band {result.bandLabel}.{' '}
              </span>
            ) : null}
            {result.statusDetail}
          </p>
        ) : null}
      </section>
    </form>
  );
}
