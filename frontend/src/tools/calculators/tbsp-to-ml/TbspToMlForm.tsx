'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DEFAULT_UNITS,
  FIELD_LABELS,
  MILLILITER_UNIT_OPTIONS,
  ML_PER_AU_TBSP,
  ML_PER_METRIC_TBSP,
  ML_PER_US_TBSP,
  OTHER_UNIT_OPTIONS,
  TABLESPOON_UNIT_OPTIONS,
  unitSymbol,
  type TbspMlField,
  type TbspToMlFieldErrors,
  type VolumeUnitId,
} from './types';

export interface TbspToMlDraft {
  texts: Record<TbspMlField, string>;
  units: Record<TbspMlField, VolumeUnitId>;
  activeField: TbspMlField | null;
  otherOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-w-[7rem]';
const sectionClass = 'space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

export function emptyDraft(): TbspToMlDraft {
  return {
    texts: { tablespoons: '', milliliters: '', other: '' },
    units: { ...DEFAULT_UNITS },
    activeField: null,
    otherOpen: false,
  };
}

interface TbspToMlFormProps {
  draft: TbspToMlDraft;
  errors: TbspToMlFieldErrors;
  onDraftChange: (draft: TbspToMlDraft) => void;
  onUnitChange: (field: TbspMlField, unit: VolumeUnitId) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function FieldRow({
  field,
  options,
  tip,
  draft,
  errors,
  onDraftChange,
  onUnitChange,
}: {
  field: TbspMlField;
  options: readonly VolumeUnitId[];
  tip: string;
  draft: TbspToMlDraft;
  errors: TbspToMlFieldErrors;
  onDraftChange: (draft: TbspToMlDraft) => void;
  onUnitChange: (field: TbspMlField, unit: VolumeUnitId) => void;
}) {
  const id = `tbsp-ml-${field}`;
  const error = errors[field];
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {FIELD_LABELS[field]}{' '}
        <InfoTooltip label={FIELD_LABELS[field]} text={tip} />
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
            placeholder="Enter volume"
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
        <select
          className={selectClass}
          value={draft.units[field]}
          aria-label={`${FIELD_LABELS[field]} unit`}
          onChange={(event) => onUnitChange(field, event.target.value as VolumeUnitId)}
        >
          {options.map((unit) => (
            <option key={unit} value={unit}>
              {unitSymbol(unit)}
            </option>
          ))}
        </select>
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TbspToMlForm({
  draft,
  errors,
  onDraftChange,
  onUnitChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: TbspToMlFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Tablespoon size depends on the measurement system. Defaults to US tbsp (
        {ML_PER_US_TBSP} mL). Also: metric {ML_PER_METRIC_TBSP} mL · Australian {ML_PER_AU_TBSP}{' '}
        mL. Exact US values differ from the common 15 mL approximation.
      </div>

      <FieldRow
        field="tablespoons"
        options={TABLESPOON_UNIT_OPTIONS}
        tip="Choose US, metric, or Australian tablespoon. Switching standards keeps the same physical volume."
        draft={draft}
        errors={errors}
        onDraftChange={onDraftChange}
        onUnitChange={onUnitChange}
      />
      <FieldRow
        field="milliliters"
        options={MILLILITER_UNIT_OPTIONS}
        tip="Enter a non-negative volume. Changing the unit keeps the same physical volume."
        draft={draft}
        errors={errors}
        onDraftChange={onDraftChange}
        onUnitChange={onUnitChange}
      />

      <div className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 text-left text-sm font-semibold text-accent"
          aria-expanded={draft.otherOpen}
          onClick={() => onDraftChange({ ...draft, otherOpen: !draft.otherOpen })}
        >
          More relevant units
          {draft.otherOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" aria-hidden />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
          )}
        </button>

        {draft.otherOpen ? (
          <FieldRow
            field="other"
            options={OTHER_UNIT_OPTIONS}
            tip="Third synchronized volume unit. Default is US teaspoon."
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
            onUnitChange={onUnitChange}
          />
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        US mL = tbsp × {ML_PER_US_TBSP} · metric mL = tbsp × {ML_PER_METRIC_TBSP}
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
