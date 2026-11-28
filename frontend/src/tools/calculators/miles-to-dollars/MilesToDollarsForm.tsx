'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertMileValueUnit } from './calculation';
import {
  AIRLINE_PROGRAMS,
  ILLUSTRATIVE_CENTS_PER_MILE,
  MILE_VALUE_UNIT_LABELS,
  type AirlineProgramId,
  type MileValueUnit,
  type MilesToDollarsFieldErrors,
  type MilesToDollarsInput,
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

interface MilesToDollarsFormProps {
  input: MilesToDollarsInput;
  errors: MilesToDollarsFieldErrors;
  onChange: (next: MilesToDollarsInput) => void;
}

export function MilesToDollarsForm({
  input,
  errors,
  onChange,
}: MilesToDollarsFormProps) {
  const set = (patch: Partial<MilesToDollarsInput>) =>
    onChange({ ...input, ...patch });

  const changeUnit = (next: MileValueUnit) => {
    const n = Number(input.valuePerMile.replace(/,/g, ''));
    if (Number.isFinite(n) && n > 0) {
      set({
        mileValueUnit: next,
        valuePerMile: String(
          Number(
            convertMileValueUnit(n, input.mileValueUnit, next).toPrecision(12),
          ),
        ),
      });
      return;
    }
    set({ mileValueUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Values airline loyalty miles (not geographic distance). The
        cents-per-mile figure is an illustrative assumption you edit — not a
        guaranteed cash rate. Amounts are shown in USD.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (25,000 mi · $600 cash)
        </button>
      </div>

      {/* Section A */}
      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">
          Airline and miles value
        </h3>

        <div>
          <label htmlFor="mtd-airline" className={labelClass}>
            Airline
            <InfoTooltip
              label="Loyalty program"
              text="Select the program for context. Valuation is always the editable figure below — we do not publish live market rates."
            />
          </label>
          <select
            id="mtd-airline"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
            value={input.airlineProgram}
            onChange={(e) =>
              set({ airlineProgram: e.target.value as AirlineProgramId })
            }
          >
            {AIRLINE_PROGRAMS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="mtd-value" className={labelClass}>
            Miles value
            <InfoTooltip
              label="Assumed value"
              text={`Illustrative default ${ILLUSTRATIVE_CENTS_PER_MILE}¢/mile. Edit freely. Redemption value depends on itinerary, taxes, and availability.`}
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.valuePerMile}>
              <input
                id="mtd-value"
                className={inputClass}
                inputMode="decimal"
                value={input.valuePerMile}
                aria-invalid={Boolean(errors.valuePerMile)}
                onChange={(e) => set({ valuePerMile: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[110px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.mileValueUnit}
              aria-label="Miles value unit"
              onChange={(e) => changeUnit(e.target.value as MileValueUnit)}
            >
              {(Object.keys(MILE_VALUE_UNIT_LABELS) as MileValueUnit[]).map(
                (u) => (
                  <option key={u} value={u}>
                    {MILE_VALUE_UNIT_LABELS[u]}
                  </option>
                ),
              )}
            </select>
          </div>
          {errors.valuePerMile ? (
            <p className="mt-1 text-xs text-rose-600">{errors.valuePerMile}</p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              User-editable illustrative value — not a current market quote.
            </p>
          )}
        </div>
      </div>

      {/* Section B */}
      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">
          Price when booked with miles
        </h3>

        <div>
          <label htmlFor="mtd-miles" className={labelClass}>
            Cost in miles
            <InfoTooltip
              label="Award miles"
              text="Miles required for the award ticket. Must be greater than zero for cents-per-mile redemption value."
            />
          </label>
          <FieldShell error={errors.milesRequired}>
            <input
              id="mtd-miles"
              className={inputClass}
              inputMode="decimal"
              value={input.milesRequired}
              aria-invalid={Boolean(errors.milesRequired)}
              onChange={(e) => set({ milesRequired: e.target.value })}
            />
          </FieldShell>
          {errors.milesRequired ? (
            <p className="mt-1 text-xs text-rose-600">{errors.milesRequired}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="mtd-fees" className={labelClass}>
            Additional cost in cash (taxes &amp; fees)
            <InfoTooltip
              label="Award cash outlay"
              text="Taxes, carrier surcharges, and booking fees paid in cash for the award ticket."
            />
          </label>
          <FieldShell error={errors.additionalFees}>
            <span className="pl-3 text-sm text-muted-foreground">$</span>
            <input
              id="mtd-fees"
              className={inputClass}
              inputMode="decimal"
              value={input.additionalFees}
              aria-invalid={Boolean(errors.additionalFees)}
              onChange={(e) => set({ additionalFees: e.target.value })}
            />
          </FieldShell>
          {errors.additionalFees ? (
            <p className="mt-1 text-xs text-rose-600">{errors.additionalFees}</p>
          ) : null}
        </div>
      </div>

      {/* Section C */}
      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
        <h3 className="text-[13px] font-semibold text-accent">
          Comparison with cash-only price
        </h3>

        <div>
          <label htmlFor="mtd-cash" className={labelClass}>
            Cost in cash
            <InfoTooltip
              label="Cash fare"
              text="Comparable revenue ticket price if you paid cash instead of redeeming miles."
            />
          </label>
          <FieldShell error={errors.cashTicketPrice}>
            <span className="pl-3 text-sm text-muted-foreground">$</span>
            <input
              id="mtd-cash"
              className={inputClass}
              inputMode="decimal"
              value={input.cashTicketPrice}
              aria-invalid={Boolean(errors.cashTicketPrice)}
              onChange={(e) => set({ cashTicketPrice: e.target.value })}
            />
          </FieldShell>
          {errors.cashTicketPrice ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.cashTicketPrice}
            </p>
          ) : null}
        </div>
      </div>

      {/* Optional convert */}
      <details
        className="rounded-xl border border-border bg-muted/10"
        open={input.showConvert}
        onToggle={(e) =>
          set({ showConvert: (e.target as HTMLDetailsElement).open })
        }
      >
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Convert miles to dollars
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <p className="text-xs text-muted-foreground">
            Estimate a balance at your assumed cents-per-mile (illustrative).
          </p>
          <div>
            <label htmlFor="mtd-convert" className={labelClass}>
              Miles balance
            </label>
            <FieldShell error={errors.convertMiles}>
              <input
                id="mtd-convert"
                className={inputClass}
                inputMode="decimal"
                value={input.convertMiles}
                onChange={(e) => set({ convertMiles: e.target.value })}
              />
            </FieldShell>
            {errors.convertMiles ? (
              <p className="mt-1 text-xs text-rose-600">{errors.convertMiles}</p>
            ) : null}
          </div>
        </div>
      </details>

      {/* Optional compare */}
      <details
        className="rounded-xl border border-border bg-muted/10"
        open={input.showCompare}
        onToggle={(e) =>
          set({ showCompare: (e.target as HTMLDetailsElement).open })
        }
      >
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Compare two award options
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <p className="text-xs text-muted-foreground">
            Option A uses the main inputs above. Enter Option B below.
          </p>
          <div>
            <label htmlFor="mtd-b-miles" className={labelClass}>
              Option B — cost in miles
            </label>
            <FieldShell error={errors.optionBMiles}>
              <input
                id="mtd-b-miles"
                className={inputClass}
                inputMode="decimal"
                value={input.optionBMiles}
                onChange={(e) => set({ optionBMiles: e.target.value })}
              />
            </FieldShell>
          </div>
          <div>
            <label htmlFor="mtd-b-fees" className={labelClass}>
              Option B — taxes &amp; fees ($)
            </label>
            <FieldShell error={errors.optionBFees}>
              <input
                id="mtd-b-fees"
                className={inputClass}
                inputMode="decimal"
                value={input.optionBFees}
                onChange={(e) => set({ optionBFees: e.target.value })}
              />
            </FieldShell>
          </div>
          <div>
            <label htmlFor="mtd-b-cash" className={labelClass}>
              Option B — cash fare ($)
            </label>
            <FieldShell error={errors.optionBCash}>
              <input
                id="mtd-b-cash"
                className={inputClass}
                inputMode="decimal"
                value={input.optionBCash}
                onChange={(e) => set({ optionBCash: e.target.value })}
              />
            </FieldShell>
          </div>
        </div>
      </details>

      {/* Optional target */}
      <details
        className="rounded-xl border border-border bg-muted/10"
        open={input.showTarget}
        onToggle={(e) =>
          set({ showTarget: (e.target as HTMLDetailsElement).open })
        }
      >
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          How many miles are needed?
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div>
            <label htmlFor="mtd-target" className={labelClass}>
              Desired estimated dollar value
              <InfoTooltip
                label="Target value"
                text="Miles needed = ceil(target ÷ value per mile). Not an airline award quote."
              />
            </label>
            <FieldShell error={errors.targetDollars}>
              <span className="pl-3 text-sm text-muted-foreground">$</span>
              <input
                id="mtd-target"
                className={inputClass}
                inputMode="decimal"
                value={input.targetDollars}
                onChange={(e) => set({ targetDollars: e.target.value })}
              />
            </FieldShell>
            {errors.targetDollars ? (
              <p className="mt-1 text-xs text-rose-600">{errors.targetDollars}</p>
            ) : null}
          </div>
        </div>
      </details>
    </form>
  );
}
