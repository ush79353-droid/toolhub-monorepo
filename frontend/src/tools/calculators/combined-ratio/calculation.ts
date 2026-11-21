import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  CombinedRatioResult,
  UnderwritingStatus,
} from './types';

export interface CombinedRatioBreakdown {
  claimLoss: number;
  lossAdjustments: number;
  lossExpense: number;
  premiums: number;
  underwritingExpense: number;
  lossRatio: number;
  expenseRatio: number;
  combinedRatio: number;
  underwritingResult: number;
  underwritingMargin: number;
  status: UnderwritingStatus;
}

function statusFromRatio(combinedRatio: number): UnderwritingStatus {
  if (Math.abs(combinedRatio - 100) < 1e-9) return 'breakeven';
  return combinedRatio < 100 ? 'profit' : 'loss';
}

export function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatPercent(value: number, digits = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

/**
 * Build full metrics from known CL, LA (or LE), P, UE.
 * LE = CL + LA; LR/ER/CR from premiums; underwriting result & margin.
 */
export function buildFromComponents(
  claimLoss: number,
  lossAdjustments: number,
  premiums: number,
  underwritingExpense: number,
): CombinedRatioBreakdown | null {
  if (
    ![claimLoss, lossAdjustments, premiums, underwritingExpense].every(Number.isFinite)
  ) {
    return null;
  }
  if (claimLoss < 0 || lossAdjustments < 0 || underwritingExpense < 0) return null;
  if (!(premiums > 0)) return null;

  const lossExpense = claimLoss + lossAdjustments;
  return finish(lossExpense, claimLoss, lossAdjustments, premiums, underwritingExpense);
}

export function buildFromLossExpense(
  lossExpense: number,
  claimLoss: number,
  lossAdjustments: number,
  premiums: number,
  underwritingExpense: number,
): CombinedRatioBreakdown | null {
  if (
    ![lossExpense, claimLoss, lossAdjustments, premiums, underwritingExpense].every(
      Number.isFinite,
    )
  ) {
    return null;
  }
  if (claimLoss < 0 || lossAdjustments < 0 || lossExpense < 0 || underwritingExpense < 0) {
    return null;
  }
  if (!(premiums > 0)) return null;
  if (Math.abs(claimLoss + lossAdjustments - lossExpense) > 1e-6) return null;
  return finish(lossExpense, claimLoss, lossAdjustments, premiums, underwritingExpense);
}

/** UE = (CR/100)×P − LE */
export function solveUnderwritingExpense(
  combinedRatioPercent: number,
  premiums: number,
  lossExpense: number,
  claimLoss: number,
  lossAdjustments: number,
): CombinedRatioBreakdown | null {
  if (
    ![combinedRatioPercent, premiums, lossExpense, claimLoss, lossAdjustments].every(
      Number.isFinite,
    )
  ) {
    return null;
  }
  if (!(premiums > 0) || combinedRatioPercent < 0) return null;
  if (claimLoss < 0 || lossAdjustments < 0 || lossExpense < 0) return null;
  if (Math.abs(claimLoss + lossAdjustments - lossExpense) > 1e-6) return null;

  const underwritingExpense = (combinedRatioPercent / 100) * premiums - lossExpense;
  if (!Number.isFinite(underwritingExpense) || underwritingExpense < 0) return null;
  return finish(lossExpense, claimLoss, lossAdjustments, premiums, underwritingExpense);
}

/** P = (LE + UE) / (CR/100) */
export function solvePremiums(
  combinedRatioPercent: number,
  lossExpense: number,
  underwritingExpense: number,
  claimLoss: number,
  lossAdjustments: number,
): CombinedRatioBreakdown | null {
  if (
    ![combinedRatioPercent, lossExpense, underwritingExpense, claimLoss, lossAdjustments].every(
      Number.isFinite,
    )
  ) {
    return null;
  }
  if (!(combinedRatioPercent > 0)) return null;
  if (claimLoss < 0 || lossAdjustments < 0 || lossExpense < 0 || underwritingExpense < 0) {
    return null;
  }
  if (Math.abs(claimLoss + lossAdjustments - lossExpense) > 1e-6) return null;

  const premiums = (lossExpense + underwritingExpense) / (combinedRatioPercent / 100);
  if (!Number.isFinite(premiums) || !(premiums > 0)) return null;
  return finish(lossExpense, claimLoss, lossAdjustments, premiums, underwritingExpense);
}

/** LE = (CR/100)×P − UE; then split with fixed claim/adjustments partner. */
export function solveLossExpenseFromRatio(
  combinedRatioPercent: number,
  premiums: number,
  underwritingExpense: number,
  claimLoss: number | null,
  lossAdjustments: number | null,
  fixed: 'claimLoss' | 'lossAdjustments',
): CombinedRatioBreakdown | null {
  if (
    ![combinedRatioPercent, premiums, underwritingExpense].every(Number.isFinite) ||
    !(premiums > 0) ||
    combinedRatioPercent < 0 ||
    underwritingExpense < 0
  ) {
    return null;
  }

  const lossExpense = (combinedRatioPercent / 100) * premiums - underwritingExpense;
  if (!Number.isFinite(lossExpense) || lossExpense < 0) return null;

  let cl = claimLoss;
  let la = lossAdjustments;
  if (fixed === 'lossAdjustments') {
    if (la === null || la < 0) return null;
    cl = lossExpense - la;
  } else {
    if (cl === null || cl < 0) return null;
    la = lossExpense - cl;
  }
  if (cl === null || la === null || cl < 0 || la < 0) return null;
  return finish(lossExpense, cl, la, premiums, underwritingExpense);
}

function finish(
  lossExpense: number,
  claimLoss: number,
  lossAdjustments: number,
  premiums: number,
  underwritingExpense: number,
): CombinedRatioBreakdown {
  const lossRatio = (lossExpense / premiums) * 100;
  const expenseRatio = (underwritingExpense / premiums) * 100;
  const combinedRatio = lossRatio + expenseRatio;
  const underwritingResult = premiums - lossExpense - underwritingExpense;
  const underwritingMargin = 100 - combinedRatio;

  return {
    claimLoss,
    lossAdjustments,
    lossExpense,
    premiums,
    underwritingExpense,
    lossRatio,
    expenseRatio,
    combinedRatio,
    underwritingResult,
    underwritingMargin,
    status: statusFromRatio(combinedRatio),
  };
}

export function toCombinedRatioResult(
  breakdown: CombinedRatioBreakdown,
  currency: SupportedCurrency,
): CombinedRatioResult {
  const claimLoss = roundMoney(breakdown.claimLoss, currency);
  const lossAdjustments = roundMoney(breakdown.lossAdjustments, currency);
  const lossExpense = roundMoney(breakdown.lossExpense, currency);
  const premiums = roundMoney(breakdown.premiums, currency);
  const underwritingExpense = roundMoney(breakdown.underwritingExpense, currency);
  const underwritingResult = roundMoney(breakdown.underwritingResult, currency);

  return {
    claimLoss,
    lossAdjustments,
    lossExpense,
    premiums,
    underwritingExpense,
    lossRatio: breakdown.lossRatio,
    expenseRatio: breakdown.expenseRatio,
    combinedRatio: breakdown.combinedRatio,
    underwritingResult,
    underwritingMargin: breakdown.underwritingMargin,
    status: breakdown.status,
    currency,
    formattedClaimLoss: formatMoney(claimLoss, currency),
    formattedLossAdjustments: formatMoney(lossAdjustments, currency),
    formattedLossExpense: formatMoney(lossExpense, currency),
    formattedPremiums: formatMoney(premiums, currency),
    formattedUnderwritingExpense: formatMoney(underwritingExpense, currency),
    formattedUnderwritingResult: formatMoney(underwritingResult, currency),
    formattedLossRatio: formatPercent(breakdown.lossRatio),
    formattedExpenseRatio: formatPercent(breakdown.expenseRatio),
    formattedCombinedRatio: formatPercent(breakdown.combinedRatio),
    formattedUnderwritingMargin: formatPercent(breakdown.underwritingMargin),
  };
}

export function shareResultText(
  result: CombinedRatioResult,
  path = '/tools/combined-ratio-calculator',
): string {
  return [
    'Combined Ratio Calculator — Omega Calculators',
    '',
    `Claim loss: ${result.formattedClaimLoss} ${result.currency}`,
    `Loss adjustments: ${result.formattedLossAdjustments} ${result.currency}`,
    `Loss expense: ${result.formattedLossExpense} ${result.currency}`,
    `Premiums: ${result.formattedPremiums} ${result.currency}`,
    `Underwriting expense: ${result.formattedUnderwritingExpense} ${result.currency}`,
    '',
    `Loss ratio: ${result.formattedLossRatio}%`,
    `Expense ratio: ${result.formattedExpenseRatio}%`,
    `Combined ratio: ${result.formattedCombinedRatio}%`,
    `Underwriting result: ${result.formattedUnderwritingResult} ${result.currency}`,
    `Underwriting margin: ${result.formattedUnderwritingMargin}%`,
    '',
    'Currency changes formatting only — amounts are not converted.',
    'Combined ratio is an underwriting metric; overall profit may include investment income and other items.',
    path,
  ].join('\n');
}
