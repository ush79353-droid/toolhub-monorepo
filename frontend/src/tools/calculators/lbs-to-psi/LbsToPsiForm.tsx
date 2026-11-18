'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { LbsPsiSource, LbsToPsiFieldErrors, LbsToPsiInput } from './types';
import { parseOptionalNumber } from './validation';

export interface LbsToPsiDraft {
  source: LbsPsiSource;
  psf: string;
  psi: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: LbsToPsiDraft): LbsToPsiInput {
  return {
    source: draft.source,
    psf: parseOptionalNumber(draft.psf),
    psi: parseOptionalNumber(draft.psi),
  };
}

export function emptyDraft(): LbsToPsiDraft {
  return { source: 'psf', psf: '', psi: '' };
}

interface LbsToPsiFormProps {
  draft: LbsToPsiDraft;
  errors: LbsToPsiFieldErrors;
  onDraftChange: (draft: LbsToPsiDraft) => void;
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

export function LbsToPsiForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: LbsToPsiFormProps) {
  const set = (patch: Partial<LbsToPsiDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Converts pressure in pounds-force per square foot (psf / lbf/ft²) to pounds-force per square
        inch (psi / lbf/in²). Exact factor: 1 psi = 144 psf. Signed values are allowed for gauge or
        differential pressure. Pounds-force alone is not pressure without an area.
      </div>

      <FieldShell
        label="Pressure in pounds-force per square foot"
        htmlFor="lbs-psi-psf"
        tip="Enter pressure in lbf/ft² (psf). PSI updates as psf ÷ 144."
        error={errors.psf}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="lbs-psi-psf"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.psf}
              placeholder="Enter psf"
              aria-invalid={Boolean(errors.psf)}
              onChange={(event) => set({ source: 'psf', psf: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            lbf/ft²
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Pressure in pounds-force per square inch"
        htmlFor="lbs-psi-psi"
        tip="Enter pressure in psi (lbf/in²). PSF updates as psi × 144."
        error={errors.psi}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="lbs-psi-psi"
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

      <p className="text-xs text-muted-foreground">1 psi = 144 psf</p>

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
