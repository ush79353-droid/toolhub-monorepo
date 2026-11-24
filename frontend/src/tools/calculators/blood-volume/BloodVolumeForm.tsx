'use client';

import type { ReactNode } from 'react';
import { formatVolumeMl } from './calculation';
import type {
  BloodVolumeFieldErrors,
  BloodVolumeInput,
  BloodVolumeResult,
  HeightUnit,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

interface Props {
  input: BloodVolumeInput;
  errors: BloodVolumeFieldErrors;
  result: BloodVolumeResult | null;
  onChange: (input: BloodVolumeInput) => void;
}

export function BloodVolumeForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<BloodVolumeInput>) => onChange({ ...input, ...patch });

  const resultField = (label: string, value: number | null) => (
    <div key={label}>
      <label className={labelClass}>{label}</label>
      <div className="flex gap-2">
        <input
          className={inputClass}
          readOnly
          value={formatVolumeMl(value)}
          aria-label={label}
        />
        <span className="flex h-11 items-center rounded-lg border border-border px-3 text-sm">
          mL
        </span>
      </div>
    </div>
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate autoComplete="off">
      <section className={sectionClass}>
        <motionField label="Height" error={errors.heightText}>
          <div className="flex gap-2">
            <input
              className={`${inputClass} flex-1`}
              value={input.heightText}
              inputMode="decimal"
              onChange={(e) => set({ heightText: e.target.value })}
            />
            <select
              className="h-11 rounded-lg border border-border px-2 text-sm"
              value={input.heightUnit}
              onChange={(e) => set({ heightUnit: e.target.value as HeightUnit })}
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
            </select>
          </div>
        </motionField>
        <motionField label="Weight" error={errors.weightText}>
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
        </motionField>
      </section>

      {result?.nadlerFemaleMl != null && (
        <section className={sectionClass}>
          <h3 className="text-sm font-semibold text-accent">Nadler&apos;s formula</h3>
          {resultField('Blood volume for females', result.nadlerFemaleMl)}
          {resultField('Blood volume for males', result.nadlerMaleMl)}
        </section>
      )}

      {result?.lbbFemaleMl != null && (
        <section className={sectionClass}>
          <h3 className="text-sm font-semibold text-accent">
            Lemmens-Bernstein-Brodsky formula
          </h3>
          {resultField('Blood volume based on BMI for females', result.lbbFemaleMl)}
          {resultField('Blood volume based on BMI for males', result.lbbMaleMl)}
        </section>
      )}

      {result?.weightFemaleMl != null && (
        <section className={sectionClass}>
          <h3 className="text-sm font-semibold text-accent">Based on weight</h3>
          {resultField('Blood volume based on weight for females', result.weightFemaleMl)}
          {resultField('Blood volume based on weight for males', result.weightMaleMl)}
        </section>
      )}
    </form>
  );
}

function motionField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}