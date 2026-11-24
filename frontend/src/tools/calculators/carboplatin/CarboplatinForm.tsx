'use client';

import type { ReactNode } from 'react';
import { formatGfr, formatMg } from './calculation';
import type {
  CarboplatinFieldErrors,
  CarboplatinInput,
  CarboplatinResult,
  WeightUnit,
} from './types';

const labelClass = 'mb-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

interface Props {
  input: CarboplatinInput;
  errors: CarboplatinFieldErrors;
  result: CarboplatinResult | null;
  onChange: (input: CarboplatinInput) => void;
}

export function CarboplatinForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<CarboplatinInput>) => onChange({ ...input, ...patch });

  const loadExample = (which: 1 | 2) => {
    if (which === 1) {
      onChange({
        ...input,
        sex: 'male',
        ageYearsText: '50',
        weightText: '80',
        weightUnit: 'kg',
        scrMgDlText: '1',
        targetAucText: '5',
      });
    } else {
      onChange({
        ...input,
        sex: 'female',
        ageYearsText: '60',
        weightText: '65',
        weightUnit: 'kg',
        scrMgDlText: '1.2',
        targetAucText: '5',
      });
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate autoComplete="off">
      <section className={sectionClass}>
        <fieldset>
          <legend className={labelClass}>Sex</legend>
          <div className="flex gap-4 text-sm capitalize">
            {(['male', 'female'] as const).map((s) => (
              <label key={s} className="flex items-center gap-2">
                <input type="radio" checked={input.sex === s} onChange={() => set({ sex: s })} />
                {s}
              </label>
            ))}
          </div>
        </fieldset>

        <Field label="Age" suffix="years" error={errors.ageYearsText}>
          <input
            className={inputClass}
            value={input.ageYearsText}
            inputMode="numeric"
            onChange={(e) => set({ ageYearsText: e.target.value })}
          />
        </Field>

        <Field label="Weight" error={errors.weightText}>
          <div className="flex gap-2">
            <input
              className={`${inputClass} flex-1`}
              value={input.weightText}
              inputMode="decimal"
              onChange={(e) => set({ weightText: e.target.value })}
            />
            <select
              className="h-11 rounded-lg border border-border px-2 text-sm"
              value={input.weightUnit}
              onChange={(e) => set({ weightUnit: e.target.value as WeightUnit })}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </Field>

        <Field label="Serum creatinine" error={errors.scrMgDlText}>
          <div className="flex gap-2">
            <input
              className={`${inputClass} flex-1`}
              value={input.scrMgDlText}
              inputMode="decimal"
              onChange={(e) => set({ scrMgDlText: e.target.value })}
            />
            <span className="flex h-11 items-center px-2 text-sm">mg/dL</span>
          </div>
        </Field>

        <Field label="Target AUC" error={errors.targetAucText}>
          <input
            className={inputClass}
            value={input.targetAucText}
            inputMode="decimal"
            onChange={(e) => set({ targetAucText: e.target.value })}
          />
        </Field>
      </section>

      {result?.gfrMlMin != null ? (
        <section className={sectionClass}>
          <Field label="GFR">
            <div className="flex gap-2">
              <input className={inputClass} readOnly value={formatGfr(result.gfrMlMin)} />
              <span className="flex h-11 items-center px-2 text-sm">mL/min</span>
            </div>
          </Field>
          <Field label="Carboplatin dose">
            <div className="flex gap-2">
              <input className={inputClass} readOnly value={formatMg(result.carboplatinDoseMg)} />
              <span className="flex h-11 items-center px-2 text-sm">mg</span>
            </div>
          </Field>
          <Field label="Maximum dose">
            <div className="flex gap-2">
              <input className={inputClass} readOnly value={formatMg(result.maximumDoseMg)} />
              <span className="flex h-11 items-center px-2 text-sm">mg</span>
            </div>
          </Field>
        </section>
      ) : null}

      <section className={sectionClass}>
        <p className="text-sm font-medium">Check our examples</p>
        <button type="button" className="text-sm text-primary underline" onClick={() => loadExample(1)}>
          Example 1 — Male patient
        </button>
        <button
          type="button"
          className="ml-4 text-sm text-primary underline"
          onClick={() => loadExample(2)}
        >
          Example 2 — Female patient
        </button>
      </section>
    </form>
  );
}

function Field({
  label,
  suffix,
  error,
  children,
}: {
  label: string;
  suffix?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {suffix ? <span className="ml-1 font-normal text-muted-foreground">{suffix}</span> : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}