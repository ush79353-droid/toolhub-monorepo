'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertSpeed, convertTireDiameter, fmt } from './calculation';
import {
  SPEED_UNIT_LABELS,
  TIRE_DIAMETER_UNIT_LABELS,
  createEmptyInput,
  type RpmFieldErrors,
  type RpmInput,
  type RpmResult,
  type TireDiameterUnit,
  type VehicleSpeedUnit,
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

interface RpmFormProps {
  input: RpmInput;
  errors: RpmFieldErrors;
  result: RpmResult | null;
  onChange: (next: RpmInput) => void;
}

export function RpmForm({ input, errors, result, onChange }: RpmFormProps) {
  const set = (patch: Partial<RpmInput>) => onChange({ ...input, ...patch });

  const display = (
    key: keyof RpmInput,
    computed: string | null | undefined,
    isDerived?: boolean,
  ) => {
    const raw = input[key];
    if (typeof raw === 'string' && raw.trim() !== '') return raw;
    if (isDerived && computed) return computed;
    return typeof raw === 'string' ? raw : '';
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Enter any related pair of values. Engine RPM and drivetrain ratio
        determine wheel RPM; wheel RPM and tire diameter determine vehicle
        speed. Calculated fields fill automatically and stay editable.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (3000 rpm · 4 · 26 in)
        </button>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">Inputs</h3>

        <div>
          <label htmlFor="rpm-eng" className={labelClass}>
            Engine RPM
            <InfoTooltip
              label="Engine RPM"
              text="Crankshaft revolutions per minute."
            />
          </label>
          <FieldShell
            error={errors.engineRPM}
            muted={Boolean(result?.derived.engineRPM) && !input.engineRPM.trim()}
          >
            <input
              id="rpm-eng"
              className={inputClass}
              inputMode="decimal"
              value={display(
                'engineRPM',
                result?.engineRPM != null ? fmt(result.engineRPM, 1) : null,
                result?.derived.engineRPM,
              )}
              aria-invalid={Boolean(errors.engineRPM)}
              onChange={(e) => set({ engineRPM: e.target.value })}
            />
          </FieldShell>
          {errors.engineRPM ? (
            <p className="mt-1 text-xs text-rose-600">{errors.engineRPM}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="rpm-ratio" className={labelClass}>
            Drivetrain transmission ratio
            <InfoTooltip
              label="Drivetrain ratio"
              text="Overall engine-to-wheel reduction R. Often gearbox × final drive."
            />
          </label>
          <FieldShell
            error={errors.drivetrainRatio}
            muted={
              Boolean(result?.derived.drivetrainRatio) &&
              !input.drivetrainRatio.trim() &&
              !input.showGearSplit
            }
          >
            <input
              id="rpm-ratio"
              className={inputClass}
              inputMode="decimal"
              value={
                input.showGearSplit && result?.drivetrainRatio != null
                  ? fmt(result.drivetrainRatio, 4)
                  : display(
                      'drivetrainRatio',
                      result?.drivetrainRatio != null
                        ? fmt(result.drivetrainRatio, 4)
                        : null,
                      result?.derived.drivetrainRatio,
                    )
              }
              readOnly={input.showGearSplit}
              aria-invalid={Boolean(errors.drivetrainRatio)}
              onChange={(e) => set({ drivetrainRatio: e.target.value })}
            />
          </FieldShell>
          {errors.drivetrainRatio ? (
            <p className="mt-1 text-xs text-rose-600">{errors.drivetrainRatio}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="rpm-wheel" className={labelClass}>
            Wheel RPM
            <InfoTooltip
              label="Wheel RPM"
              text="Wheel revolutions per minute. WRPM = ERPM / R."
            />
          </label>
          <FieldShell
            error={errors.wheelRPM}
            muted={Boolean(result?.derived.wheelRPM) && !input.wheelRPM.trim()}
          >
            <input
              id="rpm-wheel"
              className={inputClass}
              inputMode="decimal"
              value={display(
                'wheelRPM',
                result?.wheelRPM != null ? fmt(result.wheelRPM, 2) : null,
                result?.derived.wheelRPM,
              )}
              aria-invalid={Boolean(errors.wheelRPM)}
              onChange={(e) => set({ wheelRPM: e.target.value })}
            />
          </FieldShell>
          {errors.wheelRPM ? (
            <p className="mt-1 text-xs text-rose-600">{errors.wheelRPM}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="rpm-td" className={labelClass}>
            Tire diameter
            <InfoTooltip
              label="Tire diameter"
              text="Nominal overall tire diameter. Speed uses circumference πD."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell
              error={errors.tireDiameter}
              muted={
                Boolean(result?.derived.tireDiameter) &&
                !input.tireDiameter.trim()
              }
            >
              <input
                id="rpm-td"
                className={inputClass}
                inputMode="decimal"
                value={display(
                  'tireDiameter',
                  result?.tireDiameterDisplay != null
                    ? fmt(result.tireDiameterDisplay, 4)
                    : null,
                  result?.derived.tireDiameter,
                )}
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

        <div>
          <label htmlFor="rpm-spd" className={labelClass}>
            Vehicle speed
            <InfoTooltip
              label="Vehicle speed"
              text="Road speed from wheel RPM and tire circumference."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell
              error={errors.vehicleSpeed}
              muted={
                Boolean(result?.derived.vehicleSpeed) &&
                !input.vehicleSpeed.trim()
              }
            >
              <input
                id="rpm-spd"
                className={inputClass}
                inputMode="decimal"
                value={display(
                  'vehicleSpeed',
                  result?.vehicleSpeedDisplay != null
                    ? fmt(result.vehicleSpeedDisplay, 2)
                    : null,
                  result?.derived.vehicleSpeed,
                )}
                aria-invalid={Boolean(errors.vehicleSpeed)}
                onChange={(e) => set({ vehicleSpeed: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[100px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.vehicleSpeedUnit}
              aria-label="Vehicle speed unit"
              onChange={(e) => {
                const next = e.target.value as VehicleSpeedUnit;
                const n = Number(input.vehicleSpeed.replace(/,/g, ''));
                if (Number.isFinite(n) && n >= 0 && input.vehicleSpeed.trim()) {
                  set({
                    vehicleSpeedUnit: next,
                    vehicleSpeed: String(
                      Number(
                        convertSpeed(
                          n,
                          input.vehicleSpeedUnit,
                          next,
                        ).toPrecision(12),
                      ),
                    ),
                  });
                  return;
                }
                set({ vehicleSpeedUnit: next });
              }}
            >
              {(Object.keys(SPEED_UNIT_LABELS) as VehicleSpeedUnit[]).map(
                (u) => (
                  <option key={u} value={u}>
                    {SPEED_UNIT_LABELS[u]}
                  </option>
                ),
              )}
            </select>
          </div>
          {errors.vehicleSpeed ? (
            <p className="mt-1 text-xs text-rose-600">{errors.vehicleSpeed}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={input.showGearSplit}
            onChange={(e) => set({ showGearSplit: e.target.checked })}
          />
          Gearbox × final drive
        </label>
        {input.showGearSplit ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="rpm-gear" className={labelClass}>
                Gearbox ratio
              </label>
              <FieldShell error={errors.gearboxRatio}>
                <input
                  id="rpm-gear"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.gearboxRatio}
                  onChange={(e) => set({ gearboxRatio: e.target.value })}
                />
              </FieldShell>
            </div>
            <div>
              <label htmlFor="rpm-fd" className={labelClass}>
                Final-drive ratio
              </label>
              <FieldShell error={errors.finalDriveRatio}>
                <input
                  id="rpm-fd"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.finalDriveRatio}
                  onChange={(e) => set({ finalDriveRatio: e.target.value })}
                />
              </FieldShell>
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-white p-3.5">
        <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={input.showExtras}
            onChange={(e) => set({ showExtras: e.target.checked })}
          />
          Circumference, RPS &amp; revolutions per mile
        </label>
      </div>

      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
