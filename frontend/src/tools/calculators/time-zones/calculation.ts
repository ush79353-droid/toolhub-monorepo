import type { ConvertResult, Disambiguation, HourCycle, WallClock, ZoneDef, ZoneInstant } from './types';

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function clocksEqual(a: WallClock, b: WallClock): boolean {
  return (
    a.year === b.year &&
    a.month === b.month &&
    a.day === b.day &&
    a.hour === b.hour &&
    a.minute === b.minute &&
    a.second === b.second
  );
}

export function wallToUtcMs(clock: WallClock): number {
  return Date.UTC(clock.year, clock.month - 1, clock.day, clock.hour, clock.minute, clock.second);
}

export function utcMsToWall(ms: number): WallClock {
  const d = new Date(ms);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    second: d.getUTCSeconds(),
  };
}

export function formatWallDate(clock: WallClock): string {
  return `${clock.year}-${pad2(clock.month)}-${pad2(clock.day)}`;
}

export function formatWallTime(clock: WallClock, withSeconds = false): string {
  const hm = `${pad2(clock.hour)}:${pad2(clock.minute)}`;
  return withSeconds || clock.second !== 0 ? `${hm}:${pad2(clock.second)}` : hm;
}

export function formatWallTime12(clock: WallClock): string {
  const period = clock.hour >= 12 ? 'PM' : 'AM';
  const hour12 = clock.hour % 12 || 12;
  const seconds = clock.second !== 0 ? `:${pad2(clock.second)}` : '';
  return `${hour12}:${pad2(clock.minute)}${seconds} ${period}`;
}

export function formatOffsetLabel(offsetMinutes: number): string {
  const sign = offsetMinutes >= 0 ? '+' : '−';
  const abs = Math.abs(offsetMinutes);
  return `UTC${sign}${pad2(Math.floor(abs / 60))}:${pad2(abs % 60)}`;
}

export function parseDateTime(dateStr: string, timeStr: string): WallClock | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  const timeMatch = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(timeStr.trim());
  if (!dateMatch || !timeMatch) return null;

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  const second = Number(timeMatch[3] ?? '0');
  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59 || second > 59) {
    return null;
  }

  const probe = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  if (probe.getUTCFullYear() !== year || probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) {
    return null;
  }
  return { year, month, day, hour, minute, second };
}

const dtfCache = new Map<string, Intl.DateTimeFormat>();

function zoneFormatter(timeZone: string): Intl.DateTimeFormat {
  let fmt = dtfCache.get(timeZone);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat('en-US', {
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
    dtfCache.set(timeZone, fmt);
  }
  return fmt;
}

function partsMap(parts: Intl.DateTimeFormatPart[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== 'literal') out[part.type] = part.value;
  }
  return out;
}

export function clockInTimeZone(instant: Date, timeZone: string): WallClock {
  const p = partsMap(zoneFormatter(timeZone).formatToParts(instant));
  return {
    year: Number(p.year),
    month: Number(p.month),
    day: Number(p.day),
    hour: Number(p.hour),
    minute: Number(p.minute),
    second: Number(p.second),
  };
}

export function abbreviationInTimeZone(instant: Date, timeZone: string): string {
  const p = partsMap(zoneFormatter(timeZone).formatToParts(instant));
  return p.timeZoneName ?? timeZone;
}

export function offsetMinutesInTimeZone(instant: Date, timeZone: string): number {
  const wall = clockInTimeZone(instant, timeZone);
  return Math.round((wallToUtcMs(wall) - instant.getTime()) / 60_000);
}

