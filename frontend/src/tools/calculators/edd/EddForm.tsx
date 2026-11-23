'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatDueDateDisplay } from './calculation';
import type { EddFieldErrors, EddInput, EddResult } from './types';
import { CYCLE_DAY_OPTIONS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';

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

function ReadOnlyDate({
  id,
  label,
  tip,
  valueIso,
}: {
  id: string;
  label: string;
  tip: string;
  valueIso: string | null;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <FieldShell>
        <input
          id={id}
          className={`${inputClass} text-muted-foreground`}
          readOnly
          value={
            valueIso
              ? formatDueDateDisplay(valueIso)
              : ''
          }
          placeholder="MM/DD/YYYY"
          aria-label={label}
        />
      </FieldShell>
    </div>
  );
}

interface Props {
  input: EddInput;
  errors: EddFieldErrors;
  result: EddResult | null;
  onChange: (input: EddInput) => void;
  onLoadExample: () => void;
}

export function EddForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<EddInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Calculate your Estimated Date of Delivery (EDD) with two different
        methods and compare the results.
      </p>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational ACOG-style calendar dating. Cycle length adjusts the LMP
        method only (even when shown beside ultrasound fields). Values stay in
        your browser — share uses the page URL only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (LMP 2026-01-01 · US 8w0d on 2026-03-01)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="edd-current">
          <span>Current date</span>
          <InfoTooltip
            label="Current date"
            text="As-of date for gestational age. Defaults to today in your local calendar."
          />
        </label>
        <FieldShell error={errors.currentDate}>
          <input
            id="edd-current"
            type="date"
            className={inputClass}
            value={input.currentDate}
            aria-invalid={Boolean(errors.currentDate)}
            onChange={(e) => set({ currentDate: e.target.value })}
          />
        </FieldShell>
        {errors.currentDate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.currentDate}</p>
        ) : null}
      </div>

      <fieldset className="space-y-3 rounded-xl border border-border bg-muted/10 p-3 sm:p-4">
        <legend className="px-1 text-sm font-semibold text-accent">
          Method 1 — Based on the last menstrual period
        </legend>
        <div>
          <label className={labelClass} htmlFor="edd-lmp">
            <span>Your last period</span>
            <InfoTooltip
              label="Your last period"
              text="First day of the last menstrual period (LMP)."
            />
          </label>
          <FieldShell error={errors.lmpDate}>
            <input
              id="edd-lmp"
              type="date"
              className={inputClass}
              value={input.lmpDate}
              aria-invalid={Boolean(errors.lmpDate)}
              onChange={(e) => set({ lmpDate: e.target.value })}
            />
          </FieldShell>
          {errors.lmpDate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.lmpDate}</p>
          ) : null}
        </div>
        <ReadOnlyDate
          id="edd-lmp-edd"
          label="LMP EDD (Last Menstrual Period Estimated Date of Delivery)"
          tip="LMP + 280 days + (cycle length − 28). Read-only."
          valueIso={result?.lmpEddIso ?? null}
        />
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border bg-muted/10 p-3 sm:p-4">
        <legend className="px-1 text-sm font-semibold text-accent">
          Method 2 — Based on an ultrasound
        </legend>
        <div>
          <label className={labelClass} htmlFor="edd-us-date">
            <span>Date of the ultrasound</span>
            <InfoTooltip
              label="Date of the ultrasound"
              text="Calendar date of the dating ultrasound used for gestational age at scan."
            />
          </label>
          <FieldShell error={errors.ultrasoundDate}>
            <input
              id="edd-us-date"
              type="date"
              className={inputClass}
              value={input.ultrasoundDate}
              aria-invalid={Boolean(errors.ultrasoundDate)}
              onChange={(e) => set({ ultrasoundDate: e.target.value })}
            />
          </FieldShell>
          {errors.ultrasoundDate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ultrasoundDate}</p>
          ) : null}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="edd-us-weeks">
              Ultrasound weeks
            </label>
            <FieldShell error={errors.ultrasoundWeeks}>
              <input
                id="edd-us-weeks"
                className={inputClass}
                inputMode="numeric"
                value={input.ultrasoundWeeks}
                aria-invalid={Boolean(errors.ultrasoundWeeks)}
                onChange={(e) => set({ ultrasoundWeeks: e.target.value })}
              />
            </FieldShell>
            {errors.ultrasoundWeeks ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.ultrasoundWeeks}
              </p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="edd-us-days">
              Ultrasound days
            </label>
            <FieldShell error={errors.ultrasoundDays}>
              <input
                id="edd-us-days"
                className={inputClass}
                inputMode="numeric"
                value={input.ultrasoundDays}
                aria-invalid={Boolean(errors.ultrasoundDays)}
                onChange={(e) => set({ ultrasoundDays: e.target.value })}
              />
            </FieldShell>
            {errors.ultrasoundDays ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.ultrasoundDays}
              </p>
            ) : null}
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="edd-cycle">
            <span>Menstrual cycle length</span>
            <InfoTooltip
              label="Menstrual cycle length"
              text="Used only for LMP dating: EDD = LMP + 280 + (cycle − 28). Not applied to the ultrasound EDD."
            />
          </label>
          <FieldShell error={errors.cycleDays}>
            <select
              id="edd-cycle"
              className={`${inputClass} cursor-pointer`}
              value={input.cycleDays}
              aria-invalid={Boolean(errors.cycleDays)}
              onChange={(e) => set({ cycleDays: e.target.value })}
            >
              {CYCLE_DAY_OPTIONS.map((d) => (
                <option key={d} value={String(d)}>
                  {d}
                </option>
              ))}
            </select>
            <span className="shrink-0 pr-3 text-sm font-medium text-muted-foreground">
              days
            </span>
          </FieldShell>
        </div>
        <ReadOnlyDate
          id="edd-us-edd"
          label="Ultrasound EDD"
          tip="Scan date + 280 − (7 × weeks + days). Cycle length is not applied."
          valueIso={result?.ultrasoundEddIso ?? null}
        />
      </fieldset>

      <div className="space-y-3 rounded-xl border border-border bg-muted/15 px-4 py-3">
        <p className="text-sm font-semibold text-accent">Your gestational age</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">
              Last Menstrual Period (LMP) age
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-accent">
              {result?.lmpAge?.label ?? '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Ultrasound (US) age</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-accent">
              {result?.ultrasoundAge?.label ?? '—'}
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Difference</p>
          <p className="mt-1 text-sm font-medium text-accent">
            {result?.differenceLabel ?? '—'}
            {result?.differenceDays != null ? (
              <span className="ml-2 tabular-nums text-muted-foreground">
                ({result.differenceDays} days)
              </span>
            ) : null}
          </p>
        </div>
        {result ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.disclaimer}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Enter LMP and/or ultrasound findings to compare educational EDDs.
          </p>
        )}
      </div>
    </form>
  );
}
