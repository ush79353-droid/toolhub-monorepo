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
  FCFF_SOURCE_OPTIONS,
  showsCapex,
  showsDepreciation,
  showsInterest,
  showsNwc,
  sourceValueLabel,
  type FcffFieldErrors,
  type FcffInput,
  type FcffResult,
  type FcffSource,
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

interface FcffFormProps {
  input: FcffInput;
  errors: FcffFieldErrors;
  result: FcffResult | null;
  onChange: (input: FcffInput) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function FcffForm({
  input,
  errors,
  result,
  onChange,
  conversionError = null,
  ratesWarning = null,
}: FcffFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [localConversionError, setLocalConversionError] = React.useState<
    string | null
  >(null);

  const sourceSymbol = getCurrencySymbol(input.sourceValueCurrency);
  const daSymbol = getCurrencySymbol(input.depreciationCurrency);
  const interestSymbol = getCurrencySymbol(input.interestCurrency);
  const capexSymbol = getCurrencySymbol(input.capexCurrency);
  const nwcSymbol = getCurrencySymbol(input.nwcCurrency);
  const fcffSymbol = getCurrencySymbol(
    result?.currency ?? input.fcffCurrency
  );

  const set = (patch: Partial<FcffInput>) => {
    setLocalConversionError(null);
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

  const changeMoneyCurrency = (
    field: keyof Pick<
      FcffInput,
      | 'sourceValue'
      | 'depreciation'
      | 'interest'
      | 'capex'
      | 'nwc'
    >,
    currencyField: keyof Pick<
      FcffInput,
      | 'sourceValueCurrency'
      | 'depreciationCurrency'
      | 'interestCurrency'
      | 'capexCurrency'
      | 'nwcCurrency'
    >,
    next: SupportedCurrency
  ) => {
    const from = input[currencyField];
    if (next === from) return;
    const converted = convertFieldAmount(input[field], from, next);
    if (!converted.ok) {
      setLocalConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setLocalConversionError(null);
    onChange({
      ...input,
      [currencyField]: next,
      [field]: converted.text,
    });
  };

  const handleResultCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.fcffCurrency) return;
    const pairs: Array<[string, SupportedCurrency]> = [
      [input.sourceValue, input.sourceValueCurrency],
      [input.depreciation, input.depreciationCurrency],
      [input.interest, input.interestCurrency],
      [input.capex, input.capexCurrency],
      [input.nwc, input.nwcCurrency],
    ];
    for (const [raw, from] of pairs) {
      const amount = parseMoneyInput(raw);
      if (!Number.isFinite(amount)) continue;
      if (!canConvertPair(from, next)) {
        setLocalConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
    }
    setLocalConversionError(null);
    onChange({ ...input, fcffCurrency: next });
  };

  const showDa = showsDepreciation(input.source);
  const showInterest = showsInterest(input.source);
  const showCapex = showsCapex(input.source);
  const showNwc = showsNwc(input.source);
  const displayConversionError = conversionError ?? localConversionError;
  const displayRatesWarning = ratesWarning ?? ratesStatus.warning;

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.sourceOpen}
        onToggle={(event) => set({ sourceOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.sourceOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Source</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <div className={labelClass}>
              <span>Select source</span>
              <InfoTooltip
                label="Select source"
                text="Choose the starting earnings or cash-flow measure. Adjustment fields update to match the source formula."
              />
            </div>
            <div
              className="flex flex-col gap-2.5"
              role="radiogroup"
              aria-label="Select source"
            >
              {FCFF_SOURCE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-start gap-2 text-sm text-accent"
                >
                  <input
                    type="radio"
                    name="fcff-source"
                    className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                    checked={input.source === opt.value}
                    onChange={() =>
                      set({ source: opt.value as FcffSource })
                    }
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="fcff-source-value">
              <span>{sourceValueLabel(input.source)}</span>
              <InfoTooltip
                label={sourceValueLabel(input.source)}
                text="Starting value for the selected source. Changing currency converts this amount with stored FX rates."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.sourceValue}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {sourceSymbol}
                </span>
                <input
                  id="fcff-source-value"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.sourceValue}
                  aria-invalid={Boolean(errors.sourceValue)}
                  onChange={(e) => set({ sourceValue: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="fcff-source-value-currency"
                  value={input.sourceValueCurrency}
                  onChange={(next) =>
                    changeMoneyCurrency(
                      'sourceValue',
                      'sourceValueCurrency',
                      next
                    )
                  }
                  aria-label={`${sourceValueLabel(input.source)} currency`}
                />
              </div>
            </div>
            {errors.sourceValue ? (
              <p className="mt-1 text-xs text-rose-600">{errors.sourceValue}</p>
            ) : null}
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.adjustmentsOpen}
        onToggle={(event) =>
          set({ adjustmentsOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.adjustmentsOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Adjustments</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          {showDa ? (
            <div>
              <label className={labelClass} htmlFor="fcff-depreciation">
                <span>Depreciation and amortization</span>
                <InfoTooltip
                  label="Depreciation and amortization"
                  text="Non-cash D&A added back (NI/EBIT) or tax-shielded (EBITDA). Hidden for CFO."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.depreciation}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {daSymbol}
                  </span>
                  <input
                    id="fcff-depreciation"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.depreciation}
                    aria-invalid={Boolean(errors.depreciation)}
                    onChange={(e) => set({ depreciation: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="fcff-depreciation-currency"
                    value={input.depreciationCurrency}
                    onChange={(next) =>
                      changeMoneyCurrency(
                        'depreciation',
                        'depreciationCurrency',
                        next
                      )
                    }
                    aria-label="Depreciation and amortization currency"
                  />
                </div>
              </div>
              {errors.depreciation ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.depreciation}
                </p>
              ) : null}
            </div>
          ) : null}

          {showInterest ? (
            <div>
              <label className={labelClass} htmlFor="fcff-interest">
                <span>Interest expense</span>
                <InfoTooltip
                  label="Interest expense"
                  text="Used for the after-tax interest add-back Interest × (1 − T) in NI and CFO modes. Hidden for EBITDA/EBIT."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.interest}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {interestSymbol}
                  </span>
                  <input
                    id="fcff-interest"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.interest}
                    aria-invalid={Boolean(errors.interest)}
                    onChange={(e) => set({ interest: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="fcff-interest-currency"
                    value={input.interestCurrency}
                    onChange={(next) =>
                      changeMoneyCurrency('interest', 'interestCurrency', next)
                    }
                    aria-label="Interest expense currency"
                  />
                </div>
              </div>
              {errors.interest ? (
                <p className="mt-1 text-xs text-rose-600">{errors.interest}</p>
              ) : null}
            </div>
          ) : null}

          <div>
            <label className={labelClass} htmlFor="fcff-tax-rate">
              <span>Corporate tax rate</span>
              <InfoTooltip
                label="Corporate tax rate"
                text="Enter 0–100%. Converted to decimal T inside the formula. Never FX-converted."
              />
            </label>
            <FieldShell error={errors.taxRatePercent}>
              <input
                id="fcff-tax-rate"
                className={`${inputClass} pr-8`}
                inputMode="decimal"
                value={input.taxRatePercent}
                aria-invalid={Boolean(errors.taxRatePercent)}
                onChange={(e) => set({ taxRatePercent: e.target.value })}
              />
              <span
                className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                %
              </span>
            </FieldShell>
            {errors.taxRatePercent ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.taxRatePercent}
              </p>
            ) : null}
          </div>

          {showCapex ? (
            <div>
              <label className={labelClass} htmlFor="fcff-capex">
                <span>Fixed capital investment</span>
                <InfoTooltip
                  label="Fixed capital investment"
                  text="CapEx as a positive cash outflow subtracted in every source formula."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.capex}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {capexSymbol}
                  </span>
                  <input
                    id="fcff-capex"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.capex}
                    aria-invalid={Boolean(errors.capex)}
                    onChange={(e) => set({ capex: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="fcff-capex-currency"
                    value={input.capexCurrency}
                    onChange={(next) =>
                      changeMoneyCurrency('capex', 'capexCurrency', next)
                    }
                    aria-label="Fixed capital investment currency"
                  />
                </div>
              </div>
              {errors.capex ? (
                <p className="mt-1 text-xs text-rose-600">{errors.capex}</p>
              ) : null}
            </div>
          ) : null}

          {showNwc ? (
            <div>
              <label className={labelClass} htmlFor="fcff-nwc">
                <span>Working capital investment</span>
                <InfoTooltip
                  label="Working capital investment"
                  text="ΔNWC as a positive outflow (or negative when working capital is released). Hidden for CFO so it is not deducted twice."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.nwc}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {nwcSymbol}
                  </span>
                  <input
                    id="fcff-nwc"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.nwc}
                    aria-invalid={Boolean(errors.nwc)}
                    onChange={(e) => set({ nwc: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="fcff-nwc-currency"
                    value={input.nwcCurrency}
                    onChange={(next) =>
                      changeMoneyCurrency('nwc', 'nwcCurrency', next)
                    }
                    aria-label="Working capital investment currency"
                  />
                </div>
              </div>
              {errors.nwc ? (
                <p className="mt-1 text-xs text-rose-600">{errors.nwc}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </details>

      <div>
        <label className={labelClass} htmlFor="fcff-result">
          <span>Free cash flow to firm (FCFF)</span>
          <InfoTooltip
            label="Free cash flow to firm (FCFF)"
            text="Calculated FCFF in the selected result currency. May be negative. Not entered manually."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {fcffSymbol}
            </span>
            <input
              id="fcff-result"
              className={`${inputClass} font-semibold`}
              readOnly
              tabIndex={-1}
              value={result?.formattedFcff ?? ''}
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="fcff-result-currency"
              value={input.fcffCurrency}
              onChange={handleResultCurrencyChange}
              aria-label="FCFF currency"
            />
          </div>
        </div>
        {result?.formulaLabel ? (
          <p className="mt-1.5 text-xs text-muted-foreground">
            {result.formulaLabel}
          </p>
        ) : null}
      </div>

      <div className="rounded-lg border border-border bg-brand-softTeal/35 px-3 py-2.5 text-center text-sm text-accent">
        Check out{' '}
        <a
          href="#how-to-use"
          className="font-semibold text-primary underline underline-offset-2"
        >
          how to use this calculator!
        </a>
      </div>

      {displayConversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {displayConversionError}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {displayRatesWarning && !displayConversionError ? (
        <p className="text-xs text-amber-700">{displayRatesWarning}</p>
      ) : null}
    </form>
  );
}
