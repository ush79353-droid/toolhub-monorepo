'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  fromHours,
  fromMiles,
  fromMph,
  toHours,
  toMiles,
  toMph,
} from './calculation';
import {
  DISTANCE_UNIT_LABELS,
  MODE_LABELS,
  SPEED_UNIT_LABELS,
  TIME_UNIT_LABELS,
  type DistanceUnit,
  type EngineHoursFieldErrors,
  type EngineHoursInput,
  type EngineHoursMode,
  type SpeedUnit,
  type TimeUnit,
  createExampleDriving,
  createExampleReverse,
  createExampleStationary,
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

interface EngineHoursFormProps {
  input: EngineHoursInput;
  errors: EngineHoursFieldErrors;
  onChange: (next: EngineHoursInput) => void;
}

export function EngineHoursForm({
  input,
  errors,
  onChange,
}: EngineHoursFormProps) {
  const set = (patch: Partial<EngineHoursInput>) =>
    onChange({ ...input, ...patch });

  const changeTimeUnit = (next: TimeUnit) => {
    const n = Number(input.engineHours.replace(/,/g, ''));
    if (Number.isFinite(n) && n >= 0) {
      const h = toHours(n, input.engineHoursUnit);
      set({
        engineHoursUnit: next,
        engineHours: String(Number(fromHours(h, next).toPrecision(12))),
      });
      return;
    }
    set({ engineHoursUnit: next });
  };

  const changeSpeedUnit = (next: SpeedUnit) => {
    const n = Number(input.averageSpeed.replace(/,/g, ''));
    if (Number.isFinite(n) && n >= 0) {
      const mph = toMph(n, input.averageSpeedUnit);
      set({
        averageSpeedUnit: next,
        averageSpeed: String(Number(fromMph(mph, next).toPrecision(12))),
      });
      return;
    }
    set({ averageSpeedUnit: next });
  };

  const changeDistanceUnit = (next: DistanceUnit) => {
    const n = Number(input.distance.replace(/,/g, ''));
    if (Number.isFinite(n) && n >= 0) {
      const mi = toMiles(n, input.distanceUnit);
      set({
        distanceUnit: next,
        distance: String(Number(fromMiles(mi, next).toPrecision(12))),
      });
      return;
    }
    set({ distanceUnit: next });
  };

  const changeFactorUnit = (next: 'mi/h' | 'km/h') => {
    const n = Number(input.maintenanceFactor.replace(/,/g, ''));
    if (Number.isFinite(n) && n >= 0) {
      const miPerH =
        input.maintenanceFactorUnit === 'km/h' ? toMiles(n, 'km') : n;
      const display =
        next === 'km/h' ? fromMiles(miPerH, 'km') : miPerH;
      set({
        maintenanceFactorUnit: next,
        maintenanceFactor: String(Number(display.toPrecision(12))),
      });
      return;
    }
    set({ maintenanceFactorUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Estimate driving distance from engine hours × average speed, reverse to
        hours from distance, or explore idle-hour maintenance-equivalent mileage.
        Stationary equivalent miles are an assumption — not actual travel.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createExampleDriving())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example driving (1,000 h · 30 mph)
        </button>
        <button
          type="button"
          onClick={() => onChange(createExampleStationary())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example idle (500 h)
        </button>
        <button
          type="button"
          onClick={() => onChange(createExampleReverse())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example reverse (60,000 mi)
        </button>
      </div>

      <fieldset>
        <legend className={labelClass}>
          I want to convert
          <InfoTooltip
            label="Conversion mode"
            text="Driving estimates distance from hours × speed. Stationary keeps actual distance at zero and optionally applies your maintenance factor. Reverse estimates driving hours from distance ÷ speed."
          />
        </legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
          {(Object.keys(MODE_LABELS) as EngineHoursMode[]).map((m) => (
            <label
              key={m}
              className="inline-flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="eh-mode"
                checked={input.mode === m}
                onChange={() => set({ mode: m })}
              />
              {MODE_LABELS[m]}
            </label>
          ))}
        </div>
      </fieldset>

      {input.mode === 'driving' || input.mode === 'stationary' ? (
        <div>
          <label htmlFor="eh-hours" className={labelClass}>
            {input.mode === 'stationary'
              ? 'Stationary engine hours'
              : 'Engine hours'}
            <InfoTooltip
              label="Engine hours"
              text="Cumulative engine operating time. Driving hours imply motion; stationary hours are idling or PTO-style use with no road travel."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.engineHours}>
              <input
                id="eh-hours"
                className={inputClass}
                inputMode="decimal"
                value={input.engineHours}
                aria-invalid={Boolean(errors.engineHours)}
                onChange={(e) => set({ engineHours: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[72px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.engineHoursUnit}
              aria-label="Engine hours unit"
              onChange={(e) => changeTimeUnit(e.target.value as TimeUnit)}
            >
              {(Object.keys(TIME_UNIT_LABELS) as TimeUnit[]).map((u) => (
                <option key={u} value={u}>
                  {TIME_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
          {errors.engineHours ? (
            <p className="mt-1 text-xs text-rose-600">{errors.engineHours}</p>
          ) : null}
        </div>
      ) : null}

      {input.mode === 'distanceToHours' ? (
        <div>
          <label htmlFor="eh-dist" className={labelClass}>
            Distance
            <InfoTooltip
              label="Distance"
              text="Road distance used to estimate driving engine hours. Not the same as total hour-meter time if idle is included."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.distance}>
              <input
                id="eh-dist"
                className={inputClass}
                inputMode="decimal"
                value={input.distance}
                aria-invalid={Boolean(errors.distance)}
                onChange={(e) => set({ distance: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[72px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.distanceUnit}
              aria-label="Distance unit"
              onChange={(e) =>
                changeDistanceUnit(e.target.value as DistanceUnit)
              }
            >
              {(Object.keys(DISTANCE_UNIT_LABELS) as DistanceUnit[]).map(
                (u) => (
                  <option key={u} value={u}>
                    {DISTANCE_UNIT_LABELS[u]}
                  </option>
                ),
              )}
            </select>
          </div>
          {errors.distance ? (
            <p className="mt-1 text-xs text-rose-600">{errors.distance}</p>
          ) : null}
        </div>
      ) : null}

      {input.mode === 'driving' || input.mode === 'distanceToHours' ? (
        <div>
          <label htmlFor="eh-speed" className={labelClass}>
            Average speed
            <InfoTooltip
              label="Average speed"
              text="Overall average driving speed for the estimate. Distinct from a maintenance-equivalence factor used in stationary mode."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.averageSpeed}>
              <input
                id="eh-speed"
                className={inputClass}
                inputMode="decimal"
                value={input.averageSpeed}
                aria-invalid={Boolean(errors.averageSpeed)}
                onChange={(e) => set({ averageSpeed: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[80px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.averageSpeedUnit}
              aria-label="Average speed unit"
              onChange={(e) => changeSpeedUnit(e.target.value as SpeedUnit)}
            >
              {(Object.keys(SPEED_UNIT_LABELS) as SpeedUnit[]).map((u) => (
                <option key={u} value={u}>
                  {SPEED_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
          {errors.averageSpeed ? (
            <p className="mt-1 text-xs text-rose-600">{errors.averageSpeed}</p>
          ) : null}
        </div>
      ) : null}

      {input.mode === 'stationary' ? (
        <div>
          <label htmlFor="eh-factor" className={labelClass}>
            Maintenance conversion factor (assumption)
            <InfoTooltip
              label="Conversion factor"
              text="User-selected miles (or km) of equivalent wear per idle hour. Not a universal OEM standard — check your maintenance policy."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.maintenanceFactor}>
              <input
                id="eh-factor"
                className={inputClass}
                inputMode="decimal"
                value={input.maintenanceFactor}
                aria-invalid={Boolean(errors.maintenanceFactor)}
                onChange={(e) => set({ maintenanceFactor: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[80px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.maintenanceFactorUnit}
              aria-label="Maintenance factor unit"
              onChange={(e) =>
                changeFactorUnit(e.target.value as 'mi/h' | 'km/h')
              }
            >
              <option value="mi/h">mi/h</option>
              <option value="km/h">km/h</option>
            </select>
          </div>
          {errors.maintenanceFactor ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.maintenanceFactor}
            </p>
          ) : null}
          <p className="mt-1.5 text-xs text-muted-foreground">
            Default 30 mi/h is illustrative only — edit to match your policy.
          </p>
        </div>
      ) : null}

      {input.mode === 'driving' || input.mode === 'stationary' ? (
        <div>
          <label htmlFor="eh-result-dist" className={labelClass}>
            Result distance unit
          </label>
          <select
            id="eh-result-dist"
            className="h-11 w-full max-w-[160px] rounded-lg border border-border bg-white px-3 text-sm"
            value={input.resultDistanceUnit}
            onChange={(e) =>
              set({ resultDistanceUnit: e.target.value as DistanceUnit })
            }
          >
            {(Object.keys(DISTANCE_UNIT_LABELS) as DistanceUnit[]).map((u) => (
              <option key={u} value={u}>
                {DISTANCE_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div>
          <label htmlFor="eh-result-time" className={labelClass}>
            Result time unit
          </label>
          <select
            id="eh-result-time"
            className="h-11 w-full max-w-[160px] rounded-lg border border-border bg-white px-3 text-sm"
            value={input.resultTimeUnit}
            onChange={(e) =>
              set({ resultTimeUnit: e.target.value as TimeUnit })
            }
          >
            {(Object.keys(TIME_UNIT_LABELS) as TimeUnit[]).map((u) => (
              <option key={u} value={u}>
                {TIME_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
      )}

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
