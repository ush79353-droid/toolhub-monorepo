'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AdrenalWashoutFieldErrors,
  AdrenalWashoutInput,
  AdrenalWashoutResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';

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
  input: AdrenalWashoutInput;
  errors: AdrenalWashoutFieldErrors;
  result: AdrenalWashoutResult | null;
  onChange: (input: AdrenalWashoutInput) => void;
}

export function AdrenalWashoutForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<AdrenalWashoutInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Adrenal washout inputs">
        <div>
          <label className={labelClass} htmlFor="adrenal-pre-contrast">
            Pre-contrast
            <InfoTooltip text="HU (Hounsfield Unit) is a relative quantitative measurement of radio density used in the interpretation of CT images." />
          </label>
          <FieldShell error={errors.preContrastHuText}>
            <input
              id="adrenal-pre-contrast"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.preContrastHuText}
              onChange={(e) => set({ preContrastHuText: e.target.value })}
              aria-invalid={Boolean(errors.preContrastHuText)}
            />
            <span className={unitFixed}>HU</span>
          </FieldShell>
          {errors.preContrastHuText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.preContrastHuText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="adrenal-enhanced">
            60-75 sec post-contrast
            <InfoTooltip text="Portal venous / early enhanced-phase attenuation of the adrenal lesion in HU (typically 60–75 seconds after contrast)." />
          </label>
          <FieldShell error={errors.enhancedHuText}>
            <input
              id="adrenal-enhanced"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.enhancedHuText}
              onChange={(e) => set({ enhancedHuText: e.target.value })}
              aria-invalid={Boolean(errors.enhancedHuText)}
            />
            <span className={unitFixed}>HU</span>
          </FieldShell>
          {errors.enhancedHuText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.enhancedHuText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="adrenal-delayed">
            15 min delayed
            <InfoTooltip text="Fifteen-minute delayed-phase attenuation of the adrenal lesion in HU." />
          </label>
          <FieldShell error={errors.delayedHuText}>
            <input
              id="adrenal-delayed"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.delayedHuText}
              onChange={(e) => set({ delayedHuText: e.target.value })}
              aria-invalid={Boolean(errors.delayedHuText)}
            />
            <span className={unitFixed}>HU</span>
          </FieldShell>
          {errors.delayedHuText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.delayedHuText}</p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-label="Adrenal washout results">
        <div>
          <label className={labelClass} htmlFor="adrenal-absolute">
            Absolute washout
          </label>
          <FieldShell muted>
            <input
              id="adrenal-absolute"
              type="text"
              readOnly
              className={inputClass}
              value={result?.formattedAbsolute ?? ''}
              aria-readonly="true"
            />
            <span className={unitFixed}>%</span>
          </FieldShell>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {result?.absoluteInterpretation ??
              'An absolute washout higher than 60% is strongly suggestive of adrenal adenoma.'}
          </p>
        </div>

        <div>
          <label className={labelClass} htmlFor="adrenal-relative">
            Relative washout
          </label>
          <FieldShell muted>
            <input
              id="adrenal-relative"
              type="text"
              readOnly
              className={inputClass}
              value={result?.formattedRelative ?? ''}
              aria-readonly="true"
            />
            <span className={unitFixed}>%</span>
          </FieldShell>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {result?.relativeInterpretation ??
              'Relative washout higher than 40% is strongly suggestive of adrenal adenoma.'}
          </p>
        </div>
      </section>
    </form>
  );
}
