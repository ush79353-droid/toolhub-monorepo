'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertDuration,
  convertLongValidity,
  convertShortValidity,
  generateTravelSchedule,
  toDays,
} from './calculation';
import {
  DURATION_LABELS,
  FREQUENCY_LABELS,
  LONG_VALIDITY_LABELS,
  SHORT_VALIDITY_LABELS,
  createEmptyInput,
  type DurationUnit,
  type FrequencyUnit,
  type LongValidityUnit,
  type ShortValidityUnit,
  type TicketOptimizerFieldErrors,
  type TicketOptimizerInput,
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

interface TicketOptimizerFormProps {
  input: TicketOptimizerInput;
  errors: TicketOptimizerFieldErrors;
  onChange: (next: TicketOptimizerInput) => void;
}

function previewTrips(input: TicketOptimizerInput): number | null {
  const trips = Number(input.trips.replace(/,/g, ''));
  const dur = Number(input.travelDuration.replace(/,/g, ''));
  if (
    !Number.isFinite(trips) ||
    !Number.isInteger(trips) ||
    trips < 0 ||
    !Number.isFinite(dur) ||
    dur <= 0
  ) {
    return null;
  }
  return generateTravelSchedule(
    trips,
    input.frequencyUnit,
    dur,
    input.travelDurationUnit,
  ).timestampsHours.length;
}

export function TicketOptimizerForm({
  input,
  errors,
  onChange,
}: TicketOptimizerFormProps) {
  const set = (patch: Partial<TicketOptimizerInput>) =>
    onChange({ ...input, ...patch });

  const totalPreview = previewTrips(input);

  const changeDurationUnit = (next: DurationUnit) => {
    const n = Number(input.travelDuration.replace(/,/g, ''));
    if (Number.isFinite(n) && n > 0) {
      set({
        travelDurationUnit: next,
        travelDuration: String(
          Number(
            convertDuration(n, input.travelDurationUnit, next).toPrecision(12),
          ),
        ),
      });
      return;
    }
    set({ travelDurationUnit: next });
  };

  const changeShortUnit = (next: ShortValidityUnit) => {
    const n = Number(input.shortTermValidity.replace(/,/g, ''));
    if (Number.isFinite(n) && n > 0) {
      set({
        shortTermValidityUnit: next,
        shortTermValidity: String(
          Number(
            convertShortValidity(
              n,
              input.shortTermValidityUnit,
              next,
            ).toPrecision(12),
          ),
        ),
      });
      return;
    }
    set({ shortTermValidityUnit: next });
  };

  const changeLongUnit = (next: LongValidityUnit) => {
    const n = Number(input.longTermValidity.replace(/,/g, ''));
    if (Number.isFinite(n) && n > 0) {
      set({
        longTermValidityUnit: next,
        longTermValidity: String(
          Number(
            convertLongValidity(
              n,
              input.longTermValidityUnit,
              next,
            ).toPrecision(12),
          ),
        ),
      });
      return;
    }
    set({ longTermValidityUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Find the cheapest mix of single tickets and travel passes for an
        assumed schedule from your trip frequency and duration. Currency
        changes denomination only (no live FX). Passes are treated as
        unlimited travel during their validity window.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (2/day · 10 days · short pass)
        </button>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">
          Your transport needs
        </h3>

        <div>
          <label htmlFor="to-trips" className={labelClass}>
            Trips
            <InfoTooltip
              label="Trip frequency"
              text="How many journeys you take per day or per week. Must be a whole number."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.trips}>
              <input
                id="to-trips"
                className={inputClass}
                inputMode="numeric"
                value={input.trips}
                onChange={(e) => set({ trips: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[120px] shrink-0 rounded-lg border border-border bg-white px-2 text-xs"
              value={input.frequencyUnit}
              aria-label="Trip frequency unit"
              onChange={(e) =>
                set({ frequencyUnit: e.target.value as FrequencyUnit })
              }
            >
              {(Object.keys(FREQUENCY_LABELS) as FrequencyUnit[]).map((u) => (
                <option key={u} value={u}>
                  {FREQUENCY_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
          {errors.trips ? (
            <p className="mt-1 text-xs text-rose-600">{errors.trips}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="to-duration" className={labelClass}>
            I need tickets for
            <InfoTooltip
              label="Travel duration"
              text="How long you need coverage. Weeks convert as 7 days each."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.travelDuration}>
              <input
                id="to-duration"
                className={inputClass}
                inputMode="decimal"
                value={input.travelDuration}
                onChange={(e) => set({ travelDuration: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[120px] shrink-0 rounded-lg border border-border bg-white px-2 text-xs"
              value={input.travelDurationUnit}
              aria-label="Duration unit"
              onChange={(e) =>
                changeDurationUnit(e.target.value as DurationUnit)
              }
            >
              {(Object.keys(DURATION_LABELS) as DurationUnit[]).map((u) => (
                <option key={u} value={u}>
                  {DURATION_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
          {errors.travelDuration ? (
            <p className="mt-1 text-xs text-rose-600">{errors.travelDuration}</p>
          ) : null}
        </div>

        <div className="rounded-lg border border-dashed border-border bg-muted/15 px-3 py-2.5">
          <p className="text-[13px] font-medium text-accent">
            Total number of trips
          </p>
          <p className="mt-0.5 text-lg font-semibold tabular-nums text-accent">
            {totalPreview != null ? totalPreview : '—'}
          </p>
          {input.frequencyUnit === 'week' && totalPreview != null ? (
            <p className="mt-1 text-[11px] text-muted-foreground">
              Weekly mode is an estimate (
              {toDays(
                Number(input.travelDuration) || 0,
                input.travelDurationUnit,
              )}{' '}
              day window).
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="to-single" className={labelClass}>
            Single fare ticket price
            <InfoTooltip
              label="Single fare"
              text="Price of one individual journey ticket. Always used as the baseline comparison."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.singleTicketPrice}>
              <input
                id="to-single"
                className={inputClass}
                inputMode="decimal"
                value={input.singleTicketPrice}
                onChange={(e) => set({ singleTicketPrice: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="to-currency"
                value={input.currency}
                onChange={(currency: SupportedCurrency) => set({ currency })}
                aria-label="Display currency"
              />
            </div>
          </div>
          {errors.singleTicketPrice ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.singleTicketPrice}
            </p>
          ) : null}
        </div>

        <fieldset>
          <legend className={labelClass}>Compare with</legend>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-accent">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border"
                checked={input.compareShortTerm}
                onChange={(e) => set({ compareShortTerm: e.target.checked })}
              />
              Short-term tickets
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-accent">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border"
                checked={input.compareLongTerm}
                onChange={(e) => set({ compareLongTerm: e.target.checked })}
              />
              Long-term tickets
            </label>
          </div>
        </fieldset>
      </div>

      {input.compareShortTerm ? (
        <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
          <h3 className="text-[13px] font-semibold text-accent">
            Short-term tickets
          </h3>
          <div>
            <label htmlFor="to-short-price" className={labelClass}>
              Ticket price
            </label>
            <FieldShell error={errors.shortTermTicketPrice}>
              <input
                id="to-short-price"
                className={inputClass}
                inputMode="decimal"
                value={input.shortTermTicketPrice}
                onChange={(e) =>
                  set({ shortTermTicketPrice: e.target.value })
                }
              />
            </FieldShell>
            {errors.shortTermTicketPrice ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.shortTermTicketPrice}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="to-short-val" className={labelClass}>
              Short-term ticket is valid for
              <InfoTooltip
                label="Short-term validity"
                text="Pass covers unlimited eligible trips from activation until this duration ends (exclusive end)."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.shortTermValidity}>
                <input
                  id="to-short-val"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.shortTermValidity}
                  onChange={(e) =>
                    set({ shortTermValidity: e.target.value })
                  }
                />
              </FieldShell>
              <select
                className="h-11 w-[120px] shrink-0 rounded-lg border border-border bg-white px-2 text-xs"
                value={input.shortTermValidityUnit}
                aria-label="Short-term validity unit"
                onChange={(e) =>
                  changeShortUnit(e.target.value as ShortValidityUnit)
                }
              >
                {(Object.keys(SHORT_VALIDITY_LABELS) as ShortValidityUnit[]).map(
                  (u) => (
                    <option key={u} value={u}>
                      {SHORT_VALIDITY_LABELS[u]}
                    </option>
                  ),
                )}
              </select>
            </div>
            {errors.shortTermValidity ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.shortTermValidity}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {input.compareLongTerm ? (
        <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
          <h3 className="text-[13px] font-semibold text-accent">
            Long-term tickets
          </h3>
          <div>
            <label htmlFor="to-long-price" className={labelClass}>
              Long-term ticket price
            </label>
            <FieldShell error={errors.longTermTicketPrice}>
              <input
                id="to-long-price"
                className={inputClass}
                inputMode="decimal"
                value={input.longTermTicketPrice}
                onChange={(e) => set({ longTermTicketPrice: e.target.value })}
              />
            </FieldShell>
            {errors.longTermTicketPrice ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.longTermTicketPrice}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="to-long-val" className={labelClass}>
              Long-term ticket validity
              <InfoTooltip
                label="Long-term validity"
                text="Months use a fixed 30-day period — not calendar months."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.longTermValidity}>
                <input
                  id="to-long-val"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.longTermValidity}
                  onChange={(e) =>
                    set({ longTermValidity: e.target.value })
                  }
                />
              </FieldShell>
              <select
                className="h-11 w-[140px] shrink-0 rounded-lg border border-border bg-white px-2 text-xs"
                value={input.longTermValidityUnit}
                aria-label="Long-term validity unit"
                onChange={(e) =>
                  changeLongUnit(e.target.value as LongValidityUnit)
                }
              >
                {(Object.keys(LONG_VALIDITY_LABELS) as LongValidityUnit[]).map(
                  (u) => (
                    <option key={u} value={u}>
                      {LONG_VALIDITY_LABELS[u]}
                    </option>
                  ),
                )}
              </select>
            </div>
            {errors.longTermValidity ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.longTermValidity}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
