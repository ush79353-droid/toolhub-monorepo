import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { BitcoinEtfResult } from './types';

function formatPercent(value: number): string {
  return Number(value.toFixed(4)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
}

function formatMoney(value: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

/**
 * Effective Annual Return (decimal) =
 *   (1 + Expected Return / 100) × (1 − Expense Ratio / 100) − 1
 *
 * Future Value =
 *   (Investment − Upfront Other Costs) × (1 + Effective Annual Return)^Duration
 *
 * Total ETF cost = upfront other costs + estimated expense-ratio fees charged
 * each year on post-return balance (actual fees, not lost opportunity gains):
 *   grown = balance × (1 + expected/100)
 *   fee = grown × (expense/100)
 *   balance = grown − fee
 */
export function calculateBitcoinEtf(input: {
  investmentAmount: number;
  durationYears: number;
  expenseRatioPercent: number;
  otherCosts: number;
  expectedReturnPercent: number;
  currency: SupportedCurrency;
}): BitcoinEtfResult | null {
  const {
    investmentAmount,
    durationYears,
    expenseRatioPercent,
    otherCosts,
    expectedReturnPercent,
    currency,
  } = input;

  if (
    ![investmentAmount, durationYears, expenseRatioPercent, otherCosts, expectedReturnPercent].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (investmentAmount <= 0) return null;
  if (durationYears < 0) return null;
  if (expenseRatioPercent < 0 || expenseRatioPercent > 100) return null;
  if (otherCosts < 0 || otherCosts > investmentAmount) return null;

  const r = expectedReturnPercent / 100;
  const e = expenseRatioPercent / 100;
  const effectiveReturnDecimal = (1 + r) * (1 - e) - 1;
  if (!Number.isFinite(effectiveReturnDecimal) || effectiveReturnDecimal <= -1) return null;

  const netInvested = investmentAmount - otherCosts;
  const futureValue = netInvested * Math.pow(1 + effectiveReturnDecimal, durationYears);
  if (!Number.isFinite(futureValue)) return null;

  // Whole-year fee loop for integer years; for fractional years, scale the final partial year.
  let balance = netInvested;
  let expenseFees = 0;
  const wholeYears = Math.floor(durationYears);
  const frac = durationYears - wholeYears;

  for (let i = 0; i < wholeYears; i += 1) {
    const grown = balance * (1 + r);
    const fee = grown * e;
    if (!Number.isFinite(grown) || !Number.isFinite(fee)) return null;
    expenseFees += fee;
    balance = grown - fee;
  }

  if (frac > 0) {
    // Partial-year: apply fractional expected return, then proportional expense charge.
    const grown = balance * (1 + r * frac);
    const fee = grown * e * frac;
    if (!Number.isFinite(grown) || !Number.isFinite(fee)) return null;
    expenseFees += fee;
    balance = grown - fee;
  }

  // Prefer closed-form FV for the displayed future value (matches documented formula).
  // Fee total uses the simulation above (actual fees charged, not FV opportunity gap).
  const totalCost = otherCosts + expenseFees;
  if (!Number.isFinite(totalCost)) return null;

  const effectiveReturnPercent = effectiveReturnDecimal * 100;

  return {
    effectiveReturnPercent,
    futureValue,
    totalCost,
    netInvested,
    formattedEffectiveReturn: formatPercent(effectiveReturnPercent),
    formattedFutureValue: formatMoney(futureValue, currency),
    formattedTotalCost: formatMoney(totalCost, currency),
  };
}
