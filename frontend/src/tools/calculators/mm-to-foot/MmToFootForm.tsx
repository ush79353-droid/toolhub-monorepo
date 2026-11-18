'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DEFAULT_OTHER_UNIT,
  MM_PER_FOOT,
  OTHER_UNITS,
  PRIMARY_LABELS,
  PRIMARY_UNITS,
  UNIT_LABELS,
  UNIT_SYMBOLS,
  type ActiveField,
  type MmToFootFieldErrors,
  type OtherLengthUnit,
  type PrimaryUnit,
} from './types';

export interface MmToFootDraft {
  texts: Record<PrimaryUnit, string>;
  otherUnit: OtherLengthUnit;
  otherText: string;
  activeField: ActiveField | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const unitBadgeClass =
  'flex h-11 min-w-[4.25rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent';

export function emptyDraft(otherUnit: OtherLengthUnit = DEFAULT_OTHER_UNIT): MmToFootDraft {
  return {
    texts: { mm: '', ft: '' },
    otherUnit,
    otherText: '',
    activeField: null,
  };
}

interface MmToFootFormProps {
  draft: MmToFootDraft;
  errors: MmToFootFieldErrors;
  onDraftChange: (draft: MmToFootDraft) => void;
  onOtherUnitChange: (unit: OtherLengthUnit) => void;
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

export function MmToFootForm({
  draft,
  errors,
  onDraftChange,
  onOtherUnitChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MmToFootFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 ft = {MM_PER_FOOT} mm (international foot). Enter millimeters or feet — both stay
        linked. Optionally convert through another length unit below. Signed values are allowed for
        mathematical differences.
      </div>

      {PRIMARY_UNITS.map((unit) => {
        const id = `mm-ft-${unit}`;
        const error = errors[unit];
        return (
          <FieldShell
            key={unit}
            label={PRIMARY_LABELS[unit]}
            htmlFor={id}
            tip={
              unit === 'mm'
                ? `ft = mm ÷ ${MM_PER_FOOT}.`
                : `mm = ft × ${MM_PER_FOOT}.`
            }
            error={error}
          >
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id={id}
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck={false}
                  className={inputClass}
                  value={draft.texts[unit]}
                  placeholder="Enter length"
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
              <span className={unitBadgeClass} aria-hidden="true">
                {UNIT_SYMBOLS[unit]}
              </span>
            </div>
          </FieldShell>
        );
      })}

      <div className="space-y-1.5">
        <label htmlFor="mm-ft-other-unit" className={labelClass}>
          Length in other units
        </label>
        <select
          id="mm-ft-other-unit"
          className={selectClass}
          value={draft.otherUnit}
          onChange={(event) => onOtherUnitChange(event.target.value as OtherLengthUnit)}
        >
          {OTHER_UNITS.map((unit) => (
            <option key={unit} value={unit}>
              {UNIT_LABELS[unit]} ({UNIT_SYMBOLS[unit]})
            </option>
          ))}
        </select>
      </div>

      <FieldShell
        label={UNIT_LABELS[draft.otherUnit]}
        htmlFor="mm-ft-other-value"
        error={errors[draft.otherUnit]}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="mm-ft-other-value"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              className={inputClass}
              value={draft.otherText}
              placeholder="Enter length"
              aria-invalid={Boolean(errors[draft.otherUnit])}
              onChange={(event) =>
                onDraftChange({
                  ...draft,
                  otherText: event.target.value,
                  activeField: draft.otherUnit,
                })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            {UNIT_SYMBOLS[draft.otherUnit]}
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        1 ft = {MM_PER_FOOT} mm · ft = mm ÷ {MM_PER_FOOT}
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
