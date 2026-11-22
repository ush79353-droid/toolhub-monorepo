'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  formatLifeExpectancyDefault,
  suggestedGovernmentPensionMonthly,
  suggestedLifeExpectancy,
} from './longevity-defaults';
import type {
  MoneyPeriod,
  RetirementCountryCode,
  RetirementFieldErrors,
  RetirementInput,
  RetirementResult,
  Sex,
} from './types';
import { COUNTRY_OPTIONS, MONEY_PERIOD_OPTIONS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-xs font-medium text-accent outline-none';

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

function PeriodSelect({
  id,
  value,
  onChange,
  'aria-label': ariaLabel,
}: {
  id: string;
  value: MoneyPeriod;
  onChange: (next: MoneyPeriod) => void;
  'aria-label': string;
}) {
  return (
    <select
      id={id}
      className={selectClass}
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value as MoneyPeriod)}
    >
      {MONEY_PERIOD_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function CollapsibleSection({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        id={`${id}-toggle`}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={onToggle}
        className="mb-3 flex w-full items-center gap-2 text-left text-[13px] font-semibold text-accent"
      >
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-0' : '-rotate-90'}`}
          aria-hidden
        />
        <span>{title}</span>
      </button>
      {open ? (
        <div id={`${id}-panel`} className="space-y-3.5" role="region" aria-labelledby={`${id}-toggle`}>
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

interface RetirementFormProps {
  input: RetirementInput;
  errors: RetirementFieldErrors;
  result: RetirementResult | null;
  aboutOpen: boolean;
  savingsOpen: boolean;
  retirementOpen: boolean;
  onAboutOpenChange: (open: boolean) => void;
  onSavingsOpenChange: (open: boolean) => void;
  onRetirementOpenChange: (open: boolean) => void;
  onChange: (input: RetirementInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function RetirementForm({
  input,
  errors,
  result,
  aboutOpen,
  savingsOpen,
  retirementOpen,
  onAboutOpenChange,
  onSavingsOpenChange,
  onRetirementOpenChange,
  onChange,
  onCurrencyChange,
}: RetirementFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  const applySexCountryDefaults = (
    next: RetirementInput,
    opts: { updateLife: boolean; updatePension: boolean }
  ): RetirementInput => {
    const patched = { ...next };
    if (opts.updateLife) {
      patched.lifeExpectancy = formatLifeExpectancyDefault(
        suggestedLifeExpectancy(patched.country, patched.sex)
      );
    }
    if (opts.updatePension) {
      const monthly = suggestedGovernmentPensionMonthly(patched.country);
      patched.governmentPension = monthly > 0 ? String(monthly) : '';
      patched.governmentPensionPeriod = 'month';
    }
    return patched;
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Project savings to retirement with end-of-year compounding, then a level
        draw through life expectancy while returns continue. Figures are{' '}
        <strong className="font-medium text-accent">nominal</strong> (not
        inflation-adjusted). Currency labels amounts only — no FX conversion.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="ret-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination for retirement amounts"
        />
      </div>

      <CollapsibleSection
        id="ret-about"
        title="About you"
        open={aboutOpen}
        onToggle={() => onAboutOpenChange(!aboutOpen)}
      >
        <div>
          <span className={labelClass}>
            Sex
            <InfoTooltip
              label="Sex"
              text="Used only to suggest a life-expectancy default from UN WPP 2024 e0 tables. You can override life expectancy freely."
            />
          </span>
          <div className="flex flex-wrap gap-4" role="radiogroup" aria-label="Sex">
            {(['female', 'male'] as const).map((value) => (
              <label
                key={value}
                className="flex h-11 cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="ret-sex"
                  value={value}
                  checked={input.sex === value}
                  onChange={() =>
                    onChange(
                      applySexCountryDefaults(
                        { ...input, sex: value as Sex },
                        { updateLife: true, updatePension: false }
                      )
                    )
                  }
                  className="h-4 w-4 accent-primary"
                />
                <span className="capitalize">{value}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="ret-current-age" className={labelClass}>
            Current age
            <InfoTooltip
              label="Current age"
              text="Your age today. Years to retirement = max(0, retirement age − current age)."
            />
          </label>
          <FieldShell error={errors.currentAge}>
            <input
              id="ret-current-age"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.currentAge}
              onChange={(e) =>
                onChange({ ...input, currentAge: e.target.value })
              }
              placeholder="40"
              aria-invalid={Boolean(errors.currentAge)}
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              years old
            </span>
          </FieldShell>
          {errors.currentAge ? (
            <p className="mt-1 text-xs text-rose-600">{errors.currentAge}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ret-country" className={labelClass}>
            Country
            <InfoTooltip
              label="Country"
              text="Seeds life expectancy and, for the United States only, a dated average Social Security retired-worker benefit. Override any suggested value."
            />
          </label>
          <FieldShell>
            <select
              id="ret-country"
              className={`${inputClass} cursor-pointer`}
              value={input.country}
              onChange={(e) =>
                onChange(
                  applySexCountryDefaults(
                    {
                      ...input,
                      country: e.target.value as RetirementCountryCode,
                    },
                    { updateLife: true, updatePension: true }
                  )
                )
              }
            >
              {COUNTRY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>

        <div>
          <label htmlFor="ret-retirement-age" className={labelClass}>
            Retirement age
            <InfoTooltip
              label="Retirement age"
              text="Age when accumulation stops and level withdrawals from savings begin."
            />
          </label>
          <FieldShell error={errors.retirementAge}>
            <input
              id="ret-retirement-age"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.retirementAge}
              onChange={(e) =>
                onChange({ ...input, retirementAge: e.target.value })
              }
              placeholder="67"
              aria-invalid={Boolean(errors.retirementAge)}
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              years old
            </span>
          </FieldShell>
          {errors.retirementAge ? (
            <p className="mt-1 text-xs text-rose-600">{errors.retirementAge}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ret-life" className={labelClass}>
            Life expectancy
            <InfoTooltip
              label="Life expectancy"
              text="Planning horizon end age. Withdrawals amortize from retirement (or current age if already retired) through this age. Defaults are e0 suggestions, not remaining LE."
            />
          </label>
          <FieldShell error={errors.lifeExpectancy}>
            <input
              id="ret-life"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.lifeExpectancy}
              onChange={(e) =>
                onChange({ ...input, lifeExpectancy: e.target.value })
              }
              placeholder="81.4"
              aria-invalid={Boolean(errors.lifeExpectancy)}
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              years old
            </span>
          </FieldShell>
          {errors.lifeExpectancy ? (
            <p className="mt-1 text-xs text-rose-600">{errors.lifeExpectancy}</p>
          ) : null}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="ret-savings"
        title="Your savings"
        open={savingsOpen}
        onToggle={() => onSavingsOpenChange(!savingsOpen)}
      >
        <div>
          <label htmlFor="ret-savings-amount" className={labelClass}>
            Savings amount
            <InfoTooltip
              label="Savings amount"
              text="Ongoing contribution converted to an annual end-of-year deposit for the accumulation model."
            />
          </label>
          <FieldShell error={errors.savingsAmount}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ret-savings-amount"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.savingsAmount}
              onChange={(e) =>
                onChange({ ...input, savingsAmount: e.target.value })
              }
              placeholder="500"
              aria-invalid={Boolean(errors.savingsAmount)}
            />
            <PeriodSelect
              id="ret-savings-period"
              value={input.savingsPeriod}
              aria-label="Savings contribution period"
              onChange={(savingsPeriod) =>
                onChange({ ...input, savingsPeriod })
              }
            />
          </FieldShell>
          {errors.savingsAmount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.savingsAmount}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ret-already" className={labelClass}>
            Amount already saved
            <InfoTooltip
              label="Amount already saved"
              text="Current nest egg that compounds to retirement before level withdrawals begin."
            />
          </label>
          <FieldShell error={errors.alreadySaved}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ret-already"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.alreadySaved}
              onChange={(e) =>
                onChange({ ...input, alreadySaved: e.target.value })
              }
              placeholder="50,000"
              aria-invalid={Boolean(errors.alreadySaved)}
            />
          </FieldShell>
          {errors.alreadySaved ? (
            <p className="mt-1 text-xs text-rose-600">{errors.alreadySaved}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ret-return" className={labelClass}>
            Investment rate
            <InfoTooltip
              label="Investment rate"
              text="Expected average annual return used for both accumulation and retirement draws. Not guaranteed."
            />
          </label>
          <FieldShell error={errors.investmentReturn}>
            <input
              id="ret-return"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.investmentReturn}
              onChange={(e) =>
                onChange({ ...input, investmentReturn: e.target.value })
              }
              placeholder="7"
              aria-invalid={Boolean(errors.investmentReturn)}
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.investmentReturn ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.investmentReturn}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ret-total-savings" className={labelClass}>
            Total savings
            <InfoTooltip
              label="Total savings"
              text="Projected nest egg at retirement: grown existing savings plus future value of ongoing contributions."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ret-total-savings"
              type="text"
              readOnly
              tabIndex={-1}
              className={inputClass}
              value={
                result
                  ? result.formattedTotalSavings.replace(symbol, '')
                  : ''
              }
              aria-label="Total savings at retirement"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="ret-money"
        title="Your retirement money"
        open={retirementOpen}
        onToggle={() => onRetirementOpenChange(!retirementOpen)}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[13px] font-medium text-accent">
            Income display period
          </span>
          <PeriodSelect
            id="ret-income-period"
            value={input.incomeDisplayPeriod}
            aria-label="Display period for retirement income results"
            onChange={(incomeDisplayPeriod) =>
              onChange({ ...input, incomeDisplayPeriod })
            }
          />
        </div>

        <div>
          <label htmlFor="ret-gov-pension" className={labelClass}>
            Government pension
            <InfoTooltip
              label="Government pension"
              text="Expected government retirement benefit. US default uses SSA average retired-worker benefit (Dec 2024); other countries start at 0."
            />
          </label>
          <FieldShell error={errors.governmentPension}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ret-gov-pension"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.governmentPension}
              onChange={(e) =>
                onChange({ ...input, governmentPension: e.target.value })
              }
              placeholder="0"
              aria-invalid={Boolean(errors.governmentPension)}
            />
            <PeriodSelect
              id="ret-gov-period"
              value={input.governmentPensionPeriod}
              aria-label="Government pension period"
              onChange={(governmentPensionPeriod) =>
                onChange({ ...input, governmentPensionPeriod })
              }
            />
          </FieldShell>
          {errors.governmentPension ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.governmentPension}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ret-income-savings" className={labelClass}>
            Retirement income from savings
            <InfoTooltip
              label="Retirement income from savings"
              text="Level draw from the nest egg that lasts through life expectancy while the balance keeps earning the assumed return."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ret-income-savings"
              type="text"
              readOnly
              tabIndex={-1}
              className={inputClass}
              value={
                result
                  ? result.formattedIncomeFromSavings.replace(symbol, '')
                  : ''
              }
              aria-label="Retirement income from savings"
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              {input.incomeDisplayPeriod === 'month' ? 'mo' : 'yr'}
            </span>
          </FieldShell>
        </div>

        <div>
          <label htmlFor="ret-total-income" className={labelClass}>
            Total retirement income
            <InfoTooltip
              label="Total retirement income"
              text="Government pension plus income drawn from retirement savings."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ret-total-income"
              type="text"
              readOnly
              tabIndex={-1}
              className={inputClass}
              value={
                result ? result.formattedTotalIncome.replace(symbol, '') : ''
              }
              aria-label="Total retirement income"
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              {input.incomeDisplayPeriod === 'month' ? 'mo' : 'yr'}
            </span>
          </FieldShell>
        </div>

        <div>
          <label htmlFor="ret-col" className={labelClass}>
            Cost of living
            <InfoTooltip
              label="Cost of living"
              text="Expected spending in retirement on the same nominal basis as other money fields."
            />
          </label>
          <FieldShell error={errors.costOfLiving}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ret-col"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.costOfLiving}
              onChange={(e) =>
                onChange({ ...input, costOfLiving: e.target.value })
              }
              placeholder="4,000"
              aria-invalid={Boolean(errors.costOfLiving)}
            />
            <PeriodSelect
              id="ret-col-period"
              value={input.costOfLivingPeriod}
              aria-label="Cost of living period"
              onChange={(costOfLivingPeriod) =>
                onChange({ ...input, costOfLivingPeriod })
              }
            />
          </FieldShell>
          {errors.costOfLiving ? (
            <p className="mt-1 text-xs text-rose-600">{errors.costOfLiving}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ret-budget" className={labelClass}>
            Budget percentage
            <InfoTooltip
              label="Budget percentage"
              text="Total retirement income ÷ cost of living × 100. Above 100% means surplus coverage."
            />
          </label>
          <FieldShell muted>
            <input
              id="ret-budget"
              type="text"
              readOnly
              tabIndex={-1}
              className={inputClass}
              value={result?.budgetCoverageLabel ?? ''}
              aria-label="Budget coverage percentage"
            />
          </FieldShell>
        </div>

        <div>
          <label htmlFor="ret-money-left" className={labelClass}>
            Money left
            <InfoTooltip
              label="Money left"
              text="Total retirement income minus cost of living (surplus or shortfall) in the display period."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ret-money-left"
              type="text"
              readOnly
              tabIndex={-1}
              className={inputClass}
              value={
                result ? result.formattedMoneyLeft.replace(symbol, '') : ''
              }
              aria-label="Money left after cost of living"
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              {input.incomeDisplayPeriod === 'month' ? 'mo' : 'yr'}
            </span>
          </FieldShell>
        </div>
      </CollapsibleSection>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
