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
import { toMonthlyAmount } from './calculation';
import {
  MONEY_PERIOD_OPTIONS,
  type MoneyPeriod,
  type NetEffectiveRentFieldErrors,
  type NetEffectiveRentInput,
  type NetEffectiveRentResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full min-w-0 appearance-none rounded-lg border border-border bg-white px-2 pr-7 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';

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

function UnitSelect({
  id,
  value,
  ariaLabel,
  options,
  onChange,
  widthClass = 'w-[88px]',
  disabled,
}: {
  id: string;
  value: string;
  ariaLabel: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
  widthClass?: string;
  disabled?: boolean;
}) {
  return (
    <div className={`relative ${widthClass} shrink-0`}>
      <select
        id={id}
        className={selectClass}
        value={value}
        aria-label={ariaLabel}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            / {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
}

interface NetEffectiveRentFormProps {
  input: NetEffectiveRentInput;
  errors: NetEffectiveRentFieldErrors;
  result: NetEffectiveRentResult | null;
  onChange: (input: NetEffectiveRentInput) => void;
}

export function NetEffectiveRentForm({
  input,
  errors,
  result,
  onChange,
}: NetEffectiveRentFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const rentSymbol = getCurrencySymbol(input.monthlyRentCurrency);
  const allowanceSymbol = getCurrencySymbol(input.tenantCashAllowanceCurrency);
  const opExSymbol = getCurrencySymbol(input.operatingCostsCurrency);
  const monthlyResultSymbol = getCurrencySymbol(input.monthlyResultCurrency);
  const annualResultSymbol = getCurrencySymbol(input.annualResultCurrency);

  const set = (patch: Partial<NetEffectiveRentInput>) => {
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

  const handleMoneyCurrencyChange = (
    amountKey: 'monthlyRent' | 'tenantCashAllowance' | 'operatingCosts',
    currencyKey:
      | 'monthlyRentCurrency'
      | 'tenantCashAllowanceCurrency'
      | 'operatingCostsCurrency',
    next: SupportedCurrency
  ) => {
    const current = input[currencyKey];
    if (next === current) return;
    const amount = parseMoneyInput(String(input[amountKey]));
    if (!Number.isFinite(amount)) {
      set({ [currencyKey]: next } as Partial<NetEffectiveRentInput>);
      return;
    }
    const converted = convertFieldAmount(amount, current, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    set({
      [currencyKey]: next,
      [amountKey]: moneyAmountToInputString(converted),
    } as Partial<NetEffectiveRentInput>);
  };

  const handleRentPeriodChange = (next: MoneyPeriod) => {
    if (next === input.monthlyRentPeriod) return;
    const amount = parseMoneyInput(input.monthlyRent);
    if (!Number.isFinite(amount)) {
      set({ monthlyRentPeriod: next });
      return;
    }
    const monthly = toMonthlyAmount(amount, input.monthlyRentPeriod);
    if (monthly === null) {
      set({ monthlyRentPeriod: next });
      return;
    }
    const reexpressed = next === 'month' ? monthly : monthly * 12;
    set({
      monthlyRentPeriod: next,
      monthlyRent: moneyAmountToInputString(reexpressed),
    });
  };

  const handleOpExPeriodChange = (next: MoneyPeriod) => {
    if (next === input.operatingCostsPeriod) return;
    const amount = parseMoneyInput(input.operatingCosts);
    if (!Number.isFinite(amount)) {
      set({ operatingCostsPeriod: next });
      return;
    }
    const monthly = toMonthlyAmount(amount, input.operatingCostsPeriod);
    if (monthly === null) {
      set({ operatingCostsPeriod: next });
      return;
    }
    const reexpressed = next === 'month' ? monthly : monthly * 12;
    set({
      operatingCostsPeriod: next,
      operatingCosts: moneyAmountToInputString(reexpressed),
    });
  };

  const handleResultCurrencyChange = (
    key: 'monthlyResultCurrency' | 'annualResultCurrency',
    next: SupportedCurrency
  ) => {
    if (next === input[key]) return;
    if (
      next !== input.monthlyRentCurrency &&
      !canConvertPair(input.monthlyRentCurrency, next)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    set({ [key]: next } as Partial<NetEffectiveRentInput>);
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="sr-only">Term and rent</legend>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => set({ termSectionOpen: !input.termSectionOpen })}
          aria-expanded={input.termSectionOpen}
        >
          <span className="text-[13px] font-semibold text-accent">Term and rent</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              input.termSectionOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {input.termSectionOpen ? (
          <div className="space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="ner-lease-years">
                Lease term
              </label>
              <div className="grid grid-cols-2 gap-2">
                <FieldShell error={errors.leaseYears}>
                  <input
                    id="ner-lease-years"
                    className={`${inputClass} pr-10`}
                    inputMode="numeric"
                    value={input.leaseYears}
                    aria-invalid={Boolean(errors.leaseYears)}
                    onChange={(e) => set({ leaseYears: e.target.value })}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                    yrs
                  </span>
                </FieldShell>
                <div className="relative">
                  <select
                    id="ner-lease-months"
                    className={selectClass}
                    value={input.leaseMonths}
                    aria-invalid={Boolean(errors.leaseMonths)}
                    aria-label="Lease months"
                    onChange={(e) => set({ leaseMonths: e.target.value })}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={String(i)}>
                        {i} mos
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.leaseYears ? (
                <p className="mt-1 text-xs text-rose-600">{errors.leaseYears}</p>
              ) : errors.leaseMonths ? (
                <p className="mt-1 text-xs text-rose-600">{errors.leaseMonths}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="ner-monthly-rent">
                Monthly rent
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.monthlyRent}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {rentSymbol}
                  </span>
                  <input
                    id="ner-monthly-rent"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.monthlyRent}
                    aria-invalid={Boolean(errors.monthlyRent)}
                    onChange={(e) => set({ monthlyRent: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[100px] shrink-0 sm:w-[110px]">
                  <CurrencySelect
                    id="ner-monthly-rent-currency"
                    value={input.monthlyRentCurrency}
                    onChange={(next) =>
                      handleMoneyCurrencyChange(
                        'monthlyRent',
                        'monthlyRentCurrency',
                        next
                      )
                    }
                    aria-label="Monthly rent currency"
                  />
                </div>
                <UnitSelect
                  id="ner-monthly-rent-period"
                  value={input.monthlyRentPeriod}
                  ariaLabel="Monthly rent period"
                  options={MONEY_PERIOD_OPTIONS}
                  onChange={(v) => handleRentPeriodChange(v as MoneyPeriod)}
                />
              </div>
              {errors.monthlyRent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.monthlyRent}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="sr-only">Discounts for tenants</legend>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() =>
            set({ discountsSectionOpen: !input.discountsSectionOpen })
          }
          aria-expanded={input.discountsSectionOpen}
        >
          <span className="text-[13px] font-semibold text-accent">
            Discounts for tenants
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              input.discountsSectionOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {input.discountsSectionOpen ? (
          <div className="space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="ner-rent-free">
                No. of rent-free months
              </label>
              <FieldShell error={errors.rentFreeMonths}>
                <input
                  id="ner-rent-free"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.rentFreeMonths}
                  aria-invalid={Boolean(errors.rentFreeMonths)}
                  onChange={(e) => set({ rentFreeMonths: e.target.value })}
                />
              </FieldShell>
              {errors.rentFreeMonths ? (
                <p className="mt-1 text-xs text-rose-600">{errors.rentFreeMonths}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="ner-allowance">
                <span>Tenant cash allowance</span>
                <InfoTooltip
                  label="Tenant cash allowance"
                  text="One-time cash concession to the tenant, subtracted from lease value before averaging into net effective rent."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.tenantCashAllowance}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {allowanceSymbol}
                  </span>
                  <input
                    id="ner-allowance"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.tenantCashAllowance}
                    aria-invalid={Boolean(errors.tenantCashAllowance)}
                    onChange={(e) => set({ tenantCashAllowance: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[100px] shrink-0 sm:w-[110px]">
                  <CurrencySelect
                    id="ner-allowance-currency"
                    value={input.tenantCashAllowanceCurrency}
                    onChange={(next) =>
                      handleMoneyCurrencyChange(
                        'tenantCashAllowance',
                        'tenantCashAllowanceCurrency',
                        next
                      )
                    }
                    aria-label="Tenant cash allowance currency"
                  />
                </div>
              </div>
              {errors.tenantCashAllowance ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.tenantCashAllowance}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="sr-only">Additional landlord expenses</legend>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() =>
            set({ expensesSectionOpen: !input.expensesSectionOpen })
          }
          aria-expanded={input.expensesSectionOpen}
        >
          <span className="text-[13px] font-semibold text-accent">
            Additional landlord expenses
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              input.expensesSectionOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {input.expensesSectionOpen ? (
          <div className="space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="ner-opex">
                <span>Operating costs</span>
                <InfoTooltip
                  label="Operating costs"
                  text="Fixed landlord operating costs for the selected period, converted to a monthly amount and applied across the full lease term."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.operatingCosts}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {opExSymbol}
                  </span>
                  <input
                    id="ner-opex"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.operatingCosts}
                    aria-invalid={Boolean(errors.operatingCosts)}
                    onChange={(e) => set({ operatingCosts: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[100px] shrink-0 sm:w-[110px]">
                  <CurrencySelect
                    id="ner-opex-currency"
                    value={input.operatingCostsCurrency}
                    onChange={(next) =>
                      handleMoneyCurrencyChange(
                        'operatingCosts',
                        'operatingCostsCurrency',
                        next
                      )
                    }
                    aria-label="Operating costs currency"
                  />
                </div>
                <UnitSelect
                  id="ner-opex-period"
                  value={input.operatingCostsPeriod}
                  ariaLabel="Operating costs period"
                  options={MONEY_PERIOD_OPTIONS}
                  onChange={(v) => handleOpExPeriodChange(v as MoneyPeriod)}
                />
              </div>
              {errors.operatingCosts ? (
                <p className="mt-1 text-xs text-rose-600">{errors.operatingCosts}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="ner-opex-pct">
                <span>Operating costs %</span>
                <InfoTooltip
                  label="Operating costs %"
                  text="Percent of monthly rent treated as monthly operating cost, then applied across the lease term. Not currency-converted."
                />
              </label>
              <FieldShell error={errors.operatingCostsPercent}>
                <input
                  id="ner-opex-pct"
                  className={`${inputClass} pr-10`}
                  inputMode="decimal"
                  value={input.operatingCostsPercent}
                  aria-invalid={Boolean(errors.operatingCostsPercent)}
                  onChange={(e) => set({ operatingCostsPercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-accent">
                  %
                </span>
              </FieldShell>
              {errors.operatingCostsPercent ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.operatingCostsPercent}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Net effective rent (monthly)
        </legend>
        <div>
          <label className={labelClass} htmlFor="ner-result-monthly">
            Net effective rent
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {monthlyResultSymbol}
              </span>
              <input
                id="ner-result-monthly"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedMonthly : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[100px] shrink-0 sm:w-[110px]">
              <CurrencySelect
                id="ner-result-monthly-currency"
                value={input.monthlyResultCurrency}
                onChange={(next) =>
                  handleResultCurrencyChange('monthlyResultCurrency', next)
                }
                aria-label="Monthly net effective rent currency"
              />
            </div>
            <UnitSelect
              id="ner-result-monthly-period"
              value="month"
              ariaLabel="Monthly net effective rent period"
              options={MONEY_PERIOD_OPTIONS}
              onChange={() => undefined}
              disabled
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Net effective rent (annual)
        </legend>
        <div>
          <label className={labelClass} htmlFor="ner-result-annual">
            Net effective rent
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {annualResultSymbol}
              </span>
              <input
                id="ner-result-annual"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedAnnual : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[100px] shrink-0 sm:w-[110px]">
              <CurrencySelect
                id="ner-result-annual-currency"
                value={input.annualResultCurrency}
                onChange={(next) =>
                  handleResultCurrencyChange('annualResultCurrency', next)
                }
                aria-label="Annual net effective rent currency"
              />
            </div>
            <UnitSelect
              id="ner-result-annual-period"
              value="year"
              ariaLabel="Annual net effective rent period"
              options={MONEY_PERIOD_OPTIONS}
              onChange={() => undefined}
              disabled
            />
          </div>
        </div>
        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
        {conversionError ? (
          <p className="text-xs text-rose-600" role="alert">
            {conversionError}
          </p>
        ) : null}
        {ratesStatus.warning && !conversionError ? (
          <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
        ) : null}
      </fieldset>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border"
          checked={false}
          disabled
          aria-disabled="true"
          title="Area-based calculations are not defined in the reference formulas for this calculator."
        />
        <span>Enable area-based calculations?</span>
      </label>
      <p className="text-xs text-muted-foreground">
 Area-based mode is shown for screenshot parity but is not available; no area
        fields or formulas were specified.
      </p>
    </form>
  );
}
