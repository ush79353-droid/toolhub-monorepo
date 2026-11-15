import type { ZoneDef } from '../time-zones/types';
import {
  calendarDayDelta,
  formatLongDate,
  formatOffsetLabel,
  formatWallTime,
  formatWallTime12,
  instantInZone,
  offsetMinutesInTimeZone,
  parseDateTime,
  pickInstant,
  wallToUtcMs,
  zonedClockToInstant,
} from '../time-zones/calculation';
import { UTC_ZONE, isIanaSupported } from '../time-zones/zones';
import type { ClockSource, Disambiguation, ZuluConversion } from './types';

export {
  calendarDayDelta,
  formatLongDate,
  formatOffsetLabel,
  formatWallTime,
  formatWallTime12,
  instantInZone,
  parseDateTime,
  pickInstant,
  zonedClockToInstant,
};

export function ianaZoneDef(iana: string): ZoneDef {
  if (iana === 'Etc/UTC' || iana === 'UTC' || iana === 'Zulu') return UTC_ZONE;
  return { id: iana, city: iana, label: iana, kind: 'iana', iana };
}

export function isDaylightSaving(instant: Date, timeZone: string): boolean {
  if (!timeZone || timeZone === 'UTC' || timeZone === 'Etc/UTC') return false;
  const year = instant.getUTCFullYear();
  const jan = offsetMinutesInTimeZone(new Date(Date.UTC(year, 0, 1, 12)), timeZone);
  const jul = offsetMinutesInTimeZone(new Date(Date.UTC(year, 6, 1, 12)), timeZone);
  if (jan === jul) return false;
  return offsetMinutesInTimeZone(instant, timeZone) === Math.max(jan, jul);
}

export function formatZuluLabel(time24: string): string {
  return `${time24}Z`;
}

export function formatZuluIso(date: string, time24: string): string {
  const clock = parseDateTime(date, time24);
  if (!clock) return `${date}T${time24}Z`;
  const hh = String(clock.hour).padStart(2, '0');
  const mm = String(clock.minute).padStart(2, '0');
  const ss = String(clock.second).padStart(2, '0');
  return `${date}T${hh}:${mm}:${ss}Z`;
}

export function parseClockTime(raw: string): { hour: number; minute: number; second: number } | null {
  const trimmed = raw.trim().replace(/z$/i, '').trim();
  if (!trimmed) return null;

  const ampm = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AaPp][Mm])$/.exec(trimmed);
  if (ampm) {
    let hour = Number(ampm[1]);
    const minute = Number(ampm[2]);
    const second = Number(ampm[3] ?? '0');
    const period = ampm[4].toUpperCase();
    if (hour < 1 || hour > 12 || minute > 59 || second > 59) return null;
    hour = period === 'AM' ? hour % 12 : (hour % 12) + 12;
    return { hour, minute, second };
  }

  const colon = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(trimmed);
  if (colon) {
    const hour = Number(colon[1]);
    const minute = Number(colon[2]);
    const second = Number(colon[3] ?? '0');
    if (hour > 23 || minute > 59 || second > 59) return null;
    return { hour, minute, second };
  }

  const compact = /^(\d{2})(\d{2})$/.exec(trimmed);
  if (compact) {
    const hour = Number(compact[1]);
    const minute = Number(compact[2]);
    if (hour > 23 || minute > 59) return null;
    return { hour, minute, second: 0 };
  }

  return null;
}

export function convertFromZulu(date: string, time: string, iana: string): ZuluConversion {
  const clock = parseDateTime(date, time);
  if (!clock) {
    return invalidConversion(iana);
  }
  const instant = new Date(wallToUtcMs(clock));
  return conversionFromInstant(instant, iana, 'unique', date);
}

export function convertFromLocal(
  date: string,
  time: string,
  iana: string,
  disambiguation: Disambiguation,
): ZuluConversion {
  const clock = parseDateTime(date, time);
  if (!clock) return invalidConversion(iana);
  const zone = ianaZoneDef(iana);
  if (zone.kind === 'iana' && zone.iana && !isIanaSupported(zone.iana)) {
    return { ...invalidConversion(iana), status: 'invalid' };
  }
  const result = zonedClockToInstant(clock, zone);
  const instant = pickInstant(result, disambiguation);
  if (!instant) {
    return {
      ...invalidConversion(iana),
      status: result.status,
      zuluDate: date,
      localDate: date,
      localTime: time,
    };
  }
  return conversionFromInstant(instant, iana, result.status, date);
}

function invalidConversion(iana: string): ZuluConversion {
  return {
    instant: new Date(NaN),
    zuluDate: '',
    zuluTime: '',
    zuluTime12: '',
    localDate: '',
    localTime: '',
    localTime12: '',
    offsetLabel: '',
    offsetMinutes: 0,
    abbreviation: '',
    iana,
    dstActive: false,
    status: 'invalid',
    dayDelta: 0,
  };
}

export function conversionFromInstant(
  instant: Date,
  iana: string,
  status: ZuluConversion['status'],
  referenceDate: string,
): ZuluConversion {
  const zone = ianaZoneDef(iana);
  const zulu = instantInZone(instant, UTC_ZONE);
  const local = instantInZone(instant, zone);
  return {
    instant,
    zuluDate: zulu.date,
    zuluTime: zulu.time,
    zuluTime12: zulu.time12,
    localDate: local.date,
    localTime: local.time,
    localTime12: local.time12,
    offsetLabel: local.offsetLabel,
    offsetMinutes: local.offsetMinutes,
    abbreviation: local.abbreviation,
    iana: zone.iana ?? 'UTC',
    dstActive: zone.iana ? isDaylightSaving(instant, zone.iana) : false,
    status,
    dayDelta: calendarDayDelta(referenceDate, local.date),
  };
}

export function shareResultText(input: {
  dateLabel: string;
  country?: string;
  iana: string;
  zulu: string;
  local: string;
  offset: string;
  dst: string;
}): string {
  return [
    'Zulu Time Converter',
    'Omega Calculators',
    '',
    `Date: ${input.dateLabel}`,
    '',
    'Selected Country:',
    input.country ?? '—',
    '',
    'Time Zone:',
    input.iana,
    '',
    'Zulu Time:',
    input.zulu,
    '',
    'Local Time:',
    input.local,
    '',
    'UTC Offset:',
    input.offset,
    '',
    'Daylight Saving Time:',
    input.dst,
  ].join('\n');
}

export function sourceDate(conversion: ZuluConversion, source: ClockSource): string {
  return source === 'local' ? conversion.localDate : conversion.zuluDate;
}
