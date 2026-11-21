'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DEFAULT_OTHER_UNIT,
  OTHER_MASS_OPTIONS,
  OTHER_UNIT_SYMBOL,
  POUNDS_PER_STONE,
  type OtherMassUnit,
  type StLbSource,
  type StoneToLbsFieldErrors,
  type StoneToLbsInput,
} from './types';
import { isOtherMassUnit, parseOptionalNumber } from './validation';

export interface StoneToLbsDraft {
  source: StLbSource;
  st: string;
  lb: string;
  other: string;
  otherUnit: OtherMassUnit;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-sky-200 bg-sky-50 px-3 text-sm font-medium text-sky-800';
const unitSelectClass =
  'h-11 min-w-[5.5rem] shrink-0 rounded-lg border border-sky-200 bg-sky-50 px-2 text-sm font-medium text-sky-800 outline-none focus:ring-2 focus:ring-ring sm:min-w-[6.5rem]';

export function emptyDraft(): StoneToLbsDraft {
  return {
    source: 'st',
    st: '',
    lb: '',
    other: '',
    otherUnit: DEFAULT_OTHER_UNIT,
  };
}

export function draftToInput(draft: StoneToLbsDraft): StoneToLbsInput {
  if (draft.source === 'st') {
    return { source: 'st', value: parseOptionalNumber(draft.st), otherUnit: draft.otherUnit };
  }
  if (draft.source === 'lb') {
    return { source: 'lb', value: parseOptionalNumber(draft.lb), otherUnit: draft.otherUnit };
  }
  return { source: 'other', value: parseOptionalNumber(draft.other), otherUnit: draft.otherUnit };
}

interface StoneToLbsFormProps {
  draft: StoneToLbsDraft;
  errors: StoneToLbsFieldErrors;
  onDraftChange: (draft: StoneToLbsDraft) => void;
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

export function StoneToLbsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: StoneToLbsFormProps) {
  const set = (patch: Partial<StoneToLbsDraft>) => onDraftChange({ ...draft, ...patch });
  const otherSymbol = OTHER_UNIT_SYMBOL[draft.otherUnit];

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Exact: 1 stone = {POUNDS_PER_STONE} pounds. Edit stones, pounds, or another unit; all fields
        stay synchronized. Mass cannot be negative.
      </div>

      <FieldShell
        label="Mass in stones"
        htmlFor="st-lb-st"
        tip={`lb = st × ${POUNDS_PER_STONE}.`}
        error={errors.st}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="st-lb-st"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.st}
              placeholder="Enter mass"
              aria-invalid={Boolean(errors.st)}
              onChange={(event) => set({ source: 'st', st: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            st
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Mass in pounds"
        htmlFor="st-lb-lb"
        tip={`st = lb ÷ ${POUNDS_PER_STONE}.`}
        error={errors.lb}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="st-lb-lb"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.lb}
              placeholder="Converted mass"
              aria-invalid={Boolean(errors.lb)}
              onChange={(event) => set({ source: 'lb', lb: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            lb
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Mass in other units"
        htmlFor="st-lb-other"
        tip={`Same mass in ${otherSymbol}. Changing the unit keeps the stones value and recalculates.`}
        error={errors.other ?? errors.otherUnit}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="st-lb-other"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.other}
              placeholder="Equivalent mass"
              aria-invalid={Boolean(errors.other)}
              onChange={(event) => set({ source: 'other', other: event.target.value })}
            />
          </div>
          <select
            aria-label="Other mass unit"
            className={unitSelectClass}
            value={draft.otherUnit}
            onChange={(event) => {
              const next = event.target.value;
              if (!isOtherMassUnit(next)) return;
              set({ otherUnit: next });
            }}
          >
            {OTHER_MASS_OPTIONS.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.symbol}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        1 st = {POUNDS_PER_STONE} lb · 1 st = 6.35029318 kg · 1 lb = 0.45359237 kg
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
