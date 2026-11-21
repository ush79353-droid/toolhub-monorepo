'use client';

import type { ReactNode } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  ANNUAL_EXPENSE_KEYS,
  FREQUENCY_LABEL,
  FREQUENCIES,
  MONTHLY_EXPENSE_KEYS,
  SAVINGS_KEYS,
  type AnnualExpenseKey,
  type BudgetFieldErrors,
  type BudgetInput,
  type BudgetResult,
  type Frequency,
  type MoneyFieldKey,
  type MoneyLine,
  type MonthlyExpenseKey,
  type SavingsKey,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-2 text-sm tabular-nums text-accent outline-none';
const freqClass =
  'h-11 w-[4.25rem] shrink-0 rounded-lg border border-border bg-muted/40 px-1.5 text-sm font-medium text-accent';

const INCOME_TIPS: Partial<Record<MoneyFieldKey | 'taxRate', string>> = {
  salary: 'Gross pay before the tax rate. Changing currency converts this amount with stored FX rates.',
  taxRate:
    'Percent of gross salary (after / mo·/ yr normalization). Not applied to pension or other income.',
  pension: 'Pension or social-security benefits received (income), not employee contributions.',
  otherMonthlyIncome: 'Bonuses, side income, or other recurring monthly inflows.',
  taxRefunds: 'Expected annual tax refunds; normalized into monthly income as ÷ 12.',
  otherAnnualIncome: 'Other yearly inflows normalized into monthly income as ÷ 12.',
};

const EXPENSE_TIPS: Partial<Record<MoneyFieldKey, string>> = {
  food: 'Groceries and dining.',
  clothing: 'Clothes and personal apparel.',
  shelter: 'Rent or mortgage principal/interest you treat as shelter cost.',
  utilities: 'Electricity, water, gas, internet, and similar.',
  transportation: 'Fuel, transit fares, or vehicle running costs.',
  homeMaintenance: 'Repairs and upkeep (not insurance — that is under Annual expenses).',
  entertainment: 'Streaming, hobbies, dining out for leisure, etc.',
};

const LABELS: Record<MoneyFieldKey, string> = {
  salary: 'Salary',
  pension: 'Pension / social security',
  otherMonthlyIncome: 'Other monthly income',
  taxRefunds: 'Tax refunds',
  otherAnnualIncome: 'Other annual income',
  emergencyFund: 'Emergency fund',
  investments: 'Investments',
  retirement: 'Retirement',
  otherSavings: 'Other',
  food: 'Food',
  clothing: 'Clothing',
  shelter: 'Shelter',
  utilities: 'Utilities',
  health: 'Health',
  transportation: 'Transportation',
  loansAndLiabilities: 'Loans and liabilities',
  homeMaintenance: 'Home maintenance',
  childCare: 'Child care',
  entertainment: 'Entertainment',
  otherMonthlyExpenses: 'Other',
  tuition: 'Tuition',
  carInsurance: 'Car insurance',
  homeInsurance: 'Home insurance',
  travelAndVacation: 'Travel and vacation',
  taxes: 'Taxes',
  otherAnnualExpenses: 'Other',
};

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

function SectionCard({
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
    <fieldset className="rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 text-left"
        aria-expanded={open}
      >
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
        <span className="text-[13px] font-semibold text-accent">{title}</span>
      </button>
      {open ? <div className="mt-3.5 space-y-3.5">{children}</div> : null}
    </fieldset>
  );
}

