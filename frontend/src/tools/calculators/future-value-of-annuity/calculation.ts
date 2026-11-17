import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  COMPOUNDING_FREQUENCY_OPTIONS,
  PAYMENT_FREQUENCY_OPTIONS,
  type AnnuityKind,
  type CompoundingFrequency,
  type PaymentFrequency,
  type TermUnit,
} from './types';

export function paymentsPerYear(frequency: PaymentFrequency): number {
  return (
    PAYMENT_FREQUENCY_OPTIONS.find((o) => o.value === frequency)?.periodsPerYear ?? 1
  );
}

export function compoundingPeriodsPerYear(
  frequency: CompoundingFrequency
): number | 'continuous' {
  if (frequency === 'continuous') return 'continuous';
  return (
    COMPOUNDING_FREQUENCY_OPTIONS.find((o) => o.value === frequency)?.periodsPerYear ?? 1
  );
}

export function formatFvaMoney(amount: number, currency: SupportedCurrency): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatFvaRate(percent: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(percent);
}

export function termToYears(length: number, unit: TermUnit): number | null {
  if (!(length > 0) || !Number.isFinite(length)) return null;
  return unit === 'yrs' ? length : length / 12;
}

export function yearsToPaymentCount(
  termYears: number,
  paymentFrequency: PaymentFrequency
): number | null {
  if (!(termYears > 0) || !Number.isFinite(termYears)) return null;
  const q = paymentsPerYear(paymentFrequency);
  const n = Math.round(termYears * q);
  return n > 0 ? n : null;
}

/**
 * Effective interest rate per payment period from nominal annual rate.
 * Discrete: i = (1 + r/m)^(m/q) − 1
 * Continuous: i = e^(r/q) − 1
 */
export function paymentPeriodRate(
  annualRatePercent: number,
  compoundingFrequency: CompoundingFrequency,
  paymentFrequency: PaymentFrequency
): number | null {
  if (!Number.isFinite(annualRatePercent) || annualRatePercent < 0) return null;
  const q = paymentsPerYear(paymentFrequency);
  if (!(q > 0)) return null;
  if (annualRatePercent === 0) return 0;

  const r = annualRatePercent / 100;
  if (compoundingFrequency === 'continuous') {
    const i = Math.exp(r / q) - 1;
    return Number.isFinite(i) ? i : null;
  }

  const m = compoundingPeriodsPerYear(compoundingFrequency);
  if (typeof m !== 'number' || !(m > 0)) return null;
  const base = 1 + r / m;
  if (!(base > 0)) return null;
  const i = Math.pow(base, m / q) - 1;
  return Number.isFinite(i) ? i : null;
}

/**
 * Ordinary growing / level annuity future value at full precision.
 * g and i are decimals per payment period.
 */
export function ordinaryFutureValue(args: {
  payment: number;
  periodicRate: number;
  growthRate: number;
  periods: number;
}): number | null {
  const { payment, periodicRate: i, growthRate: g, periods: n } = args;
  if (![payment, i, g, n].every(Number.isFinite)) return null;
  if (!(n > 0) || !Number.isInteger(n)) return null;

  let fv: number;
  if (i === 0 && g === 0) {
    fv = payment * n;
  } else if (i === 0) {
    // Accumulate growing payments with no interest.
    fv = payment * ((Math.pow(1 + g, n) - 1) / g);
  } else if (g === 0) {
    fv = payment * ((Math.pow(1 + i, n) - 1) / i);
  } else if (Math.abs(i - g) < 1e-15) {
    fv = payment * n * Math.pow(1 + i, n - 1);
  } else {
    fv = (payment / (i - g)) * (Math.pow(1 + i, n) - Math.pow(1 + g, n));
  }

  return Number.isFinite(fv) ? fv : null;
}

export function calculateFutureValueOfAnnuity(input: {
  paymentAmount: number;
  interestRatePercent: number;
  termLength: number;
  termUnit: TermUnit;
  compoundingFrequency: CompoundingFrequency;
  paymentFrequency: PaymentFrequency;
  annuityKind: AnnuityKind;
  growthRatePercent: number;
}): {
  futureValue: number;
  numberOfPeriods: number;
  periodicRatePercent: number;
  equivalentInterestRatePercent: number;
} | null {
  const {
    paymentAmount,
    interestRatePercent,
    termLength,
    termUnit,
    compoundingFrequency,
    paymentFrequency,
    annuityKind,
    growthRatePercent,
  } = input;

  if (![paymentAmount, interestRatePercent, termLength, growthRatePercent].every(Number.isFinite)) {
    return null;
  }
  if (interestRatePercent < 0) return null;

  const termYears = termToYears(termLength, termUnit);
  if (termYears === null) return null;

  const n = yearsToPaymentCount(termYears, paymentFrequency);
  if (n === null) return null;

  const i = paymentPeriodRate(
    interestRatePercent,
    compoundingFrequency,
    paymentFrequency
  );
  if (i === null) return null;

  const g = growthRatePercent / 100;
  if (!Number.isFinite(g)) return null;

  let fv = ordinaryFutureValue({
    payment: paymentAmount,
    periodicRate: i,
    growthRate: g,
    periods: n,
  });
  if (fv === null) return null;

  if (annuityKind === 'due' && i !== 0) {
    fv *= 1 + i;
  }
  if (!Number.isFinite(fv)) return null;

  const q = paymentsPerYear(paymentFrequency);
  const equivalentAnnual = Math.pow(1 + i, q) - 1;

  return {
    futureValue: fv,
    numberOfPeriods: n,
    periodicRatePercent: i * 100,
    equivalentInterestRatePercent: equivalentAnnual * 100,
  };
}
