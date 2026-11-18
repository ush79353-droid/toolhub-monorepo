import type { DecimalValue } from '../billion-to-trillion/types';
import {
  divideByInt,
  formatPlain,
  isZero,
  multiplyByInt,
  normalize,
  parseDecimalString,
} from '../billion-to-trillion/calculation';
import type { DurationField, HmsParts } from './types';
import { DISPLAY_FRAC_DIGITS } from './types';

export { parseDecimalString, formatPlain, isZero };

const ZERO: DecimalValue = { sign: 1, digits: '0', exp: 0 };
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_MINUTE = 60;
const US_PER_SECOND = 1_000_000n;
const US_PER_MINUTE = 60_000_000n;
const US_PER_HOUR = 3_600_000_000n;

export function formatDurationDisplay(value: DecimalValue): string {
  return formatPlain(value, DISPLAY_FRAC_DIGITS);
}

export function toSeconds(value: DecimalValue, field: DurationField): DecimalValue {
  if (field === 'hours') return multiplyByInt(value, SECONDS_PER_HOUR);
  if (field === 'minutes') return multiplyByInt(value, SECONDS_PER_MINUTE);
  return normalize(value);
}

export function fromSeconds(seconds: DecimalValue, field: DurationField): DecimalValue {
  if (field === 'hours') return divideByInt(seconds, SECONDS_PER_HOUR);
  if (field === 'minutes') return divideByInt(seconds, SECONDS_PER_MINUTE);
  return normalize(seconds);
}

function toAbsMicroseconds(value: DecimalValue): bigint {
  const abs = { ...value, sign: 1 as const };
  if (isZero(abs)) return 0n;
  let big = BigInt(abs.digits);
  let exp = abs.exp;
  const target = -6;
  while (exp > target) {
    big *= 10n;
    exp -= 1;
  }
  while (exp < target) {
    big /= 10n;
    exp += 1;
  }
  return big;
}

function microsecondsToDecimal(us: bigint, sign: 1 | -1): DecimalValue {
  if (us === 0n) return { ...ZERO };
  return normalize({ sign, digits: us.toString(), exp: -6 });
}

export function splitHms(seconds: DecimalValue): HmsParts {
  const sign: 1 | -1 = isZero(seconds) ? 1 : seconds.sign;
  let us = toAbsMicroseconds(seconds);
  const hours = us / US_PER_HOUR;
  us %= US_PER_HOUR;
  const minutes = us / US_PER_MINUTE;
  us %= US_PER_MINUTE;
  const wholeSeconds = us / US_PER_SECOND;
  const fracUs = us % US_PER_SECOND;
  let secondsText = wholeSeconds.toString().padStart(2, '0');
  if (fracUs !== 0n) {
    const frac = fracUs.toString().padStart(6, '0').replace(/0+$/, '');
    secondsText = `${secondsText}.${frac}`;
  }
  return {
    sign,
    hours: hours.toString(),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: secondsText,
  };
}

export function formatHms(parts: HmsParts): string {
  const hours = parts.hours.padStart(2, '0');
  return `${parts.sign < 0 ? '-' : ''}${hours}:${parts.minutes}:${parts.seconds}`;
}

export function combineHms(parts: HmsParts): DecimalValue {
  const hours = parseDecimalString(parts.hours.replace(/^-/, '')) ?? ZERO;
  const minutes = parseDecimalString(parts.minutes) ?? ZERO;
  const seconds = parseDecimalString(parts.seconds) ?? ZERO;
  const totalUs =
    toAbsMicroseconds(toSeconds(hours, 'hours')) +
    toAbsMicroseconds(toSeconds(minutes, 'minutes')) +
    toAbsMicroseconds(seconds);
  return microsecondsToDecimal(totalUs, parts.sign);
}

export function isComponentBelow60(value: DecimalValue): boolean {
  return toAbsMicroseconds(value) < 60n * US_PER_SECOND && value.sign >= 0;
}

export function convertMinutesToHours(minutes: number): number {
  return minutes / 60;
}

export function convertHoursToMinutes(hours: number): number {
  return hours * 60;
}
