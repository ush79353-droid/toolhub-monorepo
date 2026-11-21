'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { KG_PER_POUND, type KgLbsSource, type KgToLbsFieldErrors, type KgToLbsInput } from './types';
import { parseOptionalNumber } from './validation';

export interface KgToLbsDraft {
  source: KgLbsSource;
  kg: string;
  lbs: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: KgToLbsDraft): KgToLbsInput {
  return {
    source: draft.source,
    kg: parseOptionalNumber(draft.kg),
    lbs: parseOptionalNumber(draft.lbs),
  };
}

export function emptyDraft(): KgToLbsDraft {
  return { source: 'kg', kg: '', lbs: '' };
}

interface KgToLbsFormProps {
  draft: KgToLbsDraft;
  errors: KgToLbsFieldErrors;
  onDraftChange: (draft: KgToLbsDraft) => void;
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

export function KgToLbsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: KgToLbsFormProps) {
  const set = (patch: Partial<KgToLbsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Exact: 1 lb = {KG_PER_POUND} kg (international avoirdupois). Edit either field: the other
        updates instantly. Mass units only (not force).
      </div>

      <FieldShell
        label="Weight in kilograms"
        htmlFor="kg-lbs-kg"
        tip="Enter a nonnegative mass in kilograms."
        error={errors.kg}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="kg-lbs-kg"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.kg}
              placeholder="Enter mass"
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
        label="Weight in pounds"
        htmlFor="kg-lbs-lbs"
        tip="Enter a nonnegative mass in international avoirdupois pounds. Symbol: lb."
        error={errors.lbs}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="kg-lbs-lbs"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.lbs}
              placeholder="Enter mass"
              aria-invalid={Boolean(errors.lbs)}
              onChange={(event) => set({ source: 'lbs', lbs: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            lb
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        lb = kg ÷ {KG_PER_POUND} · kg = lb × {KG_PER_POUND}
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
