'use client';

import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  ASTRO_UNIT_IDS,
  FIELD_LABELS,
  IMPERIAL_UNIT_IDS,
  LIGHT_YEAR_UNIT_BY_ID,
  METRIC_UNIT_IDS,
  type LightYearFieldErrors,
  type LightYearFieldId,
  type LightYearUnitId,
} from './types';

export interface LightYearConversionDraft {
  texts: [string, string, string, string];
  units: [LightYearUnitId, LightYearUnitId, LightYearUnitId, LightYearUnitId];
  activeField: LightYearFieldId | null;
  metricOpen: boolean;
  imperialOpen: boolean;
  astroOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring sm:min-w-[5.5rem]';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

interface LightYearConversionFormProps {
  draft: LightYearConversionDraft;
  errors: LightYearFieldErrors;
  onDraftChange: (draft: LightYearConversionDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

function SectionToggle({
  label,
  open,
  onToggle,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-left text-sm font-semibold text-accent"
      aria-expanded={open}
      onClick={onToggle}
    >
      <span>{label}</span>
      {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
    </button>
  );
}

function fieldLabel(field: LightYearFieldId, unit: LightYearUnitId): string {
  if (field === 0) return FIELD_LABELS[0];
  const def = LIGHT_YEAR_UNIT_BY_ID[unit];
  if (field === 1) return `Distance in ${def.label.toLowerCase()}`;
  if (field === 2) return `Distance in ${def.label.toLowerCase()}`;
  return `Distance in ${def.label.toLowerCase()}`;
}

export function LightYearConversionForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
}: LightYearConversionFormProps) {
  const setText = (field: LightYearFieldId, text: string) => {
    const texts = [...draft.texts] as LightYearConversionDraft['texts'];
    texts[field] = text;
    onDraftChange({ ...draft, texts, activeField: field });
  };

  const setUnit = (field: LightYearFieldId, unit: LightYearUnitId) => {
    const units = [...draft.units] as LightYearConversionDraft['units'];
    units[field] = unit;
    onDraftChange({ ...draft, units, activeField: field });
  };

  const renderEditableField = (
    field: LightYearFieldId,
    options: readonly LightYearUnitId[],
    fixedUnit?: boolean
  ) => {
    const id = `ly-conv-field-${field}`;
    const error = errors[field];
    const label = fieldLabel(field, draft.units[field]);
    return (
      <div key={field} className="space-y-1.5">
        <label htmlFor={id} className={labelClass}>
          {label}
          <InfoTooltip
            label={label}
            text="Enter a distance in this field or change its unit. Other fields update from the same physical distance in meters."
          />
        </label>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id={id}
              inputMode="decimal"
              className={inputClass}
              value={draft.texts[field]}
              placeholder="Enter distance"
              aria-invalid={Boolean(error)}
              onChange={(event) => setText(field, event.target.value)}
            />
          </div>
          {fixedUnit ? (
            <span className={unitBadgeClass} aria-hidden="true">
              ly
            </span>
          ) : (
            <select
              className={selectClass}
              value={draft.units[field]}
              aria-label={`${label} unit`}
              onChange={(event) => setUnit(field, event.target.value as LightYearUnitId)}
            >
              {options.map((unitId) => {
                const unit = LIGHT_YEAR_UNIT_BY_ID[unitId];
                return (
                  <option key={unit.id} value={unit.id}>
                    {unit.symbol}
                  </option>
                );
              })}
            </select>
          )}
        </div>
        {error ? (
          <p className="text-xs text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {renderEditableField(0, ['ly'], true)}

      <div className="space-y-3">
        <SectionToggle
          label="Metric"
          open={draft.metricOpen}
          onToggle={() =>
            onDraftChange({ ...draft, metricOpen: !draft.metricOpen, activeField: draft.activeField })
          }
        />
        {draft.metricOpen ? renderEditableField(1, METRIC_UNIT_IDS) : null}
      </div>

      <div className="space-y-3">
        <SectionToggle
          label="Imperial / US"
          open={draft.imperialOpen}
          onToggle={() =>
            onDraftChange({
              ...draft,
              imperialOpen: !draft.imperialOpen,
              activeField: draft.activeField,
            })
          }
        />
        {draft.imperialOpen ? renderEditableField(2, IMPERIAL_UNIT_IDS) : null}
      </div>

      <div className="space-y-3">
        <SectionToggle
          label="Astronomical"
          open={draft.astroOpen}
          onToggle={() =>
            onDraftChange({ ...draft, astroOpen: !draft.astroOpen, activeField: draft.activeField })
          }
        />
        {draft.astroOpen ? renderEditableField(3, ASTRO_UNIT_IDS) : null}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reset
        </Button>
      </div>
    </form>
  );
}
