import { isSupportedCurrency } from '@/tools/shared/currency';
import { calculateBusinessValuation } from './calculation';
import {
  CASH_FLOW_SCALES,
  VALUATION_METHODS,
  type BusinessValuationFieldErrors,
  type BusinessValuationInput,
  type BusinessValuationResult,
} from './types';

function finite(value: number): boolean {
  return Number.isFinite(value);
}

function requireNonNeg(
  errors: BusinessValuationFieldErrors,
  key: string,
  value: number,
  label: string,
  allowZero = true
): boolean {
  if (!finite(value)) return false;
  if (value < 0) {
    errors[key] = `${label} cannot be negative`;
    return true;
  }
  if (!allowZero && value === 0) {
    errors[key] = `${label} must be greater than zero`;
    return true;
  }
  return true;
}

export function validateBusinessValuation(input: BusinessValuationInput): {
  isValid: boolean;
  incomplete: boolean;
  errors: BusinessValuationFieldErrors;
  result: BusinessValuationResult | null;
} {
  const errors: BusinessValuationFieldErrors = {};

  if (!VALUATION_METHODS.includes(input.method)) {
    errors.method = 'Choose a valuation method';
  }
  if (!isSupportedCurrency(input.currency)) errors.currency = 'Choose a supported currency';

  let anyBlank = false;

  switch (input.method) {
    case 'dcf': {
      if (!CASH_FLOW_SCALES.includes(input.cashFlowScale)) {
        errors.cashFlowScale = 'Choose a cash flow scale';
      }
      if (!finite(input.cashFlow)) anyBlank = true;
      else requireNonNeg(errors, 'cashFlow', input.cashFlow, 'Cash flow');

      if (!finite(input.projectionYears)) anyBlank = true;
      else if (input.projectionYears < 0) {
        errors.projectionYears = 'Projection period cannot be negative';
      } else if (input.projectionYears > 200) {
        errors.projectionYears = 'Projection period must be 200 years or fewer';
      }

      if (!finite(input.discountRatePercent)) anyBlank = true;
      else if (input.discountRatePercent < 0) {
        errors.discountRatePercent = 'Discount rate cannot be negative';
      } else if (input.discountRatePercent / 100 <= -1) {
        errors.discountRatePercent = 'Discount rate is invalid';
      }
      break;
    }
    case 'asset-based': {
      if (!finite(input.totalAssets)) anyBlank = true;
      else requireNonNeg(errors, 'totalAssets', input.totalAssets, 'Total assets');
      if (!finite(input.totalLiabilities)) anyBlank = true;
      else requireNonNeg(errors, 'totalLiabilities', input.totalLiabilities, 'Total liabilities');
      break;
    }
    case 'market-cap': {
      if (!finite(input.sharePrice)) anyBlank = true;
      else requireNonNeg(errors, 'sharePrice', input.sharePrice, 'Share price');
      if (!finite(input.sharesOutstanding)) anyBlank = true;
      else requireNonNeg(errors, 'sharesOutstanding', input.sharesOutstanding, 'Shares outstanding');
      break;
    }
    case 'multiples': {
      if (!finite(input.financialMetric)) anyBlank = true;
      else requireNonNeg(errors, 'financialMetric', input.financialMetric, 'Financial metric');
      if (!finite(input.valuationMultiple)) anyBlank = true;
      else requireNonNeg(errors, 'valuationMultiple', input.valuationMultiple, 'Valuation multiple');
      break;
    }
  }

  if (anyBlank || Object.keys(errors).length > 0) {
    return {
      isValid: false,
      incomplete: anyBlank && Object.keys(errors).length === 0,
      errors,
      result: null,
    };
  }

  const result = calculateBusinessValuation(input);
  if (!result) {
    errors.form = 'This combination does not produce a finite valuation.';
    return { isValid: false, incomplete: false, errors, result: null };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}
