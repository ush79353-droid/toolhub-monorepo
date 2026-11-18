'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  CUP_UNIT_OPTIONS,
  DEFAULT_CUP_UNIT,
  DEFAULT_OUNCE_UNIT,
  OUNCE_UNIT_OPTIONS,
  type CupUnit,
  type CupsToOzFieldErrors,
  type CupsToOzInput,
  type CupsToOzSource,
  type FluidOunceUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface CupsToOzDraft {
  source: CupsToOzSource;
  cups: string;
  ounces: string;
  cupUnit: CupUnit;
  ounceUnit: FluidOunceUnit;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring sm:min-w-[7rem]';

export function emptyDraft(): CupsToOzDraft {
  return {
    source: 'cups',
    cups: '',
    ounces: '',
    cupUnit: DEFAULT_CUP_UNIT,
    ounceUnit: DEFAULT_OUNCE_UNIT,
  };
}

export function draftToInput(draft: CupsToOzDraft): CupsToOzInput {
  if (draft.source === 'cups') {
    return {
      source: 'cups',
      value: parseOptionalNumber(draft.cups),
      cupUnit: draft.cupUnit,
      ounceUnit: draft.ounceUnit,
    };
  }
  return {
    source: 'ounces',
    value: parseOptionalNumber(draft.ounces),
    cupUnit: draft.cupUnit,
    ounceUnit: draft.ounceUnit,
  };
}

interface CupsToOzFormProps {
  draft: CupsToOzDraft;
  errors: CupsToOzFieldErrors;
  onDraftChange: (draft: CupsToOzDraft) => void;
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

export function CupsToOzForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CupsToOzFormProps) {
  const set = (patch: Partial<CupsToOzDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Cups and fluid ounces measure volume. US fluid ounces are not the same as UK imperial fluid
        ounces, and neither is a weight ounce. 1 US customary cup = 8 US fl oz. Density is required
        to convert volume to mass ounces.
      </div>

      <FieldShell
        label="Volume in cups"
        htmlFor="cups-oz-cups"
        tip="Choose US customary, US legal, metric, or UK imperial cup."
        error={errors.cups}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cups-oz-cups"
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
        label="Volume in ounces"
        htmlFor="cups-oz-ounces"
        tip="Results are fluid ounces (volume), not avoirdupois weight ounces."
        error={errors.ounces}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cups-oz-ounces"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.ounces}
              placeholder="Enter fluid ounces"
              aria-invalid={Boolean(errors.ounces)}
              onChange={(event) => set({ source: 'ounces', ounces: event.target.value })}
            />
          </div>
          <select
            aria-label="Fluid ounce unit"
            className={selectClass}
            value={draft.ounceUnit}
            onChange={(event) =>
              set({
                ounceUnit: event.target.value as FluidOunceUnit,
                source: draft.source,
              })
            }
          >
            {OUNCE_UNIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        1 US cup = 8 US fl oz · 1 UK cup = 10 imp fl oz · 1 metric cup ≈ 8.45 US fl oz
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
