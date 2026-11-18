'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  EXTRA_ANGLE_FIELDS,
  EXTRA_ANGLE_LABELS,
  EXTRA_ANGLE_SYMBOLS,
  type ExtraAngleField,
  type RadiansDegreesSource,
  type RadiansToDegreesFieldErrors,
} from './types';
import { parseOptionalNumber } from './validation';

export interface RadiansToDegreesDraft {
  source: RadiansDegreesSource;
  radians: string;
  degrees: string;
  extras: Partial<Record<ExtraAngleField, string>>;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const suffixClass =
  'flex h-11 shrink-0 items-center rounded-r-lg border-l border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

/** Screenshot default: π rad = 180°. */
export function defaultDraft(): RadiansToDegreesDraft {
  return {
    source: 'radians',
    radians: String(Math.PI),
    degrees: '180',
    extras: {},
    moreOpen: false,
  };
}

export function emptyDraft(): RadiansToDegreesDraft {
  return {
    source: 'radians',
    radians: '',
    degrees: '',
    extras: {},
    moreOpen: false,
  };
}

export function draftToInput(draft: RadiansToDegreesDraft) {
  if (draft.source === 'radians') {
    return { source: draft.source, value: parseOptionalNumber(draft.radians) };
  }
  if (draft.source === 'degrees') {
    return { source: draft.source, value: parseOptionalNumber(draft.degrees) };
  }
  return {
    source: draft.source,
    value: parseOptionalNumber(draft.extras[draft.source] ?? ''),
  };
}

interface RadiansToDegreesFormProps {
  draft: RadiansToDegreesDraft;
  errors: RadiansToDegreesFieldErrors;
  onDraftChange: (draft: RadiansToDegreesDraft) => void;
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

export function RadiansToDegreesForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: RadiansToDegreesFormProps) {
  const set = (patch: Partial<RadiansToDegreesDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Uses Math.PI exactly: degrees = radians × 180/π and radians = degrees × π/180. Negative
        angles and values beyond 360° are preserved. You can enter π, π/2, 2π, or 3*pi/2 in the
        radians field.
      </div>

      <FieldShell
        label="Angle in radians"
        htmlFor="rtd-radians"
        tip="Enter radians (rad), or a restricted π expression such as π/2 or 2π."
        error={errors.radians}
      >
        <div className="flex overflow-hidden rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="rtd-radians"
            inputMode="decimal"
            autoComplete="off"
            className={inputClass}
            value={draft.radians}
            placeholder="Enter radians"
            aria-invalid={Boolean(errors.radians)}
            onChange={(event) => set({ source: 'radians', radians: event.target.value })}
          />
          <span className={suffixClass} aria-hidden="true">
            rad
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Angle in degrees"
        htmlFor="rtd-degrees"
        tip="Enter degrees (°). Radians update as degrees × π / 180."
        error={errors.degrees}
      >
        <div className="flex overflow-hidden rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="rtd-degrees"
            inputMode="decimal"
            autoComplete="off"
            className={inputClass}
            value={draft.degrees}
            placeholder="Enter degrees"
            aria-invalid={Boolean(errors.degrees)}
            onChange={(event) => set({ source: 'degrees', degrees: event.target.value })}
          />
          <span className={suffixClass} aria-hidden="true">
            deg
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
          <span>Other angle units</span>
          {draft.moreOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>
        {draft.moreOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 pb-3.5 pt-3">
            {EXTRA_ANGLE_FIELDS.map((unit) => (
              <FieldShell
                key={unit}
                label={EXTRA_ANGLE_LABELS[unit]}
                htmlFor={`rtd-${unit}`}
                error={errors[unit]}
              >
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                    <input
                      id={`rtd-${unit}`}
                      inputMode="decimal"
                      autoComplete="off"
                      className={inputClass}
                      value={draft.extras[unit] ?? ''}
                      placeholder={`Enter ${EXTRA_ANGLE_SYMBOLS[unit]}`}
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
                    {EXTRA_ANGLE_SYMBOLS[unit]}
                  </span>
                </div>
              </FieldShell>
            ))}
          </div>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        π rad = 180° · 2π rad = 360° · 400 gon = 360° · 1 turn = 2π rad
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
