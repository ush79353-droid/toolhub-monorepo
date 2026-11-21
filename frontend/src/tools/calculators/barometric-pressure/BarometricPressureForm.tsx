'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatPressure } from './calculation';
import {
  FIELD_LABELS,
  PRESSURE_UNITS,
  type BarometricFieldErrors,
  type OtherUnitRow,
  type PressureFieldId,
  type PressureUnitId,
} from './types';

export interface BarometricPressureDraft {
  texts: [string, string, string, string];
  units: [PressureUnitId, PressureUnitId, PressureUnitId, PressureUnitId];
  activeField: PressureFieldId | null;
  otherOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring sm:min-w-[5.5rem]';

interface BarometricPressureFormProps {
  draft: BarometricPressureDraft;
  errors: BarometricFieldErrors;
  otherUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: BarometricPressureDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function BarometricPressureForm({
  draft,
  errors,
  otherUnits,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: BarometricPressureFormProps) {
  const setText = (field: PressureFieldId, text: string) => {
    const texts = [...draft.texts] as BarometricPressureDraft['texts'];
    texts[field] = text;
    onDraftChange({ ...draft, texts, activeField: field });
  };

  const setUnit = (field: PressureFieldId, unit: PressureUnitId) => {
    const units = [...draft.units] as BarometricPressureDraft['units'];
    units[field] = unit;
    onDraftChange({ ...draft, units, activeField: field });
  };

  const renderField = (field: PressureFieldId) => {
    const id = `baro-pressure-field-${field}`;
    const error = errors[field];
    return (
      <div key={field} className="space-y-1.5">
        <label htmlFor={id} className={labelClass}>
          {FIELD_LABELS[field]}
          <InfoTooltip
            label={FIELD_LABELS[field]!}
            text="Enter a pressure or change its unit. Other fields update from the same physical pressure in pascals. Signed values may represent gauge or differential pressure; absolute atmospheric pressure cannot be negative."
          />
        </label>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id={id}
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.texts[field]}
              placeholder="Enter pressure"
              aria-invalid={Boolean(error)}
              onChange={(event) => setText(field, event.target.value)}
            />
          </div>
          <select
            className={selectClass}
            value={draft.units[field]}
            aria-label={`${FIELD_LABELS[field]} unit`}
            onChange={(event) => setUnit(field, event.target.value as PressureUnitId)}
          >
            {PRESSURE_UNITS.map((unit) => (
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
        Convert barometric (atmospheric) pressure between atm, bar, Pa, psi, hPa, mbar, and more.
 Unit conversion only; not gauge↔absolute. Absolute atmospheric pressure cannot be
        negative.
      </div>

      <div className="space-y-3">{([0, 1, 2, 3] as const).map(renderField)}</div>

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
                    </span>
                    <span className="tabular-nums font-medium text-accent">
                      {formatPressure(row.value)} {row.symbol}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-sm text-muted-foreground">
                Enter a valid pressure to see hPa, mbar, Torr, mmHg, inHg, and related units.
              </p>
            )}
          </div>
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
