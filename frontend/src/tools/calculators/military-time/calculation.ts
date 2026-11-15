import type { DayPeriod, MilitaryTimeResult, ParsedMilitaryTime, StandardTime } from './types';

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

export function parseMilitaryTime(militaryTime: string): ParsedMilitaryTime {
  const normalized = militaryTime.trim();
  const match = normalized.match(/^(\d{2}):?(\d{2})$/);
  if (!match) {
    throw new Error('Invalid military time format');
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error('Invalid military time');
  }
  return { hours, minutes };
}

export function formatMilitary(hours: number, minutes: number): string {
  return `${pad2(hours)}${pad2(minutes)}`;
}

export function formatTwentyFour(hours: number, minutes: number): string {
  return `${pad2(hours)}:${pad2(minutes)}`;
}

export function formatStandard(hours: number, minutes: number, period: DayPeriod): string {
  return `${hours}:${pad2(minutes)} ${period}`;
}

export function militaryPartsToStandard(hours: number, minutes: number): StandardTime {
  const period: DayPeriod = hours >= 12 ? 'PM' : 'AM';
  const standardHours = hours % 12 || 12;
  return { hours: standardHours, minutes, period };
}

export function militaryToStandard(militaryTime: string): string {
  const { hours, minutes } = parseMilitaryTime(militaryTime);
  const standard = militaryPartsToStandard(hours, minutes);
  return formatStandard(standard.hours, standard.minutes, standard.period);
}

export function standardToMilitary(hours: number, minutes: number, period: DayPeriod): string {
  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 1 ||
    hours > 12 ||
    minutes < 0 ||
    minutes > 59
  ) {
    throw new Error('Invalid standard time');
  }
  let militaryHours = hours % 12;
  if (period === 'PM') {
    militaryHours += 12;
  }
  return formatMilitary(militaryHours, minutes);
}

export function convertFromMilitary(militaryTime: string): MilitaryTimeResult {
  const { hours, minutes } = parseMilitaryTime(militaryTime);
  const standard = militaryPartsToStandard(hours, minutes);
  return {
    military: formatMilitary(hours, minutes),
    standard: formatStandard(standard.hours, standard.minutes, standard.period),
    twentyFour: formatTwentyFour(hours, minutes),
  };
}

export function convertFromStandard(
  hours: number,
  minutes: number,
  period: DayPeriod,
): MilitaryTimeResult {
  const military = standardToMilitary(hours, minutes, period);
  const { hours: mh, minutes: mm } = parseMilitaryTime(military);
  return {
    military,
    standard: formatStandard(hours, minutes, period),
    twentyFour: formatTwentyFour(mh, mm),
  };
}
