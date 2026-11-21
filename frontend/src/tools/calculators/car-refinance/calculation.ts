import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { TermUnit } from './types';

export function formatCarRefinanceMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Convert a term value + unit into a positive monthly payment count. */
export function termToMonths(term: number, unit: TermUnit): number | null {
  if (!Number.isFinite(term) || term <= 0) return null;
  const months = unit === 'yrs' ? term * 12 : term;
  if (!Number.isFinite(months) || months <= 0) return null;
  // Allow fractional months from years (e.g. 0.5 yrs → 6); reject non-positive.
  return months;
}

/** Whole months for amortization schedules (ceil of fractional month counts). */
export function monthsToWholePaymentCount(months: number): number | null {
  if (!Number.isFinite(months) || months <= 0) return null;
  const n = Math.round(months);
  return n > 0 ? n : null;
}

export function formatTermLabel(termMonths: number): string {
  if (!Number.isFinite(termMonths) || termMonths <= 0) return '—';
  const whole = Math.round(termMonths);
  if (whole % 12 === 0) {
    const years = whole / 12;
    return `${years} yr${years === 1 ? '' : 's'}`;
  }
  if (whole < 12) {
    return `${whole} mo${whole === 1 ? '' : 's'}`;
  }
  const years = Math.floor(whole / 12);
  const mos = whole % 12;
  return `${years} yr${years === 1 ? '' : 's'} ${mos} mo${mos === 1 ? '' : 's'}`;
}

/**
 * Fixed-rate amortizing monthly payment.
 * r = APR / 1200; M = P × r / (1 − (1+r)^(-n)); when r = 0, M = P / n.
 */
export function calculateMonthlyPayment(input: {
  principal: number;
  annualRatePercent: number;
  paymentCount: number;
}): number | null {
  const { principal, annualRatePercent, paymentCount } = input;
  if (![principal, annualRatePercent, paymentCount].every(Number.isFinite)) {
    return null;
  }
  if (principal < 0 || paymentCount <= 0 || annualRatePercent < 0) return null;
  if (principal === 0) return 0;

  const r = annualRatePercent / 1200;
  let payment: number;
  if (r === 0) {
    payment = principal / paymentCount;
  } else {
    const factor = Math.pow(1 + r, -paymentCount);
    if (!Number.isFinite(factor)) return null;
    const denom = 1 - factor;
    if (!(denom > 0)) return null;
    payment = (principal * r) / denom;
  }

  return Number.isFinite(payment) ? payment : null;
}

/**
 * Solve remaining payment count from balance, APR, and fixed monthly payment.
 * n = ln(M / (M − P·r)) / ln(1+r); when r = 0, n = P / M.
 * Rejects non-amortizing payments (M ≤ P·r).
 */
