'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  PRESSURE_UNIT_OPTIONS,
  PSI_PER_BAR,
  type BarPsiSource,
  type BarToPsiFieldErrors,
  type BarToPsiInput,
  type PressureUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface BarToPsiDraft {
  source: BarPsiSource;
  primary: string;
  secondary: string;
  primaryUnit: PressureUnit;
  secondaryUnit: PressureUnit;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring sm:min-w-[4.5rem]';

export function draftToInput(draft: BarToPsiDraft): BarToPsiInput {
  return {
    source: draft.source,
    primary: parseOptionalNumber(draft.primary),
    secondary: parseOptionalNumber(draft.secondary),
    primaryUnit: draft.primaryUnit,
    secondaryUnit: draft.secondaryUnit,
  };
}

export function emptyDraft(): BarToPsiDraft {
  return {
    source: 'primary',
    primary: '',
    secondary: '',
    primaryUnit: 'bar',
    secondaryUnit: 'psi',
  };
}

interface BarToPsiFormProps {
  draft: BarToPsiDraft;
  errors: BarToPsiFieldErrors;
  onDraftChange: (draft: BarToPsiDraft) => void;
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

export function BarToPsiForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: BarToPsiFormProps) {
  const set = (patch: Partial<BarToPsiDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact via pascals: 1 bar = 100,000 Pa and 1 psi ≈ 6,894.757293 Pa. Edit either field — the
        other updates instantly. Absolute pressure cannot be negative.
      </div>

      <FieldShell
        label="Pressure in bar"
        htmlFor="bar-psi-primary"
        tip={`Default unit is bar. 1 bar ≈ ${PSI_PER_BAR} psi. Changing the unit keeps the same physical pressure.`}
        error={errors.primary}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="bar-psi-primary"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.primary}
              placeholder="Enter pressure"
              aria-invalid={Boolean(errors.primary)}
              onChange={(event) => set({ source: 'primary', primary: event.target.value })}
            />
          </div>
          <select
            aria-label="Primary pressure unit"
            className={selectClass}
            value={draft.primaryUnit}
            onChange={(event) =>
              set({ primaryUnit: event.target.value as PressureUnit, source: draft.source })
            }
          >
            {PRESSURE_UNIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <FieldShell
        label="Pressure in pounds per square inch"
        htmlFor="bar-psi-secondary"
        tip="Default unit is psi (lbf/in²). Switching units preserves the physical pressure."
        error={errors.secondary}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="bar-psi-secondary"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.secondary}
              placeholder="Enter pressure"
              aria-invalid={Boolean(errors.secondary)}
              onChange={(event) => set({ source: 'secondary', secondary: event.target.value })}
            />
          </div>
          <select
            aria-label="Secondary pressure unit"
            className={selectClass}
            value={draft.secondaryUnit}
            onChange={(event) =>
              set({ secondaryUnit: event.target.value as PressureUnit, source: draft.source })
            }
          >
            {PRESSURE_UNIT_OPTIONS.map((option) => (
              <option key={`s-${option.value}`} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        1 bar ≈ {PSI_PER_BAR.toFixed(9)} psi · Torr ≠ conventional mmHg
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
