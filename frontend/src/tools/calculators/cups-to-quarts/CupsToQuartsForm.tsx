'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  CUP_UNIT_OPTIONS,
  DEFAULT_CUP_UNIT,
  DEFAULT_QUART_UNIT,
  QUART_UNIT_OPTIONS,
  type CupUnit,
  type CupsToQuartsFieldErrors,
  type CupsToQuartsInput,
  type CupsToQuartsSource,
  type QuartUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface CupsToQuartsDraft {
  source: CupsToQuartsSource;
  cups: string;
  quarts: string;
  cupUnit: CupUnit;
  quartUnit: QuartUnit;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring sm:min-w-[7.5rem]';

export function emptyDraft(): CupsToQuartsDraft {
  return {
    source: 'cups',
    cups: '',
    quarts: '',
    cupUnit: DEFAULT_CUP_UNIT,
    quartUnit: DEFAULT_QUART_UNIT,
  };
}

export function draftToInput(draft: CupsToQuartsDraft): CupsToQuartsInput {
  if (draft.source === 'cups') {
    return {
      source: 'cups',
      value: parseOptionalNumber(draft.cups),
      cupUnit: draft.cupUnit,
      quartUnit: draft.quartUnit,
    };
  }
  return {
    source: 'quarts',
    value: parseOptionalNumber(draft.quarts),
    cupUnit: draft.cupUnit,
    quartUnit: draft.quartUnit,
  };
}

interface CupsToQuartsFormProps {
  draft: CupsToQuartsDraft;
  errors: CupsToQuartsFieldErrors;
  onDraftChange: (draft: CupsToQuartsDraft) => void;
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

export function CupsToQuartsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CupsToQuartsFormProps) {
  const set = (patch: Partial<CupsToQuartsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Cups and quarts measure volume. US liquid, US dry, and imperial quarts differ. Matching US
        customary cups with US liquid quarts gives 4 cups = 1 quart. Matching UK cups with imperial
        quarts also gives 4 cups = 1 quart.
      </div>

      <FieldShell
        label="Volume in cups"
        htmlFor="cups-qt-cups"
        tip="Choose US customary, US legal, metric, or UK imperial cup."
        error={errors.cups}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cups-qt-cups"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.cups}
              placeholder="Enter cups"
              aria-invalid={Boolean(errors.cups)}
              onChange={(event) => set({ source: 'cups', cups: event.target.value })}
            />
          </div>
          <select
            aria-label="Cup unit"
            className={selectClass}
            value={draft.cupUnit}
            onChange={(event) =>
              set({ cupUnit: event.target.value as CupUnit, source: draft.source })
            }
          >
            {CUP_UNIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <FieldShell
        label="Volume in quarts"
        htmlFor="cups-qt-quarts"
        tip="US liquid, US dry, and UK imperial quarts are different volumes."
        error={errors.quarts}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cups-qt-quarts"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.quarts}
              placeholder="Enter quarts"
              aria-invalid={Boolean(errors.quarts)}
              onChange={(event) => set({ source: 'quarts', quarts: event.target.value })}
            />
          </div>
          <select
            aria-label="Quart unit"
            className={selectClass}
            value={draft.quartUnit}
            onChange={(event) =>
              set({
                quartUnit: event.target.value as QuartUnit,
                source: draft.source,
              })
            }
          >
            {QUART_UNIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        1 US liquid qt = 4 US cups · 1 imp qt = 4 UK cups · US dry qt differs from liquid qt
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
