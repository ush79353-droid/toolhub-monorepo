import { calculateBitcoinEtf } from './calculation';
import type {
  BitcoinEtfFieldErrors,
  BitcoinEtfInput,
  BitcoinEtfResult,
} from './types';

function parseField(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed.replace(/,/g, ''));
  return Number.isFinite(num) ? num : Number.NaN;
}

export function validateBitcoinEtfInput(input: BitcoinEtfInput): {
  isValid: boolean;
  errors: BitcoinEtfFieldErrors;
  result: BitcoinEtfResult | null;
} {
  const errors: BitcoinEtfFieldErrors = {};

  if (!input.etfId) {
    // Keep blank until ETF choice is made — not an error while untouched.
  }

  const investmentAmount = parseField(input.investmentAmount);
  const durationYears = parseField(input.durationYears);
  const expenseRatio = parseField(input.expenseRatio);
  const otherCosts = parseField(input.otherCosts);
  const expectedReturn = parseField(input.expectedReturn);

  const anyBlank =
    !input.etfId ||
    investmentAmount === null ||
    durationYears === null ||
    expenseRatio === null ||
    otherCosts === null ||
    expectedReturn === null;

  if (anyBlank) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(investmentAmount!) || investmentAmount! <= 0) {
    errors.investmentAmount = 'Enter a positive investment amount';
  }
  if (Number.isNaN(durationYears!) || durationYears! < 0) {
    errors.durationYears = 'Enter a nonnegative duration in years';
  }
  if (Number.isNaN(expenseRatio!) || expenseRatio! < 0 || expenseRatio! > 100) {
    errors.expenseRatio = 'Expense ratio must be between 0% and 100%';
  }
  if (Number.isNaN(otherCosts!) || otherCosts! < 0) {
    errors.otherCosts = 'Other costs cannot be negative';
  } else if (
    Number.isFinite(investmentAmount!) &&
    investmentAmount! > 0 &&
    otherCosts! > investmentAmount!
  ) {
    errors.otherCosts = 'Other costs cannot exceed the investment amount';
  }
  if (Number.isNaN(expectedReturn!)) {
    errors.expectedReturn = 'Enter a valid expected return';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateBitcoinEtf({
    investmentAmount: investmentAmount!,
    durationYears: durationYears!,
    expenseRatioPercent: expenseRatio!,
    otherCosts: otherCosts!,
    expectedReturnPercent: expectedReturn!,
    currency: input.currency,
  });

  if (!result) {
    errors.form = 'Unable to calculate with these inputs';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
