'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  IMPERIAL_PRIMARY,
  KM_PRIMARY,
  KM_SYNC_UNITS,
  METRIC_PRIMARY,
  UNIT_LABELS,
  UNIT_SYMBOLS,
  type KilometerFieldErrors,
  type KmSyncUnit,
  type LengthUnit,
} from './types';

export interface KilometerDraft {
  texts: Record<KmSyncUnit, string>;
  activeField: KmSyncUnit | null;
  kmOpen: boolean;
  metricOpen: boolean;
  imperialOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

function emptyTexts(): Record<KmSyncUnit, string> {
  const texts = {} as Record<KmSyncUnit, string>;
  for (const unit of KM_SYNC_UNITS) texts[unit] = '';
  return texts;
}

export function emptyDraft(): KilometerDraft {
  return {
    texts: emptyTexts(),
    activeField: null,
    kmOpen: true,
    metricOpen: true,
    imperialOpen: true,
  };
}

interface KilometerCalculatorFormProps {
  draft: KilometerDraft;
  errors: KilometerFieldErrors;
  onDraftChange: (draft: KilometerDraft) => void;
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
  field: KmSyncUnit;
  draft: KilometerDraft;
  errors: KilometerFieldErrors;
  onDraftChange: (draft: KilometerDraft) => void;
}) {
  const id = `km-calc-${field}`;
  const error = errors[field as LengthUnit];
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

function AccordionSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open ? <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3">{children}</div> : null}
    </div>
  );
}

export function KilometerCalculatorForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: KilometerCalculatorFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Convert kilometers to metric and Imperial/US length units. Exact: 1 km = 1,000 m; 1
 international mile = 1.609344 km. Enter any field; all stay linked through meters.
        Distances cannot be negative.
      </div>

      <AccordionSection
        title="Kilometer"
        open={draft.kmOpen}
        onToggle={() => onDraftChange({ ...draft, kmOpen: !draft.kmOpen })}
      >
        {KM_PRIMARY.map((unit) => (
          <FieldRow
            key={unit}
            field={unit}
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
        ))}
      </AccordionSection>

      <AccordionSection
        title="Metric"
        open={draft.metricOpen}
        onToggle={() => onDraftChange({ ...draft, metricOpen: !draft.metricOpen })}
      >
        {METRIC_PRIMARY.map((unit) => (
          <FieldRow
            key={unit}
            field={unit}
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
        ))}
      </AccordionSection>

      <AccordionSection
        title="Imperial/US"
        open={draft.imperialOpen}
        onToggle={() => onDraftChange({ ...draft, imperialOpen: !draft.imperialOpen })}
      >
        {IMPERIAL_PRIMARY.map((unit) => (
          <FieldRow
            key={unit}
            field={unit}
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
        ))}
      </AccordionSection>

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
