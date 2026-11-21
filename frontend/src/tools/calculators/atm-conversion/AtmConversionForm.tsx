'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  type AtmConversionFieldErrors,
  type AtmConversionInput,
  type AtmPressureUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface AtmConversionDraft {
  source: AtmPressureUnit;
  atm: string;
  bar: string;
  psi: string;
  Pa: string;
  otherOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';
const sectionClass = 'space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

export function draftToInput(draft: AtmConversionDraft): AtmConversionInput {
  return {
    source: draft.source,
    atm: parseOptionalNumber(draft.atm),
    bar: parseOptionalNumber(draft.bar),
    psi: parseOptionalNumber(draft.psi),
    Pa: parseOptionalNumber(draft.Pa),
  };
}

export function emptyDraft(): AtmConversionDraft {
  return { source: 'atm', atm: '', bar: '', psi: '', Pa: '', otherOpen: true };
}

interface AtmConversionFormProps {
  draft: AtmConversionDraft;
  errors: AtmConversionFieldErrors;
  onDraftChange: (draft: AtmConversionDraft) => void;
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

export function AtmConversionForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: AtmConversionFormProps) {
  const set = (patch: Partial<AtmConversionDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 atm = 101,325 Pa = 1.01325 bar. PSI uses the international pound-force definition.
 Edit any field: the others update from pascals. Negative values are treated as
        gauge-relative, not absolute pressure.
      </div>

      <FieldShell
        label="Pressure in atmospheres"
        htmlFor="atm-conv-atm"
        tip="Standard atmosphere (atm). 1 atm = 101,325 Pa by definition."
        error={errors.atm}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="atm-conv-atm"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.atm}
              placeholder="Enter atmospheres"
              aria-invalid={Boolean(errors.atm)}
              onChange={(event) => set({ source: 'atm', atm: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            atm
          </span>
        </div>
      </FieldShell>

      <div className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-sm font-semibold text-accent"
          onClick={() => set({ otherOpen: !draft.otherOpen })}
          aria-expanded={draft.otherOpen}
        >
          Pressure in other units
          {draft.otherOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {draft.otherOpen ? (
          <div className="space-y-3 pt-1">
            <FieldShell
              label="Pressure in bar"
              htmlFor="atm-conv-bar"
              tip="1 bar = 100,000 Pa exactly. 1 atm = 1.01325 bar."
              error={errors.bar}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="atm-conv-bar"
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
                  bar
                </span>
              </div>
            </FieldShell>

            <FieldShell
              label="Pressure in pounds per square inch"
              htmlFor="atm-conv-psi"
              tip="Pound-force per square inch (psi). 1 atm ≈ 14.69595 psi."
              error={errors.psi}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="atm-conv-psi"
                    inputMode="decimal"
                    autoComplete="off"
                    className={inputClass}
                    value={draft.psi}
                    placeholder="Enter psi"
                    aria-invalid={Boolean(errors.psi)}
                    onChange={(event) => set({ source: 'psi', psi: event.target.value })}
                  />
                </div>
                <span className={unitBadgeClass} aria-hidden="true">
                  psi
                </span>
              </div>
            </FieldShell>

            <FieldShell
              label="Pressure in pascals"
              htmlFor="atm-conv-pa"
              tip="SI unit of pressure. 1 atm = 101,325 Pa exactly."
              error={errors.Pa}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="atm-conv-pa"
                    inputMode="decimal"
                    autoComplete="off"
                    className={inputClass}
                    value={draft.Pa}
                    placeholder="Enter pascals"
                    aria-invalid={Boolean(errors.Pa)}
                    onChange={(event) => set({ source: 'Pa', Pa: event.target.value })}
                  />
                </div>
                <span className={unitBadgeClass} aria-hidden="true">
                  Pa
                </span>
              </div>
            </FieldShell>
          </div>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">1 atm = 101,325 Pa = 1.01325 bar ≈ 14.69595 psi</p>

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
