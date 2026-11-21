import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { FeeTreatment, TransferFeeType } from './types';

/** Hard cap — 100 years of monthly steps. */
export const MAX_PAYOFF_MONTHS = 1200;

export interface CardSimResult {
  interest: number;
  totalPaid: number;
  months: number | null;
  neverPaysOff: boolean;
  remainingAfterMonths: number | null;
  interestDuringPromo: number;
  interestAfterPromo: number;
  cumulativeInterestByMonth: number[];
}

export function monthlyRateFromApr(aprPercent: number): number {
  return aprPercent / 100 / 12;
}

export function calculateTransferFee(
  transferAmount: number,
  feeValue: number,
  feeType: TransferFeeType
): number | null {
  if (
    !Number.isFinite(transferAmount) ||
    transferAmount < 0 ||
    !Number.isFinite(feeValue) ||
    feeValue < 0
  ) {
    return null;
  }
  if (feeType === 'fixed') return feeValue;
  if (feeValue > 100) return null;
  return transferAmount * (feeValue / 100);
}

export function resolveNewStartingBalance(
  transferAmount: number,
  feeAmount: number,
  treatment: FeeTreatment
): { interestBearing: number; upfrontFee: number } | null {
  if (
    !Number.isFinite(transferAmount) ||
    transferAmount <= 0 ||
    !Number.isFinite(feeAmount) ||
    feeAmount < 0
  ) {
    return null;
  }
  if (treatment === 'financed') {
    return {
      interestBearing: transferAmount + feeAmount,
      upfrontFee: 0,
    };
  }
  return {
    interestBearing: transferAmount,
    upfrontFee: feeAmount,
  };
}

/**
 * Required fixed payment to clear balance in `months` at constant APR.
 * 0% → balance / months. Otherwise standard amortizing PMT.
 */
export function requiredPaymentForPromoPayoff(
  balance: number,
  aprPercent: number,
  months: number
): number | null {
  if (
    !Number.isFinite(balance) ||
    balance <= 0 ||
    !Number.isFinite(aprPercent) ||
    aprPercent < 0 ||
    !Number.isFinite(months) ||
    months <= 0 ||
    !Number.isInteger(months)
  ) {
    return null;
  }
  if (aprPercent === 0) {
    const p = balance / months;
    return Number.isFinite(p) ? p : null;
  }
  const r = monthlyRateFromApr(aprPercent);
  const growth = (1 + r) ** months;
  const denom = growth - 1;
  if (!(denom > 0)) return null;
  const pmt = (balance * r * growth) / denom;
  return Number.isFinite(pmt) ? pmt : null;
}

/**
 * Simulate a single-rate card with fixed monthly payment.
 * Interest added before payment. Caps final payment.
 */
export function simulateFixedRateCard(
  startingBalance: number,
  aprPercent: number,
  monthlyPayment: number,
  options?: { stopAfterMonths?: number }
): CardSimResult | null {
  if (
    !Number.isFinite(startingBalance) ||
    startingBalance < 0 ||
    !Number.isFinite(aprPercent) ||
    aprPercent < 0 ||
    !Number.isFinite(monthlyPayment) ||
    monthlyPayment <= 0
  ) {
    return null;
  }

  const stopAfter = options?.stopAfterMonths;
  const rate = monthlyRateFromApr(aprPercent);
  let balance = startingBalance;
  let interest = 0;
  let totalPaid = 0;
  const cumulativeInterestByMonth: number[] = [];
  let neverPaysOff = false;
  let months = 0;

  if (startingBalance === 0) {
    return {
      interest: 0,
      totalPaid: 0,
      months: 0,
      neverPaysOff: false,
      remainingAfterMonths: stopAfter != null ? 0 : null,
      interestDuringPromo: 0,
      interestAfterPromo: 0,
      cumulativeInterestByMonth: [],
    };
  }

  while (balance > 1e-9 && months < MAX_PAYOFF_MONTHS) {
    if (stopAfter != null && months >= stopAfter) break;

    const monthInterest = balance * rate;
    if (!Number.isFinite(monthInterest)) return null;

    if (monthlyPayment <= monthInterest + 1e-12) {
      neverPaysOff = true;
      if (stopAfter == null) break;
      balance = balance + monthInterest - monthlyPayment;
      if (balance < 0) balance = 0;
      interest += monthInterest;
      totalPaid += monthlyPayment;
      months += 1;
      cumulativeInterestByMonth.push(interest);
      continue;
    }

    const due = balance + monthInterest;
    const payment = Math.min(monthlyPayment, due);
    balance = due - payment;
    if (balance < 1e-9) balance = 0;
    interest += monthInterest;
    totalPaid += payment;
    months += 1;
    cumulativeInterestByMonth.push(interest);
  }

  if (balance > 1e-9 && months >= MAX_PAYOFF_MONTHS) {
    neverPaysOff = true;
  }

  return {
    interest,
    totalPaid,
    months: neverPaysOff && stopAfter == null ? null : months,
    neverPaysOff,
    remainingAfterMonths: Math.max(0, balance),
    interestDuringPromo: interest,
    interestAfterPromo: 0,
    cumulativeInterestByMonth,
  };
}

