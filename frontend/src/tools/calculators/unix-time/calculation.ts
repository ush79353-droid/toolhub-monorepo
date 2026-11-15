import type { UnixUnit, ZoneEntry } from './types';

const MS_PER_DAY = 86_400_000;

export function unixSecondsToDate(seconds: number): Date {
  return new Date(seconds * 1000);
}

export function unixMillisecondsToDate(milliseconds: number): Date {
  return new Date(milliseconds);
}

export function dateToUnixSeconds(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export function dateToUnixMilliseconds(date: Date): number {
  return date.getTime();
}

export function isValidDate(date: Date): boolean {
  return Number.isFinite(date.getTime());
}

export function instantFromUnix(value: number, unit: UnixUnit): Date | null {
  if (!Number.isFinite(value)) return null;
  const date = unit === 'seconds' ? unixSecondsToDate(value) : unixMillisecondsToDate(value);
  return isValidDate(date) ? date : null;
}

export function unixFromInstant(date: Date, unit: UnixUnit): number {
  return unit === 'seconds' ? dateToUnixSeconds(date) : dateToUnixMilliseconds(date);
}

/** Convert displayed unix number when switching units without changing the instant. */
export function convertUnixDisplay(
  value: number,
  from: UnixUnit,
  to: UnixUnit,
): number {
  if (from === to) return value;
  if (from === 'seconds' && to === 'milliseconds') return value * 1000;
  return Math.trunc(value / 1000);
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function formatUtcDate(date: Date): string {
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
}

export function formatUtcTime(date: Date): string {
  return `${pad2(date.getUTCHours())}:${pad2(date.getUTCMinutes())}:${pad2(date.getUTCSeconds())}`;
}

export function formatUtcDisplay(date: Date): string {
  return `${formatUtcDate(date)} ${formatUtcTime(date)} UTC`;
}

/**
 * Parse UTC calendar date + time (no locale parsing).
 * date: YYYY-MM-DD, time: HH:mm or HH:mm:ss
 */
export function parseUtcDateTime(dateStr: string, timeStr: string): Date | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  const timeMatch = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(timeStr.trim());
  if (!dateMatch || !timeMatch) return null;

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  const second = Number(timeMatch[3] ?? '0');

  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  ) {
    return null;
  }

  const ms = Date.UTC(year, month - 1, day, hour, minute, second);
  const date = new Date(ms);
  if (
    !isValidDate(date) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

function formatUtcParts(date: Date): string {
  return `${formatUtcDate(date)} ${formatUtcTime(date)}`;
}

export function formatFixedOffset(date: Date, offsetMinutes: number): string {
  const shifted = new Date(date.getTime() + offsetMinutes * 60_000);
  const sign = offsetMinutes >= 0 ? '+' : '−';
  const abs = Math.abs(offsetMinutes);
  const oh = Math.floor(abs / 60);
  const om = abs % 60;
  const offsetLabel = om === 0 ? `UTC${sign}${pad2(oh)}:00` : `UTC${sign}${pad2(oh)}:${pad2(om)}`;
  return `${formatUtcParts(shifted)} (${offsetLabel})`;
}

export function formatDateInTimeZone(date: Date, timeZone: string): string {
  try {
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
      timeZoneName: 'short',
    });
    return fmt.format(date);
  } catch {
    return 'Unsupported time zone on this runtime';
  }
}

export function formatZoneEntry(date: Date, zone: ZoneEntry): string {
  if (zone.kind === 'fixed' && typeof zone.offsetMinutes === 'number') {
    return formatFixedOffset(date, zone.offsetMinutes);
  }
  if (zone.kind === 'iana' && zone.iana) {
    return formatDateInTimeZone(date, zone.iana);
  }
  return '—';
}

export function formatLongUtc(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'short',
  }).format(date);
}

/** Days between epoch and date using UTC midnight math (illustrative). */
export function daysSinceEpoch(date: Date): number {
  return Math.floor(date.getTime() / MS_PER_DAY);
}
