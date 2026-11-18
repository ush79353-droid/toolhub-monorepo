'use client';

import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import {
  PERIODS,
  PERIOD_LABEL,
  type BusinessBudgetFieldErrors,
  type BusinessBudgetInput,
  type BusinessBudgetResult,
  type MoneyLine,
  type Period,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-[88px] shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-muted-foreground';

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div
      className={`flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="rounded-xl border border-border bg-muted/15"
    >
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
        {title}
      </summary>
      <div className="space-y-3.5 px-4 pb-4">{children}</div>
    </details>
  );
}

function numberOrBlank(value: number): string {
  return Number.isFinite(value) ? String(value) : '';
}

type LineKey = {
  [K in keyof BusinessBudgetInput]: BusinessBudgetInput[K] extends MoneyLine ? K : never;
}[keyof BusinessBudgetInput];

type LumpKey = {
  [K in keyof BusinessBudgetInput]: BusinessBudgetInput[K] extends number ? K : never;
}[keyof BusinessBudgetInput];

interface BusinessBudgetFormProps {
  input: BusinessBudgetInput;
  errors: BusinessBudgetFieldErrors;
  result: BusinessBudgetResult | null;
  onChange: (input: BusinessBudgetInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function BusinessBudgetForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onSubmit,
  onReset,
}: BusinessBudgetFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  const setLine = (key: LineKey, patch: Partial<MoneyLine>) => {
    onChange({ ...input, [key]: { ...input[key], ...patch } });
  };

  const onLineAmount = (key: LineKey) => (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();
    setLine(key, { amount: text === '' ? 0 : Number(text) });
  };

  const onLump = (key: LumpKey) => (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();
    onChange({ ...input, [key]: text === '' ? 0 : Number(text) });
  };

  const moneyLine = (key: LineKey, id: string, label: string) => (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        <FieldShell error={errors[key]}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={numberOrBlank(input[key].amount)}
            aria-invalid={Boolean(errors[key])}
            onChange={onLineAmount(key)}
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label={`${label} currency`}
          />
        </div>
        <select
          className={selectClass}
          aria-label={`${label} period`}
          value={input[key].period}
          onChange={(event) => setLine(key, { period: event.target.value as Period })}
        >
          {PERIODS.map((period) => (
            <option key={period} value={period}>
              {PERIOD_LABEL[period]}
            </option>
          ))}
        </select>
      </div>
      {errors[key] ? <p className="mt-1 text-xs text-rose-600">{errors[key]}</p> : null}
    </div>
  );

  const lumpField = (key: LumpKey, id: string, label: string) => (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        <FieldShell error={errors[key]}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={numberOrBlank(input[key])}
            aria-invalid={Boolean(errors[key])}
            onChange={onLump(key)}
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {errors[key] ? <p className="mt-1 text-xs text-rose-600">{errors[key]}</p> : null}
    </div>
  );

  const readOnlyMoney = (
    id: string,
    label: string,
    display: string | undefined,
    withPeriod: boolean
  ) => (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/30">
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id={id}
            className={`${inputClass} cursor-default font-semibold text-accent`}
            readOnly
            value={display ?? ''}
            placeholder="—"
            aria-live="polite"
          />
        </div>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label={`${label} currency`}
          />
        </div>
        {withPeriod ? (
          <span className={selectClass} aria-hidden="true">
            / mo
          </span>
        ) : null}
      </div>
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate autoComplete="off">
      <Section title="Operating Income" defaultOpen>
        {moneyLine('income1', 'bb-income-1', 'Income 1')}
        {moneyLine('income2', 'bb-income-2', 'Income 2')}
        {moneyLine('income3', 'bb-income-3', 'Income 3')}
        {moneyLine('income4', 'bb-income-4', 'Income 4')}
        {readOnlyMoney(
          'bb-total-operating',
          'Total operating income',
          result?.totalOperatingIncomeDisplay,
          true
        )}
      </Section>

      <Section title="Non-operating Income" defaultOpen>
        {moneyLine('interestIncome', 'bb-interest', 'Interest income')}
        {moneyLine('dividends', 'bb-dividends', 'Dividends')}
        {moneyLine('gifts', 'bb-gifts', 'Gifts')}
        {moneyLine('grants', 'bb-grants', 'Grants')}
        {moneyLine('otherIncome', 'bb-other-income', 'Other income')}
        {readOnlyMoney(
          'bb-total-non-operating',
          'Total non-operating income',
          result?.totalNonOperatingIncomeDisplay,
          true
        )}
      </Section>

      <Section title="One-time costs" defaultOpen={false}>
        {lumpField('furniture', 'bb-furniture', 'Furniture')}
        {lumpField('startingInventory', 'bb-starting-inventory', 'Starting inventory')}
        {lumpField('advertisingPromotion', 'bb-ad-promo', 'Advertising/promotion')}
        {lumpField('operatingCash', 'bb-operating-cash', 'Operating cash')}
        {lumpField('otherOneTimeCosts', 'bb-other-one-time', 'Other one-time costs')}
        {readOnlyMoney(
          'bb-total-one-time',
          'Total one-time costs',
          result?.totalOneTimeCostsDisplay,
          false
        )}
      </Section>

      <Section title="Salaries" defaultOpen={false}>
        {moneyLine('managerSalary', 'bb-manager-salary', 'Owner/manager salary')}
        {moneyLine('salaries', 'bb-salaries', 'Salaries')}
        {moneyLine('commissions', 'bb-commissions', 'Commissions')}
        {moneyLine('benefits', 'bb-benefits', 'Benefits')}
      </Section>

      <Section title="Monthly expenses" defaultOpen={false}>
        {moneyLine('rent', 'bb-rent', 'Rent')}
        {moneyLine('advertisingMarketing', 'bb-ad-marketing', 'Advertising/marketing')}
        {moneyLine('healthInsurance', 'bb-health-insurance', 'Health insurance')}
        {moneyLine('businessInsurance', 'bb-business-insurance', 'Business insurance')}
        {moneyLine('inventory', 'bb-inventory', 'Inventory')}
        {moneyLine('leases', 'bb-leases', 'Equipment leases')}
        {moneyLine('travel', 'bb-travel', 'Travel')}
        {moneyLine('utilities', 'bb-utilities', 'Utilities')}
        {moneyLine('officeSupplies', 'bb-office-supplies', 'Office supplies')}
      </Section>

      <Section title="Summary" defaultOpen>
        {readOnlyMoney(
          'bb-initial-investment',
          'Initial investment',
          result?.initialInvestmentDisplay,
          false
        )}
        {readOnlyMoney('bb-total-income', 'Total income', result?.totalIncomeDisplay, true)}
        {readOnlyMoney('bb-total-expenses', 'Total expenses', result?.totalExpensesDisplay, true)}
        {readOnlyMoney('bb-budget-balance', 'Budget balance', result?.budgetBalanceDisplay, true)}
      </Section>

      {errors.form ? (
        <p
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-700"
          role="alert"
        >
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
