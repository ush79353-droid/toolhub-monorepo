'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { PROVINCE_TAX_CONFIGS, type ProvinceCode } from './rates';
import type {
  CanadaGstQstFieldErrors,
  CanadaGstQstInput,
  CanadaGstQstResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

interface CanadaGstQstFormProps {
  input: CanadaGstQstInput;
  errors: CanadaGstQstFieldErrors;
  result: CanadaGstQstResult | null;
  onChange: (input: CanadaGstQstInput) => void;
}

export function CanadaGstQstForm({
  input,
  errors,
  result,
  onChange,
}: CanadaGstQstFormProps) {
  const set = (patch: Partial<CanadaGstQstInput>) =>
    onChange({ ...input, ...patch });

  const blurb =
    result?.blurb ??
    PROVINCE_TAX_CONFIGS.find((p) => p.code === input.province)?.blurb ??
    '';

  const previewLines =
    result?.taxLines ??
    (PROVINCE_TAX_CONFIGS.find((p) => p.code === input.province)?.lines.map(
      (line) => ({
        key: line.key,
        label: line.label,
        ratePercentLabel: `${(line.rate * 100).toFixed(
          Number.isInteger(line.rate * 100) ? 0 : line.rate === 0.09975 ? 3 : 1
        )}%`,
        amount: 0,
        formattedAmount: '',
      })
    ) ??
      []);

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <div>
          <label className={labelClass} htmlFor="ca-gst-province">
            <span>Select your province or territory:</span>
          </label>
          <select
            id="ca-gst-province"
            className={selectClass}
            value={input.province}
            onChange={(e) => set({ province: e.target.value as ProvinceCode })}
          >
            {PROVINCE_TAX_CONFIGS.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
          {blurb ? (
            <p className="mt-3 rounded-lg border border-sky-200/80 bg-sky-50/80 px-3 py-2.5 text-[13px] leading-relaxed text-foreground/90">
              {blurb}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ca-gst-before">
            <span>Amount before tax</span>
            <InfoTooltip
              label="Amount before tax"
              text="Enter the taxable purchase amount in Canadian dollars before GST/HST/PST/QST. Fixed CAD — no FX conversion."
            />
          </label>
          <FieldShell error={errors.amountBeforeTax}>
            <span
              className="shrink-0 pl-3 font-mono text-sm text-muted-foreground"
              aria-hidden
            >
              $
            </span>
            <input
              id="ca-gst-before"
              className={`${inputClass} pl-1`}
              inputMode="decimal"
              value={input.amountBeforeTax}
              aria-invalid={Boolean(errors.amountBeforeTax)}
              onChange={(e) => set({ amountBeforeTax: e.target.value })}
            />
          </FieldShell>
          {errors.amountBeforeTax ? (
            <p className="mt-1 text-xs text-rose-600">{errors.amountBeforeTax}</p>
          ) : null}
        </div>

        {previewLines.map((line) => {
          const matched = result?.taxLines.find((t) => t.key === line.key);
          const rateLabel = matched?.ratePercentLabel ?? line.ratePercentLabel;
          return (
            <div key={line.key}>
              <label className={labelClass} htmlFor={`ca-gst-line-${line.key}`}>
                <span>
                  {line.label} ({rateLabel})
                </span>
                <InfoTooltip
                  label={`${line.label} (${rateLabel})`}
                  text="Calculated tax component for the selected province. Read-only."
                />
              </label>
              <FieldShell muted>
                <span
                  className="shrink-0 pl-3 font-mono text-sm text-muted-foreground"
                  aria-hidden
                >
                  $
                </span>
                <input
                  id={`ca-gst-line-${line.key}`}
                  className={`${inputClass} pl-1 text-accent`}
                  readOnly
                  tabIndex={-1}
                  value={matched?.formattedAmount ?? ''}
                  aria-live="polite"
                />
              </FieldShell>
            </div>
          );
        })}

        <div>
          <label className={labelClass} htmlFor="ca-gst-after">
            <span>Amount after tax</span>
            <InfoTooltip
              label="Amount after tax"
              text="Amount before tax plus all applicable tax components for the selected province."
            />
          </label>
          <FieldShell muted>
            <span
              className="shrink-0 pl-3 font-mono text-sm text-muted-foreground"
              aria-hidden
            >
              $
            </span>
            <input
              id="ca-gst-after"
              className={`${inputClass} pl-1 text-accent`}
              readOnly
              tabIndex={-1}
              value={result?.formattedAfter ?? ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
