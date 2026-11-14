import { buildWebsiteAdRevenueResult } from './calculation';
import type {
  WebsiteAdRevenueFieldErrors,
  WebsiteAdRevenueInput,
  WebsiteAdRevenueResult,
} from './types';

function isBlank(value: number): boolean {
  return !Number.isFinite(value);
}

export function validateWebsiteAdRevenue(input: WebsiteAdRevenueInput): {
  isValid: boolean;
  errors: WebsiteAdRevenueFieldErrors;
  result: WebsiteAdRevenueResult | null;
} {
  const errors: WebsiteAdRevenueFieldErrors = {};

  if (!isBlank(input.visits) && input.visits < 0) {
    errors.visits = 'Visits cannot be negative';
  }

  if (!isBlank(input.pageViewsPerVisit) && input.pageViewsPerVisit < 0) {
    errors.pageViewsPerVisit = 'Page views per visit cannot be negative';
  }

  if (!isBlank(input.pageRpm) && input.pageRpm < 0) {
    errors.pageRpm = 'Page RPM cannot be negative';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = buildWebsiteAdRevenueResult(
    input.visits,
    input.pageViewsPerVisit,
    input.pageRpm,
    input.currency
  );

  const hasAnyOutput = result.pageViews !== null || result.revenue !== null;
  return { isValid: hasAnyOutput, errors, result: hasAnyOutput ? result : null };
}
