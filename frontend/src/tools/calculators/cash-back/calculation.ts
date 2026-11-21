/**
 * Cash Back Calculator — pure engine (ADR-018).
 *
 * CashBack = P × R/100
 * Actual = min(CashBack, Limit) when capped
 * EffectiveCost = P − Actual
 * EffectiveRate = Actual/P × 100
 */

import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { CashBackInput, CashBackResult } from './types';

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const f = 10 ** digits;
  return Math.round(amount * f) / f;
}

export function formatPercent(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  return `${n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

export function calculateCashBack(inputs: {
  purchaseAmount: number;
  cashbackPercentage: number;
  hasCashbackLimit: boolean;
  cashbackLimit?: number;
}): {
  purchaseAmount: number;
  cashbackPercentage: number;
  calculatedCashback: number;
  actualCashback: number;
  effectiveCashbackRate: number | null;
  effectivePurchaseCost: number;
  cashbackLimitApplied: boolean;
} | null {
  const {
    purchaseAmount,
    cashbackPercentage,
    hasCashbackLimit,
    cashbackLimit,
  } = inputs;

  if (
    !Number.isFinite(purchaseAmount) ||
    !Number.isFinite(cashbackPercentage)
  ) {
    return null;
  }
  if (purchaseAmount < 0) return null;
  if (cashbackPercentage < 0 || cashbackPercentage > 100) return null;

  const calculatedCashback = (purchaseAmount * cashbackPercentage) / 100;
  if (!Number.isFinite(calculatedCashback) || calculatedCashback < 0) {
    return null;
  }

  let actualCashback = calculatedCashback;
  let cashbackLimitApplied = false;

  if (hasCashbackLimit) {
    if (
      cashbackLimit == null ||
      !Number.isFinite(cashbackLimit) ||
      cashbackLimit < 0
    ) {
      return null;
    }
    actualCashback = Math.min(calculatedCashback, cashbackLimit);
    cashbackLimitApplied = calculatedCashback > cashbackLimit;
  }

  if (!Number.isFinite(actualCashback) || actualCashback < 0) return null;

  const effectivePurchaseCost = purchaseAmount - actualCashback;
  if (!Number.isFinite(effectivePurchaseCost)) return null;

  const effectiveCashbackRate =
    purchaseAmount > 0 ? (actualCashback / purchaseAmount) * 100 : null;

  return {
    purchaseAmount,
    cashbackPercentage,
    calculatedCashback,
    actualCashback,
    effectiveCashbackRate,
    effectivePurchaseCost,
    cashbackLimitApplied,
  };
}

export function calculateBreakEvenSpend(
  cashbackLimit: number,
  cashbackPercentage: number,
): number | null {
  if (
    !Number.isFinite(cashbackLimit) ||
    !Number.isFinite(cashbackPercentage) ||
    cashbackLimit < 0 ||
    cashbackPercentage <= 0 ||
    cashbackPercentage > 100
  ) {
    return null;
  }
  const spend = cashbackLimit / (cashbackPercentage / 100);
  return Number.isFinite(spend) && spend >= 0 ? spend : null;
}

function money(n: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(roundMoney(n, currency), currency);
}

export function calculateCashBackFromInput(
  input: CashBackInput,
): CashBackResult | null {
  const { solveTarget, currency, rewardKind } = input;

  if (solveTarget === 'breakEvenSpend') {
    const limit = num(input.cashbackLimit);
    const rate = num(input.breakEvenRate);
    if (limit == null || rate == null) return null;
    const spend = calculateBreakEvenSpend(limit, rate);
    if (spend === null) return null;
    return buildResult({
      solveTarget,
      currency,
      purchaseAmount: spend,
      cashbackPercentage: rate,
      rewardKind: 'percentage',
      calculatedCashback: limit,
      actualCashback: limit,
      hasCashbackLimit: true,
      cashbackLimit: limit,
      cashbackLimitApplied: false,
      breakEvenSpend: spend,
      note: 'break-even',
    });
  }

  const purchase = num(input.purchaseAmount);
  if (purchase == null) return null;

  let calculated: number;
  let cashbackPercentage: number;

  if (rewardKind === 'fixed') {
    const fixed = num(input.fixedCashback);
    if (fixed == null || fixed < 0) return null;
    calculated = fixed;
    cashbackPercentage =
      purchase > 0 ? (fixed / purchase) * 100 : fixed === 0 ? 0 : Number.NaN;
    if (!Number.isFinite(cashbackPercentage) && purchase === 0 && fixed > 0) {
      cashbackPercentage = Number.NaN;
    }
  } else {
    const rate = num(input.cashbackPercentage);
    if (rate == null || rate < 0 || rate > 100) return null;
    cashbackPercentage = rate;
    calculated = (purchase * rate) / 100;
  }

  if (!Number.isFinite(calculated) || calculated < 0) return null;

  let hasLimit = input.hasCashbackLimit;
  let limit: number | null = null;
  let actual = calculated;
  let applied = false;

  if (hasLimit) {
    const lim = num(input.cashbackLimit);
    if (lim == null || lim < 0) return null;
    limit = lim;
    actual = Math.min(calculated, lim);
    applied = calculated > lim;
  }

  if (!Number.isFinite(actual) || actual < 0) return null;

  // For display rate when percentage mode
  const displayRate = Number.isFinite(cashbackPercentage)
    ? cashbackPercentage
    : 0;

  return buildResult({
    solveTarget,
    currency,
    purchaseAmount: purchase,
    cashbackPercentage: displayRate,
    rewardKind,
    calculatedCashback: calculated,
    actualCashback: actual,
    hasCashbackLimit: hasLimit,
    cashbackLimit: limit,
    cashbackLimitApplied: applied,
    breakEvenSpend: null,
    note: 'forward',
  });
}

function buildResult(args: {
  solveTarget: CashBackResult['solveTarget'];
  currency: SupportedCurrency;
  purchaseAmount: number;
  cashbackPercentage: number;
  rewardKind: CashBackResult['rewardKind'];
  calculatedCashback: number;
  actualCashback: number;
  hasCashbackLimit: boolean;
  cashbackLimit: number | null;
  cashbackLimitApplied: boolean;
  breakEvenSpend: number | null;
  note: string;
}): CashBackResult {
  const {
    solveTarget,
    currency,
    purchaseAmount,
    cashbackPercentage,
    rewardKind,
    calculatedCashback,
    actualCashback,
    hasCashbackLimit,
    cashbackLimit,
    cashbackLimitApplied,
    breakEvenSpend,
    note,
  } = args;

  const effectivePurchaseCost = purchaseAmount - actualCashback;
  const effectiveCashbackRate =
    purchaseAmount > 0 ? (actualCashback / purchaseAmount) * 100 : null;

  const steps: string[] = [];
  let formulaBreakdown: string;
  let interpretation: string;

  if (note === 'break-even' && breakEvenSpend != null && cashbackLimit != null) {
    formulaBreakdown = [
      'SpendingRequired = CashBackLimit ÷ (Rate/100)',
      `= ${money(cashbackLimit, currency)} ÷ (${cashbackPercentage}/100)`,
      `= ${money(breakEvenSpend, currency)}`,
    ].join('\n');
    steps.push(
      `Limit = ${money(cashbackLimit, currency)}`,
      `Rate = ${formatPercent(cashbackPercentage)}`,
      `Eligible spend to reach the cap = ${money(breakEvenSpend, currency)}`,
    );
    interpretation = `At ${formatPercent(cashbackPercentage)} cashback, you need about ${money(breakEvenSpend, currency)} in eligible spending to reach a ${money(cashbackLimit, currency)} reward cap.`;
  } else {
    formulaBreakdown = [
      rewardKind === 'fixed'
        ? `Calculated cashback (fixed) = ${money(calculatedCashback, currency)}`
        : `Calculated = Purchase × Rate/100 = ${money(purchaseAmount, currency)} × ${cashbackPercentage}/100 = ${money(calculatedCashback, currency)}`,
      hasCashbackLimit && cashbackLimit != null
        ? `Actual = min(${money(calculatedCashback, currency)}, ${money(cashbackLimit, currency)}) = ${money(actualCashback, currency)}`
        : `Actual cashback = ${money(actualCashback, currency)}`,
      `Effective cost = ${money(purchaseAmount, currency)} − ${money(actualCashback, currency)} = ${money(effectivePurchaseCost, currency)}`,
      effectiveCashbackRate == null
        ? 'Effective rate = N/A (purchase amount is zero)'
        : `Effective rate = ${money(actualCashback, currency)} ÷ ${money(purchaseAmount, currency)} × 100 = ${formatPercent(effectiveCashbackRate)}`,
    ].join('\n');

    steps.push(`Purchase amount = ${money(purchaseAmount, currency)}`);
    if (rewardKind === 'percentage') {
      steps.push(
        `Cashback rate = ${formatPercent(cashbackPercentage)}`,
        `Uncapped cashback = ${money(calculatedCashback, currency)}`,
      );
    } else {
      steps.push(`Fixed cashback = ${money(calculatedCashback, currency)}`);
    }
    if (hasCashbackLimit && cashbackLimit != null) {
      steps.push(
        `Cashback limit = ${money(cashbackLimit, currency)}`,
        cashbackLimitApplied
          ? `Cap applied → actual cashback = ${money(actualCashback, currency)}`
          : `Cap not binding → actual cashback = ${money(actualCashback, currency)}`,
      );
    }
    steps.push(
      `Effective purchase cost = ${money(effectivePurchaseCost, currency)}`,
    );

    interpretation = cashbackLimitApplied
      ? `Your calculated cashback exceeds the reward limit, so the final cashback amount is capped at ${money(actualCashback, currency)}. Effective rate is ${effectiveCashbackRate == null ? 'N/A' : formatPercent(effectiveCashbackRate)} versus the advertised ${formatPercent(cashbackPercentage)}.`
      : `You earn ${money(actualCashback, currency)} cashback. Effective purchase cost is ${money(effectivePurchaseCost, currency)}, assuming the reward is received in full with no fees or adjustments.`;
  }

  const explanation =
    'Cashback is a conditional reward on eligible spending — not free money. Issuer rules, category exclusions, annual fees, interest, and redemption timing can change realized value.';

  return {
    solveTarget,
    currency,
    purchaseAmount,
    cashbackPercentage,
    rewardKind,
    calculatedCashback,
    actualCashback,
    hasCashbackLimit,
    cashbackLimit,
    cashbackLimitApplied,
    effectiveCashbackRate,
    effectivePurchaseCost,
    breakEvenSpend,
    formattedPurchase: money(purchaseAmount, currency),
    formattedCalculated: money(calculatedCashback, currency),
    formattedActual: money(actualCashback, currency),
    formattedLimit:
      cashbackLimit != null ? money(cashbackLimit, currency) : 'Not applied',
    formattedEffectiveRate:
      effectiveCashbackRate == null
        ? 'N/A'
        : formatPercent(effectiveCashbackRate),
    formattedEffectiveCost: money(effectivePurchaseCost, currency),
    formattedBreakEven:
      breakEvenSpend != null ? money(breakEvenSpend, currency) : '—',
    formulaBreakdown,
    steps,
    interpretation,
    explanation,
  };
}
