import { isSupportedCurrency } from '@/tools/shared/currency';
import { financingCents } from './calculation';
import {
  ADJUSTMENT_METHODS,
  ARM_STRUCTURES,
  BALANCE_MODES,
  COMPOUNDING_FREQUENCIES,
  DOWN_PAYMENT_MODES,
  RATE_SCENARIOS,
  structureTiming,
  type ArmFieldErrors,
  type ArmMortgageInput,
} from './types';

function finite(n: number): boolean {
  return Number.isFinite(n);
}

function whole(n: number): boolean {
  return finite(n) && Number.isInteger(n);
}

export function validateArmInput(input: ArmMortgageInput): { isValid: boolean; errors: ArmFieldErrors } {
  const errors: ArmFieldErrors = {};

  if (!BALANCE_MODES.includes(input.balanceMode)) {
    errors.balanceMode = 'Choose a valid balance mode';
  }

  if (input.balanceMode === 'balance') {
    if (!finite(input.mortgageBalance) || input.mortgageBalance <= 0) {
      errors.mortgageBalance = 'Mortgage balance must be greater than zero';
    } else if (input.mortgageBalance > 100_000_000) {
      errors.mortgageBalance = 'Mortgage balance cannot exceed 100,000,000';
    }
  } else {
    const money = financingCents(input);
    if (!finite(input.homePrice) || money.priceCents <= 0) {
      errors.homePrice = 'Home price must be greater than zero';
    } else if (input.homePrice > 100_000_000) {
      errors.homePrice = 'Home price cannot exceed 100,000,000';
    }
    if (!DOWN_PAYMENT_MODES.includes(input.downPaymentMode)) {
      errors.downPayment = 'Choose an amount or a percent';
    } else if (!finite(input.downPayment) || input.downPayment < 0) {
      errors.downPayment = 'Down payment cannot be negative';
    } else if (input.downPaymentMode === 'percent' && input.downPayment > 100) {
      errors.downPayment = 'Down payment percent cannot exceed 100';
    } else if (money.downCents < 0) {
      errors.downPayment = 'Down payment cannot be negative';
    } else if (finite(input.homePrice) && money.priceCents > 0 && money.principalCents <= 0) {
      errors.downPayment = 'Down payment must be less than the home price';
    }
  }

  if (!whole(input.termYears) || input.termYears < 1 || input.termYears > 40) {
    errors.termYears = 'Loan term must be a whole number of years from 1 to 40';
  }
  if (!finite(input.initialAnnualRate) || input.initialAnnualRate < 0 || input.initialAnnualRate > 30) {
    errors.initialAnnualRate = 'Initial rate must be between 0% and 30%';
  }
  if (!ARM_STRUCTURES.includes(input.structure)) {
    errors.structure = 'Choose a supported ARM structure';
  } else if (input.structure === 'custom') {
    if (!whole(input.customFixedYears) || input.customFixedYears < 0 || input.customFixedYears > 40) {
      errors.customFixedYears = 'Fixed period must be a whole number of years from 0 to 40';
    }
    if (!whole(input.customAdjustMonths) || input.customAdjustMonths < 1 || input.customAdjustMonths > 120) {
      errors.customAdjustMonths = 'Adjustment frequency must be a whole number of months from 1 to 120';
    }
  }
  if (!errors.structure && !errors.customFixedYears && whole(input.termYears)) {
    const { fixedMonths, adjustEveryMonths } = structureTiming(input);
    if (fixedMonths > input.termYears * 12) {
      errors.structure = 'The fixed period cannot be longer than the loan term';
    }
    if (adjustEveryMonths < 1) {
      errors.customAdjustMonths = 'Adjustment frequency must be at least 1 month';
    }
  }

  if (!ADJUSTMENT_METHODS.includes(input.adjustmentMethod)) {
    errors.adjustmentMethod = 'Choose a valid adjustment configuration method';
  }

  if (input.adjustmentMethod === 'expected-rate') {
    if (!finite(input.expectedAdjustment) || input.expectedAdjustment < 0 || input.expectedAdjustment > 20) {
      errors.expectedAdjustment = 'Expected adjustment must be between 0% and 20%';
    }
    if (!finite(input.rateCap) || input.rateCap < 0 || input.rateCap > 40) {
      errors.rateCap = 'Interest rate cap must be between 0% and 40%';
    }
    if (!finite(input.rateFloor) || input.rateFloor < 0 || input.rateFloor > 40) {
      errors.rateFloor = 'Rate floor must be between 0% and 40%';
    }
    if (finite(input.rateCap) && finite(input.rateFloor) && input.rateCap < input.rateFloor) {
      errors.rateCap = 'Rate cap cannot be lower than the rate floor';
    }
    if (finite(input.periodicCap) && (input.periodicCap < 0 || input.periodicCap > 20)) {
      errors.periodicCap = 'Periodic cap must be between 0% and 20%';
    }
  } else {
    if (!RATE_SCENARIOS.includes(input.scenario)) {
      errors.scenario = 'Choose a rate assumption';
    }
    if (!finite(input.indexRate) || input.indexRate < 0 || input.indexRate > 30) {
      errors.indexRate = 'Expected index must be between 0% and 30%';
    }
    if (!finite(input.margin) || input.margin < 0 || input.margin > 15) {
      errors.margin = 'Margin must be between 0 and 15 percentage points';
    }
    if (
      input.scenario !== 'constant' &&
      (!finite(input.scenarioStepPercent) || input.scenarioStepPercent < 0 || input.scenarioStepPercent > 10)
    ) {
      errors.scenarioStepPercent = 'Scenario step must be between 0 and 10 percentage points';
    }
    for (const [key, value, label] of [
      ['initialCap', input.initialCap, 'Initial adjustment cap'],
      ['subsequentCap', input.subsequentCap, 'Subsequent adjustment cap'],
      ['lifetimeIncreaseCap', input.lifetimeIncreaseCap, 'Lifetime increase cap'],
      ['lifetimeDecreaseCap', input.lifetimeDecreaseCap, 'Lifetime decrease cap'],
    ] as const) {
      if (!finite(value) || value < 0 || value > 20) {
        errors[key] = `${label} must be between 0 and 20 percentage points`;
      }
    }
  }

  if (!COMPOUNDING_FREQUENCIES.includes(input.compounding)) {
    errors.compounding = 'Choose a valid compounding setting';
  }
  if (!finite(input.upfrontFees) || input.upfrontFees < 0) {
    errors.upfrontFees = 'Upfront fees cannot be negative';
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
