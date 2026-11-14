import { formatCurrencyValue } from '@/tools/shared/currency';
import type {
  BusinessLoanParsedValues,
  BusinessLoanResult,
  CompoundFrequency,
  PaymentFrequency,
} from './types';

export function compoundFrequencyToPerYear(f: CompoundFrequency): number {
  switch (f) {
    case 'annually':
      return 1;
    case 'semi-annually':
      return 2;
    case 'quarterly':
      return 4;
    case 'monthly':
      return 12;
    case 'bi-weekly':
      return 26;
    case 'weekly':
      return 52;
    case 'daily':
      return 365;
    default:
      return 12;
  }
}

export function paymentFrequencyToPerYear(f: PaymentFrequency): number {
  switch (f) {
    case 'annually':
      return 1;
    case 'semi-annually':
      return 2;
    case 'quarterly':
      return 4;
    case 'monthly':
      return 12;
    case 'bi-weekly':
      return 26;
    case 'weekly':
      return 52;
    default:
      return 12;
  }
}

/**
 * Solves for the periodic interest rate r_apr where
 * NetCashReceived = PeriodicPayment * (1 - (1 + r)^(-n)) / r
 */
export function solveApr(
  netCashReceived: number,
  periodicPayment: number,
  numberOfPayments: number,
  paymentsPerYear: number
): { apr: number; effectiveApr: number } {
  if (netCashReceived <= 0 || periodicPayment <= 0 || numberOfPayments <= 0) {
    return { apr: 0, effectiveApr: 0 };
  }

  // If total payments <= net cash received, rate is zero or negative
  const totalPaid = periodicPayment * numberOfPayments;
  if (totalPaid <= netCashReceived) {
    return { apr: 0, effectiveApr: 0 };
  }

  // Objective function f(r) = payment * (1 - (1+r)^(-n)) / r - netCashReceived
  const pvAnnuity = (r: number): number => {
    if (Math.abs(r) < 1e-12) return periodicPayment * numberOfPayments;
    return (periodicPayment * (1 - Math.pow(1 + r, -numberOfPayments))) / r;
  };

  const f = (r: number): number => pvAnnuity(r) - netCashReceived;

  const fPrime = (r: number): number => {
    if (Math.abs(r) < 1e-12) return 0;
    const term = Math.pow(1 + r, -numberOfPayments);
    const dNumerator = numberOfPayments * Math.pow(1 + r, -numberOfPayments - 1);
    return periodicPayment * ((dNumerator * r - (1 - term)) / (r * r));
  };

  // Initial estimate
  let r = (totalPaid - netCashReceived) / (netCashReceived * numberOfPayments);
  if (r <= 0 || !Number.isFinite(r)) r = 0.05 / paymentsPerYear;

  // Newton-Raphson iteration
  let converged = false;
  for (let i = 0; i < 60; i++) {
    const val = f(r);
    const deriv = fPrime(r);
    if (Math.abs(val) < 1e-9) {
      converged = true;
      break;
    }
    if (deriv === 0 || !Number.isFinite(deriv)) break;

    const nextR = r - val / deriv;
    if (nextR <= -0.999 || !Number.isFinite(nextR)) break;
    if (Math.abs(nextR - r) < 1e-9) {
      r = nextR;
      converged = true;
      break;
    }
    r = nextR;
  }

  // Fallback to bisection if Newton-Raphson did not converge
  if (!converged || r <= 0 || !Number.isFinite(r)) {
    let low = 0;
    let high = 5.0; // 500% periodic rate upper bound
    for (let i = 0; i < 80; i++) {
      const mid = (low + high) / 2;
      const val = f(mid);
      if (Math.abs(val) < 1e-9 || (high - low) < 1e-9) {
        r = mid;
        break;
      }
      if (val > 0) {
        low = mid;
      } else {
        high = mid;
      }
    }
  }

  const nominalApr = r * paymentsPerYear * 100;
  const effectiveApr = (Math.pow(1 + r, paymentsPerYear) - 1) * 100;

  return {
    apr: Number.isFinite(nominalApr) ? Math.max(0, nominalApr) : 0,
    effectiveApr: Number.isFinite(effectiveApr) ? Math.max(0, effectiveApr) : 0,
  };
}

