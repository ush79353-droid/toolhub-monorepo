import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function formatJumboLoanMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Advance an ISO civil date by whole months (UTC), matching home-mortgage conventions. */
export function addMonthsIso(isoDate: string, months: number): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (![y, m, d].every(Number.isFinite)) return null;
  const utc = new Date(Date.UTC(y, m - 1, d));
  if (
    utc.getUTCFullYear() !== y ||
    utc.getUTCMonth() !== m - 1 ||
    utc.getUTCDate() !== d
  ) {
    return null;
  }
  utc.setUTCMonth(utc.getUTCMonth() + months);
  const yy = utc.getUTCFullYear();
  const mm = String(utc.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(utc.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

export function formatDisplayDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return isoDate;
  return `${match[2]}/${match[3]}/${match[1]}`;
}

/** n = years × 12 + months; must be a positive whole number of months. */
export function calculatePaymentCount(termYears: number, termMonths: number): number | null {
  if (![termYears, termMonths].every(Number.isFinite)) return null;
  if (termYears < 0 || termMonths < 0 || termMonths > 11) return null;
  if (!Number.isInteger(termYears) || !Number.isInteger(termMonths)) return null;
  const n = termYears * 12 + termMonths;
  return n > 0 ? n : null;
}

/**
 * Down Payment = Property Price × Down Payment % / 100
 * Loan Amount = Property Price − Down Payment
 * r = Annual Interest Rate / 1200
 * Monthly Payment = P × r / (1 − (1+r)^(-n)); when r = 0: P / n
 * Full precision — round only for display.
 */
export function calculateJumboLoan(input: {
  propertyPrice: number;
  downPaymentPercent: number;
  annualRatePercent: number;
  termYears: number;
  termMonths: number;
  firstDay: string;
}): {
  downPayment: number;
  jumboLoanAmount: number;
  paymentCount: number;
  monthlyPayment: number;
  payoffDate: string;
} | null {
  const {
    propertyPrice: P0,
    downPaymentPercent,
    annualRatePercent: APR,
    termYears,
    termMonths,
    firstDay,
  } = input;

  if (![P0, downPaymentPercent, APR, termYears, termMonths].every(Number.isFinite)) {
    return null;
  }
  if (!(P0 > 0) || downPaymentPercent < 0 || downPaymentPercent > 100 || APR < 0) {
    return null;
  }

  const downPayment = P0 * (downPaymentPercent / 100);
  const jumboLoanAmount = P0 - downPayment;
  if (!(jumboLoanAmount >= 0) || !Number.isFinite(jumboLoanAmount)) return null;

  const paymentCount = calculatePaymentCount(termYears, termMonths);
  if (paymentCount === null) return null;

  const payoffDate = addMonthsIso(firstDay, paymentCount);
  if (!payoffDate) return null;

  let monthlyPayment: number;
  if (jumboLoanAmount === 0) {
    monthlyPayment = 0;
  } else {
    const r = APR / 1200;
    if (r === 0) {
      monthlyPayment = jumboLoanAmount / paymentCount;
    } else {
      const factor = Math.pow(1 + r, -paymentCount);
      if (!Number.isFinite(factor)) return null;
      const denom = 1 - factor;
      if (!(denom > 0)) return null;
      monthlyPayment = (jumboLoanAmount * r) / denom;
    }
  }

  if (!Number.isFinite(monthlyPayment)) return null;

  return {
    downPayment,
    jumboLoanAmount,
    paymentCount,
    monthlyPayment,
    payoffDate,
  };
}
