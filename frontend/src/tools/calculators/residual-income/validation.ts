import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateEquityCharge,
  calculateResidualIncome,
  formatRiMoney,
  interpretResidualIncome,
} from './calculation';
import type {
  ResidualIncomeFieldErrors,
  ResidualIncomeInput,
  ResidualIncomeResult,
} from './types';

export interface ResidualIncomeValidation {
  isValid: boolean;
  errors: ResidualIncomeFieldErrors;
  result: ResidualIncomeResult | null;
}

function parseFinite(raw: string): {
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

export function validateResidualIncomeInput(
  input: ResidualIncomeInput
): ResidualIncomeValidation {
  const errors: ResidualIncomeFieldErrors = {};
  const currency = input.currency;
  const symbol = getCurrencySymbol(currency);
  let hasError = false;

  const equity = parseFinite(input.equityCapital);
  if (equity.blank) {
    errors.equityCapital = 'Enter equity capital.';
    hasError = true;
  } else if (equity.invalid || equity.value === null) {
    errors.equityCapital = 'Enter a valid equity capital amount.';
    hasError = true;
  } else if (equity.value < 0) {
    errors.equityCapital = 'Equity capital cannot be negative.';
    hasError = true;
  }

  const cost = parseFinite(input.costOfEquity);
  if (cost.blank) {
    errors.costOfEquity = 'Enter the cost of equity.';
    hasError = true;
  } else if (cost.invalid || cost.value === null) {
    errors.costOfEquity = 'Enter a valid cost of equity percentage.';
    hasError = true;
  } else if (cost.value < 0) {
    errors.costOfEquity = 'Cost of equity cannot be negative.';
    hasError = true;
  }

  const ni = parseFinite(input.netIncome);
  if (ni.blank) {
    errors.netIncome = 'Enter net income.';
    hasError = true;
  } else if (ni.invalid || ni.value === null) {
    errors.netIncome = 'Enter a valid net income.';
    hasError = true;
  }

  if (
    hasError ||
    equity.value === null ||
    cost.value === null ||
    ni.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const equityCharge = calculateEquityCharge(equity.value, cost.value);
  if (equityCharge === null) {
    errors.form = 'Unable to calculate the equity charge.';
    return { isValid: false, errors, result: null };
  }

  const residualIncome = calculateResidualIncome(ni.value, equityCharge);
  if (residualIncome === null) {
    errors.form = 'Unable to calculate residual income.';
    return { isValid: false, errors, result: null };
  }

  const money = (n: number) => `${symbol}${formatRiMoney(n, currency)}`;

  const result: ResidualIncomeResult = {
    equityCharge,
    residualIncome,
    currency,
    formattedEquityCharge: money(equityCharge),
    formattedResidualIncome: money(residualIncome),
    interpretation: interpretResidualIncome(residualIncome),
    warningMessage:
      'Residual income = net income − equity charge. Equity charge = equity capital × (cost of equity % ÷ 100). One period of RI does not determine long-term equity value.',
  };

  return { isValid: true, errors, result };
}
