import {
  calculateProfitabilityIndex,
  formatPi,
  interpretPi,
} from './calculation';
import type {
  ProfitabilityIndexFieldErrors,
  ProfitabilityIndexInput,
  ProfitabilityIndexResult,
} from './types';

function parseOptional(raw: string): number | null | typeof Number.NaN {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : Number.NaN;
}

export function validateProfitabilityIndex(input: ProfitabilityIndexInput): {
  isValid: boolean;
  incomplete: boolean;
  errors: ProfitabilityIndexFieldErrors;
  result: ProfitabilityIndexResult | null;
} {
  const errors: ProfitabilityIndexFieldErrors = {};

  const investment = parseOptional(input.initialInvestment);
  const pv = parseOptional(input.pvFutureCashFlow);

  if (investment === null || pv === null) {
    return { isValid: false, incomplete: true, errors, result: null };
  }

  if (Number.isNaN(investment) || investment <= 0) {
    errors.initialInvestment = 'Initial investment must be greater than zero';
  }
  if (Number.isNaN(pv) || pv < 0) {
    errors.pvFutureCashFlow = 'PV of future cash flow cannot be negative';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, result: null };
  }

  const pi = calculateProfitabilityIndex(investment, pv);
  if (pi === null) {
    errors.form = 'Unable to calculate a finite profitability index.';
    return { isValid: false, incomplete: false, errors, result: null };
  }

  const result: ProfitabilityIndexResult = {
    initialInvestment: investment,
    pvFutureCashFlow: pv,
    pi,
    piDisplay: formatPi(pi),
    interpretation: interpretPi(pi),
    currency: input.currency,
  };

  return { isValid: true, incomplete: false, errors: {}, result };
}
