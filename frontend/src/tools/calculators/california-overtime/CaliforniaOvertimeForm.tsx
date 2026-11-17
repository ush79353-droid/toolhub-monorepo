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
import type {
  CaliforniaOvertimeFieldErrors,
  CaliforniaOvertimeInput,
  CaliforniaOvertimeResult,
  DurationPeriod,
  PayRateUnit,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 w-full appearance-none rounded-lg border border-border bg-white px-2.5 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';

const PAY_RATE_UNITS: readonly { value: PayRateUnit; label: string }[] = [
  { value: 'hour', label: 'hour' },
  { value: 'day', label: 'day' },
  { value: 'week', label: 'week' },
  { value: 'month', label: 'month' },
  { value: 'year', label: 'year' },
];

const DURATION_PERIODS: readonly { value: DurationPeriod; label: string }[] = [
  { value: 'day', label: 'day' },
  { value: 'week', label: 'week' },
  { value: 'month', label: 'month' },
  { value: 'year', label: 'year' },
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

interface CaliforniaOvertimeFormProps {
  input: CaliforniaOvertimeInput;
  errors: CaliforniaOvertimeFieldErrors;
  result: CaliforniaOvertimeResult | null;
  onChange: (input: CaliforniaOvertimeInput) => void;
}

export function CaliforniaOvertimeForm({
  input,
  errors,
  result,
  onChange,
}: CaliforniaOvertimeFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [regularOpen, setRegularOpen] = React.useState(true);
  const [overtimeOpen, setOvertimeOpen] = React.useState(true);

  const regularSymbol = getCurrencySymbol(input.regularPayCurrency);
  const totalRegularSymbol = getCurrencySymbol(input.totalRegularPayCurrency);
  const otPaySymbol = getCurrencySymbol(input.overtimePayCurrency);
  const totalOtSymbol = getCurrencySymbol(input.totalOvertimePayCurrency);
  const totalPaySymbol = getCurrencySymbol(input.totalPayCurrency);

  const set = (patch: Partial<CaliforniaOvertimeInput>) => {
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

  const handleRegularPayCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.regularPayCurrency) return;
    const amount = parseMoneyInput(input.regularPay);
    if (!Number.isFinite(amount)) {
      const displayTargets = [
        input.totalRegularPayCurrency,
        input.overtimePayCurrency,
        input.totalOvertimePayCurrency,
        input.totalPayCurrency,
      ];
      if (displayTargets.some((c) => c !== next && !canConvertPair(next, c))) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, regularPayCurrency: next });
      return;
    }
    if (!canConvertPair(input.regularPayCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertFieldAmount(amount, input.regularPayCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      regularPayCurrency: next,
      regularPay: moneyAmountToInputString(converted),
    });
  };

  const handleDisplayCurrencyChange = (
    key:
      | 'totalRegularPayCurrency'
      | 'overtimePayCurrency'
      | 'totalOvertimePayCurrency'
      | 'totalPayCurrency',
    next: SupportedCurrency
  ) => {
    if (next === input[key]) return;
    if (next !== input.regularPayCurrency && !canConvertPair(input.regularPayCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, [key]: next });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <CollapsibleSection
        title="Regular work time"
        open={regularOpen}
        onToggle={() => setRegularOpen((v) => !v)}
      >
        <div>
          <label className={labelClass} htmlFor="ca-ot-regular-pay">
            <span>Regular pay</span>
            <InfoTooltip
              label="Regular pay"
              text="Base pay rate. Converted to hourly using your regular work schedule before monthly pay is computed."
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <FieldShell error={errors.regularPay}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {regularSymbol}
              </span>
              <input
                id="ca-ot-regular-pay"
                className={inputClass}
                inputMode="decimal"
                value={input.regularPay}
                aria-invalid={Boolean(errors.regularPay)}
                onChange={(e) => set({ regularPay: e.target.value })}
              />
            </FieldShell>
            <div className="w-[100px] shrink-0 sm:w-[110px]">
              <CurrencySelect
                id="ca-ot-regular-pay-currency"
                value={input.regularPayCurrency}
                onChange={handleRegularPayCurrencyChange}
                aria-label="Regular pay currency"
              />
            </div>
            <div className="w-[96px] shrink-0">
              <select
                className={unitSelectClass}
                value={input.regularPayUnit}
                aria-label="Regular pay period"
                onChange={(e) => set({ regularPayUnit: e.target.value as PayRateUnit })}
              >
                {PAY_RATE_UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {errors.regularPay ? (
            <p className="mt-1 text-xs text-rose-600">{errors.regularPay}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ca-ot-regular-hours">
            <span>Regular work time</span>
          </label>
          <div className="flex flex-wrap gap-2">
            <FieldShell error={errors.regularWorkTime}>
              <input
                id="ca-ot-regular-hours"
                className={inputClass}
                inputMode="decimal"
                value={input.regularWorkTime}
                aria-invalid={Boolean(errors.regularWorkTime)}
                onChange={(e) => set({ regularWorkTime: e.target.value })}
              />
            </FieldShell>
            <div className="flex h-11 w-[88px] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30 px-2 text-sm text-muted-foreground">
              hours
            </div>
            <div className="w-[96px] shrink-0">
              <select
                className={unitSelectClass}
                value={input.regularWorkPeriod}
                aria-label="Regular work time period"
                onChange={(e) =>
                  set({ regularWorkPeriod: e.target.value as DurationPeriod })
                }
              >
                {DURATION_PERIODS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {errors.regularWorkTime ? (
            <p className="mt-1 text-xs text-rose-600">{errors.regularWorkTime}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ca-ot-total-regular">
            <span>Total regular pay</span>
          </label>
          <div className="flex flex-wrap gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {totalRegularSymbol}
              </span>
              <input
                id="ca-ot-total-regular"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotalRegularPay : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[100px] shrink-0 sm:w-[110px]">
              <CurrencySelect
                id="ca-ot-total-regular-currency"
                value={input.totalRegularPayCurrency}
                onChange={(c) => handleDisplayCurrencyChange('totalRegularPayCurrency', c)}
                aria-label="Total regular pay currency"
              />
            </div>
            <div className="flex h-11 w-[96px] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30 px-2 text-sm text-muted-foreground">
              month
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Overtime"
        open={overtimeOpen}
        onToggle={() => setOvertimeOpen((v) => !v)}
      >
        <div>
          <label className={labelClass} htmlFor="ca-ot-multiplier">
            <span>Overtime pay multiplier</span>
            <InfoTooltip
              label="Overtime pay multiplier"
              text="Typical California time-and-a-half is 1.5×. This tool multiplies the hourly rate by this factor; it does not apply daily or seventh-day statutory rules."
            />
          </label>
          <FieldShell error={errors.overtimeMultiplier}>
            <input
              id="ca-ot-multiplier"
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
          <label className={labelClass} htmlFor="ca-ot-ot-rate">
            <span>Overtime pay</span>
          </label>
          <div className="flex flex-wrap gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {otPaySymbol}
              </span>
              <input
                id="ca-ot-ot-rate"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedOvertimePay : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[100px] shrink-0 sm:w-[110px]">
              <CurrencySelect
                id="ca-ot-ot-rate-currency"
                value={input.overtimePayCurrency}
                onChange={(c) => handleDisplayCurrencyChange('overtimePayCurrency', c)}
                aria-label="Overtime pay currency"
              />
            </div>
            <div className="w-[96px] shrink-0">
              <select
                className={unitSelectClass}
                value={input.overtimePayUnit}
                aria-label="Overtime pay period"
                onChange={(e) => set({ overtimePayUnit: e.target.value as PayRateUnit })}
              >
                {PAY_RATE_UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="ca-ot-ot-hours">
            <span>Overtime hours</span>
          </label>
          <div className="flex flex-wrap gap-2">
            <FieldShell error={errors.overtimeHours}>
              <input
                id="ca-ot-ot-hours"
                className={inputClass}
                inputMode="decimal"
                value={input.overtimeHours}
                aria-invalid={Boolean(errors.overtimeHours)}
                onChange={(e) => set({ overtimeHours: e.target.value })}
              />
            </FieldShell>
            <div className="flex h-11 w-[88px] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30 px-2 text-sm text-muted-foreground">
              hours
            </div>
            <div className="w-[96px] shrink-0">
              <select
                className={unitSelectClass}
                value={input.overtimeHoursPeriod}
                aria-label="Overtime hours period"
                onChange={(e) =>
                  set({ overtimeHoursPeriod: e.target.value as DurationPeriod })
                }
              >
                {DURATION_PERIODS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {errors.overtimeHours ? (
            <p className="mt-1 text-xs text-rose-600">{errors.overtimeHours}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ca-ot-total-ot">
            <span>Total overtime pay</span>
          </label>
          <div className="flex flex-wrap gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {totalOtSymbol}
              </span>
              <input
                id="ca-ot-total-ot"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotalOvertimePay : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[100px] shrink-0 sm:w-[110px]">
              <CurrencySelect
                id="ca-ot-total-ot-currency"
                value={input.totalOvertimePayCurrency}
                onChange={(c) =>
                  handleDisplayCurrencyChange('totalOvertimePayCurrency', c)
                }
                aria-label="Total overtime pay currency"
              />
            </div>
            <div className="flex h-11 w-[96px] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30 px-2 text-sm text-muted-foreground">
              month
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">In total</legend>
        <div>
          <label className={labelClass} htmlFor="ca-ot-total-pay">
            <span>Total pay</span>
          </label>
          <div className="flex flex-wrap gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {totalPaySymbol}
              </span>
              <input
                id="ca-ot-total-pay"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedTotalPay : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[100px] shrink-0 sm:w-[110px]">
              <CurrencySelect
                id="ca-ot-total-pay-currency"
                value={input.totalPayCurrency}
                onChange={(c) => handleDisplayCurrencyChange('totalPayCurrency', c)}
                aria-label="Total pay currency"
              />
            </div>
            <div className="flex h-11 w-[96px] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30 px-2 text-sm text-muted-foreground">
              month
            </div>
          </div>
        </div>
      </fieldset>

      {conversionError || ratesStatus.warning ? (
        <p
          className={`text-xs ${conversionError ? 'text-rose-600' : 'text-amber-700'}`}
          role="status"
        >
          {conversionError || ratesStatus.warning}
        </p>
      ) : null}
      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
