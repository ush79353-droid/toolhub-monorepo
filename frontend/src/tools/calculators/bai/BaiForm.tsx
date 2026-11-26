'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  cmToHip,
  heightToMeters,
  hipToCm,
  metersToHeight,
  parseNumber,
} from './calculation';
import type {
  BaiFieldErrors,
  BaiInput,
  BaiResult,
  HeightUnit,
  HipUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-primary';

const HEIGHT_UNITS: { value: HeightUnit; label: string }[] = [
  { value: 'm', label: 'm' },
  { value: 'cm', label: 'cm' },
  { value: 'in', label: 'in' },
  { value: 'ft', label: 'ft' },
];

const HIP_UNITS: { value: HipUnit; label: string }[] = [
  { value: 'cm', label: 'cm' },
  { value: 'm', label: 'm' },
  { value: 'in', label: 'in' },
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
  input: BaiInput;
  errors: BaiFieldErrors;
  result: BaiResult | null;
  onChange: (input: BaiInput) => void;
}

export function BaiForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<BaiInput>) => onChange({ ...input, ...patch });

  const changeHeightUnit = (next: HeightUnit) => {
    const raw = parseNumber(input.heightText);
    if (raw !== null && raw > 0) {
      const meters = heightToMeters(raw, input.heightUnit);
      set({
        heightUnit: next,
        heightText: formatField(metersToHeight(meters, next), 4),
      });
      return;
    }
    set({ heightUnit: next });
  };

  const changeHipUnit = (next: HipUnit) => {
    const raw = parseNumber(input.hipText);
    if (raw !== null && raw > 0) {
      const cm = hipToCm(raw, input.hipUnit);
      set({ hipUnit: next, hipText: formatField(cmToHip(cm, next), 4) });
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
      <section className={sectionClass} aria-label="BAI inputs">
        <div>
          <label className={labelClass} htmlFor="bai-height">
            Your height
          </label>
          <FieldShell error={errors.heightText}>
            <input
              id="bai-height"
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
              onChange={(e) => changeHeightUnit(e.target.value as HeightUnit)}
              aria-label="Height unit"
            >
              {HEIGHT_UNITS.map((opt) => (
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

        <div>
          <label className={labelClass} htmlFor="bai-hip">
            Your hip circumference
            <InfoTooltip text="Measure at the widest point of the hips/buttocks. Converted to centimeters before BAI." />
          </label>
          <FieldShell error={errors.hipText}>
            <input
              id="bai-hip"
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
              onChange={(e) => changeHipUnit(e.target.value as HipUnit)}
              aria-label="Hip circumference unit"
            >
              {HIP_UNITS.map((opt) => (
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
      </section>

      <section className={sectionClass} aria-label="BAI result">
        <div>
          <label className={labelClass} htmlFor="bai-result">
            Your body adiposity index (BAI)
          </label>
          <FieldShell muted>
            <input
              id="bai-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedBai ?? ''}
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
