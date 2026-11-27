'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  mgPerDlToTriglycerides,
  parseNumber,
  triglyceridesToMgPerDl,
} from './calculation';
import type {
  SodiumChangeFieldErrors,
  SodiumChangeInput,
  SodiumChangeResult,
  TriglycerideUnit,
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

function formatField(value: number): string {
  if (!Number.isFinite(value)) return '';
  return String(Number(value.toFixed(4)));
}

interface FormProps {
  input: SodiumChangeInput;
  errors: SodiumChangeFieldErrors;
  result: SodiumChangeResult | null;
  onChange: (input: SodiumChangeInput) => void;
}

export function SodiumChangeForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<SodiumChangeInput>) =>
    onChange({ ...input, ...patch });

  const changeTgUnit = (next: TriglycerideUnit) => {
    const raw = parseNumber(input.triglyceridesText);
    if (raw !== null && raw > 0) {
      const mgDl = triglyceridesToMgPerDl(raw, input.triglycerideUnit);
      set({
        triglycerideUnit: next,
        triglyceridesText: formatField(mgPerDlToTriglycerides(mgDl, next)),
      });
      return;
    }
    set({ triglycerideUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Sodium change inputs">
        <div>
          <label className={labelClass} htmlFor="na-change-measured">
            Measured serum sodium
            <InfoTooltip text="Laboratory sodium from an indirect ion-selective electrode report (mEq/L ≡ mmol/L)." />
          </label>
          <FieldShell error={errors.measuredSodiumText}>
            <input
              id="na-change-measured"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.measuredSodiumText}
              onChange={(e) => set({ measuredSodiumText: e.target.value })}
              aria-invalid={Boolean(errors.measuredSodiumText)}
            />
            <span className={unitFixed}>mEq/L</span>
          </FieldShell>
          {errors.measuredSodiumText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.measuredSodiumText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="na-change-tg">
            Serum triglycerides
            <InfoTooltip text="Converted to mg/dL before ΔNa = TG × 0.002. mmol/L uses ×88.57." />
          </label>
          <FieldShell error={errors.triglyceridesText}>
            <input
              id="na-change-tg"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.triglyceridesText}
              onChange={(e) => set({ triglyceridesText: e.target.value })}
              aria-invalid={Boolean(errors.triglyceridesText)}
            />
            <select
              className={unitSelectClass}
              aria-label="Triglyceride unit"
              value={input.triglycerideUnit}
              onChange={(e) =>
                changeTgUnit(e.target.value as TriglycerideUnit)
              }
            >
              <option value="mg/dL">mg/dL</option>
              <option value="mmol/L">mmol/L</option>
            </select>
          </FieldShell>
          {errors.triglyceridesText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.triglyceridesText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="na-change-delta">
            Sodium change
          </label>
          <FieldShell muted>
            <input
              id="na-change-delta"
              type="text"
              readOnly
              className={inputClass}
              value={result?.formattedChange ?? ''}
              aria-readonly="true"
            />
            <span className={unitFixed}>mEq/L</span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="na-change-corrected">
            Corrected serum sodium
          </label>
          <FieldShell muted>
            <input
              id="na-change-corrected"
              type="text"
              readOnly
              className={inputClass}
              value={result?.formattedCorrected ?? ''}
              aria-readonly="true"
            />
            <span className={unitFixed}>mEq/L</span>
          </FieldShell>
        </div>

        {result?.statusHeadline ? (
          <div className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm text-accent">
            <p className="font-semibold">{result.statusHeadline}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {result.statusDetail}
            </p>
          </div>
        ) : null}
      </section>
    </form>
  );
}
