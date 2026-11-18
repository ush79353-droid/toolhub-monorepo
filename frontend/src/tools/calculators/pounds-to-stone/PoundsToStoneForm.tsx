'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  POUNDS_PER_STONE,
  type LbStSource,
  type PoundsToStoneFieldErrors,
  type PoundsToStoneInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface PoundsToStoneDraft {
  source: LbStSource;
  pounds: string;
  stone: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: PoundsToStoneDraft): PoundsToStoneInput {
  return {
    source: draft.source,
    pounds: parseOptionalNumber(draft.pounds),
    stone: parseOptionalNumber(draft.stone),
  };
}

export function emptyDraft(): PoundsToStoneDraft {
  return { source: 'pounds', pounds: '', stone: '' };
}

interface PoundsToStoneFormProps {
  draft: PoundsToStoneDraft;
  errors: PoundsToStoneFieldErrors;
  onDraftChange: (draft: PoundsToStoneDraft) => void;
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

export function PoundsToStoneForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: PoundsToStoneFormProps) {
  const set = (patch: Partial<PoundsToStoneDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 stone = {POUNDS_PER_STONE} pounds. Edit either field — the other updates instantly.
        Decimal stone is the primary result; mixed stone + pounds is shown separately.
      </div>

      <FieldShell
        label="Weight in pounds"
        htmlFor="lb-st-pounds"
        tip={`st = lb ÷ ${POUNDS_PER_STONE}.`}
        error={errors.pounds}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="lb-st-pounds"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.pounds}
              placeholder="Enter pounds"
              aria-invalid={Boolean(errors.pounds)}
              onChange={(event) => set({ source: 'pounds', pounds: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            lb
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Weight in stone"
        htmlFor="lb-st-stone"
        tip={`lb = st × ${POUNDS_PER_STONE}.`}
        error={errors.stone}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="lb-st-stone"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.stone}
              placeholder="Enter stone"
              aria-invalid={Boolean(errors.stone)}
              onChange={(event) => set({ source: 'stone', stone: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            st
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        st = lb ÷ {POUNDS_PER_STONE} · lb = st × {POUNDS_PER_STONE}
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
