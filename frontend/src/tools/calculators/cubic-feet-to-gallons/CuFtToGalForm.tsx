'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DEFAULT_GALLON_UNIT,
  GALLON_UNIT_OPTIONS,
  type CuFtToGalFieldErrors,
  type CuFtToGalInput,
  type CuFtToGalSource,
  type GallonUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface CuFtToGalDraft {
  source: CuFtToGalSource;
  cubicFeet: string;
  gallons: string;
  gallonUnit: GallonUnit;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

export function emptyDraft(): CuFtToGalDraft {
  return {
    source: 'cubicFeet',
    cubicFeet: '',
    gallons: '',
    gallonUnit: DEFAULT_GALLON_UNIT,
  };
}

export function draftToInput(draft: CuFtToGalDraft): CuFtToGalInput {
  if (draft.source === 'cubicFeet') {
    return {
      source: 'cubicFeet',
      value: parseOptionalNumber(draft.cubicFeet),
      gallonUnit: draft.gallonUnit,
    };
  }
  return {
    source: 'gallons',
    value: parseOptionalNumber(draft.gallons),
    gallonUnit: draft.gallonUnit,
  };
}

interface CuFtToGalFormProps {
  draft: CuFtToGalDraft;
  errors: CuFtToGalFieldErrors;
  onDraftChange: (draft: CuFtToGalDraft) => void;
  onGallonUnitChange: (unit: GallonUnit) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function FieldShell({
  label,
  htmlFor,
  tip,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  tip?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
        {tip ? (
          <>
            {' '}
            <InfoTooltip label={label} text={tip} />
          </>
        ) : null}
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

export function CuFtToGalForm({
  draft,
  errors,
  onDraftChange,
  onGallonUnitChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CuFtToGalFormProps) {
  const set = (patch: Partial<CuFtToGalDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact definitions: 1 ft³ = 0.028316846592 m³. Choose US liquid or UK imperial gallons — they
        are not the same size.
      </div>

      <FieldShell
        label="Cubic feet"
        htmlFor="cu-ft-gal-ft3"
        tip="Enter a volume in cubic feet. Gallons update using the selected US or UK gallon."
        error={errors.cubicFeet}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cu-ft-gal-ft3"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.cubicFeet}
              placeholder="Enter volume"
              aria-invalid={Boolean(errors.cubicFeet)}
              onChange={(event) => set({ source: 'cubicFeet', cubicFeet: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            ft³
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Gallons"
        htmlFor="cu-ft-gal-gal"
        tip="US liquid gallon = 3.785411784 L. UK imperial gallon = 4.54609 L."
        error={errors.gallons}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cu-ft-gal-gal"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.gallons}
              placeholder="Enter volume"
              aria-invalid={Boolean(errors.gallons)}
              aria-label={`Gallons (${draft.gallonUnit === 'uk' ? 'UK' : 'US'})`}
              onChange={(event) => set({ source: 'gallons', gallons: event.target.value })}
            />
          </div>
          <select
            className={`${selectClass} w-[7.5rem] shrink-0`}
            value={draft.gallonUnit}
            aria-label="Gallon system"
            onChange={(event) => onGallonUnitChange(event.target.value as GallonUnit)}
          >
            {GALLON_UNIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        1 ft³ ≈ 7.48052 US gal · 1 ft³ ≈ 6.22884 UK gal
      </p>

      {children}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
        <button type="submit" className="sr-only">
          Convert
        </button>
      </div>
    </form>
  );
}
