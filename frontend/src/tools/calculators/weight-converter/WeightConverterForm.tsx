'use client';

import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMass } from './calculation';
import {
  FIELD_LABELS,
  MASS_UNITS,
  type MassUnitId,
  type OtherUnitRow,
  type WeightConverterFieldErrors,
  type WeightFieldId,
} from './types';

export interface WeightConverterDraft {
  texts: [string, string, string, string, string, string, string, string];
  units: [
    MassUnitId,
    MassUnitId,
    MassUnitId,
    MassUnitId,
    MassUnitId,
    MassUnitId,
    MassUnitId,
    MassUnitId,
  ];
  activeField: WeightFieldId | null;
  otherOpen: boolean;
  metricOpen: boolean;
  imperialOpen: boolean;
  otherGroupOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring sm:min-w-[5.5rem]';

interface WeightConverterFormProps {
  draft: WeightConverterDraft;
  errors: WeightConverterFieldErrors;
  otherUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: WeightConverterDraft) => void;
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

export function WeightConverterForm({
  draft,
  errors,
  otherUnits,
  onDraftChange,
  onSubmit,
  onReset,
}: WeightConverterFormProps) {
  const setText = (field: WeightFieldId, text: string) => {
    const texts = [...draft.texts] as WeightConverterDraft['texts'];
    texts[field] = text;
    onDraftChange({ ...draft, texts, activeField: field });
  };

  const setUnit = (field: WeightFieldId, unit: MassUnitId) => {
    const units = [...draft.units] as WeightConverterDraft['units'];
    units[field] = unit;
    onDraftChange({ ...draft, units, activeField: field });
  };

  const renderField = (field: WeightFieldId) => {
    const id = `weight-conv-field-${field}`;
    const error = errors[field];
    return (
      <div key={field} className="space-y-1.5">
        <label htmlFor={id} className={labelClass}>
          {FIELD_LABELS[field]}
          <InfoTooltip
            label={FIELD_LABELS[field]!}
            text="Enter a mass in this field or change its unit. Other fields update from the same physical mass in kilograms. Mass units only — not newtons or fluid ounces."
          />
        </label>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id={id}
              inputMode="decimal"
              className={inputClass}
              value={draft.texts[field]}
              placeholder="Enter mass"
              aria-invalid={Boolean(error)}
              onChange={(event) => setText(field, event.target.value)}
            />
          </div>
          <select
            className={selectClass}
            value={draft.units[field]}
            aria-label={`${FIELD_LABELS[field]} unit`}
            onChange={(event) => setUnit(field, event.target.value as MassUnitId)}
          >
            {MASS_UNITS.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.symbol}
              </option>
            ))}
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
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        This converter changes mass units (kg, g, lb, oz, and more). It does not convert force
        (newtons) or fluid volume (fl oz).
      </div>

      <div className="space-y-3">
        <SectionToggle
          label="Metric units"
          open={draft.metricOpen}
          onToggle={() => onDraftChange({ ...draft, metricOpen: !draft.metricOpen })}
        />
        {draft.metricOpen ? (
          <div className="space-y-3 pl-0 sm:pl-1">{([0, 1, 2] as const).map(renderField)}</div>
        ) : null}
      </div>

      <div className="space-y-3">
        <SectionToggle
          label="Imperial / US customary"
          open={draft.imperialOpen}
          onToggle={() => onDraftChange({ ...draft, imperialOpen: !draft.imperialOpen })}
        />
        {draft.imperialOpen ? (
          <div className="space-y-3 pl-0 sm:pl-1">{([3, 4, 5] as const).map(renderField)}</div>
        ) : null}
      </div>

      <div className="space-y-3">
        <SectionToggle
          label="Other mass units"
          open={draft.otherGroupOpen}
          onToggle={() => onDraftChange({ ...draft, otherGroupOpen: !draft.otherGroupOpen })}
        />
        {draft.otherGroupOpen ? (
          <div className="space-y-3 pl-0 sm:pl-1">{([6, 7] as const).map(renderField)}</div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.otherOpen}
          onClick={() => onDraftChange({ ...draft, otherOpen: !draft.otherOpen })}
        >
          <span>More conversion options</span>
          {draft.otherOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {draft.otherOpen ? (
          <div className="border-t border-border px-3.5 pb-3.5 pt-2">
            {otherUnits && otherUnits.length > 0 ? (
              <ul className="divide-y divide-border">
                {otherUnits.map((row) => (
                  <li
                    key={row.id}
                    className="flex items-center justify-between gap-3 py-2.5 text-sm"
                  >
                    <span className="text-muted-foreground">
                      {row.label} ({row.symbol})
                      {row.approximate ? ' ≈' : ''}
                    </span>
                    <span className="tabular-nums font-medium text-accent">
                      {formatMass(row.value)} {row.symbol}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-sm text-muted-foreground">
                Enter a valid mass to see grains, carats, tons, and scientific units.
              </p>
            )}
          </div>
        ) : null}
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
