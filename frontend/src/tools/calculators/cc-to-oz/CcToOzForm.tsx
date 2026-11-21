'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  FLUID_OZ_OPTIONS,
  type CcOzSource,
  type CcToOzFieldErrors,
  type CcToOzInput,
  type FluidOunceSystem,
} from './types';
import { parseOptionalNumber } from './validation';

export interface CcToOzDraft {
  source: CcOzSource;
  system: FluidOunceSystem;
  cc: string;
  oz: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring sm:min-w-[6.5rem]';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: CcToOzDraft): CcToOzInput {
  return {
    source: draft.source,
    system: draft.system,
    cc: parseOptionalNumber(draft.cc),
    oz: parseOptionalNumber(draft.oz),
  };
}

export function emptyDraft(): CcToOzDraft {
  return { source: 'cc', system: 'us', cc: '', oz: '' };
}

interface CcToOzFormProps {
  draft: CcToOzDraft;
  errors: CcToOzFieldErrors;
  onDraftChange: (draft: CcToOzDraft) => void;
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

export function CcToOzForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CcToOzFormProps) {
  const set = (patch: Partial<CcToOzDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Volume only: fluid ounces are not weight ounces. Exact US fl oz = 29.5735295625 cc; UK fl oz =
 28.4130625 cc. Edit either field: the other updates instantly.
      </div>

      <FieldShell
        label="Measurement in cubic centimeters"
        htmlFor="cc-oz-cc"
        tip="Enter cubic centimeters (cc = cm³ = mL). Volume cannot be negative."
        error={errors.cc}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cc-oz-cc"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.cc}
              placeholder="Enter cubic centimeters"
              aria-invalid={Boolean(errors.cc)}
              onChange={(event) => set({ source: 'cc', cc: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            cm³ (cc)
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Measurement in ounces"
        htmlFor="cc-oz-oz"
        tip="Fluid ounces of volume (US or UK). Not avoirdupois ounces used for weight."
        error={errors.oz}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cc-oz-oz"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.oz}
              placeholder="Enter fluid ounces"
              aria-invalid={Boolean(errors.oz)}
              onChange={(event) => set({ source: 'oz', oz: event.target.value })}
            />
          </div>
          <select
            aria-label="Fluid ounce system"
            className={selectClass}
            value={draft.system}
            onChange={(event) =>
              set({ system: event.target.value as FluidOunceSystem })
            }
          >
            {FLUID_OZ_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        Default is US fl oz. Switch to UK fl oz for imperial fluid ounces. This converter does not
        use weight ounces.
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
