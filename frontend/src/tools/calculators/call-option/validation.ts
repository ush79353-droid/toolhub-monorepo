import { calculateCallOption } from './calculation';
import type {
  CallOptionFieldErrors,
  CallOptionInput,
  CallOptionResult,
} from './types';

export interface CallOptionValidation {
  isValid: boolean;
  errors: CallOptionFieldErrors;
  result: CallOptionResult | null;
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

export function validateCallOptionInput(
  input: CallOptionInput
): CallOptionValidation {
  const errors: CallOptionFieldErrors = {};
  let hasFieldError = false;

  if (input.mode !== 'call' && input.mode !== 'put') {
    errors.form = 'Select call or put mode.';
    hasFieldError = true;
  }

  const asset = parseNumber(input.assetPrice);
  if (asset.blank) {
    errors.assetPrice = 'Enter the current asset or target price.';
    hasFieldError = true;
  } else if (asset.invalid || asset.value === null) {
    errors.assetPrice = 'Enter a valid asset or target price.';
    hasFieldError = true;
  } else if (asset.value < 0) {
    errors.assetPrice = 'Asset price cannot be negative.';
    hasFieldError = true;
  }

  const strike = parseNumber(input.strikePrice);
  if (strike.blank) {
    errors.strikePrice = 'Enter the strike price.';
    hasFieldError = true;
  } else if (strike.invalid || strike.value === null) {
    errors.strikePrice = 'Enter a valid strike price.';
    hasFieldError = true;
  } else if (strike.value < 0) {
    errors.strikePrice = 'Strike price cannot be negative.';
    hasFieldError = true;
  }

  const premium = parseNumber(input.optionPrice);
  if (premium.blank) {
    errors.optionPrice = 'Enter the option premium (price per share).';
    hasFieldError = true;
  } else if (premium.invalid || premium.value === null) {
    errors.optionPrice = 'Enter a valid option premium.';
    hasFieldError = true;
  } else if (premium.value < 0) {
    errors.optionPrice = 'Option premium cannot be negative.';
    hasFieldError = true;
  }

  const contracts = parseNumber(input.contracts);
  if (contracts.blank) {
    errors.contracts = 'Enter the number of option contracts.';
    hasFieldError = true;
  } else if (contracts.invalid || contracts.value === null) {
    errors.contracts = 'Enter a valid number of contracts.';
    hasFieldError = true;
  } else if (contracts.value < 0) {
    errors.contracts = 'Contracts cannot be negative.';
    hasFieldError = true;
  } else if (!Number.isInteger(contracts.value)) {
    errors.contracts = 'Contracts must be a whole number.';
    hasFieldError = true;
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  if (
    asset.value === null ||
    strike.value === null ||
    premium.value === null ||
    contracts.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateCallOption({
    mode: input.mode,
    assetPrice: asset.value,
    strikePrice: strike.value,
    optionPrice: premium.value,
    contracts: contracts.value,
    currency: input.currency,
  });

  if (!result) {
    errors.form = 'Unable to calculate with these inputs.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
