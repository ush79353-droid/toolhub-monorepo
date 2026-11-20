'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  PayRaiseCalculatorFieldErrors,
  PayRaiseCalculatorInput,
  PayRaiseCalculatorResult,
  PayRaisePeriodField,
  PayRaiseRaiseSource,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const readOnlyInputClass =
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

interface MoneyRowProps {
  id: string;
  label: string;
  tip: string;
  value: string;
  currency: SupportedCurrency;
  error?: string;
  readOnly?: boolean;
  onAmountChange?: (value: string) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

function MoneyRow({
  id,
  label,
  tip,
  value,
  currency,
  error,
  readOnly,
  onAmountChange,
  onCurrencyChange,
}: MoneyRowProps) {
  const symbol = getCurrencySymbol(currency);
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
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
            className={readOnly ? readOnlyInputClass : inputClass}
            inputMode="decimal"
            value={value}
            readOnly={readOnly}
            aria-invalid={Boolean(error)}
            onChange={
              readOnly || !onAmountChange
                ? undefined
                : (e) => onAmountChange(e.target.value)
            }
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={onCurrencyChange}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

interface PayRaiseFormProps {
  input: PayRaiseCalculatorInput;
  errors: PayRaiseCalculatorFieldErrors;
  result: PayRaiseCalculatorResult | null;
  onChange: (input: PayRaiseCalculatorInput) => void;
  onBeforeCurrencyChange: (
    field: PayRaisePeriodField,
    next: SupportedCurrency
  ) => void;
  onRaiseCurrencyChange: (
    field: PayRaisePeriodField,
    next: SupportedCurrency
  ) => void;
  onAfterCurrencyChange: (
    field: PayRaisePeriodField,
    next: SupportedCurrency
  ) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

function displayBefore(
  field: PayRaisePeriodField,
  input: PayRaiseCalculatorInput,
  result: PayRaiseCalculatorResult | null
): string {
  if (input.beforeSource === field) {
    switch (field) {
      case 'hourly':
        return input.beforeHourly;
      case 'weekly':
        return input.beforeWeekly;
      case 'monthly':
        return input.beforeMonthly;
      case 'annual':
        return input.beforeAnnual;
    }
  }
  if (!result) {
    switch (field) {
      case 'hourly':
        return input.beforeHourly;
      case 'weekly':
        return input.beforeWeekly;
      case 'monthly':
        return input.beforeMonthly;
      case 'annual':
        return input.beforeAnnual;
    }
  }
  switch (field) {
    case 'hourly':
      return result.formattedBeforeHourly;
    case 'weekly':
      return result.formattedBeforeWeekly;
    case 'monthly':
      return result.formattedBeforeMonthly;
    case 'annual':
      return result.formattedBeforeAnnual;
  }
}

function displayRaiseMoney(
  field: PayRaisePeriodField,
  input: PayRaiseCalculatorInput,
  result: PayRaiseCalculatorResult | null
): string {
  if (input.raiseSource === field) {
    switch (field) {
      case 'hourly':
        return input.raiseHourly;
      case 'weekly':
        return input.raiseWeekly;
      case 'monthly':
        return input.raiseMonthly;
      case 'annual':
        return input.raiseAnnual;
    }
  }
  if (!result) {
    switch (field) {
      case 'hourly':
        return input.raiseHourly;
      case 'weekly':
        return input.raiseWeekly;
      case 'monthly':
        return input.raiseMonthly;
      case 'annual':
        return input.raiseAnnual;
    }
  }
  switch (field) {
    case 'hourly':
      return result.formattedRaiseHourly;
    case 'weekly':
      return result.formattedRaiseWeekly;
    case 'monthly':
      return result.formattedRaiseMonthly;
    case 'annual':
      return result.formattedRaiseAnnual;
  }
}

function displayRaisePercentage(
  input: PayRaiseCalculatorInput,
  result: PayRaiseCalculatorResult | null
): string {
  if (input.raiseSource === 'percentage') return input.raisePercentage;
  if (!result) return input.raisePercentage;
  return result.formattedRaisePercentage;
}

export function PayRaiseForm({
  input,
  errors,
  result,
  onChange,
  onBeforeCurrencyChange,
  onRaiseCurrencyChange,
  onAfterCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: PayRaiseFormProps) {
  const [beforeOpen, setBeforeOpen] = useState(true);
  const [raiseOpen, setRaiseOpen] = useState(true);
  const [afterOpen, setAfterOpen] = useState(true);

  const set = (patch: Partial<PayRaiseCalculatorInput>) => {
    onChange({ ...input, ...patch });
  };

  const setBefore = (field: PayRaisePeriodField, value: string) => {
    const patch: Partial<PayRaiseCalculatorInput> = { beforeSource: field };
    switch (field) {
      case 'hourly':
        patch.beforeHourly = value;
        break;
      case 'weekly':
        patch.beforeWeekly = value;
        break;
      case 'monthly':
        patch.beforeMonthly = value;
        break;
      case 'annual':
        patch.beforeAnnual = value;
        break;
    }
    set(patch);
  };

  const setRaise = (source: PayRaiseRaiseSource, value: string) => {
    const patch: Partial<PayRaiseCalculatorInput> = { raiseSource: source };
    switch (source) {
      case 'percentage':
        patch.raisePercentage = value;
        break;
      case 'hourly':
        patch.raiseHourly = value;
        break;
      case 'weekly':
        patch.raiseWeekly = value;
        break;
      case 'monthly':
        patch.raiseMonthly = value;
        break;
      case 'annual':
        patch.raiseAnnual = value;
        break;
    }
    set(patch);
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <div>
          <label className={labelClass} htmlFor="pay-raise-hours">
            <span>Hours per week</span>
            <InfoTooltip
              label="Hours per week"
              text="Used with 52 paid weeks for annual hours. Must be greater than 0 and at most 168. Never FX-converted."
            />
          </label>
          <FieldShell error={errors.hoursPerWeek}>
            <input
              id="pay-raise-hours"
              className={inputClass}
              inputMode="decimal"
              value={input.hoursPerWeek}
              aria-invalid={Boolean(errors.hoursPerWeek)}
              onChange={(e) => set({ hoursPerWeek: e.target.value })}
            />
          </FieldShell>
          {errors.hoursPerWeek ? (
            <p className="mt-1 text-xs text-rose-600">{errors.hoursPerWeek}</p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              Default 40. Fractional hours allowed.
            </p>
          )}
        </div>
      </div>

      <CollapsibleSection
        title="Pay before raise"
        open={beforeOpen}
        onToggle={() => setBeforeOpen((v) => !v)}
      >
        <MoneyRow
          id="pay-raise-before-hourly"
          label="Hourly"
          tip="Pay per hour before the raise. Editing this makes it the authoritative before-raise amount."
          value={displayBefore('hourly', input, result)}
          currency={input.beforeHourlyCurrency}
          error={errors.beforeHourly}
          onAmountChange={(v) => setBefore('hourly', v)}
          onCurrencyChange={(next) => onBeforeCurrencyChange('hourly', next)}
        />
        <MoneyRow
          id="pay-raise-before-weekly"
          label="Weekly"
          tip="Weekly pay before the raise. Derived from annual ÷ 52 when another before-raise field is authoritative."
          value={displayBefore('weekly', input, result)}
          currency={input.beforeWeeklyCurrency}
          error={errors.beforeWeekly}
          onAmountChange={(v) => setBefore('weekly', v)}
          onCurrencyChange={(next) => onBeforeCurrencyChange('weekly', next)}
        />
        <MoneyRow
          id="pay-raise-before-monthly"
          label="Monthly"
          tip="Monthly pay before the raise. Derived from annual ÷ 12 (not 4× weekly)."
          value={displayBefore('monthly', input, result)}
          currency={input.beforeMonthlyCurrency}
          error={errors.beforeMonthly}
          onAmountChange={(v) => setBefore('monthly', v)}
          onCurrencyChange={(next) => onBeforeCurrencyChange('monthly', next)}
        />
        <MoneyRow
          id="pay-raise-before-annual"
          label="Annual"
          tip="Annual pay before the raise. Canonical annual = hourly × hours × 52."
          value={displayBefore('annual', input, result)}
          currency={input.beforeAnnualCurrency}
          error={errors.beforeAnnual}
          onAmountChange={(v) => setBefore('annual', v)}
          onCurrencyChange={(next) => onBeforeCurrencyChange('annual', next)}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Raise"
        open={raiseOpen}
        onToggle={() => setRaiseOpen((v) => !v)}
      >
        <div>
          <label className={labelClass} htmlFor="pay-raise-percentage">
            <span>Percentage</span>
            <InfoTooltip
              label="Percentage"
              text="Raise as a percent of before-raise annual pay. Editing this makes percentage the authoritative raise. Hours and % never FX-convert."
            />
          </label>
          <FieldShell error={errors.raisePercentage}>
            <input
              id="pay-raise-percentage"
              className={inputClass}
              inputMode="decimal"
              value={displayRaisePercentage(input, result)}
              aria-invalid={Boolean(errors.raisePercentage)}
              onChange={(e) => setRaise('percentage', e.target.value)}
            />
            <span
              className="shrink-0 pr-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              %
            </span>
          </FieldShell>
          {errors.raisePercentage ? (
            <p className="mt-1 text-xs text-rose-600">{errors.raisePercentage}</p>
          ) : result?.percentageUndefined ? (
            <p className="mt-1 text-xs text-amber-700">
              Percentage increase is undefined when original pay is zero and the
              raise is positive.
            </p>
          ) : null}
        </div>

        <MoneyRow
          id="pay-raise-raise-hourly"
          label="Hourly"
          tip="Monetary raise per hour. Editing this makes the hourly raise authoritative (not stacked with percentage)."
          value={displayRaiseMoney('hourly', input, result)}
          currency={input.raiseHourlyCurrency}
          error={errors.raiseHourly}
          onAmountChange={(v) => setRaise('hourly', v)}
          onCurrencyChange={(next) => onRaiseCurrencyChange('hourly', next)}
        />
        <MoneyRow
          id="pay-raise-raise-weekly"
          label="Weekly"
          tip="Monetary raise per week. Synchronized from the authoritative raise input."
          value={displayRaiseMoney('weekly', input, result)}
          currency={input.raiseWeeklyCurrency}
          error={errors.raiseWeekly}
          onAmountChange={(v) => setRaise('weekly', v)}
          onCurrencyChange={(next) => onRaiseCurrencyChange('weekly', next)}
        />
        <MoneyRow
          id="pay-raise-raise-monthly"
          label="Monthly"
          tip="Monetary raise per month. Synchronized from the authoritative raise input."
          value={displayRaiseMoney('monthly', input, result)}
          currency={input.raiseMonthlyCurrency}
          error={errors.raiseMonthly}
          onAmountChange={(v) => setRaise('monthly', v)}
          onCurrencyChange={(next) => onRaiseCurrencyChange('monthly', next)}
        />
        <MoneyRow
          id="pay-raise-raise-annual"
          label="Annual"
          tip="Monetary raise per year. Synchronized from the authoritative raise input."
          value={displayRaiseMoney('annual', input, result)}
          currency={input.raiseAnnualCurrency}
          error={errors.raiseAnnual}
          onAmountChange={(v) => setRaise('annual', v)}
          onCurrencyChange={(next) => onRaiseCurrencyChange('annual', next)}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Pay after raise"
        open={afterOpen}
        onToggle={() => setAfterOpen((v) => !v)}
      >
        <MoneyRow
          id="pay-raise-after-hourly"
          label="Hourly"
          tip="Hourly pay after applying the raise. Calculated from before-raise + raise; reverse editing is not supported."
          value={result ? result.formattedAfterHourly : ''}
          currency={input.afterHourlyCurrency}
          readOnly
          onCurrencyChange={(next) => onAfterCurrencyChange('hourly', next)}
        />
        <MoneyRow
          id="pay-raise-after-weekly"
          label="Weekly"
          tip="Weekly pay after the raise (annual ÷ 52)."
          value={result ? result.formattedAfterWeekly : ''}
          currency={input.afterWeeklyCurrency}
          readOnly
          onCurrencyChange={(next) => onAfterCurrencyChange('weekly', next)}
        />
        <MoneyRow
          id="pay-raise-after-monthly"
          label="Monthly"
          tip="Monthly pay after the raise (annual ÷ 12)."
          value={result ? result.formattedAfterMonthly : ''}
          currency={input.afterMonthlyCurrency}
          readOnly
          onCurrencyChange={(next) => onAfterCurrencyChange('monthly', next)}
        />
        <MoneyRow
          id="pay-raise-after-annual"
          label="Annual"
          tip="Annual pay after the raise = before-raise annual + annual raise."
          value={result ? result.formattedAfterAnnual : ''}
          currency={input.afterAnnualCurrency}
          readOnly
          onCurrencyChange={(next) => onAfterCurrencyChange('annual', next)}
        />
      </CollapsibleSection>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {ratesWarning ? (
        <p className="text-xs text-amber-700" role="status">
          {ratesWarning}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
