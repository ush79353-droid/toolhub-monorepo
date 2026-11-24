'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { EGFR_BAND_ROWS, formatEgfr } from './calculation';
import type {
  CreatinineUnit,
  Ethnicity,
  GfrEstimatedFieldErrors,
  GfrEstimatedInput,
  GfrEstimatedResult,
  GfrMarkerMode,
  Sex,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-primary';

const MARKER_OPTIONS: { mode: GfrMarkerMode; label: string }[] = [
  { mode: 'creatinine', label: 'Serum creatinine' },
  { mode: 'cystatin', label: 'Serum cystatin C' },
  { mode: 'both', label: 'Both serums' },
];

const CREATININE_UNITS: { value: CreatinineUnit; label: string }[] = [
  { value: 'mg_dl', label: 'mg/dL' },
  { value: 'umol_l', label: 'µmol/L' },
];

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
  input: GfrEstimatedInput;
  errors: GfrEstimatedFieldErrors;
  result: GfrEstimatedResult | null;
  onChange: (input: GfrEstimatedInput) => void;
}

export function GfrEstimatedForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<GfrEstimatedInput>) =>
    onChange({ ...input, ...patch });

  const showCreatinine =
    input.markerMode === 'creatinine' || input.markerMode === 'both';
  const showCystatin =
    input.markerMode === 'cystatin' || input.markerMode === 'both';
  const showEthnicity =
    input.markerMode === 'creatinine' || input.markerMode === 'both';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="eGFR inputs">
        <p className="text-[13px] font-medium text-accent">
          Calculate eGFR based on:
        </p>

        <fieldset>
          <legend className="sr-only">Serum marker mode</legend>
          <div
            className="flex flex-col gap-2.5"
            role="radiogroup"
            aria-label="Serum marker mode"
          >
            {MARKER_OPTIONS.map(({ mode, label }) => (
              <label
                key={mode}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="gfr-marker-mode"
                  className="h-4 w-4 accent-primary"
                  checked={input.markerMode === mode}
                  onChange={() => set({ markerMode: mode })}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={labelClass}>Sex</legend>
          <div
            className="flex flex-wrap gap-4"
            role="radiogroup"
            aria-label="Sex"
          >
            {([
              { value: 'female', label: 'Female' },
              { value: 'male', label: 'Male' },
            ] as const).map(({ value, label }) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="gfr-sex"
                  className="h-4 w-4 accent-primary"
                  checked={input.sex === value}
                  onChange={() => set({ sex: value as Sex })}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {showEthnicity ? (
          <fieldset>
            <legend className={labelClass}>
              Ethnicity
              <InfoTooltip text="Used only by historical race-based equations (CKD-EPI 2009, MDRD, and 2012 creatinine–cystatin). CKD-EPI 2021 race-free equations ignore this choice." />
            </legend>
            <div
              className="flex flex-col gap-2.5"
              role="radiogroup"
              aria-label="Ethnicity"
            >
              {(
                [
                  { value: 'black', label: 'Black' },
                  {
                    value: 'other',
                    label: 'White / Hispanic / Asian / Other',
                  },
                ] as const
              ).map(({ value, label }) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-2 text-sm text-accent"
                >
                  <input
                    type="radio"
                    name="gfr-ethnicity"
                    className="h-4 w-4 accent-primary"
                    checked={input.ethnicity === value}
                    onChange={() => set({ ethnicity: value as Ethnicity })}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        <div>
          <label className={labelClass} htmlFor="gfr-age">
            Age
            <InfoTooltip text="Adult CKD-EPI and MDRD equations apply for ages 18–120 years." />
          </label>
          <FieldShell error={errors.ageYearsText}>
            <input
              id="gfr-age"
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

        {showCreatinine ? (
          <div>
            <label className={labelClass} htmlFor="gfr-creatinine">
              Serum creatinine
              <InfoTooltip text="Standardized serum creatinine. µmol/L is divided by 88.4 to get mg/dL before the equations." />
            </label>
            <FieldShell error={errors.creatinineText}>
              <input
                id="gfr-creatinine"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.creatinineText}
                onChange={(e) => set({ creatinineText: e.target.value })}
                aria-invalid={Boolean(errors.creatinineText)}
              />
              <select
                className={unitSelectClass}
                value={input.creatinineUnit}
                onChange={(e) =>
                  set({
                    creatinineUnit: e.target.value as CreatinineUnit,
                  })
                }
                aria-label="Creatinine unit"
              >
                {CREATININE_UNITS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FieldShell>
            {errors.creatinineText ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.creatinineText}
              </p>
            ) : null}
          </div>
        ) : null}

        {showCystatin ? (
          <div>
            <label className={labelClass} htmlFor="gfr-cystatin">
              Serum cystatin C
              <InfoTooltip text="Standardized serum cystatin C in mg/L." />
            </label>
            <FieldShell error={errors.cystatinText}>
              <input
                id="gfr-cystatin"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.cystatinText}
                onChange={(e) => set({ cystatinText: e.target.value })}
                aria-invalid={Boolean(errors.cystatinText)}
              />
              <span className={unitFixed}>mg/L</span>
            </FieldShell>
            {errors.cystatinText ? (
              <p className="mt-1 text-xs text-rose-600">{errors.cystatinText}</p>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className={sectionClass} aria-label="eGFR results">
        <h3 className="text-[13px] font-semibold text-accent">eGFR results</h3>
        {result?.equations.length ? (
          <div className="space-y-3">
            {result.equations.map((row) => (
              <div key={row.id}>
                <label className={labelClass} htmlFor={`gfr-out-${row.id}`}>
                  {row.label}
                  <InfoTooltip text={row.note} />
                </label>
                <FieldShell muted>
                  <input
                    id={`gfr-out-${row.id}`}
                    type="text"
                    readOnly
                    tabIndex={0}
                    className={`${inputClass} text-muted-foreground`}
                    value={row.formatted}
                    aria-live="polite"
                    aria-readonly="true"
                  />
                  <span className={unitFixed}>mL/min/1.73 m²</span>
                </FieldShell>
              </div>
            ))}
            {result.statusDetail ? (
              <p className="text-xs leading-relaxed text-muted-foreground">
                {result.statusDetail} {result.disclaimer}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result?.statusDetail ??
              'Enter age and the selected serum marker(s) to estimate eGFR.'}
          </p>
        )}
      </section>

      <section className={sectionClass} aria-label="eGFR interpretation">
        <h3 className="text-[13px] font-semibold text-accent">
          eGFR interpretation
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[240px] border-collapse text-left text-sm text-accent">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-medium">eGFR</th>
                <th className="py-2 font-medium">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {EGFR_BAND_ROWS.map((row) => {
                const active = result?.band === row.band;
                return (
                  <tr
                    key={row.band}
                    className={
                      active
                        ? 'bg-sky-50/80 font-medium'
                        : 'border-b border-border/60'
                    }
                  >
                    <td className="py-2 pr-3 tabular-nums">{row.range}</td>
                    <td className="py-2">{row.meaning}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {result?.band && result.equations[0] ? (
          <p className="text-xs text-muted-foreground">
            Highlighted band uses the primary estimate (
            {formatEgfr(result.equations[0].valueMlMin173)} mL/min/1.73 m²).
          </p>
        ) : null}
      </section>
    </form>
  );
}
