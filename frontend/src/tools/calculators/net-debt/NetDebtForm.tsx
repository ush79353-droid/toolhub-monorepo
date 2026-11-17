'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
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
  DisplayCurrencyKey,
  NetDebtFieldErrors,
  NetDebtInput,
  NetDebtResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

type AmountCurrencyPair = {
  amountKey: keyof NetDebtInput;
  currencyKey: keyof NetDebtInput;
};

interface NetDebtFormProps {
  input: NetDebtInput;
  errors: NetDebtFieldErrors;
  result: NetDebtResult | null;
  onChange: (input: NetDebtInput) => void;
}

export function NetDebtForm({ input, errors, result, onChange }: NetDebtFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const set = (patch: Partial<NetDebtInput>) => {
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

  const convertAmount = (
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

  const handleAmountCurrencyChange = (
    pair: AmountCurrencyPair,
    next: SupportedCurrency
  ) => {
    const current = input[pair.currencyKey] as SupportedCurrency;
    if (next === current) return;
    const raw = String(input[pair.amountKey] ?? '');
    const amount = parseMoneyInput(raw);
    if (!Number.isFinite(amount)) {
      setConversionError(null);
      onChange({ ...input, [pair.currencyKey]: next });
      return;
    }
    const converted = convertAmount(amount, current, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      [pair.currencyKey]: next,
      [pair.amountKey]: moneyAmountToInputString(converted),
    });
  };

  const handleDisplayCurrencyChange = (
    field: DisplayCurrencyKey,
    next: SupportedCurrency
  ) => {
    if (next === input[field]) return;
    if (!canConvertPair(input.cashCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, [field]: next });
  };

  const moneyRow = (opts: {
    id: string;
    label: string;
    tip?: string;
    amountKey: keyof NetDebtInput;
    currencyKey: keyof NetDebtInput;
    error?: string;
    muted?: boolean;
    readOnly?: boolean;
    displayValue?: string;
    ariaLabelCurrency: string;
  }) => {
    const currency = input[opts.currencyKey] as SupportedCurrency;
    const symbol = getCurrencySymbol(currency);
    return (
      <div>
        <label className={labelClass} htmlFor={opts.id}>
          <span>{opts.label}</span>
          {opts.tip ? <InfoTooltip label={opts.label} text={opts.tip} /> : null}
        </label>
        <div className="flex gap-2">
          <FieldShell error={opts.error} muted={opts.muted}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id={opts.id}
              className={`${inputClass}${opts.readOnly ? ' font-semibold' : ''}`}
              inputMode="decimal"
              readOnly={opts.readOnly}
              value={
                opts.readOnly
                  ? (opts.displayValue ?? '')
                  : String(input[opts.amountKey] ?? '')
              }
              aria-invalid={Boolean(opts.error)}
              aria-live={opts.readOnly ? 'polite' : undefined}
              onChange={
                opts.readOnly
                  ? undefined
                  : (e) => set({ [opts.amountKey]: e.target.value } as Partial<NetDebtInput>)
              }
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id={`${opts.id}-currency`}
              value={currency}
              onChange={(next) => {
                if (opts.readOnly) {
                  handleDisplayCurrencyChange(
                    opts.currencyKey as DisplayCurrencyKey,
                    next
                  );
                } else {
                  handleAmountCurrencyChange(
                    {
                      amountKey: opts.amountKey,
                      currencyKey: opts.currencyKey,
                    },
                    next
                  );
                }
              }}
              aria-label={opts.ariaLabelCurrency}
            />
          </div>
        </div>
        {opts.error ? <p className="mt-1 text-xs text-rose-600">{opts.error}</p> : null}
      </div>
    );
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <details open className="rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <summary className="cursor-pointer list-none text-[13px] font-semibold text-accent marker:content-none [&::-webkit-details-marker]:hidden">
          Cash and cash equivalents
        </summary>
        <div className="mt-3 space-y-3.5">
          {moneyRow({
            id: 'nd-cash',
            label: 'Cash',
            tip: 'Cash on hand and demand deposits. Changing currency converts this amount.',
            amountKey: 'cash',
            currencyKey: 'cashCurrency',
            error: errors.cash,
            ariaLabelCurrency: 'Cash currency',
          })}
          {moneyRow({
            id: 'nd-cash-eq',
            label: 'Cash equivalents',
            tip: 'Short-term highly liquid investments. Changing currency converts this amount.',
            amountKey: 'cashEquivalents',
            currencyKey: 'cashEquivalentsCurrency',
            error: errors.cashEquivalents,
            ariaLabelCurrency: 'Cash equivalents currency',
          })}
          {moneyRow({
            id: 'nd-cash-total',
            label: 'Cash and cash equivalents',
            tip: 'Cash + cash equivalents, normalized then shown in this currency.',
            amountKey: 'cash',
            currencyKey: 'cashTotalCurrency',
            muted: true,
            readOnly: true,
            displayValue: result?.formattedCashTotal,
            ariaLabelCurrency: 'Cash and cash equivalents total currency',
          })}
        </div>
      </details>

      <details open className="rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <summary className="cursor-pointer list-none text-[13px] font-semibold text-accent marker:content-none [&::-webkit-details-marker]:hidden">
          Short-term debt
        </summary>
        <div className="mt-3 space-y-3.5">
          {moneyRow({
            id: 'nd-ap',
            label: 'Accounts payable',
            amountKey: 'accountsPayable',
            currencyKey: 'accountsPayableCurrency',
            error: errors.accountsPayable,
            ariaLabelCurrency: 'Accounts payable currency',
          })}
          {moneyRow({
            id: 'nd-curr-ltd',
            label: 'Current portion of the long-term debt',
            amountKey: 'currentLongTermDebt',
            currencyKey: 'currentLongTermDebtCurrency',
            error: errors.currentLongTermDebt,
            ariaLabelCurrency: 'Current portion of long-term debt currency',
          })}
          {moneyRow({
            id: 'nd-curr-leases',
            label: 'Current part of leases',
            amountKey: 'currentLeases',
            currencyKey: 'currentLeasesCurrency',
            error: errors.currentLeases,
            ariaLabelCurrency: 'Current part of leases currency',
          })}
          {moneyRow({
            id: 'nd-other-st',
            label: 'Other payables or accrued items',
            amountKey: 'otherShortTerm',
            currencyKey: 'otherShortTermCurrency',
            error: errors.otherShortTerm,
            ariaLabelCurrency: 'Other short-term payables currency',
          })}
          {moneyRow({
            id: 'nd-st-total',
            label: 'Short-term debt',
            tip: 'Sum of short-term debt items after FX normalization.',
            amountKey: 'accountsPayable',
            currencyKey: 'shortTermDebtCurrency',
            muted: true,
            readOnly: true,
            displayValue: result?.formattedShortTermDebt,
            ariaLabelCurrency: 'Short-term debt total currency',
          })}
        </div>
      </details>

      <details open className="rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <summary className="cursor-pointer list-none text-[13px] font-semibold text-accent marker:content-none [&::-webkit-details-marker]:hidden">
          Long-term debt
        </summary>
        <div className="mt-3 space-y-3.5">
          {moneyRow({
            id: 'nd-ncltd',
            label: 'Non-current long-term debt',
            amountKey: 'nonCurrentLongTermDebt',
            currencyKey: 'nonCurrentLongTermDebtCurrency',
            error: errors.nonCurrentLongTermDebt,
            ariaLabelCurrency: 'Non-current long-term debt currency',
          })}
          {moneyRow({
            id: 'nd-nc-leases',
            label: 'Non-current part of leases',
            amountKey: 'nonCurrentLeases',
            currencyKey: 'nonCurrentLeasesCurrency',
            error: errors.nonCurrentLeases,
            ariaLabelCurrency: 'Non-current part of leases currency',
          })}
          {moneyRow({
            id: 'nd-other-lt',
            label: 'Other payables or accrued items',
            amountKey: 'otherLongTerm',
            currencyKey: 'otherLongTermCurrency',
            error: errors.otherLongTerm,
            ariaLabelCurrency: 'Other long-term payables currency',
          })}
          {moneyRow({
            id: 'nd-lt-total',
            label: 'Long-term debt',
            tip: 'Sum of long-term debt items after FX normalization.',
            amountKey: 'nonCurrentLongTermDebt',
            currencyKey: 'longTermDebtCurrency',
            muted: true,
            readOnly: true,
            displayValue: result?.formattedLongTermDebt,
            ariaLabelCurrency: 'Long-term debt total currency',
          })}
        </div>
      </details>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Net debt</legend>
        {moneyRow({
          id: 'nd-sum-cash',
          label: 'Cash and cash equivalents',
          tip: 'Synchronized with the cash section total.',
          amountKey: 'cash',
          currencyKey: 'cashTotalCurrency',
          muted: true,
          readOnly: true,
          displayValue: result?.formattedCashTotal,
          ariaLabelCurrency: 'Net debt cash total currency',
        })}
        {moneyRow({
          id: 'nd-sum-st',
          label: 'Short-term debt',
          tip: 'Synchronized with the short-term debt section total.',
          amountKey: 'accountsPayable',
          currencyKey: 'shortTermDebtCurrency',
          muted: true,
          readOnly: true,
          displayValue: result?.formattedShortTermDebt,
          ariaLabelCurrency: 'Net debt short-term total currency',
        })}
        {moneyRow({
          id: 'nd-sum-lt',
          label: 'Long-term debt',
          tip: 'Synchronized with the long-term debt section total.',
          amountKey: 'nonCurrentLongTermDebt',
          currencyKey: 'longTermDebtCurrency',
          muted: true,
          readOnly: true,
          displayValue: result?.formattedLongTermDebt,
          ariaLabelCurrency: 'Net debt long-term total currency',
        })}
        {moneyRow({
          id: 'nd-net',
          label: 'Net debt',
          tip: 'Short-term debt + long-term debt − cash and cash equivalents. Negative means a net cash position.',
          amountKey: 'cash',
          currencyKey: 'netDebtCurrency',
          muted: true,
          readOnly: true,
          displayValue: result?.formattedNetDebt,
          ariaLabelCurrency: 'Net debt currency',
        })}
      </fieldset>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {ratesStatus.warning && !conversionError ? (
        <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
      ) : null}
      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
