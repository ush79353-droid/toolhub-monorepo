import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  CapitalizationFrequency,
  InterestRateResult,
  PaymentFrequency,
} from './types';
import { CAPITALIZATION_OPTIONS, PAYMENT_FREQUENCY_OPTIONS } from './types';

const MAX_ITERATIONS = 5000;
const MIN_PRECISION = 1e-10;

function round(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function formatPercent(value: number, digits = 4): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function formatMoney(amount: number, currency: SupportedCurrency): string {
  // Finance outputs keep two decimals even when ISO digits are 0 (e.g. PKR).
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function getCapitalizationPeriodsPerYear(
  frequency: CapitalizationFrequency
): number {
  return (
    CAPITALIZATION_OPTIONS.find((option) => option.value === frequency)
      ?.periodsPerYear ?? 12
  );
}

export function getPaymentPeriodsPerYear(frequency: PaymentFrequency): number {
  return (
    PAYMENT_FREQUENCY_OPTIONS.find((option) => option.value === frequency)
      ?.periodsPerYear ?? 12
  );
}

function presentValueAnnuity(payment: number, rate: number, periods: number): number {
  if (!(periods > 0) || !Number.isFinite(payment) || !Number.isFinite(rate)) {
    return NaN;
  }
  if (Math.abs(rate) < 1e-15) return payment * periods;
  return (payment * (1 - (1 + rate) ** -periods)) / rate;
}

function paymentFromPrincipal(
  principal: number,
  rate: number,
  periods: number
): number {
  if (!(principal > 0) || !(periods > 0) || !Number.isFinite(rate)) return NaN;
  if (Math.abs(rate) < 1e-15) return principal / periods;
  return (principal * rate * (1 + rate) ** periods) / ((1 + rate) ** periods - 1);
}

/** Solve payment-period rate r where PV = Payment × [1 − (1+r)^(-n)] / r */
function solvePaymentPeriodRate(
  principal: number,
  payment: number,
  periods: number
): number | null {
  if (!(principal > 0) || !(payment > 0) || !(periods > 0)) return null;
  if (payment * periods <= principal) return null;

  let rate = payment / principal;
  for (let i = 0; i < MAX_ITERATIONS; i += 1) {
    const pv = presentValueAnnuity(payment, rate, periods);
    if (!Number.isFinite(pv)) return null;
    const f = pv - principal;
    if (Math.abs(f) < 1e-9) return rate;

    let derivative: number;
    if (Math.abs(rate) < 1e-15) {
      derivative = (-payment * periods * (periods + 1)) / 2;
    } else {
      const growth = (1 + rate) ** -periods;
      derivative =
        (payment *
          (periods * growth * rate - (1 - growth) * (1 + rate))) /
        (rate * rate * (1 + rate));
    }
    if (!Number.isFinite(derivative) || Math.abs(derivative) < 1e-18) break;
    const next = rate - f / derivative;
    if (!Number.isFinite(next) || next <= -0.999999) break;
    if (Math.abs(next - rate) < MIN_PRECISION) return next;
    rate = next;
  }

  // Bisection fallback
  let low = 0;
  let high = 5;
  for (let i = 0; i < 120; i += 1) {
    const mid = (low + high) / 2;
    const pv = presentValueAnnuity(payment, mid, periods);
    if (!Number.isFinite(pv)) return null;
    if (Math.abs(pv - principal) < 1e-9) return mid;
    if (pv > principal) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}

function solveLoanNominalAndEar(
  termYears: number,
  capitalizationPerYear: number,
  paymentPerYear: number,
  payment: number,
  loanAmount: number
): { nominal: number; ear: number; paymentPeriodRate: number } | null {
  const periods = paymentPerYear * termYears;
  if (!(periods > 0) || !Number.isFinite(periods)) return null;

  const eqP = solvePaymentPeriodRate(loanAmount, payment, periods);
  if (eqP === null || !Number.isFinite(eqP) || eqP < 0) return null;

  const eq = eqP * paymentPerYear;
  const m = capitalizationPerYear;
  const q = paymentPerYear;

  let nominal: number;
  let ear: number;
  if (m === 0) {
    // Continuous: solve r from q*(e^(r/q)-1) = eq, then EAR = e^r - 1
    let rCont = eqP;
    for (let i = 0; i < MAX_ITERATIONS; i += 1) {
      const f = q * (Math.exp(rCont / q) - 1) - eq;
      const d = Math.exp(rCont / q);
      if (!Number.isFinite(f) || !Number.isFinite(d) || Math.abs(d) < 1e-18) break;
      const next = rCont - f / d;
      if (!Number.isFinite(next)) break;
      if (Math.abs(next - rCont) < MIN_PRECISION) {
        rCont = next;
        break;
      }
      rCont = next;
    }
    nominal = rCont;
    ear = Math.exp(nominal) - 1;
  } else {
    nominal = m * ((1 + eq / q) ** (q / m) - 1);
    ear = (1 + nominal / m) ** m - 1;
  }

  if (!Number.isFinite(nominal) || !Number.isFinite(ear) || ear <= -1) return null;
  return { nominal, ear, paymentPeriodRate: eqP };
}

function solveAprPercent(
  loanAmount: number,
  adjustedPayment: number,
  prepaidFees: number,
  periods: number,
  paymentPerYear: number,
  seedRate: number
): number | null {
  // Equivalent Omni model: LoanAmount = (Payment_fee + prepaid/n) × annuity(r, n)
  const effectivePayment = adjustedPayment + prepaidFees / periods;
  if (!(effectivePayment > 0)) return null;

  const aprPeriod = solvePaymentPeriodRate(loanAmount, effectivePayment, periods);
  if (aprPeriod === null || !Number.isFinite(aprPeriod) || aprPeriod < 0) {
    // Fallback seeded Newton (Omni form) if annuity solve fails
    let rate = Math.max(seedRate, 1e-8);
    for (let i = 0; i < MAX_ITERATIONS; i += 1) {
      const growth = (1 + rate) ** -periods;
      const dividend =
        adjustedPayment * periods +
        prepaidFees -
        adjustedPayment * periods * growth -
        prepaidFees * growth -
        rate * loanAmount * periods;
      const divisor =
        adjustedPayment * periods * periods * (1 + rate) ** (-periods - 1) +
        prepaidFees * periods * (1 + rate) ** (-periods - 1) -
        periods * loanAmount;
      if (!Number.isFinite(dividend) || !Number.isFinite(divisor) || Math.abs(divisor) < 1e-18) {
        break;
      }
      const next = rate - dividend / divisor;
      if (!Number.isFinite(next) || next <= -0.999999) break;
      if (Math.abs(next - rate) < MIN_PRECISION) {
        rate = next;
        break;
      }
      rate = next;
    }
    if (!Number.isFinite(rate) || rate < 0) return null;
    return rate * paymentPerYear * 100;
  }

  return aprPeriod * paymentPerYear * 100;
}

export function calculateLoanInterestRate(input: {
  loanAmount: number;
  termYears: number;
  termMonths: number;
  capitalizationFrequency: CapitalizationFrequency;
  paymentFrequency: PaymentFrequency;
  periodicPayment: number;
  prepaidFees: number;
  loanedFees: number;
  currency: SupportedCurrency;
}): InterestRateResult | null {
  const {
    loanAmount,
    termYears,
    termMonths,
    capitalizationFrequency,
    paymentFrequency,
    periodicPayment,
    prepaidFees,
    loanedFees,
    currency,
  } = input;

  if (
    ![loanAmount, termYears, termMonths, periodicPayment, prepaidFees, loanedFees].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (!(loanAmount > 0) || !(periodicPayment > 0)) return null;
  if (termYears < 0 || termMonths < 0) return null;
  if (prepaidFees < 0 || loanedFees < 0) return null;

  const t = termYears + termMonths / 12;
  if (!(t > 0)) return null;

  const m = getCapitalizationPeriodsPerYear(capitalizationFrequency);
  const q = getPaymentPeriodsPerYear(paymentFrequency);
  const periods = q * t;
  if (!(periods > 0) || !Number.isFinite(periods)) return null;

  const rates = solveLoanNominalAndEar(t, m, q, periodicPayment, loanAmount);
  if (!rates) return null;

  const { nominal, ear, paymentPeriodRate } = rates;
  const periodicDisplay =
    m === 0 ? null : (ear / m) * 100;

  const financed = loanAmount + loanedFees;
  const earPeriodic = ear / q;
  const adjustedPeriodicPayment = paymentFromPrincipal(financed, earPeriodic, periods);
  if (!Number.isFinite(adjustedPeriodicPayment) || !(adjustedPeriodicPayment > 0)) {
    return null;
  }

  const aprPercent = solveAprPercent(
    loanAmount,
    adjustedPeriodicPayment,
    prepaidFees,
    periods,
    q,
    paymentPeriodRate
  );
  if (aprPercent === null || !Number.isFinite(aprPercent)) return null;

  const additionalFees = prepaidFees + loanedFees;
  const totalInterest = periodicPayment * periods - loanAmount;
  const totalPayments = periodicPayment * periods + additionalFees;

  if (![totalInterest, totalPayments, aprPercent, nominal, ear].every(Number.isFinite)) {
    return null;
  }

  return {
    mode: 'loan',
    currency,
    annualNominalPercent: round(nominal * 100, 4),
    periodicRatePercent: periodicDisplay === null ? null : round(periodicDisplay, 4),
    earPercent: round(ear * 100, 4),
    aprPercent: round(aprPercent, 4),
    totalPayments: round(totalPayments, 2),
    totalInterest: round(totalInterest, 2),
    additionalFees: round(additionalFees, 2),
    adjustedPeriodicPayment: round(adjustedPeriodicPayment, 2),
    formattedAnnualNominal: formatPercent(round(nominal * 100, 4)),
    formattedPeriodicRate:
      periodicDisplay === null ? null : formatPercent(round(periodicDisplay, 4)),
    formattedEar: formatPercent(round(ear * 100, 4)),
    formattedApr: formatPercent(round(aprPercent, 4)),
    formattedTotalPayments: formatMoney(round(totalPayments, 2), currency),
    formattedTotalInterest: formatMoney(round(totalInterest, 2), currency),
    formattedAdditionalFees: formatMoney(round(additionalFees, 2), currency),
    formattedAdjustedPayment: formatMoney(round(adjustedPeriodicPayment, 2), currency),
  };
}

export function calculateDepositInterestRate(input: {
  initialDeposit: number;
  currentBalance: number;
  termYears: number;
  termMonths: number;
  capitalizationFrequency: CapitalizationFrequency;
  currency: SupportedCurrency;
}): InterestRateResult | null {
  const {
    initialDeposit,
    currentBalance,
    termYears,
    termMonths,
    capitalizationFrequency,
    currency,
  } = input;

  if (![initialDeposit, currentBalance, termYears, termMonths].every(Number.isFinite)) {
    return null;
  }
  if (!(initialDeposit > 0) || !(currentBalance > 0)) return null;
  if (!(currentBalance > initialDeposit)) return null;
  if (termYears < 0 || termMonths < 0) return null;

  const t = termYears + termMonths / 12;
  if (!(t > 0)) return null;

  const m = getCapitalizationPeriodsPerYear(capitalizationFrequency);

  let nominal: number;
  let ear: number;

  if (m === 0) {
    // Continuous: Final = Initial × e^(r t) → r = ln(Final/Initial)/t
    nominal = Math.log(currentBalance / initialDeposit) / t;
    ear = Math.exp(nominal) - 1;
  } else {
    // Final = Initial × (1 + r/m)^(m t) → r = m × ((Final/Initial)^(1/(m t)) − 1)
    const periods = m * t;
    if (!(periods > 0)) return null;
    nominal = m * ((currentBalance / initialDeposit) ** (1 / periods) - 1);
    ear = (1 + nominal / m) ** m - 1;
  }

  if (!Number.isFinite(nominal) || !Number.isFinite(ear) || ear <= -1) return null;
  if (nominal <= -1 && m !== 0) return null;

  const periodicRatePercent = m === 0 ? null : round((nominal / m) * 100, 4);

  return {
    mode: 'deposit',
    currency,
    annualNominalPercent: round(nominal * 100, 4),
    periodicRatePercent,
    earPercent: round(ear * 100, 4),
    aprPercent: null,
    totalPayments: null,
    totalInterest: null,
    additionalFees: null,
    adjustedPeriodicPayment: null,
    formattedAnnualNominal: formatPercent(round(nominal * 100, 4)),
    formattedPeriodicRate:
      periodicRatePercent === null ? null : formatPercent(periodicRatePercent),
    formattedEar: formatPercent(round(ear * 100, 4)),
    formattedApr: null,
    formattedTotalPayments: null,
    formattedTotalInterest: null,
    formattedAdditionalFees: null,
    formattedAdjustedPayment: null,
  };
}
