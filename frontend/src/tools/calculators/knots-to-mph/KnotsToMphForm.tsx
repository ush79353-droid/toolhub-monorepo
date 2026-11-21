'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  FIELD_LABELS,
  FIELD_SYMBOLS,
  KNOTS_MPH_FIELDS,
  type KnotsMphField,
  type KnotsMphFieldErrors,
} from './types';

export interface KnotsToMphDraft {
  texts: Record<KnotsMphField, string>;
  activeField: KnotsMphField | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

function emptyTexts(): Record<KnotsMphField, string> {
  return { knot: '', mph: '', kmh: '', ftPerSec: '', mps: '' };
}

export function emptyDraft(): KnotsToMphDraft {
  return { texts: emptyTexts(), activeField: null };
}

interface KnotsToMphFormProps {
  draft: KnotsToMphDraft;
  errors: KnotsMphFieldErrors;
  onDraftChange: (draft: KnotsToMphDraft) => void;
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
  field: KnotsMphField;
  draft: KnotsToMphDraft;
  errors: KnotsMphFieldErrors;
  onDraftChange: (draft: KnotsToMphDraft) => void;
}) {
  const id = `kn-mph-${field}`;
  const error = errors[field];
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {FIELD_LABELS[field]}
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
            placeholder="Enter speed"
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
        <span className="flex h-11 min-w-[3.5rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent">
          {FIELD_SYMBOLS[field]}
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

export function KnotsToMphForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: KnotsToMphFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        1 knot = 1 international nautical mile per hour ≈ 1.15078 mph (exact factor 1852/1609.344). Enter
 any field; all five units stay synchronized. Negative speeds are not accepted.
      </div>

      {KNOTS_MPH_FIELDS.map((field) => (
        <FieldRow
          key={field}
          field={field}
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
