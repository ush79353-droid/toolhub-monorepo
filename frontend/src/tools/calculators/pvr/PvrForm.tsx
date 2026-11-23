'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  mmHgToPressureUnit,
  parseNumber,
  pressureToMmHg,
} from './calculation';
import type {
  PressureUnit,
  PvrFieldErrors,
  PvrInput,
  PvrResult,
  ResistanceUnit,
} from './types';
import {
  PRESSURE_UNIT_OPTIONS,
  RESISTANCE_UNIT_OPTIONS,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const suffixClass =
  'shrink-0 border-l border-border px-2 text-sm font-medium text-muted-foreground';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';

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

interface Props {
  input: PvrInput;
  errors: PvrFieldErrors;
  result: PvrResult | null;
  onChange: (input: PvrInput) => void;
  onLoadExample: () => void;
}

export function PvrForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<PvrInput>) => onChange({ ...input, ...patch });

  const switchPressureUnit = (
    field: 'mpap' | 'lap',
    nextUnit: PressureUnit,
  ) => {
    const textKey = field === 'mpap' ? 'mpapText' : 'lapText';
    const unitKey = field === 'mpap' ? 'mpapUnit' : 'lapUnit';
    const prevUnit = input[unitKey];
    if (prevUnit === nextUnit) return;
    const raw = parseNumber(input[textKey]);
    if (raw === null) {
      set({ [unitKey]: nextUnit } as Partial<PvrInput>);
      return;
    }
    const mmHg = pressureToMmHg(raw, prevUnit);
    const converted = mmHgToPressureUnit(mmHg, nextUnit);
    const rounded = Math.round(converted * 1e6) / 1e6;
    set({
      [textKey]: String(rounded),
      [unitKey]: nextUnit,
    } as Partial<PvrInput>);
  };

  const primaryUnitLabel =
    input.resistanceUnit === 'wood'
      ? 'Wood units'
      : 'dynes · sec · cm⁻⁵';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Enter mean pulmonary arterial pressure, left atrial pressure, and
        cardiac output to see pulmonary vascular resistance.
      </p>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational arithmetic only. LAP may be a pulmonary capillary wedge
        pressure (PCWP/PAWP) surrogate — note which measurement you enter.
        Entries stay in your browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (30 − 10) ÷ 5 → 320 dyn·s·cm⁻⁵
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="pvr-mpap">
          <span>Mean Pulmonary Arterial Pressure (MPAP)</span>
          <InfoTooltip
            label="MPAP"
            text="Mean pressure in the pulmonary artery (mmHg or kPa). Converted to mmHg before PVR arithmetic."
          />
        </label>
        <FieldShell error={errors.mpapText}>
          <input
            id="pvr-mpap"
            className={inputClass}
            inputMode="decimal"
            aria-label="Mean pulmonary arterial pressure"
            value={input.mpapText}
            aria-invalid={Boolean(errors.mpapText)}
            onChange={(e) => set({ mpapText: e.target.value })}
          />
          <select
            className={unitSelectClass}
            aria-label="MPAP unit"
            value={input.mpapUnit}
            onChange={(e) =>
              switchPressureUnit('mpap', e.target.value as PressureUnit)
            }
          >
            {PRESSURE_UNIT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.mpapText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.mpapText}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="pvr-lap">
          <span>Left Atrial Pressure (LAP)</span>
          <InfoTooltip
            label="LAP"
            text="Left atrial pressure, or a PCWP/PAWP wedge-pressure surrogate when direct LAP is unavailable. Document which value you enter."
          />
        </label>
        <FieldShell error={errors.lapText}>
          <input
            id="pvr-lap"
            className={inputClass}
            inputMode="decimal"
            aria-label="Left atrial pressure"
            value={input.lapText}
            aria-invalid={Boolean(errors.lapText)}
            onChange={(e) => set({ lapText: e.target.value })}
          />
          <select
            className={unitSelectClass}
            aria-label="LAP unit"
            value={input.lapUnit}
            onChange={(e) =>
              switchPressureUnit('lap', e.target.value as PressureUnit)
            }
          >
            {PRESSURE_UNIT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.lapText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.lapText}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="pvr-co">
          <span>Cardiac Output (CO)</span>
          <InfoTooltip
            label="CO"
            text="Cardiac output in liters per minute. Must be positive; zero CO leaves PVR blank."
          />
        </label>
        <FieldShell error={errors.coText}>
          <input
            id="pvr-co"
            className={inputClass}
            inputMode="decimal"
            aria-label="Cardiac output"
            value={input.coText}
            aria-invalid={Boolean(errors.coText)}
            onChange={(e) => set({ coText: e.target.value })}
          />
          <span className={suffixClass}>L/min</span>
        </FieldShell>
        {errors.coText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.coText}</p>
        ) : null}
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="mb-3 text-[15px] font-semibold text-accent">Results</h3>

        <div>
          <label className={labelClass} htmlFor="pvr-out">
            <span>Pulmonary Vascular Resistance (PVR)</span>
            <InfoTooltip
              label="PVR"
              text="Wood units = (mPAP − LAP) / CO; dyn·s·cm⁻⁵ = Wood × 80. Blank until all inputs are valid with a positive driving pressure."
            />
          </label>
          <div className="relative flex h-11 min-w-0 items-center rounded-lg border border-sky-200 bg-sky-50/60">
            <output
              id="pvr-out"
              className="w-full min-w-0 px-3 text-sm tabular-nums font-semibold text-accent"
              aria-live="polite"
            >
              {result ? result.formattedPrimary : ''}
            </output>
            <select
              className={unitSelectClass}
              aria-label="PVR unit"
              value={input.resistanceUnit}
              onChange={(e) =>
                set({ resistanceUnit: e.target.value as ResistanceUnit })
              }
            >
              {RESISTANCE_UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Display unit: {primaryUnitLabel}
          </p>
          {result ? (
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {result.explanation}
            </p>
          ) : null}
          <p className="mt-2 rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
            {result?.disclaimer ??
              'This tool is for information purposes only and PVR should always be calculated separately as well as double-checked by health care provider.'}
          </p>
        </div>
      </div>

      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
