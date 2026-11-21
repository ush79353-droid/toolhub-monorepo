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
  OperatingCashFlowFieldErrors,
  OperatingCashFlowInput,
  OperatingCashFlowResult,
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

interface MoneyFieldProps {
  id: string;
  label: string;
  tooltip: string;
  value: string;
  currency: SupportedCurrency;
  error?: string;
  onValueChange: (value: string) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  currencyAriaLabel: string;
}

function MoneyInputField({
  id,
  label,
  tooltip,
  value,
  currency,
  error,
  onValueChange,
  onCurrencyChange,
  currencyAriaLabel,
}: MoneyFieldProps) {
  const symbol = getCurrencySymbol(currency);
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tooltip} />
      </label>
      <div className="flex gap-2">
        <FieldShell error={error}>
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
            aria-invalid={Boolean(error)}
            onChange={(e) => onValueChange(e.target.value)}
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={onCurrencyChange}
            aria-label={currencyAriaLabel}
          />
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

interface MoneyResultProps {
  id: string;
  label: string;
  tooltip: string;
  value: string;
  currency: SupportedCurrency;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  currencyAriaLabel: string;
  note?: ReactNode;
}

function MoneyResultField({
  id,
  label,
  tooltip,
  value,
  currency,
  onCurrencyChange,
  currencyAriaLabel,
  note,
}: MoneyResultProps) {
  const symbol = getCurrencySymbol(currency);
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tooltip} />
      </label>
      <div className="flex gap-2">
        <FieldShell muted>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {symbol}
          </span>
          <input
            id={id}
            className={`${inputClass} text-accent`}
            readOnly
            tabIndex={-1}
            value={value}
            aria-live="polite"
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={onCurrencyChange}
            aria-label={currencyAriaLabel}
          />
        </div>
      </div>
      {note}
    </div>
  );
}

interface OperatingCashFlowFormProps {
  input: OperatingCashFlowInput;
  errors: OperatingCashFlowFieldErrors;
  result: OperatingCashFlowResult | null;
  onChange: (input: OperatingCashFlowInput) => void;
}

