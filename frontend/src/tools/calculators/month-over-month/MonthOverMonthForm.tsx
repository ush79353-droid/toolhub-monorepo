'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  DurationUnit,
  MonthOverMonthFieldErrors,
  MonthOverMonthInput,
  MonthOverMonthResult,
  PeriodChangeResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

function PercentOutput({
  id,
  label,
  tip,
  result,
}: {
  id: string;
  label: string;
  tip: string;
  result: PeriodChangeResult | null | undefined;
}) {
  const unavailable =
    result?.status === 'zeroBaseline' || result?.status === 'indeterminate';
  const display = unavailable
    ? 'Unavailable'
    : result?.formatted
      ? `${result.formatted}%`
      : '';

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <FieldShell muted>
        <input
          id={id}
          type="text"
          readOnly
          tabIndex={-1}
          className={`${inputClass} cursor-default text-muted-foreground`}
          value={display}
          placeholder="—"
          aria-readonly="true"
        />
      </FieldShell>
      {result?.warning ? (
        <p className="mt-1 text-xs text-amber-800" role="status">
          {result.warning}
        </p>
      ) : null}
    </div>
  );
}

interface MonthOverMonthFormProps {
  input: MonthOverMonthInput;
  errors: MonthOverMonthFieldErrors;
  result: MonthOverMonthResult | null;
  onChange: (input: MonthOverMonthInput) => void;
}