interface BudgetFormProps {
  input: BudgetInput;
  errors: BudgetFieldErrors;
  result: BudgetResult | null;
  onChange: (input: BudgetInput) => void;
  onMoneyCurrencyChange: (key: MoneyFieldKey, currency: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function BudgetForm({
  input,
  errors,
  result,
  onChange,
  onMoneyCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: BudgetFormProps) {
  const set = (patch: Partial<BudgetInput>) => onChange({ ...input, ...patch });

  const setLine = (key: MoneyFieldKey, patch: Partial<MoneyLine>) => {
    const current = input[key] as MoneyLine;
    set({ [key]: { ...current, ...patch } } as Partial<BudgetInput>);
  };

  const moneyField = (key: MoneyFieldKey, tip?: string) => {
    const line = input[key] as MoneyLine;
    const symbol = getCurrencySymbol(line.currency);
    const label = LABELS[key];
    const tipText = tip ?? EXPENSE_TIPS[key] ?? INCOME_TIPS[key];
    return (
      <div key={key}>
        <label className={labelClass} htmlFor={`budget-${key}`}>
          <span>{label}</span>
          {tipText ? <InfoTooltip label={label} text={tipText} /> : null}
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors[key]}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id={`budget-${key}`}
              className={inputClass}
              inputMode="decimal"
              value={line.amount}
              aria-invalid={Boolean(errors[key])}
              onChange={(e) => setLine(key, { amount: e.target.value })}
            />
            <div className="w-[5.5rem] shrink-0 border-l border-border pr-1">
              <CurrencySelect
                id={`budget-${key}-currency`}
                value={line.currency}
                onChange={(currency) => onMoneyCurrencyChange(key, currency)}
                aria-label={`${label} currency`}
              />
            </div>
          </FieldShell>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span aria-hidden>/</span>
            <select
              className={freqClass}
              aria-label={`${label} frequency`}
              value={line.frequency}
              onChange={(e) =>
                setLine(key, { frequency: e.target.value as Frequency })
              }
            >
              {FREQUENCIES.map((freq) => (
                <option key={freq} value={freq}>
                  {FREQUENCY_LABEL[freq]}
                </option>
              ))}
            </select>
          </div>
        </div>
        {errors[key] ? (
          <p className="mt-1 text-xs text-rose-600">{errors[key]}</p>
        ) : null}
      </div>
    );
  };

  const summaryOut = (
    id: string,
    label: string,
    value: string,
    suffix: string
  ) => (
    <div key={id}>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
      </label>
      <div className="flex gap-2">
        <FieldShell muted>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
            {result ? getCurrencySymbol(result.currency) : getCurrencySymbol(input.salary.currency)}
          </span>
          <input
            id={id}
            className={inputClass}
            readOnly
            tabIndex={-1}
            value={value}
            aria-readonly="true"
          />
        </FieldShell>
        {suffix ? (
          <span className="flex h-11 items-center text-sm text-muted-foreground">{suffix}</span>
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
      <SectionCard
        title="Income"
        open={input.incomeOpen}
        onToggle={() => set({ incomeOpen: !input.incomeOpen })}
      >
        {moneyField('salary', INCOME_TIPS.salary)}

        <div>
          <label className={labelClass} htmlFor="budget-taxRate">
            <span>Tax rate</span>
            <InfoTooltip label="Tax rate" text={INCOME_TIPS.taxRate!} />
          </label>
          <FieldShell error={errors.taxRate}>
            <input
              id="budget-taxRate"
              className={inputClass}
              inputMode="decimal"
              value={input.taxRate}
              aria-invalid={Boolean(errors.taxRate)}
              onChange={(e) => set({ taxRate: e.target.value })}
            />
            {input.taxRate !== '' && input.taxRate !== '0' ? (
              <button
                type="button"
                className="mr-2 rounded p-1 text-muted-foreground hover:text-accent"
                aria-label="Clear tax rate"
                onClick={() => set({ taxRate: '0' })}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                ×
              </span>
            )}
          </FieldShell>
          {errors.taxRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.taxRate}</p>
          ) : null}
        </div>

        {moneyField('pension', INCOME_TIPS.pension)}
        {moneyField('otherMonthlyIncome', INCOME_TIPS.otherMonthlyIncome)}
        {moneyField('taxRefunds', INCOME_TIPS.taxRefunds)}
        {moneyField('otherAnnualIncome', INCOME_TIPS.otherAnnualIncome)}
      </SectionCard>

      <SectionCard
        title="Savings"
        open={input.savingsOpen}
        onToggle={() => set({ savingsOpen: !input.savingsOpen })}
      >
        {SAVINGS_KEYS.map((key: SavingsKey) => moneyField(key))}
      </SectionCard>

      <SectionCard
        title="Monthly expenses"
        open={input.monthlyExpensesOpen}
        onToggle={() => set({ monthlyExpensesOpen: !input.monthlyExpensesOpen })}
      >
        {MONTHLY_EXPENSE_KEYS.map((key: MonthlyExpenseKey) => moneyField(key))}
      </SectionCard>

      <SectionCard
        title="Annual expenses"
        open={input.annualExpensesOpen}
        onToggle={() => set({ annualExpensesOpen: !input.annualExpensesOpen })}
      >
        {ANNUAL_EXPENSE_KEYS.map((key: AnnualExpenseKey) => moneyField(key))}
      </SectionCard>

      <SectionCard
        title="Summary"
        open={input.summaryOpen}
        onToggle={() => set({ summaryOpen: !input.summaryOpen })}
      >
        {summaryOut(
          'budget-summary-income',
          'Income',
          result?.formattedMonthlyIncome ?? '',
          '/ mo'
        )}
        {summaryOut(
          'budget-summary-savings',
          'Savings',
          result?.formattedMonthlySavings ?? '',
          '/ mo'
        )}
        {summaryOut(
          'budget-summary-monthly-expenses',
          'Monthly expenses',
          result?.formattedMonthlyExpenses ?? '',
          '/ mo'
        )}
        {summaryOut(
          'budget-summary-annual-expenses',
          'Annual expenses',
          result?.formattedAnnualExpenses ?? '',
          '/ yr'
        )}
        {summaryOut(
          'budget-summary-monthly-balance',
          'Monthly budget balance',
          result?.formattedMonthlyBudgetBalance ?? '',
          ''
        )}
        {summaryOut(
          'budget-summary-annual-balance',
          'Annual budget balance',
          result?.formattedAnnualBudgetBalance ?? '',
          ''
        )}
      </SectionCard>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {ratesWarning ? (
        <p className="text-xs text-amber-700">{ratesWarning}</p>
      ) : null}
    </form>
  );
}
