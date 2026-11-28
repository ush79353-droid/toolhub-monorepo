'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertDistanceToKm,
  convertEfficiencyToKWhPerKm,
  convertEnergyToKWh,
  fromKm,
  fromKWh,
  fromKWhPerKm,
} from './calculation';
import { TESLA_PRESETS, getPreset, presetLabel } from './presets';
import {
  DISTANCE_UNIT_LABELS,
  EFFICIENCY_UNIT_LABELS,
  ENERGY_UNIT_LABELS,
  createEmptyInput,
  type ChartInterval,
  type DistanceUnit,
  type EfficiencyUnit,
  type EnergyUnit,
  type TeslaChargingFieldErrors,
  type TeslaChargingInput,
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

interface TeslaChargingCostFormProps {
  input: TeslaChargingInput;
  errors: TeslaChargingFieldErrors;
  onChange: (next: TeslaChargingInput) => void;
}

export function TeslaChargingCostForm({
  input,
  errors,
  onChange,
}: TeslaChargingCostFormProps) {
  const set = (patch: Partial<TeslaChargingInput>) =>
    onChange({ ...input, ...patch });

  const applyPreset = (id: string) => {
    const p = getPreset(id);
    if (!p) {
      set({ vehicleId: id });
      return;
    }
    set({
      vehicleId: id,
      batteryCapacity: String(p.usableBatteryCapacityKWh),
      batteryCapacityUnit: 'kWh',
      efficiency: String(p.efficiencyKWhPer100Km),
      efficiencyUnit: 'kWh/100km',
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
        Estimate electricity cost to charge a Tesla and drive a distance.
        Model presets are illustrative estimates — override capacity and
        efficiency. Currency changes denomination only (no live FX).
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (60 kWh · 0.25 · 200 km)
        </button>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">Electric car</h3>
        <div>
          <label htmlFor="tc-model" className={labelClass}>
            Model
            <InfoTooltip
              label="Tesla model"
              text="Presets fill estimated usable capacity and efficiency. Specs vary by year and trim — edit fields as needed."
            />
          </label>
          <select
            id="tc-model"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
            value={input.vehicleId}
            onChange={(e) => applyPreset(e.target.value)}
          >
            {TESLA_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {presetLabel(p)}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {getPreset(input.vehicleId)?.note ?? 'Estimate only.'}
          </p>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">Charging cost</h3>

        <div>
          <label htmlFor="tc-price" className={labelClass}>
            Price (per kWh)
            <InfoTooltip
              label="Electricity price"
              text="Your tariff per kilowatt-hour. Currency is for display only — not converted."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.electricityPrice}>
              <input
                id="tc-price"
                className={inputClass}
                inputMode="decimal"
                value={input.electricityPrice}
                onChange={(e) => set({ electricityPrice: e.target.value })}
              />
            </FieldShell>
            <div className="w-full max-w-[160px] shrink-0">
              <CurrencySelect
                id="tc-currency"
                value={input.currency}
                onChange={(currency: SupportedCurrency) => set({ currency })}
                aria-label="Currency denomination"
              />
            </div>
          </div>
          {errors.electricityPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.electricityPrice}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="tc-cap" className={labelClass}>
            Capacity
            <InfoTooltip
              label="Battery capacity"
              text="Usable battery energy. Prefer usable kWh over nominal pack size."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.batteryCapacity}>
              <input
                id="tc-cap"
                className={inputClass}
                inputMode="decimal"
                value={input.batteryCapacity}
                onChange={(e) => set({ batteryCapacity: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.batteryCapacityUnit}
              aria-label="Energy unit"
              onChange={(e) => {
                const next = e.target.value as EnergyUnit;
                const n = Number(input.batteryCapacity.replace(/,/g, ''));
                if (Number.isFinite(n) && n > 0) {
                  const kWh = convertEnergyToKWh(n, input.batteryCapacityUnit);
                  set({
                    batteryCapacityUnit: next,
                    batteryCapacity: String(
                      Number(fromKWh(kWh, next).toPrecision(12)),
                    ),
                  });
                  return;
                }
                set({ batteryCapacityUnit: next });
              }}
            >
              {(Object.keys(ENERGY_UNIT_LABELS) as EnergyUnit[]).map((u) => (
                <option key={u} value={u}>
                  {ENERGY_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
          {errors.batteryCapacity ? (
            <p className="mt-1 text-xs text-rose-600">{errors.batteryCapacity}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">Driving cost</h3>

        <div>
          <label htmlFor="tc-dist" className={labelClass}>
            Driven distance
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.drivingDistance}>
              <input
                id="tc-dist"
                className={inputClass}
                inputMode="decimal"
                value={input.drivingDistance}
                onChange={(e) => set({ drivingDistance: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[72px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.distanceUnit}
              aria-label="Distance unit"
              onChange={(e) => {
                const next = e.target.value as DistanceUnit;
                const n = Number(input.drivingDistance.replace(/,/g, ''));
                if (Number.isFinite(n) && n >= 0 && input.drivingDistance.trim()) {
                  const km = convertDistanceToKm(n, input.distanceUnit);
                  set({
                    distanceUnit: next,
                    drivingDistance: String(
                      Number(fromKm(km, next).toPrecision(12)),
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
        </div>

        <div>
          <label htmlFor="tc-eff" className={labelClass}>
            Efficiency
            <InfoTooltip
              label="Efficiency"
              text="Energy use per distance. Real consumption varies with speed, weather, and load."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.efficiency}>
              <input
                id="tc-eff"
                className={inputClass}
                inputMode="decimal"
                value={input.efficiency}
                onChange={(e) => set({ efficiency: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[120px] shrink-0 rounded-lg border border-border bg-white px-1 text-sm"
              value={input.efficiencyUnit}
              aria-label="Efficiency unit"
              onChange={(e) => {
                const next = e.target.value as EfficiencyUnit;
                const n = Number(input.efficiency.replace(/,/g, ''));
                if (Number.isFinite(n) && n > 0) {
                  try {
                    const perKm = convertEfficiencyToKWhPerKm(
                      n,
                      input.efficiencyUnit,
                    );
                    set({
                      efficiencyUnit: next,
                      efficiency: String(
                        Number(fromKWhPerKm(perKm, next).toPrecision(12)),
                      ),
                    });
                    return;
                  } catch {
                    // fall through
                  }
                }
                set({ efficiencyUnit: next });
              }}
            >
              {(Object.keys(EFFICIENCY_UNIT_LABELS) as EfficiencyUnit[]).map(
                (u) => (
                  <option key={u} value={u}>
                    {EFFICIENCY_UNIT_LABELS[u]}
                  </option>
                ),
              )}
            </select>
          </div>
          {errors.efficiency ? (
            <p className="mt-1 text-xs text-rose-600">{errors.efficiency}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={input.advancedMode}
            onChange={(e) => set({ advancedMode: e.target.checked })}
          />
          Advanced: charge between SOC levels
        </label>
        {input.advancedMode ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="tc-start" className={labelClass}>
                Start %
              </label>
              <FieldShell error={errors.startBatteryPercent}>
                <input
                  id="tc-start"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.startBatteryPercent}
                  onChange={(e) =>
                    set({ startBatteryPercent: e.target.value })
                  }
                />
              </FieldShell>
            </div>
            <div>
              <label htmlFor="tc-tgt" className={labelClass}>
                Target %
              </label>
              <FieldShell error={errors.targetBatteryPercent}>
                <input
                  id="tc-tgt"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.targetBatteryPercent}
                  onChange={(e) =>
                    set({ targetBatteryPercent: e.target.value })
                  }
                />
              </FieldShell>
            </div>
            <div>
              <label htmlFor="tc-eta" className={labelClass}>
                Charge η %
              </label>
              <FieldShell error={errors.chargingEfficiencyPercent}>
                <input
                  id="tc-eta"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.chargingEfficiencyPercent}
                  onChange={(e) =>
                    set({ chargingEfficiencyPercent: e.target.value })
                  }
                />
              </FieldShell>
            </div>
          </div>
        ) : null}

        <div>
          <label htmlFor="tc-int" className={labelClass}>
            Chart interval
          </label>
          <select
            id="tc-int"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm sm:w-40"
            value={input.chartInterval}
            onChange={(e) =>
              set({
                chartInterval: Number(e.target.value) as ChartInterval,
              })
            }
          >
            <option value={5}>5%</option>
            <option value={10}>10%</option>
            <option value={20}>20%</option>
            <option value={25}>25%</option>
          </select>
        </div>
      </div>
    </form>
  );
}
