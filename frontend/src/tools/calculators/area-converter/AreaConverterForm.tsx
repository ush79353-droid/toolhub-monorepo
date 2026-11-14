'use client';

import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  AREA_UNITS,
  FIELD_LABELS,
  type AreaConverterFieldErrors,
  type AreaFieldId,
  type AreaUnitId,
} from './types';

export interface AreaConverterDraft {
  texts: [string, string, string, string, string];
  units: [AreaUnitId, AreaUnitId, AreaUnitId, AreaUnitId, AreaUnitId];
  activeField: AreaFieldId | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring sm:min-w-[5.5rem]';

interface AreaConverterFormProps {
  draft: AreaConverterDraft;
  errors: AreaConverterFieldErrors;
  onDraftChange: (draft: AreaConverterDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function AreaConverterForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
}: AreaConverterFormProps) {
  const setText = (field: AreaFieldId, text: string) => {
    const texts = [...draft.texts] as AreaConverterDraft['texts'];
    texts[field] = text;
    onDraftChange({ ...draft, texts, activeField: field });
  };

  const setUnit = (field: AreaFieldId, unit: AreaUnitId) => {
    const units = [...draft.units] as AreaConverterDraft['units'];
    units[field] = unit;
    onDraftChange({ ...draft, units, activeField: field });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {([0, 1, 2, 3, 4] as const).map((field) => {
        const id = `area-conv-field-${field}`;
        const error = errors[field];
        return (
          <div key={field} className="space-y-1.5">
            <label htmlFor={id} className={labelClass}>
              {FIELD_LABELS[field]}
              <InfoTooltip
                label={FIELD_LABELS[field]!}
                text="Enter an area in this field or change its unit. All other fields update from the same physical area."
              />
            </label>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id={id}
                  inputMode="decimal"
                  className={inputClass}
                  value={draft.texts[field]}
                  placeholder="Enter area"
                  aria-invalid={Boolean(error)}
                  onChange={(event) => setText(field, event.target.value)}
                />
              </div>
              <select
                className={selectClass}
                value={draft.units[field]}
                aria-label={`${FIELD_LABELS[field]} unit`}
                onChange={(event) => setUnit(field, event.target.value as AreaUnitId)}
              >
                {AREA_UNITS.map((unit) => (
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
      })}

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
