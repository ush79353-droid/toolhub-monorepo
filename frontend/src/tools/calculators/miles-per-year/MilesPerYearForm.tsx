'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertDistance,
  convertPeriodDistancePreservingAnnual,
  fromPricePerLiter,
  toPricePerLiter,
} from './calculation';
import {
  DISTANCE_UNIT_LABELS,
  EFFICIENCY_UNIT_LABELS,
  PERIOD_LABELS,
  PERIOD_QUESTION,
  PRICE_UNIT_LABELS,
  type CalcMode,
  type DistanceUnit,
  type FuelEfficiencyUnit,
  type FuelPriceUnit,
  type MileagePeriod,
  type MilesPerYearFieldErrors,
  type MilesPerYearInput,
  createDailyExample,
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

interface MilesPerYearFormProps {
  input: MilesPerYearInput;
  errors: MilesPerYearFieldErrors;
  onChange: (next: MilesPerYearInput) => void;
}

export function MilesPerYearForm({
  input,
  errors,
  onChange,
}: MilesPerYearFormProps) {
  const set = (patch: Partial<MilesPerYearInput>) =>
    onChange({ ...input, ...patch });

  const changePeriod = (next: MileagePeriod) => {
    const n = Number(input.distance.replace(/,/g, ''));
    if (Number.isFinite(n) && n >= 0) {
      set({
        period: next,
        distance: String(
          Number(
            convertPeriodDistancePreservingAnnual(
              n,
              input.period,
              next,
            ).toPrecision(12),
          ),
        ),
      });
      return;
    }
    set({ period: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Annualize a typical day (×365), week (×365/7), month (×12), or year
        (×1). Changing the period keeps the same estimated annual distance.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (1,000 mi/month)
        </button>
        <button
          type="button"
          onClick={() => onChange(createDailyExample())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (30 mi/day)
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {(['period', 'commute'] as CalcMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => set({ mode: m })}
            className={`rounded-lg border px-2 py-2 text-xs font-medium ${
              input.mode === m
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-white text-accent hover:bg-muted/30'
            }`}
          >
            {m === 'period' ? 'Simple period' : 'Driving schedule'}
          </button>
        ))}
      </div>

      {input.mode === 'period' ? (
        <>
          <div>
            <label htmlFor="mpy-period" className={labelClass}>
              I know how much I travel…
              <InfoTooltip
                label="Measurement period"
                text="Choose the period that matches your known distance. Day uses 365; week uses 365/7; month uses 12."
              />
            </label>
            <select
              id="mpy-period"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
              value={input.period}
              onChange={(e) =>
                changePeriod(e.target.value as MileagePeriod)
              }
            >
              {(Object.keys(PERIOD_LABELS) as MileagePeriod[]).map((p) => (
                <option key={p} value={p}>
                  {PERIOD_LABELS[p]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="mpy-dist" className={labelClass}>
              {PERIOD_QUESTION[input.period]}
              <InfoTooltip
                label="Distance"
                text="Distance driven in the selected period. 1 mi = 1.609344 km."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.distance}>
                <input
                  id="mpy-dist"
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
                onChange={(e) => {
                  const next = e.target.value as DistanceUnit;
                  const n = Number(input.distance.replace(/,/g, ''));
                  if (Number.isFinite(n) && n >= 0) {
                    set({
                      distanceUnit: next,
                      distance: String(
                        Number(
                          convertDistance(
                            n,
                            input.distanceUnit,
                            next,
                          ).toPrecision(12),
                        ),
                      ),
                    });
                  } else {
                    set({ distanceUnit: next });
                  }
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
            {errors.distance ? (
              <p className="mt-1 text-xs text-rose-600">{errors.distance}</p>
            ) : null}
          </div>
        </>
      ) : (
        <details className="rounded-xl border border-border bg-muted/10" open>
          <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
            Calculate mileage using your driving schedule
          </summary>
          <div className="space-y-3 border-t border-border px-3.5 py-3">
            <div>
              <label htmlFor="mpy-oneway" className={labelClass}>
                One-way commuting distance
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.oneWayCommute}>
                  <input
                    id="mpy-oneway"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.oneWayCommute}
                    onChange={(e) => set({ oneWayCommute: e.target.value })}
                  />
                </FieldShell>
                <select
                  className="h-11 w-[72px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                  value={input.commuteUnit}
                  aria-label="Commute unit"
                  onChange={(e) => {
                    const next = e.target.value as DistanceUnit;
                    const n = Number(input.oneWayCommute.replace(/,/g, ''));
                    const add = Number(input.additionalWeekly.replace(/,/g, ''));
                    const patch: Partial<MilesPerYearInput> = {
                      commuteUnit: next,
                    };
                    if (Number.isFinite(n) && n >= 0) {
                      patch.oneWayCommute = String(
                        Number(
                          convertDistance(n, input.commuteUnit, next).toPrecision(
                            12,
                          ),
                        ),
                      );
                    }
                    if (Number.isFinite(add) && add >= 0) {
                      patch.additionalWeekly = String(
                        Number(
                          convertDistance(
                            add,
                            input.commuteUnit,
                            next,
                          ).toPrecision(12),
                        ),
                      );
                    }
                    set(patch);
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
              {errors.oneWayCommute ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.oneWayCommute}
                </p>
              ) : null}
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-accent">
              <input
                type="checkbox"
                checked={input.isRoundTrip}
                onChange={(e) => set({ isRoundTrip: e.target.checked })}
              />
              Round trip (×2)
            </label>
            <div>
              <label htmlFor="mpy-days" className={labelClass}>
                Commuting days per week
              </label>
              <FieldShell error={errors.daysPerWeek}>
                <input
                  id="mpy-days"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.daysPerWeek}
                  onChange={(e) => set({ daysPerWeek: e.target.value })}
                />
              </FieldShell>
              {errors.daysPerWeek ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.daysPerWeek}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="mpy-weeks" className={labelClass}>
                Commuting weeks per year
              </label>
              <FieldShell error={errors.weeksPerYear}>
                <input
                  id="mpy-weeks"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.weeksPerYear}
                  onChange={(e) => set({ weeksPerYear: e.target.value })}
                />
              </FieldShell>
              {errors.weeksPerYear ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.weeksPerYear}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="mpy-add" className={labelClass}>
                Additional personal driving per week
              </label>
              <FieldShell error={errors.additionalWeekly}>
                <input
                  id="mpy-add"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.additionalWeekly}
                  onChange={(e) => set({ additionalWeekly: e.target.value })}
                />
              </FieldShell>
              {errors.additionalWeekly ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.additionalWeekly}
                </p>
              ) : null}
            </div>
          </div>
        </details>
      )}

      <div>
        <label htmlFor="mpy-out" className={labelClass}>
          Miles per year display unit
          <InfoTooltip
            label="Annual mileage"
            text="Estimated annual distance in mi/year or km/year."
          />
        </label>
        <select
          id="mpy-out"
          className="h-11 w-full max-w-[120px] rounded-lg border border-border bg-white px-3 text-sm"
          value={input.outputUnit}
          onChange={(e) =>
            set({ outputUnit: e.target.value as DistanceUnit })
          }
        >
          {(Object.keys(DISTANCE_UNIT_LABELS) as DistanceUnit[]).map((u) => (
            <option key={u} value={u}>
              {DISTANCE_UNIT_LABELS[u]}/year
            </option>
          ))}
        </select>
      </div>

      <details className="rounded-xl border border-border bg-muted/10">
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Estimate annual driving costs
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <label className="inline-flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              checked={input.showFuelCost}
              onChange={(e) => set({ showFuelCost: e.target.checked })}
            />
            Enable fuel cost estimate
          </label>
          {input.showFuelCost ? (
            <>
              <div>
                <span className={labelClass}>Currency</span>
                <div className="max-w-[160px]">
                  <CurrencySelect
                    id="mpy-currency"
                    value={input.currency}
                    onChange={(currency: SupportedCurrency) =>
                      set({ currency })
                    }
                    aria-label="Display currency"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="mpy-eff" className={labelClass}>
                  Fuel efficiency
                </label>
                <div className="flex gap-2">
                  <FieldShell error={errors.fuelEfficiency}>
                    <input
                      id="mpy-eff"
                      className={inputClass}
                      inputMode="decimal"
                      value={input.fuelEfficiency}
                      onChange={(e) =>
                        set({ fuelEfficiency: e.target.value })
                      }
                    />
                  </FieldShell>
                  <select
                    className="h-11 w-[110px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                    value={input.fuelEfficiencyUnit}
                    onChange={(e) =>
                      set({
                        fuelEfficiencyUnit: e.target
                          .value as FuelEfficiencyUnit,
                      })
                    }
                  >
                    {(
                      Object.keys(
                        EFFICIENCY_UNIT_LABELS,
                      ) as FuelEfficiencyUnit[]
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
                <label htmlFor="mpy-price" className={labelClass}>
                  Fuel price
                </label>
                <div className="flex gap-2">
                  <FieldShell error={errors.fuelPrice}>
                    <input
                      id="mpy-price"
                      className={inputClass}
                      inputMode="decimal"
                      value={input.fuelPrice}
                      onChange={(e) => set({ fuelPrice: e.target.value })}
                    />
                  </FieldShell>
                  <select
                    className="h-11 w-[110px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                    value={input.fuelPriceUnit}
                    onChange={(e) => {
                      const next = e.target.value as FuelPriceUnit;
                      const n = Number(input.fuelPrice.replace(/,/g, ''));
                      if (Number.isFinite(n) && n >= 0) {
                        const ppl = toPricePerLiter(n, input.fuelPriceUnit);
                        if (ppl != null) {
                          set({
                            fuelPriceUnit: next,
                            fuelPrice: String(
                              Number(
                                fromPricePerLiter(ppl, next).toPrecision(12),
                              ),
                            ),
                          });
                          return;
                        }
                      }
                      set({ fuelPriceUnit: next });
                    }}
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
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.fuelPrice}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </details>

      <details className="rounded-xl border border-border bg-muted/10">
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Mileage projection
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <label className="inline-flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              checked={input.showProjection}
              onChange={(e) => set({ showProjection: e.target.checked })}
            />
            Project future odometer
          </label>
          {input.showProjection ? (
            <>
              <div>
                <label htmlFor="mpy-odo" className={labelClass}>
                  Current odometer
                </label>
                <div className="flex gap-2">
                  <FieldShell error={errors.currentOdometer}>
                    <input
                      id="mpy-odo"
                      className={inputClass}
                      inputMode="decimal"
                      value={input.currentOdometer}
                      onChange={(e) =>
                        set({ currentOdometer: e.target.value })
                      }
                    />
                  </FieldShell>
                  <select
                    className="h-11 w-[72px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                    value={input.odometerUnit}
                    onChange={(e) => {
                      const next = e.target.value as DistanceUnit;
                      const n = Number(
                        input.currentOdometer.replace(/,/g, ''),
                      );
                      if (Number.isFinite(n) && n >= 0) {
                        set({
                          odometerUnit: next,
                          currentOdometer: String(
                            Number(
                              convertDistance(
                                n,
                                input.odometerUnit,
                                next,
                              ).toPrecision(12),
                            ),
                          ),
                        });
                      } else {
                        set({ odometerUnit: next });
                      }
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
                {errors.currentOdometer ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.currentOdometer}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="mpy-years" className={labelClass}>
                  Projection years
                </label>
                <FieldShell error={errors.projectionYears}>
                  <input
                    id="mpy-years"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.projectionYears}
                    onChange={(e) =>
                      set({ projectionYears: e.target.value })
                    }
                  />
                </FieldShell>
                {errors.projectionYears ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.projectionYears}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}
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
