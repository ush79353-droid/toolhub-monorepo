import {
  calculateHeroesStimulusPayment,
  formatHeroesUsd,
} from './calculation';
import type {
  HeroesStimulusFieldErrors,
  HeroesStimulusInput,
  HeroesStimulusResult,
} from './types';

export interface HeroesStimulusValidation {
  isValid: boolean;
  errors: HeroesStimulusFieldErrors;
  result: HeroesStimulusResult | null;
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

export function validateHeroesStimulusInput(
  input: HeroesStimulusInput
): HeroesStimulusValidation {
  const errors: HeroesStimulusFieldErrors = {};

  const dependents = parseNonNegInt(input.dependents);
  if (dependents.blank) {
    errors.dependents = 'Enter the number of dependents.';
  } else if (dependents.invalid || dependents.value === null) {
    errors.dependents = 'Enter a whole number of dependents.';
  } else if (dependents.value < 0) {
    errors.dependents = 'Dependents cannot be negative.';
  } else if (dependents.value > 99) {
    errors.dependents = 'Enter at most 99 dependents.';
  }

  const agi = parseMoney(input.agi);
  if (agi.blank) {
    // Empty AGI → no result yet (matches screenshot empty result).
  } else if (agi.invalid || agi.value === null) {
    errors.agi = 'Enter a valid AGI in USD.';
  } else if (agi.value < 0) {
    errors.agi = 'AGI cannot be negative.';
  }

  if (Object.keys(errors).length > 0 || agi.blank) {
    return { isValid: false, errors, result: null };
  }

  const calc = calculateHeroesStimulusPayment({
    filingStatus: input.filingStatus,
    dependents: dependents.value!,
    agi: agi.value!,
  });

  if (!calc) {
    errors.form = 'This combination does not produce a finite estimate.';
    return { isValid: false, errors, result: null };
  }

  const result: HeroesStimulusResult = {
    paymentUsd: calc.paymentUsd,
    formattedPayment: formatHeroesUsd(calc.paymentUsd),
    baseAmount: calc.baseAmount,
    dependentAmount: calc.dependentAmount,
    eligibleDependents: calc.eligibleDependents,
    phaseoutReduction: calc.phaseoutReduction,
    phaseoutThreshold: calc.phaseoutThreshold,
    isHistoricalHypothetical: true,
  };

  return { isValid: true, errors: {}, result };
}
