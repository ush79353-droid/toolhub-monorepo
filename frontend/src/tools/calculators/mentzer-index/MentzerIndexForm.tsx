'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  MentzerIndexFieldErrors,
  MentzerIndexInput,
  MentzerIndexResult,
  RbcCountUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';

const RBC_UNIT_OPTIONS: { value: RbcCountUnit; label: string }[] = [
  { value: 'million_per_mm3', label: 'million/mm³' },
  { value: 'million_per_ul', label: 'million/µL' },
  { value: 'x10e12_per_l', label: '×10¹²/L' },
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
  input: MentzerIndexInput;
  errors: MentzerIndexFieldErrors;
  result: MentzerIndexResult | null;
  onChange: (input: MentzerIndexInput) => void;
}

export function MentzerIndexForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<MentzerIndexInput>) =>
    onChange({ ...input, ...patch });

  const indexDisplay = result?.formattedIndex ?? '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Mentzer index inputs">
        <div>
          <label className={labelClass} htmlFor="mentzer-mcv">
            Mean corpuscular volume (MCV)
            <InfoTooltip text="Mean corpuscular volume from the CBC, in femtoliters (fL)." />
          </label>
          <FieldShell error={errors.mcvFlText}>
            <input
              id="mentzer-mcv"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.mcvFlText}
              onChange={(e) => set({ mcvFlText: e.target.value })}
              aria-invalid={Boolean(errors.mcvFlText)}
            />
            <span className={unitFixed}>fl</span>
          </FieldShell>
          {errors.mcvFlText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.mcvFlText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mentzer-rbc">
            Red blood cell count (RBC)
            <InfoTooltip text="RBC count in millions per mm³ (≡ millions/µL ≡ ×10¹²/L). Mentzer uses this million-scale denominator." />
          </label>
          <FieldShell error={errors.rbcText}>
            <input
              id="mentzer-rbc"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.rbcText}
              onChange={(e) => set({ rbcText: e.target.value })}
              aria-invalid={Boolean(errors.rbcText)}
            />
            <select
              className={unitSelectClass}
              value={input.rbcUnit}
              onChange={(e) =>
                set({ rbcUnit: e.target.value as RbcCountUnit })
              }
              aria-label="RBC unit"
            >
              {RBC_UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.rbcText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.rbcText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mentzer-index">
            Mentzer index
            <InfoTooltip text="MCV (fL) ÷ RBC (millions/µL). Blank until both values are entered." />
          </label>
          <FieldShell muted>
            <input
              id="mentzer-index"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={indexDisplay}
              aria-live="polite"
              aria-readonly="true"
            />
          </FieldShell>
          {result?.index != null && result.statusDetail ? (
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {result.statusDetail}
            </p>
          ) : null}
        </div>
      </section>
    </form>
  );
}
