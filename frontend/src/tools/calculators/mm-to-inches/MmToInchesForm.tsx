'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  MM_PER_INCH,
  type MmInchesSource,
  type MmToInchesFieldErrors,
  type MmToInchesInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface MmToInchesDraft {
  source: MmInchesSource;
  mm: string;
  inches: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: MmToInchesDraft): MmToInchesInput {
  return {
    source: draft.source,
    mm: parseOptionalNumber(draft.mm),
    inches: parseOptionalNumber(draft.inches),
  };
}

export function emptyDraft(): MmToInchesDraft {
  return { source: 'mm', mm: '', inches: '' };
}

interface MmToInchesFormProps {
  draft: MmToInchesDraft;
  errors: MmToInchesFieldErrors;
  onDraftChange: (draft: MmToInchesDraft) => void;
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

export function MmToInchesForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MmToInchesFormProps) {
  const set = (patch: Partial<MmToInchesDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 in = {MM_PER_INCH} mm. Enter millimeters or inches — both update instantly. Signed
        values are allowed for mathematical differences.
      </div>

      <FieldShell
        label="Length in millimeters (mm)"
        htmlFor="mm-in-mm"
        tip={`inches = mm ÷ ${MM_PER_INCH}.`}
        error={errors.mm}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="mm-in-mm"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.mm}
              placeholder="Enter length"
              aria-invalid={Boolean(errors.mm)}
              onChange={(event) => set({ source: 'mm', mm: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            mm
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Length in inches"
        htmlFor="mm-in-inches"
        tip={`mm = inches × ${MM_PER_INCH}.`}
        error={errors.inches}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="mm-in-inches"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.inches}
              placeholder="Enter length"
              aria-invalid={Boolean(errors.inches)}
              onChange={(event) => set({ source: 'in', inches: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            in
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        1 in = {MM_PER_INCH} mm · inches = mm ÷ {MM_PER_INCH}
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
