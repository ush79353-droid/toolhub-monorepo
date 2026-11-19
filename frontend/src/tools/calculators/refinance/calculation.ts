/**
 * Fixed-rate monthly amortization helpers for Refinance Calculator (USD).
 * Reuses the same formulas as Car Refinance without FX.
 */

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatTermLabel(months: number): string {
  if (!Number.isFinite(months) || months <= 0) return '—';
  const whole = Math.round(months);
  if (whole % 12 === 0) {
    const years = whole / 12;
    return `${years} year${years === 1 ? '' : 's'}`;
  }
  if (whole < 12) return `${whole} month${whole === 1 ? '' : 's'}`;
  const years = Math.floor(whole / 12);
  const mos = whole % 12;
  return `${years} yr${years === 1 ? '' : 's'} ${mos} mo${mos === 1 ? '' : 's'}`;
}

/** M = P × r / (1 − (1+r)^(-n)); r = APR/1200; when r = 0, M = P / n. */
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

/** n = ln(M / (M − P·r)) / ln(1+r); when r = 0, n = P / M. */
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

/**
 * Refinance comparison (costs/points paid upfront — not financed).
 * New principal = Remaining Balance + Cash-Out.
 * Points cost = New principal × Points / 100.
 * Closing costs = Points cost + Costs and fees.
 * Break-even months = Closing / monthly payment savings (when savings > 0).
 * Net savings = (current remaining interest − new interest) − closing costs.
 */
export function calculateRefinance(input: {
  remainingBalance: number;
  currentMonthlyPayment: number;
  currentRatePercent: number;
  newTermYears: number;
  newRatePercent: number;
  pointsPercent: number;
  costsAndFees: number;
  cashOutAmount: number;
}): {
  currentRemainingMonths: number;
  currentRemainingInterest: number;
  newMonthlyPayment: number;
  newLoanAmount: number;
  pointsCost: number;
  closingCosts: number;
  monthlyPaymentDiff: number;
  currentTotalInterest: number;
  newTotalInterest: number;
  interestDiff: number;
  breakEvenMonths: number | null;
  netSavings: number;
} | null {
  const {
    remainingBalance,
    currentMonthlyPayment,
    currentRatePercent,
    newTermYears,
    newRatePercent,
    pointsPercent,
    costsAndFees,
    cashOutAmount,
  } = input;

  if (
    ![
      remainingBalance,
      currentMonthlyPayment,
      currentRatePercent,
      newTermYears,
      newRatePercent,
      pointsPercent,
      costsAndFees,
      cashOutAmount,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (remainingBalance < 0 || currentMonthlyPayment <= 0) return null;
  if (currentRatePercent < 0 || newRatePercent < 0) return null;
  if (newTermYears <= 0 || pointsPercent < 0 || costsAndFees < 0) return null;
  if (cashOutAmount < 0) return null;

  const currentMonths = solvePaymentCountFromPayment({
    principal: remainingBalance,
    annualRatePercent: currentRatePercent,
    monthlyPayment: currentMonthlyPayment,
  });
  if (currentMonths === null) return null;

  const currentRemainingInterest =
    currentMonthlyPayment * currentMonths - remainingBalance;
  if (!Number.isFinite(currentRemainingInterest)) return null;

  const newLoanAmount = remainingBalance + cashOutAmount;
  if (!(newLoanAmount >= 0) || !Number.isFinite(newLoanAmount)) return null;

  const pointsCost = (newLoanAmount * pointsPercent) / 100;
  const closingCosts = pointsCost + costsAndFees;
  if (![pointsCost, closingCosts].every(Number.isFinite)) return null;

  const newPaymentCount = Math.round(newTermYears * 12);
  if (newPaymentCount <= 0) return null;

  const newMonthlyPayment = calculateMonthlyPayment({
    principal: newLoanAmount,
    annualRatePercent: newRatePercent,
    paymentCount: newPaymentCount,
  });
  if (newMonthlyPayment === null) return null;

  const newTotalInterest =
    newMonthlyPayment * newPaymentCount - newLoanAmount;
  if (!Number.isFinite(newTotalInterest)) return null;

  const monthlyPaymentDiff = newMonthlyPayment - currentMonthlyPayment;
  const interestDiff = newTotalInterest - currentRemainingInterest;
  const monthlySavings = -monthlyPaymentDiff;

  let breakEvenMonths: number | null = null;
  if (monthlySavings > 0 && closingCosts > 0) {
    const be = closingCosts / monthlySavings;
    breakEvenMonths = Number.isFinite(be) && be > 0 ? be : null;
  } else if (monthlySavings > 0 && closingCosts === 0) {
    breakEvenMonths = 0;
  } else {
    breakEvenMonths = null;
  }

  const netSavings = currentRemainingInterest - newTotalInterest - closingCosts;
  if (!Number.isFinite(netSavings)) return null;

  return {
    currentRemainingMonths: currentMonths,
    currentRemainingInterest,
    newMonthlyPayment,
    newLoanAmount,
    pointsCost,
    closingCosts,
    monthlyPaymentDiff,
    currentTotalInterest: currentRemainingInterest,
    newTotalInterest,
    interestDiff,
    breakEvenMonths,
    netSavings,
  };
}
