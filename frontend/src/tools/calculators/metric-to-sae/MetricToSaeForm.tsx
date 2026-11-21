'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MetricToSaeFieldErrors } from './types';
import {
  METRIC_UNITS,
  SAE_UNITS,
  UNIT_LABELS,
  UNIT_SYMBOLS,
  type LengthUnit,
} from './units';

export interface MetricToSaeDraft {
  texts: Partial<Record<LengthUnit, string>>;
  activeField: LengthUnit | null;
  openGroups: { metric: boolean; sae: boolean };
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function emptyDraft(): MetricToSaeDraft {
  return {
    texts: {},
    activeField: null,
    openGroups: { metric: true, sae: true },
  };
}

interface MetricToSaeFormProps {
  draft: MetricToSaeDraft;
  errors: MetricToSaeFieldErrors;
  onDraftChange: (draft: MetricToSaeDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
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

function FieldRow({
  unit,
  draft,
  errors,
  onDraftChange,
}: {
  unit: LengthUnit;
  draft: MetricToSaeDraft;
  errors: MetricToSaeFieldErrors;
  onDraftChange: (draft: MetricToSaeDraft) => void;
}) {
  const id = `metric-sae-${unit}`;
  const error = errors[unit];
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {UNIT_LABELS[unit]}
      </label>
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id={id}
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            className={inputClass}
            value={draft.texts[unit] ?? ''}
            placeholder="Enter value"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                texts: { ...draft.texts, [unit]: event.target.value },
                activeField: unit,
              })
            }
          />
        </div>
        <span className="flex h-11 min-w-[3.25rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent">
          {UNIT_SYMBOLS[unit]}
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

export function MetricToSaeForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MetricToSaeFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Edit any metric or SAE field; all eight stay synchronized through meters. Exact factors: 1
        in = 25.4 mm, 1 ft = 0.3048 m, 1 mi = 1.609344 km.
      </div>

      <AccordionSection
        title="Metric"
        open={draft.openGroups.metric}
        onToggle={() =>
          onDraftChange({
            ...draft,
            openGroups: { ...draft.openGroups, metric: !draft.openGroups.metric },
          })
        }
      >
        {METRIC_UNITS.map((unit) => (
          <FieldRow
            key={unit}
            unit={unit}
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
        ))}
      </AccordionSection>

      <AccordionSection
        title="SAE"
        open={draft.openGroups.sae}
        onToggle={() =>
          onDraftChange({
            ...draft,
            openGroups: { ...draft.openGroups, sae: !draft.openGroups.sae },
          })
        }
      >
        {SAE_UNITS.map((unit) => (
          <FieldRow
            key={unit}
            unit={unit}
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
