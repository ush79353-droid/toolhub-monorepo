import {
  calculateChildTaxCredit,
  CTC_TAX_YEAR,
  formatCtcUsd,
} from './calculation';
import type {
  ChildTaxCreditFieldErrors,
  ChildTaxCreditInput,
  ChildTaxCreditResult,
} from './types';

export interface ChildTaxCreditValidation {
  isValid: boolean;
  errors: ChildTaxCreditFieldErrors;
  result: ChildTaxCreditResult | null;
}

function parseAgi(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '').replace(/^\$/, '');
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
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  if (!/^\d+$/.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

/**
 * Validates AGI ≥ 0 and child ages 0–120 (integer years); blank ages = not entered.
 * Computes TY 2025 CTC after phaseout. ACTC is never invented from these inputs.
 */
export function validateChildTaxCreditInput(
  input: ChildTaxCreditInput
): ChildTaxCreditValidation {
  const errors: ChildTaxCreditFieldErrors = {};

  const agi = parseAgi(input.agi);
  const child1 = parseAge(input.child1Age);
  const child2 = parseAge(input.child2Age);

  if (!agi.blank && (agi.invalid || agi.value === null)) {
    errors.agi = 'Enter a valid AGI in USD.';
  } else if (agi.value !== null && agi.value < 0) {
    errors.agi = 'AGI must be zero or greater.';
  }

  if (!child1.blank && (child1.invalid || child1.value === null)) {
    errors.child1Age = 'Enter a whole-number age in years.';
  } else if (child1.value !== null && (child1.value < 0 || child1.value > 120)) {
    errors.child1Age = 'Age must be between 0 and 120 years.';
  }

  if (!child2.blank && (child2.invalid || child2.value === null)) {
    errors.child2Age = 'Enter a whole-number age in years.';
  } else if (child2.value !== null && (child2.value < 0 || child2.value > 120)) {
    errors.child2Age = 'Age must be between 0 and 120 years.';
  }

  const incomplete =
    agi.blank ||
    Boolean(errors.agi) ||
    Boolean(errors.child1Age) ||
    Boolean(errors.child2Age);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateChildTaxCredit({
    filingStatus: input.filingStatus,
    agi: agi.value!,
    childAges: [
      child1.blank ? null : child1.value!,
      child2.blank ? null : child2.value!,
    ],
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite credit estimate.';
    return { isValid: false, errors, result: null };
  }

  const result: ChildTaxCreditResult = {
    taxYear: CTC_TAX_YEAR,
    eligibleChildren: computed.eligibleChildren,
    maxCreditBeforePhaseout: computed.maxCreditBeforePhaseout,
    phaseoutThreshold: computed.phaseoutThreshold,
    phaseoutReduction: computed.phaseoutReduction,
    estimatedCredit: computed.estimatedCredit,
    formattedEstimatedCredit: formatCtcUsd(computed.estimatedCredit),
    formattedPhaseoutReduction: formatCtcUsd(computed.phaseoutReduction),
    refundableDeterminable: false,
    refundableNote:
      'Not determinable: Additional Child Tax Credit (ACTC) requires earned income and tax-liability inputs not collected here (Schedule 8812 Part II).',
    assumptionsNote:
      'Educational TY 2025 estimate. Assumes entered children meet §24 / Schedule 8812 dependency, residency, support, relationship, and SSN tests. Ages 0–16 count as under 17; age 17+ do not. Not a guaranteed IRS refund.',
  };

  return { isValid: true, errors, result };
}
