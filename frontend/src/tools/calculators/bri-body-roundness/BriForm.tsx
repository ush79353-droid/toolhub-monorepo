'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { fromCm, parseNumber, toCm } from './calculation';
import type { BriFieldErrors, BriInput, BriResult, LengthUnit } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

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
  input: BriInput;
  errors: BriFieldErrors;
  result: BriResult | null;
  onChange: (input: BriInput) => void;
}

export function BriForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<BriInput>) => onChange({ ...input, ...patch });

  const changeHeightUnit = (next: LengthUnit) => {
    const raw = parseNumber(input.heightText);
    if (raw !== null && raw > 0) {
      const cm = toCm(raw, input.heightUnit);
      set({ heightUnit: next, heightText: formatField(fromCm(cm, next), 4) });
      return;
    }
    set({ heightUnit: next });
  };

  const changeWaistUnit = (next: LengthUnit) => {
    const raw = parseNumber(input.waistText);
    if (raw !== null && raw > 0) {
      const cm = toCm(raw, input.waistUnit);
      set({ waistUnit: next, waistText: formatField(fromCm(cm, next), 4) });
      return;
    }
    set({ waistUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Body Roundness Index">
        <h3 className="text-sm font-semibold text-accent">Body Roundness Index</h3>

        <div>
          <label className={labelClass} htmlFor="bri-height">
            Height
          </label>
          <FieldShell error={errors.heightText}>
            <input
              id="bri-height"
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
              <option value="cm">cm</option>
              <option value="m">m</option>
              <option value="in">in</option>
              <option value="ft">ft</option>
            </select>
          </FieldShell>
          {errors.heightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heightText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bri-waist">
            Waist circumference
            <InfoTooltip text="Measure at the narrowest point or as directed by your clinician. Converted to the same length basis as height before BRI." />
          </label>
          <FieldShell error={errors.waistText}>
            <input
              id="bri-waist"
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
              aria-label="Waist unit"
            >
              <option value="cm">cm</option>
              <option value="m">m</option>
              <option value="in">in</option>
              <option value="ft">ft</option>
            </select>
          </FieldShell>
          {errors.waistText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.waistText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bri-result">
            BRI
            <InfoTooltip text="BRI = 364.2 − 365.5 × √(1 − (waist/(π×height))²)." />
          </label>
          <FieldShell muted>
            <input
              id="bri-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedBri ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
          </FieldShell>
        </div>

        {result?.statusHeadline ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-accent">{result.statusHeadline}</span>
            {result.statusDetail ? ` ${result.statusDetail}` : ''}
          </p>
        ) : null}
      </section>
    </form>
  );
}
