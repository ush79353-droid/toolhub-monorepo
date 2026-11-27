'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { fromCm, parseNumber, toCm } from './calculation';
import type {
  LengthUnit,
  WhrFieldErrors,
  WhrInput,
  WhrResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

const LENGTH_UNITS: { value: LengthUnit; label: string }[] = [
  { value: 'cm', label: 'cm' },
  { value: 'm', label: 'm' },
  { value: 'in', label: 'in' },
  { value: 'ft', label: 'ft' },
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
  input: WhrInput;
  errors: WhrFieldErrors;
  result: WhrResult | null;
  onChange: (input: WhrInput) => void;
}

export function WhrForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<WhrInput>) => onChange({ ...input, ...patch });

  const changeWaistUnit = (next: LengthUnit) => {
    const raw = parseNumber(input.waistText);
    if (raw !== null && raw > 0) {
      const cm = toCm(raw, input.waistUnit);
      set({ waistUnit: next, waistText: formatField(fromCm(cm, next), 4) });
      return;
    }
    set({ waistUnit: next });
  };

  const changeHipUnit = (next: LengthUnit) => {
    const raw = parseNumber(input.hipText);
    if (raw !== null && raw > 0) {
      const cm = toCm(raw, input.hipUnit);
      set({ hipUnit: next, hipText: formatField(fromCm(cm, next), 4) });
      return;
    }
    set({ hipUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Waist to hip inputs">
        <div>
          <label className={labelClass} htmlFor="whr-waist">
            Waist circumference (W)
            <InfoTooltip text="Typically the narrowest waist point, or midway between the lower ribs and iliac crest." />
          </label>
          <FieldShell error={errors.waistText}>
            <input
              id="whr-waist"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.waistText}
              onChange={(e) => set({ waistText: e.target.value })}
              aria-invalid={Boolean(errors.waistText)}
            />
            <select
              className={unitSelectClass}
              value={input.waistUnit}
              onChange={(e) => changeWaistUnit(e.target.value as LengthUnit)}
              aria-label="Waist circumference unit"
            >
              {LENGTH_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.waistText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.waistText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="whr-hip">
            Hip circumference (H)
            <InfoTooltip text="Widest point of the hips/buttocks. Hip must be greater than zero." />
          </label>
          <FieldShell error={errors.hipText}>
            <input
              id="whr-hip"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.hipText}
              onChange={(e) => set({ hipText: e.target.value })}
              aria-invalid={Boolean(errors.hipText)}
            />
            <select
              className={unitSelectClass}
              value={input.hipUnit}
              onChange={(e) => changeHipUnit(e.target.value as LengthUnit)}
              aria-label="Hip circumference unit"
            >
              {LENGTH_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.hipText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.hipText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="whr-result">
            Waist-hip ratio
            <InfoTooltip text="WHR = waist ÷ hip after normalizing units. Dimensionless — not a percent." />
          </label>
          <FieldShell muted>
            <input
              id="whr-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedRatio ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
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
