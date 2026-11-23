'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CholUnit,
  CvdRiskFieldErrors,
  CvdRiskInput,
  CvdRiskResult,
  Sex,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitClass = 'shrink-0 border-l border-border px-2 text-sm text-muted-foreground';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

function FieldShell({
  error,
  muted,
  children,
  suffix,
}: {
  error?: string;
  muted?: boolean;
  children: ReactNode;
  suffix?: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
      {suffix}
    </div>
  );
}

interface Props {
  input: CvdRiskInput;
  errors: CvdRiskFieldErrors;
  result: CvdRiskResult | null;
  onChange: (input: CvdRiskInput) => void;
}

export function CvdRiskForm({ input, errors, result, onChange }: Props) {
  const set = (patch: Partial<CvdRiskInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <div>
          <p id="cvd-sex-label" className={labelClass}>
            <span>Sex</span>
            <InfoTooltip label="Sex" text="Sex-specific Framingham general CVD lipid coefficients." />
          </p>
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-labelledby="cvd-sex-label"
          >
            {([
              { id: 'female', label: 'Female' },
              { id: 'male', label: 'Male' },
            ] as const).map((opt) => (
              <label
                key={opt.id}
                htmlFor={`cvd-sex-${opt.id}`}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-accent has-[:checked]:border-primary has-[:checked]:bg-brand-softTeal/30"
              >
                <input
                  id={`cvd-sex-${opt.id}`}
                  type="radio"
                  name="cvd-sex"
                  value={opt.id}
                  checked={input.sex === opt.id}
                  className="h-4 w-4 accent-primary"
                  onChange={() => set({ sex: opt.id as Sex })}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          {errors.sex ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sex}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cvd-age">
            <span>Age</span>
            <InfoTooltip label="Age" text="Model eligibility: 30–74 years without baseline CVD." />
          </label>
          <FieldShell
            error={errors.ageYears}
            suffix={<span className="shrink-0 pr-3 text-sm text-muted-foreground">yrs</span>}
          >
            <input
              id="cvd-age"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.ageYears}
              onChange={(e) => set({ ageYears: e.target.value })}
            />
          </FieldShell>
          {errors.ageYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ageYears}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cvd-hdl">
            <span>HDL cholesterol</span>
            <InfoTooltip label="HDL cholesterol" text="High-density lipoprotein cholesterol." />
          </label>
          <FieldShell
            error={errors.hdl}
            suffix={
              <select
                className={unitClass}
                aria-label="HDL unit"
                value={input.hdlUnit}
                onChange={(e) => set({ hdlUnit: e.target.value as CholUnit })}
              >
                <option value="mg_dl">mg/dL</option>
                <option value="mmol_l">mmol/L</option>
              </select>
            }
          >
            <input
              id="cvd-hdl"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.hdl}
              onChange={(e) => set({ hdl: e.target.value })}
            />
          </FieldShell>
          {errors.hdl ? (
            <p className="mt-1 text-xs text-rose-600">{errors.hdl}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cvd-tc">
            <span>Total cholesterol</span>
            <InfoTooltip label="Total cholesterol" text="Total serum cholesterol." />
          </label>
          <FieldShell
            error={errors.totalChol}
            suffix={
              <select
                className={unitClass}
                aria-label="Total cholesterol unit"
                value={input.totalCholUnit}
                onChange={(e) =>
                  set({ totalCholUnit: e.target.value as CholUnit })
                }
              >
                <option value="mg_dl">mg/dL</option>
                <option value="mmol_l">mmol/L</option>
              </select>
            }
          >
            <input
              id="cvd-tc"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.totalChol}
              onChange={(e) => set({ totalChol: e.target.value })}
            />
          </FieldShell>
          {errors.totalChol ? (
            <p className="mt-1 text-xs text-rose-600">{errors.totalChol}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cvd-sbp">
            <span>Systolic blood pressure</span>
            <InfoTooltip
              label="Systolic blood pressure"
              text="Uses treated vs untreated ln(SBP) coefficients from D'Agostino 2008."
            />
          </label>
          <FieldShell
            error={errors.sbpMmHg}
            suffix={<span className="shrink-0 pr-3 text-sm text-muted-foreground">mmHg</span>}
          >
            <input
              id="cvd-sbp"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.sbpMmHg}
              onChange={(e) => set({ sbpMmHg: e.target.value })}
            />
          </FieldShell>
          {errors.sbpMmHg ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sbpMmHg}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          {(
            [
              {
                id: 'treatedHypertension',
                label: 'I am being treated for hypertension',
              },
              { id: 'smoker', label: 'I am a smoker' },
              { id: 'diabetes', label: 'I have diabetes' },
            ] as const
          ).map((row) => (
            <label
              key={row.id}
              htmlFor={`cvd-${row.id}`}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-accent"
            >
              <input
                id={`cvd-${row.id}`}
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={input[row.id]}
                onChange={(e) => set({ [row.id]: e.target.checked })}
              />
              <span>{row.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={sectionClass}>
        <div>
          <label className={labelClass} htmlFor="cvd-risk">
            <span>10-year risk of cardiovascular disease</span>
            <InfoTooltip
              label="10-year CVD risk"
              text="Percent risk of a first general CVD event over 10 years (Framingham lipid model)."
            />
          </label>
          <FieldShell
            muted
            suffix={<span className="shrink-0 pr-3 text-sm text-muted-foreground">%</span>}
          >
            <input
              id="cvd-risk"
              type="text"
              readOnly
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={result?.formattedRiskPercent ?? ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>
        <p className="text-xs italic leading-relaxed text-muted-foreground">
          Educational Framingham estimate for adults 30–74 without known CVD. Not
          a diagnosis or treatment plan.
        </p>
      </div>
    </form>
  );
}
