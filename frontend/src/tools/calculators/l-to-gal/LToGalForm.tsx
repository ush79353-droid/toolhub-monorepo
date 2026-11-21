'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  GALLON_KIND_OPTIONS,
  OTHER_UNIT_OPTIONS,
  type GallonKind,
  type LToGalFieldErrors,
  type LToGalInput,
  type LToGalSource,
  type OtherVolumeUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface LToGalDraft {
  source: LToGalSource;
  liters: string;
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

export function draftToInput(draft: LToGalDraft): LToGalInput {
  return {
    source: draft.source,
    liters: parseOptionalNumber(draft.liters),
    gallons: parseOptionalNumber(draft.gallons),
    other: parseOptionalNumber(draft.other),
    gallonKind: draft.gallonKind,
    otherUnit: draft.otherUnit,
  };
}

export function emptyDraft(): LToGalDraft {
  return {
    source: 'liters',
    liters: '',
    gallons: '',
    other: '',
    gallonKind: 'usGal',
    otherUnit: 'usFlOz',
  };
}

interface LToGalFormProps {
  draft: LToGalDraft;
  errors: LToGalFieldErrors;
  onDraftChange: (draft: LToGalDraft) => void;
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

export function LToGalForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: LToGalFormProps) {
  const set = (patch: Partial<LToGalDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Exact: 1 US gal = 3.785411784 L · 1 Imperial gal = 4.54609 L. Edit any field: the others
        update from the same physical volume. US and Imperial gallons are not interchangeable.
      </div>

      <FieldShell
        label="Liters"
        htmlFor="l-gal-liters"
        tip="Metric volume (L). Gallons update as liters ÷ gallon factor."
        error={errors.liters}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="l-gal-liters"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.liters}
              placeholder="Enter liters"
              aria-invalid={Boolean(errors.liters)}
              onChange={(event) => set({ source: 'liters', liters: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            L
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Gallons"
        htmlFor="l-gal-gallons"
        tip="Choose US liquid gallon or Imperial gallon. Switching kinds keeps the same physical volume."
        error={errors.gallons}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="l-gal-gallons"
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
            aria-label="Gallon type"
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

      <p className="text-xs text-muted-foreground">
        You can also select Imperial/UK gallon from the list of units.
      </p>

      <FieldShell
        label="Other units"
        htmlFor="l-gal-other"
        tip="Optional third unit synchronized to the same volume. Default is US fluid ounces."
        error={errors.other}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="l-gal-other"
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
