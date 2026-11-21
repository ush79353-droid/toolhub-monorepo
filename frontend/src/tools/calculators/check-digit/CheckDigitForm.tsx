'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  BarcodeFormatOption,
  CheckDigitFieldErrors,
  CheckDigitInput,
  CheckDigitMode,
  CheckDigitResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
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

interface CheckDigitFormProps {
  input: CheckDigitInput;
  errors: CheckDigitFieldErrors;
  result: CheckDigitResult | null;
  onChange: (input: CheckDigitInput) => void;
  onLoadExample: () => void;
}

export function CheckDigitForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: CheckDigitFormProps) {
  const set = (patch: Partial<CheckDigitInput>) =>
    onChange({ ...input, ...patch });
  const isValidate = input.mode === 'validate';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        GS1 Modulo 10 check digits for GTIN-8, GTIN-12 (UPC-A), GTIN-13
 (EAN-13), and GTIN-14. Leading zeros are part of the identifier; 
        treated as digits, never dropped. A valid checksum does not prove
        registration.
      </p>

      <div>
        <label htmlFor="cd-mode" className={labelClass}>
          Mode
        </label>
        <select
          id="cd-mode"
          className={selectClass}
          value={input.mode}
          onChange={(e) => set({ mode: e.target.value as CheckDigitMode })}
        >
          <option value="generate">Generate check digit</option>
          <option value="validate">Validate existing barcode</option>
        </select>
      </div>

      <div>
        <label htmlFor="cd-format" className={labelClass}>
          Barcode format
          <InfoTooltip
            label="Barcode format"
            text="Automatic infers the format from digit length when it uniquely matches a supported GTIN. Choose a format to enforce an exact payload or total length."
          />
        </label>
        <select
          id="cd-format"
          className={selectClass}
          value={input.format}
          onChange={(e) =>
            set({ format: e.target.value as BarcodeFormatOption })
          }
        >
          <option value="auto">Automatic</option>
          <option value="GTIN-8">GTIN-8 / EAN-8</option>
          <option value="GTIN-12">GTIN-12 / UPC-A</option>
          <option value="GTIN-13">GTIN-13 / EAN-13</option>
          <option value="GTIN-14">GTIN-14</option>
        </select>
        {errors.format ? (
          <p className="mt-1 text-xs text-rose-600">{errors.format}</p>
        ) : null}
      </div>

      {!isValidate ? (
        <button
          type="button"
          onClick={onLoadExample}
          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (EAN-13 · 400638133393 → check digit 1)
        </button>
      ) : null}

      {isValidate ? (
        <div>
          <label htmlFor="cd-complete" className={labelClass}>
            Complete GTIN
            <InfoTooltip
              label="Complete GTIN"
              text="Paste the full identifier including its final check digit. Spaces are ignored."
            />
          </label>
          <FieldShell error={errors.completeCode}>
            <input
              id="cd-complete"
              className={inputClass}
              inputMode="numeric"
              autoComplete="off"
              spellCheck={false}
              value={input.completeCode}
              onChange={(e) => set({ completeCode: e.target.value })}
              placeholder="4006381333931"
              aria-invalid={Boolean(errors.completeCode)}
            />
          </FieldShell>
          {errors.completeCode ? (
            <p className="mt-1 text-xs text-rose-600">{errors.completeCode}</p>
          ) : null}
        </div>
      ) : (
        <>
          <div>
            <label htmlFor="cd-zeros" className={labelClass}>
              Number of leading zeros
              <InfoTooltip
                label="Number of leading zeros"
                text="Leading zeros are characters in the barcode payload. They are included in the Modulo 10 calculation and never stripped."
              />
            </label>
            <select
              id="cd-zeros"
              className={selectClass}
              value={input.leadingZeros}
              onChange={(e) => set({ leadingZeros: e.target.value })}
            >
              {Array.from({ length: 14 }, (_, i) => (
                <option key={i} value={String(i)}>
                  {i}
                </option>
              ))}
            </select>
            {errors.leadingZeros ? (
              <p className="mt-1 text-xs text-rose-600">{errors.leadingZeros}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="cd-code" className={labelClass}>
              Code (without check digit or leading zeros)
              <InfoTooltip
                label="Code"
                text="Enter the numeric payload excluding the check digit. Add leading zeros with the selector above rather than typing them here unless they are already part of your digit string."
              />
            </label>
            <FieldShell error={errors.code}>
              <input
                id="cd-code"
                className={inputClass}
                inputMode="numeric"
                autoComplete="off"
                spellCheck={false}
                value={input.code}
                onChange={(e) => set({ code: e.target.value })}
                placeholder="400638133393"
                aria-invalid={Boolean(errors.code)}
              />
            </FieldShell>
            {errors.code ? (
              <p className="mt-1 text-xs text-rose-600">{errors.code}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="cd-check" className={labelClass}>
              Check Digit
            </label>
            <FieldShell muted>
              <input
                id="cd-check"
                className={inputClass}
                readOnly
                aria-readonly
                value={result?.checkDigit ?? ''}
                placeholder="—"
              />
            </FieldShell>
          </div>

          <div>
            <label htmlFor="cd-gtin" className={labelClass}>
              Complete GTIN
            </label>
            <FieldShell muted>
              <input
                id="cd-gtin"
                className={`${inputClass} font-mono`}
                readOnly
                aria-readonly
                value={result?.completeGTIN ?? ''}
                placeholder="—"
              />
            </FieldShell>
          </div>
        </>
      )}

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
