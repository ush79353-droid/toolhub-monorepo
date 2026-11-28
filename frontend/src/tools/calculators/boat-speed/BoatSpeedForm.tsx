'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  BOAT_TYPES,
  DISPLACEMENT_UNIT_LABELS,
  POWER_UNIT_LABELS,
  SPEED_UNIT_LABELS,
  getBoatTypeCoefficient,
  type BoatCalculationMode,
  type BoatDisplacementUnit,
  type BoatPowerUnit,
  type BoatSpeedFieldErrors,
  type BoatSpeedInput,
  type BoatSpeedUnit,
  type BoatTypeId,
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

interface BoatSpeedFormProps {
  input: BoatSpeedInput;
  errors: BoatSpeedFieldErrors;
  onChange: (next: BoatSpeedInput) => void;
  onLoadExample: () => void;
}

export function BoatSpeedForm({
  input,
  errors,
  onChange,
  onLoadExample,
}: BoatSpeedFormProps) {
  const set = (patch: Partial<BoatSpeedInput>) =>
    onChange({ ...input, ...patch });

  const onBoatType = (boatType: BoatTypeId) => {
    const c = getBoatTypeCoefficient(boatType);
    set({
      boatType,
      crouchConstant:
        c != null ? String(c) : input.crouchConstant || '150',
    });
  };

  const isOutput = (field: 'horsepower' | 'displacement' | 'speed' | 'crouch') => {
    if (input.mode === 'speed' && field === 'speed') return true;
    if (input.mode === 'horsepower' && field === 'horsepower') return true;
    if (input.mode === 'displacement' && field === 'displacement') return true;
    if (input.mode === 'crouchConstant' && field === 'crouch') return true;
    return false;
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Crouch&apos;s formula uses <strong className="text-accent">mph</strong>,{' '}
        <strong className="text-accent">mechanical hp</strong>, and{' '}
        <strong className="text-accent">pounds</strong> internally. Boat-type
        coefficients are empirical estimates — not design guarantees.
      </p>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (3,000 hp · 6,000 lb · C = 150)
      </button>

      <div>
        <label htmlFor="bs-mode" className={labelClass}>
          Calculate
        </label>
        <FieldShell>
          <select
            id="bs-mode"
            className={`${inputClass} appearance-none`}
            value={input.mode}
            onChange={(e) =>
              set({ mode: e.target.value as BoatCalculationMode })
            }
          >
            <option value="speed">Boat speed (S)</option>
            <option value="horsepower">Required horsepower (P)</option>
            <option value="displacement">Displacement (D)</option>
            <option value="crouchConstant">Crouch constant (C)</option>
          </select>
        </FieldShell>
      </div>

      {!isOutput('horsepower') ? (
        <div>
          <label htmlFor="bs-hp" className={labelClass}>
            Shaft Horsepower (P)
            <InfoTooltip
              label="Shaft Horsepower"
              text="Mechanical power delivered to the propeller shaft. May differ from advertised crankshaft horsepower."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.horsepower}>
              <input
                id="bs-hp"
                className={inputClass}
                inputMode="decimal"
                value={input.horsepower}
                aria-invalid={Boolean(errors.horsepower)}
                onChange={(e) => set({ horsepower: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.horsepowerUnit}
              aria-label="Power unit"
              onChange={(e) =>
                set({ horsepowerUnit: e.target.value as BoatPowerUnit })
              }
            >
              {(Object.keys(POWER_UNIT_LABELS) as BoatPowerUnit[]).map((u) => (
                <option key={u} value={u}>
                  {POWER_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
          {errors.horsepower ? (
            <p className="mt-1 text-xs text-rose-600">{errors.horsepower}</p>
          ) : null}
        </div>
      ) : null}

      {!isOutput('displacement') ? (
        <div>
          <label htmlFor="bs-disp" className={labelClass}>
            Boat Displacement (D)
            <InfoTooltip
              label="Boat Displacement"
              text="Weight of the vessel at operating condition, including hull, engine, fuel, passengers, and cargo."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.displacement}>
              <input
                id="bs-disp"
                className={inputClass}
                inputMode="decimal"
                value={input.displacement}
                aria-invalid={Boolean(errors.displacement)}
                onChange={(e) => set({ displacement: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[100px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.displacementUnit}
              aria-label="Displacement unit"
              onChange={(e) =>
                set({
                  displacementUnit: e.target.value as BoatDisplacementUnit,
                })
              }
            >
              {(
                Object.keys(DISPLACEMENT_UNIT_LABELS) as BoatDisplacementUnit[]
              ).map((u) => (
                <option key={u} value={u}>
                  {DISPLACEMENT_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
          {errors.displacement ? (
            <p className="mt-1 text-xs text-rose-600">{errors.displacement}</p>
          ) : null}
        </div>
      ) : null}

      <div>
        <label htmlFor="bs-type" className={labelClass}>
          Boat Type
          <InfoTooltip
            label="Boat Type"
            text="Selects a suggested Crouch constant. Values are illustrative empirical coefficients."
          />
        </label>
        <FieldShell error={errors.boatType}>
          <select
            id="bs-type"
            className={`${inputClass} appearance-none`}
            value={input.boatType}
            onChange={(e) => onBoatType(e.target.value as BoatTypeId)}
          >
            {BOAT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
                {t.crouchConstant != null ? ` (C≈${t.crouchConstant})` : ''}
              </option>
            ))}
          </select>
        </FieldShell>
      </div>

      {!isOutput('crouch') ? (
        <div>
          <label htmlFor="bs-c" className={labelClass}>
            Crouch&apos;s Constant (C)
            <InfoTooltip
              label="Crouch's Constant"
              text="Empirical coefficient assuming mph, mechanical hp, and pounds. Editable for custom boats."
            />
          </label>
          <FieldShell error={errors.crouchConstant}>
            <input
              id="bs-c"
              className={inputClass}
              inputMode="decimal"
              value={input.crouchConstant}
              aria-invalid={Boolean(errors.crouchConstant)}
              onChange={(e) =>
                set({
                  crouchConstant: e.target.value,
                  boatType:
                    getBoatTypeCoefficient(input.boatType) != null &&
                    String(getBoatTypeCoefficient(input.boatType)) !==
                      e.target.value.trim()
                      ? 'custom'
                      : input.boatType,
                })
              }
            />
          </FieldShell>
          {errors.crouchConstant ? (
            <p className="mt-1 text-xs text-rose-600">{errors.crouchConstant}</p>
          ) : null}
        </div>
      ) : null}

      {!isOutput('speed') ? (
        <div>
          <label htmlFor="bs-speed" className={labelClass}>
            Speed (S)
            <InfoTooltip
              label="Speed"
              text="Target or measured boat speed. Used for reverse horsepower, displacement, or Crouch constant solves."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.speed}>
              <input
                id="bs-speed"
                className={inputClass}
                inputMode="decimal"
                value={input.speed}
                aria-invalid={Boolean(errors.speed)}
                onChange={(e) => set({ speed: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.speedUnit}
              aria-label="Speed unit"
              onChange={(e) =>
                set({ speedUnit: e.target.value as BoatSpeedUnit })
              }
            >
              {(Object.keys(SPEED_UNIT_LABELS) as BoatSpeedUnit[]).map((u) => (
                <option key={u} value={u}>
                  {SPEED_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
          {errors.speed ? (
            <p className="mt-1 text-xs text-rose-600">{errors.speed}</p>
          ) : null}
        </div>
      ) : (
        <div>
          <label htmlFor="bs-speed-unit" className={labelClass}>
            Speed output unit
          </label>
          <FieldShell>
            <select
              id="bs-speed-unit"
              className={`${inputClass} appearance-none`}
              value={input.speedUnit}
              onChange={(e) =>
                set({ speedUnit: e.target.value as BoatSpeedUnit })
              }
            >
              {(Object.keys(SPEED_UNIT_LABELS) as BoatSpeedUnit[]).map((u) => (
                <option key={u} value={u}>
                  {SPEED_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>
      )}

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
