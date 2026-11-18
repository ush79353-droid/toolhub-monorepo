'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { GRAMS_PER_POUND, type LbsGSource, type LbsToGFieldErrors, type LbsToGInput } from './types';
import { parseOptionalNumber } from './validation';

export interface LbsToGDraft {
  source: LbsGSource;
  pounds: string;
  grams: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: LbsToGDraft): LbsToGInput {
  return {
    source: draft.source,
    pounds: parseOptionalNumber(draft.pounds),
    grams: parseOptionalNumber(draft.grams),
  };
}

export function emptyDraft(): LbsToGDraft {
  return { source: 'pounds', pounds: '', grams: '' };
}

interface LbsToGFormProps {
  draft: LbsToGDraft;
  errors: LbsToGFieldErrors;
  onDraftChange: (draft: LbsToGDraft) => void;
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

export function LbsToGForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: LbsToGFormProps) {
  const set = (patch: Partial<LbsToGDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Pounds and grams are both units of mass. Exact conversion: 1 lb = {GRAMS_PER_POUND} g
        (international avoirdupois pound). No density is required.
      </div>

      <FieldShell
        label="Mass/weight in pounds"
        htmlFor="lbs-to-g-pounds"
        tip={`Enter a mass in pounds. Grams update as pounds × ${GRAMS_PER_POUND}.`}
        error={errors.pounds}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="lbs-to-g-pounds"
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
        label="Mass/weight in grams"
        htmlFor="lbs-to-g-grams"
        tip={`Enter a mass in grams. Pounds update as grams ÷ ${GRAMS_PER_POUND}.`}
        error={errors.grams}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="lbs-to-g-grams"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.grams}
              placeholder="Enter grams"
              aria-invalid={Boolean(errors.grams)}
              onChange={(event) => set({ source: 'grams', grams: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            g
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        g = lb × {GRAMS_PER_POUND} · lb = g ÷ {GRAMS_PER_POUND}
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
