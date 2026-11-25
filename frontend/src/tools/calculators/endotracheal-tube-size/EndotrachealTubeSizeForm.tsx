'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  fromAgeYears,
  parseNumber,
  toAgeYears,
} from './calculation';
import type {
  AgeUnit,
  EndotrachealTubeSizeFieldErrors,
  EndotrachealTubeSizeInput,
  EndotrachealTubeSizeResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';
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

interface FormProps {
  input: EndotrachealTubeSizeInput;
  errors: EndotrachealTubeSizeFieldErrors;
  result: EndotrachealTubeSizeResult | null;
  onChange: (input: EndotrachealTubeSizeInput) => void;
}

export function EndotrachealTubeSizeForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<EndotrachealTubeSizeInput>) =>
    onChange({ ...input, ...patch });

  const switchUnit = (next: AgeUnit) => {
    if (next === input.ageUnit) return;
    const n = parseNumber(input.ageText);
    if (n === null) {
      set({ ageUnit: next });
      return;
    }
    const years = toAgeYears(n, input.ageUnit);
    const converted = fromAgeYears(years, next);
    set({
      ageUnit: next,
      ageText: new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 4,
        useGrouping: false,
      }).format(converted),
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="ETT size inputs">
        <div>
          <label className={labelClass} htmlFor="ett-age">
            Age
            <InfoTooltip text="Cole formulas use age in years (about 1–12). Switch months ↔ years; physical age is preserved." />
          </label>
          <FieldShell error={errors.ageText}>
            <input
              id="ett-age"
              className={inputClass}
              inputMode="decimal"
              value={input.ageText}
              onChange={(e) => set({ ageText: e.target.value })}
              aria-invalid={Boolean(errors.ageText)}
            />
            <select
              className={unitSelectClass}
              value={input.ageUnit}
              onChange={(e) => switchUnit(e.target.value as AgeUnit)}
              aria-label="Age unit"
            >
              <option value="yrs">yrs</option>
              <option value="mos">mos</option>
            </select>
          </FieldShell>
          {errors.ageText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageText}</p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-label="ETT size results">
        <div>
          <div className={labelClass}>Uncuffed ETT size</div>
          <FieldShell muted>
            <input
              readOnly
              className={inputClass}
              value={result?.formattedUncuffed ?? ''}
              aria-label="Uncuffed ETT size"
            />
            <span className={unitFixed}>mm (ID)</span>
          </FieldShell>
        </div>
        <div>
          <div className={labelClass}>Cuffed ETT size</div>
          <FieldShell muted>
            <input
              readOnly
              className={inputClass}
              value={result?.formattedCuffed ?? ''}
              aria-label="Cuffed ETT size"
            />
            <span className={unitFixed}>mm (ID)</span>
          </FieldShell>
        </div>
        <div>
          <div className={labelClass}>Insertion depth</div>
          <FieldShell muted>
            <input
              readOnly
              className={inputClass}
              value={result?.formattedDepth ?? ''}
              aria-label="Insertion depth"
            />
            <span className={unitFixed}>cm</span>
          </FieldShell>
        </div>
        {result ? (
          <p className="text-xs text-muted-foreground">{result.statusDetail}</p>
        ) : null}
      </section>
    </form>
  );
}
