import {
  calculateAnnualHoldingCost,
  calculateAnnualOrderingCost,
  calculateAverageCycleInventory,
  calculateDaysBetweenOrders,
  calculateEoq,
  calculateOptimalIntegerEoq,
  calculateOrdersPerYear,
  calculateTotalVariableInventoryCost,
  formatDays,
  formatEoqMoney,
  formatOrdersPerYear,
  formatQuantity,
  interpretEoq,
} from './calculation';
import {
  INVENTORY_UNITS,
  type EoqFieldErrors,
  type EoqInput,
  type EoqResult,
  type InventoryUnit,
} from './types';

export interface EoqValidation {
  isValid: boolean;
  errors: EoqFieldErrors;
  result: EoqResult | null;
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

function unitLabel(unit: InventoryUnit): string {
  return INVENTORY_UNITS.find((u) => u.value === unit)?.label ?? unit;
}

export function validateEoqInput(input: EoqInput): EoqValidation {
  const errors: EoqFieldErrors = {};
  const currency = input.currency;
  const unit = input.inventoryUnit;

  const demand = parseNumber(input.yearlyDemand);
  const orderCost = parseNumber(input.orderCost);
  const holding = parseNumber(input.annualHoldingCostPerUnit);

  if (!demand.blank) {
    if (demand.invalid || demand.value === null) {
      errors.yearlyDemand = 'Enter a valid yearly demand.';
    } else if (demand.value < 0) {
      errors.yearlyDemand = 'Yearly demand cannot be negative.';
    } else if (demand.value === 0) {
      errors.yearlyDemand =
        'Yearly demand must be greater than zero for a positive EOQ.';
    }
  }
  if (!orderCost.blank) {
    if (orderCost.invalid || orderCost.value === null) {
      errors.orderCost = 'Enter a valid order cost.';
    } else if (orderCost.value < 0) {
      errors.orderCost = 'Order cost cannot be negative.';
    } else if (orderCost.value === 0) {
      errors.orderCost =
        'Order cost must be greater than zero for a positive classical EOQ.';
    }
  }
  if (!holding.blank) {
    if (holding.invalid || holding.value === null) {
      errors.annualHoldingCostPerUnit =
        'Enter a valid yearly holding cost per unit.';
    } else if (holding.value < 0) {
      errors.annualHoldingCostPerUnit =
        'Yearly holding cost cannot be negative.';
    } else if (holding.value === 0) {
      errors.annualHoldingCostPerUnit =
        'Holding cost of zero makes EOQ undefined under the classical model (order size would be unbounded).';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    demand.blank ||
    orderCost.blank ||
    holding.blank ||
    demand.value === null ||
    orderCost.value === null ||
    holding.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const eoq = calculateEoq(demand.value, orderCost.value, holding.value);
  if (eoq === null) {
    return { isValid: false, errors, result: null };
  }

  const practical =
    calculateOptimalIntegerEoq(
      demand.value,
      orderCost.value,
      holding.value,
      eoq
    ) ?? Math.max(1, Math.round(eoq));

  const annualOrdering = calculateAnnualOrderingCost(
    demand.value,
    eoq,
    orderCost.value
  );
  const annualHolding = calculateAnnualHoldingCost(eoq, holding.value);
  const total = calculateTotalVariableInventoryCost(
    demand.value,
    eoq,
    orderCost.value,
    holding.value
  );
  const ordersPerYear = calculateOrdersPerYear(demand.value, eoq);
  const avgInventory = calculateAverageCycleInventory(eoq);
  const daysBetween = calculateDaysBetweenOrders(eoq, demand.value);

  if (
    annualOrdering === null ||
    annualHolding === null ||
    total === null ||
    ordersPerYear === null ||
    avgInventory === null ||
    daysBetween === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const label = unitLabel(unit);
  const result: EoqResult = {
    yearlyDemand: demand.value,
    orderCost: orderCost.value,
    annualHoldingCostPerUnit: holding.value,
    economicOrderQuantity: eoq,
    practicalOrderQuantity: practical,
    annualOrderingCost: annualOrdering,
    annualHoldingCost: annualHolding,
    totalAnnualVariableCost: total,
    ordersPerYear,
    averageCycleInventory: avgInventory,
    daysBetweenOrders: daysBetween,
    status: 'valid',
    interpretation: interpretEoq(eoq, practical, label),
    warningMessage:
      'Classical EOQ assumes constant demand, fixed order cost, constant holding cost per unit, no planned stockouts, and no quantity discounts. Changing the inventory unit label does not convert quantities.',
    currency,
    inventoryUnit: unit,
    formattedYearlyDemand: formatQuantity(demand.value),
    formattedOrderCost: formatEoqMoney(orderCost.value, currency),
    formattedAnnualHoldingCostPerUnit: formatEoqMoney(holding.value, currency),
    formattedEconomicOrderQuantity: formatQuantity(eoq),
    formattedPracticalOrderQuantity: formatQuantity(practical),
    formattedAnnualOrderingCost: formatEoqMoney(annualOrdering, currency),
    formattedAnnualHoldingCost: formatEoqMoney(annualHolding, currency),
    formattedTotalAnnualVariableCost: formatEoqMoney(total, currency),
    formattedOrdersPerYear: formatOrdersPerYear(ordersPerYear),
    formattedAverageCycleInventory: formatQuantity(avgInventory),
    formattedDaysBetweenOrders: formatDays(daysBetween),
  };

  return { isValid: true, errors, result };
}
