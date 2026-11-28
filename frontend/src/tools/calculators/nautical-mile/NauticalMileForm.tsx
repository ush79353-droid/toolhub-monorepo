'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertDistance, convertSpeed, convertTime } from './calculation';
import {
  DISTANCE_UNIT_LABELS,
  IMPERIAL_UNITS,
  METRIC_UNITS,
  MODE_LABELS,
  SPEED_UNIT_LABELS,
  TIME_UNIT_LABELS,
  type CalculationMode,
  type DistanceUnit,
  type NauticalMileFieldErrors,
  type NauticalMileInput,
  type SpeedUnit,
  type TimeUnit,
  createEmptyInput,
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

interface NauticalMileFormProps {
  input: NauticalMileInput;
  errors: NauticalMileFieldErrors;
  onChange: (next: NauticalMileInput) => void;
  computedNmi?: string;
  computedImperial?: string;
  computedMetric?: string;
  computedDistance?: string;
  computedSpeed?: string;
  computedTime?: string;
}

export function NauticalMileForm({
  input,
  errors,
  onChange,
  computedNmi,
  computedImperial,
  computedMetric,
  computedDistance,
  computedSpeed,
  computedTime,
}: NauticalMileFormProps) {
  const set = (patch: Partial<NauticalMileInput>) =>
    onChange({ ...input, ...patch });

  const distRO = input.calculationMode === 'distance';
  const speedRO = input.calculationMode === 'speed';
  const timeRO = input.calculationMode === 'time';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        1 international nautical mile = exactly 1,852 m. A knot is 1 nmi per
        hour. Nautical miles are longer than statute miles.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (10 nmi · 15 kn × 4 h)
        </button>
      </div>

      {/* Convert */}
      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">Convert</h3>

        <div>
          <label htmlFor="nm-nmi" className={labelClass}>
            Nautical miles
            <InfoTooltip
              label="Nautical mile"
              text="Exactly 1,852 meters. Used in marine and aviation navigation."
            />
          </label>
          <FieldShell error={errors.nmiValue}>
            <input
              id="nm-nmi"
              className={`${inputClass} ${input.convertSource !== 'nmi' ? 'bg-muted/20' : ''}`}
              inputMode="decimal"
              value={
                input.convertSource === 'nmi'
                  ? input.nmiValue
                  : (computedNmi ?? '')
              }
              readOnly={input.convertSource !== 'nmi'}
              aria-invalid={Boolean(errors.nmiValue)}
              onChange={(e) =>
                set({ convertSource: 'nmi', nmiValue: e.target.value })
              }
              onFocus={() => set({ convertSource: 'nmi' })}
            />
          </FieldShell>
          {errors.nmiValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.nmiValue}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="nm-imp" className={labelClass}>
            Imperial / US units
            <InfoTooltip
              label="Statute mile"
              text="Land mile (1,609.344 m). Shorter than a nautical mile."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.imperialValue}>
              <input
                id="nm-imp"
                className={`${inputClass} ${input.convertSource !== 'imperial' ? 'bg-muted/20' : ''}`}
                inputMode="decimal"
                value={
                  input.convertSource === 'imperial'
                    ? input.imperialValue
                    : (computedImperial ?? '')
                }
                readOnly={input.convertSource !== 'imperial'}
                onChange={(e) =>
                  set({
                    convertSource: 'imperial',
                    imperialValue: e.target.value,
                  })
                }
                onFocus={() => set({ convertSource: 'imperial' })}
              />
            </FieldShell>
            <select
              className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.imperialUnit}
              aria-label="Imperial unit"
              onChange={(e) => {
                const next = e.target.value as DistanceUnit;
                if (
                  input.convertSource === 'imperial' &&
                  Number.isFinite(Number(input.imperialValue))
                ) {
                  const n = Number(input.imperialValue.replace(/,/g, ''));
                  if (n >= 0) {
                    set({
                      imperialUnit: next,
                      imperialValue: String(
                        Number(
                          convertDistance(
                            n,
                            input.imperialUnit,
                            next,
                          ).toPrecision(12),
                        ),
                      ),
                    });
                    return;
                  }
                }
                set({ imperialUnit: next });
              }}
            >
              {IMPERIAL_UNITS.map((u) => (
                <option key={u} value={u}>
                  {DISTANCE_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="nm-metric" className={labelClass}>
            Metric units
            <InfoTooltip
              label="Kilometer"
              text="1 nmi = 1.852 km exactly."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.metricValue}>
              <input
                id="nm-metric"
                className={`${inputClass} ${input.convertSource !== 'metric' ? 'bg-muted/20' : ''}`}
                inputMode="decimal"
                value={
                  input.convertSource === 'metric'
                    ? input.metricValue
                    : (computedMetric ?? '')
                }
                readOnly={input.convertSource !== 'metric'}
                onChange={(e) =>
                  set({
                    convertSource: 'metric',
                    metricValue: e.target.value,
                  })
                }
                onFocus={() => set({ convertSource: 'metric' })}
              />
            </FieldShell>
            <select
              className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.metricUnit}
              aria-label="Metric unit"
              onChange={(e) => {
                const next = e.target.value as DistanceUnit;
                if (
                  input.convertSource === 'metric' &&
                  Number.isFinite(Number(input.metricValue))
                ) {
                  const n = Number(input.metricValue.replace(/,/g, ''));
                  if (n >= 0) {
                    set({
                      metricUnit: next,
                      metricValue: String(
                        Number(
                          convertDistance(
                            n,
                            input.metricUnit,
                            next,
                          ).toPrecision(12),
                        ),
                      ),
                    });
                    return;
                  }
                }
                set({ metricUnit: next });
              }}
            >
              {METRIC_UNITS.map((u) => (
                <option key={u} value={u}>
                  {DISTANCE_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Calculate */}
      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">Calculate</h3>

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
          <label htmlFor="nm-time" className={labelClass}>
            Time
            {timeRO ? (
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                (calculated)
              </span>
            ) : null}
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.time}>
              <input
                id="nm-time"
                className={`${inputClass} ${timeRO ? 'bg-muted/30' : ''}`}
                inputMode="decimal"
                readOnly={timeRO}
                value={timeRO ? (computedTime ?? '') : input.time}
                onChange={(e) => set({ time: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.timeUnit}
              aria-label="Time unit"
              onChange={(e) => {
                const next = e.target.value as TimeUnit;
                const n = Number(input.time.replace(/,/g, ''));
                if (Number.isFinite(n) && n >= 0 && !timeRO) {
                  set({
                    timeUnit: next,
                    time: String(
                      Number(
                        convertTime(n, input.timeUnit, next).toPrecision(12),
                      ),
                    ),
                  });
                } else {
                  set({ timeUnit: next });
                }
              }}
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

        <div>
          <label htmlFor="nm-speed" className={labelClass}>
            Speed
            <InfoTooltip
              label="Knot"
              text="One knot = one nautical mile per hour."
            />
            {speedRO ? (
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                (calculated)
              </span>
            ) : null}
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.speed}>
              <input
                id="nm-speed"
                className={`${inputClass} ${speedRO ? 'bg-muted/30' : ''}`}
                inputMode="decimal"
                readOnly={speedRO}
                value={speedRO ? (computedSpeed ?? '') : input.speed}
                onChange={(e) => set({ speed: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.speedUnit}
              aria-label="Speed unit"
              onChange={(e) => {
                const next = e.target.value as SpeedUnit;
                const n = Number(input.speed.replace(/,/g, ''));
                if (Number.isFinite(n) && n >= 0 && !speedRO) {
                  set({
                    speedUnit: next,
                    speed: String(
                      Number(
                        convertSpeed(n, input.speedUnit, next).toPrecision(12),
                      ),
                    ),
                  });
                } else {
                  set({ speedUnit: next });
                }
              }}
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
          <label htmlFor="nm-dist" className={labelClass}>
            Distance
            {distRO ? (
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                (calculated)
              </span>
            ) : null}
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.distance}>
              <input
                id="nm-dist"
                className={`${inputClass} ${distRO ? 'bg-muted/30' : ''}`}
                inputMode="decimal"
                readOnly={distRO}
                value={distRO ? (computedDistance ?? '') : input.distance}
                onChange={(e) => set({ distance: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.distanceUnit}
              aria-label="Distance unit"
              onChange={(e) => {
                const next = e.target.value as DistanceUnit;
                const n = Number(input.distance.replace(/,/g, ''));
                if (Number.isFinite(n) && n >= 0 && !distRO) {
                  set({
                    distanceUnit: next,
                    distance: String(
                      Number(
                        convertDistance(
                          n,
                          input.distanceUnit,
                          next,
                        ).toPrecision(12),
                      ),
                    ),
                  });
                } else {
                  set({ distanceUnit: next });
                }
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
          </div>
          {errors.distance ? (
            <p className="mt-1 text-xs text-rose-600">{errors.distance}</p>
          ) : null}
        </div>
      </div>

      <details
        className="rounded-xl border border-border bg-muted/10"
        open={input.showSpeedConvert}
        onToggle={(e) =>
          set({ showSpeedConvert: (e.target as HTMLDetailsElement).open })
        }
      >
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Nautical speed converter
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div className="flex gap-2">
            <FieldShell error={errors.convertSpeedValue}>
              <input
                className={inputClass}
                inputMode="decimal"
                value={input.convertSpeedValue}
                aria-label="Speed to convert"
                onChange={(e) => set({ convertSpeedValue: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.convertSpeedFrom}
              aria-label="From speed unit"
              onChange={(e) =>
                set({ convertSpeedFrom: e.target.value as SpeedUnit })
              }
            >
              {(Object.keys(SPEED_UNIT_LABELS) as SpeedUnit[]).map((u) => (
                <option key={u} value={u}>
                  {SPEED_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
            <span className="flex items-center text-xs text-muted-foreground">
              →
            </span>
            <select
              className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.convertSpeedTo}
              aria-label="To speed unit"
              onChange={(e) =>
                set({ convertSpeedTo: e.target.value as SpeedUnit })
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
      </details>

      <details
        className="rounded-xl border border-border bg-muted/10"
        open={input.showCoords}
        onToggle={(e) =>
          set({ showCoords: (e.target as HTMLDetailsElement).open })
        }
      >
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Distance between coordinates
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <p className="text-xs text-muted-foreground">
            Approximate spherical great-circle distance — not a certified
            navigation route.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="nm-lat1" className={labelClass}>
                Start latitude
              </label>
              <FieldShell error={errors.lat1}>
                <input
                  id="nm-lat1"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.lat1}
                  onChange={(e) => set({ lat1: e.target.value })}
                />
              </FieldShell>
            </div>
            <div>
              <label htmlFor="nm-lon1" className={labelClass}>
                Start longitude
              </label>
              <FieldShell error={errors.lon1}>
                <input
                  id="nm-lon1"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.lon1}
                  onChange={(e) => set({ lon1: e.target.value })}
                />
              </FieldShell>
            </div>
            <div>
              <label htmlFor="nm-lat2" className={labelClass}>
                End latitude
              </label>
              <FieldShell error={errors.lat2}>
                <input
                  id="nm-lat2"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.lat2}
                  onChange={(e) => set({ lat2: e.target.value })}
                />
              </FieldShell>
            </div>
            <div>
              <label htmlFor="nm-lon2" className={labelClass}>
                End longitude
              </label>
              <FieldShell error={errors.lon2}>
                <input
                  id="nm-lon2"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.lon2}
                  onChange={(e) => set({ lon2: e.target.value })}
                />
              </FieldShell>
            </div>
          </div>
        </div>
      </details>
    </form>
  );
}
