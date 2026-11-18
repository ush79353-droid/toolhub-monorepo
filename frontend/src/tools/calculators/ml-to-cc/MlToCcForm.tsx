'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ML_PER_LITER,
  PRIMARY_UNITS,
  UNIT_LABELS,
  UNIT_SYMBOLS,
  type MlCcUnit,
  type MlToCcFieldErrors,
} from './types';

export interface MlToCcDraft {
  texts: Record<MlCcUnit, string>;
  activeField: MlCcUnit | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

function emptyTexts(): Record<MlCcUnit, string> {
  return { ml: '', liters: '', cc: '' };
}

export function emptyDraft(): MlToCcDraft {
  return { texts: emptyTexts(), activeField: null };
}

interface MlToCcFormProps {
  draft: MlToCcDraft;
  errors: MlToCcFieldErrors;
  onDraftChange: (draft: MlToCcDraft) => void;
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
  field: MlCcUnit;
  draft: MlToCcDraft;
  errors: MlToCcFieldErrors;
  onDraftChange: (draft: MlToCcDraft) => void;
}) {
  const id = `ml-cc-${field}`;
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
        <span className="flex h-11 min-w-[5.5rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent">
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

export function MlToCcForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MlToCcFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 mL = 1 cc = 1 cm³. Also 1 L = {ML_PER_LITER.toLocaleString('en-US')} mL ={' '}
        {ML_PER_LITER.toLocaleString('en-US')} cc. Edit any field; the others update instantly.
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
