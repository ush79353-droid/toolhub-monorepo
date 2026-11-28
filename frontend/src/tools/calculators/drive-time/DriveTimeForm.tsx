'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  breakToHours,
  fromKm,
  fromKmh,
  fromLPer100Km,
  hoursToBreak,
  toKm,
  toKmh,
  toLPer100Km,
  toPricePerLiter,
} from './calculation';
import {
  BREAK_UNIT_LABELS,
  DISTANCE_UNIT_LABELS,
  EFFICIENCY_UNIT_LABELS,
  PRICE_UNIT_LABELS,
  SPEED_UNIT_LABELS,
  type BreakUnit,
  type DistanceUnit,
  type DriveTimeFieldErrors,
  type DriveTimeInput,
  type FuelEfficiencyUnit,
  type FuelPriceUnit,
  type ScheduleMode,
  type SpeedUnit,
  createExampleInput,
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

interface DriveTimeFormProps {
  input: DriveTimeInput;
  errors: DriveTimeFieldErrors;
  onChange: (next: DriveTimeInput) => void;
}

export function DriveTimeForm({
  input,
  errors,
  onChange,
}: DriveTimeFormProps) {
  const set = (patch: Partial<DriveTimeInput>) =>
    onChange({ ...input, ...patch });

  const changeDistanceUnit = (next: DistanceUnit) => {
    const n = Number(input.distance.replace(/,/g, ''));
    if (Number.isFinite(n) && n >= 0) {
      const km = toKm(n, input.distanceUnit);
      set({
        distanceUnit: next,
        distance: String(Number(fromKm(km, next).toPrecision(12))),
      });
      return;
    }
    set({ distanceUnit: next });
  };

  const changeSpeedUnit = (next: SpeedUnit) => {
    const n = Number(input.averageSpeed.replace(/,/g, ''));
    if (Number.isFinite(n) && n >= 0) {
      const kmh = toKmh(n, input.speedUnit);
      set({
        speedUnit: next,
        averageSpeed: String(Number(fromKmh(kmh, next).toPrecision(12))),
      });
      return;
    }
    set({ speedUnit: next });
  };

  const changeBreakUnit = (next: BreakUnit) => {
    const n = Number(input.breakDuration.replace(/,/g, ''));
    if (Number.isFinite(n) && n >= 0) {
      const h = breakToHours(n, input.breakUnit);
      set({
        breakUnit: next,
        breakDuration: String(Number(hoursToBreak(h, next).toPrecision(12))),
      });
      return;
    }
    set({ breakUnit: next });
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
        let display = ppl;
        if (next === 'perGalUS') display = ppl * 3.785411784;
        if (next === 'perGalUK') display = ppl * 4.54609;
        set({
          fuelPriceUnit: next,
          fuelPrice: String(Number(display.toPrecision(12))),
        });
        return;
      }
    }
    set({ fuelPriceUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Estimate trip duration and costs from distance, average speed, breaks,
        and fuel economy. Currency labels denomination only — no live FX or
        traffic data.
      </p>

      <button
        type="button"
        onClick={() => onChange(createExampleInput())}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (300 km · 60 km/h · 45 min · PKR)
      </button>

      <details
        className="rounded-xl border border-border bg-muted/10"
        open
      >
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Time
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div>
            <label htmlFor="dt-dist" className={labelClass}>
              Distance
              <InfoTooltip
                label="Distance"
                text="One-way trip distance. Convert freely among km, mi, m, and ft."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.distance}>
                <input
                  id="dt-dist"
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
            {errors.distance ? (
              <p className="mt-1 text-xs text-rose-600">{errors.distance}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="dt-speed" className={labelClass}>
              Average speed
              <InfoTooltip
                label="Average speed"
                text="Overall average including slower segments — not instantaneous cruise. Must be &gt; 0 when distance &gt; 0."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.averageSpeed}>
                <input
                  id="dt-speed"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.averageSpeed}
                  aria-invalid={Boolean(errors.averageSpeed)}
                  onChange={(e) => set({ averageSpeed: e.target.value })}
                />
              </FieldShell>
              <select
                className="h-11 w-[80px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                value={input.speedUnit}
                aria-label="Speed unit"
                onChange={(e) =>
                  changeSpeedUnit(e.target.value as SpeedUnit)
                }
              >
                {(Object.keys(SPEED_UNIT_LABELS) as SpeedUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {SPEED_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </div>
            {errors.averageSpeed ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.averageSpeed}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="dt-break" className={labelClass}>
              Total time of breaks
              <InfoTooltip
                label="Breaks"
                text="Sum of rest stops added to driving time for total trip duration and schedule."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.breakDuration}>
                <input
                  id="dt-break"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.breakDuration}
                  aria-invalid={Boolean(errors.breakDuration)}
                  onChange={(e) => set({ breakDuration: e.target.value })}
                />
              </FieldShell>
              <select
                className="h-11 w-[100px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                value={input.breakUnit}
                aria-label="Break duration unit"
                onChange={(e) =>
                  changeBreakUnit(e.target.value as BreakUnit)
                }
              >
                {(Object.keys(BREAK_UNIT_LABELS) as BreakUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {BREAK_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </div>
            {errors.breakDuration ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.breakDuration}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="dt-sched" className={labelClass}>
              Schedule
            </label>
            <FieldShell>
              <select
                id="dt-sched"
                className={`${inputClass} appearance-none`}
                value={input.scheduleMode}
                onChange={(e) =>
                  set({ scheduleMode: e.target.value as ScheduleMode })
                }
              >
                <option value="arrivalFromDeparture">
                  Calculate arrival from departure
                </option>
                <option value="departureFromArrival">
                  Calculate departure from arrival
                </option>
              </select>
            </FieldShell>
          </div>

          {input.scheduleMode === 'arrivalFromDeparture' ? (
            <div>
              <label htmlFor="dt-dep" className={labelClass}>
                Departure time
                <InfoTooltip
                  label="Departure"
                  text="Local start date/time. Arrival = departure + total trip duration (elapsed time)."
                />
              </label>
              <FieldShell error={errors.departureLocal}>
                <input
                  id="dt-dep"
                  type="datetime-local"
                  className={inputClass}
                  value={input.departureLocal}
                  aria-invalid={Boolean(errors.departureLocal)}
                  onChange={(e) => set({ departureLocal: e.target.value })}
                />
              </FieldShell>
              {errors.departureLocal ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.departureLocal}
                </p>
              ) : null}
            </div>
          ) : (
            <div>
              <label htmlFor="dt-arr" className={labelClass}>
                Desired arrival time
                <InfoTooltip
                  label="Arrival"
                  text="Target arrival. Required departure = arrival − total trip duration."
                />
              </label>
              <FieldShell error={errors.arrivalLocal}>
                <input
                  id="dt-arr"
                  type="datetime-local"
                  className={inputClass}
                  value={input.arrivalLocal}
                  aria-invalid={Boolean(errors.arrivalLocal)}
                  onChange={(e) => set({ arrivalLocal: e.target.value })}
                />
              </FieldShell>
              {errors.arrivalLocal ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.arrivalLocal}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/10"
        open
      >
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Money
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div>
            <label htmlFor="dt-eff" className={labelClass}>
              Fuel efficiency
              <InfoTooltip
                label="Fuel efficiency"
                text="Lower L/100 km is better; higher km/L or mpg is better. Preserved physically when changing units."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.fuelEfficiency}>
                <input
                  id="dt-eff"
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
                id="dt-currency"
                value={input.currency}
                onChange={(currency: SupportedCurrency) => set({ currency })}
                aria-label="Display currency"
              />
            </div>
          </div>

          <div>
            <label htmlFor="dt-price" className={labelClass}>
              Fuel price
              <InfoTooltip
                label="Fuel price"
                text="Price per liter or gallon in the selected currency denomination (no automatic FX)."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.fuelPrice}>
                <input
                  id="dt-price"
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
                aria-label="Fuel price unit"
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
            <label htmlFor="dt-pass" className={labelClass}>
              Number of passengers
              <InfoTooltip
                label="Passengers"
                text="People sharing total trip cost (including the driver when splitting equally). Integer ≥ 1."
              />
            </label>
            <FieldShell error={errors.passengers}>
              <input
                id="dt-pass"
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

          <details className="rounded-lg border border-border bg-white">
            <summary className="cursor-pointer px-3 py-2.5 text-[13px] font-medium text-accent">
              Additional expenses
            </summary>
            <div className="space-y-3 border-t border-border px-3 py-3">
              {(
                [
                  ['parkingCost', 'Parking', errors.parkingCost],
                  ['tollCost', 'Tolls', errors.tollCost],
                  ['otherExpenses', 'Other expenses', errors.otherExpenses],
                ] as const
              ).map(([key, label, err]) => (
                <div key={key}>
                  <label htmlFor={`dt-${key}`} className={labelClass}>
                    {label}
                  </label>
                  <FieldShell error={err}>
                    <input
                      id={`dt-${key}`}
                      className={inputClass}
                      inputMode="decimal"
                      value={input[key]}
                      aria-invalid={Boolean(err)}
                      onChange={(e) => set({ [key]: e.target.value })}
                    />
                  </FieldShell>
                  {err ? (
                    <p className="mt-1 text-xs text-rose-600">{err}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </details>
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
