import type { DecimalValue } from '../billion-to-trillion/types';
import {
  divideByInt,
  formatGrouped,
  formatPlain,
  isZero,
  multiplyByInt,
  parseDecimalString,
} from '../billion-to-trillion/calculation';
import {
  DISPLAY_FRAC_DIGITS,
  MAIN_TIME_UNITS,
  TIME_UNIT_DEFS,
  TIME_UNIT_RATIO,
  TIME_UNIT_SECONDS,
  type ExtraTimeUnit,
  type MainTimeUnit,
  type TimeUnit,
} from './types';

export { parseDecimalString, formatPlain, formatGrouped, isZero, TIME_UNIT_SECONDS };
export type { TimeUnit };

export function convertTime(value: number, from: TimeUnit, to: TimeUnit): number {
  return (value * TIME_UNIT_SECONDS[from]) / TIME_UNIT_SECONDS[to];
}

export function toSeconds(value: DecimalValue, unit: TimeUnit): DecimalValue {
  const { num, den } = TIME_UNIT_RATIO[unit];
  const scaled = multiplyByInt(value, num);
  return den === 1 ? scaled : divideByInt(scaled, den);
}

export function fromSeconds(seconds: DecimalValue, unit: TimeUnit): DecimalValue {
  const { num, den } = TIME_UNIT_RATIO[unit];
  const scaled = den === 1 ? seconds : multiplyByInt(seconds, den);
  return num === 1 ? scaled : divideByInt(scaled, num);
}

export function formatTimeValue(value: DecimalValue): string {
  return formatPlain(value, DISPLAY_FRAC_DIGITS);
}

export function formatTimeGrouped(value: DecimalValue): string {
  return formatGrouped(value);
}

export function convertString(value: string, from: TimeUnit, to: TimeUnit): string {
  const parsed = parseDecimalString(value);
  if (!parsed) throw new Error('Please enter a valid finite number.');
  if (from === to) return formatTimeValue(parsed);
  return formatTimeValue(fromSeconds(toSeconds(parsed, from), to));
}

export function shareResultText(inputLabel: string, rows: readonly { unit: TimeUnit; value: string }[]): string {
  const lines = [
    'Time Unit Converter',
    'Omega Calculators',
    '',
    'Input:',
    inputLabel,
    '',
    'Results:',
  ];
  for (const row of rows) {
    lines.push(`${TIME_UNIT_DEFS[row.unit].label}: ${row.value}`);
  }
  lines.push(
    '',
    'Conversion convention:',
    '1 average year = 365.25 days',
    '1 average month = 30.4375 days',
  );
  return lines.join('\n');
}

export function mainUnitRows(seconds: DecimalValue): { unit: MainTimeUnit; value: string }[] {
  return MAIN_TIME_UNITS.map((unit) => ({
    unit,
    value: formatTimeGrouped(fromSeconds(seconds, unit)),
  }));
}

export function extraUnitRows(
  seconds: DecimalValue,
  extras: readonly ExtraTimeUnit[],
): { unit: ExtraTimeUnit; value: string }[] {
  return extras.map((unit) => ({
    unit,
    value: formatTimeGrouped(fromSeconds(seconds, unit)),
  }));
}
