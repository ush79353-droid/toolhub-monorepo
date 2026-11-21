'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { GalCupsSource, GalToCupsFieldErrors, GalToCupsInput } from './types';
import { parseOptionalNumber } from './validation';

export interface GalToCupsDraft {
  source: GalCupsSource;
  gallons: string;
  cups: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: GalToCupsDraft): GalToCupsInput {
  return {
    source: draft.source,
    gallons: parseOptionalNumber(draft.gallons),
    cups: parseOptionalNumber(draft.cups),
  };
}

export function emptyDraft(): GalToCupsDraft {
  return { source: 'gallons', gallons: '', cups: '' };
}

interface GalToCupsFormProps {
  draft: GalToCupsDraft;
  errors: GalToCupsFieldErrors;
  onDraftChange: (draft: GalToCupsDraft) => void;
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

export function GalToCupsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: GalToCupsFormProps) {
  const set = (patch: Partial<GalToCupsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Exact relationship: 1 US liquid gallon = 16 US customary cups. Edit either field: the other
        updates instantly. This calculator uses US liquid gallons and US customary cups (not metric
        cups or UK imperial gallons).
      </div>

      <FieldShell
        label="Volume in gallons"
        htmlFor="gal-cups-gal"
        tip="Enter a volume in US liquid gallons. Cups = gallons × 16."
        error={errors.gallons}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="gal-cups-gal"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.gallons}
              placeholder="Enter gallons"
              aria-invalid={Boolean(errors.gallons)}
              onChange={(event) => set({ source: 'gallons', gallons: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            US gal
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Volume in cups"
        htmlFor="gal-cups-cups"
        tip="Enter a volume in US customary cups. Gallons = cups ÷ 16."
        error={errors.cups}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="gal-cups-cups"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.cups}
              placeholder="Enter cups"
              aria-invalid={Boolean(errors.cups)}
              onChange={(event) => set({ source: 'cups', cups: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            US cup
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">1 US gal = 16 US cups · Cups = Gallons × 16</p>

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
