import { buildAustraliaTaxCutsNoticeSummary } from './calculation';
import {
  GST_CALCULATOR_HREF,
  type AustraliaTaxCutsFieldErrors,
  type AustraliaTaxCutsInput,
  type AustraliaTaxCutsResult,
} from './types';

export interface AustraliaTaxCutsValidation {
  isValid: boolean;
  errors: AustraliaTaxCutsFieldErrors;
  result: AustraliaTaxCutsResult | null;
}

/**
 * Informational / unavailable tool: always valid. No tax fields to check.
 */
export function validateAustraliaTaxCutsInput(
  _input: AustraliaTaxCutsInput,
  title = 'Income Tax Cuts Calculator - Australia Federal Budget 2020/21'
): AustraliaTaxCutsValidation {
  const result: AustraliaTaxCutsResult = {
    summaryText: buildAustraliaTaxCutsNoticeSummary(title),
    gstCalculatorHref: GST_CALCULATOR_HREF,
  };
  return { isValid: true, errors: {}, result };
}
