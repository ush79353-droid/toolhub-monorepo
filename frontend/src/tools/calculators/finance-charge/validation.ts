import {
  buildDailyInterestRows,
  calculateFinanceCharge,
  convertTermToDays,
  formatFcMoney,
  formatFcPercent,
  formatFcRateDetail,
  interpretFinanceCharge,
} from './calculation';
import {
  MAX_BILLING_CYCLE_DAYS,
  MAX_TERM_DAYS,
  type FinanceChargeFieldErrors,
  type FinanceChargeInput,
  type FinanceChargeResult,
} from './types';

export interface FinanceChargeValidation {
  isValid: boolean;
  errors: FinanceChargeFieldErrors;
  result: FinanceChargeResult | null;
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

function isWholeNumber(value: number): boolean {
  return Number.isInteger(value);
}

export function validateFinanceChargeInput(
  input: FinanceChargeInput
): FinanceChargeValidation {
  const errors: FinanceChargeFieldErrors = {};
  const currency = input.currency;
  let hasFieldError = false;

  const balanceParsed = parseNumber(input.balance);
  const aprParsed = parseNumber(input.apr);

  if (balanceParsed.blank) {
    errors.balance = 'Enter a valid balance.';
    hasFieldError = true;
  } else if (balanceParsed.invalid || balanceParsed.value === null) {
    errors.balance = 'Enter a valid balance.';
    hasFieldError = true;
  } else if (balanceParsed.value < 0) {
    errors.balance = 'Balance cannot be negative.';
    hasFieldError = true;
  }

  if (aprParsed.blank) {
    errors.apr = 'Enter the annual percentage rate (APR).';
    hasFieldError = true;
  } else if (aprParsed.invalid || aprParsed.value === null) {
    errors.apr = 'Enter a valid APR.';
    hasFieldError = true;
  } else if (aprParsed.value < 0) {
    errors.apr = 'APR cannot be negative.';
    hasFieldError = true;
  } else if (aprParsed.value > 1000) {
    errors.apr = 'APR is unrealistically high.';
    hasFieldError = true;
  }

  let days: number | null = null;
  let termLength: number | null = null;

  if (input.method === 'billing-cycle') {
    const daysParsed = parseNumber(input.billingCycleDays);
    if (daysParsed.blank) {
      errors.billingCycleDays = 'Enter a billing cycle length in days.';
      hasFieldError = true;
    } else if (daysParsed.invalid || daysParsed.value === null) {
      errors.billingCycleDays = 'Enter a valid billing cycle length.';
      hasFieldError = true;
    } else if (daysParsed.value <= 0) {
      errors.billingCycleDays =
        'Billing cycle length must be greater than zero.';
      hasFieldError = true;
    } else if (!isWholeNumber(daysParsed.value)) {
      errors.billingCycleDays =
        'Billing cycle length must be a whole number of days.';
      hasFieldError = true;
    } else if (daysParsed.value > MAX_BILLING_CYCLE_DAYS) {
      errors.billingCycleDays = `Billing cycle length must be ${MAX_BILLING_CYCLE_DAYS} days or fewer.`;
      hasFieldError = true;
    } else {
      days = daysParsed.value;
    }
  } else {
    const termParsed = parseNumber(input.termLength);
    if (termParsed.blank) {
      errors.termLength = 'Enter a valid term length.';
      hasFieldError = true;
    } else if (termParsed.invalid || termParsed.value === null) {
      errors.termLength = 'Enter a valid term length.';
      hasFieldError = true;
    } else if (termParsed.value <= 0) {
      errors.termLength = 'Term length must be greater than zero.';
      hasFieldError = true;
    } else {
      try {
        const converted = convertTermToDays(termParsed.value, input.termUnit);
        if (converted > MAX_TERM_DAYS) {
          errors.termLength = 'Term length is too long for this estimator.';
          hasFieldError = true;
        } else {
          days = converted;
          termLength = termParsed.value;
        }
      } catch {
        errors.termLength = 'Enter a valid term length.';
        hasFieldError = true;
      }
    }
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  if (
    balanceParsed.value === null ||
    aprParsed.value === null ||
    days === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateFinanceCharge({
    balance: balanceParsed.value,
    apr: aprParsed.value,
    days,
  });

  if (math === null) {
    errors.form = 'Unable to calculate finance charge with the entered values.';
    return { isValid: false, errors, result: null };
  }

  const breakdown = input.showDailyBreakdown
    ? buildDailyInterestRows(
        balanceParsed.value,
        math.dailyFinanceCharge,
        math.calculationDays,
        math.financeCharge
      )
    : { rows: null, truncated: false };

  const result: FinanceChargeResult = {
    ...math,
    method: input.method,
    termUnit: input.method === 'given-term' ? input.termUnit : null,
    termLength: input.method === 'given-term' ? termLength : null,
    dailyRows: breakdown.rows,
    dailyRowsTruncated: breakdown.truncated,
    status: 'valid',
    interpretation: interpretFinanceCharge(
      math.financeCharge,
      math.calculationDays,
      currency
    ),
    warningMessage:
      'Simple constant-balance estimate on a 365-day year. Month terms use 365/12 days each. Actual issuer charges may use average daily balance, grace periods, compounding, fees, or other terms. Amounts share one currency label (no FX).',
    currency,
    formattedBalance: formatFcMoney(balanceParsed.value, currency),
    formattedDailyCharge: formatFcRateDetail(math.dailyFinanceCharge),
    formattedFinanceCharge: formatFcMoney(math.financeCharge, currency),
    formattedTotal: formatFcMoney(math.totalBalanceWithCharge, currency),
    formattedPeriodRate: formatFcPercent(math.periodInterestRate, 4),
    formattedDailyRatePercent: formatFcPercent(
      math.dailyPeriodicRatePercent,
      6
    ),
  };

  return { isValid: true, errors, result };
}
