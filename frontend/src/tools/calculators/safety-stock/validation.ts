import { calculateSafetyStock } from './calculation';
import type { SafetyStockFieldErrors, SafetyStockInput } from './types';

function parseNumber(raw: string): { blank: boolean; value: number | null; invalid: boolean } {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return { blank: true, value: null, invalid: false };
  if (/infinity|nan/i.test(trimmed)) {
    return { blank: false, value: null, invalid: true };
  }
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(trimmed)) {
    return { blank: false, value: null, invalid: true };
  }
  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    return { blank: false, value: null, invalid: true };
  }
  return { blank: false, value, invalid: false };
}

export function validateSafetyStockInput(input: SafetyStockInput): {
  isValid: boolean;
  errors: SafetyStockFieldErrors;
  parsed:
    | {
        maxDailyUsage: number;
        maxLeadTime: number;
        averageDailyUsage: number;
        averageLeadTime: number;
      }
    | null;
} {
  const errors: SafetyStockFieldErrors = {};

  const maxUsage = parseNumber(input.maxDailyUsage);
  const maxLead = parseNumber(input.maxLeadTime);
  const avgUsage = parseNumber(input.averageDailyUsage);
  const avgLead = parseNumber(input.averageLeadTime);

  if (maxUsage.blank || maxLead.blank || avgUsage.blank || avgLead.blank) {
    return { isValid: false, errors, parsed: null };
  }

  if (maxUsage.invalid || maxUsage.value === null) {
    errors.maxDailyUsage = 'Enter a valid max daily usage';
  } else if (maxUsage.value < 0) {
    errors.maxDailyUsage = 'Max daily usage cannot be negative';
  }

  if (avgUsage.invalid || avgUsage.value === null) {
    errors.averageDailyUsage = 'Enter a valid average daily usage';
  } else if (avgUsage.value < 0) {
    errors.averageDailyUsage = 'Average daily usage cannot be negative';
  }

  if (maxLead.invalid || maxLead.value === null) {
    errors.maxLeadTime = 'Enter a valid max lead time';
  } else if (maxLead.value <= 0) {
    errors.maxLeadTime = 'Max lead time must be greater than zero';
  }

  if (avgLead.invalid || avgLead.value === null) {
    errors.averageLeadTime = 'Enter a valid average lead time';
  } else if (avgLead.value <= 0) {
    errors.averageLeadTime = 'Average lead time must be greater than zero';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, parsed: null };
  }

  const result = calculateSafetyStock(
    maxUsage.value!,
    maxLead.value!,
    avgUsage.value!,
    avgLead.value!
  );
  if (!result) {
    errors.form = 'This combination does not produce a finite safety stock.';
    return { isValid: false, errors, parsed: null };
  }

  return {
    isValid: true,
    errors,
    parsed: {
      maxDailyUsage: maxUsage.value!,
      maxLeadTime: maxLead.value!,
      averageDailyUsage: avgUsage.value!,
      averageLeadTime: avgLead.value!,
    },
  };
}
