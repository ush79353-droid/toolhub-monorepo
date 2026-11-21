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
import { deriveCurrentSalesFromPerUnit } from './calculation';
import type {
  MarginOfSafetyFieldErrors,
  MarginOfSafetyInput,
  MarginOfSafetyResult,
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

interface MarginOfSafetyFormProps {
  input: MarginOfSafetyInput;
  errors: MarginOfSafetyFieldErrors;
  result: MarginOfSafetyResult | null;
  onChange: (input: MarginOfSafetyInput) => void;
}

export function MarginOfSafetyForm({
  input,
  errors,
  result,
  onChange,
}: MarginOfSafetyFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [perUnitOpen, setPerUnitOpen] = React.useState(true);
  const [resultsOpen, setResultsOpen] = React.useState(true);

  const currentSymbol = getCurrencySymbol(input.currentSalesCurrency);
  const breakevenSymbol = getCurrencySymbol(input.breakevenSalesCurrency);
  const sellingSymbol = getCurrencySymbol(input.sellingPriceCurrency);
  const costSymbol = getCurrencySymbol(input.costPriceCurrency);
  const resultSymbol = getCurrencySymbol(input.resultCurrency);

  const set = (patch: Partial<MarginOfSafetyInput>) => {
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

  const syncCurrentFromPerUnit = (
    next: MarginOfSafetyInput,
    volumeRaw: string,
    sellingRaw: string,
    sellingCurrency: SupportedCurrency,
    currentCurrency: SupportedCurrency
  ): MarginOfSafetyInput => {
    const volume = Number(volumeRaw.trim().replace(/,/g, ''));
    const selling = parseMoneyInput(sellingRaw);
    if (!Number.isFinite(volume) || !Number.isFinite(selling)) {
      return { ...next, currentSalesFromPerUnit: false };
    }
    const sellingInCurrent = convertFieldAmount(selling, sellingCurrency, currentCurrency);
    if (sellingInCurrent === null) {
      return { ...next, currentSalesFromPerUnit: false };
    }
    const derived = deriveCurrentSalesFromPerUnit(volume, sellingInCurrent);
    if (derived === null) {
      return { ...next, currentSalesFromPerUnit: false };
    }
    return {
      ...next,
      currentSales: moneyAmountToInputString(derived),
      currentSalesFromPerUnit: true,
    };
  };

  const handleMoneyCurrencyChange = (
    fieldAmount: string,
    from: SupportedCurrency,
    next: SupportedCurrency,
    apply: (converted: string | null) => void
  ) => {
    if (next === from) return;
    const amount = parseMoneyInput(fieldAmount);
    if (!Number.isFinite(amount)) {
      apply(null);
      return;
    }
    if (!canConvertPair(from, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertFieldAmount(amount, from, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    apply(moneyAmountToInputString(converted));
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Sales</legend>

        <div>
          <label className={labelClass} htmlFor="mos-current-sales">
            <span>Current (estimated) sales</span>
            <InfoTooltip
              label="Current (estimated) sales"
              text="Expected or actual sales for the period. When sales volume and selling price are both filled, current sales follows volume × price."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.currentSales}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {currentSymbol}
              </span>
              <input
                id="mos-current-sales"
                className={inputClass}
                inputMode="decimal"
                value={input.currentSales}
                aria-invalid={Boolean(errors.currentSales)}
                onChange={(e) =>
                  set({
                    currentSales: e.target.value,
                    currentSalesFromPerUnit: false,
                  })
                }
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mos-current-sales-currency"
                value={input.currentSalesCurrency}
                onChange={(next) => {
                  handleMoneyCurrencyChange(
                    input.currentSales,
                    input.currentSalesCurrency,
                    next,
                    (converted) => {
                      let patch: MarginOfSafetyInput = {
                        ...input,
                        currentSalesCurrency: next,
                        currentSales:
                          converted ?? input.currentSales,
                      };
                      if (input.currentSalesFromPerUnit) {
                        patch = syncCurrentFromPerUnit(
                          patch,
                          input.salesVolume,
                          input.sellingPricePerUnit,
                          input.sellingPriceCurrency,
                          next
                        );
                      }
                      setConversionError(null);
                      onChange(patch);
                    }
                  );
                }}
                aria-label="Current sales currency"
              />
            </div>
          </div>
          {errors.currentSales ? (
            <p className="mt-1 text-xs text-rose-600">{errors.currentSales}</p>
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
          <label className={labelClass} htmlFor="mos-breakeven">
            <span>Breakeven sales</span>
            <InfoTooltip
              label="Breakeven sales"
              text="Sales level at which profit is zero. Entered directly; not derived from unit cost alone."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.breakevenSales}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {breakevenSymbol}
              </span>
              <input
                id="mos-breakeven"
                className={inputClass}
                inputMode="decimal"
                value={input.breakevenSales}
                aria-invalid={Boolean(errors.breakevenSales)}
                onChange={(e) => set({ breakevenSales: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mos-breakeven-currency"
                value={input.breakevenSalesCurrency}
                onChange={(next) => {
                  handleMoneyCurrencyChange(
                    input.breakevenSales,
                    input.breakevenSalesCurrency,
                    next,
                    (converted) => {
                      setConversionError(null);
                      onChange({
                        ...input,
                        breakevenSalesCurrency: next,
                        breakevenSales: converted ?? input.breakevenSales,
                      });
                    }
                  );
                }}
                aria-label="Breakeven sales currency"
              />
            </div>
          </div>
          {errors.breakevenSales ? (
            <p className="mt-1 text-xs text-rose-600">{errors.breakevenSales}</p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="sr-only">Per unit sales</legend>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => setPerUnitOpen((open) => !open)}
          aria-expanded={perUnitOpen}
        >
          <span className="text-[13px] font-semibold text-accent">Per unit sales</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              perUnitOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {perUnitOpen ? (
          <div className="space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="mos-volume">
                <span>Sales volume</span>
                <InfoTooltip
                  label="Sales volume"
                  text="Number of units sold or expected. With selling price, sets current sales = volume × price."
                />
              </label>
              <FieldShell error={errors.salesVolume}>
                <input
                  id="mos-volume"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.salesVolume}
                  aria-invalid={Boolean(errors.salesVolume)}
                  onChange={(e) => {
                    const volume = e.target.value;
                    const next = {
                      ...input,
                      salesVolume: volume,
                    };
                    onChange(
                      syncCurrentFromPerUnit(
                        next,
                        volume,
                        input.sellingPricePerUnit,
                        input.sellingPriceCurrency,
                        input.currentSalesCurrency
                      )
                    );
                  }}
                />
              </FieldShell>
              {errors.salesVolume ? (
                <p className="mt-1 text-xs text-rose-600">{errors.salesVolume}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="mos-selling">
                <span>Selling price per unit</span>
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.sellingPricePerUnit}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {sellingSymbol}
                  </span>
                  <input
                    id="mos-selling"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.sellingPricePerUnit}
                    aria-invalid={Boolean(errors.sellingPricePerUnit)}
                    onChange={(e) => {
                      const selling = e.target.value;
                      const next = {
                        ...input,
                        sellingPricePerUnit: selling,
                      };
                      onChange(
                        syncCurrentFromPerUnit(
                          next,
                          input.salesVolume,
                          selling,
                          input.sellingPriceCurrency,
                          input.currentSalesCurrency
                        )
                      );
                    }}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="mos-selling-currency"
                    value={input.sellingPriceCurrency}
                    onChange={(next) => {
                      handleMoneyCurrencyChange(
                        input.sellingPricePerUnit,
                        input.sellingPriceCurrency,
                        next,
                        (converted) => {
                          const selling = converted ?? input.sellingPricePerUnit;
                          const base = {
                            ...input,
                            sellingPriceCurrency: next,
                            sellingPricePerUnit: selling,
                          };
                          setConversionError(null);
                          onChange(
                            syncCurrentFromPerUnit(
                              base,
                              input.salesVolume,
                              selling,
                              next,
                              input.currentSalesCurrency
                            )
                          );
                        }
                      );
                    }}
                    aria-label="Selling price currency"
                  />
                </div>
              </div>
              {errors.sellingPricePerUnit ? (
                <p className="mt-1 text-xs text-rose-600">{errors.sellingPricePerUnit}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="mos-cost">
                <span>Cost price per unit</span>
                <InfoTooltip
                  label="Cost price per unit"
                  text="Optional. Not used to invent breakeven sales; fixed costs would also be required."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.costPricePerUnit}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {costSymbol}
                  </span>
                  <input
                    id="mos-cost"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.costPricePerUnit}
                    aria-invalid={Boolean(errors.costPricePerUnit)}
                    onChange={(e) => set({ costPricePerUnit: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="mos-cost-currency"
                    value={input.costPriceCurrency}
                    onChange={(next) => {
                      handleMoneyCurrencyChange(
                        input.costPricePerUnit,
                        input.costPriceCurrency,
                        next,
                        (converted) => {
                          setConversionError(null);
                          onChange({
                            ...input,
                            costPriceCurrency: next,
                            costPricePerUnit: converted ?? input.costPricePerUnit,
                          });
                        }
                      );
                    }}
                    aria-label="Cost price currency"
                  />
                </div>
              </div>
              {errors.costPricePerUnit ? (
                <p className="mt-1 text-xs text-rose-600">{errors.costPricePerUnit}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="sr-only">Results</legend>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => setResultsOpen((open) => !open)}
          aria-expanded={resultsOpen}
        >
          <span className="text-[13px] font-semibold text-accent">Results</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              resultsOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {resultsOpen ? (
          <div className="space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="mos-result-money">
                <span>Margin of safety</span>
              </label>
              <div className="flex gap-2">
                <FieldShell muted>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {resultSymbol}
                  </span>
                  <input
                    id="mos-result-money"
                    className={`${inputClass} font-semibold`}
                    readOnly
                    value={result ? result.formattedMarginOfSafety : ''}
                    aria-live="polite"
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="mos-result-currency"
                    value={input.resultCurrency}
                    onChange={(next) => {
                      if (next === input.resultCurrency) return;
                      if (
                        input.currentSalesCurrency !== next &&
                        !canConvertPair(input.currentSalesCurrency, next)
                      ) {
                        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
                        return;
                      }
                      setConversionError(null);
                      onChange({ ...input, resultCurrency: next });
                    }}
                    aria-label="Margin of safety result currency"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="mos-result-ratio">
                <span>Margin of safety ratio</span>
              </label>
              <FieldShell muted>
                <input
                  id="mos-result-ratio"
                  className={`${inputClass} font-semibold`}
                  readOnly
                  value={result ? result.formattedRatio : ''}
                  aria-live="polite"
                />
              </FieldShell>
            </div>

            <div>
              <label className={labelClass} htmlFor="mos-result-percent">
                <span>Margin of safety percentage</span>
              </label>
              <FieldShell muted>
                <input
                  id="mos-result-percent"
                  className={`${inputClass} pr-10 font-semibold`}
                  readOnly
                  value={result ? result.formattedPercent : ''}
                  aria-live="polite"
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
            </div>

            <div>
              <label className={labelClass} htmlFor="mos-result-units">
                <span>Margin of safety (units)</span>
              </label>
              <FieldShell muted>
                <input
                  id="mos-result-units"
                  className={`${inputClass} font-semibold`}
                  readOnly
                  value={result ? result.formattedUnits : ''}
                  aria-live="polite"
                />
              </FieldShell>
            </div>
          </div>
        ) : null}

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>
    </form>
  );
}
