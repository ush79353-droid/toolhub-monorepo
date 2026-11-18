import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { MoveStatus } from './types';

export function formatProratedRentMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Actual calendar days in the month of `year`/`month` (1–12). Handles leap Feb. */
export function daysInCalendarMonth(year: number, month: number): number | null {
  if (!Number.isInteger(year) || !Number.isInteger(month)) return null;
  if (month < 1 || month > 12) return null;
  // Day 0 of next month = last day of this month (UTC civil calendar).
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return Number.isFinite(days) && days > 0 ? days : null;
}

/**
 * Parse `YYYY-MM-DD` as a civil calendar date (no timezone shift).
 * Rejects impossible days (e.g. 2026-02-30).
 */
export function parseCivilDate(
  raw: string
): { year: number; month: number; day: number } | null {
  const trimmed = raw.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (![year, month, day].every(Number.isInteger)) return null;
  if (month < 1 || month > 12 || day < 1) return null;
  const dim = daysInCalendarMonth(year, month);
  if (dim === null || day > dim) return null;
  return { year, month, day };
}

/**
 * Daily Rent = Monthly Rent / Days in Month
 * Moving in:  Chargeable Days = Days in Month − Moving Day + 1
 * Moving out: Chargeable Days = Moving Day
 * Prorated Rent = Daily Rent × Chargeable Days
 * Move date is included in the chargeable period.
 */
export function calculateProratedRent(input: {
  monthlyRent: number;
  moveStatus: MoveStatus;
  year: number;
  month: number;
  day: number;
}): {
  daysInMonth: number;
  chargeableDays: number;
  dailyRent: number;
  proratedRent: number;
} | null {
  const { monthlyRent, moveStatus, year, month, day } = input;
  if (!Number.isFinite(monthlyRent) || monthlyRent < 0) return null;

  const daysInMonth = daysInCalendarMonth(year, month);
  if (daysInMonth === null || day < 1 || day > daysInMonth) return null;

  const chargeableDays =
    moveStatus === 'moving-in' ? daysInMonth - day + 1 : day;

  if (!(chargeableDays > 0) || !Number.isFinite(chargeableDays)) return null;

  const dailyRent = monthlyRent / daysInMonth;
  const proratedRent = dailyRent * chargeableDays;

  if (![dailyRent, proratedRent].every(Number.isFinite)) return null;

  return { daysInMonth, chargeableDays, dailyRent, proratedRent };
}
