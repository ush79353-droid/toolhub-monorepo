import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  DEFAULT_COMPOUNDING,
  type CompoundingMethod,
  type MinimumPaymentMethod,
} from './types';

/** Omni-style 28-day month for payoff-date estimate (matches screenshot). */
export const DAYS_PER_PAYBACK_MONTH = 28;

export function formatCreditMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatMoneyWithCode(
  amount: number,
  currency: SupportedCurrency
): string {
  return `${getCurrencySymbol(currency)}${formatCreditMoney(amount, currency)}`;
}

export function formatPayoffDateDisplay(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return iso;
  const utc = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return utc.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Add whole days to an ISO civil date (UTC). */
export function addDaysIso(iso: string, days: number): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d)) {
    return null;
  }
  if (!Number.isFinite(days) || !Number.isInteger(days)) return null;
  const utc = new Date(Date.UTC(y, mo - 1, d));
  if (
    utc.getUTCFullYear() !== y ||
    utc.getUTCMonth() !== mo - 1 ||
    utc.getUTCDate() !== d
  ) {
    return null;
  }
  utc.setUTCDate(utc.getUTCDate() + days);
  const yy = String(utc.getUTCFullYear()).padStart(4, '0');
  const mm = String(utc.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(utc.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

/**
 * Monthly period rate for the payment formula and schedule.
 * Monthly: APR/12 (APR/1200 when APR is a percent).
 * Daily paths compound within the month.
 */
export function periodRate(
  annualRate: number,
  compounding: CompoundingMethod
): number {
  if (!(annualRate >= 0) || !Number.isFinite(annualRate)) return NaN;
  if (annualRate === 0) return 0;
  if (compounding === 'monthly') {
    return annualRate / 12;
  }
  if (compounding === 'daily_365') {
    const daily = annualRate / 365;
    return Math.pow(1 + daily, 365 / 12) - 1;
  }
  const daily = annualRate / 360;
  return Math.pow(1 + daily, 30) - 1;
}

export function monthInterest(
  balance: number,
  annualRate: number,
  compounding: CompoundingMethod
): number {
  if (!(balance > 0) || annualRate === 0) return 0;
  const r = periodRate(annualRate, compounding);
  if (!Number.isFinite(r)) return NaN;
  return balance * r;
}

export function minimumPaymentDue(input: {
  balance: number;
  interest: number;
  floor: number;
  percent: number;
  method: MinimumPaymentMethod;
}): number {
  const { balance, interest, floor, percent, method } = input;
  const pctPart = balance * (percent / 100);
  const formula =
    method === 'percent_plus_interest' ? pctPart + interest : pctPart;
  return Math.max(floor, formula);
}

/**
 * Payment = Balance × r / (1 − (1+r)^(-n)); when r = 0, Payment = Balance / n.
 * Uses expm1/log1p for stability. Full precision — round only for display/schedule.
 */
export function amortizingMonthlyPayment(
  balance: number,
  periodicRate: number,
  installments: number
): number | null {
  if (![balance, periodicRate, installments].every(Number.isFinite)) {
    return null;
  }
  if (!(balance > 0) || !(installments > 0) || periodicRate < 0) return null;

  if (periodicRate === 0) {
    const payment = balance / installments;
    return Number.isFinite(payment) ? payment : null;
  }

  const denom = -Math.expm1(-installments * Math.log1p(periodicRate));
  if (!(denom > 0)) return null;
  const payment = (balance * periodicRate) / denom;
  return Number.isFinite(payment) ? payment : null;
}

export function termInstallments(
  years: number,
  months: number
): number | null {
  if (![years, months].every(Number.isFinite)) return null;
  if (!Number.isInteger(years) || !Number.isInteger(months)) return null;
  if (years < 0 || months < 0 || months > 11) return null;
  const n = years * 12 + months;
  return n > 0 ? n : null;
}

export interface CreditCardPaymentCalculationInput {
  balance: number;
  annualRate: number;
  dueDate: string;
  termYears: number;
  termMonths: number;
  minPaymentFloor: number;
  minPaymentPercent: number;
  minPaymentMethod: MinimumPaymentMethod;
  compounding: CompoundingMethod;
  currency: SupportedCurrency;
}

export interface CreditCardPaymentCalculationOutput {
  monthlyPayment: number;
  months: number;
  years: number;
  remainingMonths: number;
  payoffDateIso: string;
  payoffDateDisplay: string;
  totalPaid: number;
  totalInterest: number;
  currency: SupportedCurrency;
  compounding: CompoundingMethod;
  formattedMonthlyPayment: string;
  formattedTotalPaid: string;
  formattedTotalInterest: string;
  summary: string;
  breakdown: string;
  paymentRaisedToMinimum: boolean;
  belowMinimumWithoutRaise: boolean;
}

/**
 * Required monthly payment for a specified payback term.
 * Schedule uses currency-rounded payment; final installment clears remainder.
 * Payoff date = due date + n × 28 days (screenshot convention).
 */
export function calculateCreditCardPayment(
  input: CreditCardPaymentCalculationInput
): CreditCardPaymentCalculationOutput | null {
  const {
    balance: startBalance,
    annualRate,
    dueDate,
    termYears,
    termMonths,
    minPaymentFloor,
    minPaymentPercent,
    minPaymentMethod,
    compounding,
    currency,
  } = input;

  if (
    ![
      startBalance,
      annualRate,
      termYears,
      termMonths,
      minPaymentFloor,
      minPaymentPercent,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(startBalance > 0) || annualRate < 0) return null;
  if (minPaymentFloor < 0 || minPaymentPercent < 0) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate.trim())) return null;

  const n = termInstallments(termYears, termMonths);
  if (n === null) return null;

  const effectiveCompounding = compounding || DEFAULT_COMPOUNDING;
  const r = periodRate(annualRate, effectiveCompounding);
  if (!Number.isFinite(r) || r < 0) return null;

  const rawPayment = amortizingMonthlyPayment(startBalance, r, n);
  if (rawPayment === null) return null;

  const firstInterest = monthInterest(
    startBalance,
    annualRate,
    effectiveCompounding
  );
  if (!Number.isFinite(firstInterest)) return null;

  const cardMinimum = minimumPaymentDue({
    balance: startBalance,
    interest: firstInterest,
    floor: minPaymentFloor,
    percent: minPaymentPercent,
    method: minPaymentMethod,
  });
  if (!Number.isFinite(cardMinimum) || cardMinimum < 0) return null;

  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  const scale = 10 ** digits;
  const roundMoney = (v: number) => Math.round(v * scale) / scale;

  let paymentRaisedToMinimum = false;
  let scheduled = rawPayment;
  if (scheduled + 1e-12 < cardMinimum) {
    scheduled = cardMinimum;
    paymentRaisedToMinimum = true;
  }
  scheduled = roundMoney(scheduled);
  if (!(scheduled > 0)) return null;

  let balance = startBalance;
  let months = 0;
  let totalPaid = 0;
  let totalInterest = 0;
  const maxMonths = Math.max(n, 1200);

  while (balance > 1e-9 && months < maxMonths) {
    const interest = monthInterest(balance, annualRate, effectiveCompounding);
    if (!Number.isFinite(interest)) return null;

    const due = balance + interest;
    const isLastPlanned = !paymentRaisedToMinimum && months === n - 1;
    let payment: number;
    if (isLastPlanned || due <= scheduled + 1e-9) {
      payment = due;
    } else {
      payment = scheduled;
    }

    balance = due - payment;
    totalPaid += payment;
    totalInterest += interest;
    months += 1;

    if (balance < 1e-9) {
      balance = 0;
      break;
    }

    // Without a minimum raise, stay within the requested term.
    if (!paymentRaisedToMinimum && months >= n) {
      // Force clear any leftover from rounding on the final step.
      if (balance > 0) {
        const leftoverInterest = monthInterest(
          balance,
          annualRate,
          effectiveCompounding
        );
        if (!Number.isFinite(leftoverInterest)) return null;
        const finalDue = balance + leftoverInterest;
        totalPaid += finalDue;
        totalInterest += leftoverInterest;
        balance = 0;
      }
      break;
    }
  }

  if (balance > 1e-9) return null;
  if (!Number.isFinite(totalPaid) || !Number.isFinite(totalInterest)) {
    return null;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const money = (v: number) => formatMoneyWithCode(v, currency);

  const payoffDateIso = addDaysIso(
    dueDate.trim(),
    months * DAYS_PER_PAYBACK_MONTH
  );
  if (!payoffDateIso) return null;
  const payoffDateDisplay = formatPayoffDateDisplay(payoffDateIso);

  const summary = `Your monthly payment is ${money(scheduled)}. You will pay off your credit card in ${years} year(s) and ${remainingMonths} month(s), on ${payoffDateDisplay}.`;
  const breakdown = `The total payment amount is ${money(totalPaid)}, of which ${money(totalInterest)} is interest.`;

  return {
    monthlyPayment: scheduled,
    months,
    years,
    remainingMonths,
    payoffDateIso,
    payoffDateDisplay,
    totalPaid,
    totalInterest,
    currency,
    compounding: effectiveCompounding,
    formattedMonthlyPayment: formatCreditMoney(scheduled, currency),
    formattedTotalPaid: formatCreditMoney(totalPaid, currency),
    formattedTotalInterest: formatCreditMoney(totalInterest, currency),
    summary,
    breakdown,
    paymentRaisedToMinimum,
    belowMinimumWithoutRaise: paymentRaisedToMinimum,
  };
}
