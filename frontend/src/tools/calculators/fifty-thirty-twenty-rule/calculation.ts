import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  BUDGET_PERCENTS,
  type BudgetAllocation,
  type FiftyThirtyTwentyResult,
} from './types';

/**
 * Split income into currency units so necessities + wants + savings
 * always equal the rounded monthly income (savings gets the leftover units).
 */
export function splitMonthlyIncome(
  monthlyIncome: number,
  currency: SupportedCurrency,
): {
  income: number;
  necessities: number;
  wants: number;
  savings: number;
} | null {
  if (!Number.isFinite(monthlyIncome) || monthlyIncome < 0) return null;
  const digits = getCurrencyFractionDigits(currency);
  const scale = 10 ** digits;
  const incomeUnits = Math.round(monthlyIncome * scale);
  const necessitiesUnits = Math.round(
    (incomeUnits * BUDGET_PERCENTS.necessities) / 100,
  );
  const wantsUnits = Math.round((incomeUnits * BUDGET_PERCENTS.wants) / 100);
  const savingsUnits = incomeUnits - necessitiesUnits - wantsUnits;
  const fromUnits = (units: number) => units / scale;
  return {
    income: fromUnits(incomeUnits),
    necessities: fromUnits(necessitiesUnits),
    wants: fromUnits(wantsUnits),
    savings: fromUnits(savingsUnits),
  };
}

function allocation(
  key: BudgetAllocation['key'],
  label: string,
  percentage: number,
  monthlyAmount: number,
): BudgetAllocation {
  return {
    key,
    label,
    percentage,
    monthlyAmount,
    annualAmount: monthlyAmount * 12,
  };
}

export function calculateBudgetAllocation(
  monthlyAfterTaxIncome: number,
  currency: SupportedCurrency,
): FiftyThirtyTwentyResult | null {
  const split = splitMonthlyIncome(monthlyAfterTaxIncome, currency);
  if (!split) return null;

  const necessities = allocation(
    'necessities',
    'Necessities',
    BUDGET_PERCENTS.necessities,
    split.necessities,
  );
  const wants = allocation('wants', 'Wants', BUDGET_PERCENTS.wants, split.wants);
  const savings = allocation(
    'savings',
    'Savings',
    BUDGET_PERCENTS.savings,
    split.savings,
  );

  const totalMonthlyAllocated =
    necessities.monthlyAmount + wants.monthlyAmount + savings.monthlyAmount;
  const totalAnnualAllocated = totalMonthlyAllocated * 12;

  return {
    monthlyIncome: split.income,
    annualIncome: split.income * 12,
    necessities,
    wants,
    savings,
    categories: [necessities, wants, savings],
    totalMonthlyAllocated,
    totalAnnualAllocated,
    monthlyRemainingBalance: split.income - totalMonthlyAllocated,
    annualRemainingBalance: split.income * 12 - totalAnnualAllocated,
    currency,
  };
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(amount, currency);
}

export function shareBudgetText(result: FiftyThirtyTwentyResult): string {
  return [
    '50/30/20 Rule Calculator | Omega Calculators',
    `Monthly after-tax income: ${formatMoney(result.monthlyIncome, result.currency)} ${result.currency}`,
    `Necessities (50%): ${formatMoney(result.necessities.monthlyAmount, result.currency)}`,
    `Wants (30%): ${formatMoney(result.wants.monthlyAmount, result.currency)}`,
    `Savings (20%): ${formatMoney(result.savings.monthlyAmount, result.currency)}`,
    `Total allocated: ${formatMoney(result.totalMonthlyAllocated, result.currency)}`,
    `Remaining: ${formatMoney(result.monthlyRemainingBalance, result.currency)}`,
    `Annual income: ${formatMoney(result.annualIncome, result.currency)}`,
    `Annual savings: ${formatMoney(result.savings.annualAmount, result.currency)}`,
  ].join('\n');
}
