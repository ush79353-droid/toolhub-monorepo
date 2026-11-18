'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { Pin, RotateCcw, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  MarginVatDriver,
  MarginVatFieldErrors,
  MarginVatInput,
  PricingPin,
} from './types';

const labelClass =
  'mb-1.5 flex items-center justify-between gap-2 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface MarginAndVatFormProps {
  input: MarginVatInput;
  errors: MarginVatFieldErrors;
  canShare: boolean;
  shareLabel: string;
  clearDisabled: boolean;
  onChange: (input: MarginVatInput) => void;
  onReload: () => void;
  onClear: () => void;
  onShare: () => void;
}

export function MarginAndVatForm({
  input,
  errors,
  canShare,
  shareLabel,
  clearDisabled,
  onChange,
  onReload,
  onClear,
  onShare,
}: MarginAndVatFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const set = (patch: Partial<MarginVatInput>) => {
    setConversionError(null);
    onChange({ ...input, ...patch });
  };

  const edit = (driver: MarginVatDriver, patch: Partial<MarginVatInput>) => {
    setConversionError(null);
    onChange({ ...input, ...patch, driver });
  };

  const pin = (pricingPin: PricingPin) => {
    setConversionError(null);
    onChange({
      ...input,
      pricingPin,
      driver: pricingPin === 'margin' ? 'margin' : 'markup',
    });
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
    amountRaw: string,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): string | null => {
    const amount = parseMoneyInput(amountRaw);
    if (!Number.isFinite(amount)) return amountRaw;
    if (!canConvertPair(from, to)) return null;
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    if (!converted.ok) return null;
    return moneyAmountToInputString(converted.amount);
  };

  const ensurePairsWithHome = (nextHome: SupportedCurrency) => {
    for (const other of [
      input.grossCostCurrency,
      input.netPriceCurrency,
      input.grossPriceCurrency,
      input.profitCurrency,
    ]) {
      if (other !== nextHome && !canConvertPair(nextHome, other)) return false;
    }
    return true;
  };

  const handleMoneyCurrencyChange = (
    field:
      | 'netCostCurrency'
      | 'grossCostCurrency'
      | 'netPriceCurrency'
      | 'grossPriceCurrency'
      | 'profitCurrency',
    amountField:
      | 'netCost'
      | 'grossCost'
      | 'netPrice'
      | 'grossPrice'
      | 'profit',
    next: SupportedCurrency
  ) => {
    const from = input[field];
    if (next === from) return;

    if (field === 'netCostCurrency') {
      if (!ensurePairsWithHome(next)) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
    } else if (
      input.netCostCurrency !== next &&
      !canConvertPair(input.netCostCurrency, next)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const nextAmount = convertFieldAmount(input[amountField], from, next);
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({
      ...input,
      [field]: next,
      [amountField]: nextAmount,
    });
  };

  const moneyRow = (
    id: string,
    label: string,
    tip: string,
    amountKey: 'netCost' | 'grossCost' | 'netPrice' | 'grossPrice' | 'profit',
    currencyKey:
      | 'netCostCurrency'
      | 'grossCostCurrency'
      | 'netPriceCurrency'
      | 'grossPriceCurrency'
      | 'profitCurrency',
    driver: MarginVatDriver,
    errorKey: keyof MarginVatFieldErrors
  ) => {
    const currency = input[currencyKey];
    const symbol = getCurrencySymbol(currency);
    return (
      <div>
        <label className={labelClass} htmlFor={id}>
          <span className="inline-flex items-center gap-1.5">
            <span>{label}</span>
            <InfoTooltip label={label} text={tip} />
          </span>
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors[errorKey]}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id={id}
              className={inputClass}
              inputMode="decimal"
              value={input[amountKey]}
              aria-invalid={Boolean(errors[errorKey])}
              onChange={(e) => edit(driver, { [amountKey]: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id={`${id}-currency`}
              value={currency}
              onChange={(next) =>
                handleMoneyCurrencyChange(currencyKey, amountKey, next)
              }
              aria-label={`${label} currency`}
            />
          </div>
        </div>
        {errors[errorKey] ? (
          <p className="mt-1 text-xs text-rose-600">{errors[errorKey]}</p>
        ) : null}
      </div>
    );
  };

  const percentRow = (
    id: string,
    label: string,
    tip: string,
    field: 'vatPercent' | 'marginPercent' | 'markupPercent',
    driver: MarginVatDriver,
    errorKey: keyof MarginVatFieldErrors,
    showPin?: PricingPin
  ) => (
    <div>
      <div className={labelClass}>
        <label htmlFor={id} className="inline-flex items-center gap-1.5">
          <span>{label}</span>
          <InfoTooltip label={label} text={tip} />
        </label>
        {showPin ? (
          <button
            type="button"
            className={`inline-flex h-7 w-7 items-center justify-center rounded-md border transition-colors ${
              input.pricingPin === showPin
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:bg-muted/40'
            }`}
            aria-pressed={input.pricingPin === showPin}
            aria-label={`Pin ${label} as pricing driver`}
            title={
              input.pricingPin === showPin
                ? `${label} is pinned for price-from-cost solving`
                : `Pin ${label} for price-from-cost solving`
            }
            onClick={() => pin(showPin)}
          >
            <Pin className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
      <FieldShell error={errors[errorKey]}>
        <input
          id={id}
          className={`${inputClass} pr-8`}
          inputMode="decimal"
          value={input[field]}
          aria-invalid={Boolean(errors[errorKey])}
          onChange={(e) => edit(driver, { [field]: e.target.value })}
        />
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
          %
        </span>
      </FieldShell>
      {errors[errorKey] ? (
        <p className="mt-1 text-xs text-rose-600">{errors[errorKey]}</p>
      ) : null}
    </div>
  );

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Margin and VAT Calculator
        </legend>

        {percentRow(
          'mv-vat',
          'VAT',
          'Value-added tax percentage applied to net cost and net selling price.',
          'vatPercent',
          'vat',
          'vatPercent'
        )}

        {moneyRow(
          'mv-net-cost',
          'Net cost',
          'Cost excluding VAT. Canonical currency for FX normalization.',
          'netCost',
          'netCostCurrency',
          'netCost',
          'netCost'
        )}

        {moneyRow(
          'mv-gross-cost',
          'Gross cost',
          'Cost including VAT. Editing this solves net cost via inverse VAT.',
          'grossCost',
          'grossCostCurrency',
          'grossCost',
          'grossCost'
        )}

        {percentRow(
          'mv-margin',
          'Margin',
          'Profit ÷ net selling price × 100. Pin to solve selling price from cost.',
          'marginPercent',
          'margin',
          'marginPercent',
          'margin'
        )}

        {percentRow(
          'mv-markup',
          'Markup',
          'Profit ÷ net cost × 100. Pin to solve selling price from cost.',
          'markupPercent',
          'markup',
          'markupPercent',
          'markup'
        )}

        {moneyRow(
          'mv-net-price',
          'My net price',
          'Selling price excluding VAT (net selling price).',
          'netPrice',
          'netPriceCurrency',
          'netPrice',
          'netPrice'
        )}

        {moneyRow(
          'mv-gross-price',
          'My gross price',
          'Selling price including VAT. Editing solves net price via inverse VAT.',
          'grossPrice',
          'grossPriceCurrency',
          'grossPrice',
          'grossPrice'
        )}

        {moneyRow(
          'mv-profit',
          'Profit',
          'Net selling price − net cost (before VAT on the sale).',
          'profit',
          'profitCurrency',
          'profit',
          'profit'
        )}

        {conversionError ? (
          <p className="text-xs text-rose-600" role="alert">
            {conversionError}
          </p>
        ) : null}
        {ratesStatus.warning && !conversionError ? (
          <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
        ) : null}
        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <div className="border-t border-border/80 pt-4">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            onClick={onShare}
            disabled={!canShare}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs">
              <Share2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-accent">{shareLabel}</span>
          </button>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center gap-1.5 rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              onClick={() => {
                setConversionError(null);
                onReload();
              }}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={clearDisabled}
              className="h-9 w-full justify-center text-xs font-normal text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => {
                setConversionError(null);
                onClear();
              }}
            >
              Clear all changes
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
