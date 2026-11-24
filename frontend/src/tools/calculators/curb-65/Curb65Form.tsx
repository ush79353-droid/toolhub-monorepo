'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  bunToUreaMmol,
  formatScore,
  parseNumber,
  ureaMmolToDisplay,
} from './calculation';
import type {
  BunUnit,
  Curb65FieldErrors,
  Curb65Input,
  Curb65Result,
  YesNo,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';
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

interface FormProps {
  input: Curb65Input;
  errors: Curb65FieldErrors;
  result: Curb65Result | null;
  onChange: (input: Curb65Input) => void;
}

export function Curb65Form({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<Curb65Input>) => onChange({ ...input, ...patch });

  const switchBunUnit = (next: BunUnit) => {
    if (next === input.bunUnit) return;
    const n = parseNumber(input.bunText);
    if (n === null) {
      set({ bunUnit: next });
      return;
    }
    const mmol = bunToUreaMmol(n, input.bunUnit);
    const converted = ureaMmolToDisplay(mmol, next);
    set({
      bunUnit: next,
      bunText: new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 4,
        useGrouping: false,
      }).format(converted),
    });
  };

  const scoreDisplay =
    result?.score != null ? formatScore(result.score) : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="CURB-65 inputs">
        <div>
          <div className={labelClass}>
            Confusion?
            <InfoTooltip text="New confusion attributable to pneumonia (mental status change)." />
          </div>
          <div className="flex flex-wrap gap-4" role="radiogroup" aria-label="Confusion">
            {(
              [
                ['yes', 'Yes'],
                ['no', 'No'],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="curb65-confusion"
                  checked={input.confusion === value}
                  onChange={() => set({ confusion: value as YesNo })}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="curb65-bun">
            Blood urea nitrogen
            <InfoTooltip text="Urea point when urea > 7 mmol/L (BUN > 19.6 mg/dL). Switch between BUN mg/dL and urea mmol/L." />
          </label>
          <FieldShell error={errors.bunText}>
            <input
              id="curb65-bun"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.bunText}
              onChange={(e) => set({ bunText: e.target.value })}
              aria-invalid={Boolean(errors.bunText)}
            />
            <select
              className={unitSelectClass}
              value={input.bunUnit}
              onChange={(e) => switchBunUnit(e.target.value as BunUnit)}
              aria-label="BUN unit"
            >
              <option value="mg_dl_bun">mg/dL</option>
              <option value="mmol_l_urea">mmol/L urea</option>
            </select>
          </FieldShell>
          {errors.bunText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.bunText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="curb65-rr">
            Respiratory rate
            <InfoTooltip text="One point if ≥ 30 breaths per minute." />
          </label>
          <FieldShell error={errors.respiratoryRateText}>
            <input
              id="curb65-rr"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.respiratoryRateText}
              onChange={(e) => set({ respiratoryRateText: e.target.value })}
              aria-invalid={Boolean(errors.respiratoryRateText)}
            />
            <span className={unitFixed}>/ min</span>
          </FieldShell>
          {errors.respiratoryRateText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.respiratoryRateText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="curb65-sbp">
            Systolic blood pressure
            <InfoTooltip text="BP point if SBP &lt; 90 mmHg (counts once with diastolic)." />
          </label>
          <FieldShell error={errors.systolicBpText}>
            <input
              id="curb65-sbp"
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
          <label className={labelClass} htmlFor="curb65-dbp">
            Diastolic blood pressure
            <InfoTooltip text="BP point if DBP ≤ 60 mmHg (counts once with systolic)." />
          </label>
          <FieldShell error={errors.diastolicBpText}>
            <input
              id="curb65-dbp"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.diastolicBpText}
              onChange={(e) => set({ diastolicBpText: e.target.value })}
              aria-invalid={Boolean(errors.diastolicBpText)}
            />
            <span className={unitFixed}>mmHg</span>
          </FieldShell>
          {errors.diastolicBpText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.diastolicBpText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="curb65-age">
            Age
            <InfoTooltip text="One point if age ≥ 65 years." />
          </label>
          <FieldShell error={errors.ageText}>
            <input
              id="curb65-age"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.ageText}
              onChange={(e) => set({ ageText: e.target.value })}
              aria-invalid={Boolean(errors.ageText)}
            />
            <span className={unitFixed}>years</span>
          </FieldShell>
          {errors.ageText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="curb65-score">
            CURB-65 score
            <InfoTooltip text="Sum of five binary criteria (0–5)." />
          </label>
          <FieldShell muted>
            <input
              id="curb65-score"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={scoreDisplay}
              aria-live="polite"
              aria-readonly="true"
            />
          </FieldShell>
        </div>

        {result?.score != null && result.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.statusDetail}
          </p>
        ) : null}
      </section>
    </form>
  );
}
