'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  BSFC_UNIT_LABELS,
  DENSITY_UNIT_LABELS,
  FUEL_TYPE_LABELS,
  LHV_UNIT_LABELS,
  MASS_FLOW_UNIT_LABELS,
  POWER_UNIT_LABELS,
  type BSFCCalculationMode,
  type BSFCFieldErrors,
  type BSFCInput,
  type BSFCUnit,
  type DensityUnit,
  type FuelType,
  type LHVUnit,
  type MassFlowUnit,
  type PowerUnit,
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

interface BsfcFormProps {
  input: BSFCInput;
  errors: BSFCFieldErrors;
  onChange: (next: BSFCInput) => void;
  onLoadExample: () => void;
}

export function BsfcForm({
  input,
  errors,
  onChange,
  onLoadExample,
}: BsfcFormProps) {
  const set = (patch: Partial<BSFCInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Brake thermal efficiency:{' '}
        <strong className="text-accent">η% = 360000 / (BSFC × LHV)</strong> with
        BSFC in g/(kW·h) and LHV in MJ/kg. Fuel LHV values are representative
        assumptions.
      </p>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (100 kW · 250 g/kWh · gasoline)
      </button>

      <div>
        <label htmlFor="bsfc-mode" className={labelClass}>
          Calculate
        </label>
        <FieldShell>
          <select
            id="bsfc-mode"
            className={`${inputClass} appearance-none`}
            value={input.mode}
            onChange={(e) =>
              set({ mode: e.target.value as BSFCCalculationMode })
            }
          >
            <option value="efficiency">Engine efficiency</option>
            <option value="bsfc">BSFC from efficiency</option>
            <option value="fuelConsumption">Fuel consumption rate</option>
            <option value="enginePower">Required engine power</option>
          </select>
        </FieldShell>
      </div>

      {input.mode === 'efficiency' ||
      input.mode === 'fuelConsumption' ||
      input.mode === 'bsfc' ? (
        <div>
          <label htmlFor="bsfc-power" className={labelClass}>
            Power
            <InfoTooltip
              label="Engine brake power"
              text="Useful mechanical power at the engine output shaft (brake power)."
            />
            {input.mode === 'efficiency' || input.mode === 'bsfc' ? (
              <span className="text-xs font-normal text-muted-foreground">
                (optional for efficiency)
              </span>
            ) : null}
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.power}>
              <input
                id="bsfc-power"
                className={inputClass}
                inputMode="decimal"
                value={input.power}
                aria-invalid={Boolean(errors.power)}
                onChange={(e) => set({ power: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[80px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.powerUnit}
              aria-label="Power unit"
              onChange={(e) =>
                set({ powerUnit: e.target.value as PowerUnit })
              }
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
      ) : null}

      {input.mode !== 'bsfc' ? (
        <div>
          <label htmlFor="bsfc-bsfc" className={labelClass}>
            BSFC – Brake Specific Fuel Consumption
            <InfoTooltip
              label="BSFC"
              text="BSFC is the mass of fuel consumed per unit of engine brake power output over time."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.bsfc}>
              <input
                id="bsfc-bsfc"
                className={inputClass}
                inputMode="decimal"
                value={input.bsfc}
                aria-invalid={Boolean(errors.bsfc)}
                onChange={(e) => set({ bsfc: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[110px] shrink-0 rounded-lg border border-border bg-white px-1 text-xs sm:text-sm"
              value={input.bsfcUnit}
              aria-label="BSFC unit"
              onChange={(e) => set({ bsfcUnit: e.target.value as BSFCUnit })}
            >
              {(Object.keys(BSFC_UNIT_LABELS) as BSFCUnit[]).map((u) => (
                <option key={u} value={u}>
                  {BSFC_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
          {errors.bsfc ? (
            <p className="mt-1 text-xs text-rose-600">{errors.bsfc}</p>
          ) : null}
        </div>
      ) : null}

      {input.mode === 'bsfc' ? (
        <div>
          <label htmlFor="bsfc-eff" className={labelClass}>
            Brake thermal efficiency (%)
          </label>
          <FieldShell error={errors.efficiency}>
            <input
              id="bsfc-eff"
              className={inputClass}
              inputMode="decimal"
              value={input.efficiency}
              aria-invalid={Boolean(errors.efficiency)}
              onChange={(e) => set({ efficiency: e.target.value })}
            />
          </FieldShell>
          {errors.efficiency ? (
            <p className="mt-1 text-xs text-rose-600">{errors.efficiency}</p>
          ) : null}
        </div>
      ) : null}

      {input.mode === 'enginePower' ? (
        <div>
          <label htmlFor="bsfc-flow" className={labelClass}>
            Fuel mass flow
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.fuelMassFlow}>
              <input
                id="bsfc-flow"
                className={inputClass}
                inputMode="decimal"
                value={input.fuelMassFlow}
                aria-invalid={Boolean(errors.fuelMassFlow)}
                onChange={(e) => set({ fuelMassFlow: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.massFlowUnit}
              aria-label="Mass flow unit"
              onChange={(e) =>
                set({ massFlowUnit: e.target.value as MassFlowUnit })
              }
            >
              {(Object.keys(MASS_FLOW_UNIT_LABELS) as MassFlowUnit[]).map(
                (u) => (
                  <option key={u} value={u}>
                    {MASS_FLOW_UNIT_LABELS[u]}
                  </option>
                ),
              )}
            </select>
          </div>
          {errors.fuelMassFlow ? (
            <p className="mt-1 text-xs text-rose-600">{errors.fuelMassFlow}</p>
          ) : null}
        </div>
      ) : null}

      <div>
        <label htmlFor="bsfc-fuel" className={labelClass}>
          Fuel type
          <InfoTooltip
            label="Fuel heating value"
            text="Fuel heating value represents the energy released per unit mass of fuel. This calculator uses lower heating value for efficiency calculations."
          />
        </label>
        <FieldShell>
          <select
            id="bsfc-fuel"
            className={`${inputClass} appearance-none`}
            value={input.fuelType}
            onChange={(e) => set({ fuelType: e.target.value as FuelType })}
          >
            {(Object.keys(FUEL_TYPE_LABELS) as FuelType[]).map((f) => (
              <option key={f} value={f}>
                {FUEL_TYPE_LABELS[f]}
              </option>
            ))}
          </select>
        </FieldShell>
      </div>

      {input.fuelType === 'custom' ? (
        <div>
          <label htmlFor="bsfc-lhv" className={labelClass}>
            Lower Heating Value (LHV)
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.customLHV}>
              <input
                id="bsfc-lhv"
                className={inputClass}
                inputMode="decimal"
                value={input.customLHV}
                aria-invalid={Boolean(errors.customLHV)}
                onChange={(e) => set({ customLHV: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[96px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.lhvUnit}
              aria-label="LHV unit"
              onChange={(e) => set({ lhvUnit: e.target.value as LHVUnit })}
            >
              {(Object.keys(LHV_UNIT_LABELS) as LHVUnit[]).map((u) => (
                <option key={u} value={u}>
                  {LHV_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
          {errors.customLHV ? (
            <p className="mt-1 text-xs text-rose-600">{errors.customLHV}</p>
          ) : null}
        </div>
      ) : null}

      <label className="flex items-center gap-2 text-sm text-accent">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border"
          checked={input.enableVolume}
          onChange={(e) => set({ enableVolume: e.target.checked })}
        />
        Estimate volumetric fuel consumption
      </label>

      {input.enableVolume ? (
        <div>
          <label htmlFor="bsfc-den" className={labelClass}>
            Fuel density
            {input.fuelType !== 'custom' ? (
              <span className="text-xs font-normal text-muted-foreground">
                (optional override)
              </span>
            ) : null}
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.customDensity}>
              <input
                id="bsfc-den"
                className={inputClass}
                inputMode="decimal"
                value={input.customDensity}
                aria-invalid={Boolean(errors.customDensity)}
                onChange={(e) => set({ customDensity: e.target.value })}
                placeholder={
                  input.fuelType === 'custom' ? 'Required' : 'Default OK'
                }
              />
            </FieldShell>
            <select
              className="h-11 w-[110px] shrink-0 rounded-lg border border-border bg-white px-1 text-xs"
              value={input.densityUnit}
              aria-label="Density unit"
              onChange={(e) =>
                set({ densityUnit: e.target.value as DensityUnit })
              }
            >
              {(Object.keys(DENSITY_UNIT_LABELS) as DensityUnit[]).map((u) => (
                <option key={u} value={u}>
                  {DENSITY_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
          {errors.customDensity ? (
            <p className="mt-1 text-xs text-rose-600">{errors.customDensity}</p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
