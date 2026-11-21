'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { KGFCM2_TO_PSI, type KgCmPsiSource, type KgCmToPsiFieldErrors, type KgCmToPsiInput } from './types';
import { formatPressure } from './calculation';
import { parseOptionalNumber } from './validation';

export interface KgCmToPsiDraft {
  source: KgCmPsiSource;
  kgfCm2: string;
  psi: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: KgCmToPsiDraft): KgCmToPsiInput {
  return {
    source: draft.source,
    kgfCm2: parseOptionalNumber(draft.kgfCm2),
    psi: parseOptionalNumber(draft.psi),
  };
}

export function emptyDraft(): KgCmToPsiDraft {
  return { source: 'kgfCm2', kgfCm2: '', psi: '' };
}

interface KgCmToPsiFormProps {
  draft: KgCmToPsiDraft;
  errors: KgCmToPsiFieldErrors;
  onDraftChange: (draft: KgCmToPsiDraft) => void;
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

export function KgCmToPsiForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: KgCmToPsiFormProps) {
  const set = (patch: Partial<KgCmToPsiDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact via Pa: 1 kgf/cm² = 98,066.5 Pa; 1 psi = 6,894.757293168 Pa → factor ≈{' '}
        {formatPressure(KGFCM2_TO_PSI)}. Page title uses kg/cm² as conventional shorthand for
 kgf/cm². Converts numerical pressure values only; not absolute vs gauge basis.
      </div>

      <FieldShell
        label="Pressure in kilograms-force per square centimeter"
        htmlFor="kgcm-kgf"
        tip="Kilogram-force per square centimeter (kgf/cm²). Negative values are treated as signed numerical pressure (e.g. gauge)."
        error={errors.kgfCm2}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="kgcm-kgf"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.kgfCm2}
              placeholder="Enter pressure"
              aria-invalid={Boolean(errors.kgfCm2)}
              onChange={(event) => set({ source: 'kgfCm2', kgfCm2: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            kgf/cm²
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Pressure in pounds per square inch"
        htmlFor="kgcm-psi"
        tip="Pounds-force per square inch (psi). Negative values are treated as signed numerical pressure (e.g. gauge)."
        error={errors.psi}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="kgcm-psi"
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
        psi = kgf/cm² × {formatPressure(KGFCM2_TO_PSI)} · kgf/cm² = psi ÷{' '}
        {formatPressure(KGFCM2_TO_PSI)}
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
