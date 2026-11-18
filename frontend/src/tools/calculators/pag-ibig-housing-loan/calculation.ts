/**
 * Pag-IBIG Housing Loan — pure math helpers.
 *
 * Property-based loanable limits and monthly insurance premiums are NOT
 * computed here: this repository has no verified Pag-IBIG circular/spec for
 * those rules. Callers must surface unavailable states instead of inventing
 * LTV ratios or insurance rates.
 */

export const LOANABLE_AMOUNT_UNAVAILABLE_REASON =
  'Pag-IBIG property-based loanable limits are not defined in available project/reference data. No LTV percentage was invented.';

export const INSURANCE_UNAVAILABLE_REASON =
  'Monthly housing-loan insurance (MRI/fire or other) is not defined in available project/reference data. No premium rate was invented.';

export const TOTAL_AMORTIZATION_UNAVAILABLE_REASON =
  'Total monthly amortization needs a verified insurance premium. Principal and interest alone are shown above.';

export const OTHER_VALUES_UNAVAILABLE_REASON =
  'The reference screenshot does not reveal which additional values appear when “Yes” is selected, and no project specification lists them.';

export function formatPhpAmount(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Standard fixed-rate monthly amortizing payment.
 * r = APR/100/12; M = P × r / (1 − (1+r)^(-n)); when r = 0, M = P / n.
 */
export function calculateMonthlyPrincipalAndInterest(input: {
  principal: number;
  annualRatePercent: number;
  paymentCount: number;
}): number | null {
  const { principal, annualRatePercent, paymentCount } = input;
  if (![principal, annualRatePercent, paymentCount].every(Number.isFinite)) {
    return null;
  }
  if (principal <= 0 || paymentCount <= 0 || annualRatePercent < 0) return null;

  const r = annualRatePercent / 100 / 12;
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

export function annualFromMonthly(monthly: number): number | null {
  if (!Number.isFinite(monthly) || monthly < 0) return null;
  const annual = monthly * 12;
  return Number.isFinite(annual) ? annual : null;
}

export function monthlyFromAnnual(annual: number): number | null {
  if (!Number.isFinite(annual) || annual < 0) return null;
  const monthly = annual / 12;
  return Number.isFinite(monthly) ? monthly : null;
}
