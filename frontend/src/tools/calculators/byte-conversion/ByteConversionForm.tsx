'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import {
  EXTRA_UNITS,
  PRIMARY_FIELDS,
  STORAGE_UNIT_BY_ID,
  type ByteConversionFieldErrors,
  type PrimaryField,
  type SourceField,
  type StorageUnit,
} from './types';

export interface ByteConversionDraft {
  texts: Record<PrimaryField, string>;
  extraText: string;
  extraUnit: StorageUnit;
  activeField: SourceField | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function defaultDraft(): ByteConversionDraft {
  return {
    texts: { B: '1000', KB: '1', MB: '0.001', GB: '0.000001' },
    extraText: '0.9765625',
    extraUnit: 'KiB',
    activeField: null,
  };
}

export function emptyDraft(extraUnit: StorageUnit = 'KiB'): ByteConversionDraft {
  return {
    texts: { B: '', KB: '', MB: '', GB: '' },
    extraText: '',
    extraUnit,
    activeField: null,
  };
}

interface ByteConversionFormProps {
  draft: ByteConversionDraft;
  errors: ByteConversionFieldErrors;
  onDraftChange: (draft: ByteConversionDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

const FIELD_LABELS: Record<PrimaryField, string> = {
  B: 'Value in bytes',
  KB: 'Value in kilobytes',
  MB: 'Value in megabytes',
  GB: 'Value in gigabytes',
};

export function ByteConversionForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: ByteConversionFormProps) {
  const setPrimary = (field: PrimaryField, text: string) => {
    onDraftChange({
      ...draft,
      texts: { ...draft.texts, [field]: text },
      activeField: field,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Decimal units (KB, MB, GB, …) use powers of <strong>1000</strong>. Binary units (KiB, MiB,
 GiB, …) use powers of <strong>1024</strong>. Edit any field: the others update from the
        same byte quantity.
      </div>

      {PRIMARY_FIELDS.map((field) => {
        const id = `byte-conv-${field}`;
        const error = errors[field];
        const def = STORAGE_UNIT_BY_ID[field];
        return (
          <div key={field} className="space-y-1.5">
            <label htmlFor={id} className={labelClass}>
              {FIELD_LABELS[field]}
            </label>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id={id}
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.texts[field]}
                  placeholder={`e.g. ${field === 'B' ? '1000' : '1'}`}
                  aria-invalid={Boolean(error)}
                  onChange={(event) => setPrimary(field, event.target.value)}
                />
              </div>
              <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm font-medium text-accent">
                {def.symbol}
              </span>
            </div>
            {error ? (
              <p className="text-xs text-red-600" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

      <div className="space-y-1.5">
        <label htmlFor="byte-conv-extra" className={labelClass}>
          Value in other multiples of the byte
        </label>
        <Select
          id="byte-conv-extra-unit"
          className="h-11"
          value={draft.extraUnit}
          aria-label="Additional storage unit"
          onChange={(event) =>
            onDraftChange({
              ...draft,
              extraUnit: event.target.value as StorageUnit,
              // Prefer refreshing from stored bytes; don't reinterpret the old extra text.
              activeField: draft.activeField === 'extra' ? null : draft.activeField,
            })
          }
        >
          <optgroup label="Bits and nibbles">
            {EXTRA_UNITS.filter((u) => STORAGE_UNIT_BY_ID[u].category === 'bit-nibble').map(
              (unit) => (
                <option key={unit} value={unit}>
                  {STORAGE_UNIT_BY_ID[unit].label} ({STORAGE_UNIT_BY_ID[unit].symbol})
                </option>
              )
            )}
          </optgroup>
          <optgroup label="Decimal units (1000-based)">
            {EXTRA_UNITS.filter((u) => STORAGE_UNIT_BY_ID[u].category === 'decimal').map(
              (unit) => (
                <option key={unit} value={unit}>
                  {STORAGE_UNIT_BY_ID[unit].label} ({STORAGE_UNIT_BY_ID[unit].symbol})
                </option>
              )
            )}
          </optgroup>
          <optgroup label="Binary units (1024-based)">
            {EXTRA_UNITS.filter((u) => STORAGE_UNIT_BY_ID[u].category === 'binary').map(
              (unit) => (
                <option key={unit} value={unit}>
                  {STORAGE_UNIT_BY_ID[unit].label} ({STORAGE_UNIT_BY_ID[unit].symbol})
                </option>
              )
            )}
          </optgroup>
        </Select>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="byte-conv-extra"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.extraText}
              placeholder="Enter value"
              aria-invalid={Boolean(errors.extra)}
              onChange={(event) =>
                onDraftChange({
                  ...draft,
                  extraText: event.target.value,
                  activeField: 'extra',
                })
              }
            />
          </div>
          <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm font-medium text-accent">
            {STORAGE_UNIT_BY_ID[draft.extraUnit].symbol}
          </span>
        </div>
        {errors.extra ? (
          <p className="text-xs text-red-600" role="alert">
            {errors.extra}
          </p>
        ) : null}
      </div>

      {children}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