function applyCardMonth(
  balance: number,
  aprPercent: number,
  paymentBudget: number
): {
  balance: number;
  interest: number;
  paid: number;
  leftover: number;
  neverPaysOff: boolean;
} | null {
  if (balance <= 1e-9) {
    return {
      balance: 0,
      interest: 0,
      paid: 0,
      leftover: paymentBudget,
      neverPaysOff: false,
    };
  }
  const rate = monthlyRateFromApr(aprPercent);
  const interest = balance * rate;
  if (!Number.isFinite(interest)) return null;

  if (paymentBudget <= interest + 1e-12) {
    const next = balance + interest - paymentBudget;
    return {
      balance: Math.max(0, next),
      interest,
      paid: paymentBudget,
      leftover: 0,
      neverPaysOff: true,
    };
  }

  const due = balance + interest;
  const paid = Math.min(paymentBudget, due);
  return {
    balance: Math.max(0, due - paid),
    interest,
    paid,
    leftover: paymentBudget - paid,
    neverPaysOff: false,
  };
}

/**
 * Simulate new card: promo APR for promoMonths, then regular APR.
 * Leftover payment each month goes to untransferred old-card remainder.
 */
export function simulateBalanceTransferCard(params: {
  newStartingBalance: number;
  promotionalApr: number;
  promotionalMonths: number;
  regularApr: number;
  monthlyPayment: number;
  remainingOldBalance?: number;
  oldApr?: number;
}): {
  newCard: CardSimResult;
  remainingOldInterest: number;
  remainingAfterPromotion: number;
} | null {
  const {
    newStartingBalance,
    promotionalApr,
    promotionalMonths,
    regularApr,
    monthlyPayment,
    remainingOldBalance = 0,
    oldApr = 0,
  } = params;

  if (
    !Number.isFinite(newStartingBalance) ||
    newStartingBalance < 0 ||
    !Number.isFinite(promotionalApr) ||
    promotionalApr < 0 ||
    !Number.isFinite(promotionalMonths) ||
    promotionalMonths < 0 ||
    !Number.isInteger(promotionalMonths) ||
    !Number.isFinite(regularApr) ||
    regularApr < 0 ||
    !Number.isFinite(monthlyPayment) ||
    monthlyPayment <= 0
  ) {
    return null;
  }

  let newBal = newStartingBalance;
  let oldBal = Math.max(0, remainingOldBalance);
  let newInterest = 0;
  let oldInterest = 0;
  let promoInterest = 0;
  let postInterest = 0;
  let newPaid = 0;
  let months = 0;
  let stuck = false;
  const cumulativeNewInterest: number[] = [];
  let remainingAfterPromotion = newStartingBalance;

  const runMonth = (aprForNew: number, isPromo: boolean): boolean => {
    const newStep = applyCardMonth(newBal, aprForNew, monthlyPayment);
    if (!newStep) return false;
    newBal = newStep.balance;
    newInterest += newStep.interest;
    newPaid += newStep.paid;
    if (isPromo) promoInterest += newStep.interest;
    else postInterest += newStep.interest;
    if (newStep.neverPaysOff) stuck = true;

    const oldStep = applyCardMonth(oldBal, oldApr, newStep.leftover);
    if (!oldStep) return false;
    // If no leftover, still accrue old interest with zero payment
    if (oldBal > 1e-9 && newStep.leftover <= 1e-12) {
      const oi = oldBal * monthlyRateFromApr(oldApr);
      oldBal += oi;
      oldInterest += oi;
      if (newBal <= 1e-9 && monthlyPayment <= oi + 1e-12) stuck = true;
    } else {
      oldBal = oldStep.balance;
      oldInterest += oldStep.interest;
      if (oldStep.neverPaysOff) stuck = true;
    }

    cumulativeNewInterest.push(newInterest);
    return true;
  };

  for (let m = 0; m < promotionalMonths && months < MAX_PAYOFF_MONTHS; m += 1) {
    if (newBal <= 1e-9 && oldBal <= 1e-9) break;
    if (!runMonth(promotionalApr, true)) return null;
    months += 1;
  }
  remainingAfterPromotion = Math.max(0, newBal);

  while (
    (newBal > 1e-9 || oldBal > 1e-9) &&
    months < MAX_PAYOFF_MONTHS &&
    !stuck
  ) {
    if (!runMonth(regularApr, false)) return null;
    months += 1;
  }

  if ((newBal > 1e-9 || oldBal > 1e-9) && (stuck || months >= MAX_PAYOFF_MONTHS)) {
    stuck = true;
  }

  return {
    newCard: {
      interest: newInterest,
      totalPaid: newPaid,
      months: stuck ? null : months,
      neverPaysOff: stuck,
      remainingAfterMonths: remainingAfterPromotion,
      interestDuringPromo: promoInterest,
      interestAfterPromo: postInterest,
      cumulativeInterestByMonth: cumulativeNewInterest,
    },
    remainingOldInterest: oldInterest,
    remainingAfterPromotion,
  };
}

