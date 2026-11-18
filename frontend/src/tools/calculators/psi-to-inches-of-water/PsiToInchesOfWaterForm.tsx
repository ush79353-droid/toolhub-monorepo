'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  INH2O_PER_PSI,
  PASCALS_PER_INH2O,
  PASCALS_PER_PSI,
  PSI_PER_INH2O,
  formatPressure,
} from './calculation';
import type {
  PsiInH2OSource,
  PsiToInchesOfWaterFieldErrors,
  PsiToInchesOfWaterInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface PsiToInchesOfWaterDraft {
  source: PsiInH2OSource;
  psi: string;
  inH2O: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: PsiToInchesOfWaterDraft): PsiToInchesOfWaterInput {
  return {
    source: draft.source,
    psi: parseOptionalNumber(draft.psi),
    inH2O: parseOptionalNumber(draft.inH2O),
  };
}

export function emptyDraft(): PsiToInchesOfWaterDraft {
  return { source: 'psi', psi: '', inH2O: '' };
}

interface PsiToInchesOfWaterFormProps {
  draft: PsiToInchesOfWaterDraft;
  errors: PsiToInchesOfWaterFieldErrors;
  onDraftChange: (draft: PsiToInchesOfWaterDraft) => void;
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

export function PsiToInchesOfWaterForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: PsiToInchesOfWaterFormProps) {
  const set = (patch: Partial<PsiToInchesOfWaterDraft>) =>
    onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Convention: inH₂O at 4 °C · 1 inH₂O = {formatPressure(PASCALS_PER_INH2O)} Pa · 1 psi ≈{' '}
        {formatPressure(PASCALS_PER_PSI)} Pa. Factor ≈ {formatPressure(INH2O_PER_PSI)} inH₂O per
        psi. Converts numerical units only — not gauge ↔ absolute.
      </div>

      <FieldShell
        label="Pressure in pounds per square inch"
        htmlFor="psi-to-inh2o-psi"
        tip={`inH₂O = psi × ${formatPressure(INH2O_PER_PSI)} (4 °C convention). Signed values allowed for mathematical conversion.`}
        error={errors.psi}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="psi-to-inh2o-psi"
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
        label="Pressure in inches of water"
        htmlFor="psi-to-inh2o-inh2o"
        tip={`psi = inH₂O × ${formatPressure(PSI_PER_INH2O)}. Inches of water at 4 °C (not inches of mercury).`}
        error={errors.inH2O}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="psi-to-inh2o-inh2o"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.inH2O}
              placeholder="Enter pressure"
              aria-invalid={Boolean(errors.inH2O)}
              onChange={(event) => set({ source: 'inH2O', inH2O: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            inH₂O
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        inH₂O = psi × {formatPressure(INH2O_PER_PSI)} · psi = inH₂O ×{' '}
        {formatPressure(PSI_PER_INH2O)}
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
