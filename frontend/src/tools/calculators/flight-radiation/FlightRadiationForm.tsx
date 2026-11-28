'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  fromHours,
  fromUSvPerHour,
  toHours,
  toUSvPerHour,
} from './calculation';
import {
  DOSE_RATE_UNIT_LABELS,
  DOSE_UNIT_LABELS,
  TIME_UNIT_LABELS,
  type DoseRateUnit,
  type FlightRadiationFieldErrors,
  type FlightRadiationInput,
  type RadiationDoseUnit,
  type TimeUnit,
  createEmptyInput,
  createExampleLongHaul,
  createExampleShortFlight,
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

interface FlightRadiationFormProps {
  input: FlightRadiationInput;
  errors: FlightRadiationFieldErrors;
  onChange: (next: FlightRadiationInput) => void;
}

export function FlightRadiationForm({
  input,
  errors,
  onChange,
}: FlightRadiationFormProps) {
  const set = (patch: Partial<FlightRadiationInput>) =>
    onChange({ ...input, ...patch });

  const changeTimeUnit = (next: TimeUnit) => {
    const n = Number(input.flightDuration.replace(/,/g, ''));
    if (Number.isFinite(n) && n >= 0) {
      const h = toHours(n, input.flightDurationUnit);
      set({
        flightDurationUnit: next,
        flightDuration: String(Number(fromHours(h, next).toPrecision(12))),
      });
      return;
    }
    set({ flightDurationUnit: next });
  };

  const changeRateUnit = (next: DoseRateUnit) => {
    const n = Number(input.doseRate.replace(/,/g, ''));
    if (Number.isFinite(n) && n >= 0) {
      const u = toUSvPerHour(n, input.doseRateUnit);
      set({
        doseRateUnit: next,
        doseRate: String(Number(fromUSvPerHour(u, next).toPrecision(12))),
      });
      return;
    }
    set({ doseRateUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Estimate cosmic radiation with{' '}
        <strong className="text-accent">Dose = Dose rate × Flight time</strong>.
        Default {input.doseRate} {input.doseRateUnit} is an illustrative cruise
        average — not a universal flight rate. Real exposure varies with
        altitude, latitude, route, and solar activity.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createExampleShortFlight())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example 3 h
        </button>
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example 8 h
        </button>
        <button
          type="button"
          onClick={() => onChange(createExampleLongHaul())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example 12 h
        </button>
      </div>

      <div>
        <label htmlFor="fr-time" className={labelClass}>
          Time of flight
          <InfoTooltip
            label="Time of flight"
            text="Duration of exposure at the assumed average dose rate. Convert freely among seconds, minutes, hours, and days."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.flightDuration}>
            <input
              id="fr-time"
              className={inputClass}
              inputMode="decimal"
              value={input.flightDuration}
              aria-invalid={Boolean(errors.flightDuration)}
              onChange={(e) => set({ flightDuration: e.target.value })}
            />
          </FieldShell>
          <select
            className="h-11 w-[72px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
            value={input.flightDurationUnit}
            aria-label="Flight duration unit"
            onChange={(e) => changeTimeUnit(e.target.value as TimeUnit)}
          >
            {(Object.keys(TIME_UNIT_LABELS) as TimeUnit[]).map((u) => (
              <option key={u} value={u}>
                {TIME_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
        {errors.flightDuration ? (
          <p className="mt-1 text-xs text-rose-600">{errors.flightDuration}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="fr-rate" className={labelClass}>
          Dose rate
          <InfoTooltip
            label="Dose rate"
            text="Average effective dose per hour during the flight. Default 0.003 mSv/h (3 µSv/h) is illustrative only — replace with a route-specific estimate when you have one."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.doseRate}>
            <input
              id="fr-rate"
              className={inputClass}
              inputMode="decimal"
              value={input.doseRate}
              aria-invalid={Boolean(errors.doseRate)}
              onChange={(e) => set({ doseRate: e.target.value })}
            />
          </FieldShell>
          <select
            className="h-11 w-[100px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
            value={input.doseRateUnit}
            aria-label="Dose rate unit"
            onChange={(e) => changeRateUnit(e.target.value as DoseRateUnit)}
          >
            {(Object.keys(DOSE_RATE_UNIT_LABELS) as DoseRateUnit[]).map((u) => (
              <option key={u} value={u}>
                {DOSE_RATE_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
        {errors.doseRate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.doseRate}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="fr-dose-unit" className={labelClass}>
          Dose (result unit)
          <InfoTooltip
            label="Radiation dose"
            text="Estimated effective dose for the flight(s). Switch among µSv, mSv, Sv, mrem, and rem. Not the same as absorbed dose in gray (Gy)."
          />
        </label>
        <select
          id="fr-dose-unit"
          className="h-11 w-full max-w-[160px] rounded-lg border border-border bg-white px-3 text-sm"
          value={input.doseUnit}
          onChange={(e) =>
            set({ doseUnit: e.target.value as RadiationDoseUnit })
          }
        >
          {(Object.keys(DOSE_UNIT_LABELS) as RadiationDoseUnit[]).map((u) => (
            <option key={u} value={u}>
              {DOSE_UNIT_LABELS[u]}
            </option>
          ))}
        </select>
      </div>

      <details className="rounded-xl border border-border bg-muted/10">
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Multiple flights (optional)
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div>
            <label htmlFor="fr-flights" className={labelClass}>
              Number of flights
              <InfoTooltip
                label="Number of flights"
                text="Whole number of identical flights for a cumulative estimate. Real flights often differ in rate and duration."
              />
            </label>
            <FieldShell error={errors.numberOfFlights}>
              <input
                id="fr-flights"
                className={inputClass}
                inputMode="numeric"
                value={input.numberOfFlights}
                aria-invalid={Boolean(errors.numberOfFlights)}
                onChange={(e) => set({ numberOfFlights: e.target.value })}
              />
            </FieldShell>
            {errors.numberOfFlights ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.numberOfFlights}
              </p>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            Cumulative dose = dose per flight × number of flights. Altitude and
            latitude inputs are omitted here — no invented route-specific model.
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
