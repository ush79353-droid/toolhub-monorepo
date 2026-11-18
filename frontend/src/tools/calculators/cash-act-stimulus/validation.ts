import {
  calculateCashActStimulus,
  formatCashActUsd,
} from './calculation';
import type {
  CashActStimulusFieldErrors,
  CashActStimulusInput,
  CashActStimulusResult,
} from './types';

export interface CashActStimulusValidation {
  isValid: boolean;
  errors: CashActStimulusFieldErrors;
  result: CashActStimulusResult | null;
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

export function validateCashActStimulusInput(
  input: CashActStimulusInput
): CashActStimulusValidation {
  const errors: CashActStimulusFieldErrors = {};

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

  const under17 = parseNonNegInt(input.dependentsUnder17);
  if (!under17.blank) {
    if (under17.invalid || under17.value === null) {
      errors.dependentsUnder17 = 'Enter a whole number of dependents under 17.';
    } else if (under17.value < 0) {
      errors.dependentsUnder17 = 'Dependents under 17 cannot be negative.';
    } else if (
      dependents.value !== null &&
      !dependents.invalid &&
      under17.value > dependents.value
    ) {
      errors.dependentsUnder17 =
        'Dependents under 17 cannot exceed total dependents.';
    }
  }

  const agi = parseMoney(input.agi);
  if (agi.blank) {
    // Empty AGI → no result yet (matches screenshot empty result).
  } else if (agi.invalid || agi.value === null) {
    errors.agi = 'Enter a valid 2019 AGI in USD.';
  } else if (agi.value < 0) {
    errors.agi = 'AGI cannot be negative.';
  }

  if (Object.keys(errors).length > 0 || agi.blank) {
    return { isValid: false, errors, result: null };
  }

  const calc = calculateCashActStimulus({
    filed2019Taxes: input.filed2019Taxes === 'yes',
    filingStatus: input.filingStatus,
    dependents: dependents.value!,
    dependentsUnder17: under17.blank ? null : under17.value,
    agi: agi.value!,
  });

  if (!calc) {
    errors.form = 'This combination does not produce a finite estimate.';
    return { isValid: false, errors, result: null };
  }

  const result: CashActStimulusResult = {
    paymentUsd: calc.paymentUsd,
    formattedPayment: formatCashActUsd(calc.paymentUsd),
    baseAmount: calc.baseAmount,
    dependentAmount: calc.dependentAmount,
    phaseoutReduction: calc.phaseoutReduction,
    phaseoutThreshold: calc.phaseoutThreshold,
    enactedPaymentUsd: calc.enactedPaymentUsd,
    formattedEnactedPayment: formatCashActUsd(calc.enactedPaymentUsd),
    additionalUsd: calc.additionalUsd,
    formattedAdditional: formatCashActUsd(calc.additionalUsd),
    ineligibleNoFiling: calc.ineligibleNoFiling,
    hasAdditionalComparison: calc.hasAdditionalComparison,
    isHistoricalHypothetical: true,
  };

  return { isValid: true, errors: {}, result };
}
