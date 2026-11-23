'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AreaUnit,
  FlowUnit,
  GorlinFieldErrors,
  GorlinInput,
  GorlinResult,
  PeriodUnit,
  PressureUnit,
} from './types';
import {
  AREA_UNIT_LABELS,
  FLOW_UNIT_LABELS,
  PERIOD_UNIT_LABELS,
  PRESSURE_UNIT_LABELS,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
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
  input: GorlinInput;
  errors: GorlinFieldErrors;
  result: GorlinResult | null;
  onChange: (input: GorlinInput) => void;
  onLoadExample: () => void;
}

export function GorlinFormulaForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<GorlinInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Enter shared flow and rate, then aortic and/or mitral hemodynamics.
      </p>
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational Gorlin areas (aortic K=44.3, mitral K=37.7). Not a
        catheterization report. Values stay in your browser only.
      </p>
      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load aortic example (5 L/min · 75 bpm · 0.30 s · 40 mmHg → ≈0.79 cm²)
        </button>
      </p>

      <div className="space-y-3 rounded-xl border border-border p-3">
        <div>
          <label className={labelClass} htmlFor="gorlin-co">
            Cardiac output
          </label>
          <FieldShell error={errors.cardiacOutput}>
            <input
              id="gorlin-co"
              className={inputClass}
              inputMode="decimal"
              value={input.cardiacOutput}
              aria-invalid={Boolean(errors.cardiacOutput)}
              onChange={(e) => set({ cardiacOutput: e.target.value })}
            />
            <select
              className={selectClass}
              aria-label="Cardiac output unit"
              value={input.cardiacOutputUnit}
              onChange={(e) =>
                set({ cardiacOutputUnit: e.target.value as FlowUnit })
              }
            >
              {(Object.keys(FLOW_UNIT_LABELS) as FlowUnit[]).map((u) => (
                <option key={u} value={u}>
                  {FLOW_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.cardiacOutput ? (
            <p className="mt-1 text-xs text-rose-600">{errors.cardiacOutput}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="gorlin-hr">
            Heart rate
          </label>
          <FieldShell error={errors.heartRate}>
            <input
              id="gorlin-hr"
              className={inputClass}
              inputMode="decimal"
              value={input.heartRate}
              aria-invalid={Boolean(errors.heartRate)}
              onChange={(e) => set({ heartRate: e.target.value })}
            />
            <span className="shrink-0 px-3 text-sm text-muted-foreground">
              bpm
            </span>
          </FieldShell>
          {errors.heartRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heartRate}</p>
          ) : null}
        </div>
      </div>

      <fieldset className="space-y-3 rounded-xl border border-border p-3">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Aortic valve
        </legend>
        <div>
          <label className={labelClass} htmlFor="gorlin-a-grad">
            Aortic mean pressure gradient
          </label>
          <FieldShell error={errors.aorticGradient}>
            <input
              id="gorlin-a-grad"
              className={inputClass}
              inputMode="decimal"
              value={input.aorticGradient}
              onChange={(e) => set({ aorticGradient: e.target.value })}
            />
            <select
              className={selectClass}
              aria-label="Aortic gradient unit"
              value={input.aorticGradientUnit}
              onChange={(e) =>
                set({ aorticGradientUnit: e.target.value as PressureUnit })
              }
            >
              {(Object.keys(PRESSURE_UNIT_LABELS) as PressureUnit[]).map(
                (u) => (
                  <option key={u} value={u}>
                    {PRESSURE_UNIT_LABELS[u]}
                  </option>
                )
              )}
            </select>
          </FieldShell>
        </div>
        <div>
          <label className={labelClass} htmlFor="gorlin-sep">
            <span>Systolic ejection period</span>
            <InfoTooltip
              label="SEP"
              text="Seconds per beat that the aortic valve is open (from aortic opening to closure on the pressure tracing)."
            />
          </label>
          <FieldShell error={errors.systolicEjectionPeriod}>
            <input
              id="gorlin-sep"
              className={inputClass}
              inputMode="decimal"
              value={input.systolicEjectionPeriod}
              onChange={(e) => set({ systolicEjectionPeriod: e.target.value })}
            />
            <select
              className={selectClass}
              aria-label="SEP unit"
              value={input.systolicEjectionPeriodUnit}
              onChange={(e) =>
                set({
                  systolicEjectionPeriodUnit: e.target.value as PeriodUnit,
                })
              }
            >
              {(Object.keys(PERIOD_UNIT_LABELS) as PeriodUnit[]).map((u) => (
                <option key={u} value={u}>
                  {PERIOD_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
            <span className="shrink-0 pr-2 text-xs text-muted-foreground">
              /beat
            </span>
          </FieldShell>
        </div>
        <div>
          <label className={labelClass} htmlFor="gorlin-ava">
            Aortic valve area (AVA)
          </label>
          <FieldShell>
            <input
              id="gorlin-ava"
              className={`${inputClass} text-muted-foreground`}
              readOnly
              value={result?.aortic?.formattedArea ?? ''}
              aria-label="Aortic valve area result"
            />
            <select
              className={selectClass}
              aria-label="AVA unit"
              value={input.aorticAreaUnit}
              onChange={(e) =>
                set({ aorticAreaUnit: e.target.value as AreaUnit })
              }
            >
              {(Object.keys(AREA_UNIT_LABELS) as AreaUnit[]).map((u) => (
                <option key={u} value={u}>
                  {AREA_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border p-3">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Mitral valve
        </legend>
        <div>
          <label className={labelClass} htmlFor="gorlin-m-grad">
            Mitral mean pressure gradient
          </label>
          <FieldShell error={errors.mitralGradient}>
            <input
              id="gorlin-m-grad"
              className={inputClass}
              inputMode="decimal"
              value={input.mitralGradient}
              onChange={(e) => set({ mitralGradient: e.target.value })}
            />
            <select
              className={selectClass}
              aria-label="Mitral gradient unit"
              value={input.mitralGradientUnit}
              onChange={(e) =>
                set({ mitralGradientUnit: e.target.value as PressureUnit })
              }
            >
              {(Object.keys(PRESSURE_UNIT_LABELS) as PressureUnit[]).map(
                (u) => (
                  <option key={u} value={u}>
                    {PRESSURE_UNIT_LABELS[u]}
                  </option>
                )
              )}
            </select>
          </FieldShell>
        </div>
        <div>
          <label className={labelClass} htmlFor="gorlin-dfp">
            <span>Diastolic filling period</span>
            <InfoTooltip
              label="DFP"
              text="Seconds per beat that the mitral valve is open (diastolic filling period on the pressure tracing)."
            />
          </label>
          <FieldShell error={errors.diastolicFillingPeriod}>
            <input
              id="gorlin-dfp"
              className={inputClass}
              inputMode="decimal"
              value={input.diastolicFillingPeriod}
              onChange={(e) => set({ diastolicFillingPeriod: e.target.value })}
            />
            <select
              className={selectClass}
              aria-label="DFP unit"
              value={input.diastolicFillingPeriodUnit}
              onChange={(e) =>
                set({
                  diastolicFillingPeriodUnit: e.target.value as PeriodUnit,
                })
              }
            >
              {(Object.keys(PERIOD_UNIT_LABELS) as PeriodUnit[]).map((u) => (
                <option key={u} value={u}>
                  {PERIOD_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
            <span className="shrink-0 pr-2 text-xs text-muted-foreground">
              /beat
            </span>
          </FieldShell>
        </div>
        <div>
          <label className={labelClass} htmlFor="gorlin-mva">
            Mitral valve area (MVA)
          </label>
          <FieldShell>
            <input
              id="gorlin-mva"
              className={`${inputClass} text-muted-foreground`}
              readOnly
              value={result?.mitral?.formattedArea ?? ''}
              aria-label="Mitral valve area result"
            />
            <select
              className={selectClass}
              aria-label="MVA unit"
              value={input.mitralAreaUnit}
              onChange={(e) =>
                set({ mitralAreaUnit: e.target.value as AreaUnit })
              }
            >
              {(Object.keys(AREA_UNIT_LABELS) as AreaUnit[]).map((u) => (
                <option key={u} value={u}>
                  {AREA_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>
      </fieldset>
      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
