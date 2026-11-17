'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  KG_PER_STONE,
  type KgStSource,
  type KgToStonesFieldErrors,
  type KgToStonesInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface KgToStonesDraft {
  source: KgStSource;
  kg: string;
  st: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: KgToStonesDraft): KgToStonesInput {
  return {
    source: draft.source,
    kg: parseOptionalNumber(draft.kg),
    st: parseOptionalNumber(draft.st),
  };
}

export function emptyDraft(): KgToStonesDraft {
  return { source: 'kg', kg: '', st: '' };
}

interface KgToStonesFormProps {
  draft: KgToStonesDraft;
  errors: KgToStonesFieldErrors;
  onDraftChange: (draft: KgToStonesDraft) => void;
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

export function KgToStonesForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: KgToStonesFormProps) {
  const set = (patch: Partial<KgToStonesDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 stone = {KG_PER_STONE} kg (14 international avoirdupois pounds). Edit either field —
        the other updates instantly.
      </div>

      <FieldShell
        label="Weight in kilograms"
        htmlFor="kg-st-kg"
        tip="Enter a nonnegative mass in kilograms."
        error={errors.kg}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="kg-st-kg"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.kg}
              placeholder="Enter mass"
              aria-invalid={Boolean(errors.kg)}
              onChange={(event) => set({ source: 'kg', kg: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            kg
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Weight in stones"
        htmlFor="kg-st-st"
        tip={`Enter a nonnegative mass in British imperial stones. 1 st = ${KG_PER_STONE} kg.`}
        error={errors.st}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="kg-st-st"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.st}
              placeholder="Enter mass"
              aria-invalid={Boolean(errors.st)}
              onChange={(event) => set({ source: 'st', st: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            st
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        st = kg ÷ {KG_PER_STONE} · kg = st × {KG_PER_STONE}
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
