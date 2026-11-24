'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { GastricSleeveWeightLossResults } from './GastricSleeveWeightLossResults';
import type {
  GastricSleeveWeightLossFieldErrors,
  GastricSleeveWeightLossInput,
  GastricSleeveWeightLossResult,
  HeightUnit,
  SurgeryType,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface Props {
  input: GastricSleeveWeightLossInput;
  errors: GastricSleeveWeightLossFieldErrors;
  result: GastricSleeveWeightLossResult | null;
  onChange: (input: GastricSleeveWeightLossInput) => void;
}

export function GastricSleeveWeightLossForm({
  input,
  errors,
  result,
  onChange,
}: Props) {
  const set = (patch: Partial<GastricSleeveWeightLossInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass}>
        <div>
          <label className={labelClass} htmlFor="gs-height">
            Height
          </label>
          <FieldShell error={errors.heightText}>
            <input
              id="gs-height"
              className={inputClass}
              inputMode="decimal"
              value={input.heightText}
              onChange={(e) => set({ heightText: e.target.value })}
              aria-invalid={Boolean(errors.heightText)}
            />
            <select
              className={unitSelectClass}
              value={input.heightUnit}
              onChange={(e) =>
                set({ heightUnit: e.target.value as HeightUnit })
              }
              aria-label="Height unit"
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
            </select>
          </FieldShell>
          {errors.heightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heightText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="gs-weight">
            Weight
            <InfoTooltip text="Current (preoperative) body weight. Used with height to compute BMI and excess weight above the BMI 25 reference." />
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="gs-weight"
              className={inputClass}
              inputMode="decimal"
              value={input.weightText}
              onChange={(e) => set({ weightText: e.target.value })}
              aria-invalid={Boolean(errors.weightText)}
            />
            <select
              className={unitSelectClass}
              value={input.weightUnit}
              onChange={(e) =>
                set({ weightUnit: e.target.value as WeightUnit })
              }
              aria-label="Weight unit"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </FieldShell>
          {errors.weightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="gs-bmi">
            BMI
            <InfoTooltip text="BMI = weight (kg) ÷ height (m)². Computed from height and weight — not entered separately." />
          </label>
          <FieldShell>
            <input
              id="gs-bmi"
              className={`${inputClass} text-muted-foreground`}
              readOnly
              value={result?.formattedBmi ?? ''}
              aria-label="Body mass index"
              tabIndex={-1}
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">
              kg/m²
            </span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="gs-surgery">
            Surgery type
          </label>
          <select
            id="gs-surgery"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 font-mono text-sm font-semibold text-accent outline-none focus:ring-2 focus:ring-ring"
            value={input.surgeryType}
            onChange={(e) =>
              set({ surgeryType: e.target.value as SurgeryType | '' })
            }
            aria-invalid={Boolean(errors.surgeryType)}
          >
            <option value="gastric_sleeve">Gastric sleeve</option>
          </select>
          {errors.surgeryType ? (
            <p className="mt-1 text-xs text-rose-600">{errors.surgeryType}</p>
          ) : null}
        </div>

        {errors.form ? (
          <p className="text-xs text-rose-600" role="alert">
            {errors.form}
          </p>
        ) : null}
      </section>

      <GastricSleeveWeightLossResults result={result} />
    </form>
  );
}
