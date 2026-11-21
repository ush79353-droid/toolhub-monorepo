import {
  calculateBackEndDTILimit,
  calculateDTIBasedHousingBudget,
  calculateFrontEndDTILimit,
  calculateMonthlyGrossIncome,
  resolveDtiLimits,
  solveFixedBudgetAffordability,
  solveIncomeBasedAffordability,
} from './calculation';
import type {
  CostMode,
  FixedBudgetFieldErrors,
  FixedBudgetInput,
  FixedBudgetResult,
  IncomeBasedInput,
  IncomeBasedResult,
  IncomeFieldErrors,
} from './types';

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

function requireNonNeg(
  raw: string,
  label: string,
  errors: Record<string, string | undefined>,
  key: string,
  allowBlank = false,
  blankDefault?: number
): number | null {
  const parsed = parseNumber(raw);
  if (parsed.blank) {
    if (allowBlank) return blankDefault ?? 0;
    errors[key] = `Enter ${label}.`;
    return null;
  }
  if (parsed.invalid || parsed.value === null) {
    errors[key] = `Enter a valid ${label}.`;
    return null;
  }
  if (parsed.value < 0) {
    errors[key] = `${label} cannot be negative.`;
    return null;
  }
  return parsed.value;
}

function requirePercent0to100(
  raw: string,
  label: string,
  errors: Record<string, string | undefined>,
  key: string
): number | null {
  const v = requireNonNeg(raw, label, errors, key);
  if (v === null) return null;
  if (v > 100) {
    errors[key] = `${label} must be between 0% and 100%.`;
    return null;
  }
  return v;
}

function parseCostValue(
  raw: string,
  mode: CostMode,
  label: string,
  errors: Record<string, string | undefined>,
  key: string
): number | null {
  if (mode === 'annualPercentage') {
    return requirePercent0to100(raw, label, errors, key);
  }
  return requireNonNeg(raw, label, errors, key, true, 0);
}

export function validateIncomeBasedInput(input: IncomeBasedInput): {
  isValid: boolean;
  errors: IncomeFieldErrors;
  result: IncomeBasedResult | null;
} {
  const errors: IncomeFieldErrors = {};

  const income = requireNonNeg(
    input.annualHouseholdIncome,
    'annual household income',
    errors,
    'annualHouseholdIncome'
  );
  const years = requireNonNeg(
    input.mortgageTermYears,
    'mortgage loan term',
    errors,
    'mortgageTermYears'
  );
  if (years !== null && years <= 0) {
    errors.mortgageTermYears = 'Loan term must be greater than zero.';
  }
  const rate = requireNonNeg(
    input.annualInterestRate,
    'interest rate',
    errors,
    'annualInterestRate'
  );
  if (rate !== null && rate > 100) {
    errors.annualInterestRate = 'Interest rate must be 100% or less.';
  }
  const debt = requireNonNeg(
    input.monthlyDebtPayments,
    'monthly debt payback',
    errors,
    'monthlyDebtPayments',
    true,
    0
  );

  let downPaymentValue: number | null = null;
  if (input.downPaymentMode === 'percentage') {
    downPaymentValue = requirePercent0to100(
      input.downPaymentValue,
      'down payment percent',
      errors,
      'downPaymentValue'
    );
  } else {
    downPaymentValue = requireNonNeg(
      input.downPaymentValue,
      'down payment',
      errors,
      'downPaymentValue',
      true,
      0
    );
  }

  const propertyTax = parseCostValue(
    input.propertyTax,
    input.propertyTaxMode,
    'property tax',
    errors,
    'propertyTax'
  );
  const hoaFee = parseCostValue(
    input.hoaFee,
    input.hoaMode,
    'HOA or co-op fee',
    errors,
    'hoaFee'
  );
  const insurance = parseCostValue(
    input.insurance,
    input.insuranceMode,
    'insurance',
    errors,
    'insurance'
  );

  let customFront: number | null = null;
  let customBack: number | null = null;
  if (input.dtiProfile === 'custom') {
    customFront = requirePercent0to100(
      input.customFrontEndDti,
      'front-end DTI',
      errors,
      'customFrontEndDti'
    );
    customBack = requirePercent0to100(
      input.customBackEndDti,
      'back-end DTI',
      errors,
      'customBackEndDti'
    );
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const limits = resolveDtiLimits(input.dtiProfile, customFront, customBack);
  if (
    !limits ||
    income === null ||
    years === null ||
    years <= 0 ||
    rate === null ||
    debt === null ||
    downPaymentValue === null ||
    propertyTax === null ||
    hoaFee === null ||
    insurance === null
  ) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with the current inputs.' },
      result: null,
    };
  }

  const monthlyIncome = calculateMonthlyGrossIncome(income);
  if (!(monthlyIncome > 0)) {
    return {
      isValid: false,
      errors: {
        form: 'Annual income must be greater than zero for a DTI-based estimate.',
      },
      result: null,
    };
  }

  const frontLimit = calculateFrontEndDTILimit(monthlyIncome, limits.front);
  const backLimit = calculateBackEndDTILimit(
    monthlyIncome,
    limits.back,
    debt
  );
  const { budget, binding } = calculateDTIBasedHousingBudget(
    frontLimit,
    backLimit
  );

  const solved = solveIncomeBasedAffordability({
    housingBudget: budget,
    annualInterestRatePercent: rate,
    termMonths: years * 12,
    downPaymentMode: input.downPaymentMode,
    downPaymentValue,
    propertyTax,
    propertyTaxMode: input.propertyTaxMode,
    hoaFee,
    hoaMode: input.hoaMode,
    insurance,
    insuranceMode: input.insuranceMode,
    monthlyIncome,
    monthlyDebt: debt,
    bindingLimit: binding,
    frontEndLimit: frontLimit,
    backEndLimit: backLimit,
    dtiProfile: input.dtiProfile,
    profileNote: limits.note,
    currency: input.currency,
  });

  if (!solved.ok) {
    return {
      isValid: false,
      errors: { form: solved.reason },
      result: null,
    };
  }

  return { isValid: true, errors, result: solved.result };
}

