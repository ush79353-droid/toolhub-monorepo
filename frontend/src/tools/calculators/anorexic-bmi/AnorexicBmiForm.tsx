'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { AnorexicBmiResults } from './AnorexicBmiResults';
import type {
  AnorexicBmiFieldErrors,
  AnorexicBmiInput,
  AnorexicBmiResult,
  OtherHeightUnit,
  OtherWeightUnit,
  UnitSystem,
} from './types';
import {
  heightToMeters,
  kgToWeight,
  metersToHeight,
  usHeightToMeters,
  weightToKg,
} from './calculation';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

const UNIT_TABS: { id: UnitSystem; label: string }[] = [
  { id: 'us', label: 'US Units' },
  { id: 'metric', label: 'Metric Units' },
  { id: 'other', label: 'Other Units' },
];

function FieldShell({
  error,
  suffix,
  children,
}: {
  error?: string;
  suffix?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
      {suffix ? (
        <span className="shrink-0 pr-3 text-xs text-muted-foreground">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

function parseLoose(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function formatField(value: number, digits = 4): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

function convertPreservingPhysical(
  input: AnorexicBmiInput,
  nextSystem: UnitSystem
): AnorexicBmiInput {
  if (input.unitSystem === nextSystem) return { ...input, unitSystem: nextSystem };

  let meters: number | null = null;
  let kg: number | null = null;

  if (input.unitSystem === 'metric') {
    const cm = parseLoose(input.heightCm);
    const w = parseLoose(input.weightKg);
    if (cm !== null && cm > 0) meters = heightToMeters(cm, 'cm');
    if (w !== null && w > 0) kg = w;
  } else if (input.unitSystem === 'us') {
    const ft = parseLoose(input.heightFt) ?? 0;
    const inches = parseLoose(input.heightIn) ?? 0;
    const w = parseLoose(input.weightLb);
    if (ft > 0 || inches > 0) meters = usHeightToMeters(ft, inches);
    if (w !== null && w > 0) kg = weightToKg(w, 'lb');
  } else {
    const h = parseLoose(input.otherHeight);
    const w = parseLoose(input.otherWeight);
    if (h !== null && h > 0) meters = heightToMeters(h, input.otherHeightUnit);
    if (w !== null && w > 0) kg = weightToKg(w, input.otherWeightUnit);
  }

  const next: AnorexicBmiInput = { ...input, unitSystem: nextSystem };

  if (meters !== null && meters > 0) {
    if (nextSystem === 'metric') {
      next.heightCm = formatField(metersToHeight(meters, 'cm'), 2);
    } else if (nextSystem === 'us') {
      const totalIn = meters / 0.0254;
      const ft = Math.floor(totalIn / 12);
      let inches = totalIn - ft * 12;
      if (inches >= 11.999) {
        next.heightFt = String(ft + 1);
        next.heightIn = '0';
      } else {
        next.heightFt = String(ft);
        next.heightIn = formatField(inches, 2);
      }
    } else {
      next.otherHeight = formatField(
        metersToHeight(meters, next.otherHeightUnit),
        4
      );
    }
  }

  if (kg !== null && kg > 0) {
    if (nextSystem === 'metric') {
      next.weightKg = formatField(kg, 2);
    } else if (nextSystem === 'us') {
      next.weightLb = formatField(kgToWeight(kg, 'lb'), 2);
    } else {
      next.otherWeight = formatField(kgToWeight(kg, next.otherWeightUnit), 4);
    }
  }

  return next;
}

interface AnorexicBmiFormProps {
  input: AnorexicBmiInput;
  errors: AnorexicBmiFieldErrors;
  result: AnorexicBmiResult | null;
  onChange: (input: AnorexicBmiInput) => void;
  onCalculate: () => void;
  onClear: () => void;
}

export function AnorexicBmiForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
}: AnorexicBmiFormProps) {
  const set = (patch: Partial<AnorexicBmiInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate();
      }}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Modify the values and click Calculate. BMI uses weight ÷ height² after
        converting to kilograms and meters. This tool does not diagnose eating
        disorders.
      </p>

      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Unit system"
      >
        {UNIT_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={input.unitSystem === tab.id}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
              input.unitSystem === tab.id
                ? 'border-primary bg-primary/10 text-accent'
                : 'border-border bg-white text-muted-foreground hover:bg-muted/30'
            }`}
            onClick={() => onChange(convertPreservingPhysical(input, tab.id))}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Body measurements
        </legend>

        <div>
          <label htmlFor="anorexic-bmi-age" className={labelClass}>
            Age
            <InfoTooltip
              label="Age"
              text="Enter age in whole years. WHO adult BMI categories are shown only for ages 20–120. Younger ages need pediatric percentile charts."
            />
          </label>
          <FieldShell error={errors.age} suffix="years">
            <input
              id="anorexic-bmi-age"
              type="text"
              inputMode="numeric"
              className={inputClass}
              value={input.age}
              onChange={(e) => set({ age: e.target.value })}
              aria-invalid={Boolean(errors.age)}
            />
          </FieldShell>
          {errors.age ? (
            <p className="mt-1 text-xs text-rose-600">{errors.age}</p>
          ) : null}
        </div>

        <fieldset>
          <legend className={labelClass}>Gender</legend>
          <div className="flex flex-wrap gap-4">
            {(['female', 'male'] as const).map((sex) => (
              <label
                key={sex}
                className="inline-flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="anorexic-bmi-sex"
                  checked={input.sex === sex}
                  onChange={() => set({ sex })}
                  className="h-4 w-4 accent-primary"
                />
                {sex}
              </label>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Sex is collected for context only; the BMI formula does not use it.
          </p>
        </fieldset>

        {input.unitSystem === 'metric' ? (
          <>
            <div>
              <label htmlFor="anorexic-bmi-height-cm" className={labelClass}>
                Height
              </label>
              <FieldShell error={errors.height} suffix="cm">
                <input
                  id="anorexic-bmi-height-cm"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.heightCm}
                  onChange={(e) => set({ heightCm: e.target.value })}
                  aria-invalid={Boolean(errors.height)}
                />
              </FieldShell>
              {errors.height ? (
                <p className="mt-1 text-xs text-rose-600">{errors.height}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="anorexic-bmi-weight-kg" className={labelClass}>
                Weight
              </label>
              <FieldShell error={errors.weight} suffix="kg">
                <input
                  id="anorexic-bmi-weight-kg"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.weightKg}
                  onChange={(e) => set({ weightKg: e.target.value })}
                  aria-invalid={Boolean(errors.weight)}
                />
              </FieldShell>
              {errors.weight ? (
                <p className="mt-1 text-xs text-rose-600">{errors.weight}</p>
              ) : null}
            </div>
          </>
        ) : null}

        {input.unitSystem === 'us' ? (
          <>
            <div>
              <span className={labelClass}>Height</span>
              <div className="flex gap-2">
                <FieldShell error={errors.height} suffix="ft">
                  <input
                    id="anorexic-bmi-height-ft"
                    type="text"
                    inputMode="numeric"
                    className={inputClass}
                    value={input.heightFt}
                    onChange={(e) => set({ heightFt: e.target.value })}
                    aria-label="Height feet"
                    aria-invalid={Boolean(errors.height)}
                  />
                </FieldShell>
                <FieldShell error={errors.height} suffix="in">
                  <input
                    id="anorexic-bmi-height-in"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.heightIn}
                    onChange={(e) => set({ heightIn: e.target.value })}
                    aria-label="Height inches"
                    aria-invalid={Boolean(errors.height)}
                  />
                </FieldShell>
              </div>
              {errors.height ? (
                <p className="mt-1 text-xs text-rose-600">{errors.height}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="anorexic-bmi-weight-lb" className={labelClass}>
                Weight
              </label>
              <FieldShell error={errors.weight} suffix="lb">
                <input
                  id="anorexic-bmi-weight-lb"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.weightLb}
                  onChange={(e) => set({ weightLb: e.target.value })}
                  aria-invalid={Boolean(errors.weight)}
                />
              </FieldShell>
              {errors.weight ? (
                <p className="mt-1 text-xs text-rose-600">{errors.weight}</p>
              ) : null}
            </div>
          </>
        ) : null}

        {input.unitSystem === 'other' ? (
          <>
            <div>
              <label htmlFor="anorexic-bmi-other-height" className={labelClass}>
                Height
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.height}>
                  <input
                    id="anorexic-bmi-other-height"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.otherHeight}
                    onChange={(e) => set({ otherHeight: e.target.value })}
                    aria-invalid={Boolean(errors.height)}
                  />
                </FieldShell>
                <select
                  className="h-11 rounded-lg border border-border bg-white px-2 text-sm text-accent"
                  value={input.otherHeightUnit}
                  aria-label="Height unit"
                  onChange={(e) => {
                    const unit = e.target.value as OtherHeightUnit;
                    const h = parseLoose(input.otherHeight);
                    if (h !== null && h > 0) {
                      const meters = heightToMeters(h, input.otherHeightUnit);
                      set({
                        otherHeightUnit: unit,
                        otherHeight: formatField(
                          metersToHeight(meters, unit),
                          4
                        ),
                      });
                    } else {
                      set({ otherHeightUnit: unit });
                    }
                  }}
                >
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                  <option value="in">in</option>
                  <option value="ft">ft</option>
                </select>
              </div>
              {errors.height ? (
                <p className="mt-1 text-xs text-rose-600">{errors.height}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="anorexic-bmi-other-weight" className={labelClass}>
                Weight
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.weight}>
                  <input
                    id="anorexic-bmi-other-weight"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.otherWeight}
                    onChange={(e) => set({ otherWeight: e.target.value })}
                    aria-invalid={Boolean(errors.weight)}
                  />
                </FieldShell>
                <select
                  className="h-11 rounded-lg border border-border bg-white px-2 text-sm text-accent"
                  value={input.otherWeightUnit}
                  aria-label="Weight unit"
                  onChange={(e) => {
                    const unit = e.target.value as OtherWeightUnit;
                    const w = parseLoose(input.otherWeight);
                    if (w !== null && w > 0) {
                      const kg = weightToKg(w, input.otherWeightUnit);
                      set({
                        otherWeightUnit: unit,
                        otherWeight: formatField(kgToWeight(kg, unit), 4),
                      });
                    } else {
                      set({ otherWeightUnit: unit });
                    }
                  }}
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                  <option value="st">st</option>
                  <option value="g">g</option>
                </select>
              </div>
              {errors.weight ? (
                <p className="mt-1 text-xs text-rose-600">{errors.weight}</p>
              ) : null}
            </div>
          </>
        ) : null}

        {errors.form ? (
          <p className="text-xs text-rose-600">{errors.form}</p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button
            type="submit"
            className="h-11 min-w-[8.5rem] rounded-xl px-5 text-sm font-semibold"
          >
            Calculate
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 min-w-[6rem] rounded-xl border-border px-5 text-sm font-semibold text-accent"
            onClick={onClear}
          >
            Clear
          </Button>
        </div>
      </fieldset>

      <AnorexicBmiResults result={result} />
    </form>
  );
}
