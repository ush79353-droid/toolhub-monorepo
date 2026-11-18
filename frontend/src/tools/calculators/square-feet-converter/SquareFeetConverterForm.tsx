'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  AREA_UNIT_OPTIONS,
  AREA_UNIT_SYMBOL,
  DEFAULT_TARGET_UNIT,
  type AreaUnit,
  type SqFtSource,
  type SquareFeetConverterFieldErrors,
  type SquareFeetConverterInput,
} from './types';
import { isAreaUnit, parseOptionalNumber } from './validation';

export interface SquareFeetConverterDraft {
  source: SqFtSource;
  squareFeet: string;
  conversion: string;
  targetUnit: AreaUnit;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';
const unitSelectClass =
  'h-11 min-w-[5.5rem] shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring sm:min-w-[6.5rem]';

export function emptyDraft(): SquareFeetConverterDraft {
  return {
    source: 'squareFeet',
    squareFeet: '',
    conversion: '',
    targetUnit: DEFAULT_TARGET_UNIT,
  };
}

export function draftToInput(draft: SquareFeetConverterDraft): SquareFeetConverterInput {
  if (draft.source === 'squareFeet') {
    return {
      source: 'squareFeet',
      value: parseOptionalNumber(draft.squareFeet),
      targetUnit: draft.targetUnit,
    };
  }
  return {
    source: 'conversion',
    value: parseOptionalNumber(draft.conversion),
    targetUnit: draft.targetUnit,
  };
}

interface SquareFeetConverterFormProps {
  draft: SquareFeetConverterDraft;
  errors: SquareFeetConverterFieldErrors;
  onDraftChange: (draft: SquareFeetConverterDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function FieldShell({
  label,
  htmlFor,
  tip,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  tip?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
        {tip ? (
          <>
            {' '}
            <InfoTooltip label={label} text={tip} />
          </>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SquareFeetConverterForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: SquareFeetConverterFormProps) {
  const set = (patch: Partial<SquareFeetConverterDraft>) => onDraftChange({ ...draft, ...patch });
  const targetSymbol = AREA_UNIT_SYMBOL[draft.targetUnit];

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Convert square feet (ft²) to square meters, inches, yards, acres, and other area units — or
        reverse the conversion. Exact international foot: 1 ft² = 0.09290304 m². Area cannot be
        negative.
      </div>

      <FieldShell
        label="Square feet"
        htmlFor="sqft-conv-ft2"
        tip="Primary area in square feet. Editing this updates the conversion field."
        error={errors.squareFeet}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="sqft-conv-ft2"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.squareFeet}
              placeholder="Enter area"
              aria-invalid={Boolean(errors.squareFeet)}
              onChange={(event) =>
                set({ source: 'squareFeet', squareFeet: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            ft²
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Conversion"
        htmlFor="sqft-conv-target"
        tip={`Converted area in the selected unit (${targetSymbol}). Changing the unit keeps the square-feet value and recalculates.`}
        error={errors.conversion ?? errors.targetUnit}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="sqft-conv-target"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.conversion}
              placeholder="Converted area"
              aria-invalid={Boolean(errors.conversion)}
              onChange={(event) =>
                set({ source: 'conversion', conversion: event.target.value })
              }
            />
          </div>
          <select
            aria-label="Destination area unit"
            className={unitSelectClass}
            value={draft.targetUnit}
            onChange={(event) => {
              const next = event.target.value;
              if (!isAreaUnit(next)) return;
              set({ targetUnit: next });
            }}
          >
            {AREA_UNIT_OPTIONS.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.symbol}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

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
