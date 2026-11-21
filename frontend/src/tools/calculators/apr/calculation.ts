import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  AprScheduleRow,
  FeeTreatment,
  PaymentFrequency,
} from './types';

export const PAYMENTS_PER_YEAR: Record<PaymentFrequency, number> = {
  monthly: 12,
  quarterly: 4,
  semiannual: 2,
  annual: 1,
};

const SOLVER_ITERS = 100;
const RATE_TOL = 1e-12;
const PV_TOL = 1e-8;

/** Periodic amortizing payment. Zero rate → P/n. */
export function calculatePeriodicPayment(
  principal: number,
  periodicRate: number,
  periods: number
): number | null {
  if (
    !Number.isFinite(principal) ||
    principal < 0 ||
    !Number.isFinite(periodicRate) ||
    periodicRate < 0 ||
    !Number.isFinite(periods) ||
    periods <= 0 ||
    !Number.isInteger(periods)
  ) {
    return null;
  }
  if (principal === 0) return 0;
  if (periodicRate === 0) {
    const pmt = principal / periods;
    return Number.isFinite(pmt) ? pmt : null;
  }
  const growth = (1 + periodicRate) ** periods;
  const denom = growth - 1;
  if (!(denom > 0) || !Number.isFinite(growth)) return null;
  const pmt = (principal * periodicRate * growth) / denom;
  return Number.isFinite(pmt) ? pmt : null;
}

/** Present value of n equal payments at periodic rate r. */
export function annuityPresentValue(
  payment: number,
  periodicRate: number,
  periods: number
): number | null {
  if (
    !Number.isFinite(payment) ||
    payment < 0 ||
    !Number.isFinite(periodicRate) ||
    periodicRate < -0.999999 ||
    !Number.isFinite(periods) ||
    periods <= 0
  ) {
    return null;
  }
  if (Math.abs(periodicRate) < RATE_TOL) {
    const pv = payment * periods;
    return Number.isFinite(pv) ? pv : null;
  }
  const factor = (1 - (1 + periodicRate) ** -periods) / periodicRate;
  const pv = payment * factor;
  return Number.isFinite(pv) ? pv : null;
}

/**
 * Solve periodic rate r such that PV(payments) = netProceeds.
 * Bisection on [lo, hi]. Returns null if no convergent solution.
 */
export function solvePeriodicAprRate(
  netProceeds: number,
  payment: number,
  periods: number
): number | null {
  if (
    !Number.isFinite(netProceeds) ||
    netProceeds <= 0 ||
    !Number.isFinite(payment) ||
    payment <= 0 ||
    !Number.isFinite(periods) ||
    periods <= 0 ||
    !Number.isInteger(periods)
  ) {
    return null;
  }

  // Zero-rate check: if payment * n ≈ proceeds, rate is 0
  const zeroPv = payment * periods;
  if (Math.abs(zeroPv - netProceeds) < Math.max(PV_TOL, netProceeds * 1e-10)) {
    return 0;
  }

  // If proceeds > total payments, rate would be negative — allow mild negative
  // only when mathematically sensible; otherwise fail for invalid cash flows.
  const residual = (r: number): number | null => {
    const pv = annuityPresentValue(payment, r, periods);
    if (pv === null) return null;
    return pv - netProceeds;
  };

  let lo = -0.5;
  let hi = 5; // 500% per period upper bound (absurd but safe)

  let fLo = residual(lo);
  let fHi = residual(hi);
  if (fLo === null || fHi === null) return null;

  // Expand hi if needed while residual at hi still same sign as fLo
  let guard = 0;
  while (fLo * fHi > 0 && hi < 100 && guard < 20) {
    hi *= 2;
    fHi = residual(hi);
    if (fHi === null) return null;
    guard += 1;
  }
  if (fLo * fHi > 0) return null;

  for (let i = 0; i < SOLVER_ITERS; i += 1) {
    const mid = (lo + hi) / 2;
    const fm = residual(mid);
    if (fm === null) return null;
    if (Math.abs(fm) < PV_TOL || Math.abs(hi - lo) < RATE_TOL) {
      return Number.isFinite(mid) ? mid : null;
    }
    if (fLo * fm <= 0) {
      hi = mid;
      fHi = fm;
    } else {
      lo = mid;
      fLo = fm;
    }
  }
  const mid = (lo + hi) / 2;
  const check = residual(mid);
  if (check === null || Math.abs(check) > Math.max(1e-4, netProceeds * 1e-6)) {
    return null;
  }
  return Number.isFinite(mid) ? mid : null;
}

export function annualizePeriodicRate(
  periodicRate: number,
  paymentsPerYear: number
): number | null {
  if (
    !Number.isFinite(periodicRate) ||
    !Number.isFinite(paymentsPerYear) ||
    paymentsPerYear <= 0
  ) {
    return null;
  }
  const apr = periodicRate * paymentsPerYear * 100;
  return Number.isFinite(apr) ? apr : null;
}

