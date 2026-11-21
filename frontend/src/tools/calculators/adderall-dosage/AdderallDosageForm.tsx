'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  TABLET_STRENGTHS,
  type AdderallDosageFieldErrors,
  type AdderallDosageInput,
  type IndicationMode,
  type TabletStrengthMg,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full min-w-0 cursor-pointer bg-transparent px-3 text-sm font-semibold text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface FormProps {
  input: AdderallDosageInput;
  errors: AdderallDosageFieldErrors;
  onChange: (input: AdderallDosageInput) => void;
}

export function AdderallDosageForm({ input, errors, onChange }: FormProps) {
  const set = (patch: Partial<AdderallDosageInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-accent sm:text-sm">
        <p className="font-semibold text-amber-950">
          Educational IR label explorer + prescribed-dose tablet math — not a
          prescription
        </p>
        <p className="mt-1.5 text-foreground/85">
          ADHD/Narcolepsy modes show published immediate-release teaching charts
          only. Custom mode converts a dose your licensed clinician already
          wrote into tablet quantity arithmetic. Adderall XR is out of scope.
        </p>
      </div>

      <div>
        <label className={labelClass} htmlFor="adderall-age">
          <span>Age</span>
          <InfoTooltip
            label="Age"
            text="Enter age in years. ADHD IR educational charts begin at 3 years; narcolepsy IR charts begin at 6 years (DailyMed / Omni IR tables)."
          />
        </label>
        <FieldShell error={errors.ageYearsText}>
          <input
            id="adderall-age"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.ageYearsText}
            aria-invalid={Boolean(errors.ageYearsText)}
            placeholder=""
            onChange={(e) => set({ ageYearsText: e.target.value })}
          />
          <span className="shrink-0 pr-3 font-mono text-xs text-muted-foreground">
            years
          </span>
        </FieldShell>
        {errors.ageYearsText ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ageYearsText}</p>
        ) : null}
      </div>

      <div>
        <div className={labelClass}>
          <span>Indication</span>
          <InfoTooltip
            label="Indication"
            text="ADHD and Narcolepsy show educational IR label/chart context. Enter a custom dose unlocks arithmetic for a prescribed mg amount only."
          />
        </div>
        <div
          className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4"
          role="radiogroup"
          aria-label="Indication"
        >
          {(
            [
              ['adhd', 'ADHD'],
              ['narcolepsy', 'Narcolepsy'],
              ['custom', 'Enter a custom dose'],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="adderall-indication"
                className="h-4 w-4 accent-primary"
                checked={input.indication === value}
                onChange={() =>
                  set({
                    indication: value as IndicationMode,
                    prescribedDoseMgText:
                      value === 'custom' ? input.prescribedDoseMgText : '',
                  })
                }
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {input.indication === 'custom' ? (
        <div>
          <label className={labelClass} htmlFor="adderall-prescribed">
            <span>Prescribed dose (mg per administration)</span>
            <InfoTooltip
              label="Prescribed dose"
              text="Enter only the milligram amount already specified by a licensed prescriber for one administration. This field never invents a new dose."
            />
          </label>
          <FieldShell error={errors.prescribedDoseMgText}>
            <input
              id="adderall-prescribed"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.prescribedDoseMgText}
              aria-invalid={Boolean(errors.prescribedDoseMgText)}
              onChange={(e) => set({ prescribedDoseMgText: e.target.value })}
            />
            <span className="shrink-0 pr-3 font-mono text-xs text-muted-foreground">
              mg
            </span>
          </FieldShell>
          {errors.prescribedDoseMgText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.prescribedDoseMgText}
            </p>
          ) : null}
        </div>
      ) : null}

      <div>
        <label className={labelClass} htmlFor="adderall-strength">
          <span>Tablet strength</span>
          <InfoTooltip
            label="Tablet strength"
            text="Immediate-release Adderall tablet strengths listed on DailyMed: 5, 7.5, 10, 12.5, 15, 20, and 30 mg. Extended-release (XR) strengths are not included."
          />
        </label>
        <FieldShell>
          <select
            id="adderall-strength"
            className={selectClass}
            value={input.tabletStrengthMg}
            onChange={(e) =>
              set({
                tabletStrengthMg: Number(e.target.value) as TabletStrengthMg,
              })
            }
          >
            {TABLET_STRENGTHS.map((mg) => (
              <option key={mg} value={mg}>
                {mg} mg
              </option>
            ))}
          </select>
        </FieldShell>
      </div>
    </form>
  );
}
