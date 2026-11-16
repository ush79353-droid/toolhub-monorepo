'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CATEGORY_OPTIONS,
  DIRECTION_OPTIONS,
  defaultRegularId,
  defaultValueText,
  defaultWeirdId,
  regularUnitsFor,
  weirdUnitsFor,
  type ConversionDirection,
  type UnitCategory,
} from './types';

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring';

export interface WeirdUnitsDraft {
  category: UnitCategory;
  direction: ConversionDirection;
  valueText: string;
  regularId: string;
  weirdId: string;
}

export function emptyDraft(): WeirdUnitsDraft {
  return {
    category: 'length',
    direction: 'regular-to-weird',
    valueText: defaultValueText('length'),
    regularId: defaultRegularId('length'),
    weirdId: defaultWeirdId('length'),
  };
}

interface WeirdUnitsFormProps {
  draft: WeirdUnitsDraft;
  error?: string;
  onDraftChange: (draft: WeirdUnitsDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function WeirdUnitsForm({
  draft,
  error,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: WeirdUnitsFormProps) {
  const regulars = regularUnitsFor(draft.category);
  const weirds = weirdUnitsFor(draft.category);
  const valueIsWeird = draft.direction === 'weird-to-regular';

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Convert familiar measurements into memorable references (LEGO bricks, Everest heights, workdays,
        and more). Approximate biological or lifestyle references are labeled in the result.
      </div>

      <div className="space-y-1.5">
        <label htmlFor="weird-category" className={labelClass}>
          Unit type
        </label>
        <select
          id="weird-category"
          className={selectClass}
          value={draft.category}
          onChange={(event) => {
            const category = event.target.value as UnitCategory;
            onDraftChange({
              category,
              direction: draft.direction,
              valueText: defaultValueText(category),
              regularId: defaultRegularId(category),
              weirdId: defaultWeirdId(category),
            });
          }}
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="space-y-2">
        <legend className={labelClass}>Conversion direction</legend>
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Conversion direction">
          {DIRECTION_OPTIONS.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-accent has-[:checked]:border-primary has-[:checked]:bg-brand-softTeal/30"
            >
              <input
                type="radio"
                name="weird-direction"
                value={option.id}
                checked={draft.direction === option.id}
                className="h-4 w-4 accent-primary"
                onChange={() => onDraftChange({ ...draft, direction: option.id })}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor="weird-value" className={labelClass}>
          {valueIsWeird ? 'Weird measurement' : 'Regular measurement'}
        </label>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="weird-value"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              className={inputClass}
              value={draft.valueText}
              placeholder="Enter a number"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'weird-value-error' : undefined}
              onChange={(event) => onDraftChange({ ...draft, valueText: event.target.value })}
            />
          </div>
          {valueIsWeird ? (
            <select
              aria-label="Weird unit"
              className={`${selectClass} max-w-[45%] sm:max-w-[12rem]`}
              value={draft.weirdId}
              onChange={(event) => onDraftChange({ ...draft, weirdId: event.target.value })}
            >
              {weirds.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.label}
                </option>
              ))}
            </select>
          ) : (
            <select
              aria-label="Regular unit"
              className={`${selectClass} max-w-[40%] sm:max-w-[9rem]`}
              value={draft.regularId}
              onChange={(event) => onDraftChange({ ...draft, regularId: event.target.value })}
            >
              {regulars.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.symbol}
                </option>
              ))}
            </select>
          )}
        </div>
        {error ? (
          <p id="weird-value-error" className="text-xs text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="weird-target-unit" className={labelClass}>
          {valueIsWeird ? 'Regular unit' : 'Weird unit'}
        </label>
        {valueIsWeird ? (
          <select
            id="weird-target-unit"
            className={selectClass}
            value={draft.regularId}
            onChange={(event) => onDraftChange({ ...draft, regularId: event.target.value })}
          >
            {regulars.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.label} ({unit.symbol})
              </option>
            ))}
          </select>
        ) : (
          <select
            id="weird-target-unit"
            className={selectClass}
            value={draft.weirdId}
            onChange={(event) => onDraftChange({ ...draft, weirdId: event.target.value })}
          >
            {weirds.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.label}
                {unit.approximate ? ' (approx.)' : ''}
              </option>
            ))}
          </select>
        )}
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
