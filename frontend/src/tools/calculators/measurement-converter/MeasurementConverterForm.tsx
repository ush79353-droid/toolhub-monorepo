'use client';

import type { FormEvent, ReactNode } from 'react';
import { ArrowLeftRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { conversionFactor, formatWithPrecision } from './calculation';
import {
  PRECISION_OPTIONS,
  type ActiveField,
  type Dimension,
  type MeasurementFieldErrors,
  type PrecisionMode,
} from './types';
import { CATEGORY_LIST, getCategory } from './units';
import { parseOptionalNumber } from './validation';

export interface MeasurementDraft {
  dimension: Dimension;
  fromUnit: string;
  toUnit: string;
  input: string;
  output: string;
  activeField: ActiveField;
  precision: PrecisionMode;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-muted/50 px-2.5 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring';
const unitSelectClass =
  'h-11 min-w-[7rem] shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring sm:min-w-[9rem]';

export function emptyDraft(dimension: Dimension = 'length'): MeasurementDraft {
  const cat = getCategory(dimension);
  return {
    dimension,
    fromUnit: cat.defaultFrom,
    toUnit: cat.defaultTo,
    input: '',
    output: '',
    activeField: 'input',
    precision: 'auto',
  };
}

interface MeasurementConverterFormProps {
  draft: MeasurementDraft;
  errors: MeasurementFieldErrors;
  onDraftChange: (draft: MeasurementDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  onSwap: () => void;
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

export function MeasurementConverterForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onSwap,
  children,
}: MeasurementConverterFormProps) {
  const set = (patch: Partial<MeasurementDraft>) => onDraftChange({ ...draft, ...patch });
  const category = getCategory(draft.dimension);
  const fromUnit = category.units.find((u) => u.id === draft.fromUnit);
  const toUnit = category.units.find((u) => u.id === draft.toUnit);
  const factorFwd = conversionFactor(draft.dimension, draft.fromUnit, draft.toUnit);
  const factorRev = conversionFactor(draft.dimension, draft.toUnit, draft.fromUnit);

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Convert within one physical dimension at a time. Source and target units must share the same
        category. Temperature uses affine formulas; other quantities use exact scale factors.
      </div>

      <div className="rounded-xl border border-border bg-muted/20 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">Type of unit</h3>
        <fieldset className="mt-3 space-y-2">
          <legend className="sr-only">Measurement dimension</legend>
          {CATEGORY_LIST.map((cat) => (
            <label
              key={cat.id}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 text-sm text-accent hover:bg-white/70"
            >
              <input
                type="radio"
                name="measurement-dimension"
                className="h-4 w-4 accent-primary"
                checked={draft.dimension === cat.id}
                onChange={() =>
                  onDraftChange({
                    ...emptyDraft(cat.id),
                    precision: draft.precision,
                  })
                }
              />
              <span className="font-medium">{cat.label}</span>
              <span className="font-mono text-xs text-muted-foreground">{cat.symbol}</span>
            </label>
          ))}
        </fieldset>
        {category.note ? (
          <p className="mt-2 text-xs text-muted-foreground">{category.note}</p>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-muted/20 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">Conversion factors</h3>
        <div className="mt-3 space-y-3">
          <FieldShell label="1st unit" htmlFor="meas-from-unit" error={errors.fromUnit}>
            <select
              id="meas-from-unit"
              className={selectClass}
              value={draft.fromUnit}
              onChange={(event) => set({ fromUnit: event.target.value, activeField: draft.activeField })}
            >
              {category.units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name} ({unit.symbol})
                </option>
              ))}
            </select>
          </FieldShell>
          <FieldShell label="2nd unit" htmlFor="meas-to-unit" error={errors.toUnit}>
            <select
              id="meas-to-unit"
              className={selectClass}
              value={draft.toUnit}
              onChange={(event) => set({ toUnit: event.target.value, activeField: draft.activeField })}
            >
              {category.units.map((unit) => (
                <option key={`to-${unit.id}`} value={unit.id}>
                  {unit.name} ({unit.symbol})
                </option>
              ))}
            </select>
          </FieldShell>
          <div className="rounded-lg border border-border bg-white px-3 py-2 font-mono text-xs text-muted-foreground">
            {category.kind === 'temperature' ? (
              <p>Temperature conversions use scale and offset (not a single constant factor).</p>
            ) : (
              <>
                <p>
                  1 {fromUnit?.symbol ?? draft.fromUnit} ={' '}
                  {factorFwd == null ? '—' : formatWithPrecision(factorFwd, draft.precision)}{' '}
                  {toUnit?.symbol ?? draft.toUnit}
                </p>
                <p className="mt-1">
                  1 {toUnit?.symbol ?? draft.toUnit} ={' '}
                  {factorRev == null ? '—' : formatWithPrecision(factorRev, draft.precision)}{' '}
                  {fromUnit?.symbol ?? draft.fromUnit}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-muted/20 p-3.5 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-accent">Conversion</h3>
          <Button type="button" variant="outline" className="h-9" onClick={onSwap}>
            <ArrowLeftRight className="mr-1.5 h-4 w-4" />
            Swap units
          </Button>
        </div>
        <div className="mt-3 space-y-3">
          <FieldShell
            label="Input value"
            htmlFor="meas-input"
            tip={`Value in ${fromUnit?.name ?? 'source unit'}.`}
            error={errors.value}
          >
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="meas-input"
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.input}
                  placeholder="Enter value"
                  aria-invalid={Boolean(errors.value)}
                  onChange={(event) =>
                    set({ input: event.target.value, activeField: 'input' })
                  }
                />
              </div>
              <span className={unitSelectClass + ' flex items-center justify-center text-muted-foreground'}>
                {fromUnit?.symbol ?? ''}
              </span>
            </div>
          </FieldShell>

          <FieldShell
            label="Converted value"
            htmlFor="meas-output"
            tip={`Value in ${toUnit?.name ?? 'target unit'}. Edit to convert in reverse.`}
          >
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="meas-output"
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.output}
                  placeholder="Result"
                  onChange={(event) =>
                    set({ output: event.target.value, activeField: 'output' })
                  }
                />
              </div>
              <span className={unitSelectClass + ' flex items-center justify-center text-muted-foreground'}>
                {toUnit?.symbol ?? ''}
              </span>
            </div>
          </FieldShell>

          <FieldShell
            label="Precision"
            htmlFor="meas-precision"
            tip="Rounding applies to displayed values only. Internal math keeps full precision."
          >
            <select
              id="meas-precision"
              className={selectClass}
              value={draft.precision}
              onChange={(event) =>
                set({ precision: event.target.value as PrecisionMode, activeField: draft.activeField })
              }
            >
              {PRECISION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>
      </div>

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

export function draftActiveValue(draft: MeasurementDraft): number | null {
  const raw = draft.activeField === 'input' ? draft.input : draft.output;
  return parseOptionalNumber(raw);
}
