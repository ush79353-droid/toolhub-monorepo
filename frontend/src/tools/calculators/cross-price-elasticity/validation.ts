import {
  calculateCrossPriceElasticity,
  calculateMidpointDemandChange,
  calculateMidpointPriceChange,
  calculatePercentageDemandChange,
  calculatePercentagePriceChange,
  classifyMagnitude,
  classifyRelationship,
  formatElasticity,
  formatPercentageChange,
  interpretCrossPriceElasticity,
} from './calculation';
import type {
  CrossPriceElasticityFieldErrors,
  CrossPriceElasticityInput,
  CrossPriceElasticityResult,
} from './types';

export interface CrossPriceElasticityValidation {
  isValid: boolean;
  errors: CrossPriceElasticityFieldErrors;
  result: CrossPriceElasticityResult | null;
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

export function validateCrossPriceElasticityInput(
  input: CrossPriceElasticityInput
): CrossPriceElasticityValidation {
  const errors: CrossPriceElasticityFieldErrors = {};
  const currency = input.currency;
  const quantityUnit = input.quantityUnit || 'units';

  const p1 = parseNumber(input.initialPriceA);
  const p2 = parseNumber(input.finalPriceA);
  const q1 = parseNumber(input.initialDemandB);
  const q2 = parseNumber(input.finalDemandB);

  if (!p1.blank) {
    if (p1.invalid || p1.value === null) {
      errors.initialPriceA = 'Enter a valid initial price for Product A.';
    } else if (p1.value < 0) {
      errors.initialPriceA = 'Price cannot be negative.';
    } else if (input.method === 'initialValue' && p1.value === 0) {
      errors.initialPriceA =
        'Initial price must be greater than zero for the initial-value method.';
    }
  }

  if (!p2.blank) {
    if (p2.invalid || p2.value === null) {
      errors.finalPriceA = 'Enter a valid final price for Product A.';
    } else if (p2.value < 0) {
      errors.finalPriceA = 'Price cannot be negative.';
    }
  }

  if (!q1.blank) {
    if (q1.invalid || q1.value === null) {
      errors.initialDemandB = 'Enter a valid initial demand for Product B.';
    } else if (q1.value < 0) {
      errors.initialDemandB = 'Demand cannot be negative.';
    } else if (input.method === 'initialValue' && q1.value === 0) {
      errors.initialDemandB =
        'Initial demand must be greater than zero for the initial-value method.';
    }
  }

  if (!q2.blank) {
    if (q2.invalid || q2.value === null) {
      errors.finalDemandB = 'Enter a valid final demand for Product B.';
    } else if (q2.value < 0) {
      errors.finalDemandB = 'Demand cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    p1.blank ||
    p2.blank ||
    q1.blank ||
    q2.blank ||
    p1.value === null ||
    p2.value === null ||
    q1.value === null ||
    q2.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  let priceChangePercentage: number | null;
  let demandChangePercentage: number | null;

  if (input.method === 'midpoint') {
    priceChangePercentage = calculateMidpointPriceChange(p1.value, p2.value);
    demandChangePercentage = calculateMidpointDemandChange(q1.value, q2.value);
    if (priceChangePercentage === null || demandChangePercentage === null) {
      return {
        isValid: false,
        errors: {
          form:
            'Midpoint percentages are undefined when average price or average demand is zero.',
        },
        result: null,
      };
    }
  } else {
    priceChangePercentage = calculatePercentagePriceChange(p1.value, p2.value);
    demandChangePercentage = calculatePercentageDemandChange(
      q1.value,
      q2.value
    );
    if (priceChangePercentage === null || demandChangePercentage === null) {
      return {
        isValid: false,
        errors: {
          form:
            'Percentage changes are undefined under the initial-value method for these inputs.',
        },
        result: null,
      };
    }
  }

  if (priceChangePercentage === 0) {
    return {
      isValid: false,
      errors: {
        form:
          'Cross-price elasticity is undefined when Product A\'s price does not change. Do not divide by a zero percentage price change.',
      },
      result: null,
    };
  }

  const elasticity = calculateCrossPriceElasticity(
    demandChangePercentage,
    priceChangePercentage
  );
  if (elasticity === null) {
    return { isValid: false, errors, result: null };
  }

  const relationship = classifyRelationship(elasticity);
  const magnitude = classifyMagnitude(elasticity);

  const result: CrossPriceElasticityResult = {
    priceChangePercentage,
    demandChangePercentage,
    elasticity,
    relationship,
    magnitude,
    status: 'valid',
    interpretation: interpretCrossPriceElasticity(
      elasticity,
      relationship,
      magnitude
    ),
    method: input.method,
    currency,
    quantityUnit,
    formattedPriceChangePercentage: formatPercentageChange(
      priceChangePercentage
    ),
    formattedDemandChangePercentage: formatPercentageChange(
      demandChangePercentage
    ),
    formattedElasticity: formatElasticity(elasticity),
  };

  return { isValid: true, errors, result };
}
