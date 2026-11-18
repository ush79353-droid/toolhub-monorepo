'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DEFAULT_UNITS,
  FIELD_LABELS,
  MILLILITER_UNIT_OPTIONS,
  ML_PER_UK_FL_OZ,
  ML_PER_US_FL_OZ,
  OUNCE_UNIT_OPTIONS,
  OTHER_UNIT_OPTIONS,
  unitSymbol,
  type MlOzField,
  type MlToOzFieldErrors,
  type VolumeUnitId,
} from './types';

export interface MlToOzDraft {
  texts: Record<MlOzField, string>;
  units: Record<MlOzField, VolumeUnitId>;
  activeField: MlOzField | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-w-[6.5rem]';

export function emptyDraft(): MlToOzDraft {
  return {
    texts: { milliliters: '', ounces: '', other: '' },
    units: { ...DEFAULT_UNITS },
    activeField: null,
  };
}

interface MlToOzFormProps {
  draft: MlToOzDraft;
  errors: MlToOzFieldErrors;
  onDraftChange: (draft: MlToOzDraft) => void;
  onUnitChange: (field: MlOzField, unit: VolumeUnitId) => void;
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
  field: MlOzField;
  options: readonly VolumeUnitId[];
  tip: string;
  draft: MlToOzDraft;
  errors: MlToOzFieldErrors;
  onDraftChange: (draft: MlToOzDraft) => void;
  onUnitChange: (field: MlOzField, unit: VolumeUnitId) => void;
}) {
  const id = `ml-oz-${field}`;
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

export function MlToOzForm({
  draft,
  errors,
  onDraftChange,
  onUnitChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MlToOzFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Fluid ounces measure volume — not mass ounces. Exact: 1 US fl oz = {ML_PER_US_FL_OZ} mL · 1
        UK fl oz = {ML_PER_UK_FL_OZ} mL. US and UK fluid ounces are different sizes.
      </div>

      <FieldRow
        field="milliliters"
        options={MILLILITER_UNIT_OPTIONS}
        tip="Enter a non-negative volume. Changing the unit keeps the same physical volume."
        draft={draft}
        errors={errors}
        onDraftChange={onDraftChange}
        onUnitChange={onUnitChange}
      />
      <FieldRow
        field="ounces"
        options={OUNCE_UNIT_OPTIONS}
        tip="Choose US fl oz or UK (Imperial) fl oz. Switching systems recalculates from the same volume."
        draft={draft}
        errors={errors}
        onDraftChange={onDraftChange}
        onUnitChange={onUnitChange}
      />
      <FieldRow
        field="other"
        options={OTHER_UNIT_OPTIONS}
        tip="Third synchronized volume unit. Default is cubic meters (m³)."
        draft={draft}
        errors={errors}
        onDraftChange={onDraftChange}
        onUnitChange={onUnitChange}
      />

      <p className="text-xs text-muted-foreground">
        US fl oz = mL ÷ {ML_PER_US_FL_OZ} · UK fl oz = mL ÷ {ML_PER_UK_FL_OZ}
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
