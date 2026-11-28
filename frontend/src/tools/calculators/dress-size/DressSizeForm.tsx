'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertFromCm, convertToCm } from './calculation';
import { DressMeasureDiagram } from './DressMeasureDiagram';
import {
  FIT_LABELS,
  SYSTEM_LABELS,
  UNIT_LABELS,
  createEmptyInput,
  type DressSizeFieldErrors,
  type DressSizeInput,
  type DressSizingSystem,
  type FitPreference,
  type MeasurementUnit,
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

interface DressSizeFormProps {
  input: DressSizeInput;
  errors: DressSizeFieldErrors;
  onChange: (next: DressSizeInput) => void;
}

export function DressSizeForm({
  input,
  errors,
  onChange,
}: DressSizeFormProps) {
  const set = (patch: Partial<DressSizeInput>) =>
    onChange({ ...input, ...patch });

  const switchUnit = (next: MeasurementUnit) => {
    if (next === input.unit) return;
    const patch: Partial<DressSizeInput> = { unit: next };
    for (const key of ['bust', 'waist', 'hips'] as const) {
      const raw = input[key].trim();
      const n = Number(raw.replace(/,/g, ''));
      if (raw !== '' && Number.isFinite(n)) {
        const cm = convertToCm(n, input.unit);
        patch[key] = String(
          Number(convertFromCm(cm, next).toFixed(next === 'in' ? 2 : 1)),
        );
      }
    }
    set(patch);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Estimate dress size from bust, waist, and hips using an illustrative
        international chart. Brands vary — treat this as a starting point.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (96 / 78 / 102 cm)
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_150px]">
        <div className="space-y-3">
          <h3 className="text-[13px] font-semibold text-accent">
            Your measurements
          </h3>

          <div>
            <label className={labelClass} htmlFor="ds-unit">
              Units
            </label>
            <select
              id="ds-unit"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
              value={input.unit}
              onChange={(e) =>
                switchUnit(e.target.value as MeasurementUnit)
              }
            >
              {(Object.keys(UNIT_LABELS) as MeasurementUnit[]).map((u) => (
                <option key={u} value={u}>
                  {UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="ds-bust">
              Bust
              <InfoTooltip content="Measure around the fullest part of your bust. Keep the tape parallel to the floor." />
            </label>
            <FieldShell error={errors.bust}>
              <input
                id="ds-bust"
                className={inputClass}
                inputMode="decimal"
                value={input.bust}
                onFocus={() => set({ focusMeasure: 'bust' })}
                onBlur={() => set({ focusMeasure: null })}
                onChange={(e) => set({ bust: e.target.value })}
              />
              <span className="border-l border-border px-2 text-xs text-muted-foreground">
                {UNIT_LABELS[input.unit]}
              </span>
            </FieldShell>
            {errors.bust ? (
              <p className="mt-1 text-xs text-rose-600">{errors.bust}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="ds-waist">
              Waist
              <InfoTooltip content="Measure around your natural waistline — usually the narrowest part of the torso." />
            </label>
            <FieldShell error={errors.waist}>
              <input
                id="ds-waist"
                className={inputClass}
                inputMode="decimal"
                value={input.waist}
                onFocus={() => set({ focusMeasure: 'waist' })}
                onBlur={() => set({ focusMeasure: null })}
                onChange={(e) => set({ waist: e.target.value })}
              />
              <span className="border-l border-border px-2 text-xs text-muted-foreground">
                {UNIT_LABELS[input.unit]}
              </span>
            </FieldShell>
            {errors.waist ? (
              <p className="mt-1 text-xs text-rose-600">{errors.waist}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="ds-hips">
              Hips
              <InfoTooltip content="Measure around the fullest part of your hips and seat with feet together." />
            </label>
            <FieldShell error={errors.hips}>
              <input
                id="ds-hips"
                className={inputClass}
                inputMode="decimal"
                value={input.hips}
                onFocus={() => set({ focusMeasure: 'hips' })}
                onBlur={() => set({ focusMeasure: null })}
                onChange={(e) => set({ hips: e.target.value })}
              />
              <span className="border-l border-border px-2 text-xs text-muted-foreground">
                {UNIT_LABELS[input.unit]}
              </span>
            </FieldShell>
            {errors.hips ? (
              <p className="mt-1 text-xs text-rose-600">{errors.hips}</p>
            ) : null}
          </div>
        </div>
        <DressMeasureDiagram focus={input.focusMeasure} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="ds-sys">
            Preferred sizing system
          </label>
          <select
            id="ds-sys"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
            value={input.preferredSystem}
            onChange={(e) =>
              set({
                preferredSystem: e.target.value as DressSizingSystem,
              })
            }
          >
            {(Object.keys(SYSTEM_LABELS) as DressSizingSystem[]).map((s) => (
              <option key={s} value={s}>
                {SYSTEM_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="ds-fit">
            Preferred fit
            <InfoTooltip content="Guidance only — does not change the chart-based size unless you choose differently." />
          </label>
          <select
            id="ds-fit"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
            value={input.fitPreference}
            onChange={(e) =>
              set({ fitPreference: e.target.value as FitPreference })
            }
          >
            {(Object.keys(FIT_LABELS) as FitPreference[]).map((f) => (
              <option key={f} value={f}>
                {FIT_LABELS[f]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </form>
  );
}
