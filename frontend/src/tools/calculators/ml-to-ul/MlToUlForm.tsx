'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DEFAULT_UNITS,
  FIELD_LABELS,
  OTHER_UNIT_OPTIONS,
  UL_PER_ML,
  unitSymbol,
  type MlUlField,
  type MlToUlFieldErrors,
  type VolumeUnitId,
} from './types';

export interface MlToUlDraft {
  texts: Record<MlUlField, string>;
  units: Record<MlUlField, VolumeUnitId>;
  activeField: MlUlField | null;
  otherOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-w-[6.5rem]';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';
const sectionClass = 'space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

export function emptyDraft(): MlToUlDraft {
  return {
    texts: { milliliters: '', microliters: '', other: '' },
    units: { ...DEFAULT_UNITS },
    activeField: null,
    otherOpen: false,
  };
}

interface MlToUlFormProps {
  draft: MlToUlDraft;
  errors: MlToUlFieldErrors;
  onDraftChange: (draft: MlToUlDraft) => void;
  onUnitChange: (field: MlUlField, unit: VolumeUnitId) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function PrimaryField({
  field,
  tip,
  draft,
  errors,
  onDraftChange,
}: {
  field: 'milliliters' | 'microliters';
  tip: string;
  draft: MlToUlDraft;
  errors: MlToUlFieldErrors;
  onDraftChange: (draft: MlToUlDraft) => void;
}) {
  const id = `ml-ul-${field}`;
  const error = errors[field];
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {FIELD_LABELS[field]} <InfoTooltip label={FIELD_LABELS[field]} text={tip} />
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
        <span className={unitBadgeClass} aria-hidden="true">
          {unitSymbol(draft.units[field])}
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

export function MlToUlForm({
  draft,
  errors,
  onDraftChange,
  onUnitChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MlToUlFormProps) {
  const otherId = 'ml-ul-other';
  const otherError = errors.other;

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 mL = {UL_PER_ML.toLocaleString('en-US')} µL (also written uL / microliter). Edit
        either field; the other updates instantly.
      </div>

      <PrimaryField
        field="milliliters"
        tip="Enter a non-negative volume in milliliters."
        draft={draft}
        errors={errors}
        onDraftChange={onDraftChange}
      />
      <PrimaryField
        field="microliters"
        tip="Enter a non-negative volume in microliters (µL). Same as uL in plain text."
        draft={draft}
        errors={errors}
        onDraftChange={onDraftChange}
      />

      <div className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 text-left text-sm font-semibold text-accent"
          aria-expanded={draft.otherOpen}
          onClick={() => onDraftChange({ ...draft, otherOpen: !draft.otherOpen })}
        >
          Volume in other units
          {draft.otherOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" aria-hidden />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
          )}
        </button>

        {draft.otherOpen ? (
          <div className="space-y-1.5">
            <label htmlFor={otherId} className={labelClass}>
              {FIELD_LABELS.other}{' '}
              <InfoTooltip
                label={FIELD_LABELS.other}
                text="Third synchronized volume unit. Changing the unit preserves physical volume."
              />
            </label>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id={otherId}
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck={false}
                  className={inputClass}
                  value={draft.texts.other}
                  placeholder="Enter volume"
                  aria-invalid={Boolean(otherError)}
                  aria-describedby={otherError ? `${otherId}-error` : undefined}
                  onChange={(event) =>
                    onDraftChange({
                      ...draft,
                      texts: { ...draft.texts, other: event.target.value },
                      activeField: 'other',
                    })
                  }
                />
              </div>
              <select
                className={selectClass}
                value={draft.units.other}
                aria-label="Other volume unit"
                onChange={(event) =>
                  onUnitChange('other', event.target.value as VolumeUnitId)
                }
              >
                {OTHER_UNIT_OPTIONS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unitSymbol(unit)}
                  </option>
                ))}
              </select>
            </div>
            {otherError ? (
              <p id={`${otherId}-error`} className="text-xs text-red-600" role="alert">
                {otherError}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        µL = mL × {UL_PER_ML} · mL = µL ÷ {UL_PER_ML}
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
