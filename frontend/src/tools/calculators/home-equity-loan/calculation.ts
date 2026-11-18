/**
 * Home Equity Loan — fixed-rate monthly amortizing helpers.
 * Closing-cost adjustments are not computed here (no verified fee/percentage in project data).
 */

export function formatUsdAmount(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * r = APR/1200; M = P × r / (1 − (1+r)^(-n)); when r = 0, M = P / n.
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
  if (principal <= 0 || paymentCount <= 0 || annualRatePercent < 0) return null;

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

export function calculateHomeEquityLoan(input: {
  principal: number;
  annualRatePercent: number;
  termYears: number;
}): {
  monthlyPayment: number;
  paymentCount: number;
  totalOfPayments: number;
  totalInterest: number;
  principalSharePercent: number;
  interestSharePercent: number;
} | null {
  const { principal, annualRatePercent, termYears } = input;
  if (![principal, annualRatePercent, termYears].every(Number.isFinite)) return null;
  if (principal <= 0 || annualRatePercent < 0 || termYears <= 0) return null;
  if (!Number.isInteger(termYears)) return null;

  const paymentCount = termYears * 12;
  const monthlyPayment = calculateMonthlyPayment({
    principal,
    annualRatePercent,
    paymentCount,
  });
  if (monthlyPayment === null) return null;

  const totalOfPayments = monthlyPayment * paymentCount;
  const totalInterest = totalOfPayments - principal;
  if (![totalOfPayments, totalInterest].every(Number.isFinite)) return null;

  const chartTotal = principal + Math.max(0, totalInterest);
  const principalSharePercent =
    chartTotal > 0 ? (principal / chartTotal) * 100 : 100;
  const interestSharePercent =
    chartTotal > 0 ? (Math.max(0, totalInterest) / chartTotal) * 100 : 0;

  return {
    monthlyPayment,
    paymentCount,
    totalOfPayments,
    totalInterest,
    principalSharePercent,
    interestSharePercent,
  };
}

export const CLOSING_COSTS_UNAVAILABLE_REASON =
  'Include closing costs is shown in the reference, but no verified closing-cost amount, fee percentage, or financing rule exists in project/reference data. Results stay blocked while this option is checked.';
