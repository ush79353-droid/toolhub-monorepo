'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertDistance, convertSpeed, convertTime, fmt } from './calculation';
import {
  DISTANCE_UNIT_LABELS,
  MODE_LABELS,
  SPEED_UNIT_LABELS,
  TIME_UNIT_LABELS,
  createEmptyInput,
  type CalculationMode,
  type DistanceUnit,
  type SpeedFieldErrors,
  type SpeedInput,
  type SpeedResult,
  type SpeedUnit,
  type TimeUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'bg-muted/20' : 'bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

interface SpeedFormProps {
  input: SpeedInput;
  errors: SpeedFieldErrors;
  result: SpeedResult | null;
  onChange: (next: SpeedInput) => void;
}

export function SpeedForm({
  input,
  errors,
  result,
  onChange,
}: SpeedFormProps) {
  const set = (patch: Partial<SpeedInput>) => onChange({ ...input, ...patch });
  const distRO = input.calculationMode === 'distance';
  const timeRO = input.calculationMode === 'time';
  const speedRO = input.calculationMode === 'speed';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Speed = distance ÷ time. Choose what to calculate; the other two fields
        stay editable. Units convert without changing the physical quantity.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (150 km · 3 h)
        </button>
      </div>

      <div>
        <label htmlFor="spd-mode" className={labelClass}>
          Calculate
        </label>
        <select
          id="spd-mode"
          className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
          value={input.calculationMode}
          onChange={(e) =>
            set({ calculationMode: e.target.value as CalculationMode })
          }
        >
          {(Object.keys(MODE_LABELS) as CalculationMode[]).map((m) => (
            <option key={m} value={m}>
              {MODE_LABELS[m]}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">Inputs</h3>

        <div>
          <label htmlFor="spd-dist" className={labelClass}>
            Distance
            <InfoTooltip
              label="Distance"
              text="Path length traveled (scalar). Not displacement."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.distance} muted={distRO}>
              <input
                id="spd-dist"
                className={inputClass}
                inputMode="decimal"
                readOnly={distRO}
                value={
                  distRO
                    ? (result?.distanceValue != null
                        ? fmt(result.distanceValue, 4)
                        : '')
                    : input.distance
                }
                aria-invalid={Boolean(errors.distance)}
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
                if (!distRO && Number.isFinite(n) && n >= 0 && input.distance.trim()) {
                  set({
                    distanceUnit: next,
                    distance: String(
                      Number(
                        convertDistance(n, input.distanceUnit, next).toPrecision(
                          12,
                        ),
                      ),
                    ),
                  });
                  return;
                }
                set({ distanceUnit: next });
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

        <div>
          <label htmlFor="spd-time" className={labelClass}>
            Time
            <InfoTooltip
              label="Time"
              text="Elapsed duration for the trip, not a clock time of day."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.time} muted={timeRO}>
              <input
                id="spd-time"
                className={inputClass}
                inputMode="decimal"
                readOnly={timeRO}
                value={
                  timeRO
                    ? (result?.timeValue != null
                        ? fmt(result.timeValue, 4)
                        : '')
                    : input.time
                }
                aria-invalid={Boolean(errors.time)}
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
                if (!timeRO && Number.isFinite(n) && n >= 0 && input.time.trim()) {
                  set({
                    timeUnit: next,
                    time: String(
                      Number(
                        convertTime(n, input.timeUnit, next).toPrecision(12),
                      ),
                    ),
                  });
                  return;
                }
                set({ timeUnit: next });
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
          <label htmlFor="spd-speed" className={labelClass}>
            Speed
            <InfoTooltip
              label="Speed"
              text="Distance per unit time (scalar). Average over the entered duration."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.speed} muted={speedRO}>
              <input
                id="spd-speed"
                className={inputClass}
                inputMode="decimal"
                readOnly={speedRO}
                value={
                  speedRO
                    ? (result?.speedValue != null
                        ? fmt(result.speedValue, 4)
                        : '')
                    : input.speed
                }
                aria-invalid={Boolean(errors.speed)}
                onChange={(e) => set({ speed: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[100px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.speedUnit}
              aria-label="Speed unit"
              onChange={(e) => {
                const next = e.target.value as SpeedUnit;
                const n = Number(input.speed.replace(/,/g, ''));
                if (
                  !speedRO &&
                  Number.isFinite(n) &&
                  n >= 0 &&
                  input.speed.trim()
                ) {
                  set({
                    speedUnit: next,
                    speed: String(
                      Number(
                        convertSpeed(n, input.speedUnit, next).toPrecision(12),
                      ),
                    ),
                  });
                  return;
                }
                set({ speedUnit: next });
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
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={input.showCompare}
            onChange={(e) => set({ showCompare: e.target.checked })}
          />
          Compare to the speed of other things
          <InfoTooltip
            label="Speed comparison"
            text="Illustrative approximate reference speeds — not constant real-world values."
          />
        </label>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={input.showAverage}
            onChange={(e) => set({ showAverage: e.target.checked })}
          />
          Multi-segment average speed
          <InfoTooltip
            label="Average speed"
            text="Total distance ÷ total time across segments — not the mean of speeds unless times are equal."
          />
        </label>
        {input.showAverage ? (
          <div className="space-y-3">
            {input.segments.map((seg, idx) => (
              <div
                key={seg.id}
                className="space-y-2 rounded-lg border border-border p-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-accent">
                    Segment {idx + 1}
                  </span>
                  {input.segments.length > 1 ? (
                    <button
                      type="button"
                      className="text-xs text-rose-600"
                      onClick={() =>
                        set({
                          segments: input.segments.filter((s) => s.id !== seg.id),
                        })
                      }
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <FieldShell>
                    <input
                      className={inputClass}
                      inputMode="decimal"
                      placeholder="Distance"
                      aria-label={`Segment ${idx + 1} distance`}
                      value={seg.distance}
                      onChange={(e) => {
                        const segments = input.segments.map((s) =>
                          s.id === seg.id
                            ? { ...s, distance: e.target.value }
                            : s,
                        );
                        set({ segments });
                      }}
                    />
                  </FieldShell>
                  <select
                    className="h-11 w-[72px] shrink-0 rounded-lg border border-border bg-white px-1 text-sm"
                    value={seg.distanceUnit}
                    aria-label={`Segment ${idx + 1} distance unit`}
                    onChange={(e) => {
                      const segments = input.segments.map((s) =>
                        s.id === seg.id
                          ? {
                              ...s,
                              distanceUnit: e.target.value as DistanceUnit,
                            }
                          : s,
                      );
                      set({ segments });
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
                <div className="flex gap-2">
                  <FieldShell>
                    <input
                      className={inputClass}
                      inputMode="decimal"
                      placeholder="Time"
                      aria-label={`Segment ${idx + 1} time`}
                      value={seg.time}
                      onChange={(e) => {
                        const segments = input.segments.map((s) =>
                          s.id === seg.id ? { ...s, time: e.target.value } : s,
                        );
                        set({ segments });
                      }}
                    />
                  </FieldShell>
                  <select
                    className="h-11 w-[72px] shrink-0 rounded-lg border border-border bg-white px-1 text-sm"
                    value={seg.timeUnit}
                    aria-label={`Segment ${idx + 1} time unit`}
                    onChange={(e) => {
                      const segments = input.segments.map((s) =>
                        s.id === seg.id
                          ? { ...s, timeUnit: e.target.value as TimeUnit }
                          : s,
                      );
                      set({ segments });
                    }}
                  >
                    {(Object.keys(TIME_UNIT_LABELS) as TimeUnit[]).map((u) => (
                      <option key={u} value={u}>
                        {TIME_UNIT_LABELS[u]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
              onClick={() =>
                set({
                  segments: [
                    ...input.segments,
                    {
                      id: String(Date.now()),
                      distance: '',
                      distanceUnit: 'km',
                      time: '',
                      timeUnit: 'h',
                    },
                  ],
                })
              }
            >
              Add segment
            </button>
          </div>
        ) : null}
      </div>
    </form>
  );
}