export function MonthOverMonthForm({
  input,
  errors,
  result,
  onChange,
}: MonthOverMonthFormProps) {
  const [momOpen, setMomOpen] = useState(true);
  const [cmgrOpen, setCmgrOpen] = useState(true);
  const [qoqOpen, setQoqOpen] = useState(false);
  const [yoyOpen, setYoyOpen] = useState(false);

  const set = (patch: Partial<MonthOverMonthInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-xs text-muted-foreground">
        Enter comparable metric values (revenue, users, sessions, etc.). Sections
        are independent — monthly inputs do not overwrite quarterly or yearly
        figures. No currency conversion is applied.
      </p>

      <CollapsibleSection
        title="Month-over-month"
        open={momOpen}
        onToggle={() => setMomOpen((o) => !o)}
      >
        <div>
          <label htmlFor="mom-m1" className={labelClass}>
            Value in month 1
            <InfoTooltip
              label="Value in month 1"
              text="Earlier month’s metric value (denominator for MoM)."
            />
          </label>
          <FieldShell error={errors.month1}>
            <input
              id="mom-m1"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.month1}
              onChange={(e) => set({ month1: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.month1)}
            />
          </FieldShell>
          {errors.month1 ? (
            <p className="mt-1 text-xs text-rose-600">{errors.month1}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="mom-m2" className={labelClass}>
            Value in month 2
            <InfoTooltip
              label="Value in month 2"
              text="Following month’s value for the same metric."
            />
          </label>
          <FieldShell error={errors.month2}>
            <input
              id="mom-m2"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.month2}
              onChange={(e) => set({ month2: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.month2)}
            />
          </FieldShell>
          {errors.month2 ? (
            <p className="mt-1 text-xs text-rose-600">{errors.month2}</p>
          ) : null}
        </div>
        <PercentOutput
          id="mom-change"
          label="Month-over-month change"
          tip="MoM = ((Month 2 − Month 1) ÷ Month 1) × 100"
          result={result?.mom}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Compounding monthly growth rate (CMGR)"
        open={cmgrOpen}
        onToggle={() => setCmgrOpen((o) => !o)}
      >
        <div>
          <label htmlFor="cmgr-initial" className={labelClass}>
            Value in first month
            <InfoTooltip
              label="Value in first month"
              text="Positive starting value at the beginning of the interval."
            />
          </label>
          <FieldShell error={errors.cmgrInitial}>
            <input
              id="cmgr-initial"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.cmgrInitial}
              onChange={(e) => set({ cmgrInitial: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.cmgrInitial)}
            />
          </FieldShell>
          {errors.cmgrInitial ? (
            <p className="mt-1 text-xs text-rose-600">{errors.cmgrInitial}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="cmgr-final" className={labelClass}>
            Value in last month
            <InfoTooltip
              label="Value in last month"
              text="Nonnegative ending value. Zero yields −100% CMGR."
            />
          </label>
          <FieldShell error={errors.cmgrFinal}>
            <input
              id="cmgr-final"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.cmgrFinal}
              onChange={(e) => set({ cmgrFinal: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.cmgrFinal)}
            />
          </FieldShell>
          {errors.cmgrFinal ? (
            <p className="mt-1 text-xs text-rose-600">{errors.cmgrFinal}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="cmgr-duration" className={labelClass}>
            Time duration
            <InfoTooltip
              label="Time duration"
              text="Elapsed monthly compounding intervals (not a count of month names)."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.cmgrDuration}>
              <input
                id="cmgr-duration"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.cmgrDuration}
                onChange={(e) => set({ cmgrDuration: e.target.value })}
                placeholder="0"
                aria-invalid={Boolean(errors.cmgrDuration)}
              />
            </FieldShell>
            <select
              className="h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
              value={input.cmgrDurationUnit}
              aria-label="Duration unit"
              onChange={(e) =>
                set({ cmgrDurationUnit: e.target.value as DurationUnit })
              }
            >
              <option value="months">months</option>
              <option value="years">years</option>
            </select>
          </div>
          {errors.cmgrDuration ? (
            <p className="mt-1 text-xs text-rose-600">{errors.cmgrDuration}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="cmgr-result" className={labelClass}>
            CMGR
            <InfoTooltip
              label="CMGR"
              text="((Final ÷ Initial)^(1 ÷ months) − 1) × 100 — compounded, not a simple average."
            />
          </label>
          <FieldShell muted>
            <input
              id="cmgr-result"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={
                result?.cmgr?.formatted ? `${result.cmgr.formatted}%` : ''
              }
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Quarter-over-quarter"
        open={qoqOpen}
        onToggle={() => setQoqOpen((o) => !o)}
      >
        <div>
          <label htmlFor="qoq-prev" className={labelClass}>
            Value in previous quarter
            <InfoTooltip
              label="Value in previous quarter"
              text="Earlier quarter’s comparable metric value."
            />
          </label>
          <FieldShell error={errors.qoqPrevious}>
            <input
              id="qoq-prev"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.qoqPrevious}
              onChange={(e) => set({ qoqPrevious: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.qoqPrevious)}
            />
          </FieldShell>
          {errors.qoqPrevious ? (
            <p className="mt-1 text-xs text-rose-600">{errors.qoqPrevious}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="qoq-curr" className={labelClass}>
            Value in current quarter
            <InfoTooltip
              label="Value in current quarter"
              text="Following quarter’s value for the same metric."
            />
          </label>
          <FieldShell error={errors.qoqCurrent}>
            <input
              id="qoq-curr"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.qoqCurrent}
              onChange={(e) => set({ qoqCurrent: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.qoqCurrent)}
            />
          </FieldShell>
          {errors.qoqCurrent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.qoqCurrent}</p>
          ) : null}
        </div>
        <PercentOutput
          id="qoq-change"
          label="Quarter-over-quarter change"
          tip="QoQ = ((Current − Previous) ÷ Previous) × 100"
          result={result?.qoq}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Year-over-year"
        open={yoyOpen}
        onToggle={() => setYoyOpen((o) => !o)}
      >
        <div>
          <label htmlFor="yoy-prev" className={labelClass}>
            Value in previous year
            <InfoTooltip
              label="Value in previous year"
              text="Earlier year’s comparable period value."
            />
          </label>
          <FieldShell error={errors.yoyPrevious}>
            <input
              id="yoy-prev"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.yoyPrevious}
              onChange={(e) => set({ yoyPrevious: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.yoyPrevious)}
            />
          </FieldShell>
          {errors.yoyPrevious ? (
            <p className="mt-1 text-xs text-rose-600">{errors.yoyPrevious}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="yoy-curr" className={labelClass}>
            Value in current year
            <InfoTooltip
              label="Value in current year"
              text="Current year’s value for the same reporting period."
            />
          </label>
          <FieldShell error={errors.yoyCurrent}>
            <input
              id="yoy-curr"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.yoyCurrent}
              onChange={(e) => set({ yoyCurrent: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.yoyCurrent)}
            />
          </FieldShell>
          {errors.yoyCurrent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.yoyCurrent}</p>
          ) : null}
        </div>
        <PercentOutput
          id="yoy-change"
          label="Year-over-year change"
          tip="YoY = ((Current − Previous) ÷ Previous) × 100"
          result={result?.yoy}
        />
      </CollapsibleSection>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
