'use client';

import type { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  ACTIVITY_OPTIONS,
  type ActivityId,
  type ChangePace,
  type GoalMode,
  type HeightUnit,
  type IifymFieldErrors,
  type IifymInput,
  type IifymResult,
  type IifymSex,
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

/** Preserve physical height when switching units (UI helpers; engine owns math). */
function convertHeight(
  value: number,
  from: HeightUnit,
  to: HeightUnit,
): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  let cm = value;
  if (from === 'm') cm = value * 100;
  else if (from === 'in') cm = value * 2.54;
  else if (from === 'ft') cm = value * 30.48;
  if (to === 'cm') return cm;
  if (to === 'm') return cm / 100;
  if (to === 'in') return cm / 2.54;
  if (to === 'ft') return cm / 30.48;
  return null;
}

function convertWeight(
  value: number,
  from: WeightUnit,
  to: WeightUnit,
): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  let kg = value;
  if (from === 'lb') kg = value * 0.45359237;
  else if (from === 'st') kg = value * 6.35029318;
  if (to === 'kg') return kg;
  if (to === 'lb') return kg / 0.45359237;
  if (to === 'st') return kg / 6.35029318;
  return null;
}

interface Props {
  input: IifymInput;
  errors: IifymFieldErrors;
  result: IifymResult | null;
  onChange: (input: IifymInput) => void;
}

