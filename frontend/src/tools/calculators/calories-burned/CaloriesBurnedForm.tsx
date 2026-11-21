'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { activityById, activitiesGrouped, activitySupportsDistance } from './activities';
import { LB_TO_KG, weightToKg } from './calculation';
import { CaloriesBurnedResults } from './CaloriesBurnedResults';
import type {
  CaloriesBurnedFieldErrors,
  CaloriesBurnedInput,
  CaloriesBurnedResult,
  DurationInputMode,
  WeightUnit,
} from './types';
import {
  MAX_WEIGHT_KG,
  MAX_WEIGHT_LB,
  MIN_WEIGHT_KG,
  MIN_WEIGHT_LB,
} from './validation';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full min-w-0 rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface CaloriesBurnedFormProps {
  input: CaloriesBurnedInput;
  errors: CaloriesBurnedFieldErrors;
  result: CaloriesBurnedResult | null;
  onChange: (input: CaloriesBurnedInput) => void;
  onCalculate: () => void;
  onClear: () => void;
}

export function CaloriesBurnedForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
}: CaloriesBurnedFormProps) {
  const grouped = activitiesGrouped();
  const selected = activityById(input.activityId);
  const showDistance = activitySupportsDistance(selected);

  const setActivity = (activityId: string) => {
    const next = activityById(activityId);
    const patch: CaloriesBurnedInput = { ...input, activityId };
    if (!activitySupportsDistance(next) && input.durationInputMode === 'distance') {
      patch.durationInputMode = 'time';
      patch.distanceMiles = '';
    }
    onChange(patch);
  };

  const setMode = (mode: DurationInputMode) => {
    onChange({
      ...input,
      durationInputMode: mode,
      distanceMiles: mode === 'time' ? '' : input.distanceMiles,
    });
  };

  const changeWeightUnit = (unit: WeightUnit) => {
    const n = Number(input.weightValue.trim().replace(/,/g, ''));
    if (Number.isFinite(n) && n > 0) {
      const kg = weightToKg(n, input.weightUnit);
      if (kg != null) {
        const converted = unit === 'kg' ? kg : kg / LB_TO_KG;
        onChange({
          ...input,
          weightUnit: unit,
          weightValue: String(Number(converted.toPrecision(8))),
        });
        return;
      }
    }
    onChange({ ...input, weightUnit: unit });
  };

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
        Estimates gross calories burned from the 2011 Adult Compendium MET value
        for your activity, body weight, and duration (or distance for
        walk/run/cycle paces). Press Calculate when your inputs are ready.
      </p>

      <div>
        <label htmlFor="cb-activity" className={labelClass}>
          Activity
          <InfoTooltip
            label="Activity"
            text="Each option uses a documented MET from the 2011 Compendium of Physical Activities. Pick the pace that best matches your effort."
          />
        </label>
        <select
          id="cb-activity"
          className={`${selectClass} ${errors.activityId ? 'border-rose-400' : ''}`}
          value={input.activityId}
          onChange={(e) => setActivity(e.target.value)}
          aria-invalid={Boolean(errors.activityId)}
        >
          <option value="">--- Select One ---</option>
          {[...grouped.entries()].map(([group, items]) => (
            <optgroup key={group} label={group}>
              {items.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label} (MET {a.met})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {errors.activityId ? (
          <p className="mt-1 text-xs text-rose-600">{errors.activityId}</p>
        ) : null}
      </div>

      {showDistance ? (
        <fieldset className="space-y-2 rounded-xl border border-border bg-muted/10 p-3">
          <legend className="px-1 text-xs font-semibold text-accent">
            Duration or distance
          </legend>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode('time')}
              className={`h-9 rounded-lg border px-3 text-xs font-semibold ${
                input.durationInputMode === 'time'
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-accent'
              }`}
            >
              Enter time
            </button>
            <button
              type="button"
              onClick={() => setMode('distance')}
              className={`h-9 rounded-lg border px-3 text-xs font-semibold ${
                input.durationInputMode === 'distance'
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-accent'
              }`}
            >
              Enter distance
            </button>
          </div>
        </fieldset>
      ) : null}

      {input.durationInputMode === 'distance' && showDistance ? (
        <div>
          <label htmlFor="cb-distance" className={labelClass}>
            Distance
            <InfoTooltip
              label="Distance"
              text={`Converts miles to time using the ${selected?.speedMph ?? '—'} mph pace for this compendium entry.`}
            />
          </label>
          <FieldShell error={errors.distanceMiles} suffix="mi">
            <input
              id="cb-distance"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.distanceMiles}
              onChange={(e) =>
                onChange({ ...input, distanceMiles: e.target.value })
              }
              placeholder="3.5"
              aria-invalid={Boolean(errors.distanceMiles)}
            />
          </FieldShell>
          {errors.distanceMiles ? (
            <p className="mt-1 text-xs text-rose-600">{errors.distanceMiles}</p>
          ) : errors.durationInputMode ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.durationInputMode}
            </p>
          ) : null}
        </div>
      ) : (
        <DurationFields input={input} errors={errors} onChange={onChange} />
      )}

      <div>
        <label htmlFor="cb-weight" className={labelClass}>
          Body weight
          <InfoTooltip
            label="Body weight"
            text={`Typical range: ${MIN_WEIGHT_LB}–${MAX_WEIGHT_LB} lb or ${MIN_WEIGHT_KG}–${MAX_WEIGHT_KG} kg.`}
          />
        </label>
        <div className="flex flex-wrap items-start gap-2">
          <FieldShell error={errors.weightValue}>
            <input
              id="cb-weight"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.weightValue}
              onChange={(e) =>
                onChange({ ...input, weightValue: e.target.value })
              }
              placeholder="70"
              aria-invalid={Boolean(errors.weightValue)}
            />
          </FieldShell>
          <select
            className={`${selectClass} w-[5.5rem] shrink-0`}
            value={input.weightUnit}
            onChange={(e) =>
              changeWeightUnit(e.target.value as WeightUnit)
            }
            aria-label="Weight unit"
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </div>
        {errors.weightValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.weightValue}</p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">
            {MIN_WEIGHT_LB}–{MAX_WEIGHT_LB} lb / {MIN_WEIGHT_KG}–{MAX_WEIGHT_KG}{' '}
            kg
          </p>
        )}
      </div>

      {errors.form ? (
        <p className="text-sm text-rose-700" role="alert">
          {errors.form}
        </p>
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

      <CaloriesBurnedResults result={result} />
    </form>
  );
}

