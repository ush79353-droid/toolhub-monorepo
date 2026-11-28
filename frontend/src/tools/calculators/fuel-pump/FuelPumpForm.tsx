'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { fromBar, fromHp, toBar, toHp } from './calculation';
import {
  FLOW_UNIT_LABELS,
  FUEL_TYPE_LABELS,
  INDUCTION_LABELS,
  POWER_UNIT_LABELS,
  PRESSURE_MODE_LABELS,
  PRESSURE_UNIT_LABELS,
  SYSTEM_LABELS,
  type FlowUnit,
  type FuelPumpFieldErrors,
  type FuelPumpInput,
  type FuelSystemType,
  type FuelType,
  type InductionType,
  type PowerUnit,
  type PressureControlMode,
  type PressureUnit,
  createEmptyInput,
  createExampleBoosted,
  defaultPressureMode,
  suggestedBsfc,
  suggestedDensity,
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

interface FuelPumpFormProps {
  input: FuelPumpInput;
  errors: FuelPumpFieldErrors;
  onChange: (next: FuelPumpInput) => void;
}

export function FuelPumpForm({ input, errors, onChange }: FuelPumpFormProps) {
  const set = (patch: Partial<FuelPumpInput>) =>
    onChange({ ...input, ...patch });

  const applyFuelInduction = (fuelType: FuelType, inductionType: InductionType) => {
    const patch: Partial<FuelPumpInput> = { fuelType, inductionType };
    if (!input.bsfcManual) {
      patch.bsfc = String(suggestedBsfc(fuelType, inductionType));
    }
    if (!input.densityManual && fuelType !== 'custom') {
      patch.fuelDensity = String(suggestedDensity(fuelType));
    }
    set(patch);
  };

  const changePowerUnit = (next: PowerUnit) => {
    const n = Number(input.power.replace(/,/g, ''));
    if (Number.isFinite(n) && n > 0) {
      const hp = toHp(n, input.powerUnit);
      set({
        powerUnit: next,
        power: String(Number(fromHp(hp, next).toPrecision(12))),
      });
      return;
    }
    set({ powerUnit: next });
  };

  const changePressureUnit = (next: PressureUnit) => {
    const base = Number(input.baseFuelPressure.replace(/,/g, ''));
    const boost = Number(input.boostPressure.replace(/,/g, ''));
    const loss = Number(input.pressureLoss.replace(/,/g, ''));
    const patch: Partial<FuelPumpInput> = { pressureUnit: next };
    if (Number.isFinite(base) && base > 0) {
      patch.baseFuelPressure = String(
        Number(fromBar(toBar(base, input.pressureUnit), next).toPrecision(12)),
      );
    }
    if (Number.isFinite(boost) && boost >= 0) {
      patch.boostPressure = String(
        Number(fromBar(toBar(boost, input.pressureUnit), next).toPrecision(12)),
      );
    }
    if (Number.isFinite(loss) && loss >= 0) {
      patch.pressureLoss = String(
        Number(fromBar(toBar(loss, input.pressureUnit), next).toPrecision(12)),
      );
    }
    set(patch);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Estimate fuel demand with{' '}
        <strong className="text-accent">
          Q = (HP × BSFC × 0.45359237) / ρ
        </strong>{' '}
        and rail pressure by control mode. BSFC/density are labeled estimates.
        Pump delivery drops with pressure — use manufacturer curves when
        comparing pumps.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example 300 hp NA gasoline
        </button>
        <button
          type="button"
          onClick={() => onChange(createExampleBoosted())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example 400 hp turbo · 1 bar boost
        </button>
      </div>

      <details className="rounded-xl border border-border bg-muted/10" open>
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Flow
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div>
            <label htmlFor="fp-power" className={labelClass}>
              Power
              <InfoTooltip
                label="Engine power"
                text="Crankshaft horsepower used for fuel mass-flow demand. Convert freely among hp, kW, and PS."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.power}>
                <input
                  id="fp-power"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.power}
                  aria-invalid={Boolean(errors.power)}
                  onChange={(e) => set({ power: e.target.value })}
                />
              </FieldShell>
              <select
                className="h-11 w-[72px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                value={input.powerUnit}
                aria-label="Power unit"
                onChange={(e) => changePowerUnit(e.target.value as PowerUnit)}
              >
                {(Object.keys(POWER_UNIT_LABELS) as PowerUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {POWER_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </div>
            {errors.power ? (
              <p className="mt-1 text-xs text-rose-600">{errors.power}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="fp-ind" className={labelClass}>
              Induction type
              <InfoTooltip
                label="Induction"
                text="Updates suggested BSFC when automatic. Forced induction often uses richer sizing estimates."
              />
            </label>
            <select
              id="fp-ind"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
              value={input.inductionType}
              onChange={(e) =>
                applyFuelInduction(
                  input.fuelType,
                  e.target.value as InductionType,
                )
              }
            >
              {(Object.keys(INDUCTION_LABELS) as InductionType[]).map((i) => (
                <option key={i} value={i}>
                  {INDUCTION_LABELS[i]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="fp-fuel" className={labelClass}>
              Fuel type
              <InfoTooltip
                label="Fuel type"
                text="Updates suggested BSFC and density. Custom requires manual values."
              />
            </label>
            <select
              id="fp-fuel"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
              value={input.fuelType}
              onChange={(e) =>
                applyFuelInduction(
                  e.target.value as FuelType,
                  input.inductionType,
                )
              }
            >
              {(Object.keys(FUEL_TYPE_LABELS) as FuelType[]).map((f) => (
                <option key={f} value={f}>
                  {FUEL_TYPE_LABELS[f]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="fp-flow-unit" className={labelClass}>
              Flow rate (result unit)
            </label>
            <select
              id="fp-flow-unit"
              className="h-11 w-full max-w-[160px] rounded-lg border border-border bg-white px-3 text-sm"
              value={input.resultFlowUnit}
              onChange={(e) =>
                set({ resultFlowUnit: e.target.value as FlowUnit })
              }
            >
              {(Object.keys(FLOW_UNIT_LABELS) as FlowUnit[]).map((u) => (
                <option key={u} value={u}>
                  {FLOW_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted-foreground">
              Calculated demand appears in Results — not a free-flow pump rating.
            </p>
          </div>
        </div>
      </details>

      <details className="rounded-xl border border-border bg-muted/10" open>
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Pressure
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div>
            <label htmlFor="fp-base" className={labelClass}>
              Base fuel pressure
              <InfoTooltip
                label="Base fuel pressure"
                text="Nominal rail/reference gauge pressure for the chosen regulation mode."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.baseFuelPressure}>
                <input
                  id="fp-base"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.baseFuelPressure}
                  aria-invalid={Boolean(errors.baseFuelPressure)}
                  onChange={(e) => set({ baseFuelPressure: e.target.value })}
                />
              </FieldShell>
              <select
                className="h-11 w-[80px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                value={input.pressureUnit}
                aria-label="Pressure unit"
                onChange={(e) =>
                  changePressureUnit(e.target.value as PressureUnit)
                }
              >
                {(Object.keys(PRESSURE_UNIT_LABELS) as PressureUnit[]).map(
                  (u) => (
                    <option key={u} value={u}>
                      {PRESSURE_UNIT_LABELS[u]}
                    </option>
                  ),
                )}
              </select>
            </div>
            {errors.baseFuelPressure ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.baseFuelPressure}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="fp-boost" className={labelClass}>
              Boost pressure
              <InfoTooltip
                label="Boost pressure"
                text="Manifold gauge boost. Used in 1:1 referenced mode for rail pressure. Use 0 for NA."
              />
            </label>
            <FieldShell error={errors.boostPressure}>
              <input
                id="fp-boost"
                className={inputClass}
                inputMode="decimal"
                value={input.boostPressure}
                aria-invalid={Boolean(errors.boostPressure)}
                onChange={(e) => set({ boostPressure: e.target.value })}
              />
            </FieldShell>
            {errors.boostPressure ? (
              <p className="mt-1 text-xs text-rose-600">{errors.boostPressure}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="fp-sys" className={labelClass}>
              Fuel system type
              <InfoTooltip
                label="Fuel system"
                text="Return systems often use manifold-referenced regulators; returnless often fixed/electronic. Override mode in Advanced if needed."
              />
            </label>
            <select
              id="fp-sys"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
              value={input.fuelSystemType}
              onChange={(e) => {
                const system = e.target.value as FuelSystemType;
                const patch: Partial<FuelPumpInput> = {
                  fuelSystemType: system,
                };
                if (!input.pressureModeManual) {
                  patch.pressureControlMode = defaultPressureMode(system);
                }
                set(patch);
              }}
            >
              {(Object.keys(SYSTEM_LABELS) as FuelSystemType[]).map((s) => (
                <option key={s} value={s}>
                  {SYSTEM_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="fp-p-unit" className={labelClass}>
              Pressure result unit
            </label>
            <select
              id="fp-p-unit"
              className="h-11 w-full max-w-[120px] rounded-lg border border-border bg-white px-3 text-sm"
              value={input.resultPressureUnit}
              onChange={(e) =>
                set({ resultPressureUnit: e.target.value as PressureUnit })
              }
            >
              {(Object.keys(PRESSURE_UNIT_LABELS) as PressureUnit[]).map(
                (u) => (
                  <option key={u} value={u}>
                    {PRESSURE_UNIT_LABELS[u]}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>
      </details>

      <details className="rounded-xl border border-border bg-muted/10">
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Advanced settings
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div>
            <label htmlFor="fp-bsfc" className={labelClass}>
              BSFC (lb/(hp·hr))
            </label>
            <FieldShell error={errors.bsfc}>
              <input
                id="fp-bsfc"
                className={inputClass}
                inputMode="decimal"
                value={input.bsfc}
                onChange={(e) =>
                  set({ bsfc: e.target.value, bsfcManual: true })
                }
              />
            </FieldShell>
            {errors.bsfc ? (
              <p className="mt-1 text-xs text-rose-600">{errors.bsfc}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="fp-dens" className={labelClass}>
              Fuel density (kg/L)
            </label>
            <FieldShell error={errors.fuelDensity}>
              <input
                id="fp-dens"
                className={inputClass}
                inputMode="decimal"
                value={input.fuelDensity}
                onChange={(e) =>
                  set({ fuelDensity: e.target.value, densityManual: true })
                }
              />
            </FieldShell>
            {errors.fuelDensity ? (
              <p className="mt-1 text-xs text-rose-600">{errors.fuelDensity}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="fp-mode" className={labelClass}>
              Pressure-control mode
            </label>
            <select
              id="fp-mode"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
              value={input.pressureControlMode}
              onChange={(e) =>
                set({
                  pressureControlMode: e.target.value as PressureControlMode,
                  pressureModeManual: true,
                })
              }
            >
              {(
                Object.keys(PRESSURE_MODE_LABELS) as PressureControlMode[]
              ).map((m) => (
                <option key={m} value={m}>
                  {PRESSURE_MODE_LABELS[m]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="fp-loss" className={labelClass}>
              System pressure loss
              <InfoTooltip
                label="Pressure loss"
                text="Added to rail pressure for estimated pump outlet (filters, lines, fittings)."
              />
            </label>
            <FieldShell error={errors.pressureLoss}>
              <input
                id="fp-loss"
                className={inputClass}
                inputMode="decimal"
                value={input.pressureLoss}
                onChange={(e) => set({ pressureLoss: e.target.value })}
              />
            </FieldShell>
            {errors.pressureLoss ? (
              <p className="mt-1 text-xs text-rose-600">{errors.pressureLoss}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="fp-margin" className={labelClass}>
              Capacity margin (%)
              <InfoTooltip
                label="Safety margin"
                text="Optional extra headroom on fuel demand. Not applied silently — default 0%."
              />
            </label>
            <FieldShell error={errors.safetyMarginPercent}>
              <input
                id="fp-margin"
                className={inputClass}
                inputMode="decimal"
                value={input.safetyMarginPercent}
                onChange={(e) => set({ safetyMarginPercent: e.target.value })}
              />
            </FieldShell>
            {errors.safetyMarginPercent ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.safetyMarginPercent}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="fp-curve" className={labelClass}>
              Manufacturer pump curve (optional)
              <InfoTooltip
                label="Pump curve"
                text="Enter pressure–flow points as bar,L/hr pairs separated by semicolons. Example: 2,200;3,150;4,100. No invented free-flow extrapolation."
              />
            </label>
            <textarea
              id="fp-curve"
              className="min-h-[72px] w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
              value={input.pumpCurveRaw}
              placeholder="2,200;3,150;4,100"
              onChange={(e) => set({ pumpCurveRaw: e.target.value })}
              aria-invalid={Boolean(errors.pumpCurveRaw)}
            />
            {errors.pumpCurveRaw ? (
              <p className="mt-1 text-xs text-rose-600">{errors.pumpCurveRaw}</p>
            ) : null}
          </div>
        </div>
      </details>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
