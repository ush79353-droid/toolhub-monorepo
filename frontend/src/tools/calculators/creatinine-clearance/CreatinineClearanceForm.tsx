'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CollectionTimeUnit,
  CreatinineClearanceFieldErrors,
  CreatinineClearanceInput,
  CreatinineClearanceResult,
  HeightUnit,
  SerumCreatinineUnit,
  Sex,
  UrineCreatinineUnit,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
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
  input: CreatinineClearanceInput;
  errors: CreatinineClearanceFieldErrors;
  result: CreatinineClearanceResult | null;
  onChange: (input: CreatinineClearanceInput) => void;
}

export function CreatinineClearanceForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<CreatinineClearanceInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational Cockcroft–Gault estimate and optional timed-urine measurement.
        Entries stay in your browser and are not shared in the page URL.
      </p>

      <section className={sectionClass} aria-label="Estimated creatinine clearance">
        <div>
          <label className={labelClass} htmlFor="crcl-age">
            Age
          </label>
          <FieldShell error={errors.ageYearsText}>
            <input
              id="crcl-age"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.ageYearsText}
              onChange={(e) => set({ ageYearsText: e.target.value })}
              aria-invalid={Boolean(errors.ageYearsText)}
            />
            <span className={unitFixed}>yrs</span>
          </FieldShell>
          {errors.ageYearsText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageYearsText}</p>
          ) : null}
        </div>

        <fieldset>
          <legend className={labelClass}>Sex</legend>
          <div className="flex flex-wrap gap-4">
            {([
              ['female', 'Female'],
              ['male', 'Male'],
            ] as [Sex, string][]).map(([v, label]) => (
              <label
                key={v}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="crcl-sex"
                  className="h-4 w-4 accent-primary"
                  checked={input.sex === v}
                  onChange={() => set({ sex: v })}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="crcl-weight">
            Weight
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="crcl-weight"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.weightText}
              onChange={(e) => set({ weightText: e.target.value })}
              aria-invalid={Boolean(errors.weightText)}
            />
            <select
              className={unitSelectClass}
              value={input.weightUnit}
              onChange={(e) =>
                set({ weightUnit: e.target.value as WeightUnit })
              }
              aria-label="Weight unit"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </FieldShell>
          {errors.weightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="crcl-height">
            Height
            <InfoTooltip text="Height is used with weight to compute BMI and select actual, ideal, or adjusted body weight for Cockcroft–Gault." />
          </label>
          <FieldShell error={errors.heightText}>
            <input
              id="crcl-height"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.heightText}
              onChange={(e) => set({ heightText: e.target.value })}
              aria-invalid={Boolean(errors.heightText)}
            />
            <select
              className={unitSelectClass}
              value={input.heightUnit}
              onChange={(e) =>
                set({ heightUnit: e.target.value as HeightUnit })
              }
              aria-label="Height unit"
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
              <option value="m">m</option>
            </select>
          </FieldShell>
          {errors.heightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heightText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="crcl-scr">
            Serum creatinine
            <InfoTooltip text="Steady-state serum creatinine. µmol/L is divided by 88.4 to convert to mg/dL before Cockcroft–Gault." />
          </label>
          <FieldShell error={errors.serumCreatinineText}>
            <input
              id="crcl-scr"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.serumCreatinineText}
              onChange={(e) => set({ serumCreatinineText: e.target.value })}
              aria-invalid={Boolean(errors.serumCreatinineText)}
            />
            <select
              className={unitSelectClass}
              value={input.serumCreatinineUnit}
              onChange={(e) =>
                set({
                  serumCreatinineUnit: e.target.value as SerumCreatinineUnit,
                })
              }
              aria-label="Serum creatinine unit"
            >
              <option value="mg_dl">mg/dL</option>
              <option value="umol_l">µmol/L</option>
            </select>
          </FieldShell>
          {errors.serumCreatinineText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.serumCreatinineText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="crcl-estimate">
            Creatinine clearance
            <InfoTooltip text="Estimated CrCl from Cockcroft–Gault with BMI-based weight selection (actual / ideal / adjusted)." />
          </label>
          <FieldShell muted>
            <input
              id="crcl-estimate"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedEstimatedCrCl ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <span className={unitFixed}>mL/min</span>
          </FieldShell>
          {result?.estimatedCrClMlMin != null && result.estimateDetail ? (
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {result.estimateDetail}
            </p>
          ) : null}
        </div>
      </section>

      <details className={`group ${sectionClass}`}>
        <summary className="cursor-pointer list-none text-sm font-semibold text-accent marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2">
            Direct CrCl calculation
            <span className="text-xs font-normal text-muted-foreground group-open:hidden">
              (show)
            </span>
            <span className="hidden text-xs font-normal text-muted-foreground group-open:inline">
              (hide)
            </span>
          </span>
        </summary>
        <div className="mt-3.5 space-y-3.5 border-t border-border pt-3.5">
          <div>
            <label className={labelClass} htmlFor="crcl-ucr">
              Urine creatinine
            </label>
            <FieldShell error={errors.urineCreatinineText}>
              <input
                id="crcl-ucr"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.urineCreatinineText}
                onChange={(e) => set({ urineCreatinineText: e.target.value })}
                aria-invalid={Boolean(errors.urineCreatinineText)}
              />
              <select
                className={unitSelectClass}
                value={input.urineCreatinineUnit}
                onChange={(e) =>
                  set({
                    urineCreatinineUnit: e.target.value as UrineCreatinineUnit,
                  })
                }
                aria-label="Urine creatinine unit"
              >
                <option value="mg_dl">mg/dL</option>
                <option value="umol_l">µmol/L</option>
              </select>
            </FieldShell>
            {errors.urineCreatinineText ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.urineCreatinineText}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="crcl-uvol">
              Urine volume
            </label>
            <FieldShell error={errors.urineVolumeMlText}>
              <input
                id="crcl-uvol"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.urineVolumeMlText}
                onChange={(e) => set({ urineVolumeMlText: e.target.value })}
                aria-invalid={Boolean(errors.urineVolumeMlText)}
              />
              <span className={unitFixed}>mL</span>
            </FieldShell>
            {errors.urineVolumeMlText ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.urineVolumeMlText}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="crcl-collection">
              Collection duration
              <InfoTooltip text="Timed collection interval for the urine sample. Required for direct CrCl = (UCr×volume)/(SCr×minutes)." />
            </label>
            <FieldShell error={errors.collectionTimeText}>
              <input
                id="crcl-collection"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.collectionTimeText}
                onChange={(e) => set({ collectionTimeText: e.target.value })}
                aria-invalid={Boolean(errors.collectionTimeText)}
              />
              <select
                className={unitSelectClass}
                value={input.collectionTimeUnit}
                onChange={(e) =>
                  set({
                    collectionTimeUnit: e.target.value as CollectionTimeUnit,
                  })
                }
                aria-label="Collection duration unit"
              >
                <option value="hours">hours</option>
                <option value="minutes">minutes</option>
              </select>
            </FieldShell>
            {errors.collectionTimeText ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.collectionTimeText}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="crcl-dscr">
              Serum creatinine
            </label>
            <FieldShell error={errors.directSerumCreatinineText}>
              <input
                id="crcl-dscr"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.directSerumCreatinineText}
                onChange={(e) =>
                  set({ directSerumCreatinineText: e.target.value })
                }
                aria-invalid={Boolean(errors.directSerumCreatinineText)}
              />
              <select
                className={unitSelectClass}
                value={input.directSerumCreatinineUnit}
                onChange={(e) =>
                  set({
                    directSerumCreatinineUnit: e.target
                      .value as SerumCreatinineUnit,
                  })
                }
                aria-label="Direct serum creatinine unit"
              >
                <option value="mg_dl">mg/dL</option>
                <option value="umol_l">µmol/L</option>
              </select>
            </FieldShell>
            {errors.directSerumCreatinineText ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.directSerumCreatinineText}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="crcl-direct">
              Direct creatinine clearance
            </label>
            <FieldShell muted>
              <input
                id="crcl-direct"
                type="text"
                readOnly
                tabIndex={0}
                className={`${inputClass} text-muted-foreground`}
                value={result?.formattedDirectCrCl ?? ''}
                aria-live="polite"
                aria-readonly="true"
              />
              <span className={unitFixed}>mL/min</span>
            </FieldShell>
            {result?.directCrClMlMin != null && result.directDetail ? (
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {result.directDetail}
              </p>
            ) : null}
          </div>
        </div>
      </details>
    </form>
  );
}
