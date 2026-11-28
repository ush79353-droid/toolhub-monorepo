'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { fromPsi, toPsi } from './calculation';
import {
  DIRECTION_LABELS,
  MODEL_LABELS,
  PRESSURE_UNIT_LABELS,
  type CalculationDirection,
  type CompressionModel,
  type CompressionRatioToPsiFieldErrors,
  type CompressionRatioToPsiInput,
  type PressureReference,
  type PressureUnit,
  createExample8to1,
  createExample12to1,
  createExampleInput,
  createExamplePolytropic,
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

function PressureUnitSelect({
  value,
  ariaLabel,
  onChange,
}: {
  value: PressureUnit;
  ariaLabel: string;
  onChange: (u: PressureUnit) => void;
}) {
  return (
    <select
      className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value as PressureUnit)}
    >
      {(Object.keys(PRESSURE_UNIT_LABELS) as PressureUnit[]).map((u) => (
        <option key={u} value={u}>
          {PRESSURE_UNIT_LABELS[u]}
        </option>
      ))}
    </select>
  );
}

interface CompressionRatioToPsiFormProps {
  input: CompressionRatioToPsiInput;
  errors: CompressionRatioToPsiFieldErrors;
  onChange: (next: CompressionRatioToPsiInput) => void;
}

export function CompressionRatioToPsiForm({
  input,
  errors,
  onChange,
}: CompressionRatioToPsiFormProps) {
  const set = (patch: Partial<CompressionRatioToPsiInput>) =>
    onChange({ ...input, ...patch });

  const changeAtmUnit = (next: PressureUnit) => {
    const n = Number(input.atmosphericPressure.replace(/,/g, ''));
    if (Number.isFinite(n) && n > 0) {
      const psi = toPsi(n, input.atmosphericPressureUnit);
      set({
        atmosphericPressureUnit: next,
        atmosphericPressure: String(
          Number(fromPsi(psi, next).toPrecision(12)),
        ),
      });
      return;
    }
    set({ atmosphericPressureUnit: next });
  };

  const changeCompressionUnit = (next: PressureUnit) => {
    const n = Number(input.compressionPressure.replace(/,/g, ''));
    if (Number.isFinite(n)) {
      const psi = toPsi(n, input.compressionPressureUnit);
      set({
        compressionPressureUnit: next,
        compressionPressure: String(
          Number(fromPsi(psi, next).toPrecision(12)),
        ),
      });
      return;
    }
    set({ compressionPressureUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational estimate of compression pressure from volume ratio. The
        default{' '}
        <strong className="text-accent">simplified model (P = r × P_atm)</strong>{' '}
        is a linear approximation — not a prediction of a mechanical
        compression-tester reading.
      </p>

      <div>
        <p className="mb-1.5 text-[13px] font-medium text-accent">
          Try an example
        </p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['8:1', createExample8to1],
              ['10:1', createExampleInput],
              ['12:1', createExample12to1],
              ['Polytropic n=1.3', createExamplePolytropic],
            ] as const
          ).map(([label, factory]) => (
            <button
              key={label}
              type="button"
              onClick={() => onChange(factory())}
              className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="crpsi-dir" className={labelClass}>
          Calculate
        </label>
        <FieldShell>
          <select
            id="crpsi-dir"
            className={`${inputClass} appearance-none`}
            value={input.direction}
            onChange={(e) =>
              set({ direction: e.target.value as CalculationDirection })
            }
          >
            {(Object.keys(DIRECTION_LABELS) as CalculationDirection[]).map(
              (d) => (
                <option key={d} value={d}>
                  {DIRECTION_LABELS[d]}
                </option>
              ),
            )}
          </select>
        </FieldShell>
      </div>

      <div>
        <label htmlFor="crpsi-model" className={labelClass}>
          Calculation model
          <InfoTooltip
            label="Calculation model"
            text="Simplified uses P = r × P_atm (reference-compatible). Polytropic uses P = P_atm × rⁿ for an idealized thermodynamic estimate."
          />
        </label>
        <FieldShell>
          <select
            id="crpsi-model"
            className={`${inputClass} appearance-none`}
            value={input.model}
            onChange={(e) =>
              set({ model: e.target.value as CompressionModel })
            }
          >
            {(Object.keys(MODEL_LABELS) as CompressionModel[]).map((m) => (
              <option key={m} value={m}>
                {MODEL_LABELS[m]}
              </option>
            ))}
          </select>
        </FieldShell>
      </div>

      {input.direction === 'ratioToPressure' ? (
        <>
          <div>
            <label htmlFor="crpsi-x" className={labelClass}>
              Compression ratio X in X:Y
              <InfoTooltip
                label="Compression ratio X"
                text="Numerator of the volume compression ratio (e.g. 10 in 10:1)."
              />
            </label>
            <FieldShell error={errors.numerator}>
              <input
                id="crpsi-x"
                className={inputClass}
                inputMode="decimal"
                value={input.numerator}
                aria-invalid={Boolean(errors.numerator)}
                onChange={(e) => set({ numerator: e.target.value })}
              />
            </FieldShell>
            {errors.numerator ? (
              <p className="mt-1 text-xs text-rose-600">{errors.numerator}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="crpsi-y" className={labelClass}>
              Compression ratio Y in X:Y
              <InfoTooltip
                label="Compression ratio Y"
                text="Denominator of the ratio (usually 1). Normalized r = X / Y must be ≥ 1 for compression."
              />
            </label>
            <FieldShell error={errors.denominator}>
              <input
                id="crpsi-y"
                className={inputClass}
                inputMode="decimal"
                value={input.denominator}
                aria-invalid={Boolean(errors.denominator)}
                onChange={(e) => set({ denominator: e.target.value })}
              />
            </FieldShell>
            {errors.denominator ? (
              <p className="mt-1 text-xs text-rose-600">{errors.denominator}</p>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <div>
            <label htmlFor="crpsi-pref" className={labelClass}>
              Pressure reference
              <InfoTooltip
                label="Pressure reference"
                text="Gauge readings are relative to atmosphere (psig). Absolute includes atmosphere (psia). Compression testers usually show gauge pressure."
              />
            </label>
            <FieldShell>
              <select
                id="crpsi-pref"
                className={`${inputClass} appearance-none`}
                value={input.pressureReference}
                onChange={(e) =>
                  set({
                    pressureReference: e.target.value as PressureReference,
                  })
                }
              >
                <option value="gauge">Gauge (psig / relative)</option>
                <option value="absolute">Absolute (psia)</option>
              </select>
            </FieldShell>
          </div>
          <div>
            <label htmlFor="crpsi-p" className={labelClass}>
              Compression pressure
              <InfoTooltip
                label="Compression pressure"
                text="Enter measured or assumed compression pressure. Reverse mode returns a model-implied volume ratio — not a verified geometric engine CR."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.compressionPressure}>
                <input
                  id="crpsi-p"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.compressionPressure}
                  aria-invalid={Boolean(errors.compressionPressure)}
                  onChange={(e) =>
                    set({ compressionPressure: e.target.value })
                  }
                />
              </FieldShell>
              <PressureUnitSelect
                value={input.compressionPressureUnit}
                ariaLabel="Compression pressure unit"
                onChange={changeCompressionUnit}
              />
            </div>
            {errors.compressionPressure ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.compressionPressure}
              </p>
            ) : null}
          </div>
        </>
      )}

      <div>
        <label htmlFor="crpsi-atm" className={labelClass}>
          Atmospheric pressure
          <InfoTooltip
            label="Atmospheric pressure"
            text="Absolute ambient pressure. Default 14.7 psi approximates sea-level standard atmosphere. Local pressure varies with altitude and weather."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.atmosphericPressure}>
            <input
              id="crpsi-atm"
              className={inputClass}
              inputMode="decimal"
              value={input.atmosphericPressure}
              aria-invalid={Boolean(errors.atmosphericPressure)}
              onChange={(e) => set({ atmosphericPressure: e.target.value })}
            />
          </FieldShell>
          <PressureUnitSelect
            value={input.atmosphericPressureUnit}
            ariaLabel="Atmospheric pressure unit"
            onChange={changeAtmUnit}
          />
        </div>
        {errors.atmosphericPressure ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.atmosphericPressure}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="crpsi-out-unit" className={labelClass}>
          Result pressure unit
        </label>
        <FieldShell>
          <select
            id="crpsi-out-unit"
            className={`${inputClass} appearance-none`}
            value={input.resultPressureUnit}
            onChange={(e) =>
              set({ resultPressureUnit: e.target.value as PressureUnit })
            }
          >
            {(Object.keys(PRESSURE_UNIT_LABELS) as PressureUnit[]).map((u) => (
              <option key={u} value={u}>
                {PRESSURE_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
      </div>

      <details
        className="rounded-xl border border-border bg-muted/10"
        open={input.model === 'polytropic'}
      >
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Advanced Compression Model
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Optional polytropic model P₂ = P₁ × rⁿ. Still idealized — not a
            diagnosis of engine health.
          </p>
          <div>
            <label htmlFor="crpsi-n" className={labelClass}>
              Polytropic exponent (n)
              <InfoTooltip
                label="Polytropic exponent"
                text="Process exponent for idealized polytropic compression. Suggested default 1.3; real engines vary with heat transfer and timing."
              />
            </label>
            <FieldShell error={errors.polytropicExponent}>
              <input
                id="crpsi-n"
                className={inputClass}
                inputMode="decimal"
                value={input.polytropicExponent}
                aria-invalid={Boolean(errors.polytropicExponent)}
                onChange={(e) =>
                  set({
                    polytropicExponent: e.target.value,
                    model: 'polytropic',
                  })
                }
              />
            </FieldShell>
            {errors.polytropicExponent ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.polytropicExponent}
              </p>
            ) : null}
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
