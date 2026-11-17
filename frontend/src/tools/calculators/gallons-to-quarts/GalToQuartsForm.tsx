'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DEFAULT_GALLON_UNIT,
  DEFAULT_QUART_UNIT,
  GALLON_UNIT_OPTIONS,
  QUART_UNIT_OPTIONS,
  type GallonUnit,
  type GalQtSource,
  type GalToQuartsFieldErrors,
  type GalToQuartsInput,
  type QuartUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface GalToQuartsDraft {
  source: GalQtSource;
  gallons: string;
  quarts: string;
  gallonUnit: GallonUnit;
  quartUnit: QuartUnit;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring sm:min-w-[7rem]';

export function emptyDraft(): GalToQuartsDraft {
  return {
    source: 'gallons',
    gallons: '',
    quarts: '',
    gallonUnit: DEFAULT_GALLON_UNIT,
    quartUnit: DEFAULT_QUART_UNIT,
  };
}

export function draftToInput(draft: GalToQuartsDraft): GalToQuartsInput {
  return {
    source: draft.source,
    value: parseOptionalNumber(draft.source === 'gallons' ? draft.gallons : draft.quarts),
    gallonUnit: draft.gallonUnit,
    quartUnit: draft.quartUnit,
  };
}

interface GalToQuartsFormProps {
  draft: GalToQuartsDraft;
  errors: GalToQuartsFieldErrors;
  onDraftChange: (draft: GalToQuartsDraft) => void;
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

export function GalToQuartsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: GalToQuartsFormProps) {
  const set = (patch: Partial<GalToQuartsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Within the same system, 1 gallon = 4 quarts. US liquid and UK imperial gallons (and quarts)
        are different sizes. Switching a unit preserves the physical volume.
      </div>

      <FieldShell
        label="Volume in gallons"
        htmlFor="gal-qt-gallons"
        tip="Choose US liquid or UK imperial gallons. 1 US gal = 4 US qt; 1 UK gal = 4 UK qt."
        error={errors.gallons}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="gal-qt-gallons"
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
            aria-label="Gallon unit"
            className={selectClass}
            value={draft.gallonUnit}
            onChange={(event) =>
              set({ gallonUnit: event.target.value as GallonUnit, source: draft.source })
            }
          >
            {GALLON_UNIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <FieldShell
        label="Volume in quarts"
        htmlFor="gal-qt-quarts"
        tip="Choose US liquid or UK imperial quarts. Cross-system conversions use exact liter factors."
        error={errors.quarts}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="gal-qt-quarts"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.quarts}
              placeholder="Enter quarts"
              aria-invalid={Boolean(errors.quarts)}
              onChange={(event) => set({ source: 'quarts', quarts: event.target.value })}
            />
          </div>
          <select
            aria-label="Quart unit"
            className={selectClass}
            value={draft.quartUnit}
            onChange={(event) =>
              set({ quartUnit: event.target.value as QuartUnit, source: draft.source })
            }
          >
            {QUART_UNIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        Same-system: Quarts = Gallons × 4 · Gallons = Quarts ÷ 4
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
