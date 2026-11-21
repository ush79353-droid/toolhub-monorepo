import {
  calculateSwp,
  parseIsoDate,
  type SwpCanonicalInput,
} from './calculation';
import {
  SWP_FREQUENCY_OPTIONS,
  SWP_MODE_OPTIONS,
  type SwpFieldErrors,
  type SwpFrequency,
  type SwpInput,
  type SwpResult,
  type SwpSolveMode,
} from './types';

export interface SwpValidation {
  isValid: boolean;
  errors: SwpFieldErrors;
  result: SwpResult | null;
}

function parseNumber(
  raw: string
): { value: number | null; blank: boolean; invalid: boolean } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned) || !/^-?\d+(\.\d+)?$/.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

function isMode(v: string): v is SwpSolveMode {
  return SWP_MODE_OPTIONS.some((o) => o.value === v);
}

function isFreq(v: string): v is SwpFrequency {
  return SWP_FREQUENCY_OPTIONS.some((o) => o.value === v);
}

export function validateSwpInput(input: SwpInput): SwpValidation {
  const errors: SwpFieldErrors = {};
  if (!isMode(input.mode)) errors.mode = 'Select what you would like to know.';
  if (!isFreq(input.frequency)) errors.frequency = 'Select a frequency.';

  const needsWithdrawal = input.mode !== 'withdrawal';
  const needsInitial =
    input.mode === 'withdrawal' ||
    input.mode === 'duration' ||
    input.mode === 'final' ||
    input.mode === 'rate';
  const needsDuration = input.mode !== 'duration';
  const needsReturn = input.mode !== 'rate';

  let withdrawalAmount = 0;
  let initialInvestment = 0;
  let durationYears = 0;
  let annualReturn = 0;

  if (needsWithdrawal) {
    const w = parseNumber(input.withdrawalAmount);
    if (w.blank || w.invalid || w.value == null) {
      errors.withdrawalAmount = 'Enter a withdrawal amount.';
    } else if (!(w.value > 0) && input.mode !== 'final') {
      errors.withdrawalAmount = 'Withdrawal must be greater than zero.';
    } else {
      withdrawalAmount = w.value;
    }
  }

  if (needsInitial) {
    const p = parseNumber(input.initialInvestment);
    if (p.blank || p.invalid || p.value == null) {
      errors.initialInvestment = 'Enter an initial investment.';
    } else {
      initialInvestment = p.value;
    }
  }

  if (needsDuration) {
    const d = parseNumber(input.durationValue);
    if (d.blank || d.invalid || d.value == null || !(d.value > 0)) {
      errors.durationValue = 'Enter a positive duration.';
    } else {
      durationYears =
        input.durationUnit === 'mos' ? d.value / 12 : d.value;
      if (durationYears > 120) {
        errors.durationValue = 'Duration must be 120 years or less.';
      }
    }
  }

  if (needsReturn) {
    const r = parseNumber(input.annualReturn);
    if (r.blank || r.invalid || r.value == null) {
      errors.annualReturn = 'Enter an expected return.';
    } else if (r.value > 100) {
      errors.annualReturn = 'Return must be 100% or less.';
    } else {
      annualReturn = r.value;
    }
  }

  const infl = parseNumber(input.inflationRate);
  if (infl.blank || infl.invalid || infl.value == null) {
    errors.inflationRate = 'Enter an inflation rate.';
  } else if (infl.value > 100) {
    errors.inflationRate = 'Inflation must be 100% or less.';
  }

  const endBalRaw = input.endBalance.trim() === '' ? '0' : input.endBalance;
  const endBal = parseNumber(endBalRaw);
  if (endBal.invalid || endBal.value == null) {
    errors.endBalance = 'Enter a nonnegative ending balance.';
  }

  const date = parseIsoDate(input.firstWithdrawalDate);
  if (!date) {
    errors.firstWithdrawalDate = 'Enter a valid first withdrawal date.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const canonical: SwpCanonicalInput = {
    mode: input.mode,
    currency: input.currency,
    withdrawalAmount,
    initialInvestment,
    frequency: input.frequency,
    durationYears,
    annualReturnPercent: annualReturn,
    inflationPercent: infl.value ?? 0,
    firstWithdrawalDate: date!,
    endBalance: endBal.value ?? 0,
  };

  const result = calculateSwp(canonical);
  if (!result) {
    errors.form = 'Unable to solve with these inputs.';
    return { isValid: false, errors, result: null };
  }
  return { isValid: true, errors: {}, result };
}
