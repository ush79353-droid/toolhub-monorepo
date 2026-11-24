'use client';

import type { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertHeight, convertWeight } from './calculation';
import {
  ACTIVITY_OPTIONS,
  type ActivityId,
  type DietPace,
  type HeightUnit,
  type KetoFieldErrors,
  type KetoInput,
  type KetoResult,
  type KetoSex,
  type MacroMassUnit,
  type WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

function AccordionSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-accent">{title}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-primary" />
        ) : (
          <ChevronDown className="h-4 w-4 text-primary" />
        )}
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-4 py-3">
          {children}
        </div>
      ) : null}
    </div>
  );
}

interface Props {
  input: KetoInput;
  errors: KetoFieldErrors;
  result: KetoResult | null;
  onChange: (input: KetoInput) => void;
}

export function KetoForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<KetoInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <AccordionSection title="Your details and goal" defaultOpen>
        <div>
          <div className={labelClass}>Sex</div>
          <div
            className="flex flex-wrap gap-3"
            role="radiogroup"
            aria-label="Sex"
          >
            {(
              [
                ['female', 'Female'],
                ['male', 'Male'],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="inline-flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="keto-sex"
                  checked={input.sex === value}
                  onChange={() => set({ sex: value as KetoSex })}
                  className="h-4 w-4 accent-primary"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="keto-height" className={labelClass}>
            Height
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.heightValue}>
              <input
                id="keto-height"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.heightValue}
                onChange={(e) => set({ heightValue: e.target.value })}
              />
            </FieldShell>
            <select
              className={`${selectClass} w-[5.5rem]`}
              value={input.heightUnit}
              aria-label="Height unit"
              onChange={(e) => {
                const next = e.target.value as HeightUnit;
                const n = Number(input.heightValue.trim().replace(/,/g, ''));
                if (Number.isFinite(n) && n > 0) {
                  const c = convertHeight(n, input.heightUnit, next);
                  if (c != null) {
                    set({
                      heightUnit: next,
                      heightValue: String(Number(c.toPrecision(8))),
                    });
                    return;
                  }
                }
                set({ heightUnit: next });
              }}
            >
              <option value="cm">cm</option>
              <option value="m">m</option>
              <option value="in">in</option>
              <option value="ft">ft</option>
            </select>
          </div>
          {errors.heightValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heightValue}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="keto-weight" className={labelClass}>
            Current weight
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.weightValue}>
              <input
                id="keto-weight"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.weightValue}
                onChange={(e) => set({ weightValue: e.target.value })}
              />
            </FieldShell>
            <select
              className={`${selectClass} w-[5.5rem]`}
              value={input.weightUnit}
              aria-label="Current weight unit"
              onChange={(e) => {
                const next = e.target.value as WeightUnit;
                const n = Number(input.weightValue.trim().replace(/,/g, ''));
                if (Number.isFinite(n) && n > 0) {
                  const c = convertWeight(n, input.weightUnit, next);
                  if (c != null) {
                    set({
                      weightUnit: next,
                      weightValue: String(Number(c.toPrecision(8))),
                    });
                    return;
                  }
                }
                set({ weightUnit: next });
              }}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
              <option value="st">st</option>
            </select>
          </div>
          {errors.weightValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightValue}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="keto-age" className={labelClass}>
            Age
          </label>
          <FieldShell error={errors.ageYears}>
            <input
              id="keto-age"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.ageYears}
              onChange={(e) => set({ ageYears: e.target.value })}
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">
              yrs
            </span>
          </FieldShell>
          {errors.ageYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageYears}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="keto-activity" className={labelClass}>
            Activity level
          </label>
          <select
            id="keto-activity"
            className={`${selectClass} w-full`}
            value={input.activityId}
            onChange={(e) =>
              set({ activityId: e.target.value as ActivityId })
            }
          >
            {ACTIVITY_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="keto-calories" className={labelClass}>
            Calories
            <InfoTooltip
              label="Calories"
              text="Estimated daily allocation from Mifflin–St Jeor BMR × activity, adjusted by Normal or Strict diet pace toward your target weight."
            />
          </label>
          <FieldShell>
            <input
              id="keto-calories"
              type="text"
              readOnly
              className={`${inputClass} ${result ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
              value={result?.formattedAllocated ?? ''}
              placeholder="—"
              aria-live="polite"
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">
              kcal/day
            </span>
          </FieldShell>
        </div>

        <div>
          <label htmlFor="keto-target" className={labelClass}>
            Target weight
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.targetWeightValue}>
              <input
                id="keto-target"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.targetWeightValue}
                onChange={(e) => set({ targetWeightValue: e.target.value })}
              />
            </FieldShell>
            <select
              className={`${selectClass} w-[5.5rem]`}
              value={input.targetWeightUnit}
              aria-label="Target weight unit"
              onChange={(e) => {
                const next = e.target.value as WeightUnit;
                const n = Number(
                  input.targetWeightValue.trim().replace(/,/g, ''),
                );
                if (Number.isFinite(n) && n > 0) {
                  const c = convertWeight(n, input.targetWeightUnit, next);
                  if (c != null) {
                    set({
                      targetWeightUnit: next,
                      targetWeightValue: String(Number(c.toPrecision(8))),
                    });
                    return;
                  }
                }
                set({ targetWeightUnit: next });
              }}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
              <option value="st">st</option>
            </select>
          </div>
          {errors.targetWeightValue ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.targetWeightValue}
            </p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>Diet</div>
          <div
            className="space-y-2"
            role="radiogroup"
            aria-label="Diet pace"
          >
            {(
              [
                ['normal', 'Normal (0.5 kg/1 lb per week)'],
                ['strict', 'Strict (1 kg/2 lb per week)'],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="keto-pace"
                  checked={input.dietPace === value}
                  onChange={() => set({ dietPace: value as DietPace })}
                  className="h-4 w-4 accent-primary"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Fats" defaultOpen>
        <div>
          <label htmlFor="keto-fat-pct" className={labelClass}>
            Recommended intake
          </label>
          <FieldShell error={errors.fatPct ?? errors.macrosTotal}>
            <input
              id="keto-fat-pct"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.fatPct}
              onChange={(e) => set({ fatPct: e.target.value })}
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">%</span>
          </FieldShell>
        </div>
        <div>
          <label htmlFor="keto-fat-kcal" className={labelClass}>
            Fat intake (Energy)
          </label>
          <FieldShell>
            <input
              id="keto-fat-kcal"
              type="text"
              readOnly
              className={`${inputClass} ${result ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
              value={result?.formattedFatKcal ?? ''}
              placeholder="—"
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">
              kcal/day
            </span>
          </FieldShell>
        </div>
        <div>
          <label htmlFor="keto-fat-mass" className={labelClass}>
            Fat intake (Mass)
          </label>
          <div className="flex gap-2">
            <FieldShell>
              <input
                id="keto-fat-mass"
                type="text"
                readOnly
                className={`${inputClass} ${result ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
                value={result?.formattedFatMass ?? ''}
                placeholder="—"
              />
            </FieldShell>
            <select
              className={`${selectClass} w-[5.5rem]`}
              value={input.macroMassUnit}
              aria-label="Fat mass unit"
              onChange={(e) =>
                set({ macroMassUnit: e.target.value as MacroMassUnit })
              }
            >
              <option value="g">g</option>
              <option value="oz">oz</option>
            </select>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">/ day</p>
        </div>
      </AccordionSection>

      <AccordionSection title="Carbohydrates" defaultOpen>
        <div>
          <label htmlFor="keto-carb-pct" className={labelClass}>
            Recommended intake
          </label>
          <FieldShell error={errors.carbPct ?? errors.macrosTotal}>
            <input
              id="keto-carb-pct"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.carbPct}
              onChange={(e) => set({ carbPct: e.target.value })}
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">%</span>
          </FieldShell>
        </div>
        <div>
          <label htmlFor="keto-carb-kcal" className={labelClass}>
            Carbs intake (Energy)
          </label>
          <FieldShell>
            <input
              id="keto-carb-kcal"
              type="text"
              readOnly
              className={`${inputClass} ${result ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
              value={result?.formattedCarbKcal ?? ''}
              placeholder="—"
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">
              kcal/day
            </span>
          </FieldShell>
        </div>
        <div>
          <label htmlFor="keto-carb-mass" className={labelClass}>
            Carbs intake (Mass)
          </label>
          <div className="flex gap-2">
            <FieldShell>
              <input
                id="keto-carb-mass"
                type="text"
                readOnly
                className={`${inputClass} ${result ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
                value={result?.formattedCarbMass ?? ''}
                placeholder="—"
              />
            </FieldShell>
            <select
              className={`${selectClass} w-[5.5rem]`}
              value={input.macroMassUnit}
              aria-label="Carbs mass unit"
              onChange={(e) =>
                set({ macroMassUnit: e.target.value as MacroMassUnit })
              }
            >
              <option value="g">g</option>
              <option value="oz">oz</option>
            </select>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">/ day</p>
        </div>
      </AccordionSection>

      <AccordionSection title="Proteins" defaultOpen>
        <div>
          <label htmlFor="keto-protein-pct" className={labelClass}>
            Recommended intake
          </label>
          <FieldShell error={errors.proteinPct ?? errors.macrosTotal}>
            <input
              id="keto-protein-pct"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.proteinPct}
              onChange={(e) => set({ proteinPct: e.target.value })}
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">%</span>
          </FieldShell>
        </div>
        <div>
          <label htmlFor="keto-protein-kcal" className={labelClass}>
            Protein intake (Energy)
          </label>
          <FieldShell>
            <input
              id="keto-protein-kcal"
              type="text"
              readOnly
              className={`${inputClass} ${result ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
              value={result?.formattedProteinKcal ?? ''}
              placeholder="—"
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">
              kcal/day
            </span>
          </FieldShell>
        </div>
        <div>
          <label htmlFor="keto-protein-mass" className={labelClass}>
            Protein intake (Mass)
          </label>
          <div className="flex gap-2">
            <FieldShell>
              <input
                id="keto-protein-mass"
                type="text"
                readOnly
                className={`${inputClass} ${result ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
                value={result?.formattedProteinMass ?? ''}
                placeholder="—"
              />
            </FieldShell>
            <select
              className={`${selectClass} w-[5.5rem]`}
              value={input.macroMassUnit}
              aria-label="Protein mass unit"
              onChange={(e) =>
                set({ macroMassUnit: e.target.value as MacroMassUnit })
              }
            >
              <option value="g">g</option>
              <option value="oz">oz</option>
            </select>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">/ day</p>
        </div>
      </AccordionSection>

      {errors.macrosTotal ? (
        <p className="text-xs text-rose-600">{errors.macrosTotal}</p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
      {result?.goalMessage ? (
        <p className="text-xs text-amber-700">{result.goalMessage}</p>
      ) : null}
      {result ? (
        <p className="text-xs text-muted-foreground">{result.disclaimer}</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Enter height, current weight, age, and target weight to estimate keto
          calorie allocation and fat / carb / protein intakes.
        </p>
      )}
    </form>
  );
}
