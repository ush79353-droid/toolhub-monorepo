'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '@/tools/calculators/auto-loan/InfoTooltip';
import {
  ACTIVITY_OPTIONS,
  AGE_BAND_OPTIONS,
  type DriAgeBand,
  type DriActivityId,
  type DriFieldErrors,
  type DriInput,
  type DriResult,
  type HeightUnit,
  type WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums text-accent outline-none focus:ring-2 focus:ring-ring';
const selectClass =
  'h-11 rounded-lg border border-border bg-white px-2 text-sm font-medium text-primary outline-none focus:ring-2 focus:ring-ring';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

interface Props {
  input: DriInput;
  errors: DriFieldErrors;
  result: DriResult | null;
  onChange: (input: DriInput) => void;
}

const LB_TO_KG = 0.45359237;
const IN_TO_CM = 2.54;

function parseLoose(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function formatConverted(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 1000) / 1000;
  return String(rounded);
}

export function DriForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<DriInput>) => onChange({ ...input, ...patch });

  const switchHeightUnit = (next: HeightUnit) => {
    if (next === input.heightUnit) return;
    const parsed = parseLoose(input.heightText);
    if (parsed == null || !(parsed > 0)) {
      set({ heightUnit: next });
      return;
    }
    const cm = input.heightUnit === 'cm' ? parsed : parsed * IN_TO_CM;
    const nextVal = next === 'cm' ? cm : cm / IN_TO_CM;
    set({ heightUnit: next, heightText: formatConverted(nextVal) });
  };

  const switchWeightUnit = (next: WeightUnit) => {
    if (next === input.weightUnit) return;
    const parsed = parseLoose(input.weightText);
    if (parsed == null || !(parsed > 0)) {
      set({ weightUnit: next });
      return;
    }
    const kg = input.weightUnit === 'kg' ? parsed : parsed * LB_TO_KG;
    const nextVal = next === 'kg' ? kg : kg / LB_TO_KG;
    set({ weightUnit: next, weightText: formatConverted(nextVal) });
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate autoComplete="off">
      <section className={sectionClass} aria-label="Profile">
        <fieldset>
          <legend className={labelClass}>Sex</legend>
          <div className="flex flex-wrap gap-4">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-accent">
              <input
                type="radio"
                name="dri-sex"
                className="h-4 w-4 accent-primary"
                checked={input.sex === 'female'}
                onChange={() => set({ sex: 'female' })}
              />
              Female
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-accent">
              <input
                type="radio"
                name="dri-sex"
                className="h-4 w-4 accent-primary"
                checked={input.sex === 'male'}
                onChange={() => set({ sex: 'male' })}
              />
              Male
            </label>
          </div>
        </fieldset>

        <Field label="Age" htmlFor="dri-age">
          <select
            id="dri-age"
            className={`${selectClass} w-full`}
            value={input.ageBand}
            onChange={(e) => set({ ageBand: e.target.value as DriAgeBand })}
          >
            {AGE_BAND_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Height" htmlFor="dri-height" error={errors.heightText}>
          <div className="flex gap-2">
            <input
              id="dri-height"
              className={`${inputClass} flex-1`}
              value={input.heightText}
              inputMode="decimal"
              onChange={(e) => set({ heightText: e.target.value })}
            />
            <select
              className={selectClass}
              value={input.heightUnit}
              aria-label="Height unit"
              onChange={(e) => switchHeightUnit(e.target.value as HeightUnit)}
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
            </select>
          </div>
        </Field>

        <Field label="Weight" htmlFor="dri-weight" error={errors.weightText}>
          <div className="flex gap-2">
            <input
              id="dri-weight"
              className={`${inputClass} flex-1`}
              value={input.weightText}
              inputMode="decimal"
              onChange={(e) => set({ weightText: e.target.value })}
            />
            <select
              className={selectClass}
              value={input.weightUnit}
              aria-label="Weight unit"
              onChange={(e) => switchWeightUnit(e.target.value as WeightUnit)}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </Field>

        <Field
          label="BMI"
          htmlFor="dri-bmi"
          tooltip="Body mass index = weight (kg) ÷ height (m)². Derived from height and weight; not entered directly."
        >
          <input
            id="dri-bmi"
            className={inputClass}
            readOnly
            value={result?.bmiDisplay ?? ''}
            aria-label="Body mass index"
          />
        </Field>

        <Field label="Activity factor" htmlFor="dri-activity">
          <select
            id="dri-activity"
            className={`${selectClass} w-full`}
            value={input.activityId}
            onChange={(e) => set({ activityId: e.target.value as DriActivityId })}
          >
            {ACTIVITY_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Total daily calorie requirement" htmlFor="dri-calories">
          <div className="flex gap-2">
            <input
              id="dri-calories"
              className={`${inputClass} flex-1`}
              readOnly
              value={result?.caloriesDisplay ?? ''}
              aria-label="Total daily calorie requirement"
            />
            <span className="flex h-11 items-center rounded-lg border border-border px-3 text-sm text-muted-foreground">
              kcal/day
            </span>
          </div>
        </Field>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 accent-primary"
            checked={input.smoker}
            onChange={(e) => set({ smoker: e.target.checked })}
          />
          Smoker
        </label>
      </section>

      {result && result.nutrientRows.length > 0 ? (
        <section className={sectionClass} aria-label="Dietary reference intakes">
          <h3 className="text-sm font-semibold text-accent">Dietary reference intakes</h3>
          {result.carbs ? (
            <ReadOnlyRow
              label="Carbohydrates"
              value={`${result.carbs.lowGrams}–${result.carbs.highGrams} grams`}
            />
          ) : null}
          {result.fiberGrams != null ? (
            <ReadOnlyRow label="Total fiber" value={`${result.fiberGrams} grams`} />
          ) : null}
          {result.protein ? (
            <ReadOnlyRow
              label="Protein"
              value={`${result.protein.lowGrams}–${result.protein.highGrams} grams`}
            />
          ) : null}
          {result.fat ? (
            <ReadOnlyRow
              label="Fat"
              value={`${result.fat.lowGrams}–${result.fat.highGrams} grams`}
            />
          ) : null}
          {result.waterLiters != null ? (
            <ReadOnlyRow label="Water" value={`${result.waterLiters} liters`} />
          ) : null}

          <h4 className="pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Vitamin
          </h4>
          {result.nutrientRows
            .filter((r) => r.id.startsWith('vit_') || r.id === 'choline' || r.id === 'biotin')
            .map((row) => (
              <ReadOnlyRow key={row.id} label={row.label} value={`${row.display} ${row.unit}`} />
            ))}

          <h4 className="pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Micronutrient
          </h4>
          {result.nutrientRows
            .filter((r) => !r.id.startsWith('vit_') && r.id !== 'choline' && r.id !== 'biotin')
            .map((row) => (
              <ReadOnlyRow key={row.id} label={row.label} value={`${row.display} ${row.unit}`} />
            ))}
          <p className="text-xs text-muted-foreground">
            For sodium, the table gives the maximum daily intake!
          </p>
          {result.statusDetail ? (
            <p className="text-xs text-muted-foreground">{result.statusDetail}</p>
          ) : null}
        </section>
      ) : null}
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
  htmlFor?: string;
  error?: string;
  tooltip?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={htmlFor}>
        {label}
        {tooltip ? <InfoTooltip text={tooltip} /> : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <input className={inputClass} readOnly value={value} aria-label={label} />
    </div>
  );
}
