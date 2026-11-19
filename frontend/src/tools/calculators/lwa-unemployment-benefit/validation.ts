import { buildLwaUnemploymentNoticeSummary } from './calculation';
import {
  LOAN_CALCULATOR_HREF,
  type LwaUnemploymentBenefitFieldErrors,
  type LwaUnemploymentBenefitInput,
  type LwaUnemploymentBenefitResult,
} from './types';

export interface LwaUnemploymentBenefitValidation {
  isValid: boolean;
  errors: LwaUnemploymentBenefitFieldErrors;
  result: LwaUnemploymentBenefitResult | null;
}

/**
 * Informational tool: always valid. No payout fields to check.
 */
export function validateLwaUnemploymentBenefitInput(
  _input: LwaUnemploymentBenefitInput,
  title = 'Unemployment Benefit Calculator - Lost Wages Assistance (LWA)'
): LwaUnemploymentBenefitValidation {
  const result: LwaUnemploymentBenefitResult = {
    summaryText: buildLwaUnemploymentNoticeSummary(title),
    loanCalculatorHref: LOAN_CALCULATOR_HREF,
  };
  return { isValid: true, errors: {}, result };
}
