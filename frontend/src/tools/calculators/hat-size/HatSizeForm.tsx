'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  convertLengthFromCm,
  convertLengthToCm,
} from './calculation';
import { HatMeasureDiagram } from './HatMeasureDiagram';
import {
  CATEGORY_LABELS,
  FIT_LABELS,
  UNIT_LABELS,
  createEmptyInput,
  type HatCategory,
  type HatFitPreference,
  type HatLengthUnit,
  type HatSizeFieldErrors,
  type HatSizeInput,
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

interface HatSizeFormProps {
  input: HatSizeInput;
  errors: HatSizeFieldErrors;
  onChange: (next: HatSizeInput) => void;
}

export function HatSizeForm({ input, errors, onChange }: HatSizeFormProps) {
  const set = (patch: Partial<HatSizeInput>) =>
    onChange({ ...input, ...patch });

  const switchUnit = (next: HatLengthUnit) => {
    if (next === input.unit) return;
    const raw = input.headCircumference.trim();
    const n = Number(raw.replace(/,/g, ''));
    const patch: Partial<HatSizeInput> = { unit: next };
    if (raw !== '' && Number.isFinite(n)) {
      const cm = convertLengthToCm(n, input.unit);
      patch.headCircumference = String(
        Number(convertLengthFromCm(cm, next).toFixed(2)),
      );
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
        Find hat size from head circumference. Charts are illustrative — brands
        vary.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(createEmptyInput())}
          className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-accent hover:bg-muted/30"
        >
          Example (58 cm · adult)
        </button>
      </div>

      <fieldset>
        <legend className={labelClass}>
          My hat is meant for
          <InfoTooltip content="Adult and child charts use different circumference ranges." />
        </legend>
        <div className="flex flex-wrap gap-2">
          {(['adult', 'child'] as const).map((c) => (
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
                name="hat-category"
                checked={input.category === c}
                onChange={() => set({ category: c as HatCategory })}
                className="accent-primary"
              />
              {CATEGORY_LABELS[c]}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="hat-circ" className={labelClass}>
          Head circumference
          <InfoTooltip content="Measure above the eyebrows and ears, around the fullest part of the head." />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.headCircumference}>
            <input
              id="hat-circ"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.headCircumference}
              onChange={(e) => set({ headCircumference: e.target.value })}
              aria-invalid={Boolean(errors.headCircumference)}
            />
          </FieldShell>
          <select
            aria-label="Circumference unit"
            className="h-11 rounded-lg border border-border bg-white px-2 text-sm text-accent"
            value={input.unit}
            onChange={(e) => switchUnit(e.target.value as HatLengthUnit)}
          >
            {(Object.keys(UNIT_LABELS) as HatLengthUnit[]).map((u) => (
              <option key={u} value={u}>
                {UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
        {errors.headCircumference ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {errors.headCircumference}
          </p>
        ) : null}
      </div>

      <div>
        <button
          type="button"
          className="text-xs font-medium text-primary hover:underline"
          onClick={() => set({ showAdvanced: !input.showAdvanced })}
        >
          {input.showAdvanced ? 'Hide' : 'Show'} fit preference
        </button>
        {input.showAdvanced ? (
          <div className="mt-2">
            <label htmlFor="hat-fit" className={labelClass}>
              Preferred fit
              <InfoTooltip content="Advisory only — does not change your measured circumference." />
            </label>
            <select
              id="hat-fit"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent"
              value={input.fitPreference}
              onChange={(e) =>
                set({
                  fitPreference: e.target.value as HatFitPreference,
                })
              }
            >
              {(Object.keys(FIT_LABELS) as HatFitPreference[]).map((f) => (
                <option key={f} value={f}>
                  {FIT_LABELS[f]}
                </option>
              ))}
            </select>
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
          <div className="mt-2 space-y-2">
            <HatMeasureDiagram />
            <ol className="list-decimal space-y-1 pl-5 text-xs text-muted-foreground">
              <li>Use a flexible measuring tape (or non-stretch string).</li>
              <li>Wrap around the widest part of the head.</li>
              <li>Keep the tape above eyebrows and ears, level at the back.</li>
              <li>Snug but not tight; measure twice and average if needed.</li>
            </ol>
          </div>
        ) : null}
      </div>
    </form>
  );
}
