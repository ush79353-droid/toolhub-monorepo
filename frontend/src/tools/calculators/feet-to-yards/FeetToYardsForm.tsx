'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { FeetToYardsFieldErrors, FeetToYardsInput, FeetYardsSource } from './types';
import { parseOptionalNumber } from './validation';

export interface FeetToYardsDraft {
  source: FeetYardsSource;
  feet: string;
  yards: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: FeetToYardsDraft): FeetToYardsInput {
  return {
    source: draft.source,
    feet: parseOptionalNumber(draft.feet),
    yards: parseOptionalNumber(draft.yards),
  };
}

export function emptyDraft(): FeetToYardsDraft {
  return { source: 'feet', feet: '', yards: '' };
}

interface FeetToYardsFormProps {
  draft: FeetToYardsDraft;
  errors: FeetToYardsFieldErrors;
  onDraftChange: (draft: FeetToYardsDraft) => void;
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

export function FeetToYardsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: FeetToYardsFormProps) {
  const set = (patch: Partial<FeetToYardsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact relationship: 1 yard = 3 feet. Edit either field — the other updates instantly. Signed
        values are supported for mathematical differences.
      </div>

      <FieldShell
        label="Length in feet"
        htmlFor="ft-yd-feet"
        tip="Enter a length in feet. Yards = feet ÷ 3."
        error={errors.feet}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ft-yd-feet"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.feet}
              placeholder="Enter feet"
              aria-invalid={Boolean(errors.feet)}
              onChange={(event) => set({ source: 'feet', feet: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            ft
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Length in yards"
        htmlFor="ft-yd-yards"
        tip="Enter a length in yards. Feet = yards × 3."
        error={errors.yards}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ft-yd-yards"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.yards}
              placeholder="Enter yards"
              aria-invalid={Boolean(errors.yards)}
              onChange={(event) => set({ source: 'yards', yards: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            yd
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">1 yd = 3 ft · Yards = Feet ÷ 3</p>

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
