'use client';

import type { ReactNode } from 'react';
import { fromCm, parseNumber, toCm } from './calculation';
import type {
  LengthUnit,
  WhtrFieldErrors,
  WhtrInput,
  WhtrResult,
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
  input: WhtrInput;
  errors: WhtrFieldErrors;
  result: WhtrResult | null;
  onChange: (input: WhtrInput) => void;
}

export function WhtrForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<WhtrInput>) => onChange({ ...input, ...patch });

  const changeWaistUnit = (next: LengthUnit) => {
    const raw = parseNumber(input.waistText);
    if (raw !== null && raw > 0) {
      const cm = toCm(raw, input.waistUnit);
      set({ waistUnit: next, waistText: formatField(fromCm(cm, next), 4) });
      return;
    }
    set({ waistUnit: next });
  };

  const changeHeightUnit = (next: LengthUnit) => {
    const raw = parseNumber(input.heightText);
    if (raw !== null && raw > 0) {
      const cm = toCm(raw, input.heightUnit);
      set({ heightUnit: next, heightText: formatField(fromCm(cm, next), 4) });
      return;
    }
    set({ heightUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Waist to height inputs">
        <div>
          <label className={labelClass} htmlFor="whtr-waist">
            Waist circumference
          </label>
          <FieldShell error={errors.waistText}>
            <input
              id="whtr-waist"
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
          <label className={labelClass} htmlFor="whtr-height">
            Height
          </label>
          <FieldShell error={errors.heightText}>
            <input
              id="whtr-height"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.heightText}
              onChange={(e) => set({ heightText: e.target.value })}
              aria-invalid={Boolean(errors.heightText)}
            />
            <select
              className={unitSelectClass}
              value={input.heightUnit}
              onChange={(e) => changeHeightUnit(e.target.value as LengthUnit)}
              aria-label="Height unit"
            >
              {LENGTH_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.heightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heightText}</p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-label="Waist to height result">
        <div>
          <label className={labelClass} htmlFor="whtr-result">
            Your waist to height ratio
          </label>
          <FieldShell muted>
            <input
              id="whtr-result"
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
