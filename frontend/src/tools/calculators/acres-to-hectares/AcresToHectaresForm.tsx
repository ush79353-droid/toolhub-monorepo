'use client';

import type { FormEvent, ReactNode } from 'react';
import { ArrowUpDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  type AcresHectaresSource,
  type AcresToHectaresFieldErrors,
  type AcresToHectaresInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface AcresToHectaresDraft {
  source: AcresHectaresSource;
  acres: string;
  hectares: string;
  /** Visual order: true = acres field first. */
  acresFirst: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: AcresToHectaresDraft): AcresToHectaresInput {
  return {
    source: draft.source,
    acres: parseOptionalNumber(draft.acres),
    hectares: parseOptionalNumber(draft.hectares),
  };
}

export function emptyDraft(): AcresToHectaresDraft {
  return { source: 'acres', acres: '', hectares: '', acresFirst: true };
}

interface AcresToHectaresFormProps {
  draft: AcresToHectaresDraft;
  errors: AcresToHectaresFieldErrors;
  onDraftChange: (draft: AcresToHectaresDraft) => void;
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

export function AcresToHectaresForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onSwap,
  children,
}: AcresToHectaresFormProps) {
  const set = (patch: Partial<AcresToHectaresDraft>) => onDraftChange({ ...draft, ...patch });

  const acresField = (
    <FieldShell
      key="acres"
      label="Acres"
      htmlFor="ac-ha-acres"
      tip="Enter an area in acres. Hectares update as acres × 0.40468564224."
      error={errors.acres}
    >
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="ac-ha-acres"
            inputMode="decimal"
            autoComplete="off"
            className={inputClass}
            value={draft.acres}
            placeholder="Enter acres"
            aria-invalid={Boolean(errors.acres)}
            onChange={(event) => set({ source: 'acres', acres: event.target.value })}
          />
        </div>
        <span className={unitBadgeClass} aria-hidden="true">
          ac
        </span>
      </div>
    </FieldShell>
  );

  const hectaresField = (
    <FieldShell
      key="hectares"
      label="Hectares"
      htmlFor="ac-ha-hectares"
      tip="Enter an area in hectares. Acres update as hectares ÷ 0.40468564224."
      error={errors.hectares}
    >
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="ac-ha-hectares"
            inputMode="decimal"
            autoComplete="off"
            className={inputClass}
            value={draft.hectares}
            placeholder="Enter hectares"
            aria-invalid={Boolean(errors.hectares)}
            onChange={(event) => set({ source: 'hectares', hectares: event.target.value })}
          />
        </div>
        <span className={unitBadgeClass} aria-hidden="true">
          ha
        </span>
      </div>
    </FieldShell>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        1 acre = 0.40468564224 hectares (exact international acre). Edit either field — the other
        updates instantly. Area cannot be negative.
      </div>

      {draft.acresFirst ? (
        <>
          {acresField}
          {hectaresField}
        </>
      ) : (
        <>
          {hectaresField}
          {acresField}
        </>
      )}

      <p className="text-xs text-muted-foreground">1 acre = 0.40468564224 hectares</p>

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
