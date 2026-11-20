/**
 * Shared fixed-rate amortizing mortgage helpers.
 * Pure math only — no React, Mongo, or HTTP.
 */

/** Monthly interest rate from nominal annual percent. */
export function monthlyInterestRate(annualPercent: number): number {
  return annualPercent / 100 / 12;
}

/** Factor k such that M = L × k. Handles zero interest. */
export function mortgagePaymentFactor(
  annualInterestRatePercent: number,
  termMonths: number
): number | null {
  if (
    !Number.isFinite(annualInterestRatePercent) ||
    annualInterestRatePercent < 0 ||
    !Number.isFinite(termMonths) ||
    termMonths <= 0
  ) {
    return null;
  }
  const r = monthlyInterestRate(annualInterestRatePercent);
  if (r === 0) return 1 / termMonths;
  const growth = (1 + r) ** termMonths;
  const denom = growth - 1;
  if (!(denom > 0) || !Number.isFinite(growth)) return null;
  return (r * growth) / denom;
}

export function calculateMonthlyMortgagePayment(
  loanPrincipal: number,
  annualInterestRatePercent: number,
  termMonths: number
): number | null {
  if (
    !Number.isFinite(loanPrincipal) ||
    loanPrincipal < 0 ||
    !Number.isFinite(annualInterestRatePercent) ||
    annualInterestRatePercent < 0 ||
    !Number.isFinite(termMonths) ||
    termMonths <= 0
  ) {
    return null;
  }
  if (loanPrincipal === 0) return 0;
  const k = mortgagePaymentFactor(annualInterestRatePercent, termMonths);
  if (k === null) return null;
  const payment = loanPrincipal * k;
  return Number.isFinite(payment) ? payment : null;
}

/** Total scheduled P&I over the full loan term. */
export function calculateTotalMortgagePayments(
  monthlyPayment: number,
  termMonths: number
): number | null {
  if (
    !Number.isFinite(monthlyPayment) ||
    monthlyPayment < 0 ||
    !Number.isFinite(termMonths) ||
    termMonths <= 0
  ) {
    return null;
  }
  const total = monthlyPayment * termMonths;
  return Number.isFinite(total) ? total : null;
}

/**
 * Outstanding principal after `paymentsMade` fully amortizing payments.
 * Balance(k) = L(1+r)^k − M[((1+r)^k − 1)/r]; zero-interest: max(0, L − M×k).
 * Floored at 0 to avoid float negatives.
 */
export function calculateOutstandingLoanBalance(
  loanPrincipal: number,
  annualInterestRatePercent: number,
  termMonths: number,
  paymentsMade: number
): number | null {
  if (
    !Number.isFinite(loanPrincipal) ||
    loanPrincipal < 0 ||
    !Number.isFinite(annualInterestRatePercent) ||
    annualInterestRatePercent < 0 ||
    !Number.isFinite(termMonths) ||
    termMonths <= 0 ||
    !Number.isFinite(paymentsMade) ||
    paymentsMade < 0
  ) {
    return null;
  }
  if (loanPrincipal === 0) return 0;
  const k = Math.min(paymentsMade, termMonths);
  if (k <= 0) return loanPrincipal;
  if (k >= termMonths) return 0;

  const monthly = calculateMonthlyMortgagePayment(
    loanPrincipal,
    annualInterestRatePercent,
    termMonths
  );
  if (monthly === null) return null;

  const r = monthlyInterestRate(annualInterestRatePercent);
  if (r === 0) {
    const balance = Math.max(0, loanPrincipal - monthly * k);
    return Number.isFinite(balance) ? balance : null;
  }

  const growth = (1 + r) ** k;
  const balance =
    loanPrincipal * growth - (monthly * (growth - 1)) / r;
  if (!Number.isFinite(balance)) return null;
  return Math.max(0, balance);
}

export function durationToMonths(
  value: number,
  unit: 'years' | 'months'
): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  const months = unit === 'years' ? value * 12 : value;
  if (!Number.isFinite(months) || months < 0) return null;
  return months;
}
