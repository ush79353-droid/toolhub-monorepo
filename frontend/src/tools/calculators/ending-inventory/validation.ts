import {
  calculateAverageInventory,
  calculateCogsFromTurnover,
  calculateEndingInventory,
  calculateInventoryTurnover,
  formatEndingInventoryMoney,
  formatTurnover,
  interpretEndingInventory,
} from './calculation';
import type {
  EndingInventoryFieldErrors,
  EndingInventoryInput,
  EndingInventoryResult,
} from './types';

export interface EndingInventoryValidation {
  isValid: boolean;
  errors: EndingInventoryFieldErrors;
  result: EndingInventoryResult | null;
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

export function validateEndingInventoryInput(
  input: EndingInventoryInput
): EndingInventoryValidation {
  const errors: EndingInventoryFieldErrors = {};
  const currency = input.currency;
  const cogsKnown = input.cogsKnown === 'yes';

  const start = parseNumber(input.startingInventory);
  const purchases = parseNumber(input.netPurchases);
  const cogs = parseNumber(input.costOfGoodsSold);
  const turnover = parseNumber(input.inventoryTurnover);

  if (!start.blank) {
    if (start.invalid || start.value === null) {
      errors.startingInventory = 'Enter a valid starting inventory amount.';
    } else if (start.value < 0) {
      errors.startingInventory = 'Starting inventory cannot be negative.';
    }
  }
  if (!purchases.blank) {
    if (purchases.invalid || purchases.value === null) {
      errors.netPurchases = 'Enter a valid net purchases amount.';
    } else if (purchases.value < 0) {
      errors.netPurchases = 'Net purchases cannot be negative.';
    }
  }

  if (cogsKnown) {
    if (!cogs.blank) {
      if (cogs.invalid || cogs.value === null) {
        errors.costOfGoodsSold = 'Enter a valid cost of goods sold.';
      } else if (cogs.value < 0) {
        errors.costOfGoodsSold = 'Cost of goods sold cannot be negative.';
      }
    }
  } else if (!turnover.blank) {
    if (turnover.invalid || turnover.value === null) {
      errors.inventoryTurnover = 'Enter a valid inventory turnover ratio.';
    } else if (turnover.value < 0) {
      errors.inventoryTurnover = 'Inventory turnover cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    start.blank ||
    purchases.blank ||
    start.value === null ||
    purchases.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  let resolvedCogs: number;
  let resolvedTurnover: number | null;

  if (cogsKnown) {
    if (cogs.blank || cogs.value === null) {
      return { isValid: false, errors, result: null };
    }
    resolvedCogs = cogs.value;
  } else {
    if (turnover.blank || turnover.value === null) {
      return { isValid: false, errors, result: null };
    }
    const derived = calculateCogsFromTurnover(
      start.value,
      purchases.value,
      turnover.value
    );
    if (derived === null) {
      errors.form =
        'COGS cannot be derived from the entered turnover when beginning inventory and net purchases are both zero (or the inputs are inconsistent).';
      return { isValid: false, errors, result: null };
    }
    resolvedCogs = derived;
    resolvedTurnover = turnover.value;
  }

  const ending = calculateEndingInventory(
    start.value,
    purchases.value,
    resolvedCogs
  );
  if (ending === null) {
    return { isValid: false, errors, result: null };
  }

  if (ending < 0) {
    const warning =
      'Calculated ending inventory is negative: entered costs exceed available inventory under the simplified flow. This is not a valid physical inventory balance.';
    const result: EndingInventoryResult = {
      startingInventory: start.value,
      netPurchases: purchases.value,
      costOfGoodsSold: resolvedCogs,
      endingInventory: ending,
      averageInventory: 0,
      inventoryTurnover: null,
      status: 'negativeEndingInventory',
      interpretation: warning,
      warningMessage: warning,
      currency,
      formattedStartingInventory: formatEndingInventoryMoney(
        start.value,
        currency
      ),
      formattedNetPurchases: formatEndingInventoryMoney(
        purchases.value,
        currency
      ),
      formattedCostOfGoodsSold: formatEndingInventoryMoney(
        resolvedCogs,
        currency
      ),
      formattedEndingInventory: formatEndingInventoryMoney(ending, currency),
      formattedAverageInventory: formatEndingInventoryMoney(0, currency),
      formattedInventoryTurnover: null,
    };
    // Not a valid standard result — expose warning via result but mark invalid
    return { isValid: false, errors: { form: warning }, result };
  }

  const average = calculateAverageInventory(start.value, ending);
  if (average === null) {
    return { isValid: false, errors, result: null };
  }

  if (cogsKnown) {
    resolvedTurnover =
      average === 0
        ? null
        : calculateInventoryTurnover(resolvedCogs, average);
  }

  const warningMessage =
    average === 0
      ? 'Inventory turnover is undefined when average inventory is zero. Do not use sales revenue in place of COGS.'
      : 'Amounts share one currency label (no FX conversion). Do not substitute sales revenue for COGS.';

  const result: EndingInventoryResult = {
    startingInventory: start.value,
    netPurchases: purchases.value,
    costOfGoodsSold: resolvedCogs,
    endingInventory: ending,
    averageInventory: average,
    inventoryTurnover: resolvedTurnover,
    status: average === 0 ? 'zeroAverageInventory' : 'valid',
    interpretation: interpretEndingInventory(ending, resolvedTurnover),
    warningMessage,
    currency,
    formattedStartingInventory: formatEndingInventoryMoney(
      start.value,
      currency
    ),
    formattedNetPurchases: formatEndingInventoryMoney(
      purchases.value,
      currency
    ),
    formattedCostOfGoodsSold: formatEndingInventoryMoney(
      resolvedCogs,
      currency
    ),
    formattedEndingInventory: formatEndingInventoryMoney(ending, currency),
    formattedAverageInventory: formatEndingInventoryMoney(average, currency),
    formattedInventoryTurnover:
      resolvedTurnover === null ? null : formatTurnover(resolvedTurnover),
  };

  return { isValid: true, errors, result };
}
