'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '@/tools/calculators/auto-loan/InfoTooltip';
import { parsePositiveNumber } from './calculation';
import { DrugHalfLifeResults } from './DrugHalfLifeResults';
import type {
  DosageMassUnit,
  DrugHalfLifeFieldErrors,
  DrugHalfLifeInput,
  DrugHalfLifeResult,
  HalfLifeTimeUnit,
} from './types';
import {
  DOSAGE_MASS_UNIT_LABELS,
  HALF_LIFE_TIME_UNIT_LABELS,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const inputClass =
  'h-11 w-full flex-1 rounded-lg border border-border bg-white px-3 text-sm tabular-nums text-accent outline-none focus:ring-2 focus:ring-ring';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-sm font-medium text-primary outline-none focus:ring-2 focus:ring-ring';

interface Props {
  input: DrugHalfLifeInput;
  errors: DrugHalfLifeFieldErrors;
  result: DrugHalfLifeResult | null;
  onChange: (input: DrugHalfLifeInput) => void;
}

/** Minutes per unit — used to preserve physical half-life when switching units. */
const MINUTES_PER: Record<HalfLifeTimeUnit, number> = {
  min: 1,
  h: 60,
  d: 60 * 24,
};

/** Milligrams per unit — preserve physical dosage on unit switch. */
const MG_PER: Record<DosageMassUnit, number> = {
  mcg: 0.001,
  mg: 1,
  g: 1000,
};

function formatConverted(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Number.isInteger(value)) return String(value);
  const rounded = Number(value.toPrecision(10));
  return String(rounded);
}

export function DrugHalfLifeForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<DrugHalfLifeInput>) => onChange({ ...input, ...patch });

  const switchHalfLifeUnit = (next: HalfLifeTimeUnit) => {
    if (next === input.halfLifeUnit) return;
    const parsed = parsePositiveNumber(input.halfLifeText);
    if (parsed == null || !(parsed > 0)) {
      set({ halfLifeUnit: next });
      return;
    }
    const minutes = parsed * MINUTES_PER[input.halfLifeUnit];
    const converted = minutes / MINUTES_PER[next];
    set({ halfLifeUnit: next, halfLifeText: formatConverted(converted) });
  };

  const switchDosageUnit = (next: DosageMassUnit) => {
    if (next === input.dosageUnit) return;
    const parsed = parsePositiveNumber(input.dosageText);
    if (parsed == null || !(parsed > 0)) {
      set({ dosageUnit: next });
      return;
    }
    const mg = parsed * MG_PER[input.dosageUnit];
    const converted = mg / MG_PER[next];
    set({ dosageUnit: next, dosageText: formatConverted(converted) });
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate autoComplete="off">
      <section className={sectionClass} aria-label="Half-life and dosage inputs">
        <Field
          label="Half-life"
          htmlFor="drug-halflife-t12"
          error={errors.halfLifeText}
          tooltip="Time for the amount of drug in the body to fall by half under first-order elimination (t½)."
        >
          <div className="flex gap-2">
            <input
              id="drug-halflife-t12"
              className={inputClass}
              value={input.halfLifeText}
              inputMode="decimal"
              placeholder=""
              aria-invalid={Boolean(errors.halfLifeText)}
              onChange={(e) => set({ halfLifeText: e.target.value })}
            />
            <select
              className={selectClass}
              value={input.halfLifeUnit}
              aria-label="Half-life time unit"
              onChange={(e) => switchHalfLifeUnit(e.target.value as HalfLifeTimeUnit)}
            >
              {(Object.keys(HALF_LIFE_TIME_UNIT_LABELS) as HalfLifeTimeUnit[]).map((u) => (
                <option key={u} value={u}>
                  {HALF_LIFE_TIME_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
        </Field>

        <Field
          label="Dosage"
          htmlFor="drug-halflife-dose"
          error={errors.dosageText}
          tooltip="Initial amount of drug present at administration (A₀). Remaining mass uses the same unit."
        >
          <div className="flex gap-2">
            <input
              id="drug-halflife-dose"
              className={inputClass}
              value={input.dosageText}
              inputMode="decimal"
              placeholder=""
              aria-invalid={Boolean(errors.dosageText)}
              onChange={(e) => set({ dosageText: e.target.value })}
            />
            <select
              className={selectClass}
              value={input.dosageUnit}
              aria-label="Dosage mass unit"
              onChange={(e) => switchDosageUnit(e.target.value as DosageMassUnit)}
            >
              {(Object.keys(DOSAGE_MASS_UNIT_LABELS) as DosageMassUnit[]).map((u) => (
                <option key={u} value={u}>
                  {DOSAGE_MASS_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
        </Field>
      </section>

      <DrugHalfLifeResults result={result} />
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  tooltip,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  tooltip: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={htmlFor}>
        {label}
        <InfoTooltip label={label} text={tooltip} />
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
