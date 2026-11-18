'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { PintGallonSource, PintsToGallonsFieldErrors, PintsToGallonsInput } from './types';
import { parseOptionalNumber } from './validation';

export interface PintsToGallonsDraft {
  source: PintGallonSource;
  usPt: string;
  ukPt: string;
  usGal: string;
  ukGal: string;
  pintsOpen: boolean;
  gallonsOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

/** Default: 1 US pint (dependent fields filled by converter). */
export function defaultDraft(): PintsToGallonsDraft {
  return {
    source: 'usPt',
    usPt: '1',
    ukPt: '',
    usGal: '',
    ukGal: '',
    pintsOpen: true,
    gallonsOpen: true,
  };
}

export function emptyDraft(): PintsToGallonsDraft {
  return {
    source: 'usPt',
    usPt: '',
    ukPt: '',
    usGal: '',
    ukGal: '',
    pintsOpen: true,
    gallonsOpen: true,
  };
}

export function draftToInput(draft: PintsToGallonsDraft): PintsToGallonsInput {
  return { source: draft.source, value: parseOptionalNumber(draft[draft.source]) };
}

interface PintsToGallonsFormProps {
  draft: PintsToGallonsDraft;
  errors: PintsToGallonsFieldErrors;
  onDraftChange: (draft: PintsToGallonsDraft) => void;
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

export function PintsToGallonsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: PintsToGallonsFormProps) {
  const set = (patch: Partial<PintsToGallonsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Within each system, 1 gallon = 8 pints. US liquid and UK imperial gallons (and pints) are
        different sizes. Edit any field — all others update via exact milliliter factors.
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.pintsOpen}
          onClick={() => set({ pintsOpen: !draft.pintsOpen })}
        >
          <span>Pints</span>
          {draft.pintsOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>
        {draft.pintsOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3">
            <VolumeField
              id="pt-gal-us-pt"
              label="US pints"
              tip="US liquid pint = 473.176473 mL. 8 US pt = 1 US gal."
              value={draft.usPt}
              unit="US pt"
              error={errors.usPt}
              placeholder="Enter US pints"
              onChange={(usPt) => set({ source: 'usPt', usPt })}
            />
            <VolumeField
              id="pt-gal-uk-pt"
              label="UK pints"
              tip="UK imperial pint = 568.26125 mL. 8 UK pt = 1 UK gal."
              value={draft.ukPt}
              unit="UK pt"
              error={errors.ukPt}
              placeholder="Enter UK pints"
              onChange={(ukPt) => set({ source: 'ukPt', ukPt })}
            />
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.gallonsOpen}
          onClick={() => set({ gallonsOpen: !draft.gallonsOpen })}
        >
          <span>Gallons</span>
          {draft.gallonsOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>
        {draft.gallonsOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3">
            <VolumeField
              id="pt-gal-us-gal"
              label="US gallons"
              tip="US liquid gallon = 3,785.411784 mL. 1 US gal = 8 US pt."
              value={draft.usGal}
              unit="US gal"
              error={errors.usGal}
              placeholder="Enter US gallons"
              onChange={(usGal) => set({ source: 'usGal', usGal })}
            />
            <VolumeField
              id="pt-gal-uk-gal"
              label="UK gallons"
              tip="UK imperial gallon = 4,546.09 mL. 1 UK gal = 8 UK pt."
              value={draft.ukGal}
              unit="UK gal"
              error={errors.ukGal}
              placeholder="Enter UK gallons"
              onChange={(ukGal) => set({ source: 'ukGal', ukGal })}
            />
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