export function validateFixedBudgetInput(input: FixedBudgetInput): {
  isValid: boolean;
  errors: FixedBudgetFieldErrors;
  result: FixedBudgetResult | null;
} {
  const errors: FixedBudgetFieldErrors = {};

  const budget = requireNonNeg(
    input.monthlyHousingBudget,
    'monthly house budget',
    errors,
    'monthlyHousingBudget'
  );
  const years = requireNonNeg(
    input.mortgageTermYears,
    'mortgage loan term',
    errors,
    'mortgageTermYears'
  );
  if (years !== null && years <= 0) {
    errors.mortgageTermYears = 'Loan term must be greater than zero.';
  }
  const rate = requireNonNeg(
    input.annualInterestRate,
    'interest rate',
    errors,
    'annualInterestRate'
  );
  if (rate !== null && rate > 100) {
    errors.annualInterestRate = 'Interest rate must be 100% or less.';
  }

  let downPaymentValue: number | null = null;
  if (input.downPaymentMode === 'percentage') {
    downPaymentValue = requirePercent0to100(
      input.downPaymentValue,
      'down payment percent',
      errors,
      'downPaymentValue'
    );
  } else {
    downPaymentValue = requireNonNeg(
      input.downPaymentValue,
      'down payment',
      errors,
      'downPaymentValue',
      true,
      0
    );
  }

  const propertyTax = parseCostValue(
    input.propertyTax,
    input.propertyTaxMode,
    'property tax',
    errors,
    'propertyTax'
  );
  const hoaFee = parseCostValue(
    input.hoaFee,
    input.hoaMode,
    'HOA or co-op fee',
    errors,
    'hoaFee'
  );
  const insurance = parseCostValue(
    input.insurance,
    input.insuranceMode,
    'insurance',
    errors,
    'insurance'
  );
  const maintenance = parseCostValue(
    input.maintenance,
    input.maintenanceMode,
    'maintenance cost',
    errors,
    'maintenance'
  );

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    budget === null ||
    years === null ||
    years <= 0 ||
    rate === null ||
    downPaymentValue === null ||
    propertyTax === null ||
    hoaFee === null ||
    insurance === null ||
    maintenance === null
  ) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with the current inputs.' },
      result: null,
    };
  }

  const solved = solveFixedBudgetAffordability({
    monthlyHousingBudget: budget,
    annualInterestRatePercent: rate,
    termMonths: years * 12,
    downPaymentMode: input.downPaymentMode,
    downPaymentValue,
    includeTaxesAndFees: input.includeTaxesAndFees,
    propertyTax,
    propertyTaxMode: input.propertyTaxMode,
    hoaFee,
    hoaMode: input.hoaMode,
    insurance,
    insuranceMode: input.insuranceMode,
    maintenance,
    maintenanceMode: input.maintenanceMode,
    currency: input.currency,
  });

  if (!solved.ok) {
    return {
      isValid: false,
      errors: { form: solved.reason },
      result: null,
    };
  }

  return { isValid: true, errors, result: solved.result };
}
