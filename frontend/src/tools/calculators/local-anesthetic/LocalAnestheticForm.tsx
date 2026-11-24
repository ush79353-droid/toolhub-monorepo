'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { DRUG_LIMITS, limitFor } from './labeling-data';
import type {
  LocalAnestheticFieldErrors,
  LocalAnestheticInput,
  LocalAnestheticResult,
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
  input: LocalAnestheticInput;
  errors: LocalAnestheticFieldErrors;
  result: LocalAnestheticResult | null;
  onChange: (input: LocalAnestheticInput) => void;
}

export function LocalAnestheticForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const lim = limitFor(input.drug);
  const set = (patch: Partial<LocalAnestheticInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-muted-foreground">
        Determine the maximum allowable subcutaneous dose of anesthetic{' '}
        <strong>without epinephrine</strong>.
      </p>
      <section className={sectionClass} aria-label="Local anesthetic inputs">
        <fieldset className="space-y-2">
          <legend className={labelClass}>Drug</legend>
          {DRUG_LIMITS.map((d) => (
            <label key={d.id} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="la-drug"
                checked={input.drug === d.id}
                onChange={() =>
                  set({
                    drug: d.id,
                    concentrationPercentText: String(d.defaultConcentrationPercent),
                  })
                }
              />
              {d.label}
            </label>
          ))}
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="la-weight">
            Weight
            <InfoTooltip text="Body weight used for mg/kg ceilings when defined for the drug." />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.weightText}>
              <input
                id="la-weight"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.weightText}
                onChange={(e) => set({ weightText: e.target.value })}
              />
            </FieldShell>
            <select
              className="h-11 rounded-lg border border-border bg-white px-2 text-sm"
              value={input.weightUnit}
              onChange={(e) =>
                set({ weightUnit: e.target.value as 'kg' | 'lb' })
              }
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
          {errors.weightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="la-conc">
            Concentration
          </label>
          <select
            id="la-conc"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm"
            value={input.concentrationPercentText}
            onChange={(e) => set({ concentrationPercentText: e.target.value })}
          >
            {lim.concentrationsPercent.map((c) => (
              <option key={c} value={String(c)}>
                {c}%
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="la-ml">
            Maximum allowable subQ dose in ml
            <InfoTooltip text="max mg ÷ (concentration% × 10 mg/mL per %)." />
          </label>
          <FieldShell muted>
            <input
              id="la-ml"
              readOnly
              className={inputClass}
              value={result?.formattedMaxDoseMl ?? ''}
            />
            <span className={unitFixed}>mL</span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="la-mg">
            Maximum allowable subQ dose in mg
          </label>
          <FieldShell muted>
            <input
              id="la-mg"
              readOnly
              className={inputClass}
              value={result?.formattedMaxDoseMg ?? ''}
            />
            <span className={unitFixed}>mg</span>
          </FieldShell>
        </div>

        {result?.warningNote ? (
          <p className="text-sm text-rose-700" role="status">
            {result.warningNote}
          </p>
        ) : null}
      </section>
    </form>
  );
}
