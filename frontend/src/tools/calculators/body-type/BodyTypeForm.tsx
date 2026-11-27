'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { fromInches, parseNumber, toInches } from './calculation';
import type {
  BodyTypeFieldErrors,
  BodyTypeInput,
  BodyTypeResult,
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
  input: BodyTypeInput;
  errors: BodyTypeFieldErrors;
  result: BodyTypeResult | null;
  onChange: (input: BodyTypeInput) => void;
  onCalculate: () => void;
  onClear: () => void;
}

export function BodyTypeForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
}: FormProps) {
  const set = (patch: Partial<BodyTypeInput>) =>
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
      } as Partial<BodyTypeInput>);
      return;
    }
    set({ [unitKey]: next } as Partial<BodyTypeInput>);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate();
      }}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Body type inputs">
        <p className="text-xs text-muted-foreground">
          Apparel body-shape estimate for females. Enter circumferences, then
          Calculate. Not a health diagnosis — waist-hip ratio is shown for
          context.
        </p>

        {(
          [
            ['bust', 'Bust size', 'bustText', 'bustUnit', errors.bustText],
            ['waist', 'Waist size', 'waistText', 'waistUnit', errors.waistText],
            [
              'highHip',
              'High hip size',
              'highHipText',
              'highHipUnit',
              errors.highHipText,
            ],
            ['hip', 'Hip size', 'hipText', 'hipUnit', errors.hipText],
          ] as const
        ).map(([field, label, textKey, unitKey, err]) => (
          <div key={field}>
            <label className={labelClass} htmlFor={`bt-${field}`}>
              {label}
              {field === 'highHip' ? (
                <InfoTooltip text="Upper swell of the hip (~7 in / 18 cm below the natural waist). Used with the 1.193 high-hip/waist cutoff for bottom hourglass vs spoon." />
              ) : null}
            </label>
            <FieldShell error={err}>
              <input
                id={`bt-${field}`}
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input[textKey]}
                onChange={(e) =>
                  set({ [textKey]: e.target.value } as Partial<BodyTypeInput>)
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
            type="submit"
            className="h-11 rounded-xl px-5 text-sm font-semibold"
          >
            Calculate
          </Button>
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
            <p className="text-[13px] font-semibold text-accent">
              {result.statusHeadline}
            </p>
            {result.formattedWhr ? (
              <p className="mt-1 text-sm tabular-nums text-accent">
                Waist-hip ratio: {result.formattedWhr}
              </p>
            ) : null}
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {result.statusDetail} {result.disclaimer}
            </p>
          </div>
        ) : null}
      </section>
    </form>
  );
}
