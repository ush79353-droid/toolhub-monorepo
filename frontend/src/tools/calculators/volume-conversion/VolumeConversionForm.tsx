'use client';

import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatVolume } from './calculation';
import {
  FIELD_LABELS,
  FIELD_UNIT_OPTIONS,
  VOLUME_UNIT_BY_ID,
  type OtherUnitRow,
  type VolumeFieldErrors,
  type VolumeFieldId,
  type VolumeUnitId,
} from './types';

export interface VolumeConversionDraft {
  texts: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];
  units: [
    VolumeUnitId,
    VolumeUnitId,
    VolumeUnitId,
    VolumeUnitId,
    VolumeUnitId,
    VolumeUnitId,
    VolumeUnitId,
    VolumeUnitId,
    VolumeUnitId,
  ];
  activeField: VolumeFieldId | null;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-w-[6.5rem]';

interface VolumeConversionFormProps {
  draft: VolumeConversionDraft;
  errors: VolumeFieldErrors;
  moreOptions: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: VolumeConversionDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function VolumeConversionForm({
  draft,
  errors,
  moreOptions,
  onDraftChange,
  onSubmit,
  onReset,
}: VolumeConversionFormProps) {
  const setText = (field: VolumeFieldId, text: string) => {
    const texts = [...draft.texts] as VolumeConversionDraft['texts'];
    texts[field] = text;
    onDraftChange({ ...draft, texts, activeField: field });
  };

  const setUnit = (field: VolumeFieldId, unit: VolumeUnitId) => {
    const units = [...draft.units] as VolumeConversionDraft['units'];
    units[field] = unit;
    onDraftChange({ ...draft, units, activeField: field });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <p className="text-xs text-muted-foreground">
        Enter a value in any field. All others update from the same physical volume.
        Switching a unit preserves that volume.
      </p>

      {([0, 1, 2, 3, 4, 5, 6, 7, 8] as const).map((field) => {
        const id = `vol-conv-${field}`;
        const error = errors[field];
        const options = FIELD_UNIT_OPTIONS[field]!;
        return (
          <div key={field} className="space-y-1.5">
            <label htmlFor={id} className={labelClass}>
              {FIELD_LABELS[field]}
              <InfoTooltip
                label={FIELD_LABELS[field]!}
                text="US liquid, Imperial, and US dry units differ. Cooking cups and spoons also differ by standard."
              />
            </label>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id={id}
                  inputMode="decimal"
                  className={inputClass}
                  value={draft.texts[field]}
                  placeholder="Enter volume"
                  aria-invalid={Boolean(error)}
                  onChange={(event) => setText(field, event.target.value)}
                />
              </div>
              <select
                className={selectClass}
                value={draft.units[field]}
                aria-label={`${FIELD_LABELS[field]} unit`}
                onChange={(event) =>
                  setUnit(field, event.target.value as VolumeUnitId)
                }
              >
                {options.map((unitId) => (
                  <option key={unitId} value={unitId}>
                    {VOLUME_UNIT_BY_ID[unitId].symbol}
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

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.moreOpen}
          onClick={() => onDraftChange({ ...draft, moreOpen: !draft.moreOpen })}
        >
          <span>More conversion options</span>
          {draft.moreOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {draft.moreOpen ? (
          <div className="border-t border-border px-3.5 pb-3.5 pt-2">
            {moreOptions && moreOptions.length > 0 ? (
              <ul className="divide-y divide-border">
                {moreOptions.map((row) => (
                  <li
                    key={row.unit}
                    className="flex items-center justify-between gap-3 py-2 text-sm"
                  >
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="tabular-nums font-medium text-accent">
                      {formatVolume(row.value)} {row.symbol}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-sm text-muted-foreground">
                Enter a valid volume to see additional units.
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