/**
 * Break-even month: first month where cumulative old interest − cumulative
 * new interest ≥ transfer fee.
 */
export function findBreakEvenMonth(
  oldCumulativeInterest: number[],
  newCumulativeInterest: number[],
  transferFee: number
): number | null {
  if (
    !Number.isFinite(transferFee) ||
    transferFee < 0 ||
    oldCumulativeInterest.length === 0
  ) {
    return null;
  }
  if (transferFee === 0) return 1;
  const n = Math.min(
    oldCumulativeInterest.length,
    newCumulativeInterest.length
  );
  for (let i = 0; i < n; i += 1) {
    const saved = oldCumulativeInterest[i]! - newCumulativeInterest[i]!;
    if (saved + 1e-9 >= transferFee) return i + 1;
  }
  return null;
}

export function formatBtMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function interpretBalanceTransfer(
  savings: number | null,
  oldNever: boolean,
  newNever: boolean,
  currency: SupportedCurrency
): string {
  if (oldNever && newNever) {
    return 'Neither scenario pays off under the entered monthly payment. Increase the payment or lower the rates.';
  }
  if (oldNever) {
    return 'The old card does not pay off with this payment. Compare carefully with the transfer scenario.';
  }
  if (newNever) {
    return 'The transfer scenario does not pay off with this payment. Keeping the old card or raising the payment may be necessary.';
  }
  if (savings === null) {
    return 'Enter balances, rates, fees, and a monthly payment to compare keeping the old card versus transferring.';
  }
  if (Math.abs(savings) < 0.005) {
    return 'Under these assumptions, keeping the old card and transferring cost about the same.';
  }
  const abs = formatBtMoney(Math.abs(savings), currency);
  if (savings > 0) {
    return `Under these assumptions, transferring saves about ${abs} versus keeping the balance on the old card (interest difference net of the transfer fee). Actual issuer terms may differ.`;
  }
  return `Under these assumptions, transferring costs about ${abs} more than keeping the old card once the transfer fee and interest are included.`;
}
