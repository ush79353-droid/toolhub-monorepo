'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMg, LB_PER_KG, parseNumber } from './calculation';
import type {
  TpaStrokeFieldErrors,
  TpaStrokeInput,
  TpaStrokeResult,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-primary';
const unitSelect =
  'h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-sm font-medium text-primary outline-none focus:ring-2 focus:ring-ring';

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

function formatConverted(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toPrecision(10)));
}

interface FormProps {
  input: TpaStrokeInput;
  errors: TpaStrokeFieldErrors;
  result: TpaStrokeResult | null;
  onChange: (input: TpaStrokeInput) => void;
}

export function TpaStrokeForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<TpaStrokeInput>) =>
    onChange({ ...input, ...patch });

  const switchWeightUnit = (next: WeightUnit) => {
    if (next === input.weightUnit) return;
    const n = parseNumber(input.weightText);
    if (n === null) {
      set({ weightUnit: next });
      return;
    }
    const kg = input.weightUnit === 'kg' ? n : n / LB_PER_KG;
    set({
      weightUnit: next,
      weightText: formatConverted(next === 'kg' ? kg : kg * LB_PER_KG),
    });
  };

  const doseText =
    result?.totalDoseMg != null ? formatMg(result.totalDoseMg) : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="tPA stroke dosing inputs">
        <h3 className="text-[15px] font-semibold text-accent">
          Alteplase stroke dose
        </h3>

        <div>
          <label className={labelClass} htmlFor="tpa-weight">
            Weight
            <InfoTooltip text="Body weight for labeled Activase (alteplase) acute ischemic stroke dosing: 0.9 mg/kg, not to exceed 90 mg. Switching kg/lb preserves the physical weight." />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.weightText}>
              <input
                id="tpa-weight"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.weightText}
                onChange={(e) => set({ weightText: e.target.value })}
                aria-invalid={Boolean(errors.weightText)}
              />
            </FieldShell>
            <select
              className={unitSelect}
              value={input.weightUnit}
              onChange={(e) =>
                switchWeightUnit(e.target.value as WeightUnit)
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
          <label className={labelClass} htmlFor="tpa-needed">
            tPA needed
            <InfoTooltip text="Total alteplase dose = min(weight kg × 0.9 mg/kg, 90 mg) per FDA/DailyMed Activase acute ischemic stroke labeling. Blank until weight is entered." />
          </label>
          <FieldShell muted>
            <input
              id="tpa-needed"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-accent`}
              value={doseText}
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
