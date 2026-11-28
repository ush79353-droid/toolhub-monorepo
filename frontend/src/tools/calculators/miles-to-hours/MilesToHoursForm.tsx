'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertDistance, convertSpeed, convertTime } from './calculation';
import {
  DISTANCE_UNIT_LABELS,
  MODE_LABELS,
  SPEED_UNIT_LABELS,
  TIME_UNIT_LABELS,
  type CalculationMode,
  type DistanceUnit,
  type MilesToHoursFieldErrors,
  type MilesToHoursInput,
  type SpeedUnit,
  type TimeUnit,
  createEmptyInput,
  createDistanceModeExample,
  createSpeedModeExample,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

interface MilesToHoursFormProps {
  input: MilesToHoursInput;
  errors: MilesToHoursFieldErrors;
  onChange: (next: MilesToHoursInput) => void;
  /** Calculated display values for the read-only result field */
  computedDistance?: string;
  computedSpeed?: string;
  computedTime?: string;
}

export function MilesToHoursForm({
  input,
  errors,
  onChange,
  computedDistance,
  computedSpeed,
  computedTime,
}: MilesToHoursFormProps) {
  const set = (patch: Partial<MilesToHoursInput>) =>
    onChange({ ...input, ...patch });

  const changeDistanceUnit = (next: DistanceUnit) => {
    const n = Number(input.distance.replace(/,/g, ''));
    if (Number.isFinite(n) && n >= 0 && input.calculationMode !== 'distance') {
      set({
        distanceUnit: next,
        distance: String(
          Number(convertDistance(n, input.distanceUnit, next).toPrecision(12)),
        ),
      });
      return;
    }
    set({ distanceUnit: next });
  };

  const changeSpeedUnit = (next: SpeedUnit) => {
    const n = Number(input.speed.replace(/,/g, ''));
    if (Number.isFinite(n) && n >= 0 && input.calculationMode !== 'speed') {
      set({
        speedUnit: next,
        speed: String(
          Number(convertSpeed(n, input.speedUnit, next).toPrecision(12)),
        ),
      });
      return;
    }
    set({ speedUnit: next });
  };

  const changeTimeUnit = (next: TimeUnit) => {
    const n = Number(input.time.replace(/,/g, ''));
    if (Number.isFinite(n) && n >= 0 && input.calculationMode !== 'time') {
      set({
        timeUnit: next,
        time: String(
          Number(convertTime(n, input.timeUnit, next).toPrecision(12)),
        ),
      });
      return;
    }
    set({ timeUnit: next });
  };

  const distReadOnly = input.calculationMode === 'distance';
  const speedReadOnly = input.calculationMode === 'speed';
  const timeReadOnly = input.calculationMode === 'time';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Miles cannot become hours without speed. Choose which value to
        calculate — the other two are inputs. Assumes constant average speed.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (150 mi · 50 mph)
        </button>
        <button
          type="button"
          onClick={() => onChange(createDistanceModeExample())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Find distance
        </button>
        <button
          type="button"
          onClick={() => onChange(createSpeedModeExample())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Find speed
        </button>
      </div>

      <div>
        <span className={labelClass}>Calculate</span>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(MODE_LABELS) as CalculationMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => set({ calculationMode: m })}
              className={`rounded-lg border px-2 py-2 text-xs font-medium ${
                input.calculationMode === m
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-white text-accent hover:bg-muted/30'
              }`}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="mth-distance" className={labelClass}>
          Distance
          <InfoTooltip
            label="Distance"
            text="Travel distance. 1 mi = 1.609344 km = 1609.344 m. 1 nmi = 1852 m."
          />
          {distReadOnly ? (
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              (calculated)
            </span>
          ) : null}
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.distance}>
            <input
              id="mth-distance"
              className={`${inputClass} ${distReadOnly ? 'bg-muted/30' : ''}`}
              inputMode="decimal"
              readOnly={distReadOnly}
              value={distReadOnly ? (computedDistance ?? '') : input.distance}
              aria-invalid={Boolean(errors.distance)}
              onChange={(e) => set({ distance: e.target.value })}
            />
          </FieldShell>
          <select
            className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
            value={input.distanceUnit}
            aria-label="Distance unit"
            onChange={(e) =>
              changeDistanceUnit(e.target.value as DistanceUnit)
            }
          >
            {(Object.keys(DISTANCE_UNIT_LABELS) as DistanceUnit[]).map((u) => (
              <option key={u} value={u}>
                {DISTANCE_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
        {errors.distance ? (
          <p className="mt-1 text-xs text-rose-600">{errors.distance}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="mth-speed" className={labelClass}>
          Speed
          <InfoTooltip
            label="Average speed"
            text="Constant average speed for the trip. Not a recommendation to exceed legal limits."
          />
          {speedReadOnly ? (
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              (calculated)
            </span>
          ) : null}
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.speed}>
            <input
              id="mth-speed"
              className={`${inputClass} ${speedReadOnly ? 'bg-muted/30' : ''}`}
              inputMode="decimal"
              readOnly={speedReadOnly}
              value={speedReadOnly ? (computedSpeed ?? '') : input.speed}
              aria-invalid={Boolean(errors.speed)}
              onChange={(e) => set({ speed: e.target.value })}
            />
          </FieldShell>
          <select
            className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
            value={input.speedUnit}
            aria-label="Speed unit"
            onChange={(e) => changeSpeedUnit(e.target.value as SpeedUnit)}
          >
            {(Object.keys(SPEED_UNIT_LABELS) as SpeedUnit[]).map((u) => (
              <option key={u} value={u}>
                {SPEED_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
        {errors.speed ? (
          <p className="mt-1 text-xs text-rose-600">{errors.speed}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="mth-time" className={labelClass}>
          Time
          <InfoTooltip
            label="Travel time"
            text="Journey duration at the stated average speed. Convert freely between s, min, h, d, wk."
          />
          {timeReadOnly ? (
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              (calculated)
            </span>
          ) : null}
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.time}>
            <input
              id="mth-time"
              className={`${inputClass} ${timeReadOnly ? 'bg-muted/30' : ''}`}
              inputMode="decimal"
              readOnly={timeReadOnly}
              value={timeReadOnly ? (computedTime ?? '') : input.time}
              aria-invalid={Boolean(errors.time)}
              onChange={(e) => set({ time: e.target.value })}
            />
          </FieldShell>
          <select
            className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
            value={input.timeUnit}
            aria-label="Time unit"
            onChange={(e) => changeTimeUnit(e.target.value as TimeUnit)}
          >
            {(Object.keys(TIME_UNIT_LABELS) as TimeUnit[]).map((u) => (
              <option key={u} value={u}>
                {TIME_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
        {errors.time ? (
          <p className="mt-1 text-xs text-rose-600">{errors.time}</p>
        ) : null}
      </div>

      <details
        className="rounded-xl border border-border bg-muted/10"
        open={input.showCompare}
        onToggle={(e) =>
          set({ showCompare: (e.target as HTMLDetailsElement).open })
        }
      >
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Compare travel speeds
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <p className="text-xs text-muted-foreground">
            Speed A is the main speed above. Enter Speed B to compare times for
            the same distance.
          </p>
          <div>
            <label htmlFor="mth-speed-b" className={labelClass}>
              Speed B
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.compareSpeedB}>
                <input
                  id="mth-speed-b"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.compareSpeedB}
                  onChange={(e) => set({ compareSpeedB: e.target.value })}
                />
              </FieldShell>
              <select
                className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                value={input.compareSpeedBUnit}
                aria-label="Speed B unit"
                onChange={(e) =>
                  set({ compareSpeedBUnit: e.target.value as SpeedUnit })
                }
              >
                {(Object.keys(SPEED_UNIT_LABELS) as SpeedUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {SPEED_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/10"
        open={input.showBreaks}
        onToggle={(e) =>
          set({ showBreaks: (e.target as HTMLDetailsElement).open })
        }
      >
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Include breaks in travel time
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div>
            <label htmlFor="mth-breaks" className={labelClass}>
              Number of breaks
            </label>
            <FieldShell error={errors.numberOfBreaks}>
              <input
                id="mth-breaks"
                className={inputClass}
                inputMode="decimal"
                value={input.numberOfBreaks}
                onChange={(e) => set({ numberOfBreaks: e.target.value })}
              />
            </FieldShell>
          </div>
          <div>
            <label htmlFor="mth-break-dur" className={labelClass}>
              Average break duration
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.breakDuration}>
                <input
                  id="mth-break-dur"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.breakDuration}
                  onChange={(e) => set({ breakDuration: e.target.value })}
                />
              </FieldShell>
              <select
                className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                value={input.breakDurationUnit}
                aria-label="Break duration unit"
                onChange={(e) =>
                  set({ breakDurationUnit: e.target.value as TimeUnit })
                }
              >
                {(Object.keys(TIME_UNIT_LABELS) as TimeUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {TIME_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </details>
    </form>
  );
}
