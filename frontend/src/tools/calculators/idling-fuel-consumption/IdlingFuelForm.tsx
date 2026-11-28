'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertEngineCapacity,
  fromHours,
  fromLph,
  fromPricePerLiter,
  toHours,
  toLph,
  toPricePerLiter,
} from './calculation';
import {
  ENGINE_UNIT_LABELS,
  FUEL_TYPE_LABELS,
  PRICE_UNIT_LABELS,
  RATE_UNIT_LABELS,
  TIME_UNIT_LABELS,
  VOLUME_UNIT_LABELS,
  type EngineCapacityUnit,
  type FuelPriceUnit,
  type FuelRateUnit,
  type FuelType,
  type FuelVolumeUnit,
  type IdlingFieldErrors,
  type IdlingInput,
  type TimeUnit,
  createDieselExample,
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

interface IdlingFuelFormProps {
  input: IdlingInput;
  errors: IdlingFieldErrors;
  onChange: (next: IdlingInput) => void;
}

export function IdlingFuelForm({
  input,
  errors,
  onChange,
}: IdlingFuelFormProps) {
  const set = (patch: Partial<IdlingInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Estimated consumption uses a simplified engine-displacement model.
        Actual fuel use may vary with engine technology, air conditioning,
        temperature, accessories, engine load, and operating conditions.
        Currency labels denomination only — no live FX.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example petrol (2.0 L · 30 min)
        </button>
        <button
          type="button"
          onClick={() => onChange(createDieselExample())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example diesel (2.0 L)
        </button>
      </div>

      <details className="rounded-xl border border-border bg-muted/10" open>
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Idle fuel consumption
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div>
            <label htmlFor="idle-fuel" className={labelClass}>
              Fuel type
              <InfoTooltip
                label="Fuel type"
                text="Petrol uses ≈0.6 L/h per liter of displacement; diesel ≈0.45 L/h per liter. Rough estimates only."
              />
            </label>
            <select
              id="idle-fuel"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
              value={input.fuelType}
              onChange={(e) => set({ fuelType: e.target.value as FuelType })}
            >
              {(Object.keys(FUEL_TYPE_LABELS) as FuelType[]).map((f) => (
                <option key={f} value={f}>
                  {FUEL_TYPE_LABELS[f]}
                </option>
              ))}
            </select>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              checked={input.useCustomConsumption}
              onChange={(e) =>
                set({ useCustomConsumption: e.target.checked })
              }
            />
            Use a custom measured idling rate
            <InfoTooltip
              label="Custom rate"
              text="Override the displacement estimate with a measured L/h (or gal/h) rate from telemetry or testing."
            />
          </label>

          {!input.useCustomConsumption ? (
            <div>
              <label htmlFor="idle-eng" className={labelClass}>
                Engine capacity
                <InfoTooltip
                  label="Engine capacity"
                  text="Engine displacement. 1 L = 1000 cm³; 1 in³ ≈ 0.016387 L."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.engineCapacity}>
                  <input
                    id="idle-eng"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.engineCapacity}
                    aria-invalid={Boolean(errors.engineCapacity)}
                    onChange={(e) => set({ engineCapacity: e.target.value })}
                  />
                </FieldShell>
                <select
                  className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                  value={input.engineUnit}
                  aria-label="Engine capacity unit"
                  onChange={(e) => {
                    const next = e.target.value as EngineCapacityUnit;
                    const n = Number(input.engineCapacity.replace(/,/g, ''));
                    if (Number.isFinite(n) && n > 0) {
                      set({
                        engineUnit: next,
                        engineCapacity: String(
                          Number(
                            convertEngineCapacity(
                              n,
                              input.engineUnit,
                              next,
                            ).toPrecision(12),
                          ),
                        ),
                      });
                    } else {
                      set({ engineUnit: next });
                    }
                  }}
                >
                  {(
                    Object.keys(ENGINE_UNIT_LABELS) as EngineCapacityUnit[]
                  ).map((u) => (
                    <option key={u} value={u}>
                      {ENGINE_UNIT_LABELS[u]}
                    </option>
                  ))}
                </select>
              </div>
              {errors.engineCapacity ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.engineCapacity}
                </p>
              ) : null}
            </div>
          ) : (
            <div>
              <label htmlFor="idle-custom" className={labelClass}>
                Custom idling fuel consumption
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.customConsumptionRate}>
                  <input
                    id="idle-custom"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.customConsumptionRate}
                    aria-invalid={Boolean(errors.customConsumptionRate)}
                    onChange={(e) =>
                      set({ customConsumptionRate: e.target.value })
                    }
                  />
                </FieldShell>
                <select
                  className="h-11 w-[120px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                  value={input.customRateUnit}
                  aria-label="Custom rate unit"
                  onChange={(e) => {
                    const next = e.target.value as FuelRateUnit;
                    const n = Number(
                      input.customConsumptionRate.replace(/,/g, ''),
                    );
                    if (Number.isFinite(n) && n >= 0) {
                      set({
                        customRateUnit: next,
                        customConsumptionRate: String(
                          Number(
                            fromLph(
                              toLph(n, input.customRateUnit),
                              next,
                            ).toPrecision(12),
                          ),
                        ),
                      });
                    } else {
                      set({ customRateUnit: next });
                    }
                  }}
                >
                  {(Object.keys(RATE_UNIT_LABELS) as FuelRateUnit[]).map(
                    (u) => (
                      <option key={u} value={u}>
                        {RATE_UNIT_LABELS[u]}
                      </option>
                    ),
                  )}
                </select>
              </div>
              {errors.customConsumptionRate ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.customConsumptionRate}
                </p>
              ) : null}
            </div>
          )}

          <div>
            <label htmlFor="idle-rate-unit" className={labelClass}>
              Idling fuel consumption display unit
              <InfoTooltip
                label="Idling fuel consumption"
                text="Estimated or custom hourly fuel burn while the engine idles."
              />
            </label>
            <select
              id="idle-rate-unit"
              className="h-11 w-full max-w-[160px] rounded-lg border border-border bg-white px-3 text-sm"
              value={input.rateDisplayUnit}
              onChange={(e) =>
                set({ rateDisplayUnit: e.target.value as FuelRateUnit })
              }
            >
              {(Object.keys(RATE_UNIT_LABELS) as FuelRateUnit[]).map((u) => (
                <option key={u} value={u}>
                  {RATE_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </details>

      <details className="rounded-xl border border-border bg-muted/10" open>
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Idling fuel consumed and cost
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div>
            <label htmlFor="idle-time" className={labelClass}>
              Idling time
              <InfoTooltip
                label="Idling time"
                text="Duration the engine runs without propelling the vehicle. Normalized to hours for calculation."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.idlingTime}>
                <input
                  id="idle-time"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.idlingTime}
                  aria-invalid={Boolean(errors.idlingTime)}
                  onChange={(e) => set({ idlingTime: e.target.value })}
                />
              </FieldShell>
              <select
                className="h-11 w-[80px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                value={input.timeUnit}
                aria-label="Time unit"
                onChange={(e) => {
                  const next = e.target.value as TimeUnit;
                  const n = Number(input.idlingTime.replace(/,/g, ''));
                  if (Number.isFinite(n) && n >= 0) {
                    set({
                      timeUnit: next,
                      idlingTime: String(
                        Number(
                          fromHours(
                            toHours(n, input.timeUnit),
                            next,
                          ).toPrecision(12),
                        ),
                      ),
                    });
                  } else {
                    set({ timeUnit: next });
                  }
                }}
              >
                {(Object.keys(TIME_UNIT_LABELS) as TimeUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {TIME_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </div>
            {errors.idlingTime ? (
              <p className="mt-1 text-xs text-rose-600">{errors.idlingTime}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="idle-vol-unit" className={labelClass}>
              Fuel consumed display unit
            </label>
            <select
              id="idle-vol-unit"
              className="h-11 w-full max-w-[160px] rounded-lg border border-border bg-white px-3 text-sm"
              value={input.fuelConsumedUnit}
              onChange={(e) =>
                set({ fuelConsumedUnit: e.target.value as FuelVolumeUnit })
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

          <div>
            <span className={labelClass}>Currency</span>
            <div className="w-full max-w-[160px]">
              <CurrencySelect
                id="idle-currency"
                value={input.currency}
                onChange={(currency: SupportedCurrency) => set({ currency })}
                aria-label="Display currency"
              />
            </div>
          </div>

          <div>
            <label htmlFor="idle-price" className={labelClass}>
              Fuel price
              <InfoTooltip
                label="Fuel price"
                text="Pump price in the selected currency. Switching volume units converts the number; switching currency does not convert money."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.fuelPrice}>
                <input
                  id="idle-price"
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
                onChange={(e) => {
                  const next = e.target.value as FuelPriceUnit;
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
              <p className="mt-1 text-xs text-rose-600">{errors.fuelPrice}</p>
            ) : null}
          </div>
        </div>
      </details>

      <details className="rounded-xl border border-border bg-muted/10">
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Advanced options
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <label className="inline-flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              checked={input.showLongTerm}
              onChange={(e) => set({ showLongTerm: e.target.checked })}
            />
            Estimate long-term idling costs
          </label>
          {input.showLongTerm ? (
            <div>
              <label htmlFor="idle-days" className={labelClass}>
                Idling days per week
                <InfoTooltip
                  label="Long-term"
                  text="Uses this session’s idling duration as daily hours. Annual uses 365.2425/7 weeks; monthly = annual/12."
                />
              </label>
              <FieldShell error={errors.daysPerWeek}>
                <input
                  id="idle-days"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.daysPerWeek}
                  aria-invalid={Boolean(errors.daysPerWeek)}
                  onChange={(e) => set({ daysPerWeek: e.target.value })}
                />
              </FieldShell>
              {errors.daysPerWeek ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.daysPerWeek}
                </p>
              ) : null}
            </div>
          ) : null}

          <label className="inline-flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              checked={input.showCo2}
              onChange={(e) => set({ showCo2: e.target.checked })}
            />
            Estimate direct CO₂ (tank-to-wheel)
            <InfoTooltip
              label="CO₂"
              text="Approximate direct combustion factors (~2.31 kg/L petrol, ~2.68 kg/L diesel). Not a lifecycle inventory."
            />
          </label>
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
