'use client';

import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  ASTRO_UNIT_IDS,
  AU_UNIT_BY_ID,
  FIELD_LABELS,
  IMPERIAL_UNIT_IDS,
  METRIC_UNIT_IDS,
  type AstronomicalUnitFieldErrors,
  type AuFieldId,
  type AuUnitId,
} from './types';

export interface AstronomicalUnitDraft {
  texts: [string, string, string, string, string, string];
  units: [AuUnitId, AuUnitId, AuUnitId, AuUnitId, AuUnitId, AuUnitId];
  activeField: AuFieldId | null;
  metricOpen: boolean;
  astroOpen: boolean;
  imperialOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring sm:min-w-[5.5rem]';

interface AstronomicalUnitFormProps {
  draft: AstronomicalUnitDraft;
  errors: AstronomicalUnitFieldErrors;
  onDraftChange: (draft: AstronomicalUnitDraft) => void;
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

function fieldLabel(field: AuFieldId, unit: AuUnitId): string {
  if (field === 0) return FIELD_LABELS[0];
  const def = AU_UNIT_BY_ID[unit];
  return `Distance in ${def.label.toLowerCase()}`;
}

export function AstronomicalUnitForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
}: AstronomicalUnitFormProps) {
  const setText = (field: AuFieldId, text: string) => {
    const texts = [...draft.texts] as AstronomicalUnitDraft['texts'];
    texts[field] = text;
    onDraftChange({ ...draft, texts, activeField: field });
  };

  const setUnit = (field: AuFieldId, unit: AuUnitId) => {
    const units = [...draft.units] as AstronomicalUnitDraft['units'];
    units[field] = unit;
    onDraftChange({ ...draft, units, activeField: field });
  };

  const renderField = (field: AuFieldId, options: readonly AuUnitId[]) => {
    const id = `au-calc-field-${field}`;
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
          <select
            className={selectClass}
            value={draft.units[field]}
            aria-label={`${label} unit`}
            onChange={(event) => setUnit(field, event.target.value as AuUnitId)}
          >
            {options.map((unitId) => {
              const unit = AU_UNIT_BY_ID[unitId];
              return (
                <option key={unit.id} value={unit.id}>
                  {unit.symbol}
                </option>
              );
            })}
          </select>
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
      {renderField(0, ASTRO_UNIT_IDS)}

      <div className="space-y-3">
        <SectionToggle
          label="Metric units"
          open={draft.metricOpen}
          onToggle={() =>
            onDraftChange({ ...draft, metricOpen: !draft.metricOpen, activeField: draft.activeField })
          }
        />
        {draft.metricOpen ? (
          <>
            {renderField(1, METRIC_UNIT_IDS)}
            {renderField(2, METRIC_UNIT_IDS)}
          </>
        ) : null}
      </div>

      <div className="space-y-3">
        <SectionToggle
          label="Astronomical units"
          open={draft.astroOpen}
          onToggle={() =>
            onDraftChange({ ...draft, astroOpen: !draft.astroOpen, activeField: draft.activeField })
          }
        />
        {draft.astroOpen ? (
          <>
            {renderField(3, ASTRO_UNIT_IDS)}
            {renderField(4, ASTRO_UNIT_IDS)}
          </>
        ) : null}
      </div>

      <div className="space-y-3">
        <SectionToggle
          label="Imperial / US units"
          open={draft.imperialOpen}
          onToggle={() =>
            onDraftChange({
              ...draft,
              imperialOpen: !draft.imperialOpen,
              activeField: draft.activeField,
            })
          }
        />
        {draft.imperialOpen ? renderField(5, IMPERIAL_UNIT_IDS) : null}
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
