import type {
  AverageTenureResult,
  DurationUnit,
  SpecificTenureResult,
} from './types';

/** Mean Gregorian year length for day→year conversion of combined service totals. */
const DAYS_PER_YEAR = 365.2425;

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function combinedDurationToYears(value: number, unit: DurationUnit): number {
  switch (unit) {
    case 'years':
      return value;
    case 'months':
      return value / 12;
    case 'days':
      return value / DAYS_PER_YEAR;
  }
}

export function formatAverageYears(years: number): string {
  if (!Number.isFinite(years)) return '';
  const rounded = Math.round(years * 1e6) / 1e6;
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(rounded);
}

/**
 * Average Tenure (years) = Combined Duration of Service (in years) / Total Employees
 */
export function calculateAverageTenure(
  employeeCount: number,
  combinedDuration: number,
  unit: DurationUnit
): AverageTenureResult | null {
  if (!Number.isFinite(employeeCount) || !Number.isFinite(combinedDuration)) return null;
  if (employeeCount <= 0 || combinedDuration < 0) return null;

  const combinedYears = combinedDurationToYears(combinedDuration, unit);
  if (!Number.isFinite(combinedYears) || combinedYears < 0) return null;

  const averageYears = combinedYears / employeeCount;
  if (!Number.isFinite(averageYears) || averageYears < 0) return null;

  return {
    averageYears,
    display: formatAverageYears(averageYears),
  };
}

export interface CivilYmd {
  year: number;
  month: number;
  day: number;
}

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseIsoDate(value: string): CivilYmd | null {
  const match = ISO.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1 || year > 9999 || month < 1 || month > 12 || day < 1) return null;
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month - 1 ||
    probe.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

function compareCivil(a: CivilYmd, b: CivilYmd): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

/**
 * Calendar tenure: Ending Date − Starting Date as whole years, months, and days.
 * Uses civil calendar borrow (not a fixed 365-day approximation).
 */
export function calculateSpecificTenure(
  startIso: string,
  endIso: string
): SpecificTenureResult | null {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  if (!start || !end) return null;
  if (compareCivil(end, start) < 0) return null;

  let years = end.year - start.year;
  let months = end.month - start.month;
  let days = end.day - start.day;

  if (days < 0) {
    months -= 1;
    const borrowMonth = end.month === 1 ? 12 : end.month - 1;
    const borrowYear = end.month === 1 ? end.year - 1 : end.year;
    days += daysInMonth(borrowYear, borrowMonth);
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years < 0 || months < 0 || days < 0) return null;
  if (!Number.isFinite(years) || !Number.isFinite(months) || !Number.isFinite(days)) {
    return null;
  }

  return {
    years,
    months,
    days,
    display: formatYmdDuration(years, months, days),
  };
}

export function formatYmdDuration(years: number, months: number, days: number): string {
  if (years === 0 && months === 0 && days === 0) return '0 days';

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
  if (days > 0 || parts.length === 0) {
    parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  }
  return parts.join(', ');
}
