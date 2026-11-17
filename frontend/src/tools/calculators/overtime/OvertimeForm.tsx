'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  isCurrencyRateUsable,
} from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import {
  moneyAmountToInputString,
  parseMoneyInput,
} from '@/tools/shared/money-value';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { fromHourlyRate, toHourlyRate, toWeeklyHours } from './calculation';
import {
  DURATION_UNIT_OPTIONS,
  PAY_FREQUENCY_OPTIONS,
  RATE_PERIOD_OPTIONS,
  type DurationUnit,
  type OvertimeFieldErrors,
  type OvertimeInput,
  type OvertimeResult,
  type PayFrequency,
  type RatePeriod,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full min-w-0 appearance-none rounded-lg border border-border bg-white px-2 pr-7 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';

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

function UnitSelect({
  id,
  value,
  ariaLabel,
  options,
  onChange,
  widthClass = 'w-[96px]',
}: {
  id: string;
  value: string;
  ariaLabel: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
  widthClass?: string;
}) {
  return (
    <div className={`relative ${widthClass} shrink-0`}>
      <select
        id={id}
        className={selectClass}
        value={value}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
}

interface OvertimeFormProps {
  input: OvertimeInput;
  errors: OvertimeFieldErrors;
  result: OvertimeResult | null;
  onChange: (input: OvertimeInput) => void;
}

export function OvertimeForm({
  input,
  errors,
  result,
  onChange,
}: OvertimeFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const regularSymbol = getCurrencySymbol(input.regularPayCurrency);
  const otRateSymbol = getCurrencySymbol(input.overtimePayCurrency);
  const regularTotalSymbol = getCurrencySymbol(input.totalRegularPayCurrency);
  const otTotalSymbol = getCurrencySymbol(input.totalOvertimePayCurrency);
  const totalSymbol = getCurrencySymbol(input.totalPayCurrency);

  const set = (patch: Partial<OvertimeInput>) => {
    setConversionError(null);
    onChange({ ...input, ...patch });
  };

  const canConvertPair = (from: SupportedCurrency, to: SupportedCurrency) => {
    if (from === to) return true;
    return (
      rates.available &&
      isCurrencyRateUsable(rates.rates, from) &&
      isCurrencyRateUsable(rates.rates, to)
    );
  };

  const convertFieldAmount = (
    amount: number,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): number | null => {
    if (from === to) return amount;
    if (!canConvertPair(from, to)) return null;
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    return converted.ok ? converted.amount : null;
  };

  const weeklyHoursHint = (() => {
    const raw = Number(String(input.regularWorkTime).trim().replace(/,/g, ''));
    if (!Number.isFinite(raw) || !(raw > 0)) return null;
    return toWeeklyHours(
      raw,
      input.regularWorkDurationUnit,
      input.regularWorkFrequency
    );
  })();

  const handleRegularPayCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.regularPayCurrency) return;
    const amount = parseMoneyInput(input.regularPay);
    if (!Number.isFinite(amount)) {
      set({ regularPayCurrency: next });
      return;
    }
    const converted = convertFieldAmount(amount, input.regularPayCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    set({
      regularPayCurrency: next,
      regularPay: moneyAmountToInputString(converted),
    });
  };

  const handleRegularPayPeriodChange = (next: RatePeriod) => {
    if (next === input.regularPayPeriod) return;
    const amount = parseMoneyInput(input.regularPay);
    if (!Number.isFinite(amount) || weeklyHoursHint === null || !(weeklyHoursHint > 0)) {
      set({ regularPayPeriod: next });
      return;
    }
    const hourly = toHourlyRate(amount, input.regularPayPeriod, weeklyHoursHint);
    if (hourly === null) {
      set({ regularPayPeriod: next });
      return;
    }
    const reexpressed = fromHourlyRate(hourly, next, weeklyHoursHint);
    if (reexpressed === null) {
      set({ regularPayPeriod: next });
      return;
    }
    set({
      regularPayPeriod: next,
      regularPay: moneyAmountToInputString(reexpressed),
    });
  };

  const handleResultCurrencyChange = (
    key:
      | 'overtimePayCurrency'
      | 'totalRegularPayCurrency'
      | 'totalOvertimePayCurrency'
      | 'totalPayCurrency',
    next: SupportedCurrency
  ) => {
    if (next === input[key]) return;
    if (next !== input.regularPayCurrency && !canConvertPair(input.regularPayCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    set({ [key]: next } as Partial<OvertimeInput>);
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="sr-only">Regular work time</legend>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => set({ regularSectionOpen: !input.regularSectionOpen })}
          aria-expanded={input.regularSectionOpen}
        >
          <span className="text-[13px] font-semibold text-accent">Regular work time</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              input.regularSectionOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {input.regularSectionOpen ? (
          <div className="space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="fl-ot-regular-pay">
                <span>Regular pay</span>
                <InfoTooltip
                  label="Regular pay"
                  text="Base wage before overtime. Choose the period this rate applies to (hour, day, week, month, or year)."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.regularPay}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {regularSymbol}
                  </span>
                  <input
                    id="fl-ot-regular-pay"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.regularPay}
                    aria-invalid={Boolean(errors.regularPay)}
                    onChange={(e) => set({ regularPay: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[100px] shrink-0 sm:w-[110px]">
                  <CurrencySelect
                    id="fl-ot-regular-pay-currency"
                    value={input.regularPayCurrency}
                    onChange={handleRegularPayCurrencyChange}
                    aria-label="Regular pay currency"
                  />
                </div>
                <UnitSelect
                  id="fl-ot-regular-pay-period"
                  value={input.regularPayPeriod}
                  ariaLabel="Regular pay period"
                  options={RATE_PERIOD_OPTIONS}
                  onChange={(v) => handleRegularPayPeriodChange(v as RatePeriod)}
                  widthClass="w-[88px]"
                />
              </div>
              {errors.regularPay ? (
                <p className="mt-1 text-xs text-rose-600">{errors.regularPay}</p>
              ) : null}
              {conversionError ? (
                <p className="mt-1 text-xs text-rose-600" role="alert">
                  {conversionError}
                </p>
              ) : null}
              {ratesStatus.warning && !conversionError ? (
                <p className="mt-1 text-xs text-amber-700">{ratesStatus.warning}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="fl-ot-regular-time">
                Regular work time
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.regularWorkTime}>
                  <input
                    id="fl-ot-regular-time"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.regularWorkTime}
                    aria-invalid={Boolean(errors.regularWorkTime)}
                    onChange={(e) => set({ regularWorkTime: e.target.value })}
                  />
                </FieldShell>
                <UnitSelect
                  id="fl-ot-regular-duration"
                  value={input.regularWorkDurationUnit}
                  ariaLabel="Regular work duration unit"
                  options={DURATION_UNIT_OPTIONS}
                  onChange={(v) =>
                    set({ regularWorkDurationUnit: v as DurationUnit })
                  }
                />
                <UnitSelect
                  id="fl-ot-regular-freq"
                  value={input.regularWorkFrequency}
                  ariaLabel="Regular work frequency"
                  options={PAY_FREQUENCY_OPTIONS}
                  onChange={(v) =>
                    set({ regularWorkFrequency: v as PayFrequency })
                  }
                  widthClass="w-[88px]"
                />
              </div>
              {errors.regularWorkTime ? (
                <p className="mt-1 text-xs text-rose-600">{errors.regularWorkTime}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="fl-ot-total-regular">
                Total regular pay
              </label>
              <div className="flex gap-2">
                <FieldShell muted>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {regularTotalSymbol}
                  </span>
                  <input
                    id="fl-ot-total-regular"
                    className={`${inputClass} font-semibold`}
                    readOnly
                    value={result ? result.formattedTotalRegularPay : ''}
                    aria-live="polite"
                  />
                </FieldShell>
                <div className="w-[100px] shrink-0 sm:w-[110px]">
                  <CurrencySelect
                    id="fl-ot-total-regular-currency"
                    value={input.totalRegularPayCurrency}
                    onChange={(next) =>
                      handleResultCurrencyChange('totalRegularPayCurrency', next)
                    }
                    aria-label="Total regular pay currency"
                  />
                </div>
                <UnitSelect
                  id="fl-ot-total-regular-freq"
                  value={input.totalRegularPayFrequency}
                  ariaLabel="Total regular pay frequency"
                  options={PAY_FREQUENCY_OPTIONS}
                  onChange={(v) =>
                    set({ totalRegularPayFrequency: v as PayFrequency })
                  }
                  widthClass="w-[88px]"
                />
              </div>
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="sr-only">Overtime</legend>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => set({ overtimeSectionOpen: !input.overtimeSectionOpen })}
          aria-expanded={input.overtimeSectionOpen}
        >
          <span className="text-[13px] font-semibold text-accent">Overtime</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              input.overtimeSectionOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {input.overtimeSectionOpen ? (
          <div className="space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="fl-ot-multiplier">
                <span>Overtime pay multiplier</span>
                <InfoTooltip
                  label="Overtime pay multiplier"
                  text="Typical time-and-a-half is 1.5. Overtime hourly rate = regular hourly rate × multiplier."
                />
              </label>
              <FieldShell error={errors.overtimeMultiplier}>
                <input
                  id="fl-ot-multiplier"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.overtimeMultiplier}
                  aria-invalid={Boolean(errors.overtimeMultiplier)}
                  onChange={(e) => set({ overtimeMultiplier: e.target.value })}
                />
              </FieldShell>
              {errors.overtimeMultiplier ? (
                <p className="mt-1 text-xs text-rose-600">{errors.overtimeMultiplier}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="fl-ot-pay-rate">
                Overtime pay
              </label>
              <div className="flex gap-2">
                <FieldShell muted>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {otRateSymbol}
                  </span>
                  <input
                    id="fl-ot-pay-rate"
                    className={`${inputClass} font-semibold`}
                    readOnly
                    value={result ? result.formattedHourlyOvertimeRate : ''}
                    aria-live="polite"
                  />
                </FieldShell>
                <div className="w-[100px] shrink-0 sm:w-[110px]">
                  <CurrencySelect
                    id="fl-ot-pay-rate-currency"
                    value={input.overtimePayCurrency}
                    onChange={(next) =>
                      handleResultCurrencyChange('overtimePayCurrency', next)
                    }
                    aria-label="Overtime pay currency"
                  />
                </div>
                <UnitSelect
                  id="fl-ot-pay-rate-period"
                  value={input.overtimePayPeriod}
                  ariaLabel="Overtime pay period"
                  options={RATE_PERIOD_OPTIONS}
                  onChange={(v) => set({ overtimePayPeriod: v as RatePeriod })}
                  widthClass="w-[88px]"
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="fl-ot-hours">
                Overtime hours
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.overtimeHours}>
                  <input
                    id="fl-ot-hours"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.overtimeHours}
                    aria-invalid={Boolean(errors.overtimeHours)}
                    onChange={(e) => set({ overtimeHours: e.target.value })}
                  />
                </FieldShell>
                <UnitSelect
                  id="fl-ot-hours-duration"
                  value={input.overtimeHoursDurationUnit}
                  ariaLabel="Overtime hours duration unit"
                  options={DURATION_UNIT_OPTIONS}
                  onChange={(v) =>
                    set({ overtimeHoursDurationUnit: v as DurationUnit })
                  }
                />
                <UnitSelect
                  id="fl-ot-hours-freq"
                  value={input.overtimeHoursFrequency}
                  ariaLabel="Overtime hours frequency"
                  options={PAY_FREQUENCY_OPTIONS}
                  onChange={(v) =>
                    set({ overtimeHoursFrequency: v as PayFrequency })
                  }
                  widthClass="w-[88px]"
                />
              </div>
              {errors.overtimeHours ? (
                <p className="mt-1 text-xs text-rose-600">{errors.overtimeHours}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="fl-ot-total-ot">
                Total overtime pay
              </label>
              <div className="flex gap-2">
                <FieldShell muted>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {otTotalSymbol}
                  </span>
                  <input
                    id="fl-ot-total-ot"
                    className={`${inputClass} font-semibold`}
                    readOnly
                    value={result ? result.formattedTotalOvertimePay : ''}
                    aria-live="polite"
                  />
                </FieldShell>
                <div className="w-[100px] shrink-0 sm:w-[110px]">
                  <CurrencySelect
                    id="fl-ot-total-ot-currency"
                    value={input.totalOvertimePayCurrency}
                    onChange={(next) =>
                      handleResultCurrencyChange('totalOvertimePayCurrency', next)
                    }
                    aria-label="Total overtime pay currency"
                  />
                </div>
                <UnitSelect
                  id="fl-ot-total-ot-freq"
                  value={input.totalOvertimePayFrequency}
                  ariaLabel="Total overtime pay frequency"
                  options={PAY_FREQUENCY_OPTIONS}
                  onChange={(v) =>
                    set({ totalOvertimePayFrequency: v as PayFrequency })
                  }
                  widthClass="w-[88px]"
                />
              </div>
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">In total</legend>
        <div>
          <label className={labelClass} htmlFor="fl-ot-total-pay">
            Total pay
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {totalSymbol}
              </span>
              <input
                id="fl-ot-total-pay"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotalPay : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[100px] shrink-0 sm:w-[110px]">
              <CurrencySelect
                id="fl-ot-total-pay-currency"
                value={input.totalPayCurrency}
                onChange={(next) =>
                  handleResultCurrencyChange('totalPayCurrency', next)
                }
                aria-label="Total pay currency"
              />
            </div>
            <UnitSelect
              id="fl-ot-total-pay-freq"
              value={input.totalPayFrequency}
              ariaLabel="Total pay frequency"
              options={PAY_FREQUENCY_OPTIONS}
              onChange={(v) => set({ totalPayFrequency: v as PayFrequency })}
              widthClass="w-[88px]"
            />
          </div>
        </div>
        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>
    </form>
  );
}
