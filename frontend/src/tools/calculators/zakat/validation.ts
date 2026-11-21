import { calculateZakat } from './calculation';
import type { ZakatFieldErrors, ZakatInput, ZakatResult } from './types';

const MONEY_FIELDS = [
  'cashInBank',
  'cashInHand',
  'savings',
  'loansReceivable',
  'cashForTrade',
  'investments',
  'stocks',
  'tradeInventory',
  'otherAssets',
] as const;

const LIABILITY_FIELDS = ['loansTaken', 'debtsPayable', 'paymentsDue'] as const;

function finiteNonNegative(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

export function validateZakatInput(
  input: ZakatInput,
  rates: Record<string, number>,
): { isValid: boolean; errors: ZakatFieldErrors; result: ZakatResult | null } {
  const errors: ZakatFieldErrors = {};

  if (MONEY_FIELDS.some((field) => !finiteNonNegative(input[field])) || !finiteNonNegative(input.goldGrams) || !finiteNonNegative(input.silverGrams)) {
    errors.assets = 'Asset amounts and metal weights must be zero or greater.';
  }
  if (
    !Number.isFinite(input.goldPurityPercent) ||
    input.goldPurityPercent < 0 ||
    input.goldPurityPercent > 100 ||
    !Number.isFinite(input.silverPurityPercent) ||
    input.silverPurityPercent < 0 ||
    input.silverPurityPercent > 100
  ) {
    errors.assets = errors.assets ?? 'Purity must be between 0 and 100 percent.';
  }
  if (LIABILITY_FIELDS.some((field) => !finiteNonNegative(input[field]))) {
    errors.liabilities = 'Liabilities must be zero or greater.';
  }
  if (input.nisabMethod === 'custom' && !finiteNonNegative(input.customNisab)) {
    errors.nisab = 'Custom Nisab must be zero or greater.';
  }
  if (input.hawl !== 'yes' && input.hawl !== 'no' && input.hawl !== 'not-sure') {
    errors.form = 'Choose whether the lunar year is complete.';
  }
  if (!['gold', 'silver', 'custom'].includes(input.nisabMethod)) {
    errors.nisab = 'Choose a Nisab method.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateZakat(input, rates);
  if (!result) {
    return {
      isValid: false,
      errors: {
        prices:
          'The reference metal price could not be converted. Enter a price per gram in the selected currency, or switch back to USD.',
      },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
