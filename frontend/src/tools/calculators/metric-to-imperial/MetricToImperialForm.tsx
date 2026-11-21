'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CATEGORY_OPTIONS,
  type ActiveField,
  type ConversionCategory,
  type MetricImperialFieldErrors,
} from './types';
import { getCategory } from './units';

export interface MetricToImperialDraft {
  category: ConversionCategory;
  metricUnit: string;
  imperialUnit: string;
  metric: string;
  imperial: string;
  activeField: ActiveField;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const unitSelectClass =
  'h-11 min-w-[6.5rem] shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring sm:min-w-[8rem]';

export function emptyDraft(category: ConversionCategory = 'length'): MetricToImperialDraft {
  const cat = getCategory(category);
  return {
    category,
    metricUnit: cat.defaultMetricUnit,
    imperialUnit: cat.defaultImperialUnit,
    metric: '',
    imperial: '',
    activeField: 'metric',
  };
}

interface MetricToImperialFormProps {
  draft: MetricToImperialDraft;
  errors: MetricImperialFieldErrors;
  onDraftChange: (draft: MetricToImperialDraft) => void;
  onCategoryChange: (category: ConversionCategory) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function MetricToImperialForm({
  draft,
  errors,
  onDraftChange,
  onCategoryChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MetricToImperialFormProps) {
  const cat = getCategory(draft.category);
  const set = (patch: Partial<MetricToImperialDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Convert between metric and imperial / US customary units within one category. Edit either
 field: the other updates instantly. Temperature uses affine formulas; other quantities use
        exact scale factors. US and UK volume units are distinct.
      </div>

      <div className="space-y-1.5">
        <label htmlFor="m2i-category" className={labelClass}>
          Type of conversion
        </label>
        <select
          id="m2i-category"
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

      <div className="space-y-1.5">
        <label htmlFor="m2i-metric" className={labelClass}>
          {cat.metricFieldLabel}
        </label>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="m2i-metric"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              className={inputClass}
              value={draft.metric}
              placeholder="Enter value"
              aria-invalid={Boolean(errors.metric)}
              onChange={(event) =>
                set({ metric: event.target.value, activeField: 'metric' })
              }
            />
          </div>
          <select
            aria-label="Metric unit"
            className={unitSelectClass}
            value={draft.metricUnit}
            onChange={(event) => set({ metricUnit: event.target.value })}
          >
            {cat.metricUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.symbol}
              </option>
            ))}
          </select>
        </div>
        {errors.metric ? (
          <p className="text-xs text-red-600" role="alert">
            {errors.metric}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="m2i-imperial" className={labelClass}>
          {cat.imperialFieldLabel}
        </label>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="m2i-imperial"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              className={inputClass}
              value={draft.imperial}
              placeholder="Enter value"
              aria-invalid={Boolean(errors.imperial)}
              onChange={(event) =>
                set({ imperial: event.target.value, activeField: 'imperial' })
              }
            />
          </div>
          <select
            aria-label="Imperial unit"
            className={unitSelectClass}
            value={draft.imperialUnit}
            onChange={(event) => set({ imperialUnit: event.target.value })}
          >
            {cat.imperialUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.symbol}
              </option>
            ))}
          </select>
        </div>
        {errors.imperial ? (
          <p className="text-xs text-red-600" role="alert">
            {errors.imperial}
          </p>
        ) : null}
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
