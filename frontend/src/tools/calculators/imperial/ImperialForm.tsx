'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  IMPERIAL_CATEGORIES,
  fieldsForCategory,
  sectionTitle,
  type ImperialCategory,
  type ImperialFieldDef,
  type ImperialFieldErrors,
  type ImperialSection,
} from './types';
import { parseOptionalNumber } from './validation';

export interface ImperialDraft {
  category: ImperialCategory;
  sourceKey: string;
  values: Record<string, string>;
  imperialOpen: boolean;
  metricOpen: boolean;
  otherOpen: boolean;
}

export function emptyValues(category: ImperialCategory): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of fieldsForCategory(category)) {
    values[field.key] = '';
  }
  return values;
}

export function emptyDraft(category: ImperialCategory = 'length'): ImperialDraft {
  const fields = fieldsForCategory(category);
  return {
    category,
    sourceKey: fields[0]!.key,
    values: emptyValues(category),
    imperialOpen: true,
    metricOpen: true,
    otherOpen: false,
  };
}

export function draftToValue(draft: ImperialDraft): number | null {
  return parseOptionalNumber(draft.values[draft.sourceKey] ?? '');
}

interface ImperialFormProps {
  draft: ImperialDraft;
  errors: ImperialFieldErrors;
  onDraftChange: (draft: ImperialDraft) => void;
  onCategoryChange: (category: ImperialCategory) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

function UnitRow({
  field,
  value,
  error,
  onChange,
}: {
  field: ImperialFieldDef;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const id = `imperial-${field.key}`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {field.label}
      </label>
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id={id}
            inputMode="decimal"
            autoComplete="off"
            className={inputClass}
            value={value}
            placeholder="—"
            aria-invalid={Boolean(error)}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
        <span className={unitBadgeClass} aria-hidden="true">
          {field.symbol}
        </span>
      </div>
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SectionCard({
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
        onClick={onToggle}
        aria-expanded={open}
      >
        <span>{title}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0" />
        )}
      </button>
      {open ? <div className="space-y-3 border-t border-border px-3.5 py-3">{children}</div> : null}
    </div>
  );
}

export function ImperialForm({
  draft,
  errors,
  onDraftChange,
  onCategoryChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: ImperialFormProps) {
  const fields = fieldsForCategory(draft.category);
  const bySection = (section: ImperialSection) =>
    fields.filter((field) => field.section === section);

  const setField = (key: string, raw: string) => {
    onDraftChange({
      ...draft,
      sourceKey: key,
      values: { ...draft.values, [key]: raw },
    });
  };

  const tips =
    draft.category === 'volume'
      ? 'US gallons and Imperial gallons are different. 1 US gal = 3.785411784 L; 1 Imp. gal = 4.54609 L.'
      : draft.category === 'temperature'
        ? 'Temperature uses offset formulas (not plain factors). Values below absolute zero are rejected.'
        : draft.category === 'mass'
          ? 'Converts mass (not force). 1 lb = 0.45359237 kg; 1 US ton = 2,000 lb; 1 UK long ton = 2,240 lb.'
          : draft.category === 'area'
            ? 'Canonical base is square meters. 1 ft² = 0.09290304 m²; 1 acre = 4,046.8564224 m².'
            : 'Canonical base is meters. 1 in = 0.0254 m; 1 ft = 0.3048 m; 1 mi = 1,609.344 m.';

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        {tips}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="imperial-category" className={labelClass}>
          Type of conversion{' '}
          <InfoTooltip
            label="Type of conversion"
            text="Switching category clears values. Units stay within one physical dimension."
          />
        </label>
        <select
          id="imperial-category"
          className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
          value={draft.category}
          onChange={(event) => onCategoryChange(event.target.value as ImperialCategory)}
        >
          {IMPERIAL_CATEGORIES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <SectionCard
        title={sectionTitle(draft.category, 'imperial')}
        open={draft.imperialOpen}
        onToggle={() => onDraftChange({ ...draft, imperialOpen: !draft.imperialOpen })}
      >
        {bySection('imperial').map((field) => (
          <UnitRow
            key={field.key}
            field={field}
            value={draft.values[field.key] ?? ''}
            error={errors[field.key]}
            onChange={(raw) => setField(field.key, raw)}
          />
        ))}
      </SectionCard>

      <SectionCard
        title={sectionTitle(draft.category, 'metric')}
        open={draft.metricOpen}
        onToggle={() => onDraftChange({ ...draft, metricOpen: !draft.metricOpen })}
      >
        {bySection('metric').map((field) => (
          <UnitRow
            key={field.key}
            field={field}
            value={draft.values[field.key] ?? ''}
            error={errors[field.key]}
            onChange={(raw) => setField(field.key, raw)}
          />
        ))}
      </SectionCard>

      {bySection('other').length > 0 ? (
        <SectionCard
          title={sectionTitle(draft.category, 'other')}
          open={draft.otherOpen}
          onToggle={() => onDraftChange({ ...draft, otherOpen: !draft.otherOpen })}
        >
          {bySection('other').map((field) => (
            <UnitRow
              key={field.key}
              field={field}
              value={draft.values[field.key] ?? ''}
              error={errors[field.key]}
              onChange={(raw) => setField(field.key, raw)}
            />
          ))}
        </SectionCard>
      ) : null}

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
