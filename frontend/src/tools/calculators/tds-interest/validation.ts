import {
  calculateLateDeductionInterest,
  calculateLateFilingFee,
  calculateLatePaymentInterest,
  formatInrAmount,
  formatIsoDateDisplay,
  parseIsoDate,
} from './calculation';
import type {
  TdsInterestFieldErrors,
  TdsInterestInput,
  TdsInterestResult,
  TdsQuarter,
} from './types';

export interface TdsInterestValidation {
  isValid: boolean;
  errors: TdsInterestFieldErrors;
  result: TdsInterestResult | null;
}

function parseAmount(raw: string): {
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

function requireIso(
  raw: string,
  blankMessage: string,
  invalidMessage: string
): { value: string | null; error?: string } {
  const trimmed = raw.trim();
  if (trimmed === '') return { value: null, error: blankMessage };
  if (!parseIsoDate(trimmed)) return { value: null, error: invalidMessage };
  return { value: trimmed };
}

export function validateTdsInterestInput(
  input: TdsInterestInput
): TdsInterestValidation {
  const errors: TdsInterestFieldErrors = {};
  const tax = parseAmount(input.taxAmount);

  if (tax.blank) {
    errors.taxAmount = 'Enter the TDS / tax amount.';
  } else if (tax.invalid || tax.value === null) {
    errors.taxAmount = 'Enter a valid tax amount.';
  } else if (!(tax.value > 0)) {
    errors.taxAmount = 'Tax amount must be greater than zero.';
  }

  if (input.mode === 'late_deduction') {
    const txn = requireIso(
      input.transactionDate,
      'Enter the transaction / deductible date.',
      'Enter a valid transaction date.'
    );
    const ded = requireIso(
      input.deductionDate,
      'Enter the actual deduction date.',
      'Enter a valid deduction date.'
    );
    if (txn.error) errors.transactionDate = txn.error;
    if (ded.error) errors.deductionDate = ded.error;

    if (Object.keys(errors).length > 0) {
      return { isValid: false, errors, result: null };
    }

    const computed = calculateLateDeductionInterest({
      taxAmount: tax.value!,
      transactionDate: txn.value!,
      deductionDate: ded.value!,
    });
    if (computed === null) {
      errors.form =
        'Deduction date cannot be before the transaction date. Check both dates.';
      return { isValid: false, errors, result: null };
    }

    const result: TdsInterestResult = {
      kind: 'late_deduction',
      taxAmount: tax.value!,
      amount: computed.interest,
      formattedAmount: formatInrAmount(computed.interest),
      months: computed.months,
      message:
        computed.months === 0
          ? 'No late-deduction interest; TDS was deducted on the transaction date.'
          : `Interest on late deduction (s.201(1A)): ₹${formatInrAmount(computed.interest)} for ${computed.months} month${computed.months === 1 ? '' : 's'} at 1% per month or part thereof.`,
    };
    return { isValid: true, errors: {}, result };
  }

  if (input.mode === 'late_payment') {
    const ded = requireIso(
      input.deductionDate,
      'Enter the TDS deduction date.',
      'Enter a valid deduction date.'
    );
    const pay = requireIso(
      input.paymentDate,
      'Enter the TDS payment / deposit date.',
      'Enter a valid payment date.'
    );
    if (ded.error) errors.deductionDate = ded.error;
    if (pay.error) errors.paymentDate = pay.error;

    if (Object.keys(errors).length > 0) {
      return { isValid: false, errors, result: null };
    }

    const computed = calculateLatePaymentInterest({
      taxAmount: tax.value!,
      deductionDate: ded.value!,
      paymentDate: pay.value!,
    });
    if (computed === null) {
      errors.form =
        'Payment date cannot be before the deduction date. Check both dates.';
      return { isValid: false, errors, result: null };
    }

    const dueLabel = formatIsoDateDisplay(computed.dueDate);
    if (computed.months === 0) {
      const result: TdsInterestResult = {
        kind: 'late_payment',
        taxAmount: tax.value!,
        amount: 0,
        formattedAmount: formatInrAmount(0),
        months: 0,
        dueDate: computed.dueDate,
        formattedDueDate: dueLabel,
        message: `No late-payment interest; deposit is on or before the due date (${dueLabel}). Non-government Rule 30 due dates are used (March → 30 April).`,
      };
      return { isValid: true, errors: {}, result };
    }

    const result: TdsInterestResult = {
      kind: 'late_payment',
      taxAmount: tax.value!,
      amount: computed.interest,
      formattedAmount: formatInrAmount(computed.interest),
      months: computed.months,
      dueDate: computed.dueDate,
      formattedDueDate: dueLabel,
      message: `Interest on late payment (s.201(1A)): ₹${formatInrAmount(computed.interest)} for ${computed.months} month${computed.months === 1 ? '' : 's'} at 1.5% per month or part thereof (deposit due ${dueLabel}).`,
    };
    return { isValid: true, errors: {}, result };
  }

  // late_filing
  const yearRaw = input.filingYear.trim();
  const yearNum = Number(yearRaw);
  if (yearRaw === '' || !Number.isInteger(yearNum)) {
    errors.filingYear = 'Select a valid return filing year.';
  } else if (yearNum < 2012 || yearNum > 2100) {
    errors.filingYear = 'Filing year must be between 2012 and 2100.';
  }

  const filing = requireIso(
    input.filingDate,
    'Enter the return filing date.',
    'Enter a valid filing date.'
  );
  if (filing.error) errors.filingDate = filing.error;

  const quarter = input.quarter as TdsQuarter;
  if (![1, 2, 3, 4].includes(quarter)) {
    errors.form = 'Select a valid quarter.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateLateFilingFee({
    taxAmount: tax.value!,
    quarter,
    fyStartYear: yearNum,
    filingDate: filing.value!,
  });
  if (computed === null) {
    errors.form = 'Unable to resolve the quarterly due date for these inputs.';
    return { isValid: false, errors, result: null };
  }

  const dueLabel = formatIsoDateDisplay(computed.dueDate);

  if (computed.withinDeadline) {
    const result: TdsInterestResult = {
      kind: 'within_deadline',
      taxAmount: tax.value!,
      amount: 0,
      formattedAmount: formatInrAmount(0),
      days: 0,
      dueDate: computed.dueDate,
      formattedDueDate: dueLabel,
      message: `You are still within the deadline. You must file the TDS by ${dueLabel} to avoid fees.`,
    };
    return { isValid: true, errors: {}, result };
  }

  const result: TdsInterestResult = {
    kind: 'late_filing_fee',
    taxAmount: tax.value!,
    amount: computed.fee,
    formattedAmount: formatInrAmount(computed.fee),
    days: computed.days,
    dueDate: computed.dueDate,
    formattedDueDate: dueLabel,
    message: `Late filing fee (s.234E): ₹${formatInrAmount(computed.fee)} for ${computed.days} day${computed.days === 1 ? '' : 's'} after ${dueLabel} (₹200/day, capped at the TDS amount).`,
  };
  return { isValid: true, errors: {}, result };
}
