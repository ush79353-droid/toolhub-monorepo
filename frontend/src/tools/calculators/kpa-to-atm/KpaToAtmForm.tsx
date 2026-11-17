'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { KPA_PER_ATM, type KpaAtmSource, type KpaToAtmFieldErrors, type KpaToAtmInput } from './types';
import { parseOptionalNumber } from './validation';

export interface KpaToAtmDraft {
  source: KpaAtmSource;
  kPa: string;
  atm: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: KpaToAtmDraft): KpaToAtmInput {
  return {
    source: draft.source,
    kPa: parseOptionalNumber(draft.kPa),
    atm: parseOptionalNumber(draft.atm),
  };
}

export function emptyDraft(): KpaToAtmDraft {
  return { source: 'kPa', kPa: '', atm: '' };
}

interface KpaToAtmFormProps {
  draft: KpaToAtmDraft;
  errors: KpaToAtmFieldErrors;
  onDraftChange: (draft: KpaToAtmDraft) => void;
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

export function KpaToAtmForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: KpaToAtmFormProps) {
  const set = (patch: Partial<KpaToAtmDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 atm = {KPA_PER_ATM} kPa (101,325 Pa). Converts numerical pressure units only —
        does not add or subtract atmospheric pressure for gauge ↔ absolute.
      </div>

      <FieldShell
        label="Pressure in kilopascals"
        htmlFor="kpa-to-atm-kpa"
        tip="Kilopascals (kPa). Negative values are treated as signed numerical pressure (e.g. gauge)."
        error={errors.kPa}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="kpa-to-atm-kpa"
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
        label="Pressure in atmospheres"
        htmlFor="kpa-to-atm-atm"
        tip="Standard atmospheres (atm). Negative values are treated as signed numerical pressure (e.g. gauge)."
        error={errors.atm}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="kpa-to-atm-atm"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.atm}
              placeholder="Enter pressure"
              aria-invalid={Boolean(errors.atm)}
              onChange={(event) => set({ source: 'atm', atm: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            atm
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        atm = kPa ÷ {KPA_PER_ATM} · kPa = atm × {KPA_PER_ATM}
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
