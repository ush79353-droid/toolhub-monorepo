'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatProduct } from './calculation';
import type {
  RatePressureProductFieldErrors,
  RatePressureProductInput,
  RatePressureProductResult,
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
            ? 'border-border bg-muted/40'
            : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

interface FormProps {
  input: RatePressureProductInput;
  errors: RatePressureProductFieldErrors;
  result: RatePressureProductResult | null;
  onChange: (input: RatePressureProductInput) => void;
}

export function RatePressureProductForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<RatePressureProductInput>) =>
    onChange({ ...input, ...patch });

  const productDisplay =
    result?.product != null ? formatProduct(result.product) : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-accent">
        <p className="font-semibold text-amber-950">
          Educational rate-pressure product — not a clinical stress-test report
        </p>
        <p className="mt-1.5 text-foreground/85">
          Use maximum heart rate and maximum systolic BP from the same exercise
          stage. Values stay in your browser; share uses the page URL only.
        </p>
      </div>

      <section className={sectionClass} aria-label="Rate-pressure product inputs">
        <div>
          <label className={labelClass} htmlFor="rpp-hr">
            Max heart rate (HR)
          </label>
          <FieldShell error={errors.heartRateText}>
            <input
              id="rpp-hr"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.heartRateText}
              onChange={(e) => set({ heartRateText: e.target.value })}
              aria-invalid={Boolean(errors.heartRateText)}
            />
            <span className={unitFixed}>beats/minute</span>
          </FieldShell>
          {errors.heartRateText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heartRateText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="rpp-sbp">
            Max systolic blood pressure (SBP)
            <InfoTooltip text="Peak systolic BP at the same exercise stage as the recorded heart rate." />
          </label>
          <FieldShell error={errors.systolicBpText}>
            <input
              id="rpp-sbp"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.systolicBpText}
              onChange={(e) => set({ systolicBpText: e.target.value })}
              aria-invalid={Boolean(errors.systolicBpText)}
            />
            <span className={unitFixed}>mmHg</span>
          </FieldShell>
          {errors.systolicBpText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.systolicBpText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="rpp-product">
            Rate-pressure product
          </label>
          <FieldShell muted>
            <input
              id="rpp-product"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={productDisplay}
              aria-live="polite"
              placeholder="—"
            />
            <span className={unitFixed}>bpm·mmHg</span>
          </FieldShell>
          {result?.statusDetail ? (
            <p className="mt-1.5 text-xs text-muted-foreground">
              {result.statusDetail}
            </p>
          ) : null}
        </div>
      </section>
    </form>
  );
}
