'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  ATM_PER_PSI,
  formatPressure,
  PASCALS_PER_PSI,
  PSI_PER_ATM,
} from './calculation';
import type { PsiAtmSource, PsiToAtmFieldErrors, PsiToAtmInput } from './types';
import { parseOptionalNumber } from './validation';

export interface PsiToAtmDraft {
  source: PsiAtmSource;
  psi: string;
  atm: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: PsiToAtmDraft): PsiToAtmInput {
  return {
    source: draft.source,
    psi: parseOptionalNumber(draft.psi),
    atm: parseOptionalNumber(draft.atm),
  };
}

export function emptyDraft(): PsiToAtmDraft {
  return { source: 'psi', psi: '', atm: '' };
}

interface PsiToAtmFormProps {
  draft: PsiToAtmDraft;
  errors: PsiToAtmFieldErrors;
  onDraftChange: (draft: PsiToAtmDraft) => void;
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

export function PsiToAtmForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: PsiToAtmFormProps) {
  const set = (patch: Partial<PsiToAtmDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 atm = 101,325 Pa · 1 psi ≈ {formatPressure(PASCALS_PER_PSI)} Pa. Factor ≈{' '}
 {formatPressure(ATM_PER_PSI)} atm per psi. Converts numerical units only; not gauge ↔
        absolute. Use the same pressure reference on both sides.
      </div>

      <FieldShell
        label="Pressure in pounds per square inch"
        htmlFor="psi-to-atm-psi"
        tip={`atm = psi × ${formatPressure(ATM_PER_PSI)}. Signed values allowed for mathematical conversion.`}
        error={errors.psi}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="psi-to-atm-psi"
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

      <FieldShell
        label="Pressure in atmospheres"
        htmlFor="psi-to-atm-atm"
        tip={`psi = atm × ${formatPressure(PSI_PER_ATM)}. Standard atmospheres (exactly 101,325 Pa).`}
        error={errors.atm}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="psi-to-atm-atm"
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
        atm = psi × {formatPressure(ATM_PER_PSI)} · psi = atm × {formatPressure(PSI_PER_ATM)}
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
