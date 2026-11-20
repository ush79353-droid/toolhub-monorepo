import {
  calculateAverageInventory,
  calculateDaysInventoryOutstanding,
  calculateInventoryTurnover,
  formatDays,
  formatDioMoney,
  formatTurnover,
  interpretDio,
} from './calculation';
import type { DioFieldErrors, DioInput, DioResult } from './types';

export interface DioValidation {
  isValid: boolean;
  errors: DioFieldErrors;
  result: DioResult | null;
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

export function validateDioInput(input: DioInput): DioValidation {
  const errors: DioFieldErrors = {};
  const currency = input.currency;

  let averageInventory: number | null = null;

  if (input.averageInventoryMode === 'calculated') {
    const start = parseNumber(input.startingInventory);
    const end = parseNumber(input.endingInventory);

    if (!start.blank) {
      if (start.invalid || start.value === null) {
        errors.startingInventory = 'Enter a valid starting inventory.';
      } else if (start.value < 0) {
        errors.startingInventory = 'Starting inventory cannot be negative.';
      }
    }
    if (!end.blank) {
      if (end.invalid || end.value === null) {
        errors.endingInventory = 'Enter a valid ending inventory.';
      } else if (end.value < 0) {
        errors.endingInventory = 'Ending inventory cannot be negative.';
      }
    }

    if (
      !start.blank &&
      !end.blank &&
      start.value !== null &&
      end.value !== null &&
      start.value >= 0 &&
      end.value >= 0 &&
      !start.invalid &&
      !end.invalid
    ) {
      averageInventory = calculateAverageInventory(start.value, end.value);
    }
  } else {
    const manual = parseNumber(input.manualAverageInventory);
    if (!manual.blank) {
      if (manual.invalid || manual.value === null) {
        errors.manualAverageInventory = 'Enter a valid average inventory.';
      } else if (manual.value < 0) {
        errors.manualAverageInventory = 'Average inventory cannot be negative.';
      } else {
        averageInventory = manual.value;
      }
    }
  }

  const cogsParsed = parseNumber(input.costOfGoodsSold);
  if (!cogsParsed.blank) {
    if (cogsParsed.invalid || cogsParsed.value === null) {
      errors.costOfGoodsSold = 'Enter a valid cost of goods sold.';
    } else if (cogsParsed.value < 0) {
      errors.costOfGoodsSold = 'Cost of goods sold cannot be negative.';
    }
  }

  const periodParsed = parseNumber(input.accountingPeriodDays);
  if (periodParsed.blank) {
    errors.accountingPeriodDays = 'Enter days in the accounting period.';
  } else if (periodParsed.invalid || periodParsed.value === null) {
    errors.accountingPeriodDays = 'Enter a valid period in days.';
  } else if (periodParsed.value <= 0) {
    errors.accountingPeriodDays = 'Period must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    averageInventory === null ||
    cogsParsed.blank ||
    cogsParsed.value === null ||
    periodParsed.blank ||
    periodParsed.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const cogs = cogsParsed.value;
  const periodDays = periodParsed.value;

  if (cogs === 0) {
    return {
      isValid: false,
      errors: {
        costOfGoodsSold:
          'DIO is undefined when COGS is zero. Enter positive cost of goods sold for the same period as inventory.',
      },
      result: null,
    };
  }

  const dio = calculateDaysInventoryOutstanding(
    averageInventory,
    cogs,
    periodDays
  );
  if (dio === null) {
    return { isValid: false, errors, result: null };
  }

  const turnover = calculateInventoryTurnover(cogs, averageInventory);
  const warningMessage =
    averageInventory === 0 && cogs > 0
      ? 'Zero average inventory with positive COGS yields DIO of 0 days. Inventory turnover is unavailable (division by zero).'
      : null;

  const result: DioResult = {
    averageInventory,
    costOfGoodsSold: cogs,
    accountingPeriodDays: periodDays,
    daysInventoryOutstanding: dio,
    inventoryTurnover: turnover,
    status: 'valid',
    interpretation: interpretDio(dio, averageInventory, cogs),
    warningMessage,
    currency,
    formattedAverageInventory: formatDioMoney(averageInventory, currency),
    formattedCostOfGoodsSold: formatDioMoney(cogs, currency),
    formattedAccountingPeriodDays: formatDays(periodDays),
    formattedDaysInventoryOutstanding: formatDays(dio),
    formattedInventoryTurnover:
      turnover === null ? null : formatTurnover(turnover),
  };

  return { isValid: true, errors, result };
}
