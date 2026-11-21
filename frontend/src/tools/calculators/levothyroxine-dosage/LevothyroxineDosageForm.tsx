'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AgeBand,
  Ft4Level,
  HeightUnit,
  LevothyroxineDosageFieldErrors,
  LevothyroxineDosageInput,
  Sex,
  WeightUnit,
  YesNo,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-r-lg border-l border-border bg-muted/30 px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

interface FormProps {
  input: LevothyroxineDosageInput;
  errors: LevothyroxineDosageFieldErrors;
  personalOpen: boolean;
  healthOpen: boolean;
  onTogglePersonal: () => void;
  onToggleHealth: () => void;
  onChange: (input: LevothyroxineDosageInput) => void;
}

export function LevothyroxineDosageForm({
  input,
  errors,
  personalOpen,
  healthOpen,
  onTogglePersonal,
  onToggleHealth,
  onChange,
}: FormProps) {
  const set = (patch: Partial<LevothyroxineDosageInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-accent">
        <p className="font-semibold text-amber-950">
          Educational teaching estimate — not a prescription
        </p>
        <p className="mt-1.5 text-foreground/85">
          For healthy adults (15–50, FT4 Low, no heart disease) with Devine-eligible
          height, an educational 1.6 mcg/kg × min(actual, IBW) teaching figure may
          appear. Older adults, cardiac disease, Normal FT4, and incomplete inputs
          stay gated for clinician review.
        </p>
      </div>

      <section className={sectionClass} aria-labelledby="levo-personal-heading">
        <button
          type="button"
          className="flex w-full items-center gap-2 text-left"
          aria-expanded={personalOpen}
          onClick={onTogglePersonal}
        >
          <span className="text-primary" aria-hidden>
            {personalOpen ? '▲' : '▼'}
          </span>
          <h3
            id="levo-personal-heading"
            className="text-[15px] font-semibold text-accent"
          >
            Personal information
          </h3>
        </button>

        {personalOpen ? (
          <div className="space-y-3.5 pt-1">
            <p className="text-sm">
              <a
                href="#how-to-use"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                Check out how to use this calculator!
              </a>
            </p>

            <div>
              <div className={labelClass}>Sex</div>
              <div
                className="flex flex-wrap gap-4"
                role="radiogroup"
                aria-label="Sex"
              >
                {(
                  [
                    ['female', 'Female'],
                    ['male', 'Male'],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className="inline-flex cursor-pointer items-center gap-2 text-sm text-accent"
                  >
                    <input
                      type="radio"
                      name="levo-sex"
                      className="h-4 w-4 accent-primary"
                      checked={input.sex === value}
                      onChange={() => set({ sex: value as Sex })}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className={labelClass}>
                Age
                <InfoTooltip
                  label="Age"
                  text="Screenshot age bands only. FDA adult dosing distinguishes younger adults from older adults and cardiac risk — this tool does not invent an exact age from the band."
                />
              </div>
              <div
                className="flex flex-col gap-2"
                role="radiogroup"
                aria-label="Age"
              >
                {(
                  [
                    ['15_50', '15–50 years old'],
                    ['over_50', 'Over 50 years old'],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className="inline-flex cursor-pointer items-center gap-2 text-sm text-accent"
                  >
                    <input
                      type="radio"
                      name="levo-age"
                      className="h-4 w-4 accent-primary"
                      checked={input.ageBand === value}
                      onChange={() => set({ ageBand: value as AgeBand })}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className={labelClass}>Weight</div>
              <FieldShell error={errors.weightText}>
                <input
                  type="text"
                  inputMode="decimal"
                  aria-label="Weight"
                  className={inputClass}
                  value={input.weightText}
                  onChange={(e) => set({ weightText: e.target.value })}
                />
                <select
                  aria-label="Weight unit"
                  className={selectClass}
                  value={input.weightUnit}
                  onChange={(e) =>
                    set({ weightUnit: e.target.value as WeightUnit })
                  }
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
              <div className={labelClass}>Height</div>
              <FieldShell error={errors.heightText}>
                <input
                  type="text"
                  inputMode="decimal"
                  aria-label="Height"
                  className={inputClass}
                  value={input.heightText}
                  onChange={(e) => set({ heightText: e.target.value })}
                />
                <select
                  aria-label="Height unit"
                  className={selectClass}
                  value={input.heightUnit}
                  onChange={(e) =>
                    set({ heightUnit: e.target.value as HeightUnit })
                  }
                >
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                </select>
              </FieldShell>
              {errors.heightText ? (
                <p className="mt-1 text-xs text-rose-600">{errors.heightText}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>

      <section className={sectionClass} aria-labelledby="levo-health-heading">
        <button
          type="button"
          className="flex w-full items-center gap-2 text-left"
          aria-expanded={healthOpen}
          onClick={onToggleHealth}
        >
          <span className="text-primary" aria-hidden>
            {healthOpen ? '▲' : '▼'}
          </span>
          <h3
            id="levo-health-heading"
            className="text-[15px] font-semibold text-accent"
          >
            Health conditions
          </h3>
        </button>

        {healthOpen ? (
          <div className="space-y-3.5 pt-1">
            <div>
              <div className={labelClass}>
                Current level of FT4
                <InfoTooltip
                  label="FT4"
                  text="Free thyroxine (FT4). A Low/Normal toggle is not a full thyroid panel. FDA adult titration for primary hypothyroidism typically uses serum TSH; free-T4 guides secondary/tertiary hypothyroidism — clinician interpretation required."
                />
              </div>
              <div
                className="flex flex-wrap gap-4"
                role="radiogroup"
                aria-label="Current level of FT4"
              >
                {(
                  [
                    ['low', 'Low'],
                    ['normal', 'Normal'],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className="inline-flex cursor-pointer items-center gap-2 text-sm text-accent"
                  >
                    <input
                      type="radio"
                      name="levo-ft4"
                      className="h-4 w-4 accent-primary"
                      checked={input.ft4 === value}
                      onChange={() => set({ ft4: value as Ft4Level })}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className={labelClass}>
                Heart disease
                <InfoTooltip
                  label="Heart disease"
                  text="Underlying cardiovascular disease increases cardiac adverse-reaction risk with levothyroxine. FDA labeling starts such adults at less than full replacement and titrates more slowly. Answering No does not clear all cardiac risk."
                />
              </div>
              <div
                className="flex flex-wrap gap-4"
                role="radiogroup"
                aria-label="Heart disease"
              >
                {(
                  [
                    ['no', 'No'],
                    ['yes', 'Yes'],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className="inline-flex cursor-pointer items-center gap-2 text-sm text-accent"
                  >
                    <input
                      type="radio"
                      name="levo-heart"
                      className="h-4 w-4 accent-primary"
                      checked={input.heartDisease === value}
                      onChange={() => set({ heartDisease: value as YesNo })}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
