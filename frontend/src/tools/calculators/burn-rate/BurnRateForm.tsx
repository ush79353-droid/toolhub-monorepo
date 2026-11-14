'use client';

import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DURATION_UNITS,
  RUNWAY_UNITS,
  type BurnRateFieldErrors,
  type BurnRateInput,
  type BurnRateResult,
  type DurationUnit,
  type RunwayUnit,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-muted-foreground';

const UNIT_LABEL: Record<DurationUnit, string> = {
  days: 'days',
  weeks: 'wks',
  months: 'mos',
  years: 'yrs',
};

function numberOrBlank(value: number): string {
  return Number.isFinite(value) ? String(value) : '';
}

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div
      className={`flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details open className="rounded-xl border border-border bg-muted/15">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
        {title}
      </summary>
      <div className="space-y-3.5 px-4 pb-4">{children}</div>
    </details>
  );
}

interface BurnRateFormProps {
  input: BurnRateInput;
  errors: BurnRateFieldErrors;
  result: BurnRateResult | null;
  onChange: (input: BurnRateInput) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function BurnRateForm({
  input,
  errors,
  result,
  onChange,
  onSubmit,
  onReset,
}: BurnRateFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<BurnRateInput>) => onChange({ ...input, ...patch });

  const onNumber = (key: keyof BurnRateInput) => (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();
    set({ [key]: text === '' ? Number.NaN : Number(text) } as Partial<BurnRateInput>);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate autoComplete="off">
      <Section title="Main inputs">
        <div>
          <label className={labelClass} htmlFor="burn-initial">
            Initial balance
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.initialBalance}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="burn-initial"
                className={inputClass}
                inputMode="decimal"
                value={numberOrBlank(input.initialBalance)}
                aria-invalid={Boolean(errors.initialBalance)}
                onChange={onNumber('initialBalance')}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="burn-initial-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
              />
            </div>
          </div>
          {errors.initialBalance ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialBalance}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="burn-final">
            Final balance
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.finalBalance}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="burn-final"
                className={inputClass}
                inputMode="decimal"
                value={numberOrBlank(input.finalBalance)}
                aria-invalid={Boolean(errors.finalBalance)}
                onChange={onNumber('finalBalance')}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="burn-final-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
              />
            </div>
          </div>
          {errors.finalBalance ? (
            <p className="mt-1 text-xs text-rose-600">{errors.finalBalance}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="burn-duration">
            <span>Duration</span>
            <InfoTooltip
              label="Duration"
              text="Length of the period between the initial and final balances. Burn rate is always expressed per month."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.duration}>
              <input
                id="burn-duration"
                className={inputClass}
                inputMode="decimal"
                value={numberOrBlank(input.duration)}
                aria-invalid={Boolean(errors.duration)}
                onChange={onNumber('duration')}
              />
            </FieldShell>
            <select
              className={selectClass}
              aria-label="Duration unit"
              value={input.durationUnit}
              onChange={(event) => set({ durationUnit: event.target.value as DurationUnit })}
            >
              {DURATION_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {UNIT_LABEL[unit]}
                </option>
              ))}
            </select>
          </div>
          {errors.duration ? <p className="mt-1 text-xs text-rose-600">{errors.duration}</p> : null}
        </div>
      </Section>

      <Section title="Burn rate & cash runway">
        <div>
          <label className={labelClass} htmlFor="burn-rate">
            Burn rate
          </label>
          <div className="flex flex-wrap gap-2">
            <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/30">
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="burn-rate"
                className={`${inputClass} cursor-default font-semibold text-accent`}
                readOnly
                value={result?.burnRateDisplay ?? ''}
                placeholder="—"
                aria-live="polite"
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="burn-rate-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
                aria-label="Burn rate currency"
              />
            </div>
            <span className={selectClass} aria-hidden="true">
              / mo
            </span>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="burn-runway">
            <span>Cash runway</span>
            <InfoTooltip
              label="Cash runway"
              text="Months of cash left at the current burn rate: final balance ÷ burn rate. Shows N/A when burn rate is zero or negative (no finite depletion runway)."
            />
          </label>
          <div className="flex gap-2">
            <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/30">
              <input
                id="burn-runway"
                className={`${inputClass} cursor-default font-semibold text-accent`}
                readOnly
                value={result?.cashRunwayDisplay ?? ''}
                placeholder="—"
                aria-live="polite"
              />
            </div>
            <select
              className={selectClass}
              aria-label="Cash runway unit"
              value={input.runwayUnit}
              onChange={(event) => set({ runwayUnit: event.target.value as RunwayUnit })}
            >
              {RUNWAY_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {UNIT_LABEL[unit]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      {errors.form ? (
        <p
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-700"
          role="alert"
        >
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
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
