'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  KG_PER_STONE,
  type StKgSource,
  type StoneToKgFieldErrors,
  type StoneToKgInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface StoneToKgDraft {
  source: StKgSource;
  st: string;
  kg: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-sky-200 bg-sky-50 px-3 text-sm font-medium text-sky-800';

export function draftToInput(draft: StoneToKgDraft): StoneToKgInput {
  return {
    source: draft.source,
    st: parseOptionalNumber(draft.st),
    kg: parseOptionalNumber(draft.kg),
  };
}

export function emptyDraft(): StoneToKgDraft {
  return { source: 'st', st: '', kg: '' };
}

interface StoneToKgFormProps {
  draft: StoneToKgDraft;
  errors: StoneToKgFieldErrors;
  onDraftChange: (draft: StoneToKgDraft) => void;
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

export function StoneToKgForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: StoneToKgFormProps) {
  const set = (patch: Partial<StoneToKgDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Exact: 1 stone = {KG_PER_STONE} kg (14 international avoirdupois pounds). Edit either field; 
        the other updates instantly. Mass cannot be negative.
      </div>

      <FieldShell
        label="Weight in stones"
        htmlFor="st-kg-st"
        tip={`Enter a nonnegative mass in British imperial stones. 1 st = ${KG_PER_STONE} kg.`}
        error={errors.st}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="st-kg-st"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.st}
              placeholder="Enter weight"
              aria-invalid={Boolean(errors.st)}
              onChange={(event) => set({ source: 'st', st: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            st
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Weight in kilograms"
        htmlFor="st-kg-kg"
        tip="Enter a nonnegative mass in kilograms."
        error={errors.kg}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="st-kg-kg"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.kg}
              placeholder="Converted weight"
              aria-invalid={Boolean(errors.kg)}
              onChange={(event) => set({ source: 'kg', kg: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            kg
          </span>
        </div>
      </FieldShell>

      <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-3 text-sm text-foreground/85">
        Use our calculator in reverse: easily convert kilograms to stones!
      </div>

      <p className="text-xs text-muted-foreground">
        kg = st × {KG_PER_STONE} · st = kg ÷ {KG_PER_STONE}
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
