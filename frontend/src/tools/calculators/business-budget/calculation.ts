import { formatCurrencyValue } from '@/tools/shared/currency';
import {
  DAYS_PER_YEAR,
  WEEKS_PER_YEAR,
  type BusinessBudgetInput,
  type BusinessBudgetResult,
  type MoneyLine,
  type Period,
} from './types';

/** Convert a recurring amount into an equivalent monthly figure. */
export function toMonthly(amount: number, period: Period): number {
  if (!Number.isFinite(amount)) return Number.NaN;
  switch (period) {
    case 'day':
      return (amount * DAYS_PER_YEAR) / 12;
    case 'week':
      return (amount * WEEKS_PER_YEAR) / 12;
    case 'month':
      return amount;
    case 'year':
      return amount / 12;
  }
}

function lineMonthly(line: MoneyLine): number {
  const amount = Number.isFinite(line.amount) ? line.amount : 0;
  return toMonthly(amount, line.period);
}

function sumLines(lines: readonly MoneyLine[]): number {
  return lines.reduce((sum, line) => sum + lineMonthly(line), 0);
}

function sumLumps(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0);
}

/**
 * Business budget worksheet (monthly view).
 *
 * Total income = operating + non-operating (normalized / mo).
 * Total expenses = salaries + monthly expenses (normalized / mo).
 * One-time costs become Initial investment only — not added again into
 * total expenses / budget balance (avoids double-counting).
 * Budget balance = total income − total expenses.
 */
export function calculateBusinessBudget(input: BusinessBudgetInput): BusinessBudgetResult | null {
  const { currency } = input;

  const totalOperatingIncome = sumLines([
    input.income1,
    input.income2,
    input.income3,
    input.income4,
  ]);
  const totalNonOperatingIncome = sumLines([
    input.interestIncome,
    input.dividends,
    input.gifts,
    input.grants,
    input.otherIncome,
  ]);
  const totalOneTimeCosts = sumLumps([
    input.furniture,
    input.startingInventory,
    input.advertisingPromotion,
    input.operatingCash,
    input.otherOneTimeCosts,
  ]);
  const totalSalaries = sumLines([
    input.managerSalary,
    input.salaries,
    input.commissions,
    input.benefits,
  ]);
  const totalMonthlyExpenses = sumLines([
    input.rent,
    input.advertisingMarketing,
    input.healthInsurance,
    input.businessInsurance,
    input.inventory,
    input.leases,
    input.travel,
    input.utilities,
    input.officeSupplies,
  ]);

  const totals = [
    totalOperatingIncome,
    totalNonOperatingIncome,
    totalOneTimeCosts,
    totalSalaries,
    totalMonthlyExpenses,
  ];
  if (!totals.every(Number.isFinite)) return null;

  const initialInvestment = totalOneTimeCosts;
  const totalIncome = totalOperatingIncome + totalNonOperatingIncome;
  const totalExpenses = totalSalaries + totalMonthlyExpenses;
  const budgetBalance = totalIncome - totalExpenses;

  if (![initialInvestment, totalIncome, totalExpenses, budgetBalance].every(Number.isFinite)) {
    return null;
  }

  return {
    currency,
    totalOperatingIncome,
    totalNonOperatingIncome,
    totalOneTimeCosts,
    totalSalaries,
    totalMonthlyExpenses,
    initialInvestment,
    totalIncome,
    totalExpenses,
    budgetBalance,
    totalOperatingIncomeDisplay: formatCurrencyValue(totalOperatingIncome, currency),
    totalNonOperatingIncomeDisplay: formatCurrencyValue(totalNonOperatingIncome, currency),
    totalOneTimeCostsDisplay: formatCurrencyValue(totalOneTimeCosts, currency),
    initialInvestmentDisplay: formatCurrencyValue(initialInvestment, currency),
    totalIncomeDisplay: formatCurrencyValue(totalIncome, currency),
    totalExpensesDisplay: formatCurrencyValue(totalExpenses, currency),
    budgetBalanceDisplay: formatCurrencyValue(budgetBalance, currency),
  };
}
