'use client';

import type { ReactNode } from 'react';
import { fromCm, parseOptionalNumber, toCm } from './calculation';
import { FetalWeightPercentileChart } from './FetalWeightPercentileChart';
import type {
  FetalSex,
  FetalWeightPercentileFieldErrors,
  FetalWeightPercentileInput,
  FetalWeightPercentileResult,
  LengthUnit,
  WeightUnit,
} from './types';

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex h-11 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface Props {
  input: FetalWeightPercentileInput;
  errors: FetalWeightPercentileFieldErrors;
  result: FetalWeightPercentileResult | null;
  onChange: (next: FetalWeightPercentileInput) => void;
}

export function FetalWeightPercentileForm({
  input,
  errors,
  result,
  onChange,
}: Props) {
  const set = (patch: Partial<FetalWeightPercentileInput>) =>
    onChange({ ...input, ...patch });

  const switchLengthUnit = (unit: LengthUnit) => {
    if (unit === input.lengthUnit) return;
    const convert = (raw: string) => {
      const n = parseOptionalNumber(raw);
      if (n === null) return raw;
      const cm = toCm(n, input.lengthUnit);
      const next = fromCm(cm, unit);
      return unit === 'mm'
        ? String(Math.round(next * 10) / 10)
        : String(Math.round(next * 1000) / 1000);
    };
    set({
      lengthUnit: unit,
      ac: convert(input.ac),
      hc: convert(input.hc),
      bpd: convert(input.bpd),
      fl: convert(input.fl),
    });
  };

  const lengthFields: {
    key: 'ac' | 'hc' | 'bpd' | 'fl';
    label: string;
    id: string;
  }[] = [
    { key: 'ac', label: 'Abdominal circumference', id: 'fw-ac' },
    { key: 'hc', label: 'Head circumference', id: 'fw-hc' },
    { key: 'bpd', label: 'Biparietal diameter', id: 'fw-bpd' },
    { key: 'fl', label: 'Femur length', id: 'fw-fl' },
  ];

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className={labelClass}>Sex</legend>
        <div className="flex flex-wrap gap-4 text-sm" role="radiogroup">
          {(
            [
              ['girl', 'Girl'],
              ['boy', 'Boy'],
              ['unknown', 'Unknown'],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="fetal-sex"
                className="h-4 w-4 accent-primary"
                checked={input.sex === value}
                onChange={() => set({ sex: value as FetalSex })}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="fw-weeks">
          Gestational age
        </label>
        <FieldShell error={Boolean(errors.weeks)}>
          <input
            id="fw-weeks"
            className={inputClass}
            inputMode="numeric"
            autoComplete="off"
            value={input.weeks}
            aria-invalid={Boolean(errors.weeks)}
            onChange={(e) => set({ weeks: e.target.value })}
          />
          <select
            className={selectClass}
            aria-label="Gestational age unit"
            value={input.ageUnit}
            onChange={() => set({ ageUnit: 'wks' })}
          >
            <option value="wks">wks</option>
          </select>
        </FieldShell>
        {errors.weeks ? (
          <p className="mt-1 text-xs text-rose-600">{errors.weeks}</p>
        ) : null}
      </div>

      {lengthFields.map((field) => (
        <div key={field.key}>
          <label className={labelClass} htmlFor={field.id}>
            {field.label}
          </label>
          <FieldShell error={Boolean(errors[field.key])}>
            <input
              id={field.id}
              className={inputClass}
              inputMode="decimal"
              autoComplete="off"
              value={input[field.key]}
              aria-invalid={Boolean(errors[field.key])}
              onChange={(e) => set({ [field.key]: e.target.value })}
            />
            <select
              className={selectClass}
              aria-label={`${field.label} unit`}
              value={input.lengthUnit}
              onChange={(e) =>
                switchLengthUnit(e.target.value as LengthUnit)
              }
            >
              <option value="mm">mm</option>
              <option value="cm">cm</option>
            </select>
          </FieldShell>
          {errors[field.key] ? (
            <p className="mt-1 text-xs text-rose-600">{errors[field.key]}</p>
          ) : null}
        </div>
      ))}

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}

      {result ? (
        <div className="space-y-4 rounded-xl border border-border bg-muted/10 p-4">
          <p className="text-sm font-semibold text-accent">Result</p>
          <div>
            <label className={labelClass} htmlFor="fw-efw">
              Estimated fetal weight
            </label>
            <FieldShell>
              <input
                id="fw-efw"
                className={inputClass}
                readOnly
                value={
                  result.resultWeightUnit === 'g'
                    ? result.efwDisplay.toFixed(2)
                    : String(
                        Math.round(result.efwDisplay * 1000) / 1000,
                      )
                }
              />
              <select
                className={selectClass}
                aria-label="Estimated fetal weight unit"
                value={input.resultWeightUnit}
                onChange={(e) =>
                  set({ resultWeightUnit: e.target.value as WeightUnit })
                }
              >
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </FieldShell>
          </div>
          <FetalWeightPercentileChart result={result} />
        </div>
      ) : null}
    </div>
  );
}