export function calculateBusinessLoan(input: BusinessLoanParsedValues): BusinessLoanResult | null {
  const {
    knownRate,
    interestRate,
    compoundFrequency,
    loanAmount,
    termYears,
    termMonths,
    paymentFrequency,
    prepaidFee,
    loanedFee,
    originationFee,
    originationFeeRepayment,
    currency,
  } = input;

  if (loanAmount <= 0) return null;

  const totalYears = termYears + termMonths / 12;
  const p = paymentFrequencyToPerYear(paymentFrequency);
  const m = compoundFrequencyToPerYear(compoundFrequency);

  const totalPaymentsCount = Math.round(totalYears * p);
  if (totalPaymentsCount <= 0) return null;

  // Calculate effective periodic interest rate r
  let r = 0;
  if (interestRate > 0) {
    if (knownRate === 'nominal') {
      if (m === p) {
        r = (interestRate / 100) / p;
      } else {
        const ear = Math.pow(1 + (interestRate / 100) / m, m) - 1;
        r = Math.pow(1 + ear, 1 / p) - 1;
      }
    } else {
      // Effective annual rate
      const ear = interestRate / 100;
      r = Math.pow(1 + ear, 1 / p) - 1;
    }
  }

  // Fees calculation
  const originationFeeAmount = loanAmount * (originationFee / 100);
  const loanedFeeAmount = loanedFee;
  const prepaidFeeAmount = prepaidFee;

  let financedPrincipal = loanAmount;
  let netLoanReceived = loanAmount;
  let upfrontCashOutflowByBorrower = 0;
  let calloutMessage = '';

  const formattedOrig = formatCurrencyValue(originationFeeAmount, currency);

  if (originationFeeRepayment === 'from_loan') {
    financedPrincipal = loanAmount + loanedFeeAmount;
    netLoanReceived = loanAmount - originationFeeAmount;
    upfrontCashOutflowByBorrower = prepaidFeeAmount;
    const formattedNet = formatCurrencyValue(netLoanReceived, currency);
    calloutMessage = `You receive a ${formattedNet} loan after deducting the origination fee of ${formattedOrig}.`;
  } else if (originationFeeRepayment === 'rolling') {
    financedPrincipal = loanAmount + loanedFeeAmount + originationFeeAmount;
    netLoanReceived = loanAmount;
    upfrontCashOutflowByBorrower = prepaidFeeAmount;
    const formattedNet = formatCurrencyValue(netLoanReceived, currency);
    calloutMessage = `You receive a ${formattedNet} loan with the origination fee of ${formattedOrig} rolled into the loan balance.`;
  } else {
    // 'out_of_pocket'
    financedPrincipal = loanAmount + loanedFeeAmount;
    netLoanReceived = loanAmount;
    upfrontCashOutflowByBorrower = originationFeeAmount + prepaidFeeAmount;
    const formattedNet = formatCurrencyValue(netLoanReceived, currency);
    calloutMessage = `You receive a ${formattedNet} loan and pay the origination fee of ${formattedOrig} out of pocket.`;
  }

  // Periodic payment calculation
  let periodicPayment = 0;
  if (r === 0) {
    periodicPayment = financedPrincipal / totalPaymentsCount;
  } else {
    periodicPayment = (financedPrincipal * r) / (1 - Math.pow(1 + r, -totalPaymentsCount));
  }

  const totalScheduledPayments = periodicPayment * totalPaymentsCount;
  const totalInterest = Math.max(0, totalScheduledPayments - financedPrincipal);

  // Total payment includes periodic payments plus any upfront fees paid by the borrower
  const totalPayment = totalScheduledPayments + upfrontCashOutflowByBorrower;

  // Total finance charge is total interest plus all fees
  const totalFinanceCharge =
    totalInterest + originationFeeAmount + loanedFeeAmount + prepaidFeeAmount;

  // APR calculation:
  // Net cash inflow to borrower at t = 0
  const netCashReceivedForApr = netLoanReceived - prepaidFeeAmount;
  const { apr, effectiveApr } = solveApr(
    netCashReceivedForApr,
    periodicPayment,
    totalPaymentsCount,
    p
  );

  return {
    netLoanReceived,
    periodicPayment,
    totalInterest,
    totalPayment,
    totalFinanceCharge,
    apr,
    effectiveApr,
    totalPaymentsCount,
    financedPrincipal,
    originationFeeAmount,
    prepaidFeeAmount,
    loanedFeeAmount,
    calloutMessage,
    currency,
  };
}
