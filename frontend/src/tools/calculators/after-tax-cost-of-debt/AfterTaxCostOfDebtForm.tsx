'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
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
import { formatPercentValue } from './calculation';
import type {
  AfterTaxCostOfDebtFieldErrors,
  AfterTaxCostOfDebtInput,
  AfterTaxCostOfDebtResult,
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

interface AfterTaxCostOfDebtFormProps {
  input: AfterTaxCostOfDebtInput;
  errors: AfterTaxCostOfDebtFieldErrors;
  result: AfterTaxCostOfDebtResult | null;
  onChange: (input: AfterTaxCostOfDebtInput) => void;
  onReset: () => void;
  dirty: boolean;
}

export function AfterTaxCostOfDebtForm({
  input,
  errors,
  result,
  onChange,
  onReset,
  dirty,
}: AfterTaxCostOfDebtFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [taxSectionOpen, setTaxSectionOpen] = React.useState(true);
  const [debtSectionOpen, setDebtSectionOpen] = React.useState(true);

  const netSymbol = getCurrencySymbol(input.netIncomeCurrency);
  const pretaxSymbol = getCurrencySymbol(input.pretaxIncomeCurrency);

  const displayedTaxRate =
    input.taxRateSource === 'incomes' && result
      ? result.formattedTaxRate
      : input.taxRatePercent;

  const displayedAfterTax = result ? result.formattedAfterTaxCostOfDebt : '';

  const set = (patch: Partial<AfterTaxCostOfDebtInput>) => {
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

  const handleNetCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.netIncomeCurrency) return;
    const nextAmount = convertFieldAmount(
      input.netIncome,
      input.netIncomeCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (
      input.pretaxIncomeCurrency !== next &&
      !canConvertPair(input.pretaxIncomeCurrency, next)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      netIncomeCurrency: next,
      netIncome: nextAmount,
      taxRateSource: 'incomes',
    });
  };

  const handlePretaxCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.pretaxIncomeCurrency) return;
    const nextAmount = convertFieldAmount(
      input.pretaxIncome,
      input.pretaxIncomeCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      pretaxIncomeCurrency: next,
      pretaxIncome: nextAmount,
      taxRateSource: 'incomes',
    });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="sr-only">Marginal corporate tax rate</legend>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 text-left"
          aria-expanded={taxSectionOpen}
          onClick={() => setTaxSectionOpen((o) => !o)}
        >
          <span className="text-[13px] font-semibold text-accent">
            Marginal corporate tax rate
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              taxSectionOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {taxSectionOpen ? (
          <div className="space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="atcod-net">
                <span>Net income</span>
                <InfoTooltip
                  label="Net income"
                  text="Income after tax. Used with pre-tax income to estimate an effective tax rate (not a statutory bracket)."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.netIncome}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {netSymbol}
                  </span>
                  <input
                    id="atcod-net"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.netIncome}
                    aria-invalid={Boolean(errors.netIncome)}
                    onChange={(e) =>
                      set({ netIncome: e.target.value, taxRateSource: 'incomes' })
                    }
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="atcod-net-currency"
                    value={input.netIncomeCurrency}
                    onChange={handleNetCurrencyChange}
                    aria-label="Net income currency"
                  />
                </div>
              </div>
              {errors.netIncome ? (
                <p className="mt-1 text-xs text-rose-600">{errors.netIncome}</p>
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
              <label className={labelClass} htmlFor="atcod-pretax">
                <span>Pre-tax income</span>
                <InfoTooltip
                  label="Pre-tax income"
                  text="Income before tax. Independent currency; normalized into net-income currency before the tax-rate ratio."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.pretaxIncome}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {pretaxSymbol}
                  </span>
                  <input
                    id="atcod-pretax"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.pretaxIncome}
                    aria-invalid={Boolean(errors.pretaxIncome)}
                    onChange={(e) =>
                      set({
                        pretaxIncome: e.target.value,
                        taxRateSource: 'incomes',
                      })
                    }
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="atcod-pretax-currency"
                    value={input.pretaxIncomeCurrency}
                    onChange={handlePretaxCurrencyChange}
                    aria-label="Pre-tax income currency"
                  />
                </div>
              </div>
              {errors.pretaxIncome ? (
                <p className="mt-1 text-xs text-rose-600">{errors.pretaxIncome}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="sr-only">After-tax cost of debt</legend>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 text-left"
          aria-expanded={debtSectionOpen}
          onClick={() => setDebtSectionOpen((o) => !o)}
        >
          <span className="text-[13px] font-semibold text-accent">
            After-tax cost of debt
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              debtSectionOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {debtSectionOpen ? (
          <div className="space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="atcod-tax">
                <span>Marginal corporate tax rate</span>
                <InfoTooltip
                  label="Marginal corporate tax rate"
                  text="Estimated as (1 − net income / pre-tax income) × 100 when incomes drive the field. Editing here switches to a manual rate and does not rewrite the income fields."
                />
              </label>
              <FieldShell error={errors.taxRatePercent}>
                <input
                  id="atcod-tax"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={displayedTaxRate}
                  aria-invalid={Boolean(errors.taxRatePercent)}
                  onChange={(e) =>
                    set({
                      taxRatePercent: e.target.value,
                      taxRateSource: 'manual',
                    })
                  }
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.taxRatePercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.taxRatePercent}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="atcod-after">
                <span>After-tax cost of debt</span>
                <InfoTooltip
                  label="After-tax cost of debt"
                  text="Cost of debt × (1 − tax rate / 100). Interest tax shield reduces the effective borrowing cost."
                />
              </label>
              <FieldShell muted>
                <input
                  id="atcod-after"
                  className={`${inputClass} pr-8 font-semibold`}
                  readOnly
                  value={displayedAfterTax}
                  aria-live="polite"
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
            </div>

            <div>
              <label className={labelClass} htmlFor="atcod-cost">
                <span>Cost of debt</span>
                <InfoTooltip
                  label="Cost of debt"
                  text="Before-tax cost of debt (e.g. YTM or market interest rate on new debt). Not FX-converted."
                />
              </label>
              <FieldShell error={errors.costOfDebtPercent}>
                <input
                  id="atcod-cost"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.costOfDebtPercent}
                  aria-invalid={Boolean(errors.costOfDebtPercent)}
                  onChange={(e) => set({ costOfDebtPercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.costOfDebtPercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.costOfDebtPercent}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </fieldset>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reload calculator
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 font-medium"
          disabled={!dirty}
          onClick={onReset}
        >
          Clear all changes
        </Button>
      </div>
    </form>
  );
}

/** Exported for tests / demos — formats a percent for display sync. */
export { formatPercentValue };
