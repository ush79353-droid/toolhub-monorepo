'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  COMMON_UNITS,
  OTHER_UNITS,
  PRIMARY_UNITS,
  SQUARE_METERS_PER_SQUARE_YARD,
  SQUARE_YARD_UNITS,
  UNIT_LABELS,
  UNIT_SYMBOLS,
  type AreaUnit,
  type SquareYardFieldErrors,
} from './types';

export interface SquareYardDraft {
  texts: Record<AreaUnit, string>;
  activeField: AreaUnit | null;
  commonOpen: boolean;
  otherOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

function emptyTexts(): Record<AreaUnit, string> {
  const texts = {} as Record<AreaUnit, string>;
  for (const unit of SQUARE_YARD_UNITS) texts[unit] = '';
  return texts;
}

export function emptyDraft(): SquareYardDraft {
  return {
    texts: emptyTexts(),
    activeField: null,
    commonOpen: true,
    otherOpen: false,
  };
}

interface SquareYardConverterFormProps {
  draft: SquareYardDraft;
  errors: SquareYardFieldErrors;
  onDraftChange: (draft: SquareYardDraft) => void;
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
  field: AreaUnit;
  draft: SquareYardDraft;
  errors: SquareYardFieldErrors;
  onDraftChange: (draft: SquareYardDraft) => void;
}) {
  const id = `yd2-conv-${field}`;
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
            placeholder={field === 'yd2' ? 'Enter area' : 'Converted area'}
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
        <span className="flex h-11 min-w-[4.5rem] shrink-0 items-center justify-center rounded-lg border border-sky-200 bg-sky-50 px-2 text-sm font-medium text-sky-800">
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

export function SquareYardConverterForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: SquareYardConverterFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Convert square yards to square feet, square meters, acres, and more, or reverse from any
        field. Exact international yard: 1 yd² = {SQUARE_METERS_PER_SQUARE_YARD} m² = 9 ft². Area
        cannot be negative.
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

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.commonOpen}
          onClick={() => onDraftChange({ ...draft, commonOpen: !draft.commonOpen })}
        >
          <span>Conversion for common units</span>
          {draft.commonOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>
        {draft.commonOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3">
            {COMMON_UNITS.map((unit) => (
              <FieldRow
                key={unit}
                field={unit}
                draft={draft}
                errors={errors}
                onDraftChange={onDraftChange}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.otherOpen}
          onClick={() => onDraftChange({ ...draft, otherOpen: !draft.otherOpen })}
        >
          <span>Conversion for other units</span>
          {draft.otherOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>
        {draft.otherOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3">
            {OTHER_UNITS.map((unit) => (
              <FieldRow
                key={unit}
                field={unit}
                draft={draft}
                errors={errors}
                onDraftChange={onDraftChange}
              />
            ))}
          </div>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        1 yd² = 9 ft² · 1 yd² = {SQUARE_METERS_PER_SQUARE_YARD} m² · 1 acre = 4,840 yd²
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
