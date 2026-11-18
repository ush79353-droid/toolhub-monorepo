import { MONTHS_PER_YEAR, type MonthsToYearsInput, type MonthsToYearsResult } from './types';

export { MONTHS_PER_YEAR };

export function formatDuration(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e12)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e');
  }
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 10;
  else digits = 12;
  return String(Number(value.toFixed(digits)));
}

export function monthsToYears(months: number): number {
  return months / MONTHS_PER_YEAR;
}

export function yearsToMonths(years: number): number {
  return years * MONTHS_PER_YEAR;
}

/**
 * Split total months into whole years + remainder.
 * Remainder stays in (-12, 12); both parts share the same sign for negative totals
 * (no mixed-sign breakdowns).
 */
export function monthsToYearsMonths(totalMonths: number): { years: number; months: number } {
  if (!Number.isFinite(totalMonths) || totalMonths === 0) {
    return { years: 0, months: 0 };
  }
  let years = Math.trunc(totalMonths / MONTHS_PER_YEAR);
  let months = totalMonths - years * MONTHS_PER_YEAR;
  if (months >= MONTHS_PER_YEAR - 1e-12) {
    years += 1;
    months = 0;
  } else if (months <= -(MONTHS_PER_YEAR - 1e-12)) {
    years -= 1;
    months = 0;
  }
  return { years, months };
}

export function yearsMonthsToMonths(years: number, months: number): number {
  return years * MONTHS_PER_YEAR + months;
}

export function normalizeYearsMonths(
  years: number,
  months: number,
): { years: number; months: number } {
  return monthsToYearsMonths(yearsMonthsToMonths(years, months));
}

export function calculateMonthsToYears(input: MonthsToYearsInput): MonthsToYearsResult {
  let months: number;
  let years: number;

  if (input.source === 'months') {
    months = input.months!;
    years = monthsToYears(months);
  } else if (input.source === 'years') {
    years = input.years!;
    months = yearsToMonths(years);
  } else {
    months = yearsMonthsToMonths(input.yearsPart ?? 0, input.monthsPart ?? 0);
    years = monthsToYears(months);
  }

  const { years: yearsPart, months: monthsPart } = monthsToYearsMonths(months);
  const mixedLabel = `${formatDuration(yearsPart)} yr ${formatDuration(monthsPart)} mo`;

  const explanation =
    input.source === 'months'
      ? `${formatDuration(months)} mo ÷ ${MONTHS_PER_YEAR} = ${formatDuration(years)} yr`
      : input.source === 'years'
        ? `${formatDuration(years)} yr × ${MONTHS_PER_YEAR} = ${formatDuration(months)} mo`
        : `${mixedLabel} → ${formatDuration(months)} mo = ${formatDuration(years)} yr`;

  return {
    source: input.source,
    months,
    years,
    yearsPart,
    monthsPart,
    mixedLabel,
    explanation,
  };
}

export function shareResultText(result: MonthsToYearsResult): string {
  return [
    'Months to Years Calculator — Omega Calculators',
    '',
    `${formatDuration(result.months)} months = ${formatDuration(result.years)} years`,
    `= ${formatDuration(result.yearsPart)} years and ${formatDuration(result.monthsPart)} months`,
    '',
    '/tools/months-to-years-calculator',
  ].join('\n');
}
