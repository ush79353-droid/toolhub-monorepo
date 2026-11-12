/** Calendar-day arithmetic on YYYY-MM-DD using UTC civil dates (no local DST shift). */

export const MIN_YEAR = 1;
export const MAX_YEAR = 9999;
export const MAX_DAY_OFFSET = 100_000;

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

export interface CivilDate {
  year: number;
  month: number;
  day: number;
}

export function parseIsoDate(value: string): CivilDate | null {
  const match = ISO.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < MIN_YEAR || year > MAX_YEAR || month < 1 || month > 12 || day < 1) return null;
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

export function formatIsoDate(date: CivilDate): string {
  const month = String(date.month).padStart(2, '0');
  const day = String(date.day).padStart(2, '0');
  return `${String(date.year).padStart(4, '0')}-${month}-${day}`;
}

export function addCalendarDays(iso: string, days: number): string {
  const parsed = parseIsoDate(iso);
  if (!parsed) throw new Error('Invalid date');
  if (!Number.isInteger(days)) throw new Error('Day offset must be an integer');
  const utc = Date.UTC(parsed.year, parsed.month - 1, parsed.day + days);
  const next = new Date(utc);
  const result = {
    year: next.getUTCFullYear(),
    month: next.getUTCMonth() + 1,
    day: next.getUTCDate(),
  };
  if (result.year < MIN_YEAR || result.year > MAX_YEAR) {
    throw new Error('Result is outside the supported year range');
  }
  return formatIsoDate(result);
}

/** Signed calendar days from `fromIso` to `toIso`. Same UTC-midnight dates, so DST cannot change the count. */
export function diffCalendarDays(fromIso: string, toIso: string): number {
  const from = parseIsoDate(fromIso);
  const to = parseIsoDate(toIso);
  if (!from || !to) throw new Error('Invalid date');
  const a = Date.UTC(from.year, from.month - 1, from.day);
  const b = Date.UTC(to.year, to.month - 1, to.day);
  return Math.round((b - a) / 86_400_000);
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export function weekdayName(iso: string): string {
  const parsed = parseIsoDate(iso);
  if (!parsed) throw new Error('Invalid date');
  const utc = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day));
  return WEEKDAYS[utc.getUTCDay()];
}

export function formatLongDate(iso: string): string {
  const parsed = parseIsoDate(iso);
  if (!parsed) return iso;
  const utc = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day));
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(utc);
}

export function weeksAndDays(absoluteDays: number): { weeks: number; days: number } {
  const days = Math.abs(absoluteDays);
  return { weeks: Math.floor(days / 7), days: days % 7 };
}