export function IifymForm({ input, errors, result, onChange }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span className="text-sm font-semibold text-accent">
            Personal details
          </span>
          {open ? (
            <ChevronUp className="h-4 w-4 text-primary" />
          ) : (
            <ChevronDown className="h-4 w-4 text-primary" />
          )}
        </button>
        {open ? (
          <div className="space-y-3.5 border-t border-border px-4 py-3">
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
                      name="iifym-sex"
                      checked={input.sex === value}
                      onChange={() =>
                        onChange({ ...input, sex: value as IifymSex })
                      }
                      className="h-4 w-4 accent-primary"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="iifym-height" className={labelClass}>
                Height
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.heightValue}>
                  <input
                    id="iifym-height"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.heightValue}
                    onChange={(e) =>
                      onChange({ ...input, heightValue: e.target.value })
                    }
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
                        onChange({
                          ...input,
                          heightUnit: next,
                          heightValue: String(Number(c.toPrecision(8))),
                        });
                        return;
                      }
                    }
                    onChange({ ...input, heightUnit: next });
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
              <label htmlFor="iifym-weight" className={labelClass}>
                Weight
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.weightValue}>
                  <input
                    id="iifym-weight"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.weightValue}
                    onChange={(e) =>
                      onChange({ ...input, weightValue: e.target.value })
                    }
                  />
                </FieldShell>
                <select
                  className={`${selectClass} w-[5.5rem]`}
                  value={input.weightUnit}
                  aria-label="Weight unit"
                  onChange={(e) => {
                    const next = e.target.value as WeightUnit;
                    const n = Number(input.weightValue.trim().replace(/,/g, ''));
                    if (Number.isFinite(n) && n > 0) {
                      const c = convertWeight(n, input.weightUnit, next);
                      if (c != null) {
                        onChange({
                          ...input,
                          weightUnit: next,
                          weightValue: String(Number(c.toPrecision(8))),
                        });
                        return;
                      }
                    }
                    onChange({ ...input, weightUnit: next });
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
              <label htmlFor="iifym-age" className={labelClass}>
                Age
              </label>
              <FieldShell error={errors.ageYears}>
                <input
                  id="iifym-age"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.ageYears}
                  onChange={(e) =>
                    onChange({ ...input, ageYears: e.target.value })
                  }
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
              <label htmlFor="iifym-activity" className={labelClass}>
                Activity level
                <InfoTooltip
                  label="Activity level"
                  text="Physical activity level (PAL) multiplier applied to Mifflin–St Jeor BMR."
                />
              </label>
              <select
                id="iifym-activity"
                className={`${selectClass} w-full`}
                value={input.activityId}
                onChange={(e) =>
                  onChange({
                    ...input,
                    activityId: e.target.value as ActivityId,
                  })
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
              <div className={labelClass}>Goal</div>
              <div
                className="flex flex-wrap gap-3"
                role="radiogroup"
                aria-label="Goal"
              >
                {(
                  [
                    ['maintain', 'Maintain weight'],
                    ['change', 'Change weight'],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className="inline-flex items-center gap-2 text-sm text-accent"
                  >
                    <input
                      type="radio"
                      name="iifym-goal"
                      checked={input.goalMode === value}
                      onChange={() =>
                        onChange({ ...input, goalMode: value as GoalMode })
                      }
                      className="h-4 w-4 accent-primary"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {input.goalMode === 'change' ? (
              <>
                <div>
                  <label htmlFor="iifym-target" className={labelClass}>
                    Target weight
                  </label>
                  <div className="flex gap-2">
                    <FieldShell error={errors.targetWeightValue}>
                      <input
                        id="iifym-target"
                        type="text"
                        inputMode="decimal"
                        className={inputClass}
                        value={input.targetWeightValue}
                        onChange={(e) =>
                          onChange({
                            ...input,
                            targetWeightValue: e.target.value,
                          })
                        }
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
                          const c = convertWeight(
                            n,
                            input.targetWeightUnit,
                            next,
                          );
                          if (c != null) {
                            onChange({
                              ...input,
                              targetWeightUnit: next,
                              targetWeightValue: String(
                                Number(c.toPrecision(8)),
                              ),
                            });
                            return;
                          }
                        }
                        onChange({ ...input, targetWeightUnit: next });
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
                  <div className={labelClass}>Weight loss / gain pace</div>
                  <div
                    className="space-y-2"
                    role="radiogroup"
                    aria-label="Weight loss / gain pace"
                  >
                    {(
                      [
                        ['normal', 'Normal 0.5 kg (1.1 lb) / week'],
                        ['strict', 'Strict 1 kg (2.2 lb) / week'],
                      ] as const
                    ).map(([value, label]) => (
                      <label
                        key={value}
                        className="flex items-center gap-2 text-sm text-accent"
                      >
                        <input
                          type="radio"
                          name="iifym-pace"
                          checked={input.changePace === value}
                          onChange={() =>
                            onChange({
                              ...input,
                              changePace: value as ChangePace,
                            })
                          }
                          className="h-4 w-4 accent-primary"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">Results</h3>
        <div>
          <label htmlFor="iifym-maint" className={labelClass}>
            Calories to maintain weight
            <InfoTooltip
              label="Calories to maintain weight"
              text="Estimated TDEE from Mifflin–St Jeor BMR × activity (PAL)."
            />
          </label>
          <FieldShell>
            <input
              id="iifym-maint"
              type="text"
              readOnly
              className={`${inputClass} ${result ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
              value={result?.formattedMaintenance ?? ''}
              placeholder="—"
              aria-live="polite"
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">
              kcal/day
            </span>
          </FieldShell>
        </div>

        {result ? (
          <div className="space-y-2 text-sm text-accent">
            {input.goalMode === 'change' && result.formattedTarget ? (
              <p className="text-xs text-muted-foreground">
                Suggested intake:{' '}
                <strong className="text-accent">
                  {result.formattedTarget} kcal/day
                </strong>
                {result.deltaKcal != null
                  ? ` (${result.deltaKcal > 0 ? '+' : ''}${result.deltaKcal} kcal/day).`
                  : '.'}
              </p>
            ) : null}
            {result.weeksToGoal != null ? (
              <p className="text-xs text-muted-foreground">
                Approx. timeline:{' '}
                <strong className="text-accent">
                  {result.weeksToGoal.toFixed(
                    result.weeksToGoal % 1 === 0 ? 0 : 1,
                  )}{' '}
                  weeks
                </strong>
                {result.kgPerWeek != null
                  ? ` at ${result.kgPerWeek} kg/week`
                  : ''}
                {result.changeDirection
                  ? ` (${result.changeDirection}).`
                  : '.'}
              </p>
            ) : null}
            <div className="rounded-lg border border-border bg-white/70 p-3 text-xs leading-relaxed text-muted-foreground">
              <p className="mb-1.5 font-medium text-accent">
                {input.goalMode === 'change'
                  ? 'Daily macros for your calorie target'
                  : 'To maintain your current weight, your daily intake should be around:'}
              </p>
              <ul className="list-disc space-y-1 pl-4">
                <li>
                  {Math.round(result.macros.proteinMinG)}–
                  {Math.round(result.macros.proteinMaxG)} g of proteins
                  (10%–35% of your total energy)
                </li>
                <li>
                  {Math.round(result.macros.carbMinG)}–
                  {Math.round(result.macros.carbMaxG)} g of carbohydrates
                  (45%–65% of your total energy)
                </li>
                <li>
                  {Math.round(result.macros.fatMinG)}–
                  {Math.round(result.macros.fatMaxG)} g of fats (20–35% of your
                  total energy)
                </li>
              </ul>
            </div>
            {result.goalMessage ? (
              <p className="text-xs text-amber-700">{result.goalMessage}</p>
            ) : null}
            <p className="text-xs text-muted-foreground">{result.disclaimer}</p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Enter height, weight, and age to estimate maintenance calories and
            USDA AMDR macro ranges.
          </p>
        )}
        {errors.form ? (
          <p className="text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </div>
    </form>
  );
}
