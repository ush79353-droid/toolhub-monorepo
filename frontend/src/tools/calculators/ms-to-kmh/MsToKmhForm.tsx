'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  EXTRA_SPEED_UNITS,
  MAIN_SPEED_UNITS,
  SPEED_UNIT_DEFS,
  type ExtraSpeedUnit,
  type MainSpeedUnit,
  type SpeedFieldErrors,
  type SpeedUnit,
} from './types';

export interface MsToKmhDraft {
  texts: Record<MainSpeedUnit, string>;
  extraTexts: Record<ExtraSpeedUnit, string>;
  extraOpen: boolean;
  activeField: SpeedUnit | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

function emptyMain(): Record<MainSpeedUnit, string> {
  return { mps: '', kmh: '', mph: '', fps: '', knots: '' };
}

function emptyExtra(): Record<ExtraSpeedUnit, string> {
  return {
    cms: '',
    mms: '',
    kms: '',
    mpm: '',
    kmpm: '',
    fpm: '',
    mips: '',
    mipm: '',
  };
}

export function emptyDraft(): MsToKmhDraft {
  return {
    texts: emptyMain(),
    extraTexts: emptyExtra(),
    extraOpen: false,
    activeField: null,
  };
}

interface MsToKmhFormProps {
  draft: MsToKmhDraft;
  errors: SpeedFieldErrors;
  onDraftChange: (draft: MsToKmhDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function MsToKmhForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MsToKmhFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Edit any speed field; others update from meters per second. Speed as magnitude is usually
        nonnegative; signed values can represent one-dimensional velocity.
      </div>

      {MAIN_SPEED_UNITS.map((unit) => {
        const def = SPEED_UNIT_DEFS[unit];
        const id = `speed-${unit}`;
        const error = errors[unit];
        return (
          <div key={unit} className="space-y-1.5">
            <label htmlFor={id} className={labelClass}>
              {def.label}
            </label>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id={id}
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck={false}
                  className={inputClass}
                  value={draft.texts[unit]}
                  placeholder="Enter value"
                  aria-invalid={Boolean(error)}
                  onChange={(event) =>
                    onDraftChange({
                      ...draft,
                      texts: { ...draft.texts, [unit]: event.target.value },
                      activeField: unit,
                    })
                  }
                />
              </div>
              <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm font-medium text-accent">
                {def.symbol}
              </span>
            </div>
            {error ? (
              <p className="text-xs text-red-600" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.extraOpen}
          onClick={() => onDraftChange({ ...draft, extraOpen: !draft.extraOpen })}
        >
          <span>More conversion options</span>
          {draft.extraOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {draft.extraOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 py-3.5">
            {EXTRA_SPEED_UNITS.map((unit) => {
              const def = SPEED_UNIT_DEFS[unit];
              const id = `speed-extra-${unit}`;
              const error = errors[unit];
              return (
                <div key={unit} className="space-y-1.5">
                  <label htmlFor={id} className={labelClass}>
                    {def.label}
                  </label>
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id={id}
                        inputMode="decimal"
                        autoComplete="off"
                        spellCheck={false}
                        className={inputClass}
                        value={draft.extraTexts[unit]}
                        placeholder="Enter value"
                        aria-invalid={Boolean(error)}
                        onChange={(event) =>
                          onDraftChange({
                            ...draft,
                            extraTexts: { ...draft.extraTexts, [unit]: event.target.value },
                            activeField: unit,
                          })
                        }
                      />
                    </div>
                    <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm font-medium text-accent">
                      {def.symbol}
                    </span>
                  </div>
                  {error ? (
                    <p className="text-xs text-red-600" role="alert">
                      {error}
                    </p>
                  ) : null}
                </div>
              );
            })}
            <p className="text-xs leading-relaxed text-muted-foreground">
              Mach number is omitted because the speed of sound depends on temperature and medium;
              it is not a fixed conversion factor.
            </p>
          </div>
        ) : null}
      </div>

      {children}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Convert
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
