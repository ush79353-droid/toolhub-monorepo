import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import type { Frequency } from './types';

/** Normalize a recurring amount to a monthly figure. Frequencies are never FX-converted. */
export function toMonthly(amount: number, frequency: Frequency): number {
  if (!Number.isFinite(amount)) return Number.NaN;
  switch (frequency) {
    case 'month':
      return amount;
    case 'year':
      return amount / 12;
  }
}

/** Normalize a recurring amount to an annual figure. */
export function toAnnual(amount: number, frequency: Frequency): number {
  if (!Number.isFinite(amount)) return Number.NaN;
  switch (frequency) {
    case 'month':
      return amount * 12;
    case 'year':
      return amount;
  }
}

export interface BudgetEngineInput {
  /** Already converted into the salary/aggregation currency. */
  salary: number;
  salaryFrequency: Frequency;
  /** Percent of gross salary (0–100+). */
  taxRatePercent: number;
  pension: number;
  pensionFrequency: Frequency;
  otherMonthlyIncome: number;
  otherMonthlyIncomeFrequency: Frequency;
  taxRefunds: number;
  taxRefundsFrequency: Frequency;
  otherAnnualIncome: number;
  otherAnnualIncomeFrequency: Frequency;
  savings: readonly { amount: number; frequency: Frequency }[];
  monthlyExpenses: readonly { amount: number; frequency: Frequency }[];
  annualExpenses: readonly { amount: number; frequency: Frequency }[];
  currency: SupportedCurrency;
}

export interface BudgetEngineResult {
  currency: SupportedCurrency;
  monthlyIncome: number;
  monthlySavings: number;
  monthlyExpenses: number;
  annualExpenses: number;
  monthlyBudgetBalance: number;
  annualBudgetBalance: number;
}

/**
 * Personal budget engine (canonical currency already applied).
 *
 * Salary is gross. Tax rate % applies only to gross monthly salary.
 * Monthly income = net salary + other normalized income.
 * Savings are planned allocations (not included in expense totals).
 * Monthly balance = income − savings − monthly expenses − annual expenses / 12.
 * Annual balance = monthly balance × 12.
 */
export function calculateBudget(input: BudgetEngineInput): BudgetEngineResult | null {
  const {
    salary,
    salaryFrequency,
    taxRatePercent,
    pension,
    pensionFrequency,
    otherMonthlyIncome,
    otherMonthlyIncomeFrequency,
    taxRefunds,
    taxRefundsFrequency,
    otherAnnualIncome,
    otherAnnualIncomeFrequency,
    savings,
    monthlyExpenses,
    annualExpenses,
    currency,
  } = input;

  if (
    ![
      salary,
      taxRatePercent,
      pension,
      otherMonthlyIncome,
      taxRefunds,
      otherAnnualIncome,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (taxRatePercent < 0) return null;
  if (
    salary < 0 ||
    pension < 0 ||
    otherMonthlyIncome < 0 ||
    taxRefunds < 0 ||
    otherAnnualIncome < 0
  ) {
    return null;
  }

  const grossSalaryMonthly = toMonthly(salary, salaryFrequency);
  if (!Number.isFinite(grossSalaryMonthly)) return null;
  const taxAmount = grossSalaryMonthly * (taxRatePercent / 100);
  const netSalaryMonthly = grossSalaryMonthly - taxAmount;

  const otherIncomeMonthly =
    toMonthly(pension, pensionFrequency) +
    toMonthly(otherMonthlyIncome, otherMonthlyIncomeFrequency) +
    toMonthly(taxRefunds, taxRefundsFrequency) +
    toMonthly(otherAnnualIncome, otherAnnualIncomeFrequency);

  if (!Number.isFinite(otherIncomeMonthly) || !Number.isFinite(netSalaryMonthly)) {
    return null;
  }

  const monthlyIncome = netSalaryMonthly + otherIncomeMonthly;

  let monthlySavings = 0;
  for (const line of savings) {
    if (!Number.isFinite(line.amount) || line.amount < 0) return null;
    const m = toMonthly(line.amount, line.frequency);
    if (!Number.isFinite(m)) return null;
    monthlySavings += m;
  }

  let monthlyExpenseTotal = 0;
  for (const line of monthlyExpenses) {
    if (!Number.isFinite(line.amount) || line.amount < 0) return null;
    const m = toMonthly(line.amount, line.frequency);
    if (!Number.isFinite(m)) return null;
    monthlyExpenseTotal += m;
  }

  let annualExpenseTotal = 0;
  for (const line of annualExpenses) {
    if (!Number.isFinite(line.amount) || line.amount < 0) return null;
    const a = toAnnual(line.amount, line.frequency);
    if (!Number.isFinite(a)) return null;
    annualExpenseTotal += a;
  }

  const monthlyBudgetBalance =
    monthlyIncome - monthlySavings - monthlyExpenseTotal - annualExpenseTotal / 12;
  const annualBudgetBalance = monthlyBudgetBalance * 12;

  if (
    ![
      monthlyIncome,
      monthlySavings,
      monthlyExpenseTotal,
      annualExpenseTotal,
      monthlyBudgetBalance,
      annualBudgetBalance,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  return {
    currency,
    monthlyIncome,
    monthlySavings,
    monthlyExpenses: monthlyExpenseTotal,
    annualExpenses: annualExpenseTotal,
    monthlyBudgetBalance,
    annualBudgetBalance,
  };
}

export function formatBudgetMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  return formatCurrencyValue(amount, currency).replace(/[^\d.,\s-]/g, '').trim() ||
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
}

/** Prefer plain decimal grouping for summary boxes (currency symbol shown separately). */
export function formatBudgetAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function shareBudgetResultText(input: {
  title: string;
  currency: SupportedCurrency;
  formattedMonthlyIncome: string;
  formattedMonthlySavings: string;
  formattedMonthlyExpenses: string;
  formattedAnnualExpenses: string;
  formattedMonthlyBudgetBalance: string;
  formattedAnnualBudgetBalance: string;
  fxNote: string;
}): string {
  return [
    `${input.title} | Omega Calculators`,
    `Income: ${input.currency} ${input.formattedMonthlyIncome} / mo`,
    `Savings: ${input.currency} ${input.formattedMonthlySavings} / mo`,
    `Monthly expenses: ${input.currency} ${input.formattedMonthlyExpenses} / mo`,
    `Annual expenses: ${input.currency} ${input.formattedAnnualExpenses} / yr`,
    `Monthly budget balance: ${input.currency} ${input.formattedMonthlyBudgetBalance}`,
    `Annual budget balance: ${input.currency} ${input.formattedAnnualBudgetBalance}`,
    input.fxNote,
  ].join('\n');
}
