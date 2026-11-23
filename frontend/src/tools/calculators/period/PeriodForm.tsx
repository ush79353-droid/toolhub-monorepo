'use client';

import type { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  PeriodFieldErrors,
  PeriodInput,
  PeriodResult,
} from './types';
import { CYCLE_DAY_OPTIONS, PERIOD_DAY_OPTIONS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const selectClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm text-accent outline-none';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm text-accent outline-none';

function FieldShell({
  error,
  children,
  suffix,
}: {
  error?: string;
  children: ReactNode;
  suffix?: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
      {suffix}
    </div>
  );
}

interface Props {
  input: PeriodInput;
  errors: PeriodFieldErrors;
  result: PeriodResult | null;
  detailsOpen: boolean;
  onDetailsOpenChange: (open: boolean) => void;
  onChange: (input: PeriodInput) => void;
}

export function PeriodForm({
  input,
  errors,
  result,
  detailsOpen,
  onDetailsOpenChange,
  onChange,
}: Props) {
  const set = (patch: Partial<PeriodInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-sm leading-relaxed text-accent">
        Enter your cycle details to see your{' '}
        <span className="font-semibold">next periods</span>,{' '}
        <span className="font-semibold">fertile window</span>, and{' '}
        <span className="font-semibold">ovulation day</span>.
      </p>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-semibold text-accent"
          aria-expanded={detailsOpen}
          onClick={() => onDetailsOpenChange(!detailsOpen)}
        >
          <span>Your period details</span>
          {detailsOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {detailsOpen ? (
          <div className="space-y-3 border-t border-border px-3 py-3">
            <div>
              <label className={labelClass} htmlFor="period-cycle">
                <span>Cycle duration</span>
                <InfoTooltip
                  label="Cycle duration"
                  text="Average days from the first day of one period to the first day of the next (21–45). Default 28."
                />
              </label>
              <div className="flex items-center gap-2">
                <FieldShell error={errors.cycleDays}>
                  <select
                    id="period-cycle"
                    className={selectClass}
                    value={input.cycleDays}
                    onChange={(e) => set({ cycleDays: e.target.value })}
                  >
                    {CYCLE_DAY_OPTIONS.map((d) => (
                      <option key={d} value={String(d)}>
                        {d}
                      </option>
                    ))}
                  </select>
                </FieldShell>
                <span className="shrink-0 text-sm text-muted-foreground">
                  days
                </span>
              </div>
              {errors.cycleDays ? (
                <p className="mt-1 text-xs text-rose-600">{errors.cycleDays}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="period-bleed">
                <span>Period duration</span>
                <InfoTooltip
                  label="Period duration"
                  text="How many days bleeding usually lasts (1–10). Inclusive span: end = start + duration − 1. Default 6."
                />
              </label>
              <div className="flex items-center gap-2">
                <FieldShell error={errors.periodDays}>
                  <select
                    id="period-bleed"
                    className={selectClass}
                    value={input.periodDays}
                    onChange={(e) => set({ periodDays: e.target.value })}
                  >
                    {PERIOD_DAY_OPTIONS.map((d) => (
                      <option key={d} value={String(d)}>
                        {d}
                      </option>
                    ))}
                  </select>
                </FieldShell>
                <span className="shrink-0 text-sm text-muted-foreground">
                  days
                </span>
              </div>
              {errors.periodDays ? (
                <p className="mt-1 text-xs text-rose-600">{errors.periodDays}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="period-lmp">
                <span>My last period started on...</span>
                <InfoTooltip
                  label="Last period start"
                  text="First day of your most recent menstrual period (day 1 of the cycle)."
                />
              </label>
              <FieldShell error={errors.lastPeriodIso}>
                <input
                  id="period-lmp"
                  type="date"
                  className={inputClass}
                  value={input.lastPeriodIso}
                  aria-invalid={Boolean(errors.lastPeriodIso)}
                  onChange={(e) => set({ lastPeriodIso: e.target.value })}
                />
              </FieldShell>
              {errors.lastPeriodIso ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.lastPeriodIso}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border px-3 py-3">
        {result ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-accent">Results</h3>
            <div>
              <p className="text-[13px] font-medium text-accent">Next periods</p>
              <ul className="mt-1 space-y-1 text-sm text-accent">
                {result.nextPeriods.map((p) => (
                  <li key={p.cycleIndex} className="tabular-nums">
                    {p.formattedStart} – {p.formattedEnd}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[13px] font-medium text-accent">
                Fertile window (this cycle)
              </p>
              <p className="mt-1 text-sm tabular-nums text-accent">
                {result.formattedPrimaryFertileStart} –{' '}
                {result.formattedPrimaryFertileEnd}
              </p>
            </div>
            <div>
              <p className="text-[13px] font-medium text-accent">Ovulation day</p>
              <p className="mt-1 text-sm tabular-nums font-semibold text-accent">
                {result.formattedPrimaryOvulation}
              </p>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result.explanation} {result.disclaimer}
            </p>
          </div>
        ) : (
          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="font-medium text-accent">
              Your results will appear here!
            </p>
            <p>
              Enter your cycle length, period duration, and the first day of
              your last period above.
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
