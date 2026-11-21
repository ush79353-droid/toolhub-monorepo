'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  PSI_PER_BAR,
  STANDARD_ATMOSPHERIC_BAR,
  type BarPsigSource,
  type BarToPsigFieldErrors,
  type BarToPsigInput,
  type PressureReference,
} from './types';
import { parseOptionalNumber } from './validation';

export interface BarToPsigDraft {
  source: BarPsigSource;
  bar: string;
  psig: string;
  reference: PressureReference;
  atmosphericBar: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-muted/50 px-2.5 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: BarToPsigDraft): BarToPsigInput {
  return {
    source: draft.source,
    bar: parseOptionalNumber(draft.bar),
    psig: parseOptionalNumber(draft.psig),
    reference: draft.reference,
    atmosphericBar: parseOptionalNumber(draft.atmosphericBar),
  };
}

export function emptyDraft(): BarToPsigDraft {
  return {
    source: 'bar',
    bar: '',
    psig: '',
    reference: 'absolute',
    atmosphericBar: String(STANDARD_ATMOSPHERIC_BAR),
  };
}

interface BarToPsigFormProps {
  draft: BarToPsigDraft;
  errors: BarToPsigFieldErrors;
  onDraftChange: (draft: BarToPsigDraft) => void;
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

export function BarToPsigForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: BarToPsigFormProps) {
  const set = (patch: Partial<BarToPsigDraft>) => onDraftChange({ ...draft, ...patch });
  const barLabel = draft.reference === 'absolute' ? 'bar(a)' : 'bar(g)';

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Absolute bar(a) uses atmospheric pressure before converting to PSIG. Gauge bar(g) converts
        directly: PSIG = bar(g) × {PSI_PER_BAR}. Negative PSIG means below atmosphere (vacuum).
      </div>

      <FieldShell
        label="Pressure in bar"
        htmlFor="bar-psig-bar"
        tip={`Enter ${barLabel}. Absolute values cannot be negative; gauge may be negative for vacuum.`}
        error={errors.bar}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="bar-psig-bar"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.bar}
              placeholder="Enter bar"
              aria-invalid={Boolean(errors.bar)}
              onChange={(event) => set({ source: 'bar', bar: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            {barLabel}
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Pressure in pounds per square inch gauge"
        htmlFor="bar-psig-psig"
        tip="PSIG is relative to the surrounding atmosphere. Negative values indicate vacuum."
        error={errors.psig}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="bar-psig-psig"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.psig}
              placeholder="Enter PSIG"
              aria-invalid={Boolean(errors.psig)}
              onChange={(event) => set({ source: 'psig', psig: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            psig
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Pressure reference"
        htmlFor="bar-psig-ref"
        tip="Choose whether the bar value is absolute (vacuum reference) or gauge (atmosphere reference)."
      >
        <select
          id="bar-psig-ref"
          className={selectClass}
          value={draft.reference}
          onChange={(event) =>
            set({ reference: event.target.value as PressureReference, source: draft.source })
          }
        >
          <option value="absolute">Absolute bar (bar(a))</option>
          <option value="gauge">Gauge bar (bar(g))</option>
        </select>
      </FieldShell>

      {draft.reference === 'absolute' ? (
        <FieldShell
          label="Atmospheric pressure"
          htmlFor="bar-psig-atm"
          tip="Default 1.01325 bar is standard atmosphere; not a local weather reading."
          error={errors.atmosphericBar}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="bar-psig-atm"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.atmosphericBar}
                placeholder="1.01325"
                aria-invalid={Boolean(errors.atmosphericBar)}
                onChange={(event) =>
                  set({ atmosphericBar: event.target.value, source: draft.source })
                }
              />
            </div>
            <span className={unitBadgeClass} aria-hidden="true">
              bar
            </span>
          </div>
        </FieldShell>
      ) : null}

      <p className="text-xs text-muted-foreground">
        1 bar ≈ {PSI_PER_BAR} psi · Standard atmosphere = {STANDARD_ATMOSPHERIC_BAR} bar
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
