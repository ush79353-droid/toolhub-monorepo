import { formatCurrencyValue } from '@/tools/shared/currency';
import type {
  CompoundFrequency,
  PaymentFrequency,
  StudentLoanPaymentParsed,
  StudentLoanPaymentResult,
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

/** Periodic rate from nominal or effective annual rate + compounding vs payment frequency. */
export function periodicRateFromKnownRate(input: {
  knownRate: 'nominal' | 'effective';
  interestRatePercent: number;
  compoundsPerYear: number;
  paymentsPerYear: number;
}): number {
  const { knownRate, interestRatePercent, compoundsPerYear, paymentsPerYear } = input;
  if (!(interestRatePercent > 0)) return 0;
  const m = compoundsPerYear;
  const p = paymentsPerYear;
  if (knownRate === 'nominal') {
    if (m === p) return interestRatePercent / 100 / p;
    const ear = Math.pow(1 + interestRatePercent / 100 / m, m) - 1;
    return Math.pow(1 + ear, 1 / p) - 1;
  }
  const ear = interestRatePercent / 100;
  return Math.pow(1 + ear, 1 / p) - 1;
}

export function amortizingPayment(
  principal: number,
  periodicRate: number,
  paymentCount: number
): number | null {
  if (!(principal > 0) || !(paymentCount > 0)) return null;
  if (periodicRate === 0) return principal / paymentCount;
  const denom = 1 - Math.pow(1 + periodicRate, -paymentCount);
  if (!(denom > 0)) return null;
  const payment = (principal * periodicRate) / denom;
  return Number.isFinite(payment) ? payment : null;
}

/**
 * Omni-style fee-inclusive APR:
 * netProceeds = (periodicPayment + prepaid/n) × annuity(r, n)
 * APR = r × paymentsPerYear; effective APR = (1+r)^p − 1
 */
export function solveFeeInclusiveApr(input: {
  netProceeds: number;
  periodicPayment: number;
  prepaidFee: number;
  paymentCount: number;
  paymentsPerYear: number;
}): { apr: number; effectiveApr: number } | null {
  const { netProceeds, periodicPayment, prepaidFee, paymentCount, paymentsPerYear } =
    input;
  if (!(netProceeds > 0) || !(paymentCount > 0) || !(paymentsPerYear > 0)) return null;
  const effectivePayment = periodicPayment + prepaidFee / paymentCount;
  if (!(effectivePayment > 0)) return null;

  const totalPaid = effectivePayment * paymentCount;
  if (totalPaid <= netProceeds) {
    return { apr: 0, effectiveApr: 0 };
  }

  const pv = (r: number): number => {
    if (Math.abs(r) < 1e-12) return effectivePayment * paymentCount;
    return (effectivePayment * (1 - Math.pow(1 + r, -paymentCount))) / r;
  };

  let low = 0;
  let high = 1;
  // Expand upper bound if needed
  for (let i = 0; i < 20 && pv(high) > netProceeds; i += 1) {
    high *= 2;
  }

  for (let i = 0; i < 100; i += 1) {
    const mid = (low + high) / 2;
    if (pv(mid) > netProceeds) low = mid;
    else high = mid;
  }

  const r = (low + high) / 2;
  if (!Number.isFinite(r) || r < 0) return null;

  const apr = r * paymentsPerYear * 100;
  const effectiveApr = (Math.pow(1 + r, paymentsPerYear) - 1) * 100;
  if (![apr, effectiveApr].every(Number.isFinite)) return null;
  return { apr, effectiveApr };
}

export function calculateStudentLoanPayment(
  input: StudentLoanPaymentParsed
): StudentLoanPaymentResult | null {
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
    originationFeePercent,
    originationFeeRepayment,
    currency,
  } = input;

  if (!(loanAmount > 0)) return null;
  if (interestRate < 0 || prepaidFee < 0 || loanedFee < 0 || originationFeePercent < 0) {
    return null;
  }

  const totalYears = termYears + termMonths / 12;
  const paymentsPerYear = paymentFrequencyToPerYear(paymentFrequency);
  const compoundsPerYear = compoundFrequencyToPerYear(compoundFrequency);
  const paymentCount = Math.round(totalYears * paymentsPerYear);
  if (!(paymentCount > 0)) return null;

  const r = periodicRateFromKnownRate({
    knownRate,
    interestRatePercent: interestRate,
    compoundsPerYear,
    paymentsPerYear,
  });

  const originationFeeAmount = loanAmount * (originationFeePercent / 100);
  const money = (v: number) => formatCurrencyValue(v, currency);
  const formattedOrig = money(originationFeeAmount);

  let financedPrincipal = loanAmount;
  let netLoanReceived = loanAmount;
  let upfrontCashOutflowByBorrower = 0;
  let calloutMessage = '';

  if (originationFeeRepayment === 'from_loan') {
    financedPrincipal = loanAmount + loanedFee;
    netLoanReceived = loanAmount - originationFeeAmount;
    upfrontCashOutflowByBorrower = prepaidFee;
    calloutMessage = `You receive a ${money(netLoanReceived)} loan after deducting the origination fee of ${formattedOrig}.`;
  } else if (originationFeeRepayment === 'rolling') {
    financedPrincipal = loanAmount + loanedFee + originationFeeAmount;
    netLoanReceived = loanAmount;
    upfrontCashOutflowByBorrower = prepaidFee;
    calloutMessage = `You receive a ${money(netLoanReceived)} loan with the origination fee of ${formattedOrig} rolled into the loan balance.`;
  } else {
    financedPrincipal = loanAmount + loanedFee;
    netLoanReceived = loanAmount;
    upfrontCashOutflowByBorrower = originationFeeAmount + prepaidFee;
    calloutMessage = `You receive a ${money(netLoanReceived)} loan and pay the origination fee of ${formattedOrig} out of pocket.`;
  }

  if (!(financedPrincipal > 0) || !(netLoanReceived >= 0)) return null;

  const periodicPayment = amortizingPayment(financedPrincipal, r, paymentCount);
  if (periodicPayment === null) return null;

  const paymentOnLoanedFees =
    loanedFee > 0 ? amortizingPayment(loanedFee, r, paymentCount) : 0;
  if (paymentOnLoanedFees === null) return null;

  const paymentOnLoanAmount =
    loanAmount > 0 ? amortizingPayment(loanAmount, r, paymentCount) : 0;
  if (paymentOnLoanAmount === null) return null;

  const totalScheduled = periodicPayment * paymentCount;
  const totalInterest = Math.max(0, totalScheduled - financedPrincipal);
  const interestOnLoanedFees = Math.max(
    0,
    paymentOnLoanedFees * paymentCount - loanedFee
  );
  const interestOnLoanAmount = Math.max(
    0,
    paymentOnLoanAmount * paymentCount - loanAmount
  );

  const totalPayment = totalScheduled + upfrontCashOutflowByBorrower;
  const totalFinanceCharge =
    totalInterest + originationFeeAmount + loanedFee + prepaidFee;
  const totalAdditionalFeesWithInterest =
    prepaidFee + loanedFee + originationFeeAmount + interestOnLoanedFees;

  const aprSolve = solveFeeInclusiveApr({
    netProceeds: netLoanReceived,
    periodicPayment,
    prepaidFee,
    paymentCount,
    paymentsPerYear,
  });
  if (!aprSolve) return null;

  const formattedNet = money(netLoanReceived);
  const formattedPayment = money(periodicPayment);
  const formattedFeePayment = money(paymentOnLoanedFees);
  const formattedInterest = money(totalInterest);
  const formattedInterestLoan = money(interestOnLoanAmount);
  const formattedInterestFee = money(interestOnLoanedFees);
  const formattedFeesWithInt = money(totalAdditionalFeesWithInterest);
  const formattedTotal = money(totalPayment);
  const formattedFinance = money(totalFinanceCharge);
  const formattedApr = `${aprSolve.apr.toFixed(2)}%`;
  const formattedEar = `${aprSolve.effectiveApr.toFixed(2)}%`;

  const summaryParagraphs = [
    calloutMessage,
    `Your periodic payment is ${formattedPayment}, and from this, ${formattedFeePayment} covers the additional fees rolled into the loan.`,
    `The total interest payment is ${formattedInterest}, and from this, ${formattedInterestLoan} charged on the loan amount and ${formattedInterestFee} is paid after the additional fees have been rolled into the loan.`,
    `The total additional fees with interest charged on them are ${formattedFeesWithInt}.`,
    `The total payment you need to make is ${formattedTotal}; thus, the total finance charge (total interest plus additional fees) is ${formattedFinance}.`,
    `The APR is ${formattedApr}, and the effective APR that accounts for the compounding frequency as well is ${formattedEar}.`,
  ];

  return {
    currency,
    netLoanReceived,
    originationFeeAmount,
    prepaidFeeAmount: prepaidFee,
    loanedFeeAmount: loanedFee,
    financedPrincipal,
    periodicPayment,
    paymentOnLoanedFees,
    paymentCount,
    totalInterest,
    interestOnLoanAmount,
    interestOnLoanedFees,
    totalAdditionalFeesWithInterest,
    totalPayment,
    totalFinanceCharge,
    apr: aprSolve.apr,
    effectiveApr: aprSolve.effectiveApr,
    calloutMessage,
    summaryParagraphs,
    formattedNetLoanReceived: formattedNet,
    formattedOriginationFee: formattedOrig,
    formattedPeriodicPayment: formattedPayment,
    formattedPaymentOnLoanedFees: formattedFeePayment,
    formattedTotalInterest: formattedInterest,
    formattedInterestOnLoanAmount: formattedInterestLoan,
    formattedInterestOnLoanedFees: formattedInterestFee,
    formattedTotalAdditionalFeesWithInterest: formattedFeesWithInt,
    formattedTotalPayment: formattedTotal,
    formattedTotalFinanceCharge: formattedFinance,
    formattedApr,
    formattedEffectiveApr: formattedEar,
  };
}