export function calculateEffectiveAnnualRate(
  periodicRate: number,
  paymentsPerYear: number
): number | null {
  if (
    !Number.isFinite(periodicRate) ||
    !Number.isFinite(paymentsPerYear) ||
    paymentsPerYear <= 0
  ) {
    return null;
  }
  if (Math.abs(periodicRate) < RATE_TOL) return 0;
  const ear = ((1 + periodicRate) ** paymentsPerYear - 1) * 100;
  return Number.isFinite(ear) ? ear : null;
}

export function resolveOriginationFeeAmount(
  loanAmount: number,
  feeValue: number,
  feeType: 'fixed' | 'percentage'
): number | null {
  if (
    !Number.isFinite(loanAmount) ||
    loanAmount <= 0 ||
    !Number.isFinite(feeValue) ||
    feeValue < 0
  ) {
    return null;
  }
  if (feeType === 'fixed') return feeValue;
  if (feeValue > 100) return null;
  return (loanAmount * feeValue) / 100;
}

export function resolveCashFlows(
  loanAmount: number,
  totalFees: number,
  feeTreatment: FeeTreatment
): { amortizingPrincipal: number; netProceeds: number } | null {
  if (
    !Number.isFinite(loanAmount) ||
    loanAmount <= 0 ||
    !Number.isFinite(totalFees) ||
    totalFees < 0
  ) {
    return null;
  }
  if (feeTreatment === 'financed') {
    return {
      amortizingPrincipal: loanAmount + totalFees,
      netProceeds: loanAmount,
    };
  }
  // deducted or paid-upfront: payments on face amount; net cash = loan − fees
  const netProceeds = loanAmount - totalFees;
  if (!(netProceeds > 0)) return null;
  return {
    amortizingPrincipal: loanAmount,
    netProceeds,
  };
}

export function resolvePaymentCount(
  termValue: number,
  termUnit: 'years' | 'months',
  frequency: PaymentFrequency
): number | null {
  if (!Number.isFinite(termValue) || !(termValue > 0)) return null;
  const m = PAYMENTS_PER_YEAR[frequency];
  const termYears = termUnit === 'years' ? termValue : termValue / 12;
  const n = termYears * m;
  // Exact integer periods only — no silent rounding
  if (!Number.isFinite(n) || Math.abs(n - Math.round(n)) > 1e-9) {
    return null;
  }
  const periods = Math.round(n);
  return periods > 0 ? periods : null;
}

export function buildAmortizationSchedule(
  principal: number,
  periodicRate: number,
  payment: number,
  periods: number
): AprScheduleRow[] {
  const rows: AprScheduleRow[] = [];
  if (
    !Number.isFinite(principal) ||
    principal < 0 ||
    !Number.isFinite(periodicRate) ||
    periodicRate < 0 ||
    !Number.isFinite(payment) ||
    payment < 0 ||
    !Number.isFinite(periods) ||
    periods <= 0
  ) {
    return rows;
  }

  let balance = principal;
  for (let k = 1; k <= periods; k += 1) {
    const interest = balance * periodicRate;
    let principalPaid = payment - interest;
    let actualPayment = payment;
    if (k === periods) {
      // Final payment clears remaining balance
      principalPaid = balance;
      actualPayment = balance + interest;
    }
    balance = Math.max(0, balance - principalPaid);
    rows.push({
      period: k,
      payment: actualPayment,
      interest,
      principal: principalPaid,
      balance,
    });
  }
  return rows;
}

export function formatAprMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatAprPercent(value: number, digits = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function interpretApr(
  apr: number | null,
  nominalRate: number | null,
  status: string
): string {
  if (status === 'solverFailed') {
    return 'A valid APR could not be solved for these cash flows. Check fees, proceeds, and payment inputs.';
  }
  if (apr === null) {
    return 'Enter loan amount, interest rate, term, and fees to estimate APR from borrower cash flows.';
  }
  const parts: string[] = [
    `Estimated APR is ${formatAprPercent(apr)}% using equal periodic payments and the selected fee treatment.`,
  ];
  if (nominalRate !== null) {
    if (Math.abs(apr - nominalRate) < 0.05) {
      parts.push(
        'With little or no financing fees, APR closely matches the nominal annual interest rate under this payment-frequency convention.'
      );
    } else if (apr > nominalRate) {
      parts.push(
        `APR exceeds the ${formatAprPercent(nominalRate)}% nominal rate because financing fees reduce net proceeds or increase the amortizing balance relative to cash received.`
      );
    }
  }
  parts.push(
    'This is an estimated cash-flow APR for comparison; not a certified Truth-in-Lending disclosure.'
  );
  return parts.join(' ');
}
