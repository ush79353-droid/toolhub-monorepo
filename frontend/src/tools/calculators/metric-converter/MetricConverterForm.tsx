'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CATEGORY_OPTIONS, type ConversionCategory, type MetricFieldErrors } from './types';
import { getCategory } from './units';

export interface MetricDraft {
  category: ConversionCategory;
  texts: Record<string, string>;
  activeField: string | null;
  /** groupId → open */
  openGroups: Record<string, boolean>;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

export function defaultOpenGroups(category: ConversionCategory): Record<string, boolean> {
  const open: Record<string, boolean> = {};
  const groups = getCategory(category).groups;
  groups.forEach((group, index) => {
    open[group.id] = index === 0;
  });
  return open;
}

export function emptyDraft(category: ConversionCategory = 'length'): MetricDraft {
  return {
    category,
    texts: {},
    activeField: null,
    openGroups: defaultOpenGroups(category),
  };
}

interface MetricConverterFormProps {
  draft: MetricDraft;
  errors: MetricFieldErrors;
  onDraftChange: (draft: MetricDraft) => void;
  onCategoryChange: (category: ConversionCategory) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function FieldRow({
  unitId,
  label,
  symbol,
  draft,
  errors,
  onDraftChange,
}: {
  unitId: string;
  label: string;
  symbol: string;
  draft: MetricDraft;
  errors: MetricFieldErrors;
  onDraftChange: (draft: MetricDraft) => void;
}) {
  const id = `metric-conv-${draft.category}-${unitId}`;
  const error = errors[unitId];
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id={id}
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            className={inputClass}
            value={draft.texts[unitId] ?? ''}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                texts: { ...draft.texts, [unitId]: event.target.value },
                activeField: unitId,
              })
            }
          />
        </div>
        <span className="flex h-11 min-w-[4.5rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent">
          {symbol}
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

export function MetricConverterForm({
  draft,
  errors,
  onDraftChange,
  onCategoryChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MetricConverterFormProps) {
  const category = getCategory(draft.category);

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Choose a conversion type, then edit any field. All units in that category stay linked through
        a single base quantity. Temperature uses affine formulas; other categories use multiplicative
        factors. Dimensions never mix.
      </div>

      <div className="space-y-1.5">
        <label htmlFor="metric-category" className={labelClass}>
          Type of conversion
        </label>
        <select
          id="metric-category"
          className={selectClass}
          value={draft.category}
          onChange={(event) => onCategoryChange(event.target.value as ConversionCategory)}
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {category.groups.map((group) => (
        <AccordionSection
          key={group.id}
          title={group.title}
          open={draft.openGroups[group.id] ?? false}
          onToggle={() =>
            onDraftChange({
              ...draft,
              openGroups: {
                ...draft.openGroups,
                [group.id]: !draft.openGroups[group.id],
              },
            })
          }
        >
          {group.units.map((unit) => (
            <FieldRow
              key={unit.id}
              unitId={unit.id}
              label={unit.label}
              symbol={unit.symbol}
              draft={draft}
              errors={errors}
              onDraftChange={onDraftChange}
            />
          ))}
        </AccordionSection>
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
