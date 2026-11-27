'use client';

import type { ReactNode } from 'react';
import { fromKg, parseNumber, toKg } from './calculation';
import type { WeightUnit, WlpFieldErrors, WlpInput, WlpResult } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-primary';

const WEIGHT_UNITS: { value: WeightUnit; label: string }[] = [
  { value: 'kg', label: 'kg' },
  { value: 'lb', label: 'lb' },
  { value: 'g', label: 'g' },
];

function FieldShell({
  error,
  muted,
  children,
}: {
  error?: string;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        error
          ? 'border-rose-400'
          : muted
            ? 'border-sky-200 bg-sky-50/60'
            : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

function formatField(value: number, digits = 4): string {
  if (!Number.isFinite(value)) return '';
  return String(Number(value.toFixed(digits)));
}

interface FormProps {
  input: WlpInput;
  errors: WlpFieldErrors;
  result: WlpResult | null;
  onChange: (input: WlpInput) => void;
}

export function WlpForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<WlpInput>) => onChange({ ...input, ...patch });

  const changePastUnit = (next: WeightUnit) => {
    const raw = parseNumber(input.pastText);
    if (raw !== null && raw > 0) {
      const kg = toKg(raw, input.pastUnit);
      set({ pastUnit: next, pastText: formatField(fromKg(kg, next), 4) });
      return;
    }
    set({ pastUnit: next });
  };

  const changeCurrentUnit = (next: WeightUnit) => {
    const raw = parseNumber(input.currentText);
    if (raw !== null && raw >= 0) {
      const kg = toKg(raw, input.currentUnit);
      set({ currentUnit: next, currentText: formatField(fromKg(kg, next), 4) });
      return;
    }
    set({ currentUnit: next });
  };

  const lossUnit = result?.lossDisplayUnit ?? input.pastUnit;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Weight loss inputs">
        <div>
          <label className={labelClass} htmlFor="wlp-past">
            Past weight
          </label>
          <FieldShell error={errors.pastText}>
            <input
              id="wlp-past"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.pastText}
              onChange={(e) => set({ pastText: e.target.value })}
              aria-invalid={Boolean(errors.pastText)}
            />
            <select
              className={unitSelectClass}
              value={input.pastUnit}
              onChange={(e) => changePastUnit(e.target.value as WeightUnit)}
              aria-label="Past weight unit"
            >
              {WEIGHT_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.pastText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.pastText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="wlp-current">
            Current weight
          </label>
          <FieldShell error={errors.currentText}>
            <input
              id="wlp-current"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.currentText}
              onChange={(e) => set({ currentText: e.target.value })}
              aria-invalid={Boolean(errors.currentText)}
            />
            <select
              className={unitSelectClass}
              value={input.currentUnit}
              onChange={(e) => changeCurrentUnit(e.target.value as WeightUnit)}
              aria-label="Current weight unit"
            >
              {WEIGHT_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.currentText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.currentText}</p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-label="Weight loss results">
        <div>
          <label className={labelClass} htmlFor="wlp-loss">
            Total weight loss
          </label>
          <FieldShell muted>
            <input
              id="wlp-loss"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedLoss ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <span className={unitFixed}>{lossUnit}</span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="wlp-percent">
            Weight loss percentage
          </label>
          <FieldShell muted>
            <input
              id="wlp-percent"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedPercent ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <span className={unitFixed}>%</span>
          </FieldShell>
        </div>

        {result?.statusHeadline ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-accent">{result.statusHeadline}</span>{' '}
            {result.statusDetail}
          </p>
        ) : null}
      </section>
    </form>
  );
}
