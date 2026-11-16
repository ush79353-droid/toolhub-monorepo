'use client';

import type { FormEvent, ReactNode } from 'react';
import { ArrowUpDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  type LbsStoneSource,
  type LbsToStoneFieldErrors,
  type LbsToStoneInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface LbsToStoneDraft {
  source: LbsStoneSource;
  pounds: string;
  stones: string;
  /** Visual order: true = pounds field first. */
  poundsFirst: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: LbsToStoneDraft): LbsToStoneInput {
  return {
    source: draft.source,
    pounds: parseOptionalNumber(draft.pounds),
    stones: parseOptionalNumber(draft.stones),
  };
}

export function emptyDraft(): LbsToStoneDraft {
  return { source: 'pounds', pounds: '', stones: '', poundsFirst: true };
}

interface LbsToStoneFormProps {
  draft: LbsToStoneDraft;
  errors: LbsToStoneFieldErrors;
  onDraftChange: (draft: LbsToStoneDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  onSwap: () => void;
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

export function LbsToStoneForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onSwap,
  children,
}: LbsToStoneFormProps) {
  const set = (patch: Partial<LbsToStoneDraft>) => onDraftChange({ ...draft, ...patch });

  const poundsField = (
    <FieldShell
      key="pounds"
      label="Weight in pounds"
      htmlFor="lbs-st-pounds"
      tip="Enter a weight in pounds. Stones update as pounds ÷ 14."
      error={errors.pounds}
    >
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="lbs-st-pounds"
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
  );

  const stonesField = (
    <FieldShell
      key="stones"
      label="Weight in stones"
      htmlFor="lbs-st-stones"
      tip="Enter a weight in stones. Pounds update as stones × 14."
      error={errors.stones}
    >
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="lbs-st-stones"
            inputMode="decimal"
            autoComplete="off"
            className={inputClass}
            value={draft.stones}
            placeholder="Enter stones"
            aria-invalid={Boolean(errors.stones)}
            onChange={(event) => set({ source: 'stones', stones: event.target.value })}
          />
        </div>
        <span className={unitBadgeClass} aria-hidden="true">
          st
        </span>
      </div>
    </FieldShell>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        1 stone = 14 pounds (exact avoirdupois). Edit either field — the other updates instantly.
        Weight cannot be negative.
      </div>

      {draft.poundsFirst ? (
        <>
          {poundsField}
          {stonesField}
        </>
      ) : (
        <>
          {stonesField}
          {poundsField}
        </>
      )}

      <p className="text-xs text-muted-foreground">1 stone = 14 pounds</p>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-11" onClick={onSwap}>
          <ArrowUpDown className="mr-1.5 h-4 w-4" />
          Swap units
        </Button>
      </div>

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
