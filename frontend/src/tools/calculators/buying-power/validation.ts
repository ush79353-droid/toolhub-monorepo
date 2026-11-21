import {
  calculateBuyingPower,
  explainBuyingPower,
  formatCpiIndex,
  formatPercent,
  formatRatio,
  formatUsd,
  interpretBuyingPower,
} from './calculation';
import type {
  BuyingPowerFieldErrors,
  BuyingPowerInput,
  BuyingPowerResult,
} from './types';
import {
  getUsCpiForYear,
  US_CPI_MAX_YEAR,
  US_CPI_MIN_YEAR,
  US_CPI_RETRIEVED_AT,
  US_CPI_SERIES_ID,
  US_CPI_SOURCE_NAME,
  US_CPI_SOURCE_URL,
} from './us-cpi-u-annual';

export interface BuyingPowerValidation {
  isValid: boolean;
  errors: BuyingPowerFieldErrors;
  result: BuyingPowerResult | null;
}

function parseAmount(raw: string): {
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

export function validateBuyingPowerInput(
  input: BuyingPowerInput
): BuyingPowerValidation {
  const errors: BuyingPowerFieldErrors = {};
  let hasError = false;

  const amount = parseAmount(input.amount);
  if (amount.blank) {
    errors.amount = 'Enter an amount.';
    hasError = true;
  } else if (amount.invalid || amount.value === null) {
    errors.amount = 'Enter a valid amount.';
    hasError = true;
  } else if (amount.value < 0) {
    errors.amount = 'Amount cannot be negative.';
    hasError = true;
  }

  const refYear = parseYear(input.referenceYear);
  if (refYear.blank) {
    errors.referenceYear = 'Select a reference year.';
    hasError = true;
  } else if (refYear.invalid || refYear.value === null) {
    errors.referenceYear = 'Select a valid reference year.';
    hasError = true;
  } else if (
    refYear.value < US_CPI_MIN_YEAR ||
    refYear.value > US_CPI_MAX_YEAR ||
    !getUsCpiForYear(refYear.value)
  ) {
    errors.referenceYear = `Reference year must be between ${US_CPI_MIN_YEAR} and ${US_CPI_MAX_YEAR}.`;
    hasError = true;
  }

  const tgtYear = parseYear(input.targetYear);
  if (tgtYear.blank) {
    errors.targetYear = 'Select a target year.';
    hasError = true;
  } else if (tgtYear.invalid || tgtYear.value === null) {
    errors.targetYear = 'Select a valid target year.';
    hasError = true;
  } else if (
    tgtYear.value < US_CPI_MIN_YEAR ||
    tgtYear.value > US_CPI_MAX_YEAR ||
    !getUsCpiForYear(tgtYear.value)
  ) {
    errors.targetYear = `Target year must be between ${US_CPI_MIN_YEAR} and ${US_CPI_MAX_YEAR}.`;
    hasError = true;
  }

  if (
    hasError ||
    amount.value === null ||
    refYear.value === null ||
    tgtYear.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const refCpi = getUsCpiForYear(refYear.value);
  const tgtCpi = getUsCpiForYear(tgtYear.value);
  if (!refCpi || !tgtCpi) {
    errors.form = 'CPI data is unavailable for one of the selected years.';
    return { isValid: false, errors, result: null };
  }

  const math = calculateBuyingPower(
    amount.value,
    refCpi.annualAverageCPI,
    tgtCpi.annualAverageCPI
  );
  if (!math) {
    errors.form = 'Unable to calculate buying power for the selected inputs.';
    return { isValid: false, errors, result: null };
  }

  const result: BuyingPowerResult = {
    originalAmount: amount.value,
    referenceYear: refYear.value,
    targetYear: tgtYear.value,
    referenceCPI: refCpi.annualAverageCPI,
    targetCPI: tgtCpi.annualAverageCPI,
    cpiRatio: math.cpiRatio,
    adjustedAmount: math.adjustedAmount,
    inflationChangePercent: math.inflationChangePercent,
    purchasingPowerChangePercent: math.purchasingPowerChangePercent,
    referenceDataStatus: refCpi.dataStatus,
    targetDataStatus: tgtCpi.dataStatus,
    formattedOriginalAmount: formatUsd(amount.value),
    formattedAdjustedAmount: formatUsd(math.adjustedAmount),
    formattedReferenceCPI: formatCpiIndex(refCpi.annualAverageCPI),
    formattedTargetCPI: formatCpiIndex(tgtCpi.annualAverageCPI),
    formattedCpiRatio: formatRatio(math.cpiRatio),
    formattedInflationChange: formatPercent(math.inflationChangePercent),
    formattedPurchasingPowerChange: formatPercent(
      math.purchasingPowerChangePercent
    ),
    interpretation: interpretBuyingPower(
      math.inflationChangePercent,
      refYear.value,
      tgtYear.value
    ),
    explanation: explainBuyingPower(
      amount.value,
      math.adjustedAmount,
      refYear.value,
      tgtYear.value
    ),
    sourceSummary: `${US_CPI_SOURCE_NAME} · ${US_CPI_SERIES_ID} · annual average · ${US_CPI_MIN_YEAR}–${US_CPI_MAX_YEAR} · retrieved ${US_CPI_RETRIEVED_AT} · ${US_CPI_SOURCE_URL}`,
  };

  return { isValid: true, errors, result };
}
