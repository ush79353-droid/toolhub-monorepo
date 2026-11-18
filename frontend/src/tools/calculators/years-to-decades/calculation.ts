import type { DecimalValue } from '../billion-to-trillion/types';
import {
  divideByInt,
  formatGrouped,
  formatPlain,
  isZero,
  multiplyByInt,
  parseDecimalString,
} from '../billion-to-trillion/calculation';
import { DISPLAY_FRAC_DIGITS, YEARS_PER_DECADE, type YearsDecadesField } from './types';

export { parseDecimalString, formatPlain, formatGrouped, isZero };

export function yearsToDecades(years: number): number {
  return years / YEARS_PER_DECADE;
}

export function decadesToYears(decades: number): number {
  return decades * YEARS_PER_DECADE;
}

export function toYears(value: DecimalValue, field: YearsDecadesField): DecimalValue {
  return field === 'decades' ? multiplyByInt(value, YEARS_PER_DECADE) : value;
}

export function fromYears(years: DecimalValue, field: YearsDecadesField): DecimalValue {
  return field === 'decades' ? divideByInt(years, YEARS_PER_DECADE) : years;
}

export function formatYearsDecades(value: DecimalValue): string {
  return formatPlain(value, DISPLAY_FRAC_DIGITS);
}

export function formatYearsDecadesGrouped(value: DecimalValue): string {
  return formatGrouped(value);
}

export function convertString(value: string, from: YearsDecadesField, to: YearsDecadesField): string {
  const parsed = parseDecimalString(value);
  if (!parsed) throw new Error('Please enter a valid finite number.');
  if (from === to) return formatYearsDecades(parsed);
  return formatYearsDecades(fromYears(toYears(parsed, from), to));
}

export function shareResultText(years: string, decades: string): string {
  return [
    'Years to Decades Calculator',
    'Omega Calculators',
    '',
    `Years: ${years}`,
    `Decades: ${decades}`,
    '',
    'Formula:',
    'Decades = Years / 10',
    '',
    `${years} years = ${decades} decades`,
  ].join('\n');
}
