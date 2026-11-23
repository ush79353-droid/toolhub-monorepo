'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  cm2ToArea,
  cmToLength,
  cmToVti,
  lengthToCm,
  msToTime,
  timeToMs,
  vtiToCm,
} from './calculation';
import type {
  AreaUnit,
  LengthUnit,
  MitralValveAreaFieldErrors,
  MitralValveAreaInput,
  MitralValveAreaResult,
  MvaMethod,
  TimeUnit,
  VtiUnit,
} from './types';
import {
  AREA_UNIT_LABELS,
  LENGTH_UNIT_LABELS,
  METHOD_OPTIONS,
  switchMethod,
  TIME_UNIT_LABELS,
  VTI_UNIT_LABELS,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';

function FieldShell({
  error,
  muted,
  children,
}: {
  error?: string;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'border-border bg-muted/25' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

function parseLoose(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function formatField(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '';
  return String(Number(value.toFixed(digits)));
}

interface Props {
  input: MitralValveAreaInput;
  errors: MitralValveAreaFieldErrors;
  result: MitralValveAreaResult | null;
  onChange: (input: MitralValveAreaInput) => void;
  onLoadExample: () => void;
}

export function MitralValveAreaForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<MitralValveAreaInput>) =>
    onChange({ ...input, ...patch });

  const switchLvotUnit = (next: LengthUnit) => {
    if (next === input.lvotUnit) return;
    const raw = parseLoose(input.lvotValue);
    let nextValue = input.lvotValue;
    if (raw != null) {
      const cm = lengthToCm(raw, input.lvotUnit);
      if (cm != null) {
        nextValue = formatField(cmToLength(cm, next), next === 'mm' ? 1 : 2);
      }
    }
    set({ lvotUnit: next, lvotValue: nextValue });
  };

  const switchLvotVtiUnit = (next: VtiUnit) => {
    if (next === input.lvotVtiUnit) return;
    const raw = parseLoose(input.lvotVtiValue);
    let nextValue = input.lvotVtiValue;
    if (raw != null) {
      const cm = vtiToCm(raw, input.lvotVtiUnit);
      if (cm != null) {
        nextValue = formatField(cmToVti(cm, next), next === 'm' ? 4 : 2);
      }
    }
    set({ lvotVtiUnit: next, lvotVtiValue: nextValue });
  };

  const switchMitralVtiUnit = (next: VtiUnit) => {
    if (next === input.mitralVtiUnit) return;
    const raw = parseLoose(input.mitralVtiValue);
    let nextValue = input.mitralVtiValue;
    if (raw != null) {
      const cm = vtiToCm(raw, input.mitralVtiUnit);
      if (cm != null) {
        nextValue = formatField(cmToVti(cm, next), next === 'm' ? 4 : 2);
      }
    }
    set({ mitralVtiUnit: next, mitralVtiValue: nextValue });
  };

  const switchPhtUnit = (next: TimeUnit) => {
    if (next === input.phtUnit) return;
    const raw = parseLoose(input.phtValue);
    let nextValue = input.phtValue;
    if (raw != null) {
      const ms = timeToMs(raw, input.phtUnit);
      if (ms != null) {
        nextValue = formatField(msToTime(ms, next), next === 's' ? 3 : 0);
      }
    }
    set({ phtUnit: next, phtValue: nextValue });
  };

  const switchDtUnit = (next: TimeUnit) => {
    if (next === input.dtUnit) return;
    const raw = parseLoose(input.dtValue);
    let nextValue = input.dtValue;
    if (raw != null) {
      const ms = timeToMs(raw, input.dtUnit);
      if (ms != null) {
        nextValue = formatField(msToTime(ms, next), next === 's' ? 3 : 0);
      }
    }
    set({ dtUnit: next, dtValue: nextValue });
  };

  const areaDigits = input.areaUnit === 'mm2' ? 1 : 3;
  const lvotAreaDisplay =
    result?.lvotAreaCm2 != null
      ? formatField(cm2ToArea(result.lvotAreaCm2, input.areaUnit), areaDigits)
      : '';
  const mvaDisplay =
    result != null
      ? formatField(cm2ToArea(result.mvaCm2, input.areaUnit), areaDigits)
      : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Estimate mitral valve area from Doppler measurements.{' '}
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (2 cm · 20 cm · 40 cm → ≈ 1.571 cm²)
        </button>
      </p>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational Doppler MVA only. Entries stay in your browser. Significant
        regurgitation or altered compliance can invalidate pressure half-time
        and deceleration methods.
      </p>

      <div>
        <div className={labelClass}>
          <span>Method</span>
          <InfoTooltip
            label="Method"
            text="Continuity uses LVOT diameter and VTIs. Pressure half-time uses Hatle MVA = 220 / PHT. Deceleration derives PHT ≈ 0.29 × DT first."
          />
        </div>
        <div
          className="flex flex-col gap-2"
          role="radiogroup"
          aria-label="Mitral valve area method"
        >
          {METHOD_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-accent"
            >
              <input
                type="radio"
                name="mva-method"
                className="h-4 w-4 accent-primary"
                checked={input.method === opt.value}
                onChange={() =>
                  onChange(switchMethod(input, opt.value as MvaMethod))
                }
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {input.method === 'continuity' ? (
        <>
          <div>
            <label className={labelClass} htmlFor="mva-lvot">
              <span>LVOT diameter</span>
              <InfoTooltip
                label="LVOT diameter"
                text="Left ventricular outflow tract diameter. Converted to centimeters before π(d/2)²."
              />
            </label>
            <FieldShell error={errors.lvotValue}>
              <input
                id="mva-lvot"
                className={inputClass}
                inputMode="decimal"
                aria-label="LVOT diameter"
                value={input.lvotValue}
                aria-invalid={Boolean(errors.lvotValue)}
                onChange={(e) => set({ lvotValue: e.target.value })}
              />
              <select
                className={selectClass}
                aria-label="LVOT diameter unit"
                value={input.lvotUnit}
                onChange={(e) => switchLvotUnit(e.target.value as LengthUnit)}
              >
                {(Object.keys(LENGTH_UNIT_LABELS) as LengthUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {LENGTH_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </FieldShell>
            {errors.lvotValue ? (
              <p className="mt-1 text-xs text-rose-600">{errors.lvotValue}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="mva-lvot-vti">
              <span>LVOT VTI</span>
              <InfoTooltip
                label="LVOT VTI"
                text="Velocity-time integral in the LVOT (stroke distance proximal to the mitral valve on the continuity path)."
              />
            </label>
            <FieldShell error={errors.lvotVtiValue}>
              <input
                id="mva-lvot-vti"
                className={inputClass}
                inputMode="decimal"
                aria-label="LVOT VTI"
                value={input.lvotVtiValue}
                aria-invalid={Boolean(errors.lvotVtiValue)}
                onChange={(e) => set({ lvotVtiValue: e.target.value })}
              />
              <select
                className={selectClass}
                aria-label="LVOT VTI unit"
                value={input.lvotVtiUnit}
                onChange={(e) => switchLvotVtiUnit(e.target.value as VtiUnit)}
              >
                {(Object.keys(VTI_UNIT_LABELS) as VtiUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {VTI_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </FieldShell>
            {errors.lvotVtiValue ? (
              <p className="mt-1 text-xs text-rose-600">{errors.lvotVtiValue}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="mva-mv-vti">
              <span>Mitral valve VTI</span>
              <InfoTooltip
                label="Mitral valve VTI"
                text="Velocity-time integral of transmitral flow. Must be positive; zero makes MVA undefined."
              />
            </label>
            <FieldShell error={errors.mitralVtiValue}>
              <input
                id="mva-mv-vti"
                className={inputClass}
                inputMode="decimal"
                aria-label="Mitral valve VTI"
                value={input.mitralVtiValue}
                aria-invalid={Boolean(errors.mitralVtiValue)}
                onChange={(e) => set({ mitralVtiValue: e.target.value })}
              />
              <select
                className={selectClass}
                aria-label="Mitral valve VTI unit"
                value={input.mitralVtiUnit}
                onChange={(e) => switchMitralVtiUnit(e.target.value as VtiUnit)}
              >
                {(Object.keys(VTI_UNIT_LABELS) as VtiUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {VTI_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </FieldShell>
            {errors.mitralVtiValue ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.mitralVtiValue}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="mva-lvot-area">
              <span>LVOT area</span>
              <InfoTooltip
                label="LVOT area"
                text="Derived circular CSA: π × (diameter in cm ÷ 2)². Read-only."
              />
            </label>
            <FieldShell muted>
              <input
                id="mva-lvot-area"
                className={`${inputClass} text-muted-foreground`}
                readOnly
                tabIndex={0}
                aria-label="LVOT area result"
                value={lvotAreaDisplay}
              />
              <select
                className={selectClass}
                aria-label="Area unit"
                value={input.areaUnit}
                onChange={(e) => set({ areaUnit: e.target.value as AreaUnit })}
              >
                {(Object.keys(AREA_UNIT_LABELS) as AreaUnit[]).map((u) => (
                  <option key={u} value={u}>
                    {AREA_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </FieldShell>
          </div>
        </>
      ) : null}

      {input.method === 'pht' ? (
        <div>
          <label className={labelClass} htmlFor="mva-pht">
            <span>Pressure half-time</span>
            <InfoTooltip
              label="Pressure half-time"
              text="Time for the transmitral pressure gradient to fall to half its peak (Hatle). MVA = 220 / PHT in milliseconds."
            />
          </label>
          <FieldShell error={errors.phtValue}>
            <input
              id="mva-pht"
              className={inputClass}
              inputMode="decimal"
              aria-label="Pressure half-time"
              value={input.phtValue}
              aria-invalid={Boolean(errors.phtValue)}
              onChange={(e) => set({ phtValue: e.target.value })}
            />
            <select
              className={selectClass}
              aria-label="Pressure half-time unit"
              value={input.phtUnit}
              onChange={(e) => switchPhtUnit(e.target.value as TimeUnit)}
            >
              {(Object.keys(TIME_UNIT_LABELS) as TimeUnit[]).map((u) => (
                <option key={u} value={u}>
                  {TIME_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.phtValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.phtValue}</p>
          ) : null}
        </div>
      ) : null}

      {input.method === 'deceleration' ? (
        <div>
          <label className={labelClass} htmlFor="mva-dt">
            <span>Deceleration time</span>
            <InfoTooltip
              label="Deceleration time"
              text="Mitral E-wave deceleration time. Approximate PHT ≈ 0.29 × DT, then MVA = 220 / PHT."
            />
          </label>
          <FieldShell error={errors.dtValue}>
            <input
              id="mva-dt"
              className={inputClass}
              inputMode="decimal"
              aria-label="Deceleration time"
              value={input.dtValue}
              aria-invalid={Boolean(errors.dtValue)}
              onChange={(e) => set({ dtValue: e.target.value })}
            />
            <select
              className={selectClass}
              aria-label="Deceleration time unit"
              value={input.dtUnit}
              onChange={(e) => switchDtUnit(e.target.value as TimeUnit)}
            >
              {(Object.keys(TIME_UNIT_LABELS) as TimeUnit[]).map((u) => (
                <option key={u} value={u}>
                  {TIME_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.dtValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.dtValue}</p>
          ) : null}
        </div>
      ) : null}

      <div>
        <label className={labelClass} htmlFor="mva-result">
          <span>Mitral valve area (MVA)</span>
          <InfoTooltip
            label="MVA"
            text="Estimated mitral valve area. Display unit can be cm² or mm²; underlying math stays in cm²."
          />
        </label>
        <FieldShell muted>
          <input
            id="mva-result"
            className={`${inputClass} text-muted-foreground`}
            readOnly
            tabIndex={0}
            aria-label="Mitral valve area result"
            value={mvaDisplay}
          />
          <select
            className={selectClass}
            aria-label="MVA unit"
            value={input.areaUnit}
            onChange={(e) => set({ areaUnit: e.target.value as AreaUnit })}
          >
            {(Object.keys(AREA_UNIT_LABELS) as AreaUnit[]).map((u) => (
              <option key={u} value={u}>
                {AREA_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {result ? (
          <p className="mt-1.5 text-xs text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
        {errors.form ? (
          <p className="mt-1 text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </div>

      {result ? (
        <p className="rounded-lg border border-border bg-muted/15 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
          {result.limitationNote}
        </p>
      ) : null}
    </form>
  );
}
