import { COMPARISON_ITEMS } from './comparison-items';
import { calculateTrumpsTaxesComparison } from './calculation';
import type { TrumpsTaxesFieldErrors, TrumpsTaxesInput, TrumpsTaxesResult } from './types';

function parseMoney(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return null;
  return value;
}

export function validateTrumpsTaxesInput(input: TrumpsTaxesInput): {
  isValid: boolean;
  errors: TrumpsTaxesFieldErrors;
  result: TrumpsTaxesResult | null;
} {
  const errors: TrumpsTaxesFieldErrors = {};
  const userTax = parseMoney(input.userTax);
  const trumpTax = parseMoney(input.trumpTax);

  if (userTax === null) {
    errors.userTax = 'Enter your tax amount.';
  } else if (userTax < 0) {
    errors.userTax = 'Tax cannot be negative.';
  }

  if (trumpTax === null) {
    errors.trumpTax = 'Enter Trump’s reported tax amount.';
  } else if (!(trumpTax > 0)) {
    errors.trumpTax = 'Trump’s tax must be greater than zero for a ratio.';
  }

  const unitPrices: Record<string, number> = {};
  for (const item of COMPARISON_ITEMS) {
    const raw = input.unitPrices[item.id] ?? '';
    const price = parseMoney(raw);
    if (price === null || !(price > 0)) {
      errors.unitPrices = 'Every comparison item needs a positive unit price.';
      break;
    }
    unitPrices[item.id] = price;
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateTrumpsTaxesComparison(userTax!, trumpTax!, unitPrices);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with the current inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
