import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  COMPOUNDING_OPTIONS,
  type CompoundingFrequency,
  type LoanColumn,
  type TermUnit,
} from './types';

export function formatMortgageRefinanceMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(0, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatRatePercent(rate: number): string {
  if (!Number.isFinite(rate)) return '—';
  const rounded = Math.round(rate * 10000) / 10000;
  return `${rounded}%`;
}

/** Whole years as "25 yrs"; otherwise one decimal, e.g. 298 months → "24.8 yrs". */
export function formatTermYears(months: number): string {
  if (!Number.isFinite(months) || months <= 0) return '—';
  if (months % 12 === 0) {
    const years = months / 12;
    return `${years} yr${years === 1 ? '' : 's'}`;
  }
  const rounded = Math.round((months / 12) * 10) / 10;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `${text} yrs`;
}

export function termToWholeMonths(term: number, unit: TermUnit): number | null {
  if (!Number.isFinite(term) || term <= 0) return null;
  const months = unit === 'yrs' ? term * 12 : term;
  const whole = Math.round(months);
  return whole > 0 ? whole : null;
}

export interface CivilDate {
  y: number;
  m: number;
  d: number;
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseIsoDate(value: string): CivilDate | null {
  const match = ISO_DATE.exec(value.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const utc = new Date(Date.UTC(y, m - 1, d));
  if (
    utc.getUTCFullYear() !== y ||
    utc.getUTCMonth() !== m - 1 ||
    utc.getUTCDate() !== d
  ) {
    return null;
  }
  return { y, m, d };
}

/**
 * Whole months from the current due date to the new due date.
 * Day-of-month before the original day does not count as a completed payment month.
 * Negative when the new date is earlier.
 */
export function elapsedWholeMonths(startIso: string, endIso: string): number | null {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  if (!start || !end) return null;
  let months = (end.y - start.y) * 12 + (end.m - start.m);
  if (end.d < start.d) months -= 1;
  return months;
}

export function addCalendarMonths(iso: string, months: number): string | null {
  const start = parseIsoDate(iso);
  if (!start || !Number.isInteger(months)) return null;
  const index = start.m - 1 + months;
  const y = start.y + Math.floor(index / 12);
  const m = ((index % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const d = Math.min(start.d, lastDay);
  const mm = String(m + 1).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${y}-${mm}-${dd}`;
}

export function formatBreakEvenDate(iso: string): string | null {
  const date = parseIsoDate(iso);
  if (!date) return null;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(date.y, date.m - 1, date.d)));
}

/**
 * Nominal annual percent → effective monthly rate for a compounding frequency.
 * Monthly (12/yr): r/12. Continuous: e^(r/12) − 1. Otherwise (1 + r/n)^(n/12) − 1.
 */
export function effectiveMonthlyRate(
  annualRatePercent: number,
  compounding: CompoundingFrequency
): number | null {
  if (!Number.isFinite(annualRatePercent) || annualRatePercent < 0) return null;
  if (annualRatePercent === 0) return 0;
  const option = COMPOUNDING_OPTIONS.find((row) => row.value === compounding);
  if (!option) return null;
  const nominal = annualRatePercent / 100;
  if (option.periodsPerYear === null) {
    const rate = Math.exp(nominal / 12) - 1;
    return Number.isFinite(rate) ? rate : null;
  }
  const n = option.periodsPerYear;
  const rate = Math.pow(1 + nominal / n, n / 12) - 1;
  return Number.isFinite(rate) && rate >= 0 ? rate : null;
}

/** Payment = P × r / [1 − (1+r)^(−n)]; when r = 0, Payment = P / n. */
export function amortizingPayment(
  principal: number,
  monthlyRate: number,
  months: number
): number | null {
  if (![principal, monthlyRate, months].every(Number.isFinite)) return null;
  if (principal < 0 || monthlyRate < 0 || months <= 0) return null;
  if (principal === 0) return 0;
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, -months);
  if (!Number.isFinite(factor)) return null;
  const denom = 1 - factor;
  if (!(denom > 0)) return null;
  const payment = (principal * monthlyRate) / denom;
  return Number.isFinite(payment) ? payment : null;
}

/** Balance after `paymentsMade` installments of the original schedule. */
export function remainingBalance(input: {
  principal: number;
  monthlyRate: number;
  totalMonths: number;
  paymentsMade: number;
}): number | null {
  const { principal, monthlyRate, totalMonths, paymentsMade } = input;
  if (![principal, monthlyRate, totalMonths, paymentsMade].every(Number.isFinite)) {
    return null;
  }
  if (paymentsMade < 0 || paymentsMade > totalMonths) return null;
  const payment = amortizingPayment(principal, monthlyRate, totalMonths);
  if (payment === null) return null;
  if (monthlyRate === 0) {
    const balance = principal - payment * paymentsMade;
    return Number.isFinite(balance) ? balance : null;
  }
  const growth = Math.pow(1 + monthlyRate, paymentsMade);
  if (!Number.isFinite(growth)) return null;
  const balance = principal * growth - (payment * (growth - 1)) / monthlyRate;
  if (!Number.isFinite(balance)) return null;
  return balance < 0 && balance > -1e-6 ? 0 : balance;
}

/**
 * Months until cumulative monthly payment savings cover upfront cost.
 * 0 when upfront cost is already zero or negative. Null when savings never catch up.
 */
export function breakEvenMonthCount(
  upfrontCost: number,
  monthlySavings: number
): number | null {
  if (!Number.isFinite(upfrontCost) || !Number.isFinite(monthlySavings)) return null;
  if (upfrontCost <= 0) return 0;
  if (!(monthlySavings > 0)) return null;
  const raw = upfrontCost / monthlySavings;
  if (!Number.isFinite(raw)) return null;
  const months = Math.ceil(raw - 1e-9);
  return months > 0 ? months : 0;
}

export interface MortgageRefinanceComputation {
  current: LoanColumn;
  neu: LoanColumn;
  elapsedMonths: number;
  pointsCost: number;
  closingCosts: number;
  refinancingCost: number;
  monthlySavings: number;
  breakEvenMonths: number | null;
}

export function calculateMortgageRefinance(input: {
  originalPrincipal: number;
  originalTermMonths: number;
  elapsedMonths: number;
  currentAnnualRatePercent: number;
  currentCompounding: CompoundingFrequency;
  newTermMonths: number;
  newAnnualRatePercent: number;
  newCompounding: CompoundingFrequency;
  pointsPercent: number;
  closingCosts: number;
  cashInOut: number;
}): MortgageRefinanceComputation | null {
  const {
    originalPrincipal,
    originalTermMonths,
    elapsedMonths,
    currentAnnualRatePercent,
    currentCompounding,
    newTermMonths,
    newAnnualRatePercent,
    newCompounding,
    pointsPercent,
    closingCosts,
    cashInOut,
  } = input;

  if (
    ![
      originalPrincipal,
      originalTermMonths,
      elapsedMonths,
      currentAnnualRatePercent,
      newTermMonths,
      newAnnualRatePercent,
      pointsPercent,
      closingCosts,
      cashInOut,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (originalPrincipal < 0 || closingCosts < 0 || pointsPercent < 0) return null;
  if (currentAnnualRatePercent < 0 || newAnnualRatePercent < 0) return null;
  if (!Number.isInteger(originalTermMonths) || originalTermMonths <= 0) return null;
  if (!Number.isInteger(newTermMonths) || newTermMonths <= 0) return null;
  if (!Number.isInteger(elapsedMonths) || elapsedMonths < 0) return null;
  if (elapsedMonths >= originalTermMonths) return null;

  const currentMonthlyRate = effectiveMonthlyRate(
    currentAnnualRatePercent,
    currentCompounding
  );
  const newMonthlyRate = effectiveMonthlyRate(newAnnualRatePercent, newCompounding);
  if (currentMonthlyRate === null || newMonthlyRate === null) return null;

  const currentPayment = amortizingPayment(
    originalPrincipal,
    currentMonthlyRate,
    originalTermMonths
  );
  if (currentPayment === null) return null;

  const balance = remainingBalance({
    principal: originalPrincipal,
    monthlyRate: currentMonthlyRate,
    totalMonths: originalTermMonths,
    paymentsMade: elapsedMonths,
  });
  if (balance === null || balance < 0) return null;

  const newPrincipal = balance + cashInOut;
  if (!(newPrincipal > 0) || !Number.isFinite(newPrincipal)) return null;

  const pointsCost = (newPrincipal * pointsPercent) / 100;
  if (!Number.isFinite(pointsCost) || pointsCost < 0) return null;
  const refinancingCost = pointsCost + closingCosts;
  if (!Number.isFinite(refinancingCost)) return null;

  const newPayment = amortizingPayment(newPrincipal, newMonthlyRate, newTermMonths);
  if (newPayment === null) return null;

  const remainingMonths = originalTermMonths - elapsedMonths;
  const currentTotalPayments = currentPayment * remainingMonths;
  const currentInterest = currentTotalPayments - balance;
  const newAmortized = newPayment * newTermMonths;
  const newInterest = newAmortized - newPrincipal;
  const newTotalPayments = newAmortized + refinancingCost;
  if (
    ![currentTotalPayments, currentInterest, newAmortized, newInterest, newTotalPayments].every(
      Number.isFinite
    )
  ) {
    return null;
  }

  const monthlySavings = currentPayment - newPayment;
  if (!Number.isFinite(monthlySavings)) return null;

  return {
    current: {
      principal: balance,
      monthlyPayment: currentPayment,
      annualRatePercent: currentAnnualRatePercent,
      termMonths: remainingMonths,
      totalInterest: currentInterest,
      totalPayments: currentTotalPayments,
    },
    neu: {
      principal: newPrincipal,
      monthlyPayment: newPayment,
      annualRatePercent: newAnnualRatePercent,
      termMonths: newTermMonths,
      totalInterest: newInterest,
      totalPayments: newTotalPayments,
    },
    elapsedMonths,
    pointsCost,
    closingCosts,
    refinancingCost,
    monthlySavings,
    breakEvenMonths: breakEvenMonthCount(refinancingCost, monthlySavings),
  };
}
