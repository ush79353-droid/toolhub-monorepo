import { calculateBidensTaxPlan, formatRatePct, formatUsd } from './calculation';
import type {
  BidensTaxPlanFieldErrors,
  BidensTaxPlanInput,
  BidensTaxPlanResult,
} from './types';

export interface BidensTaxPlanValidation {
  isValid: boolean;
  errors: BidensTaxPlanFieldErrors;
  result: BidensTaxPlanResult | null;
}

function parseNonNegInt(raw: string): {
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
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

function parseMoney(raw: string): {
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

function parseAge(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim();
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function validateBidensTaxPlanInput(
  input: BidensTaxPlanInput
): BidensTaxPlanValidation {
  const errors: BidensTaxPlanFieldErrors = {};

  const age = parseAge(input.age);
  if (!age.blank) {
    if (age.invalid || age.value === null) {
      errors.age = 'Enter a whole-number age, or leave blank.';
    } else if (age.value < 0) {
      errors.age = 'Age cannot be negative.';
    } else if (age.value > 120) {
      errors.age = 'Enter an age of 120 or less.';
    }
  }

  const agi = parseMoney(input.agi);
  if (agi.blank) {
    // Empty AGI → wait for input (screenshot starts blank).
  } else if (agi.invalid || agi.value === null) {
    errors.agi = 'Enter a valid annual AGI in USD.';
  } else if (agi.value < 0) {
    errors.agi = 'AGI cannot be negative.';
  } else if (agi.value > 1_000_000_000) {
    errors.agi = 'Enter an AGI of $1,000,000,000 or less.';
  }

  const under6 = parseNonNegInt(input.childrenUnder6);
  if (under6.blank) {
    errors.childrenUnder6 = 'Enter children under 6 (or 0).';
  } else if (under6.invalid || under6.value === null || under6.value < 0) {
    errors.childrenUnder6 = 'Enter a whole number of children under 6.';
  } else if (under6.value > 99) {
    errors.childrenUnder6 = 'Enter at most 99 children under 6.';
  }

  const ages6to17 = parseNonNegInt(input.children6to17);
  if (ages6to17.blank) {
    errors.children6to17 = 'Enter children ages 6–17 (or 0).';
  } else if (ages6to17.invalid || ages6to17.value === null || ages6to17.value < 0) {
    errors.children6to17 = 'Enter a whole number of children ages 6–17.';
  } else if (ages6to17.value > 99) {
    errors.children6to17 = 'Enter at most 99 children ages 6–17.';
  }

  const dependents = parseNonNegInt(input.dependents);
  if (dependents.blank) {
    errors.dependents = 'Enter other dependents (or 0).';
  } else if (dependents.invalid || dependents.value === null || dependents.value < 0) {
    errors.dependents = 'Enter a whole number of other dependents.';
  } else if (dependents.value > 99) {
    errors.dependents = 'Enter at most 99 other dependents.';
  }

  if (Object.keys(errors).length > 0 || agi.blank) {
    return { isValid: false, errors, result: null };
  }

  const calc = calculateBidensTaxPlan({
    age: age.blank ? null : age.value,
    agi: agi.value!,
    filingStatus: input.filingStatus,
    childrenUnder6: under6.value!,
    children6to17: ages6to17.value!,
    dependents: dependents.value!,
  });

  if (!calc) {
    errors.form = 'This combination does not produce a finite estimate.';
    return { isValid: false, errors, result: null };
  }

  const result: BidensTaxPlanResult = {
    baselineTaxUsd: calc.baselineTaxUsd,
    bidenTaxUsd: calc.bidenTaxUsd,
    baselineEffectiveRatePct: calc.baselineEffectiveRatePct,
    bidenEffectiveRatePct: calc.bidenEffectiveRatePct,
    formattedBaselineTax: formatUsd(calc.baselineTaxUsd),
    formattedBidenTax: formatUsd(calc.bidenTaxUsd),
    formattedBaselineRate: formatRatePct(calc.baselineEffectiveRatePct),
    formattedBidenRate: formatRatePct(calc.bidenEffectiveRatePct),
    baselineTaxableIncome: calc.baselineTaxableIncome,
    bidenTaxableIncome: calc.bidenTaxableIncome,
    isHistoricalEstimate: true,
  };

  return { isValid: true, errors: {}, result };
}
