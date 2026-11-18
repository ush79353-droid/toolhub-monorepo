import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function formatCommissionMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * Fixed-rate monthly amortizing payment.
 * M = P × r / (1 − (1+r)^(−n)); when r = 0, M = P / n.
 * Uses expm1/log1p for stability. Full precision — round only for display.
 */
export function amortizingMonthlyPayment(
  principal: number,
  annualRatePercent: number,
  numberOfPayments: number
): number | null {
  if (![principal, annualRatePercent, numberOfPayments].every(Number.isFinite)) {
    return null;
  }
  if (!(principal >= 0) || annualRatePercent < 0 || !(numberOfPayments > 0)) {
    return null;
  }
  if (principal === 0) return 0;

  const r = annualRatePercent / 100 / 12;
  if (r === 0) {
    const payment = principal / numberOfPayments;
    return Number.isFinite(payment) ? payment : null;
  }
  if (!(r > -1)) return null;

  const denom = -Math.expm1(-numberOfPayments * Math.log1p(r));
  if (!(denom > 0)) return null;
  const payment = (principal * r) / denom;
  return Number.isFinite(payment) ? payment : null;
}

/**
 * True cost of real estate commission (Omni-style):
 *
 * Loan amount = Property price − Down payment
 * Apparent commission = Property price × Buyer’s commission %
 * Commission amount = Property price × (Seller’s % + Buyer’s %)
 * Loan commission (“of which the commission is”) =
 *   Commission amount × Loan amount / Property price
 * Monthly payment = amortizing payment on loan amount
 * Monthly commission = amortizing payment on loan-commission principal
 * Total payments = Monthly payment × n
 * Real commission cost =
 *   (Commission amount − loan commission) + (monthly commission × n)
 *   = Commission amount + interest paid on the financed commission share
 */
export function calculateTrueCostOfRealEstateCommission(input: {
  propertyPrice: number;
  downPayment: number;
  sellerCommissionPercent: number;
  buyerCommissionPercent: number;
  termYears: number;
  termMonths: number;
  interestRatePercent: number;
}): {
  loanAmount: number;
  loanCommission: number;
  monthlyPayment: number;
  monthlyCommission: number;
  totalPayments: number;
  apparentCommission: number;
  commissionAmount: number;
  realCommissionCost: number;
  numberOfPayments: number;
} | null {
  const {
    propertyPrice: P,
    downPayment: D,
    sellerCommissionPercent: sellerPct,
    buyerCommissionPercent: buyerPct,
    termYears,
    termMonths,
    interestRatePercent,
  } = input;

  if (
    ![P, D, sellerPct, buyerPct, termYears, termMonths, interestRatePercent].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (!(P > 0)) return null;
  if (D < 0 || D >= P) return null;
  if (sellerPct < 0 || buyerPct < 0) return null;
  if (interestRatePercent < 0) return null;
  if (
    !Number.isInteger(termYears) ||
    !Number.isInteger(termMonths) ||
    termYears < 0 ||
    termMonths < 0 ||
    termMonths > 11
  ) {
    return null;
  }

  const n = termYears * 12 + termMonths;
  if (!(n > 0) || n > 1200) return null;

  const loanAmount = P - D;
  if (!(loanAmount > 0)) return null;

  const apparentCommission = P * (buyerPct / 100);
  const commissionAmount = P * ((sellerPct + buyerPct) / 100);
  if (![apparentCommission, commissionAmount].every(Number.isFinite)) {
    return null;
  }
  if (commissionAmount < 0) return null;

  const loanCommission = commissionAmount * (loanAmount / P);
  if (!Number.isFinite(loanCommission) || loanCommission < 0) return null;

  const monthlyPayment = amortizingMonthlyPayment(
    loanAmount,
    interestRatePercent,
    n
  );
  if (monthlyPayment === null) return null;

  const monthlyCommission = amortizingMonthlyPayment(
    loanCommission,
    interestRatePercent,
    n
  );
  if (monthlyCommission === null) return null;

  const totalPayments = monthlyPayment * n;
  const nonFinancedCommission = commissionAmount - loanCommission;
  const realCommissionCost = nonFinancedCommission + monthlyCommission * n;

  if (
    ![totalPayments, realCommissionCost].every(Number.isFinite) ||
    realCommissionCost < 0
  ) {
    return null;
  }

  return {
    loanAmount,
    loanCommission,
    monthlyPayment,
    monthlyCommission,
    totalPayments,
    apparentCommission,
    commissionAmount,
    realCommissionCost,
    numberOfPayments: n,
  };
}