function matchingInstants(clock: WallClock, timeZone: string): Date[] {
  const wallUtc = wallToUtcMs(clock);
  const seen = new Set<number>();
  const matches: Date[] = [];

  const consider = (guessMs: number) => {
    const offset = offsetMinutesInTimeZone(new Date(guessMs), timeZone);
    const utc = wallUtc - offset * 60_000;
    if (seen.has(utc)) return;
    seen.add(utc);
    if (!clocksEqual(clockInTimeZone(new Date(utc), timeZone), clock)) return;
    matches.push(new Date(utc));
    consider(utc + 60 * 60_000);
    consider(utc - 60 * 60_000);
  };

  consider(wallUtc);
  consider(wallUtc - 60 * 60_000);
  consider(wallUtc + 60 * 60_000);
  consider(wallUtc - 2 * 60 * 60_000);
  consider(wallUtc + 2 * 60 * 60_000);
  matches.sort((a, b) => a.getTime() - b.getTime());
  return matches;
}

export function zonedClockToInstant(clock: WallClock, zone: ZoneDef): ConvertResult {
  if (zone.kind === 'fixed') {
    const offset = zone.offsetMinutes ?? 0;
    return { status: 'unique', instants: [new Date(wallToUtcMs(clock) - offset * 60_000)] };
  }
  if (!zone.iana) return { status: 'invalid', instants: [] };
  try {
    const matches = matchingInstants(clock, zone.iana);
    if (matches.length === 0) return { status: 'nonexistent', instants: [] };
    if (matches.length === 1) return { status: 'unique', instants: matches };
    return { status: 'ambiguous', instants: matches };
  } catch {
    return { status: 'invalid', instants: [] };
  }
}

export function pickInstant(result: ConvertResult, disambiguation: Disambiguation): Date | null {
  if (result.instants.length === 0) return null;
  if (result.status === 'ambiguous' && disambiguation === 'later') {
    return result.instants[result.instants.length - 1] ?? null;
  }
  return result.instants[0] ?? null;
}

export function instantInZone(instant: Date, zone: ZoneDef): ZoneInstant {
  if (zone.kind === 'fixed') {
    const offset = zone.offsetMinutes ?? 0;
    const clock = utcMsToWall(instant.getTime() + offset * 60_000);
    return {
      date: formatWallDate(clock),
      time: formatWallTime(clock),
      time12: formatWallTime12(clock),
      offsetLabel: formatOffsetLabel(offset),
      offsetMinutes: offset,
      abbreviation: formatOffsetLabel(offset),
    };
  }
  if (!zone.iana) {
    const clock = utcMsToWall(instant.getTime());
    return {
      date: formatWallDate(clock),
      time: formatWallTime(clock),
      time12: formatWallTime12(clock),
      offsetLabel: 'UTC+00:00',
      offsetMinutes: 0,
      abbreviation: 'UTC',
      iana: zone.iana,
    };
  }
  const clock = clockInTimeZone(instant, zone.iana);
  const offsetMinutes = offsetMinutesInTimeZone(instant, zone.iana);
  return {
    date: formatWallDate(clock),
    time: formatWallTime(clock),
    time12: formatWallTime12(clock),
    offsetLabel: formatOffsetLabel(offsetMinutes),
    offsetMinutes,
    abbreviation: abbreviationInTimeZone(instant, zone.iana),
    iana: zone.iana,
  };
}

export function calendarDayDelta(fromDate: string, toDate: string): number {
  const a = parseDateTime(fromDate, '00:00');
  const b = parseDateTime(toDate, '00:00');
  if (!a || !b) return 0;
  return Math.round((wallToUtcMs(b) - wallToUtcMs(a)) / 86_400_000);
}

export function withDayDelta(view: ZoneInstant, referenceDate: string): ZoneInstant {
  return { ...view, dayDelta: calendarDayDelta(referenceDate, view.date) };
}

export function formatDisplayTime(view: ZoneInstant, cycle: HourCycle): string {
  return cycle === 'h12' ? view.time12 : view.time;
}

export function formatLongDate(dateStr: string): string {
  const clock = parseDateTime(dateStr, '00:00');
  if (!clock) return dateStr;
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(Date.UTC(clock.year, clock.month - 1, clock.day)));
}

export function detectBrowserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}
