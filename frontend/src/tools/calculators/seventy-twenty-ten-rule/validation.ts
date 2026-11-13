import { isSupportedCurrency } from '@/tools/shared/currency';
import { activePercents, percentsSumTo100 } from './calculation';
import { INCOME_FREQUENCIES, type SeventyTwentyTenFieldErrors, type SeventyTwentyTenInput } from './types';

function finite(value: number): boolean {
  return Number.isFinite(value);
}

function checkMoney(
  errors: SeventyTwentyTenFieldErrors,
  key: string,
  value: number,
  label: string
): void {
  if (!finite(value)) {
    errors[key] = `Enter ${label}`;
    return;
  }
  if (value < 0) errors[key] = `${label} cannot be negative`;
}

export function validateSeventyTwentyTen(input: SeventyTwentyTenInput): {
  isValid: boolean;
  errors: SeventyTwentyTenFieldErrors;
} {
  const errors: SeventyTwentyTenFieldErrors = {};
  if (!INCOME_FREQUENCIES.includes(input.frequency)) errors.frequency = 'Choose monthly or annual';
  if (!isSupportedCurrency(input.currency)) errors.currency = 'Choose a supported currency';

  checkMoney(errors, 'income', input.income, 'after-tax income');
  checkMoney(errors, 'needsSpending', input.needsSpending, 'needs spending');
  checkMoney(errors, 'savingsSpending', input.savingsSpending, 'savings and debt spending');
  checkMoney(errors, 'lifestyleSpending', input.lifestyleSpending, 'lifestyle spending');

  if (input.customPercents) {
    const percents = activePercents(input);
    checkMoney(errors, 'needsPercent', percents.needs, 'the needs percentage');
    checkMoney(errors, 'savingsPercent', percents.savings, 'the savings and debt percentage');
    checkMoney(errors, 'lifestylePercent', percents.lifestyle, 'the lifestyle percentage');
    const fieldsReady = ['needsPercent', 'savingsPercent', 'lifestylePercent'].every((key) => !errors[key]);
    if (fieldsReady && !percentsSumTo100(percents.needs, percents.savings, percents.lifestyle)) {
      const sum = Math.round((percents.needs + percents.savings + percents.lifestyle) * 100) / 100;
      errors.percents = `Custom percentages must add up to 100%. They currently add up to ${sum}%.`;
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
