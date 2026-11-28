'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertDegreesToSlope,
  convertKgToWeight,
  convertSlopeToDegrees,
  convertWeightToKg,
} from './calculation';
import {
  FORCE_UNIT_LABELS,
  MODE_LABELS,
  SAFETY_FACTOR_OPTIONS,
  SLOPE_UNIT_LABELS,
  TERRAIN_PRESETS,
  VEHICLE_PRESETS,
  WEIGHT_MODE_LABELS,
  WEIGHT_UNIT_LABELS,
  createEmptyInput,
  type CalculationMode,
  type ForceUnit,
  type LineConfig,
  type SlopeUnit,
  type TerrainType,
  type VehicleTypeKey,
  type WeightBasis,
  type WeightInputMode,
  type WeightUnit,
  type WinchSizeFieldErrors,
  type WinchSizeInput,
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

interface WinchSizeFormProps {
  input: WinchSizeInput;
  errors: WinchSizeFieldErrors;
  onChange: (next: WinchSizeInput) => void;
}

export function WinchSizeForm({ input, errors, onChange }: WinchSizeFormProps) {
  const set = (patch: Partial<WinchSizeInput>) =>
    onChange({ ...input, ...patch });

  const applyVehicle = (key: VehicleTypeKey) => {
    const preset = VEHICLE_PRESETS[key];
    const display = convertKgToWeight(preset.massKg, input.weightUnit);
    set({
      vehicleType: key,
      weight: String(Number(display.toFixed(2))),
    });
  };

  const switchWeightUnit = (next: WeightUnit) => {
    const n = Number(input.weight.trim().replace(/,/g, ''));
    if (input.weight.trim() !== '' && Number.isFinite(n)) {
      const kg = convertWeightToKg(n, input.weightUnit);
      set({
        weightUnit: next,
        weight: String(Number(convertKgToWeight(kg, next).toFixed(4))),
      });
      return;
    }
    set({ weightUnit: next });
  };

  const switchSlopeUnit = (next: SlopeUnit) => {
    const n = Number(input.slope.trim().replace(/,/g, ''));
    if (input.slope.trim() !== '' && Number.isFinite(n)) {
      const deg = convertSlopeToDegrees(n, input.slopeUnit);
      set({
        slopeUnit: next,
        slope: String(Number(convertDegreesToSlope(deg, next).toFixed(4))),
      });
      return;
    }
    set({ slopeUnit: next });
  };

  const applyTerrain = (t: TerrainType) => {
    if (t === 'custom') {
      set({ terrainType: t });
      return;
    }
    set({
      terrainType: t,
      resistanceCoefficient: String(TERRAIN_PRESETS[t].coefficient),
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Estimate pulling force from mass, terrain/drag resistance, and slope.
        Resistance coefficients are illustrative planning assumptions — not a
        recovery safety assessment.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (2000 kg · mud · 10°)
        </button>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">I want to…</h3>
        <fieldset>
          <legend className="sr-only">Operation type</legend>
          <div className="flex flex-col gap-2">
            {(Object.keys(MODE_LABELS) as CalculationMode[]).map((m) => (
              <label
                key={m}
                className="inline-flex items-start gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="winch-mode"
                  className="mt-0.5 h-4 w-4 border-border"
                  checked={input.calculationMode === m}
                  onChange={() => set({ calculationMode: m })}
                />
                <span>{MODE_LABELS[m]}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">Mode</h3>
        <fieldset>
          <legend className="sr-only">Weight input mode</legend>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            {(Object.keys(WEIGHT_MODE_LABELS) as WeightInputMode[]).map(
              (m) => (
                <label
                  key={m}
                  className="inline-flex items-center gap-2 text-sm text-accent"
                >
                  <input
                    type="radio"
                    name="winch-weight-mode"
                    className="h-4 w-4 border-border"
                    checked={input.weightInputMode === m}
                    onChange={() => {
                      if (m === 'vehicle-type') {
                        const preset = VEHICLE_PRESETS[input.vehicleType];
                        const display = convertKgToWeight(
                          preset.massKg,
                          input.weightUnit,
                        );
                        set({
                          weightInputMode: m,
                          weight: String(Number(display.toFixed(2))),
                        });
                      } else {
                        set({ weightInputMode: m });
                      }
                    }}
                  />
                  {WEIGHT_MODE_LABELS[m]}
                </label>
              ),
            )}
          </div>
        </fieldset>

        {input.weightInputMode === 'vehicle-type' ? (
          <div>
            <label className={labelClass} htmlFor="winch-vehicle">
              Vehicle type
              <InfoTooltip content="Representative mass only — editable, not exact for a specific vehicle." />
            </label>
            <select
              id="winch-vehicle"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent"
              value={input.vehicleType}
              onChange={(e) => applyVehicle(e.target.value as VehicleTypeKey)}
            >
              {(Object.keys(VEHICLE_PRESETS) as VehicleTypeKey[]).map((k) => (
                <option key={k} value={k}>
                  {VEHICLE_PRESETS[k].label} (~
                  {VEHICLE_PRESETS[k].massKg} kg)
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div>
          <label className={labelClass} htmlFor="winch-weight">
            {input.calculationMode === 'load-moving'
              ? 'Load weight'
              : 'Vehicle weight / Load weight'}
            <InfoTooltip content="Enter mass greater than zero. Vehicle presets are illustrative." />
          </label>
          <FieldShell error={errors.weight}>
            <input
              id="winch-weight"
              className={inputClass}
              inputMode="decimal"
              value={input.weight}
              onChange={(e) => set({ weight: e.target.value })}
              aria-invalid={Boolean(errors.weight)}
            />
            <select
              aria-label="Weight unit"
              className="h-full border-l border-border bg-muted/30 px-2 text-xs text-accent"
              value={input.weightUnit}
              onChange={(e) =>
                switchWeightUnit(e.target.value as WeightUnit)
              }
            >
              {(Object.keys(WEIGHT_UNIT_LABELS) as WeightUnit[]).map((u) => (
                <option key={u} value={u}>
                  {WEIGHT_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.weight ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weight}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">
          Terrain conditions
        </h3>
        <div>
          <label className={labelClass} htmlFor="winch-terrain">
            Terrain type
            <InfoTooltip content="Sets an illustrative resistance coefficient. Edit freely for custom conditions." />
          </label>
          <select
            id="winch-terrain"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent"
            value={input.terrainType}
            onChange={(e) => applyTerrain(e.target.value as TerrainType)}
          >
            {(Object.keys(TERRAIN_PRESETS) as Exclude<TerrainType, 'custom'>[]).map(
              (t) => (
                <option key={t} value={t}>
                  {TERRAIN_PRESETS[t].label} (C=
                  {TERRAIN_PRESETS[t].coefficient})
                </option>
              ),
            )}
            <option value="custom">Custom resistance</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="winch-coeff">
            Resistance coefficient
            <InfoTooltip
              content={
                input.calculationMode === 'load-moving'
                  ? 'Drag/friction coefficient for a non-rolling load model (μ).'
                  : 'Rolling resistance coefficient C_rr for a rolling vehicle model.'
              }
            />
          </label>
          <FieldShell error={errors.resistanceCoefficient}>
            <input
              id="winch-coeff"
              className={inputClass}
              inputMode="decimal"
              value={input.resistanceCoefficient}
              onChange={(e) =>
                set({
                  resistanceCoefficient: e.target.value,
                  terrainType: 'custom',
                })
              }
              aria-invalid={Boolean(errors.resistanceCoefficient)}
            />
          </FieldShell>
          {errors.resistanceCoefficient ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.resistanceCoefficient}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">Slope & safety</h3>
        <div>
          <label className={labelClass} htmlFor="winch-slope">
            Slope angle
            <InfoTooltip content="Uphill incline. Percent grade converts via θ = arctan(grade/100)." />
          </label>
          <FieldShell error={errors.slope}>
            <input
              id="winch-slope"
              className={inputClass}
              inputMode="decimal"
              value={input.slope}
              onChange={(e) => set({ slope: e.target.value })}
              aria-invalid={Boolean(errors.slope)}
            />
            <select
              aria-label="Slope unit"
              className="h-full border-l border-border bg-muted/30 px-2 text-xs text-accent"
              value={input.slopeUnit}
              onChange={(e) =>
                switchSlopeUnit(e.target.value as SlopeUnit)
              }
            >
              {(Object.keys(SLOPE_UNIT_LABELS) as SlopeUnit[]).map((u) => (
                <option key={u} value={u}>
                  {SLOPE_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.slope ? (
            <p className="mt-1 text-xs text-rose-600">{errors.slope}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="winch-sf">
            Safety factor
            <InfoTooltip content="User planning factor — not a manufacturer working-load specification." />
          </label>
          <FieldShell error={errors.safetyFactor}>
            <input
              id="winch-sf"
              className={inputClass}
              inputMode="decimal"
              list="winch-sf-options"
              value={input.safetyFactor}
              onChange={(e) => set({ safetyFactor: e.target.value })}
              aria-invalid={Boolean(errors.safetyFactor)}
            />
            <span className="pr-3 text-xs text-muted-foreground">×</span>
          </FieldShell>
          <datalist id="winch-sf-options">
            {SAFETY_FACTOR_OPTIONS.map((v) => (
              <option key={v} value={v} />
            ))}
          </datalist>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SAFETY_FACTOR_OPTIONS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => set({ safetyFactor: String(v) })}
                className={`rounded-md border px-2 py-1 text-xs ${
                  input.safetyFactor === String(v)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-accent'
                }`}
              >
                {v}×
              </button>
            ))}
          </div>
          {errors.safetyFactor ? (
            <p className="mt-1 text-xs text-rose-600">{errors.safetyFactor}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="winch-unit">
            Result unit
          </label>
          <select
            id="winch-unit"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent"
            value={input.resultUnit}
            onChange={(e) =>
              set({ resultUnit: e.target.value as ForceUnit })
            }
          >
            {(Object.keys(FORCE_UNIT_LABELS) as ForceUnit[]).map((u) => (
              <option key={u} value={u}>
                {FORCE_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-3.5">
        <button
          type="button"
          className="flex w-full items-center justify-between text-[13px] font-semibold text-accent"
          onClick={() => set({ showAdvanced: !input.showAdvanced })}
          aria-expanded={input.showAdvanced}
        >
          Advanced settings
          <span className="text-muted-foreground">
            {input.showAdvanced ? '−' : '+'}
          </span>
        </button>
        {input.showAdvanced ? (
          <div className="mt-3 space-y-3">
            <div>
              <label className={labelClass} htmlFor="winch-derate">
                Line pull adjustment
                <InfoTooltip content="Manufacturer first-layer derating as % of stamped rating. Default 100% — do not invent a universal derate." />
              </label>
              <FieldShell error={errors.linePullPercent}>
                <input
                  id="winch-derate"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.linePullPercent}
                  onChange={(e) => set({ linePullPercent: e.target.value })}
                />
                <span className="pr-3 text-xs text-muted-foreground">%</span>
              </FieldShell>
              {errors.linePullPercent ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.linePullPercent}
                </p>
              ) : null}
            </div>
            <fieldset>
              <legend className={labelClass}>Recovery configuration</legend>
              <div className="flex flex-col gap-2">
                {(
                  [
                    ['single', 'Single-line pull'],
                    ['double', 'Double-line pull (rated rigging)'],
                  ] as const
                ).map(([v, label]) => (
                  <label
                    key={v}
                    className="inline-flex items-center gap-2 text-sm text-accent"
                  >
                    <input
                      type="radio"
                      name="winch-line"
                      className="h-4 w-4"
                      checked={input.lineConfig === v}
                      onChange={() =>
                        set({ lineConfig: v as LineConfig })
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Double-line is an illustrative mechanical advantage — friction,
                geometry, and component ratings still apply. Not a promise of
                twice the usable capacity.
              </p>
            </fieldset>
            <fieldset>
              <legend className={labelClass}>Vehicle weight basis</legend>
              <div className="flex flex-col gap-2">
                {(
                  [
                    ['entered', 'Entered vehicle mass'],
                    ['loaded', 'Actual loaded vehicle mass'],
                    ['gvwr', 'Gross vehicle weight rating (GVWR)'],
                  ] as const
                ).map(([v, label]) => (
                  <label
                    key={v}
                    className="inline-flex items-center gap-2 text-sm text-accent"
                  >
                    <input
                      type="radio"
                      name="winch-basis"
                      className="h-4 w-4"
                      checked={input.weightBasis === v}
                      onChange={() =>
                        set({ weightBasis: v as WeightBasis })
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                GVWR is a manufacturer maximum — often higher than actual
                loaded mass. Label only; the numeric weight field is what is
                calculated.
              </p>
            </fieldset>
          </div>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-amber-700" role="status">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
