'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { heightToCm, parseNumber, weightToKg } from './calculation';
import type {
  HeightUnit,
  RmrFieldErrors,
  RmrInput,
  RmrResult,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';
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
  input: RmrInput;
  errors: RmrFieldErrors;
  result: RmrResult | null;
  onChange: (input: RmrInput) => void;
}

export function RmrForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<RmrInput>) => onChange({ ...input, ...patch });

  const switchHeight = (next: HeightUnit) => {
    if (next === input.heightUnit) return;
    const raw = parseNumber(input.heightText);
    if (raw === null) {
      set({ heightUnit: next });
      return;
    }
    const cm = heightToCm(raw, input.heightUnit);
    const converted = next === 'cm' ? cm : cm / 2.54;
    set({
      heightUnit: next,
      heightText: formatConverted(converted, next === 'cm' ? 1 : 2),
    });
  };

  const switchWeight = (next: WeightUnit) => {
    if (next === input.weightUnit) return;
    const raw = parseNumber(input.weightText);
    if (raw === null) {
      set({ weightUnit: next });
      return;
    }
    const kg = weightToKg(raw, input.weightUnit);
    const converted = next === 'kg' ? kg : kg / 0.45359237;
    set({
      weightUnit: next,
      weightText: formatConverted(converted, 1),
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass}>
        <fieldset>
          <legend className={labelClass}>Sex</legend>
          <div className="flex flex-wrap gap-4" role="radiogroup" aria-label="Sex">
            {(['male', 'female'] as const).map((sex) => (
              <label
                key={sex}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="rmr-sex"
                  className="h-4 w-4 accent-primary"
                  checked={input.sex === sex}
                  onChange={() => set({ sex })}
                />
                <span className="capitalize">{sex}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="rmr-age">
            Age
            <InfoTooltip text="Chronological age in years for Harris–Benedict resting energy (adult eligibility 15–100)." />
          </label>
          <FieldShell error={errors.ageYearsText}>
            <input
              id="rmr-age"
              className={inputClass}
              inputMode="decimal"
              value={input.ageYearsText}
              onChange={(e) => set({ ageYearsText: e.target.value })}
              aria-invalid={Boolean(errors.ageYearsText)}
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">
              years
            </span>
          </FieldShell>
          {errors.ageYearsText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageYearsText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="rmr-height">
            Height
            <InfoTooltip text="Converted to centimetres before RMR. Switching units preserves physical height." />
          </label>
          <FieldShell error={errors.heightText}>
            <input
              id="rmr-height"
              className={inputClass}
              inputMode="decimal"
              value={input.heightText}
              onChange={(e) => set({ heightText: e.target.value })}
              aria-invalid={Boolean(errors.heightText)}
            />
            <select
              className={unitSelectClass}
              value={input.heightUnit}
              onChange={(e) => switchHeight(e.target.value as HeightUnit)}
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
          <label className={labelClass} htmlFor="rmr-weight">
            Weight
            <InfoTooltip text="Converted to kilograms before RMR. Switching units preserves physical mass." />
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="rmr-weight"
              className={inputClass}
              inputMode="decimal"
              value={input.weightText}
              onChange={(e) => set({ weightText: e.target.value })}
              aria-invalid={Boolean(errors.weightText)}
            />
            <select
              className={unitSelectClass}
              value={input.weightUnit}
              onChange={(e) => switchWeight(e.target.value as WeightUnit)}
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
      </section>

      <section className={sectionClass} aria-live="polite" aria-label="Results">
        <div>
          <label className={labelClass} htmlFor="rmr-result">
            Resting metabolic rate
            <InfoTooltip text="Harris–Benedict (1919) × TEF 1.1 resting energy (kcal/day). No activity multiplier." />
          </label>
          <FieldShell>
            <input
              id="rmr-result"
              readOnly
              className={`${inputClass} bg-sky-50/60`}
              value={result?.rmrDisplay ?? ''}
              aria-label="Resting metabolic rate result"
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">
              kcal/day
            </span>
          </FieldShell>
        </div>
        {result?.statusHeadline ? (
          <div className="space-y-1">
            <p className="text-sm font-medium text-accent">{result.statusHeadline}</p>
            <p className="text-sm text-muted-foreground">{result.statusDetail}</p>
            {result.equationLabel ? (
              <p className="text-xs text-muted-foreground">{result.equationLabel}</p>
            ) : null}
            <p className="text-xs text-muted-foreground">{result.disclaimer}</p>
          </div>
        ) : null}
      </section>
    </form>
  );
}

function formatConverted(n: number, digits: number): string {
  if (!Number.isFinite(n)) return '';
  const f = Number(n.toFixed(digits));
  return String(f);
}