export function solvePaymentCountFromPayment(input: {
  principal: number;
  annualRatePercent: number;
  monthlyPayment: number;
}): number | null {
  const { principal, annualRatePercent, monthlyPayment } = input;
  if (![principal, annualRatePercent, monthlyPayment].every(Number.isFinite)) {
    return null;
  }
  if (principal <= 0 || monthlyPayment <= 0 || annualRatePercent < 0) return null;

  const r = annualRatePercent / 1200;
  if (r === 0) {
    const n = principal / monthlyPayment;
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  const interestOnly = principal * r;
  if (!(monthlyPayment > interestOnly)) return null;

  const ratio = monthlyPayment / (monthlyPayment - interestOnly);
  if (!(ratio > 0)) return null;
  const n = Math.log(ratio) / Math.log(1 + r);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function calculateTotalInterest(input: {
  principal: number;
  monthlyPayment: number;
  paymentCount: number;
}): number | null {
  const { principal, monthlyPayment, paymentCount } = input;
  if (![principal, monthlyPayment, paymentCount].every(Number.isFinite)) {
    return null;
  }
  const interest = monthlyPayment * paymentCount - principal;
  return Number.isFinite(interest) ? interest : null;
}

/**
 * New refinance principal:
 *   newPrincipal = balance + cashInOut + (fees if financed)
 * Sign: cashInOut > 0 = cash out (borrow more); cashInOut < 0 = cash in (pay down).
 */
export function buildNewPrincipal(input: {
  balance: number;
  cashInOut: number;
  fees: number;
  financeFees: boolean;
}): number | null {
  const { balance, cashInOut, fees, financeFees } = input;
  if (![balance, cashInOut, fees].every(Number.isFinite)) return null;
  if (balance < 0 || fees < 0) return null;
  const financedFees = financeFees ? fees : 0;
  const principal = balance + cashInOut + financedFees;
  return Number.isFinite(principal) ? principal : null;
}

export interface AmortizedLoanSnapshot {
  principal: number;
  monthlyPayment: number;
  interestRatePercent: number;
  paymentCount: number;
  totalInterest: number;
  totalPayments: number;
  termLabel: string;
}

export function buildAmortizedLoan(input: {
  principal: number;
  annualRatePercent: number;
  paymentCount: number;
  /** Extra amount added to total payments only (e.g. upfront fees). */
  extraUpfrontCost?: number;
}): AmortizedLoanSnapshot | null {
  const {
    principal,
    annualRatePercent,
    paymentCount,
    extraUpfrontCost = 0,
  } = input;
  if (principal < 0) return null;
  if (extraUpfrontCost < 0 || !Number.isFinite(extraUpfrontCost)) return null;

  const monthlyPayment = calculateMonthlyPayment({
    principal,
    annualRatePercent,
    paymentCount,
  });
  if (monthlyPayment === null) return null;

  const totalInterest = calculateTotalInterest({
    principal,
    monthlyPayment,
    paymentCount,
  });
  if (totalInterest === null) return null;

  const totalPayments = monthlyPayment * paymentCount + extraUpfrontCost;
  if (!Number.isFinite(totalPayments)) return null;

  return {
    principal,
    monthlyPayment,
    interestRatePercent: annualRatePercent,
    paymentCount,
    totalInterest,
    totalPayments,
    termLabel: formatTermLabel(paymentCount),
  };
}

/**
 * Compare current remaining loan vs refinance terms at full precision.
 * All money amounts must already be in the same currency.
 */
export function calculateCarRefinance(input: {
  balance: number;
  currentRatePercent: number;
  currentPaymentCount: number;
  /** When set, overrides amortized current payment (estimation-by-payment mode). */
  currentMonthlyPaymentOverride?: number | null;
  newRatePercent: number;
  newPaymentCount: number;
  cashInOut: number;
  fees: number;
  financeFees: boolean;
}): {
  current: AmortizedLoanSnapshot;
  neu: AmortizedLoanSnapshot;
  monthlyPaymentDiff: number;
  totalInterestDiff: number;
  totalPaymentsDiff: number;
  explanation: string;
  cashInOut: number;
  fees: number;
  feesFinanced: boolean;
  upfrontFees: number;
} | null {
  const {
    balance,
    currentRatePercent,
    currentPaymentCount,
    currentMonthlyPaymentOverride = null,
    newRatePercent,
    newPaymentCount,
    cashInOut,
    fees,
    financeFees,
  } = input;

  if (balance < 0) return null;

  let current: AmortizedLoanSnapshot | null;
  if (
    currentMonthlyPaymentOverride !== null &&
    currentMonthlyPaymentOverride !== undefined
  ) {
    if (
      !Number.isFinite(currentMonthlyPaymentOverride) ||
      currentMonthlyPaymentOverride <= 0
    ) {
      return null;
    }
    const totalPayments =
      currentMonthlyPaymentOverride * currentPaymentCount;
    const totalInterest = totalPayments - balance;
    if (![totalPayments, totalInterest].every(Number.isFinite)) return null;
    current = {
      principal: balance,
      monthlyPayment: currentMonthlyPaymentOverride,
      interestRatePercent: currentRatePercent,
      paymentCount: currentPaymentCount,
      totalInterest,
      totalPayments,
      termLabel: formatTermLabel(currentPaymentCount),
    };
  } else {
    current = buildAmortizedLoan({
      principal: balance,
      annualRatePercent: currentRatePercent,
      paymentCount: currentPaymentCount,
    });
  }
  if (!current) return null;

  const newPrincipal = buildNewPrincipal({
    balance,
    cashInOut,
    fees,
    financeFees,
  });
  if (newPrincipal === null || newPrincipal < 0) return null;
  // Zero principal after cash-in is a valid "paid off" edge — no new loan.
  if (newPrincipal === 0) {
    const neu: AmortizedLoanSnapshot = {
      principal: 0,
      monthlyPayment: 0,
      interestRatePercent: newRatePercent,
      paymentCount: newPaymentCount,
      totalInterest: 0,
      totalPayments: financeFees ? 0 : fees,
      termLabel: formatTermLabel(newPaymentCount),
    };
    return summarizeComparison(current, neu, cashInOut, fees, financeFees);
  }

  const upfrontFees = financeFees ? 0 : fees;
  const neu = buildAmortizedLoan({
    principal: newPrincipal,
    annualRatePercent: newRatePercent,
    paymentCount: newPaymentCount,
    extraUpfrontCost: upfrontFees,
  });
  if (!neu) return null;

  return summarizeComparison(current, neu, cashInOut, fees, financeFees);
}

function summarizeComparison(
  current: AmortizedLoanSnapshot,
  neu: AmortizedLoanSnapshot,
  cashInOut: number,
  fees: number,
  financeFees: boolean
) {
  const monthlyPaymentDiff = current.monthlyPayment - neu.monthlyPayment;
  const totalInterestDiff = current.totalInterest - neu.totalInterest;
  const totalPaymentsDiff = current.totalPayments - neu.totalPayments;
  const upfrontFees = financeFees ? 0 : fees;

  const explanation = buildExplanation({
    monthlyPaymentDiff,
    totalInterestDiff,
    totalPaymentsDiff,
    currentTermMonths: current.paymentCount,
    newTermMonths: neu.paymentCount,
    cashInOut,
    fees,
    financeFees,
  });

  return {
    current,
    neu,
    monthlyPaymentDiff,
    totalInterestDiff,
    totalPaymentsDiff,
    explanation,
    cashInOut,
    fees,
    feesFinanced: financeFees,
    upfrontFees,
  };
}

function buildExplanation(input: {
  monthlyPaymentDiff: number;
  totalInterestDiff: number;
  totalPaymentsDiff: number;
  currentTermMonths: number;
  newTermMonths: number;
  cashInOut: number;
  fees: number;
  financeFees: boolean;
}): string {
  const {
    monthlyPaymentDiff,
    totalInterestDiff,
    totalPaymentsDiff,
    currentTermMonths,
    newTermMonths,
    cashInOut,
    fees,
    financeFees,
  } = input;

  const parts: string[] = [];

  if (Math.abs(monthlyPaymentDiff) < 1e-9) {
    parts.push('Monthly payment is unchanged.');
  } else if (monthlyPaymentDiff > 0) {
    parts.push('The new loan lowers the monthly payment.');
  } else {
    parts.push('The new loan raises the monthly payment.');
  }

  if (totalInterestDiff > 1e-9) {
    parts.push('Total interest over the remaining schedules is lower after refinancing.');
  } else if (totalInterestDiff < -1e-9) {
    parts.push('Total interest over the remaining schedules is higher after refinancing.');
  } else {
    parts.push('Total interest is essentially unchanged.');
  }

  if (totalPaymentsDiff > 1e-9) {
    parts.push('Overall remaining payments (including any upfront fees) cost less.');
  } else if (totalPaymentsDiff < -1e-9) {
    parts.push('Overall remaining payments (including any upfront fees) cost more.');
  }

  if (currentTermMonths !== newTermMonths) {
    parts.push(
      'Loan terms differ, so compare total interest and total payments; not only the monthly payment.'
    );
  }

  if (cashInOut > 0) {
    parts.push('Positive cash out increases the new loan principal.');
  } else if (cashInOut < 0) {
    parts.push('Negative cash in reduces the new loan principal.');
  }

  if (fees > 0) {
    parts.push(
      financeFees
        ? 'Refinancing fees are financed into the new principal.'
        : 'Refinancing fees are paid upfront and added to new-loan total payments only.'
    );
  }

  return parts.join(' ');
}
