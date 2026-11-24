'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  MassUnit,
  WeightWatchersPointsFieldErrors,
  WeightWatchersPointsInput,
  WeightWatchersPointsResult,
} from './types';
import { MASS_UNIT_OPTIONS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 font-mono text-xs text-primary outline-none sm:min-w-[3.5rem]';
const unitFixed =
  'shrink-0 pr-3 font-mono text-xs text-primary';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

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
  input: WeightWatchersPointsInput;
  errors: WeightWatchersPointsFieldErrors;
  result: WeightWatchersPointsResult | null;
  onChange: (input: WeightWatchersPointsInput) => void;
}

export function WeightWatchersPointsForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<WeightWatchersPointsInput>) =>
    onChange({ ...input, ...patch });

  const smartDisplay =
    result?.smartPoints != null && Number.isFinite(result.smartPoints)
      ? String(result.smartPoints)
      : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Nutrition inputs">
        <div>
          <label className={labelClass} htmlFor="ww-calories">
            Calories
            <InfoTooltip text="Energy from the nutrition label in kilocalories (kcal). This is the baseline term in the published SmartPoints food formula." />
          </label>
          <FieldShell error={errors.caloriesText}>
            <input
              id="ww-calories"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.caloriesText}
              onChange={(e) => set({ caloriesText: e.target.value })}
              aria-invalid={Boolean(errors.caloriesText)}
            />
            <span className={unitFixed}>kcal</span>
          </FieldShell>
          {errors.caloriesText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.caloriesText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ww-sugar">
            Sugar
            <InfoTooltip text="Total sugars in grams (or milligrams). Sugar raises the SmartPoints estimate in the published formula." />
          </label>
          <FieldShell error={errors.sugarText}>
            <input
              id="ww-sugar"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.sugarText}
              onChange={(e) => set({ sugarText: e.target.value })}
              aria-invalid={Boolean(errors.sugarText)}
            />
            <select
              className={unitSelectClass}
              value={input.sugarUnit}
              onChange={(e) =>
                set({ sugarUnit: e.target.value as MassUnit })
              }
              aria-label="Sugar unit"
            >
              {MASS_UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.sugarText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sugarText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ww-protein">
            Protein
            <InfoTooltip text="Protein in grams (or milligrams). Protein lowers the SmartPoints estimate in the published formula." />
          </label>
          <FieldShell error={errors.proteinText}>
            <input
              id="ww-protein"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.proteinText}
              onChange={(e) => set({ proteinText: e.target.value })}
              aria-invalid={Boolean(errors.proteinText)}
            />
            <select
              className={unitSelectClass}
              value={input.proteinUnit}
              onChange={(e) =>
                set({ proteinUnit: e.target.value as MassUnit })
              }
              aria-label="Protein unit"
            >
              {MASS_UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.proteinText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.proteinText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ww-sat-fat">
            Saturated fat
            <InfoTooltip text="Saturated fat in grams (or milligrams). Saturated fat raises the SmartPoints estimate in the published formula." />
          </label>
          <FieldShell error={errors.saturatedFatText}>
            <input
              id="ww-sat-fat"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.saturatedFatText}
              onChange={(e) => set({ saturatedFatText: e.target.value })}
              aria-invalid={Boolean(errors.saturatedFatText)}
            />
            <select
              className={unitSelectClass}
              value={input.saturatedFatUnit}
              onChange={(e) =>
                set({ saturatedFatUnit: e.target.value as MassUnit })
              }
              aria-label="Saturated fat unit"
            >
              {MASS_UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.saturatedFatText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.saturatedFatText}
            </p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-label="Smart points result">
        <h3 className="text-[15px] font-semibold text-accent">
          Total of your points today
        </h3>
        <div>
          <label className={labelClass} htmlFor="ww-smart-points">
            Smart points
          </label>
          <FieldShell muted>
            <input
              id="ww-smart-points"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={smartDisplay}
              aria-live="polite"
            />
          </FieldShell>
          {result?.statusDetail ? (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {result.statusDetail}
            </p>
          ) : null}
        </div>
      </section>
    </form>
  );
}
