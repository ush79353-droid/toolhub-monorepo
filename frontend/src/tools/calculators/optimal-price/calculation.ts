import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Midpoint (arc) PED — descriptive estimate. */
export function calculateMidpointElasticity(
  initialPrice: number,
  initialQuantity: number,
  finalPrice: number,
  finalQuantity: number
): number | null {
  if (
    ![initialPrice, initialQuantity, finalPrice, finalQuantity].every(
      Number.isFinite
    ) ||
    initialPrice <= 0 ||
    finalPrice <= 0 ||
    initialQuantity < 0 ||
    finalQuantity < 0 ||
    initialPrice === finalPrice
  ) {
    return null;
  }
  const avgQ = (initialQuantity + finalQuantity) / 2;
  const avgP = (initialPrice + finalPrice) / 2;
  if (avgQ <= 0 || avgP <= 0) return null;
  const ped =
    (finalQuantity - initialQuantity) / avgQ / ((finalPrice - initialPrice) / avgP);
  return Number.isFinite(ped) ? ped : null;
}

/**
 * Constant-elasticity calibration: ε = ln(Q2/Q1) / ln(P2/P1).
 * All four values must be strictly positive; prices must differ.
 */
export function calculateConstantElasticity(
  initialPrice: number,
  initialQuantity: number,
  finalPrice: number,
  finalQuantity: number
): number | null {
  if (
    ![initialPrice, initialQuantity, finalPrice, finalQuantity].every(
      Number.isFinite
    ) ||
    initialPrice <= 0 ||
    initialQuantity <= 0 ||
    finalPrice <= 0 ||
    finalQuantity <= 0 ||
    initialPrice === finalPrice
  ) {
    return null;
  }
  const elasticity =
    Math.log(finalQuantity / initialQuantity) /
    Math.log(finalPrice / initialPrice);
  return Number.isFinite(elasticity) ? elasticity : null;
}

/**
 * Optimal price under constant MC and constant elasticity:
 * P* = MC × ε / (ε + 1)  when MC > 0 and ε < −1.
 */
export function calculateOptimalPrice(
  marginalCost: number,
  elasticity: number
): number | null {
  if (
    !Number.isFinite(marginalCost) ||
    !Number.isFinite(elasticity) ||
    marginalCost <= 0 ||
    elasticity >= -1
  ) {
    return null;
  }
  const price = marginalCost * (elasticity / (elasticity + 1));
  if (!Number.isFinite(price) || price <= 0) return null;
  return price;
}

/** Q* = Q0 * (P_star / P0) ^ elasticity */
export function calculateOptimalQuantity(
  initialPrice: number,
  initialQuantity: number,
  optimalPrice: number,
  elasticity: number
): number | null {
  if (
    !Number.isFinite(initialPrice) ||
    !Number.isFinite(initialQuantity) ||
    !Number.isFinite(optimalPrice) ||
    !Number.isFinite(elasticity) ||
    initialPrice <= 0 ||
    initialQuantity <= 0 ||
    optimalPrice <= 0
  ) {
    return null;
  }
  const quantity =
    initialQuantity * Math.pow(optimalPrice / initialPrice, elasticity);
  if (!Number.isFinite(quantity) || quantity < 0) return null;
  return quantity;
}

/** Contribution (profit before fixed costs): (P − MC) × Q */
export function calculateProfitAtPrice(
  price: number,
  quantity: number,
  marginalCost: number
): number | null {
  if (
    !Number.isFinite(price) ||
    !Number.isFinite(quantity) ||
    !Number.isFinite(marginalCost) ||
    price < 0 ||
    quantity < 0 ||
    marginalCost < 0
  ) {
    return null;
  }
  const profit = (price - marginalCost) * quantity;
  return Number.isFinite(profit) ? profit : null;
}

/** MR = P × (1 + 1/ε) when ε ≠ 0 and P > 0 */
export function calculateImpliedMarginalRevenue(
  price: number,
  elasticity: number
): number | null {
  if (
    !Number.isFinite(price) ||
    !Number.isFinite(elasticity) ||
    price <= 0 ||
    elasticity === 0
  ) {
    return null;
  }
  const mr = price * (1 + 1 / elasticity);
  return Number.isFinite(mr) ? mr : null;
}

export function interpretOptimalPrice(
  status: 'valid' | 'noFiniteOptimum',
  elasticity: number,
  marginalCost: number,
  optimalPrice: number | null,
  profitOptimal: number | null,
  profitInitial: number,
  profitFinal: number
): string {
  if (status === 'noFiniteOptimum') {
    if (marginalCost <= 0) {
      return 'No positive finite interior optimum — the standard markup formula requires positive marginal cost.';
    }
    if (elasticity >= -1 && elasticity < 0) {
      return 'No finite positive interior optimum under constant-elasticity demand with positive MC when |ε| ≤ 1 (unit or inelastic).';
    }
    if (elasticity >= 0) {
      return 'Unsupported by the default downward-sloping demand model — observed elasticity is not strictly less than −1.';
    }
    return 'No valid finite interior optimum under the model assumptions.';
  }
  if (optimalPrice === null || profitOptimal === null) {
    return 'Unable to compute an optimal price for these inputs.';
  }
  const best =
    profitOptimal >= profitInitial && profitOptimal >= profitFinal
      ? 'highest among the three compared prices'
      : 'model optimum (compare carefully with observed points)';
  return `Under constant elasticity ≈ ${formatElasticity(elasticity)} and constant MC, the interior optimum is ${formatPlain(optimalPrice)} with estimated contribution ${formatPlain(profitOptimal)} — ${best}. Fixed costs are assumed zero.`;
}

export function formatOpMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatElasticity(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
    signDisplay: 'exceptZero',
  }).format(value);
}

export function formatQuantity(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(value);
}

function formatPlain(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
