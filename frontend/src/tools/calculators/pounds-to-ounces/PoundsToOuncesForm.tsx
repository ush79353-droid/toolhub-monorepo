'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  OUNCES_PER_POUND,
  type LbOzSource,
  type PoundsToOuncesFieldErrors,
  type PoundsToOuncesInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface PoundsToOuncesDraft {
  source: LbOzSource;
  pounds: string;
  ounces: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: PoundsToOuncesDraft): PoundsToOuncesInput {
  return {
    source: draft.source,
    pounds: parseOptionalNumber(draft.pounds),
    ounces: parseOptionalNumber(draft.ounces),
  };
}

export function emptyDraft(): PoundsToOuncesDraft {
  return { source: 'pounds', pounds: '', ounces: '' };
}

interface PoundsToOuncesFormProps {
  draft: PoundsToOuncesDraft;
  errors: PoundsToOuncesFieldErrors;
  onDraftChange: (draft: PoundsToOuncesDraft) => void;
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

export function PoundsToOuncesForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: PoundsToOuncesFormProps) {
  const set = (patch: Partial<PoundsToOuncesDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 avoirdupois pound = {OUNCES_PER_POUND} avoirdupois ounces. Edit either field — the
        other updates instantly. Mass only — not fluid ounces.
      </div>

      <FieldShell
        label="Weight in pounds (lb)"
        htmlFor="lb-oz-pounds"
        tip={`oz = lb × ${OUNCES_PER_POUND}.`}
        error={errors.pounds}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="lb-oz-pounds"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.pounds}
              placeholder="Enter pounds"
              aria-invalid={Boolean(errors.pounds)}
              onChange={(event) => set({ source: 'pounds', pounds: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            lb
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Weight in ounces (oz)"
        htmlFor="lb-oz-ounces"
        tip={`lb = oz ÷ ${OUNCES_PER_POUND}.`}
        error={errors.ounces}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="lb-oz-ounces"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.ounces}
              placeholder="Enter ounces"
              aria-invalid={Boolean(errors.ounces)}
              onChange={(event) => set({ source: 'ounces', ounces: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            oz
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        oz = lb × {OUNCES_PER_POUND} · lb = oz ÷ {OUNCES_PER_POUND}
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
