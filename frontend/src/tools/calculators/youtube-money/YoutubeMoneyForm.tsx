'use client';

import type { ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  PERIODS,
  PERIOD_LABEL,
  type Period,
  type YoutubeMoneyFieldErrors,
  type YoutubeMoneyInput,
  type YoutubeMoneyResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-[108px] shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-muted-foreground';

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

function PeriodSelect({
  id,
  value,
  onChange,
  'aria-label': ariaLabel,
}: {
  id: string;
  value: Period;
  onChange: (period: Period) => void;
  'aria-label': string;
}) {
  return (
    <select
      id={id}
      className={selectClass}
      value={value}
      aria-label={ariaLabel}
      onChange={(event) => onChange(event.target.value as Period)}
    >
      {PERIODS.map((period) => (
        <option key={period} value={period}>
          {PERIOD_LABEL[period]}
        </option>
      ))}
    </select>
  );
}

interface YoutubeMoneyFormProps {
  input: YoutubeMoneyInput;
  errors: YoutubeMoneyFieldErrors;
  result: YoutubeMoneyResult | null;
  onChange: (input: YoutubeMoneyInput) => void;
  onReset: () => void;
}

export function YoutubeMoneyForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: YoutubeMoneyFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<YoutubeMoneyInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="yt-rpm">
          <span>RPM</span>
          <InfoTooltip
            label="RPM"
            text="Revenue per mille: estimated creator earnings per 1,000 views. Creator RPM already reflects platform revenue sharing."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.rpm}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="yt-rpm"
              className={inputClass}
              inputMode="decimal"
              value={input.rpm}
              placeholder=""
              aria-invalid={Boolean(errors.rpm)}
              onChange={(event) => set({ rpm: event.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="yt-rpm-currency"
              value={input.currency}
              onChange={(currency) => set({ currency })}
              aria-label="RPM currency"
            />
          </div>
        </div>
        {errors.rpm ? <p className="mt-1 text-xs text-rose-600">{errors.rpm}</p> : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="yt-views">
          <span>Number of views</span>
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.views}>
            <input
              id="yt-views"
              className={inputClass}
              inputMode="decimal"
              value={input.views}
              placeholder=""
              aria-invalid={Boolean(errors.views)}
              onChange={(event) => set({ views: event.target.value })}
            />
          </FieldShell>
          <PeriodSelect
            id="yt-views-period"
            value={input.viewsPeriod}
            onChange={(viewsPeriod) => set({ viewsPeriod })}
            aria-label="Views time period"
          />
        </div>
        {errors.views ? <p className="mt-1 text-xs text-rose-600">{errors.views}</p> : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="yt-gross">
          <span>Gross revenue</span>
          <InfoTooltip
            label="Gross revenue"
            text="Estimated from (views ÷ 1,000) × RPM for the selected period. Labels the RPM-based estimate before any separate deductions (none applied here)."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="yt-gross"
              className={`${inputClass} cursor-default font-semibold`}
              readOnly
              value={result?.formattedGrossRevenue ?? ''}
              placeholder=""
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="yt-gross-currency"
              value={input.currency}
              onChange={(currency) => set({ currency })}
              aria-label="Gross revenue currency"
            />
          </div>
          <PeriodSelect
            id="yt-gross-period"
            value={input.grossPeriod}
            onChange={(grossPeriod) => set({ grossPeriod })}
            aria-label="Gross revenue time period"
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="yt-net">
          <span>Net revenue</span>
          <InfoTooltip
            label="Net revenue"
            text="Estimated creator earnings for the selected period. Equals the RPM-based estimate because creator RPM already reflects platform revenue sharing; no extra percentage is subtracted."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="yt-net"
              className={`${inputClass} cursor-default font-semibold`}
              readOnly
              value={result?.formattedNetRevenue ?? ''}
              placeholder=""
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="yt-net-currency"
              value={input.currency}
              onChange={(currency) => set({ currency })}
              aria-label="Net revenue currency"
            />
          </div>
          <PeriodSelect
            id="yt-net-period"
            value={input.netPeriod}
            onChange={(netPeriod) => set({ netPeriod })}
            aria-label="Net revenue time period"
          />
        </div>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
