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
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  moneyAmountToInputString,
  parseMoneyInput,
} from '@/tools/shared/money-value';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  LotteryAnnuityFieldErrors,
  LotteryAnnuityInput,
  LotteryAnnuityResult,
  LotteryTaxTreatment,
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

interface LotteryAnnuityFormProps {
  input: LotteryAnnuityInput;
  errors: LotteryAnnuityFieldErrors;
  result: LotteryAnnuityResult | null;
  onChange: (input: LotteryAnnuityInput) => void;
}

export function LotteryAnnuityForm({
  input,
  errors,
  result,
  onChange,
}: LotteryAnnuityFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [resultsOpen, setResultsOpen] = React.useState(true);
  const prizeSymbol = getCurrencySymbol(input.prizeCurrency);
  const tableSymbol = getCurrencySymbol(result?.currency ?? input.prizeCurrency);

  const set = (patch: Partial<LotteryAnnuityInput>) => {
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

  const handlePrizeCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.prizeCurrency) return;
    const amount = parseMoneyInput(input.prizeAmount);
    if (!Number.isFinite(amount)) {
      setConversionError(null);
      onChange({ ...input, prizeCurrency: next });
      return;
    }
    if (!canConvertPair(input.prizeCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertCurrency({
      amount,
      from: input.prizeCurrency,
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
      prizeCurrency: next,
      prizeAmount: moneyAmountToInputString(converted.amount),
    });
  };

  const taxOptions: { value: LotteryTaxTreatment; label: string }[] = [
    { value: 'without', label: 'Without tax' },
    { value: 'us', label: 'US taxes' },
    { value: 'custom', label: 'Customized tax rate' },
  ];

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Lottery Annuity Calculator
        </legend>

        <div>
          <label className={labelClass} htmlFor="la-prize">
            <span>How much did you win?</span>
            <InfoTooltip
              label="How much did you win?"
              text="Advertised prize treated as the present value of the growing annuity payout stream."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.prizeAmount}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {prizeSymbol}
              </span>
              <input
                id="la-prize"
                className={inputClass}
                inputMode="decimal"
                value={input.prizeAmount}
                aria-invalid={Boolean(errors.prizeAmount)}
                onChange={(e) => set({ prizeAmount: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="la-prize-currency"
                value={input.prizeCurrency}
                onChange={handlePrizeCurrencyChange}
                aria-label="Prize currency"
              />
            </div>
          </div>
          {errors.prizeAmount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.prizeAmount}</p>
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
          <label className={labelClass} htmlFor="la-years">
            <span>Number of years</span>
          </label>
          <FieldShell error={errors.years}>
            <input
              id="la-years"
              className={`${inputClass} pr-12`}
              inputMode="numeric"
              value={input.years}
              aria-invalid={Boolean(errors.years)}
              onChange={(e) => set({ years: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              yrs
            </span>
          </FieldShell>
          {errors.years ? <p className="mt-1 text-xs text-rose-600">{errors.years}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="la-growth">
            <span>Percentage increase of payout</span>
          </label>
          <FieldShell error={errors.payoutGrowthPercent}>
            <input
              id="la-growth"
              className={`${inputClass} pr-10`}
              inputMode="decimal"
              value={input.payoutGrowthPercent}
              aria-invalid={Boolean(errors.payoutGrowthPercent)}
              onChange={(e) => set({ payoutGrowthPercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.payoutGrowthPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.payoutGrowthPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="la-return">
            <span>Rate of return</span>
            <InfoTooltip
              label="Rate of return"
              text="Discount rate used in the growing-annuity present-value formula. Use 0 for an undiscounted payout schedule."
            />
          </label>
          <FieldShell error={errors.rateOfReturnPercent}>
            <input
              id="la-return"
              className={`${inputClass} pr-10`}
              inputMode="decimal"
              value={input.rateOfReturnPercent}
              aria-invalid={Boolean(errors.rateOfReturnPercent)}
              onChange={(e) => set({ rateOfReturnPercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.rateOfReturnPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.rateOfReturnPercent}</p>
          ) : null}
        </div>

        <fieldset className="space-y-2">
          <legend className={labelClass}>Tax treatment</legend>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
            {taxOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="la-tax"
                  className="h-4 w-4 accent-primary"
                  checked={input.taxTreatment === option.value}
                  onChange={() => set({ taxTreatment: option.value })}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {input.taxTreatment === 'custom' ? (
          <div>
            <label className={labelClass} htmlFor="la-custom-tax">
              <span>Customized tax rate</span>
            </label>
            <FieldShell error={errors.customTaxRatePercent}>
              <input
                id="la-custom-tax"
                className={`${inputClass} pr-10`}
                inputMode="decimal"
                value={input.customTaxRatePercent}
                aria-invalid={Boolean(errors.customTaxRatePercent)}
                onChange={(e) => set({ customTaxRatePercent: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
            {errors.customTaxRatePercent ? (
              <p className="mt-1 text-xs text-rose-600">{errors.customTaxRatePercent}</p>
            ) : null}
          </div>
        ) : null}

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
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
          <div className="space-y-2">
            <div className="max-h-80 overflow-auto rounded-lg border border-border bg-white">
              <table className="w-full min-w-[320px] border-collapse text-left text-sm">
                <thead className="sticky top-0 bg-muted/80 text-[12px] font-semibold text-accent backdrop-blur">
                  <tr>
                    <th className="border-b border-border px-3 py-2">Year</th>
                    <th className="border-b border-border px-3 py-2">
                      Payout ({tableSymbol})
                    </th>
                    <th className="border-b border-border px-3 py-2">
                      Total payout ({tableSymbol})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result?.schedule.length ? (
                    result.schedule.map((row) => (
                      <tr key={row.year} className="odd:bg-white even:bg-muted/20">
                        <td className="border-b border-border/60 px-3 py-1.5 tabular-nums">
                          {row.year}
                        </td>
                        <td className="border-b border-border/60 px-3 py-1.5 tabular-nums">
                          {row.formattedPayout}
                        </td>
                        <td className="border-b border-border/60 px-3 py-1.5 tabular-nums">
                          {row.formattedTotalPayout}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-3 py-6 text-center text-xs text-muted-foreground"
                      >
                        Enter prize, years, growth, and return to build the payout table.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">
              {result?.tableCaption ??
                (input.taxTreatment === 'without'
                  ? 'Lottery annuity table without taxes.'
                  : input.taxTreatment === 'us'
                    ? 'US tax schedule unavailable; no brackets configured.'
                    : 'Lottery annuity table with customized tax rate.')}
            </p>
          </div>
        ) : null}
      </fieldset>
    </form>
  );
}
