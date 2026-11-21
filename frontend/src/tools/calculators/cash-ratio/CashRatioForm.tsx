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
  CashRatioFieldErrors,
  CashRatioInput,
  CashRatioResult,
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

interface CashRatioFormProps {
  input: CashRatioInput;
  errors: CashRatioFieldErrors;
  result: CashRatioResult | null;
  onChange: (input: CashRatioInput) => void;
}

export function CashRatioForm({
  input,
  errors,
  result,
  onChange,
}: CashRatioFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const cashSymbol = getCurrencySymbol(input.cashCurrency);
  const liabSymbol = getCurrencySymbol(input.liabilitiesCurrency);

  const set = (patch: Partial<CashRatioInput>) => {
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
  ): string | null => {
    const amount = parseMoneyInput(raw);
    if (!Number.isFinite(amount)) return raw;
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

  const handleCashCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.cashCurrency) return;
    const nextAmount = convertFieldAmount(
      input.cashAndEquivalents,
      input.cashCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (input.liabilitiesCurrency !== next && !canConvertPair(next, input.liabilitiesCurrency)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      cashCurrency: next,
      cashAndEquivalents: nextAmount,
    });
  };

  const handleLiabilitiesCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.liabilitiesCurrency) return;
    const nextAmount = convertFieldAmount(
      input.currentLiabilities,
      input.liabilitiesCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (input.cashCurrency !== next && !canConvertPair(input.cashCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      liabilitiesCurrency: next,
      currentLiabilities: nextAmount,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <div>
          <label className={labelClass} htmlFor="cash-ratio-cash">
            <span>Cash and cash equivalents</span>
            <InfoTooltip
              label="Cash and cash equivalents"
              text="Highly liquid assets such as cash, demand deposits, and short-term cash equivalents. Do not include inventory or receivables."
            />
          </label>
          <div className="flex items-center gap-2">
            <FieldShell error={errors.cashAndEquivalents}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {cashSymbol}
              </span>
              <input
                id="cash-ratio-cash"
                className={inputClass}
                inputMode="decimal"
                value={input.cashAndEquivalents}
                onChange={(e) => set({ cashAndEquivalents: e.target.value })}
                aria-invalid={Boolean(errors.cashAndEquivalents)}
              />
            </FieldShell>
            <CurrencySelect
              id="cash-ratio-cash-currency"
              value={input.cashCurrency}
              onChange={handleCashCurrencyChange}
              aria-label="Cash currency"
            />
          </div>
          {errors.cashAndEquivalents ? (
            <p className="mt-1 text-xs text-rose-600">{errors.cashAndEquivalents}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cash-ratio-liabilities">
            <span>Current liabilities</span>
            <InfoTooltip
              label="Current liabilities"
              text="Obligations due within one year. Must be greater than zero. Cash is normalized into this currency before dividing."
            />
          </label>
          <div className="flex items-center gap-2">
            <FieldShell error={errors.currentLiabilities}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {liabSymbol}
              </span>
              <input
                id="cash-ratio-liabilities"
                className={inputClass}
                inputMode="decimal"
                value={input.currentLiabilities}
                onChange={(e) => set({ currentLiabilities: e.target.value })}
                aria-invalid={Boolean(errors.currentLiabilities)}
              />
            </FieldShell>
            <CurrencySelect
              id="cash-ratio-liabilities-currency"
              value={input.liabilitiesCurrency}
              onChange={handleLiabilitiesCurrencyChange}
              aria-label="Current liabilities currency"
            />
          </div>
          {errors.currentLiabilities ? (
            <p className="mt-1 text-xs text-rose-600">{errors.currentLiabilities}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cash-ratio-result">
            <span>Cash ratio</span>
            <InfoTooltip
              label="Cash ratio"
              text="Cash and cash equivalents ÷ current liabilities, shown as a multiple (x). Not a percentage and never FX-converted."
            />
          </label>
          <FieldShell muted>
            <input
              id="cash-ratio-result"
              className={inputClass}
              readOnly
              value={result ? result.formattedCashRatio : ''}
              aria-live="polite"
            />
            <span className="shrink-0 pr-3 text-sm font-medium text-muted-foreground" aria-hidden>
              x
            </span>
          </FieldShell>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
        {conversionError ? (
          <p className="text-xs text-rose-600">{conversionError}</p>
        ) : null}
        {!ratesStatus.available ? (
          <p className="text-xs text-amber-700">{CURRENCY_CONVERSION_UNAVAILABLE_NOTE}</p>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-white">
        <button
          type="button"
          className="flex w-full items-center gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={input.cashBreakdownOpen}
          onClick={() => set({ cashBreakdownOpen: !input.cashBreakdownOpen })}
        >
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.cashBreakdownOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
          <span>Calculate cash and cash equivalents</span>
        </button>
        {input.cashBreakdownOpen ? (
          <div className="border-t border-border px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">
            Enter the total cash and cash equivalents above. Component-level cash equivalent
            fields are not included until an authorized specification defines them. Do not invent
            inventory or receivables in the numerator.
          </div>
        ) : null}
      </div>
    </div>
  );
}
