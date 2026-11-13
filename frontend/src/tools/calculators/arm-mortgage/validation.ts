import { isSupportedCurrency } from '@/tools/shared/currency';
import { ARM_STRUCTURES, RATE_SCENARIOS, structureTiming, type ArmFieldErrors, type ArmMortgageInput } from './types';

function finite(n: number): boolean {
  return Number.isFinite(n);
}

export function validateArmInput(input: ArmMortgageInput): { isValid: boolean; errors: ArmFieldErrors } {
  const errors: ArmFieldErrors = {};

  if (!finite(input.principal) || input.principal <= 0) {
    errors.principal = 'Mortgage amount must be greater than zero';
  }
  if (!finite(input.termYears) || input.termYears < 1 || input.termYears > 40 || !Number.isInteger(input.termYears)) {
    errors.termYears = 'Loan term must be a whole number of years from 1 to 40';
  }
  if (!finite(input.initialAnnualRate) || input.initialAnnualRate < 0 || input.initialAnnualRate > 30) {
    errors.initialAnnualRate = 'Initial rate must be between 0% and 30%';
  }
  if (!ARM_STRUCTURES.includes(input.structure)) {
    errors.structure = 'Choose a supported ARM structure';
  } else if (finite(input.termYears)) {
    const { fixedMonths } = structureTiming(input.structure);
    if (fixedMonths > input.termYears * 12) {
      errors.structure = 'The fixed period cannot be longer than the loan term';
    }
  }
  if (!RATE_SCENARIOS.includes(input.scenario)) {
    errors.scenario = 'Choose a rate scenario';
  }
  if (!finite(input.projectedAnnualRate) || input.projectedAnnualRate < 0 || input.projectedAnnualRate > 30) {
    errors.projectedAnnualRate = 'Projected rate must be between 0% and 30%';
  }
  if (!finite(input.scenarioStepPercent) || input.scenarioStepPercent < 0 || input.scenarioStepPercent > 5) {
    errors.scenarioStepPercent = 'Scenario step must be between 0 and 5 percentage points';
  }
  if (input.useIndexMargin) {
    if (!finite(input.indexRate) || input.indexRate < 0 || input.indexRate > 30) {
      errors.indexRate = 'Index rate must be between 0% and 30%';
    }
    if (!finite(input.margin) || input.margin < 0 || input.margin > 10) {
      errors.margin = 'Margin must be between 0 and 10 percentage points';
    }
  }
  for (const [key, value, label] of [
    ['initialCap', input.initialCap, 'Initial cap'],
    ['subsequentCap', input.subsequentCap, 'Subsequent cap'],
    ['lifetimeCap', input.lifetimeCap, 'Lifetime cap'],
  ] as const) {
    if (!finite(value) || value < 0 || value > 20) {
      errors[key] = `${label} must be between 0 and 20 percentage points`;
    }
  }
  if (input.rateFloor !== null && (!finite(input.rateFloor) || input.rateFloor < 0 || input.rateFloor > 30)) {
    errors.rateFloor = 'Rate floor must be between 0% and 30%, or left blank';
  }
  if (
    input.rateFloor !== null &&
    finite(input.initialAnnualRate) &&
    input.rateFloor > input.initialAnnualRate + input.lifetimeCap
  ) {
    errors.rateFloor = 'Rate floor cannot sit above the lifetime maximum rate';
  }
  for (const [key, value, label] of [
    ['propertyTaxMonthly', input.propertyTaxMonthly, 'Property tax'],
    ['insuranceMonthly', input.insuranceMonthly, 'Insurance'],
    ['hoaMonthly', input.hoaMonthly, 'HOA'],
    ['mortgageInsuranceMonthly', input.mortgageInsuranceMonthly, 'Mortgage insurance'],
  ] as const) {
    if (!finite(value) || value < 0) errors[key] = `${label} cannot be negative`;
  }
  if (!isSupportedCurrency(input.currency)) errors.currency = 'Choose a supported currency';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.startDate)) errors.startDate = 'Enter a valid start date';

  return { isValid: Object.keys(errors).length === 0, errors };
}
