import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { ExpenseRatioResult } from './types';

function formatMoney(value: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

/**
 * Gross FV (no fees): initial grown for n years + end-of-year contributions.
 *   FV = P(1+r)^n + PMT × [((1+r)^n − 1) / r]   (r ≠ 0)
 *   FV = P + PMT × n                             (r = 0)
 *
 * Net path each year (end-of-year contribution):
 *   1) balance *= (1 + r)
 *   2) fee = balance × e; balance -= fee; totalFees += fee
 *   3) balance += PMT
 */
export function calculateExpenseRatio(input: {
  initialInvestment: number;
  yearlyInvestment: number;
  durationYears: number;
  expectedReturnPercent: number;
  expenseRatioPercent: number;
  currency: SupportedCurrency;
}): ExpenseRatioResult | null {
  const {
    initialInvestment,
    yearlyInvestment,
    durationYears,
    expectedReturnPercent,
    expenseRatioPercent,
    currency,
  } = input;

  if (
    ![
      initialInvestment,
      yearlyInvestment,
      durationYears,
      expectedReturnPercent,
      expenseRatioPercent,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (initialInvestment < 0 || yearlyInvestment < 0) return null;
  if (!Number.isInteger(durationYears) || durationYears <= 0) return null;
  if (expenseRatioPercent < 0 || expenseRatioPercent > 100) return null;
  // Expected return: allow zero/negative while keeping growth factor > 0 after fees path
  if (expectedReturnPercent <= -100) return null;

  const r = expectedReturnPercent / 100;
  const e = expenseRatioPercent / 100;
  const growth = 1 + r;
  if (!(growth > 0) || !Number.isFinite(growth)) return null;

  // Gross FV (no expense ratio)
  let grossFutureValue: number;
  if (Math.abs(r) < 1e-15) {
    grossFutureValue = initialInvestment + yearlyInvestment * durationYears;
  } else {
    const grown = Math.pow(growth, durationYears);
    if (!Number.isFinite(grown)) return null;
    grossFutureValue =
      initialInvestment * grown + yearlyInvestment * ((grown - 1) / r);
  }
  if (!Number.isFinite(grossFutureValue)) return null;

  // Net simulation with annual fees
  let balance = initialInvestment;
  let totalEtfCost = 0;
  for (let year = 0; year < durationYears; year += 1) {
    const grown = balance * growth;
    if (!Number.isFinite(grown)) return null;
    const fee = grown * e;
    if (!Number.isFinite(fee)) return null;
    totalEtfCost += fee;
    balance = grown - fee + yearlyInvestment;
    if (!Number.isFinite(balance)) return null;
  }

  const netFutureValue = balance;
  if (!Number.isFinite(netFutureValue) || !Number.isFinite(totalEtfCost)) return null;

  return {
    grossFutureValue,
    totalEtfCost,
    netFutureValue,
    formattedGrossFutureValue: formatMoney(grossFutureValue, currency),
    formattedTotalEtfCost: formatMoney(totalEtfCost, currency),
    formattedNetFutureValue: formatMoney(netFutureValue, currency),
  };
}
