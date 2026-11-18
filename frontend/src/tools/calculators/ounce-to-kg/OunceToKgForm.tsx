'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  KG_PER_OUNCE,
  OUNCES_PER_POUND,
  type OzKgSource,
  type OunceToKgFieldErrors,
  type OunceToKgInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface OunceToKgDraft {
  source: OzKgSource;
  oz: string;
  kg: string;
  lb: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: OunceToKgDraft): OunceToKgInput {
  return {
    source: draft.source,
    oz: parseOptionalNumber(draft.oz),
    kg: parseOptionalNumber(draft.kg),
    lb: parseOptionalNumber(draft.lb),
  };
}

export function emptyDraft(): OunceToKgDraft {
  return { source: 'oz', oz: '', kg: '', lb: '' };
}

interface OunceToKgFormProps {
  draft: OunceToKgDraft;
  errors: OunceToKgFieldErrors;
  onDraftChange: (draft: OunceToKgDraft) => void;
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

export function OunceToKgForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: OunceToKgFormProps) {
  const set = (patch: Partial<OunceToKgDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 oz = {KG_PER_OUNCE} kg (avoirdupois). Edit ounces, kilograms, or pounds — the
        others update instantly. Mass ounces only — not fluid ounces.
      </div>

      <FieldShell
        label="Weight in ounces"
        htmlFor="oz-kg-oz"
        tip={`kg = oz × ${KG_PER_OUNCE}. Avoirdupois mass ounces, not fluid ounces.`}
        error={errors.oz}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="oz-kg-oz"
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
        label="Weight in kilograms"
        htmlFor="oz-kg-kg"
        tip={`oz = kg ÷ ${KG_PER_OUNCE}.`}
        error={errors.kg}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="oz-kg-kg"
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

      <FieldShell
        label="Weight in other units"
        htmlFor="oz-kg-lb"
        tip={`lb = oz ÷ ${OUNCES_PER_POUND}. Linked avoirdupois pounds.`}
        error={errors.lb}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="oz-kg-lb"
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

      <p className="text-xs text-muted-foreground">
        1 oz = {KG_PER_OUNCE} kg · 1 lb = {OUNCES_PER_POUND} oz
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
