import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

const DAYS_PER_YEAR = 365;

/**
 * Classical EOQ = √(2DS / H).
 * D > 0, S > 0, H > 0 required for a positive finite EOQ.
 */
export function calculateEoq(
  demand: number,
  orderCost: number,
  holdingCostPerUnit: number
): number | null {
  if (
    !Number.isFinite(demand) ||
    demand <= 0 ||
    !Number.isFinite(orderCost) ||
    orderCost <= 0 ||
    !Number.isFinite(holdingCostPerUnit) ||
    holdingCostPerUnit <= 0
  ) {
    return null;
  }
  const eoq = Math.sqrt((2 * demand * orderCost) / holdingCostPerUnit);
  return Number.isFinite(eoq) && eoq > 0 ? eoq : null;
}

/** Annual Ordering Cost = (D / Q) × S */
export function calculateAnnualOrderingCost(
  demand: number,
  orderQuantity: number,
  orderCost: number
): number | null {
  if (
    !Number.isFinite(demand) ||
    demand < 0 ||
    !Number.isFinite(orderQuantity) ||
    orderQuantity <= 0 ||
    !Number.isFinite(orderCost) ||
    orderCost < 0
  ) {
    return null;
  }
  const cost = (demand / orderQuantity) * orderCost;
  return Number.isFinite(cost) ? cost : null;
}

/** Annual Holding Cost = (Q / 2) × H */
export function calculateAnnualHoldingCost(
  orderQuantity: number,
  holdingCostPerUnit: number
): number | null {
  if (
    !Number.isFinite(orderQuantity) ||
    orderQuantity < 0 ||
    !Number.isFinite(holdingCostPerUnit) ||
    holdingCostPerUnit < 0
  ) {
    return null;
  }
  const cost = (orderQuantity / 2) * holdingCostPerUnit;
  return Number.isFinite(cost) ? cost : null;
}

/** TC(Q) = (D/Q)S + (Q/2)H */
export function calculateTotalVariableInventoryCost(
  demand: number,
  orderQuantity: number,
  orderCost: number,
  holdingCostPerUnit: number
): number | null {
  const ordering = calculateAnnualOrderingCost(
    demand,
    orderQuantity,
    orderCost
  );
  const holding = calculateAnnualHoldingCost(
    orderQuantity,
    holdingCostPerUnit
  );
  if (ordering === null || holding === null) return null;
  const total = ordering + holding;
  return Number.isFinite(total) ? total : null;
}

/** Orders per year = D / Q */
export function calculateOrdersPerYear(
  demand: number,
  orderQuantity: number
): number | null {
  if (
    !Number.isFinite(demand) ||
    demand < 0 ||
    !Number.isFinite(orderQuantity) ||
    orderQuantity <= 0
  ) {
    return null;
  }
  const n = demand / orderQuantity;
  return Number.isFinite(n) ? n : null;
}

/** Days between orders = (EOQ / D) × daysPerYear */
export function calculateDaysBetweenOrders(
  orderQuantity: number,
  demand: number,
  daysPerYear: number = DAYS_PER_YEAR
): number | null {
  if (
    !Number.isFinite(orderQuantity) ||
    orderQuantity < 0 ||
    !Number.isFinite(demand) ||
    demand <= 0 ||
    !Number.isFinite(daysPerYear) ||
    daysPerYear <= 0
  ) {
    return null;
  }
  const days = (orderQuantity / demand) * daysPerYear;
  return Number.isFinite(days) ? days : null;
}

/** Average cycle inventory = EOQ / 2 (no safety stock). */
export function calculateAverageCycleInventory(
  orderQuantity: number
): number | null {
  if (!Number.isFinite(orderQuantity) || orderQuantity < 0) return null;
  const avg = orderQuantity / 2;
  return Number.isFinite(avg) ? avg : null;
}

/**
 * Choose floor/ceil of theoretical EOQ with lower TC(Q).
 * Returns null if EOQ is not positive finite.
 */
export function calculateOptimalIntegerEoq(
  demand: number,
  orderCost: number,
  holdingCostPerUnit: number,
  theoreticalEoq: number
): number | null {
  if (
    !Number.isFinite(theoreticalEoq) ||
    theoreticalEoq <= 0 ||
    !Number.isFinite(demand) ||
    demand <= 0
  ) {
    return null;
  }
  const floorQ = Math.floor(theoreticalEoq);
  const ceilQ = Math.ceil(theoreticalEoq);
  const candidates = Array.from(
    new Set([floorQ, ceilQ].filter((q) => q >= 1))
  );
  if (candidates.length === 0) return 1;

  let best = candidates[0]!;
  let bestCost = calculateTotalVariableInventoryCost(
    demand,
    best,
    orderCost,
    holdingCostPerUnit
  );
  for (const q of candidates.slice(1)) {
    const cost = calculateTotalVariableInventoryCost(
      demand,
      q,
      orderCost,
      holdingCostPerUnit
    );
    if (
      cost !== null &&
      (bestCost === null || cost < bestCost - 1e-12)
    ) {
      best = q;
      bestCost = cost;
    }
  }
  return best;
}

export function interpretEoq(
  eoq: number,
  practical: number,
  unitLabel: string
): string {
  if (!Number.isFinite(eoq) || eoq <= 0) {
    return 'Economic order quantity could not be determined from the inputs.';
  }
  return `Under the classical EOQ model, the theoretical order quantity is about ${formatQuantity(eoq)} ${unitLabel} per order. A practical whole-unit quantity near ${formatQuantity(practical)} ${unitLabel} balances annual ordering and holding costs when demand, order cost, and holding cost are constant and quantity discounts are ignored.`;
}

export function formatEoqMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatQuantity(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(value);
}

export function formatOrdersPerYear(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDays(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export { DAYS_PER_YEAR };
