'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMme } from './calculation';
import {
  MME_OPIOID_OPTIONS,
  opioidOption,
  unitForOpioid,
  type MmeDoseUnit,
  type MmeFieldErrors,
  type MmeInput,
  type MmeOpioidId,
  type MmeResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-primary';
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
  input: MmeInput;
  errors: MmeFieldErrors;
  result: MmeResult | null;
  onChange: (input: MmeInput) => void;
}

export function MmeForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<MmeInput>) => onChange({ ...input, ...patch });
  const option = opioidOption(input.opioidId);
  const isFentanyl = option.doseBasis === 'mcg_per_hr';
  const mmeText = result?.mme != null ? formatMme(result.mme) : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="MME inputs">
        <h3 className="text-[15px] font-semibold text-accent">
          Morphine milligram equivalents
        </h3>

        <div>
          <label className={labelClass} htmlFor="mme-opioid">
            Opioid
            <InfoTooltip text="CDC 2022 MME table agents only. Buprenorphine and other formulations without a published CDC factor are not listed." />
          </label>
          <select
            id="mme-opioid"
            className={selectClass}
            value={input.opioidId}
            onChange={(e) => {
              const opioidId = e.target.value as MmeOpioidId;
              set({
                opioidId,
                doseUnit: unitForOpioid(opioidId, input.doseUnit),
              });
            }}
            aria-invalid={Boolean(errors.opioidId)}
          >
            {MME_OPIOID_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.opioidId ? (
            <p className="mt-1 text-xs text-rose-600">{errors.opioidId}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mme-dose">
            Dose
            <InfoTooltip
              text={
                isFentanyl
                  ? 'Transdermal fentanyl is entered as the patch rate in mcg/hr (CDC table), not mg/day.'
                  : 'Enter total daily amount. Choose mg or mcg; mcg is converted to mg before applying the CDC factor (1 mg = 1000 mcg).'
              }
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.doseText}>
              <input
                id="mme-dose"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.doseText}
                onChange={(e) => set({ doseText: e.target.value })}
                aria-invalid={Boolean(errors.doseText)}
              />
              {isFentanyl ? (
                <span className={unitFixed}>mcg/hr</span>
              ) : (
                <span className={unitFixed}>/ day</span>
              )}
            </FieldShell>
            {!isFentanyl ? (
              <select
                className="h-11 rounded-lg border border-border bg-white px-2 text-sm"
                value={input.doseUnit === 'mcg' ? 'mcg' : 'mg'}
                onChange={(e) =>
                  set({ doseUnit: e.target.value as MmeDoseUnit })
                }
                aria-label="Dose unit"
                aria-invalid={Boolean(errors.doseUnit)}
              >
                <option value="mg">mg</option>
                <option value="mcg">mcg</option>
              </select>
            ) : null}
          </div>
          {errors.doseText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.doseText}</p>
          ) : null}
          {errors.doseUnit ? (
            <p className="mt-1 text-xs text-rose-600">{errors.doseUnit}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mme-result">
            Morphine equivalents
            <InfoTooltip text="MME/day = daily dose × CDC conversion factor. Do not use MME to choose a replacement opioid dose." />
          </label>
          <FieldShell muted>
            <input
              id="mme-result"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-accent`}
              value={mmeText}
              aria-live="polite"
            />
            <span className={unitFixed}>MME</span>
          </FieldShell>
        </div>

        {result?.statusDetail ? (
          <p className="text-xs text-muted-foreground">{result.statusDetail}</p>
        ) : null}
      </section>
    </form>
  );
}
