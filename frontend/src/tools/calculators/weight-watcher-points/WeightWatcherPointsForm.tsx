'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '@/tools/calculators/auto-loan/InfoTooltip';
import {
  MASS_UNIT_OPTIONS,
  type MassUnit,
  type WeightWatcherPointsFieldErrors,
  type WeightWatcherPointsInput,
  type WeightWatcherPointsResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const inputClass =
  'h-11 w-full min-w-0 flex-1 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 font-mono text-xs text-primary outline-none sm:min-w-[3.5rem]';
const unitFixed =
  'shrink-0 pr-3 font-mono text-xs font-medium text-primary';

/** Grams per ounce (avoirdupois). */
const G_PER_OZ = 28.349523125;

function formatConverted(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Number.isInteger(value)) return String(value);
  const rounded = Number(value.toPrecision(12));
  return String(rounded);
}

function toGrams(amount: number, unit: MassUnit): number {
  if (unit === 'g') return amount;
  if (unit === 'mg') return amount / 1000;
  return amount * G_PER_OZ;
}

function fromGrams(grams: number, unit: MassUnit): number {
  if (unit === 'g') return grams;
  if (unit === 'mg') return grams * 1000;
  return grams / G_PER_OZ;
}

function formatSmartPoints(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return String(value);
}

interface Props {
  input: WeightWatcherPointsInput;
  errors: WeightWatcherPointsFieldErrors;
  result: WeightWatcherPointsResult | null;
  onChange: (input: WeightWatcherPointsInput) => void;
}

export function WeightWatcherPointsForm({
  input,
  errors,
  result,
  onChange,
}: Props) {
  const set = (patch: Partial<WeightWatcherPointsInput>) =>
    onChange({ ...input, ...patch });

  const switchMassUnit = (
    field: 'sugar' | 'protein' | 'saturatedFat',
    next: MassUnit,
  ) => {
    const unitKey = `${field}Unit` as const;
    const textKey = `${field}Text` as const;
    const currentUnit = input[unitKey];
    if (next === currentUnit) return;
    const raw = input[textKey].trim().replace(/,/g, '');
    if (raw === '') {
      set({ [unitKey]: next } as Partial<WeightWatcherPointsInput>);
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n)) {
      set({ [unitKey]: next } as Partial<WeightWatcherPointsInput>);
      return;
    }
    const grams = toGrams(n, currentUnit);
    const converted = fromGrams(grams, next);
    set({
      [unitKey]: next,
      [textKey]: formatConverted(converted),
    } as Partial<WeightWatcherPointsInput>);
  };

  const smartDisplay = formatSmartPoints(result?.smartPoints ?? null);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-accent sm:text-sm">
        <p className="font-semibold text-amber-950">
          Educational SmartPoints estimate — not the WW app
        </p>
        <p className="mt-1.5 text-foreground/85">
          Uses the publicly documented historical SmartPoints (2015–2021) food
          formula from calories, sugar, protein, and saturated fat. Not
          affiliated with WW International. Entries stay in your browser only.
        </p>
      </div>

      <section className={sectionClass} aria-label="Nutrition inputs">
        <Field
          label="Calories"
          htmlFor="ww-calories"
          error={errors.caloriesText}
          tooltip="Energy from the nutrition label for one serving (or the portion you are scoring), in kilocalories."
        >
          <div
            className={`flex h-11 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
              errors.caloriesText ? 'border-rose-400' : ''
            }`}
          >
            <input
              id="ww-calories"
              className={inputClass}
              value={input.caloriesText}
              inputMode="decimal"
              placeholder=""
              aria-invalid={Boolean(errors.caloriesText)}
              onChange={(e) => set({ caloriesText: e.target.value })}
            />
            <span className={unitFixed}>kcal</span>
          </div>
        </Field>

        <MassField
          label="Sugar"
          htmlFor="ww-sugar"
          error={errors.sugarText}
          tooltip="Total sugars from the label for the same serving basis as calories."
          value={input.sugarText}
          unit={input.sugarUnit}
          onValueChange={(sugarText) => set({ sugarText })}
          onUnitChange={(unit) => switchMassUnit('sugar', unit)}
        />

        <MassField
          label="Protein"
          htmlFor="ww-protein"
          error={errors.proteinText}
          tooltip="Protein grams from the label. Protein lowers SmartPoints in the historical formula."
          value={input.proteinText}
          unit={input.proteinUnit}
          onValueChange={(proteinText) => set({ proteinText })}
          onUnitChange={(unit) => switchMassUnit('protein', unit)}
        />

        <MassField
          label="Saturated fat"
          htmlFor="ww-sat-fat"
          error={errors.saturatedFatText}
          tooltip="Saturated fat from the label for the same serving. Higher saturated fat raises SmartPoints."
          value={input.saturatedFatText}
          unit={input.saturatedFatUnit}
          onValueChange={(saturatedFatText) => set({ saturatedFatText })}
          onUnitChange={(unit) => switchMassUnit('saturatedFat', unit)}
        />
      </section>

      <section
        className={`${sectionClass} border-t-0`}
        aria-label="Smart points result"
      >
        <h3 className="text-[15px] font-semibold text-accent">
          Total of your points today
        </h3>
        <Field
          label="Smart points"
          htmlFor="ww-smart-points"
          error={undefined}
          tooltip="Whole SmartPoints for the entered serving using the historical 2015–2021 food formula. Blank until all four nutrition fields are valid."
        >
          <div className="flex h-11 items-center rounded-lg border border-sky-200 bg-sky-50/60 focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ww-smart-points"
              className={inputClass}
              value={smartDisplay}
              readOnly
              tabIndex={-1}
              aria-readonly="true"
              placeholder=""
            />
          </div>
        </Field>
        {result?.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.statusDetail}
          </p>
        ) : null}
      </section>
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
        <span>{label}</span>
        <InfoTooltip label={label} text={tooltip} />
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function MassField({
  label,
  htmlFor,
  error,
  tooltip,
  value,
  unit,
  onValueChange,
  onUnitChange,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  tooltip: string;
  value: string;
  unit: MassUnit;
  onValueChange: (value: string) => void;
  onUnitChange: (unit: MassUnit) => void;
}) {
  return (
    <Field label={label} htmlFor={htmlFor} error={error} tooltip={tooltip}>
      <div
        className={`flex h-11 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
          error ? 'border-rose-400' : ''
        }`}
      >
        <input
          id={htmlFor}
          className={inputClass}
          value={value}
          inputMode="decimal"
          placeholder=""
          aria-invalid={Boolean(error)}
          onChange={(e) => onValueChange(e.target.value)}
        />
        <select
          className={unitSelectClass}
          value={unit}
          aria-label={`${label} unit`}
          onChange={(e) => onUnitChange(e.target.value as MassUnit)}
        >
          {MASS_UNIT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </Field>
  );
}
