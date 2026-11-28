'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DISTANCE_UNIT_LABELS,
  ECONOMY_UNIT_LABELS,
  PAYMENT_METHOD_LABELS,
  PRICE_UNIT_LABELS,
  TRIP_TYPE_LABELS,
  VEHICLE_LABELS,
  VOLUME_UNIT_LABELS,
  economyForPreset,
  type CarpoolingFieldErrors,
  type CarpoolingInput,
  type DistanceUnit,
  type FuelEconomyUnit,
  type FuelPriceUnit,
  type FuelVolumeUnit,
  type PaymentMethod,
  type TripType,
  type VehiclePreset,
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

interface CarpoolingFormProps {
  input: CarpoolingInput;
  errors: CarpoolingFieldErrors;
  onChange: (next: CarpoolingInput) => void;
  onLoadExample: () => void;
}

export function CarpoolingForm({
  input,
  errors,
  onChange,
  onLoadExample,
}: CarpoolingFormProps) {
  const set = (patch: Partial<CarpoolingInput>) =>
    onChange({ ...input, ...patch });

  const applyVehicleTrip = (
    vehicle: VehiclePreset,
    tripType: TripType,
  ): Partial<CarpoolingInput> => {
    const eco = economyForPreset(vehicle, tripType);
    if (eco == null) {
      return { vehicle, tripType };
    }
    return {
      vehicle,
      tripType,
      fuelEconomy: String(eco),
      fuelEconomyUnit: 'L/100km',
    };
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Select your trip type, vehicle, and distance to calculate fuel expenses
        and estimate how much each passenger should contribute. Currency labels
        amounts only — it does not convert prices.
      </p>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (120 km · 8 L/100 km · $1.50 · 4 people)
      </button>

      <fieldset>
        <legend className={labelClass}>Trip type</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(Object.keys(TRIP_TYPE_LABELS) as TripType[]).map((t) => (
            <label
              key={t}
              className={`flex h-11 cursor-pointer items-center justify-center rounded-lg border px-2 text-center text-xs font-medium sm:text-sm ${
                input.tripType === t
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-white text-accent'
              }`}
            >
              <input
                type="radio"
                className="sr-only"
                name="trip-type"
                checked={input.tripType === t}
                onChange={() => set(applyVehicleTrip(input.vehicle, t))}
              />
              {TRIP_TYPE_LABELS[t]}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="cp-vehicle" className={labelClass}>
          Car
        </label>
        <FieldShell>
          <select
            id="cp-vehicle"
            className={`${inputClass} appearance-none`}
            value={input.vehicle}
            onChange={(e) => {
              const vehicle = e.target.value as VehiclePreset;
              set(applyVehicleTrip(vehicle, input.tripType));
            }}
          >
            {(Object.keys(VEHICLE_LABELS) as VehiclePreset[]).map((v) => (
              <option key={v} value={v}>
                {VEHICLE_LABELS[v]}
              </option>
            ))}
          </select>
        </FieldShell>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Preset economies are sample values for illustration, not model-specific
          EPA or manufacturer ratings.
        </p>
      </div>

      <div>
        <label htmlFor="cp-economy" className={labelClass}>
          Fuel economy
          <InfoTooltip
            label="Fuel economy"
            text="Fuel economy describes how much fuel a vehicle uses over a given distance. Lower L/100 km values indicate better fuel economy."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.fuelEconomy}>
            <input
              id="cp-economy"
              className={inputClass}
              inputMode="decimal"
              value={input.fuelEconomy}
              aria-invalid={Boolean(errors.fuelEconomy)}
              onChange={(e) =>
                set({
                  fuelEconomy: e.target.value,
                  vehicle: 'custom',
                  tripType: 'custom',
                })
              }
            />
          </FieldShell>
          <select
            className="h-11 w-[108px] shrink-0 rounded-lg border border-border bg-white px-1 text-xs sm:text-sm"
            value={input.fuelEconomyUnit}
            aria-label="Fuel economy unit"
            onChange={(e) =>
              set({ fuelEconomyUnit: e.target.value as FuelEconomyUnit })
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
        {errors.fuelEconomy ? (
          <p className="mt-1 text-xs text-rose-600">{errors.fuelEconomy}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cp-distance" className={labelClass}>
          Distance
          <InfoTooltip
            label="Trip distance"
            text="Enter one-way distance unless you already typed the full trip. Enable Round trip to double one-way distance."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.distance}>
            <input
              id="cp-distance"
              className={inputClass}
              inputMode="decimal"
              value={input.distance}
              aria-invalid={Boolean(errors.distance)}
              onChange={(e) => set({ distance: e.target.value })}
            />
          </FieldShell>
          <select
            className="h-11 w-[72px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
            value={input.distanceUnit}
            aria-label="Distance unit"
            onChange={(e) =>
              set({ distanceUnit: e.target.value as DistanceUnit })
            }
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

      <label className="flex items-center gap-2 text-sm text-accent">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border"
          checked={input.roundTrip}
          onChange={(e) => set({ roundTrip: e.target.checked })}
        />
        Round trip (double one-way distance)
      </label>

      <label className="flex items-center gap-2 text-sm text-accent">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border"
          checked={input.useFuelUsedOverride}
          onChange={(e) => set({ useFuelUsedOverride: e.target.checked })}
        />
        Enter fuel used manually
      </label>

      {input.useFuelUsedOverride ? (
        <div>
          <label htmlFor="cp-fuel-used" className={labelClass}>
            Fuel used
            <InfoTooltip
              label="Fuel used"
              text="Override automatic fuel consumption. Distance and economy still inform the breakdown when available."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.fuelUsedOverride}>
              <input
                id="cp-fuel-used"
                className={inputClass}
                inputMode="decimal"
                value={input.fuelUsedOverride}
                onChange={(e) => set({ fuelUsedOverride: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[96px] shrink-0 rounded-lg border border-border bg-white px-1 text-xs"
              value={input.fuelUsedUnit}
              aria-label="Fuel volume unit"
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
          {errors.fuelUsedOverride ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.fuelUsedOverride}
            </p>
          ) : null}
        </div>
      ) : null}

      <div>
        <label htmlFor="cp-price" className={labelClass}>
          Fuel price
          <InfoTooltip
            label="Fuel price"
            text="Cost of one unit of fuel in the selected currency. Amounts are labeled only — not live-converted."
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <FieldShell error={errors.fuelPrice}>
            <input
              id="cp-price"
              className={inputClass}
              inputMode="decimal"
              value={input.fuelPrice}
              aria-invalid={Boolean(errors.fuelPrice)}
              onChange={(e) => set({ fuelPrice: e.target.value })}
            />
          </FieldShell>
          <select
            className="h-11 w-[110px] shrink-0 rounded-lg border border-border bg-white px-1 text-xs"
            value={input.fuelPriceUnit}
            aria-label="Fuel price unit"
            onChange={(e) =>
              set({ fuelPriceUnit: e.target.value as FuelPriceUnit })
            }
          >
            {(Object.keys(PRICE_UNIT_LABELS) as FuelPriceUnit[]).map((u) => (
              <option key={u} value={u}>
                {PRICE_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="cp-currency"
              value={input.currency}
              onChange={(currency: SupportedCurrency) => set({ currency })}
              aria-label="Display currency"
            />
          </div>
        </div>
        {errors.fuelPrice ? (
          <p className="mt-1 text-xs text-rose-600">{errors.fuelPrice}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cp-people" className={labelClass}>
          Number of people
          <InfoTooltip
            label="Number of people"
            text="Enter the total number of people sharing the trip, including the driver."
          />
        </label>
        <FieldShell error={errors.numberOfPeople}>
          <input
            id="cp-people"
            className={inputClass}
            inputMode="numeric"
            value={input.numberOfPeople}
            aria-invalid={Boolean(errors.numberOfPeople)}
            onChange={(e) => set({ numberOfPeople: e.target.value })}
          />
        </FieldShell>
        {errors.numberOfPeople ? (
          <p className="mt-1 text-xs text-rose-600">{errors.numberOfPeople}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cp-pay" className={labelClass}>
          Payment split
          <InfoTooltip
            label="Driver reimbursement"
            text="Choose how the trip cost is shared. Reimbursement is what passengers return to a driver who paid the full trip."
          />
        </label>
        <FieldShell>
          <select
            id="cp-pay"
            className={`${inputClass} appearance-none`}
            value={input.paymentMethod}
            onChange={(e) =>
              set({ paymentMethod: e.target.value as PaymentMethod })
            }
          >
            {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map(
              (m) => (
                <option key={m} value={m}>
                  {PAYMENT_METHOD_LABELS[m]}
                </option>
              ),
            )}
          </select>
        </FieldShell>
      </div>

      {input.paymentMethod === 'customDriverContribution' ? (
        <div>
          <label htmlFor="cp-driver" className={labelClass}>
            Driver contribution
          </label>
          <FieldShell error={errors.driverContribution}>
            <input
              id="cp-driver"
              className={inputClass}
              inputMode="decimal"
              value={input.driverContribution}
              onChange={(e) => set({ driverContribution: e.target.value })}
            />
          </FieldShell>
          {errors.driverContribution ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.driverContribution}
            </p>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        onClick={() => set({ showAdditional: !input.showAdditional })}
      >
        {input.showAdditional ? 'Hide' : 'Show'} additional trip expenses
      </button>

      {input.showAdditional ? (
        <div className="space-y-3 rounded-xl border border-border bg-muted/10 p-3">
          <p className="text-[11px] text-muted-foreground">
            Direct trip fees only — not full ownership costs (insurance,
            depreciation, etc.).
          </p>
          {(
            [
              ['tolls', 'Toll charges', errors.tolls],
              ['parking', 'Parking fees', errors.parking],
              ['otherExpenses', 'Other expenses', errors.otherExpenses],
            ] as const
          ).map(([key, label, err]) => (
            <div key={key}>
              <label htmlFor={`cp-${key}`} className={labelClass}>
                {label}
              </label>
              <FieldShell error={err}>
                <input
                  id={`cp-${key}`}
                  className={inputClass}
                  inputMode="decimal"
                  value={input[key]}
                  onChange={(e) => set({ [key]: e.target.value })}
                />
              </FieldShell>
              {err ? <p className="mt-1 text-xs text-rose-600">{err}</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      <label className="flex items-center gap-2 text-sm text-accent">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border"
          checked={input.enableSavings}
          onChange={(e) => set({ enableSavings: e.target.checked })}
        />
        Compare shared ride vs. separate vehicles
      </label>

      {input.enableSavings ? (
        <div>
          <label htmlFor="cp-solo" className={labelClass}>
            Solo vehicle fuel economy
            <InfoTooltip
              label="Total savings"
              text="Comparison scenario: each traveler drives alone with this economy. Not every passenger would otherwise drive separately."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.soloFuelEconomy}>
              <input
                id="cp-solo"
                className={inputClass}
                inputMode="decimal"
                value={input.soloFuelEconomy}
                placeholder={input.fuelEconomy || 'Same as shared'}
                onChange={(e) => set({ soloFuelEconomy: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[108px] shrink-0 rounded-lg border border-border bg-white px-1 text-xs"
              value={input.soloFuelEconomyUnit}
              aria-label="Solo fuel economy unit"
              onChange={(e) =>
                set({
                  soloFuelEconomyUnit: e.target.value as FuelEconomyUnit,
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
          {errors.soloFuelEconomy ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.soloFuelEconomy}
            </p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
