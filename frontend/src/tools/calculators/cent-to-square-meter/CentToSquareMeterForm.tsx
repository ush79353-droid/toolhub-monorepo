'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CentAreaSource,
  CentToSquareMeterFieldErrors,
  CentToSquareMeterInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface CentToSquareMeterDraft {
  source: CentAreaSource;
  cent: string;
  m2: string;
  ft2: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: CentToSquareMeterDraft): CentToSquareMeterInput {
  return {
    source: draft.source,
    cent: parseOptionalNumber(draft.cent),
    m2: parseOptionalNumber(draft.m2),
    ft2: parseOptionalNumber(draft.ft2),
  };
}

export function emptyDraft(): CentToSquareMeterDraft {
  return { source: 'cent', cent: '', m2: '', ft2: '' };
}

interface CentToSquareMeterFormProps {
  draft: CentToSquareMeterDraft;
  errors: CentToSquareMeterFieldErrors;
  onDraftChange: (draft: CentToSquareMeterDraft) => void;
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

export function CentToSquareMeterForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CentToSquareMeterFormProps) {
  const set = (patch: Partial<CentToSquareMeterDraft>) =>
    onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        1 cent = 1/100 acre = 40.468564224 m² = 435.6 ft². Edit any field — the others update
        instantly. Area cannot be negative.
      </div>

      <FieldShell
        label="Area of property in cents"
        htmlFor="cent-m2-cent"
        tip="Land area in cents (1/100 of an international acre)."
        error={errors.cent}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cent-m2-cent"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.cent}
              placeholder="Enter area"
              aria-invalid={Boolean(errors.cent)}
              onChange={(event) => set({ source: 'cent', cent: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            cent
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Area in square meters"
        htmlFor="cent-m2-m2"
        tip="Convert using m² = cents × 40.468564224."
        error={errors.m2}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cent-m2-m2"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.m2}
              placeholder="Enter area"
              aria-invalid={Boolean(errors.m2)}
              onChange={(event) => set({ source: 'm2', m2: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            m²
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Area in square feet"
        htmlFor="cent-m2-ft2"
        tip="Convert using ft² = cents × 435.6."
        error={errors.ft2}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cent-m2-ft2"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.ft2}
              placeholder="Enter area"
              aria-invalid={Boolean(errors.ft2)}
              onChange={(event) => set({ source: 'ft2', ft2: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            ft²
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
