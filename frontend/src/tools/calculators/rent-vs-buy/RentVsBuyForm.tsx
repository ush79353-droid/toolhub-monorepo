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
  CostFrequency,
  DurationUnit,
  RentVsBuyFieldErrors,
  RentVsBuyInput,
  RentVsBuyResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 w-full appearance-none rounded-lg border border-border bg-white px-2.5 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';

const DURATION_UNITS: readonly { value: DurationUnit; label: string }[] = [
  { value: 'years', label: 'yrs' },
  { value: 'months', label: 'mos' },
];

const COST_FREQ: readonly { value: CostFrequency; label: string }[] = [
  { value: 'week', label: 'wk' },
  { value: 'month', label: 'mo' },
  { value: 'year', label: 'yr' },
];

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

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

interface RentVsBuyFormProps {
  input: RentVsBuyInput;
  errors: RentVsBuyFieldErrors;
  result: RentVsBuyResult | null;
  onChange: (input: RentVsBuyInput) => void;
}

export function RentVsBuyForm({
  input,
  errors,
  result,
  onChange,
}: RentVsBuyFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [rentOpen, setRentOpen] = React.useState(true);
  const [buyOpen, setBuyOpen] = React.useState(true);

  const set = (patch: Partial<RentVsBuyInput>) => {
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
    key:
      | 'moneyCurrency'
      | 'rentCurrency'
      | 'agentCommissionCurrency'
      | 'otherRentCostsCurrency'
      | 'propertyCurrency',
    next: SupportedCurrency,
    amountKey:
      | 'moneyYouHave'
      | 'rentPrice'
      | 'agentCommission'
      | 'otherRentCosts'
      | 'propertyCost'
  ) => {
    if (next === input[key]) return;
    const amount = parseMoneyInput(input[amountKey]);
    if (!Number.isFinite(amount)) {
      if (key === 'moneyCurrency') {
        const others: SupportedCurrency[] = [
          input.rentCurrency,
          input.agentCommissionCurrency,
          input.otherRentCostsCurrency,
          input.propertyCurrency,
          input.rentCostCurrency,
          input.totalRentCostCurrency,
          input.mortgageLeftCurrency,
          input.buyCostCurrency,
          input.totalBuyCostCurrency,
        ];
        if (others.some((c) => c !== next && !canConvertPair(next, c))) {
          setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
          return;
        }
      }
      setConversionError(null);
      onChange({ ...input, [key]: next });
      return;
    }
    if (!canConvertPair(input[key], next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertFieldAmount(amount, input[key], next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      [key]: next,
      [amountKey]: moneyAmountToInputString(converted),
    });
  };

  const handleDisplayCurrencyChange = (
    key:
      | 'rentCostCurrency'
      | 'totalRentCostCurrency'
      | 'mortgageLeftCurrency'
      | 'buyCostCurrency'
      | 'totalBuyCostCurrency',
    next: SupportedCurrency
  ) => {
    if (next === input[key]) return;
    if (next !== input.moneyCurrency && !canConvertPair(input.moneyCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, [key]: next });
  };

  const moneyField = (
    id: string,
    label: string,
    tip: string,
    valueKey:
      | 'moneyYouHave'
      | 'rentPrice'
      | 'agentCommission'
      | 'otherRentCosts'
      | 'propertyCost',
    currencyKey:
      | 'moneyCurrency'
      | 'rentCurrency'
      | 'agentCommissionCurrency'
      | 'otherRentCostsCurrency'
      | 'propertyCurrency',
    errorKey: keyof RentVsBuyFieldErrors,
    freq?: {
      value: CostFrequency;
      onChange: (v: CostFrequency) => void;
      aria: string;
    }
  ) => (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex flex-wrap gap-2">
        <FieldShell error={errors[errorKey]}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
            {getCurrencySymbol(input[currencyKey])}
          </span>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={input[valueKey]}
            aria-invalid={Boolean(errors[errorKey])}
            onChange={(e) => set({ [valueKey]: e.target.value })}
          />
        </FieldShell>
        <div className="w-[100px] shrink-0 sm:w-[110px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={input[currencyKey]}
            onChange={(c) => handleMoneyCurrencyChange(currencyKey, c, valueKey)}
            aria-label={`${label} currency`}
          />
        </div>
        {freq ? (
          <div className="w-[72px] shrink-0">
            <select
              className={unitSelectClass}
              value={freq.value}
              aria-label={freq.aria}
              onChange={(e) => freq.onChange(e.target.value as CostFrequency)}
            >
              {COST_FREQ.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>
      {errors[errorKey] ? (
        <p className="mt-1 text-xs text-rose-600">{errors[errorKey]}</p>
      ) : null}
    </div>
  );

  const percentField = (
    id: string,
    label: string,
    tip: string,
    valueKey:
      | 'depositInterestPercent'
      | 'mortgageRatePercent'
      | 'buyingCommissionPercent'
      | 'sellingCommissionPercent'
      | 'otherFeesPercent'
      | 'appreciationPercent',
    errorKey: keyof RentVsBuyFieldErrors,
    suffix?: string
  ) => (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex flex-wrap gap-2">
        <FieldShell error={errors[errorKey]}>
          <input
            id={id}
            className={`${inputClass} pr-8`}
            inputMode="decimal"
            value={input[valueKey]}
            aria-invalid={Boolean(errors[errorKey])}
            onChange={(e) => set({ [valueKey]: e.target.value })}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </FieldShell>
        {suffix ? (
          <div className="flex h-11 w-[72px] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30 px-2 text-sm text-muted-foreground">
            {suffix}
          </div>
        ) : null}
      </div>
      {errors[errorKey] ? (
        <p className="mt-1 text-xs text-rose-600">{errors[errorKey]}</p>
      ) : null}
    </div>
  );

  const resultMoney = (
    id: string,
    label: string,
    tip: string,
    formatted: string,
    currency: SupportedCurrency,
    onCurrency: (c: SupportedCurrency) => void,
    currencyAria: string,
    freq?: { value: CostFrequency; onChange: (v: CostFrequency) => void; aria: string }
  ) => (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex flex-wrap gap-2">
        <FieldShell muted>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
            {getCurrencySymbol(currency)}
          </span>
          <input
            id={id}
            className={`${inputClass} font-semibold`}
            readOnly
            value={result ? formatted : ''}
            aria-live="polite"
          />
        </FieldShell>
        <div className="w-[100px] shrink-0 sm:w-[110px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={onCurrency}
            aria-label={currencyAria}
          />
        </div>
        {freq ? (
          <div className="w-[72px] shrink-0">
            <select
              className={unitSelectClass}
              value={freq.value}
              aria-label={freq.aria}
              onChange={(e) => freq.onChange(e.target.value as CostFrequency)}
            >
              {COST_FREQ.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>
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
        <legend className="sr-only">Savings</legend>
        <div>
          <label className={labelClass} htmlFor="rvb-staying">
            <span>Staying period</span>
            <InfoTooltip
              label="Staying period"
              text="How long you plan to stay before moving out or selling."
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <FieldShell error={errors.stayingPeriod}>
              <input
                id="rvb-staying"
                className={inputClass}
                inputMode="decimal"
                value={input.stayingPeriod}
                aria-invalid={Boolean(errors.stayingPeriod)}
                onChange={(e) => set({ stayingPeriod: e.target.value })}
              />
            </FieldShell>
            <div className="w-[88px] shrink-0">
              <select
                className={unitSelectClass}
                value={input.stayingUnit}
                aria-label="Staying period unit"
                onChange={(e) => set({ stayingUnit: e.target.value as DurationUnit })}
              >
                {DURATION_UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {errors.stayingPeriod ? (
            <p className="mt-1 text-xs text-rose-600">{errors.stayingPeriod}</p>
          ) : null}
        </div>

        {moneyField(
          'rvb-money',
          'Money you have',
          'Cash for a deposit account when renting, or the down payment when buying. Calculation currency for the comparison.',
          'moneyYouHave',
          'moneyCurrency',
          'moneyYouHave'
        )}
      </fieldset>

      <CollapsibleSection title="Rent" open={rentOpen} onToggle={() => setRentOpen((v) => !v)}>
        {moneyField(
          'rvb-rent',
          'Rent price',
          'Periodic rent excluding utilities (assumed similar for rent and buy).',
          'rentPrice',
          'rentCurrency',
          'rentPrice',
          {
            value: input.rentFrequency,
            onChange: (rentFrequency) => set({ rentFrequency }),
            aria: 'Rent frequency',
          }
        )}
        {moneyField(
          'rvb-agent',
          'Agent commission',
          'One-off estate-agent fee when renting.',
          'agentCommission',
          'agentCommissionCurrency',
          'agentCommission'
        )}
        {moneyField(
          'rvb-other-rent',
          'Other costs',
          'Other one-off renting costs (moving, insurance, furnishings, etc.).',
          'otherRentCosts',
          'otherRentCostsCurrency',
          'otherRentCosts'
        )}
        {percentField(
          'rvb-deposit-rate',
          'Increase rate (deposit)',
          'Annual deposit rate earned on money you have while renting. Enter 0 if that cash is spent.',
          'depositInterestPercent',
          'depositInterestPercent'
        )}
        {resultMoney(
          'rvb-rent-cost',
          'Rent cost',
          'Average periodic rent cost over the staying period (total rent cost ÷ periods).',
          result?.formattedRentCost ?? '',
          input.rentCostCurrency,
          (c) => handleDisplayCurrencyChange('rentCostCurrency', c),
          'Rent cost currency',
          {
            value: input.rentCostFrequency,
            onChange: (rentCostFrequency) => set({ rentCostFrequency }),
            aria: 'Rent cost frequency',
          }
        )}
        {resultMoney(
          'rvb-total-rent',
          'Total rent cost',
          'Rent payments + agent + other − deposit interest over the full staying period.',
          result?.formattedTotalRentCost ?? '',
          input.totalRentCostCurrency,
          (c) => handleDisplayCurrencyChange('totalRentCostCurrency', c),
          'Total rent cost currency'
        )}
      </CollapsibleSection>

      <CollapsibleSection title="Buy" open={buyOpen} onToggle={() => setBuyOpen((v) => !v)}>
        {moneyField(
          'rvb-property',
          'Cost of the property',
          'Purchase price (and adaptation) of the home.',
          'propertyCost',
          'propertyCurrency',
          'propertyCost'
        )}
        {percentField(
          'rvb-mort-rate',
          'Interest rate (mortgage)',
          'Fixed annual mortgage rate for standard amortization.',
          'mortgageRatePercent',
          'mortgageRatePercent'
        )}
        <div>
          <label className={labelClass} htmlFor="rvb-loan-term">
            <span>Loan term</span>
            <InfoTooltip
              label="Loan term"
              text="Full amortization length of the mortgage (not limited to the staying period)."
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <FieldShell error={errors.loanTerm}>
              <input
                id="rvb-loan-term"
                className={inputClass}
                inputMode="decimal"
                value={input.loanTerm}
                aria-invalid={Boolean(errors.loanTerm)}
                onChange={(e) => set({ loanTerm: e.target.value })}
              />
            </FieldShell>
            <div className="w-[88px] shrink-0">
              <select
                className={unitSelectClass}
                value={input.loanTermUnit}
                aria-label="Loan term unit"
                onChange={(e) => set({ loanTermUnit: e.target.value as DurationUnit })}
              >
                {DURATION_UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {errors.loanTerm ? (
            <p className="mt-1 text-xs text-rose-600">{errors.loanTerm}</p>
          ) : null}
        </div>
        {resultMoney(
          'rvb-mort-left',
          'Mortgage',
          'Remaining principal after mortgage payments during the staying period.',
          result?.formattedMortgageLeft ?? '',
          input.mortgageLeftCurrency,
          (c) => handleDisplayCurrencyChange('mortgageLeftCurrency', c),
          'Mortgage currency'
        )}
        {percentField(
          'rvb-buy-comm',
          'Buying commission',
          'Purchase-side commissions and closing costs as a percent of property cost.',
          'buyingCommissionPercent',
          'buyingCommissionPercent'
        )}
        {percentField(
          'rvb-sell-comm',
          'Realtor commission',
          'Sale-side realtor commissions as a percent of the appreciated property value.',
          'sellingCommissionPercent',
          'sellingCommissionPercent'
        )}
        {percentField(
          'rvb-other-fees',
          'Other fees',
          'Annual ownership costs (tax, insurance, repairs) as a percent of purchase price.',
          'otherFeesPercent',
          'otherFeesPercent'
        )}
        {percentField(
          'rvb-apprec',
          'Appreciation',
          'Annual growth rate of the property value.',
          'appreciationPercent',
          'appreciationPercent',
          'year'
        )}
        {resultMoney(
          'rvb-buy-cost',
          'Buy cost',
          'Average periodic buy cost over the staying period (total buy cost ÷ periods).',
          result?.formattedBuyCost ?? '',
          input.buyCostCurrency,
          (c) => handleDisplayCurrencyChange('buyCostCurrency', c),
          'Buy cost currency',
          {
            value: input.buyCostFrequency,
            onChange: (buyCostFrequency) => set({ buyCostFrequency }),
            aria: 'Buy cost frequency',
          }
        )}
        {resultMoney(
          'rvb-total-buy',
          'Total buy cost',
          'Net buy cost over the staying period. Negative means buying earns under these assumptions.',
          result?.formattedTotalBuyCost ?? '',
          input.totalBuyCostCurrency,
          (c) => handleDisplayCurrencyChange('totalBuyCostCurrency', c),
          'Total buy cost currency'
        )}
      </CollapsibleSection>

      {conversionError || ratesStatus.warning ? (
        <p
          className={`text-xs ${conversionError ? 'text-rose-600' : 'text-amber-700'}`}
          role="status"
        >
          {conversionError || ratesStatus.warning}
        </p>
      ) : null}
      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      {result ? (
        <p className="text-xs text-muted-foreground" role="status">
          {result.preferBuy
            ? 'Under these assumptions, buying has the lower net cost over the staying period.'
            : 'Under these assumptions, renting has the lower net cost over the staying period.'}
        </p>
      ) : null}
    </form>
  );
}
