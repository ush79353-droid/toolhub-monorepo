'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { GalToCuFtFieldErrors, GalToCuFtInput, VolumeSource } from './types';
import { parseOptionalNumber } from './validation';

export interface GalToCuFtDraft {
  source: VolumeSource;
  usGal: string;
  ukGal: string;
  ft3: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): GalToCuFtDraft {
  return { source: 'usGal', usGal: '', ukGal: '', ft3: '' };
}

export function draftToInput(draft: GalToCuFtDraft): GalToCuFtInput {
  const raw =
    draft.source === 'usGal'
      ? draft.usGal
      : draft.source === 'ukGal'
        ? draft.ukGal
        : draft.ft3;
  return { source: draft.source, value: parseOptionalNumber(raw) };
}

interface GalToCuFtFormProps {
  draft: GalToCuFtDraft;
  errors: GalToCuFtFieldErrors;
  onDraftChange: (draft: GalToCuFtDraft) => void;
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

export function GalToCuFtForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: GalToCuFtFormProps) {
  const set = (patch: Partial<GalToCuFtDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact definitions via liters: 1 US gal = 3.785411784 L, 1 UK gal = 4.54609 L, 1 ft³ =
        28.316846592 L. US liquid and UK imperial gallons are not the same size. Edit any field —
        the other two update instantly.
      </div>

      <FieldShell
        label="US gallons"
        htmlFor="gal-ft3-us"
        tip="US liquid gallon = 3.785411784 L (not US dry gallon)."
        error={errors.usGal}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="gal-ft3-us"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.usGal}
              placeholder="Enter US gallons"
              aria-invalid={Boolean(errors.usGal)}
              onChange={(event) => set({ source: 'usGal', usGal: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            US gal
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="UK gallons"
        htmlFor="gal-ft3-uk"
        tip="UK imperial gallon = 4.54609 L — larger than a US liquid gallon."
        error={errors.ukGal}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="gal-ft3-uk"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.ukGal}
              placeholder="Enter UK gallons"
              aria-invalid={Boolean(errors.ukGal)}
              onChange={(event) => set({ source: 'ukGal', ukGal: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            UK gal
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Cubic feet"
        htmlFor="gal-ft3-ft3"
        tip="1 ft³ = 28.316846592 L = (0.3048 m)³."
        error={errors.ft3}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="gal-ft3-ft3"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.ft3}
              placeholder="Enter cubic feet"
              aria-invalid={Boolean(errors.ft3)}
              onChange={(event) => set({ source: 'ft3', ft3: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            ft³
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        1 US gal ≈ 0.133681 ft³ · 1 UK gal ≈ 0.160544 ft³ · 1 ft³ ≈ 7.48052 US gal
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
