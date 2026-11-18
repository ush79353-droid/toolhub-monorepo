'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  MORE_PRESSURE_UNITS,
  PRIMARY_PRESSURE_UNITS,
  PRESSURE_UNIT_FIELDS,
  UNIT_LABELS,
  UNIT_SYMBOLS,
  type PressureUnitField,
  type PressureUnitFieldErrors,
} from './types';

export interface PressureUnitDraft {
  texts: Record<PressureUnitField, string>;
  activeField: PressureUnitField | null;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

function emptyTexts(): Record<PressureUnitField, string> {
  const texts = {} as Record<PressureUnitField, string>;
  for (const unit of PRESSURE_UNIT_FIELDS) texts[unit] = '';
  return texts;
}

export function emptyDraft(): PressureUnitDraft {
  return {
    texts: emptyTexts(),
    activeField: null,
    moreOpen: false,
  };
}

interface PressureUnitConversionFormProps {
  draft: PressureUnitDraft;
  errors: PressureUnitFieldErrors;
  onDraftChange: (draft: PressureUnitDraft) => void;
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
  field: PressureUnitField;
  draft: PressureUnitDraft;
  errors: PressureUnitFieldErrors;
  onDraftChange: (draft: PressureUnitDraft) => void;
}) {
  const id = `pressure-unit-${field}`;
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
            placeholder=""
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

export function PressureUnitConversionForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: PressureUnitConversionFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Convert between pressure units using Pascal (Pa) as the internal base. Enter any field —
        all stay linked. Signed gauge or differential values are allowed; this tool converts units
        only, not absolute vs gauge reference.
      </div>

      <p className="text-sm font-medium text-accent">Convert Between Pressure Units</p>

      {PRIMARY_PRESSURE_UNITS.map((unit) => (
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
          aria-expanded={draft.moreOpen}
          onClick={() => onDraftChange({ ...draft, moreOpen: !draft.moreOpen })}
        >
          <span>More pressure units</span>
          {draft.moreOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>
        {draft.moreOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3">
            {MORE_PRESSURE_UNITS.map((unit) => (
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
        Exact: 1 bar = 100,000 Pa · 1 atm = 101,325 Pa · 1 Torr = 1 atm ÷ 760 · conventional mmHg ≠
        Torr
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
