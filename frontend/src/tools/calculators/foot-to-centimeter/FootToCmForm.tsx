'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  EXTRA_LENGTH_LABELS,
  EXTRA_LENGTH_SYMBOLS,
  EXTRA_LENGTH_UNITS,
  type ExtraLengthUnit,
  type FootCmSource,
  type FootToCmFieldErrors,
  type FootToCmInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface FootToCmDraft {
  source: FootCmSource;
  feet: string;
  centimeters: string;
  extras: Partial<Record<ExtraLengthUnit, string>>;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): FootToCmDraft {
  return {
    source: 'feet',
    feet: '',
    centimeters: '',
    extras: {},
    moreOpen: false,
  };
}

export function draftToInput(draft: FootToCmDraft): FootToCmInput {
  if (draft.source === 'feet') {
    return { source: 'feet', value: parseOptionalNumber(draft.feet) };
  }
  if (draft.source === 'centimeters') {
    return { source: 'centimeters', value: parseOptionalNumber(draft.centimeters) };
  }
  return {
    source: draft.source,
    value: parseOptionalNumber(draft.extras[draft.source] ?? ''),
  };
}

interface FootToCmFormProps {
  draft: FootToCmDraft;
  errors: FootToCmFieldErrors;
  onDraftChange: (draft: FootToCmDraft) => void;
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

export function FootToCmForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: FootToCmFormProps) {
  const set = (patch: Partial<FootToCmDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Exact relationship: 1 ft = 30.48 cm (international foot = 0.3048 m). Edit either field; the
        other updates instantly. Signed values are supported for mathematical differences.
      </div>

      <FieldShell
        label="Foot"
        htmlFor="ft-cm-feet"
        tip="Enter a length in feet. Centimeters = feet × 30.48."
        error={errors.feet}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ft-cm-feet"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.feet}
              placeholder="Enter feet"
              aria-invalid={Boolean(errors.feet)}
              onChange={(event) => set({ source: 'feet', feet: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            ft
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Centimeter"
        htmlFor="ft-cm-cm"
        tip="Enter a length in centimeters. Feet = centimeters ÷ 30.48."
        error={errors.centimeters}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ft-cm-cm"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.centimeters}
              placeholder="Enter centimeters"
              aria-invalid={Boolean(errors.centimeters)}
              onChange={(event) =>
                set({ source: 'centimeters', centimeters: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            cm
          </span>
        </div>
      </FieldShell>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.moreOpen}
          onClick={() => set({ moreOpen: !draft.moreOpen })}
        >
          <span>More conversion options</span>
          {draft.moreOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {draft.moreOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 pb-3.5 pt-3">
            {EXTRA_LENGTH_UNITS.map((unit) => (
              <FieldShell
                key={unit}
                label={EXTRA_LENGTH_LABELS[unit]}
                htmlFor={`ft-cm-${unit}`}
                error={errors[unit]}
              >
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                    <input
                      id={`ft-cm-${unit}`}
                      inputMode="decimal"
                      autoComplete="off"
                      className={inputClass}
                      value={draft.extras[unit] ?? ''}
                      placeholder={`Enter ${EXTRA_LENGTH_SYMBOLS[unit]}`}
                      aria-invalid={Boolean(errors[unit])}
                      onChange={(event) =>
                        set({
                          source: unit,
                          extras: { ...draft.extras, [unit]: event.target.value },
                        })
                      }
                    />
                  </div>
                  <span className={unitBadgeClass} aria-hidden="true">
                    {EXTRA_LENGTH_SYMBOLS[unit]}
                  </span>
                </div>
              </FieldShell>
            ))}
          </div>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">1 ft = 30.48 cm exactly · cm = ft × 30.48</p>

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
