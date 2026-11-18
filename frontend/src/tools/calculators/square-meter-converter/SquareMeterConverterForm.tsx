'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  OTHER_AREA_UNITS,
  PRIMARY_UNITS,
  SQUARE_METER_UNITS,
  UNIT_LABELS,
  UNIT_SYMBOLS,
  type AreaUnit,
  type SquareMeterFieldErrors,
} from './types';

export interface SquareMeterDraft {
  texts: Record<AreaUnit, string>;
  activeField: AreaUnit | null;
  otherOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

function emptyTexts(): Record<AreaUnit, string> {
  const texts = {} as Record<AreaUnit, string>;
  for (const unit of SQUARE_METER_UNITS) texts[unit] = '';
  return texts;
}

export function emptyDraft(): SquareMeterDraft {
  return {
    texts: emptyTexts(),
    activeField: null,
    otherOpen: false,
  };
}

interface SquareMeterConverterFormProps {
  draft: SquareMeterDraft;
  errors: SquareMeterFieldErrors;
  onDraftChange: (draft: SquareMeterDraft) => void;
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
  draft: SquareMeterDraft;
  errors: SquareMeterFieldErrors;
  onDraftChange: (draft: SquareMeterDraft) => void;
}) {
  const id = `m2-conv-${field}`;
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
            placeholder="Enter area"
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
        <span className="flex h-11 min-w-[4.5rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent">
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

export function SquareMeterConverterForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: SquareMeterConverterFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Convert square meters to square feet, inches, yards, cm², mm², km², acres, hectares, and
        square miles — or reverse from any field. Exact international foot and acre factors via
        square meters. Area cannot be negative.
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
          aria-expanded={draft.otherOpen}
          onClick={() => onDraftChange({ ...draft, otherOpen: !draft.otherOpen })}
        >
          <span>Other Area Units</span>
          {draft.otherOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>
        {draft.otherOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3">
            {OTHER_AREA_UNITS.map((unit) => (
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
        1 m² ≈ 10.7639104167 ft² · 1 m² = 10,000 cm² · 1 ha = 10,000 m²
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
