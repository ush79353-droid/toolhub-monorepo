'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  BodyFrameSizeFieldErrors,
  BodyFrameSizeInput,
  BodyFrameSizeResult,
  HeightUnit,
  LengthUnit,
  Sex,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

const HEIGHT_UNITS: { value: HeightUnit; label: string }[] = [
  { value: 'm', label: 'm' },
  { value: 'cm', label: 'cm' },
  { value: 'in', label: 'in' },
  { value: 'ft', label: 'ft' },
];

const WRIST_UNITS: { value: LengthUnit; label: string }[] = [
  { value: 'cm', label: 'cm' },
  { value: 'in', label: 'in' },
  { value: 'mm', label: 'mm' },
  { value: 'm', label: 'm' },
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

interface FormProps {
  input: BodyFrameSizeInput;
  errors: BodyFrameSizeFieldErrors;
  result: BodyFrameSizeResult | null;
  onChange: (input: BodyFrameSizeInput) => void;
}

export function BodyFrameSizeForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<BodyFrameSizeInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Body frame size inputs">
        <fieldset>
          <legend className={labelClass}>Sex</legend>
          <div className="flex flex-wrap gap-4 pt-1">
            {(
              [
                { value: 'female', label: 'Female' },
                { value: 'male', label: 'Male' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="bfs-sex"
                  checked={input.sex === opt.value}
                  onChange={() => set({ sex: opt.value as Sex })}
                  className="h-4 w-4 accent-primary"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="bfs-height">
            Height
            <InfoTooltip text="Standing height without shoes. Converted to cm before the height÷wrist index." />
          </label>
          <FieldShell error={errors.heightText}>
            <input
              id="bfs-height"
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
              onChange={(e) =>
                set({ heightUnit: e.target.value as HeightUnit })
              }
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
          <label className={labelClass} htmlFor="bfs-wrist">
            Wrist circumference
            <InfoTooltip text="Measure the narrowest part of the wrist, snug but not compressing the skin." />
          </label>
          <FieldShell error={errors.wristText}>
            <input
              id="bfs-wrist"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.wristText}
              onChange={(e) => set({ wristText: e.target.value })}
              aria-invalid={Boolean(errors.wristText)}
            />
            <select
              className={unitSelectClass}
              value={input.wristUnit}
              onChange={(e) =>
                set({ wristUnit: e.target.value as LengthUnit })
              }
              aria-label="Wrist circumference unit"
            >
              {WRIST_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.wristText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.wristText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bfs-index">
            Body frame size index
            <InfoTooltip text="Height ÷ wrist (same unit). Compared with sex-specific small/medium/large bands." />
          </label>
          <FieldShell muted>
            <input
              id="bfs-index"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedIndex ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
          </FieldShell>
        </div>

        {result?.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.statusDetail} {result.disclaimer}
          </p>
        ) : null}
      </section>
    </form>
  );
}
