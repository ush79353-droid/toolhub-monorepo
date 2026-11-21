'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DEFAULT_GALLON_UNIT,
  DEFAULT_QUART_UNIT,
  EXTRA_VOLUME_LABELS,
  EXTRA_VOLUME_SYMBOLS,
  EXTRA_VOLUME_UNITS,
  GALLON_UNIT_OPTIONS,
  QUART_UNIT_OPTIONS,
  type ExtraVolumeUnit,
  type GallonUnit,
  type QtGalSource,
  type QuartUnit,
  type QuartsToGallonsFieldErrors,
  type QuartsToGallonsInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface QuartsToGallonsDraft {
  source: QtGalSource;
  quarts: string;
  gallons: string;
  gallonUnit: GallonUnit;
  quartUnit: QuartUnit;
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

/** Screenshot default: 4 US qt = 1 US gal. */
export function defaultDraft(): QuartsToGallonsDraft {
  return {
    source: 'quarts',
    quarts: '4',
    gallons: '1',
    gallonUnit: DEFAULT_GALLON_UNIT,
    quartUnit: DEFAULT_QUART_UNIT,
    extras: { usCup: '16' },
    moreOpen: false,
  };
}

export function emptyDraft(): QuartsToGallonsDraft {
  return {
    source: 'quarts',
    quarts: '',
    gallons: '',
    gallonUnit: DEFAULT_GALLON_UNIT,
    quartUnit: DEFAULT_QUART_UNIT,
    extras: {},
    moreOpen: false,
  };
}

export function draftToInput(draft: QuartsToGallonsDraft): QuartsToGallonsInput {
  if (draft.source === 'quarts') {
    return {
      source: 'quarts',
      value: parseOptionalNumber(draft.quarts),
      gallonUnit: draft.gallonUnit,
      quartUnit: draft.quartUnit,
    };
  }
  if (draft.source === 'gallons') {
    return {
      source: 'gallons',
      value: parseOptionalNumber(draft.gallons),
      gallonUnit: draft.gallonUnit,
      quartUnit: draft.quartUnit,
    };
  }
  return {
    source: draft.source,
    value: parseOptionalNumber(draft.extras[draft.source] ?? ''),
    gallonUnit: draft.gallonUnit,
    quartUnit: draft.quartUnit,
  };
}

interface QuartsToGallonsFormProps {
  draft: QuartsToGallonsDraft;
  errors: QuartsToGallonsFieldErrors;
  onDraftChange: (draft: QuartsToGallonsDraft) => void;
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

export function QuartsToGallonsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: QuartsToGallonsFormProps) {
  const set = (patch: Partial<QuartsToGallonsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Default: US liquid volume; 1 US gal = 4 US qt. US dry quarts and UK imperial units differ.
        Cross-system conversions use exact liter factors, not a silent ×4.
      </div>

      <FieldShell
        label="Quarts"
        htmlFor="qt-gal-quarts"
        tip="US liquid, UK imperial, or US dry quarts. Matching US liquid: gallons = quarts ÷ 4."
        error={errors.quarts}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="qt-gal-quarts"
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

      <FieldShell
        label="Gallons"
        htmlFor="qt-gal-gallons"
        tip="US liquid or UK imperial gallons. Same-system: quarts = gallons × 4."
        error={errors.gallons}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="qt-gal-gallons"
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
          <span>Other relevant units</span>
          {draft.moreOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>
        {draft.moreOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 pb-3.5 pt-3">
            {EXTRA_VOLUME_UNITS.map((unit) => (
              <FieldShell
                key={unit}
                label={EXTRA_VOLUME_LABELS[unit]}
                htmlFor={`qt-gal-${unit}`}
                error={errors[unit]}
              >
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                    <input
                      id={`qt-gal-${unit}`}
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
        Same-system: gallons = quarts ÷ 4 · quarts = gallons × 4 · 1 US gal = 16 US cups
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
