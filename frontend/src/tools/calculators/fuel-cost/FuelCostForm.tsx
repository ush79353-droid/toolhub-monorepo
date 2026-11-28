'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  fromKm,
  fromLPer100Km,
  fromPricePerLiter,
  toKm,
  toLPer100Km,
  toPricePerLiter,
} from './calculation';
import {
  DISTANCE_UNIT_LABELS,
  EFFICIENCY_UNIT_LABELS,
  PRICE_UNIT_LABELS,
  VEHICLE_ESTIMATE_LABELS,
  VEHICLE_ESTIMATE_L_PER_100KM,
  VOLUME_UNIT_LABELS,
  type DistanceUnit,
  type FuelCostFieldErrors,
  type FuelCostInput,
  type FuelEfficiencyUnit,
  type FuelPriceUnit,
  type FuelVolumeUnit,
  type VehicleEstimateCategory,
  createEmptyInput,
  createExampleOneWay,
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

interface FuelCostFormProps {
  input: FuelCostInput;
  errors: FuelCostFieldErrors;
  onChange: (next: FuelCostInput) => void;
}

export function FuelCostForm({ input, errors, onChange }: FuelCostFormProps) {
  const set = (patch: Partial<FuelCostInput>) =>
    onChange({ ...input, ...patch });

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

  const applyVehicleEstimate = (cat: VehicleEstimateCategory) => {
    if (cat === 'custom') {
      set({ vehicleEstimate: cat });
      return;
    }
    const l100 = VEHICLE_ESTIMATE_L_PER_100KM[cat];
    const display =
      fromLPer100Km(l100, input.fuelEfficiencyUnit) ?? l100;
    set({
      vehicleEstimate: cat,
      fuelEfficiency: String(Number(display.toPrecision(12))),
      fuelEfficiencyUnit:
        input.fuelEfficiencyUnit === 'L/100km'
          ? 'L/100km'
          : input.fuelEfficiencyUnit,
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
        Estimate trip fuel and cost from distance, economy, and pump price.
        Currency labels denomination only — no live FX or fuel-price feed.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example round trip (150 km · 7.5 · PKR 280)
        </button>
        <button
          type="button"
          onClick={() => onChange(createExampleOneWay())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example one-way (100 km · 8)
        </button>
      </div>

      <details className="rounded-xl border border-border bg-muted/10" open>
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Trip information
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div>
            <label htmlFor="fc-dist" className={labelClass}>
              One-way distance
              <InfoTooltip
                label="One-way distance"
                text="Distance for a single direction. Enable two-way trip to double total travel distance without changing this field."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.oneWayDistance}>
                <input
                  id="fc-dist"
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

          <label className="inline-flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              checked={input.isRoundTrip}
              onChange={(e) => set({ isRoundTrip: e.target.checked })}
            />
            Two-way trip
            <InfoTooltip
              label="Two-way trip"
              text="When checked, total distance = one-way × 2. One-way input is preserved."
            />
          </label>

          <div>
            <span className={labelClass}>Currency</span>
            <div className="w-full max-w-[160px]">
              <CurrencySelect
                id="fc-currency"
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
            <label htmlFor="fc-price" className={labelClass}>
              Fuel price at your gas station
              <InfoTooltip
                label="Fuel price"
                text="Price per liter or gallon in the selected currency. Switching volume units converts the numeric price; switching currency does not convert money."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.fuelPrice}>
                <input
                  id="fc-price"
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

          <label className="inline-flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              checked={input.useEstimatedEfficiency}
              onChange={(e) =>
                set({ useEstimatedEfficiency: e.target.checked })
              }
            />
            I don&apos;t know my car&apos;s fuel efficiency
          </label>

          {input.useEstimatedEfficiency ? (
            <div>
              <label htmlFor="fc-est" className={labelClass}>
                Estimated vehicle category
                <InfoTooltip
                  label="Estimated efficiency"
                  text="Illustrative L/100 km samples only — not OEM or model-specific data. Override anytime with a custom value."
                />
              </label>
              <select
                id="fc-est"
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
                value={input.vehicleEstimate}
                onChange={(e) =>
                  applyVehicleEstimate(
                    e.target.value as VehicleEstimateCategory,
                  )
                }
              >
                {(
                  Object.keys(
                    VEHICLE_ESTIMATE_LABELS,
                  ) as VehicleEstimateCategory[]
                ).map((c) => (
                  <option key={c} value={c}>
                    {VEHICLE_ESTIMATE_LABELS[c]}
                    {c !== 'custom'
                      ? ` · ~${VEHICLE_ESTIMATE_L_PER_100KM[c]} L/100 km`
                      : ''}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div>
            <label htmlFor="fc-eff" className={labelClass}>
              Fuel efficiency / consumption
              <InfoTooltip
                label="Fuel efficiency"
                text="Lower L/100 km is better; higher km/L or mpg is better. Values convert while preserving physical economy."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.fuelEfficiency}>
                <input
                  id="fc-eff"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.fuelEfficiency}
                  aria-invalid={Boolean(errors.fuelEfficiency)}
                  onChange={(e) =>
                    set({
                      fuelEfficiency: e.target.value,
                      vehicleEstimate: 'custom',
                    })
                  }
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
            <label htmlFor="fc-pass" className={labelClass}>
              Passengers (optional split)
              <InfoTooltip
                label="Passengers"
                text="Positive whole number for optional cost-per-passenger. Does not change total fuel cost."
              />
            </label>
            <FieldShell error={errors.passengers}>
              <input
                id="fc-pass"
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
          Fuel cost and consumption
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div>
            <label htmlFor="fc-vol-unit" className={labelClass}>
              Fuel used display unit
            </label>
            <select
              id="fc-vol-unit"
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
            Fuel cost and fuel used update live in the results panel below.
          </p>
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