function DurationFields({
  input,
  errors,
  onChange,
}: {
  input: CaloriesBurnedInput;
  errors: CaloriesBurnedFieldErrors;
  onChange: (input: CaloriesBurnedInput) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label htmlFor="cb-hours" className={labelClass}>
          Duration — hours
        </label>
        <FieldShell error={errors.durationHours}>
          <input
            id="cb-hours"
            type="text"
            inputMode="numeric"
            className={inputClass}
            value={input.durationHours}
            onChange={(e) =>
              onChange({ ...input, durationHours: e.target.value })
            }
            placeholder="0"
            aria-invalid={Boolean(errors.durationHours)}
          />
        </FieldShell>
        {errors.durationHours ? (
          <p className="mt-1 text-xs text-rose-600">{errors.durationHours}</p>
        ) : null}
      </div>
      <div>
        <label htmlFor="cb-minutes" className={labelClass}>
          Duration — minutes
        </label>
        <FieldShell error={errors.durationMinutes}>
          <input
            id="cb-minutes"
            type="text"
            inputMode="numeric"
            className={inputClass}
            value={input.durationMinutes}
            onChange={(e) =>
              onChange({ ...input, durationMinutes: e.target.value })
            }
            placeholder="45"
            aria-invalid={Boolean(errors.durationMinutes)}
          />
        </FieldShell>
        {errors.durationMinutes ? (
          <p className="mt-1 text-xs text-rose-600">{errors.durationMinutes}</p>
        ) : null}
      </div>
    </div>
  );
}
