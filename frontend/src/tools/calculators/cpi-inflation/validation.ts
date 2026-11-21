import {
  US_CPI_BASE,
  US_CPI_MAX_YEAR,
  US_CPI_MIN_YEAR,
  US_CPI_RETRIEVED_AT,
  US_CPI_SERIES_ID,
  US_CPI_SOURCE_NAME,
  US_CPI_SOURCE_URL,
  getUsCpiForYear,
} from '@/tools/calculators/buying-power/us-cpi-u-annual';
import {
  calculateCpiInflation,
  explainCpiInflation,
  formatCpiIndex,
  formatPercent,
  formatUsd,
  interpretCpiChange,
} from './calculation';
import type {
  CpiInflationFieldErrors,
  CpiInflationInput,
  CpiInflationResult,
} from './types';

export interface CpiInflationValidation {
  isValid: boolean;
  errors: CpiInflationFieldErrors;
  result: CpiInflationResult | null;
}

function parseFinite(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '').replace(/^\$/, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

function parseYear(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim();
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (!/^\d{4}$/.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isInteger(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

const SOURCE_SUMMARY = `${US_CPI_SOURCE_NAME} · ${US_CPI_SERIES_ID} · CPI-U annual average · ${US_CPI_BASE} · ${US_CPI_MIN_YEAR}–${US_CPI_MAX_YEAR} · retrieved ${US_CPI_RETRIEVED_AT} · ${US_CPI_SOURCE_URL}`;

export function validateCpiInflationInput(
  input: CpiInflationInput
): CpiInflationValidation {
  const errors: CpiInflationFieldErrors = {};
  let hasError = false;

  const amount = parseFinite(input.amount);
  if (amount.blank) {
    errors.amount = 'Please enter a valid amount.';
    hasError = true;
  } else if (amount.invalid || amount.value === null) {
    errors.amount = 'Please enter a valid amount.';
    hasError = true;
  } else if (amount.value < 0) {
    errors.amount = 'Amount cannot be negative.';
    hasError = true;
  }

  let baseCPI: number | null = null;
  let targetCPI: number | null = null;
  let baseYear: number | null = null;
  let targetYear: number | null = null;
  let yearsSpan: number | null = null;

  if (input.mode === 'historical') {
    const by = parseYear(input.baseYear);
    if (by.blank) {
      errors.baseYear = 'Select a base year.';
      hasError = true;
    } else if (by.invalid || by.value === null || !getUsCpiForYear(by.value)) {
      errors.baseYear = 'No CPI data is available for the selected year.';
      hasError = true;
    } else {
      baseYear = by.value;
      baseCPI = getUsCpiForYear(by.value)!.annualAverageCPI;
    }

    const ty = parseYear(input.targetYear);
    if (ty.blank) {
      errors.targetYear = 'Select a target year.';
      hasError = true;
    } else if (ty.invalid || ty.value === null || !getUsCpiForYear(ty.value)) {
      errors.targetYear = 'No CPI data is available for the selected year.';
      hasError = true;
    } else {
      targetYear = ty.value;
      targetCPI = getUsCpiForYear(ty.value)!.annualAverageCPI;
    }
  } else {
    const b = parseFinite(input.baseCPI);
    if (b.blank) {
      errors.baseCPI = 'Enter base CPI.';
      hasError = true;
    } else if (b.invalid || b.value === null) {
      errors.baseCPI = 'Both CPI values must be greater than zero.';
      hasError = true;
    } else if (b.value <= 0) {
      errors.baseCPI = 'Both CPI values must be greater than zero.';
      hasError = true;
    } else {
      baseCPI = b.value;
    }

    const t = parseFinite(input.targetCPI);
    if (t.blank) {
      errors.targetCPI = 'Enter target CPI.';
      hasError = true;
    } else if (t.invalid || t.value === null) {
      errors.targetCPI = 'Both CPI values must be greater than zero.';
      hasError = true;
    } else if (t.value <= 0) {
      errors.targetCPI = 'Both CPI values must be greater than zero.';
      hasError = true;
    } else {
      targetCPI = t.value;
    }

    const span = parseFinite(input.yearsSpan);
    if (span.blank) {
      // Optional for equivalent/cumulative; required for annualized
      yearsSpan = null;
    } else if (span.invalid || span.value === null) {
      errors.yearsSpan = 'Enter a valid number of years.';
      hasError = true;
    } else if (span.value <= 0) {
      errors.yearsSpan =
        'Average annual inflation requires a positive number of years.';
      hasError = true;
    } else {
      yearsSpan = span.value;
    }
  }

  if (
    hasError ||
    amount.value === null ||
    baseCPI === null ||
    targetCPI === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateCpiInflation(
    amount.value,
    baseCPI,
    targetCPI,
    baseYear,
    targetYear,
    yearsSpan
  );
  if (!math) {
    errors.form = 'Unable to calculate CPI inflation for the selected inputs.';
    return { isValid: false, errors, result: null };
  }

  if (
    input.mode === 'custom' &&
    yearsSpan == null &&
    math.averageAnnualInflationPercent == null
  ) {
    // Valid without annualized rate
  }

  const baseLabel =
    baseYear != null ? String(baseYear) : `CPI ${formatCpiIndex(baseCPI)}`;
  const targetLabel =
    targetYear != null
      ? String(targetYear)
      : `CPI ${formatCpiIndex(targetCPI)}`;

  const result: CpiInflationResult = {
    equivalentValue: math.equivalentValue,
    cumulativeInflationPercent: math.cumulativeInflationPercent,
    averageAnnualInflationPercent: math.averageAnnualInflationPercent,
    purchasingPowerChangePercent: math.purchasingPowerChangePercent,
    baseCPI,
    targetCPI,
    baseYear,
    targetYear,
    yearsSpan,
    sameYear: math.sameYear,
    formattedEquivalentValue: formatUsd(math.equivalentValue),
    formattedCumulativeInflation: formatPercent(math.cumulativeInflationPercent),
    formattedAverageAnnualInflation:
      math.averageAnnualInflationPercent == null
        ? 'N/A'
        : formatPercent(math.averageAnnualInflationPercent),
    formattedPurchasingPowerChange: formatPercent(
      math.purchasingPowerChangePercent
    ),
    formattedBaseCPI: formatCpiIndex(baseCPI),
    formattedTargetCPI: formatCpiIndex(targetCPI),
    interpretation: interpretCpiChange(
      math.cumulativeInflationPercent,
      math.sameYear
    ),
    explanation: explainCpiInflation(
      amount.value,
      math.equivalentValue,
      baseLabel,
      targetLabel
    ),
    sourceSummary:
      input.mode === 'historical'
        ? SOURCE_SUMMARY
        : 'Custom CPI mode: ensure both index values come from the same compatible series. Unrelated country or base indexes must not be mixed.',
  };

  return { isValid: true, errors, result };
}
