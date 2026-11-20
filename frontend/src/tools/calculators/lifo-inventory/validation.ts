import {
  allocateLifoInventory,
  calculateBatchCost,
  calculateGrossProfit,
  calculateGrossProfitMargin,
  calculateRevenue,
  formatLifoMoney,
  formatLifoPercent,
  interpretLifo,
} from './calculation';
import type {
  LifoInventoryFieldErrors,
  LifoInventoryInput,
  LifoInventoryResult,
  LifoInventoryStatus,
} from './types';

export interface LifoInventoryValidation {
  isValid: boolean;
  errors: LifoInventoryFieldErrors;
  result: LifoInventoryResult | null;
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
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

function parseQty(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
  fractional: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') {
    return { value: null, blank: true, invalid: false, fractional: false };
  }
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true, fractional: false };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true, fractional: false };
  }
  if (!Number.isInteger(value)) {
    return { value, blank: false, invalid: false, fractional: true };
  }
  return { value, blank: false, invalid: false, fractional: false };
}

export function validateLifoInventoryInput(
  input: LifoInventoryInput
): LifoInventoryValidation {
  const errors: LifoInventoryFieldErrors = {};
  const currency = input.currency;

  const p1 = parseMoney(input.batch1Price);
  const q1 = parseQty(input.batch1Qty);
  const p2 = parseMoney(input.batch2Price);
  const q2 = parseQty(input.batch2Qty);
  const sold = parseQty(input.unitsSold);
  const sell = parseMoney(input.sellingPrice);

  if (!p1.blank) {
    if (p1.invalid || p1.value === null) {
      errors.batch1Price = 'Enter a valid first-batch unit purchase price.';
    } else if (p1.value < 0) {
      errors.batch1Price = 'Purchase price cannot be negative.';
    }
  }
  if (!q1.blank) {
    if (q1.invalid || q1.value === null) {
      errors.batch1Qty = 'Enter a valid first-batch quantity.';
    } else if (q1.value < 0) {
      errors.batch1Qty = 'Quantity cannot be negative.';
    } else if (q1.fractional) {
      errors.batch1Qty = 'Use whole numbers for unit quantities.';
    }
  }
  if (!p2.blank) {
    if (p2.invalid || p2.value === null) {
      errors.batch2Price = 'Enter a valid second-batch unit purchase price.';
    } else if (p2.value < 0) {
      errors.batch2Price = 'Purchase price cannot be negative.';
    }
  }
  if (!q2.blank) {
    if (q2.invalid || q2.value === null) {
      errors.batch2Qty = 'Enter a valid second-batch quantity.';
    } else if (q2.value < 0) {
      errors.batch2Qty = 'Quantity cannot be negative.';
    } else if (q2.fractional) {
      errors.batch2Qty = 'Use whole numbers for unit quantities.';
    }
  }
  if (!sold.blank) {
    if (sold.invalid || sold.value === null) {
      errors.unitsSold = 'Enter a valid units sold quantity.';
    } else if (sold.value < 0) {
      errors.unitsSold = 'Units sold cannot be negative.';
    } else if (sold.fractional) {
      errors.unitsSold = 'Use whole numbers for units sold.';
    }
  }
  if (!sell.blank) {
    if (sell.invalid || sell.value === null) {
      errors.sellingPrice = 'Enter a valid selling price.';
    } else if (sell.value < 0) {
      errors.sellingPrice = 'Selling price cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    p1.blank ||
    q1.blank ||
    p2.blank ||
    q2.blank ||
    sold.blank ||
    sell.blank ||
    p1.value === null ||
    q1.value === null ||
    p2.value === null ||
    q2.value === null ||
    sold.value === null ||
    sell.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const available = q1.value + q2.value;
  if (sold.value > available) {
    return {
      isValid: false,
      errors: {
        unitsSold: `Units sold cannot exceed the total available inventory of ${available} units.`,
        form: `Units sold cannot exceed the total available inventory of ${available} units.`,
      },
      result: null,
    };
  }

  const batch1Cost = calculateBatchCost(q1.value, p1.value);
  const batch2Cost = calculateBatchCost(q2.value, p2.value);
  if (batch1Cost === null || batch2Cost === null) {
    return { isValid: false, errors, result: null };
  }
  const totalPurchaseCost = batch1Cost + batch2Cost;

  const allocation = allocateLifoInventory(
    q1.value,
    p1.value,
    q2.value,
    p2.value,
    sold.value
  );
  if (allocation === null) {
    return { isValid: false, errors, result: null };
  }

  const revenue = calculateRevenue(sold.value, sell.value);
  if (revenue === null) {
    return { isValid: false, errors, result: null };
  }

  const grossProfit = calculateGrossProfit(revenue, allocation.cogs);
  if (grossProfit === null) {
    return { isValid: false, errors, result: null };
  }

  const grossProfitMargin = calculateGrossProfitMargin(grossProfit, revenue);

  let status: LifoInventoryStatus = 'valid';
  let warningMessage: string | null =
    'LIFO assigns newest purchase costs to COGS first. Amounts share one currency label (no FX conversion). Educational costing model — not a tax or GAAP/IFRS determination.';

  if (revenue === 0) {
    status = 'zeroRevenue';
    warningMessage =
      'Revenue is zero — gross profit margin is unavailable. COGS and ending inventory still follow LIFO when units sold are valid.';
  }

  // Invariant check (defensive)
  const invariantGap = Math.abs(
    allocation.cogs + allocation.endingInventory - totalPurchaseCost
  );
  if (invariantGap > 1e-6) {
    return {
      isValid: false,
      errors: { form: 'Internal LIFO allocation inconsistency.' },
      result: null,
    };
  }

  const result: LifoInventoryResult = {
    batch1Price: p1.value,
    batch1Qty: q1.value,
    batch2Price: p2.value,
    batch2Qty: q2.value,
    unitsSold: sold.value,
    sellingPrice: sell.value,
    totalAvailableUnits: available,
    totalPurchaseCost,
    lifoCogs: allocation.cogs,
    endingInventoryUnits: allocation.remain1 + allocation.remain2,
    endingInventoryValue: allocation.endingInventory,
    revenue,
    grossProfit,
    grossProfitMargin,
    layers: allocation.layers,
    status,
    interpretation: interpretLifo(
      allocation.cogs,
      allocation.endingInventory,
      sold.value,
      revenue,
      grossProfit
    ),
    warningMessage,
    currency,
    formattedTotalPurchaseCost: formatLifoMoney(totalPurchaseCost, currency),
    formattedLifoCogs: formatLifoMoney(allocation.cogs, currency),
    formattedEndingInventory: formatLifoMoney(
      allocation.endingInventory,
      currency
    ),
    formattedRevenue: formatLifoMoney(revenue, currency),
    formattedGrossProfit: formatLifoMoney(grossProfit, currency),
    formattedGrossProfitMargin:
      grossProfitMargin === null ? null : formatLifoPercent(grossProfitMargin),
  };

  return { isValid: true, errors, result };
}
