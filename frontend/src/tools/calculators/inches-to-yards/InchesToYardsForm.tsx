'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { InchesToYardsFieldErrors, InchesToYardsInput, InchesYardsSource } from './types';
import { parseOptionalNumber } from './validation';

export interface InchesToYardsDraft {
  source: InchesYardsSource;
  inches: string;
  yards: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: InchesToYardsDraft): InchesToYardsInput {
  return {
    source: draft.source,
    inches: parseOptionalNumber(draft.inches),
    yards: parseOptionalNumber(draft.yards),
  };
}

export function emptyDraft(): InchesToYardsDraft {
  return { source: 'inches', inches: '', yards: '' };
}

interface InchesToYardsFormProps {
  draft: InchesToYardsDraft;
  errors: InchesToYardsFieldErrors;
  onDraftChange: (draft: InchesToYardsDraft) => void;
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

export function InchesToYardsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: InchesToYardsFormProps) {
  const set = (patch: Partial<InchesToYardsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact relationship: 1 yard = 36 inches. Edit either field — the other updates instantly.
        Signed values are supported for mathematical differences.
      </div>

      <FieldShell
        label="Length in inches"
        htmlFor="in-yd-inches"
        tip="Enter a length in inches. Yards = inches ÷ 36."
        error={errors.inches}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="in-yd-inches"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.inches}
              placeholder="Enter inches"
              aria-invalid={Boolean(errors.inches)}
              onChange={(event) => set({ source: 'inches', inches: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            in
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Length in yards"
        htmlFor="in-yd-yards"
        tip="Enter a length in yards. Inches = yards × 36."
        error={errors.yards}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="in-yd-yards"
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

      <p className="text-xs text-muted-foreground">1 yd = 36 in · Yards = Inches ÷ 36</p>

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
