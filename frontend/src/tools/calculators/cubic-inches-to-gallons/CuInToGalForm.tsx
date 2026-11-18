'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DEFAULT_GALLON_KIND,
  DEFAULT_OTHER_UNIT,
  GALLON_KIND_OPTIONS,
  OTHER_UNIT_OPTIONS,
  type CuInToGalFieldErrors,
  type CuInToGalInput,
  type CuInToGalSource,
  type GallonKind,
  type OtherVolumeUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface CuInToGalDraft {
  source: CuInToGalSource;
  cubicInches: string;
  gallons: string;
  other: string;
  gallonKind: GallonKind;
  otherUnit: OtherVolumeUnit;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring sm:min-w-[5.5rem]';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: CuInToGalDraft): CuInToGalInput {
  return {
    source: draft.source,
    cubicInches: parseOptionalNumber(draft.cubicInches),
    gallons: parseOptionalNumber(draft.gallons),
    other: parseOptionalNumber(draft.other),
    gallonKind: draft.gallonKind,
    otherUnit: draft.otherUnit,
  };
}

export function emptyDraft(): CuInToGalDraft {
  return {
    source: 'cubicInches',
    cubicInches: '',
    gallons: '',
    other: '',
    gallonKind: DEFAULT_GALLON_KIND,
    otherUnit: DEFAULT_OTHER_UNIT,
  };
}

interface CuInToGalFormProps {
  draft: CuInToGalDraft;
  errors: CuInToGalFieldErrors;
  onDraftChange: (draft: CuInToGalDraft) => void;
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

export function CuInToGalForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CuInToGalFormProps) {
  const set = (patch: Partial<CuInToGalDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 US gal = 231 in³ · 1 UK gal = 4.54609 L · 1 in³ = 0.016387064 L. Edit any field —
        the others update from the same physical volume. US and UK gallons are not the same size.
      </div>

      <FieldShell
        label="Cubic inches"
        htmlFor="cu-in-gal-in3"
        tip="Enter volume in cubic inches. Gallons and other units update from the same volume."
        error={errors.cubicInches}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cu-in-gal-in3"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.cubicInches}
              placeholder="Enter cubic inches"
              aria-invalid={Boolean(errors.cubicInches)}
              onChange={(event) =>
                set({ source: 'cubicInches', cubicInches: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            in³
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Gallons"
        htmlFor="cu-in-gal-gal"
        tip="Choose US liquid gallon or UK imperial gallon. Switching kinds keeps the same physical volume."
        error={errors.gallons}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cu-in-gal-gal"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.gallons}
              placeholder="Enter gallons"
              aria-invalid={Boolean(errors.gallons)}
              onChange={(event) => set({ source: 'gallons', gallons: event.target.value })}
            />
          </div>
          <select
            aria-label="Gallon system"
            className={selectClass}
            value={draft.gallonKind}
            onChange={(event) =>
              set({ gallonKind: event.target.value as GallonKind, source: draft.source })
            }
          >
            {GALLON_KIND_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <FieldShell
        label="Other volume units"
        htmlFor="cu-in-gal-other"
        tip="Third synchronized volume unit. Default is liters (L)."
        error={errors.other}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cu-in-gal-other"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.other}
              placeholder="Enter volume"
              aria-invalid={Boolean(errors.other)}
              onChange={(event) => set({ source: 'other', other: event.target.value })}
            />
          </div>
          <select
            aria-label="Other volume unit"
            className={selectClass}
            value={draft.otherUnit}
            onChange={(event) =>
              set({ otherUnit: event.target.value as OtherVolumeUnit, source: draft.source })
            }
          >
            {OTHER_UNIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        1 US gal = 231 in³ · 1 in³ ≈ 0.004329 US gal · 1 in³ ≈ 0.003605 UK gal
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
