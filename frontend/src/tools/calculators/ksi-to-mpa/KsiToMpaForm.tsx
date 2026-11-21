'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { type KsiMpaSource, type KsiToMpaFieldErrors, type KsiToMpaInput } from './types';
import { formatPressure, MPA_PER_KSI } from './calculation';
import { parseOptionalNumber } from './validation';

export interface KsiToMpaDraft {
  source: KsiMpaSource;
  ksi: string;
  mpa: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: KsiToMpaDraft): KsiToMpaInput {
  return {
    source: draft.source,
    ksi: parseOptionalNumber(draft.ksi),
    mpa: parseOptionalNumber(draft.mpa),
  };
}

export function emptyDraft(): KsiToMpaDraft {
  return { source: 'ksi', ksi: '', mpa: '' };
}

interface KsiToMpaFormProps {
  draft: KsiToMpaDraft;
  errors: KsiToMpaFieldErrors;
  onDraftChange: (draft: KsiToMpaDraft) => void;
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

export function KsiToMpaForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: KsiToMpaFormProps) {
  const set = (patch: Partial<KsiToMpaDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 ksi = 1,000 psi; 1 MPa = 10⁶ Pa → factor ≈ {formatPressure(MPA_PER_KSI)} MPa per
 ksi. Converts numerical units only; not gauge ↔ absolute.
      </div>

      <FieldShell
        label="Pressure in ksi"
        htmlFor="ksi-to-mpa-ksi"
        tip="Kilopounds-force per square inch (ksi = 1,000 psi). Negative values are treated as signed numerical pressure (e.g. gauge)."
        error={errors.ksi}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ksi-to-mpa-ksi"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.ksi}
              placeholder="Enter pressure"
              aria-invalid={Boolean(errors.ksi)}
              onChange={(event) => set({ source: 'ksi', ksi: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            ksi
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Pressure in MPa"
        htmlFor="ksi-to-mpa-mpa"
        tip="Megapascals (MPa). Negative values are treated as signed numerical pressure (e.g. gauge)."
        error={errors.mpa}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ksi-to-mpa-mpa"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.mpa}
              placeholder="Enter pressure"
              aria-invalid={Boolean(errors.mpa)}
              onChange={(event) => set({ source: 'MPa', mpa: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            MPa
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        MPa = ksi × {formatPressure(MPA_PER_KSI)} · ksi = MPa ÷ {formatPressure(MPA_PER_KSI)}
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
