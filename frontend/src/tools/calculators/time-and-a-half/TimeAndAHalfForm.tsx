'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  TimeAndAHalfFieldErrors,
  TimeAndAHalfInput,
  TimeAndAHalfResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

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

type MoneyCurrencyKey = keyof Pick<
  TimeAndAHalfInput,
  | 'standardRateCurrency'
  | 'timeAndHalfRateCurrency'
  | 'doubleTimeRateCurrency'
  | 'tripleTimeRateCurrency'
  | 'standardPayCurrency'
  | 'timeAndHalfPayCurrency'
  | 'doubleTimePayCurrency'
  | 'tripleTimePayCurrency'
  | 'totalPayCurrency'
>;

interface MoneyRowProps {
  id: string;
  label: string;
  tooltip: string;
  value: string;
  currency: SupportedCurrency;
  currencyKey: MoneyCurrencyKey;
  error?: string;
  readOnly?: boolean;
  editable?: boolean;
  onAmountChange?: (value: string) => void;
  onCurrencyChange: (key: MoneyCurrencyKey, next: SupportedCurrency) => void;
}

function MoneyRow({
  id,
  label,
  tooltip,
  value,
  currency,
  currencyKey,
  error,
  readOnly,
  editable,
  onAmountChange,
  onCurrencyChange,
}: MoneyRowProps) {
  const symbol = getCurrencySymbol(currency);
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tooltip} />
      </label>
      <div className="flex gap-2">
        <FieldShell error={error} muted={readOnly}>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {symbol}
          </span>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={value}
            readOnly={readOnly}
            tabIndex={readOnly ? -1 : undefined}
            aria-invalid={Boolean(error)}
            aria-live={readOnly ? 'polite' : undefined}
            onChange={
              editable && onAmountChange
                ? (e) => onAmountChange(e.target.value)
                : undefined
            }
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={(next) => onCurrencyChange(currencyKey, next)}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

interface HoursRowProps {
  id: string;
  label: string;
  tooltip: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

function HoursRow({ id, label, tooltip, value, error, onChange }: HoursRowProps) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tooltip} />
      </label>
      <div className="flex gap-2">
        <FieldShell error={error}>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={value}
            aria-invalid={Boolean(error)}
            onChange={(e) => onChange(e.target.value)}
          />
        </FieldShell>
        <div className="flex h-11 w-[88px] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground">
          hours
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

