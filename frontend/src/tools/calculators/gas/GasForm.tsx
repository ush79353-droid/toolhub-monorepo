'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  fromKm,
  fromLPer100Km,
  fromLiters,
  fromPricePerLiter,
  toKm,
  toLPer100Km,
  toLiters,
  toPricePerLiter,
} from './calculation';
import {
  DISTANCE_UNIT_LABELS,
  EFFICIENCY_UNIT_LABELS,
  PRICE_UNIT_LABELS,
  VOLUME_UNIT_LABELS,
  type DistanceUnit,
  type FuelEfficiencyUnit,
  type FuelPriceUnit,
  type FuelVolumeUnit,
  type GasFieldErrors,
  type GasInput,
  createEmptyInput,
  createRoundTripExample,
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

interface GasFormProps {
  input: GasInput;
  errors: GasFieldErrors;
  onChange: (next: GasInput) => void;
}

export function GasForm({ input, errors, onChange }: GasFormProps) {
  const set = (patch: Partial<GasInput>) => onChange({ ...input, ...patch });

  const changeDistanceUnit = (next: DistanceUnit) => {
    const n = Number(input.oneWayDistance.replace(/,/g, ''));
    if (Number.isFinite(n) && n >= 0) {
      const km = toKm(n, input.distanceUnit);
      set({
        distanceUnit: next,
        oneWayDistance: String(Number(fromKm(km, next).toPrecision(12))),
      });
      return;
    }
    set({ distanceUnit: next });
  };

  const changeEffUnit = (next: FuelEfficiencyUnit) => {
    const n = Number(input.fuelEfficiency.replace(/,/g, ''));
    if (Number.isFinite(n) && n > 0) {
      const l100 = toLPer100Km(n, input.fuelEfficiencyUnit);
      if (l100 != null) {
        const converted = fromLPer100Km(l100, next);
        if (converted != null) {
          set({
            fuelEfficiencyUnit: next,
            fuelEfficiency: String(Number(converted.toPrecision(12))),
          });
          return;
        }
      }
    }
    set({ fuelEfficiencyUnit: next });
  };

  const changePriceUnit = (next: FuelPriceUnit) => {
    const n = Number(input.fuelPrice.replace(/,/g, ''));
    if (Number.isFinite(n) && n >= 0) {
      const ppl = toPricePerLiter(n, input.fuelPriceUnit);
      if (ppl != null) {
        set({
          fuelPriceUnit: next,
          fuelPrice: String(
            Number(fromPricePerLiter(ppl, next).toPrecision(12)),
          ),
        });
        return;
      }
    }
    set({ fuelPriceUnit: next });
  };

  const changeAvailUnit = (next: FuelVolumeUnit) => {
    const n = Number(input.availableFuel.replace(/,/g, ''));
    if (Number.isFinite(n) && n >= 0) {
      const liters = toLiters(n, input.availableFuelUnit);
      set({
        availableFuelUnit: next,
        availableFuel: String(
          Number(fromLiters(liters, next).toPrecision(12)),
        ),
      });
      return;
    }
    set({ availableFuelUnit: next });
  };

  const changeCmpEffUnit = (next: FuelEfficiencyUnit) => {
    const n = Number(input.comparisonEfficiency.replace(/,/g, ''));
    if (Number.isFinite(n) && n > 0) {
      const l100 = toLPer100Km(n, input.comparisonEfficiencyUnit);
      if (l100 != null) {
        const converted = fromLPer100Km(l100, next);
        if (converted != null) {
          set({
            comparisonEfficiencyUnit: next,
            comparisonEfficiency: String(Number(converted.toPrecision(12))),
          });
          return;
        }
      }
    }
    set({ comparisonEfficiencyUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Estimate trip fuel and cost from distance, economy, and pump price.
        Currency labels denomination only — no live FX or fuel-price feed.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (250 km · 7.5 · PKR 280 · 3 pax)
        </button>
        <button
          type="button"
          onClick={() => onChange(createRoundTripExample())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Round trip (200 km × 2)
        </button>
      </div>

      <details className="rounded-xl border border-border bg-muted/10" open>
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Trip information
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div>
            <label htmlFor="gas-dist" className={labelClass}>
              Distance
              <InfoTooltip
                label="Distance"
                text="One-way trip distance. Select round trip below to double total travel distance without changing this field."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.oneWayDistance}>
                <input
                  id="gas-dist"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.oneWayDistance}
                  aria-invalid={Boolean(errors.oneWayDistance)}
                  onChange={(e) => set({ oneWayDistance: e.target.value })}
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
            {errors.oneWayDistance ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.oneWayDistance}
              </p>
            ) : null}
          </div>

          <fieldset>
            <legend className={labelClass}>
              Trip type
              <InfoTooltip
                label="Trip type"
                text="One-way uses the distance as entered. Round trip multiplies one-way distance by two for fuel and cost."
              />
            </legend>
            <div className="flex flex-wrap gap-3 text-sm text-accent">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="gas-trip-type"
                  checked={!input.isRoundTrip}
                  onChange={() => set({ isRoundTrip: false })}
                />
                One-way
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="gas-trip-type"
                  checked={input.isRoundTrip}
                  onChange={() => set({ isRoundTrip: true })}
                />
                Round trip
              </label>
            </div>
          </fieldset>

          <div>
            <label htmlFor="gas-eff" className={labelClass}>
              Fuel efficiency
              <InfoTooltip
                label="Fuel efficiency"
                text="Lower L/100 km is better; higher km/L or mpg is better. US and UK gallons differ — units convert while preserving physical economy."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.fuelEfficiency}>
                <input
                  id="gas-eff"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.fuelEfficiency}
                  aria-invalid={Boolean(errors.fuelEfficiency)}
                  onChange={(e) => set({ fuelEfficiency: e.target.value })}
                />
              </FieldShell>
              <select
                className="h-11 w-[110px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                value={input.fuelEfficiencyUnit}
                aria-label="Fuel efficiency unit"
                onChange={(e) =>
                  changeEffUnit(e.target.value as FuelEfficiencyUnit)
                }
              >
                {(
                  Object.keys(EFFICIENCY_UNIT_LABELS) as FuelEfficiencyUnit[]
                ).map((u) => (
                  <option key={u} value={u}>
                    {EFFICIENCY_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </div>
            {errors.fuelEfficiency ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.fuelEfficiency}
              </p>
            ) : null}
          </div>

          <div>
            <span className={labelClass}>Currency</span>
            <div className="w-full max-w-[160px]">
              <CurrencySelect
                id="gas-currency"
                value={input.currency}
                onChange={(currency: SupportedCurrency) => set({ currency })}
                aria-label="Display currency"
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Changes the symbol only — enter the pump price in that currency.
            </p>
          </div>

          <div>
            <label htmlFor="gas-price" className={labelClass}>
              Fuel price
              <InfoTooltip
                label="Fuel price"
                text="Price per liter or gallon in the selected currency. Switching volume units converts the numeric price; switching currency does not convert money."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.fuelPrice}>
                <input
                  id="gas-price"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.fuelPrice}
                  aria-invalid={Boolean(errors.fuelPrice)}
                  onChange={(e) => set({ fuelPrice: e.target.value })}
                />
              </FieldShell>
              <select
                className="h-11 w-[110px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                value={input.fuelPriceUnit}
                aria-label="Fuel price volume unit"
                onChange={(e) =>
                  changePriceUnit(e.target.value as FuelPriceUnit)
                }
              >
                {(Object.keys(PRICE_UNIT_LABELS) as FuelPriceUnit[]).map(
                  (u) => (
                    <option key={u} value={u}>
                      {PRICE_UNIT_LABELS[u]}
                    </option>
                  ),
                )}
              </select>
            </div>
            {errors.fuelPrice ? (
              <p className="mt-1 text-xs text-rose-600">{errors.fuelPrice}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="gas-pass" className={labelClass}>
              Number of passengers
              <InfoTooltip
                label="Passengers"
                text="Positive whole number including the driver for equal cost sharing. Does not change total fuel cost."
              />
            </label>
            <FieldShell error={errors.passengers}>
              <input
                id="gas-pass"
                className={inputClass}
                inputMode="numeric"
                value={input.passengers}
                aria-invalid={Boolean(errors.passengers)}
                onChange={(e) => set({ passengers: e.target.value })}
              />
            </FieldShell>
            {errors.passengers ? (
              <p className="mt-1 text-xs text-rose-600">{errors.passengers}</p>
            ) : null}
          </div>
        </div>
      </details>

      <details className="rounded-xl border border-border bg-muted/10" open>
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Fuel consumption display
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div>
            <label htmlFor="gas-vol-unit" className={labelClass}>
              Fuel required display unit
              <InfoTooltip
                label="Fuel required"
                text="Estimated fuel volume for the trip. Display unit converts the same physical quantity (US vs imperial gallons differ)."
              />
            </label>
            <select
              id="gas-vol-unit"
              className="h-11 w-full max-w-[160px] rounded-lg border border-border bg-white px-3 text-sm"
              value={input.fuelUsedUnit}
              onChange={(e) =>
                set({ fuelUsedUnit: e.target.value as FuelVolumeUnit })
              }
            >
              {(Object.keys(VOLUME_UNIT_LABELS) as FuelVolumeUnit[]).map(
                (u) => (
                  <option key={u} value={u}>
                    {VOLUME_UNIT_LABELS[u]}
                  </option>
                ),
              )}
            </select>
          </div>
          <p className="text-xs text-muted-foreground">
            Fuel required, total cost, cost per person, and cost per km update
            live in the results panel.
          </p>
        </div>
      </details>

      <details className="rounded-xl border border-border bg-muted/10">
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Advanced calculations
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div>
            <label htmlFor="gas-avail" className={labelClass}>
              Available fuel (driving range)
              <InfoTooltip
                label="Available fuel"
                text="Optional tank or remaining fuel for a maximum-range estimate: Range = AvailableFuel × 100 / (L/100 km). Real range varies with conditions."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.availableFuel}>
                <input
                  id="gas-avail"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.availableFuel}
                  aria-invalid={Boolean(errors.availableFuel)}
                  onChange={(e) => set({ availableFuel: e.target.value })}
                />
              </FieldShell>
              <select
                className="h-11 w-[110px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                value={input.availableFuelUnit}
                aria-label="Available fuel unit"
                onChange={(e) =>
                  changeAvailUnit(e.target.value as FuelVolumeUnit)
                }
              >
                {(Object.keys(VOLUME_UNIT_LABELS) as FuelVolumeUnit[]).map(
                  (u) => (
                    <option key={u} value={u}>
                      {VOLUME_UNIT_LABELS[u]}
                    </option>
                  ),
                )}
              </select>
            </div>
            {errors.availableFuel ? (
              <p className="mt-1 text-xs text-rose-600">{errors.availableFuel}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="gas-trips" className={labelClass}>
              Trips per week (recurring)
              <InfoTooltip
                label="Recurring trips"
                text="Optional. Multiplies this trip's fuel cost by trips per week. Monthly uses average months of 52/12 weeks; annual = weekly × 52."
              />
            </label>
            <FieldShell error={errors.tripsPerWeek}>
              <input
                id="gas-trips"
                className={inputClass}
                inputMode="decimal"
                placeholder="e.g. 5"
                value={input.tripsPerWeek}
                aria-invalid={Boolean(errors.tripsPerWeek)}
                onChange={(e) => set({ tripsPerWeek: e.target.value })}
              />
            </FieldShell>
            {errors.tripsPerWeek ? (
              <p className="mt-1 text-xs text-rose-600">{errors.tripsPerWeek}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="gas-cmp" className={labelClass}>
              Comparison vehicle efficiency
              <InfoTooltip
                label="Vehicle comparison"
                text="Optional second vehicle economy over the same total distance and fuel price. Positive savings means the comparison vehicle costs less."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.comparisonEfficiency}>
                <input
                  id="gas-cmp"
                  className={inputClass}
                  inputMode="decimal"
                  placeholder="optional"
                  value={input.comparisonEfficiency}
                  aria-invalid={Boolean(errors.comparisonEfficiency)}
                  onChange={(e) =>
                    set({ comparisonEfficiency: e.target.value })
                  }
                />
              </FieldShell>
              <select
                className="h-11 w-[110px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                value={input.comparisonEfficiencyUnit}
                aria-label="Comparison efficiency unit"
                onChange={(e) =>
                  changeCmpEffUnit(e.target.value as FuelEfficiencyUnit)
                }
              >
                {(
                  Object.keys(EFFICIENCY_UNIT_LABELS) as FuelEfficiencyUnit[]
                ).map((u) => (
                  <option key={u} value={u}>
                    {EFFICIENCY_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </div>
            {errors.comparisonEfficiency ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.comparisonEfficiency}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="gas-red" className={labelClass}>
              Consumption reduction (%)
              <InfoTooltip
                label="Efficiency improvement"
                text="Optional percent reduction in L/100 km consumption (not the same as a percent increase in mpg). Example: 20% reduction on 7.5 → 6.0 L/100 km."
              />
            </label>
            <FieldShell error={errors.consumptionReductionPercent}>
              <input
                id="gas-red"
                className={inputClass}
                inputMode="decimal"
                placeholder="optional"
                value={input.consumptionReductionPercent}
                aria-invalid={Boolean(errors.consumptionReductionPercent)}
                onChange={(e) =>
                  set({ consumptionReductionPercent: e.target.value })
                }
              />
            </FieldShell>
            {errors.consumptionReductionPercent ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.consumptionReductionPercent}
              </p>
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
