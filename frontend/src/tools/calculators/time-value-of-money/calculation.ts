import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  COMPOUNDING_OPTIONS,
  type CompoundFrequency,
  type MoneySourceField,
  type TimeValueOfMoneyResult,
} from './types';

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function compoundsPerYear(compounding: CompoundFrequency): number {
  return COMPOUNDING_OPTIONS.find((o) => o.value === compounding)?.periodsPerYear ?? 1;
}

export function termToYears(years: number, months: number): number {
  return years + months / 12;
}

/**
 * Growth factor (1 + r/m)^(m×t). Returns null when the compounding base is invalid
 * or the power overflows.
 */
export function growthFactor(
  annualRateDecimal: number,
  m: number,
  termYears: number
): number | null {
  if (!(m > 0) || !Number.isFinite(m) || !Number.isFinite(annualRateDecimal) || !Number.isFinite(termYears)) {
    return null;
  }
  if (termYears < 0) return null;
  const base = 1 + annualRateDecimal / m;
  if (!(base > 0)) return null;
  if (termYears === 0 || annualRateDecimal === 0) return 1;
  const factor = base ** (m * termYears);
  return Number.isFinite(factor) && factor > 0 ? factor : null;
}

export function calculateFutureValue(
  presentValue: number,
  annualRatePercent: number,
  termYears: number,
  m: number
): number | null {
  if (!(presentValue >= 0) || !Number.isFinite(presentValue)) return null;
  const factor = growthFactor(annualRatePercent / 100, m, termYears);
  if (factor === null) return null;
  const fv = presentValue * factor;
  return Number.isFinite(fv) ? fv : null;
}

export function calculatePresentValue(
  futureValue: number,
  annualRatePercent: number,
  termYears: number,
  m: number
): number | null {
  if (!(futureValue >= 0) || !Number.isFinite(futureValue)) return null;
  const factor = growthFactor(annualRatePercent / 100, m, termYears);
  if (factor === null || factor === 0) return null;
  const pv = futureValue / factor;
  return Number.isFinite(pv) ? pv : null;
}

export function calculateTimeValueOfMoney(input: {
  interestRatePercent: number;
  years: number;
  months: number;
  compounding: CompoundFrequency;
  presentValue: number;
  futureValue: number;
  sourceField: MoneySourceField;
  currency: SupportedCurrency;
}): TimeValueOfMoneyResult | null {
  const {
    interestRatePercent,
    years,
    months,
    compounding,
    presentValue,
    futureValue,
    sourceField,
    currency,
  } = input;

  if (
    ![interestRatePercent, years, months, presentValue, futureValue].every(Number.isFinite)
  ) {
    return null;
  }
  if (years < 0 || months < 0) return null;
  if (presentValue < 0 || futureValue < 0) return null;

  const m = compoundsPerYear(compounding);
  const termYears = termToYears(years, months);
  if (!(termYears >= 0) || !Number.isFinite(termYears)) return null;

  let pv = presentValue;
  let fv = futureValue;

  if (sourceField === 'presentValue') {
    const computed = calculateFutureValue(presentValue, interestRatePercent, termYears, m);
    if (computed === null) return null;
    fv = computed;
  } else {
    const computed = calculatePresentValue(futureValue, interestRatePercent, termYears, m);
    if (computed === null) return null;
    pv = computed;
  }

  return {
    interestRatePercent,
    years,
    months,
    termYears,
    compounding,
    compoundsPerYear: m,
    presentValue: pv,
    futureValue: fv,
    sourceField,
    currency,
    formattedPresentValue: formatMoney(pv, currency),
    formattedFutureValue: formatMoney(fv, currency),
  };
}
