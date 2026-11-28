'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertDistance,
  convertFuelEconomy,
  convertFuelVolume,
} from './calculation';
import {
  DISTANCE_UNIT_LABELS,
  ECONOMY_UNIT_LABELS,
  MODE_LABELS,
  PRICE_UNIT_LABELS,
  VOLUME_UNIT_LABELS,
  type CalculationMode,
  type DistanceUnit,
  type FuelEconomyUnit,
  type FuelPriceUnit,
  type FuelVolumeUnit,
  type MpgFieldErrors,
  type MpgInput,
  createEmptyInput,
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

interface MpgFormProps {
  input: MpgInput;
  errors: MpgFieldErrors;
  onChange: (next: MpgInput) => void;
  computedDistance?: string;
  computedFuel?: string;
  computedEconomy?: string;
}

export function MpgForm({
  input,
  errors,
  onChange,
  computedDistance,
  computedFuel,
  computedEconomy,
}: MpgFormProps) {
  const set = (patch: Partial<MpgInput>) => onChange({ ...input, ...patch });

  const distRO = input.calculationMode === 'distance';
  const fuelRO = input.calculationMode === 'fuel-used';
  const econRO = input.calculationMode === 'fuel-economy';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        MPG = distance ÷ fuel. Higher US mpg means better economy; lower L/100
        km means better economy. US and Imperial gallons are not the same.
        Currency changes the symbol only — no live FX.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (300 mi · 10 gal → 30 mpg)
        </button>
      </div>

      <div>
        <span className={labelClass}>Calculate</span>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(MODE_LABELS) as CalculationMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => set({ calculationMode: m })}
              className={`rounded-lg border px-2 py-2 text-xs font-medium ${
                input.calculationMode === m
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-white text-accent hover:bg-muted/30'
              }`}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="mpg-distance" className={labelClass}>
          Distance
          <InfoTooltip
            label="Distance"
            text="Distance driven for the fill-up or trip segment. 1 mi = 1.609344 km."
          />
          {distRO ? (
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              (calculated)
            </span>
          ) : null}
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.distance}>
            <input
              id="mpg-distance"
              className={`${inputClass} ${distRO ? 'bg-muted/30' : ''}`}
              inputMode="decimal"
              readOnly={distRO}
              value={distRO ? (computedDistance ?? '') : input.distance}
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
              if (
                Number.isFinite(n) &&
                n >= 0 &&
                input.calculationMode !== 'distance'
              ) {
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
              } else {
                set({ distanceUnit: next });
              }
            }}
          >
            {(Object.keys(DISTANCE_UNIT_LABELS) as DistanceUnit[]).map((u) => (
              <option key={u} value={u}>
                {DISTANCE_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
        {errors.distance ? (
          <p className="mt-1 text-xs text-rose-600">{errors.distance}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="mpg-fuel" className={labelClass}>
          Fuel used
          <InfoTooltip
            label="Fuel used"
            text="Fuel consumed. US gal ≠ Imperial gal. 1 US gal = 3.785411784 L."
          />
          {fuelRO ? (
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              (calculated)
            </span>
          ) : null}
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.fuelUsed}>
            <input
              id="mpg-fuel"
              className={`${inputClass} ${fuelRO ? 'bg-muted/30' : ''}`}
              inputMode="decimal"
              readOnly={fuelRO}
              value={fuelRO ? (computedFuel ?? '') : input.fuelUsed}
              aria-invalid={Boolean(errors.fuelUsed)}
              onChange={(e) => set({ fuelUsed: e.target.value })}
            />
          </FieldShell>
          <select
            className="h-11 w-[100px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
            value={input.fuelUsedUnit}
            aria-label="Fuel volume unit"
            onChange={(e) => {
              const next = e.target.value as FuelVolumeUnit;
              const n = Number(input.fuelUsed.replace(/,/g, ''));
              if (
                Number.isFinite(n) &&
                n >= 0 &&
                input.calculationMode !== 'fuel-used'
              ) {
                set({
                  fuelUsedUnit: next,
                  fuelUsed: String(
                    Number(
                      convertFuelVolume(
                        n,
                        input.fuelUsedUnit,
                        next,
                      ).toPrecision(12),
                    ),
                  ),
                });
              } else {
                set({ fuelUsedUnit: next });
              }
            }}
          >
            {(Object.keys(VOLUME_UNIT_LABELS) as FuelVolumeUnit[]).map((u) => (
              <option key={u} value={u}>
                {VOLUME_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
        {errors.fuelUsed ? (
          <p className="mt-1 text-xs text-rose-600">{errors.fuelUsed}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="mpg-economy" className={labelClass}>
          Fuel economy
          <InfoTooltip
            label="Fuel economy"
            text="US mpg, Imperial mpg, km/L, L/100 km, or mi/L. L/100 km is consumption — lower is better."
          />
          {econRO ? (
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              (calculated)
            </span>
          ) : null}
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.fuelEconomy}>
            <input
              id="mpg-economy"
              className={`${inputClass} ${econRO ? 'bg-muted/30' : ''}`}
              inputMode="decimal"
              readOnly={econRO}
              value={econRO ? (computedEconomy ?? '') : input.fuelEconomy}
              aria-invalid={Boolean(errors.fuelEconomy)}
              onChange={(e) => set({ fuelEconomy: e.target.value })}
            />
          </FieldShell>
          <select
            className="h-11 w-[110px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
            value={input.fuelEconomyUnit}
            aria-label="Fuel economy unit"
            onChange={(e) => {
              const next = e.target.value as FuelEconomyUnit;
              const n = Number(input.fuelEconomy.replace(/,/g, ''));
              if (
                Number.isFinite(n) &&
                n > 0 &&
                input.calculationMode !== 'fuel-economy'
              ) {
                const converted = convertFuelEconomy(
                  n,
                  input.fuelEconomyUnit,
                  next,
                );
                set({
                  fuelEconomyUnit: next,
                  fuelEconomy:
                    converted != null
                      ? String(Number(converted.toPrecision(12)))
                      : input.fuelEconomy,
                });
              } else {
                set({ fuelEconomyUnit: next });
              }
            }}
          >
            {(Object.keys(ECONOMY_UNIT_LABELS) as FuelEconomyUnit[]).map(
              (u) => (
                <option key={u} value={u}>
                  {ECONOMY_UNIT_LABELS[u]}
                </option>
              ),
            )}
          </select>
        </div>
        {errors.fuelEconomy ? (
          <p className="mt-1 text-xs text-rose-600">{errors.fuelEconomy}</p>
        ) : null}
      </div>

      <details
        className="rounded-xl border border-border bg-muted/10"
        open={input.showTripCost}
        onToggle={(e) =>
          set({ showTripCost: (e.target as HTMLDetailsElement).open })
        }
      >
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Fuel price and trip cost
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div>
            <label htmlFor="mpg-trip-dist" className={labelClass}>
              Trip distance
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.tripDistance}>
                <input
                  id="mpg-trip-dist"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.tripDistance}
                  onChange={(e) => set({ tripDistance: e.target.value })}
                />
              </FieldShell>
              <select
                className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                value={input.tripDistanceUnit}
                aria-label="Trip distance unit"
                onChange={(e) =>
                  set({ tripDistanceUnit: e.target.value as DistanceUnit })
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
          </div>
          <div>
            <label htmlFor="mpg-price" className={labelClass}>
              Fuel price
              <InfoTooltip
                label="Fuel price"
                text="Price per selected volume unit. Match the unit to how you buy fuel."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.fuelPrice}>
                <input
                  id="mpg-price"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.fuelPrice}
                  onChange={(e) => set({ fuelPrice: e.target.value })}
                />
              </FieldShell>
              <select
                className="h-11 w-[120px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                value={input.fuelPriceUnit}
                aria-label="Fuel price unit"
                onChange={(e) =>
                  set({ fuelPriceUnit: e.target.value as FuelPriceUnit })
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
          </div>
          <div>
            <span className={labelClass}>Currency</span>
            <div className="w-full max-w-[160px]">
              <CurrencySelect
                id="mpg-currency"
                value={input.currency}
                onChange={(currency: SupportedCurrency) => set({ currency })}
                aria-label="Display currency"
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Changes the symbol only — enter the pump price in that currency.
            </p>
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/10"
        open={input.showRange}
        onToggle={(e) =>
          set({ showRange: (e.target as HTMLDetailsElement).open })
        }
      >
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          How far can I drive with my fuel?
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div>
            <label htmlFor="mpg-avail" className={labelClass}>
              Available fuel
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.availableFuel}>
                <input
                  id="mpg-avail"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.availableFuel}
                  onChange={(e) => set({ availableFuel: e.target.value })}
                />
              </FieldShell>
              <select
                className="h-11 w-[100px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                value={input.availableFuelUnit}
                aria-label="Available fuel unit"
                onChange={(e) =>
                  set({ availableFuelUnit: e.target.value as FuelVolumeUnit })
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
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/10"
        open={input.showCompare}
        onToggle={(e) =>
          set({ showCompare: (e.target as HTMLDetailsElement).open })
        }
      >
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Compare fuel economy
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <p className="text-xs text-muted-foreground">
            Vehicle A uses the main fuel economy. Enter Vehicle B, distance, and
            fuel price (trip-cost price field) to compare.
          </p>
          <div>
            <label htmlFor="mpg-econ-b" className={labelClass}>
              Vehicle B economy
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.compareEconomyB}>
                <input
                  id="mpg-econ-b"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.compareEconomyB}
                  onChange={(e) => set({ compareEconomyB: e.target.value })}
                />
              </FieldShell>
              <select
                className="h-11 w-[110px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                value={input.compareEconomyBUnit}
                aria-label="Vehicle B economy unit"
                onChange={(e) =>
                  set({
                    compareEconomyBUnit: e.target.value as FuelEconomyUnit,
                  })
                }
              >
                {(Object.keys(ECONOMY_UNIT_LABELS) as FuelEconomyUnit[]).map(
                  (u) => (
                    <option key={u} value={u}>
                      {ECONOMY_UNIT_LABELS[u]}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="mpg-cmp-dist" className={labelClass}>
              Compare distance
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.compareDistance}>
                <input
                  id="mpg-cmp-dist"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.compareDistance}
                  onChange={(e) => set({ compareDistance: e.target.value })}
                />
              </FieldShell>
              <select
                className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                value={input.compareDistanceUnit}
                aria-label="Compare distance unit"
                onChange={(e) =>
                  set({ compareDistanceUnit: e.target.value as DistanceUnit })
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
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/10"
        open={input.showImprove}
        onToggle={(e) =>
          set({ showImprove: (e.target as HTMLDetailsElement).open })
        }
      >
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Fuel economy improvement
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div>
            <label htmlFor="mpg-prev" className={labelClass}>
              Previous economy
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.previousEconomy}>
                <input
                  id="mpg-prev"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.previousEconomy}
                  onChange={(e) => set({ previousEconomy: e.target.value })}
                />
              </FieldShell>
              <select
                className="h-11 w-[110px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                value={input.previousEconomyUnit}
                aria-label="Previous economy unit"
                onChange={(e) =>
                  set({
                    previousEconomyUnit: e.target.value as FuelEconomyUnit,
                  })
                }
              >
                {(Object.keys(ECONOMY_UNIT_LABELS) as FuelEconomyUnit[]).map(
                  (u) => (
                    <option key={u} value={u}>
                      {ECONOMY_UNIT_LABELS[u]}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="mpg-new" className={labelClass}>
              New economy
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.newEconomy}>
                <input
                  id="mpg-new"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.newEconomy}
                  onChange={(e) => set({ newEconomy: e.target.value })}
                />
              </FieldShell>
              <select
                className="h-11 w-[110px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                value={input.newEconomyUnit}
                aria-label="New economy unit"
                onChange={(e) =>
                  set({ newEconomyUnit: e.target.value as FuelEconomyUnit })
                }
              >
                {(Object.keys(ECONOMY_UNIT_LABELS) as FuelEconomyUnit[]).map(
                  (u) => (
                    <option key={u} value={u}>
                      {ECONOMY_UNIT_LABELS[u]}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
        </div>
      </details>
    </form>
  );
}
