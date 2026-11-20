import {
  calculateAverageVariableCost,
  calculateTotalOutput,
  calculateVariableCosts,
  formatAvcMoney,
  formatAvcQuantity,
  formatCostPerUnit,
} from './calculation';
import type {
  AverageVariableCostFieldErrors,
  AverageVariableCostInput,
  AverageVariableCostResult,
  AvcStatus,
} from './types';

export interface AverageVariableCostValidation {
  isValid: boolean;
  errors: AverageVariableCostFieldErrors;
  result: AverageVariableCostResult | null;
}

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
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function validateAverageVariableCostInput(
  input: AverageVariableCostInput
): AverageVariableCostValidation {
  const errors: AverageVariableCostFieldErrors = {};
  const currency = input.currency;
  const outputUnit = input.outputUnit || 'units';

  const vcParsed = parseNumber(input.variableCosts);
  const qParsed = parseNumber(input.totalOutput);
  const avcParsed = parseNumber(input.averageVariableCost);

  if (!vcParsed.blank) {
    if (vcParsed.invalid || vcParsed.value === null) {
      errors.variableCosts = 'Enter a valid variable cost amount.';
    } else if (vcParsed.value < 0) {
      errors.variableCosts = 'Variable costs cannot be negative.';
    }
  }

  if (!qParsed.blank) {
    if (qParsed.invalid || qParsed.value === null) {
      errors.totalOutput = 'Enter a valid total output.';
    } else if (qParsed.value < 0) {
      errors.totalOutput = 'Total output cannot be negative.';
    } else if (
      input.mode === 'averageVariableCost' &&
      qParsed.value === 0
    ) {
      errors.totalOutput =
        'Total output must be greater than zero to calculate AVC.';
    } else if (input.mode === 'variableCosts' && qParsed.value === 0) {
      errors.totalOutput =
        'Total output must be greater than zero to calculate variable costs.';
    }
  }

  if (!avcParsed.blank) {
    if (avcParsed.invalid || avcParsed.value === null) {
      errors.averageVariableCost = 'Enter a valid average variable cost.';
    } else if (avcParsed.value < 0) {
      errors.averageVariableCost = 'Average variable cost cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  let variableCosts = 0;
  let totalOutput = 0;
  let averageVariableCost = 0;
  let status: AvcStatus = 'incomplete';
  let warningMessage: string | null = null;
  let ready = false;

  if (input.mode === 'averageVariableCost') {
    if (
      !vcParsed.blank &&
      !qParsed.blank &&
      vcParsed.value !== null &&
      qParsed.value !== null
    ) {
      if (qParsed.value === 0) {
        status = 'zeroDenominator';
        warningMessage =
          'Average variable cost is undefined when total output is zero.';
        return { isValid: false, errors, result: null };
      }
      const avc = calculateAverageVariableCost(vcParsed.value, qParsed.value);
      if (avc === null) {
        return { isValid: false, errors, result: null };
      }
      variableCosts = vcParsed.value;
      totalOutput = qParsed.value;
      averageVariableCost = avc;
      status = 'valid';
      ready = true;
    }
  } else if (input.mode === 'variableCosts') {
    if (
      !avcParsed.blank &&
      !qParsed.blank &&
      avcParsed.value !== null &&
      qParsed.value !== null
    ) {
      const vc = calculateVariableCosts(avcParsed.value, qParsed.value);
      if (vc === null) {
        return { isValid: false, errors, result: null };
      }
      variableCosts = vc;
      totalOutput = qParsed.value;
      averageVariableCost = avcParsed.value;
      status = 'valid';
      ready = true;
    }
  } else {
    // totalOutput mode
    if (
      !vcParsed.blank &&
      !avcParsed.blank &&
      vcParsed.value !== null &&
      avcParsed.value !== null
    ) {
      if (vcParsed.value === 0 && avcParsed.value === 0) {
        status = 'nonUnique';
        warningMessage =
          'When both variable costs and AVC are zero, total output is not uniquely determined.';
        return {
          isValid: false,
          errors: {
            form: warningMessage,
          },
          result: null,
        };
      }
      if (avcParsed.value === 0) {
        status = 'zeroDenominator';
        warningMessage =
          'Total output is undefined when average variable cost is zero and variable costs are positive.';
        return {
          isValid: false,
          errors: {
            averageVariableCost: warningMessage,
          },
          result: null,
        };
      }
      const q = calculateTotalOutput(vcParsed.value, avcParsed.value);
      if (q === null) {
        return { isValid: false, errors, result: null };
      }
      variableCosts = vcParsed.value;
      totalOutput = q;
      averageVariableCost = avcParsed.value;
      status = 'valid';
      ready = true;
    }
  }

  if (!ready) {
    return { isValid: false, errors, result: null };
  }

  const result: AverageVariableCostResult = {
    variableCosts,
    totalOutput,
    averageVariableCost,
    status,
    warningMessage,
    currency,
    outputUnit,
    formattedVariableCosts: formatAvcMoney(variableCosts, currency),
    formattedTotalOutput: formatAvcQuantity(totalOutput),
    formattedAverageVariableCost: formatAvcMoney(
      averageVariableCost,
      currency
    ),
    formattedAverageVariableCostPerUnit: formatCostPerUnit(
      averageVariableCost,
      currency,
      outputUnit
    ),
  };

  return { isValid: true, errors, result };
}
