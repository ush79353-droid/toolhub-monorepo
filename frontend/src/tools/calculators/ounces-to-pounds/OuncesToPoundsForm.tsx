'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  KG_PER_OUNCE,
  OUNCES_PER_POUND,
  type OzLbSource,
  type OuncesToPoundsFieldErrors,
  type OuncesToPoundsInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface OuncesToPoundsDraft {
  source: OzLbSource;
  oz: string;
  lb: string;
  kg: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: OuncesToPoundsDraft): OuncesToPoundsInput {
  return {
    source: draft.source,
    oz: parseOptionalNumber(draft.oz),
    lb: parseOptionalNumber(draft.lb),
    kg: parseOptionalNumber(draft.kg),
  };
}

export function emptyDraft(): OuncesToPoundsDraft {
  return { source: 'oz', oz: '', lb: '', kg: '' };
}

interface OuncesToPoundsFormProps {
  draft: OuncesToPoundsDraft;
  errors: OuncesToPoundsFieldErrors;
  onDraftChange: (draft: OuncesToPoundsDraft) => void;
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

export function OuncesToPoundsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: OuncesToPoundsFormProps) {
  const set = (patch: Partial<OuncesToPoundsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 lb = {OUNCES_PER_POUND} oz (avoirdupois). Edit ounces, pounds, or kilograms — the
        others update instantly. Mass ounces only — not fluid ounces.
      </div>

      <FieldShell
        label="Weight in ounces"
        htmlFor="oz-lb-oz"
        tip={`lb = oz ÷ ${OUNCES_PER_POUND}. Avoirdupois mass ounces, not fluid ounces.`}
        error={errors.oz}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="oz-lb-oz"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.oz}
              placeholder="Enter ounces"
              aria-invalid={Boolean(errors.oz)}
              onChange={(event) => set({ source: 'oz', oz: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            oz
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Weight in pounds"
        htmlFor="oz-lb-lb"
        tip={`oz = lb × ${OUNCES_PER_POUND}.`}
        error={errors.lb}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="oz-lb-lb"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.lb}
              placeholder="Enter pounds"
              aria-invalid={Boolean(errors.lb)}
              onChange={(event) => set({ source: 'lb', lb: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            lb
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Weight in other units"
        htmlFor="oz-lb-kg"
        tip={`kg = oz × ${KG_PER_OUNCE}. SI mass linked to the same measurement.`}
        error={errors.kg}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="oz-lb-kg"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.kg}
              placeholder="Enter kilograms"
              aria-invalid={Boolean(errors.kg)}
              onChange={(event) => set({ source: 'kg', kg: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            kg
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        1 lb = {OUNCES_PER_POUND} oz · 1 oz = {KG_PER_OUNCE} kg
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
