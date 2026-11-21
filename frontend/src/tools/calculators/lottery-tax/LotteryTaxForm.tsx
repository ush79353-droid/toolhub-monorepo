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
import { lumpSumFromAnnuity, formatLotteryTaxMoney } from './calculation';
import type {
  LotteryTaxDraft,
  LotteryTaxFieldErrors,
  LotteryTaxMode,
  LotteryTaxResult,
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

interface LotteryTaxFormProps {
  input: LotteryTaxDraft;
  errors: LotteryTaxFieldErrors;
  result: LotteryTaxResult | null;
  onChange: (input: LotteryTaxDraft) => void;
}

export function LotteryTaxForm({
  input,
  errors,
  result,
  onChange,
}: LotteryTaxFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const annuitySymbol = getCurrencySymbol(input.annuityCurrency);
  const lumpSymbol = getCurrencySymbol(input.lumpSumCurrency);

  const annuityNum = parseMoneyInput(input.annuityPayout);
  const percentNum = Number(input.lumpSumPercent.replace(/,/g, ''));
  const liveLump =
    Number.isFinite(annuityNum) && Number.isFinite(percentNum)
      ? lumpSumFromAnnuity(annuityNum, percentNum)
      : null;
  const displayLump =
    liveLump !== null
      ? formatLotteryTaxMoney(liveLump, input.annuityCurrency)
      : '';

  const canConvertPair = (from: SupportedCurrency, to: SupportedCurrency) => {
    if (from === to) return true;
    return (
      rates.available &&
      isCurrencyRateUsable(rates.rates, from) &&
      isCurrencyRateUsable(rates.rates, to)
    );
  };

  const handleAnnuityCurrency = (next: SupportedCurrency) => {
    if (next === input.annuityCurrency) return;
    const amount = parseMoneyInput(input.annuityPayout);
    if (!Number.isFinite(amount)) {
      if (!canConvertPair(next, input.lumpSumCurrency)) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, annuityCurrency: next });
      return;
    }
    if (!canConvertPair(input.annuityCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertCurrency({
      amount,
      from: input.annuityCurrency,
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
      annuityCurrency: next,
      annuityPayout: moneyAmountToInputString(converted.amount),
    });
  };

  const handleLumpCurrency = (next: SupportedCurrency) => {
    if (next === input.lumpSumCurrency) return;
    if (!canConvertPair(input.annuityCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, lumpSumCurrency: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-3.5"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="lottery-tax-annuity">
          <span>Annuity payout</span>
          <InfoTooltip
            label="Annuity payout"
            text="Advertised annuity jackpot; treated as the sum of nominal annual payments."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.annuityPayout}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              {annuitySymbol}
            </span>
            <input
              id="lottery-tax-annuity"
              className={inputClass}
              inputMode="decimal"
              value={input.annuityPayout}
              onChange={(e) => onChange({ ...input, annuityPayout: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="lottery-tax-annuity-currency"
              value={input.annuityCurrency}
              onChange={handleAnnuityCurrency}
              aria-label="Annuity payout currency"
            />
          </div>
        </div>
        {errors.annuityPayout ? (
          <p className="mt-1 text-xs text-rose-600">{errors.annuityPayout}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="lottery-tax-percent">
          <span>Lump sum payout percentage</span>
        </label>
        <FieldShell error={errors.lumpSumPercent}>
          <input
            id="lottery-tax-percent"
            className={inputClass}
            inputMode="decimal"
            value={input.lumpSumPercent}
            onChange={(e) => onChange({ ...input, lumpSumPercent: e.target.value })}
          />
          <span className="shrink-0 pr-3 text-sm text-muted-foreground">%</span>
        </FieldShell>
        {errors.lumpSumPercent ? (
          <p className="mt-1 text-xs text-rose-600">{errors.lumpSumPercent}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="lottery-tax-lump">
          <span>Lump sum payout</span>
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              {lumpSymbol}
            </span>
            <input
              id="lottery-tax-lump"
              className={`${inputClass} font-semibold`}
              readOnly
              value={displayLump}
              aria-readonly="true"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="lottery-tax-lump-currency"
              value={input.lumpSumCurrency}
              onChange={handleLumpCurrency}
              aria-label="Lump sum payout currency"
            />
          </div>
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Tax treatment</legend>
        <div className="flex flex-wrap gap-4 text-sm text-accent">
          {([
            ['us', 'US taxes'],
            ['custom', 'Customized tax rates'],
          ] as const).map(([value, label]) => (
            <label key={value} className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="lottery-tax-mode"
                checked={input.taxMode === value}
                onChange={() =>
                  onChange({ ...input, taxMode: value as LotteryTaxMode })
                }
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {input.taxMode === 'custom' ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="lottery-tax-rate-i">
              Tax rate I
            </label>
            <FieldShell error={errors.taxRateI}>
              <input
                id="lottery-tax-rate-i"
                className={inputClass}
                inputMode="decimal"
                value={input.taxRateI}
                onChange={(e) => onChange({ ...input, taxRateI: e.target.value })}
              />
              <span className="shrink-0 pr-3 text-sm text-muted-foreground">%</span>
            </FieldShell>
            {errors.taxRateI ? (
              <p className="mt-1 text-xs text-rose-600">{errors.taxRateI}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="lottery-tax-rate-ii">
              Tax rate II
            </label>
            <FieldShell error={errors.taxRateII}>
              <input
                id="lottery-tax-rate-ii"
                className={inputClass}
                inputMode="decimal"
                value={input.taxRateII}
                onChange={(e) => onChange({ ...input, taxRateII: e.target.value })}
              />
              <span className="shrink-0 pr-3 text-sm text-muted-foreground">%</span>
            </FieldShell>
            {errors.taxRateII ? (
              <p className="mt-1 text-xs text-rose-600">{errors.taxRateII}</p>
            ) : null}
          </div>
        </div>
      ) : (
        <p className="text-xs leading-relaxed text-muted-foreground">
          US mode uses IRC §3402(q) <strong>24%</strong> federal withholding as Tax I
          (withholding, not final tax). Tax II stays 0% unless you switch to customized rates.
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between bg-muted/30 px-3 py-2.5 text-left text-sm font-semibold text-accent"
          onClick={() => onChange({ ...input, setupOpen: !input.setupOpen })}
          aria-expanded={input.setupOpen}
        >
          Annuity setup
          <ChevronDown
            className={`h-4 w-4 transition-transform ${input.setupOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {input.setupOpen ? (
          <div className="space-y-3 border-t border-border p-3">
            <div>
              <label className={labelClass} htmlFor="lottery-tax-years">
                Number of years
              </label>
              <FieldShell error={errors.years}>
                <input
                  id="lottery-tax-years"
                  className={inputClass}
                  inputMode="numeric"
                  value={input.years}
                  onChange={(e) => onChange({ ...input, years: e.target.value })}
                />
              </FieldShell>
              {errors.years ? (
                <p className="mt-1 text-xs text-rose-600">{errors.years}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="lottery-tax-growth">
                Annual payout growth
              </label>
              <FieldShell error={errors.growthPercent}>
                <input
                  id="lottery-tax-growth"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.growthPercent}
                  onChange={(e) => onChange({ ...input, growthPercent: e.target.value })}
                />
                <span className="shrink-0 pr-3 text-sm text-muted-foreground">%</span>
              </FieldShell>
              {errors.growthPercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.growthPercent}</p>
              ) : null}
              <p className="mt-1 text-xs text-muted-foreground">
                Defaults 30 years · 5% growth. Payments sum to the advertised annuity (nominal).
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {result ? (
        <>
          <div className="overflow-hidden rounded-xl border border-border">
            <button
              type="button"
              className="flex w-full items-center justify-between bg-muted/30 px-3 py-2.5 text-left text-sm font-semibold text-accent"
              onClick={() => onChange({ ...input, resultsOpen: !input.resultsOpen })}
              aria-expanded={input.resultsOpen}
            >
              Results
              <ChevronDown
                className={`h-4 w-4 transition-transform ${input.resultsOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {input.resultsOpen ? (
              <div className="border-t border-border p-3">
                <div className="overflow-x-auto">
                  <table className="min-w-[480px] w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="py-2 pr-2 font-medium" />
                        <th className="py-2 pr-2 font-medium">Lump sum</th>
                        <th className="py-2 pr-2 font-medium">Annuity</th>
                        <th className="py-2 font-medium">Differ.</th>
                      </tr>
                    </thead>
                    <tbody className="tabular-nums text-accent">
                      {(
                        [
                          ['Payout', 'formattedPayout'],
                          ['Tax I', 'formattedTaxI'],
                          ['Tax II', 'formattedTaxII'],
                          ['Net payout', 'formattedNet'],
                        ] as const
                      ).map(([label, key]) => (
                        <tr key={label} className="border-b border-border/60">
                          <td className="py-1.5 pr-2 font-medium">{label}</td>
                          <td className="py-1.5 pr-2">{result.lumpSum[key]}</td>
                          <td className="py-1.5 pr-2">{result.annuity[key]}</td>
                          <td className="py-1.5">{result.difference[key]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  You may need to scroll the table horizontally on small screens. Currently the
                  gross lump-sum payout percentage is {result.lumpSumPercent}%. Nominal comparison
 only; no time-value discount.
                </p>
                {result.usTaxNote ? (
                  <p className="mt-2 text-xs text-amber-800">{result.usTaxNote}</p>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-xl border border-border">
            <button
              type="button"
              className="flex w-full items-center justify-between bg-muted/30 px-3 py-2.5 text-left text-sm font-semibold text-accent"
              onClick={() => onChange({ ...input, scheduleOpen: !input.scheduleOpen })}
              aria-expanded={input.scheduleOpen}
            >
              Annuity schedule
              <ChevronDown
                className={`h-4 w-4 transition-transform ${input.scheduleOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {input.scheduleOpen ? (
              <div className="border-t border-border p-3">
                <div className="max-h-72 overflow-auto">
                  <table className="min-w-[520px] w-full text-left text-xs sm:text-sm">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="py-2 pr-2 font-medium">Year</th>
                        <th className="py-2 pr-2 font-medium">Gross payment</th>
                        <th className="py-2 pr-2 font-medium">Tax I</th>
                        <th className="py-2 pr-2 font-medium">Tax II</th>
                        <th className="py-2 font-medium">Net payment</th>
                      </tr>
                    </thead>
                    <tbody className="tabular-nums text-accent">
                      {result.schedule.map((row) => (
                        <tr key={row.year} className="border-b border-border/50">
                          <td className="py-1 pr-2">{row.year}</td>
                          <td className="py-1 pr-2">{row.formattedGross}</td>
                          <td className="py-1 pr-2">{row.formattedTaxI}</td>
                          <td className="py-1 pr-2">{row.formattedTaxII}</td>
                          <td className="py-1">{row.formattedNet}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </div>
        </>
      ) : null}

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
