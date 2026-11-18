'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { MORE_SOURCES, type GalToPintsFieldErrors, type GalToPintsInput, type VolumeSource } from './types';
import { parseOptionalNumber } from './validation';

export interface GalToPintsDraft {
  source: VolumeSource;
  usGal: string;
  ukGal: string;
  usPt: string;
  ukPt: string;
  mL: string;
  L: string;
  usFlOz: string;
  ukFlOz: string;
  usQt: string;
  ukQt: string;
  m3: string;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';
const sectionClass = 'space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

export function emptyDraft(): GalToPintsDraft {
  return {
    source: 'usGal',
    usGal: '',
    ukGal: '',
    usPt: '',
    ukPt: '',
    mL: '',
    L: '',
    usFlOz: '',
    ukFlOz: '',
    usQt: '',
    ukQt: '',
    m3: '',
    moreOpen: false,
  };
}

export function draftToInput(draft: GalToPintsDraft): GalToPintsInput {
  return { source: draft.source, value: parseOptionalNumber(draft[draft.source]) };
}

interface GalToPintsFormProps {
  draft: GalToPintsDraft;
  errors: GalToPintsFieldErrors;
  onDraftChange: (draft: GalToPintsDraft) => void;
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

function VolumeField({
  id,
  label,
  tip,
  value,
  unit,
  error,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  tip?: string;
  value: string;
  unit: string;
  error?: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <FieldShell label={label} htmlFor={id} tip={tip} error={error}>
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id={id}
            inputMode="decimal"
            autoComplete="off"
            className={inputClass}
            value={value}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
        <span className={unitBadgeClass} aria-hidden="true">
          {unit}
        </span>
      </div>
    </FieldShell>
  );
}

export function GalToPintsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: GalToPintsFormProps) {
  const set = (patch: Partial<GalToPintsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Within each system, 1 gallon = 8 pints. US liquid and UK imperial gallons (and pints) are
        different sizes. Edit any field — all others update via exact liter factors.
      </div>

      <div className={sectionClass}>
        <p className="text-sm font-semibold text-accent">Gallons</p>
        <VolumeField
          id="gal-pt-us-gal"
          label="US gallons"
          tip="US liquid gallon = 3.785411784 L. 1 US gal = 8 US pt."
          value={draft.usGal}
          unit="US gal"
          error={errors.usGal}
          placeholder="Enter US gallons"
          onChange={(usGal) => set({ source: 'usGal', usGal })}
        />
        <VolumeField
          id="gal-pt-uk-gal"
          label="UK gallons"
          tip="UK imperial gallon = 4.54609 L. 1 UK gal = 8 UK pt."
          value={draft.ukGal}
          unit="UK gal"
          error={errors.ukGal}
          placeholder="Enter UK gallons"
          onChange={(ukGal) => set({ source: 'ukGal', ukGal })}
        />
      </div>

      <div className={sectionClass}>
        <p className="text-sm font-semibold text-accent">Pints</p>
        <VolumeField
          id="gal-pt-us-pt"
          label="US pints"
          tip="US liquid pint = 0.473176473 L. 8 US pt = 1 US gal."
          value={draft.usPt}
          unit="US pt"
          error={errors.usPt}
          placeholder="Enter US pints"
          onChange={(usPt) => set({ source: 'usPt', usPt })}
        />
        <VolumeField
          id="gal-pt-uk-pt"
          label="UK pints"
          tip="UK imperial pint = 0.56826125 L. 8 UK pt = 1 UK gal."
          value={draft.ukPt}
          unit="UK pt"
          error={errors.ukPt}
          placeholder="Enter UK pints"
          onChange={(ukPt) => set({ source: 'ukPt', ukPt })}
        />
      </div>

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
          <div className="space-y-3 border-t border-border px-3.5 pb-3.5 pt-2">
            {MORE_SOURCES.map((row) => (
              <VolumeField
                key={row.unit}
                id={`gal-pt-more-${row.unit}`}
                label={row.label}
                value={draft[row.unit]}
                unit={row.symbol}
                error={errors[row.unit]}
                placeholder={`Enter ${row.symbol}`}
                onChange={(value) => set({ source: row.unit, [row.unit]: value })}
              />
            ))}
          </div>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        1 US gal = 8 US pt · 1 UK gal = 8 UK pt · US ≠ UK volume
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