export function OperatingCashFlowForm({
  input,
  errors,
  result,
  onChange,
}: OperatingCashFlowFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(
    null
  );

  const set = (patch: Partial<OperatingCashFlowInput>) => {
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
    raw: string,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): { ok: true; text: string } | { ok: false } => {
    if (from === to) return { ok: true, text: raw };
    const amount = parseMoneyInput(raw);
    if (!Number.isFinite(amount)) return { ok: true, text: raw };
    if (!canConvertPair(from, to)) return { ok: false };
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    if (!converted.ok) return { ok: false };
    return { ok: true, text: moneyAmountToInputString(converted.amount) };
  };

  const handleInputCurrencyChange = (
    field: keyof OperatingCashFlowInput,
    currencyKey: keyof OperatingCashFlowInput,
    currentCurrency: SupportedCurrency,
    next: SupportedCurrency
  ) => {
    if (next === currentCurrency) return;
    const raw = String(input[field] ?? '');
    const converted = convertFieldAmount(raw, currentCurrency, next);
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      [currencyKey]: next,
      [field]: converted.text,
    } as OperatingCashFlowInput);
  };

  const handleWcResultCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.changeInOperatingWcCurrency) return;
    if (!canConvertPair(input.operatingCashFlowCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, changeInOperatingWcCurrency: next });
  };

  const handleOcfCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.operatingCashFlowCurrency) return;
    const pairs: Array<[string, SupportedCurrency]> = [
      [input.netIncome, input.netIncomeCurrency],
      [input.depreciation, input.depreciationCurrency],
      [input.amortization, input.amortizationCurrency],
      [input.changeInInventories, input.changeInInventoriesCurrency],
      [input.changeInAr, input.changeInArCurrency],
      [input.changeInAp, input.changeInApCurrency],
      [input.incomeTaxPayable, input.incomeTaxPayableCurrency],
      [input.netOtherCashFlows, input.netOtherCashFlowsCurrency],
    ];
    for (const [raw, from] of pairs) {
      const amount = parseMoneyInput(raw);
      if (!Number.isFinite(amount)) continue;
      if (!canConvertPair(from, next)) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
    }
    if (!canConvertPair(next, input.changeInOperatingWcCurrency)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, operatingCashFlowCurrency: next });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <MoneyInputField
        id="ocf-net-income"
        label="Net income"
        tooltip="Net income for the period. Changing currency converts this amount with stored FX rates."
        value={input.netIncome}
        currency={input.netIncomeCurrency}
        error={errors.netIncome}
        onValueChange={(netIncome) => set({ netIncome })}
        onCurrencyChange={(next) =>
          handleInputCurrencyChange(
            'netIncome',
            'netIncomeCurrency',
            input.netIncomeCurrency,
            next
          )
        }
        currencyAriaLabel="Net income currency"
      />

      <MoneyInputField
        id="ocf-depreciation"
        label="Depreciation"
        tooltip="Non-cash depreciation expense added back under the indirect method. Changing currency converts this amount with stored FX rates."
        value={input.depreciation}
        currency={input.depreciationCurrency}
        error={errors.depreciation}
        onValueChange={(depreciation) => set({ depreciation })}
        onCurrencyChange={(next) =>
          handleInputCurrencyChange(
            'depreciation',
            'depreciationCurrency',
            input.depreciationCurrency,
            next
          )
        }
        currencyAriaLabel="Depreciation currency"
      />

      <MoneyInputField
        id="ocf-amortization"
        label="Amortization"
        tooltip="Non-cash amortization expense added back under the indirect method. Changing currency converts this amount with stored FX rates."
        value={input.amortization}
        currency={input.amortizationCurrency}
        error={errors.amortization}
        onValueChange={(amortization) => set({ amortization })}
        onCurrencyChange={(next) =>
          handleInputCurrencyChange(
            'amortization',
            'amortizationCurrency',
            input.amortizationCurrency,
            next
          )
        }
        currencyAriaLabel="Amortization currency"
      />

      <MoneyInputField
        id="ocf-inventories"
        label="Change in inventories"
        tooltip="Ending inventory minus beginning inventory. An increase uses cash in the WC adjustment. Changing currency converts this amount with stored FX rates."
        value={input.changeInInventories}
        currency={input.changeInInventoriesCurrency}
        error={errors.changeInInventories}
        onValueChange={(changeInInventories) => set({ changeInInventories })}
        onCurrencyChange={(next) =>
          handleInputCurrencyChange(
            'changeInInventories',
            'changeInInventoriesCurrency',
            input.changeInInventoriesCurrency,
            next
          )
        }
        currencyAriaLabel="Change in inventories currency"
      />

      <MoneyInputField
        id="ocf-ar"
        label="Change in accounts receivables"
        tooltip="Ending accounts receivable minus beginning. An increase uses cash in the WC adjustment. Changing currency converts this amount with stored FX rates."
        value={input.changeInAr}
        currency={input.changeInArCurrency}
        error={errors.changeInAr}
        onValueChange={(changeInAr) => set({ changeInAr })}
        onCurrencyChange={(next) =>
          handleInputCurrencyChange(
            'changeInAr',
            'changeInArCurrency',
            input.changeInArCurrency,
            next
          )
        }
        currencyAriaLabel="Change in accounts receivables currency"
      />

      <MoneyInputField
        id="ocf-ap"
        label="Change in accounts payable"
        tooltip="Ending accounts payable minus beginning. An increase provides cash in the WC adjustment. Changing currency converts this amount with stored FX rates."
        value={input.changeInAp}
        currency={input.changeInApCurrency}
        error={errors.changeInAp}
        onValueChange={(changeInAp) => set({ changeInAp })}
        onCurrencyChange={(next) =>
          handleInputCurrencyChange(
            'changeInAp',
            'changeInApCurrency',
            input.changeInApCurrency,
            next
          )
        }
        currencyAriaLabel="Change in accounts payable currency"
      />

      <MoneyInputField
        id="ocf-tax-payable"
        label="Income tax payable"
        tooltip="Enter the change in income tax payable (ending − beginning), not an absolute tax-payable balance. An increase provides cash. Changing currency converts this amount with stored FX rates."
        value={input.incomeTaxPayable}
        currency={input.incomeTaxPayableCurrency}
        error={errors.incomeTaxPayable}
        onValueChange={(incomeTaxPayable) => set({ incomeTaxPayable })}
        onCurrencyChange={(next) =>
          handleInputCurrencyChange(
            'incomeTaxPayable',
            'incomeTaxPayableCurrency',
            input.incomeTaxPayableCurrency,
            next
          )
        }
        currencyAriaLabel="Income tax payable currency"
      />

      <MoneyInputField
        id="ocf-other"
        label="Net of other cash flows"
        tooltip="Other net operating cash flows included in the indirect-method OCF total. Changing currency converts this amount with stored FX rates."
        value={input.netOtherCashFlows}
        currency={input.netOtherCashFlowsCurrency}
        error={errors.netOtherCashFlows}
        onValueChange={(netOtherCashFlows) => set({ netOtherCashFlows })}
        onCurrencyChange={(next) =>
          handleInputCurrencyChange(
            'netOtherCashFlows',
            'netOtherCashFlowsCurrency',
            input.netOtherCashFlowsCurrency,
            next
          )
        }
        currencyAriaLabel="Net of other cash flows currency"
      />

      <MoneyResultField
        id="ocf-wc"
        label="Change in operating working capital"
        tooltip="Working-capital cash adjustment: −ΔInventories − ΔAR + ΔAP + ΔIncome tax payable. This amount is added in the OCF formula. Changing currency re-expresses the result after normalizing inputs."
        value={result?.formattedChangeInOperatingWc ?? ''}
        currency={input.changeInOperatingWcCurrency}
        onCurrencyChange={handleWcResultCurrencyChange}
        currencyAriaLabel="Change in operating working capital currency"
      />

      <MoneyResultField
        id="ocf-result"
        label="Operating cash flow"
        tooltip="Indirect-method OCF = Net income + Depreciation + Amortization + WC cash adjustment + Net other operating cash flows. Changing this currency re-expresses the result after normalizing inputs."
        value={result?.formattedOperatingCashFlow ?? ''}
        currency={input.operatingCashFlowCurrency}
        onCurrencyChange={handleOcfCurrencyChange}
        currencyAriaLabel="Operating cash flow currency"
        note={
          result?.isNegativeOcf ? (
            <p className="mt-1 text-xs text-amber-700">
              Negative operating cash flow: working-capital uses and other items
              outweigh net income plus D&amp;A for this period.
            </p>
          ) : null
        }
      />

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.balanceChangesOpen}
        onToggle={(event) =>
          set({ balanceChangesOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.balanceChangesOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Balance changes</span>
        </summary>
        <div className="border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <p className="text-xs text-muted-foreground">
            No additional verified balance-change fields for this calculator.
            Enter inventory, receivables, payables, and income tax payable
            changes in the fields above.
          </p>
        </div>
      </details>

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
      {ratesStatus.warning && !conversionError ? (
        <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
      ) : null}
    </form>
  );
}
