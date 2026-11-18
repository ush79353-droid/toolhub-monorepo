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
import {
  IRP_DAY_BASIS,
  annualisedToPeriodicPercent,
  formatIrpRate,
  periodicToAnnualisedPercent,
} from './calculation';
import type {
  InterestRateParityFieldErrors,
  InterestRateParityInput,
  InterestRateParityResult,
  IrpVersion,
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

interface InterestRateParityFormProps {
  input: InterestRateParityInput;
  errors: InterestRateParityFieldErrors;
  result: InterestRateParityResult | null;
  onChange: (input: InterestRateParityInput) => void;
}

export function InterestRateParityForm({
  input,
  errors,
  result,
  onChange,
}: InterestRateParityFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [priceOpen, setPriceOpen] = React.useState(true);
  const [baseOpen, setBaseOpen] = React.useState(true);

  const set = (patch: Partial<InterestRateParityInput>) => {
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

  const syncPriceFromAnnualised = (annualisedRaw: string, daysRaw: string) => {
    const days = Number(String(daysRaw).trim().replace(/,/g, ''));
    const annualised = Number(String(annualisedRaw).trim().replace(/,/g, ''));
    if (!Number.isFinite(days) || !(days > 0) || !Number.isFinite(annualised)) {
      return input.priceRatePercent;
    }
    const periodic = annualisedToPeriodicPercent(annualised, days);
    return periodic === null ? input.priceRatePercent : formatIrpRate(periodic);
  };

  const syncPriceFromPeriodic = (periodicRaw: string, daysRaw: string) => {
    const days = Number(String(daysRaw).trim().replace(/,/g, ''));
    const periodic = Number(String(periodicRaw).trim().replace(/,/g, ''));
    if (!Number.isFinite(days) || !(days > 0) || !Number.isFinite(periodic)) {
      return input.annualisedPriceRatePercent;
    }
    const annualised = periodicToAnnualisedPercent(periodic, days);
    return annualised === null
      ? input.annualisedPriceRatePercent
      : formatIrpRate(annualised);
  };

  const syncBaseFromAnnualised = (annualisedRaw: string, daysRaw: string) => {
    const days = Number(String(daysRaw).trim().replace(/,/g, ''));
    const annualised = Number(String(annualisedRaw).trim().replace(/,/g, ''));
    if (!Number.isFinite(days) || !(days > 0) || !Number.isFinite(annualised)) {
      return input.baseRatePercent;
    }
    const periodic = annualisedToPeriodicPercent(annualised, days);
    return periodic === null ? input.baseRatePercent : formatIrpRate(periodic);
  };

  const syncBaseFromPeriodic = (periodicRaw: string, daysRaw: string) => {
    const days = Number(String(daysRaw).trim().replace(/,/g, ''));
    const periodic = Number(String(periodicRaw).trim().replace(/,/g, ''));
    if (!Number.isFinite(days) || !(days > 0) || !Number.isFinite(periodic)) {
      return input.annualisedBaseRatePercent;
    }
    const annualised = periodicToAnnualisedPercent(periodic, days);
    return annualised === null
      ? input.annualisedBaseRatePercent
      : formatIrpRate(annualised);
  };

  const handleDaysChange = (raw: string) => {
    const next: InterestRateParityInput = {
      ...input,
      contractDays: raw,
    };
    if (input.priceRateSource === 'annualised') {
      next.priceRatePercent = syncPriceFromAnnualised(
        input.annualisedPriceRatePercent,
        raw
      );
    } else {
      next.annualisedPriceRatePercent = syncPriceFromPeriodic(
        input.priceRatePercent,
        raw
      );
    }
    if (input.baseRateSource === 'annualised') {
      next.baseRatePercent = syncBaseFromAnnualised(
        input.annualisedBaseRatePercent,
        raw
      );
    } else {
      next.annualisedBaseRatePercent = syncBaseFromPeriodic(
        input.baseRatePercent,
        raw
      );
    }
    setConversionError(null);
    onChange(next);
  };

  /** Re-quote the spot FX rate into a new price-currency unit (same implied base). */
  const handleSpotCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.spotCurrency) return;
    const amount = parseMoneyInput(input.spotPrice);
    if (!Number.isFinite(amount)) {
      if (
        input.forwardCurrency !== next &&
        !canConvertPair(next, input.forwardCurrency)
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, spotCurrency: next });
      return;
    }
    if (!canConvertPair(input.spotCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (
      input.forwardCurrency !== next &&
      !canConvertPair(next, input.forwardCurrency)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertCurrency({
      amount,
      from: input.spotCurrency,
      to: next,
      rates: rates.rates,
    });
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      spotCurrency: next,
      spotPrice: moneyAmountToInputString(converted.amount),
    });
  };

  /** Display-only re-quote of the calculated forward / expected future spot. */
  const handleForwardCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.forwardCurrency) return;
    if (!canConvertPair(input.spotCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, forwardCurrency: next });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Version</legend>

        <div className="space-y-2" role="radiogroup" aria-label="Interest rate parity version">
          {(['covered', 'uncovered'] as IrpVersion[]).map((version) => (
            <label
              key={version}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="irp-version"
                className="h-4 w-4 accent-primary"
                checked={input.version === version}
                onChange={() => set({ version })}
              />
              <span className="capitalize">{version}</span>
            </label>
          ))}
        </div>

        <div>
          <label className={labelClass} htmlFor="irp-days">
            <span>Number of days in the forward contract</span>
            <InfoTooltip
              label="Number of days"
              text={`Contract tenor in days. Period rates use a ${IRP_DAY_BASIS}-day year: periodic % = annualised % × (days / ${IRP_DAY_BASIS}).`}
            />
          </label>
          <FieldShell error={errors.contractDays}>
            <input
              id="irp-days"
              className={`${inputClass} pr-12`}
              inputMode="numeric"
              value={input.contractDays}
              aria-invalid={Boolean(errors.contractDays)}
              onChange={(e) => handleDaysChange(e.target.value)}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              days
            </span>
          </FieldShell>
          {errors.contractDays ? (
            <p className="mt-1 text-xs text-rose-600">{errors.contractDays}</p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="sr-only">Price currency interest rate</legend>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 text-left"
          aria-expanded={priceOpen}
          onClick={() => setPriceOpen((open) => !open)}
        >
          <span className="text-[13px] font-semibold text-accent">
            Price currency interest rate
          </span>
          <ChevronDown
            className={`h-4 w-4 text-primary transition-transform ${
              priceOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {priceOpen ? (
          <div className="space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="irp-ann-price">
                <span>Annualised price currency interest rate</span>
              </label>
              <FieldShell error={errors.annualisedPriceRatePercent}>
                <input
                  id="irp-ann-price"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={
                    result && input.priceRateSource === 'periodic'
                      ? formatIrpRate(result.annualisedPriceRatePercent)
                      : input.annualisedPriceRatePercent
                  }
                  aria-invalid={Boolean(errors.annualisedPriceRatePercent)}
                  onChange={(e) =>
                    set({
                      annualisedPriceRatePercent: e.target.value,
                      priceRatePercent: syncPriceFromAnnualised(
                        e.target.value,
                        input.contractDays
                      ),
                      priceRateSource: 'annualised',
                    })
                  }
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.annualisedPriceRatePercent ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.annualisedPriceRatePercent}
                </p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="irp-per-price">
                <span>Price currency interest rate</span>
                <InfoTooltip
                  label="Price currency interest rate"
                  text={`Period rate for the contract tenor (quote / price currency). Linked to the annualised rate by × (days / ${IRP_DAY_BASIS}).`}
                />
              </label>
              <FieldShell error={errors.priceRatePercent}>
                <input
                  id="irp-per-price"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={
                    result && input.priceRateSource === 'annualised'
                      ? formatIrpRate(result.priceRatePercent)
                      : input.priceRatePercent
                  }
                  aria-invalid={Boolean(errors.priceRatePercent)}
                  onChange={(e) =>
                    set({
                      priceRatePercent: e.target.value,
                      annualisedPriceRatePercent: syncPriceFromPeriodic(
                        e.target.value,
                        input.contractDays
                      ),
                      priceRateSource: 'periodic',
                    })
                  }
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.priceRatePercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.priceRatePercent}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="sr-only">Base currency interest rate</legend>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 text-left"
          aria-expanded={baseOpen}
          onClick={() => setBaseOpen((open) => !open)}
        >
          <span className="text-[13px] font-semibold text-accent">
            Base currency interest rate
          </span>
          <ChevronDown
            className={`h-4 w-4 text-primary transition-transform ${
              baseOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {baseOpen ? (
          <div className="space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="irp-ann-base">
                <span>Annualised base currency interest rate</span>
              </label>
              <FieldShell error={errors.annualisedBaseRatePercent}>
                <input
                  id="irp-ann-base"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={
                    result && input.baseRateSource === 'periodic'
                      ? formatIrpRate(result.annualisedBaseRatePercent)
                      : input.annualisedBaseRatePercent
                  }
                  aria-invalid={Boolean(errors.annualisedBaseRatePercent)}
                  onChange={(e) =>
                    set({
                      annualisedBaseRatePercent: e.target.value,
                      baseRatePercent: syncBaseFromAnnualised(
                        e.target.value,
                        input.contractDays
                      ),
                      baseRateSource: 'annualised',
                    })
                  }
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.annualisedBaseRatePercent ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.annualisedBaseRatePercent}
                </p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="irp-per-base">
                <span>Base currency interest rate</span>
                <InfoTooltip
                  label="Base currency interest rate"
                  text={`Period rate for the contract tenor (base currency). Linked to the annualised rate by × (days / ${IRP_DAY_BASIS}).`}
                />
              </label>
              <FieldShell error={errors.baseRatePercent}>
                <input
                  id="irp-per-base"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={
                    result && input.baseRateSource === 'annualised'
                      ? formatIrpRate(result.baseRatePercent)
                      : input.baseRatePercent
                  }
                  aria-invalid={Boolean(errors.baseRatePercent)}
                  onChange={(e) =>
                    set({
                      baseRatePercent: e.target.value,
                      annualisedBaseRatePercent: syncBaseFromPeriodic(
                        e.target.value,
                        input.contractDays
                      ),
                      baseRateSource: 'periodic',
                    })
                  }
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.baseRatePercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.baseRatePercent}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Currency forward price
        </legend>

        <div>
          <label className={labelClass} htmlFor="irp-spot">
            <span>Spot price</span>
            <InfoTooltip
              label="Spot price"
              text="FX quote as price-currency units per one base-currency unit. Changing the currency re-quotes that price currency using stored MongoDB rates (same implied base). Interest rates and days are never converted."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.spotPrice}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {getCurrencySymbol(input.spotCurrency)}
              </span>
              <input
                id="irp-spot"
                className={inputClass}
                inputMode="decimal"
                value={input.spotPrice}
                aria-invalid={Boolean(errors.spotPrice)}
                onChange={(e) => set({ spotPrice: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="irp-spot-currency"
                value={input.spotCurrency}
                onChange={handleSpotCurrencyChange}
                aria-label="Spot quote currency"
              />
            </div>
          </div>
          {errors.spotPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.spotPrice}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="irp-forward">
            <span>Currency forward price</span>
            <InfoTooltip
              label="Currency forward price"
              text={
                input.version === 'covered'
                  ? 'Covered IRP forward quote in price-per-base units. Changing currency only re-expresses this calculated quote.'
                  : 'Uncovered IRP expected future spot (not a locked forward). Changing currency only re-expresses this calculated quote.'
              }
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {getCurrencySymbol(input.forwardCurrency)}
              </span>
              <input
                id="irp-forward"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedForward : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="irp-forward-currency"
                value={input.forwardCurrency}
                onChange={handleForwardCurrencyChange}
                aria-label="Forward quote currency"
              />
            </div>
          </div>
          {input.version === 'uncovered' ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Uncovered parity is an expected future spot estimate, not a guaranteed
              forward contract price.
            </p>
          ) : null}
        </div>

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
    </form>
  );
}
