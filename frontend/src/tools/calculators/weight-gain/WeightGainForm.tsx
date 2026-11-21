'use client';

import type { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertHeight, convertWeight } from './calculation';
import {
  ACTIVITY_OPTIONS,
  type ActivityId,
  type GainPace,
  type HeightUnit,
  type WeightGainFieldErrors,
  type WeightGainInput,
  type WeightGainResult,
  type WeightGainSex,
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

interface Props {
  input: WeightGainInput;
  errors: WeightGainFieldErrors;
  result: WeightGainResult | null;
  onChange: (input: WeightGainInput) => void;
}

export function WeightGainForm({ input, errors, result, onChange }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4" noValidate autoComplete="off">
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span className="text-sm font-semibold text-accent">Personal details</span>
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
              <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Sex">
                {(
                  [
                    ['female', 'Female'],
                    ['male', 'Male'],
                  ] as const
                ).map(([value, label]) => (
                  <label key={value} className="inline-flex items-center gap-2 text-sm text-accent">
                    <input
                      type="radio"
                      name="wg-sex"
                      checked={input.sex === value}
                      onChange={() => onChange({ ...input, sex: value as WeightGainSex })}
                      className="h-4 w-4 accent-primary"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="wg-height" className={labelClass}>
                Height
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.heightValue}>
                  <input
                    id="wg-height"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.heightValue}
                    onChange={(e) => onChange({ ...input, heightValue: e.target.value })}
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
              <label htmlFor="wg-weight" className={labelClass}>
                Weight
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.weightValue}>
                  <input
                    id="wg-weight"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.weightValue}
                    onChange={(e) => onChange({ ...input, weightValue: e.target.value })}
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
              <label htmlFor="wg-age" className={labelClass}>
                Age
              </label>
              <FieldShell error={errors.ageYears}>
                <input
                  id="wg-age"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.ageYears}
                  onChange={(e) => onChange({ ...input, ageYears: e.target.value })}
                />
                <span className="shrink-0 pr-3 text-xs text-muted-foreground">yrs</span>
              </FieldShell>
              {errors.ageYears ? (
                <p className="mt-1 text-xs text-rose-600">{errors.ageYears}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="wg-activity" className={labelClass}>
                Activity level
                <InfoTooltip
                  label="Activity level"
                  text="Physical activity level (PAL) multiplier applied to Mifflin–St Jeor BMR."
                />
              </label>
              <select
                id="wg-activity"
                className={`${selectClass} w-full`}
                value={input.activityId}
                onChange={(e) =>
                  onChange({ ...input, activityId: e.target.value as ActivityId })
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
              <label htmlFor="wg-target" className={labelClass}>
                Target weight
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.targetWeightValue}>
                  <input
                    id="wg-target"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.targetWeightValue}
                    onChange={(e) =>
                      onChange({ ...input, targetWeightValue: e.target.value })
                    }
                  />
                </FieldShell>
                <select
                  className={`${selectClass} w-[5.5rem]`}
                  value={input.targetWeightUnit}
                  aria-label="Target weight unit"
                  onChange={(e) => {
                    const next = e.target.value as WeightUnit;
                    const n = Number(input.targetWeightValue.trim().replace(/,/g, ''));
                    if (Number.isFinite(n) && n > 0) {
                      const c = convertWeight(n, input.targetWeightUnit, next);
                      if (c != null) {
                        onChange({
                          ...input,
                          targetWeightUnit: next,
                          targetWeightValue: String(Number(c.toPrecision(8))),
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
                <p className="mt-1 text-xs text-rose-600">{errors.targetWeightValue}</p>
              ) : null}
            </div>

            <div>
              <div className={labelClass}>Weight gain pace</div>
              <div className="space-y-2" role="radiogroup" aria-label="Weight gain pace">
                {(
                  [
                    ['normal', 'Normal 0.5 kg (1.1 lb) / week'],
                    ['strict', 'Strict 1 kg (2.2 lb) / week'],
                  ] as const
                ).map(([value, label]) => (
                  <label key={value} className="flex items-center gap-2 text-sm text-accent">
                    <input
                      type="radio"
                      name="wg-pace"
                      checked={input.gainPace === value}
                      onChange={() =>
                        onChange({ ...input, gainPace: value as GainPace })
                      }
                      className="h-4 w-4 accent-primary"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">Results</h3>
        <div>
          <label htmlFor="wg-maint" className={labelClass}>
            Calories to maintain weight
          </label>
          <FieldShell>
            <input
              id="wg-maint"
              type="text"
              readOnly
              className={`${inputClass} ${result ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
              value={result?.formattedMaintenance ?? ''}
              placeholder="—"
              aria-live="polite"
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">kcal/day</span>
          </FieldShell>
        </div>
        {result?.goalFeasible && result.formattedGainCalories ? (
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              Suggested intake to gain: <strong className="text-accent">{result.formattedGainCalories} kcal/day</strong> (+{result.surplusKcal} surplus).
            </p>
            {result.weeksToGoal != null ? (
              <p>
                Approx. timeline: <strong className="text-accent">{result.weeksToGoal.toFixed(result.weeksToGoal % 1 === 0 ? 0 : 1)} weeks</strong> at {result.kgPerWeek} kg/week.
              </p>
            ) : null}
          </div>
        ) : null}
        {result?.goalMessage ? (
          <p className="text-xs text-amber-700">{result.goalMessage}</p>
        ) : null}
        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </div>
    </form>
  );
}
