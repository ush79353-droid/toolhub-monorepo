'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  WORKING_AGE_DEFINITIONS,
  type LfprFieldErrors,
  type LfprInput,
  type LfprResult,
  type WorkingAgeDefinition,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full min-w-0 appearance-none bg-transparent px-3 text-sm text-accent outline-none';

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

interface LfprFormProps {
  input: LfprInput;
  errors: LfprFieldErrors;
  result: LfprResult | null;
  onChange: (input: LfprInput) => void;
  onLoadExample: () => void;
}

export function LfprForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: LfprFormProps) {
  const set = (patch: Partial<LfprInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        LFPR = (Employed + Unemployed) / Working-age population × 100.
 Unemployment rate = Unemployed / Labor force × 100; different
        denominators. Hypothetical teaching numbers are not national statistics.
      </p>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (5.5M / 700k / 7.2M → LFPR 86.11%)
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="space-y-3 rounded-xl border border-border bg-muted/10 p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-accent">
          Labor force
        </h3>
        <div>
          <label htmlFor="lfpr-employed" className={labelClass}>
            Employed population
            <InfoTooltip
              label="Employed population"
              text="Number of people in the selected population who are employed."
            />
          </label>
          <FieldShell error={errors.employedPopulation}>
            <input
              id="lfpr-employed"
              type="text"
              inputMode="numeric"
              className={inputClass}
              value={input.employedPopulation}
              onChange={(e) => set({ employedPopulation: e.target.value })}
              placeholder="5,500,000"
            />
            <span className="pr-2 text-[10px] text-muted-foreground" aria-hidden>
              people
            </span>
          </FieldShell>
          {errors.employedPopulation ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.employedPopulation}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="lfpr-unemployed" className={labelClass}>
            Unemployed population
            <InfoTooltip
              label="Unemployed population"
              text="People without employment who meet the applicable job-search and availability criteria for unemployment."
            />
          </label>
          <FieldShell error={errors.unemployedPopulation}>
            <input
              id="lfpr-unemployed"
              type="text"
              inputMode="numeric"
              className={inputClass}
              value={input.unemployedPopulation}
              onChange={(e) => set({ unemployedPopulation: e.target.value })}
              placeholder="700,000"
            />
            <span className="pr-2 text-[10px] text-muted-foreground" aria-hidden>
              people
            </span>
          </FieldShell>
          {errors.unemployedPopulation ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.unemployedPopulation}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="lfpr-labor-force" className={labelClass}>
            Labor force
          </label>
          <FieldShell muted>
            <input
              id="lfpr-labor-force"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold`}
              value={result?.formattedLaborForce ?? ''}
              placeholder="—"
            />
            <span className="pr-2 text-[10px] text-muted-foreground" aria-hidden>
              people
            </span>
          </FieldShell>
        </div>
        <div>
          <label htmlFor="lfpr-ur" className={labelClass}>
            Unemployment rate
          </label>
          <FieldShell muted>
            <input
              id="lfpr-ur"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold`}
              value={result?.formattedUnemploymentRate ?? ''}
              placeholder="—"
            />
          </FieldShell>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-muted/10 p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-accent">
          Labor force participation rate
        </h3>
        <div>
          <label htmlFor="lfpr-definition" className={labelClass}>
            Population definition
            <InfoTooltip
              label="Population definition"
              text="Labels the coverage used for the working-age / participation denominator. Different agencies use different age cutoffs; this does not change the arithmetic of your entered counts."
            />
          </label>
          <FieldShell>
            <select
              id="lfpr-definition"
              className={selectClass}
              value={input.workingAgeDefinition}
              onChange={(e) =>
                set({
                  workingAgeDefinition: e.target.value as WorkingAgeDefinition,
                })
              }
            >
              {WORKING_AGE_DEFINITIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>
        <div>
          <label htmlFor="lfpr-working-age" className={labelClass}>
            Working-age population
            <InfoTooltip
              label="Working-age population"
              text="Population included in the chosen LFPR age and coverage definition. Must be greater than zero and at least as large as the labor force."
            />
          </label>
          <FieldShell error={errors.workingAgePopulation}>
            <input
              id="lfpr-working-age"
              type="text"
              inputMode="numeric"
              className={inputClass}
              value={input.workingAgePopulation}
              onChange={(e) => set({ workingAgePopulation: e.target.value })}
              placeholder="7,200,000"
            />
            <span className="pr-2 text-[10px] text-muted-foreground" aria-hidden>
              people
            </span>
          </FieldShell>
          {errors.workingAgePopulation ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.workingAgePopulation}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="lfpr-rate" className={labelClass}>
            Labor force participation rate
          </label>
          <FieldShell muted>
            <input
              id="lfpr-rate"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold`}
              value={result?.formattedLfpr ?? ''}
              placeholder="—"
            />
          </FieldShell>
        </div>
      </div>
    </form>
  );
}
