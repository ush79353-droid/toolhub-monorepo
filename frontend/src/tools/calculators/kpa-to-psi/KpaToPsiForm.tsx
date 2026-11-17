'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { type KpaPsiSource, type KpaToPsiFieldErrors, type KpaToPsiInput } from './types';
import { formatPressure, KPA_PER_PSI, PSI_PER_KPA } from './calculation';
import { parseOptionalNumber } from './validation';

export interface KpaToPsiDraft {
  source: KpaPsiSource;
  kPa: string;
  psi: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: KpaToPsiDraft): KpaToPsiInput {
  return {
    source: draft.source,
    kPa: parseOptionalNumber(draft.kPa),
    psi: parseOptionalNumber(draft.psi),
  };
}

export function emptyDraft(): KpaToPsiDraft {
  return { source: 'kPa', kPa: '', psi: '' };
}

interface KpaToPsiFormProps {
  draft: KpaToPsiDraft;
  errors: KpaToPsiFieldErrors;
  onDraftChange: (draft: KpaToPsiDraft) => void;
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

export function KpaToPsiForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: KpaToPsiFormProps) {
  const set = (patch: Partial<KpaToPsiDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact via Pa: 1 kPa = 1,000 Pa; 1 psi from international pound-force and inch. Factor ≈{' '}
        {formatPressure(PSI_PER_KPA)} psi per kPa. Converts numerical units only — not gauge ↔
        absolute.
      </div>

      <FieldShell
        label="Pressure in kilopascals"
        htmlFor="kpa-to-psi-kpa"
        tip="Kilopascals (kPa). Negative values are treated as signed numerical pressure (e.g. gauge)."
        error={errors.kPa}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="kpa-to-psi-kpa"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.kPa}
              placeholder="Enter pressure"
              aria-invalid={Boolean(errors.kPa)}
              onChange={(event) => set({ source: 'kPa', kPa: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            kPa
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Pressure in pounds per square inch"
        htmlFor="kpa-to-psi-psi"
        tip="Pounds-force per square inch (psi). Negative values are treated as signed numerical pressure (e.g. gauge)."
        error={errors.psi}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="kpa-to-psi-psi"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.psi}
              placeholder="Enter pressure"
              aria-invalid={Boolean(errors.psi)}
              onChange={(event) => set({ source: 'psi', psi: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            psi
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        psi = kPa × {formatPressure(PSI_PER_KPA)} · kPa = psi × {formatPressure(KPA_PER_PSI)}
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
