'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  HP_UNIT_LABELS,
  PRESSURE_UNIT_LABELS,
  type BoostCalculationMode,
  type BoostHorsepowerFieldErrors,
  type BoostHorsepowerInput,
  type HorsepowerUnit,
  type PressureUnit,
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

interface BoostHorsepowerFormProps {
  input: BoostHorsepowerInput;
  errors: BoostHorsepowerFieldErrors;
  onChange: (next: BoostHorsepowerInput) => void;
  onLoadExample: () => void;
}

export function BoostHorsepowerForm({
  input,
  errors,
  onChange,
  onLoadExample,
}: BoostHorsepowerFormProps) {
  const set = (patch: Partial<BoostHorsepowerInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Ideal forced-induction estimate:{' '}
        <strong className="text-accent">
          HP × (1 + P_boost / P_atm)
        </strong>
        . Default atmosphere 14.7 psi. Keep crank vs wheel horsepower consistent;
        this is not a dyno measurement.
      </p>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (200 hp · 6 psi)
      </button>

      <div>
        <label htmlFor="bh-mode" className={labelClass}>
          Calculate
        </label>
        <FieldShell>
          <select
            id="bh-mode"
            className={`${inputClass} appearance-none`}
            value={input.mode}
            onChange={(e) =>
              set({ mode: e.target.value as BoostCalculationMode })
            }
          >
            <option value="boostedHorsepower">Boosted horsepower</option>
            <option value="requiredBoost">Required boost pressure</option>
            <option value="originalHorsepower">Original horsepower</option>
          </select>
        </FieldShell>
      </div>

      {input.mode !== 'originalHorsepower' ? (
        <div>
          <label htmlFor="bh-n" className={labelClass}>
            Current Engine Power (N)
            <InfoTooltip
              label="Current Engine Power"
              text="Baseline horsepower before the additional boost being modeled. Use crank or wheel consistently."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.originalHorsepower}>
              <input
                id="bh-n"
                className={inputClass}
                inputMode="decimal"
                value={input.originalHorsepower}
                aria-invalid={Boolean(errors.originalHorsepower)}
                onChange={(e) => set({ originalHorsepower: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[80px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.horsepowerUnit}
              aria-label="Horsepower unit"
              onChange={(e) =>
                set({ horsepowerUnit: e.target.value as HorsepowerUnit })
              }
            >
              {(Object.keys(HP_UNIT_LABELS) as HorsepowerUnit[]).map((u) => (
                <option key={u} value={u}>
                  {HP_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
          {errors.originalHorsepower ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.originalHorsepower}
            </p>
          ) : null}
        </div>
      ) : null}

      {input.mode !== 'requiredBoost' ? (
        <div>
          <label htmlFor="bh-p" className={labelClass}>
            Boost Added (P)
            <InfoTooltip
              label="Boost Added"
              text="Additional intake manifold gauge pressure above atmosphere from a turbo or supercharger."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.boostPressure}>
              <input
                id="bh-p"
                className={inputClass}
                inputMode="decimal"
                value={input.boostPressure}
                aria-invalid={Boolean(errors.boostPressure)}
                onChange={(e) => set({ boostPressure: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.boostPressureUnit}
              aria-label="Boost pressure unit"
              onChange={(e) =>
                set({ boostPressureUnit: e.target.value as PressureUnit })
              }
            >
              {(Object.keys(PRESSURE_UNIT_LABELS) as PressureUnit[]).map(
                (u) => (
                  <option key={u} value={u}>
                    {PRESSURE_UNIT_LABELS[u]}
                  </option>
                ),
              )}
            </select>
          </div>
          {errors.boostPressure ? (
            <p className="mt-1 text-xs text-rose-600">{errors.boostPressure}</p>
          ) : null}
        </div>
      ) : null}

      {input.mode !== 'boostedHorsepower' ? (
        <div>
          <label htmlFor="bh-target" className={labelClass}>
            {input.mode === 'requiredBoost'
              ? 'Target Boosted Power'
              : 'Boosted Engine Power'}
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.targetHorsepower}>
              <input
                id="bh-target"
                className={inputClass}
                inputMode="decimal"
                value={input.targetHorsepower}
                aria-invalid={Boolean(errors.targetHorsepower)}
                onChange={(e) => set({ targetHorsepower: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[80px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.targetHorsepowerUnit}
              aria-label="Target horsepower unit"
              onChange={(e) =>
                set({
                  targetHorsepowerUnit: e.target.value as HorsepowerUnit,
                })
              }
            >
              {(Object.keys(HP_UNIT_LABELS) as HorsepowerUnit[]).map((u) => (
                <option key={u} value={u}>
                  {HP_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
          {errors.targetHorsepower ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.targetHorsepower}
            </p>
          ) : null}
        </div>
      ) : null}

      <details
        className="rounded-xl border border-border bg-muted/10"
        open={input.enableAdvanced}
        onToggle={(e) =>
          set({ enableAdvanced: (e.target as HTMLDetailsElement).open })
        }
      >
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Advanced Settings
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <div>
            <label htmlFor="bh-atm" className={labelClass}>
              Atmospheric Pressure
              <InfoTooltip
                label="Atmospheric Pressure"
                text="Absolute ambient pressure. Default 14.7 psi approximates standard atmosphere."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.atmosphericPressure}>
                <input
                  id="bh-atm"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.atmosphericPressure}
                  aria-invalid={Boolean(errors.atmosphericPressure)}
                  onChange={(e) =>
                    set({ atmosphericPressure: e.target.value })
                  }
                />
              </FieldShell>
              <select
                className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
                value={input.atmosphericPressureUnit}
                aria-label="Atmospheric pressure unit"
                onChange={(e) =>
                  set({
                    atmosphericPressureUnit: e.target.value as PressureUnit,
                  })
                }
              >
                {(Object.keys(PRESSURE_UNIT_LABELS) as PressureUnit[]).map(
                  (u) => (
                    <option key={u} value={u}>
                      {PRESSURE_UNIT_LABELS[u]}
                    </option>
                  ),
                )}
              </select>
            </div>
            {errors.atmosphericPressure ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.atmosphericPressure}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="bh-eff" className={labelClass}>
              Performance Efficiency Factor (η)
              <InfoTooltip
                label="Efficiency Factor"
                text="Heuristic fraction of ideal gain realized: HP_adj = N + (ideal − N) × η. Not a full thermodynamic model."
              />
            </label>
            <FieldShell error={errors.efficiencyFactor}>
              <input
                id="bh-eff"
                className={inputClass}
                inputMode="decimal"
                value={input.efficiencyFactor}
                aria-invalid={Boolean(errors.efficiencyFactor)}
                onChange={(e) => set({ efficiencyFactor: e.target.value })}
              />
            </FieldShell>
            {errors.efficiencyFactor ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.efficiencyFactor}
              </p>
            ) : null}
            <p className="mt-1 text-[11px] text-muted-foreground">
              Range 0–1. Default 1 = full ideal gain.
            </p>
          </div>
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
