'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { fromKnots, toKnots } from './calculation';
import {
  RUNWAY_NUMBERS,
  WIND_SPEED_UNIT_LABELS,
  type CrosswindFieldErrors,
  type CrosswindInput,
  type WindReference,
  type WindSpeedUnit,
  createExampleHeadAndCross,
  createExampleLeftCrosswind,
  createExamplePureCrosswind,
  createExampleTailwind,
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

interface CrosswindFormProps {
  input: CrosswindInput;
  errors: CrosswindFieldErrors;
  onChange: (next: CrosswindInput) => void;
}

export function CrosswindForm({
  input,
  errors,
  onChange,
}: CrosswindFormProps) {
  const set = (patch: Partial<CrosswindInput>) =>
    onChange({ ...input, ...patch });

  const changeSpeedUnit = (next: WindSpeedUnit) => {
    const n = Number(input.windSpeed.replace(/,/g, ''));
    if (Number.isFinite(n) && n >= 0) {
      const kt = toKnots(n, input.windSpeedUnit);
      set({
        windSpeedUnit: next,
        windSpeed: String(Number(fromKnots(kt, next).toPrecision(12))),
      });
      return;
    }
    set({ windSpeedUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational wind components for a runway. Wind direction is the
        direction the wind comes <strong className="text-accent">from</strong>.
        Keep runway heading and wind on the same magnetic/true reference.
      </p>

      <div>
        <p className="mb-1.5 text-[13px] font-medium text-accent">
          Try an example
        </p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['Pure crosswind', createExamplePureCrosswind],
              ['Head + cross', createExampleHeadAndCross],
              ['Tailwind', createExampleTailwind],
              ['Left crosswind', createExampleLeftCrosswind],
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
        <label htmlFor="xw-rwy" className={labelClass}>
          Runway number
          <InfoTooltip
            label="Runway number"
            text="Designator 01–36. Nominal heading ≈ number × 10°. RWY 36 ≈ 360°/0°. Approximate magnetic orientation — not always the published precise heading."
          />
        </label>
        <FieldShell error={errors.runwayNumber}>
          <select
            id="xw-rwy"
            className={`${inputClass} appearance-none`}
            value={input.runwayNumber}
            aria-invalid={Boolean(errors.runwayNumber)}
            onChange={(e) => set({ runwayNumber: e.target.value })}
          >
            {RUNWAY_NUMBERS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.runwayNumber ? (
          <p className="mt-1 text-xs text-rose-600">{errors.runwayNumber}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="xw-wind-dir" className={labelClass}>
          Wind direction
          <InfoTooltip
            label="Wind direction"
            text="Degrees FROM which the wind blows (0–360). METAR winds are often true; tower winds are usually magnetic. Convert true to magnetic before comparing with a magnetic runway."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.windDirection}>
            <input
              id="xw-wind-dir"
              className={inputClass}
              inputMode="decimal"
              value={input.windDirection}
              aria-invalid={Boolean(errors.windDirection)}
              onChange={(e) => set({ windDirection: e.target.value })}
            />
          </FieldShell>
          <span className="flex h-11 w-10 shrink-0 items-center justify-center text-sm text-muted-foreground">
            °
          </span>
        </div>
        {errors.windDirection ? (
          <p className="mt-1 text-xs text-rose-600">{errors.windDirection}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="xw-speed" className={labelClass}>
          Wind speed
          <InfoTooltip
            label="Wind speed"
            text="Steady wind speed. Gusts can raise instantaneous crosswind — check official weather and aircraft guidance separately."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.windSpeed}>
            <input
              id="xw-speed"
              className={inputClass}
              inputMode="decimal"
              value={input.windSpeed}
              aria-invalid={Boolean(errors.windSpeed)}
              onChange={(e) => set({ windSpeed: e.target.value })}
            />
          </FieldShell>
          <select
            className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm"
            value={input.windSpeedUnit}
            aria-label="Wind speed unit"
            onChange={(e) =>
              changeSpeedUnit(e.target.value as WindSpeedUnit)
            }
          >
            {(Object.keys(WIND_SPEED_UNIT_LABELS) as WindSpeedUnit[]).map(
              (u) => (
                <option key={u} value={u}>
                  {WIND_SPEED_UNIT_LABELS[u]}
                </option>
              ),
            )}
          </select>
        </div>
        {errors.windSpeed ? (
          <p className="mt-1 text-xs text-rose-600">{errors.windSpeed}</p>
        ) : null}
      </div>

      <details className="rounded-xl border border-border bg-muted/10">
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent">
          Advanced settings
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3">
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="checkbox"
              checked={input.useCustomHeading}
              onChange={(e) =>
                set({ useCustomHeading: e.target.checked })
              }
            />
            Use precise runway heading
            <InfoTooltip
              label="Precise runway heading"
              text="Optional magnetic heading when the published runway heading differs from number × 10°."
            />
          </label>
          {input.useCustomHeading ? (
            <div>
              <label htmlFor="xw-heading" className={labelClass}>
                Runway heading (°)
              </label>
              <FieldShell error={errors.customRunwayHeading}>
                <input
                  id="xw-heading"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.customRunwayHeading}
                  aria-invalid={Boolean(errors.customRunwayHeading)}
                  onChange={(e) =>
                    set({ customRunwayHeading: e.target.value })
                  }
                />
              </FieldShell>
              {errors.customRunwayHeading ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.customRunwayHeading}
                </p>
              ) : null}
            </div>
          ) : null}

          <div>
            <label htmlFor="xw-ref" className={labelClass}>
              Wind reference
              <InfoTooltip
                label="Wind reference"
                text="Magnetic: use as entered. True: converts with east-positive variation (Magnetic = True − Variation) before comparing to the runway."
              />
            </label>
            <FieldShell>
              <select
                id="xw-ref"
                className={`${inputClass} appearance-none`}
                value={input.windReference}
                onChange={(e) =>
                  set({ windReference: e.target.value as WindReference })
                }
              >
                <option value="magnetic">Magnetic</option>
                <option value="true">True (convert with variation)</option>
              </select>
            </FieldShell>
          </div>

          {input.windReference === 'true' ? (
            <div>
              <label htmlFor="xw-var" className={labelClass}>
                Magnetic variation (° east +)
                <InfoTooltip
                  label="Magnetic variation"
                  text="East-positive. MagneticDirection = TrueDirection − Variation. West variation is negative."
                />
              </label>
              <FieldShell error={errors.magneticVariation}>
                <input
                  id="xw-var"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.magneticVariation}
                  aria-invalid={Boolean(errors.magneticVariation)}
                  onChange={(e) =>
                    set({ magneticVariation: e.target.value })
                  }
                />
              </FieldShell>
              {errors.magneticVariation ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.magneticVariation}
                </p>
              ) : null}
            </div>
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
