import { buildCaresActUnemploymentNoticeSummary } from './calculation';
import {
  UNEMPLOYMENT_CALCULATOR_HREF,
  type CaresActUnemploymentBenefitFieldErrors,
  type CaresActUnemploymentBenefitInput,
  type CaresActUnemploymentBenefitResult,
} from './types';

export interface CaresActUnemploymentBenefitValidation {
  isValid: boolean;
  errors: CaresActUnemploymentBenefitFieldErrors;
  result: CaresActUnemploymentBenefitResult | null;
}

/**
 * Informational tool: always valid. No payout fields to check.
 */
export function validateCaresActUnemploymentBenefitInput(
  _input: CaresActUnemploymentBenefitInput,
  title = 'Unemployment Benefit Calculator - CARES Act'
): CaresActUnemploymentBenefitValidation {
  const result: CaresActUnemploymentBenefitResult = {
    summaryText: buildCaresActUnemploymentNoticeSummary(title),
    unemploymentCalculatorHref: UNEMPLOYMENT_CALCULATOR_HREF,
  };
  return { isValid: true, errors: {}, result };
}
