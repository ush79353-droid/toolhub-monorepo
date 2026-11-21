import {
  calculateConstantElasticity,
  calculateImpliedMarginalRevenue,
  calculateMidpointElasticity,
  calculateOptimalPrice,
  calculateOptimalQuantity,
  calculateProfitAtPrice,
  formatElasticity,
  formatOpMoney,
  formatQuantity,
  interpretOptimalPrice,
} from './calculation';
import type {
  OptimalPriceFieldErrors,
  OptimalPriceInput,
  OptimalPriceResult,
  OptimalPriceStatus,
} from './types';

export interface OptimalPriceValidation {
  isValid: boolean;
  errors: OptimalPriceFieldErrors;
  result: OptimalPriceResult | null;
}

const MR_TOLERANCE = 1e-6;

function parseNum(raw: string): {
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

export function validateOptimalPriceInput(
  input: OptimalPriceInput
): OptimalPriceValidation {
  const errors: OptimalPriceFieldErrors = {};
  const currency = input.currency;

  const mc = parseNum(input.marginalCost);
  const mr = parseNum(input.marginalRevenue);
  const p1 = parseNum(input.initialPrice);
  const q1 = parseNum(input.initialQuantity);
  const p2 = parseNum(input.finalPrice);
  const q2 = parseNum(input.finalQuantity);

  if (!mc.blank) {
    if (mc.invalid || mc.value === null) {
      errors.marginalCost = 'Enter a valid marginal cost.';
    } else if (mc.value < 0) {
      errors.marginalCost = 'Marginal cost cannot be negative.';
    }
  }
  if (!mr.blank) {
    if (mr.invalid || mr.value === null) {
      errors.marginalRevenue = 'Enter a valid marginal revenue.';
    }
  }
  if (!p1.blank) {
    if (p1.invalid || p1.value === null) {
      errors.initialPrice = 'Enter a valid initial price.';
    } else if (p1.value <= 0) {
      errors.initialPrice = 'Initial price must be greater than zero.';
    }
  }
  if (!q1.blank) {
    if (q1.invalid || q1.value === null) {
      errors.initialQuantity = 'Enter a valid initial quantity.';
    } else if (q1.value < 0) {
      errors.initialQuantity = 'Quantity cannot be negative.';
    } else if (q1.value === 0) {
      errors.initialQuantity =
        'Constant-elasticity calibration requires a positive initial quantity.';
    }
  }
  if (!p2.blank) {
    if (p2.invalid || p2.value === null) {
      errors.finalPrice = 'Enter a valid final price.';
    } else if (p2.value <= 0) {
      errors.finalPrice = 'Final price must be greater than zero.';
    }
  }
  if (!q2.blank) {
    if (q2.invalid || q2.value === null) {
      errors.finalQuantity = 'Enter a valid final quantity.';
    } else if (q2.value < 0) {
      errors.finalQuantity = 'Quantity cannot be negative.';
    } else if (q2.value === 0) {
      errors.finalQuantity =
        'Constant-elasticity calibration requires a positive final quantity.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  // Required for full result: MC + P1,Q1,P2,Q2 (MR optional)
  if (
    mc.blank ||
    p1.blank ||
    q1.blank ||
    p2.blank ||
    q2.blank ||
    mc.value === null ||
    p1.value === null ||
    q1.value === null ||
    p2.value === null ||
    q2.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  if (p1.value === p2.value) {
    return {
      isValid: false,
      errors: {
        finalPrice:
          'Initial and final prices must differ to estimate demand elasticity.',
      },
      result: null,
    };
  }

  const constantElasticity = calculateConstantElasticity(
    p1.value,
    q1.value,
    p2.value,
    q2.value
  );
  if (constantElasticity === null) {
    return {
      isValid: false,
      errors: { form: 'Unable to calibrate constant-elasticity demand.' },
      result: null,
    };
  }

  const midpointElasticity = calculateMidpointElasticity(
    p1.value,
    q1.value,
    p2.value,
    q2.value
  );

  const profitAtInitial = calculateProfitAtPrice(
    p1.value,
    q1.value,
    mc.value
  );
  const profitAtFinal = calculateProfitAtPrice(p2.value, q2.value, mc.value);
  if (profitAtInitial === null || profitAtFinal === null) {
    return { isValid: false, errors, result: null };
  }

  const optimalPrice = calculateOptimalPrice(mc.value, constantElasticity);
  const optimalQuantity =
    optimalPrice === null
      ? null
      : calculateOptimalQuantity(
          p1.value,
          q1.value,
          optimalPrice,
          constantElasticity
        );
  const profitAtOptimal =
    optimalPrice !== null && optimalQuantity !== null
      ? calculateProfitAtPrice(optimalPrice, optimalQuantity, mc.value)
      : null;

  const impliedMr = calculateImpliedMarginalRevenue(
    p1.value,
    constantElasticity
  );

  let status: OptimalPriceStatus =
    optimalPrice !== null &&
    optimalQuantity !== null &&
    profitAtOptimal !== null
      ? 'valid'
      : 'noFiniteOptimum';

  let warningMessage: string | null =
    'Constant-elasticity demand calibrated with ln(Q2/Q1)/ln(P2/P1). Midpoint elasticity is shown for comparison only. Profits assume zero fixed costs and constant MC. Currency labels do not convert amounts.';

  if (mc.value === 0) {
    status = 'noFiniteOptimum';
    warningMessage =
      'Zero marginal cost; no positive finite interior optimum from the standard markup condition.';
  } else if (constantElasticity >= -1) {
    status = 'noFiniteOptimum';
    warningMessage =
      constantElasticity >= 0
        ? 'Observed elasticity is not strictly less than −1: the default downward-sloping markup model does not support a finite interior optimum.'
        : 'Elasticity is unit or inelastic (|ε| ≤ 1); no finite positive interior optimum under unrestricted constant-elasticity demand with positive MC.';
  }

  const observedMr = mr.blank || mr.value === null ? null : mr.value;
  if (
    observedMr !== null &&
    impliedMr !== null &&
    Math.abs(observedMr - impliedMr) > MR_TOLERANCE
  ) {
    if (status === 'valid') status = 'mrInconsistent';
    warningMessage = `Entered marginal revenue (${formatOpMoney(observedMr, currency)}) differs from MR implied at the initial price (${formatOpMoney(impliedMr, currency)}). MR varies along the demand curve; conflicting values are not mixed into the optimum.`;
  }

  const result: OptimalPriceResult = {
    marginalCost: mc.value,
    marginalRevenue: observedMr,
    initialPrice: p1.value,
    initialQuantity: q1.value,
    finalPrice: p2.value,
    finalQuantity: q2.value,
    constantElasticity,
    midpointElasticity,
    impliedMarginalRevenueAtInitial: impliedMr,
    optimalPrice,
    optimalQuantity,
    profitAtInitial,
    profitAtFinal,
    profitAtOptimal,
    status,
    interpretation: interpretOptimalPrice(
      status === 'noFiniteOptimum' ? 'noFiniteOptimum' : 'valid',
      constantElasticity,
      mc.value,
      optimalPrice,
      profitAtOptimal,
      profitAtInitial,
      profitAtFinal
    ),
    warningMessage,
    currency,
    formattedMarginalCost: formatOpMoney(mc.value, currency),
    formattedMarginalRevenue:
      observedMr === null ? null : formatOpMoney(observedMr, currency),
    formattedInitialPrice: formatOpMoney(p1.value, currency),
    formattedFinalPrice: formatOpMoney(p2.value, currency),
    formattedConstantElasticity: formatElasticity(constantElasticity),
    formattedMidpointElasticity:
      midpointElasticity === null
        ? null
        : formatElasticity(midpointElasticity),
    formattedImpliedMr:
      impliedMr === null ? null : formatOpMoney(impliedMr, currency),
    formattedOptimalPrice:
      optimalPrice === null ? null : formatOpMoney(optimalPrice, currency),
    formattedOptimalQuantity:
      optimalQuantity === null ? null : formatQuantity(optimalQuantity),
    formattedProfitAtInitial: formatOpMoney(profitAtInitial, currency),
    formattedProfitAtFinal: formatOpMoney(profitAtFinal, currency),
    formattedProfitAtOptimal:
      profitAtOptimal === null
        ? null
        : formatOpMoney(profitAtOptimal, currency),
  };

  return {
    isValid: status === 'valid' || status === 'mrInconsistent',
    errors,
    result,
  };
}
