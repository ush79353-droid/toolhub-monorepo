'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  EXTRA_VOLUME_LABELS,
  EXTRA_VOLUME_SYMBOLS,
  EXTRA_VOLUME_UNITS,
  type CuFtToCuMFieldErrors,
  type CuFtToCuMInput,
  type CuFtToCuMSource,
  type ExtraVolumeUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface CuFtToCuMDraft {
  source: CuFtToCuMSource;
  cubicFeet: string;
  cubicMeters: string;
  extras: Partial<Record<ExtraVolumeUnit, string>>;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): CuFtToCuMDraft {
  return {
    source: 'cubicFeet',
    cubicFeet: '',
    cubicMeters: '',
    extras: {},
    moreOpen: false,
  };
}

export function draftToInput(draft: CuFtToCuMDraft): CuFtToCuMInput {
  if (draft.source === 'cubicFeet') {
    return { source: 'cubicFeet', value: parseOptionalNumber(draft.cubicFeet) };
  }
  if (draft.source === 'cubicMeters') {
    return { source: 'cubicMeters', value: parseOptionalNumber(draft.cubicMeters) };
  }
  return {
    source: draft.source,
    value: parseOptionalNumber(draft.extras[draft.source] ?? ''),
  };
}

interface CuFtToCuMFormProps {
  draft: CuFtToCuMDraft;
  errors: CuFtToCuMFieldErrors;
  onDraftChange: (draft: CuFtToCuMDraft) => void;
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

export function CuFtToCuMForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CuFtToCuMFormProps) {
  const set = (patch: Partial<CuFtToCuMDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact factor: 1 ft³ = (0.3048)³ m³ = 0.028316846592 m³. Edit either primary field — the other
        updates instantly.
      </div>

      <FieldShell
        label="Cubic feet (cu ft)"
        htmlFor="cu-ft-m3-ft3"
        tip="Enter a volume in cubic feet. Cubic meters = ft³ × 0.028316846592."
        error={errors.cubicFeet}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cu-ft-m3-ft3"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.cubicFeet}
              placeholder="Enter volume"
              aria-invalid={Boolean(errors.cubicFeet)}
              onChange={(event) => set({ source: 'cubicFeet', cubicFeet: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            ft³
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Cubic meters (m³)"
        htmlFor="cu-ft-m3-m3"
        tip="Enter a volume in cubic meters. Cubic feet = m³ ÷ 0.028316846592."
        error={errors.cubicMeters}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cu-ft-m3-m3"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.cubicMeters}
              placeholder="Enter volume"
              aria-invalid={Boolean(errors.cubicMeters)}
              onChange={(event) =>
                set({ source: 'cubicMeters', cubicMeters: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            m³
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
            {EXTRA_VOLUME_UNITS.map((unit) => (
              <FieldShell
                key={unit}
                label={EXTRA_VOLUME_LABELS[unit]}
                htmlFor={`cu-ft-m3-${unit}`}
                error={errors[unit]}
              >
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                    <input
                      id={`cu-ft-m3-${unit}`}
                      inputMode="decimal"
                      autoComplete="off"
                      className={inputClass}
                      value={draft.extras[unit] ?? ''}
                      placeholder={`Enter ${EXTRA_VOLUME_SYMBOLS[unit]}`}
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
                    {EXTRA_VOLUME_SYMBOLS[unit]}
                  </span>
                </div>
              </FieldShell>
            ))}
          </div>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        1 ft³ = 0.028316846592 m³ · 1 m³ ≈ 35.3146667215 ft³
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
