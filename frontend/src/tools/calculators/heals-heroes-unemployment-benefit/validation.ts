import { buildHealsHeroesUnemploymentNoticeSummary } from './calculation';
import {
  ANNUAL_SALARY_CALCULATOR_HREF,
  type HealsHeroesUnemploymentBenefitFieldErrors,
  type HealsHeroesUnemploymentBenefitInput,
  type HealsHeroesUnemploymentBenefitResult,
} from './types';

export interface HealsHeroesUnemploymentBenefitValidation {
  isValid: boolean;
  errors: HealsHeroesUnemploymentBenefitFieldErrors;
  result: HealsHeroesUnemploymentBenefitResult | null;
}

/**
 * Informational tool: always valid. No payout fields to check.
 */
export function validateHealsHeroesUnemploymentBenefitInput(
  _input: HealsHeroesUnemploymentBenefitInput,
  title = 'Unemployment Benefit Calculator - HEALS Act vs. HEROES Act'
): HealsHeroesUnemploymentBenefitValidation {
  const result: HealsHeroesUnemploymentBenefitResult = {
    summaryText: buildHealsHeroesUnemploymentNoticeSummary(title),
    annualSalaryCalculatorHref: ANNUAL_SALARY_CALCULATOR_HREF,
  };
  return { isValid: true, errors: {}, result };
}
