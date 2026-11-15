'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import {
  EXAMPLE_DD_TO_DMS,
  EXAMPLE_DMS_TO_DD,
  type ActiveInput,
  type DegreesMinutesSecondsFieldErrors,
} from './types';

export interface DegreesMinutesSecondsDraft {
  activeInput: ActiveInput;
  degrees: string;
  minutes: string;
  seconds: string;
  decimalDegrees: string;
  /** Canonical signed DD while valid. */
  canonical: number | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): DegreesMinutesSecondsDraft {
  return {
    activeInput: 'DMS',
    degrees: '',
    minutes: '',
    seconds: '',
    decimalDegrees: '',
    canonical: null,
  };
}

interface DegreesMinutesSecondsFormProps {
  draft: DegreesMinutesSecondsDraft;
  errors: DegreesMinutesSecondsFieldErrors;
  onDraftChange: (draft: DegreesMinutesSecondsDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  onApplyExample: (example: 'dms' | 'dd') => void;
}

function FieldShell({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
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

export function DegreesMinutesSecondsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onApplyExample,
}: DegreesMinutesSecondsFormProps) {
  const set = (patch: Partial<DegreesMinutesSecondsDraft>) =>
    onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Convert a general angle between degrees–minutes–seconds (DMS) and decimal degrees (DD).
        Negative signs apply to the whole DMS magnitude. Minutes and seconds stay between 0 and 60
        (exclusive of 60). Angles may exceed 360°.
      </div>

      <div className="rounded-xl border border-border px-3.5 py-3.5">
        <p className="text-sm font-medium text-accent">Angle in degrees minutes seconds</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <FieldShell label="Degrees" htmlFor="dms-deg" error={errors.degrees}>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="dms-deg"
                  inputMode="decimal"
                  className={inputClass}
                  value={draft.degrees}
                  placeholder="deg"
                  aria-invalid={Boolean(errors.degrees)}
                  onChange={(event) =>
                    set({ activeInput: 'DMS', degrees: event.target.value })
                  }
                />
              </div>
              <span className={unitBadgeClass} aria-hidden="true">
                °
              </span>
            </div>
          </FieldShell>
          <FieldShell label="Minutes" htmlFor="dms-min" error={errors.minutes}>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="dms-min"
                  inputMode="decimal"
                  className={inputClass}
                  value={draft.minutes}
                  placeholder="arcmin"
                  aria-invalid={Boolean(errors.minutes)}
                  onChange={(event) =>
                    set({ activeInput: 'DMS', minutes: event.target.value })
                  }
                />
              </div>
              <span className={unitBadgeClass} aria-hidden="true">
                ′
              </span>
            </div>
          </FieldShell>
          <FieldShell label="Seconds" htmlFor="dms-sec" error={errors.seconds}>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="dms-sec"
                  inputMode="decimal"
                  className={inputClass}
                  value={draft.seconds}
                  placeholder="arcsec"
                  aria-invalid={Boolean(errors.seconds)}
                  onChange={(event) =>
                    set({ activeInput: 'DMS', seconds: event.target.value })
                  }
                />
              </div>
              <span className={unitBadgeClass} aria-hidden="true">
                ″
              </span>
            </div>
          </FieldShell>
        </div>
      </div>

      <div className="rounded-xl border border-border px-3.5 py-3.5">
        <FieldShell
          label="Angle in degrees"
          htmlFor="dms-dd"
          error={errors.decimalDegrees}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="dms-dd"
                inputMode="decimal"
                className={inputClass}
                value={draft.decimalDegrees}
                placeholder="Decimal degrees"
                aria-invalid={Boolean(errors.decimalDegrees)}
                onChange={(event) =>
                  set({ activeInput: 'DD', decimalDegrees: event.target.value })
                }
              />
            </div>
            <span className={unitBadgeClass} aria-hidden="true">
              °
            </span>
          </div>
        </FieldShell>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-3.5">
        <p className="text-sm font-medium text-accent">Check our examples:</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          <li>
            <button
              type="button"
              className="text-left text-primary underline-offset-2 hover:underline"
              onClick={() => onApplyExample('dms')}
            >
              Example 1 — {EXAMPLE_DMS_TO_DD.label} → decimal degrees
            </button>
          </li>
          <li>
            <button
              type="button"
              className="text-left text-primary underline-offset-2 hover:underline"
              onClick={() => onApplyExample('dd')}
            >
              Example 2 — {EXAMPLE_DD_TO_DMS.label} → DMS
            </button>
          </li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
