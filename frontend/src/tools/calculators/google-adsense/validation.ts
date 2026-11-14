import { buildGoogleAdsenseResult } from './calculation';
import type {
  GoogleAdsenseFieldErrors,
  GoogleAdsenseInput,
  GoogleAdsenseResult,
} from './types';

function isBlank(value: number): boolean {
  return !Number.isFinite(value);
}

export function validateGoogleAdsense(input: GoogleAdsenseInput): {
  isValid: boolean;
  errors: GoogleAdsenseFieldErrors;
  result: GoogleAdsenseResult | null;
} {
  const errors: GoogleAdsenseFieldErrors = {};

  if (!isBlank(input.pageviews) && input.pageviews < 0) {
    errors.pageviews = 'Enter a valid non-negative number of pageviews';
  }

  if (!isBlank(input.adsPerPage) && input.adsPerPage < 0) {
    errors.adsPerPage = 'Enter a valid non-negative number of ads per page';
  }

  if (!isBlank(input.ctrPercent)) {
    if (input.ctrPercent < 0 || input.ctrPercent > 100) {
      errors.ctrPercent = 'CTR must be between 0 and 100';
    }
  }

  if (!isBlank(input.cpc) && input.cpc < 0) {
    errors.cpc = 'Enter a valid non-negative CPC';
  }

  const hasErrors = Object.keys(errors).length > 0;
  if (hasErrors) {
    return { isValid: false, errors, result: null };
  }

  // Always build cascading result; incomplete stages stay blank.
  const result = buildGoogleAdsenseResult(
    input.pageviews,
    input.adsPerPage,
    input.ctrPercent,
    input.cpc,
    input.currency
  );

  const hasAnyOutput =
    result.impressions !== null || result.clicks !== null || result.revenue !== null;

  return { isValid: hasAnyOutput, errors, result: hasAnyOutput ? result : null };
}
