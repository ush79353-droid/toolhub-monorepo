'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  SQUARE_METERS_PER_ACRE,
  SQUARE_METERS_PER_HECTARE,
  type HaAcSource,
  type HectaresToAcresFieldErrors,
  type HectaresToAcresInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface HectaresToAcresDraft {
  source: HaAcSource;
  hectares: string;
  acres: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: HectaresToAcresDraft): HectaresToAcresInput {
  return {
    source: draft.source,
    hectares: parseOptionalNumber(draft.hectares),
    acres: parseOptionalNumber(draft.acres),
  };
}

export function emptyDraft(): HectaresToAcresDraft {
  return { source: 'hectares', hectares: '', acres: '' };
}

interface HectaresToAcresFormProps {
  draft: HectaresToAcresDraft;
  errors: HectaresToAcresFieldErrors;
  onDraftChange: (draft: HectaresToAcresDraft) => void;
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

export function HectaresToAcresForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: HectaresToAcresFormProps) {
  const set = (patch: Partial<HectaresToAcresDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Hectares and acres measure land area. Exact definitions: 1 ha = {SQUARE_METERS_PER_HECTARE}{' '}
        m²; 1 international acre = {SQUARE_METERS_PER_ACRE} m². No density is required.
      </div>

      <FieldShell
        label="Hectares"
        htmlFor="ha-ac-hectares"
        tip={`Enter area in hectares. Acres update as hectares × (${SQUARE_METERS_PER_HECTARE} ÷ ${SQUARE_METERS_PER_ACRE}).`}
        error={errors.hectares}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ha-ac-hectares"
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

      <FieldShell
        label="Acres"
        htmlFor="ha-ac-acres"
        tip={`Enter area in acres. Hectares update as acres × (${SQUARE_METERS_PER_ACRE} ÷ ${SQUARE_METERS_PER_HECTARE}).`}
        error={errors.acres}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ha-ac-acres"
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
