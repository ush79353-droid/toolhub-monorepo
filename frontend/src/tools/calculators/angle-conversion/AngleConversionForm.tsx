'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ANGLE_UNIT_DEFS,
  DEFAULT_DEGREES,
  EXTRA_ANGLE_UNITS,
  MAIN_ANGLE_UNITS,
  type AngleFieldErrors,
  type AngleUnit,
  type ExtraAngleUnit,
  type MainAngleUnit,
} from './types';

export type ActiveAngleField = AngleUnit | 'dmsDegrees' | 'dmsMinutes' | 'dmsSeconds';

export interface AngleConversionDraft {
  texts: Record<MainAngleUnit, string>;
  dmsDegrees: string;
  dmsMinutes: string;
  dmsSeconds: string;
  extraTexts: Record<ExtraAngleUnit, string>;
  extraOpen: boolean;
  activeField: ActiveAngleField | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

function emptyMain(): Record<MainAngleUnit, string> {
  return { degrees: '', radians: '', gradians: '', turns: '', piRadians: '' };
}

function emptyExtra(): Record<ExtraAngleUnit, string> {
  return {
    arcminutes: '',
    arcseconds: '',
    microradians: '',
    natoMils: '',
    sovietMils: '',
    swedishMils: '',
  };
}

export function defaultDraft(): AngleConversionDraft {
  return {
    texts: { ...emptyMain(), degrees: String(DEFAULT_DEGREES) },
    dmsDegrees: String(DEFAULT_DEGREES),
    dmsMinutes: '0',
    dmsSeconds: '0',
    extraTexts: emptyExtra(),
    extraOpen: false,
    activeField: null,
  };
}

export function emptyDraft(): AngleConversionDraft {
  return {
    texts: emptyMain(),
    dmsDegrees: '',
    dmsMinutes: '',
    dmsSeconds: '',
    extraTexts: emptyExtra(),
    extraOpen: false,
    activeField: null,
  };
}

interface AngleConversionFormProps {
  draft: AngleConversionDraft;
  errors: AngleFieldErrors;
  onDraftChange: (draft: AngleConversionDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function AngleConversionForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: AngleConversionFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Edit any unit — the others update from the same angle in radians. Angles may be negative or
        larger than 360°. DMS sign belongs on the degrees field.
      </div>

      {MAIN_ANGLE_UNITS.map((unit) => {
        const def = ANGLE_UNIT_DEFS[unit];
        const id = `angle-${unit}`;
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
                  placeholder="0"
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

      <div className="space-y-1.5">
        <p className={labelClass}>Degrees / minutes / seconds</p>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { key: 'dmsDegrees' as const, label: 'deg', value: draft.dmsDegrees },
              { key: 'dmsMinutes' as const, label: 'arcmin', value: draft.dmsMinutes },
              { key: 'dmsSeconds' as const, label: 'arcsec', value: draft.dmsSeconds },
            ] as const
          ).map((field) => (
            <div key={field.key} className="space-y-1">
              <label htmlFor={`angle-${field.key}`} className="sr-only">
                DMS {field.label}
              </label>
              <div className="flex gap-1">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id={`angle-${field.key}`}
                    inputMode="decimal"
                    autoComplete="off"
                    spellCheck={false}
                    className={inputClass}
                    value={field.value}
                    placeholder="0"
                    aria-invalid={Boolean(errors[field.key])}
                    onChange={(event) =>
                      onDraftChange({
                        ...draft,
                        [field.key]: event.target.value,
                        activeField: field.key,
                      })
                    }
                  />
                </div>
                <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-2 text-xs font-medium text-accent">
                  {field.label}
                </span>
              </div>
              {errors[field.key] ? (
                <p className="text-xs text-red-600" role="alert">
                  {errors[field.key]}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.extraOpen}
          onClick={() => onDraftChange({ ...draft, extraOpen: !draft.extraOpen })}
        >
          <span>More angle units</span>
          {draft.extraOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {draft.extraOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 py-3.5">
            {EXTRA_ANGLE_UNITS.map((unit) => {
              const def = ANGLE_UNIT_DEFS[unit];
              const id = `angle-extra-${unit}`;
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
                        placeholder="0"
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
