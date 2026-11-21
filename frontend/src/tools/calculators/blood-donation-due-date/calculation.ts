/**
 * Blood Donation Due Date — pure engine (ADR-018).
 *
 * nextDonation = lastDonation + wait interval (date-only UTC calendar math).
 * Male/female presets follow NHS Blood and Transplant / WHO-style whole-blood
 * minimums: 12 weeks (84 days) for males, 16 weeks (112 days) for females.
 * Custom mode uses the entered period in days, weeks (×7), or calendar months.
 */

import { addMonthsToIsoDate } from '../auto-loan/calculation';
import { addDaysToIsoDate } from '../loan/calculation';
import {
  recommendationTextForMode,
  type BloodDonationDueDateInput,
  type BloodDonationDueDateResult,
  type BloodDonationPeriodUnit,
} from './types';

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isValidIsoDate(iso: string): boolean {
  const match = ISO_DATE.exec(iso.trim());
  if (!match) return false;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const utc = new Date(Date.UTC(y, m - 1, d));
  return (
    utc.getUTCFullYear() === y &&
    utc.getUTCMonth() === m - 1 &&
    utc.getUTCDate() === d
  );
}

export function formatBloodDonationDate(isoDate: string): string {
  const match = ISO_DATE.exec(isoDate.trim());
  if (!match) return isoDate;
  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  );
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  }).format(date);
}

/** Exact day length for days/weeks; null when unit is calendar months. */
export function periodToDays(
  periodValue: number,
  unit: BloodDonationPeriodUnit
): number | null {
  if (!Number.isFinite(periodValue) || periodValue < 0) return null;
  if (unit === 'days') return periodValue;
  if (unit === 'weeks') return periodValue * 7;
  return null;
}

export function addDonationInterval(
  lastDonationIso: string,
  periodValue: number,
  unit: BloodDonationPeriodUnit
): string {
  if (!isValidIsoDate(lastDonationIso)) {
    throw new Error(`Invalid ISO date "${lastDonationIso}"`);
  }
  if (!Number.isFinite(periodValue) || periodValue < 0) {
    throw new Error('Period must be a non-negative finite number');
  }
  if (unit === 'months') {
    if (!Number.isInteger(periodValue)) {
      throw new Error('Month intervals must be whole months');
    }
    return addMonthsToIsoDate(lastDonationIso, periodValue);
  }
  const days = periodToDays(periodValue, unit);
  if (days == null || !Number.isFinite(days)) {
    throw new Error('Unable to convert period to days');
  }
  if (!Number.isInteger(days)) {
    throw new Error('Day/week intervals must resolve to a whole number of days');
  }
  return addDaysToIsoDate(lastDonationIso, days);
}

/**
 * Preserve duration when switching days ↔ weeks (exact ×7).
 * Months are not converted into days (calendar-month add path).
 */
export function convertPeriodValue(
  value: number,
  from: BloodDonationPeriodUnit,
  to: BloodDonationPeriodUnit
): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  if (from === to) return value;
  if (from === 'months' || to === 'months') return null;
  const days = periodToDays(value, from);
  if (days == null) return null;
  if (to === 'days') return days;
  if (to === 'weeks') return days / 7;
  return null;
}

const SCOPE_NOTE =
  'Scope: whole-blood donation wait using NHS Blood and Transplant / WHO-style minimums (12 weeks male, 16 weeks female). Other products (platelets, plasma) and other countries (for example U.S. Red Cross 56-day whole-blood rules) differ — confirm with your blood service.';

export function calculateBloodDonationDueDate(
  input: BloodDonationDueDateInput
): BloodDonationDueDateResult | null {
  const last = input.lastDonationDate.trim();
  if (!isValidIsoDate(last)) return null;

  const periodRaw = input.periodValue.trim().replace(/,/g, '');
  const periodValue = Number(periodRaw);
  if (!Number.isFinite(periodValue) || periodValue < 0) return null;

  const unit = input.periodUnit;
  if (unit === 'months' && !Number.isInteger(periodValue)) return null;
  if (unit !== 'months') {
    const days = periodToDays(periodValue, unit);
    if (days == null || !Number.isInteger(days)) return null;
  }

  let next: string;
  try {
    next = addDonationInterval(last, periodValue, unit);
  } catch {
    return null;
  }

  const periodDaysEquivalent = periodToDays(periodValue, unit);

  return {
    sexMode: input.sexMode,
    periodValue,
    periodUnit: unit,
    periodDaysEquivalent,
    lastDonationIso: last,
    nextDonationIso: next,
    formattedLastDonation: formatBloodDonationDate(last),
    formattedNextDonation: formatBloodDonationDate(next),
    recommendationText: recommendationTextForMode(input.sexMode),
    scopeNote: SCOPE_NOTE,
    explanation: `Earliest next whole-blood donation date = last donation (${formatBloodDonationDate(last)}) + ${periodValue} ${unit}.`,
  };
}
