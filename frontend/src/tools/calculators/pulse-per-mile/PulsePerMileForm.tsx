'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertTireDiameter } from './calculation';
import {
  SPEED_UNIT_LABELS,
  TIRE_DIAMETER_UNIT_LABELS,
  createEmptyInput,
  type PulsePerMileFieldErrors,
  type PulsePerMileInput,
  type SpeedUnit,
  type TireDiameterUnit,
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

interface PulsePerMileFormProps {
  input: PulsePerMileInput;
  errors: PulsePerMileFieldErrors;
  onChange: (next: PulsePerMileInput) => void;
}

export function PulsePerMileForm({
  input,
  errors,
  onChange,
}: PulsePerMileFormProps) {
  const set = (patch: Partial<PulsePerMileInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        You can enter tire diameter in inches or centimeters (also mm or ft).
        Enter your axle ratio and the number of teeth on the reluctor to
        calculate wheel rotations and pulses per mile.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (3.42 · 20 · 26 in)
        </button>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">Inputs</h3>

        <div>
          <label htmlFor="ppm-axle" className={labelClass}>
            Axle ratio
            <InfoTooltip
              label="Axle ratio"
              text="Driveshaft revolutions per one wheel revolution (e.g. 3.42:1)."
            />
          </label>
          <FieldShell error={errors.axleRatio}>
            <input
              id="ppm-axle"
              className={inputClass}
              inputMode="decimal"
              value={input.axleRatio}
              aria-invalid={Boolean(errors.axleRatio)}
              onChange={(e) => set({ axleRatio: e.target.value })}
            />
          </FieldShell>
          {errors.axleRatio ? (
            <p className="mt-1 text-xs text-rose-600">{errors.axleRatio}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ppm-teeth" className={labelClass}>
            Number of teeth on the reluctor
            <InfoTooltip
              label="Reluctor teeth"
              text="Tooth count on the tone wheel that the vehicle speed sensor reads."
            />
          </label>
          <FieldShell error={errors.reluctorTeeth}>
            <input
              id="ppm-teeth"
              className={inputClass}
              inputMode="numeric"
              value={input.reluctorTeeth}
              aria-invalid={Boolean(errors.reluctorTeeth)}
              onChange={(e) => set({ reluctorTeeth: e.target.value })}
            />
          </FieldShell>
          {errors.reluctorTeeth ? (
            <p className="mt-1 text-xs text-rose-600">{errors.reluctorTeeth}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ppm-td" className={labelClass}>
            Tire diameter
            <InfoTooltip
              label="Tire diameter"
              text="Nominal overall tire diameter. Real rolling circumference can differ with load and wear."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.tireDiameter}>
              <input
                id="ppm-td"
                className={inputClass}
                inputMode="decimal"
                value={input.tireDiameter}
                aria-invalid={Boolean(errors.tireDiameter)}
                onChange={(e) => set({ tireDiameter: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.tireDiameterUnit}
              aria-label="Tire diameter unit"
              onChange={(e) => {
                const next = e.target.value as TireDiameterUnit;
                const n = Number(input.tireDiameter.replace(/,/g, ''));
                if (Number.isFinite(n) && n > 0) {
                  set({
                    tireDiameterUnit: next,
                    tireDiameter: String(
                      Number(
                        convertTireDiameter(
                          n,
                          input.tireDiameterUnit,
                          next,
                        ).toPrecision(12),
                      ),
                    ),
                  });
                  return;
                }
                set({ tireDiameterUnit: next });
              }}
            >
              {(Object.keys(TIRE_DIAMETER_UNIT_LABELS) as TireDiameterUnit[]).map(
                (u) => (
                  <option key={u} value={u}>
                    {TIRE_DIAMETER_UNIT_LABELS[u]}
                  </option>
                ),
              )}
            </select>
          </div>
          {errors.tireDiameter ? (
            <p className="mt-1 text-xs text-rose-600">{errors.tireDiameter}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={input.showCircumference}
            onChange={(e) => set({ showCircumference: e.target.checked })}
          />
          Tire circumference &amp; revolutions per mile
        </label>
        {input.showCircumference ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Circumference C = πD and revolutions per mile use the same tire
            diameter above (revolutions per mile, not RPM).
          </p>
        ) : null}
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={input.showSensorFrequency}
            onChange={(e) => set({ showSensorFrequency: e.target.checked })}
          />
          Vehicle speed sensor frequency
          <InfoTooltip
            label="VSS frequency"
            text="Estimates pulse rate (Hz) from PPM and road speed under the same pulse-count assumptions."
          />
        </label>
        {input.showSensorFrequency ? (
          <div>
            <label htmlFor="ppm-spd" className={labelClass}>
              Vehicle speed
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.vehicleSpeed}>
                <input
                  id="ppm-spd"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.vehicleSpeed}
                  aria-invalid={Boolean(errors.vehicleSpeed)}
                  onChange={(e) => set({ vehicleSpeed: e.target.value })}
                />
              </FieldShell>
              <select
                className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                value={input.vehicleSpeedUnit}
                aria-label="Speed unit"
                onChange={(e) =>
                  set({ vehicleSpeedUnit: e.target.value as SpeedUnit })
                }
              >
                {(Object.keys(SPEED_UNIT_LABELS) as SpeedUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {SPEED_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </div>
            {errors.vehicleSpeed ? (
              <p className="mt-1 text-xs text-rose-600">{errors.vehicleSpeed}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </form>
  );
}
