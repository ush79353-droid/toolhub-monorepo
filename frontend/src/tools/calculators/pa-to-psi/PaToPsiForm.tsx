'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { type PaPsiSource, type PaToPsiFieldErrors, type PaToPsiInput } from './types';
import { formatPressure, PASCALS_PER_PSI, PSI_PER_PA } from './calculation';
import { parseOptionalNumber } from './validation';

export interface PaToPsiDraft {
  source: PaPsiSource;
  Pa: string;
  psi: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: PaToPsiDraft): PaToPsiInput {
  return {
    source: draft.source,
    Pa: parseOptionalNumber(draft.Pa),
    psi: parseOptionalNumber(draft.psi),
  };
}

export function emptyDraft(): PaToPsiDraft {
  return { source: 'Pa', Pa: '', psi: '' };
}

interface PaToPsiFormProps {
  draft: PaToPsiDraft;
  errors: PaToPsiFieldErrors;
  onDraftChange: (draft: PaToPsiDraft) => void;
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

export function PaToPsiForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: PaToPsiFormProps) {
  const set = (patch: Partial<PaToPsiDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact via international pound-force and inch: 1 psi = {formatPressure(PASCALS_PER_PSI)} Pa.
 Factor ≈ {formatPressure(PSI_PER_PA)} psi per Pa. Converts numerical units only; not gauge
        ↔ absolute.
      </div>

      <FieldShell
        label="Pressure in pascals"
        htmlFor="pa-to-psi-pa"
        tip="Pascals (Pa). Negative values are treated as signed numerical pressure (e.g. gauge)."
        error={errors.Pa}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="pa-to-psi-pa"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.Pa}
              placeholder="Enter pressure"
              aria-invalid={Boolean(errors.Pa)}
              onChange={(event) => set({ source: 'Pa', Pa: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            Pa
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Pressure in pounds per square inch"
        htmlFor="pa-to-psi-psi"
        tip="Pounds-force per square inch (psi). Negative values are treated as signed numerical pressure (e.g. gauge)."
        error={errors.psi}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="pa-to-psi-psi"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.psi}
              placeholder="Enter pressure"
              aria-invalid={Boolean(errors.psi)}
              onChange={(event) => set({ source: 'psi', psi: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            psi
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        psi = Pa ÷ {formatPressure(PASCALS_PER_PSI)} · Pa = psi × {formatPressure(PASCALS_PER_PSI)}
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
