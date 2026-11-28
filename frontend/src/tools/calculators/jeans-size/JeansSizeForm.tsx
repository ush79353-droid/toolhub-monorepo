'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertLengthFromCm,
  convertLengthToCm,
} from './calculation';
import { JeansMeasureDiagram } from './JeansMeasureDiagram';
import {
  CATEGORY_LABELS,
  FIT_LABELS,
  METHOD_LABELS,
  REGION_LABELS,
  RISE_LABELS,
  UNIT_LABELS,
  createEmptyInput,
  type JeansFit,
  type JeansMeasurementMethod,
  type JeansRegion,
  type JeansRise,
  type JeansSizeFieldErrors,
  type JeansSizeInput,
  type JeansSizingCategory,
  type JeansUnit,
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

interface JeansSizeFormProps {
  input: JeansSizeInput;
  errors: JeansSizeFieldErrors;
  onChange: (next: JeansSizeInput) => void;
}

export function JeansSizeForm({
  input,
  errors,
  onChange,
}: JeansSizeFormProps) {
  const set = (patch: Partial<JeansSizeInput>) =>
    onChange({ ...input, ...patch });

  const switchWaistUnit = (next: JeansUnit) => {
    if (next === input.waistUnit) return;
    const raw = input.waist.trim();
    const n = Number(raw.replace(/,/g, ''));
    const patch: Partial<JeansSizeInput> = { waistUnit: next };
    if (raw !== '' && Number.isFinite(n)) {
      const cm = convertLengthToCm(n, input.waistUnit);
      patch.waist = String(Number(convertLengthFromCm(cm, next).toFixed(1)));
    }
    set(patch);
  };

  const switchInseamUnit = (next: JeansUnit) => {
    if (next === input.inseamUnit) return;
    const raw = input.inseam.trim();
    const n = Number(raw.replace(/,/g, ''));
    const patch: Partial<JeansSizeInput> = { inseamUnit: next };
    if (raw !== '' && Number.isFinite(n)) {
      const cm = convertLengthToCm(n, input.inseamUnit);
      patch.inseam = String(Number(convertLengthFromCm(cm, next).toFixed(1)));
    }
    set(patch);
  };

  const switchHipsUnit = (next: JeansUnit) => {
    if (next === input.hipsUnit) return;
    const raw = input.hips.trim();
    const n = Number(raw.replace(/,/g, ''));
    const patch: Partial<JeansSizeInput> = { hipsUnit: next };
    if (raw !== '' && Number.isFinite(n)) {
      const cm = convertLengthToCm(n, input.hipsUnit);
      patch.hips = String(Number(convertLengthFromCm(cm, next).toFixed(1)));
    }
    set(patch);
  };

  const waistLabel =
    input.measurementMethod === 'existing-jeans'
      ? 'Flat waistband width'
      : 'Waist circumference';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Find jeans W × L from waist and inseam. Charts are illustrative —
        brands, rise, and stretch vary. Sizing category is a chart choice, not
        an identity label.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (70 cm · women)
        </button>
      </div>

      <fieldset>
        <legend className={labelClass}>Jeans sizing</legend>
        <div className="flex flex-wrap gap-2">
          {(['women', 'men'] as const).map((c) => (
            <label
              key={c}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                input.category === c
                  ? 'border-primary bg-primary/5 text-accent'
                  : 'border-border bg-white text-muted-foreground'
              }`}
            >
              <input
                type="radio"
                name="jeans-category"
                checked={input.category === c}
                onChange={() => set({ category: c as JeansSizingCategory })}
                className="accent-primary"
              />
              {CATEGORY_LABELS[c]}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelClass}>I&apos;m measuring</legend>
        <div className="flex flex-wrap gap-2">
          {(['body', 'existing-jeans'] as const).map((m) => (
            <label
              key={m}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                input.measurementMethod === m
                  ? 'border-primary bg-primary/5 text-accent'
                  : 'border-border bg-white text-muted-foreground'
              }`}
            >
              <input
                type="radio"
                name="jeans-method"
                checked={input.measurementMethod === m}
                onChange={() =>
                  set({ measurementMethod: m as JeansMeasurementMethod })
                }
                className="accent-primary"
              />
              {METHOD_LABELS[m]}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="jn-waist" className={labelClass}>
          {waistLabel}
          <InfoTooltip
            content={
              input.measurementMethod === 'existing-jeans'
                ? 'Laid-flat waistband width; circumference ≈ 2 × flat width.'
                : 'Measure around the intended waistband position.'
            }
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.waist}>
            <input
              id="jn-waist"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.waist}
              onChange={(e) => set({ waist: e.target.value })}
            />
          </FieldShell>
          <select
            aria-label="Waist unit"
            className="h-11 rounded-lg border border-border bg-white px-2 text-sm"
            value={input.waistUnit}
            onChange={(e) => switchWaistUnit(e.target.value as JeansUnit)}
          >
            {(Object.keys(UNIT_LABELS) as JeansUnit[]).map((u) => (
              <option key={u} value={u}>
                {UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
        {errors.waist ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {errors.waist}
          </p>
        ) : (
          <p className="mt-1 text-[11px] text-muted-foreground">
            {input.measurementMethod === 'existing-jeans'
              ? 'Garment measurement — not automatically equal to body waist.'
              : 'Measure where the jeans will sit (rise affects position).'}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="jn-inseam" className={labelClass}>
          Inseam length
          <InfoTooltip content="From crotch seam to bottom hem along the inside leg." />
        </label>
        <p className="mb-1.5 text-[11px] text-muted-foreground">
          Measure from the crotch seam to the bottom hem along the inside leg.
        </p>
        <div className="flex gap-2">
          <FieldShell error={errors.inseam}>
            <input
              id="jn-inseam"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.inseam}
              onChange={(e) => set({ inseam: e.target.value })}
            />
          </FieldShell>
          <select
            aria-label="Inseam unit"
            className="h-11 rounded-lg border border-border bg-white px-2 text-sm"
            value={input.inseamUnit}
            onChange={(e) => switchInseamUnit(e.target.value as JeansUnit)}
          >
            {(Object.keys(UNIT_LABELS) as JeansUnit[]).map((u) => (
              <option key={u} value={u}>
                {UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
        {errors.inseam ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {errors.inseam}
          </p>
        ) : null}
      </div>

      <div>
        <button
          type="button"
          className="text-xs font-medium text-primary hover:underline"
          onClick={() => set({ showAdvanced: !input.showAdvanced })}
        >
          {input.showAdvanced ? 'Hide' : 'Show'} advanced (hips · fit · rise ·
          region)
        </button>
        {input.showAdvanced ? (
          <div className="mt-3 space-y-3 rounded-lg border border-border bg-muted/10 p-3">
            <div>
              <label htmlFor="jn-hips" className={labelClass}>
                Hip circumference (optional)
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.hips}>
                  <input
                    id="jn-hips"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.hips}
                    onChange={(e) => set({ hips: e.target.value })}
                  />
                </FieldShell>
                <select
                  aria-label="Hips unit"
                  className="h-11 rounded-lg border border-border bg-white px-2 text-sm"
                  value={input.hipsUnit}
                  onChange={(e) => switchHipsUnit(e.target.value as JeansUnit)}
                >
                  {(Object.keys(UNIT_LABELS) as JeansUnit[]).map((u) => (
                    <option key={u} value={u}>
                      {UNIT_LABELS[u]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <label htmlFor="jn-fit" className={labelClass}>
                  Preferred fit
                </label>
                <select
                  id="jn-fit"
                  className="h-11 w-full rounded-lg border border-border bg-white px-2 text-sm"
                  value={input.fit}
                  onChange={(e) => set({ fit: e.target.value as JeansFit })}
                >
                  {(Object.keys(FIT_LABELS) as JeansFit[]).map((f) => (
                    <option key={f} value={f}>
                      {FIT_LABELS[f]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="jn-rise" className={labelClass}>
                  Jeans rise
                </label>
                <select
                  id="jn-rise"
                  className="h-11 w-full rounded-lg border border-border bg-white px-2 text-sm"
                  value={input.rise}
                  onChange={(e) => set({ rise: e.target.value as JeansRise })}
                >
                  {(Object.keys(RISE_LABELS) as JeansRise[]).map((r) => (
                    <option key={r} value={r}>
                      {RISE_LABELS[r]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="jn-region" className={labelClass}>
                  Preferred region
                </label>
                <select
                  id="jn-region"
                  className="h-11 w-full rounded-lg border border-border bg-white px-2 text-sm"
                  value={input.preferredRegion}
                  onChange={(e) =>
                    set({ preferredRegion: e.target.value as JeansRegion })
                  }
                >
                  {(Object.keys(REGION_LABELS) as JeansRegion[]).map((r) => (
                    <option key={r} value={r}>
                      {REGION_LABELS[r]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div>
        <button
          type="button"
          className="text-xs font-medium text-primary hover:underline"
          onClick={() => set({ showMeasureHelp: !input.showMeasureHelp })}
        >
          {input.showMeasureHelp ? 'Hide' : 'Show'} measuring guide
        </button>
        {input.showMeasureHelp ? (
          <div className="mt-2">
            <JeansMeasureDiagram method={input.measurementMethod} />
          </div>
        ) : null}
      </div>
    </form>
  );
}