interface TimeAndAHalfFormProps {
  input: TimeAndAHalfInput;
  errors: TimeAndAHalfFieldErrors;
  result: TimeAndAHalfResult | null;
  onChange: (input: TimeAndAHalfInput) => void;
  onMoneyCurrencyChange: (key: MoneyCurrencyKey, next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function TimeAndAHalfForm({
  input,
  errors,
  result,
  onChange,
  onMoneyCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: TimeAndAHalfFormProps) {
  const set = (patch: Partial<TimeAndAHalfInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => set({ ratesOpen: !input.ratesOpen })}
          aria-expanded={input.ratesOpen}
        >
          <span className="text-[13px] font-semibold text-accent">
            Hourly pay rates
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              input.ratesOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        {input.ratesOpen ? (
          <div className="space-y-3.5 pt-1">
            <MoneyRow
              id="tah-standard-rate"
              label="Standard pay rate"
              tooltip="Authoritative hourly rate. Premium rates are 1.5×, 2×, and 3× this value."
              value={input.standardRate}
              currency={input.standardRateCurrency}
              currencyKey="standardRateCurrency"
              error={errors.standardRate}
              editable
              onAmountChange={(value) => set({ standardRate: value })}
              onCurrencyChange={onMoneyCurrencyChange}
            />
            <MoneyRow
              id="tah-half-rate"
              label="Time and a half rate"
              tooltip="Standard × 1.5 (read-only)."
              value={result ? result.formattedTimeAndHalfRate : ''}
              currency={input.timeAndHalfRateCurrency}
              currencyKey="timeAndHalfRateCurrency"
              readOnly
              onCurrencyChange={onMoneyCurrencyChange}
            />
            <MoneyRow
              id="tah-double-rate"
              label="Double time pay rate"
              tooltip="Standard × 2 (read-only)."
              value={result ? result.formattedDoubleTimeRate : ''}
              currency={input.doubleTimeRateCurrency}
              currencyKey="doubleTimeRateCurrency"
              readOnly
              onCurrencyChange={onMoneyCurrencyChange}
            />
            <MoneyRow
              id="tah-triple-rate"
              label="Triple time pay rate"
              tooltip="Standard × 3 (read-only)."
              value={result ? result.formattedTripleTimeRate : ''}
              currency={input.tripleTimeRateCurrency}
              currencyKey="tripleTimeRateCurrency"
              readOnly
              onCurrencyChange={onMoneyCurrencyChange}
            />
          </div>
        ) : null}
      </div>

      <div className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => set({ hoursOpen: !input.hoursOpen })}
          aria-expanded={input.hoursOpen}
        >
          <span className="text-[13px] font-semibold text-accent">
            Number of hours worked
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              input.hoursOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        {input.hoursOpen ? (
          <div className="space-y-3.5 pt-1">
            <HoursRow
              id="tah-standard-hours"
              label="Standard hours worked"
              tooltip="Hours paid at the standard rate. Blank counts as zero. Fractional hours allowed."
              value={input.standardHours}
              error={errors.standardHours}
              onChange={(value) => set({ standardHours: value })}
            />
            <HoursRow
              id="tah-half-hours"
              label="Hours worked at time and a half"
              tooltip="Hours paid at 1.5×. Not auto-classified from a weekly threshold."
              value={input.timeAndHalfHours}
              error={errors.timeAndHalfHours}
              onChange={(value) => set({ timeAndHalfHours: value })}
            />
            <HoursRow
              id="tah-double-hours"
              label="Hours worked for double time"
              tooltip="Hours paid at 2×."
              value={input.doubleTimeHours}
              error={errors.doubleTimeHours}
              onChange={(value) => set({ doubleTimeHours: value })}
            />
            <HoursRow
              id="tah-triple-hours"
              label="Hours worked for triple time"
              tooltip="Hours paid at 3×."
              value={input.tripleTimeHours}
              error={errors.tripleTimeHours}
              onChange={(value) => set({ tripleTimeHours: value })}
            />
          </div>
        ) : null}
      </div>

      <div className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => set({ earningsOpen: !input.earningsOpen })}
          aria-expanded={input.earningsOpen}
        >
          <span className="text-[13px] font-semibold text-accent">
            Amount of money earned
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              input.earningsOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        {input.earningsOpen ? (
          <div className="space-y-3.5 pt-1">
            <MoneyRow
              id="tah-standard-pay"
              label="Total pay for standard hours"
              tooltip="Standard rate × standard hours."
              value={result ? result.formattedStandardPay : ''}
              currency={input.standardPayCurrency}
              currencyKey="standardPayCurrency"
              readOnly
              onCurrencyChange={onMoneyCurrencyChange}
            />
            <MoneyRow
              id="tah-half-pay"
              label="Total time and a half pay"
              tooltip="(Standard × 1.5) × time-and-a-half hours."
              value={result ? result.formattedTimeAndHalfPay : ''}
              currency={input.timeAndHalfPayCurrency}
              currencyKey="timeAndHalfPayCurrency"
              readOnly
              onCurrencyChange={onMoneyCurrencyChange}
            />
            <MoneyRow
              id="tah-double-pay"
              label="Total double time pay"
              tooltip="(Standard × 2) × double-time hours."
              value={result ? result.formattedDoubleTimePay : ''}
              currency={input.doubleTimePayCurrency}
              currencyKey="doubleTimePayCurrency"
              readOnly
              onCurrencyChange={onMoneyCurrencyChange}
            />
            <MoneyRow
              id="tah-triple-pay"
              label="Total triple time pay"
              tooltip="(Standard × 3) × triple-time hours."
              value={result ? result.formattedTripleTimePay : ''}
              currency={input.tripleTimePayCurrency}
              currencyKey="tripleTimePayCurrency"
              readOnly
              onCurrencyChange={onMoneyCurrencyChange}
            />
            <MoneyRow
              id="tah-total-pay"
              label="Total amount of money earned"
              tooltip="Sum of all category earnings."
              value={result ? result.formattedTotalPay : ''}
              currency={input.totalPayCurrency}
              currencyKey="totalPayCurrency"
              readOnly
              onCurrencyChange={onMoneyCurrencyChange}
            />
          </div>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        Multipliers and hours are user-entered estimate categories — not an
        automatic legal overtime determination.
      </p>

      <div className="rounded-lg border border-border bg-brand-softTeal/35 px-3 py-2.5 text-sm text-accent">
        Check out{' '}
        <a
          href="#how-to-use"
          className="font-semibold text-primary underline underline-offset-2"
        >
          how to use this calculator!
        </a>
      </div>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {ratesWarning && !conversionError ? (
        <p className="text-xs text-amber-700">{ratesWarning}</p>
      ) : null}
    </form>
  );
}
