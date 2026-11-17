import type { TdsQuarter } from './types';

/** Section 201(1A)(i) — late deduction. */
export const LATE_DEDUCTION_RATE_PERCENT = 1;
/** Section 201(1A)(ii) — late deposit after deduction. */
export const LATE_PAYMENT_RATE_PERCENT = 1.5;
/** Section 234E — late TDS/TCS statement fee per day. */
export const LATE_FILING_FEE_PER_DAY = 200;

/**
 * Inclusive calendar-month count for “month or part of a month” under s.201(1A).
 * Same civil date → 0 (no delay). End before start → null.
 */
export function inclusiveCalendarMonths(
  startIso: string,
  endIso: string
): number | null {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  if (!start || !end) return null;
  if (compareIsoDates(endIso, startIso) < 0) return null;
  if (compareIsoDates(endIso, startIso) === 0) return 0;
  return (
    (end.y - start.y) * 12 + (end.m - start.m) + 1
  );
}

export function parseIsoDate(
  iso: string
): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (![y, mo, d].every(Number.isFinite)) return null;
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== mo - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null;
  }
  return { y, m: mo, d };
}

export function formatIsoDateDisplay(iso: string): string {
  const p = parseIsoDate(iso);
  if (!p) return iso;
  const mm = String(p.m).padStart(2, '0');
  const dd = String(p.d).padStart(2, '0');
  return `${mm}/${dd}/${p.y}`;
}

export function compareIsoDates(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

export function formatInrAmount(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Rule 30 deposit due date for non-government deductors:
 * 7th of the month following deduction; March → 30 April.
 * Government same-day / 7 April March rules are not modeled (no screenshot toggle).
 */
export function tdsDepositDueDate(deductionIso: string): string | null {
  const p = parseIsoDate(deductionIso);
  if (!p) return null;
  if (p.m === 3) {
    return `${p.y}-04-30`;
  }
  let y = p.y;
  let m = p.m + 1;
  if (m > 12) {
    m = 1;
    y += 1;
  }
  return `${y}-${String(m).padStart(2, '0')}-07`;
}

/**
 * Quarterly TDS statement due date for FY starting `fyStartYear` (April).
 * Q1→31 Jul same year, Q2→31 Oct, Q3→31 Jan next year, Q4→31 May next year.
 * Does not apply CBDT extension circulars (those are year-specific notices).
 */
export function tdsReturnDueDate(
  quarter: TdsQuarter,
  fyStartYear: number
): string | null {
  if (!Number.isInteger(fyStartYear) || fyStartYear < 2012 || fyStartYear > 2100) {
    return null;
  }
  switch (quarter) {
    case 1:
      return `${fyStartYear}-07-31`;
    case 2:
      return `${fyStartYear}-10-31`;
    case 3:
      return `${fyStartYear + 1}-01-31`;
    case 4:
      return `${fyStartYear + 1}-05-31`;
    default:
      return null;
  }
}

/** Calendar days after due date through filing date (due day itself = 0). */
export function daysAfterDueDate(dueIso: string, filingIso: string): number | null {
  const due = parseIsoDate(dueIso);
  const filing = parseIsoDate(filingIso);
  if (!due || !filing) return null;
  if (compareIsoDates(filingIso, dueIso) <= 0) return 0;
  const dueMs = Date.UTC(due.y, due.m - 1, due.d);
  const filingMs = Date.UTC(filing.y, filing.m - 1, filing.d);
  return Math.round((filingMs - dueMs) / 86_400_000);
}

export function calculateLateDeductionInterest(input: {
  taxAmount: number;
  transactionDate: string;
  deductionDate: string;
}): { months: number; interest: number } | null {
  const { taxAmount, transactionDate, deductionDate } = input;
  if (!(taxAmount > 0) || !Number.isFinite(taxAmount)) return null;
  const months = inclusiveCalendarMonths(transactionDate, deductionDate);
  if (months === null) return null;
  const interest = taxAmount * (LATE_DEDUCTION_RATE_PERCENT / 100) * months;
  if (!Number.isFinite(interest)) return null;
  return { months, interest };
}

export function calculateLatePaymentInterest(input: {
  taxAmount: number;
  deductionDate: string;
  paymentDate: string;
}): { months: number; interest: number; dueDate: string } | null {
  const { taxAmount, deductionDate, paymentDate } = input;
  if (!(taxAmount > 0) || !Number.isFinite(taxAmount)) return null;
  const dueDate = tdsDepositDueDate(deductionDate);
  if (!dueDate) return null;
  if (compareIsoDates(paymentDate, deductionDate) < 0) return null;

  if (compareIsoDates(paymentDate, dueDate) <= 0) {
    return { months: 0, interest: 0, dueDate };
  }

  const months = inclusiveCalendarMonths(deductionDate, paymentDate);
  if (months === null) return null;
  const interest = taxAmount * (LATE_PAYMENT_RATE_PERCENT / 100) * months;
  if (!Number.isFinite(interest)) return null;
  return { months, interest, dueDate };
}

export function calculateLateFilingFee(input: {
  taxAmount: number;
  quarter: TdsQuarter;
  fyStartYear: number;
  filingDate: string;
}):
  | { withinDeadline: true; dueDate: string; days: 0; fee: 0 }
  | { withinDeadline: false; dueDate: string; days: number; fee: number }
  | null {
  const { taxAmount, quarter, fyStartYear, filingDate } = input;
  if (!(taxAmount > 0) || !Number.isFinite(taxAmount)) return null;
  const dueDate = tdsReturnDueDate(quarter, fyStartYear);
  if (!dueDate) return null;
  const days = daysAfterDueDate(dueDate, filingDate);
  if (days === null) return null;
  if (days === 0) {
    return { withinDeadline: true, dueDate, days: 0, fee: 0 };
  }
  const uncapped = days * LATE_FILING_FEE_PER_DAY;
  const fee = Math.min(uncapped, taxAmount);
  if (!Number.isFinite(fee)) return null;
  return { withinDeadline: false, dueDate, days, fee };
}
