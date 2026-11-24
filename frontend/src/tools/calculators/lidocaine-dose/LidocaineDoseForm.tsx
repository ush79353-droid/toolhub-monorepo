'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMg, formatMl } from './calculation';
import {
  LIDOCAINE_CONCENTRATION_OPTIONS,
  type LidocaineConcentrationPercent,
  type LidocaineDoseFieldErrors,
  type LidocaineDoseInput,
  type LidocaineDoseResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-primary';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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
  input: LidocaineDoseInput;
  errors: LidocaineDoseFieldErrors;
  result: LidocaineDoseResult | null;
  onChange: (input: LidocaineDoseInput) => void;
}

export function LidocaineDoseForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<LidocaineDoseInput>) =>
    onChange({ ...input, ...patch });

  const mlText =
    result?.maxDoseMl != null ? formatMl(result.maxDoseMl) : '';
  const mgText =
    result?.maxDoseMg != null ? formatMg(result.maxDoseMg) : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Lidocaine dose inputs">
        <h3 className="text-[15px] font-semibold text-accent">Lidocaine dose</h3>

        <div>
          <label className={labelClass} htmlFor="lido-weight">
            Weight
            <InfoTooltip text="Body weight used with the FDA plain-lidocaine maximum of 4.5 mg/kg (capped at 300 mg)." />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.weightText}>
              <input
                id="lido-weight"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.weightText}
                onChange={(e) => set({ weightText: e.target.value })}
                aria-invalid={Boolean(errors.weightText)}
              />
            </FieldShell>
            <select
              className="h-11 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.weightUnit}
              onChange={(e) =>
                set({ weightUnit: e.target.value as 'kg' | 'lb' })
              }
              aria-label="Weight unit"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
          {errors.weightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lido-conc">
            Concentration
            <InfoTooltip text="% w/v lidocaine. Milligrams per milliliter = percent × 10 (0.25% → 2.5 mg/mL)." />
          </label>
          <select
            id="lido-conc"
            className={selectClass}
            value={input.concentrationPercent}
            onChange={(e) =>
              set({
                concentrationPercent: e.target
                  .value as LidocaineConcentrationPercent,
              })
            }
            aria-invalid={Boolean(errors.concentrationPercent)}
          >
            {LIDOCAINE_CONCENTRATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.concentrationPercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.concentrationPercent}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lido-max-ml">
            Max allowable subQ dose, ml
            <InfoTooltip text="Maximum subcutaneous volume = max milligrams ÷ (concentration % × 10). Blank until weight is entered." />
          </label>
          <FieldShell muted>
            <input
              id="lido-max-ml"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-accent`}
              value={mlText}
              aria-live="polite"
            />
            <span className={unitFixed}>mL</span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="lido-max-mg">
            Max allowable subQ dose, mg
            <InfoTooltip text="min(weight kg × 4.5 mg/kg, 300 mg) for lidocaine HCl without epinephrine per FDA/DailyMed adult labeling." />
          </label>
          <FieldShell muted>
            <input
              id="lido-max-mg"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-accent`}
              value={mgText}
              aria-live="polite"
            />
            <span className={unitFixed}>mg</span>
          </FieldShell>
        </div>

        {result?.statusDetail ? (
          <p className="text-xs text-muted-foreground">{result.statusDetail}</p>
        ) : null}
      </section>
    </form>
  );
}
