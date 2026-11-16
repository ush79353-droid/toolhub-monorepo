'use client';

import type { FormEvent, ReactNode } from 'react';
import { ArrowLeftRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CATEGORY_LIST, getCategory } from './catalog';
import {
  DEFAULT_CATEGORY,
  DEFAULT_DEST_UNIT,
  DEFAULT_SOURCE_UNIT,
  DEFAULT_SOURCE_VALUE,
  type CategoryId,
  type ConversionField,
  type ConversionFieldErrors,
} from './types';
import { convertValue, formatAmount } from './calculation';

export interface ConversionDraft {
  category: CategoryId;
  source: string;
  dest: string;
  sourceUnit: string;
  destUnit: string;
  activeField: ConversionField | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const unitSelectClass =
  'h-11 w-[9.5rem] shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring sm:w-40';

export function defaultDraft(): ConversionDraft {
  const result = convertValue(
    DEFAULT_CATEGORY,
    DEFAULT_SOURCE_UNIT,
    DEFAULT_DEST_UNIT,
    DEFAULT_SOURCE_VALUE,
  );
  return {
    category: DEFAULT_CATEGORY,
    source: String(DEFAULT_SOURCE_VALUE),
    dest: result.ok ? formatAmount(result.value) : '',
    sourceUnit: DEFAULT_SOURCE_UNIT,
    destUnit: DEFAULT_DEST_UNIT,
    activeField: null,
  };
}

export function emptyDraft(
  category: CategoryId = DEFAULT_CATEGORY,
  sourceUnit?: string,
  destUnit?: string,
): ConversionDraft {
  const cat = getCategory(category);
  return {
    category,
    source: '',
    dest: '',
    sourceUnit: sourceUnit ?? cat.defaultSourceUnit,
    destUnit: destUnit ?? cat.defaultDestUnit,
    activeField: null,
  };
}

interface ConversionFormProps {
  draft: ConversionDraft;
  errors: ConversionFieldErrors;
  onDraftChange: (draft: ConversionDraft) => void;
  onSwap: () => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function ConversionForm({
  draft,
  errors,
  onDraftChange,
  onSwap,
  onSubmit,
  onReset,
  onReload,
  children,
}: ConversionFormProps) {
  const category = getCategory(draft.category);

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Convert within one measurement category at a time. Changing the category updates the unit
        lists. Edit either value for reverse conversion.
      </div>

      <div className="space-y-1.5">
        <label htmlFor="conv-category" className={labelClass}>
          Measurement category
        </label>
        <select
          id="conv-category"
          className={selectClass}
          value={draft.category}
          onChange={(event) => {
            const next = event.target.value as CategoryId;
            onDraftChange(emptyDraft(next));
          }}
        >
          {CATEGORY_LIST.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        {category.note ? (
          <p className="text-xs text-muted-foreground">{category.note}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="conv-source" className={labelClass}>
          Value
        </label>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="conv-source"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              className={inputClass}
              value={draft.source}
              placeholder="0"
              aria-invalid={Boolean(errors.source)}
              aria-describedby={errors.source ? 'conv-source-error' : undefined}
              onChange={(event) =>
                onDraftChange({
                  ...draft,
                  source: event.target.value,
                  activeField: 'source',
                })
              }
            />
          </div>
          <select
            id="conv-source-unit"
            className={unitSelectClass}
            value={draft.sourceUnit}
            aria-label="Source unit"
            onChange={(event) =>
              onDraftChange({
                ...draft,
                sourceUnit: event.target.value,
                activeField: draft.activeField ?? 'source',
              })
            }
          >
            {category.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
        {errors.source ? (
          <p id="conv-source-error" className="text-xs text-red-600" role="alert">
            {errors.source}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="conv-dest" className={labelClass}>
          Converted value
        </label>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="conv-dest"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              className={inputClass}
              value={draft.dest}
              placeholder="0"
              aria-invalid={Boolean(errors.dest)}
              aria-describedby={errors.dest ? 'conv-dest-error' : undefined}
              onChange={(event) =>
                onDraftChange({
                  ...draft,
                  dest: event.target.value,
                  activeField: 'dest',
                })
              }
            />
          </div>
          <select
            id="conv-dest-unit"
            className={unitSelectClass}
            value={draft.destUnit}
            aria-label="Destination unit"
            onChange={(event) =>
              onDraftChange({
                ...draft,
                destUnit: event.target.value,
                activeField: draft.activeField ?? 'source',
              })
            }
          >
            {category.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
        {errors.dest ? (
          <p id="conv-dest-error" className="text-xs text-red-600" role="alert">
            {errors.dest}
          </p>
        ) : null}
      </div>

      <div className="flex justify-center">
        <Button type="button" variant="outline" className="h-11" onClick={onSwap}>
          <ArrowLeftRight className="mr-1.5 h-4 w-4" />
          Swap units
        </Button>
      </div>

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
