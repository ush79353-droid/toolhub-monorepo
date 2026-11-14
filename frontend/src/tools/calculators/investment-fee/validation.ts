import { calculateInvestmentFee } from './calculation';
import type {
  InvestmentFeeFieldErrors,
  InvestmentFeeInput,
  InvestmentFeeResult,
} from './types';

export interface InvestmentFeeValidation {
  isValid: boolean;
  errors: InvestmentFeeFieldErrors;
  result: InvestmentFeeResult | null;
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
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

export function validateInvestmentFeeInput(
  input: InvestmentFeeInput
): InvestmentFeeValidation {
  const errors: InvestmentFeeFieldErrors = {};

  const initial = parseNumber(input.initialInvestment);
  const salesLoad = parseNumber(input.salesLoadPercent);
  const annualReturn = parseNumber(input.annualReturnPercent);
  const operating = parseNumber(input.annualOperatingFeesPercent);
  const duration = parseNumber(input.durationYears);
  const turnover = parseNumber(input.turnoverCostPercent);
  const redemption = parseNumber(input.redemptionFeesPercent);

  if (initial.blank || initial.invalid || initial.value === null) {
    errors.initialInvestment = 'Enter a valid initial investment.';
  } else if (!(initial.value > 0)) {
    errors.initialInvestment = 'Initial investment must be greater than zero.';
  }

  if (salesLoad.blank || salesLoad.invalid || salesLoad.value === null) {
    errors.salesLoadPercent = 'Enter a valid sales load.';
  } else if (salesLoad.value < 0 || salesLoad.value >= 100) {
    errors.salesLoadPercent = 'Sales load must be from 0% up to (but not including) 100%.';
  }

  if (annualReturn.blank || annualReturn.invalid || annualReturn.value === null) {
    errors.annualReturnPercent = 'Enter a valid annual return.';
  } else if (!(annualReturn.value > -100)) {
    errors.annualReturnPercent = 'Annual return must be greater than −100%.';
  }

  if (operating.blank || operating.invalid || operating.value === null) {
    errors.annualOperatingFeesPercent = 'Enter a valid operating fee.';
  } else if (operating.value < 0) {
    errors.annualOperatingFeesPercent = 'Operating fees cannot be negative.';
  }

  if (duration.blank || duration.invalid || duration.value === null) {
    errors.durationYears = 'Enter a valid duration.';
  } else if (!(duration.value > 0)) {
    errors.durationYears = 'Duration must be greater than zero.';
  }

  if (turnover.blank || turnover.invalid || turnover.value === null) {
    errors.turnoverCostPercent = 'Enter a valid turnover cost.';
  } else if (turnover.value < 0) {
    errors.turnoverCostPercent = 'Turnover cost cannot be negative.';
  }

  if (redemption.blank || redemption.invalid || redemption.value === null) {
    errors.redemptionFeesPercent = 'Enter a valid redemption fee.';
  } else if (redemption.value < 0 || redemption.value >= 100) {
    errors.redemptionFeesPercent =
      'Redemption fee must be from 0% up to (but not including) 100%.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateInvestmentFee({
    initialInvestment: initial.value!,
    salesLoadPercent: salesLoad.value!,
    annualReturnPercent: annualReturn.value!,
    annualOperatingFeesPercent: operating.value!,
    durationYears: duration.value!,
    turnoverCostPercent: turnover.value!,
    redemptionFeesPercent: redemption.value!,
    currency: input.currency,
  });

  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
