'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { fromMph, fromPounds, toMph, toPounds } from './calculation';
import {
  HP_OUTPUT_UNIT_LABELS,
  METHOD_LABELS,
  TRAP_SPEED_UNIT_LABELS,
  WEIGHT_UNIT_LABELS,
  type HorsepowerFieldErrors,
  type HorsepowerInput,
  type HorsepowerMethod,
  type HorsepowerOutputUnit,
  type TrapSpeedUnit,
  type VehicleWeightUnit,
  createExampleElapsedTime,
  createExampleTrapSpeed,
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

interface HorsepowerFormProps {
  input: HorsepowerInput;
  errors: HorsepowerFieldErrors;
  onChange: (next: HorsepowerInput) => void;
}

export function HorsepowerForm({
  input,
  errors,
  onChange,
}: HorsepowerFormProps) {
  const set = (patch: Partial<HorsepowerInput>) =>
    onChange({ ...input, ...patch });

  const changeWeightUnit = (next: VehicleWeightUnit) => {
    const n = Number(input.vehicleWeight.replace(/,/g, ''));
    if (Number.isFinite(n) && n > 0) {
      const lb = toPounds(n, input.vehicleWeightUnit);
      set({
        vehicleWeightUnit: next,
        vehicleWeight: String(Number(fromPounds(lb, next).toPrecision(12))),
      });
      return;
    }
    set({ vehicleWeightUnit: next });
  };

  const changeTrapUnit = (next: TrapSpeedUnit) => {
    const n = Number(input.trapSpeed.replace(/,/g, ''));
    if (Number.isFinite(n) && n > 0) {
      const mph = toMph(n, input.trapSpeedUnit);
      set({
        trapSpeedUnit: next,
        trapSpeed: String(Number(fromMph(mph, next).toPrecision(12))),
      });
      return;
    }
    set({ trapSpeedUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Empirical quarter-mile estimates:{' '}
        <strong className="text-accent">
          HP = W / (ET/5.825)³
        </strong>{' '}
        or{' '}
        <strong className="text-accent">HP = W × (V/234)³</strong>. Not a dyno
        measurement — traction, drag, and launch affect real results.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createExampleElapsedTime())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example ET (13.5 s)
        </button>
        <button
          type="button"
          onClick={() => onChange(createExampleTrapSpeed())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example trap (105 mph)
        </button>
      </div>

      <fieldset>
        <legend className={labelClass}>
          Calculation method
          <InfoTooltip
            label="Calculation method"
            text="Elapsed time uses ET in seconds. Trap speed uses terminal quarter-mile speed. Methods often disagree — that is expected."
          />
        </legend>
        <div className="flex flex-wrap gap-4">
          {(Object.keys(METHOD_LABELS) as HorsepowerMethod[]).map((m) => (
            <label
              key={m}
              className="inline-flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="hp-method"
                checked={input.method === m}
                onChange={() => set({ method: m })}
              />
              {METHOD_LABELS[m]}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="hp-weight" className={labelClass}>
          Vehicle weight
          <InfoTooltip
            label="Vehicle weight"
            text="Approximate race weight including driver/cargo when known. Formulas use pounds internally."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.vehicleWeight}>
            <input
              id="hp-weight"
              className={inputClass}
              inputMode="decimal"
              value={input.vehicleWeight}
              aria-invalid={Boolean(errors.vehicleWeight)}
              onChange={(e) => set({ vehicleWeight: e.target.value })}
            />
          </FieldShell>
          <select
            className="h-11 w-[110px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
            value={input.vehicleWeightUnit}
            aria-label="Vehicle weight unit"
            onChange={(e) =>
              changeWeightUnit(e.target.value as VehicleWeightUnit)
            }
          >
            {(Object.keys(WEIGHT_UNIT_LABELS) as VehicleWeightUnit[]).map(
              (u) => (
                <option key={u} value={u}>
                  {WEIGHT_UNIT_LABELS[u]}
                </option>
              ),
            )}
          </select>
        </div>
        {errors.vehicleWeight ? (
          <p className="mt-1 text-xs text-rose-600">{errors.vehicleWeight}</p>
        ) : null}
      </div>

      {input.method === 'elapsedTime' ? (
        <div>
          <label htmlFor="hp-et" className={labelClass}>
            Quarter-mile time
            <InfoTooltip
              label="Quarter-mile time"
              text="Elapsed time (ET) for a 1/4-mile run, in seconds."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.quarterMileTime}>
              <input
                id="hp-et"
                className={inputClass}
                inputMode="decimal"
                value={input.quarterMileTime}
                aria-invalid={Boolean(errors.quarterMileTime)}
                onChange={(e) => set({ quarterMileTime: e.target.value })}
              />
            </FieldShell>
            <span className="flex h-11 w-10 shrink-0 items-center justify-center text-sm text-muted-foreground">
              s
            </span>
          </div>
          {errors.quarterMileTime ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.quarterMileTime}
            </p>
          ) : null}
        </div>
      ) : (
        <div>
          <label htmlFor="hp-trap" className={labelClass}>
            Quarter-mile trap speed
            <InfoTooltip
              label="Trap speed"
              text="Speed at the end of the quarter mile. Converted to mph for HP = W × (V/234)³."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.trapSpeed}>
              <input
                id="hp-trap"
                className={inputClass}
                inputMode="decimal"
                value={input.trapSpeed}
                aria-invalid={Boolean(errors.trapSpeed)}
                onChange={(e) => set({ trapSpeed: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.trapSpeedUnit}
              aria-label="Trap speed unit"
              onChange={(e) =>
                changeTrapUnit(e.target.value as TrapSpeedUnit)
              }
            >
              {(Object.keys(TRAP_SPEED_UNIT_LABELS) as TrapSpeedUnit[]).map(
                (u) => (
                  <option key={u} value={u}>
                    {TRAP_SPEED_UNIT_LABELS[u]}
                  </option>
                ),
              )}
            </select>
          </div>
          {errors.trapSpeed ? (
            <p className="mt-1 text-xs text-rose-600">{errors.trapSpeed}</p>
          ) : null}
        </div>
      )}

      <div>
        <label htmlFor="hp-out" className={labelClass}>
          Horsepower output unit
          <InfoTooltip
            label="Output unit"
            text="hp = mechanical horsepower (745.7 W). PS = metric horsepower (735.5 W). Also W and kW."
          />
        </label>
        <FieldShell>
          <select
            id="hp-out"
            className={`${inputClass} appearance-none`}
            value={input.outputUnit}
            onChange={(e) =>
              set({ outputUnit: e.target.value as HorsepowerOutputUnit })
            }
          >
            {(Object.keys(HP_OUTPUT_UNIT_LABELS) as HorsepowerOutputUnit[]).map(
              (u) => (
                <option key={u} value={u}>
                  {HP_OUTPUT_UNIT_LABELS[u]}
                </option>
              ),
            )}
          </select>
        </FieldShell>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
