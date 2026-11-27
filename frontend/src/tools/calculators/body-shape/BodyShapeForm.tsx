'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { fromInches, parseNumber, toInches } from '../body-type/calculation';
import type {
  BodyShapeFieldErrors,
  BodyShapeInput,
  BodyShapeResult,
  LengthUnit,
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
  { value: 'in', label: 'in' },
];

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

function formatLength(value: number): string {
  if (!Number.isFinite(value)) return '';
  return String(Number(value.toFixed(4)));
}

interface FormProps {
  input: BodyShapeInput;
  errors: BodyShapeFieldErrors;
  result: BodyShapeResult | null;
  onChange: (input: BodyShapeInput) => void;
  onClear: () => void;
}

export function BodyShapeForm({
  input,
  errors,
  result,
  onChange,
  onClear,
}: FormProps) {
  const set = (patch: Partial<BodyShapeInput>) =>
    onChange({ ...input, ...patch });

  const switchUnit = (
    field: 'bust' | 'waist' | 'highHip' | 'hip',
    next: LengthUnit,
  ) => {
    const textKey = `${field}Text` as const;
    const unitKey = `${field}Unit` as const;
    const currentUnit = input[unitKey];
    if (next === currentUnit) return;
    const raw = parseNumber(input[textKey]);
    if (raw != null && raw > 0) {
      const inches = toInches(raw, currentUnit);
      set({
        [unitKey]: next,
        [textKey]: formatLength(fromInches(inches, next)),
      } as Partial<BodyShapeInput>);
      return;
    }
    set({ [unitKey]: next } as Partial<BodyShapeInput>);
  };

  return (
    <div className="space-y-4">
      <section className={sectionClass} aria-label="Body shape inputs">
        <p className="text-xs text-muted-foreground">
          Enter bust, waist, high hip, and hip circumferences. Result updates
          when all measurements are valid. Educational apparel label only.
        </p>

        {(
          [
            ['bust', 'Bust', 'bustText', 'bustUnit', errors.bustText],
            ['waist', 'Waist', 'waistText', 'waistUnit', errors.waistText],
            [
              'highHip',
              'High hip',
              'highHipText',
              'highHipUnit',
              errors.highHipText,
            ],
            ['hip', 'Hips', 'hipText', 'hipUnit', errors.hipText],
          ] as const
        ).map(([field, label, textKey, unitKey, err]) => (
          <div key={field}>
            <label className={labelClass} htmlFor={`bs-${field}`}>
              {label}
              {field === 'highHip' ? (
                <InfoTooltip text="Upper swell of the hip (~7 in / 18 cm below the natural waist). Used with the 1.193 high-hip/waist cutoff for bottom hourglass vs spoon." />
              ) : null}
            </label>
            <FieldShell error={err}>
              <input
                id={`bs-${field}`}
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input[textKey]}
                onChange={(e) =>
                  set({ [textKey]: e.target.value } as Partial<BodyShapeInput>)
                }
                aria-invalid={Boolean(err)}
              />
              <select
                className={unitSelectClass}
                value={input[unitKey]}
                onChange={(e) =>
                  switchUnit(field, e.target.value as LengthUnit)
                }
                aria-label={`${label} unit`}
              >
                {LENGTH_UNITS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FieldShell>
            {err ? <p className="mt-1 text-xs text-rose-600">{err}</p> : null}
          </div>
        ))}

        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl border-border px-5 text-sm font-semibold text-accent"
            onClick={onClear}
          >
            Clear
          </Button>
        </div>

        {result ? (
          <div
            className="rounded-lg border border-sky-200 bg-sky-50/60 px-3.5 py-3"
            aria-live="polite"
          >
            <p className="text-[15px] font-semibold text-accent">
              {result.resultHeadline}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {result.disclaimer}
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}