'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  CUP_UNIT_OPTIONS,
  DEFAULT_CUP_UNIT,
  DEFAULT_PINT_UNIT,
  PINT_UNIT_OPTIONS,
  type CupUnit,
  type CupsToPintsFieldErrors,
  type CupsToPintsInput,
  type CupsToPintsSource,
  type PintUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface CupsToPintsDraft {
  source: CupsToPintsSource;
  cups: string;
  pints: string;
  cupUnit: CupUnit;
  pintUnit: PintUnit;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring sm:min-w-[7rem]';

export function emptyDraft(): CupsToPintsDraft {
  return {
    source: 'cups',
    cups: '',
    pints: '',
    cupUnit: DEFAULT_CUP_UNIT,
    pintUnit: DEFAULT_PINT_UNIT,
  };
}

export function draftToInput(draft: CupsToPintsDraft): CupsToPintsInput {
  if (draft.source === 'cups') {
    return {
      source: 'cups',
      value: parseOptionalNumber(draft.cups),
      cupUnit: draft.cupUnit,
      pintUnit: draft.pintUnit,
    };
  }
  return {
    source: 'pints',
    value: parseOptionalNumber(draft.pints),
    cupUnit: draft.cupUnit,
    pintUnit: draft.pintUnit,
  };
}

interface CupsToPintsFormProps {
  draft: CupsToPintsDraft;
  errors: CupsToPintsFieldErrors;
  onDraftChange: (draft: CupsToPintsDraft) => void;
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

export function CupsToPintsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CupsToPintsFormProps) {
  const set = (patch: Partial<CupsToPintsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Cups and pints measure volume. US liquid, US dry, and UK imperial pints differ. Matching US
        customary cups with US liquid pints gives 2 cups = 1 pint. Matching UK cups with imperial
        pints also gives 2 cups = 1 pint.
      </div>

      <FieldShell
        label="Volume in cups"
        htmlFor="cups-pt-cups"
        tip="Choose US customary, US legal, metric, or UK imperial cup."
        error={errors.cups}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cups-pt-cups"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.cups}
              placeholder="Enter cups"
              aria-invalid={Boolean(errors.cups)}
              onChange={(event) => set({ source: 'cups', cups: event.target.value })}
            />
          </div>
          <select
            aria-label="Cup unit"
            className={selectClass}
            value={draft.cupUnit}
            onChange={(event) =>
              set({ cupUnit: event.target.value as CupUnit, source: draft.source })
            }
          >
            {CUP_UNIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <FieldShell
        label="Volume in pints"
        htmlFor="cups-pt-pints"
        tip="US liquid, UK imperial, and US dry pints are different volumes."
        error={errors.pints}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cups-pt-pints"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.pints}
              placeholder="Enter pints"
              aria-invalid={Boolean(errors.pints)}
              onChange={(event) => set({ source: 'pints', pints: event.target.value })}
            />
          </div>
          <select
            aria-label="Pint unit"
            className={selectClass}
            value={draft.pintUnit}
            onChange={(event) =>
              set({
                pintUnit: event.target.value as PintUnit,
                source: draft.source,
              })
            }
          >
            {PINT_UNIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        1 US liquid pt = 2 US cups · 1 imp pt = 2 UK cups · US dry pt differs from liquid pt
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
