'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { CmToInFieldErrors, CmToInInput, CmToInSource } from './types';
import { parseOptionalNumber } from './validation';

export interface CmToInDraft {
  source: CmToInSource;
  centimeters: string;
  inches: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: CmToInDraft): CmToInInput {
  return {
    source: draft.source,
    centimeters: parseOptionalNumber(draft.centimeters),
    inches: parseOptionalNumber(draft.inches),
  };
}

export function emptyDraft(): CmToInDraft {
  return { source: 'centimeters', centimeters: '', inches: '' };
}

interface CmToInFormProps {
  draft: CmToInDraft;
  errors: CmToInFieldErrors;
  onDraftChange: (draft: CmToInDraft) => void;
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

export function CmToInForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CmToInFormProps) {
  const set = (patch: Partial<CmToInDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact international inch: 1 in = 2.54 cm. Edit either field — the other updates instantly.
      </div>

      <FieldShell
        label="Length in centimeters"
        htmlFor="cm-in-cm"
        tip="Enter a length in centimeters. Inches = cm ÷ 2.54."
        error={errors.centimeters}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cm-in-cm"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.centimeters}
              placeholder="Enter length"
              aria-invalid={Boolean(errors.centimeters)}
              onChange={(event) =>
                set({ source: 'centimeters', centimeters: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            cm
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Length in inches"
        htmlFor="cm-in-in"
        tip="Enter a length in inches. Centimeters = inches × 2.54."
        error={errors.inches}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cm-in-in"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.inches}
              placeholder="Enter length"
              aria-invalid={Boolean(errors.inches)}
              onChange={(event) => set({ source: 'inches', inches: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            in
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">1 in = 2.54 cm · 1 cm ≈ 0.3937007874 in</p>

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
