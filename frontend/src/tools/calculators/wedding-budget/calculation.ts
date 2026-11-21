/**
 * Wedding budget worksheet.
 *
 * Section total = sum of section expenses (discounts not present on the
 * screenshot — treated as zero; never invent vendor fees/taxes).
 * Total wedding cost = sum of section totals + custom expenses
 *   (line items are counted once via section totals only).
 * Cost per guest = total wedding cost / guests (undefined when guests ≤ 0).
 * Budget balance = planned budget − total wedding cost.
 *
 * Amounts must already share one currency. Round only for display.
 */

import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import type { BudgetBalanceStatus } from './types';

export interface WeddingBudgetNumericInput {
  plannedBudget: number;
  guestCount: number;
  brideGroom: readonly number[];
  subcontractors: readonly number[];
  venueFood: readonly number[];
  ceremony: readonly number[];
  transport: readonly number[];
  customExpenses: readonly number[];
}

export interface WeddingBudgetComputation {
  brideGroomTotal: number;
  subcontractorsTotal: number;
  venueFoodTotal: number;
  ceremonyTotal: number;
  transportTotal: number;
  customTotal: number;
  totalWeddingCost: number;
  costPerGuest: number | null;
  budgetBalance: number;
  balanceStatus: BudgetBalanceStatus;
  statusMessage: string;
}

function sumNonNeg(values: readonly number[]): number | null {
  let total = 0;
  for (const value of values) {
    if (!Number.isFinite(value) || value < 0) return null;
    total += value;
  }
  return total;
}

export function sectionTotal(expenses: readonly number[]): number | null {
  return sumNonNeg(expenses);
}

export function calculateWeddingBudget(
  input: WeddingBudgetNumericInput
): WeddingBudgetComputation | null {
  if (!Number.isFinite(input.plannedBudget) || input.plannedBudget < 0) return null;
  if (!Number.isFinite(input.guestCount) || !(input.guestCount > 0)) return null;

  const brideGroomTotal = sectionTotal(input.brideGroom);
  const subcontractorsTotal = sectionTotal(input.subcontractors);
  const venueFoodTotal = sectionTotal(input.venueFood);
  const ceremonyTotal = sectionTotal(input.ceremony);
  const transportTotal = sectionTotal(input.transport);
  const customTotal = sectionTotal(input.customExpenses);

  if (
    brideGroomTotal === null ||
    subcontractorsTotal === null ||
    venueFoodTotal === null ||
    ceremonyTotal === null ||
    transportTotal === null ||
    customTotal === null
  ) {
    return null;
  }

  const totalWeddingCost =
    brideGroomTotal +
    subcontractorsTotal +
    venueFoodTotal +
    ceremonyTotal +
    transportTotal +
    customTotal;

  if (!Number.isFinite(totalWeddingCost)) return null;

  const costPerGuest = totalWeddingCost / input.guestCount;
  if (!Number.isFinite(costPerGuest)) return null;

  const budgetBalance = input.plannedBudget - totalWeddingCost;
  if (!Number.isFinite(budgetBalance)) return null;

  let balanceStatus: BudgetBalanceStatus;
  let statusMessage: string;
  if (budgetBalance === 0) {
    balanceStatus = 'balanced';
    statusMessage = 'Congratulations! Your budget is perfectly balanced!';
  } else if (budgetBalance > 0) {
    balanceStatus = 'under';
    statusMessage = 'You are under budget — funds remain after planned expenses.';
  } else {
    balanceStatus = 'over';
    statusMessage = 'Your wedding plan is over budget.';
  }

  return {
    brideGroomTotal,
    subcontractorsTotal,
    venueFoodTotal,
    ceremonyTotal,
    transportTotal,
    customTotal,
    totalWeddingCost,
    costPerGuest,
    budgetBalance,
    balanceStatus,
    statusMessage,
  };
}

export function formatWeddingMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  return formatCurrencyValue(amount, currency);
}
