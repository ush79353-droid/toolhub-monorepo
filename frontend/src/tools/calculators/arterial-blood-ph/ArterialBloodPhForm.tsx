'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { paco2ToMmHg, mmHgToPaco2, parseNumber } from './calculation';
import type {
  ArterialBloodPhFieldErrors,
  ArterialBloodPhInput,
  ArterialBloodPhResult,
  Paco2Unit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-primary';
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
  input: ArterialBloodPhInput;
  errors: ArterialBloodPhFieldErrors;
  result: ArterialBloodPhResult | null;
  onChange: (input: ArterialBloodPhInput) => void;
}

export function ArterialBloodPhForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<ArterialBloodPhInput>) =>
    onChange({ ...input, ...patch });

  const changePaco2Unit = (next: Paco2Unit) => {
    const raw = parseNumber(input.paco2Text);
    if (raw !== null && raw > 0) {
      const mmHg = paco2ToMmHg(raw, input.paco2Unit);
      set({
        paco2Unit: next,
        paco2Text: formatField(mmHgToPaco2(mmHg, next), 4),
      });
      return;
    }
    set({ paco2Unit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Arterial blood pH inputs">
        <div>
          <label className={labelClass} htmlFor="abph-hco3">
            Bicarbonate (HCO₃⁻)
            <InfoTooltip text="Plasma bicarbonate concentration used in the Henderson–Hasselbalch equation." />
          </label>
          <FieldShell error={errors.bicarbonateText}>
            <input
              id="abph-hco3"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.bicarbonateText}
              onChange={(e) => set({ bicarbonateText: e.target.value })}
              aria-invalid={Boolean(errors.bicarbonateText)}
            />
            <span className={unitFixed}>mEq/L</span>
          </FieldShell>
          {errors.bicarbonateText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.bicarbonateText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="abph-paco2">
            Carbon dioxide partial pressure (PaCO₂)
            <InfoTooltip text="Arterial PaCO₂. Converted to mmHg before applying the solubility coefficient 0.0308." />
          </label>
          <FieldShell error={errors.paco2Text}>
            <input
              id="abph-paco2"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.paco2Text}
              onChange={(e) => set({ paco2Text: e.target.value })}
              aria-invalid={Boolean(errors.paco2Text)}
            />
            <select
              className={unitSelectClass}
              value={input.paco2Unit}
              onChange={(e) => changePaco2Unit(e.target.value as Paco2Unit)}
              aria-label="PaCO₂ unit"
            >
              <option value="mmHg">mmHg</option>
              <option value="kPa">kPa</option>
            </select>
          </FieldShell>
          {errors.paco2Text ? (
            <p className="mt-1 text-xs text-rose-600">{errors.paco2Text}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="abph-result">
            Arterial blood pH
            <InfoTooltip text="pH = 6.1 + log₁₀(HCO₃ / (0.0308 × PaCO₂ mmHg))." />
          </label>
          <FieldShell muted>
            <input
              id="abph-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedPh ?? ''}
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
