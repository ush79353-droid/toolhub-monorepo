'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import {
  defaultUnitsForDimension,
  formatMeasure,
  unitLabel,
  unitsForDimension,
} from './calculation';
import { ScaleIllustration } from './ScaleIllustration';
import {
  type ScaleDimension,
  type ScaleFieldErrors,
  type ScaleMode,
  type ScaleUnit,
} from './types';

export interface ScaleDraft {
  dimension: ScaleDimension;
  mode: ScaleMode;
  scaledValue: string;
  realValue: string;
  scaleInput: string;
  scaledUnit: ScaleUnit;
  realUnit: ScaleUnit;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring';

export function emptyDraft(): ScaleDraft {
  const units = defaultUnitsForDimension('length');
  return {
    dimension: 'length',
    mode: 'scale-factor',
    scaledValue: '',
    realValue: '',
    scaleInput: '',
    scaledUnit: units.scaledUnit,
    realUnit: units.realUnit,
  };
}

interface ScaleFormProps {
  draft: ScaleDraft;
  errors: ScaleFieldErrors;
  calculatedScaled: string | null;
  calculatedReal: string | null;
  calculatedScale: string | null;
  scaleRatio: string | null;
  scaleKind: string | null;
  onDraftChange: (draft: ScaleDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  onApplyExample: (id: 1 | 2 | 3) => void;
}

function FieldShell({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function radioClass(selected: boolean): string {
  return `flex h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm ${
    selected ? 'border-primary bg-primary/5 text-accent' : 'border-border'
  }`;
}

function measureLabel(dimension: ScaleDimension, side: 'scaled' | 'real'): string {
  const noun =
    dimension === 'area' ? 'area' : dimension === 'volume' ? 'volume' : 'length';
  return side === 'scaled' ? `Scaled ${noun}` : `Real ${noun}`;
}

export function ScaleForm({
  draft,
  errors,
  calculatedScaled,
  calculatedReal,
  calculatedScale,
  scaleRatio,
  scaleKind,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onApplyExample,
}: ScaleFormProps) {
  const set = (patch: Partial<ScaleDraft>) => onDraftChange({ ...draft, ...patch });
  const units = unitsForDimension(draft.dimension);
  const scaledReadOnly = draft.mode === 'scaled-measurement';
  const realReadOnly = draft.mode === 'real-measurement';
  const scaleReadOnly = draft.mode === 'scale-factor';

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Convert between scaled drawings/maps and real-world sizes. Length uses linear scale{' '}
        <span className="font-mono">k</span>; area uses <span className="font-mono">k²</span>; volume
        uses <span className="font-mono">k³</span>. Ratios like <span className="font-mono">1:100</span>{' '}
        mean scaled ÷ real for length.
      </div>

      <ScaleIllustration />
      <p className="sr-only">
        Diagram comparing a scaled map or drawing on the left with the corresponding real-world
        object on the right, linked by a scale relationship that may enlarge or reduce.
      </p>

      <fieldset>
        <legend className={labelClass}>Conversion type</legend>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {(
            [
              ['length', 'Length'],
              ['area', 'Area'],
              ['volume', 'Volume'],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className={radioClass(draft.dimension === value)}>
              <input
                type="radio"
                name="scale-dimension"
                checked={draft.dimension === value}
                onChange={() => {
                  const nextUnits = defaultUnitsForDimension(value);
                  set({
                    dimension: value,
                    scaledUnit: nextUnits.scaledUnit,
                    realUnit: nextUnits.realUnit,
                  });
                }}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelClass}>Want to calculate…</legend>
        <div className="mt-2 space-y-2">
          {(
            [
              ['scale-factor', 'Scale factor'],
              ['scaled-measurement', 'Scaled measurement'],
              ['real-measurement', 'Real measurement'],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className={radioClass(draft.mode === value)}>
              <input
                type="radio"
                name="scale-mode"
                checked={draft.mode === value}
                onChange={() => set({ mode: value })}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <FieldShell
        label={measureLabel(draft.dimension, 'scaled')}
        htmlFor="scale-scaled"
        error={errors.scaledValue}
      >
        <div className="flex gap-2">
          <div
            className={`min-w-0 flex-1 rounded-lg border border-border focus-within:ring-2 focus-within:ring-ring ${
              scaledReadOnly ? 'bg-muted/40' : 'bg-white'
            }`}
          >
            <input
              id="scale-scaled"
              inputMode="decimal"
              className={inputClass}
              value={scaledReadOnly ? calculatedScaled ?? '' : draft.scaledValue}
              readOnly={scaledReadOnly}
              placeholder="Enter value"
              aria-invalid={Boolean(errors.scaledValue)}
              onChange={(event) => set({ scaledValue: event.target.value })}
            />
          </div>
          <select
            className={selectClass}
            aria-label="Scaled measurement unit"
            value={draft.scaledUnit}
            onChange={(event) => set({ scaledUnit: event.target.value as ScaleUnit })}
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unitLabel(unit, draft.dimension)}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <FieldShell
        label={measureLabel(draft.dimension, 'real')}
        htmlFor="scale-real"
        error={errors.realValue}
      >
        <div className="flex gap-2">
          <div
            className={`min-w-0 flex-1 rounded-lg border border-border focus-within:ring-2 focus-within:ring-ring ${
              realReadOnly ? 'bg-muted/40' : 'bg-white'
            }`}
          >
            <input
              id="scale-real"
              inputMode="decimal"
              className={inputClass}
              value={realReadOnly ? calculatedReal ?? '' : draft.realValue}
              readOnly={realReadOnly}
              placeholder="Enter value"
              aria-invalid={Boolean(errors.realValue)}
              onChange={(event) => set({ realValue: event.target.value })}
            />
          </div>
          <select
            className={selectClass}
            aria-label="Real measurement unit"
            value={draft.realUnit}
            onChange={(event) => set({ realUnit: event.target.value as ScaleUnit })}
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unitLabel(unit, draft.dimension)}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <FieldShell
        label={scaleReadOnly ? 'Required scale factor' : 'Scale factor'}
        htmlFor="scale-k"
        error={errors.scaleInput || errors.units}
      >
        <div
          className={`rounded-lg border border-border focus-within:ring-2 focus-within:ring-ring ${
            scaleReadOnly ? 'bg-muted/40' : 'bg-white'
          }`}
        >
          <input
            id="scale-k"
            inputMode="text"
            className={inputClass}
            value={
              scaleReadOnly
                ? calculatedScale
                  ? `${formatMeasure(Number(calculatedScale), 'length')}${
                      scaleRatio ? `  (${scaleRatio})` : ''
                    }`
                  : ''
                : draft.scaleInput
            }
            readOnly={scaleReadOnly}
            placeholder="e.g. 1:100 or 0.01"
            aria-invalid={Boolean(errors.scaleInput)}
            onChange={(event) => set({ scaleInput: event.target.value })}
          />
        </div>
        {scaleKind && scaleRatio && !scaleReadOnly ? (
          <p className="text-xs text-muted-foreground">
            {scaleKind} · {scaleRatio}
          </p>
        ) : null}
        {scaleKind && scaleReadOnly && calculatedScale ? (
          <p className="text-xs text-muted-foreground">{scaleKind}</p>
        ) : null}
      </FieldShell>

      <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-3.5">
        <p className="text-sm font-medium text-accent">Check our examples:</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          <li>
            <button
              type="button"
              className="text-left text-primary underline-offset-2 hover:underline"
              onClick={() => onApplyExample(1)}
            >
              Example 1 — Map scale (5 cm → 10 m → 1:200)
            </button>
          </li>
          <li>
            <button
              type="button"
              className="text-left text-primary underline-offset-2 hover:underline"
              onClick={() => onApplyExample(2)}
            >
              Example 2 — Drawing at 1:100 (2.5 cm → 2.5 m)
            </button>
          </li>
          <li>
            <button
              type="button"
              className="text-left text-primary underline-offset-2 hover:underline"
              onClick={() => onApplyExample(3)}
            >
              Example 3 — Area at 1:10 (100 m² → 1 m²)
            </button>
          </li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
