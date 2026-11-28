'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DISTANCE_UNIT_LABELS,
  ECONOMY_UNIT_LABELS,
  FREQUENCY_LABELS,
  PARKING_FREQ_LABELS,
  PRICE_UNIT_LABELS,
  TICKET_MODE_LABELS,
  VALIDITY_UNIT_LABELS,
  WEAR_FREQ_LABELS,
  type CommuteFieldErrors,
  type CommuteFrequency,
  type CommuteInput,
  type DistanceUnit,
  type FuelEconomyUnit,
  type FuelPriceUnit,
  type ParkingFrequency,
  type TicketMode,
  type TicketValidityUnit,
  type WearFrequency,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3 rounded-xl border border-border bg-muted/10 p-3 sm:p-4';

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

interface CommuteFormProps {
  input: CommuteInput;
  errors: CommuteFieldErrors;
  onChange: (next: CommuteInput) => void;
  onLoadExample: () => void;
}

export function CommuteForm({
  input,
  errors,
  onChange,
  onLoadExample,
}: CommuteFormProps) {
  const set = (patch: Partial<CommuteInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Estimate car and public-transport commuting costs for your distance and
        frequency. Currency labels amounts only — it does not convert prices.
        Weekly annualizes ×52; monthly ×12.
      </p>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (20 km · 22 days · PKR car vs transit)
      </button>

      <section className={sectionClass} aria-labelledby="commute-way">
        <h3 id="commute-way" className="text-sm font-semibold text-accent">
          Your Way to Work
        </h3>

        <div>
          <label htmlFor="cm-dist" className={labelClass}>
            One-way distance to workplace
            <InfoTooltip
              label="One-way distance"
              text="Enter the distance between your home and workplace for a single journey."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.oneWayDistance}>
              <input
                id="cm-dist"
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
                set({ distanceUnit: e.target.value as DistanceUnit })
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
            <p className="mt-1 text-xs text-rose-600">{errors.oneWayDistance}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="cm-freq" className={labelClass}>
            I commute…
            <InfoTooltip
              label="Commute frequency"
              text="Each count is one round-trip commuting day (to work and back). Not every month has exactly 22 workdays — use your actual schedule."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.commuteCount}>
              <input
                id="cm-freq"
                className={inputClass}
                inputMode="decimal"
                value={input.commuteCount}
                onChange={(e) => set({ commuteCount: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[120px] shrink-0 rounded-lg border border-border bg-white px-1 text-xs sm:text-sm"
              value={input.commuteFrequency}
              aria-label="Commute frequency unit"
              onChange={(e) =>
                set({
                  commuteFrequency: e.target.value as CommuteFrequency,
                })
              }
            >
              {(Object.keys(FREQUENCY_LABELS) as CommuteFrequency[]).map(
                (u) => (
                  <option key={u} value={u}>
                    {FREQUENCY_LABELS[u]}
                  </option>
                ),
              )}
            </select>
          </div>
          {errors.commuteCount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.commuteCount}</p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="commute-car">
        <div className="flex items-center justify-between gap-2">
          <h3 id="commute-car" className="text-sm font-semibold text-accent">
            Commuting by Car
          </h3>
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <input
              type="checkbox"
              className="h-3.5 w-3.5"
              checked={input.showCar}
              onChange={(e) => set({ showCar: e.target.checked })}
            />
            Include
          </label>
        </div>

        {input.showCar ? (
          <>
            <div>
              <label htmlFor="cm-people" className={labelClass}>
                People sharing a ride
                <InfoTooltip
                  label="People sharing"
                  text="Enter the total number of people sharing the car, including the driver."
                />
              </label>
              <FieldShell error={errors.peopleSharingRide}>
                <input
                  id="cm-people"
                  className={inputClass}
                  inputMode="numeric"
                  value={input.peopleSharingRide}
                  onChange={(e) => set({ peopleSharingRide: e.target.value })}
                />
              </FieldShell>
              {errors.peopleSharingRide ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.peopleSharingRide}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="cm-eco" className={labelClass}>
                Fuel economy
                <InfoTooltip
                  label="Fuel economy"
                  text="Fuel economy measures how much fuel your vehicle consumes over a given distance."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.fuelEconomy}>
                  <input
                    id="cm-eco"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.fuelEconomy}
                    onChange={(e) => set({ fuelEconomy: e.target.value })}
                  />
                </FieldShell>
                <select
                  className="h-11 w-[108px] shrink-0 rounded-lg border border-border bg-white px-1 text-xs"
                  value={input.fuelEconomyUnit}
                  aria-label="Fuel economy unit"
                  onChange={(e) =>
                    set({
                      fuelEconomyUnit: e.target.value as FuelEconomyUnit,
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
              {errors.fuelEconomy ? (
                <p className="mt-1 text-xs text-rose-600">{errors.fuelEconomy}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="cm-price" className={labelClass}>
                Fuel price
                <InfoTooltip
                  label="Fuel price"
                  text="Price per fuel volume in your selected currency. Amounts are labeled only — not live-converted."
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <FieldShell error={errors.fuelPrice}>
                  <input
                    id="cm-price"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.fuelPrice}
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
                  {(Object.keys(PRICE_UNIT_LABELS) as FuelPriceUnit[]).map(
                    (u) => (
                      <option key={u} value={u}>
                        {PRICE_UNIT_LABELS[u]}
                      </option>
                    ),
                  )}
                </select>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="cm-currency"
                    value={input.currency}
                    onChange={(currency: SupportedCurrency) =>
                      set({ currency })
                    }
                    aria-label="Display currency"
                  />
                </div>
              </div>
              {errors.fuelPrice ? (
                <p className="mt-1 text-xs text-rose-600">{errors.fuelPrice}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="cm-park" className={labelClass}>
                Parking and toll costs
                <InfoTooltip
                  label="Parking and tolls"
                  text="Optional parking and road charges. Choose how often the amount applies so costs are not double-counted."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.parkingAndTolls}>
                  <input
                    id="cm-park"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.parkingAndTolls}
                    onChange={(e) => set({ parkingAndTolls: e.target.value })}
                  />
                </FieldShell>
                <select
                  className="h-11 w-[140px] shrink-0 rounded-lg border border-border bg-white px-1 text-xs"
                  value={input.parkingFrequency}
                  aria-label="Parking frequency"
                  onChange={(e) =>
                    set({
                      parkingFrequency: e.target.value as ParkingFrequency,
                    })
                  }
                >
                  {(Object.keys(PARKING_FREQ_LABELS) as ParkingFrequency[]).map(
                    (u) => (
                      <option key={u} value={u}>
                        {PARKING_FREQ_LABELS[u]}
                      </option>
                    ),
                  )}
                </select>
              </div>
              {errors.parkingAndTolls ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.parkingAndTolls}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="cm-wear" className={labelClass}>
                Wear and tear costs
                <InfoTooltip
                  label="Wear and tear"
                  text="Your estimate for mileage-related costs (tires, maintenance, consumables). Not a universal rate — enter zero if unknown."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.wearAndTear}>
                  <input
                    id="cm-wear"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.wearAndTear}
                    onChange={(e) => set({ wearAndTear: e.target.value })}
                  />
                </FieldShell>
                <select
                  className="h-11 w-[140px] shrink-0 rounded-lg border border-border bg-white px-1 text-xs"
                  value={input.wearFrequency}
                  aria-label="Wear frequency"
                  onChange={(e) =>
                    set({ wearFrequency: e.target.value as WearFrequency })
                  }
                >
                  {(Object.keys(WEAR_FREQ_LABELS) as WearFrequency[]).map(
                    (u) => (
                      <option key={u} value={u}>
                        {WEAR_FREQ_LABELS[u]}
                      </option>
                    ),
                  )}
                </select>
              </div>
              {errors.wearAndTear ? (
                <p className="mt-1 text-xs text-rose-600">{errors.wearAndTear}</p>
              ) : null}
            </div>
          </>
        ) : null}
      </section>

      <section className={sectionClass} aria-labelledby="commute-transit">
        <div className="flex items-center justify-between gap-2">
          <h3 id="commute-transit" className="text-sm font-semibold text-accent">
            Commuting by Public Transport
          </h3>
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <input
              type="checkbox"
              className="h-3.5 w-3.5"
              checked={input.showTransit}
              onChange={(e) => set({ showTransit: e.target.checked })}
            />
            Include
          </label>
        </div>

        {input.showTransit ? (
          <>
            <div>
              <label htmlFor="cm-ticket-mode" className={labelClass}>
                Ticket mode
              </label>
              <FieldShell>
                <select
                  id="cm-ticket-mode"
                  className={`${inputClass} appearance-none`}
                  value={input.ticketMode}
                  onChange={(e) =>
                    set({ ticketMode: e.target.value as TicketMode })
                  }
                >
                  {(Object.keys(TICKET_MODE_LABELS) as TicketMode[]).map(
                    (m) => (
                      <option key={m} value={m}>
                        {TICKET_MODE_LABELS[m]}
                      </option>
                    ),
                  )}
                </select>
              </FieldShell>
            </div>

            <div>
              <label htmlFor="cm-ticket" className={labelClass}>
                Ticket price
                <InfoTooltip
                  label="Ticket price"
                  text="Cost of one ride, day ticket, or pass in the selected currency."
                />
              </label>
              <FieldShell error={errors.ticketPrice}>
                <input
                  id="cm-ticket"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.ticketPrice}
                  onChange={(e) => set({ ticketPrice: e.target.value })}
                />
              </FieldShell>
              {errors.ticketPrice ? (
                <p className="mt-1 text-xs text-rose-600">{errors.ticketPrice}</p>
              ) : null}
            </div>

            {input.ticketMode === 'perRide' ? (
              <div>
                <label htmlFor="cm-rides" className={labelClass}>
                  Paid rides per commute day
                </label>
                <FieldShell error={errors.paidRidesPerDay}>
                  <input
                    id="cm-rides"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.paidRidesPerDay}
                    onChange={(e) => set({ paidRidesPerDay: e.target.value })}
                  />
                </FieldShell>
                {errors.paidRidesPerDay ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.paidRidesPerDay}
                  </p>
                ) : null}
              </div>
            ) : null}

            {input.ticketMode === 'timeBasedPass' ? (
              <div>
                <label htmlFor="cm-valid" className={labelClass}>
                  Ticket is valid for…
                  <InfoTooltip
                    label="Ticket validity"
                    text="Calendar validity of a pass (days/weeks/months), not necessarily the number of commuting days. Pass count uses ~30.4 calendar days per month."
                  />
                </label>
                <div className="flex gap-2">
                  <FieldShell error={errors.ticketValidity}>
                    <input
                      id="cm-valid"
                      className={inputClass}
                      inputMode="decimal"
                      value={input.ticketValidity}
                      onChange={(e) =>
                        set({ ticketValidity: e.target.value })
                      }
                    />
                  </FieldShell>
                  <select
                    className="h-11 w-[100px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                    value={input.ticketValidityUnit}
                    aria-label="Validity unit"
                    onChange={(e) =>
                      set({
                        ticketValidityUnit: e.target
                          .value as TicketValidityUnit,
                      })
                    }
                  >
                    {(
                      Object.keys(VALIDITY_UNIT_LABELS) as TicketValidityUnit[]
                    ).map((u) => (
                      <option key={u} value={u}>
                        {VALIDITY_UNIT_LABELS[u]}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.ticketValidity ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.ticketValidity}
                  </p>
                ) : null}
              </div>
            ) : null}
          </>
        ) : null}
      </section>
    </form>
  );
}
