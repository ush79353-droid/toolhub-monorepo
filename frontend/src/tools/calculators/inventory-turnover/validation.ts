import {
  calculateAverageInventory,
  calculateInventoryDays,
  calculateInventoryTurnover,
  formatInvDays,
  formatInvMoney,
  formatInvTurnover,
  interpretInventoryTurnover,
} from './calculation';
import type {
  InventoryTurnoverFieldErrors,
  InventoryTurnoverInput,
  InventoryTurnoverResult,
  InventoryTurnoverStatus,
} from './types';

export interface InventoryTurnoverValidation {
  isValid: boolean;
  errors: InventoryTurnoverFieldErrors;
  result: InventoryTurnoverResult | null;
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

export function validateInventoryTurnoverInput(
  input: InventoryTurnoverInput
): InventoryTurnoverValidation {
  const errors: InventoryTurnoverFieldErrors = {};
  const currency = input.currency;

  const cogs = parseNumber(input.costOfGoodsSold);
  const beginning = parseNumber(input.beginningInventory);
  const ending = parseNumber(input.endingInventory);
  const days = parseNumber(input.days);

  if (!cogs.blank) {
    if (cogs.invalid || cogs.value === null) {
      errors.costOfGoodsSold = 'Enter a valid Cost of Goods Sold.';
    } else if (cogs.value < 0) {
      errors.costOfGoodsSold = 'COGS cannot be negative.';
    }
  }
  if (!beginning.blank) {
    if (beginning.invalid || beginning.value === null) {
      errors.beginningInventory = 'Enter a valid beginning inventory.';
    } else if (beginning.value < 0) {
      errors.beginningInventory = 'Beginning inventory cannot be negative.';
    }
  }
  if (!ending.blank) {
    if (ending.invalid || ending.value === null) {
      errors.endingInventory = 'Enter a valid ending inventory.';
    } else if (ending.value < 0) {
      errors.endingInventory = 'Ending inventory cannot be negative.';
    }
  }
  if (!days.blank) {
    if (days.invalid || days.value === null) {
      errors.days = 'Enter a valid number of days.';
    } else if (days.value <= 0) {
      errors.days = 'Accounting period days must be greater than zero.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    cogs.blank ||
    beginning.blank ||
    ending.blank ||
    days.blank ||
    cogs.value === null ||
    beginning.value === null ||
    ending.value === null ||
    days.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const averageInventory = calculateAverageInventory(
    beginning.value,
    ending.value
  );
  if (averageInventory === null) {
    return { isValid: false, errors, result: null };
  }

  const inventoryTurnover = calculateInventoryTurnover(
    cogs.value,
    averageInventory
  );
  const inventoryDays = calculateInventoryDays(
    cogs.value,
    averageInventory,
    days.value
  );

  let status: InventoryTurnoverStatus = 'valid';
  let warningMessage: string | null =
    'Inventory turnover = COGS ÷ Average Inventory. Inventory days ≈ DIO under a consistent definition. Amounts share one currency label (no FX conversion).';
  let isValid = true;

  if (averageInventory === 0 && cogs.value === 0) {
    status = 'undefinedTurnover';
    isValid = false;
    warningMessage =
      'Inventory turnover and inventory days are undefined when both COGS and average inventory are zero.';
    errors.form = warningMessage;
  } else if (averageInventory === 0) {
    status = 'zeroAverageInventory';
    warningMessage =
      'Average inventory is zero; inventory turnover is unavailable. Inventory days equal 0 under the direct formula when COGS is positive.';
  } else if (cogs.value === 0) {
    status = 'zeroCOGS';
    warningMessage =
      'COGS is zero; turnover is 0.00×; inventory days cannot be calculated through the standard formula.';
  }

  const result: InventoryTurnoverResult = {
    costOfGoodsSold: cogs.value,
    beginningInventory: beginning.value,
    endingInventory: ending.value,
    days: days.value,
    averageInventory,
    inventoryTurnover,
    inventoryDays,
    status,
    interpretation: interpretInventoryTurnover(
      inventoryTurnover,
      inventoryDays,
      averageInventory,
      cogs.value
    ),
    warningMessage,
    currency,
    formattedCostOfGoodsSold: formatInvMoney(cogs.value, currency),
    formattedBeginningInventory: formatInvMoney(beginning.value, currency),
    formattedEndingInventory: formatInvMoney(ending.value, currency),
    formattedAverageInventory: formatInvMoney(averageInventory, currency),
    formattedInventoryTurnover:
      inventoryTurnover === null ? null : formatInvTurnover(inventoryTurnover),
    formattedInventoryDays:
      inventoryDays === null ? null : formatInvDays(inventoryDays),
  };

  if (status === 'undefinedTurnover') {
    return { isValid: false, errors, result };
  }

  return { isValid, errors, result };
}
