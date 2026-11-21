import { calculateRothIra } from './calculation';
import { FILING_OPTIONS, type RothFilingStatus } from './types';
import type {
  RothIraFieldErrors,
  RothIraInput,
  RothIraResult,
} from './types';

export interface RothIraValidation {
  isValid: boolean;
  errors: RothIraFieldErrors;
  result: RothIraResult | null;
}

function parseNumber(
  raw: string,
  opts?: { allowZero?: boolean }
): { value: number | null; blank: boolean; invalid: boolean } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) {
    return { value: null, blank: false, invalid: true };
  }
  if (!opts?.allowZero && value === 0 && opts?.allowZero === false) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

function isFiling(v: string): v is RothFilingStatus {
  return FILING_OPTIONS.some((o) => o.value === v);
}

export function validateRothIraInput(input: RothIraInput): RothIraValidation {
  const errors: RothIraFieldErrors = {};

  if (!isFiling(input.filingStatus)) {
    errors.filingStatus = 'Select a filing status.';
  }

  const magi = parseNumber(input.magi, { allowZero: true });
  if (magi.blank || magi.invalid || magi.value == null) {
    errors.magi = 'Enter a nonnegative MAGI.';
  }

  const age = parseNumber(input.currentAge, { allowZero: true });
  if (age.blank || age.invalid || age.value == null) {
    errors.currentAge = 'Enter your current age.';
  } else if (age.value > 120) {
    errors.currentAge = 'Age must be 120 or less.';
  }

  const retire = parseNumber(input.retirementAge, { allowZero: true });
  if (retire.blank || retire.invalid || retire.value == null) {
    errors.retirementAge = 'Enter retirement age.';
  } else if (retire.value > 120) {
    errors.retirementAge = 'Retirement age must be 120 or less.';
  } else if (age.value != null && !age.invalid && retire.value < age.value) {
    errors.retirementAge = 'Retirement age must be ≥ current age.';
  }

  const tax = parseNumber(input.incomeTaxRate, { allowZero: true });
  if (tax.blank || tax.invalid || tax.value == null) {
    errors.incomeTaxRate = 'Enter an income tax rate.';
  } else if (tax.value >= 100) {
    errors.incomeTaxRate = 'Tax rate must be below 100%.';
  }

  const ret = parseNumber(input.annualReturn, { allowZero: true });
  if (ret.blank || ret.invalid || ret.value == null) {
    errors.annualReturn = 'Enter an annual return rate.';
  } else if (ret.value > 100) {
    errors.annualReturn = 'Return must be 100% or less.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateRothIra({
    currency: input.currency,
    magi: magi.value!,
    currentAge: age.value!,
    retirementAge: retire.value!,
    filingStatus: input.filingStatus,
    incomeTaxRatePercent: tax.value!,
    annualReturnPercent: ret.value!,
  });

  if (!result) {
    errors.form = 'Unable to calculate with these inputs.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
