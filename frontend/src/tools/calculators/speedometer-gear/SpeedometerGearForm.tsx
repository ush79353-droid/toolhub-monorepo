'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  calculateTireRevolutionsPerMile,
  convertTireDiameter,
  convertTireRevolutions,
  fmt,
  fromRevPerMile,
  toInches,
} from './calculation';
import {
  TIRE_DIAMETER_UNIT_LABELS,
  TIRE_REVOLUTION_UNIT_LABELS,
  createEmptyInput,
  type SpeedometerGearFieldErrors,
  type SpeedometerGearInput,
  type SpeedometerGearResult,
  type TireDiameterUnit,
  type TireRevolutionUnit,
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

interface SpeedometerGearFormProps {
  input: SpeedometerGearInput;
  errors: SpeedometerGearFieldErrors;
  result: SpeedometerGearResult | null;
  onChange: (next: SpeedometerGearInput) => void;
}

export function SpeedometerGearForm({
  input,
  errors,
  result,
  onChange,
}: SpeedometerGearFormProps) {
  const set = (patch: Partial<SpeedometerGearInput>) =>
    onChange({ ...input, ...patch });

  const autoRevDisplay = (() => {
    if (input.useManualRevolutions) return input.tireRevolutions;
    if (result?.tireRevolutionsDisplay != null) {
      return fmt(result.tireRevolutionsDisplay, 2);
    }
    const n = Number(input.tireDiameter.replace(/,/g, ''));
    if (Number.isFinite(n) && n > 0) {
      const rpm = calculateTireRevolutionsPerMile(
        toInches(n, input.tireDiameterUnit),
      );
      return fmt(fromRevPerMile(rpm, input.tireRevolutionUnit), 2);
    }
    return '';
  })();

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Estimate mechanical speedometer driven-gear teeth from tire diameter
        (or measured rev/mi), axle ratio, and driving-gear teeth. Uses R ≈
        20168/D and Td = A×R×Tg/C (default C = 1000 cable rev/mi).
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (30 in · 3.73 · 8)
        </button>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">Inputs</h3>

        <div>
          <label htmlFor="sg-td" className={labelClass}>
            Diameter of tire (D)
            <InfoTooltip
              label="Tire diameter"
              text="Overall tire diameter. Revolutions use the practical 20168/D approximation unless you override."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell
              error={errors.tireDiameter}
              muted={input.useManualRevolutions}
            >
              <input
                id="sg-td"
                className={inputClass}
                inputMode="decimal"
                disabled={input.useManualRevolutions}
                value={input.tireDiameter}
                aria-invalid={Boolean(errors.tireDiameter)}
                onChange={(e) => set({ tireDiameter: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.tireDiameterUnit}
              disabled={input.useManualRevolutions}
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
          <label htmlFor="sg-axle" className={labelClass}>
            Axle ratio (A)
            <InfoTooltip
              label="Axle ratio"
              text="Final-drive ratio (e.g. 3.73). Affects shaft revolutions relative to the wheels."
            />
          </label>
          <FieldShell error={errors.axleRatio}>
            <input
              id="sg-axle"
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
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="sg-rev" className={labelClass + ' mb-0'}>
              Revolutions
              <InfoTooltip
                label="Revolutions per mile"
                text="Tire revolutions per distance. Auto from diameter (20168/D) or enter a measured/OEM value."
              />
            </label>
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-border"
                checked={input.useManualRevolutions}
                onChange={(e) => {
                  if (e.target.checked) {
                    set({
                      useManualRevolutions: true,
                      tireRevolutions: autoRevDisplay || input.tireRevolutions,
                    });
                  } else {
                    set({ useManualRevolutions: false, tireRevolutions: '' });
                  }
                }}
              />
              Manual override
            </label>
          </div>
          <div className="flex gap-2">
            <FieldShell
              error={errors.tireRevolutions}
              muted={!input.useManualRevolutions}
            >
              <input
                id="sg-rev"
                className={inputClass}
                inputMode="decimal"
                readOnly={!input.useManualRevolutions}
                value={
                  input.useManualRevolutions
                    ? input.tireRevolutions
                    : autoRevDisplay
                }
                aria-invalid={Boolean(errors.tireRevolutions)}
                onChange={(e) => set({ tireRevolutions: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[100px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.tireRevolutionUnit}
              aria-label="Revolution unit"
              onChange={(e) => {
                const next = e.target.value as TireRevolutionUnit;
                if (input.useManualRevolutions) {
                  const n = Number(input.tireRevolutions.replace(/,/g, ''));
                  if (Number.isFinite(n) && n > 0) {
                    set({
                      tireRevolutionUnit: next,
                      tireRevolutions: String(
                        Number(
                          convertTireRevolutions(
                            n,
                            input.tireRevolutionUnit,
                            next,
                          ).toPrecision(12),
                        ),
                      ),
                    });
                    return;
                  }
                }
                set({ tireRevolutionUnit: next });
              }}
            >
              {(
                Object.keys(TIRE_REVOLUTION_UNIT_LABELS) as TireRevolutionUnit[]
              ).map((u) => (
                <option key={u} value={u}>
                  {TIRE_REVOLUTION_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
          {errors.tireRevolutions ? (
            <p className="mt-1 text-xs text-rose-600">{errors.tireRevolutions}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="sg-drive" className={labelClass}>
            Number of teeth on driving gear
            <InfoTooltip
              label="Driving gear"
              text="Tooth count on the speedometer drive (driving) gear — usually a positive whole number."
            />
          </label>
          <FieldShell error={errors.drivingGearTeeth}>
            <input
              id="sg-drive"
              className={inputClass}
              inputMode="numeric"
              value={input.drivingGearTeeth}
              aria-invalid={Boolean(errors.drivingGearTeeth)}
              onChange={(e) => set({ drivingGearTeeth: e.target.value })}
            />
          </FieldShell>
          {errors.drivingGearTeeth ? (
            <p className="mt-1 text-xs text-rose-600">{errors.drivingGearTeeth}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={input.showAdvanced}
            onChange={(e) => set({ showAdvanced: e.target.checked })}
          />
          Advanced: speedometer calibration
          <InfoTooltip
            label="Calibration"
            text="Cable revolutions per mile the speedometer expects. Default 1000. Use OEM value if different."
          />
        </label>
        {input.showAdvanced ? (
          <div>
            <label htmlFor="sg-cal" className={labelClass}>
              Cable revolutions per mile (C)
            </label>
            <FieldShell error={errors.calibrationRevolutionsPerMile}>
              <input
                id="sg-cal"
                className={inputClass}
                inputMode="decimal"
                value={input.calibrationRevolutionsPerMile}
                onChange={(e) =>
                  set({ calibrationRevolutionsPerMile: e.target.value })
                }
              />
            </FieldShell>
            {errors.calibrationRevolutionsPerMile ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.calibrationRevolutionsPerMile}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </form>
  );
}
