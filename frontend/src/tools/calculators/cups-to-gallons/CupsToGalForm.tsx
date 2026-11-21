'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  CUP_UNIT_OPTIONS,
  DEFAULT_CUP_UNIT,
  DEFAULT_GALLON_UNIT,
  EXTRA_VOLUME_LABELS,
  EXTRA_VOLUME_SYMBOLS,
  EXTRA_VOLUME_UNITS,
  GALLON_UNIT_OPTIONS,
  type CupUnit,
  type CupsToGalFieldErrors,
  type CupsToGalInput,
  type CupsToGalSource,
  type ExtraVolumeUnit,
  type GallonUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface CupsToGalDraft {
  source: CupsToGalSource;
  cups: string;
  gallons: string;
  cupUnit: CupUnit;
  gallonUnit: GallonUnit;
  extras: Partial<Record<ExtraVolumeUnit, string>>;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring sm:min-w-[7rem]';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): CupsToGalDraft {
  return {
    source: 'cups',
    cups: '',
    gallons: '',
    cupUnit: DEFAULT_CUP_UNIT,
    gallonUnit: DEFAULT_GALLON_UNIT,
    extras: {},
    moreOpen: false,
  };
}

export function draftToInput(draft: CupsToGalDraft): CupsToGalInput {
  if (draft.source === 'cups') {
    return {
      source: 'cups',
      value: parseOptionalNumber(draft.cups),
      cupUnit: draft.cupUnit,
      gallonUnit: draft.gallonUnit,
    };
  }
  if (draft.source === 'gallons') {
    return {
      source: 'gallons',
      value: parseOptionalNumber(draft.gallons),
      cupUnit: draft.cupUnit,
      gallonUnit: draft.gallonUnit,
    };
  }
  return {
    source: draft.source,
    value: parseOptionalNumber(draft.extras[draft.source] ?? ''),
    cupUnit: draft.cupUnit,
    gallonUnit: draft.gallonUnit,
  };
}

interface CupsToGalFormProps {
  draft: CupsToGalDraft;
  errors: CupsToGalFieldErrors;
  onDraftChange: (draft: CupsToGalDraft) => void;
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

export function CupsToGalForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CupsToGalFormProps) {
  const set = (patch: Partial<CupsToGalDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 US liquid gal = 16 US customary cups = 3.785411784 L. Metric, US legal, and UK cups
 differ. US and UK gallons are not the same size. Edit any field; others update from the
        same physical volume.
      </div>

      <FieldShell
        label="Volume in cups"
        htmlFor="cups-gal-cups"
        tip="Choose US customary, US legal, metric, or UK imperial cup."
        error={errors.cups}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cups-gal-cups"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.cups}
              placeholder="Enter cups"
              aria-invalid={Boolean(errors.cups)}
              onChange={(event) => set({ source: 'cups', cups: event.target.value })}
            />
          </div>
          <select
            aria-label="Cup unit"
            className={selectClass}
            value={draft.cupUnit}
            onChange={(event) =>
              set({ cupUnit: event.target.value as CupUnit, source: draft.source })
            }
          >
            {CUP_UNIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <FieldShell
        label="Volume in gallons"
        htmlFor="cups-gal-gallons"
        tip="Choose US liquid gallon or UK imperial gallon."
        error={errors.gallons}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cups-gal-gallons"
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

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.moreOpen}
          onClick={() => set({ moreOpen: !draft.moreOpen })}
        >
          <span>More conversion options</span>
          {draft.moreOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {draft.moreOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 pb-3.5 pt-3">
            {EXTRA_VOLUME_UNITS.map((unit) => (
              <FieldShell
                key={unit}
                label={EXTRA_VOLUME_LABELS[unit]}
                htmlFor={`cups-gal-${unit}`}
                error={errors[unit]}
              >
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                    <input
                      id={`cups-gal-${unit}`}
                      inputMode="decimal"
                      autoComplete="off"
                      className={inputClass}
                      value={draft.extras[unit] ?? ''}
                      placeholder={`Enter ${EXTRA_VOLUME_SYMBOLS[unit]}`}
                      aria-invalid={Boolean(errors[unit])}
                      onChange={(event) =>
                        set({
                          source: unit,
                          extras: { ...draft.extras, [unit]: event.target.value },
                        })
                      }
                    />
                  </div>
                  <span className={unitBadgeClass} aria-hidden="true">
                    {EXTRA_VOLUME_SYMBOLS[unit]}
                  </span>
                </div>
              </FieldShell>
            ))}
          </div>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        1 US gal = 16 US cups · 1 UK gal = 16 UK cups · 1 metric cup = 250 mL
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
