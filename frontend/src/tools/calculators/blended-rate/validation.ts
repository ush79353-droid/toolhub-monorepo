import {
  calculateBlendedRate,
  formatBrMoney,
  formatBrPercent,
  interpretBlendedRate,
  type BlendedLoanNumeric,
} from './calculation';
import type {
  BlendedRateFieldErrors,
  BlendedRateInput,
  BlendedRateResult,
  BlendedRateStatus,
} from './types';

export interface BlendedRateValidation {
  isValid: boolean;
  errors: BlendedRateFieldErrors;
  result: BlendedRateResult | null;
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

export function validateBlendedRateInput(
  input: BlendedRateInput
): BlendedRateValidation {
  const errors: BlendedRateFieldErrors = { entries: {} };
  const currency = input.currency;
  const complete: BlendedLoanNumeric[] = [];
  let hasAnyInput = false;
  let hasFieldError = false;

  for (const entry of input.entries) {
    const bal = parseNumber(entry.balance);
    const rate = parseNumber(entry.rate);
    const entryErrors: { balance?: string; rate?: string } = {};

    if (!bal.blank || !rate.blank) hasAnyInput = true;

    // Entirely empty optional row → ignore
    if (bal.blank && rate.blank) continue;

    if (bal.blank && !rate.blank) {
      entryErrors.balance = 'Enter the balance for this interest rate.';
      hasFieldError = true;
    } else if (bal.invalid || bal.value === null) {
      entryErrors.balance = 'Enter a valid balance.';
      hasFieldError = true;
    } else if (bal.value < 0) {
      entryErrors.balance = 'Balance cannot be negative.';
      hasFieldError = true;
    } else if (bal.value === 0) {
      // Zero balance with a rate: treat as incomplete / ignore with message
      entryErrors.balance = 'Enter a positive balance for this rate.';
      hasFieldError = true;
    }

    if (rate.blank && !bal.blank) {
      entryErrors.rate = 'Enter the interest rate for this balance.';
      hasFieldError = true;
    } else if (!rate.blank && (rate.invalid || rate.value === null)) {
      entryErrors.rate = 'Enter a valid interest rate.';
      hasFieldError = true;
    } else if (!rate.blank && rate.value !== null && rate.value < 0) {
      entryErrors.rate = 'Interest rate cannot be negative.';
      hasFieldError = true;
    } else if (!rate.blank && rate.value !== null && rate.value > 1000) {
      entryErrors.rate = 'Interest rate is unrealistically high.';
      hasFieldError = true;
    }

    if (Object.keys(entryErrors).length > 0) {
      errors.entries![entry.id] = entryErrors;
      continue;
    }

    if (
      bal.value !== null &&
      bal.value > 0 &&
      rate.value !== null &&
      rate.value >= 0
    ) {
      complete.push({
        id: entry.id,
        balance: bal.value,
        rate: rate.value,
      });
    }
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  if (!hasAnyInput) {
    return { isValid: false, errors, result: null };
  }

  if (complete.length === 0) {
    errors.form =
      'Enter at least one positive balance to calculate the blended rate.';
    return { isValid: false, errors, result: null };
  }

  const math = calculateBlendedRate(complete);
  if (math === null) {
    errors.form =
      'Enter at least one positive balance to calculate the blended rate.';
    const status: BlendedRateStatus = 'zeroBalance';
    return {
      isValid: false,
      errors,
      result: null,
    };
  }

  const result: BlendedRateResult = {
    ...math,
    status: 'valid',
    interpretation: interpretBlendedRate(
      math.blendedRate,
      math.includedLoans,
      math.totalBalance,
      currency
    ),
    warningMessage:
      'Blended rate is a balance-weighted average of annual rates. Estimated interest assumes unchanged balances for one year; not an amortized payment schedule. Amounts share one currency label (no FX).',
    currency,
    formattedTotalBalance: formatBrMoney(math.totalBalance, currency),
    formattedBlendedRate: formatBrPercent(math.blendedRate),
    formattedAnnualInterest: formatBrMoney(
      math.totalAnnualInterest,
      currency
    ),
    formattedMonthlyInterest: formatBrMoney(
      math.estimatedMonthlyInterest,
      currency
    ),
  };

  // Clean empty entries map
  if (Object.keys(errors.entries!).length === 0) {
    delete errors.entries;
  }

  return { isValid: true, errors, result };
}
