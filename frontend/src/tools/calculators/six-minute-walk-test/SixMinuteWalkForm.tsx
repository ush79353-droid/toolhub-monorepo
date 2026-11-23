'use client';

import type { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertDistance,
  convertHeight,
  convertWeight,
  parseNumber,
} from './calculation';
import type {
  DistanceUnit,
  HeightUnit,
  SixMinuteWalkTestFieldErrors,
  SixMinuteWalkTestInput,
  SixMinuteWalkTestResult,
  WeightUnit,
} from './types';
import {
  DISTANCE_UNIT_LABELS,
  HEIGHT_UNIT_LABELS,
  WEIGHT_UNIT_LABELS,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';

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
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

function formatUnitSwitch(value: number, digits: number): string {
  return String(Number(value.toFixed(digits)));
}

interface Props {
  input: SixMinuteWalkTestInput;
  errors: SixMinuteWalkTestFieldErrors;
  result: SixMinuteWalkTestResult | null;
  onChange: (input: SixMinuteWalkTestInput) => void;
}

export function SixMinuteWalkForm({
  input,
  errors,
  result,
  onChange,
}: Props) {
  const set = (patch: Partial<SixMinuteWalkTestInput>) =>
    onChange({ ...input, ...patch });

  const hasPrediction = result?.predictedMeters != null;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational Enright–Sherrill (1998) predicted 6MWD for healthy adults
        aged 40–80. Not a supervised test result or clinical diagnosis.
      </p>

      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

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
                name="smwt-sex"
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
        <label htmlFor="smwt-age" className={labelClass}>
          Age
        </label>
        <FieldShell error={errors.ageYears}>
          <input
            id="smwt-age"
            className={inputClass}
            inputMode="decimal"
            value={input.ageYears}
            onChange={(e) => set({ ageYears: e.target.value })}
            aria-invalid={Boolean(errors.ageYears)}
          />
          <span className="shrink-0 pr-3 text-xs text-muted-foreground">
            years
          </span>
        </FieldShell>
        {errors.ageYears ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ageYears}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="smwt-height" className={labelClass}>
          Height
        </label>
        <FieldShell error={errors.heightValue}>
          <input
            id="smwt-height"
            className={inputClass}
            inputMode="decimal"
            value={input.heightValue}
            onChange={(e) => set({ heightValue: e.target.value })}
            aria-invalid={Boolean(errors.heightValue)}
          />
          <select
            className={unitSelectClass}
            aria-label="Height unit"
            value={input.heightUnit}
            onChange={(e) => {
              const next = e.target.value as HeightUnit;
              const n = parseNumber(input.heightValue);
              if (n != null && n > 0) {
                const c = convertHeight(n, input.heightUnit, next);
                if (c != null) {
                  set({
                    heightUnit: next,
                    heightValue: formatUnitSwitch(c, next === 'cm' ? 1 : 2),
                  });
                  return;
                }
              }
              set({ heightUnit: next });
            }}
          >
            {(Object.keys(HEIGHT_UNIT_LABELS) as HeightUnit[]).map((u) => (
              <option key={u} value={u}>
                {HEIGHT_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.heightValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.heightValue}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="smwt-weight" className={labelClass}>
          Weight
        </label>
        <FieldShell error={errors.weightValue}>
          <input
            id="smwt-weight"
            className={inputClass}
            inputMode="decimal"
            value={input.weightValue}
            onChange={(e) => set({ weightValue: e.target.value })}
            aria-invalid={Boolean(errors.weightValue)}
          />
          <select
            className={unitSelectClass}
            aria-label="Weight unit"
            value={input.weightUnit}
            onChange={(e) => {
              const next = e.target.value as WeightUnit;
              const n = parseNumber(input.weightValue);
              if (n != null && n > 0) {
                const c = convertWeight(n, input.weightUnit, next);
                if (c != null) {
                  set({
                    weightUnit: next,
                    weightValue: formatUnitSwitch(c, 1),
                  });
                  return;
                }
              }
              set({ weightUnit: next });
            }}
          >
            {(Object.keys(WEIGHT_UNIT_LABELS) as WeightUnit[]).map((u) => (
              <option key={u} value={u}>
                {WEIGHT_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.weightValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.weightValue}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="smwt-predicted" className={labelClass}>
          <span>6MWD in healthy person</span>
          <InfoTooltip
            label="Predicted 6MWD"
            text="Enright–Sherrill reference equations for healthy adults aged 40–80. Male: 7.57×height(cm) − 5.02×age − 1.76×weight(kg) − 309. Female: 2.11×height(cm) − 2.29×weight(kg) − 5.78×age + 667. Predictions outside that age band or non-positive results are suppressed."
          />
        </label>
        <FieldShell muted>
          <input
            id="smwt-predicted"
            className={`${inputClass} ${hasPrediction ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
            readOnly
            value={result?.predictedDisplay ?? ''}
            placeholder="—"
            aria-live="polite"
          />
          <select
            className={unitSelectClass}
            aria-label="Predicted distance unit"
            value={input.predictedUnit}
            onChange={(e) =>
              set({ predictedUnit: e.target.value as DistanceUnit })
            }
          >
            {(Object.keys(DISTANCE_UNIT_LABELS) as DistanceUnit[]).map((u) => (
              <option key={u} value={u}>
                {DISTANCE_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {result?.domainMessage && !hasPrediction ? (
          <p className="mt-1 text-xs text-muted-foreground" role="status">
            {result.domainMessage}
          </p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between bg-muted/30 px-3 py-2.5 text-left text-sm font-semibold text-accent"
          onClick={() => set({ comparisonOpen: !input.comparisonOpen })}
          aria-expanded={input.comparisonOpen}
        >
          <span>Check your 6MWD</span>
          {input.comparisonOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        {input.comparisonOpen ? (
          <div className="space-y-4 border-t border-border p-3 sm:p-4">
            <div>
              <label htmlFor="smwt-observed" className={labelClass}>
                Distance walked
              </label>
              <FieldShell error={errors.observedDistance}>
                <input
                  id="smwt-observed"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.observedDistance}
                  onChange={(e) => set({ observedDistance: e.target.value })}
                  aria-invalid={Boolean(errors.observedDistance)}
                />
                <select
                  className={unitSelectClass}
                  aria-label="Observed distance unit"
                  value={input.observedUnit}
                  onChange={(e) => {
                    const next = e.target.value as DistanceUnit;
                    const n = parseNumber(input.observedDistance);
                    if (n != null && n >= 0) {
                      const c = convertDistance(n, input.observedUnit, next);
                      if (c != null) {
                        set({
                          observedUnit: next,
                          observedDistance: formatUnitSwitch(
                            c,
                            next === 'm' ? 1 : next === 'km' ? 4 : 1,
                          ),
                        });
                        return;
                      }
                    }
                    set({ observedUnit: next });
                  }}
                >
                  {(Object.keys(DISTANCE_UNIT_LABELS) as DistanceUnit[]).map(
                    (u) => (
                      <option key={u} value={u}>
                        {DISTANCE_UNIT_LABELS[u]}
                      </option>
                    ),
                  )}
                </select>
              </FieldShell>
              {errors.observedDistance ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.observedDistance}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="smwt-percent" className={labelClass}>
                <span>Percent of expected distance</span>
                <InfoTooltip
                  label="Percent of expected"
                  text="Percent = 100 × observed distance ÷ predicted healthy 6MWD. Equal distances → 100%. Zero observed → 0%."
                />
              </label>
              <FieldShell muted>
                <input
                  id="smwt-percent"
                  className={`${inputClass} ${result?.percentDisplay ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
                  readOnly
                  value={result?.percentDisplay ?? ''}
                  placeholder="—"
                  aria-live="polite"
                />
                <span className="shrink-0 pr-3 text-xs text-muted-foreground">
                  %
                </span>
              </FieldShell>
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}