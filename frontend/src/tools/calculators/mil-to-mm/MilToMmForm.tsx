'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  MM_PER_MIL,
  PRIMARY_UNITS,
  UNIT_LABELS,
  UNIT_SYMBOLS,
  type MilMmUnit,
  type MilToMmFieldErrors,
} from './types';

export interface MilToMmDraft {
  texts: Record<MilMmUnit, string>;
  activeField: MilMmUnit | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

function emptyTexts(): Record<MilMmUnit, string> {
  return { mil: '', mm: '' };
}

export function emptyDraft(): MilToMmDraft {
  return { texts: emptyTexts(), activeField: null };
}

interface MilToMmFormProps {
  draft: MilToMmDraft;
  errors: MilToMmFieldErrors;
  onDraftChange: (draft: MilToMmDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function FieldRow({
  field,
  draft,
  errors,
  onDraftChange,
}: {
  field: MilMmUnit;
  draft: MilToMmDraft;
  errors: MilToMmFieldErrors;
  onDraftChange: (draft: MilToMmDraft) => void;
}) {
  const id = `mil-mm-${field}`;
  const error = errors[field];
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {UNIT_LABELS[field]}
      </label>
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id={id}
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            className={inputClass}
            value={draft.texts[field]}
            placeholder="Enter value"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                texts: { ...draft.texts, [field]: event.target.value },
                activeField: field,
              })
            }
          />
        </div>
        <span className="flex h-11 min-w-[4.25rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent">
          {UNIT_SYMBOLS[field]}
        </span>
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function MilToMmForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MilToMmFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 mil = {MM_PER_MIL} mm (a mil is a thousandth of an inch — not a millimeter, mile,
        or milliradian). Edit either field; the other updates instantly.
      </div>

      {PRIMARY_UNITS.map((unit) => (
        <FieldRow
          key={unit}
          field={unit}
          draft={draft}
          errors={errors}
          onDraftChange={onDraftChange}
        />
      ))}

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
